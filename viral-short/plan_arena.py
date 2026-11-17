# Clipfarm x The Arena (Camp Flog Gnaw, Nov 17): 5 VverPaldo-style edits from the official folder only.
# Every edit names The Arena on screen (top text + yellow line) - caption/tag rule is in the description.
# Sources: <dl dir>/vNN.* (vertical 1080x1920 -> 1080 square at y0 padded into the 1920x1080 frame; horizontal used as is).
# Excerpts public/g67_<id>.mp4 = the edit's scene windows in order, graded 67 (+ slightly cooler).
# Usage: python3 plan_arena.py <dl dir> <tx dir> [--no-excerpts]
import glob, json, subprocess, sys
DL, TX = sys.argv[1], sys.argv[2]
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.74:5:5:0,"
       "eq=contrast=1.113:saturation=1.26:gamma=0.98,curves=all='0/0 0.25/0.21 0.75/0.81 1/1',unsharp=3:3:0.79,"
       "colortemperature=temperature=8000,eq=saturation=0.96,format=yuv420p")
FIX = {('v20', 2.08): 'Gnaw.', ('v20', 1.94): 'Camp Flog', ('v20', 35.02): 'Hakusho.', ('v20', 35.2): '', ('v20', 38.02): 'want', ('v20', 41.28): 'Cup',
       ('v20', 31.1): '', ('v20', 31.2): '', ('v20', 31.34): '', ('v20', 31.62): ''}
