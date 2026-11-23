# YoungLA "speed dates with Joe Fazer" clips in the user's reference-Short style (Chad Aura "Joe Fazer has NEVER been this humbled"):
# square box in the middle of a light-grey 9:16 frame, short black hook line above it (Inter, no outline, static), one small coloured word
# at a time on a dark pill, red flash + shock SFX on key words, swoosh on cuts, riser at the start, "Say Goodbye" under the dialogue,
# fade-in from white. Each camera shot is reframed from the 4K master into a square around the people (white-studio person mask).
# usage: python3 plan_yl4.py <4k src> <tx.json> [--no-excerpts] [--only=id,id]
import json, re, subprocess, sys
import numpy as np, cv2
SRC, TXJ = sys.argv[1], sys.argv[2]
W = [w for s in json.load(open(TXJ)) for w in s['w']]
FIX = {1950.8: '', 1951.0: '', 1951.2: '', 1951.3: '', 1952.9: 'buzz'}   # ASR fixes keyed by word start (rounded to 0.1 s); '' = no caption
REPL = {'Curtin': 'curtain'}
_CL_B1 = None  # batch 1 (ylbow ylscar ylkiki ylamazon ylslam) is in git history
CL = {
 'ylcurtain': dict(body=[(1261.6, 1279.0), (1338.3, 1358.4)], A='He roasted her dress so politely 😭', hl={},
   red=['curtain', 'complimentary', 'Lady.', 'School.']),
 'ylwahey': dict(body=[(506.3, 547.0)], A='The trick was SUPPOSED to fail 💀', hl={},
   red=['wrong.', 'spades.', 'What?', 'right.']),
 'ylbuzz': dict(body=[(1945.7, 1955.7), (1990.8, 2016.8)], A='Bro could NOT open the drink 💀', hl={},
   red=['hell.', 'slap', 'body.', 'forget']),
 'ylthanks': dict(body=[(2194.2, 2215.0), (2223.8, 2240.0)], A='The worst first-date workout ever 😭', hl={},
   red=['Squats.', 'presence.', 'Star', 'jumping?']),
 'ylpick': dict(body=[(3090.7, 3109.9)], A='She begged him to pick her… 💀', hl={},
   red=['embarrassing', 'eliminated.', 'lying.', 'gorgeous']),
}
ONLY = [x for a in sys.argv if a.startswith('--only=') for x in a[7:].split(',')]

def frame(t, w=960):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', SRC, '-frames:v', '1', '-vf', f'scale={w}:-1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, w, 3)

