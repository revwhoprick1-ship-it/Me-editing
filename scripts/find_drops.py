# Print candidate bass drops (big jumps in low-end energy) for each music file.
# Usage: python3 scripts/find_drops.py public/music/*.mp3
import sys, subprocess, numpy as np
for f in sys.argv[1:]:
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-t', '90', '-af', 'lowpass=150', '-ac', '1', '-ar', '8000', '-f', 's16le', '-'],
                         capture_output=True).stdout
    a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    hop = 400  # 50 ms
    e = np.sqrt(np.mean(a[:len(a) // hop * hop].reshape(-1, hop) ** 2, axis=1)) + 1e-4
    db = 20 * np.log10(e)
    # jump = mean of next 2 s minus mean of previous 2 s
    w = 40
    jumps = [(db[i:i + w].mean() - db[i - w:i].mean(), i * 0.05) for i in range(w, len(db) - w)]
    best, out = sorted(jumps, reverse=True), []
    for j, t in best:
        if all(abs(t - u) > 4 for _, u in out): out.append((j, t))
        if len(out) == 3: break
    print(f.split('/')[-1].ljust(26), '  '.join(f'{t:5.1f}s(+{j:.0f}dB)' for j, t in sorted(out, key=lambda x: x[1])))
