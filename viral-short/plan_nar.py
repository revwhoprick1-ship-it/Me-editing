# Narrator format (user ref 2026-11-20): pitched-up AI narrator sets up the clip over ~1 s cuts, whoosh on EVERY cut, colour-cycling
# one-word ALL-CAPS captions, then the raw moment plays. Look stays VverPaldo (top text, box, grade, focus blur, emoji pops). Say Goodbye only.
# Original VverPaldo style
# (pre viewer-agent rounds, commit 7df7760): payoff hook + hard cut, centre echo emoji pops, skull top line, one ask pill, promo line last 2.5 s.
# Sources: <dl dir>/vNN.* (vertical 1080x1920 -> 1080 square at y0 padded into the 1920x1080 frame; horizontal used as is).
# Excerpts public/g67_<id>.mp4 = the edit's scene windows in order, graded 67 (+ slightly cooler).
# Usage: python3 plan_arena.py <dl dir> <tx dir> [--no-excerpts]
import glob, json, subprocess, sys, os
DL, TX = sys.argv[1], sys.argv[2]
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.74:5:5:0,"
       "eq=contrast=1.113:saturation=1.26:gamma=0.98,curves=all='0/0 0.25/0.21 0.75/0.81 1/1',unsharp=3:3:0.79,"
       "colortemperature=temperature=8000,eq=saturation=0.96,format=yuv420p")
