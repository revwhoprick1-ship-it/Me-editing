# Trevor stream clips (Backyard Breaks sheet) re-edited in the v5 formula: hook -> rewind -> scene with payoff, 18-22 s.
import json, sys
TX = sys.argv[1]  # dir with <source>.json Whisper word timings
FIX = {'tuddy': 'TD', 'selly': 'celly'}
ATW = {(23.1, '10'): '10', (23.4, '-10'): '-10', (27.6, '10'): '10', (27.8, '-10'): '-10'}
RW = 12
EDITS = {  # id: (source, [(scene, a, b) | (rw, from, to, None)])
 'tvfans': ('t3_traveling_trevors', [('hook', 77.75, 82.70), ('rw', 82.70, 72.75, None), ('c1', 72.75, 82.70), ('c2', 91.65, 98.55)]),
 'tvneck': ('t6_davis_mills_joke', [('hook', 7.10, 11.10), ('rw', 11.10, 1.35, None), ('c1', 1.35, 16.80)]),
 'tvticket': ('t4_natty_ticket', [('hook', 13.85, 17.35), ('rw', 17.35, 9.75, None), ('c1', 9.75, 13.85), ('c2', 20.75, 31.65)]),
 'tvant': ('t1_tiger_auto_pen', [('hook', 14.85, 18.35), ('rw', 18.35, 7.05, None), ('c1', 7.05, 25.2)]),
 'tvcelly': ('u2_psa10_celly', [('hook', 25.45, 28.85), ('rw', 28.85, 14.95, None), ('c1', 14.95, 32.4)]),
}
gen = json.load(open('src/edits.gen.json'))
for eid, (src, plan) in EDITS.items():
    W = [w for s in json.load(open(f'{TX}/{src}.json')) for w in s['w']]; scenes = []
    for p in plan:
        sid, a, b = p[:3]
        if len(p) == 4:
            scenes.append({'id': sid, 'videoStartSec': b, 'durationInFrames': RW, 'cropX': 960, 'crops': [[0, 960]], 'rewind': [a, b], 'words': []}); continue
        n = round((b - a) * 30); words = []
        for (ws, we, t) in W:
            if a - 0.05 <= ws < b - 0.05:
                k = (round(ws, 1), t.lower().strip(',.?!')); tt = ATW.get(k) or FIX.get(t.lower().strip(',.?!'), t.strip(',.'))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1, 0, -1):
            if words[i]['word'].startswith('-'): words[i-1]['word'] += words[i]['word']; words.pop(i)
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': a, 'durationInFrames': n, 'cropX': 960, 'crops': [[0, 960]], 'words': words})
    gen[eid] = scenes
    print(eid, round(sum(s['durationInFrames'] for s in scenes) / 30, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:330])
