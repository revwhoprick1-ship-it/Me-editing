---
tags: [style, podcast, jorho]
date: 2026-10-31
---
# Jorho style

The user asked to copy four reference Shorts "every single detail" and call the style **Jorho**. All four are Backyard Breaks Daily Trevor Lawrence clips from the same wig session as our footage:
- d1vqyQ55k8A: gifted signed natty ticket;
- 5VPfMFvbfyI: NBA goat that's not LeBron;
- 5Uym-crDaD4: elite ball knowledge;
- i6rueNLVGiA: Davis Mills joke.

**How they were studied:** YouTube blocks video and audio downloads from this box (bot check), so the analysis is visual only, from YouTube's frame thumbnails: `i.ytimg.com/vi/<id>/maxres1|2|3.jpg`, `maxresdefault.jpg`, and the vertical `oardefault.jpg`. **The sound design was not heard.** The SFX below are our best guess and should be checked against the real videos.

## Layout (1080x1920)
- **Background:** pure black.
- **Video box:** y = 420 → 1495 (1080x1075, nearly square). The landscape stream is cropped to full height, about a 1085 px slice of the 1920 width, so it shows 2 people. No border, no rounding.
- **Bottom bar:** y 1495–1920, left empty.
- **Top line:**
  - Montserrat ExtraBold/Bold, about 66 px, white, centered, 2–3 lines, bottom-aligned about 40 px above the box (text block about y 240–370);
  - sentence case, internet slang ("be like:", "fr", "meh", "Imagine…");
  - always ends with the **iOS 💀** inline, at text size;
  - no stroke, no shadow.
- **Spoken captions:**
  - **one word at a time**, as spoken (lowercase, names capitalized);
  - Montserrat ExtraBold about 70 px;
  - fill rotates yellow `#FFE81F` / cyan `#3FE6F5` / green `#7DFF3C` / white;
  - thick black outline plus a short hard drop shadow;
  - fixed centre line at **76 % of the box height** (y ≈ 1237), centered horizontally;
  - a quick pop-in (scale 0.82 → 1).
  - Names usually get cyan or yellow (Demitri cyan, Trevor yellow).

## Moves (only three, used sparingly)
1. **Hard punch-in:** a straight cut to a close crop of whoever reacts (Trevor laughing, about 1.6–1.7×), then a cut back to the wide shot. No animated zoom between.
2. **Exposure flash:** on the punchline the frame blows out warm (brightness up, contrast down, saturation and sepia up), then settles over about 0.45 s.
3. **Meme cutout:** a rembg cut-out photo of whoever they're talking about. It pops up from the table edge, large, over the hosts, with an **orange rim glow**, and leaves when the bit ends. The captions stay on top of it. (Ref: Dellavedova in a Cavs jersey for "NBA goat that's not LeBron".)

Light warm grade (contrast 1.08, saturation 1.06). No grain, no vignette, no progress bar, no emoji except the 💀 on top (a cutout-style emoji pop is OK for a literal noun, e.g. 🐜).

## Sound (assumed, see note above)
- Speech up front.
- Quiet background music (`du-bist-full` at about 0.075).
- fast-whoosh on punch-ins.
- camera-shutter on flashes.
- mg-swoosh + click on the cutout pop.
- One small meme sting per clip at most (boowomp, error).
- Never the loud boom.

## Length and hook
About 15–17 s. The hook is the top line (a meme take on the clip), plus the cutout landing in the first 3–4 s.

## Code
- `src/jorho/kit.tsx`:
  - `Frame` (bars + top line + 💀);
  - `wordsFrom` / `OneWord` (one-word captions; cut words are dropped automatically);
  - `exposure()` (flash filter);
  - `Cutout` (pop-up photo with orange rim).
- `src/jorho/clips.tsx`: `JorhoAnt` (t1, Anthony Richardson's auto "looks like an ant") and `JorhoJosh` (t5, "not rookie Josh Allen… the real Josh Hines-Allen").
- Cut-outs are in `public/img/jorho/`, made from Wikipedia lead images with rembg `u2net_human_seg`.
- Punch-ins use the e3 `Cam` with `who` returning a seat inside the punch windows and `'W'` (wide, `wideX`) elsewhere.
- Don't punch in on someone standing (the head gets cropped); stay wide.
