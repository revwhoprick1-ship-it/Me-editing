# Who is actually talking? Per word, compare mouth-area motion of each seat (from the seat track) and pick the
# seat whose mouth moves most relative to its own baseline. Prints runs: start-end seat (and per-word detail with -v).
# Usage: python3 scripts/speaker_check.py video.mp4 seats.json words.json [from_ms to_ms] [-v]
import json, subprocess, sys
import numpy as np

args = [a for a in sys.argv[1:] if a != '-v']
verbose = '-v' in sys.argv
video, seats_p, words_p = args[:3]
a_ms, b_ms = (int(args[3]), int(args[4])) if len(args) >= 5 else (0, 10 ** 9)
seats = json.load(open(seats_p))
words = [w for w in json.load(open(words_p)) if a_ms <= w['startMs'] < b_ms]
FPS, SC = 15, 0.5  # analysis rate and scale (1920x1080 -> 960x540)
t0 = max(0, words[0]['startMs'] - 500) if words else a_ms
t1 = (words[-1]['startMs'] + 1200) if words else b_ms
raw = subprocess.run(['ffmpeg', '-v', '0', '-ss', str(t0 / 1000), '-t', str((t1 - t0) / 1000), '-i', video,
                      '-vf', f'fps={FPS},scale=960:540,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 540, 960).astype(np.float32)
diff = np.abs(np.diff(fr, axis=0))  # motion between consecutive frames

def face(seat, ms):
    tr = seats.get(seat)
    if not tr: return None
    i = int(round((ms - seats.get('fromMs', 0)) / seats.get('stepMs', 200)))
    i = min(max(i, 0), len(tr) - 1)
    return tr[i]

def mouth_motion(seat, ms0, ms1):
    f = face(seat, (ms0 + ms1) / 2)
    if not f: return 0.0
    x, y, s = f[0] * SC, f[1] * SC, f[2] * SC
    x0, x1 = int(x - 0.32 * s), int(x + 0.32 * s)
    y0, y1 = int(y + 0.18 * s), int(y + 0.62 * s)
    k0 = int((ms0 - t0) / 1000 * FPS); k1 = max(k0 + 1, int((ms1 - t0) / 1000 * FPS))
    reg = diff[max(0, k0):min(len(diff), k1), max(0, y0):y1, max(0, x0):x1]
    return float(reg.mean()) if reg.size else 0.0

names = [s for s in ('L', 'M', 'R') if s in seats]
rows = []
for j, w in enumerate(words):
    end = words[j + 1]['startMs'] if j + 1 < len(words) else w['startMs'] + 400
    end = min(end, w['startMs'] + 600)
    rows.append([mouth_motion(s, w['startMs'], max(end, w['startMs'] + 150)) for s in names])
M = np.array(rows) if rows else np.zeros((0, len(names)))
base = np.median(M, axis=0) + 1e-3  # each seat's typical motion (hands, wig, camera shake)
score = M / base
who = [names[int(np.argmax(r))] for r in score]
# smooth: majority over a 5-word window
sm = []
for j in range(len(who)):
    win = who[max(0, j - 2): j + 3]
    sm.append(max(set(win), key=win.count))
if verbose:
    for w, r, s in zip(words, score, sm): print(f"{w['startMs']:>6} {w['text'][:14]:<14} " + ' '.join(f'{n}:{v:4.2f}' for n, v in zip(names, r)) + f'  -> {s}')
runs = []
for w, s in zip(words, sm):
    if runs and runs[-1][2] == s: runs[-1][1] = w['startMs']
    else: runs.append([w['startMs'], w['startMs'], s])
for r in runs: print(f'{r[0]:>6}-{r[1]:>6} {r[2]}')
