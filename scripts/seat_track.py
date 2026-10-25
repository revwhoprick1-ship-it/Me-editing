# Face-track each podcast seat (L/M/R) so crops follow the speaker.
# YuNet face detector (models/yunet.onnx) at 5 fps; each detection goes to the seat whose last
# position is nearest; gaps are filled and the path smoothed (no jitter).
# Usage: python3 scripts/seat_track.py public/pod/clip.mp4 out.json L=450 M=990 R=1560 [from_ms to_ms] [Y=330-760]
# Only the seated people are tracked: a face must be within its seat's radius (L=450:300 sets 300 px, default 220)
# and inside the Y band (face centre, source px), so people standing in the background are ignored.
import sys, json, subprocess
import numpy as np, cv2

src, out = sys.argv[1], sys.argv[2]
seat_args = [a for a in sys.argv[3:] if '=' in a and not a.startswith('Y=')]
seats = {a.split('=')[0]: float(a.split('=')[1].split(':')[0]) for a in seat_args}
radius = {a.split('=')[0]: float(a.split(':')[1]) if ':' in a else 220.0 for a in seat_args}
yband = next(([float(v) for v in a[2:].split('-')] for a in sys.argv[3:] if a.startswith('Y=')), [330.0, 760.0])
rng = [int(a) for a in sys.argv[3:] if '=' not in a]
t0, t1 = (rng + [0, 10 ** 9])[:2] if rng else (0, 10 ** 9)
W, H, STEP = 960, 540, 200  # detect at half res; sample every 200 ms

cmd = ['ffmpeg', '-v', 'error', '-ss', str(t0 / 1000), '-i', src]
if t1 < 10 ** 9: cmd += ['-t', str((t1 - t0) / 1000)]
cmd += ['-vf', f'fps=5,scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-']
raw = subprocess.run(cmd, capture_output=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
det = cv2.FaceDetectorYN.create('models/yunet.onnx', '', (W, H), 0.6)

last = {k: (v / 2, H * 0.35) for k, v in seats.items()}  # half-res coords
hits = {k: [] for k in seats}
for i, fr in enumerate(frames):
    _, faces = det.detect(fr)
    faces = [] if faces is None else faces
    used = set()
    for k in sorted(seats, key=lambda k: seats[k]):
        best, bd = None, 130  # max jump (half-res px) between samples
        for j, f in enumerate(faces):
            if j in used: continue
            cx, cy = f[0] + f[2] / 2, f[1] + f[3] / 2
            # stay on this seat's person: near the seat, at seated head height
            if abs(cx * 2 - seats[k]) > radius[k] or not (yband[0] <= cy * 2 <= yband[1]): continue
            d = abs(cx - last[k][0]) + 0.5 * abs(cy - last[k][1])
            if d < bd: best, bd = j, d
        if best is not None:
            used.add(best)
            f = faces[best]
            last[k] = (f[0] + f[2] / 2, f[1] + f[3] / 2)
            hits[k].append((i, last[k][0] * 2, last[k][1] * 2, f[3] * 2))

res = {'stepMs': STEP, 'fromMs': t0}
n = len(frames)
for k, hs in hits.items():
    if not hs:
        res[k] = [[seats[k], 380, 200]] * n
        continue
    idx = np.array([h[0] for h in hs])
    cols = [np.interp(np.arange(n), idx, [h[c] for h in hs]) for c in (1, 2, 3)]
    # median then moving-average smoothing (about 1.2 s) for a calm camera
    sm = []
    for c in cols:
        med = np.array([np.median(c[max(0, i - 2):i + 3]) for i in range(n)])
        sm.append(np.convolve(np.pad(med, 3, mode='edge'), np.ones(7) / 7, mode='valid'))
    res[k] = [[round(float(a)), round(float(b)), round(float(s))] for a, b, s in zip(*sm)]
    print(k, f'{len(hs)}/{n} frames detected', file=sys.stderr)
json.dump(res, open(out, 'w'))
