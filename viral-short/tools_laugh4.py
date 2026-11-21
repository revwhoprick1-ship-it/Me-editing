# rank by laugh LENGTH: crowd-noise runs (non-speech, above floor), gaps <=0.75 s bridged. args: dl_dir tx_dir
import json, subprocess, sys, numpy as np
DL, TX = sys.argv[1], sys.argv[2]; SR = 16000; rows = []
USED = {'p03': [(1, 59.1)], 'p04': [(17.4, 58.6), (68.6, 114.2), (230.6, 291.3)], 'p05': [(0.7, 69.8), (253.5, 313)], 'p06': [(24.4, 97.8), (114.6, 146.9)],
        'p07': [(1.2, 43.2), (166.9, 216)], 'p09': [(71.3, 130.3)], 'p10': [(2.9, 56.9), (90.4, 120), (141.4, 203.5)], 'p12': [(49, 61), (190.1, 214.8)]}
for n in range(1, 13):
    p = f'p{n:02d}'
    x = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',f'{DL}/{p}.mp4','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout, np.float32)
    k = len(x)//(SR//4); fr = x[:k*(SR//4)].reshape(k, SR//4)
    db = 20*np.log10(np.sqrt((fr**2).mean(1))+1e-6)
    W = [w for s in json.load(open(f'{TX}/{p}.json')) for w in s['w']]
    talk = np.zeros(k)
    for a, b, _ in W: talk[int(a*4):min(k, int(b*4)+1)] = 1
    lo = np.percentile(db, 20); laugh = (db > lo + 9) & (talk == 0)
    i = 0
    while i < k:
        if laugh[i]:
            j = i
            while j < k and (laugh[j] or laugh[j+1:j+4].any()): j += 1
            dur = (j - i) / 4; t = i / 4
            if dur >= 2.5:
                used = any(a - 2 <= t <= b + 2 for a, b in USED.get(p, []))
                line = ' '.join(w[2].strip() for w in W if t - 12 <= w[0] <= t + 0.3)
                rows.append((dur, p, t, round(db[i:j].mean() - lo, 1), 'USED' if used else '', line[-170:]))
            i = j
        i += 1
rows.sort(key=lambda r: -r[0])
for r in rows[:40]: print(r)
