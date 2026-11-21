# KreekCraft GTA 6 (Clipfarm): 8 edits from KreekCraft's own GTA 6 stream footage (clips on his Twitch channel).
# Layout = user's reference short (facecam panel 1080x675 on top, gameplay 1080x1245 below, hook on the seam),
# look = user's style (Kreek.tsx). Gameplay crop stops above the stream's burned-in live captions.
# Usage: python3 plan_kreek.py <src dir> <tx dir>
import json, subprocess, sys
SRC, TX = sys.argv[1], sys.argv[2]
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.2,unsharp=5:5:1.2:5:5:0,"
       "eq=contrast=1.08:saturation=1.15:gamma=0.98,colortemperature=temperature=7600,format=yuv420p")
FACE = (0, 60, 560, 350)          # facecam crop in the 1920x1080 stream (top-left)
GAME = (698, 0, 824, 950)          # gameplay crop (right of the facecam, above the live captions)
FPS = 30
# clip: hook (src, a, b) then body segments; sfx = (src time, file[, emoji]); mute = source ranges
E = {
 'kcroc': dict(k='k04', hook=(18.70, 21.95), body=[(2.90, 9.40), (14.60, 29.65)],
   top='he promised a giveaway if a CROCODILE got him 💀', hl=['CROCODILE'],
   sfx=[(5.0, 's_ding.mp3'), (9.0, 's_huh.mp3'), (18.8, 's_fahhh.mp3'), (20.3, 's_ayo.mp3', 'e_laugh.png'), (24.2, 's_tick.mp3'), (29.4, 's_rip.mp3', 'e_sob.png')]),
 'kjet': dict(k='k14', hook=(16.60, 21.00), body=[(0.70, 9.20), (13.00, 26.00), (43.00, 48.50)],
   top='"if a DOG on a jet ski picks me up…" 😭', hl=['DOG'],
   sfx=[(4.1, 's_huh.mp3'), (8.7, 's_ayo.mp3'), (16.9, 's_wow.mp3', 'e_sob.png'), (24.6, 's_fahhh.mp3'), (46.2, 's_ding.mp3', 'e_laugh.png')]),
 'kpreg': dict(k='k21', hook=(17.50, 20.90), body=[(0.00, 4.60), (6.10, 8.30), (15.50, 34.60)],
   top='gta 6 caught him off guard with THIS 💀', hl=['THIS'],
   sfx=[(3.0, 's_ding.mp3'), (19.7, 's_fahhh.mp3', 'e_sob.png'), (24.4, 's_huh.mp3'), (30.2, 's_ayo.mp3'), (33.6, 's_rip.mp3', 'e_laugh.png')]),
 'kgranny': dict(k='k11', hook=(17.40, 21.95), body=[(9.00, 23.30), (35.20, 41.50)], mute=[(22.85, 23.25)],
   top='granny on a mobility scooter CHASED him 😭', hl=['CHASED'],
   sfx=[(12.2, 's_wow.mp3'), (18.2, 's_fahhh.mp3', 'e_sob.png'), (20.1, 's_ayo.mp3'), (35.8, 's_ding.mp3', 'e_laugh.png')]),
 'kshark': dict(k='k03', hook=(10.80, 14.25), body=[(2.70, 14.25)],
   top='he went LOOKING for the shark 🦈', hl=['LOOKING'],
   sfx=[(3.3, 's_huh.mp3'), (5.0, 's_tick.mp3'), (11.9, 's_fahhh.mp3', 'e_sob.png'), (13.4, 's_wow.mp3')]),
 'ksorry': dict(k='k02', hook=(14.20, 17.90), body=[(0.00, 14.90), (23.50, 29.50)],
   top='the most POLITE criminal in gta 6 😭', hl=['POLITE'],
   sfx=[(1.0, 's_huh.mp3'), (8.9, 's_ding.mp3'), (15.8, 's_ayo.mp3', 'e_laugh.png'), (26.1, 's_fahhh.mp3', 'e_sob.png')]),
 'kban': dict(k='k01', hook=(14.90, 18.40), body=[(0.00, 2.00), (10.50, 24.60)],
   top='he almost got his stream BANNED 💀', hl=['BANNED'],
   sfx=[(0.9, 's_huh.mp3'), (12.0, 's_ding.mp3'), (15.9, 's_fahhh.mp3', 'e_sob.png'), (21.9, 's_ayo.mp3'), (24.0, 's_rip.mp3', 'e_laugh.png')]),
 'kshoe': dict(k='k09', hook=(24.40, 28.20), body=[(2.10, 4.60), (6.00, 28.20)],
   top='he ranked every shoe store in gta 6 and it went WRONG 😭', hl=['WRONG'],
   sfx=[(4.3, 's_huh.mp3'), (12.0, 's_ding.mp3'), (20.4, 's_ayo.mp3'), (22.8, 's_fahhh.mp3', 'e_laugh.png'), (25.3, 's_rip.mp3', 'e_sob.png')]),
}
FOCUS = (500, 420, 210)
CFG = {}
for eid, d in E.items():
    src = f"{SRC}/{d['k']}.mp4"; segs = [d['hook']] + d['body']
    W = [w for s in json.load(open(f"{TX}/{d['k']}.json")) for w in s['w']]
    cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []; t = 0; starts = []; words = []; extras = []
    for i, (a, b) in enumerate(segs):
        dd = round((b - a) * FPS) / FPS; starts.append((a, b, t))
        cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', src]
        fx, fy, fw, fh = FACE; gx, gy, gw, gh = GAME
        fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,split[f{i}][g{i}];[f{i}]crop={fw}:{fh}:{fx}:{fy},scale=1080:676[ft{i}];'
                  f'[g{i}]crop={gw}:{gh}:{gx}:{gy},scale=1080:1244[gt{i}];[ft{i}][gt{i}]vstack,setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{i}]')
        mt = ''.join(f",volume=0:enable='between(t,{max(0, m0 - a):.3f},{m1 - a:.3f})'" for m0, m1 in d.get('mute', []) if m1 > a and m0 < b)
        fc.append(f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dd:.4f}{mt}[a{i}]')
        for ws, we, tx in W:
            if a - 0.05 <= ws < b - 0.05:
                tt = tx.strip().strip(',')
                if tt.lower().strip('.!?') in ('shit', 'fuck'): continue
                f0 = round((t + max(0, ws - a)) * FPS); f1 = round((t + min(b, we) - a) * FPS) + 2
                if words and words[-1]['w'] == tt and words[-1]['f0'] == f0: continue
                words.append({'w': tt, 'f0': f0, 'f1': f1})
        t += dd
    for j in range(len(words) - 1): words[j]['f1'] = min(words[j]['f1'], words[j + 1]['f0'])
    k = len(segs)
    fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
    if '--no-excerpts' not in sys.argv:
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/k_{eid}.mp4'], check=True)
    for st, fn, *em in d['sfx']:
        hit = [(a, b, t0) for a, b, t0 in starts[1:] if a <= st < b] or [(a, b, t0) for a, b, t0 in starts if a <= st < b]
        if not hit: print('  sfx outside', eid, st); continue
        a, b, t0 = hit[0]; fr = round((t0 + st - a) * FPS)
        extras.append({'f': fr, 'kind': 'png', 'file': em[0], 'sfx': fn} if em else {'f': fr, 'kind': 'sfx', 'file': fn})
    cuts = [round(t0 * FPS) for a, b, t0 in starts[1:]]
    CFG[eid] = dict(src=f'k_{eid}.mp4', dur=round(t * FPS), top=d['top'], hl=d['hl'], cuts=cuts, words=words, extras=extras,
                    focus=dict(zip(('x', 'y', 'r'), d.get('focus', FOCUS)), dur=20), musicVol=0.12)
    print(eid, round(t, 1), 's |', ' '.join(w['w'] for w in words)[:160])
json.dump(CFG, open('src/kreek.cfg.json', 'w'), indent=1); print('cfg ok')
