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
