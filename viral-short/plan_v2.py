# Narrator format (user ref 2026-11-20): pitched-up AI narrator sets up the clip over ~1 s cuts, whoosh on EVERY cut, colour-cycling
# one-word ALL-CAPS captions, then the raw moment plays. Look stays VverPaldo (top text, box, grade, focus blur, emoji pops). Say Goodbye only.
# Original VverPaldo style
# (pre viewer-agent rounds, commit 7df7760): payoff hook + hard cut, centre echo emoji pops, skull top line, one ask pill, promo line last 2.5 s.
# Sources: <dl dir>/vNN.* (vertical 1080x1920 -> 1080 square at y0 padded into the 1920x1080 frame; horizontal used as is).
# Excerpts public/g67_<id>.mp4 = the edit's scene windows in order, graded 67 (+ slightly cooler).
# Usage: python3 plan_arena.py <dl dir> <tx dir> [--no-excerpts]
import glob, json, subprocess, sys, os
import numpy as np
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

# 10 best moments x 2 variants: A = narrator intro -> moment, B = punchline hook -> hard cut -> moment (different top text).
# sfx = (scene, word prefix, file[, 'pop' emoji]) — lots of reaction SFX (user: more SFX even without visuals).
Z = (462, 0, 1458, 820)
CL = {
 'car': dict(vo='vcar', intro=[('i1', 307.90, 308.85, 1200), ('i2', 311.90, 312.85, 1200), ('i3', 330.40, 331.35, 1150), ('i4', 332.30, 333.30, 1150)],
   hook=(333.85, 336.45, 1200), body=[('c1', 307.05, 313.95, 1200), ('c2', 314.60, 317.60, 960), ('c3', 323.00, 324.60, 960), ('c4', 329.55, 337.75, 1150)],
   zoom={'i3': Z, 'i4': Z, 'c4': Z, 'hook': Z}, mute=[(330.85, 331.20), (332.18, 332.80), (335.66, 335.98)],
   A='"give me 30 seconds"… he NEVER came back 😭', B='bro said "be right back" and went HOME 💀',
   sfx=[('c1', 'bathroom.', 's_ding.mp3'), ('c1', 'seconds.', 's_huh.mp3'), ('c4', 'watching', 's_awk.mp3'), ('c4', 'sorry.', 's_fahhh.mp3', 'e_laugh.png'), ('c4', 'wait!', 's_ayo.mp3')]),
 'shoot': dict(vo='vshoot', intro=[('i1', 48.20, 49.10, 1080), ('i2', 56.60, 57.50, 1080), ('i3', 64.60, 65.50, 1080), ('i4', 75.10, 76.10, 1080)],
   hook=(47.80, 51.30, 1080), body=[('c1', 54.50, 69.30, 1080), ('c3', 83.45, 87.00, 1300)], fixed=['c1'], mute=[(50.40, 51.05), (78.30, 78.90)],
   A='his photographer was speaking another LANGUAGE 😭', B='"a little wash the hands… a little STEAM" 💀',
   sfx=[('c1', 'wash', 's_huh.mp3'), ('c1', 'steam.', 's_awk.mp3'), ('c1', 'together?', 's_ayo.mp3'), ('c1', 'noodles.', 's_fahhh.mp3', 'e_laugh.png'), ('c3', 'crushed', 's_ding.mp3')]),
 'stick': dict(vo='vstick', intro=[('i1', 869.30, 870.15, 1000), ('i2', 872.30, 873.15, 1000), ('i3', 906.30, 907.15, 540), ('i4', 911.50, 912.40, 950)],
   hook=(906.10, 909.60, 540), body=[('c1', 867.75, 873.10, 1000), ('c2', 878.25, 882.05, 1000), ('c3', 904.00, 909.60, 540), ('c4', 909.60, 916.55, 950)], fixed=['c4'],
   A='bro dropped the sticks then held everyone HOSTAGE 💀', B='"i need this for my IG bro" 😭',
   sfx=[('c1', 'No!', 's_fahhh.mp3'), ('c2', 'slipped', 's_huh.mp3'), ('c3', 'IG', 's_ayo.mp3'), ('c4', 'frame', 's_awk.mp3'), ('c4', 'time', 's_rip.mp3', 'e_laugh.png')]),
 'mid': dict(vo='vmid', intro=[('i1', 429.80, 430.80, 1050), ('i2', 422.30, 423.30, 960), ('i3', 440.20, 441.30, 1050)],
   hook=(442.90, 445.30, 1050), body=[('c1', 413.20, 419.20, 960), ('c2', 428.00, 445.45, 1050)], fixed=['c2'],
   A='they felt his aura in their MID SECTION 💀', B='"i felt it in my MID SECTION" 😭',
   sfx=[('c1', 'pants.', 's_huh.mp3'), ('c2', 'goosebumps.', 's_wow.mp3'), ('c2', 'mid', 's_ayo.mp3'), ('c2', 'knees', 's_tick.mp3'), ('c2', 'toes.', 's_fahhh.mp3', 'e_laugh.png')]),
 'run': dict(vo='vrun', intro=[('i1', 1020.30, 1021.15, 830), ('i2', 1030.80, 1031.65, 900), ('i3', 1034.20, 1035.05, 900)],
   hook=(1020.25, 1022.60, 830), body=[('c1', 1015.00, 1022.60, 830), ('c2', 1024.75, 1036.00, 900)], mute=[(1031.55, 1032.45)],
   A='"can i RUN down the runway?" 😭', B='he asked if he could RUN the runway 💀',
   sfx=[('c1', 'run?', 's_huh.mp3'), ('c2', 'Bop', 's_tick.mp3'), ('c2', 'dare', 's_ayo.mp3'), ('c2', 'fire', 's_fahhh.mp3', 'e_laugh.png')]),
 'rant': dict(vo='vrant', intro=[('i1', 1311.00, 1312.00, 900), ('i2', 1326.60, 1327.60, 1100), ('i3', 1342.00, 1343.00, 1000), ('i4', 1346.00, 1347.20, 1000)],
   hook=(1326.60, 1328.40, 1100), body=[('c1', 1310.20, 1314.20, 900), ('c2', 1323.00, 1333.30, 1100), ('c3', 1340.40, 1348.60, 1000)],
   mute=[(1315.38, 1315.80), (1321.42, 1321.82), (1322.86, 1323.10), (1330.64, 1330.94), (1339.02, 1339.22)],
   A='he found out the drop date LIVE and lost it 😭', B='"WE DO THIS TO THESE PEOPLE" 💀',
   sfx=[('c1', 'swear', 's_huh.mp3'), ('c2', 'profits', 's_awk.mp3'), ('c2', 'people!', 's_fahhh.mp3'), ('c2', 'wrong', 's_ayo.mp3'), ('c3', 'never', 's_tick.mp3'), ('c3', 'forever.', 's_rip.mp3', 'e_laugh.png')]),
 'hm': dict(vo='vhm', intro=[('i1', 276.00, 277.00, 1150), ('i2', 280.00, 281.00, 1150), ('i3', 290.50, 291.50, 1100), ('i4', 293.00, 294.00, 1100)],
   hook=(292.60, 296.60, 1250), body=[('c1', 275.55, 284.40, 1150), ('c2', 287.50, 297.00, 1100)],
   A="bro said H&M like it's PARIS fashion week 😭", B='"yvette, kevin kline, larry, H&M" 💀',
   sfx=[('c1', 'Burberry', 's_ding.mp3'), ('c1', 'comparison', 's_ayo.mp3'), ('c2', 'Larry', 's_huh.mp3'), ('c2', 'H&M', 's_awk.mp3'), ('c2', 'brag', 's_fahhh.mp3', 'e_laugh.png')]),
 'jay': dict(vo='vjay', intro=[('i1', 640.00, 641.00, 1150), ('i2', 648.00, 649.00, 920), ('i3', 653.00, 654.10, 760)],
   hook=(654.15, 656.75, 760), body=[('c1', 638.00, 641.00, 1150), ('c2', 646.00, 652.40, 920), ('c3', 652.40, 657.20, 760), ('c4', 675.50, 678.20, 790)],
   A='jay cutler had to RATE his runway walk 💀', B='"i think he could do BETTER to be honest" 😭',
   sfx=[('c1', 'twinning.', 's_ding.mp3'), ('c2', 'dance', 's_tick.mp3'), ('c3', 'Whoa!', 's_wow.mp3'), ('c3', 'better', 's_huh.mp3'), ('c4', 'home', 's_fahhh.mp3', 'e_laugh.png')]),
 'late': dict(vo='vlate', intro=[('i1', 505.50, 506.50, 960), ('i2', 509.00, 510.00, 960), ('i3', 528.00, 529.00, 960)],
   hook=(517.45, 519.75, 960), body=[('c1', 504.10, 510.90, 960), ('c2', 517.45, 526.30, 960), ('c3', 527.35, 531.00, 960)], mute=[(524.02, 524.26)],
   A='bro showed up 3 HOURS late and went straight to the BATHROOM 😭', B='"i have to pee REALLY bad" 💀',
   sfx=[('c1', 'late.', 's_huh.mp3'), ('c2', 'pee', 's_ayo.mp3'), ('c2', 'Aaron', 's_awk.mp3'), ('c3', 'directly', 's_tick.mp3'), ('c3', 'bathroom.', 's_fahhh.mp3', 'e_laugh.png')]),
 'bank': dict(vo='vbank', intro=[('i1', 766.30, 767.30, 940), ('i2', 761.00, 762.00, 940), ('i3', 771.00, 772.00, 960)],
   hook=(766.25, 768.80, 940), body=[('c1', 760.20, 766.25, 940), ('c2', 766.25, 768.80, 940), ('c3', 769.75, 778.60, 960)], fixed=['c3'],
   A='his bank account hit NEGATIVE $152,000 💀', B='"try NEGATIVE 152,000" 😭',
   sfx=[('c1', 'zero.', 's_ding.mp3'), ('c2', 'negative', 's_fahhh.mp3'), ('c3', 'robbed?', 's_huh.mp3'), ('c3', 'taxes', 's_awk.mp3'), ('c3', 'consent', 's_rip.mp3', 'e_sob.png')]),
}
E = {}
for k, d in CL.items():
    hl = lambda t: {w: RD for w in t.split() if sum(ch.isalpha() for ch in w) >= 2 and w.upper() == w}
    ex = [pop([s, w], e[3], f, off=2) if len(e) > 3 else sfx([s, w], f, 0.5) for e in d['sfx'] for s, w, f in [e[:3]]]
    base = dict(mute=d.get('mute', []), zoom=d.get('zoom', {}), fixed=d.get('fixed', []), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[],
                focus=dict(x=540, y=330, r=180, dur=20))
    E['v' + k + 'a'] = dict(base, vo=d['vo'], scenes=[(s, 'ep', a, b, cx) for s, a, b, cx in d['intro'] + d['body']], top=d['A'], hl=hl(d['A']), extras=list(ex))
    E['v' + k + 'b'] = dict(base, vo=None, scenes=[('hook', 'ep', *d['hook'])] + [(s, 'ep', a, b, cx) for s, a, b, cx in d['body']], top=d['B'], hl=hl(d['B']), extras=list(ex))
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
    if not sid.startswith('i') and sid not in FIXED and sid != 'hook':
        for _ in range(40):                  # extend to the end of the phrase (next pause >= 0.35 s), max +4 s
            nxt = [e for s, e, _ in ws if s < b + 0.35 and e > b - 0.02 and e > b - 0.15 + 0.15 and s >= a]
            nxt = [e for s, e, _ in ws if (s < b < e) or (b <= s < b + 0.35)]
            if not nxt or b - b0 > 2: break
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
    if not spec['vo']: continue
    vd = json.load(open(f"{VO}/{spec['vo']}.json"))['dur']; intro = [s for s in spec['scenes'] if s[0].startswith('i')]
    short = vd + 0.15 - sum(s[3] - s[2] for s in intro)
    if short > 0:                            # intro must cover the narrator line
        k = spec['scenes'].index(intro[-1]); sid, v, a, b, cx = intro[-1]; spec['scenes'][k] = (sid, v, a, round(b + short, 2), cx); print(f'  {eid}: intro +{short:.2f}s')