def src(v): return glob.glob(f'{DL}/{v}.*')[0]
def vert(v): return json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-select_streams', 'v:0', '-of', 'json', src(v)], capture_output=True, text=True).stdout)['streams'][0]['height'] > 1200
G, R = 'G', 'R'; Y = '#FFE14A'; W_ = '#FFFFFF'; RD = '#FF2A2A'; GR = '#58EE28'
def txt(at, text, color=Y, size=100, off=0, y=560, dur=30): return dict(at=at, kind='txt', file=text, color=color, size=size, off=off, dur=dur, y=y)
def pop(at, f, react=None, off=0): return dict(at=at, kind='png', file=f, off=off, **({'sfx': react, 'sv': 0.45} if react else {}))
def ov(at, f, sfx, dur=34, op=0.5, off=0): return dict(at=at, kind='ov', file=f, dur=dur, sfx=sfx, sv=0.45, op=op, off=off)
def sfx(at, f, v=0.5, off=0): return dict(at=at, kind='sfx', file=f, v=v, off=off)
# scene = (id, video, a, b, y0 for vertical crop)
E = {
 'arfits': dict(scenes=[('hook', 'v20', 28.70, 30.60, 250), ('c1', 'v20', 0.00, 8.45, 250), ('c2', 'v20', 8.48, 12.20, 250), ('c3', 'v20', 26.10, 28.40, 250)], srcVol=1,
   top='The best fits at The Arena, Camp Flog Gnaw', hl={'Arena,': GR}, sub='The Arena · Camp Flog Gnaw', music=['xcool_n', 0], ask=[[['hook'], 'Which fit wins?']],
   tints=[[['c1', 'made'], G], [['c2', 'anime'], G]], rizz=[['c1', 'made']],
   punch=[['hook', 'strawberry'], ['c1', 'best'], ['c1', 'Arena'], ['c1', 'hat'], ['c1', 'made'], ['c1', 'design'], ['c2', 'pink'], ['c2', 'anime'], ['c3', 'video'], ['c3', 'fit']],
   blowouts=[], blackFlash=[], streaks=[['c1'], ['c3']],
   extras=[txt(['c1', 'made'], 'THEY MADE IT THEMSELVES', size=90, dur=40), sfx(['c1', 'made'], 's_wow.mp3', 0.4), txt(['c2', 'pink'], 'PINK HAIR', color='#FF6FB5', size=120, dur=30), pop(['c2', 'character'], 'e_heart.png', 's_correct.mp3', off=10)]),
 'aranime': dict(scenes=[('hook', 'v20', 22.90, 25.10, 250), ('c1', 'v20', 31.84, 33.50, 250), ('c2', 'v20', 34.25, 40.30, 250), ('c3', 'v20', 17.20, 22.85, 250)], srcVol=1,
   top='The Arena asked the REAL anime questions', hl={'REAL': RD}, sub='The Arena · Camp Flog Gnaw', music=['aura_n', 0], ask=[[['hook'], 'Your anime pick for a day?']],
   tints=[[['c2', 'Yusuke'], G], [['c2', 'strongest'], G]], rizz=[['c2', 'Yusuke']],
   punch=[['hook', 'mouthpiece'], ['c1', 'anime'], ['c1', 'day'], ['c2', 'Yusuke'], ['c2', 'Hakusho'], ['c2', 'strongest'], ['c2', 'show'], ['c3', 'merch'], ['c3', 'blind'], ['c3', 'get']],
   blowouts=[], blackFlash=[], streaks=[['c1'], ['c3']],
   extras=[txt(['hook', 'mouthpiece'], 'BLIND BOX PULL', color=W_, size=90, dur=30), sfx(['hook', 'mouthpiece'], 's_huh.mp3'), txt(['c2', 'Yusuke'], 'YUSUKE', color=GR, size=140, dur=30), sfx(['c2', 'Yusuke'], 's_wow.mp3', 0.4),
           pop(['c2', 'show'], 'e_laugh.png', 's_ahh.mp3', off=8), txt(['c3', 'Exclusive'], 'EXCLUSIVE MERCH', size=90, dur=30), txt(['c3', 'blind'], 'BLIND BOXES', color=RD, size=110, dur=30), sfx(['c3', 'blind'], 's_ding.mp3', 0.4)]),
 'arpunch': dict(scenes=[('hook', 'v20', 51.90, 52.90, 250), ('c1', 'v20', 44.55, 52.90, 250), ('c2', 'v05', 0.00, 3.30, 420), ('c3', 'v05', 6.20, 9.70, 420)], srcVol=1,
   top='Punching bag challenge at The Arena', hl={'Arena': GR}, sub='The Arena · Camp Flog Gnaw', music=['phonk_n', 40], ask=[[['hook'], 'Could you hit harder?']],
   tints=[[['c1', 'strength'], R]], rizz=[], punch=[['c1', 'punching'], ['c1', 'challenge'], ['c1', 'strength'], ['c1', 'three'], ['c1', 'two'], ['c1', 'one'], ['c1', 'hit']],
   blowouts=[['c1', 'hit']], blackFlash=[], streaks=[['c2'], ['c3']],
   extras=[txt(['hook'], 'POW', color=RD, size=170, dur=20, y=None), sfx(['hook'], 'hit.mp3', 0.6, off=4), txt(['c1', 'three'], '3…', color=W_, size=120, dur=14), txt(['c1', 'two'], '2…', color=W_, size=120, dur=14),
           txt(['c1', 'hit'], 'HIT IT', color=RD, size=140, dur=24), sfx(['c1', 'hit'], 'hit.mp3', 0.6, off=10), txt(['c2'], 'ROUND 2: NIGHT', color=Y, size=90, dur=30), sfx(['c2'], 's_whoosh.mp3', 0.4),
           sfx(['c2'], 'hit.mp3', 0.5, off=14), sfx(['c3'], 'hit.mp3', 0.5, off=26), pop(['c3'], 'e_laugh.png', 's_huh.mp3', off=60)]),
 'armerch': dict(scenes=[('hook', 'v09', 5.00, 6.30, 420), ('c1', 'v11', 0.00, 6.00, 0), ('c2', 'v09', 2.00, 3.00, 420), ('c3', 'v11', 6.00, 12.40, 0), ('c4', 'v09', 25.00, 27.00, 420)], srcVol=0.12,
   top="The Arena's first merch drop. Only at Camp Flog Gnaw", hl={"Arena's": GR}, sub='Limited edition · Fatal Fury', music=['montagem_n', 25], ask=[[['hook'], 'What are you copping first?']],
   tints=[[['c2'], G]], rizz=[['c2']], punch=[['hook'], ['c2'], ['c4']], blowouts=[], blackFlash=[], streaks=[['c1'], ['c2'], ['c3'], ['c4']],
   extras=[txt(['hook'], 'FATAL FURY MERCH', color=RD, size=110, dur=36), sfx(['hook'], 's_camflash.mp3', 0.45), txt(['c1'], 'THE ARENA MARKET', size=100, dur=40, off=10), sfx(['c1'], 's_ding.mp3', 0.35, off=10),
           txt(['c2'], 'FIRST DROP EVER', color=GR, size=110, dur=26), txt(['c3'], 'LIMITED EDITION', color=W_, size=110, dur=36, off=30), sfx(['c3'], 's_correct.mp3', 0.4, off=30),
           txt(['c4'], 'ONLY AT CAMP FLOG GNAW', color=Y, size=90, dur=50), pop(['c4'], 'e_heart.png', 's_wow.mp3', off=20)]),
 'ararcade': dict(scenes=[('hook', 'v09', 51.00, 52.20, 420), ('c1', 'v12', 0.00, 4.50, 0), ('c2', 'v09', 19.00, 20.00, 420), ('c3', 'v12', 8.00, 12.50, 0), ('c4', 'v09', 49.00, 50.00, 420),
                         ('c5', 'v09', 22.00, 23.00, 420), ('c6', 'v09', 53.00, 55.00, 420)], srcVol=0.12,
   top='The Arena turned Camp Flog Gnaw into an arcade', hl={'arcade': GR}, sub='Free arcade games · The Arena', music=['aura_n', 0], ask=[[['hook'], 'KOF or Metal Slug?']],
   tints=[[['c4'], G]], rizz=[['c4']], punch=[['hook'], ['c2'], ['c4'], ['c5'], ['c6']], blowouts=[], blackFlash=[], streaks=[['c1'], ['c2'], ['c3'], ['c4'], ['c5'], ['c6']],
   extras=[txt(['hook'], 'FIGHT FOR THIS ARCADE', color=RD, size=100, dur=36), sfx(['hook'], 's_camflash.mp3', 0.45), txt(['c1'], 'METAL SLUG', color=Y, size=120, dur=36, off=10), sfx(['c1'], 'pop.mp3', 0.4, off=10),
           txt(['c2'], 'FREE ARCADE GAMES', color=GR, size=100, dur=30), txt(['c3'], 'TOP PLAYER WINS…', color=W_, size=100, dur=40, off=20), sfx(['c3'], 's_ding.mp3', 0.4, off=20),
           txt(['c4'], 'A 1-OF-1 NEO•GEO ARCADE', color=GR, size=90, dur=28), pop(['c4'], 'e_heart.png', 's_wow.mp3', off=16), txt(['c5'], 'THE KING OF FIGHTERS', color=Y, size=90, dur=30),
           txt(['c6'], 'THE ARENA', color=W_, size=150, dur=60)]),
}
W = {v: [w for s in json.load(open(f'{TX}/{v}.json')) for w in s['w']] for v in ('v20',)}
gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, spec in E.items():
    scenes, t = [], 0.0
    for sid, v, a, b, y0 in spec['scenes']:
        n = round((b - a) * 30); words = []
        for ws, we, tx in W.get(v, []):
            if a - 0.05 <= ws < b - 0.05:
                tt = FIX.get((v, round(ws, 2)), tx.strip(','))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': 960, 'crops': [[0, 960]], 'words': words}); t += n / 30
    gen[eid] = scenes
    print(eid, round(t, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:300])
    if '--no-excerpts' not in sys.argv:
        cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []
        for i, (sid, v, a, b, y0) in enumerate(spec['scenes']):
            d = round((b - a) * 30) / 30
            cmd += ['-ss', f'{a:.3f}', '-t', f'{d:.4f}', '-i', src(v)]
            geo = (f'scale=1080:1920,crop=1080:1080:0:{y0},scale=1088:1088,crop=1088:1080:0:4,pad=1920:1080:416:0:black' if vert(v) else 'scale=1920:1080')
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,{geo},setsar=1,format=yuv420p,trim=duration={d:.4f}[v{i}]')
            fc.append(f'[{i}:a:0]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{d:.4f}[a{i}]')
        k = len(spec['scenes'])
        fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
    c = {k: v for k, v in spec.items() if k != 'scenes'}
    for e in c['extras']:
        if e.get('y') is None: e.pop('y', None)
    c.update(cta='The Arena · @thearenahq', ctaEnd=True, ask=[{'at': r, 'text': tx} for r, tx in c['ask']], track='none', calls=[], src=f'g67_{eid}.mp4',
             intro=False, hardcut=True, cutSfx='s_camflash.mp3', sat=1.1, progress=True, popMid=True, noSkull=True)
    sc = {s['id']: s for s in scenes}
    for r in [r for r, _ in c['tints']] + [q['at'] for q in c['ask']] + [e['at'] for e in c['extras']] + sum((c[k] for k in ('rizz', 'punch', 'blowouts', 'blackFlash', 'streaks')), []):
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())], (eid, r, [w['word'] for w in sc[r[0]]['words']])
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/arena.cfg.json', 'w'), indent=1); print('cfg ok')
