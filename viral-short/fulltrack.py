# full-vertical crops for Jo Koy edits: track Jo's head (skin blob vs blue stage) in public/g67_<id>.mp4, lazy-follow camera per shot,
# no zoom (constant 1.0, user rule), write per-frame crops [frame, cx, zoom, cy] into src/edits.gen.json and the face-focus spot into src/jo.cfg.json.
# usage: python3 fulltrack.py id1 id2 ...
import json, re, subprocess, sys, numpy as np, cv2
W, H, FPS, S = 480, 270, 15, 4.0; KF = 1920 / 1080
gen = json.load(open('src/edits.gen.json')); cfg = json.load(open('src/jo.cfg.json'))
def head(im):
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV); h, sa, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    m = (((h <= 22) | (h >= 170)) & (sa > 40) & (sa < 190) & (v > 70)).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)); n, _, st, cen = cv2.connectedComponentsWithStats(m); best = None
    for k in range(1, n):
        x, y, w, hh, a = st[k]
        if a < 12: continue
        sc = a * (1.6 if y + hh / 2 < H * 0.6 else 0.6) * (1.0 if hh >= w * 0.6 else 0.5)
        if best is None or sc > best[0]: best = (sc, cen[k][0] * S, y * S, a)
    return best[1:] if best else None
for eid in sys.argv[1:]:
    src = f'public/{cfg[eid]["src"]}'
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3); T = len(fr)
    det = [head(im) for im in fr]
    cuts = [float(x) for x in re.findall(r'pts_time:([0-9.]+)', subprocess.run(['ffmpeg', '-i', src, '-vf', "scale=320:-1,select='gt(scene,0.3)',showinfo", '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr)]
    bounds = sorted(set([0] + [round(c * FPS) for c in cuts] + [round(s['videoStartSec'] * FPS) for s in gen[eid]] + [T]))
    X = np.zeros(T); Z = np.ones(T); Y = np.full(T, 540.0); HY = np.zeros(T)
    for a, b in zip(bounds, bounds[1:]):
        if b <= a: continue
        d = [det[i] for i in range(a, b)]; ok = [q for q in d if q]
        if not ok: X[a:b] = 960; continue
        area = np.median([q[2] for q in ok]); wide = False; z = 1.0   # user rule: constant framing, never zoom between shots
        xs = np.array([q[0] if q else np.nan for q in d]); idx = np.arange(len(xs)); good = ~np.isnan(xs)
        xs = np.interp(idx, idx[good], xs[good]); xs = np.array([np.median(xs[max(0, i - 3):i + 4]) for i in range(len(xs))])
        hy = float(np.median([q[1] for q in ok])); half = 304 / z; dz = 0.2 * half; p = xs[0]; out = []
        for x in xs:
            if abs(x - p) > dz: p += 0.4 * (x - p - np.sign(x - p) * dz)
            out.append(min(1920 - half, max(half, p)))
        X[a:b] = out; Z[a:b] = z; Y[a:b] = (min(1080 - 540 / z, max(540 / z, hy + 225)) if wide else 540); HY[a:b] = hy
    for s in gen[eid]:
        f0, n = round(s['videoStartSec'] * 30), s['durationInFrames']; crops = []
        for k in range(n):
            i = min(T - 1, round((f0 + k) * FPS / 30)); c = [k, int(X[i]), float(Z[i]), int(Y[i])]
            if not crops or crops[-1][1:] != c[1:]: crops.append(c)
        s['crops'] = crops; s['cropX'] = crops[0][1]
    i0 = 0; q = det[i0] or next((q for q in det if q), None)
    if q:
        z, cy = Z[i0], Y[i0]; fx = 540 + (q[0] - X[i0]) * KF * z; fy = 960 + (q[1] + 60 - cy) * KF * z
        pass   # face-focus blur retired (user rule): nothing written
    print(eid, 'frames', T, 'shots', len(bounds) - 1, 'wide', round(float((Z > 1).mean()), 2), 'focus', cfg[eid].get('focus'))
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(cfg, open('src/jo.cfg.json', 'w'), indent=1)
