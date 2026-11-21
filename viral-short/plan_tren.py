# Tren Twins giveaway. Narrator format (user ref 2026-11-20): pitched-up AI narrator sets up the clip over ~1 s cuts, whoosh on EVERY cut, colour-cycling
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
FIX = {('ep', 38.24): 'it', ('ep', 38.42): 'away', ('ep', 45.56): 'it', ('ep', 31.74): 'what', ('ep', 34.8): 'is what', ('ep', 32.34): 'now.', ('ep', 39.66): '', ('ep', 47.9): ''}
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

# Clipfarm x YoungLA — Tren Twins "Breaking Bad" $1M Black Friday giveaway trailer (57 s). 10 clips, one edit each:
# odd = narrator intro (A), even = punchline hook + hard cut (B). On-screen text must mention the $1M giveaway; caption soft-mention only.
S = dict(open_=(2.30, 8.00, 970), doit=(8.85, 10.25, 970), notyours=(10.70, 11.95, 960), walk=(12.00, 14.15, 960), land=(14.20, 15.90, 600),
         come=(16.20, 19.40, 700), comfy=(19.46, 22.30, 700), feels=(22.40, 24.40, 960), suck=(25.50, 29.40, 960), know=(31.22, 34.18, 960),
         million=(34.22, 36.40, 1340), believe=(37.30, 39.30, 1340), crazy=(39.35, 40.15, 960), spend=(40.20, 42.90, 960),
         mexa=(44.40, 45.03, 960), mexb=(45.07, 46.40, 640), oh=(47.50, 48.30, 640), els=(48.40, 50.30, 1340), ass=(50.40, 51.10, 1340),
         kid=(51.15, 52.75, 640), nap=(53.70, 55.70, 960))
