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
# Style per analysis/06_master_style_guide.md. All times are SOURCE seconds.
#   title   : hook title (typewriter on the freeze frame), [text, colour]
#   actions : *ACTION* captions (cyan italic)            (t, seconds, text)
#   washes  : colour wash + ding on reaction beats (>=5 s apart)   (t, colour)
#   punches : eased zoom ramp on a key line, held to the end of the shot   (t, scale)
#   shakes  : camera shake on the biggest hits           t
#   tension : music bed low-passed (muffled) between a and b, opens at b   (a, b)
CLIPS = [
    dict(id='c1', hook=(1046.25, 1048.95), main=(1022.45, 1061.30),
         title=[['*HIS PHONE RANG'], ['MID-VERDICT*', 'red']],
         actions=[(1029.0, 1.6, '*PHONE RINGING*'), (1034.4, 1.9, '*JUDGE TAKES HIS PHONE*'), (1049.4, 1.7, '*FACEPALM*')],
         washes=[(1038.78, 'yellow'), (1046.36, 'red'), (1053.86, 'yellow'), (1058.40, 'green')],
         punches=[(1038.78, 1.12), (1046.36, 1.15), (1056.40, 1.12), (1059.30, 1.10)], shakes=[1046.36], tension=[(1029.2, 1046.3)],
         red=['SETTINGS', 'BABY', 'KNEW'], green=['VERDICT', 'JURY', 'RIGHT']),
    dict(id='c2', hook=(1094.40, 1097.90), main=(1072.50, 1111.10),
         title=[['*SHE'], ['SNAPPED', 'red'], ['IN COURT*']],
         actions=[(1074.3, 1.6, '*LUNGES AT HIM*'), (1077.2, 1.7, '*BERT HOLDS HER BACK*'), (1100.4, 1.6, '*JURY LOSING IT*')],
         washes=[(1075.60, 'red'), (1082.85, 'yellow'), (1094.50, 'red'), (1103.74, 'magenta')],
         punches=[(1082.88, 1.12), (1094.50, 1.15), (1103.74, 1.15)], shakes=[1075.60, 1094.50], tension=[(1084.5, 1094.45)],
         red=['HATE', 'AFFAIR', 'COWORKER', "BROTHER'S", 'BIGGER'], green=[]),
    dict(id='c3', hook=(671.40, 674.10), main=(655.00, 689.95),
         title=[['*WHERE DOES HE GO'], ['EVERY WEEK?*', 'yellow']],
         actions=[(659.25, 1.8, '*BERT IS READY*'), (677.8, 1.8, '*HE FINALLY CRACKS*')],
         washes=[(658.60, 'red'), (671.45, 'red'), (683.20, 'green'), (688.40, 'red')],
         punches=[(659.25, 1.12), (671.45, 1.12), (683.20, 1.15), (688.10, 1.10)], shakes=[671.45], tension=[(676.7, 683.2)],
         red=['EYES', 'SOCKETS', 'JAW', 'SKULL', 'LYING'], green=['DANCE']),
    dict(id='c4', hook=(741.55, 743.25), main=(697.70, 741.20),
         title=[['*JUDGE MADE HIM'], ['PROVE IT*', 'yellow']],
         actions=[(700.0, 1.8, '*HIP HOP EXPERT STANDS*'), (713.5, 2.8, '*DANCING*'), (717.3, 1.6, "*BERT CAN'T WATCH*"), (721.8, 2.6, '*STILL DANCING*'), (726.3, 1.4, '*JUROR IN PAIN*')],
         washes=[(713.40, 'cyan'), (728.95, 'red'), (734.20, 'magenta')],
         punches=[(705.20, 1.10), (729.00, 1.15), (734.20, 1.12), (739.80, 1.10)], shakes=[729.0], tension=[(707.4, 713.4)],
         red=['AWFUL', 'SEIZURE'], green=['DANCE', 'LEARNING'], magenta=['CHEATING']),
    dict(id='c5', hook=(477.15, 479.35), main=(460.60, 487.95),
         title=[['*HIS BROTHER'], ['SAID TOO MUCH*', 'red']],
         actions=[(483.1, 1.8, '*WIFE HEARING THIS*')],
         washes=[(464.80, 'yellow'), (473.90, 'magenta'), (479.50, 'yellow'), (485.70, 'red')],
         punches=[(465.00, 1.12), (474.00, 1.15), (478.10, 1.12), (486.30, 1.10)], shakes=[473.9], tension=[(470.5, 473.9)],
         red=['GAY', 'BISEXUAL'], green=['GOOD'], magenta=['ACCIDENT']),
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
        L = dict(mode='split', panels=panels)
        # main face = bigger of the two panel faces, in output px
        face = []
        for i, fs in enumerate(F):
            best = None
            for name, (x0, x1), y0 in (('top', (0, 950), 0), ('bottom', (965, 1920), 960)):
                c = [f for f in fs if x0 <= f[0] + f[2] / 2 < x1]
                if c:
                    f = max(c, key=lambda f: f[2]); k = 1080 / 950
                    o = ((f[0] + f[2] / 2 - x0) * k, y0 + (f[1] + f[3] / 2 - panels[name][i]) * k, f[2] * k, f[3] * k)
                    if best is None or o[2] > best[2]: best = o
            face.append(best)
        L['face'] = smooth_boxes(face, n)
        return L
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
    k = 1080 / vw; top = 0 if mode == 'full' else 760 - 1080 * k / 2
    main = max(tr, key=lambda t: np.median([v[2] for v in t.values()]) * len(t))
    face = [((main[i][0] - (cx[i] - vw / 2)) * k, top + main[i][1] * k, main[i][2] * k, main[i][3] * k) if i in main else None for i in range(n)]
    return dict(mode=mode, vw=round(vw, 1), cx=[round(v, 1) for v in cx], face=smooth_boxes(face, n))

def smooth_boxes(boxes, n):
    cols = [fill([None if b is None else b[j] for b in boxes]) for j in range(4)]
    if cols[0] is None: return None
    return [[round(v, 1) for v in row] for row in zip(*[gs(c, 3) for c in cols])]

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
            col = 'red' if key in c['red'] else 'green' if key in c['green'] else 'magenta' if key in c.get('magenta', []) else None
            ws.append(dict(t=t.strip(' ,'), f=round(s * FPS), col=col))
        if not any(x['col'] for x in ws) and ws[-1]['t'].endswith('?'): ws[-1]['col'] = 'yellow'
        f0 = round(start * FPS); f1 = max(f0 + 8, round(end * FPS))
        if k + 1 < len(chunks): f1 = min(f1, round(chunks[k + 1][0][0] * FPS))
        if out and out[-1]['f1'] > f0: out[-1]['f1'] = f0
        out.append(dict(f0=f0, f1=max(f1, f0 + 1), words=ws))
    return [o for o in out if o['f1'] > o['f0']]

def build(c):
    os.makedirs('public/lj', exist_ok=True); os.makedirs('src/lj', exist_ok=True)
    out = f"public/lj/{c['id']}.mp4"
    if not os.path.exists(out): cut_clip(c, out)
    n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip())
    hook_frames = round((c['hook'][1] - c['hook'][0]) * FPS)
    faces, split, cuts = analyse(out)
    if hook_frames not in cuts: cuts = sorted(set(cuts + [hook_frames]))
    shots = []
    for a, b in zip(cuts[:-1], cuts[1:]):
        L = layout_shot(faces, split, a, b); L.update(f0=a, n=b - a); shots.append(L)
    words = [w for s in json.load(open('footage/lj/ep.words.json')) for w in s['w']]
    (ha, hb), (ma, mb) = c['hook'], c['main']
    vf = lambda t: round((hook_frames / FPS + t - ma) * FPS)  # source seconds (main part) -> video frame
    style = dict(
        actions=[dict(f=vf(t), n=round(d * FPS), text=x) for t, d, x in c['actions']],
        washes=[dict(f=vf(t), color=col) for t, col in c['washes']],
        punches=[dict(f=vf(t), scale=z) for t, z in c['punches']],
        shakes=[vf(t) for t in c['shakes']],
        tension=[[vf(a), vf(b)] for a, b in c['tension']],
    )
    data = dict(id=c['id'], frames=n, hook=hook_frames, title=c['title'], shots=shots, captions=captions(c, words, hook_frames), **style)
    json.dump(data, open(f"src/lj/{c['id']}.json", 'w'))
    print(c['id'], 'frames', n, 'shots', len(shots), {m: sum(s['n'] for s in shots if s['mode'] == m) for m in ('split', 'full', 'wide')})

if __name__ == '__main__':
    want = sys.argv[1:]
    for c in CLIPS:
        if not want or c['id'] in want: build(c)
