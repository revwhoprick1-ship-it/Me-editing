---
tags: [style, sfx, music, licensing]
---
# SFX & music library

Back to [[START HERE]] · When to use what: [[Editing playbook]]

## Sound effects: `public/sfx/`
Meme SFX downloaded from myinstants.com (user-uploaded meme sounds; fine for meme edits, but they are not formally licensed: swap them if a platform flags audio).
`onset` = ms of silence before the sound actually starts. The code subtracts it so the hit lands on the frame.

| File | Length | Onset | Use for |
|---|---|---|---|
| vine-boom.mp3 | 1.3 s | 80 ms | the punchline / big reveal |
| fast-whoosh.mp3 | 1.2 s | 380 ms (peak 550 ms) | **default whoosh** for cuts/intro; code lines up the peak on the cut |
| whoosh.mp3 | 4.1 s | 70 ms | ❌ user disliked it, don't use |
| record-scratch.mp3 | 0.9 s | 40 ms | "wait what?" / disbelief |
| crickets.mp3 | 5.3 s | 120 ms | awkward silence / thinking |
| ding-2.mp3 | 3.0 s (use 1.5 s) | 140 ms | **default ding**: emoji pop, ranking reveal |
| ding.mp3 | 0.8 s | 120 ms | ❌ user disliked it, don't use |
| camera-shutter.mp3 | 0.5 s | 10 ms | freeze frame, flash |
| error.mp3 | 0.8 s | 110 ms | "AURA -N", fail |
| bruh.mp3 | 5.1 s | 200 ms | fail / disappointment |
| fahhh.mp3 | 6.4 s | 190 ms | big fail |
| huh-cat.mp3 | 7.3 s | 1320 ms | confusion |
| metal-pipe-clang.mp3 | 2.8 s | 170 ms | falls, impacts |
| taco-bell-bong.mp3 | 2.0 s | 80 ms | awkward reveal |
| oh-hell-nah.mp3 | 4.0 s | 20 ms | outrage reaction |
| rizz-sound-effect.mp3 | 1.9 s | 190 ms | smooth/aura moment |
| anime-wow.mp3 | 4.2 s | 180 ms | impressive moment |
| spongebob-boowomp.mp3 | 1.4 s | 180 ms | sad ending / outro |

## Music: `public/music/`
User wants **meme music** (recognisable meme tracks beat generic royalty-free) and wants it **clearly audible**: bed ≈ 0.38–0.4 in gaps and ≈ 0.18–0.2 under speech (v3 used 0.2/0.08 and it was too quiet).

Kevin MacLeod (incompetech.com), **CC BY 4.0**. Put this in the video description when posting:
> Music: "Track Name" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/

| File | Mood | Use |
|---|---|---|
| Jeopardy_Think.mp3 | **meme**: Final Jeopardy think music (myinstants, copyrighted) | **default** for questions / thinking silence (skip 150 ms) |
| Curb_Credits.mp3 | **meme**: Curb Your Enthusiasm credits (myinstants, copyrighted) | **default** for the awkward punchline / laugh (skip 600 ms) |
| Sneaky_Snitch.mp3 | sneaky suspense | the build-up / question |
| Investigations.mp3 | tense, mysterious | long silences |
| Monkeys_Spinning_Monkeys.mp3 | goofy | laughter / payoff |
| Fluffing_a_Duck.mp3 | goofy, bouncy | alternative comedy bed |

Trending phonk/pop songs are what many brainrot edits use, but they're copyrighted. Add them yourself in the upload app if you want that.
