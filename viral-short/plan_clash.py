# Clipfarm x CLASH (House of Highlights): 5 edits from 'Guess The Secret Heisman Winner' only, original VverPaldo style
# (pre viewer-agent rounds, commit 7df7760): payoff hook + hard cut, centre echo emoji pops, skull top line, one ask pill, promo line last 2.5 s.
# Sources: <dl dir>/vNN.* (vertical 1080x1920 -> 1080 square at y0 padded into the 1920x1080 frame; horizontal used as is).
# Excerpts public/g67_<id>.mp4 = the edit's scene windows in order, graded 67 (+ slightly cooler).
# Usage: python3 plan_arena.py <dl dir> <tx dir> [--no-excerpts]
import glob, json, subprocess, sys
DL, TX = sys.argv[1], sys.argv[2]
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.74:5:5:0,"
       "eq=contrast=1.113:saturation=1.26:gamma=0.98,curves=all='0/0 0.25/0.21 0.75/0.81 1/1',unsharp=3:3:0.79,"
       "colortemperature=temperature=8000,eq=saturation=0.96,format=yuv420p")
FIX = {('ep', 220.94): 'Dan Marino', ('ep', 2433.15): 'Number four,', ('ep', 543.06): 'We went,', ('ep', 2435.61): 'Branzino.', ('ep', 2445.05): 'Branzino', ('ep', 582.32): 'diddly-doo', ('ep', 582.84): '', ('ep', 2033.21): 'Beamen,',
       ('ep', 2041.71): "y'all", ('ep', 2041.87): '', ('ep', 2042.19): "y'all", ('ep', 2042.31): '', ('v20', 2.08): 'Gnaw.', ('v20', 1.94): 'Camp Flog', ('v20', 35.02): 'Hakusho.', ('v20', 35.2): '', ('v20', 38.02): 'want', ('v20', 41.28): 'Cup',
       ('v20', 31.1): '', ('v20', 31.2): '', ('v20', 31.34): '', ('v20', 31.62): ''}
def src(v): return glob.glob(f'{DL}/{v}.*')[0]
def probe(v): return json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=index,codec_type,codec_name,width,height:stream_side_data=rotation', '-of', 'json', src(v)], capture_output=True, text=True).stdout)['streams']
def vert(v):
    s = [x for x in probe(v) if x['codec_type'] == 'video'][0]; rot = abs(int(next((d.get('rotation', 0) for d in s.get('side_data_list', [])), 0)))
    return (s['width'] if rot == 90 else s['height']) > 1200
