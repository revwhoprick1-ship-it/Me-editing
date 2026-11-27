"""Track the characters in every test-edit shot and build a smooth virtual camera.
usage: python3 tools/testedit/track.py   (after build_selects.py; needs models/vittrack.onnx)

The ViT tracker (OpenCV) follows each subject forward and backward from its seed frame.
Raw tracks are smoothed zero-phase (no lag), then a camera is computed per frame:
  - zoom: fits all 'frame' subjects with margin (fixed per shot so it never breathes)
  - centre: follows the subjects, smoothed harder and speed-limited (no jitter, no whip)
  - clamped so the picture never shows an empty edge
Writes cam + subject tracks into src/testedit/edl.json."""
import json, cv2, numpy as np

# seed boxes (x, y, w, h) in 1280x720 source px; optional 5th value = seed frame within the shot
S = {
    'h1': dict(subj={'frank': (470, 60, 380, 580), 'face': (560, 470, 220, 170)}, frame=['face'], zmax=1.15),
    'hf': dict(subj={'frank': (360, 0, 240, 210)}, frame=['frank'], zmax=1.05),
    's1': dict(subj={'bunny': (300, 170, 330, 420), 'face': (430, 170, 120, 110)}, frame=['bunny'], zmax=1.15),
    's2': dict(subj={'fly': (170, 140, 200, 180), 'face': (580, 180, 140, 140)}, frame=['fly', 'face'], zmax=1.1),
    's3': dict(subj={'frank': (150, 260, 410, 300), 'rinky': (420, 40, 360, 200), 'chin': (660, 200, 300, 400)}, frame=['frank', 'rinky', 'chin'], zmax=1.0),
    'e1': dict(subj={'frank': (330, 240, 220, 160), 'rinky': (560, 120, 180, 180), 'chin': (760, 280, 240, 180)}, frame=['frank', 'rinky', 'chin'], zmax=1.0),
    'e2': dict(subj={'face': (440, 180, 280, 280)}, frame=['face'], zmax=1.1),
    'e3': dict(subj={'fly': (740, 40, 520, 680)}, frame=['fly'], zmax=0.9, fixed=(300, 0, 1000, 720)),
    'e4': dict(subj={'face': (400, 150, 450, 400)}, frame=['face'], zmax=1.3),
    'e5': dict(subj={'rinky': (440, 80, 250, 520), 'fly': (260, 180, 170, 260), 'frank': (840, 120, 300, 300)}, frame=['fly', 'rinky', 'frank'], zmax=1.0),
    'e6': dict(subj={'face': (380, 150, 300, 300)}, frame=['face'], zmax=1.1),
    'm1': dict(subj={'hands': (560, 0, 400, 600), 'face': (380, 0, 280, 200)}, frame=['hands', 'face'], zmax=1.0, zmin=0.9),
    'm2': dict(subj={'face': (500, 140, 240, 220), 'knife': (250, 350, 500, 350)}, frame=['face', 'knife'], zmax=1.0),
    'm3': dict(subj={'face': (480, 90, 220, 200)}, frame=['face'], zmax=1.0),
    'm4': dict(subj={'eyes': (300, 200, 640, 180)}, frame=['eyes'], zmax=1.0, zmin=1.0),
    't1': dict(subj={'bow': (380, 100, 700, 620)}, frame=['bow'], zmax=1.0, zmin=1.0),
    't2': dict(subj={'eyes': (360, 180, 500, 140)}, frame=['eyes'], zmax=1.0),
    't3': dict(subj={'log': (320, 20, 380, 620)}, frame=['log'], zmax=1.0),
    'c1': dict(subj={'frank': (400, 150, 500, 370), 'face': (540, 150, 150, 120)}, frame=['frank'], zmax=1.1),
    'c2': dict(subj={'face': (480, 140, 280, 240)}, frame=['face'], zmax=1.2),
    'c3': dict(subj={'frank': (380, 170, 500, 580), 'face': (500, 170, 160, 160)}, frame=['frank'], zmax=1.0),
    'c4': dict(subj={}, frame=[], zmax=1.0, fixed=(370, 0, 540, 720)),
    'c5': dict(subj={'frank': (330, 0, 230, 140)}, frame=['frank'], zmax=1.0),
    'c6': dict(subj={'face': (480, 330, 140, 150), 'bunny': (740, 40, 320, 320)}, frame=['face', 'bunny'], zmax=1.0),
    'c7': dict(subj={'frank': (100, 140, 340, 240), 'bunny': (650, 30, 280, 300)}, frame=['frank', 'bunny'], zmax=1.0),
    'f1': dict(subj={'group': (240, 60, 560, 360)}, frame=['group'], zmax=1.0),
    'f2': dict(subj={'frank': (480, 230, 360, 420), 'face': (600, 240, 120, 120)}, frame=['frank'], zmax=1.1),
}
ZMIN, MARGIN = 0.8, 1.18

