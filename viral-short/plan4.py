# v5 formula (STW fix): payoff-first hook (speech on frame 1) -> 0.4 s rewind scrub -> full-context story ending on the payoff, 15-20 s.
# Writes the 5 edits into src/edits.gen.json (merge) + src/v5.cfg.json (text hook, highlight, music, call-outs, cues).
import json, sys
ns = {}; sys.argv = ['plan3.py', sys.argv[1], '/dev/null']
src = open('plan3.py').read(); exec(src.split('\nEDITS = {')[0], ns)
W, AT, FIX = ns['W'], ns['AT'], ns['FIX']
AT.update({1196.68: "Doesn't", 1196.72: 'mean', 1196.88: "I'm", 1196.96: 'a', 1197.22: 'LARPER', 1197.42: ''})   # matches the source's own subtitle
ATW = {(1456.66, 'burnt'): 'brought', (1457.98, 'car'): 'card', (1458.7, 'from'): '', (1458.82, 'me.'): '', (360.46, 'bowling'): "Bowling's", (360.46, 'has'): '',
       (362.64, 'you'): 'your', (1522.52, 'police'): 'please'}
BIRKIN = [(1452.68, 1380), (1454.2, 984), (1454.68, 1380), (1455.16, 856), (1455.64, 779), (1456.6, 801), (1458.44, 852), (1460.64, 960), (1463.76, 1040), (1464.48, 585), (1466.56, 1380)]
RW = 12  # rewind frames
EDITS = {
 'v5confess': [('hook', 1547.04, 1550.12, [(1547.04, 1300), (1548.16, 720)]), ('rw', 1550.12, 1521.72, None),
               ('c1', 1521.72, 1523.96, [(1521.72, 960)]), ('c2', 1543.90, 1550.12, [(1543.90, 700), (1544.32, 960), (1546.08, 720), (1547.04, 1300), (1548.16, 720)]),
               ('c3', 1553.00, 1561.40, [(1553.00, 860), (1554.16, 600), (1555.04, 560), (1556.08, 980), (1558.96, 960)])],
 'v5gift': [('c1', 244.20, 247.36, [(244.20, 900), (246.28, 960)]), ('c2', 1452.68, 1467.60, BIRKIN)],
 'v5merch': [('hook', 1235.84, 1237.92, [(1235.84, 960), (1237.00, 823)]), ('rw', 1237.92, 1229.60, None),
             ('c1', 1229.60, 1244.05, [(1229.60, 762), (1231.00, 960), (1235.84, 960), (1237.00, 823), (1238.96, 960), (1240.28, 960)])],
 'v5pissed': [('hook', 1194.96, 1197.62, [(1194.96, 960)]), ('rw', 1197.62, 1185.60, None),
              ('c1', 1185.60, 1199.24, [(1185.60, 960), (1187.32, 1140), (1188.12, 997), (1188.80, 880), (1189.52, 960), (1189.96, 900), (1194.96, 960), (1198.08, 968)])],
 'v5bowling': [('hook', 357.40, 359.30, [(357.40, 960)]), ('rw', 359.30, 350.04, None),
               ('c1', 350.04, 364.05, [(350.04, 960), (352.40, 960), (353.28, 1280), (355.88, 960), (357.16, 960), (359.32, 960), (360.12, 1100), (362.24, 960), (363.20, 960)])],
}
gen = json.load(open('src/edits.gen.json'))
for eid, plan in EDITS.items():
    scenes = []
    for sid, a, b, crops in plan:
        if crops is None:
            scenes.append({'id': sid, 'videoStartSec': b, 'durationInFrames': RW, 'cropX': 960, 'crops': [[0, 960]], 'rewind': [a, b], 'words': []}); continue
        n = round((b - a) * 30); words = []
        for (ws, we, t) in W:
            if a - 0.05 <= ws < b - 0.05:
                k = round(ws, 2); tt = ATW[(k, t.lower())] if (k, t.lower()) in ATW else AT[k] if k in AT else FIX.get(t.lower().strip(',.?!'), t.strip(',.'))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1, 0, -1):
            if words[i]['word'].startswith('-'): words[i-1]['word'] += words[i]['word']; words[i-1]['endFrame'] = words[i]['endFrame']; words.pop(i)
        for w in words:
            if w['word'].lower().startswith('larp'): w['word'] = w['word'].upper().replace('-', '')
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i+1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': a, 'durationInFrames': n, 'cropX': crops[0][1], 'crops': [[round((s - a) * 30), x] for s, x in crops], 'words': words})
    gen[eid] = scenes
    print(eid, round(sum(s['durationInFrames'] for s in scenes) / 30, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:420])
json.dump(gen, open('src/edits.gen.json', 'w'))

