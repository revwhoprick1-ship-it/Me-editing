# Summer Breaks x Fanatics Live (Emma Roberts card-break show), user 2026-11-25: 5 clips, 2 in the Jorho look, 3 in the ORIGINAL (very first)
# VverPaldo look (Redemption v2 era: box intro from a blown-out smear, Montserrat top line + skull, white one-word captions with black stroke,
# payoff hook first + hard cut with flash, G67 grade, punch-ins, tints, black flash, Say Goodbye under).
# Source = vertical 720x1280 screen recordings of the Fanatics Live app: hosts cam on top (y ~186-440), card cam below (y ~450-1130).
# Each scene is reframed to a square: 'wide' = hosts + top of the card cam, 'tight' = tighter on Emma, 'card' = the card cam.
# usage: python3 plan_sb.py <src dir> <tx dir> [--only=id,id] [--no-excerpts]
import glob, json, os, subprocess, sys
SRC, TX = sys.argv[1], sys.argv[2]
ONLY = [x for a in sys.argv if a.startswith('--only=') for x in a[7:].split(',')]
G67 = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.245,unsharp=5:5:1.74:5:5:0,"
       "eq=contrast=1.113:saturation=1.26:gamma=0.98,curves=all='0/0 0.25/0.21 0.75/0.81 1/1',unsharp=3:3:0.79,"
       "colortemperature=temperature=8000,eq=saturation=0.96,format=yuv420p")
G, R = '#A7EA04', '#F40305'
# extra words the batch transcript missed (re-run with beam 5): {clip: [[start, end, word], ...]}
EXTRA = {'51': [[28.20, 28.70, ' I'], [28.76, 28.94, ' remember'], [28.96, 29.20, ' the'], [29.24, 29.66, ' rudest'], [29.70, 30.04, ' awakening']]}
FIX = {('01', 0.42): 'Skenes.', ('01', 1.18): 'Skenes,', ('01', 2.22): 'Skenes,', ('01', 53.41, 'Skeens'): 'Skenes', ('52', 19.14): 'Allen', ('03', 43.80): 'one', ('03', 43.92): 'of',
       ('03', 45.40): 'one', ('03', 45.52): 'of', ('03', 50.96): 'One', ('03', 51.04): 'of', ('03', 51.76): 'One', ('03', 51.78): 'of', ('01', 63.45): '', ('01', 64.23): ''}
# square crops in source px: (x, y, side). cx = Emma's x (or the two-shot centre) per clip
def box(kind, cx):
    if kind == 'card': return 72, 520, 560
    side = 460 if kind == 'wide' else 340
    return int(min(632 - side, max(72, cx - side / 2))), 186, side
STY = {'vp': dict(grade=G67, capCycle=False, music=['goodbye', 0], musicVol=0.40, sat=1.3),
       'jorho': dict(grade='format=yuv420p', capCycle=True, music=['blue', 0], musicVol=0.30, sat=1.0)}
