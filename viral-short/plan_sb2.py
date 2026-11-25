# Summer Breaks x Fanatics Live, batch 2 (user 2026-11-25 feedback on batch 1):
# - lag was the SOURCE (live-stream dropped frames) -> only moments with smooth source (dup-frame scan, sb/dup.txt)
# - VERTICAL tall box (not 1:1): black band with the hook on top, video box y 250-1900 (Guess cfg boxTop/boxBottom)
# - framing: 'wide' = whole stream view (Emma + co-host visible AND the card cam), 'card' = 2x on the card, 'cardm' = 1.5x; per-scene card centre
# - NO video filters (no grade)
# - overlays / emojis / SFX ONLY from the user's EDITING RESOURCES (public/res/r_*, e_*), lots of SFX with exact timings:
#   good hit -> green flash overlay + money + ding (user's guideline), meme/bad -> red tint + fah + shock, riser into reveals,
#   swoosh on every cut, wow/huh/aww/ahh/correct/awk/ayo reactions, money-fall overlay on the biggest hit, comment question at the end
# - 2 clips Jorho look, 3 clips original VverPaldo look (both on the vertical box)
# usage: python3 plan_sb2.py <src dir> <tx dir> [--only=id,id] [--no-excerpts]
import glob, json, os, subprocess, sys
SRC, TX = sys.argv[1], sys.argv[2]
ONLY = [x for a in sys.argv if a.startswith('--only=') for x in a[7:].split(',')]
BOXT, BOXB = 250, 1900
AR = 1080 / ((BOXB - BOXT) / 1080) / 1080          # visible src window aspect (w/h) inside the box = 0.6545
EXTRA = {'51': [[28.20, 28.70, ' I'], [28.76, 28.94, ' remember'], [28.96, 29.20, ' the'], [29.24, 29.66, ' rudest'], [29.70, 30.04, ' awakening']]}
FIX = {('01', 0.42): 'Skenes.', ('01', 1.18): 'Skenes,', ('01', 2.22): 'Skenes,', ('01', 53.41, 'Skeens'): 'Skenes', ('52', 19.14): 'Allen', ('03', 43.80): 'one',
       ('03', 43.92): 'of', ('03', 45.40): 'one', ('03', 45.52): 'of', ('03', 50.96): 'One', ('03', 51.04): 'of', ('03', 51.76): 'One', ('03', 51.78): 'of', ('01', 63.45): '', ('01', 64.23): ''}

def crop(kind, c):
    """source px crop (w, h, x, y) with the box aspect; c = (cx, cy) card/subject centre"""
    if kind == 'wide': h = 855; w = round(h * AR); return w, h, 72 + (560 - w) // 2, 186
    h = 523 if kind == 'card' else 680
    w = round(h * AR); cx, cy = c or (352, 790)
    return w, h, int(min(632 - w, max(72, cx - w / 2))), int(min(1130 - h, max(186, cy - h / 2)))

def sfx(at, f, v=0.5, off=0): return dict(at=list(at), kind='sfx', file=f, v=v, off=off)
def ov(at, f, dur=34, op=0.6, off=0): return dict(at=list(at), kind='ov', file=f, dur=dur, op=op, off=off)
def png(at, f, off=0, y=760, size=300, react=None): return dict(at=list(at), kind='png', file=f, off=off, y=y, size=size, **({'sfx': react, 'sv': 0.5} if react else {}))
def txt(at, t, off=0, dur=75, y=1430, color='#FFFFFF', size=54): return dict(at=list(at), kind='txt', file=t, color=color, size=size, y=y, dur=dur, off=off, flat=True)
FXK = {'wow': 'r_wow.mp3', 'huh': 'r_huh.mp3', 'aww': 'r_aww.mp3', 'ahh': 'r_ahh.mp3', 'correct': 'r_correct.mp3', 'awk': 'r_awk.mp3', 'ayo': 'r_ayo.mp3',
       'hit': 'r_hit.mp3', 'camnice': 'r_camnice.mp3', 'mogged': 'r_mogged.mp3', 'ding': 'r_ding.mp3', 'fah': 'r_fah.mp3', 'shock': 'r_shock.mp3',
       'money': 'r_money.mp3', 'suspense': 'r_suspense.mp3', 'typing': 'r_typing.mp3', 'next': 'r_next.mp3', 'loading': 'r_loading.mp3', 'rizz': 'r_rizz.mp3', 'pop': 'r_pop.mp3'}
EMO = {'laugh': 'e_laugh.png', 'sob': 'e_sob.png', 'think': 'e_think.png', 'skull': 'e_skull.png', 'rizz': 'e_rizz.png', 'heart': 'e_heart.png'}

CL = {}   # filled below (picked after the lag scan)
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'plan_sb2_clips.py')).read())

