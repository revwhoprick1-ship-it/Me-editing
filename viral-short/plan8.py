# R3born Ep2 batch 2 (VverPaldo style): hook (wildest second) -> rewind -> scene, cut BEFORE it resolves (brief: send them to the episode).
# Writes into src/edits.gen.json + src/r3.cfg.json. Source: public/r3ep2.mp4 (gitignored). Crops from autoplan (src/tracks/r3).
import json, sys
W = [w for s in json.load(open(sys.argv[1])) for w in s['w']]
A = json.load(open('src/tracks/r3b/auto_edits.json'))
CR = {k: [tuple(c) for c in v['crops']] for k, v in A.items()}
FIX = {'fuck': 'f***', 'fucking': 'f***ing', 'shitting': 'sh*tting', 'shit': 'sh*t', 'dumbass': 'dumba**'}
ATW = {(148.8, 'lot'): 'lat?', (436.8, 'bring'): 'burned', (720.6, 'pool'): 'pole', (450.8, 'chat'): 'ChatGPT', (451.0, 'gpt'): '', (247.3, 'hold'): 'Pole', (247.9, 'answer'): 'dancer?', (252.7, 'put'): 'pole', (252.8, 'answer'): 'dance', (253.6, 'it'): '', (259.4, 'throwing'): 'thrown at',
       (213.4, "i'd"): "I", (213.8, 'hundred'): '100…', (214.0, 'hundred'): '', (213.7, 'a'): '', (215.1, 'hundred'): '103', (215.3, 'and'): '', (215.5, 'three'): '',
       (684.8, 'the'): 'What the', (687.4, 'cuz'): "'cause"}
def crops(eid, a, b):
    c = [x for x in CR[eid] if a - 0.01 <= x[0] < b]; prev = [x for x in CR[eid] if x[0] <= a]
    return ([(a, prev[-1][1])] if prev else []) + [x for x in c if x[0] > a + 0.01]
