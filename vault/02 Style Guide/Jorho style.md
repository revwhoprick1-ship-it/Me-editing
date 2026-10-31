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
- Our synthesized matches are in `public/sfx/`: `jorho-ting`, `jorho-flash`, `jorho-swish`.

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
