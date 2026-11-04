---
tags: [style, podcast, jorho]
date: 2026-10-31
---
# Jorho style (v2, measured from the real videos)

**Sources:** four Backyard Breaks Daily Trevor Lawrence Shorts that the user shared on Drive (360x640, 30 fps, about 15.1 s each). All are from the same wig session as our footage:
- `ref0` "Imagine being so popular people gift you your card";
- `ref1` "Imagine having an NBA Goat thats not LeBron fr";
- `ref2` "This player is elite ball knowledge!";
- `ref3` "Davis Mills be like: Why u bully meh".

**How it was measured:**
- per-frame pixel measurements (box edges, brightness, tint colour by linear fit);
- Demucs (htdemucs, two stems) to split voice from music+SFX;
- spectrograms, onset detection and band envelopes on the stems.

Every number below comes from that, not from eyeballing. YouTube itself is not downloadable from this box (bot check), so the user drops reference videos on Drive.

## Layout
- **Background:** black.
- **Video box:** y **417 → 1494** (1077 tall, vertically centred), full width, no border.
- **Top line:**
  - Montserrat **Bold 700**, ~58 px, line pitch 65 px, white, centred, max width about 900 px, no stroke or shadow;
  - its last line sits **3 px above the box** and moves with it;
  - sentence-case meme take ending in an iOS **💀** at about cap height ("…fr💀", "be like:", "Imagine…").
- **Bottom bar:** empty.

## Intro (identical in all 4, frames 0–24)
- The box opens like a mask from **700 → 1077 px tall**, centred. Measured top edge at frames 0, 3, … 24: 609, 573, 537, 504, 474, 450, 432, 420, 417.
- The top line rides on the box.
- The footage starts **blurred and blown out** (with a horizontal smear) and is clear by about frame 16–18.
- The first spoken word is already on screen at frame 0.
- **Sound:** a 2642 Hz "ting" at frame 0 (pure tone, faint partial near 6.9 kHz, full level at once, decays about 35 dB over 1.3 s).

## Captions
- One word at a time, exactly on the word, staying until the next word.
- Montserrat 800, about 58 px, thin dark outline plus a soft dark shadow.
- **Colours** (measured): yellow **#F9FC35**, cyan **#21F5E6**, green **#58EE28**, white. They look random per word (repeats allowed).
- **Entry:** 2 frames of horizontal motion smear, then sharp. No pop, no scale bounce.
- **Height varies per video** (centre y 1100–1230), placed on the subject's chest/table line, fixed for the whole video.

## Effects (all land on music beats)
1. **White strobe:** an 11-frame preset. Brightness per frame relative to normal: +.6 +.45 +.7 +.85 +.85 +.85 **dip** +.95 +1 +1 +.95. Blown highlights (50–70 % of pixels clipped). **The shot changes on the dip frame (frame 6)**, so the strobe works as a transition. Sound: a loud, bright, short noise hit (spectral centroid 3.5–4.4 kHz, ~0.1–0.2 s, a little low end), peaking around −2 dBFS.
2. **Green tint:** rgb(**167,234,4**), normal blend at **62 %**. Envelope: 3 frames in (0.21 / 0.42 / 0.62), 3 held, 3 out. Used on names and hook words, in quick rhythm early in the video. Sound: a short swish (noise burst, ~0.25 s), and sometimes the ting again.
3. **Red tint:** rgb(**244,3,5**) at 62 %, same envelope. Used on laughs ("hahaha", "your"). **Silent.**
4. **Cut-out photo** (Dellavedova in ref1):
   - **Entry:** under a green tint. Frame 0 is huge with vertical streaks, then it settles over about 10 frames from 1.5× scale, blurred and washed in yellow, down to normal.
   - **Look:** a solid yellow-orange outline (~4 px). It stands on the bottom of the box over the hosts, and captions stay on top.
   - **Exit:** blinks on/off for about 8 frames while sliding right.
5. **Framing:** hard cuts between the wide shot and a tight one (~1.6×) on whoever reacts. No animated zooms.

## Sound mix
- Voice on top.
- Background music **about 10 dB under the voice**, running the whole time. Two refs share one ~82 BPM track; the other two are ~123–129 BPM. The tracks are not in our library (chroma match failed), so we pick by tempo:
  - ~81 BPM → **Blue** (half-time);
  - ~125 BPM → **Du bist (full)**.
- Edits snap to the beat: the main strobe lands on a beat (`songFrom = beat − strobeOut`).
- Sound effects come from myinstants.com, never self-made (user rule): `jorho-ting` = "proper ding" (peaks at 2642 Hz, the same as the refs), `jorho-flash` = "camera flash flash" (centroid ~3.7 kHz), `jorho-swish` = "swoosh sound effects". All are in `public/sfx/`, with leading silence trimmed.

## Code
- `src/jorho/kit.tsx`:
  - `Frame` (intro reveal + top line);
  - `wordsFrom` / `OneWord`;
  - `strobe()` + `STROBE_CUT`;
  - `Tints` with `GREEN` / `RED`;
  - `Cutout`.
- `src/jorho/clips.tsx`: a `Spec` per clip (timeline, shot list in output time, strobes, tints, swishes, cut-out, music) rendered by one `Jorho` component.
  - `JorhoPeyton`: u4, "Imagine having Peyton Manning on speed dial".
  - `JorhoGolf`: t2, "Trevor's dream golf foursome is undefeated".
- Cut-outs are made from Wikimedia photos with rembg `u2net_human_seg` and stored in `public/img/jorho/`.
- Wikimedia rate-limits hard: use a descriptive User-Agent and wait about 60 s between retries.
- v1 (made from thumbnails only) is superseded.

## SFX identified in the references (all on myinstants.com)
Method:
- 4-stem Demucs split;
- peak-constellation fingerprint plus windowed mel correlation of about 500 myinstants sounds against the drums/other stems;
- checks: pitch for tones, transient spacing for multi-hit sounds.

| sound | myinstants file | where in refs | proof |
|---|---|---|---|
| intro ting (also some green tints) | `proper-ding_IbfMQYw.mp3` → `jorho-ting` | frame 0 in all 4; ref0 8.0 s | tone exactly 2642 Hz, same line in the spectrogram |
| white strobe hit | `camera-flash-sound-effect.mp3` → `jorho-flash` | ref0 1.74, ref3 1.04, ref1 7.73 | 53-peak fingerprint, 40–55 % matched at the strobe frames |
| green tint / cut-out entry swoosh | `roblox-swoosh-hd.mp3` → `jorho-swish` | ref3 1.79 / 2.90 / 4.29, ref1 11.5, ref2 11.2 | mel correlation 0.81–0.85 exactly on the tints |
| suspense beep before a name | `04357.mp3` (1 kHz, 0.57 s) → `jorho-beep` | ref1 2.53–3.10 ("gotta be… [beep] who") | pure 1000 Hz tone, 0.57 s |
| red tint | none | | silent |

