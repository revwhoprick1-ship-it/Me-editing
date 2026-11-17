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
 'arfits': dict(scenes=[('hook', 'v20', 26.05, 28.40, 250), ('c1', 'v20', 0.00, 8.45, 250), ('c2', 'v20', 8.48, 12.20, 250), ('c3', 'v20', 28.70, 31.00, 0)], srcVol=1,
   focus=dict(x=486, y=420, r=230, dur=22), circles=[('c1', 2.85, 1.3, 820, 370, 80)],
   top='The best fits at The Arena, Camp Flog Gnaw', hl={'Arena,': GR}, sub='The Arena · Camp Flog Gnaw', music=['xcool_n', 0], ask=[[['hook'], 'Which fit wins?']],
   tints=[[['c1', 'made'], G], [['c2', 'anime'], G]], rizz=[['c1', 'made']],
   punch=[['hook', 'video'], ['hook', 'fit'], ['c1', 'best'], ['c1', 'Arena'], ['c1', 'hat'], ['c1', 'made'], ['c1', 'design'], ['c2', 'pink'], ['c2', 'anime'], ['c3', 'strawberry']],
   blowouts=[], blackFlash=[], streaks=[['c1'], ['c3']],
   extras=[sfx(['c1', 'made'], 's_wow.mp3', 0.4), pop(['c2', 'character'], 'e_heart.png', 's_correct.mp3', off=10)]),
 'aranime': dict(scenes=[('hook', 'v20', 22.90, 25.10, 250), ('c1', 'v20', 31.84, 33.50, 250), ('c2', 'v20', 34.25, 40.30, 250), ('c3', 'v20', 17.20, 22.85, 250)], srcVol=1,
   focus=dict(x=540, y=330, r=230, dur=22), circles=[('c3', 3.3, 1.3, 1050, 690, 90)],
   top='The Arena asked the REAL anime questions', hl={'REAL': RD}, sub='The Arena · Camp Flog Gnaw', music=['aura_n', 0], ask=[[['hook'], 'Your anime pick for a day?']],
   tints=[[['c2', 'Yusuke'], G], [['c2', 'strongest'], G]], rizz=[['c2', 'Yusuke']],
   punch=[['hook', 'mouthpiece'], ['c1', 'anime'], ['c1', 'day'], ['c2', 'Yusuke'], ['c2', 'Hakusho'], ['c2', 'strongest'], ['c2', 'show'], ['c3', 'merch'], ['c3', 'blind'], ['c3', 'get']],
   blowouts=[], blackFlash=[], streaks=[['c1'], ['c3']],
   extras=[sfx(['hook', 'mouthpiece'], 's_huh.mp3'), pop(['c2', 'show'], 'e_laugh.png', 's_ahh.mp3', off=8)]),
 'arpunch': dict(scenes=[('hook', 'v20', 48.40, 49.35, 250), ('c1', 'v20', 44.55, 52.90, 250), ('c2', 'v05', 0.00, 3.30, 420), ('c3', 'v05', 6.20, 9.70, 420)], srcVol=1,
   focus=dict(x=540, y=330, r=230, dur=22), circles=[('c1', 7.2, 1.2, 1075, 560, 90)],
   top='Punching bag challenge at The Arena', hl={'Arena': GR}, sub='The Arena · Camp Flog Gnaw', music=['phonk_n', 40], ask=[[['hook'], 'Could you hit harder?']],
   tints=[[['c1', 'strength'], R]], rizz=[], punch=[['hook', 'see'], ['c1', 'punching'], ['c1', 'challenge'], ['c1', 'strength'], ['c1', 'three'], ['c1', 'two'], ['c1', 'one'], ['c1', 'hit']],
   blowouts=[['c1', 'hit']], blackFlash=[], streaks=[['c2'], ['c3']],
   extras=[sfx(['c1', 'hit'], 'hit.mp3', 0.6, off=10), sfx(['c2'], 's_whoosh.mp3', 0.4), sfx(['c2'], 'hit.mp3', 0.5, off=14), sfx(['c3'], 'hit.mp3', 0.5, off=26), pop(['c3'], 'e_laugh.png', 's_huh.mp3', off=60)]),
 'armerch': dict(scenes=[('hook', 'v09', 57.00, 58.00, 420), ('c1', 'v11', 0.00, 6.00, 0), ('c2', 'v09', 8.00, 9.00, 420), ('c3', 'v11', 6.00, 12.40, 0), ('c4', 'v09', 25.00, 27.00, 420)], srcVol=0.12,
   focus=dict(x=490, y=440, r=230, dur=22), circles=[('c3', 2.6, 0.7, 1553, 351, 150, 721, 621)],
   top="The Arena's first merch drop. Only at Camp Flog Gnaw", hl={"Arena's": GR}, sub='Limited edition · Fatal Fury', music=['montagem_n', 25], ask=[[['hook'], 'What are you copping first?']],
   tints=[[['c2'], G]], rizz=[['c2']], punch=[['hook'], ['c2'], ['c4']], blowouts=[], blackFlash=[], streaks=[['c1'], ['c2'], ['c3'], ['c4']],
   extras=[sfx(['hook'], 's_camflash.mp3', 0.45), sfx(['c1'], 's_ding.mp3', 0.35, off=10), pop(['c4'], 'e_heart.png', 's_wow.mp3', off=20)]),
 'ararcade': dict(scenes=[('hook', 'v09', 48.55, 49.35, 330), ('c1', 'v12', 0.00, 4.50, 0), ('c2', 'v09', 17.90, 19.00, 420), ('c3', 'v12', 8.00, 12.50, 0), ('c4', 'v09', 49.00, 50.00, 420),
                         ('c5', 'v09', 51.00, 52.20, 420), ('c6', 'v09', 53.00, 55.00, 420)], srcVol=0.12,
   focus=dict(x=540, y=260, r=220, dur=20), circles=[('c3', 1.0, 1.4, 945, 450, 200)],
   top='The Arena turned Camp Flog Gnaw into an arcade', hl={'arcade': GR}, sub='Free arcade games · The Arena', music=['aura_n', 0], ask=[[['hook'], 'KOF or Metal Slug?']],
   tints=[[['c4'], G]], rizz=[['c4']], punch=[['hook'], ['c2'], ['c4'], ['c5'], ['c6']], blowouts=[], blackFlash=[], streaks=[['c1'], ['c2'], ['c3'], ['c4'], ['c5'], ['c6']],
   extras=[sfx(['hook'], 's_camflash.mp3', 0.45), sfx(['c1'], 'pop.mp3', 0.4, off=10), pop(['c4'], 'e_heart.png', 's_wow.mp3', off=16)]),
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
    c = {k: v for k, v in spec.items() if k not in ('scenes', 'circles')}
    st = {s['id']: s['videoStartSec'] for s in scenes}; calls, trk = [], {}
    for sid, o, d, x, y, r, *end in spec.get('circles', []):
        a = st[sid] + o; calls.append([round(a, 2), round(a + d, 2), '']); x2, y2 = end if end else (x, y); n = round(d * 50) + 2
        for k in range(n): u = min(1, k / (n - 2)); trk[f'{a + k / 50:.2f}'] = [round(x + (x2 - x) * u), round(y + (y2 - y) * u), r]
    c['trackData'] = trk
    for e in c['extras']:
        if e.get('y') is None: e.pop('y', None)
    c.update(cta='The Arena · @thearenahq', ctaEnd=True, ask=[{'at': r, 'text': tx} for r, tx in c['ask']], track='none', calls=calls, src=f'g67_{eid}.mp4',
             intro=False, hardcut=True, cutSfx='s_camflash.mp3', sat=1.1, progress=True, popMid=True, noSkull=True)
    sc = {s['id']: s for s in scenes}
    for r in [r for r, _ in c['tints']] + [q['at'] for q in c['ask']] + [e['at'] for e in c['extras']] + sum((c[k] for k in ('rizz', 'punch', 'blowouts', 'blackFlash', 'streaks')), []):
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())], (eid, r, [w['word'] for w in sc[r[0]]['words']])
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/arena.cfg.json', 'w'), indent=1); print('cfg ok')