def sc(*names): return [(f'c{k + 1}', *S[n]) for k, n in enumerate(names)]
def it(*ts): return [(f'i{k + 1}', t, t + 0.95, cx) for k, (t, cx) in enumerate(ts)]
M = [(39.62, 40.10), (47.85, 48.12)]
CL = {
 'tjump': dict(kind='a', vo='tjump', intro=it((14.90, 600), (3.00, 970), (9.00, 970), (14.25, 600)), body=sc('open_', 'doit', 'notyours', 'walk', 'land'),
   A='youngla is giving away $1,000,000 and he HAD to jump in 😭',
   sfx=[('c1', 'million', 's_ding.mp3'), ('c2', 'what?', 's_huh.mp3'), ('c3', 'money', 's_awk.mp3'), ('c4', None, 's_whoosh.mp3'), ('c5', None, 's_fahhh.mp3', 'e_laugh.png')]),
 'tmex': dict(kind='b', hook=S['kid'], body=sc('believe', 'spend', 'mexa', 'mexb', 'oh', 'els', 'ass', 'kid'),
   A='they found the $1,000,000 giveaway money and planned a MEXICO trip 💀',
   sfx=[('c2', '$100?', 's_huh.mp3'), ('c4', 'Mexico.', 's_ayo.mp3'), ('c6', 'money.', 's_awk.mp3'), ('c7', 'ass.', 's_fahhh.mp3'), ('c8', 'kidding', 's_rip.mp3', 'e_laugh.png')]),
 'tcomfy': dict(kind='a', vo='tcomfy', intro=it((20.00, 700), (16.60, 700), (34.30, 1340)), body=sc('come', 'comfy', 'feels', 'suck', 'know', 'million'),
   A='this is what $1,000,000 feels like apparently 😭',
   sfx=[('c2', 'comfy.', 's_ayo.mp3'), ('c3', 'good.', 's_ding.mp3'), ('c4', 'stomach', 's_huh.mp3'), ('c6', 'million', 's_wow.mp3', 'e_sob.png')]),
 'tbed': dict(kind='b', hook=(19.46, 20.85, 700), body=sc('come', 'comfy', 'feels', 'suck', 'know'),
   A='laying on the $1,000,000 giveaway like it\'s a BED 💀',
   sfx=[('c1', 'here', 's_huh.mp3'), ('c2', 'comfy.', 's_ayo.mp3'), ('c4', 'stomach', 's_fahhh.mp3', 'e_laugh.png'), ('c5', 'good.', 's_ding.mp3')]),
 'tspend': dict(kind='a', vo='tspend', intro=it((37.40, 1340), (41.00, 960), (45.20, 640)), body=sc('believe', 'crazy', 'spend', 'mexa', 'mexb', 'oh', 'els'),
   A='$1,000,000 giveaway for spending $100?? 🤯',
   sfx=[('c1', 'believe', 's_wow.mp3'), ('c3', '$100?', 's_huh.mp3'), ('c5', 'Mexico.', 's_fahhh.mp3', 'e_laugh.png')]),
 'tnotyours': dict(kind='b', hook=S['els'], body=sc('open_', 'doit', 'notyours', 'walk', 'land', 'els', 'ass'),
   A="bro forgot the $1,000,000 isn't HIS 😭",
   sfx=[('c1', 'million', 's_ding.mp3'), ('c3', 'money', 's_awk.mp3'), ('c5', None, 's_ayo.mp3'), ('c6', 'money.', 's_huh.mp3'), ('c7', 'ass.', 's_fahhh.mp3', 'e_laugh.png')]),
 'tkid': dict(kind='a', vo='tkid', intro=it((45.20, 640), (47.55, 640), (49.00, 1340)), body=sc('mexa', 'mexb', 'oh', 'els', 'ass', 'kid', 'nap'),
   A='he was NOT kidding about taking the $1,000,000 💀',
   sfx=[('c2', 'Mexico.', 's_ayo.mp3'), ('c4', 'money.', 's_awk.mp3'), ('c5', 'ass.', 's_fahhh.mp3'), ('c6', 'kidding', 's_huh.mp3', 'e_laugh.png'), ('c7', 'nap', 's_ding.mp3')]),
 'tfeels': dict(kind='b', hook=S['million'], body=sc('open_', 'walk', 'land', 'come', 'comfy', 'million'),
   A='no way youngla is giving away a MILLION bucks 🔥',
   sfx=[('c1', 'million', 's_wow.mp3'), ('c3', None, 's_fahhh.mp3'), ('c5', 'comfy.', 's_ayo.mp3'), ('c6', 'million', 's_ding.mp3', 'e_sob.png')]),
 'tnap': dict(kind='a', vo='tnap', intro=it((20.00, 700), (28.40, 960), (35.00, 1340)), body=sc('comfy', 'feels', 'suck', 'know', 'nap'),
   A='biggest giveaway EVER and they took a nap on it 😭',
   sfx=[('c1', 'comfy.', 's_ayo.mp3'), ('c3', 'stomach', 's_huh.mp3'), ('c4', 'good.', 's_ding.mp3'), ('c5', 'nap', 's_fahhh.mp3', 'e_laugh.png')]),
 'tbiggest': dict(kind='b', hook=(37.30, 39.10, 1340), body=sc('open_', 'doit', 'walk', 'land', 'believe', 'spend'),
   A='this has to be the biggest giveaway EVER 🤯',
   sfx=[('c1', 'million', 's_ding.mp3'), ('c2', 'what?', 's_huh.mp3'), ('c4', None, 's_fahhh.mp3'), ('c5', 'believe', 's_wow.mp3', 'e_sob.png'), ('c6', '$100?', 's_ayo.mp3')]),
}
E = {}
for k, d in CL.items():
    hl = lambda t: {w: RD for w in t.split() if sum(ch.isalpha() for ch in w) >= 2 and w.upper() == w}
    ex = [(pop([s] + ([w] if w else []), e[3], f, off=(2 if w else 20)) if len(e) > 3 else sfx([s] + ([w] if w else []), f, 0.5, off=(0 if w else 15))) for e in d['sfx'] for s, w, f in [e[:3]]]
    base = dict(mute=M, zoom={}, fixed=[s for s, *_ in d['body']], circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[], focus=dict(x=540, y=330, r=180, dur=20))
    if d['kind'] == 'a': E[k] = dict(base, vo=d['vo'], scenes=[(s, 'ep', a, b, cx) for s, a, b, cx in d['intro'] + d['body']], top=d['A'], hl=hl(d['A']), extras=ex)
    else: E[k] = dict(base, vo=None, scenes=[('hook', 'ep', *d['hook'])] + [(s, 'ep', a, b, cx) for s, a, b, cx in d['body']], top=d['A'], hl=hl(d['A']), extras=ex)
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
FOC = {'tjump': (335, 190, 150), 'tmex': (340, 220, 150), 'tcomfy': (280, 240, 150), 'tbed': (280, 240, 150), 'tspend': (660, 200, 150), 'tnotyours': (620, 240, 150), 'tkid': (360, 300, 150), 'tfeels': (660, 240, 150), 'tnap': (280, 240, 150), 'tbiggest': (660, 200, 150)}
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
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/tren.cfg.json', 'w'), indent=1); print('cfg ok')
