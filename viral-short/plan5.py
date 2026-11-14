# v6 batch (same v5 formula) (STW fix): payoff-first hook (speech on frame 1) -> 0.4 s rewind scrub -> full-context story ending on the payoff, 15-20 s.
# Writes the 5 edits into src/edits.gen.json (merge) + src/v5.cfg.json (text hook, highlight, music, call-outs, cues).
import json, sys
ns = {}; sys.argv = ['plan3.py', sys.argv[1], '/dev/null']
src = open('plan3.py').read(); exec(src.split('\nEDITS = {')[0], ns)
W, AT, FIX = ns['W'], ns['AT'], ns['FIX']
AT.update({1196.68: "Doesn't", 1196.72: 'mean', 1196.88: "I'm", 1196.96: 'a', 1197.22: 'LARPER', 1197.42: ''})   # matches the source's own subtitle
ATW = {(409.22, 'texas,'): 'DEXs', (551.24, 'lark.'): 'LARP', (552.96, "we're"): '', (553.02, 'too'): '', (553.2, 'hung,'): '', (553.5, 'because'): "'Cause",
       (1573.75, 'aim'): 'angel', (1573.85, 'to'): '', (1577.47, 'math?'): 'mask?', (1578.07, 'docs.'): 'doxxed', (1581.27, 'tone.'): 'TON', (1586.25, 'pepper'): 'Pepe',
       (1587.87, 'other'): 'unused', (1588.25, 'news'): '', (1456.66, 'burnt'): 'brought', (1457.98, 'car'): 'card', (1458.7, 'from'): '', (1458.82, 'me.'): '', (360.46, 'bowling'): "Bowling's", (360.46, 'has'): '',
       (362.64, 'you'): 'your', (1522.52, 'police'): 'please'}