The beep goes on a **480 ms freeze-pause** right before the name drops (a timeline hold); the strobe/cut-out lands after it.

## Beep rule (user, 2026-11-01)
Never freeze the video for the censor beep. The beep sits in the natural pause before the name and ends on it (`name − 570 ms`), while the video keeps playing.

## Motion graphics layer (v3, from 3 editor showcase Shorts)
**Sources:** DLND-0I2FmM (Elon studio card), OwuTc_mzyo8 (Gary Vee poster), MoVlt-ptxIk (Mark Suy newspaper).

YouTube blocks downloads from this box, so these were studied from thumbnails only (oardefault + maxres1–3). Ask the user to drop the files on Drive for full audio/motion timing.

| ref | look | our component (`src/jorho/mg.tsx`) | used for |
|---|---|---|---|
| Elon | light grey studio, faint skyline, **B&W cut-out**, big grey Montserrat title + small subtitle, **lime orbit ring with nodes** (back half behind the subject, front half in front) | `StudioCard` | hook card for the first ~2 s; the strobe cuts into the footage |
| Elon logos | centre mark, thin grey ring, items around it | `OrbitDiagram` (B&W avatars, lime or red ring; `bar` = red censor bar over the eyes) | turning a silence or a list into a picture (GOAT candidates) |
| Gary Vee | dark grid, heavy Anton two-tone title (white / `#FF4A1C`), white and orange chips, **pixel hand cursor** | `Poster`, `Chips` (can collapse into a big stat), `Cursor` | question hooks, lists, stats |
| Gary Vee | red bar over the eyes | `OrbitDiagram` node `bar` | "not him" (LeBron) |
| Mark Suy | red hand-drawn circle / underline on the key word | `HandCircle` (around the caption, drawn in 300 ms) | the punchline word |

**SFX (myinstants):**
- `jorho-click` = mouse-click-by-ek6, for the cursor and for chips/nodes popping;
- `jorho-pen` = pen-drawing-line, for the hand circle;
- `jorho-whoosh` = transition-whoosh, under the hook card.

**Rules:**
- One MG idea per beat, tied to what is said.
- Graphics stay inside the video box. Captions stay on top.
- The hook card/poster ends with the white strobe cut.
- Length 15–30 s, aim ~20 s, and the story must be complete.

**Clips:**
- `JorhoGoat`: StudioCard → orbit of GOATs with LeBron barred → Dellavedova.
- `JorhoLefty`: StudioCard → ROLL RIGHT / GO LEFT play diagram.
- `JorhoPlaybook`: Poster "HOW BIG IS AN NFL PLAYBOOK?" → chips → 8–10 stat.

## v4 (user, 2026-11-01): "more motion graphics, the intro sucks (copied the Elon card), don't be repetitive"
- **No more StudioCard intro.** The intro keeps the REAL footage playing from frame 1, inside a themed card on a themed background (`cardTransform`). It snaps to full frame on the first strobe.
- **One theme per video, never repeated back to back** (`src/jorho/mg2.tsx`):
  - **paper** (Mark Suy):
    - newspaper texture, photo-print card with a white border and tilt;
    - Playfair headlines, "EXCLUSIVE"/"GOAT?!" stamps;
    - clippings crossed out with a red marker X, a Courier "thinking… 3.5s" timer.
  - **grid** (Gary Vee):
    - dark grid, rounded glass card with 3D tilt;
    - Anton two-tone titles, stat meters (ACCURACY/VELOCITY);
    - career timeline, play diagram, titles struck out with a red bar, pixel cursor.
  - **clean** (Elon):
    - light grey, lime corner brackets, typed question;
    - big counters, a ring diagram with corner labels, a tile grid where the cursor picks this week's plays.
- **Motion graphics on almost every beat:** a long silence or a list becomes a full-box diagram (the audio keeps playing and captions stay on top).
- Layout checks:
  - keep diagram labels on one line and clear of the caption line (box y ≈ 740);
  - stamps and overlays need an end time so they don't pile up.

## v5 "active" (user, 2026-11-01): "a lot of animations… always something happening that keeps viewers watching"
**References (YouTube Shorts, studied from thumbnails):**
- **Pavel Durov edit `qKJpQyj0D3c` (the main one):**
  - kinetic mixed-type words behind/around the speaker;
  - a full-screen 3D phone mockup carrying the stat;
  - a cream quote card with a B&W portrait and huge mixed serif type.
- **UbdleuYhvac:**
  - glowing 3D icon orbs;
  - two-size gradient captions;
  - B-roll with type over it.
- **z63j_EgCAf4:** italic serif + bold glow words.
- **HQ6Oag6iYjI:** neumorphic logo network.

**Kit:** `src/jorho/mg3.tsx`
- `Kinetic`: per-word slam/slide, mixed Playfair italic + Anton.
- `QuoteCard`: cream card, B&W cut-out, mixed serif lines, Allura signature that writes itself.
- `SigCard`: trading card whose signature writes itself; a light sweep crosses it.
- `Magnifier`, `AntWalk`, `Letters`: giant letters slam in, then shrink to "THIS BIG" with a bracket.
- `Orb`: 3D icon orb with a spinning dashed ring.
- `GlowTitle`: small sans line + gradient italic serif.
- `Silhouette`: black "?" cut-out that reveals into the person.
- `PhoneCall`: iPhone incoming-call mockup with buzz and pulse.
- `Dust`: always-on drifting particles.

**Runner additions (`clips.tsx`):**
- `mattes` + `behind`: words behind a person, using `scripts/person_matte.py` frames in `public/matte/jorho/…`;
- `push`: a slow push-in that restarts on every cut;
- `capsOff`: hide captions while a card already shows the words;
- `wideXAt`: per-time framing.

**Lessons:**
- **Text-behind-person only works when nothing is in front of them.** The host's camera arm got matted too and hid the words. Use it on clean shots (Trevor) and put words in front on empty wall space elsewhere.
- **Write-on reveals must finish before the video ends.** Start the signature early enough.
- **Pacing rule:** a new element lands about every 1 s. Every pop/slam gets a myinstants sound:
  - `jorho-pop` for pops;
  - `jorho-pen` for signatures;
  - `jorho-ring` for the phone (iPhone marimba);
  - `jorho-snap` for cards (iPhone screenshot).