FOC = {'vcara': (860, 380, 170), 'vshoota': (558, 300, 150), 'vsticka': (700, 380, 150), 'vstickb': (160, 220, 200), 'vranta': (720, 440, 170), 'vhma': (900, 520, 150), 'vjaya': (780, 380, 150), 'vlatea': (680, 400, 130), 'vbanka': (900, 420, 160), 'vmida': (255, 290, 160), 'vruna': (414, 270, 170),
       'vcarb': (830, 560, 170), 'vshootb': (480, 380, 190), 'vmidb': (210, 290, 170), 'vrunb': (570, 230, 200), 'vrantb': (690, 470, 190),
       'vhmb': (990, 420, 150), 'vjayb': (640, 340, 170), 'vlateb': (520, 110, 200), 'vbankb': (940, 360, 180)}
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
    vw = json.load(open(f"{VO}/{spec['vo']}.json"))['w'] if spec['vo'] else []
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
    c = {k: v for k, v in spec.items() if k not in ('scenes', 'circles', 'nocap', 'mute', 'zoom', 'vo', 'fixed')}
    c['music'] = ['goodbye_n', 0]; c['vo'] = {'file': spec['vo'] + '.wav', 'vol': 1.0} if spec['vo'] else None; c['capCycle'] = True; c['whip'] = True
    c['extras'] = c['extras'] + [sfx([s['id']], 's_whoosh.mp3', 0.45) for s in scenes[2:]]
    scw = {s['id']: [w['word'].lower() for w in s['words']] for s in scenes}
    keep = [e for e in c['extras'] if len(e['at']) < 2 or any(w.startswith(e['at'][1].lower()) for w in scw.get(e['at'][0], []))]
    if len(keep) < len(c['extras']): print('  drop sfx', eid, [e['at'] for e in c['extras'] if e not in keep])
    c['extras'] = keep
    st = {s['id']: s['videoStartSec'] for s in scenes}; calls, trk = [], {}
    for sid, o, d, x, y, r, *end in spec.get('circles', []):
        a = st[sid] + o; calls.append([round(a, 2), round(a + d, 2), '']); x2, y2 = end if end else (x, y); n = round(d * 50) + 2
        for k in range(n): u = min(1, k / (n - 2)); trk[f'{a + k / 50:.2f}'] = [round(x + (x2 - x) * u), round(y + (y2 - y) * u), r]
    c['trackData'] = trk
    if eid in FOC: c['focus'] = dict(zip(('x', 'y', 'r'), FOC[eid]), dur=20)
    try:
        if eid in FOC: raise Exception('hand-set')
        import cv2
        fr = subprocess.run(['ffmpeg', '-v', 'error', '-ss', '0.1', '-i', f'public/g67_{eid}.mp4', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
        img = np.frombuffer(fr, np.uint8).reshape(1080, 1920, 3)[:, 420:1500]
        det = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml').detectMultiScale(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 1.1, 5, minSize=(60, 60))
        if len(det):
            x, y, w, h = max(det, key=lambda d: d[2] * d[3]); c['focus'] = dict(x=int(x + w / 2), y=int(y + h / 2), r=int(max(140, min(240, w * 0.9))), dur=20)
        print('  focus', eid, c['focus'])
    except Exception as ex: print('  focus fail', eid, ex)
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
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/v2.cfg.json', 'w'), indent=1); print('cfg ok')
