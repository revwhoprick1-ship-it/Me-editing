"""Episode-5 footage config (superseded: the campaign is Episode 6 only)."""
SRC = 'footage/lj/ep.mp4'
WORDS = 'footage/lj/ep.words.json'
MUSIC = dict(src='music/Investigations.mp3', muffled='lj/investigations-muffled.mp3', start=0, vol=0.12)
# Style per analysis/06_master_style_guide.md. All times are SOURCE seconds.
#   title   : hook title (typewriter on the freeze frame), [text, colour]
#   actions : *ACTION* captions (cyan italic)            (t, seconds, text)
#   washes  : colour wash + ding on reaction beats (>=5 s apart)   (t, colour)
#   punches : eased zoom ramp on a key line, held to the end of the shot   (t, scale)
#   shakes  : camera shake on the biggest hits           t
#   tension : music bed low-passed (muffled) between a and b, opens at b   (a, b)
CLIPS = [
    dict(id='c1', hook=(1046.25, 1048.95), main=(1022.45, 1061.30),
         title=[['*HIS PHONE RANG'], ['MID-VERDICT*', 'red']],
         actions=[(1029.0, 1.6, '*PHONE RINGING*'), (1034.4, 1.9, '*JUDGE TAKES HIS PHONE*'), (1049.4, 1.7, '*FACEPALM*')],
         washes=[(1038.78, 'yellow'), (1046.36, 'red'), (1053.86, 'yellow'), (1058.40, 'green')],
         punches=[(1038.78, 1.12), (1046.36, 1.15), (1056.40, 1.12), (1059.30, 1.10)], shakes=[1046.36], tension=[(1029.2, 1046.3)],
         red=['SETTINGS', 'BABY', 'KNEW'], green=['VERDICT', 'JURY', 'RIGHT']),
    dict(id='c2', hook=(1094.40, 1097.90), main=(1072.50, 1111.10),
         title=[['*SHE'], ['SNAPPED', 'red'], ['IN COURT*']],
         actions=[(1074.3, 1.6, '*LUNGES AT HIM*'), (1077.2, 1.7, '*BERT HOLDS HER BACK*'), (1100.4, 1.6, '*JURY LOSING IT*')],
         washes=[(1075.60, 'red'), (1082.85, 'yellow'), (1094.50, 'red'), (1103.74, 'magenta')],
         punches=[(1082.88, 1.12), (1094.50, 1.15), (1103.74, 1.15)], shakes=[1075.60, 1094.50], tension=[(1084.5, 1094.45)],
         red=['HATE', 'AFFAIR', 'COWORKER', "BROTHER'S", 'BIGGER'], green=[]),
    dict(id='c3', hook=(671.40, 674.10), main=(655.00, 689.95),
         title=[['*WHERE DOES HE GO'], ['EVERY WEEK?*', 'yellow']],
         actions=[(659.25, 1.8, '*BERT IS READY*'), (677.8, 1.8, '*HE FINALLY CRACKS*')],
         washes=[(658.60, 'red'), (671.45, 'red'), (683.20, 'green'), (688.40, 'red')],
         punches=[(659.25, 1.12), (671.45, 1.12), (683.20, 1.15), (688.10, 1.10)], shakes=[671.45], tension=[(676.7, 683.2)],
         red=['EYES', 'SOCKETS', 'JAW', 'SKULL', 'LYING'], green=['DANCE']),
    dict(id='c4', hook=(741.55, 743.25), main=(697.70, 741.20),
         title=[['*JUDGE MADE HIM'], ['PROVE IT*', 'yellow']],
         actions=[(700.0, 1.8, '*HIP HOP EXPERT STANDS*'), (713.5, 2.8, '*DANCING*'), (717.3, 1.6, "*BERT CAN'T WATCH*"), (721.8, 2.6, '*STILL DANCING*'), (726.3, 1.4, '*JUROR IN PAIN*')],
         washes=[(713.40, 'cyan'), (728.95, 'red'), (734.20, 'magenta')],
         punches=[(705.20, 1.10), (729.00, 1.15), (734.20, 1.12), (739.80, 1.10)], shakes=[729.0], tension=[(707.4, 713.4)],
         red=['AWFUL', 'SEIZURE'], green=['DANCE', 'LEARNING'], magenta=['CHEATING']),
    dict(id='c5', hook=(477.15, 479.35), main=(460.60, 487.95),
         title=[['*HIS BROTHER'], ['SAID TOO MUCH*', 'red']],
         actions=[(483.1, 1.8, '*WIFE HEARING THIS*')],
         washes=[(464.80, 'yellow'), (473.90, 'magenta'), (479.50, 'yellow'), (485.70, 'red')],
         punches=[(465.00, 1.12), (474.00, 1.15), (478.10, 1.12), (486.30, 1.10)], shakes=[473.9], tension=[(470.5, 473.9)],
         red=['GAY', 'BISEXUAL'], green=['GOOD'], magenta=['ACCIDENT']),
]
