# 3 more "guess the fake" edits: builds src/edits.gen.json from Whisper word timings (scratchpad tx.json).
# Each edit = hook (craziest line, ~2-3 s) + one long continuous source section (>= 8 s, campaign rule). Scene boundaries
# sit on the source's own camera cuts (scdet) so no sub-second fragments; crops = [shot start sec, centre x in 1920 px].
import json, sys
tx = json.load(open(sys.argv[1])); W = [w for s in tx for w in s['w']]
AT = {4.46: 'off', 4.78: '', 5.12: 'Shib?', 13.08: 'How', 13.10: 'is', 14.14: 'e-commerce?', 14.26: '', 16.54: 'e-commerce', 16.78: '', 275.38: 'this', 275.90: 'I', 276.84: 'He', 277.10: 'sucks', 273.42: 'had', 273.52: 'to', 273.62: 'sell', 398.90: '$1K', 399.24: 'and', 399.44: 'got', 399.60: '', 399.68: '$100K?', 397.92: '$100K', 394.34: '100x', 401.24: '100x', 1364.96: 'LARPER', 1365.20: '', 1371.14: '35', 398.06: '', 395.88: 'LARP'}
FIX = {'stop': '', 'amira': 'Emira', 'amgt': 'AMG', 'six-free': 'GT 63', 'six': 'GT', '-free': '63', 'm3': 'M3', 'shitcoin': 'shitcoin', '10': '10%', '%': '', '98': '98%', '100k': '$100K', '$400k': '$400K'}
EDITS = {
 'bowling': [
  ('hook', 357.40, 359.30, [(357.40, 960)]),
  ('main', 350.04, 362.10, [(350.04, 960), (352.40, 960), (353.28, 1280), (355.88, 960), (357.16, 960), (359.32, 960), (360.12, 1100)])],
 'coin400k': [
  ('hook', 290.96, 294.20, [(290.96, 960)]),
  ('main', 286.40, 303.16, [(286.40, 960), (290.04, 960), (290.96, 960), (294.88, 960), (296.24, 980), (297.92, 960)])],
 # loop edits (no hook/rewind: the last line flows straight back into the first line -> replays)
 'mustangs': [
  ('main', 269.40, 281.22, [(269.40, 900), (272.92, 800), (273.84, 760), (275.64, 560), (278.04, 960)])],
 'shiba': [
  ('main', 389.98, 404.72, [(389.98, 960), (394.96, 1040), (396.48, 960), (400.72, 960)])],
 'icebath': [
  ('main', 1360.84, 1376.30, [(1360.84, 1300), (1362.24, 960), (1364.44, 540), (1366.04, 960), (1371.04, 1050), (1371.92, 600), (1373.76, 1000)])],
 # same clips as the user's reference Shorts (YRs8B6FaVbE / IeC6Lxv_EvQ montage, 0UpfENqRCXQ mustangs), snapped to camera cuts
 'refmontage': [
  ('hook', 217.12, 218.72, [(217.12, 800)]),
  ('lotus', 218.72, 221.28, [(218.72, 900)]),
  ('whichcar', 227.52, 228.56, [(227.52, 960)]),
  ('mercedes', 228.56, 230.68, [(228.56, 900)]),
  ('m3', 244.20, 246.28, [(244.20, 900)]),
  ('mom', 246.28, 247.36, [(246.28, 960)]),
  ('main', 267.12, 284.40, [(267.12, 760), (272.92, 800), (273.84, 760), (275.64, 560), (278.04, 960)])],
 'reflaugh': [
  ('hook', 273.84, 275.64, [(273.84, 760)]),
  ('main', 269.40, 284.40, [(269.40, 900), (272.92, 800), (273.84, 760), (275.64, 560), (278.04, 960)])],
 'intro': [   # the episode's own cold open: one continuous 24.5 s run, ends on "This is Guess the Crypto LARP" -> loops into "Here are seven people"
  ('main', 0.04, 24.58, [(0.04, 960), (5.92, 1000), (13.24, 900), (14.60, 960), (16.04, 600), (17.04, 540), (18.12, 960), (19.96, 920), (20.92, 860), (23.24, 960)])],
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
                tt = AT[round(ws, 2)] if round(ws, 2) in AT else FIX.get(t.lower().strip(',.?'), t.strip(',.'))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': a, 'durationInFrames': n, 'cropX': crops[0][1], 'crops': [[round((s - a) * 30), x] for s, x in crops], 'words': words})
    out[eid] = scenes
    print(eid, sum(s['durationInFrames'] for s in scenes) / 30, 's')
    for s in scenes: print(' ', s['id'], ' '.join(f"{w['word']}@{w['startFrame']}" for w in s['words']))
json.dump(out, open(sys.argv[2], 'w'))