def aidx(v): return ([i for i, x in enumerate(x for x in probe(v) if x['codec_type'] == 'audio') if x.get('codec_name') not in (None, 'unknown', 'none')] or [None])[0]
G, R = 'G', 'R'; Y = '#FFE14A'; W_ = '#FFFFFF'; RD = '#FF2A2A'; GR = '#58EE28'
def txt(at, text, color=Y, size=100, off=0, y=560, dur=30): return dict(at=at, kind='txt', file=text, color=color, size=size, off=off, dur=dur, y=y)
def pop(at, f, react=None, off=0): return dict(at=at, kind='png', file=f, off=off, y=800, size=380, **({'sfx': react, 'sv': 0.45} if react else {}))
def ov(at, f, sfx, dur=34, op=0.5, off=0): return dict(at=at, kind='ov', file=f, dur=dur, sfx=sfx, sv=0.45, op=op, off=off)
def sfx(at, f, v=0.5, off=0): return dict(at=at, kind='sfx', file=f, v=v, off=off)
# scene = (id, video, a, b, cropX: centre of the 1080 window in the 1920 frame)
E = {
 'chheight': dict(scenes=[('hook', 'ep', 222.40, 223.80, 760), ('c1', 'ep', 208.00, 210.95, 960), ('c2', 'ep', 212.40, 215.30, 960), ('c3', 'ep', 215.85, 218.95, 960),
                          ('c4', 'ep', 220.75, 222.40, 960), ('c5', 'ep', 222.40, 228.35, 960), ('c6', 'ep', 236.75, 239.55, 960)],
   focus=dict(x=325, y=265, r=200, dur=20), circles=[('c3', 0.4, 1.2, 940, 285, 115)],
   top='His height depends on the DAY OF THE WEEK', hl={'DAY': RD, 'OF': RD, 'THE': RD, 'WEEK': RD}, music=['funkabn_n', 0], ask=[[['hook'], 'How tall is he really?']],
   tints=[], rizz=[], punch=[['hook', 'calculator'], ['c3', '74'], ['c3', '72'], ['c4', 'Dan'], ['c5', 'higher'], ['c6', 'mathematician']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c3', '72'], 's_huh.mp3', 0.5), pop(['c5', 'lower'], 'e_laugh.png', 's_fahhh.mp3', off=4), sfx(['c6', 'mathematician'], 's_ding.mp3', 0.4)]),
 'chsnap': dict(scenes=[('hook', 'ep', 1372.60, 1374.00, 960), ('c1', 'ep', 1361.00, 1369.55, 960), ('c2', 'ep', 1369.55, 1377.00, 960), ('c3', 'ep', 1382.40, 1383.70, 960), ('c4', 'ep', 1385.95, 1386.95, 960)],
   focus=dict(x=595, y=265, r=200, dur=20), circles=[],
   top='He asked for a snap count and got THIS', hl={'THIS': RD}, music=['phonk_n', 0], ask=[[['hook'], 'Would you run this play?']],
   tints=[], rizz=[], punch=[['hook', 'Monday'], ['c1', 'snap'], ['c1', 'Scattered'], ['c2', 'Monday'], ['c3', 'eliminated']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c2', 'Ready?'], 's_tick.mp3', 0.5), pop(['c2', 'Why?'], 'e_laugh.png', 's_huh.mp3', off=2), sfx(['c4', 'most.'], 's_fahhh.mp3', 0.45)]),
 'chdiddly': dict(scenes=[('hook', 'ep', 581.30, 583.45, 825), ('c1', 'ep', 543.00, 546.40, 960), ('c2', 'ep', 549.00, 552.00, 960), ('c3', 'ep', 553.00, 556.10, 960),
                          ('c4', 'ep', 556.85, 561.20, 960), ('c5', 'ep', 578.90, 580.00, 960), ('c6', 'ep', 580.00, 583.45, 825), ('c7', 'ep', 575.60, 578.00, 960)],
   focus=dict(x=140, y=290, r=190, dur=20), circles=[],
   top='His Heisman moment had a DIDDLY-DOO', hl={'DIDDLY-DOO': RD}, music=['chess_n', 0], ask=[[['hook'], 'Best play name ever?']],
   tints=[], rizz=[], punch=[['hook', 'diddly-doo'], ['c2', 'snap'], ['c3', 'dippy'], ['c4', 'main'], ['c6', 'diddly-doo']], blowouts=[], blackFlash=[], streaks=[],
   extras=[pop(['c3', 'do.'], 'e_laugh.png', 's_huh.mp3', off=2), sfx(['c4', 'touchdown'], 's_wow.mp3', 0.4), sfx(['c6', 'diddly-doo'], 's_fahhh.mp3', 0.45), pop(['c7'], 'e_laugh.png', 's_popecho.mp3', off=8)]),
 'chspeech': dict(scenes=[('hook', 'ep', 2040.10, 2043.50, 960), ('c1', 'ep', 2026.70, 2030.55, 960), ('c2', 'ep', 2030.95, 2034.50, 960), ('c3', 'ep', 2036.20, 2043.50, 960),
                          ('c4', 'ep', 2043.95, 2044.80, 960), ('c5', 'ep', 2048.35, 2050.60, 912)],
   focus=dict(x=486, y=216, r=200, dur=20), circles=[],
   top='The most HEISMAN speech ever', hl={'HEISMAN': RD}, music=['goodbye_n', 0], ask=[[['hook'], 'Real winner or acting?']],
   tints=[], rizz=[['c3', 'trophy']], punch=[['hook', 'kiss?'], ['c2', 'Sunday'], ['c3', 'box'], ['c3', 'out.'], ['c4', 'cool.'], ['c5', 'panel.']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c2', 'Willie'], 's_ding.mp3', 0.4), pop(['c3', 'out.'], 'e_laugh.png', 's_wow.mp3', off=2), sfx(['c5', 'panel.'], 's_correct.mp3', 0.45)]),
 'chreveal': dict(scenes=[('hook', 'ep', 2432.98, 2436.40, 912), ('c1', 'ep', 2439.25, 2442.50, 960), ('c2', 'ep', 2443.25, 2446.35, 960), ('c3', 'ep', 2452.20, 2462.40, 960),
                          ('c4', 'ep', 2466.00, 2468.45, 960), ('c5', 'ep', 2481.95, 2482.65, 960)],
   focus=dict(x=130, y=250, r=190, dur=20), circles=[('c3', 8.75, 0.6, 1380, 320, 120, 1080, 320)],
   top='They asked the secret Heisman winner his LUNCH ORDER', hl={'LUNCH': RD, 'ORDER': RD}, music=['brega_n', 0], ask=[[['hook'], 'Who would you vote?']],
   tints=[], rizz=[['c3', 'reveal']], punch=[['hook', 'Branzino'], ['c1', 'box'], ['c2', 'Branzino'], ['c3', 'one'], ['c4', 'knew'], ['c5', 'wrong']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c3', 'three'], 's_tick.mp3', 0.5), sfx(['c3', 'two'], 's_tick.mp3', 0.5), sfx(['c3', 'one'], 's_tick.mp3', 0.5), pop(['c5', 'again.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
}

W = {v: [w for s in json.load(open(f'{TX}/{v}.json')) for w in s['w']] for v in ('ep',)}
gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, spec in E.items():
    scenes, t = [], 0.0
    for sid, v, a, b, cx in spec['scenes']:
        n = round((b - a) * 30); words = []
        for ws, we, tx in W.get(v, []):
            if a - 0.05 <= ws < b - 0.05:
                tt = FIX.get((v, round(ws, 2)), tx.strip().strip(','))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': cx, 'crops': [[0, cx]], 'words': words}); t += n / 30
    gen[eid] = scenes
    print(eid, round(t, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:300])
    ONLY = [x for a in sys.argv if a.startswith('--only=') for x in a[7:].split(',')]
    if '--no-excerpts' not in sys.argv and (not ONLY or eid in ONLY):
        cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []
        for i, (sid, v, a, b, y0) in enumerate(spec['scenes']):  # y0 slot = cropX here (horizontal source)
            d = round((b - a) * 30) / 30
            cmd += ['-ss', f'{a:.3f}', '-t', f'{d:.4f}', '-i', src(v)]
            geo = (f'scale=1080:1920,crop=1080:1080:0:{y0},scale=1088:1088,crop=1088:1080:0:4,pad=1920:1080:416:0:black' if vert(v) else 'scale=1920:1080')
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,{geo},setsar=1,format=yuv420p,trim=duration={d:.4f}[v{i}]')
            fc.append(f'anullsrc=r=48000:cl=stereo,atrim=0:{d:.4f}[a{i}]' if aidx(v) is None else f'[{i}:a:{aidx(v)}]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{d:.4f}[a{i}]')
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
    c.update(cta='', ask=[{'at': r, 'text': tx} for r, tx in c['ask']], track='none', calls=calls, src=f'g67_{eid}.mp4',
             intro=False, hardcut=True, cutSfx='s_camflash.mp3', sat=1.1, progress=False, popMid=True, noSkull=False, srcVol=1)
    sc = {s['id']: s for s in scenes}
    for r in [r for r, _ in c['tints']] + [q['at'] for q in c['ask']] + [e['at'] for e in c['extras']] + sum((c[k] for k in ('rizz', 'punch', 'blowouts', 'blackFlash', 'streaks')), []):
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())], (eid, r, [w['word'] for w in sc[r[0]]['words']])
    c['ask'] = []  # user: nothing under the video (no ask pill / promo line / progress bar)
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/clash.cfg.json', 'w'), indent=1); print('cfg ok')