G, R = 'G', 'R'
CFG = {
 'v5confess': dict(top='The FAKE millionaire fooled them until the very end', hl={'FAKE': '#FF2A2A'}, cta='*did you guess it was him?*', music=['chess_n', 38], ctaAt=['c3', 'fair'],
   track='iron', calls=[[1546.08, 1547.04, '*Iron Man*'], [1548.16, 1550.12, '*Iron Man*']],
   tints=[[['hook', 'yes'], G], [['c1', 'fake'], R], [['c2', 'larp?', 1], R], [['c3', 'fair'], G]], rizz=[['hook', 'yes'], ['c3', 'fair']],
   punch=[['hook', 'larp?'], ['hook', 'yes'], ['c1', 'fake'], ['c1', 'forward?'], ['c2', 'larp?', 1], ['c2', 'yes'], ['c3', 'traded'], ['c3', 'fair'], ['c3', 'got']],
   blowouts=[['c2', 'yes']], blackFlash=[['c1']], streaks=[['c2'], ['c3']]),
 'v5gift': dict(top='Asking the FAKE millionaire what he got his mom', hl={'FAKE': '#FF2A2A'}, cta='*real or cap?*', music=['phonk_n', 76], ctaAt=['c2', 'cap'],
   track='gift', calls=[[244.20, 246.28, '*Iron Man*'], [1454.2, 1454.68, '*Iron Man*'], [1455.16, 1455.64, '*Iron Man*'], [1456.6, 1458.44, '*Iron Man*'], [1463.76, 1464.48, '*Iron Man*']],
   tints=[[['c1', 'm3'], G], [['c1', 'mom?'], R], [['c2', 'birkin'], G], [['c2', 'cap'], R]], rizz=[['c1', 'm3'], ['c2', 'birkin']],
   punch=[['c1', 'm3'], ['c1', 'mom?', 1], ['c2', 'mom?'], ['c2', 'birkin'], ['c2', 'size?'], ['c2', 'know'], ['c2', 'cap'], ['c2', 'secondhand']],
   blowouts=[['c2', 'know']], blackFlash=[['c2']], streaks=[['c2', 'cap']]),
 'v5merch': dict(top='He flew across the world… for MERCH', hl={'MERCH': '#FF2A2A'}, cta='*would you fly across the world for merch?*', music=['goodbye_n', 28], ctaAt=['c1', 'getting'],
   track='merch', calls=[[1231.00, 1235.84, '*FOMO Eyes*'], [1235.84, 1237.00, '*FOMO Eyes*']],
   tints=[[['hook', 'merch'], G], [['hook', 'bearish'], R], [['c1', 'merch'], G], [['c1', 'absurd'], R]], rizz=[['hook', 'merch'], ['c1', 'merch']],
   punch=[['hook', 'merch'], ['hook', 'bearish'], ['c1', 'token'], ['c1', 'merch'], ['c1', 'bearish'], ['c1', 'worst'], ['c1', 'world'], ['c1', 'absurd']],
   blowouts=[['c1', 'bearish']], blackFlash=[['c1']], streaks=[['c1', 'the', 1]]),
 'v5pissed': dict(top="He swore he wasn't the LARPER…", hl={'LARPER…': '#FF2A2A'}, cta='*did you believe him?*', music=['chess_n', 62], ctaAt=['c1', 'he', 3],
   track='pissed', calls=[[1188.80, 1189.52, '*Iron Man*'], [1194.96, 1198.08, '*Iron Man*']],
   tints=[[['hook', 'richest'], G], [['hook', 'larper'], R], [['c1', 'iron'], R], [['c1', 'larper'], R], [['c1', 'pissed'], G]], rizz=[['hook', 'richest'], ['c1', 'pissed']],
   punch=[['hook', 'richest'], ['hook', 'larper'], ['c1', 'sus'], ['c1', 'iron'], ['c1', 'australia'], ['c1', 'token'], ['c1', 'richest'], ['c1', 'larper'], ['c1', 'pissed']],
   blowouts=[['c1', 'larper']], blackFlash=[['c1']], streaks=[['c1', 'that\'s']]),
 'v5bowling': dict(top="The dumbest thing a 'millionaire' ever bought", hl={'dumbest': '#FF2A2A'}, cta='*real millionaire or LARPER?*', music=['phonk_n', 58], ctaAt=['c1', 'this'],
   track='hulk', calls=[[357.40, 359.32, '*Hulk*'], [351.32, 352.40, '*Hulk*']],
   tints=[[['hook', '$100k'], R], [['c1', 'bowling'], G], [['c1', 'lost'], R], [['c1', 'legit'], G]], rizz=[['c1', 'bowling'], ['c1', 'legit']],
   punch=[['hook', '$100k'], ['hook', 'stupid'], ['c1', 'dumbest'], ['c1', 'bowling'], ['c1', '$100k'], ['c1', '$100k', 1], ['c1', 'stupid'], ['c1', 'legit']],
   blowouts=[['hook', 'lost']], blackFlash=[['c1']], streaks=[['c1', 'bowling']]),
}
# validate every word ref now (the template throws on a missing word)
for eid, c in CFG.items():
    sc = {s['id']: s for s in gen[eid]}
    for key in ('tints', 'rizz', 'punch', 'blowouts', 'blackFlash', 'streaks', 'ctaAt'):
        refs = c[key] if key != 'tints' else [r for r, _ in c[key]]
        if key == 'ctaAt': refs = [refs]
        for r in refs:
            if len(r) == 1: assert r[0] in sc, (eid, r); continue
            ws = [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())]
            assert len(ws) > (r[2] if len(r) > 2 else 0), (eid, key, r)
json.dump(CFG, open('src/v5.cfg.json', 'w')); print('cfg ok')
