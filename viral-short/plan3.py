# 3 more "guess the fake" edits: builds src/edits.gen.json from Whisper word timings (scratchpad tx.json).
# Each edit = hook (craziest line, ~2-3 s) + one long continuous source section (>= 8 s, campaign rule). Scene boundaries
# sit on the source's own camera cuts (scdet) so no sub-second fragments; crops = [shot start sec, centre x in 1920 px].
import json, sys
tx = json.load(open(sys.argv[1])); W = [w for s in tx for w in s['w']]
FIX = {'shitcoin': 'shitcoin', '10': '10%', '%': '', '98': '98%', '100k': '$100K', '$400k': '$400K'}
EDITS = {
 'bowling': [
  ('hook', 357.40, 359.30, [(357.40, 960)]),
  ('main', 350.04, 362.10, [(350.04, 960), (352.40, 960), (353.28, 1280), (355.88, 960), (357.16, 960), (359.32, 960), (360.12, 1100)])],
 'coin400k': [
  ('hook', 290.96, 294.20, [(290.96, 960)]),
  ('main', 286.40, 303.16, [(286.40, 960), (290.04, 960), (290.96, 960), (294.88, 960), (296.24, 980), (297.92, 960)])],
 'sevenfigs': [
  ('hook', 331.56, 334.20, [(331.56, 840), (332.96, 960)]),
  ('main', 322.05, 334.20, [(322.05, 560), (324.28, 960), (326.32, 960), (329.00, 920), (331.56, 840), (332.96, 960)])],
}
out = {}
for eid, plan in EDITS.items():
    scenes = []
    for sid, a, b, crops in plan:
        n = round((b - a) * 30); words = []
        for (ws, we, t) in W:
            if a - 0.05 <= ws < b - 0.05:
                tt = FIX.get(t.lower().strip(',.?'), t.strip(',.'))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': a, 'durationInFrames': n, 'cropX': crops[0][1], 'crops': [[round((s - a) * 30), x] for s, x in crops], 'words': words})
    out[eid] = scenes
    print(eid, sum(s['durationInFrames'] for s in scenes) / 30, 's')
    for s in scenes: print(' ', s['id'], ' '.join(f"{w['word']}@{w['startFrame']}" for w in s['words']))
json.dump(out, open(sys.argv[2], 'w'))