**Clip:** `JorhoPen` (t1, 22.6 s)
1. NO RESPECT kinetic opener.
2. Richardson quote card.
3. Tiny "AR" auto + magnifier + ants.
4. A / R letters shrink to THIS BIG.
5. Fan of Trevor cards signing themselves + "same every time" orb.
6. "goated pen" glow title + goat/pen orbs.
7. WHO? behind Trevor + Peyton silhouette.
8. PEYTON MANNING behind Trevor.
9. Phone call.
10. "It's a big deal to have a nice signature" quote card.

## v6 REAL 3D (user, 2026-11-01): "refs suck… I want FUN, modern, 3D animations, not 2D pictures. Animations are KEY. Colors fit the theme."
**Rejected (v5):** 2D quote cards/phone mockups like low-view podcast pages. Don't go back to them.

**Visual refs (TikTok, downloadable with plain yt-dlp):**
- keanu.visuals "Let Him Cook" (7503556689593896214): huge 3D extruded words standing in the scene, perspective, motion blur, masked behind people.
- stefanolio_ (7434637647307459895): glossy 3D objects floating around the person.

**SFX refs (the user's):** kienobimedia 7678711626492562718 and editstartofficial 7695651392354061582. Every named sound was matched on myinstants by mel correlation and installed as `public/sfx/meme-*.mp3` (loudnorm −14 LUFS):

| sound | file | match |
|---|---|---|
| Fahh | `meme-fahh` | fahhh-pump-sound |
| Camera Shutter | `meme-shutter` | camera-shutterrrr |
| Dun Dun Dun | `meme-dundun` | dun_dun_1 |
| Orchestral Hit | `meme-orch` | roland-orchestra-hit (.86) |
| Bonk | `meme-bonk` | bonk_7zPAD7C |
| Sad Trombone | `meme-trombone` | sad_trombone gaming |
| Tada | `meme-tada` | ta-da_yrvBrlS (.97) |
| Impact | `meme-impact` | love-impact (.86) |
| Violin Screech | `meme-violin` | violin-screech (.97) |
| Camera Flash | `meme-flash` | flash-camera (.90) |
| Radio Beep | `meme-radio` | police-beep |
| Build Up | `meme-build` | cut from the editstart free-SFX post |
| Build Up 2 | `meme-build2` | transition-brrr (.89) |
| Jet Set | `meme-jet` | jet-set-radio-spray (.99) |
| LWK IDK 😳✌️ | `meme-lwk` | cut from the editstart post |

**Usage (one per beat, matched to the meaning):**
- jet spray on words flying in;
- dun-dun-dun on a dramatic line;
- fahh on a sarcastic "no disrespect";
- lwk idk on an awkward "I haven't";
- orchestra hit on the reveal;
- impact on slams;
- sad trombone on "this big";
- violin screech on the roast;
- tada on the payoff;
- bonk on a dumb-funny word;
- build up before a name;
- radio beep on a phone.

**3D tech** (`src/jorho3d/`):
- @remotion/three + @react-three/fiber 8 + drei 9 + three 0.169.
- Renders/stills MUST pass `--gl=swangle`. Other GL modes fail in this box.
- The Anton TTF is converted to a three.js typeface by `.work/f3d/conv.cjs` (opentype.js) → `src/jorho3d/fonts/anton.json`.
- `three.tsx`:
  - `Word3D`: extruded, bevelled, face and side colours;
  - `Card3D`: slab plus holo `meshPhysicalMaterial`, signature drawn live on a CanvasTexture;
  - `Pen3D` (gold), `Ant3D` (googly eyes, walk cycle), `Phone3D`, `Football3D`;
  - `Env`: RoomEnvironment PMREM for reflections, no network HDR;
  - `Rig`: shake on slams;
  - `sp`/`ez`: spring/ease on the output clock.
- Textures load on the DOM side with `useImage` + delayRender and are passed in as elements. Loading inside the canvas hung.
- Front canvas goes in the `box` slot; the behind canvas goes in Cam's `behind` slot (between the footage and the person matte) for 3D words behind someone.
- `Dim`: a dark teal vignette under the 3D so it reads over the footage.

**Colours:** Jaguars teal `#00A3AD` / `#004a56`, gold `#D7A22A`, white. Red only for the roast ("NO RESPECT"). Team colours for other people (Colts navy card, Broncos orange PEYTON). No random neon.

**Clip:** `JorhoPen3D` (t1, 22.6 s).

**Music rule for the 3D style (user, 2026-11-01):** keep the background music LOW but audible, about level 0.12 (roughly 15 dB under the voice). The SFX carry the energy.

**Speaker focus + plain words (user, 2026-11-01):** "focus on the person who's actually talking… don't use words most average people aren't familiar of." Shots follow the real speaker (voice diarize + mouth check + frame strip). On-screen words stay everyday (autograph not auto, "SOME" not "HOBBY", "WHY THE WAIT?" not "redeem").

**3D clips batch 2 (2026-11-01), all music level 0.12, same frame/captions, each a different 3D world:**
- `JorhoGoat3D` (input.mp4, 17.8 s, joyful-chess): spinning "?" + orbiting basketball hook → NBA / GOAT? slam → G-O-A-T letters bounce in → LeBron/Kobe/Curry card carousel speeds up while Trevor thinks (thinking dots) → Dellavedova card slams in with confetti, shrinks to the corner on the laugh → the other GOAT cards fall → shaking red TENSION.
- `JorhoRedeem3D` (u3, ~21.5 s, du-bist-full): $20,000 price tag swinging on a string with coins → squash-flips to $200? → $500, red arrow crash → WHY THE WAIT? + clock → clock + NEW box + NOT READY YET → NOBODY LIKES IT + X → chart bars rise + green arrow → MOST EXPENSIVE SALE EVER + confetti.
- `JorhoJosh3D` (t5, ~16.9 s, joyful-chess): face-down gold card swaying with sparkles (GOLD?! / TEAL??) → flips to Bills Josh Allen + flying football + JOSH ALLEN?! → flames on "fire" → ROOKIE CARD → X + NOT THAT ONE → flips to gold Josh Hines-Allen + THE OTHER JOSH ALLEN + confetti → JOSH [HINES-] ALLEN name build.

**New 3D kit parts (`three.tsx`):** Basketball3D, Coin3D, Tag3D (price tag), Arrow3D, Clock3D, Flames3D, Confetti3D, Bars3D, XMark3D, Sparkles3D. Card textures in `public/img/j3d/` (PIL-composed).

**Lessons from stills:** a flipped tag mirrors its text, so use a squash flip (scale x = |cos|) instead of a rotation; a card spinning face-down shows its face early, so sway it instead; big cards over faces must shrink to a corner once the line is done; keep 3D titles off the top meme line (y ≤ 2.6 world units). **Never put a 3D card or word over the talker's face**: in a wide shot, put all 3D in the half where nobody is talking (Josh 3D: talker left, card + words right) and check stills for it. Payoff words must show up on the first word of the line ("MOST"), not the last one, so they stay on screen before the video ends.

## v7 HYBRID podcast motion graphics (user, 2026-11-01): "every element does not have to be 3D … make sure it also looks like a podcast motion graphics style." Also: keep usage lean (≈1 weekly usage for 3 videos).
- **Mix:** mostly 2D podcast MG (`src/jorho/pod7.tsx`) + 1–2 3D hero props per clip (`src/jorho3d/pod7_3d.tsx`). Same Jorho frame, captions, meme SFX, music level 0.12.
- **2D kit:** `Pill` (name/label pill, white border, optional emoji icon), `Big` (Anton keyword slam, thick outline, optional boxed stamp), `Emoji` (iOS pop + bob), `Sticker` (white-outlined cut-out + name pill), `Arrow7` (hand-drawn arrow draws on), `Rain` (emoji rain), `Neck` (neck-stretch gag on an ESPN headshot), `Ruler`, `Band` (dark gradient so graphics read).
- **Layout:** pills/explainers at the bottom (y≈950, under the captions); keywords at the top (y≈120–150); emoji/stickers on the sides. Never over the talker's face.
- **3D canvases are only mounted during their hero beats** → renders are much faster (good for usage).
- **Plain-word explainer pills** for slang: "CELLY = CELEBRATION", "PSA 10 = PERFECT GRADE".
- **Lean workflow:** pick clips → face-crop strip to confirm who talks (diarize can be unsure) → write specs → ONE stills grid per clip → fix → render once.
- Clips: `JorhoGift7` (t4, Blue), `JorhoCelly7` (u2, joyful chess), `JorhoNeck7` (t6, du bist; source fades to black at 16.8 s, so end by 16.7).

## v8 "mostly animation" (user, 2026-11-01): "Try 80-90% be motion graphics/animation, something that visually shows what they are talking about and just the voice speaking (should sometimes show him tho). You should download models from the internet. Try minimizing creating your own … keep the black bars caption stuff … this is still jorho style … the start has a great hook."
- **Same Jorho frame** (black bars, top meme line + 💀, one-word captions, strobes/tints/swish, meme SFX, music ≈0.12).
- **Inside the box:** a 3D world plays most of the time and the speech keeps running under it. Real footage shows only on a few lines (Trevor's "loved throwing on the move", "I just hated that", and the host's "best QB I've ever seen"), about 80 % animation.
- **Downloaded assets** (`scripts/fetch_assets_v8.sh`, kept out of git):
  - Poly Haven CC0: `orlando_stadium` and `suburban_football_field` panoramas, used as a ground-projected `GroundedSkybox` so the characters stand on a real field; `american_football` and `standing_chalkboard_01` gltf models.
  - three.js example models: Xbot (run/agree, recoloured Jaguars teal, a "kid" version in light teal + gold), Soldier (Run, used for the crowd), RobotExpressive (the coach: Wave/Yes/Dance).
- **Tech:**
  - Load GLTFs and panoramas on the DOM side with delayRender and cache them.
  - Use `SkeletonUtils.clone` for each instance, and an `AnimationMixer.setTime(frameMs)` so the animation is driven by the frame.
  - Measure height from the bones: fresh skinned clones have bad bounds, and the first try rendered characters tiny or giant.
  - Set the camera far plane to 600, otherwise the sky gets clipped into a black wedge.
- **Hook** = the payoff line as a cold open ("I throw it a little better moving LEFT than right"): #16 sprinting left in a pro stadium, a spiral thrown with a trail, green LEFT arrow, red RIGHT with an X.
- **Story beats:** LIL TREVOR on a youth field → robot coach draws a rollout to the RIGHT on a chalkboard → EVERYONE GOES RIGHT crowd → little #16 runs LEFT through the crowd with a LEFT REPS counter → grows up into the stadium (10,000 reps) → coach robot dances to "BEST QB EVER?!".
- **Memory (render OOM on first try):** load the 8k panoramas without mipmaps, light the scene with 1k copies (PMREM), and render with `--concurrency=2`.

## v9 FLAT motion design (user, 2026-11-01): "I don't want realistic bro. I want motion graphics style animation and simplistic anims. Something like this https://vt.tiktok.com/ZSgwjsfpN/"
- **Rejected:** v8's realistic 3D (photoreal stadium panoramas, mannequin and soldier characters). Don't go realistic again.
- **Ref** (juneedit3d "neumorphism concept" ad, an After Effects screen recording):
  - soft off-white UI with dual soft shadows (neumorphism) and ONE accent colour;
  - transitions: circle pop, circle colour wipes, diagonal line sweeps;
  - typewriter text with a blinking caret, letters that drop and bounce in;
  - pill labels ("Introducing"), toggles, search bars, UI cards with progress rings and charts, dashed rings with icon nodes orbiting;
  - smooth eased motion, simple shapes.
- **Ours** (`src/jorho/flat9.tsx`, comp `JorhoLefty9`):
  - bg `#E9EEF3`, accent Jaguars teal `#00A3AD`, red `#E3504F` only for "right/wrong", grey people; Inter 800;
  - primitives: `Wipe`, `Sweep`, `Typer`, `Letters`, `Pill`, `Ring`, `Card` (neumorphic, inset variant), `Person` (flat circle-head figure, optional #16), `Ball` (flat football), `Arrow` (draws on, dashed via a mask).
- **Beats:** ball pop → flies LEFT on a dashed arc → LEFT|RIGHT toggle snaps LEFT, RIGHT struck through, bars LEFT > RIGHT → teal wipe "back when I was a kid" + lil #16 → Coach's playbook card, red rollout arrow RIGHT → EVERYONE GOES RIGHT row of grey people → #16 runs LEFT against the crowd, LEFT REPS card + ring, bouncing LEFT, search bar typing "QB who can only roll right" ✕ → teal wipe, LEFT core with orbiting emoji nodes + ring fill, 10,000 REPS → crown pop + BEST QB EVER? + dot confetti.
- Jorho captions (5 px black stroke) read fine on the light background. Pure 2D renders fast (no swangle-heavy 3D) — good for usage.

## v10 natural openings + evidence-based hooks (user, 2026-11-01)
User asked for: hooks based on attention/curiosity research (no clickbait); open on footage that sets the context before any MG; a viewer simulation before render; ElevenLabs VO only if it really helps; a post-render report.
- **Open on the real question being asked, on a two-shot** (the asker + Trevor in frame). Viewers see who is talking and what is being asked within 1–2 s. The MG starts only after the context lands (`stories10.tsx`).
- **Make the open question visible:**
  - golf: an empty 4-slot "dream foursome" scorecard that fills as he answers;
  - playbook: the top line states the exact number the clip answers at the end (8–10).
  - This is the information-gap idea (Loewenstein 1994): a specific, answerable gap holds attention.
- **Answer late but not too late:** the payoff lands in the last third. Give a partial payoff early (golf: "Jesus" at ~6 s) so the gap doesn't feel like bait.
- **No VO** on these two: the host's real question already gives context plus the gap, and VO would push the footage back.
- **Viewer pass caught:** single-person question shots hid Trevor, so the openings became two-shots; overlapping end graphics were moved apart.
- Clips: `JorhoPlaybook10` (u1), `JorhoGolf10` (t2).

## v11 animated 2D drawings (user, 2026-11-01): "try adding 2d animations that actually shows 2d drawings and animated, make it match the style"
- **Source:** unDraw (free, cdn.undraw.co/illustrations/<name>.svg, search at undraw.co/search/<term>). LottieFiles search is rendered by JavaScript, so it can't be scraped.
- **Pipeline:** download the SVG to `public/undraw/`, then a python snippet flattens it to `src/jorho/undraw/<name>.json` (tag + attrs, camelCase, `#6c63ff` → teal `#00A3AD`).
- **`Drawing` component** (`src/jorho/drawn11.tsx`):
  - every shape pops from its own centre with a stagger, so the drawing builds itself;
  - then it floats;
  - `clip` strips let parts of one drawing bounce separately (three fans jumping in turn);
  - `hide` drops shapes, e.g. the phone's grey tiles, replaced by a live scrolling feed with a real post thumbnail.
- **GOTCHA:** a CSS transform overrides the SVG `transform` attribute, so put the attribute on a wrapping `<g>`. Otherwise pieces jump out of place (the phone feed was misaligned).
- **Clip** `JorhoTT11` (t3 Traveling Trevors, 20 s):
  - Opens on a two-shot with who's-who labels ("TRAVELING TREVOR" / "THE REAL TREVOR").
  - Drawings follow the story: phone and likes "I follow you guys" → drawn phone with the Traveling Trevors post "in his algorithm" → big "?" "didn't know what to think" → real Trevor "these guys are whacked" → play-button drawing "second one" → jumping guy PRETTY FUNNY → fans in teal jerseys jumping MORE JAX FANS → couch fans with confetti PUMPED UP AT THE GAMES.

## v12 stickmen + images (user, 2026-11-01): "No this time make your own just a simplistic stickman then some images"
- `src/jorho/stick12.tsx`:
  - `Stick` is a hand-made SVG stickman: round 10 px strokes, posable shoulder/elbow/hip angles (`Pose`, blended with `mix`), white head with dot eyes;
  - `hat`: 'cap' for Trevor, 'wig' (yellow hair + teal headband) for the Traveling Trevor hosts;
  - extras: `sweat` drops, `fall` (tips over);
  - `Photo` is a real player photo in a white ring with a name tag; `Bubble` is a speech or thought bubble.
- **Poses:** IDLE, ASK, SCRATCH (head scratch), THINK (hand on chin), POINT, SHOCK.
- **Clip** `JorhoGoat12` (input.mp4, 17.8 s), opening on the real two-shot:
  - host stick asks with a typed bubble;
  - Trevor stick scratches his head while LeBron/Kobe/Curry photos pop in his thought bubble over an empty #1 podium;
  - during the long think the photos spin like a slot reel, with an hourglass;
  - "Dellavedova": the reel locks on Della, he goes on the gold #1 podium with a crown, Trevor points, the host stick falls over;
  - real laugh;
  - TENSION: both sticks sweating, red zigzag.

## v13 five style candidates for the NBA GOAT clip (user, 2026-11-01): "create 5 NBA goat clips just like that but with a different style and approach. I'll pick which ones the best and it will be the new jorho editing style"
All five use the same beats as v12 and the same real-footage moments (the two-shot ask, Trevor's "NBA goat?", the start of his think, the laugh), the Jorho frame and the captions (`src/jorho/styles13.tsx`):
1. `JorhoGoatWhiteboard`: grid paper, blue-marker stickmen with a hand-drawn line "boil" (jitter every 110 ms), photos taped on, red marker circle, "HIS GOAT?!".
2. `JorhoGoatChalk`: green chalkboard in a wood frame, chalk stickmen (glow), X/O doodles, magnet-pinned photos, yellow chalk circle, "THE PICK: DELLA".
3. `JorhoGoatComic`: yellow halftone, thick-bordered panels, oval speech balloons (Bangers), photo panels, star-burst KA-BOOM, speed lines on TENSION.
4. `JorhoGoatArcade`: night sky with pixel stars, VT323 font, RPG dialogue box, PLAYER SELECT grid with a blinking cursor speeding up through the think, a "TIME" countdown, P1 SELECTS DELLA, health bars for TENSION, pixel sprites.
5. `JorhoGoatChat`: iMessage thread with a "Trevor" header; "Trevor is typing… (Ns)" runs through the long pause; then the blue bubble with Della's photo and a 😂 reaction; "I could feel the tension 😬".
**Waiting for the user's pick → that becomes the new Jorho style.**

## v14 Pinterest "sports poster" (user, 2026-11-01): rejected all 5 v13 styles; "find motion graphics stuff on Pinterest and copy them. Ask me questions."
- **Pinterest access:** plain curl gets JavaScript-only HTML. Use Playwright (`.work/pin/shot.cjs`) to load `pinterest.com/search/pins/?q=…`. A login modal appears, but the pin `<img>` srcs (i.pinimg.com 236x → 474x) are readable and downloadable.
- **Searches used:** "motion graphics podcast edit", "2d motion graphics animation", "sports motion design".
- **User answers:** keep the Jorho frame; half real footage, half graphics; colours black/white + 1 accent; look: no preference (I chose sports poster).
- **Look** (`src/jorho/poster14.tsx`, comp `JorhoGoat14`), copied from the sports-motion-design pins:
  - giant Anton type stacked and repeated in rows that slide in alternate directions, outline rows mixed with filled rows;
  - B&W player cut-outs with a hard accent offset shadow;
  - caution-tape bands with a repeating label;
  - grain plus halftone;
  - three vertical candidate panels wiping up;
  - a round photo window cycling candidates with a seconds counter;
  - accent `#ff4d2e`; real footage graded B&W too (new `Spec.grade`); captions white with accent keywords.
- **Beats:** WHO / IS YOUR / NBA / GOAT? slam stack → LEBRON/KOBE/CURRY panels "OR…?" → THINKING rows + cycling photo + live seconds counter → GOTTA BE → white flash, giant DELLA, cut-out, #1, name tape → real laugh → TENSION rows + tapes + Trevor cut-out.

## v15 three more Pinterest looks on the NBA GOAT clip (`src/jorho/refs15.tsx`)
- `JorhoGoatPremium`: dark warm gradient, glowing gold Instrument Serif italics, rounded photo cards in perspective, gold progress ring through the think, "the GOAT." glow reveal.
- `JorhoGoatCollage`: solid orange/yellow/blue, torn-paper strips, tape, white-outlined sticker cut-outs, mixed fonts (Anton/Bangers/Permanent Marker), sunburst behind Della, "THE GOAT ★".
- `JorhoGoatNeon`: black with a cyan grid, typed QUERY, "GOAT RATING" bars, live seconds counter, a glowing chart spiking to 100 for Della, red heartbeat TENSION.

## v16 pixel people (user, 2026-11-02): "2d pixel animations (people)"; answers: chunky 8-bit, podcast table → dream court mix, mostly pixel, Game Boy green
- `src/jorho/pixel16.tsx`, comp `JorhoGoatPixel`. Everything is drawn in 4 greys and mapped to the Game Boy greens by one SVG filter (`#gb`: desaturate, then a discrete transfer table), with an LCD dot grid on top.
- **Sprites:** rows of chars (D/M/L/W); bodies have stand/runA/runB/jump frames on a 2-frame clock; drawn heads (Trevor cap, host wig). Real player photos are drawn at 8×8 px and scaled ×12 with `image-rendering: pixelated`, so they become 8-bit portraits.
- **Scenes:**
  - pixel podcast table: the host's speech box types "WHO'S YOUR NBA GOAT?", Trevor answers "NBA GOAT?", and a thought box shows the LBJ/KOBE/CURRY portraits;
  - dream court: the three dribble with "?" over them, the crowd bobs, and a "THINKING 2.6s" timer runs;
  - Della runs in and dunks: "DELLA!!", "★ NEW GOAT ★";
  - real laugh;
  - back at the table for TENSION: both sweating, the screen shakes, the text blinks.
- Real footage only for the opening two-shot and the laugh.

## v17 "side quest" (user ref 2026-11-02, vt.tiktok.com/ZSgEuSfBD, claude.stuff: a dot character with squash & stretch on a paper world that draws itself → pink clouds → starry night with constellation → comet fall → brush lettering)
- `src/jorho/journey17.tsx`, comp `JorhoGoatJourney`. Own hero: a basketball with eyes (squash/stretch from the `hop()` physics, mood wow/worry, sweat). Paper texture: feTurbulence multiply plus a warm vignette. Brush text: Allura, revealed left→right.
- **Beats:**
  - ball drops and bounces in, "who's the GOAT?" writes itself;
  - hills and sky draw themselves, the ball hops pedestal to pedestal past LeBron?/Kobe?/Curry?;
  - camera rises through pink clouds into the night, candidates become glowing star portraits on a constellation, "hmm…";
  - comet fall, confetti, Della portrait, "Dellavedova" writes in ink;
  - "the tension…" in red ink, trembling, sweating ball.

## v18 the animate skill (user, 2026-11-02: "Try using this skill https://github.com/cth9191/animate")
- **Skill:** procedural single-file canvas animation with styles (cut paper, crosshatch, riso, sketchbook, math, pixel, isometric). Its flow: intake questions → style gallery → storyboard approval → build → export. Clone it to the scratchpad (not the repo); its tools live in `plugins/animate/skills/animate/tools/`.
- **User picks:** crosshatch ink, a basketball hero (original: the style's ink dot with seams), inside the Jorho box, podcast audio + our SFX (no synthesized score).
- **Piece:** `pieces/goat-ink/` (piece.json 1080×1080 @ 30 fps, 17.8 s = the clip's output timeline; head.html cues = `N.*` in seconds).
  - Build: `node <skill>/tools/build.mjs pieces/goat-ink`.
  - Board: `node <skill>/tools/still.mjs pieces/goat-ink 4,7,10.5,13.6,17.3 board.png --scale 0.5`.
  - Export: `node <skill>/tools/export.mjs pieces/goat-ink --no-audio`. Its score render crashes with the demo `score.js`, and we use the podcast audio anyway. Copy the result to `public/animate/goat_ink.mp4` (gitignored).
- **Jorho:** `JorhoGoatInk` shows the exported MP4 in the box on the graphics beats (`beatOf`).
- **Fonts:** the style's handwriting fonts aren't on this Linux box. Install Caveat: `pip install fonttools brotli`, convert `public/fonts/caveat-700-normal.woff2` to `~/.fonts/Caveat-Bold.ttf`, run `fc-cache -f`, and add "Caveat" first in the piece's `HAND` list.

## v19 evidence-based hook pass, ORIGINAL Jorho style (user, 2026-11-02): full brief (hook research, 3 hook alternatives, viewer simulation, QC, final report)
- `JorhoGoat19` (13.7 s):
  - **Opening:** the real question on a two-shot (asker + Trevor) at 0.1 s, with the "Bring it up, but I want to ask you the question before" lead-in cut; small "TREVOR LAWRENCE · NFL QB" label.
  - **Think:** trimmed 5.4 → 3.6 s, with the Jeopardy think cue, "THE USUAL ANSWERS…" LeBron/Kobe/Curry cutouts, an honest "⏱ Xs of silence" counter (real elapsed pause) and captions off.
  - **Payoff:** music to silence just before the answer, strobe + green tint + orchestra hit on "Matthew Dellavedova", his cutout, and a verified stat label "CAREER 5.2 PPG" so non-fans get the joke. Then the real laugh (wide), then "I could feel the tension" (right host) with a red tint and violin.
- **New runner option** `Spec.musicLevel(o)`: per-moment music level (bed under the question, 0 during the think cue, silence before the answer).
- **QC:** normalise the final to −14 LUFS (the render came out at −9.6 LUFS).
- **Facts checked:** Dellavedova career 5.2 PPG over 479 games, 2016 champion with Cleveland (landofbasketball.com, ESPN).
- **Under 15 s on purpose:** the clip has no more relevant footage, and padding would add dead time.

## v20 vertical-video-editing skill (user, 2026-11-03: github.com/nopefallacy/vertical-video-editing-skills + "try with elevenlabs, be creative")
- **Skill:** a HyperFrames (HTML→MP4, `npx hyperframes@0.9.6`) editing standard. Its "editorial look" uses ten patterns: a mixed serif/sans headline, a paper stage, a dark-grid interstitial, a stacked split (graphics top / talking head bottom) with seam captions, highlight-bar supers, name pills, a headline card, a UI-card stack, a glow word (once), seam captions. Its vibe-life tokens: cream `#f3ecd9`, ink `#161513`, peach `#e88c5a`, butter `#f0c860`; Space Grotesk + Instrument Serif italic.
- **Project:** `hf/goat/edit/` (init → check → snapshot → render).
  - `assets/clip.mp4` = input.mp4 2.15–18.81 s.
  - `assets/master.m4a` = ONE pre-mixed track (speech + du bist bed, 0 in the silence, back on the answer + Jeopardy cue + SFX, loudnorm −14).
  - The camera is a `#cam` wrapper with face-safe `x/y/scale` per speaker (L −52/712/1.6, M −996/728/1.6, R full −2291/−76/1.9). The bottom panel grows via `clip-path` on the laugh.
  - Render: `npx hyperframes render -o out/...`. Gate: `node <skill>/scripts/verify-render.mjs <mp4> --duration 16.66` PASS.
- **ElevenLabs:** the MCP connector was disconnected this session and there's no API key in the env, so no voiceover. The design has no VO slot needed; reconnect the connector to add one.
- **Watch out:** a source clip that ends before the root duration renders BLACK frames. Keep the root ≤ the media length.

## v21 — premium gold + engagement (from the 13k analytics)
- 13k premium gold retention: steep drop 0-2s (filler "bring it up" line + blurred intro frame = no hook), gentle 2-9s, flat 9-14s (think → reveal holds), drop 14-18s after payoff.
- Fixes: cut filler (start at the question), `noIntro` spec flag = sharp frame 0 with gold question on screen, comment prompt + LeBron-vs-Della vote over the laugh, like + follow line under the tension caption, loop kept.
- Video B: ElevenLabs VO cold open (Alex, eleven_v4, tightened to 4.4 s) over a gold card (Trevor photo + "his NBA goat?" visible at frame 0 → "the room went silent…"), then the same engaged take. CTA VO skipped (free tier busy); on-screen prompts carry the CTA. Keep segments ≥ 1 frame (a 10 ms seg crashed SpeechTrack).

## v22 — IShowSpeed "W Speed edit be like" format on NBA GOAT (after v21 flopped)
- v21 results: A 55.4% stayed (vs 13k's 71.9%), B (AI VO intro) 28% stayed. **AI voice cold open = instant swipe. Don't open on a card/narrator; open on real footage.** Sample is small (~570 views), so treat A's drop as weak evidence.
- v22: real footage from frame 0, typed `*TREVOR THINKS*` action lines (keyboard SFX, colour per line), punchy grade + vignette, freeze slam after "Dellavedova, man": green flash, zoom-blur, gray, 🐐 on chest, `*REAL BALL KNOWLEDGE*`, sparkles; Blue (Yung Kai) "I'd" on the slam. Components in `src/jorho/speed22.tsx`.

## v23 — 3D explainer (Zack D. Films-type) NBA GOAT (`src/zack/`)
- User: "Create a Zack D films type for the NBA goat. Must not make it look like from Claude. Do not add any Claude logos or Claude model." → no branding/watermark anywhere; strip file metadata on export.
- Real podcast audio (no AI VO: v21B's AI intro got 28% stayed). Every shot rebuilt in 3D, full 9:16, no black bars/top caption:
  studio table (3 people) → host CU → gold trophy ("of all time") → thinking CU + clock ticks → dive into his head (player cards spinning faster) → "gotta be" low-angle CU → Dellavedova hero on a court + fact labels (5.2 PPG career) → laugh wide → tension push-in with red light.
- Captions: one word, white, thick black outline, centre (y≈1110), key words yellow.
- Avatar: three.js example `readyplayer.me.glb` (`scripts/fetch_assets_v23.sh`), posed bone-by-bone in character-frame degrees (`rig.tsx`, `poses.ts`); mouths from the real audio envelope (`speech_env.json`). Recoloured outfits + simple hair/cap/headband meshes on the head bone.
- Gotchas: mount `ThreeCanvas` only after assets load (else blank frame); parent extra meshes to bones (world-space copies land on the wrong person); add them in `useMemo`, not `useEffect` (stills render before effects).

## v24 — v19 remake from its own analytics + mirrored (`JorhoGoat24`, 16.0 s)
- v19 result: 9.7K views, avg 0:28 = 180% (rewatches drive it). Graph: steepest loss 0–2 s, gentle 2–9 s, flat 9–13 s (answer), small dip 13–15 s (laugh), end drop.
- Kept everything that worked: real question first, Jeopardy think, "usual answers" cutouts, silence timer, silent beat before the answer, stat label, loop.
- Changed: sharp frame 0 (`noIntro`), curiosity-gap top line, 0.5 s comedic hold after "Dellavedova, man." with the 5.2 PPG stat (+ dun-dun), a second reveal during the laugh ("…but he does have a 2016 ring 💍", true), new `mirror` spec flag (footage only, overlays unflipped), new music (interstellar-piano, swell at 232.2 s on the answer), gold/green/red palette, mg-boom payoff, heartbeat on tension.
- Mirror gotcha: text in the footage reads backwards (sign, shirt). Cutouts must not cover the centred speaker (della cutout right side, x 640).
- **v24 result (111 min):** 58% stayed-to-watch. The two versions with `noIntro` (v21A 55.4%, v24 58%) both trail the ones with the Jorho box-opening intro (13k premium 71.9%, v19 big rewatch). Hypothesis: the intro's motion at frame 0 is part of the hook, so the "sharp frame 0" idea was wrong. **Keep the Jorho intro.** Next test: v24 with the intro back (one change only). Early numbers, small sample.
- **v24 flatlined at 1.1k.** Frame-by-frame vs v19 (first 2 s), v24 lost three things v19 had:
  1. the Jorho box-opening intro (motion in the first 0.6 s);
  2. the famous name: v19 label "TREVOR LAWRENCE · NFL QB" became "NFL QB · ASKED HIS NBA GOAT" (no recognition hook). The no-Trevor rule is for the TOP caption only; keep the name label;
  3. a top line with a reaction promise ("broke the whole room") became a vague, news-like one ("debate just got a new answer").
  Also: 6th upload of the same clip (audience fatigue / possible reuse limits), and the mirror makes the sign and shirt read backwards.
  **Fixes:** keep the intro, keep the name label, top line promises a reaction or a bold claim, no mirror, a new clip instead of re-posting goat.

## v25 — redemption clip with the goat19 formula (`JorhoRedeem25`, 19.8 s)
- Jorho intro kept; "TREVOR LAWRENCE · NFL QB" label in second 1; top line = concrete bold claim ("This card went from $20,000 to $500 in 3 seconds").
- Beats: $20,000 → value ticker → $500 (trombone, red) → "why do you have to redeem it" + plain label "REDEEM = MAIL IT IN FOR THE SIGNED CARD" → "do you sign like on time?" + "⏰ PLAYER SIGNS LATE = CARD COMES LATE" → music out, silent beat, "I see." → "people very much dislike that" → "Oh really?" → twist "most expensive sale ever" (orch + cha-ching, green) → cut-off "do you even know your…" loops into "This card…".
- Voices: voice_diarize says the left host is the main explainer. "uh you've done that" (14.4–15.6 s) was not heard by large-v3, so it's cut (no wrong captions). Ambiguous lines use two-shots (W@640 = L+M, W@1140 = M+R).

## v26 — NBA GOAT, goat19 formula + graph-dip fixes (`JorhoGoat26`, 16.1 s)
- Evidence order for this channel: our own analytics first (goat19 9.7K/180%, intro versions 72% STW vs no-intro 55–58%, AI VO 28%), then peer-reviewed attention/curiosity work, then creator blogs (no peer-reviewed swipe-timing study found).
- New pieces: `Reel` (slot-machine card that decelerates 90 → ~650 ms and stops on a yellow "?" before "Gotta be"; quiet mg-click per change), `Burst` (radial speed lines behind the answer cutout, kept off the face), `rev-whoosh.mp3` (reversed fast-whoosh) ending on the answer, orch + 808 layered, 0.5 s hold with the stat, "…BUT HE IS A 2016 NBA CHAMPION 💍" during the laugh.
- Name label x 430 (v19's x 600 was cut off at the right edge).
- QC: −13.2 LUFS, −3.1 dBTP; the think stays quiet (≈−35 dB, like v19) on purpose.

## v27 — "BREAKING NEWS" parody, a new identity (`src/news/NewsGoat.tsx`, comp `NewsGoat`, 16.2 s)
- User (2026-11-04): every video must look different; use Gemini images for absurd/"sussy" gags.
- Identity: fictional channel "BALL KNOWLEDGE NEWS"; LIVE two-box interview (active speaker = red border), red/navy/gold, Oswald + Anton headlines, Courier Prime closed captions (hand-set phrase lines), crawling ticker, lower thirds that change per beat, BREAKING NEWS stinger on a 0.6 s freeze before "Matthew", Della photo card "THE GOAT?", Curb-style credits music on the laugh, news SFX (scan beep, typing, clock ticks, phone buzz, shutter, error alert).
- Gag cards: goat-emoji fans with signs (PiP), coronation (goat on a throne + crown + confetti + flashes), "paparazzi" date (goat + trophy + candles + hearts). Animals/objects only: no real people in fabricated scenes.
- Gemini: the key works on generativelanguage.googleapis.com (not Vertex). Image models listed: gemini-3-pro-image, gemini-3.1-flash-image, gemini-2.5-flash-image. ALL return 429 "free tier limit 0", so billing is needed. Key kept only in the scratchpad (never in git). Swap the emoji gag cards for generated photos once billing is on.

## v28 — Jorho style with varied details + user AI images (`JorhoGoat28`, 16.2 s)
- User correction (2026-11-04): "different edits" means vary the details INSIDE the Jorho style, not a whole new style. Keep intro, black bars, top line, Jorho captions, strobe/tint, cutout, stat label, loop. Vary: hook line, think device, freeze placement, SFX, music, gag.
- This one: freeze BEFORE the name (suspense) instead of after; think = clock ticks + an AI insert "MJ & LEBRON WAITING ON HIS ANSWER…"; laugh = record scratch + phonk drop (montagem-alquimia 4.0 s, cut to `sfx/montagem-drop.mp3`) + "MEANWHILE: LEBRON'S ULTRASOUND" → "IT'S A… DELLAVEDOVA 💀" (gender-reveal joke) → "STEPH TOO?? 😭"; Sneaky Snitch under the question.
- AI images of real people (user-made, `public/img/ai/`, gitignored): only the harmless / obviously impossible ones, each tagged "AI PARODY". Not used: the kiss / near-kiss ones (realistic romantic fakes of real people). Tell the user to tick YouTube's "altered or synthetic content" box.
- Gemini key: free tier has 0 image quota (billing needed).

## v29 — "clipper" style from ref XB-5FxyY4X8 (same redemption moment, another channel) → `src/clipper/Redeem29.tsx`, 19.3 s
- Ref (storyboard only: video download blocked by YouTube's bot check, not bypassed): footage band in the middle on a blurred zoomed copy of itself, persistent black title box (white condensed caps), one small word at a time, plain reframing between speakers, ~28 s with every repeat, ends on "Yeah." + a black frame.
- Kept from the ref: blur-fill layout, title box, one-word captions, plain reframing, no heavy effects.
- Improved: stakes title "HE SAID THIS CARD IS / WORTH $20,000… 💀"; repeats + "if you know" cut; bigger captions with money words yellow; reaction insert on "$500"; plain-words labels (REDEEM = MAIL IT IN…, PLAYER SIGNS LATE = CARD COMES LATE); "…AND THEN THE TWIST 👀" chip at 5 s; twist ending ("most expensive sale ever") that loops instead of a black frame; quiet Monkeys Spinning Monkeys bed; small SFX (cha-ching, trombone, dun-dun).
- Viewer passes: pass 1 swipe at 6–10.8 s (one static host shot, jargon, filler) + 12–15 s (static) → pass 2 cuts "if you know", splits shots on the dialogue (two-shot on "because", Trevor on "do you sign on time?", Trevor's reaction on "dislike") → pass 3 adds the twist chip for the dip after the $500 payoff at ~5 s.
- `makeClip(plan)` makes this layout reusable for other clips.
