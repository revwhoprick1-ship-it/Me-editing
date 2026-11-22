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
FIX = {('p06', 82.43): 'snitch', ('p06', 140.48): 'turkey', ('p06', 140.72): 'treats,', ('p06', 141.6): 'turkey', ('p06', 141.9): 'treats?', ('p10', 173.2): 'CIB', ('p10', 10.33): 'CIB', ('p10', 106.31): 'fought', ('p10', 106.65): 'war.', ('p10', 117.01): '',
       ('p07', 12.4): 'labra-', ('p07', 12.6): '', ('p07', 12.8): 'toodle-', ('p07', 13.22): '', ('p07', 13.58): '', ('p07', 15.82): 'labra-', ('p07', 16.06): '', ('p07', 16.2): 'boodle', ('p07', 19.64): 'hypoallergenic', ('p07', 20.12): '', ('p07', 3.94): 'Jo.', ('p07', 9.08): 'name-brand', ('p07', 9.4): '', ('p07', 22.6): '$4,000', ('p07', 22.88): '', ('p03', 185.3): "Madahi's",
       ('p12', 110.8): "Dodgers'", ('p12', 111.42): 'den!', ('p03', 87.28): '', ('p03', 87.5): '', ('p07', 303.29): 'food', ('p07', 308.02): 'deer', ('p07', 309.16): 'deer', ('p09', 37.63): 'CIB', ('p09', 37.77): '', ('p09', 37.87): '', ('p05', 210.95): 'Put', ('p03', 107.44): '', ('p03', 107.56): '', ('p11', 39.88): 'broke', ('p09', 174.36): 'Have', ('p09', 174.52): 'you', ('p09', 174.6): 'ever', ('p09', 175.02): 'snow?', ('p09', 175.28): '', ('p09', 175.36): '', ('p12', 129.4): 'Eighteenth', ('p12', 129.96): '', ('p03', 246.85): '', ('p03', 247.17): '', ('p03', 247.25): '', ('p03', 247.39): '', ('p03', 247.55): '', ('p03', 247.77): '', ('p03', 248.07): ''}
LIFT = ',eq=gamma=1.4:brightness=0.02:saturation=1.08'
def src(v): return glob.glob(f'{DL}/{v}.*')[0]
def probe(v): return json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=index,codec_type,codec_name,width,height:stream_side_data=rotation', '-of', 'json', src(v)], capture_output=True, text=True).stdout)['streams']
def vert(v):
    s = [x for x in probe(v) if x['codec_type'] == 'video'][0]; rot = abs(int(next((d.get('rotation', 0) for d in s.get('side_data_list', [])), 0)))
    return (s['width'] if rot == 90 else s['height']) > 1200
def aidx(v): return ([i for i, x in enumerate(x for x in probe(v) if x['codec_type'] == 'audio') if x.get('codec_name') not in (None, 'unknown', 'none')] or [None])[0]
G, R = 'G', 'R'; Y = '#FFE14A'; W_ = '#FFFFFF'; RD = '#FF2A2A'; GR = '#58EE28'
def txt(at, text, color=Y, size=100, off=0, y=560, dur=30): return dict(at=at, kind='txt', file=text, color=color, size=size, off=off, dur=dur, y=y)
def pop(at, f, react=None, off=0, y=800, size=380): return dict(at=at, kind='png', file=f, off=off, y=y, size=size, **({'sfx': react, 'sv': 0.45} if react else {}))
def ov(at, f, sfx, dur=34, op=0.5, off=0): return dict(at=at, kind='ov', file=f, dur=dur, sfx=sfx, sv=0.45, op=op, off=off)
def sfx(at, f, v=0.5, off=0): return dict(at=at, kind='sfx', file=f, v=v, off=off)

# 10 best moments x 2 variants: A = narrator intro -> moment, B = punchline hook -> hard cut -> moment (different top text).
# sfx = (scene, word prefix, file[, 'pop' emoji]) — lots of reaction SFX (user: more SFX even without visuals).

# (based on plan_tren) Tren Twins "Breaking Bad" $1M Black Friday giveaway trailer (57 s). 10 clips, one edit each:
# odd = narrator intro (A), even = punchline hook + hard cut (B). On-screen text must mention the $1M giveaway; caption soft-mention only.

