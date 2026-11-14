# Speaker crops from a hand-checked line -> seat map (lines split on >0.5 s pauses, same as the review sheet).
# Seats from speaker.py; crop = [frame, x, zoom, y]. Speaker held from their line's first word until the next line starts.
import json, sys
sys.argv = [sys.argv[0], sys.argv[1]]; TX = sys.argv[1]
src_py = open('speaker.py').read(); ns = {}; exec(src_py.split('ZOOM, FPS')[0], ns); SEATS, EDITS = ns['SEATS'], ns['EDITS']
R = {'t3_traveling_trevors': (72.7, 98.6), 't6_davis_mills_joke': (1.3, 16.8), 't4_natty_ticket': (9.7, 31.7), 't1_tiger_auto_pen': (7, 25.2), 'u2_psa10_celly': (9, 33), 'u3_redemptions': (0, 34)}
MAP = {'t3_traveling_trevors': [2, 2, 1, 1, 1, 1, 1, 1], 't6_davis_mills_joke': [0, 0, 0, 0, 1, 2, 2, 1, 0], 't4_natty_ticket': [0, 0, 0, 0, 0, 0],
       't1_tiger_auto_pen': [0, 0, 0, 2, 2], 'u2_psa10_celly': [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
       'u3_redemptions': [3, 1, 3, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]}
ZOOM = 1.6
gen = json.load(open('src/edits.gen.json'))
for eid, src in EDITS.items():
    a0, b0 = R[src]; starts = []
    for s in json.load(open(f'{TX}/{src}.json')):
        cur = []
        for w in s['w']:
            if cur and w[0] - cur[-1][1] > 0.5:
                if a0 <= cur[0][0] < b0: starts.append(cur[0][0])
                cur = []
            cur.append(w)
        if cur and a0 <= cur[0][0] < b0: starts.append(cur[0][0])
    seats = MAP[src]; assert len(seats) == len(starts), (src, len(seats), len(starts))
    def seat_at(t):
        k = 0
        for i, st in enumerate(starts):
            if st - 0.15 <= t: k = i
        return seats[k]
    for sc in gen[eid]:
        if sc.get('rewind'): continue
        crops, prev = [], None
        for f in range(sc['durationInFrames']):
            w = seat_at(sc['videoStartSec'] + f / 30)
            if w != prev: x, y = SEATS[src][w]; crops.append([f, x, ZOOM, y + 60]); prev = w
        crops = [c for i, c in enumerate(crops) if i == 0 or (crops[i + 1][0] if i + 1 < len(crops) else sc['durationInFrames']) - c[0] >= 12]
        crops = [c for i, c in enumerate(crops) if i == 0 or c[1] != crops[i - 1][1]]
        if len(crops) > 1 and crops[1][0] < 12: crops = [[0] + crops[1][1:]] + crops[2:]
        sc['crops'] = crops
    print(eid, [(sc['id'], [(c[0], [k for k, v in enumerate(SEATS[src]) if v[0] == c[1]][0]) for c in sc['crops']]) for sc in gen[eid] if not sc.get('rewind')])
json.dump(gen, open('src/edits.gen.json', 'w'))
