"""Love & Justice Episode 6 (campaign footage). Times are SOURCE seconds in footage/lj6/ep6.mp4.
Fields: see tools/lj/ep5.py header. music: background song from the EDITING RESOURCES BGSONGS folder (public/bg/)."""
SRC = 'footage/lj6/ep6.mp4'
WORDS = 'footage/lj6/ep6.words.json'
LAYOUT = '169'  # keep the whole 16:9 frame (user: no vertical crop)
# vol: bed level under dialogue, matched per song loudness (songs are -9..-16 LUFS)
LMK = dict(src='bg/let-me-know.mp3', muffled='bg/let-me-know-muffled.mp3', start=3.0, vol=0.05)
CHESS = dict(src='bg/chess-slowed.mp3', muffled='bg/chess-slowed-muffled.mp3', start=0.0, vol=0.045)
BYE = dict(src='bg/say-goodbye.mp3', muffled='bg/say-goodbye-muffled.mp3', start=0.0, vol=0.09)
MUSIC = LMK
CLIPS = [
    dict(id='e6c1', slot='c1', hook=(351.62, 353.95), main=(327.15, 360.40), music=LMK,
         title=[['*HE RATES HER'], ['FRIENDS 1 TO 10*', 'red']],
         actions=[(328.4, 1.6, '*POINTS AT HIM*'), (335.0, 1.8, '*JURY SHOCKED*'), (344.0, 1.6, '*HE DOES NOT DENY IT*')],
         washes=[(331.49, 'red'), (343.86, 'yellow'), (352.16, 'magenta'), (358.90, 'yellow')],
         punches=[(331.49, 1.12), (343.86, 1.12), (352.16, 1.15), (356.92, 1.10)], shakes=[343.86], tension=[(339.78, 343.86)],
         red=['TRACKS', 'CUTENESS', 'GIRLFRIENDS'], green=['10'], magenta=['UNISEXUAL', 'CONTINUUM', 'BISEXUALITY']),
    dict(id='e6c2', slot='c2', hook=(400.60, 403.10), main=(383.00, 412.00), music=CHESS,
         title=[["*HE COULDN'T OPEN"], ['HER DRINK*', 'yellow']],
         actions=[(386.4, 1.8, '*HANDS HER THE SNACK*'), (397.7, 2.6, '*STRUGGLING*'), (401.4, 2.4, '*STILL STRUGGLING*'), (406.6, 1.4, '*FINALLY*')],
         washes=[(389.38, 'green'), (397.30, 'yellow'), (404.50, 'green'), (409.06, 'red')],
         punches=[(389.38, 1.10), (400.72, 1.15), (405.80, 1.10), (408.80, 1.12)], shakes=[404.50], tension=[(397.30, 404.50)],
         red=['BREATH'], green=['SNACK', 'STRONG'], yellow=['COCONUT']),
    dict(id='e6c3', slot='c3', hook=(503.40, 506.50), main=(486.45, 516.00), music=BYE,
         title=[['*HE BROUGHT HER'], ['SLIPPERS TO COURT*', 'magenta']],
         actions=[(490.3, 1.6, '*HER FEET RN*'), (494.0, 1.8, '*PULLS OUT SLIPPERS*'), (509.8, 1.8, '*LEAVES THEM THERE*')],
         washes=[(489.44, 'red'), (495.06, 'magenta'), (503.44, 'yellow'), (514.18, 'green')],
         punches=[(489.44, 1.10), (495.06, 1.15), (503.44, 1.12), (514.18, 1.10)], shakes=[495.06], tension=[(496.78, 503.44)],
         red=['KILLING', 'HEELS'], green=['RED'], magenta=['SLIPPERS', 'PINK']),
    dict(id='e6c4', slot='c4', hook=(735.35, 737.40), main=(697.95, 746.55),
         music=dict(src='bg/sybau.mp3', muffled='bg/sybau-muffled.mp3', start=0.0, vol=0.10, drop_src=49.34, drop_at=744.40, drop_mul=0.45),
         title=[['*BERT ATE SOMETHING'], ['FROM HER PURSE*', 'red']],
         actions=[(698.1, 1.8, '*BERT DUMPS THE PURSE*'), (720.0, 2.4, '*BERT INSPECTING*'), (726.9, 1.6, '*TAKES A BITE*'), (736.5, 1.6, '*JUDGE REALIZING*')],
         washes=[(700.67, 'yellow'), (715.49, 'yellow'), (722.89, 'magenta'), (735.39, 'red'), (744.40, 'green')],
         punches=[(700.67, 1.10), (715.49, 1.12), (731.39, 1.12), (735.39, 1.15), (744.40, 1.15)], shakes=[744.40], tension=[(722.89, 735.39)],
         red=['WEED'], green=['FRUIT', 'SNACK'], yellow=['CANDLE', 'MOUSE', 'ALMONDS']),
    dict(id='e6c5', slot='c5', hook=(1034.50, 1036.62), main=(1025.90, 1046.80), music=CHESS,
         title=[['*BERT IS'], ['BEYOND HIGH*', 'green']],
         actions=[(1028.4, 1.8, '*BERT VIBING*'), (1035.3, 1.6, '*EXPLAINS HIMSELF*'), (1043.4, 1.6, '*COMPLETELY CALM*')],
         washes=[(1026.29, 'green'), (1032.83, 'yellow'), (1037.33, 'magenta'), (1045.43, 'red')],
         punches=[(1026.29, 1.12), (1032.83, 1.10), (1037.33, 1.12), (1043.29, 1.12)], shakes=[1037.33], tension=[(1030.43, 1034.51)],
         red=['PSYCHOTIC'], green=['HIGH', 'FRUIT', 'SNACK', 'SNACKS'], magenta=['SINGULAR']),
]
