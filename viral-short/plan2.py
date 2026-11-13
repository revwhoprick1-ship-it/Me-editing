# LARPER cut: builds viral-short/src/clipData.ts from Whisper word timings; crops = per source shot (scdet) centre x
import json, sys
tx = json.load(open(sys.argv[1])); out = sys.argv[2]
W = [w for s in tx for w in s['w']]
FIX = {'maritz.': 'Maurits', 'maritz': 'Maurits', 'police': 'please', 'larp.': 'LARP', 'larp,': 'LARP', 'larp?': 'LARP?', 'larp': 'LARP'}
AT = {1547.13: "You're", 1547.37: 'LARP?', 1518.88: 'LARPER'}  # match the source's own burned-in subtitles
PLAN = [  # id, start, end, [(shot start sec, centre x)]
  ('hook', 1547.04, 1550.12, [(1547.04, 1300), (1548.16, 720)]),
  ('votes', 1507.56, 1523.96, [(1507.56, 960), (1509.12, 1040), (1511.28, 1300), (1512.40, 960)]),
  ('reveal', 1543.90, 1550.12, [(1543.90, 700), (1544.32, 960), (1546.08, 720), (1547.04, 1300), (1548.16, 720)]),
  ('fairplay', 1553.45, 1561.40, [(1553.45, 860), (1554.16, 600), (1555.04, 560), (1556.08, 980), (1558.96, 960)]),
]
scenes = []
for sid, a, b, crops in PLAN:
    n = round((b - a) * 30); words = []
    for (ws, we, t) in W:
        if a - 0.05 <= ws < b - 0.05:
            tt = AT.get(round(ws, 2)) or FIX.get(t.lower(), t.strip(',.'))
            f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
            words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
    for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
    scenes.append({'id': sid, 'videoStartSec': a, 'durationInFrames': n, 'cropX': crops[0][1],
                   'crops': [[round((s - a) * 30), x] for s, x in crops], 'words': words})
ts = 'export interface WordTiming { word: string; startFrame: number; endFrame: number; color?: string; flash?: boolean }\n'
ts += 'export interface SceneConfig { id: string; videoStartSec: number; durationInFrames: number; cropX: number; crops?: [number, number][]; words: WordTiming[] }\n'
ts += '// generated from Whisper word timings of the source (scratchpad plan2.py); crops = [scene frame, centre x in the 1920x1080 source] per source shot\n'
ts += 'export const SCENES: SceneConfig[] = ' + json.dumps(scenes) + ';\n'
ts += f'export const TOTAL_FRAMES = {sum(s["durationInFrames"] for s in scenes)};\n'
open(out, 'w').write(ts)
for s in scenes: print(s['id'], s['durationInFrames'], ' '.join(f"{w['word']}@{w['startFrame']}" for w in s['words']))
print('total', sum(s['durationInFrames'] for s in scenes) / 30, 's')