def gsmooth(a, sigma):
    a = np.asarray(a, float)
    if sigma <= 0 or len(a) < 3: return a
    r = int(3 * sigma); k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
    p = np.pad(a, ((r, r),) + ((0, 0),) * (a.ndim - 1), mode='edge')
    return np.stack([np.convolve(p[:, i], k, 'valid') for i in range(a.shape[1])], 1) if a.ndim > 1 else np.convolve(p, k, 'valid')

def track(frames, box, seed):
    out = [None] * len(frames); out[seed] = list(box)
    for direction in (1, -1):
        p = cv2.TrackerVit_Params(); p.net = 'models/vittrack.onnx'; t = cv2.TrackerVit_create(p)
        t.init(frames[seed], tuple(int(v) for v in box)); last = list(box)
        idx = range(seed + 1, len(frames)) if direction == 1 else range(seed - 1, -1, -1)
        for i in idx:
            ok, b = t.update(frames[i]); sc = t.getTrackingScore()
            if ok and sc > 0.25:
                # keep size stable: blend size toward the seed size (subjects don't change size much within a shot)
                cx, cy = b[0] + b[2] / 2, b[1] + b[3] / 2; w = 0.5 * b[2] + 0.5 * last[2]; h = 0.5 * b[3] + 0.5 * last[3]
                last = [cx - w / 2, cy - h / 2, w, h]
            out[i] = list(last)
    a = np.array(out, float)
    c = np.c_[a[:, 0] + a[:, 2] / 2, a[:, 1] + a[:, 3] / 2, a[:, 2], a[:, 3]]
    return gsmooth(c, 3.0)  # [cx, cy, w, h] per frame, smoothed without lag

def speed_limit(x, vmax):
    y = x.copy()
    for i in range(1, len(y)): y[i] = y[i - 1] + np.clip(y[i] - y[i - 1], -vmax, vmax)
    for i in range(len(y) - 2, -1, -1): y[i] = y[i + 1] + np.clip(y[i] - y[i + 1], -vmax, vmax)
    return y

edl = json.load(open('src/testedit/edl.json')); cap = cv2.VideoCapture('public/test/selects.mp4')
for s in edl['shots']:
    spec = S[s['id']]; n = s['dur']
    cap.set(cv2.CAP_PROP_POS_FRAMES, s['sel']); frames = [cap.read()[1] for _ in range(n)]
    tracks = {k: track(frames, v[:4], v[4] if len(v) > 4 else 0) for k, v in spec['subj'].items()}
    if 'fixed' in spec:
        x, y, w, h = spec['fixed']; U = np.tile([x, y, x + w, y + h], (n, 1)).astype(float)
    else:
        boxes = [tracks[k] for k in spec['frame']]
        U = np.stack([np.min([b[:, 0] - b[:, 2] / 2 for b in boxes], 0), np.min([b[:, 1] - b[:, 3] / 2 for b in boxes], 0),
                      np.max([b[:, 0] + b[:, 2] / 2 for b in boxes], 0), np.max([b[:, 1] + b[:, 3] / 2 for b in boxes], 0)], 1)
    uw = U[:, 2] - U[:, 0]; uh = U[:, 3] - U[:, 1]
    # visible source area at zoom z: 540/z wide, 720/z tall
    zfit = np.minimum(540 / (MARGIN * uw), 720 / (MARGIN * uh))
    z = float(np.clip(min(spec['zmax'], np.percentile(zfit, 25)), spec.get('zmin', ZMIN), 2.2))
    cx = (U[:, 0] + U[:, 2]) / 2
    # headroom: put the top of the subjects ~12% below the top of the visible area when zoomed in
    vis_h = 720 / z
    # centre the subjects; if they are taller than ~3/4 of the view, keep their top (heads) with 12% headroom instead
    cy = np.where(uh < 0.76 * vis_h, (U[:, 1] + U[:, 3]) / 2, U[:, 1] + 0.38 * vis_h) if z > 1 else np.full(n, 360.0)
    cx = speed_limit(gsmooth(cx, 8.0), 9.0); cy = speed_limit(gsmooth(cy, 8.0), 7.0)
    vw, vh = 540 / z, 720 / z
    if vw <= 1280: cx = np.clip(cx, vw / 2, 1280 - vw / 2)
    else: cx[:] = 640
    cy = np.clip(cy, vh / 2, 720 - vh / 2) if vh <= 720 else np.full(n, 360.0)
    s['cam'] = [[round(a, 1), round(b, 1)] for a, b in zip(cx, cy)]; s['z'] = round(z, 3)
    s['track'] = {k: [[round(v, 1) for v in row] for row in t] for k, t in tracks.items()}
    print(f"{s['id']:3} z={z:.2f} cx {cx.min():.0f}-{cx.max():.0f} cy {cy.min():.0f}-{cy.max():.0f} subjects={list(tracks)}")
json.dump(edl, open('src/testedit/edl.json', 'w'))
