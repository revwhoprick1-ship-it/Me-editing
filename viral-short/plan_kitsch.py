# Clipfarm x Kitsch x Nic Vans: 5 story edits from the one 65 s vertical Saint Nic video. Kitsch product on screen in every clip, Nic looks sweet/fun.
# Original VverPaldo style
# (pre viewer-agent rounds, commit 7df7760): payoff hook + hard cut, centre echo emoji pops, skull top line, one ask pill, promo line last 2.5 s.
# Sources: <dl dir>/vNN.* (vertical 1080x1920 -> 1080 square at y0 padded into the 1920x1080 frame; horizontal used as is).
# Excerpts public/g67_<id>.mp4 = the edit's scene windows in order, graded 67 (+ slightly cooler).
# Usage: python3 plan_arena.py <dl dir> <tx dir> [--no-excerpts]
import glob, json, subprocess, sys
DL, TX = sys.argv[1], sys.argv[2]
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.74:5:5:0,"
       "eq=contrast=1.113:saturation=1.26:gamma=0.98,curves=all='0/0 0.25/0.21 0.75/0.81 1/1',unsharp=3:3:0.79,"
       "colortemperature=temperature=8000,eq=saturation=0.96,format=yuv420p")
FIX = {('ep', 25.07): 'Kitsch', ('ep', 22.51): 'Nic.', ('ep', 52.44): 'Saint', ('ep', 52.68): 'Nic', ('ep', 41.15): 'Nicholas,'}
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
# scene = (id, video, a, b, y0 = top of the 1080 square cut from the 1080x1920 source)
E = {
 'ksaint': dict(scenes=[('hook', 'ep', 22.10, 23.95, 150), ('c1', 'ep', 19.30, 20.40, 150), ('c2', 'ep', 20.40, 22.10, 150), ('c3', 'ep', 24.90, 27.50, 150), ('c4', 'ep', 27.50, 32.70, 150), ('c5', 'ep', 33.00, 38.50, 300)],
   focus=dict(x=507, y=254, r=180, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='nic from love island pulled up to his sister as SANTA 😭', hl={'SANTA': RD}, music=['mdubist_n', 0],
   punch=[['hook'], ['c2'], ['c3'], ['c5']], extras=[sfx(['c2'], 's_huh.mp3', 0.5, off=5), pop(['c4'], 'e_laugh.png', 's_ayo.mp3', off=20), sfx(['c5'], 's_wow.mp3', 0.45, off=110)]),
 'ksister': dict(scenes=[('hook', 'ep', 36.60, 38.50, 300), ('c1', 'ep', 0.00, 1.30, 600), ('c2', 'ep', 19.30, 23.95, 150), ('c3', 'ep', 31.50, 36.60, 300), ('c4', 'ep', 36.60, 38.50, 300)],
   focus=dict(x=507, y=250, r=180, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='his sister tried SO hard not to like the gift 😭', hl={'SO': RD, 'hard': RD}, music=['mchud_n', 0],
   punch=[['hook'], ['c2'], ['c4']], extras=[sfx(['c2'], 's_huh.mp3', 0.5, off=50), pop(['c4'], 'e_laugh.png', 's_fahhh.mp3', off=20)]),
 'kmom': dict(scenes=[('hook', 'ep', 46.65, 48.00, 250), ('c1', 'ep', 38.90, 40.70, 150), ('c2', 'ep', 41.00, 43.40, 250), ('c3', 'ep', 43.40, 46.40, 400), ('c4', 'ep', 46.40, 48.00, 250), ('c5', 'ep', 48.00, 49.40, 600), ('c6', 'ep', 59.00, 61.50, 150)],
   focus=dict(x=272, y=435, r=170, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='he dumped a WHOLE TRUCK of gifts on his mom 😭', hl={'WHOLE': RD, 'TRUCK': RD}, music=['chess_n', 0],
   punch=[['hook'], ['c1'], ['c3'], ['c4']], extras=[sfx(['c3'], 's_wow.mp3', 0.5, off=10), pop(['c4'], 'e_sob.png', 's_ayo.mp3', off=10), pop(['c6'], 'e_heart.png', 's_popecho.mp3', off=20)]),
 'ktax': dict(scenes=[('hook', 'ep', 52.00, 53.40, 150), ('c1', 'ep', 22.10, 23.95, 150), ('c2', 'ep', 33.00, 38.50, 300), ('c3', 'ep', 49.40, 52.00, 600), ('c4', 'ep', 52.00, 53.40, 150), ('c5', 'ep', 59.00, 61.80, 150)],
   focus=dict(x=471, y=480, r=190, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='he gave his sister a gift then TAXED her 💀', hl={'TAXED': RD}, music=['mwalahi_n', 0],
   punch=[['hook'], ['c3'], ['c4']], extras=[sfx(['c3'], 's_huh.mp3', 0.5, off=20), pop(['c4'], 'e_laugh.png', 's_fahhh.mp3', off=10)]),
 'kwho': dict(scenes=[('hook', 'ep', 53.60, 55.40, 150), ('c1', 'ep', 1.30, 8.40, 150), ('c2', 'ep', 8.40, 11.40, 150), ('c3', 'ep', 55.40, 57.10, 700), ('c4', 'ep', 57.10, 58.60, 150), ('c5', 'ep', 59.00, 62.50, 150)],
   focus=dict(x=471, y=453, r=180, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top="who's nic's LAST gift for? 👀", hl={'LAST': RD}, music=['goodbye_n', 0],
   punch=[['hook'], ['c3'], ['c4']], extras=[sfx(['c3'], 's_ding.mp3', 0.45, off=10), sfx(['c4'], 's_huh.mp3', 0.5, off=3), pop(['c5'], 'e_heart.png', 's_popecho.mp3', off=30)]),
}

W = {v: [w for s in json.load(open(f'{TX}/{v}.json')) for w in s['w']] for v in ('ep',)}
gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, spec in E.items():
    scenes, t = [], 0.0
    for sid, v, a, b, cx in spec['scenes']:
        n = round((b - a) * 30); words = []
        for ws, we, tx in ([] if sid in spec.get('nocap', []) else W.get(v, [])):
            if a - 0.05 <= ws < b - 0.05:
                tt = FIX.get((v, round(ws, 2)), tx.strip().strip(','))
                if not tt: continue
                f0 = max(0, round((ws - a) * 30)); f1 = min(n, max(f0 + 4, round((we - a) * 30) + 3))
                if words and words[-1]['word'] == tt and words[-1]['startFrame'] == f0: continue
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for i in range(len(words) - 1): words[i]['endFrame'] = min(words[i]['endFrame'], words[i + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': 960, 'crops': [[0, 960]], 'words': words}); t += n / 30
    gen[eid] = scenes
    print(eid, round(t, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:300])
    ONLY = [x for a in sys.argv if a.startswith('--only=') for x in a[7:].split(',')]
    if '--no-excerpts' not in sys.argv and (not ONLY or eid in ONLY):
        cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []
        for i, (sid, v, a, b, y0) in enumerate(spec['scenes']):  # y0 slot = cropX here (horizontal source)
            d = round((b - a) * 30) / 30
            cmd += ['-ss', f'{a:.3f}', '-t', f'{d:.4f}', '-i', src(v)]
            geo = (f'scale=1080:1920,crop=1080:1080:0:{y0},scale=1088:1088,crop=1088:1080:0:4,pad=1920:1080:416:0:black' if vert(v) else 'scale=1920:1080')
            zx = spec.get('zoom', {}).get(sid)
            if zx: geo = f'crop={zx[2]}:{zx[3]}:{zx[0]}:{zx[1]},scale=1920:1080'
            ya = 99 if vert(v) else float(subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{(a + b) / 2:.2f}', '-i', src(v), '-frames:v', '1', '-vf', 'crop=1080:1080:420:0,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-f', 'null', '-'],
                                      capture_output=True, text=True).stdout.split('YAVG=')[1].split()[0])
            if ya < 50: geo += ',eq=gamma=1.4:brightness=0.02:saturation=1.08'; print('  lift', sid, round(ya))
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,{geo},setsar=1,format=yuv420p,trim=duration={d:.4f}[v{i}]')
            mt = ''.join(f",volume=0:enable='between(t,{max(0, m0 - a):.3f},{m1 - a:.3f})'" for m0, m1 in spec.get('mute', []) if m1 > a and m0 < b)
            fc.append(f'[{i}:a:{aidx(v)}]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{d:.4f}{mt}[a{i}]')
        k = len(spec['scenes'])
        fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
    c = {k: v for k, v in spec.items() if k not in ('scenes', 'circles', 'nocap', 'mute', 'zoom')}
    st = {s['id']: s['videoStartSec'] for s in scenes}; calls, trk = [], {}
    for sid, o, d, x, y, r, *end in spec.get('circles', []):
        a = st[sid] + o; calls.append([round(a, 2), round(a + d, 2), '']); x2, y2 = end if end else (x, y); n = round(d * 50) + 2
        for k in range(n): u = min(1, k / (n - 2)); trk[f'{a + k / 50:.2f}'] = [round(x + (x2 - x) * u), round(y + (y2 - y) * u), r]
    c['trackData'] = trk
    for e in c['extras']:
        if e.get('y') is None: e.pop('y', None)
    c.update(cta='', ask=[{'at': r, 'text': tx} for r, tx in c['ask']], track='none', calls=calls, src=f'g67_{eid}.mp4',
             intro=False, hardcut=True, cutSfx='s_camflash.mp3', sat=1.1, progress=False, popMid=True, noSkull=False, srcVol=1); c['noSkull'] = spec.get('noSkull', False); c['musicVol'] = 0.3
    sc = {s['id']: s for s in scenes}
    for r in [r for r, _ in c['tints']] + [q['at'] for q in c['ask']] + [e['at'] for e in c['extras']] + sum((c[k] for k in ('rizz', 'punch', 'blowouts', 'blackFlash', 'streaks')), []):
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())], (eid, r, [w['word'] for w in sc[r[0]]['words']])
    c['ask'] = []  # user: nothing under the video (no ask pill / promo line / progress bar)
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/kitsch.cfg.json', 'w'), indent=1); print('cfg ok')
