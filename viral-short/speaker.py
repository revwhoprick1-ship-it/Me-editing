# active-speaker crops for static multi-person shots: per-seat mouth-region motion energy (z-scored per seat), argmax during
# speech, min 0.8 s per hold -> crops [frame, cx, zoom, cy] written into src/edits.gen.json for the given edits.
import json, subprocess, sys, numpy as np
SEATS = {  # src px head centres per clip (from reference frames)
 't3_traveling_trevors': [(450, 450), (1020, 435), (1410, 560)],
 't6_davis_mills_joke': [(591, 260), (981, 390), (1491, 450), (891, 170)],
 't4_natty_ticket': [(555, 420), (990, 360), (1500, 480)],
 't1_tiger_auto_pen': [(390, 444), (990, 420), (1530, 450)],
 'u2_psa10_celly': [(426, 384), (981, 375), (1521, 450)],
 'u3_redemptions': [(285, 405), (975, 375), (1485, 450), (440, 200), (1275, 185)],
}
EDITS = {'tvfans': 't3_traveling_trevors', 'tvneck': 't6_davis_mills_joke', 'tvticket': 't4_natty_ticket', 'tvant': 't1_tiger_auto_pen',
         'tvcelly': 'u2_psa10_celly', 'tvredeem': 'u3_redemptions'}
ZOOM, FPS, W, H = 1.6, 15, 960, 540; s = 1920 / W
gen = json.load(open('src/edits.gen.json')); TX = sys.argv[1]
for eid, src in EDITS.items():
    words = [w for seg in json.load(open(f'{TX}/{src}.json')) for w in seg['w']]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'public/{src}.mp4', '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    E = []
    for (x, y) in SEATS[src]:
        cx, cy = int(x / s), int((y + 70) / s); bw, bh = 55, 40
        roi = fr[:, max(0, cy - bh):cy + bh, max(0, cx - bw):cx + bw]
        e = np.r_[0, np.abs(np.diff(roi, axis=0)).mean((1, 2))]
        e = np.convolve(e, np.ones(9) / 9, 'same'); E.append((e - np.median(e)) / (e.std() + 1e-6))
    E = np.array(E); n = E.shape[1]
    speech = np.zeros(n, bool)
    for a, b, _ in words: speech[int(a * FPS):int(b * FPS) + 1] = True
    who = np.where(speech, E.argmax(0), -1)
    # hold: forward-fill silences, then enforce min 0.8 s segments
    last = 1
    for i in range(n):
        if who[i] < 0: who[i] = last
        else: last = who[i]
    minlen = int(0.8 * FPS); i = 0; out = who.copy()
    segs = []
    while i < n:
        j = i
        while j < n and who[j] == who[i]: j += 1
        segs.append([i, j, who[i]]); i = j
    for k in range(len(segs)):
        if segs[k][1] - segs[k][0] < minlen and k > 0: segs[k][2] = segs[k - 1][2]
    for a, b, w in segs: out[a:b] = w
    for sc in gen[eid]:
        if sc.get('rewind'): continue
        a = sc['videoStartSec']; dur = sc['durationInFrames'] / 30; crops = []; prev = None
        for f in range(sc['durationInFrames']):
            t = a + f / 30; w = int(out[min(n - 1, int(t * FPS))])
            if w != prev: x, y = SEATS[src][w]; crops.append([f, x, ZOOM, y + 60]); prev = w
        sc['crops'] = crops
    print(eid, [(sc['id'], [(c[0], SEATS[src].index((c[1], c[3] - 60))) for c in sc['crops']]) for sc in gen[eid] if not sc.get('rewind')])
json.dump(gen, open('src/edits.gen.json', 'w'))