BIRKIN = [(1452.68, 1380), (1454.2, 984), (1454.68, 1380), (1455.16, 856), (1455.64, 779), (1456.6, 801), (1458.44, 852), (1460.64, 960), (1463.76, 1040), (1464.48, 585), (1466.56, 1380)]
RW = 12  # rewind frames
EDITS = {
 'v6twist': [('hook', 1589.95, 1591.72, [(1589.95, 960)]), ('rw', 1591.72, 1509.12, None),
             ('c1', 1509.12, 1511.28, [(1509.12, 960), (1510.04, 791)]), ('c2', 1576.60, 1591.72, [(1576.60, 811), (1577.76, 960), (1579.76, 1155), (1589.84, 960)])],
 'v6chant': [('hook', 417.00, 418.90, [(417.00, 960), (417.20, 983), (418.08, 924)]), ('rw', 418.90, 404.70, None),
             ('c1', 404.70, 419.70, [(404.70, 960), (406.04, 914), (407.76, 1380), (410.00, 793), (410.72, 1100), (411.76, 1300), (414.40, 1300), (415.28, 1015), (416.88, 960), (417.20, 983), (418.08, 924)])],
 'v6solstice': [('hook', 1084.86, 1087.44, [(1084.86, 960)]), ('rw', 1087.44, 1070.20, None),
                ('c1', 1070.20, 1087.44, [(1070.20, 960), (1073.72, 769), (1074.80, 882), (1075.40, 762), (1076.36, 900), (1078.96, 1167), (1080.16, 900), (1082.12, 960), (1083.40, 960)])],
 'v6dv': [('hook', 548.75, 551.55, [(548.75, 679), (549.20, 987)]), ('rw', 551.55, 544.52, None),
          ('c1', 544.52, 560.60, [(544.52, 1100), (547.32, 679), (549.20, 987), (552.96, 911), (554.60, 804), (555.72, 711), (557.32, 960), (558.84, 960)])],
 'v6forty': [('hook', 1565.60, 1568.20, [(1565.60, 984), (1567.72, 960)]), ('rw', 1568.20, 1561.50, None),
             ('c1', 1561.50, 1576.20, [(1561.50, 1060), (1563.20, 960), (1565.60, 984), (1567.72, 960), (1569.40, 954), (1570.56, 860), (1573.48, 826), (1574.20, 1111)])],
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
 'v6twist': dict(top='They voted him the FAKE… he was REAL', hl={'FAKE…': '#FF2A2A', 'REAL': '#58EE28'}, cta='*did you think he was fake?*', music=['goodbye_n', 50], ctaAt=['c2', 'so'],
   track='none', calls=[],
   tints=[[['hook', 'fraud'], R], [['c1', 'larp'], R], [['c2', 'doxxed'], G], [['c2', 'made'], G]], rizz=[['c2', 'doxxed'], ['c2', 'made']],
   punch=[['hook', 'convinced'], ['hook', 'fraud'], ['c1', 'larp'], ['c2', 'mask?'], ['c2', 'doxxed'], ['c2', 'real'], ['c2', 'big'], ['c2', 'made'], ['c2', 'fraud']],
   blowouts=[['c2', 'made']], blackFlash=[['c1']], streaks=[['c2'], ['c2', 'so']]),
 'v6chant': dict(top='When every answer sounds like a LARP', hl={'LARP': '#FF2A2A'}, cta='*real or LARP?*', music=['chess_n', 90], ctaAt=['c1', 'wait'],
   track='chant_iron', calls=[[407.76, 410.00, '*Iron Man*']],
   tints=[[['hook', 'larp'], R], [['c1', 'shiba'], G], [['c1', 'larp'], R], [['c1', 'jupiter'], G], [['c1', 'larp', 1], R]], rizz=[['c1', 'shiba'], ['c1', 'jupiter']],
   punch=[['hook', 'larp'], ['hook', 'larp', 2], ['hook', 'larp', 4], ['c1', 'young'], ['c1', 'dexs'], ['c1', 'larp'], ['c1', 'jupiter'], ['c1', 'larp', 1], ['c1', 'larp', 3]],
   blowouts=[['c1', 'larp']], blackFlash=[['c1']], streaks=[['c1', 'number']]),
 'v6solstice': dict(top="He 'talks to' Solstice… but can't name ONE trade", hl={'ONE': '#FF2A2A'}, cta="*do YOU know Solstice's best trade?*", music=['phonk_n', 30], ctaAt=['c1', 'the', 1],
   track='solstice', calls=[[1074.80, 1075.40, '*Clown*'], [1076.36, 1078.96, '*Clown*'], [1080.16, 1082.12, '*Clown*']],
   tints=[[['hook', 'internet'], G], [['hook', 'know'], R], [['c1', 'solstice'], G], [['c1', 'remember'], R]], rizz=[['c1', 'solstice'], ['c1', 'solstice', 1]],
   punch=[['hook', 'internet'], ['hook', 'know'], ['c1', 'solstice'], ['c1', 'talked'], ['c1', 'solstice', 1], ['c1', 'known'], ['c1', 'remember'], ['c1', 'best'], ['c1', 'internet']],
   blowouts=[['c1', 'remember']], blackFlash=[['c1']], streaks=[['c1', "what's", 1]]),
 'v6dv': dict(top='Not knowing DV = LARPER?', hl={'LARPER?': '#FF2A2A', 'DV': '#58EE28'}, cta="*who's the GOAT of the trenches?*", music=['goodbye_n', 6], ctaAt=['c1', 'name'],
   track='none', calls=[],
   tints=[[['hook', 'dv'], G], [['hook', 'larp'], R], [['c1', 'dv'], G], [['c1', 'larp'], R], [['c1', 'axiom'], G]], rizz=[['c1', 'dv'], ['c1', 'axiom']],
   punch=[['hook', 'dv'], ['hook', 'larp'], ['c1', 'goat'], ['c1', 'dv'], ['c1', 'dv', 1], ['c1', 'larp'], ['c1', 'streamer'], ['c1', 'axiom'], ['c1', 'axiom', 1]],
   blowouts=[['c1', 'larp']], blackFlash=[['c1']], streaks=[['c1', 'name']]),
 'v6forty': dict(top='What the millionaires look like WITHOUT masks', hl={'WITHOUT': '#FF2A2A'}, cta='*who looks most like a millionaire?*', music=['chess_n', 12], ctaAt=['c1', 'so'],
   track='none', calls=[],
   tints=[[['hook', 'thanos'], G], [['hook', '40'], R], [['c1', '40'], R], [['c1', 'virtual'], G], [['c1', 'done'], G]], rizz=[['c1', 'virtual'], ['c1', 'done']],
   punch=[['hook', 'thanos'], ['hook', '40'], ['c1', 'frontier'], ['c1', 'thanos'], ['c1', '40'], ['c1', 'virtual'], ['c1', 'fighter'], ['c1', 'angel'], ['c1', 'done']],
   blowouts=[['c1', 'done']], blackFlash=[['c1']], streaks=[['c1', 'virtual']]),
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
json.dump(CFG, open('src/v6.cfg.json', 'w')); print('cfg ok')
