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
FIXW = {(293.21, 'H'): 'H&M.', (293.21, '&M.'): '', (655.5, 'hers'): 'he', (656.02, 'a'): '', (576.94, 'Because'): ''}
MUTE = [(330.85, 331.20), (332.18, 332.80), (604.20, 604.45)]
Z = (462, 0, 1458, 820)
import numpy as np
def refine(a, b):
    # snap stutter in/out to the quietest 10 ms near each word edge (no clipped syllables, no clicks)
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{a - 0.2:.3f}', '-t', f'{b - a + 0.4:.3f}', '-i', SRC, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'],
                                     capture_output=True).stdout, np.float32)
    e = np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, 'same'))[::160]
    def best(t, lo, hi):
        i0, i1 = int((t - (a - 0.2) + lo) * 100), int((t - (a - 0.2) + hi) * 100)
        i0 = max(0, i0); seg = e[i0:max(i0 + 1, i1)]
        return (a - 0.2) + (i0 + int(np.argmin(seg))) / 100
    return round(best(a, -0.04, 0.04), 3), round(best(b, -0.05, 0.05), 3)
# meme scene kinds: ('frz', t, fx, fy, dur) freeze + push-in on a face (vine boom), ('slow', a, b, cx, f) slow-mo (muted), ('one', a, b, cx[, zoom]) incl. stutter repeats
E = {
 'm30': dict(top='he said "30 SECONDS"… 💀', hl=['SECONDS"…'],
   scenes=[('one', 309.45, 314.20, 1200), ('one', 323.00, 324.60, 960),
           ('one', 329.55, 333.90, 960, Z), ('frz', 331.40, 1600, 300, 1.2), ('one', 333.85, 337.75, 960, Z)],
   sfx=[(313.5, 'm_bass-boosted-vine-boom.mp3'), (312.3, 's_huh.mp3'), (323.5, 'm_crickets.mp3'), (330.0, 'm_record-scratch.mp3'), (334.3, 's_fahhh.mp3', 'e_laugh.png'), (336.5, 'm_bruh.mp3')]),
 'mshoot': dict(top="his photographer's directions made NO sense 😭", hl=['NO'],
   scenes=[('one', 54.50, 62.00, 1080), ('frz', 62.60, 1120, 170, 1.2), ('one', 64.20, 66.60, 1080), ('one', 66.57, 69.40, 1080),
           ('one', 74.70, 77.60, 1080), ('one', 83.45, 87.00, 1300)],
   sfx=[(58.3, 's_huh.mp3'), (61.4, 'm_huh-cat.mp3'), (66.05, 'm_bass-boosted-vine-boom.mp3'), (66.2, 'm_meme-bonk.mp3'), (68.7, 's_fahhh.mp3', 'e_laugh.png'), (75.9, 'm_spongebob-boowomp.mp3'), (84.0, 's_ding.mp3')]),
 'mhm': dict(top='bro listed his runways like a RESUME 💀', hl=['RESUME'],
   scenes=[('one', 287.50, 293.80, 1100),  ('frz', 296.90, 1200, 420, 1.0), ('one', 294.70, 297.60, 1100)],
   sfx=[(290.6, 's_huh.mp3'), (293.2, 'm_bass-boosted-vine-boom.mp3'), (295.0, 'm_meme-trombone.mp3'), (296.6, 's_fahhh.mp3', 'e_laugh.png')]),
 'mtoes': dict(top='"what\'s the FIRST thing you\'d buy?" 💀', hl=['FIRST'],
   scenes=[('one', 576.45, 577.05, 1250), ('one', 571.85, 577.10, 1250), ('frz', 576.95, 1400, 370, 1.2),
           ('one', 577.05, 577.85, 1250), ('one', 586.40, 589.40, 960)],
   sfx=[(576.6, 'm_bass-boosted-vine-boom.mp3'), (574.2, 'm_crickets.mp3'), (576.6, 'm_huh-cat.mp3'), (577.1, 's_fahhh.mp3', 'e_laugh.png'), (588.4, 'm_bruh.mp3')]),
 'mjay': dict(top="jay cutler's review was BRUTAL 💀", hl=['BRUTAL'],
   scenes=[('one', 655.20, 657.20, 760), ('slow', 646.00, 649.00, 920, 2.0), ('one', 652.40, 654.15, 760), ('frz', 655.40, 990, 300, 1.2), ('one', 654.15, 657.20, 760), 
           ('one', 675.50, 678.20, 790)],
   sfx=[(653.0, 's_wow.mp3'), (655.9, 'm_bass-boosted-vine-boom.mp3'), (656.2, 's_fahhh.mp3', 'e_laugh.png'), (677.7, 'm_bass-boosted-vine-boom.mp3'), (676.2, 'm_oh-hell-nah.mp3'), (677.5, 'm_meme-trombone.mp3', 'e_sob.png')]),
}
FOCUS = {'m30': (540, 300, 160), 'mshoot': (700, 260, 140), 'mhm': (800, 420, 150), 'mtoes': (540, 300, 170), 'mjay': (770, 300, 140), '_xvs': (540, 120, 120), 'xcars': (450, 280, 120), 'xrate': (560, 380, 110), 'xbuy': (880, 380, 130), 'xmodel': (420, 90, 90)}
gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, d in E.items():
    cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []; scenes = []; t = 0; ni = 0; spans = []; booms = []; ticks = []
    for k, sc in enumerate(d['scenes']):
        sid = f's{k}'
        silent = False
        if sc[0] == 'one':
            a, b, cx = sc[1:4]; zz = sc[4] if len(sc) > 4 else None; dd = round((b - a) * FPS) / FPS
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', SRC]; i = ni; ni += 1
            geo = f'crop={zz[2]}:{zz[3]}:{zz[0]}:{zz[1]},scale=1920:1080' if zz else 'scale=1920:1080'
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,{geo},setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{k}]')
            src_a = a
        elif sc[0] == 'frz':
            _, ft, fx, fy, dd = sc; dd = round(dd * FPS) / FPS; n0 = round(dd * FPS)
            cmd += ['-ss', f'{ft:.3f}', '-i', SRC]; i = ni; ni += 1
            fc.append(f"[{i}:v]trim=end_frame=1,loop=loop={n0}:size=1:start=0,setpts=N/30/TB,scale=1920:1080,"
                      f"zoompan=z='1.35+0.45*on/{n0}':x='max(0,min(iw-iw/zoom,{fx}-iw/zoom/2))':y='max(0,min(ih-ih/zoom,{fy}-ih/zoom/2))':d=1:s=1920x1080:fps=30,"
                      f"setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{k}]")
            cx = 960 + max(-420, min(420, 0)); src_a = None; silent = True
        elif sc[0] == 'stut':
            _, a, b, fx, fy, nrep = sc; a, b = refine(a, b); d1 = round((b - a) * FPS) / FPS; dd = d1 * nrep
            cmd += ['-ss', f'{a:.3f}', '-t', f'{d1:.4f}', '-i', SRC]; i = ni; ni += 1
            vs = ''.join(f'[r{k}_{q}]' for q in range(nrep)); as_ = ''.join(f'[q{k}_{q}]' for q in range(nrep))
            parts = [f'[{i}:v]fps=30,setpts=PTS-STARTPTS,scale=1920:1080,split={nrep}{vs}', f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,asplit={nrep}{as_}']
            for q in range(nrep):
                z = 1 + 0.22 * q; w, h = round(1920 / z / 2) * 2, round(1080 / z / 2) * 2
                X, Y = max(0, min(1920 - w - 16, fx - w // 2)), max(0, min(1080 - h - 10, fy - h // 2))
                parts.append(f"[r{k}_{q}]crop={w}:{h}:'{X}+if(lt(n,4),14*mod(n,2),0)':'{Y}+if(lt(n,4),8*mod(n+1,2),0)',scale=1920:1080,"
                             f"eq=brightness='if(lt(n,2),0.28-0.14*n,0)':eval=frame,rgbashift=rh=10:bh=-10:enable='lt(n,3)',setsar=1,format=yuv420p,trim=duration={d1:.4f}[o{k}_{q}]")
                parts.append(f'[q{k}_{q}]atrim=0:{d1:.4f},afade=t=in:d=0.012,afade=t=out:st={max(0, d1 - 0.015):.4f}:d=0.015[p{k}_{q}]')
            parts.append(''.join(f'[o{k}_{q}][p{k}_{q}]' for q in range(nrep)) + f'concat=n={nrep}:v=1:a=1[v{k}][a{k}]')
            fc.append(';'.join(parts)); cx = 960; src_a = None; silent = 'stut'
            stw = [(max(0, round((ws - a) * FPS)), min(round(d1 * FPS), round((we - a) * FPS) + 3), FIXW.get((round(ws, 2), tx.strip()), tx.strip().strip(',')))
                   for ws, we, tx in W if a - 0.02 <= ws < b - 0.06]
        elif sc[0] == 'slow':
            _, a, b, cx, fac = sc; dd = round((b - a) * fac * FPS) / FPS
            cmd += ['-ss', f'{a:.3f}', '-t', f'{b - a:.4f}', '-i', SRC]; i = ni; ni += 1
            fc.append(f'[{i}:v]setpts={fac}*(PTS-STARTPTS),fps=30,scale=1920:1080,setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{k}]')
            src_a = None; silent = True
        else:
            _, a, cx1, a2, cx2, dur = sc; dd = round(dur * FPS) / FPS; b = a + dd
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', SRC, '-ss', f'{a2:.3f}', '-t', f'{dd:.4f}', '-i', SRC]; i = ni; ni += 2
            def pan(n, c): return f'[{n}:v]fps=30,setpts=PTS-STARTPTS,scale=956:538,pad=1080:538:62:0:black,setsar=1'
            fc.append(f'{pan(i, cx1)}[t{k}];{pan(i + 1, cx2)}[u{k}];[t{k}][u{k}]vstack,pad=1920:1080:420:2:black,format=yuv420p,trim=duration={dd:.4f}[v{k}]')
            cx = 960; src_a = a
        if silent == 'stut': pass
        elif silent:
            fc.append(f'anullsrc=r=48000:cl=stereo,atrim=0:{dd:.4f}[a{k}]')
        else:
            mt = ''.join(f",volume=0:enable='between(t,{max(0, m0 - src_a):.3f},{m1 - src_a:.3f})'" for m0, m1 in MUTE if m1 > src_a and m0 < src_a + dd)
            fc.append(f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dd:.4f}{mt}[a{k}]')
        n = round(dd * FPS); words = []
        for ws, we, tx in ([] if silent else W):
            if src_a - 0.05 <= ws < src_a + dd - 0.05:
                tt = FIXW.get((round(ws, 2), tx.strip()), tx.strip().strip(','))
                if not tt or '*' in tt or 'fuck' in tt.lower() or tt.lower().strip('.!?') == 'shit': continue
                f0 = max(0, round((ws - src_a) * FPS)); f1 = min(n, round((we - src_a) * FPS) + 3)
                if words and words[-1]['word'] == tt and words[-1]['startFrame'] == f0: continue
                words.append({'word': tt, 'startFrame': f0, 'endFrame': f1})
        if silent == 'stut':
            n1 = round(d1 * FPS)
            words = [{'word': tt, 'startFrame': q * n1 + f0, 'endFrame': q * n1 + f1} for q in range(nrep) for f0, f1, tt in stw if tt]
            ticks.extend((sid, q * n1) for q in range(nrep))
        for j in range(len(words) - 1): words[j]['endFrame'] = min(words[j]['endFrame'], words[j + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': cx, 'crops': [[0, cx]], 'words': words})
        spans.append((src_a, (src_a + dd) if src_a is not None else None, t, sid)); t += n / FPS
        if sc[0] == 'frz': booms.append(sid)
    k = len(d['scenes'])
    fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
    if '--no-excerpts' not in sys.argv:
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
    gen[eid] = scenes
    ex = []
    for st, fn, *em in d['sfx']:
        hit = [sp for sp in spans if sp[0] is not None and sp[0] <= st < sp[1]][:1]
        if not hit: print('  sfx outside', eid, st); continue
        a0, b0, t0, sid = hit[0]; off = round((st - a0) * FPS)
        ex.append(dict(at=[sid], kind='png', file=em[0], off=off, sfx=fn, sv=0.45) if em else dict(at=[sid], kind='sfx', file=fn, v=0.5, off=off))
    ex += [dict(at=[s['id']], kind='sfx', file='s_whoosh.mp3', v=0.45, off=0) for s in scenes[2:] if s['id'] not in booms]
    ex += [dict(at=[b], kind='sfx', file='m_bass-boosted-vine-boom.mp3', v=0.6, off=0) for b in booms]
    ex += [dict(at=[s], kind='sfx', file='s_camflash.mp3', v=0.35, off=o) for s, o in ticks]
    fx, fy, fr = FOCUS[eid]
    CFG[eid] = dict(noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=[], focus=dict(x=fx, y=fy, r=fr, dur=20),
                    top=d['top'], hl={w: RD for w in d['hl']}, extras=ex, music=['goodbye_n', 0], capCycle=True, whip=True, trackData={}, cta='', track='none',
                    calls=[], src=f'g67_{eid}.mp4', intro=False, hardcut=True, cutSfx='s_whoosh.mp3', sat=1.1, progress=False, popMid=True, srcVol=1, musicVol=0.28)
    print(eid, round(t, 1), 's |', ' / '.join(' '.join(w['word'] for w in s['words']) for s in scenes)[:220])
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/yl3.cfg.json', 'w'), indent=1); print('cfg ok')
