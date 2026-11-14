# R3born Ep2 (HardScope campaign): hook (wildest second) -> rewind -> scene, cut BEFORE it resolves (brief: send them to the episode).
# Writes into src/edits.gen.json + src/r3.cfg.json. Source: public/r3ep2.mp4 (gitignored). Crops from autoplan (src/tracks/r3).
import json, sys
W = [w for s in json.load(open(sys.argv[1])) for w in s['w']]
A = json.load(open('src/tracks/r3/auto_edits.json'))
CR = {k: [tuple(c) for c in v['crops']] for k, v in A.items()}
FIX = {'fuck': 'f***', 'fucking': 'f***ing', 'shitting': 'sh*tting', 'shit': 'sh*t', 'dumbass': 'dumba**'}
ATW = {(247.3, 'hold'): 'Pole', (247.9, 'answer'): 'dancer?', (252.7, 'put'): 'pole', (252.8, 'answer'): 'dance', (253.6, 'it'): '', (259.4, 'throwing'): 'thrown at',
       (213.4, "i'd"): "I", (213.8, 'hundred'): '100…', (214.0, 'hundred'): '', (213.7, 'a'): '', (215.1, 'hundred'): '103', (215.3, 'and'): '', (215.5, 'three'): '',
       (684.8, 'the'): 'What the', (687.4, 'cuz'): "'cause"}
def crops(eid, a, b):
    c = [x for x in CR[eid] if a - 0.01 <= x[0] < b]; prev = [x for x in CR[eid] if x[0] <= a]
    return ([(a, prev[-1][1])] if prev else []) + [x for x in c if x[0] > a + 0.01]
RW = 12
EDITS = {
 'r3wax': [('hook', 753.05, 756.00), ('rw', 756.00, 740.95, None), ('c1', 740.95, 760.20)],
 'r3cheat': [('hook', 684.55, 686.85), ('rw', 686.85, 639.35, None), ('c1', 639.35, 641.95), ('c2', 659.41, 661.95), ('c3', 683.98, 694.62)],
 'r3pole': [('hook', 353.06, 355.23), ('rw', 355.23, 331.75, None), ('c1', 331.75, 340.92), ('c2', 349.39, 356.60)],
 'r3money': [('hook', 254.85, 257.05), ('rw', 257.05, 246.29, None), ('c1', 246.29, 263.10)],
 'r3pilates': [('hook', 212.15, 216.60), ('rw', 216.60, 208.30, None), ('c1', 208.30, 222.40)],
}
SRCMAP = {'r3wax': 'wax', 'r3cheat': 'cheat', 'r3pole': 'pole', 'r3money': 'stripper', 'r3pilates': 'pilates'}
gen = json.load(open('src/edits.gen.json'))
for eid, plan in EDITS.items():
    scenes = []
    for p in plan:
        sid, a, b = p[:3]
        if len(p) == 4:
            scenes.append({'id': sid, 'videoStartSec': b, 'durationInFrames': RW, 'cropX': 960, 'crops': [[0, 960]], 'rewind': [a, b], 'words': []}); continue
        cr = crops(SRCMAP[eid], a, b); n = round((b - a) * 30); words = []
        for (ws, we, t) in W:
            if a - 0.05 <= ws < b - 0.05:
                k = (round(ws, 1), t.lower().strip(',.?!')); tt = ATW[k] if k in ATW else FIX.get(t.lower().strip(',.?!'), t.strip(',.'))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': a, 'durationInFrames': n, 'cropX': cr[0][1], 'crops': [[round((s - a) * 30), x] for s, x in cr], 'words': words})
    gen[eid] = scenes
    print(eid, round(sum(s['durationInFrames'] for s in scenes) / 30, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:400])