RW = 12
EDITS = {
 'r3stakes': [('hook', 40.15, 41.75), ('rw', 41.75, 27.50, None), ('c1', 27.50, 44.20)],
 'r3hand': [('hook', 387.40, 388.90), ('rw', 388.90, 379.55, None), ('c1', 379.55, 391.50), ('c2', 397.80, 402.40)],
 'r3reformer': [('hook', 159.40, 160.60), ('rw', 160.60, 132.00, None), ('c1', 132.00, 137.50), ('c2', 145.50, 160.60)],
 'r3chatgpt': [('hook', 436.25, 439.80), ('rw', 439.80, 430.55, None), ('c1', 430.55, 439.80), ('c2', 448.15, 457.45)],
 'r3reveal': [('hook', 736.90, 738.30), ('rw', 738.30, 718.75, None), ('c1', 718.75, 731.20), ('c2', 736.90, 741.90)],
}
SRCMAP = {'r3stakes': 'stakes', 'r3hand': 'handstand', 'r3reformer': 'reformer', 'r3chatgpt': 'genes', 'r3reveal': 'reveal'}
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
 'r3stakes': dict(top='Loser gets WAXED…', hl={'WAXED…': '#FF2A2A'}, music=['chess_n', 110], ctaAt=['c1', 'okay'],
   tints=[[['hook', 'wax'], R], [['c1', 'winning'], G], [['c1', 'losing'], R], [['c1', 'wax'], R]], rizz=[['c1', 'winning']],
   punch=[['hook', 'wax'], ['hook', 'armpit'], ['c1', 'calories'], ['c1', 'winning'], ['c1', 'losing'], ['c1', 'punishment'], ['c1', 'spicy'], ['c1', 'wax'], ['c1', 'hairy'], ['c1', 'waxing']],
   blowouts=[['c1', 'wax']], blackFlash=[['c1']], streaks=[['c1', 'lose']]),
 'r3hand': dict(top='N3on tried a HANDSTAND', hl={'HANDSTAND': '#FF2A2A'}, music=['phonk_n', 90], ctaAt=['c1', 'tuck'],
   tints=[[['hook', 'nothing'], R], [['c1', 'kick'], G], [['c1', 'butt'], R], [['c2', 'stripper'], R]], rizz=[['c1', 'kick']],
   punch=[['hook', 'nothing'], ['hook', 'look'], ['c1', 'kick'], ['c1', 'tuck'], ['c1', 'butt'], ['c1', 'nothing'], ['c2', 'again'], ['c2', 'trusted'], ['c2', 'stripper'], ['c2', 'sarah']],
   blowouts=[['c2', 'stripper']], blackFlash=[['c1']], streaks=[['c2']]),
 'r3reformer': dict(top='Pilates BROKE N3on', hl={'BROKE': '#FF2A2A'}, music=['goodbye_n', 15], ctaAt=['c2', 'inhale'],
   tints=[[['hook', 'sh*t'], R], [['c2', 'lats'], G], [['c2', 'f***'], R], [['c2', 'fire'], R]], rizz=[['c2', 'lats']],
   punch=[['hook', 'doing'], ['hook', 'sh*t'], ['c2', 'f***'], ['c2', 'lat?'], ['c2', 'abs'], ['c2', 'fire'], ['c2', 'me'], ['c2', 'sh*t']],
   blowouts=[['c2', 'fire']], blackFlash=[['c1']], streaks=[['c2']]),
 'r3chatgpt': dict(top="N3on's excuse after losing AGAIN", hl={'AGAIN': '#FF2A2A'}, music=['chess_n', 30], ctaAt=['c2', 'chat'],
   tints=[[['hook', '50'], R], [['hook', 'crushed'], R], [['c1', 'hundred'], G], [['c2', 'chat'], G], [['c2', 'lebron'], G]], rizz=[['c2', 'chat'], ['c2', 'lebron']],
   punch=[['hook', '50'], ['hook', 'exactly'], ['hook', 'crushed'], ['c1', 'calories'], ['c1', 'hundred'], ['c1', '50'], ['c2', 'genes'], ['c2', 'chat'], ['c2', 'men'], ['c2', 'comeback'], ['c2', 'lebron']],
   blowouts=[['c2', 'lebron']], blackFlash=[['c1']], streaks=[['c2']]),
 'r3reveal': dict(top='N3on vs Sarah… FINAL score', hl={'FINAL': '#FF2A2A'}, music=['phonk_n', 40], ctaAt=['c1', 'okay'],
   tints=[[['hook', '389'], G], [['c1', 'won'], G], [['c1', '326'], R], [['c2', '389'], G]], rizz=[['c1', 'won'], ['c2', '389']],
   punch=[['hook', '389'], ['hook', 'dumba**'], ['c1', 'stripper'], ['c1', 'won'], ['c1', 'grand'], ['c1', '326'], ['c1', 'dumba**'], ['c2', '389'], ['c2', 'eyebrow'], ['c2', 'calf']],
   blowouts=[['c2', '389']], blackFlash=[['c1']], streaks=[['c2']]),
}
for eid, c in CFG.items():
    c.update(cta=CTA, track='none', calls=[], src='r3ep2.mp4', intro=True)
    sc = {s['id']: s for s in gen[eid]}
    for key in ('tints', 'rizz', 'punch', 'blowouts', 'blackFlash', 'streaks', 'ctaAt'):
        refs = c[key] if key != 'tints' else [r for r, _ in c[key]]
        if key == 'ctaAt': refs = [refs]
        for r in refs:
            if len(r) == 1: assert r[0] in sc, (eid, r); continue
            ws = [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())]
            assert len(ws) > (r[2] if len(r) > 2 else 0), (eid, key, r, [w['word'] for w in sc[r[0]]['words']])
json.dump(CFG, open('src/r3b.cfg.json', 'w')); print('cfg ok')
