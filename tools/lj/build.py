"""Love & Justice campaign clips: cut, analyse and lay out 5 vertical clips for Remotion (src/lj/LJClip.tsx).
usage: python3 tools/lj/build.py [clip_id ...]
needs: footage/lj/ep.mp4, footage/lj/ep.words.json (tools/transcribe.py), models/yunet.onnx

Per clip: flash-forward hook + main scene -> public/lj/<id>.mp4 (30 fps, 1080p, original audio)
Per shot the layout is chosen from the faces actually on screen:
  split : the show's own side-by-side split screen (gold divider) -> stacked top/bottom, each panel follows its face
  full  : one main subject (or a tight group) -> full-bleed 9:16 crop that follows them smoothly
  wide  : people too far apart for 9:16 -> zoomed-out box that fits all of them, blurred fill around it
Writes src/lj/<id>.json with per-frame camera data, captions and beats."""
import json, os, re, subprocess, sys
import cv2, numpy as np

FPS = 30
SRC = 'footage/lj/ep.mp4'
CLIPS = [
    dict(id='c1', hook=(1046.25, 1048.95), main=(1022.45, 1061.30),
         title=[['HIS PHONE RANG'], ['MID-VERDICT', 'red'], ['📱']],
         beats=[(1038.75, 'sfx/vine-boom.mp3', None), (1046.30, 'sfx/record-scratch.mp3', None), (1053.85, 'sfx/meme-impact.mp3', 'yellow'), (1058.40, 'sfx/ding.mp3', None)],
         red=['SETTINGS', 'BABY', 'KNEW', 'RIGHT'], green=['VERDICT', 'JURY']),
    dict(id='c2', hook=(1094.40, 1097.90), main=(1072.50, 1111.10),
         title=[['SHE', 'yellow'], ['SNAPPED'], ['IN COURT', 'red'], ['😳']],
         beats=[(1075.60, 'sfx/meme-impact.mp3', 'red'), (1082.85, 'sfx/vine-boom.mp3', None), (1094.45, 'sfx/record-scratch.mp3', 'white'), (1103.74, 'sfx/meme-bonk.mp3', None)],
         red=['HATE', 'AFFAIR', 'COWORKER', 'BROTHER', "BROTHER'S", 'BIGGER'], green=[]),
    dict(id='c3', hook=(671.40, 674.10), main=(655.00, 689.95),
         title=[['WHERE DOES HE GO'], ['EVERY WEEK?', 'yellow'], ['🤔']],
         beats=[(658.60, 'sfx/vine-boom.mp3', None), (671.45, 'sfx/meme-bonk.mp3', None), (677.75, 'sfx/cinematic-suspense-riser.mp3', None), (683.20, 'sfx/meme-impact.mp3', 'yellow'), (688.05, 'sfx/record-scratch.mp3', None)],
         red=['EYES', 'SOCKETS', 'JAW', 'SKULL', 'LYING'], green=['DANCE', 'HIP', 'HOP']),
    dict(id='c4', hook=(741.55, 743.25), main=(697.70, 741.20),
         title=[['JUDGE MADE HIM'], ['PROVE IT', 'yellow'], ['💀']],
         beats=[(713.40, 'sfx/jorho-ting.mp3', None), (728.95, 'sfx/meme-bonk.mp3', 'red'), (734.20, 'sfx/vine-boom.mp3', None)],
         red=['AWFUL', 'CHEATING', 'SEIZURE'], green=['DANCE', 'LEARNING', 'HIP', 'HOP']),
    dict(id='c5', hook=(477.15, 479.35), main=(460.60, 487.95),
         title=[['HIS BROTHER'], ['SAID TOO MUCH', 'red'], ['💀']],
         beats=[(464.80, 'sfx/vine-boom.mp3', None), (473.85, 'sfx/record-scratch.mp3', None), (475.60, 'sfx/meme-bonk.mp3', 'yellow')],
         red=['GAY', 'BISEXUAL', 'ACCIDENT'], green=['GOOD']),
]
CENSOR = {'fucking': 'F**KING', 'fuck': 'F**K', 'motherfucker': 'MOTHERF**KER', 'dick': 'D**K', 'shit': 'SH*T', 'ass': 'A**', 'f***ing': 'F**KING', 'f***': 'F**K'}
VW_FULL = 1080 * 1080 / 1920  # source px visible across a full-bleed 9:16 frame (607.5)

def run(cmd): subprocess.run(cmd, check=True)

