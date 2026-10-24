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
| cha-ching.mp3 | 2.1 s | 180 ms (peak 640) | price appears |
| air-horn.mp3 | 3.0 s | 30 ms | hype / everyone screams |
| crowd-cheer.mp3 | 11.8 s | 380 ms | under real celebrations (trim ~6 s) |

## Music for NON-podcast clips (user's phonk list)
User's list (YouTube, slowed Brazilian phonk/montagem): Montagem Pegadora (Slowed) · Funk Abnormal (Slowed) · Montagem Alquimia · Pinky Smash – Eclipser (Super Slowed) · Acido III (Super Slowed) · Amor Na Praia (Slowed + Reverb) · Vem Pere Reka (Slowed) · Funk do Balkan (Slowed + Reverb) · Tipo Insta do Buzeira (Slowed) · Montagem Uranium (Slowed) · L.P. Rhythm – Versatile (Hardstylish Remix, slowed) · HIMXN, Nulteex – TAK TAK (Super Slowed) · Montagem Pegadora · fennecxx, DJ ALEX – Spooky (Super Slowed) · Funk Sigilo (Slowed).
YouTube audio can't be downloaded from the cloud box; only these were found on myinstants (copyrighted, short loops):
| File | Length | Analysis (librosa) | Use |
|---|---|---|---|
| montagem-alquimia.mp3 | 15.0 s | 107.7 BPM, intro build 0–3.92 s, **bass drop at 3.92 s**, body loops well from 4.6 s | **default**: play the intro so the drop lands exactly on the reveal |
| spooky-phonk-fennecxx(-spooky).mp3 | 11–12 s | 129 BPM, no intro (full energy from 0) | alt. hype bed |
| acido / acido_1e6rXyW.mp3 | 4–5 s | 172 BPM fragment | stinger only |
To use the others, the user can drop the MP3s into `public/music/`.

**Timing rule:** music drop = reveal frame (flash + money + ka-ching + vine boom all on the same frame). Quiet body under talk, intro build during the last ~4 s before the reveal.

## Music: `public/music/`
User wants **ONE meme song for the whole video** (no switching tracks), **loud**, and recognisable meme music (recognisable meme tracks beat generic royalty-free) and wants it **clearly audible**: bed ≈ 0.38–0.4 in gaps and ≈ 0.18–0.2 under speech (v3 used 0.2/0.08 and it was too quiet).

Kevin MacLeod (incompetech.com), **CC BY 4.0**. Put this in the video description when posting:
> Music: "Track Name" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/

| File | Mood | Use |
|---|---|---|
| du-bist-gut-genug.mp3 | **meme**: "Du bist gut genug" (myinstants, 7.3 s, loud master, loop it) | **user's current pick**: ONE song for the whole video, volume 0.32 / duck 0.17 |
| Jeopardy_Think.mp3 | **meme**: Final Jeopardy think music (myinstants, copyrighted) | **default** for questions / thinking silence (skip 150 ms) |
| Curb_Credits.mp3 | **meme**: Curb Your Enthusiasm credits (myinstants, copyrighted) | **default** for the awkward punchline / laugh (skip 600 ms) |
| Sneaky_Snitch.mp3 | sneaky suspense | the build-up / question |
| Investigations.mp3 | tense, mysterious | long silences |
| Monkeys_Spinning_Monkeys.mp3 | goofy | laughter / payoff |
| Fluffing_a_Duck.mp3 | goofy, bouncy | alternative comedy bed |

Trending phonk/pop songs are what many brainrot edits use, but they're copyrighted. Add them yourself in the upload app if you want that.