# Eclipse x Jo Koy "Blue in the Face" (Netflix): 5 edits, Instagram Reels. ORIGINAL AUDIO ONLY (no music, no SFX, no AI voice) -> origAudio.
# Visual style kept: top hook, colour-cycle caps captions, whip zoom-blur on cuts, centre emoji pops (silent), face blur.
# Never change Jo's meaning: scenes are whole sentences, ends pinned after the laugh.
_CL_B5 = None  # batch 5 (jburger, jden, jbed, jcinna, jcoyote) is in git history
# batch 6 (user 2026-11-22): 5 funniest, full vertical (no bars) + text hook, lighter grade, lighter black flash,
# each opens cold on Jo's best line ('hook' scene), hard cut, then the story from its start.
_CL_B6 = None  # batch 6 (jdenv, jliev, jcamov, jsniffv, jcoyotev) is in git history
# batch 7 (user experiment 2026-11-22): hooks planned by Opus, scored by a Haiku sub-agent (rubric: pattern interrupt / curiosity / text-audio sync).
# short hook text (<6 words) that pops on the hook's peak word (tp); full vertical, lighter grade/flash as batch 6.
_CL_B7 = None  # batch 7 (jnugv, jburgv, jrodv, jwipev, jcrackv: cold open + rewind) is in git history
# batch 8 (user 2026-11-22: "50% skipped at 5 s"): NO jump back (forward from the tension), 20-35 s, pauses tightened (tight=True),
# stakes hook text, open-loop 2nd text line at 3.5 s (t2). steady / no face blur / no SFX as before.
_CL_B8 = None  # batch 8 (jnugw, jrodw, jwipew, jcrackw, jburgw) is in git history
# batch 9 (user 2026-11-22, 3 viral reels analysed): Jo's FIRST sentence is the premise, comment-bait topic (dog people / Filipino moms),
# ALL-CAPS hook quoting the viewer, 2-3 word phrase captions (capChunk) with the spoken word in green. Keeps batch 8 rules.
_CL_B9 = None  # batch 9 (jdogsx..jnugx, full vertical + phrase captions) is in git history
# batch 10 (user 2026-11-22): back to the ORIGINAL VverPaldo look (boxed 16:9, G67 grade, top hook line with skull, colour-cycle one-word caps,
# whip blur on story cuts) but NO face blur and still steady (no zoom), no SFX, pauses tightened. Run WITHOUT --full.
# batch 10b (user 2026-11-22: "MAXIMIZE LIKES SHARES COMMENTS", ~44 % skip in the first 6 s): same VverPaldo box style, plus
#  face = 1 s funny-face open (Jo's own act-out / reaction from the same bit, his audio), then the story starts right before the first laugh;
#  share = share/tag line under the box at the first payoff; ask = comment question + resources arrow.png circling the comment button (last 2.8 s);
#  ovs = editing-resources overlays (cashfall on money, afml on a time skip, greenflash2 on the punchline). Visual elements ONLY from public/res.
CL = {
 'jmailo': dict(src='p11', tight=True, face=(44.50, 45.50), body=[('c1', 12.62, 47.50, 960)], A='his mom made a war hero become a MAILMAN 💀', hl=['MAILMAN'],
   share=('c1', 'broken.', "TAG SOMEONE'S FILIPINO MOM 😭"), ask='WHAT JOB DID YOUR MOM PICK FOR YOU? 👇',
   ovs=[('c1', 'motherfucking', 'greenflash2.mp4')], pops=[('c1', 'Christmas', 'e_sob.png', dict(y=1320, size=300)), ('c1', 'motherfucking', 'e_laugh.png', dict(y=1320, size=300))]),
 'jsnowo': dict(src='p09', tight=True, face=(177.00, 178.00), body=[('c1', 167.70, 210.60, 960)], A='the army sent him home… his reply 💀', hl=['reply'],
   share=('c1', 'Put', 'SEND THIS TO A VETERAN 🇺🇸'), ask='WOULD YOU HAVE GONE BACK IN? 👇',
   ovs=[('c1', 'teeth.', 'greenflash2.mp4')], pops=[('c1', 'snow', 'e_laugh.png', dict(y=1320, size=300)), ('c1', 'teeth.', 'e_sob.png', dict(y=1320, size=300))]),
 'jwalko': dict(src='p12', tight=True, face=(150.00, 151.00), body=[('c1', 142.28, 181.00, 960)], A='they all FORGOT about Fred at the game 💀', hl=['FORGOT'],
   share=('c1', "Fred's", 'TAG A DODGERS FAN ⚾'), ask="LONGEST GAME YOU'VE EVER STAYED FOR? 👇",
   ovs=[('c1', 'killed', 'greenflash2.mp4')], pops=[('c1', 'Fred', 'e_sob.png', dict(y=1320, size=300)), ('c1', 'killed', 'e_laugh.png', dict(y=1320, size=300))]),
 'jptsdo': dict(src='p06', tight=True, face=(21.30, 22.30), body=[('c1', 4.90, 41.60, 960)], A='if you have TRAUMA, Jo Koy has advice 😭', hl=['TRAUMA,'],
   share=('c1', 'yourself.', 'SEND THIS TO YOUR COWORKER 💀'), ask='DOG OR THERAPIST? 👇',
   ovs=[('c1', 'bitch', 'greenflash2.mp4')], pops=[('c1', 'bitch', 'e_laugh.png', dict(y=1320, size=300)), ('c1', 'dog', 'e_sob.png', dict(y=1320, size=300))]),
 'jideao': dict(src='p03', tight=True, face=(238.20, 239.20), body=[('c1', 232.52, 253.30, 960), ('c2', 267.30, 284.00, 960)], A='his dentist quoted him $100,000 💀', hl=['$100,000'],
   share=('c1', 'man?', 'SEND THIS TO SOMEONE WITH BRACES 😭'), ask='WHAT WOULD YOUR MOM SAY? 👇',
   ovs=[('c1', '$100', 'cash_trim.mp4'), ('c2', 'Well', 'afml.mp4')], pops=[('c1', 'chiclets', 'e_laugh.png', dict(y=1320, size=300)), ('c2', 'destroy', 'e_sob.png', dict(y=1320, size=300))]),
 'jdenb': dict(src='p12', tight=True, face=(113.60, 114.60), body=[('c2', 52.40, 61.00, 960), ('c3', 79.10, 115.50, 960)], A="his stepdad's oxygen was running out… and he STAYED 💀", hl=['STAYED'],
   share=('c3', 'Vietnam', 'SEND THIS TO YOUR DAD ⚾'), ask='WOULD YOU HAVE LEFT THE GAME? 👇',
   ovs=[('c3', 'Vietnam', 'greenflash2.mp4')], pops=[('c2', 'blue', 'e_sob.png', dict(y=1320, size=300)), ('c3', 'Vietnam', 'e_laugh.png', dict(y=1320, size=300))]),
 'jnugb': dict(src='p05', tight=True, face=(311.80, 312.80), body=[('c1', 210.90, 216.20, 960), ('c2', 242.05, 247.60, 960), ('c3', 266.35, 274.20, 960), ('c4', 297.60, 314.00, 960)],
   A="mom marched into McDonald's for him… big MISTAKE 😭", hl=['MISTAKE'], share=('c2', 'advantage', 'SEND THIS TO YOUR MOM 😭'), ask='DID YOUR MOM EVER DO THIS? 👇',
   ovs=[('c4', 'nugget', 'greenflash2.mp4')], pops=[('c2', 'advantage', 'e_sob.png', dict(y=1320, size=300)), ('c4', 'nugget', 'e_laugh.png', dict(y=1320, size=300))]),
 'jdogsb': dict(src='p06', tight=False, face=(91.00, 92.00), body=[('c1', 86.75, 107.20, 960)], A="Jo Koy's message to people who hate DOGS 🐶", hl=['DOGS'],
   share=('c1', 'you.', 'TAG SOMEONE WHO HATES DOGS 🐶'), ask='DOG PEOPLE, AGREE? 👇',
   ovs=[('c1', 'hi.', 'greenflash2.mp4')], pops=[('c1', 'you.', 'e_laugh.png', dict(y=1320, size=300)), ('c1', 'hi.', 'e_sob.png', dict(y=1320, size=300))]),
 'jcrackb': dict(src='p04', tight=True, face=(101.00, 102.00), body=[('c1', 90.00, 114.20, 960)], A="what his mom's friend whispered about his TEETH 😭", hl=['TEETH'],
   share=('c1', 'cocaine?', 'SEND THIS TO YOUR FILIPINO MOM 😭'), ask='WHAT DID YOUR MOM ACCUSE YOU OF? 👇',
   ovs=[('c1', 'cocaine?', 'greenflash2.mp4')], pops=[('c1', 'cocaine?', 'e_laugh.png', dict(y=1320, size=300)), ('c1', 'Bye', 'e_sob.png', dict(y=1320, size=300))]),
 'jrodb': dict(src='p03', tight=True, face=(191.60, 192.60), body=[('c1', 185.95, 216.00, 960)], A='the dentist opened his mouth and FLINCHED 💀', hl=['FLINCHED'],
   share=('c1', 'punch', 'TAG SOMEONE WHO NEEDS A DENTIST 💀'), ask='WORST DENTIST STORY? 👇',
   ovs=[('c1', 'Vicks', 'greenflash2.mp4')], pops=[('c1', 'punch', 'e_sob.png', dict(y=1320, size=300)), ('c1', 'Vicks', 'e_laugh.png', dict(y=1320, size=300))]),
}
E = {}
for k, d in CL.items():
    ex = [pop([s, w], e, None, off=2, **(o[0] if o else {})) for s, w, e, *o in d['pops']]
    if d.get('share'): ex.append(dict(at=[d['share'][0], d['share'][1]], kind='txt', file=d['share'][2], color='#FFE14A', size=50, y=930, dur=75, off=10, flat=True))
    for sid_, w_, f_ in d.get('ovs', []): ex.append(dict(ov([sid_, w_], f_, None, dur=34 if 'flash' in f_ else 54, op=0.55 if 'flash' in f_ else 0.9, off=2), **({'fit': 'contain'} if 'afml' in f_ else {})))
    body = ([('face', *d['face'], 960)] if d.get('face') else []) + list(d['body'])
    E[k] = dict(vo=None, scenes=[(s, d['src'], a, b, cx) for s, a, b, cx in body], fixed=[s for s, *_ in body], nocap=['face'], face=bool(d.get('face')), ask2=d.get('ask'), mute=[], zoom={},
                circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[], punch=d.get('pin', []), top=d['A'], hl={w: RD for w in d['hl']}, topPop=d.get('tp'), topSize=d.get('ts', 64), top2=d.get('t2'), tight=d.get('tight', False),
                extras=ex, focus=dict(x=540, y=330, r=180, dur=20))
