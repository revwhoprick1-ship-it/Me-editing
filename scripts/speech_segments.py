# Prints where speech/sound actually starts and stops (20 ms resolution),
# used to snap whisper word times onto the real audio.
# Usage: python3 scripts/speech_segments.py public/input.mp4 [threshold_db]
import subprocess, sys
import numpy as np

thr = float(sys.argv[2]) if len(sys.argv) > 2 else -30
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
w = 320  # 20 ms
db = np.array([20 * np.log10(np.sqrt(np.mean(a[i:i + w] ** 2)) + 1e-9) for i in range(0, len(a), w)])
on = db > thr
segs, start = [], None
for i, v in enumerate(on):
    if v and start is None:
        start = i
    if not v and start is not None:
        segs.append([start, i]); start = None
if start is not None:
    segs.append([start, len(on)])
merged = []
for s in segs:  # bridge gaps shorter than 160 ms
    if merged and s[0] - merged[-1][1] < 8:
        merged[-1][1] = s[1]
    else:
        merged.append(s)
for s, e in merged:
    if e - s >= 4:
        print(f"{s * 20:>6}-{e * 20:<6} ms  peak {db[s:e].max():.0f} dB")