json.dump(gen, open('src/edits.gen.json', 'w'))
G, R = 'G', 'R'
CTA = '*full episode on @HardScope*'
CFG = {
 'r3wax': dict(top='N3on lost… so she WAXED him', hl={'WAXED': '#FF2A2A'}, music=['phonk_n', 40], ctaAt=['c1', 'two'],
   tints=[[['hook', 'sue'], R], [['c1', 'hot'], R], [['c1', 'lawyers'], G]], rizz=[['c1', 'lawyers']],
   punch=[['hook', 'sue'], ['hook', 'lawyers'], ['c1', 'calf'], ['c1', 'hot'], ['c1', 'sh*tting'], ['c1', 'touch'], ['c1', 'sue'], ['c1', 'lawyers'], ['c1', 'two'], ['c1', 'one']],
   blowouts=[['c1', 'one']], blackFlash=[['c1']], streaks=[['c1', 'don']]),
 'r3cheat': dict(top='N3on snuck off to CHEAT', hl={'CHEAT': '#FF2A2A'}, music=['goodbye_n', 34], ctaAt=['c3', 'are'],
   tints=[[['hook', 'f***'], R], [['c1', 'restroom'], G], [['c3', 'calories?'], R], [['c3', 'sorry'], G]], rizz=[['c1', 'restroom']],
   punch=[['hook', 'f***'], ['hook', 'doing'], ['c1', '50'], ['c1', 'restroom'], ['c3', 'f***'], ['c3', 'tired'], ['c3', 'burn'], ['c3', 'calories?'], ['c3', 'sorry']],
   blowouts=[['c3', 'calories?']], blackFlash=[['c1']], streaks=[['c2'], ['c3']]),
 'r3pole': dict(top='N3on tried POLE dancing', hl={'POLE': '#FF2A2A'}, music=['chess_n', 50], ctaAt=['c2', 'just'],
   tints=[[['hook', 'stop'], R], [['c1', 'manly'], G], [['c1', 'stupid'], R], [['c2', 'stop'], R]], rizz=[['c1', 'manly'], ['c1', 'spins']],
   punch=[['hook', 'stop'], ['hook', 'stop', 1], ['hook', 'stop', 2], ['c1', 'manly'], ['c1', 'hard'], ['c1', 'stupid'], ['c1', 'spins'], ['c2', 'whoa'], ['c2', 'stop'], ['c2', 'stop', 2]],
   blowouts=[['c2', 'whoa']], blackFlash=[['c1']], streaks=[['c2']]),
 'r3money': dict(top='She made HOW much in ONE night?!', hl={'HOW': '#FF2A2A', 'ONE': '#FF2A2A'}, music=['phonk_n', 70], ctaAt=['c1', 'what'],
   tints=[[['hook', 'stripper'], R], [['c1', '17'], G], [['c1', 'stripper'], R], [['c1', 'grand'], G]], rizz=[['c1', '17'], ['c1', 'grand']],
   punch=[['hook', 'stripper'], ['c1', '17'], ['c1', '17', 1], ['c1', 'clarify'], ['c1', 'stripper'], ['c1', 'stripper', 1], ['c1', 'money'], ['c1', 'three'], ['c1', 'grand']],
   blowouts=[['c1', 'grand']], blackFlash=[['c1']], streaks=[['c1', 'what']]),
 'r3pilates': dict(top='N3on burned 103 calories doing Pilates…', hl={'103': '#FF2A2A'}, music=['goodbye_n', 70], ctaAt=['c1', 'actually'],
   tints=[[['hook', 'malfunction'], R], [['c1', 'embarrassing'], R], [['c1', '103'], R], [['c1', '161'], G]], rizz=[['c1', '161']],
   punch=[['hook', 'malfunction'], ['hook', '103'], ['hook', 'impossible'], ['c1', 'calories'], ['c1', 'embarrassing'], ['c1', 'malfunction'], ['c1', '103'], ['c1', 'impossible'], ['c1', 'generous'], ['c1', '161']],
   blowouts=[['c1', '161']], blackFlash=[['c1']], streaks=[['c1', 'actually']]),
}
for eid, c in CFG.items():
    c.update(cta=CTA, track='none', calls=[], src='r3ep2.mp4')
    sc = {s['id']: s for s in gen[eid]}
    for key in ('tints', 'rizz', 'punch', 'blowouts', 'blackFlash', 'streaks', 'ctaAt'):
        refs = c[key] if key != 'tints' else [r for r, _ in c[key]]
        if key == 'ctaAt': refs = [refs]
        for r in refs:
            if len(r) == 1: assert r[0] in sc, (eid, r); continue
            ws = [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())]
            assert len(ws) > (r[2] if len(r) > 2 else 0), (eid, key, r, [w['word'] for w in sc[r[0]]['words']])
json.dump(CFG, open('src/r3.cfg.json', 'w')); print('cfg ok')