VO = sys.argv[3]
FULL = '--full' in sys.argv
# lighter look for batch 6 (user: "lessen the video filter"): about half of G67
G_LITE = ("split[ga][gb];[gb]gblur=sigma=14[gg];[ga][gg]blend=all_mode=softlight:all_opacity=0.12,unsharp=5:5:0.9:5:5:0,"
          "eq=contrast=1.05:saturation=1.1:gamma=0.99,curves=all='0/0 0.25/0.23 0.75/0.78 1/1',colortemperature=temperature=7200,format=yuv420p")

W = {v: [w for s in json.load(open(f'{TX}/{v}.json')) for w in s['w']] for v in ('p03', 'p04', 'p05', 'p06', 'p09', 'p11', 'p12')}
FIXED = []
CUTS = {v: [float(x) for x in open(os.path.join(os.path.dirname(DL.rstrip('/')), f'cuts_{v}.txt'))] for v in ('p03', 'p04', 'p05', 'p06', 'p09', 'p11', 'p12')}
def snap(sid, v, a, b):
    """user rules: never cut a line mid-sentence (start before the first word, run until the speaker pauses),
    and no sub-0.5 s slivers of another camera angle at either end (snap onto the show's own cut)."""
    ws = W[v]; a0, b0 = a, b; CUTS_ = CUTS[v]
    for s, e, _ in ws:                       # don't start inside a word
        if s < a < e: a = s - 0.08
    if not sid.startswith('i') and sid not in FIXED and sid != 'hook':
        for _ in range(40):                  # extend to the end of the phrase (next pause >= 0.35 s), max +4 s
            nxt = [e for s, e, _ in ws if s < b + 0.35 and e > b - 0.02 and e > b - 0.15 + 0.15 and s >= a]
            nxt = [e for s, e, _ in ws if (s < b < e) or (b <= s < b + 0.35)]
            if not nxt or b - b0 > 2: break
            b = max(nxt) + 0.15
    c = [x for x in CUTS_ if a < x < a + 0.5]
    if c: a = max(c) + 0.02
    c = [x for x in CUTS_ if b - 0.5 < x < b]
    if c:
        cx = min(c); talking = [1 for s, e, _ in ws if s < cx + 0.1 and e > cx - 0.05 and not sid.startswith('i')]
        if not talking: b = cx - 0.02
        else:
            later = [x for x in CUTS_ if b < x < b + 1.2]
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
_FOC_B4 = {'jsniff': (540, 230, 120), 'jcamo': (540, 230, 120), 'jrodeo': (540, 230, 120), 'jmix': (540, 230, 120), 'jhold': (540, 230, 120)}
FOC = {k: (540, 700, 170) for k in CL}   # full mode: refined from the head track (fulltrack.py)
_FOC_B3 = {'jwipe': (600, 300, 120), 'jwhiskey': (600, 300, 120), 'jpay': (540, 230, 120), 'jgucci': (540, 230, 120), 'jtooth': (540, 230, 120)}
_FOC_B2 = {'jnug2': (540, 160, 130), 'jdog': (560, 230, 110), 'jturkey': (530, 230, 130), 'jmama': (620, 340, 120), 'jsnow': (560, 200, 120)}
_FOC_OLD = {'tjump': (335, 190, 150), 'tmex': (340, 220, 150), 'tcomfy': (280, 240, 150), 'tbed': (280, 240, 150), 'tspend': (660, 200, 150), 'tnotyours': (620, 240, 150), 'tkid': (360, 300, 150), 'tfeels': (660, 240, 150), 'tnap': (280, 240, 150), 'tbiggest': (660, 200, 150)}
# --- pause tightening (user: "tighten pauses"): silence > 0.6 s between Jo's words -> 0.3 s; crowd laugh gaps keep up to 2.2 s
# (cut from the laugh's tail). Never inside a word; no sub-0.6 s pieces. Sub-scenes are '<sid>_<n>' (no whip/flash on them).
_DB = {}
def _db(v):
    if v not in _DB:
        x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', src(v), '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
        k = len(x) // 800; d = 20 * np.log10(np.sqrt((x[:k * 800].reshape(k, 800) ** 2).mean(1)) + 1e-6); _DB[v] = (d, np.percentile(d, 20))
    return _DB[v]