def cut_clip(c, out):
    (ha, hb), (ma, mb) = c['hook'], c['main']
    fc = (f"[0:v]trim={ha}:{hb},setpts=PTS-STARTPTS,fps={FPS}[hv];[0:a]atrim={ha}:{hb},asetpts=PTS-STARTPTS[ha];"
          f"[0:v]trim={ma}:{mb},setpts=PTS-STARTPTS,fps={FPS}[mv];[0:a]atrim={ma}:{mb},asetpts=PTS-STARTPTS[ma];"
          "[hv][ha][mv][ma]concat=n=2:v=1:a=1[v][a]")
    a0 = max(0, min(ha, ma) - 1); b0 = max(hb, mb) + 1  # seek near, then trim with absolute times
    fc = fc.replace(f'trim={ha}:{hb}', f'trim={ha - a0}:{hb - a0}').replace(f'trim={ma}:{mb}', f'trim={ma - a0}:{mb - a0}')
    run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a0), '-t', str(b0 - a0), '-i', SRC, '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
         '-c:v', 'libx264', '-preset', 'fast', '-crf', '15', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', out])

def gs(a, sigma):
    a = np.asarray(a, float)
    if len(a) < 3 or sigma <= 0: return a
    r = int(3 * sigma); k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2); k /= k.sum()
    return np.convolve(np.pad(a, r, mode='edge'), k, 'valid')

def speed_limit(x, v):
    y = np.array(x, float)
    for i in range(1, len(y)): y[i] = y[i - 1] + np.clip(y[i] - y[i - 1], -v, v)
    for i in range(len(y) - 2, -1, -1): y[i] = y[i + 1] + np.clip(y[i] - y[i + 1], -v, v)
    return y

def fill(vals):  # vals: list of float|None -> interpolate gaps, edge-hold
    v = np.array([np.nan if x is None else x for x in vals], float); idx = np.arange(len(v)); ok = ~np.isnan(v)
    if not ok.any(): return None
    return np.interp(idx, idx[ok], v[ok])

def analyse(path):
    det = cv2.FaceDetectorYN.create('models/yunet.onnx', '', (960, 540), 0.75, 0.3, 5000)
    cap = cv2.VideoCapture(path); faces, split, sig = [], [], []
    while True:
        ok, f = cap.read()
        if not ok: break
        small = cv2.resize(f, (960, 540)); _, d = det.detect(small)
        faces.append([] if d is None else [(float(x) * 2, float(y) * 2, float(w) * 2, float(h) * 2, float(s)) for x, y, w, h, *_, s in d])
        hsv = cv2.cvtColor(f[100:980, 940:975], cv2.COLOR_BGR2HSV); col = hsv.mean(0)
        gold = (col[:, 1] > 170) & (col[:, 2] > 120) & (col[:, 0] > 12) & (col[:, 0] < 32)
        split.append(int(gold.sum() >= 4))
        sig.append(cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), (64, 36)).astype(np.float32))
    # shot boundaries: big frame difference or split-state change
    cuts = [0]
    for i in range(1, len(sig)):
        if np.abs(sig[i] - sig[i - 1]).mean() > 28 or split[i] != split[i - 1]:
            if i - cuts[-1] >= 4: cuts.append(i)
            else: cuts[-1] = i
    return faces, split, cuts + [len(sig)]

def tracks_in(faces):
    """greedy link detections into tracks: list of dict(frame -> (cx, cy, w, h))"""
    tr = []
    for i, fs in enumerate(faces):
        for x, y, w, h, s in fs:
            cx, cy = x + w / 2, y + h / 2; best = None
            for t in tr:
                j = max(t); px, py, pw, ph = t[j]
                if i - j <= 8 and j != i and abs(cx - px) < max(60, pw * 0.8) and abs(cy - py) < max(60, ph * 0.8): best = t; break
            if best is not None: best[i] = (cx, cy, w, h)
            else: tr.append({i: (cx, cy, w, h)})
    return tr

def layout_shot(faces, split, a, b):
    n = b - a; F = faces[a:b]
    if sum(split[a:b]) > n / 2:
        panels = {}
        for name, (x0, x1) in {'top': (0, 950), 'bottom': (965, 1920)}.items():
            ys = []
            for fs in F:
                c = [f for f in fs if x0 <= f[0] + f[2] / 2 < x1]
                ys.append(max(c, key=lambda f: f[2])[1] + max(c, key=lambda f: f[2])[3] / 2 if c else None)
            y = fill(ys); y = np.full(n, 420.0) if y is None else y
            # panel shown 1080x960 from a 950 x 844 source window; face at 40% of the window height
            top = np.clip(gs(y, 6) - 0.40 * 844, 0, 1080 - 844); panels[name] = [round(v, 1) for v in speed_limit(top, 6)]
        return dict(mode='split', panels=panels)
    tr = [t for t in tracks_in(F) if len(t) >= max(3, 0.3 * n)]
    if tr:
        big = max(np.median([v[2] for v in t.values()]) for t in tr)
        tr = [t for t in tr if np.median([v[2] for v in t.values()]) >= 0.45 * big]
    if not tr:
        return dict(mode='wide', vw=1440.0, cx=[960.0] * n)
    L = fill([min((t[i][0] - t[i][2] * 0.9 for t in tr if i in t), default=None) for i in range(n)])
    R = fill([max((t[i][0] + t[i][2] * 0.9 for t in tr if i in t), default=None) for i in range(n)])
    span = float(np.percentile(R - L, 80))
    cx = speed_limit(gs((L + R) / 2, 7), 10)
    if span <= VW_FULL * 0.92:
        vw = VW_FULL; mode = 'full'
    else:
        vw = float(np.clip(span * 1.15, 900, 1920)); mode = 'wide'
    cx = np.clip(cx, vw / 2, 1920 - vw / 2)
    return dict(mode=mode, vw=round(vw, 1), cx=[round(v, 1) for v in cx])

