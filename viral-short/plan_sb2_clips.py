# Summer Breaks batch 3 (user 2026-11-25: "clips are bad, no one cares about their yapping") -> ONLY hype pull moments, cut tight
# around the reveal, Emma on screen; ranked by hype words + hit words + loudness peaks, smooth-source windows only.
# fx = (scene, word, kind[, frame offset]); kinds: good / meme / green / red / riser / cash / e:<emoji> / q:<comment question> / sfx name
GB = ['r_goodbye', 0]; BL = ['r_blue', 0]
Q = 'Keep it or sell it? 🤔'
CL = {
 'sbcaleb': dict(n='02', sty='vp', music=GB, mv=0.22, card=(320, 760), emma=(220,), top="Emma Roberts asked if they were ready… then THIS", hl={'THIS': '#FF2A2A'},
   scenes=[('hook', 60.10, 64.00, 'wide'), ('h2', 64.00, 69.25, 'card'), ('s1', 49.95, 53.28, 'wide'), ('s2', 53.28, 56.45, 'people'), ('s3', 56.45, 60.08, 'wide')],
   fx=[(('hook', 'Bang'), 'good'), (('hook', 'Caleb'), 'cash'), (('h2', 'go'), 'wow'), (('h2', 'Shawn'), 'q:' + Q), (('s1', 'ready'), 'suspense'), (('s2', 'Emma'), 'ding'),
       (('s2', 'yes'), 'e:think'), (('s3', 'Cody'), 'hit'), (('s3', 'come'), 'riser', -20)],
   punch=[('hook', 'Bang'), ('hook', '50'), ('h2', 'go'), ('s2', 'Emma'), ('s3', 'come')], blow=[('hook', 'Bang')], streaks=[('s3',)]),
 'sbbo': dict(n='84', sty='jorho', music=BL, mv=0.22, card=(312, 736), emma=(400,), top="POV: you're in Emma Roberts' card break 💀",
   scenes=[('s1', 0.00, 4.95, 'wide'), ('s2', 6.90, 14.05, 'card'), ('s3', 14.05, 15.35, 'people'), ('s4', 23.60, 30.05, 'cardm')],
   fx=[(('s1', 'Stop'), 'suspense'), (('s1', 'bumped'), 'riser', 10), (('s2', 'Bo'), 'good'), (('s2', 'Jackson'), 'cash'), (('s3', 'yay'), 'wow'), (('s3', 'yay'), 'e:heart'),
       (('s4', 'auto'), 'ding'), (('s4', 'insane'), 'green'), (('s4', 'insane'), 'correct'), (('s4', 'favorite'), 'q:' + Q)],
   blow=[('s2', 'Bo')]),
 'sbmendoza': dict(n='95', sty='jorho', music=BL, mv=0.22, card=(352, 756), emma=(250,), top="Emma Roberts' break pulled the same card TWICE 😭",
   scenes=[('s1', 25.80, 27.40, 'wide'), ('s1b', 27.40, 29.85, 'card'), ('s2', 29.85, 34.35, 'wide'), ('s3', 35.30, 38.70, 'people'), ('s4', 41.30, 45.40, 'cardm'), ('s5', 45.40, 49.70, 'wide')],
   fx=[(('s1', 'god'), 'good'), (('s2', 'Cody'), 'hit'), (('s3', 'way'), 'wow'), (('s3', 'huge'), 'cash'), (('s4', 'same'), 'huh'), (('s4', 'crazy'), 'ding'),
       (('s5', 'variation'), 'correct'), (('s5', 'variation'), 'q:' + Q)],
   blow=[('s1', 'god')]),

 # Nov 5 Star Wars stream: last-pack Kylo Ren 1/1 Adam Driver auto (Emma ripping, "my hands are shaking… teary-eyed")
 'sbkylo': dict(n='69', fk='n69', nov5=True, sty='vp', music=GB, mv=0.20, card=(300, 720), emma=(520,), top="Emma Roberts ripped THIS in the last pack", hl={'THIS': '#FF2A2A'},
   scenes=[('hook', 33.85, 37.85, 'wide'), ('h2', 37.85, 48.10, 'card'), ('s1', 14.25, 20.60, 'wide'), ('s2', 22.55, 26.60, 'people'), ('s3', 29.35, 33.80, 'cardm')],
   fx=[(('hook', 'god'), 'good'), (('hook', 'Kylo'), 'wow'), (('h2', 'Kylo'), 'cash'), (('h2', 'one'), 'ding'), (('h2', 'way'), 'green'), (('h2', 'teary'), 'e:sob'),
       (('h2', 'teary'), 'aww'), (('h2', 'last'), 'q:' + Q), (('s1', 'crazy'), 'suspense'), (('s2', 'silent'), 'awk'), (('s3', 'Come'), 'riser', 0)],
   punch=[('hook', 'Kylo'), ('h2', 'Driver'), ('h2', 'one'), ('h2', 'teary'), ('s2', 'nervous')], blow=[('hook', 'god')], streaks=[('s3',)]),
 # Nov 5: Disney vault Toy Story triple auto (Woody / Jessie / Stinky Pete)
 'sbtoy': dict(n='37', fk='n37', nov5=True, sty='vp', music=GB, mv=0.20, card=(300, 766), emma=(520,), top="Emma Roberts opened a Disney pack and got THIS", hl={'THIS': '#FF2A2A'},
   scenes=[('hook', 56.55, 59.45, 'wide'), ('h2', 59.45, 64.85, 'card'), ('h3', 64.85, 67.50, 'card'), ('s0', 0.95, 4.25, 'wide'), ('s1', 49.95, 53.60, 'cardm'), ('s2', 53.60, 56.50, 'people')],
   fx=[(('hook', 'triple'), 'good'), (('hook', 'God'), 'wow'), (('h2', 'Woody'), 'cash'), (('h2', 'Pete'), 'ding'), (('h3', 'Hanks'), 'e:heart'), (('h3', 'Hanks'), 'correct'),
       (('h3', 'Grammer'), 'q:' + Q), (('s0', 'insane'), 'suspense'), (('s1', 'Stop'), 'huh'), (('s1', 'Stop'), 'red'), (('s2', 'friend'), 'riser', 0)],
   punch=[('hook', 'triple'), ('h2', 'Woody'), ('h2', 'Pete'), ('h3', 'Hanks'), ('s1', 'Stop')], blow=[('hook', 'triple')], streaks=[('s1',)]),
}