for eid, spec in E.items():
    if not spec.get('tight'): continue
    out, remap = [], {}
    for sid, v, a, b, cx in spec['scenes']:
        if sid == 'face': out.append((sid, v, a, b, cx)); continue
        ws = [w for w in W[v] if w[0] >= a - 0.02 and w[0] < b]; d, fl = _db(v); cuts = []
        for w1, w2 in zip(ws, ws[1:]):
            g = w2[0] - w1[1]
            if g < 0.6: continue
            seg = d[int(w1[1] * 20):int(w2[0] * 20)]; laugh = len(seg) and float(np.mean(seg > fl + 9)) > 0.5
            keep = 2.2 if laugh else 0.3
            if g <= keep + 0.25: continue
            cuts.append((w1[1] + keep - 0.15, w2[0] - 0.15) if laugh else (w1[1] + 0.15, w2[0] - 0.15))
        segs, cur = [], a
        for x, y in cuts: segs.append([cur, x]); cur = y
        segs.append([cur, b])
        i = 0
        while i < len(segs) - 1:                      # merge slivers
            if segs[i][1] - segs[i][0] < 0.6 or segs[i + 1][1] - segs[i + 1][0] < 0.6: segs[i][1] = segs[i + 1][1]; del segs[i + 1]
            else: i += 1
        for n, (x, y) in enumerate(segs):
            nid = sid if n == 0 else f'{sid}_{n}'; out.append((nid, v, round(x, 2), round(y, 2), cx))
            remap.setdefault(sid, []).append((nid, x, y))
    before = sum(b - a for _, _, a, b, _ in spec['scenes']); spec['scenes'] = out; spec['fixed'] = [s for s, *_ in out]
    print(f'  tight {eid}: {before:.1f}s -> {sum(b - a for _, _, a, b, _ in out):.1f}s in {len(out)} pieces')
    def rm(r):
        if not r or len(r) < 2 or r[0] not in remap: return r
        v = spec['scenes'][0][1]
        for nid, x, y in remap[r[0]]:
            if any(x - 0.05 <= w[0] < y - 0.05 and w[2].strip().lower().startswith(r[1].lower()) for w in W[v]): return [nid, r[1], *r[2:]]
        return r
    for e in spec['extras']: e['at'] = rm(e['at'])
    if spec.get('topPop'): spec['topPop'] = rm(spec['topPop'])

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
            if ya < 50: geo += LIFT; print('  lift', sid, round(ya))
            fc.append(f'[{i}:v]fps=30,setpts=PTS-STARTPTS,{geo},setsar=1,format=yuv420p,trim=duration={d:.4f}[v{i}]')
            mt = ''.join(f",volume=0:enable='between(t,{max(0, m0 - a):.3f},{m1 - a:.3f})'" for m0, m1 in spec.get('mute', []) if m1 > a and m0 < b)
            fc.append(f'[{i}:a:{aidx(v)}]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{d:.4f}{mt}' + (',volume=0' if sid.startswith('i') else '') + f'[a{i}]')
        k = len(spec['scenes'])
        fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + (G_LITE if FULL else G67) + '[gv]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
        if '--raw' in sys.argv:   # same cut, no colour grade / lift (user: "without the video filters")
            fr_ = [x.replace(LIFT, '') for x in fc[:-1]] + ['[cv]null[gv]']
            subprocess.run(cmd + ['-filter_complex', ';'.join(fr_), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                                  '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/raw_{eid}.mp4'], check=True)
    c = {k: v for k, v in spec.items() if k not in ('scenes', 'circles', 'nocap', 'mute', 'zoom', 'vo', 'fixed', 'face', 'ask2')}
    c['music'] = ['goodbye_n', 0]; c['origAudio'] = True; c['vo'] = {'file': spec['vo'] + '.wav', 'vol': 1.0} if spec['vo'] else None; c['capCycle'] = True; c['whip'] = True
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
    if FULL: c.update(full=True, bf=0.02, capY=1250, topY=1430, sat=1.0)
    if spec.get('tight'): c.update(hardcut=False)
    if spec.get('face'): c.update(hardcut=True)
    if spec.get('ask2'):
        last = scenes[-1]; o = max(0, last['durationInFrames'] - 84)
        # safe zone (user 2026-11-22): inside the video box just above the captions, clear of IG's right-side buttons; no arrow (it pointed at nothing)
        c['extras'] += [dict(at=[last['id']], kind='txt', file=spec['ask2'], color='#FFFFFF', size=50, y=930, dur=84, off=o, flat=True)]
    for k_ in ('face', 'ask2', 'share', 'ovs'): c.pop(k_, None)
    if spec.get('top2'): c['top2'] = dict(text=spec['top2'], at=3.5, dur=3.5)
    if FULL: c['capChunk'] = 3
    c['steady'] = True; c['punch'] = []   # user rule: never zoom in and out (no whip/punch/intro zoom)
    c['noFocus'] = True; c.pop('focus', None)   # user rule 2026-11-22: face blur removed, never use it again
    c['ask'] = []  # user: nothing under the video (no ask pill / promo line / progress bar)
    CFG[eid] = c
if '--raw' in sys.argv:
    for eid in list(CFG):
        CFG[eid + 'r'] = dict(CFG[eid], src=f'raw_{eid}.mp4', raw=True); gen[eid + 'r'] = gen[eid]
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/jo.cfg.json', 'w'), indent=1); print('cfg ok')