def censor(w):
    core = re.sub(r'[^A-Za-z*\']', '', w).lower()
    out = CENSOR.get(core)
    if out is None:
        for k, v in CENSOR.items():
            if core.startswith(k) and len(core) > len(k) + 1 and k in ('fuck',): out = v + core[len(k):].upper(); break
    up = w.strip().upper()
    return re.sub(re.escape(core.upper()), out, up) if out else up

def captions(c, words, hook_frames):
    (ha, hb), (ma, mb) = c['hook'], c['main']
    mapped = []
    for s, e, w in words:
        if ha <= s < hb - 0.05: mapped.append(((s - ha), (min(e, hb) - ha), w, 0))
        if ma <= s < mb - 0.05: mapped.append((hook_frames / FPS + s - ma, hook_frames / FPS + min(e, mb) - ma, w, 1))
    mapped.sort()
    chunks, cur = [], []
    for i, (s, e, w, seg) in enumerate(mapped):
        if cur and (len(cur) >= 3 or s - cur[-1][1] > 0.45 or seg != cur[-1][3] or re.search(r'[.?!,]$', cur[-1][2].strip())):
            chunks.append(cur); cur = []
        cur.append((s, e, w, seg))
    if cur: chunks.append(cur)
    out = []
    for k, ch in enumerate(chunks):
        start = ch[0][0]; nxt = chunks[k + 1][0][0] if k + 1 < len(chunks) else 1e9
        end = min(nxt, ch[-1][1] + 0.7)
        seg_end = hook_frames / FPS if ch[0][3] == 0 else 1e9
        end = min(end, seg_end)
        ws = []
        for s, e, w, _ in ch:
            t = censor(w); key = re.sub(r'[^A-Z\']', '', t)
            col = 'red' if key in c['red'] else 'green' if key in c['green'] else None
            ws.append(dict(t=t.strip(' ,'), f=round(s * FPS), col=col))
        f0 = round(start * FPS); f1 = max(f0 + 8, round(end * FPS))
        if k + 1 < len(chunks): f1 = min(f1, round(chunks[k + 1][0][0] * FPS))
        if out and out[-1]['f1'] > f0: out[-1]['f1'] = f0
        out.append(dict(f0=f0, f1=max(f1, f0 + 1), words=ws))
    return out

def build(c):
    os.makedirs('public/lj', exist_ok=True); os.makedirs('src/lj', exist_ok=True)
    out = f"public/lj/{c['id']}.mp4"; cut_clip(c, out)
    n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip())
    hook_frames = round((c['hook'][1] - c['hook'][0]) * FPS)
    faces, split, cuts = analyse(out)
    if hook_frames not in cuts: cuts = sorted(set(cuts + [hook_frames]))
    shots = []
    for a, b in zip(cuts[:-1], cuts[1:]):
        L = layout_shot(faces, split, a, b); L.update(f0=a, n=b - a); shots.append(L)
    words = [w for s in json.load(open('footage/lj/ep.words.json')) for w in s['w']]
    (ha, hb), (ma, mb) = c['hook'], c['main']
    beats = []
    for t, sfx, flash in c['beats']:
        if ma <= t < mb: beats.append(dict(f=round((hook_frames / FPS + t - ma) * FPS), sfx=sfx, flash=flash))
    data = dict(id=c['id'], frames=n, hook=hook_frames, title=c['title'], shots=shots, captions=captions(c, words, hook_frames), beats=beats)
    json.dump(data, open(f"src/lj/{c['id']}.json", 'w'))
    print(c['id'], 'frames', n, 'shots', len(shots), {m: sum(s['n'] for s in shots if s['mode'] == m) for m in ('split', 'full', 'wide')})

if __name__ == '__main__':
    want = sys.argv[1:]
    for c in CLIPS:
        if not want or c['id'] in want: build(c)
