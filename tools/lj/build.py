"""Love & Justice campaign clips: cut, analyse and lay out 5 vertical clips for Remotion (src/lj/LJClip.tsx).
usage: python3 tools/lj/build.py [--ep=tools/lj/ep6.py] [clip_id ...]
needs: footage/lj/ep.mp4, footage/lj/ep.words.json (tools/transcribe.py), models/yunet.onnx

Episode config (source, transcript, clips, music) lives in tools/lj/ep6.py.
Per clip: flash-forward hook + main scene -> public/lj/<id>.mp4 (30 fps, 1080p, original audio)
Per shot the layout is chosen from the faces actually on screen:
  split : the show's own side-by-side split screen (gold divider) -> stacked top/bottom, each panel follows its face
  full  : one main subject (or a tight group) -> full-bleed 9:16 crop that follows them smoothly
  wide  : people too far apart for 9:16 -> zoomed-out box that fits all of them, blurred fill around it
Writes src/lj/<id>.json with per-frame camera data, captions and beats."""
import json, os, re, subprocess, sys
import cv2, numpy as np

FPS = 30
import importlib.util
_ep = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--ep=')), 'tools/lj/ep6.py')
_spec = importlib.util.spec_from_file_location('epcfg', _ep); EP = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(EP)
SRC, CLIPS = EP.SRC, EP.CLIPS

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
            col = 'red' if key in c['red'] else 'green' if key in c['green'] else 'magenta' if key in c.get('magenta', []) else 'yellow' if key in c.get('yellow', []) else None
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
    words = [w for s in json.load(open(EP.WORDS)) for w in s['w']]
    (ha, hb), (ma, mb) = c['hook'], c['main']
    vf = lambda t: round((hook_frames / FPS + t - ma) * FPS)  # source seconds (main part) -> video frame
    style = dict(
        actions=[dict(f=vf(t), n=round(d * FPS), text=x) for t, d, x in c['actions']],
        washes=[dict(f=vf(t), color=col) for t, col in c['washes']],
        punches=[dict(f=vf(t), scale=z) for t, z in c['punches']],
        shakes=[vf(t) for t in c['shakes']],
        tension=[[vf(a), vf(b)] for a, b in c['tension']],
    )
    music = dict(c.get('music', EP.MUSIC))
    if 'drop_at' in music:  # line the song's drop up with a source moment
        music['drop_f'] = vf(music.pop('drop_at'))
    data = dict(id=c['id'], frames=n, hook=hook_frames, title=c['title'], shots=shots, captions=captions(c, words, hook_frames), music=music, **style)
    json.dump(data, open(f"src/lj/{c.get('slot', c['id'])}.json", 'w'))
    print(c['id'], 'frames', n, 'shots', len(shots), {m: sum(s['n'] for s in shots if s['mode'] == m) for m in ('split', 'full', 'wide')})

if __name__ == '__main__':
    want = [a for a in sys.argv[1:] if not a.startswith('--')]
    for c in CLIPS:
        if not want or c['id'] in want: build(c)