def cuts(a, b):
    out = subprocess.run(['ffmpeg', '-ss', f'{a:.2f}', '-t', f'{b - a:.2f}', '-i', SRC, '-vf', "scale=480:-1,select='gt(scene,0.3)',showinfo", '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return [round(a + float(m), 2) for m in re.findall(r'pts_time:([0-9.]+)', out)]

def square(a, b):
    """square crop (4K px) around everyone in the shot: non-white pixels below the light rig, union over 3 frames, 20 % margin."""
    boxes = []
    for t in (a + 0.15, (a + b) / 2, b - 0.15):
        im = frame(t); h, w = im.shape[:2]; s = 3840 / w
        hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV); m = ((hsv[..., 2] < 185) | (hsv[..., 1] > 60)).astype(np.uint8)
        m[: int(h * 0.12)] = 0; m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        ys, xs = np.nonzero(m)
        if len(xs) > 200: boxes.append((np.percentile(xs, 1) * s, np.percentile(ys, 1) * s, np.percentile(xs, 99) * s, np.percentile(ys, 99) * s))
    if not boxes: return 1080, 0, 2160
    x0, y0 = min(q[0] for q in boxes), min(q[1] for q in boxes); x1, y1 = max(q[2] for q in boxes), max(q[3] for q in boxes)
    side = int(min(2160, max(1150, 1.2 * max(x1 - x0, y1 - y0)))); cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    x = int(min(3840 - side, max(0, cx - side / 2))); y = int(min(2160 - side, max(0, cy - side / 2 - 0.04 * side)))
    return x, y, side

def tighten(a, b):
    ws = [w for w in W if a - 0.02 <= w[0] < b]; segs, cur = [], a
    for w1, w2 in zip(ws, ws[1:]):
        if w2[0] - w1[1] > 0.75: segs.append([cur, w1[1] + 0.2]); cur = w2[0] - 0.2
    segs.append([cur, b]); i = 0
    while i < len(segs) - 1:
        if segs[i][1] - segs[i][0] < 1.0 or segs[i + 1][1] - segs[i + 1][0] < 1.0: segs[i][1] = segs[i + 1][1]; del segs[i + 1]
        else: i += 1
    return segs

gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, d in CL.items():
    pieces = [p for a, b in d['body'] for p in tighten(a, b)]
    shots = []
    for a, b in pieces:   # split each piece at camera cuts (each shot gets its own square); no sub-0.5 s slivers
        cs = [c for c in cuts(a, b) if a + 0.5 < c < b - 0.5]; edges = [a] + cs + [b]
        shots += [(x, y) for x, y in zip(edges, edges[1:])]
    scenes, t = [], 0.0
    for i, (a, b) in enumerate(shots):
        n = round((b - a) * 30); words = []
        for ws, we, tx in W:
            tx = FIX.get(round(ws, 1), REPL.get(tx.strip(), tx.strip()))
            if a - 0.05 <= ws < b - 0.05 and tx.strip():
                f0 = max(0, round((ws - a) * 30)); words.append({'word': tx.strip().strip(','), 'startFrame': f0, 'endFrame': min(n, max(f0 + 4, round((we - a) * 30) + 3))})
        for k in range(len(words) - 1): words[k]['endFrame'] = min(words[k]['endFrame'], words[k + 1]['startFrame'])
        scenes.append({'id': f's{i}', 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': 960, 'crops': [[0, 960]], 'words': words}); t += n / 30
    gen[eid] = scenes
    print(eid, round(t, 1), 's', len(shots), 'shots |', ' '.join(w['word'] for s in scenes for w in s['words'])[:160])
    if '--no-excerpts' not in sys.argv and (not ONLY or eid in ONLY):
        cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []
        for i, (a, b) in enumerate(shots):
            x, y, side = square(a, b); dd = round((b - a) * 30) / 30
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', SRC]
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,crop={side}:{side}:{x}:{y},scale=1080:1080:flags=lanczos,pad=1920:1080:420:0:color=0xEEF2F2,'
                      f'eq=contrast=1.04:saturation=1.08,setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{i}]')
            fc.append(f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dd:.4f}[a{i}]')
        k = len(shots); fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[cv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/yl4_{eid}.mp4'], check=True)
    sc = {s['id']: [w['word'].lower() for w in s['words']] for s in scenes}
    def ref(word):
        for s in scenes:
            if any(w.startswith(word.lower()) for w in sc[s['id']]): return [s['id'], word]
    tints = [[r, 'R'] for r in (ref(w) for w in d['red']) if r]
    ex = [dict(at=['s0'], kind='sfx', file='riser.mp3', v=0.35, off=0)] + [dict(at=[s['id']], kind='sfx', file='s_whoosh.mp3', v=0.4, off=0) for s in scenes[1:]]
    CFG[eid] = dict(top=d['A'], hl=d['hl'], src=f'yl4_{eid}.mp4', cta='', ask=[], track='none', calls=[], trackData={}, tints=tints, rizz=[], punch=[], blowouts=[],
                    blackFlash=[], streaks=[], extras=ex, music=['goodbye', 12], musicVol=0.16, origAudio=False, capCycle=True, capPill=True, capSize=50, capY=1150,
                    whip=False, hardcut=False, popMid=False, steady=True, noFocus=True, noSkull=True, topStatic=True, loop=True, bg='#EEF2F2', topColor='#111111',
                    topFont='Inter', topSize=50, bf=0, fadeWhite=6, intro=False, progress=False, srcVol=1, sat=1.0, vo=None)
    print('  red flashes:', [r[0] for r in tints])
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/yl4.cfg.json', 'w'), indent=1); print('cfg ok')