CL = {
 # VverPaldo: hook = payoff (Skenes green auto, last pack) then the story from the first Skenes; story ends right before the hook line -> loops
 'sbskenes': dict(n='01', sty='vp', cx=352, top="Emma Roberts' break: last pack… Skenes auto?!", hl={'Skenes': '#58EE28', 'last': '#FF2A2A'},
   scenes=[('hook', 53.30, 54.95, 'wide'), ('h2', 54.95, 63.40, 'card'), ('s1', 0.00, 4.95, 'card'), ('s2', 5.05, 8.45, 'wide'), ('s3', 12.85, 15.95, 'tight'), ('s4', 46.95, 53.25, 'wide')],
   tints=[(('h2', 'auto'), G), (('s3', 'stop'), R), (('s4', 'god'), G)], rizz=[('hook', 'Skenes')], blowouts=[('h2', 'mojo'), ('s1', 'Paul')], blackFlash=[('s2',)],
   punch=[('h2', 'last'), ('h2', 'mojo'), ('s2', 'No'), ('s3', 'Emma'), ('s3', 'lying'), ('s4', 'Five'), ('s4', 'god')], streaks=[('s4',)]),
 # Jorho: Emma's Allen & Ginter card story, hard cuts wide <-> tight on Emma, no animated zooms
 'sbwoman': dict(n='52', sty='jorho', cx=470, top="Emma Roberts has her own trading card now 💀", hl={},
   scenes=[('s1', 16.90, 23.40, 'wide'), ('s2', 25.50, 29.10, 'wide'), ('s3', 29.10, 31.95, 'tight'), ('s4', 32.30, 36.90, 'wide'), ('s5', 37.70, 40.20, 'tight')],
   tints=[(('s1', 'Allen'), G), (('s1', 'color'), G), (('s3', 'woman'), R), (('s5', 'died'), R)], blowouts=[('s3', 'me')], punch=[], streaks=[]),
 # Jorho: the numbered (/50) card, card cam for the reveal then the reactions
 'sbspidey': dict(n='94', sty='jorho', cx=352, top="Emma Roberts when the card is numbered 😭", hl={},
   scenes=[('s1', 11.60, 12.95, 'wide'), ('s1b', 12.95, 15.40, 'card'), ('s1c', 15.40, 17.85, 'wide'), ('s2', 18.80, 23.95, 'wide'), ('s3', 24.10, 30.20, 'wide'), ('s4', 31.40, 32.98, 'tight')],
   tints=[(('s1b', '50'), G), (('s1b', 'numbered'), G), (('s2', 'favorite'), R), (('s3', 'hot'), G)], blowouts=[('s1c', 'Spidey')], punch=[], streaks=[]),
 # VverPaldo: 1/1 Texas Star patch, hook = the "one of one" call, story = the rip then the room reaction
 'sbjudy': dict(n='03', sty='vp', cx=400, top="Emma Roberts' break just hit a 1 of 1", hl={'1': '#FF2A2A', 'of': '#FF2A2A'},
   scenes=[('hook', 17.75, 19.00, 'wide'), ('h2', 19.00, 25.30, 'card'), ('s1', 11.75, 17.70, 'card'), ('s2', 26.05, 30.40, 'wide'), ('s3', 44.65, 52.60, 'wide')],
   tints=[(('hook', 'One'), G), (('h2', 'nasty'), R), (('s1', 'Stop'), R), (('s3', 'charm'), G)], rizz=[('hook', 'One')], blowouts=[('h2', 'Patch'), ('s1', 'And')], blackFlash=[('s2',)],
   punch=[('hook', 'One'), ('h2', 'Star'), ('h2', 'nasty'), ('s1', 'Stop'), ('s1', 'patch'), ('s3', 'One'), ('s3', 'charm')], streaks=[('s3',)]),
 # VverPaldo: Emma's 99-cent-store tax story, hook = the punchline, story ends right before it
 'sbtax': dict(n='51', sty='vp', cx=330, top="Emma Roberts learned about taxes the hard way", hl={'taxes': '#FF2A2A'},
   scenes=[('hook', 49.20, 54.80, 'tight'), ('s1', 28.10, 34.15, 'wide'), ('s2', 34.15, 39.40, 'tight'), ('s3', 39.40, 45.40, 'wide'), ('s4', 45.40, 49.15, 'tight')],
   tints=[(('hook', 'taxes'), R), (('s1', '99'), G), (('s3', 'tax'), R), (('s4', 'confused'), R)], rizz=[('s1', '99')], blowouts=[('hook', 'taxes')], blackFlash=[('s3',)],
   punch=[('hook', 'young'), ('hook', 'taxes'), ('s1', 'rudest'), ('s2', 'Ziploc'), ('s3', 'tax'), ('s3', 'whoa'), ('s4', 'confused')], streaks=[('s3',)]),
}
gen = json.load(open('src/edits.gen.json')); CFG = {}
for eid, d in CL.items():
    if ONLY and eid not in ONLY and os.path.exists(f'public/sb_{eid}.mp4'):
        pass
    f = glob.glob(os.path.join(SRC, d['n'] + ' - *.mp4'))[0]
    W = [w for s in json.load(open(glob.glob(os.path.join(TX, d['n'] + ' - *.json'))[0])) for w in s['w']] + EXTRA.get(d['n'], [])
    W.sort(key=lambda w: w[0]); st = STY[d['sty']]
    scenes, t = [], 0.0
    for sid, a, b, kind in d['scenes']:
        n = round((b - a) * 30); words = []
        for ws, we, tx in W:
            tx = FIX.get((d['n'], round(ws, 2), tx.strip()), FIX.get((d['n'], round(ws, 2)), tx.strip()))
            if a - 0.05 <= ws < b - 0.05 and tx.strip():
                f0 = max(0, round((ws - a) * 30)); words.append({'word': tx.strip().strip(','), 'startFrame': f0, 'endFrame': min(n, max(f0 + 4, round((we - a) * 30) + 3))})
        for k in range(len(words) - 1): words[k]['endFrame'] = min(words[k]['endFrame'], words[k + 1]['startFrame'])
        scenes.append({'id': sid, 'videoStartSec': round(t, 3), 'durationInFrames': n, 'cropX': 960, 'crops': [[0, 960]], 'words': words}); t += n / 30
    gen[eid] = scenes
    print(eid, round(t, 1), 's |', ' / '.join(s['id'] + ': ' + ' '.join(w['word'] for w in s['words']) for s in scenes)[:300])
    if '--no-excerpts' not in sys.argv and (not ONLY or eid in ONLY):
        cmd = ['ffmpeg', '-v', 'error', '-y']; fc = []
        for i, (sid, a, b, kind) in enumerate(d['scenes']):
            x, y, side = box(kind, d['cx']); dd = round((b - a) * 30) / 30
            cmd += ['-ss', f'{a:.3f}', '-t', f'{dd:.4f}', '-i', f]
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,crop={side}:{side}:{x}:{y},scale=1080:1080:flags=lanczos,{st["grade"]},pad=1920:1080:420:0:color=black,setsar=1,format=yuv420p,trim=duration={dd:.4f}[v{i}]')
            fc.append(f'[{i}:a]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dd:.4f}[a{i}]')
        k = len(d['scenes']); fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[cv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/sb_{eid}.mp4'], check=True)
    sc = {s['id']: [w['word'].lower() for w in s['words']] for s in scenes}
    def ref(r):
        r = list(r)
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert any(w.startswith(r[1].lower()) for w in sc[r[0]]), (eid, r, sc[r[0]])
        return r
    jor = d['sty'] == 'jorho'
    c = dict(top=d['top'], hl=d['hl'], src=f'sb_{eid}.mp4', cta='', ask=[], track='none', calls=[], trackData={}, music=st['music'], musicVol=st['musicVol'],
             tints=[[ref(r), 'G' if col == G else 'R'] for r, col in d['tints']], rizz=[ref(r) for r in d.get('rizz', [])], punch=[ref(r) for r in d.get('punch', [])],
             blowouts=[ref(r) for r in d.get('blowouts', [])], blackFlash=[ref(r) for r in d.get('blackFlash', [])], streaks=[ref(r) for r in d.get('streaks', [])],
             intro=True, hardcut=not jor, capCycle=st['capCycle'], sat=st['sat'], noFocus=True, noSkull=jor, loop=True, progress=False, srcVol=1, origAudio=False,
             extras=[dict(at=['s1'], kind='sfx', file='jorho-ting.mp3', v=0.5, off=0)] if jor else [], vo=None)
    if jor: c.update(sfxSwap={'rizz.mp3': 'jorho-swish.mp3', 'riser.mp3': '', 'shock.mp3': '', 'flash.mp3': 'jorho-flash.mp3', 'pop.mp3': ''}, steady=True, whip=False)
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/sb.cfg.json', 'w'), indent=1); print('cfg ok')
