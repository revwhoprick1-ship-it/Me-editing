# batch 2 clip specs for plan_sb2.py. fx = (scene, word, kind[, frame offset]); kinds: good / meme / green / red / riser / cash / e:<emoji> / q:<comment question> / sfx name
GB = ['r_goodbye', 0]; BL = ['r_blue', 0]
Q = 'Keep it or sell it? 🤔'
CL = {
 # VverPaldo: hook = the "wow wow wow, huge" reaction on the card, then the rip in order, ends on "out of 99 … first case"
 'sbmahomes': dict(n='40', sty='vp', music=GB, mv=0.24, card=(342, 760), emma=(250,), top="Emma Roberts' break just pulled THIS Mahomes", hl={'THIS': '#FF2A2A'},
   scenes=[('hook', 46.90, 48.20, 'wide'), ('h2', 48.20, 51.10, 'card'), ('s1', 0.00, 2.70, 'wide'), ('s2', 6.80, 11.80, 'people'), ('s3', 20.15, 25.95, 'cardm'), ('s4', 40.05, 46.40, 'card'), ('s5', 74.05, 80.05, 'wide')],
   fx=[(('hook', 'Wow'), 'good'), (('h2', 'Huge'), 'cash'), (('s1', 'gold'), 'green'), (('s1', 'good'), 'correct'), (('s2', 'saw'), 'suspense'), (('s3', 'ultra'), 'riser', -40),
       (('s3', 'ultra'), 'good'), (('s3', 'weird'), 'huh'), (('s4', 'incredible'), 'wow'), (('s4', 'lord'), 'e:heart'), (('s4', 'stunning'), 'ding'), (('s5', '99'), 'good'),
       (('s5', 'Violet'), 'green'), (('s5', 'first'), 'q:' + Q)],
   punch=[('h2', 'Huge'), ('s3', 'ultra'), ('s4', 'incredible'), ('s5', '99')], blow=[('h2', 'Huge')], streaks=[('s4',)]),
 # VverPaldo: 1/1 Texas Star patch, hook = "one of one" with the card big
 'sbjudy2': dict(n='03', sty='vp', music=GB, mv=0.24, card=(320, 690), emma=(420,), top="Emma Roberts' break just hit a 1 of 1", hl={'1': '#FF2A2A', 'of': '#FF2A2A'},
   scenes=[('hook', 17.75, 19.90, 'wide'), ('h2', 19.90, 25.30, 'card'), ('s1', 11.75, 17.70, 'cardm'), ('s2', 26.05, 30.40, 'people'), ('s3', 44.65, 52.60, 'wide')],
   fx=[(('hook', 'One'), 'good'), (('h2', 'Patch'), 'cash'), (('h2', 'nasty'), 'wow'), (('s1', 'Stop'), 'riser', -30), (('s1', 'Stop'), 'huh'), (('s1', 'patch'), 'ding'),
       (('s2', 'Judy'), 'correct'), (('s2', 'congrats'), 'e:heart'), (('s3', 'One'), 'good'), (('s3', 'charm'), 'aww'), (('s3', 'Wow'), 'q:' + Q)],
   punch=[('hook', 'One'), ('h2', 'Star'), ('h2', 'nasty'), ('s1', 'Stop'), ('s3', 'charm')], blow=[('h2', 'Patch')], streaks=[('s3',)]),
 # VverPaldo: Emma's 99-cent-store tax story, hook = the punchline
 'sbtax2': dict(n='51', sty='vp', music=GB, mv=0.22, emma=(330,), top="Emma Roberts learned about taxes the hard way", hl={'taxes': '#FF2A2A'},
   scenes=[('hook', 49.20, 54.80, 'people'), ('s1', 28.10, 34.15, 'wide'), ('s2', 34.15, 39.40, 'people'), ('s3', 39.40, 45.40, 'wide'), ('s4', 45.40, 49.15, 'people')],
   fx=[(('hook', 'taxes'), 'meme'), (('hook', 'Poor'), 'aww'), (('s1', 'rudest'), 'suspense'), (('s1', '99'), 'ding'), (('s2', 'Ziploc'), 'huh'), (('s2', 'item'), 'e:think'),
       (('s3', 'tax'), 'awk'), (('s3', 'whoa'), 'ayo'), (('s4', 'confused'), 'e:laugh'), (('s4', 'confused'), 'fah'), (('s4', 'Ziploc'), 'q:Did you do this as a kid? 😭')],
   punch=[('hook', 'taxes'), ('s1', 'rudest'), ('s3', 'tax'), ('s3', 'whoa'), ('s4', 'confused')], blow=[('hook', 'taxes')], streaks=[('s3',)]),
 # Jorho: Emma's Allen & Ginter card story
 'sbwoman2': dict(n='52', sty='jorho', music=BL, mv=0.24, emma=(470,), top="Emma Roberts has her own trading card now 💀",
   scenes=[('s1', 16.90, 23.40, 'people'), ('s2', 25.50, 29.10, 'wide'), ('s3', 29.10, 31.95, 'people'), ('s4', 32.30, 36.90, 'wide'), ('s5', 37.70, 40.20, 'people')],
   fx=[(('s1', 'Allen'), 'green'), (('s1', 'card'), 'ding'), (('s1', 'color'), 'rizz'), (('s2', 'sick'), 'wow'), (('s3', 'who'), 'suspense'), (('s3', 'woman'), 'meme'),
       (('s3', 'me'), 'e:skull'), (('s4', 'idea'), 'huh'), (('s4', 'woman'), 'e:laugh'), (('s5', 'died'), 'red'), (('s5', 'died'), 'fah'), (('s5', 'respectful'), 'awk'),
       (('s5', 'respectful'), 'q:Would you pull her card? 🃏')],
   blow=[('s3', 'woman')]),
 # Jorho: "Kitty Cat" (George Kittle) banter
 'sbkitty': dict(n='07', sty='jorho', music=BL, mv=0.24, emma=(330,), top="Emma Roberts is trying to make 'Kitty Cat' happen 😭",
   scenes=[('s1', 17.00, 20.38, 'people'), ('s2', 20.38, 24.76, 'wide'), ('s3', 24.76, 30.00, 'people'), ('s4', 30.10, 36.10, 'wide'), ('s5', 38.05, 40.50, 'people')],
   fx=[(('s1', 'Niners'), 'hit'), (('s2', 'Kittle'), 'green'), (('s2', 'Kitty'), 'rizz'), (('s2', 'Kitty'), 'e:rizz'), (('s3', 'happen'), 'huh'), (('s3', 'Kitty'), 'ding'),
       (('s4', 'taken'), 'meme'), (('s4', 'taken'), 'e:sob'), (('s4', 'Kitty'), 'awk'), (('s5', 'Pokemon'), 'wow'), (('s5', 'heard'), 'q:Should Kitty Cat catch on? 🐱')],
   blow=[('s2', 'Kitty')]),
}
