---
tags: [style, captions, font, emoji]
---
# Caption style (copied from Ref A)

Back to [[START HERE]] · Source: [[Reference Shorts]]

## Font
- **Montserrat ExtraBold (800)**, uppercase. File: `public/Montserrat-Black.woff2` (variable Montserrat, latin; loaded locally because headless Chrome in the cloud box can't verify Google Fonts' TLS through the proxy).
- **No black stroke.** Glow instead:
  - white words: `text-shadow: 0 0 10px #fff9, 0 0 24px #fff6, 0 3px 8px #0008`
  - colored words: same, glow tinted with the word's color.

## Colors
| Use | Color |
|---|---|
| Normal words | `#FFFFFF` |
| Setup keyword (names, "NBA") | yellow `#FFE14D` |
| Payoff keyword ("GOAT", the answer) | green `#5CFF5C` |
| Fail / tension | red `#FF4D4D` |
| Hook title | yellow, smaller, top of frame |
| Asterisk action captions (`*SIGHS*`) | white, 85 % size |

1–3 colored words per sentence; never color the whole line.

## Layout & timing
- 2–4 words per chunk, center of the lower half (~y 1130 of 1920).
- Words appear as they're spoken (hidden until spoken, so the line doesn't jump).
- Chunk pops in (scale 0.8 → 1 spring); current word scales up ~6 %.
- **Timing must come from the audio**, not raw whisper output; see [[Edit workflow#2. Transcribe and fix timing]].

## Emoji
- **iOS (Apple) emoji only.** PNGs (160 px) in `public/emoji-ios/<codepoint>.png`, from Emojipedia's Apple set. Add more with:
  `curl -o public/emoji-ios/1f480.png https://em-content.zobj.net/source/apple/391/skull_1f480.png`
  (slug = Emojipedia name + `_` + codepoint).
- Above the caption for nouns (🐐 GOAT, 🏀 NBA), or as stickers that slam in on beats (💀).

## Podcast layout extras (Ref C)
- Top-bar caption: Montserrat 800, 56 px, **sentence case, white, no glow**, iOS emoji after it, bottom edge ~28 px above the video box.
- Video box: `BOX_TOP = 390`, `BOX_H = 1150` in `src/ShortEdit.tsx`; captions at y 900 so they sit above the cut-outs.
- Cut-outs: `public/cutouts/*.png` (made with `rembg`, model isnet-general-use), listed in `CUTOUTS` in `src/edit.ts`. Sources (Wikimedia Commons; credit if required):
  - kobe.png: "Kobe Bryant 2015.jpg", CC BY-SA 2.0
  - lebron.png: "LeBron James Lakers.jpg", CC BY-SA 2.0
  - jordan.png: "Michael Jordan.jpg", CC BY-SA 2.0
  - delly1.png: "Matt Dellavedova Cavs 2014.jpg", CC BY 2.0
  - delly3.png: "Matthew Dellavedova (49166301537) (cropped).jpg", CC BY 2.0
  - Find more: Commons API search, `gsrnamespace=6`, then `rembg`.