json.dump(gen, open('src/edits.gen.json', 'w'))
G, R = 'G', 'R'
CFG = {
 'tvfans': dict(top='NFL QB rates his SUPERFANS honestly', hl={'SUPERFANS': '#FF2A2A'}, cta='*would you call them wack?*', music=['chess_n', 20], ctaAt=['c2', 'then'], src='t3_traveling_trevors.mp4',
   tints=[[['hook', 'wack'], R], [['c1', 'weird'], R], [['c1', 'wack'], R], [['c2', 'funny'], G]], rizz=[['c2', 'funny']],
   punch=[['hook', 'wack'], ['c1', 'weird'], ['c1', 'giggling'], ['c1', 'first'], ['c1', 'wack'], ['c2', 'second'], ['c2', 'playing'], ['c2', 'funny']],
   blowouts=[['c1', 'wack']], blackFlash=[['c1']], streaks=[['c2']]),
 'tvneck': dict(top='The meanest card roast ever', hl={'meanest': '#FF2A2A'}, cta='*who has the longer neck?*', music=['phonk_n', 60], ctaAt=['c1', 'oh'], src='t6_davis_mills_joke.mp4',
   tints=[[['hook', 'ew'], R], [['c1', 'davis'], G], [['c1', 'ew'], R], [['c1', 'neck'], R]], rizz=[['c1', 'davis']],
   punch=[['hook', 'ew'], ['hook', 'neck'], ['hook', 'glennon'], ['c1', 'davis'], ['c1', 'ew'], ['c1', 'longer'], ['c1', 'neck'], ['c1', 'glennon'], ['c1', 'trevor']],
   blowouts=[['c1', 'ew']], blackFlash=[['c1']], streaks=[['c1', 'davis']]),
 'tvticket': dict(top='Gifting an NFL QB… HIMSELF', hl={'HIMSELF': '#FF2A2A'}, cta='*would you gift him this?*', music=['goodbye_n', 28], ctaAt=['c2', 'mvp'], src='t4_natty_ticket.mp4',
   tints=[[['hook', 'weird'], R], [['c2', 'signed'], G], [['c2', 'championship'], G], [['c2', 'sweet'], G]], rizz=[['c2', 'signed'], ['c2', 'sweet']],
   punch=[['hook', 'weird'], ['hook', 'gifting'], ['c1', 'gift'], ['c2', 'signed'], ['c2', 'national'], ['c2', 'mvp'], ['c2', 'signature'], ['c2', 'clemson'], ['c2', 'sweet']],
   blowouts=[['c2', 'signed']], blackFlash=[['c1']], streaks=[['c2']]),
 'tvant': dict(top='His autograph looks like an ANT', hl={'ANT': '#FF2A2A'}, cta='*whose auto is the worst?*', music=['chess_n', 80], ctaAt=['c1', 'yes'], src='t1_tiger_auto_pen.mp4',
   tints=[[['hook', 'ant'], R], [['c1', 'respect'], R], [['c1', 'ant'], R], [['c1', 'beautiful'], G]], rizz=[['c1', 'beautiful']],
   punch=[['hook', 'ant'], ['hook', 'a'], ['c1', 'respect'], ['c1', 'anthony'], ['c1', 'ant'], ['c1', 'big'], ['c1', 'respect', 1], ['c1', 'consistent'], ['c1', 'beautiful']],
   blowouts=[['c1', 'ant']], blackFlash=[['c1']], streaks=[['c1', 'yes']]),
 'tvcelly': dict(top='They invented his touchdown celly', hl={'touchdown': '#58EE28'}, cta='*would you do this celly?*', music=['phonk_n', 15], ctaAt=['c1', 'so', 1], src='u2_psa10_celly.mp4',
   tints=[[['hook', '10'], G], [['c1', 'psa'], G], [['c1', 'like', 4], G], [['c1', 'no!'], R]], rizz=[['c1', 'psa'], ['c1', 'like', 4]],
   punch=[['hook', 'point'], ['hook', '10'], ['c1', 'stadium'], ['c1', 'point'], ['c1', 'psa'], ['c1', 'best'], ['c1', '10'], ['c1', 'easy'], ['c1', 'no!']],
   blowouts=[['c1', '10']], blackFlash=[['c1']], streaks=[['c1', 'so']]),
}
for eid, c in CFG.items():
    c.update(track='none', calls=[])
    sc = {s['id']: s for s in gen[eid]}
    for key in ('tints', 'rizz', 'punch', 'blowouts', 'blackFlash', 'streaks', 'ctaAt'):
        refs = c[key] if key != 'tints' else [r for r, _ in c[key]]
        if key == 'ctaAt': refs = [refs]
        for r in refs:
            if len(r) == 1: assert r[0] in sc, (eid, r); continue
            ws = [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())]
            assert len(ws) > (r[2] if len(r) > 2 else 0), (eid, key, r, [w['word'] for w in sc[r[0]]['words']])
json.dump(CFG, open('src/tv.cfg.json', 'w')); print('cfg ok')
