# derive effect cues from caption words -> src/auto.cfg.json (top text, cta, calls, tints/rizz/punch/blowout/blackflash/streak refs)
import json, re
G = json.load(open('src/edits.gen.json')); A = json.load(open('src/tracks/auto/auto_edits.json'))
MONEY = re.compile(r"^(\$|\d|million|mil$|figures|birkin|rolex|car$|suv|cheap|youtube|millionaire|legit|avocado|kangaroo|brother|iron|australia|richest|yes$|god$|maurits|understand|token|traded|kangaroo|sperm|clear)", re.I)
CONF = re.compile(r"^(larp|fake|cap$|pissed|beef|defensive|sus|f\*\*\*|hell|delusional|wrong|suspicious|security|fit$|wishes|no$|what\?)", re.I)
META = {
 'confess': ("The millionaire LARPER finally admitted it", "*did you guess it was him?*", 0),
 'richest': ("Calling out the LARPER made him PISSED", "*was he the LARPER?*", 40),
 'beef': ("Too defensive to NOT be the LARPER?", "*LARPER or not?*", 80),
 'birkin': ("He 'bought' his mom a Birkin… LARPER?", "*real or cap?*", 120),
 'avocado': ("The wildest millionaire cover story", "*real millionaire or LARPER?*", 160),
 'family': ("His family thinks his millions come from YouTube", "*real millionaire or LARPER?*", 200),
 'twin': ("Maurits found his millionaire twin", "*who's the LARPER?*", 240),
 'suv': ("$50K family SUV vs 7 figures in ONE day", "*spot the LARPER*", 280),
 'rolex': ("A $40K Rolex is 'cheap'??", "*real millionaire or LARPER?*", 320),
 'legit': ("They all agreed he's NOT the LARPER", "*did they get it right?*", 360),
}
CALLS = {'richest': [2, 5], 'birkin': [1, 3, 5, 9], 'family': [1, 3]}
out = {}
for eid, (top, cta, music) in META.items():
    words = G[eid][0]['words']; seen = {}
    refs = []
    for w in words:
        k = w['word'].lower().strip('?!.,'); key = w['word'].lower()
        n = sum(1 for x in words[:words.index(w)] if x['word'].lower().startswith(key)); refs.append((w, ['main', w['word'], n]))
    money = [r for w, r in refs if MONEY.search(w['word'].strip('*'))]
    conf = [r for w, r in refs if CONF.search(w['word'])]
    def spaced(lst, gap=45):
        res, last = [], -999
        for w, r in [(w, r) for w, r in refs if r in lst]:
            if w['startFrame'] - last >= gap: res.append(r); last = w['startFrame']
        return res
    g, rd = spaced(money, 60)[:4], spaced(conf, 60)[:3]
    punch = spaced(money + conf, 25)[:9]
    allw = [w for w, r in refs]; mid = [r for w, r in refs if w['startFrame'] > allw[-1]['endFrame'] * 0.35]
    bf = (rd or g or mid)[:1]; blow = (g[1:2] or rd[1:2] or mid[3:4]); streak = mid[len(mid)//2:len(mid)//2+1]
    calls = [[c[0], c[1], c[2]] for i, c in enumerate(A[eid]['calls']) if False]
    if eid in CALLS:
        cr = A[eid]['crops']; ends = [c[0] for c in cr[1:]] + [A[eid]['end']]
        lab = {'richest': '*Iron Man*', 'birkin': '*Iron Man*', 'family': '*Pikachu*'}[eid]
        calls = [[cr[i][0], ends[i], lab] for i in CALLS[eid]]
    if eid == 'confess': calls = [[1546.08, 1547.04, '*Iron Man*'], [1548.16, 1550.12, '*Iron Man*']]
    cta_at = mid[len(mid)//3] if mid else ['main']
    out[eid] = {'top': top, 'cta': cta, 'music': music, 'calls': calls, 'tints': [[r, 'G'] for r in g] + [[r, 'R'] for r in rd], 'rizz': g[:3],
                'punch': punch, 'blowouts': blow, 'blackFlash': bf, 'streaks': streak, 'ctaAt': cta_at, 'track': 'confess' if eid == 'confess' else eid}
    print(eid, '| G', [r[1] for r in g], '| R', [r[1] for r in rd], '| P', [r[1] for r in punch])
json.dump(out, open('src/auto.cfg.json', 'w'))
