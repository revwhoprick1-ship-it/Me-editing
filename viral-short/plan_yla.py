# Clipfarm x YoungLA: 5 edits from 'Bodybuilders vs Models' only. Organic, NOT ad-like (no brand callouts in text), gear visible.
# Original VverPaldo style
# (pre viewer-agent rounds, commit 7df7760): payoff hook + hard cut, centre echo emoji pops, skull top line, one ask pill, promo line last 2.5 s.
# Sources: <dl dir>/vNN.* (vertical 1080x1920 -> 1080 square at y0 padded into the 1920x1080 frame; horizontal used as is).
# Excerpts public/g67_<id>.mp4 = the edit's scene windows in order, graded 67 (+ slightly cooler).
# Usage: python3 plan_arena.py <dl dir> <tx dir> [--no-excerpts]
import glob, json, subprocess, sys
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
# scene = (id, video, a, b, cropX)   nocap = scenes whose source already has burned captions; mute = source-time ranges silenced (swears)
E = {
 'ybath': dict(scenes=[('hook', 'ep', 333.85, 336.45, 1380), ('c1', 'ep', 307.05, 313.95, 1200), ('c2', 'ep', 314.60, 317.60, 960), ('c3', 'ep', 323.00, 324.60, 960), ('c4', 'ep', 329.50, 337.75, 1380)],
   zoom={'hook': (462, 0, 1458, 820), 'c4': (462, 0, 1458, 820)}, mute=[(330.85, 331.20), (332.18, 332.80), (335.66, 335.98)],
   focus=dict(x=440, y=560, r=190, dur=20), circles=[],
   top='He said give me 30 seconds and LEFT', hl={'LEFT': RD}, music=['mduck_n', 0], ask=[],
   tints=[], rizz=[], punch=[['c1', 'bathroom.'], ['c1', 'coming'], ['c1', '30']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'seconds.'], 's_huh.mp3', 0.5), pop(['c4', 'sorry.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'ylate': dict(scenes=[('hook', 'ep', 518.85, 519.70, 960), ('c1', 'ep', 504.10, 510.90, 960), ('c2', 'ep', 517.45, 526.30, 960), ('c3', 'ep', 527.35, 531.00, 960)],
   mute=[(524.02, 524.26)],
   focus=dict(x=700, y=340, r=200, dur=20), circles=[],
   top='3 HOURS late and his first stop was the BATHROOM', hl={'3': RD, 'HOURS': RD, 'BATHROOM': RD}, music=['mwalahi_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'pee'], ['c1', 'three'], ['c1', 'late.'], ['c2', 'pee'], ['c2', 'Aaron'], ['c3', 'directly']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'late.'], 's_huh.mp3', 0.5), pop(['c2', 'would.'], 'e_laugh.png', 's_fahhh.mp3', off=2), sfx(['c3', 'bathroom.'], 's_ding.mp3', 0.45)]),
 'yaura': dict(scenes=[('hook', 'ep', 861.00, 863.60, 960), ('c1', 'ep', 825.30, 827.30, 960), ('c2', 'ep', 836.75, 838.20, 960), ('c3', 'ep', 841.75, 846.20, 960),
                       ('c4', 'ep', 847.30, 850.70, 960), ('c5', 'ep', 851.50, 855.75, 960), ('c6', 'ep', 861.00, 866.00, 960)],
   mute=[(837.36, 837.70)],
   focus=dict(x=950, y=400, r=180, dur=20), circles=[],
   top='The most AURA at the fashion show went to the SOUND GUY', hl={'AURA': RD, 'SOUND': RD, 'GUY': RD}, music=['mmiles_n', 0], ask=[],
   tints=[], rizz=[['c4', 'aura']], punch=[['hook', 'noise'], ['c3', 'sound'], ['c4', 'awarded'], ['c5', 'speak'], ['c6', 'noise'], ['c6', 'Wow.']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c3', 'sound'], 's_huh.mp3', 0.5), sfx(['c4', 'awarded'], 's_correct.mp3', 0.45), pop(['c6', 'Wow.'], 'e_sob.png', 's_wow.mp3', off=2)]),
 'yquav': dict(scenes=[('hook', 'ep', 459.20, 461.95, 1070), ('c1', 'ep', 361.10, 366.20, 960), ('c2', 'ep', 366.20, 372.95, 960), ('c3', 'ep', 456.30, 462.00, 1070), ('c4', 'ep', 463.50, 466.20, 1070)],
   focus=dict(x=570, y=150, r=180, dur=20), circles=[],
   top='Guessing what he was listening to on the RUNWAY', hl={'RUNWAY': RD}, music=['msneaky_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'Gambino.'], ['c1', 'headphones'], ['c2', 'Bieber'], ['c2', '2008'], ['c3', 'intel.'], ['c3', 'close.'], ['c4', 'guess.']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c2', 'Bieber'], 's_ding.mp3', 0.45), sfx(['c3', 'Gambino.'], 's_huh.mp3', 0.5), pop(['c4', 'guess.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'ybank': dict(scenes=[('hook', 'ep', 766.25, 768.80, 940), ('c1', 'ep', 760.20, 766.25, 940), ('c2', 'ep', 766.25, 768.80, 940), ('c3', 'ep', 769.75, 778.60, 960)],
   focus=dict(x=940, y=360, r=180, dur=20), circles=[],
   top='His bank account hit NEGATIVE $152,000', hl={'NEGATIVE': RD, '$152,000': RD}, music=['mchud_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'negative'], ['c1', 'zero.'], ['c2', 'negative'], ['c3', 'robbed?'], ['c3', 'taxes']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'happened'], 's_huh.mp3', 0.5), sfx(['c2', 'negative'], 's_fahhh.mp3', 0.45), pop(['c3', 'consent'], 'e_sob.png', 's_wow.mp3', off=2)]),
 'fshoot': dict(scenes=[('hook', 'ep', 47.80, 51.30, 1080), ('c1', 'ep', 54.50, 69.40, 1080), ('c2', 'ep', 74.70, 77.50, 1080), ('c3', 'ep', 83.45, 87.00, 1300)],
   mute=[(50.40, 51.05), (78.30, 78.90)],
   focus=dict(x=480, y=380, r=190, dur=20), circles=[], noSkull=True,
   top="his photographer's directions are NOT real 😭", hl={'NOT': RD, 'real': RD}, music=['chess_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'bald'], ['c1', 'wash'], ['c1', 'steam.'], ['c1', 'noodles.'], ['c2', 'none'], ['c3', 'home.']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'steam.'], 's_huh.mp3', 0.5), pop(['c1', 'noodles.'], 'e_laugh.png', 's_fahhh.mp3', off=2), sfx(['c3', 'out.'], 's_ding.mp3', 0.4)]),
 'frunway': dict(scenes=[('hook', 'ep', 291.30, 296.60, 1250), ('c1', 'ep', 275.55, 284.40, 1150), ('c2', 'ep', 287.50, 297.00, 1100)],
   focus=dict(x=730, y=360, r=180, dur=20), circles=[], noSkull=True,
   top="bro said H&M like it's paris fashion week 😭", hl={'H&M': RD}, music=['mdubist_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'H'], ['c1', 'Burberry'], ['c1', 'comparison'], ['c2', 'Kevin'], ['c2', 'H'], ['c2', 'brag']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c2', 'Larry'], 's_huh.mp3', 0.5), pop(['c2', 'brag'], 'e_laugh.png', 's_fahhh.mp3', off=4)]),
 'fstick': dict(scenes=[('hook', 'ep', 878.25, 882.05, 1000), ('c1', 'ep', 867.75, 873.10, 1000), ('c2', 'ep', 904.00, 909.60, 540), ('c3', 'ep', 909.60, 915.60, 950)],
   focus=dict(x=620, y=380, r=180, dur=20), circles=[], noSkull=True,
   top="bro made everyone wait cause he needs it for his IG 💀", hl={'IG': RD}, music=['mwalahi_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'slipped'], ['c1', 'No!'], ['c2', 'IG'], ['c3', 'frame'], ['c3', 'time']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'No!'], 's_fahhh.mp3', 0.5), sfx(['c2', 'IG'], 's_huh.mp3', 0.5), pop(['c3', 'now.'], 'e_laugh.png', 's_ayo.mp3', off=2)]),
 'frun': dict(scenes=[('hook', 'ep', 1020.25, 1022.60, 830), ('c1', 'ep', 1015.00, 1020.25, 830), ('c2', 'ep', 1024.75, 1036.00, 900), ('c3', 'ep', 1040.00, 1044.50, 900)], mute=[(1031.55, 1032.45)],
   focus=dict(x=570, y=230, r=200, dur=20), circles=[], noSkull=True,
   top='"can i RUN down the runway?" 😭', hl={'RUN': RD}, music=['mchud_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'run?'], ['c1', 'swag'], ['c2', 'Bop'], ['c2', 'dare'], ['c2', 'fire']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['hook', 'No'], 's_huh.mp3', 0.5), pop(['c2', 'fire'], 'e_laugh.png', 's_fahhh.mp3', off=4)]),
 'fcar': dict(scenes=[('hook', 'ep', 329.55, 333.95, 1150), ('c1', 'ep', 307.05, 313.95, 1200), ('c2', 'ep', 314.60, 317.60, 960), ('c3', 'ep', 323.00, 324.60, 960), ('c4', 'ep', 333.85, 337.75, 1200)],
   zoom={'hook': (462, 0, 1458, 820), 'c4': (462, 0, 1458, 820)}, mute=[(330.85, 331.20), (332.18, 332.80), (335.66, 335.98)],
   focus=dict(x=390, y=560, r=170, dur=20), circles=[], noSkull=True,
   top='"give me 30 seconds"… bro went HOME 😭', hl={'HOME': RD}, music=['mletme_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'paid'], ['c1', 'bathroom.'], ['c1', '30'], ['c4', 'sorry.'], ['c4', 'wait!']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'seconds.'], 's_huh.mp3', 0.5), pop(['c4', 'sorry.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'grant': dict(scenes=[('hook', 'ep', 1326.60, 1328.40, 1100), ('c1', 'ep', 1307.60, 1314.20, 900), ('c2', 'ep', 1323.00, 1333.30, 1100), ('c3', 'ep', 1340.40, 1348.60, 1000)],
   mute=[(1315.38, 1315.80), (1321.42, 1321.82), (1322.86, 1323.10), (1330.64, 1330.94), (1339.02, 1339.22)],
   focus=dict(x=690, y=470, r=190, dur=20), circles=[], noSkull=True,
   top='bro found out the drop date ON CAMERA and spiraled 😭', hl={'ON': RD, 'CAMERA': RD}, music=['goodbye_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'people!'], ['c1', 'swear'], ['c2', 'profits'], ['c2', 'people!'], ['c2', 'wrong'], ['c3', 'never'], ['c3', 'Ever.'], ['c3', 'shutting']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'swear'], 's_huh.mp3', 0.5), sfx(['c2', 'wrong'], 's_fahhh.mp3', 0.45), pop(['c3', 'forever.'], 'e_laugh.png', 's_ayo.mp3', off=2)]),
 'gpants': dict(scenes=[('hook', 'ep', 442.90, 445.30, 1050), ('c1', 'ep', 413.20, 419.20, 960), ('c2', 'ep', 428.00, 445.30, 1050)],
   focus=dict(x=210, y=290, r=170, dur=20), circles=[], noSkull=True,
   top='bro felt his aura in his MID SECTION 💀', hl={'MID': RD, 'SECTION': RD}, music=['mletme_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'knees'], ['c1', 'pants.'], ['c2', 'goosebumps.'], ['c2', '100'], ['c2', 'mid'], ['c2', 'knees']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'pants.'], 's_huh.mp3', 0.5), sfx(['c2', 'mid'], 's_ayo.mp3', 0.5), pop(['c2', 'toes.'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'gjay': dict(scenes=[('hook', 'ep', 1063.85, 1065.35, 1350), ('c1', 'ep', 1050.85, 1053.40, 900), ('c2', 'ep', 1061.45, 1069.00, 1300), ('c3', 'ep', 1069.50, 1080.70, 1300)],
   focus=dict(x=490, y=360, r=170, dur=20), circles=[], noSkull=True,
   top='jay cutler said "it\'s my first, OKAY?" like a threat 😭', hl={'OKAY?"': RD}, music=['chess_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'first'], ['c1', 'applause'], ['c2', 'last'], ['c2', 'okay?'], ['c3', 'Ferrari.'], ['c3', "Robbie's"]], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'applause'], 's_ding.mp3', 0.45), sfx(['c2', 'last'], 's_huh.mp3', 0.5), pop(['c3', "Robbie's"], 'e_laugh.png', 's_fahhh.mp3', off=4)]),
 'gwalk': dict(scenes=[('hook', 'ep', 654.15, 656.75, 760), ('c1', 'ep', 638.00, 641.00, 1150), ('c2', 'ep', 646.00, 652.40, 920), ('c3', 'ep', 652.40, 657.20, 760), ('c4', 'ep', 675.50, 678.20, 790)],
   focus=dict(x=812, y=330, r=170, dur=20), circles=[], noSkull=True,
   top='jay cutler had to RATE his runway walk 💀', hl={'RATE': RD}, music=['mwalahi_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'better'], ['c1', 'twinning.'], ['c2', 'dance'], ['c3', 'Whoa!'], ['c3', 'better'], ['c4', 'home']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c3', 'Whoa!'], 's_wow.mp3', 0.45), sfx(['c3', 'better'], 's_huh.mp3', 0.5), pop(['c4', 'home'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'gvillain': dict(scenes=[('hook', 'ep', 816.05, 819.75, 900), ('c1', 'ep', 806.50, 816.05, 900), ('c2', 'ep', 816.05, 825.00, 900)],
   mute=[(817.73, 818.21), (823.93, 824.45)],
   focus=dict(x=582, y=240, r=150, dur=20), circles=[], noSkull=True,
   top='"i thought he was a DISNEY VILLAIN" 💀', hl={'DISNEY': RD, 'VILLAIN"': RD}, music=['mdubist_n', 0], ask=[],
   tints=[], rizz=[], punch=[['hook', 'Disney'], ['c1', 'supervillain.'], ['c2', 'Disney'], ['c2', 'antagonist'], ['c2', 'evil']], blowouts=[], blackFlash=[], streaks=[],
   extras=[sfx(['c1', 'supervillain.'], 's_huh.mp3', 0.5), pop(['c2', 'evil'], 'e_laugh.png', 's_fahhh.mp3', off=2)]),
 'hunser': dict(scenes=[('hook', 'ep', 333.85, 336.45, 1200), ('c1', 'ep', 54.50, 61.95, 1080), ('c2', 'ep', 64.20, 69.40, 1080), ('c3', 'ep', 307.05, 313.95, 1200), ('c4', 'ep', 329.55, 333.85, 1150)],
   zoom={'hook': (462, 0, 1458, 820), 'c4': (462, 0, 1458, 820)}, mute=[(330.85, 331.20), (332.18, 332.80), (335.66, 335.98)], focus=dict(x=830, y=560, r=170, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='the most UNSERIOUS fashion show ever 😭', hl={'UNSERIOUS': RD}, music=['mletme_n', 0],
   punch=[['c1'], ['c2'], ['c3'], ['c4']], extras=[sfx(['c1'], 's_huh.mp3', 0.5, off=150), pop(['c2'], 'e_laugh.png', 's_fahhh.mp3', off=120), sfx(['c4'], 's_ayo.mp3', 0.45, off=20)]),
 'hplanet': dict(scenes=[('hook', 'ep', 1020.25, 1022.60, 830), ('c1', 'ep', 437.20, 445.30, 1050), ('c2', 'ep', 906.10, 909.60, 540), ('c3', 'ep', 909.60, 915.60, 950), ('c4', 'ep', 1029.00, 1035.70, 900)],
   mute=[(1031.55, 1032.45)], focus=dict(x=430, y=260, r=190, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='everybody at this fashion show was on their own PLANET 😭', hl={'PLANET': RD}, music=['mchud_n', 0],
   punch=[['c1'], ['c2'], ['c3'], ['c4']], extras=[sfx(['c1'], 's_ayo.mp3', 0.5, off=60), pop(['c1'], 'e_laugh.png', 's_fahhh.mp3', off=200), sfx(['c3'], 's_huh.mp3', 0.5, off=60), pop(['c4'], 'e_sob.png', 's_wow.mp3', off=150)]),
 'hexcuse': dict(scenes=[('hook', 'ep', 878.25, 880.70, 1000), ('c1', 'ep', 867.75, 873.10, 1000), ('c2', 'ep', 47.80, 51.30, 1080), ('c3', 'ep', 508.60, 510.90, 960), ('c4', 'ep', 518.85, 519.70, 960), ('c5', 'ep', 1310.20, 1314.20, 900)],
   mute=[(50.40, 51.05)], focus=dict(x=665, y=390, r=160, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='the EXCUSES at this fashion show were crazy 💀', hl={'EXCUSES': RD}, music=['mwalahi_n', 0],
   punch=[['c1'], ['c2'], ['c3'], ['c5']], extras=[sfx(['c1'], 's_fahhh.mp3', 0.5, off=110), sfx(['c2'], 's_huh.mp3', 0.5, off=40), pop(['c4'], 'e_laugh.png', 's_ayo.mp3', off=5), pop(['c5'], 'e_sob.png', 's_fahhh.mp3', off=60)]),
 'hcomm': dict(scenes=[('hook', 'ep', 816.05, 819.75, 900), ('c1', 'ep', 140.85, 145.80, 960), ('c2', 'ep', 847.30, 850.70, 960), ('c3', 'ep', 861.00, 866.00, 960), ('c4', 'ep', 1063.85, 1069.00, 1300)],
   mute=[(817.73, 818.21)], focus=dict(x=505, y=270, r=150, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='the commentators were NOT okay 😭', hl={'NOT': RD, 'okay': RD}, music=['chess_n', 0],
   punch=[['c1'], ['c2'], ['c3'], ['c4']], extras=[sfx(['c1'], 's_ding.mp3', 0.45, off=60), sfx(['c2'], 's_correct.mp3', 0.45, off=30), pop(['c3'], 'e_sob.png', 's_wow.mp3', off=110), pop(['c4'], 'e_laugh.png', 's_fahhh.mp3', off=80)]),
 'hreview': dict(scenes=[('hook', 'ep', 654.15, 656.75, 760), ('c1', 'ep', 287.50, 297.00, 1100), ('c2', 'ep', 646.00, 652.40, 920), ('c3', 'ep', 652.40, 657.20, 760), ('c4', 'ep', 675.50, 678.20, 790)],
   focus=dict(x=630, y=340, r=160, dur=20), circles=[], noSkull=True, ask=[], tints=[], rizz=[], blowouts=[], blackFlash=[], streaks=[],
   top='the runway reviews were BRUTAL 💀', hl={'BRUTAL': RD}, music=['goodbye_n', 0],
   punch=[['c1'], ['c3'], ['c4']], extras=[sfx(['c1'], 's_huh.mp3', 0.5, off=150), pop(['c1'], 'e_laugh.png', 's_fahhh.mp3', off=240), sfx(['c3'], 's_wow.mp3', 0.45, off=10), pop(['c4'], 'e_sob.png', 's_ayo.mp3', off=30)]),
}

W = {v: [w for s in json.load(open(f'{TX}/{v}.json')) for w in s['w']] for v in ('ep',)}
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
            fc.append(f'[{i}:a:{aidx(v)}]asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{d:.4f}{mt}[a{i}]')
        k = len(spec['scenes'])
        fc.append(''.join(f'[v{i}][a{i}]' for i in range(k)) + f'concat=n={k}:v=1:a=1[cv][ca]'); fc.append('[cv]' + G67 + '[gv]')
        subprocess.run(cmd + ['-filter_complex', ';'.join(fc), '-map', '[gv]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-g', '15',
                              '-c:a', 'aac', '-b:a', '192k', '-map_metadata', '-1', f'public/g67_{eid}.mp4'], check=True)
    c = {k: v for k, v in spec.items() if k not in ('scenes', 'circles', 'nocap', 'mute', 'zoom')}
    st = {s['id']: s['videoStartSec'] for s in scenes}; calls, trk = [], {}
    for sid, o, d, x, y, r, *end in spec.get('circles', []):
        a = st[sid] + o; calls.append([round(a, 2), round(a + d, 2), '']); x2, y2 = end if end else (x, y); n = round(d * 50) + 2
        for k in range(n): u = min(1, k / (n - 2)); trk[f'{a + k / 50:.2f}'] = [round(x + (x2 - x) * u), round(y + (y2 - y) * u), r]
    c['trackData'] = trk
    for e in c['extras']:
        if e.get('y') is None: e.pop('y', None)
    c.update(cta='', ask=[{'at': r, 'text': tx} for r, tx in c['ask']], track='none', calls=calls, src=f'g67_{eid}.mp4',
             intro=False, hardcut=True, cutSfx='s_camflash.mp3', sat=1.1, progress=False, popMid=True, noSkull=False, srcVol=1); c['noSkull'] = spec.get('noSkull', False); c['musicVol'] = 0.4
    sc = {s['id']: s for s in scenes}
    for r in [r for r, _ in c['tints']] + [q['at'] for q in c['ask']] + [e['at'] for e in c['extras']] + sum((c[k] for k in ('rizz', 'punch', 'blowouts', 'blackFlash', 'streaks')), []):
        assert r[0] in sc, (eid, r)
        if len(r) > 1: assert [w for w in sc[r[0]]['words'] if w['word'].lower().startswith(r[1].lower())], (eid, r, [w['word'] for w in sc[r[0]]['words']])
    c['ask'] = []  # user: nothing under the video (no ask pill / promo line / progress bar)
    CFG[eid] = c
json.dump(gen, open('src/edits.gen.json', 'w')); json.dump(CFG, open('src/yla.cfg.json', 'w'), indent=1); print('cfg ok')
