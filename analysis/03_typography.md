# 03 · Typography and caption animation

Font names are **closest matches [G]**. The low-resolution sources can't be identified with certainty. Sizes are measured from frames and converted to a 1080×1920 canvas (≈ ±15%).

## 1. Caption styles found

| | V0 (POV skit) | V1 (dialogue edit) | V2 (narrated story) | V3 (silent skit) |
|---|---|---|---|---|
| **Closest font** | Open Sans / Montserrat **ExtraBold** | Montserrat **ExtraBold**; **Black Italic** on emphasis lines | Montserrat / Poppins **ExtraBold** | Montserrat **Black** / "The Bold Font" style |
| **Case** | ALL CAPS | ALL CAPS, **wide tracking** (~+15%) | ALL CAPS | ALL CAPS |
| **Size (1080 canvas)** | cap height ≈ 50 px (font ≈ 66 px) | cap ≈ 55 px (font ≈ 72 px) | **small**: cap ≈ 40 px (font ≈ 54 px) | cap ≈ 65 px (font ≈ 85 px) |
| **Fill** | White | Word colors: yellow, red, green, cyan, magenta, white | White + **one colored keyword** | White + colored keyword(s) |
| **Outline/box** | **Dark semi-transparent box** (~65% black, small radius, ~8 px padding) | No box. **Soft glow in the word's own color** + dark drop shadow | Thin dark shadow | **Strong outer glow** in the keyword color (neon) + dark shadow |
| **Speaker label** | Tiny line above: `Airsofter:` **yellow**, `Enemy:` **red** (≈40% of caption size) | — | — | — |
| **Position** | Center, y ≈ 52–58% | Center, y ≈ 48–50%, over chest/face | y ≈ 63% (below center) | Follows the subject: hook at y ≈ 25%, dialogue next to the speaker's head |
| **Words per caption** | Full short line (2–5 words) | Builds word by word up to 5–6 words, max 2 lines | 2–3 words | 1 line, 2–5 words |
| **Entrance** | Hard cut (appears on a frame) | **Per-word fade-in, ~3 frames each** (+ slight blur) | Hard pop per chunk | **Typewriter, ~1 char/frame**, or word-by-word |
| **Exit** | Hard cut | **Fade + blur, ~5 frames** | Hard cut | Hard cut |
| **Action/sound text** | `*LOOKING AROUND*` with asterisks | `???` small red above head | `*GET UP*` **cyan italic** with asterisks | `*CRIMINAL*`, `*TRYING TO SAVE HIM*` with asterisks |
| **Emoji** | Inline at line end (💀 😰 😔 😊 🤣) | Outro only (😂, big, above the text) | Separate sticker images | Big heart sticker |
| **Censorship** | `SH!T`, `F**K` | — | — | — |

## 2. Shared typography grammar
1. **ALL CAPS, heavy geometric sans, centered.** All four videos [C].
2. **Asterisks `*…*` mean an action, sound or narration** rather than speech. All four videos [C]. This is a strong shared signature.
3. **Color = meaning.** Red for danger, insults and conflict; green for success, positive and "help"; cyan for neutral narration and action; yellow for questions and reactions; magenta for twists (`BUT THEN HE DID THIS...`). Flag colors for nationality words (V1 `RONALDO`, `ITALIAN`) [C].
4. **One emphasised word per line** (V2, V3) or one color per line (V1).
5. **Never more than 2 lines.**

## 3. Hook text

| Video | Hook text | Words | Arrangement | Why it works |
|---|---|---|---|---|
| V0 | `*ENEMY BREAK MY GUN 💀*` (on the freeze, 1.42 s) | 4 + emoji | One line, upper third, bigger than the normal captions, no box | States the *damage*. The emoji sets a dark-comedy tone. Placed on a freeze, so it's read without distraction. |
| V1 | `WHO ARE YOU?` (0.0 s) | 3 | One line, center, word-by-word | A question to a famous person is instant irony. |
| V2 | `THIS GIRL` → `LIGHT BULB` → `CANDY IN CLASS` → `BUT IT GOT STUCK` | 2–3 per chunk | Small, one colored keyword | Mirrors the VO. Each chunk adds one fact, and the problem arrives at 2.6 s. |
| V3 | `*COP IN DANGER*` (0.0 s) | 3 | Upper quarter; **COP** white, **IN DANGER** red glow; ▼ pointer at the cop | Stakes + role in 3 words. Readable in under 0.5 s. Points at the subject. |

**Pattern:** **3–4 words, one emotional keyword colored, readable in about half a second, on screen from frame 0** (V0's flash-forward sets up its hook within 1.4 s).

## 4. Recommended settings for your style
- **Primary caption:** Montserrat ExtraBold 800, 72 px, ALL CAPS, tracking +40 (+4%), fill #FFFFFF. Outer glow in the keyword color (blur 18 px, opacity 70%), drop shadow #000 at 60% (distance 4 px, blur 10 px). Center, y = 55%.
- **Keyword colors:** red `#FF3B3B`, green `#3DFF6E`, cyan `#3DE7FF`, yellow `#FFE53D`, magenta `#FF4FD8`.
- **Hook title:** Montserrat Black 900, 88 px, y = 25%, with a ▼ pointer or arrow at the subject.
- **Action text:** same font, *italic*, cyan, wrapped in `*…*`.
- **Animation:** words fade/scale in over 3 frames (scale 90→100%, opacity 0→100, blur 6→0 px). Exit is a 4-frame fade, or a hard cut on a scene change. Typewriter (1 char/frame) for the hook title only.
- Montserrat isn't in `public/fonts`. The nearest bundled heavy sans are `inter-latin-800`, `archivo-black` and `unbounded-800`. Add Montserrat from Google Fonts for an exact match.