gen = json.load(open('src/edits.gen.json')); CFG = json.load(open('src/sb.cfg.json'))
for eid, d in CL.items():
    f = glob.glob(os.path.join(SRC, d['n'] + ' - *.mp4'))[0]
    W = sorted([w for s in json.load(open(glob.glob(os.path.join(TX, d['n'] + ' - *.json'))[0])) for w in s['w']] + EXTRA.get(d['n'], []), key=lambda w: w[0])
    scenes, t = [], 0.0
    for sid, a, b, kind, *c in d['scenes']:
        n = round((b - a) * 30); words = []
        for ws, we, tx in W:
            tx = FIX.get((d['n'], round(ws, 2), tx.strip()), FIX.get((d['n'], round(ws, 2)), tx.strip()))
            if a - 0.05 <= ws < b - 0.05 and tx.strip():
                f0 = max(0, round((ws - a) * 30)); words.append({'word': tx.strip().strip(','), 'startFrame': f0, 'endFrame': min(n, max(f0 + 4, round((we - a) * 30) + 3))})
        for k in range(len(words) - 1): words[k]['endFrame'] = min(words[k]['endFrame'], words[k + 1]['startFrame'])   # caption leaves when the word ends (guideline)
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': 960, 'crops': [[0, 960]], 'words': words}); t += n / 30
    gen[eid] = scenes
    print(eid, round(t, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:400])
    if '--no-excerpts' not in sys.argv and (not ONLY or eid in ONLY):
        cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []
        bw = round(1080 * AR)
        for i, (sid, a, b, kind, *c) in enumerate(d['scenes']):
            w, h, x, y = crop(kind, c[0] if c else d.get('card')); dd = round((b - a) * 30) / 30
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', f]
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,crop={w}:{h}:{x}:{y},scale={bw}:1080:flags=lanczos,pad=1920:1080:{(1920 - bw) // 2}:0:color=black,setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{i}]')
            fc.append(f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dd:.4f}[a{i}]')
        k = len(d['scenes']); fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[cv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/sb_{eid}.mp4'], check=True)
    sc = {s['id']: [w['word'].lower() for w in s['words']] for s in scenes}
    def ref(r):
        r = list(r)
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert any(w.startswith(r[1].lower()) for w in sc[r[0]]), (eid, r, sc[r[0]])
        return r
    jor = d['sty'] == 'jorho'
    ex = [sfx([s['id']], 'r_swoosh.mp3', 0.45) for s in scenes[1:] if not (not jor and s is scenes[1])]          # swoosh on every cut (VP hook cut gets the flash)
    if jor: ex.append(sfx([scenes[0]['id']], 'jorho-ting.mp3', 0.55))
    tints = []
    for r, kind, *o in d['fx']:
        r = ref(r); off = o[0] if o else 0
        if kind == 'good': ex += [ov(r, 'r_gflash.mp4', 34, 0.6, off), sfx(r, 'r_money.mp3', 0.5, off), sfx(r, 'r_ding.mp3', 0.5, off)]
        elif kind == 'meme': tints.append([r, 'R']); ex += [sfx(r, 'r_fah.mp3', 0.55, off), sfx(r, 'r_shock.mp3', 0.4, off)]
        elif kind == 'green': tints.append([r, 'G'])
        elif kind == 'red': tints.append([r, 'R'])
        elif kind == 'riser': ex.append(sfx(r, 'r_riser.mp3', 0.45, off or -45))
        elif kind == 'cash': ex += [ov(r, 'r_cash.mp4', 54, 0.9, off), sfx(r, 'r_money.mp3', 0.5, off)]
        elif kind.startswith('e:'): ex.append(png(r, EMO[kind[2:]], off, react=None))
        elif kind.startswith('q:'): ex += [txt(r, kind[2:], off), png(r, 'e_think.png', off, y=1300, size=150), sfx(r, 'r_ding.mp3', 0.45, off)]
        else: ex.append(sfx(r, FXK[kind], 0.5, off))
    c = dict(top=d['top'], hl=d.get('hl', {}), src=f'sb_{eid}.mp4', cta='', ask=[], track='none', calls=[], trackData={}, music=d['music'], musicVol=d.get('mv', 0.30),
             tints=tints, rizz=[], punch=[ref(r) for r in d.get('punch', [])], blowouts=[ref(r) for r in d.get('blow', [])], blackFlash=[], streaks=[ref(r) for r in d.get('streaks', [])],
             intro=True, hardcut=not jor, cutSfx='r_flash.mp3', capCycle=jor, sat=1.0, noFocus=True, noSkull=jor, loop=True, progress=False, srcVol=1, origAudio=False,
             extras=ex, vo=None, boxTop=BOXT, boxBottom=BOXB, capY=d.get('capY', 860), steady=jor, whip=False,
             sfxSwap={'rizz.mp3': 'r_rizz.mp3', 'riser.mp3': '', 'shock.mp3': 'r_shock.mp3', 'flash.mp3': 'r_flash.mp3', 'pop.mp3': 'r_pop.mp3'} if not jor else
                     {'rizz.mp3': 'jorho-swish.mp3', 'riser.mp3': '', 'shock.mp3': '', 'flash.mp3': 'jorho-flash.mp3', 'pop.mp3': ''})
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/sb.cfg.json', 'w'), indent=1); print('cfg ok')
