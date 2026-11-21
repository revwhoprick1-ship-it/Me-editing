# YoungLA "Bodybuilders vs Models" — creative formats (user: be creative, versus / comment-bait, not just single moments).
# Real moments only, recut: versus split-screens (top/bottom), rate-the-walk and which-car compilations, "what would you buy" answers.
# Scene = ('one', a, b, cx[, mute_src]) single shot, or ('split', a1, cx1, a2, cx2, dur) top/bottom panels (audio from top).
# Style: hook top text, colour caps captions, whip + whoosh on every cut, reaction SFX, echo emoji pops, Say Goodbye, face focus.
import json, subprocess, sys
DL, TX = sys.argv[1], sys.argv[2]
SRC = f'{DL}/ep.mp4'; FPS = 30
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.74:5:5:0,"
       "eq=contrast=1.113:saturation=1.26:gamma=0.98,curves=all='0/0 0.25/0.21 0.75/0.81 1/1',unsharp=3:3:0.79,"
       "colortemperature=temperature=8000,eq=saturation=0.96,format=yuv420p")
RD = '#FF2A2A'
W = [w for s in json.load(open(f'{TX}/ep.json')) for w in s['w']]
MUTE = [(330.85, 331.20), (332.18, 332.80), (604.20, 604.45)]
E = {
 'xvs': dict(top='MARLON or JAY CUTLER? top or bottom 👇', hl=['MARLON', 'JAY', 'CUTLER?'],
   scenes=[('split', 164.85, 1000, 230.60, 960, 11.80), ('one', 140.80, 145.95, 960), ('one', 250.75, 257.95, 960)],
   sfx=[(143.0, 's_ding.mp3'), (145.6, 's_wow.mp3'), (173.4, 's_huh.mp3'), (251.3, 's_ayo.mp3', 'e_laugh.png'), (257.4, 's_fahhh.mp3')]),
 'xcars': dict(top='which car are YOU taking? 👇', hl=['YOU'],
   scenes=[('one', 1073.45, 1078.95, 1300), ('one', 352.30, 357.95, 960), ('one', 554.70, 559.00, 960), ('one', 737.40, 739.95, 960)],
   sfx=[(1074.5, 's_ding.mp3'), (1078.0, 's_huh.mp3', 'e_laugh.png'), (354.9, 's_wow.mp3'), (557.0, 's_ayo.mp3'), (737.9, 's_tick.mp3', 'e_sob.png')]),
 'xrate': dict(top='rate every runway walk 1-10 👇', hl=['1-10'],
   scenes=[('one', 166.20, 170.40, 1000), ('one', 233.80, 237.60, 960), ('one', 413.20, 419.20, 960), ('one', 1072.00, 1076.00, 960),
           ('one', 1112.00, 1116.00, 960), ('one', 1146.00, 1150.00, 960)],
   sfx=[(169.4, 's_ding.mp3'), (236.7, 's_wow.mp3', 'e_sob.png'), (418.2, 's_huh.mp3', 'e_laugh.png'), (1074.0, 's_tick.mp3'), (1114.0, 's_ding.mp3'), (1148.0, 's_ayo.mp3')]),
 'xbuy': dict(top='what would YOU buy first with $1,000,000? 👇', hl=['YOU'],
   scenes=[('one', 575.55, 577.85, 1250), ('one', 590.35, 605.15, 960), ('one', 608.80, 612.20, 960)],
   sfx=[(576.6, 's_huh.mp3', 'e_laugh.png'), (595.3, 's_ding.mp3'), (603.9, 's_wow.mp3'), (611.3, 's_ayo.mp3', 'e_sob.png')]),
 'xmodel': dict(top='MODEL walk vs BODYBUILDER walk… who did it better? 👇', hl=['MODEL', 'BODYBUILDER'],
   scenes=[('split', 413.20, 960, 1077.00, 960, 6.00), ('one', 428.00, 445.45, 1050)],
   sfx=[(418.2, 's_huh.mp3'), (431.6, 's_wow.mp3'), (438.9, 's_ayo.mp3', 'e_laugh.png'), (444.9, 's_fahhh.mp3')]),
}
FOCUS = {'xvs': (540, 120, 120), 'xcars': (450, 280, 120), 'xrate': (560, 380, 110), 'xbuy': (880, 380, 130), 'xmodel': (420, 90, 90)}
gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, d in E.items():
    cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []; scenes = []; t = 0; ni = 0; spans = []
    for k, sc in enumerate(d['scenes']):
        sid = f's{k}'
        if sc[0] == 'one':
            _, a, b, cx = sc; dd = round((b - a) * FPS) / FPS
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', SRC]; i = ni; ni += 1
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,scale=1920:1080,setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{k}]')
            src_a = a
        else:
            _, a, cx1, a2, cx2, dur = sc; dd = round(dur * FPS) / FPS; b = a + dd
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', SRC, '-ss', f'{a2:.3f}', '-t', f'{dd:.4f}', '-i', SRC]; i = ni; ni += 2
            def pan(n, c): return f'[{n}:v]fps=30,setpts=PTS-STARTPTS,scale=956:538,pad=1080:538:62:0:black,setsar=1'
            fc.append(f'{pan(i, cx1)}[t{k}];{pan(i + 1, cx2)}[u{k}];[t{k}][u{k}]vstack,pad=1920:1080:420:2:black,format=yuv420p,trim=duration={dd:.4f}[v{k}]')
            cx = 960; src_a = a
        mt = ''.join(f",volume=0:enable='between(t,{max(0, m0 - src_a):.3f},{m1 - src_a:.3f})'" for m0, m1 in MUTE if m1 > src_a and m0 < src_a + dd)
        fc.append(f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dd:.4f}{mt}[a{k}]')
        n = round(dd * FPS); words = []
        for ws, we, tx in W:
            if src_a - 0.05 <= ws < src_a + dd - 0.05:
                tt = tx.strip().strip(',')
                if not tt or tt.lower().strip('.!?') in ('shit', 'fuck', 'f***ing'): continue
                f0 = max(0, round((ws - src_a) * FPS)); f1 = min(n, round((we - src_a) * FPS) + 3)
                if words and words[-1]['word'] == tt and words[-1]['startFrame'] == f0: continue
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        for j in range(len(words) - 1): words[j]['endFrame'] = min(words[j]['endFrame'], words[j + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': cx, 'crops': [[0, cx]], 'words': words})
        spans.append((src_a, src_a + dd, t, sid)); t += n / FPS
    k = len(d['scenes'])
    fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
    if '--no-excerpts' not in sys.argv:
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
    gen[eid] = scenes
    ex = []
    for st, fn, *em in d['sfx']:
        hit = [sp for sp in spans if sp[0] <= st < sp[1]]
        if not hit: print('  sfx outside', eid, st); continue
        a0, b0, t0, sid = hit[0]; off = round((st - a0) * FPS)
        ex.append(dict(at=[sid], kind='png', file=em[0], off=off, sfx=fn, sv=0.45) if em else dict(at=[sid], kind='sfx', file=fn, v=0.5, off=off))
    ex += [dict(at=[s['id']], kind='sfx', file='s_whoosh.mp3', v=0.45, off=0) for s in scenes[2:]]
    fx, fy, fr = FOCUS[eid]
    CFG[eid] = dict(noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[], focus=dict(x=fx, y=fy, r=fr, dur=20),
                    top=d['top'], hl={w: RD for w in d['hl']}, extras=ex, music=['goodbye_n', 0], capCycle=True, whip=True, trackData={}, cta='', track='none',
                    calls=[], src=f'g67_{eid}.mp4', intro=False, hardcut=True, cutSfx='s_whoosh.mp3', sat=1.1, progress=False, popMid=True, srcVol=1, musicVol=0.28)
    print(eid, round(t, 1), 's |', ' / '.join(' '.join(w['word'] for w in s['words']) for s in scenes)[:220])
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/yl2.cfg.json', 'w'), indent=1); print('cfg ok')