FIX = {('ep', 655.5): 'he', ('ep', 656.02): '', ('ep', 1309.3): "o'clock.", ('ep', 1309.56): '', ('ep', 1315.4): '', ('ep', 1321.44): '', ('ep', 1322.88): 'stuff.', ('ep', 1330.66): '', ('ep', 1339.04): 'stuff', ('ep', 817.75): '', ('ep', 823.95): '', ('ep', 811.45): 'Jr.', ('ep', 50.43): '', ('ep', 293.21): 'H&M.', ('ep', 1031.61): '', ('ep', 1031.93): '', ('ep', 766.85): '152,000', ('ep', 767.47): '', ('ep', 837.27): '', ('ep', 460.12): 'Childish', ('ep', 460.6): 'Gambino.', ('ep', 460.78): '', ('ep', 467.94): 'Childish', ('ep', 468.1): 'Gambino.', ('ep', 468.2): '',
       ('ep', 361.76): 'Quavasaurus', ('ep', 837.41): '', ('ep', 524.06): 'stuff', ('ep', 330.92): '', ('ep', 332.24): '', ('ep', 335.72): ''}
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
# intro scenes = ids starting with 'i' (source ducked, narrator captions); vo = narrator id in VO dir
E = {
 'ncar': dict(vo='vcar', scenes=[('i1', 'ep', 307.90, 308.85, 1200), ('i2', 'ep', 311.90, 312.85, 1200), ('i3', 'ep', 330.40, 331.35, 1150), ('i4', 'ep', 332.30, 333.30, 1150),
                         ('c1', 'ep', 307.05, 313.95, 1200), ('c2', 'ep', 314.60, 317.60, 960), ('c3', 'ep', 323.00, 324.60, 960), ('c4', 'ep', 329.55, 337.75, 1150)],
   zoom={'i3': (462, 0, 1458, 820), 'i4': (462, 0, 1458, 820), 'c4': (462, 0, 1458, 820)}, mute=[(330.85, 331.20), (332.18, 332.80), (335.66, 335.98)],
   focus=dict(x=860, y=380, r=170, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[],
   top='"give me 30 seconds"… he NEVER came back 😭', hl={'NEVER': RD}, extras=[pop(['c4', 'sorry.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'nshoot': dict(vo='vshoot', scenes=[('i1', 'ep', 48.20, 49.10, 1080), ('i2', 'ep', 56.60, 57.50, 1080), ('i3', 'ep', 64.60, 65.50, 1080), ('i4', 'ep', 75.10, 76.10, 1080),
                         ('c1', 'ep', 54.50, 69.30, 1080), ('c3', 'ep', 83.45, 87.00, 1300)], fixed=['c1'],
   mute=[(78.30, 78.90)], focus=dict(x=558, y=300, r=150, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[],
   top='his photographer was speaking another LANGUAGE 😭', hl={'LANGUAGE': RD}, extras=[pop(['c1', 'noodles.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'nstick': dict(vo='vstick', scenes=[('i1', 'ep', 869.30, 870.15, 1000), ('i2', 'ep', 872.30, 873.15, 1000), ('i3', 'ep', 906.30, 907.15, 540), ('i4', 'ep', 911.50, 912.40, 950),
                         ('c1', 'ep', 867.75, 873.10, 1000), ('c2', 'ep', 878.25, 882.05, 1000), ('c3', 'ep', 904.00, 909.60, 540), ('c4', 'ep', 909.60, 916.55, 950)], fixed=['c4'],
   focus=dict(x=666, y=430, r=150, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[],
   top='bro dropped the sticks then held everyone HOSTAGE 💀', hl={'HOSTAGE': RD}, extras=[sfx(['c1', 'No!'], 's_fahhh.mp3', 0.5), pop(['c4', 'now.'], 'e_laugh.png', 's_ayo.mp3', off=2)]),
 'nmid': dict(vo='vmid', scenes=[('i1', 'ep', 429.80, 430.80, 1050), ('i2', 'ep', 422.30, 423.30, 960), ('i3', 'ep', 440.20, 441.30, 1050),
                         ('c1', 'ep', 413.20, 419.20, 960), ('c2', 'ep', 428.00, 445.45, 1050)], fixed=['c2'],
   focus=dict(x=255, y=290, r=160, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[],
   top='they felt his aura in their MID SECTION 💀', hl={'MID': RD, 'SECTION': RD}, extras=[sfx(['c1', 'pants.'], 's_huh.mp3', 0.5), pop(['c2', 'toes.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'nrun': dict(vo='vrun', scenes=[('i1', 'ep', 1020.30, 1021.15, 830), ('i2', 'ep', 1030.80, 1031.65, 900), ('i3', 'ep', 1034.20, 1035.05, 900),
                         ('c1', 'ep', 1015.00, 1022.60, 830), ('c2', 'ep', 1024.75, 1036.00, 900)],
   mute=[(1031.55, 1032.45)], focus=dict(x=414, y=270, r=170, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[],
   top='"can i RUN down the runway?" 😭', hl={'RUN': RD}, extras=[pop(['c2', 'fire'], 'e_laugh.png', 's_fahhh.mp3', off=4)]),
}
VO = sys.argv[3]

W = {v: [w for s in json.load(open(f'{TX}/{v}.json')) for w in s['w']] for v in ('ep',)}
FIXED = []
CUTS = [float(x) for x in open(os.path.join(os.path.dirname(DL.rstrip('/')), 'cuts.txt'))]
def snap(sid, v, a, b):
    """user rules: never cut a line mid-sentence (start before the first word, run until the speaker pauses),
    and no sub-0.5 s slivers of another camera angle at either end (snap onto the show's own cut)."""
    ws = W[v]; a0, b0 = a, b
    for s, e, _ in ws:                       # don't start inside a word
        if s < a < e: a = s - 0.08
    if not sid.startswith('i') and sid not in FIXED:
        for _ in range(40):                  # extend to the end of the phrase (next pause >= 0.35 s), max +4 s
            nxt = [e for s, e, _ in ws if s < b + 0.35 and e > b - 0.02 and e > b - 0.15 + 0.15 and s >= a]
            nxt = [e for s, e, _ in ws if (s < b < e) or (b <= s < b + 0.35)]
            if not nxt or b - b0 > 4: break
            b = max(nxt) + 0.15
    c = [x for x in CUTS if a < x < a + 0.5]
    if c: a = max(c) + 0.02
    c = [x for x in CUTS if b - 0.5 < x < b]
    if c:
        cx = min(c); talking = [1 for s, e, _ in ws if s < cx + 0.1 and e > cx - 0.05 and not sid.startswith('i')]
        if not talking: b = cx - 0.02
        else:
            later = [x for x in CUTS if b < x < b + 1.2]
            b = later[0] - 0.02 if later else b
    if (round(a, 2), round(b, 2)) != (round(a0, 2), round(b0, 2)): print(f'  snap {sid}: {a0:.2f}-{b0:.2f} -> {a:.2f}-{b:.2f}')
    return round(a, 2), round(b, 2)
for eid, spec in E.items():
    FIXED = spec.get('fixed', [])
    spec['scenes'] = [(sid, v, *snap(sid, v, a, b), cx) for sid, v, a, b, cx in spec['scenes']]
    vd = json.load(open(f"{VO}/{spec['vo']}.json"))['dur']; intro = [s for s in spec['scenes'] if s[0].startswith('i')]
    short = vd + 0.15 - sum(s[3] - s[2] for s in intro)
    if short > 0:                            # intro must cover the narrator line
        k = spec['scenes'].index(intro[-1]); sid, v, a, b, cx = intro[-1]; spec['scenes'][k] = (sid, v, a, round(b + short, 2), cx); print(f'  {eid}: intro +{short:.2f}s')
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
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': cx, 'crops': [[0, cx]], 'words': words}); t += n / 30
    vw = json.load(open(f"{VO}/{spec['vo']}.json"))['w']
    for s in scenes:
        if s['id'].startswith('i'):
            s0 = s['videoStartSec']; s['words'] = []
            for ws, we, tx in vw:
                if s0 <= ws < s0 + s['durationInFrames'] / 30:
                    s['words'].append({'word': tx, 'startFrame': round((ws - s0) * 30), 'endFrame': min(s['durationInFrames'], round((we - s0) * 30) + 3)})
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
            ya = float(subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{(a + b) / 2:.2f}', '-i', src(v), '-frames:v', '1', '-vf', 'crop=1080:1080:420:0,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-', '-f', 'null', '-'],
                                      capture_output=True, text=True).stdout.split('YAVG=')[1].split()[0])
            if ya < 50: geo += ',eq=gamma=1.4:brightness=0.02:saturation=1.08'; print('  lift', sid, round(ya))
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,{geo},setsar=1,format=yuv420p,trim=duration={d:.4f}[v{i}]')
            mt = ''.join(f",volume=0:enable='between(t,{max(0, m0 - a):.3f},{m1 - a:.3f})'" for m0, m1 in spec.get('mute', []) if m1 > a and m0 < b)
            fc.append(f'[{i}:a:{aidx(v)}]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{d:.4f}{mt}' + (',volume=0' if sid.startswith('i') else '') + f'[a{i}]')
        k = len(spec['scenes'])
        fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
    c = {k: v for k, v in spec.items() if k not in ('scenes', 'circles', 'nocap', 'mute', 'zoom', 'vo')}
    c['music'] = ['goodbye_n', 0]; c['vo'] = {'file': spec['vo'] + '.wav', 'vol': 1.0}; c['capCycle'] = True; c['whip'] = True
    c['extras'] = c['extras'] + [sfx([s['id']], 's_whoosh.mp3', 0.45) for s in scenes[2:]]
    st = {s['id']: s['videoStartSec'] for s in scenes}; calls, trk = [], {}
    for sid, o, d, x, y, r, *end in spec.get('circles', []):
        a = st[sid] + o; calls.append([round(a, 2), round(a + d, 2), '']); x2, y2 = end if end else (x, y); n = round(d * 50) + 2
        for k in range(n): u = min(1, k / (n - 2)); trk[f'{a + k / 50:.2f}'] = [round(x + (x2 - x) * u), round(y + (y2 - y) * u), r]
    c['trackData'] = trk
    for e in c['extras']:
        if e.get('y') is None: e.pop('y', None)
    c.update(cta='', ask=[{'at': r, 'text': tx} for r, tx in c['ask']], track='none', calls=calls, src=f'g67_{eid}.mp4',
             intro=False, hardcut=True, cutSfx='s_whoosh.mp3', sat=1.1, progress=False, popMid=True, noSkull=False, srcVol=1); c['noSkull'] = spec.get('noSkull', False); c['musicVol'] = 0.28
    sc = {s['id']: s for s in scenes}
    for r in [r for r, _ in c['tints']] + [q['at'] for q in c['ask']] + [e['at'] for e in c['extras']] + sum((c[k] for k in ('rizz', 'punch', 'blowouts', 'blackFlash', 'streaks')), []):
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())], (eid, r, [w['word'] for w in sc[r[0]]['words']])
    c['ask'] = []  # user: nothing under the video (no ask pill / promo line / progress bar)
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/nar.cfg.json', 'w'), indent=1); print('cfg ok')
