# 06 · Master style guide: your own editing system

Built from the 4 analysed references. It combines their strongest shared and distinctive techniques without copying any single video. **Update it when the other 8 references are analysed.**

Working name: **"PUNCH"**. Every beat gets **P**ointer, **U**nderline (color word), **N**oise (SFX), **C**ut/zoom, **H**old (freeze/flash) where earned.

## 1. Visual identity
- 9:16, 1080×1920, 30 fps. Non-vertical sources get the **blurred self-fill** background.
- **Grade:** slightly warm, contrast +10, saturation +10 (V1-style but lighter). Same grade on every clip.
- **Emotion colors** (use them everywhere: captions, washes, arrows):

  | Emotion | Color | Used for |
  |---|---|---|
  | Danger, conflict, insult | Red `#FF3B3B` | Hook stakes, threats, arrows/circles |
  | Success, relief, payoff | Green `#3DFF6E` | "SAVED", wins |
  | Narration, action | Cyan `#3DE7FF` | `*action*` captions |
  | Question, reaction | Yellow `#FFE53D` | Questions, reaction washes |
  | Twist, cliffhanger | Magenta `#FF4FD8` | "BUT THEN…", time skips |

## 2. Typography system
| Role | Font | Size | Position | Style | Animation |
|---|---|---|---|---|---|
| Hook title | Montserrat Black 900, caps | 88 px | y 25% | White + one red word, red glow, ▼ pointer | Typewriter 1 char/frame |
| Dialogue/VO caption | Montserrat ExtraBold 800, caps, tracking +4% | 72 px | y 55% (or beside the speaker) | White, keyword in an emotion color, glow + shadow | Word fade-in 3 frames (scale 90→100, blur 6→0) |
| Action caption | Montserrat ExtraBold *Italic* | 64 px | y 55% | Cyan, `*…*` | Pop 3 frames |
| Speaker label (multi-person skits) | Montserrat Bold | 30 px | 6 px above the caption | Yellow (hero) / red (antagonist) | With caption |
| CTA | Montserrat ExtraBold | 64 px | y 62% | White + yellow keyword | Word fade |

Max **2 lines**, max **6 words** on screen, one emphasised word per line.

## 3. Hook formula (first 3 s)
Use one of these three:
1. **Flash-forward freeze (V0):** climax clip 0–1.4 s → **freeze** (105% scale, −40% brightness) with a 3–4 word title → **riser ending on the rewind cut** at ~2.7 s.
2. **Stakes title (V3):** frame 0 = `*SUBJECT + DANGER WORD*` title, arrow at the subject → at 1.2–1.5 s a **white flash + impact** into a **spotlight** shot with a typewriter problem statement.
3. **Irony/premise line (V1/V2):** start mid-action on the most surprising line (question or premise + "but…") with captions from frame 0, and a pointer on the odd object.

Rules: text on screen ≤ 0.5 s in; subject visible on frame 0; problem stated by 3 s.

## 4. Caption style
- Word-by-word for real speech. 2–3-word chunks for voice-over. Typewriter for titles only.
- Color-code **one** word per line by its emotion.
- Asterisks for actions, sounds and inner thoughts.
- Emoji only at the end of a line, at most 1 per caption.

## 5. Transition system
| Transition | Where | Recipe |
|---|---|---|
| Hard cut | Default | — |
| Punch-in cut (×1.2–1.4, or ×2 for a face) | Every 2–3 cuts on single-camera footage | Instant scale on the cut |
| White flash | Into a new act/scene, at most 3 per video | 4f up → 1–2f white → 4f down + impact |
| Color wash | Emotional reaction beats, ≥5 s apart | 90% tint → 0 over 0.5 s + ding (colored by emotion) |
| Time-skip flash | "MOMENTS LATER" | Magenta wash + riser → hit |
| Zoom-blur resolve | Into the outro/payoff card | 1 white frame + radial blur 8 frames + shake |

## 6. SFX library and placement guide
(Exact positions are in `02_sfx_placement.md` §3.)
- **Impact/bass hit:** white flashes, hook title, resume after a freeze.
- **Riser/reverse whoosh:** ends on a cut after a freeze or time skip (start 0.25 s early).
- **Low-pass "muffle" on the music (≈1.2 kHz):** freezes and tension sections. Release on the next cut.
- **Bright ding/shine:** colored washes and payoffs. Keep one signature ding per channel.
- **Pop:** stickers, emoji, arrows.
- **Music:** a light bed under dialogue (−18 to −22 dB below speech); **switch, drop or swell for the ending**.
- **Master:** −14 LUFS (`tools/export.sh`).

## 7. Motion graphics system
- Red curved arrow or ▼ pointer at the subject during the hook. Bob ±6 px at 4 Hz.
- Red hand-drawn circle (6 frames to draw) on a detail the viewer must notice.
- Spotlight vignette for "look here" moments (−50% brightness outside a feathered ellipse).
- Emoji/heart sticker pop on the payoff (70 → 108 → 100% scale, dissolve 0.6 s).
- Meme stickers only for comedy formats, in a corner, 1–3 s.

### Framing and tracking rules (always)
- **Frame every shot on its characters.** A virtual camera follows the subjects. Zoom is fixed per shot so it never "breathes", and is set to fit every character that matters with ~18% margin. Keep headroom when zoomed in. The picture never shows an empty edge.
- **Camera motion must be smooth:** zero-phase smoothing (σ ≈ 8 frames) plus a speed limit, so there's no jitter and no whip.
- **Anything that points at a character must follow it:** arrows, circles, spotlights and labels read the same smoothed track every frame (σ ≈ 3 frames). They are never placed at fixed coordinates.
- **Captions never cover a face.** Each caption tries slots in order (55% → 77% → 69% → 46% of the height) and takes the first one that clears every tracked head over its whole duration.
- Implementation: `tools/testedit/track.py` (OpenCV ViT tracker, forward + backward from a seed box) → `edl.json` → `camAt()` / `subjectAt()` in `src/testedit/TestEdit.tsx`.

### Standing rules from review
- **Only use elements from this guide.** No extra cards, banners or "watch the full episode" overlays. They look AI-made.
- **No voice samples as dings.** `sfx/ding.mp3` is a person saying "ding", so never use it. Use `jorho-ting` / `ding-2` (pure 2.6 kHz bell) for success, `mg-shimmer` (short) for the yellow "shine", `meme-dundun` for twists, and `meme-impact` + `vine-boom` for red hits.
- **Landscape sources (shows, podcasts):** keep the **whole 16:9 frame** in a centred box (centre y = 900) with a blurred fill. Don't crop to vertical. The hook title goes above the box, and the `*action*` + dialogue captions go below it.
- **Music bed** should be clearly audible under dialogue (roughly +7 dB over the first pass), louder still when muffled, and lift at the end.
- **Plenty of SFX:**
  - bass hit on frame 0 and typing under the typewriter title
  - pop when the pointer lands, scratch on the freeze, riser into the cut, impact on the cut
  - a tone on each colour wash
  - a pop on each `*action*` caption, a swish on each punch-in, a boom on each shake
  - a soft click on each colour-coded keyword
- Render with `tools/render.sh` (fastest settings).

## 8. Pacing formula
- **Something new on screen at least every 1.0 s:** a cut, punch-in, caption swap, sticker or wash.
- **Average shot 1.3–2.5 s.** Use the shorter end for narrated/silent stories, the longer for dialogue (let the line land).
- **Big "event"** (flash, freeze, wash) about **every 5–8 s**.
- **Acceleration:** cuts every ~1 s during escalation. **Slow down** (hold 2–3 s) on the payoff reaction.
- Length **20–45 s**. Payoff in the last 15–20%.

## 9. Opening template (0–3 s)
| Time | Visual | Text | Animation | SFX | Music |
|---|---|---|---|---|---|
| 0.00 | Strongest frame (climax or most surprising moment), punched in ×1.1 | Hook title, 3–4 words, one red word | Typewriter, or present from frame 0 | Bass hit on frame 0 | Starts at frame 0 |
| 0.0–1.4 | Action continues | — | Arrow/▼ bobbing on the subject | — | — |
| 1.4 | **Freeze** (option A) or **white flash** (option B) | Problem line (`*HE IS CHOKING*`) | Darken + 105% scale / spotlight | Muffle on (A); impact (B) | Low-pass on |
| 2.4–2.7 | Hold | — | — | **Riser ending on the next cut** | — |
| 2.7 | Cut back to the story start | First dialogue/VO caption | Word fade-in | Impact; filter opens | Full |

## 10. Middle template (3 s → 80%)
| Time | Visual | Text | Animation | SFX | Music |
|---|---|---|---|---|---|
| every 1–2 s | Cut or punch-in (alternate wide ↔ face ×1.3–2.2) | Word-by-word captions, keyword colored | Fade 3f in | — | Bed under speech |
| on each reaction beat (≥5 s apart) | Reaction face | Reaction word (`WHAT?`, `???`) | **Color wash** (yellow) | **Ding** | — |
| escalation step | New character/attempt | `*ACTION*` cyan italic | Punch-in ×1.3 | Optional whoosh | — |
| tension | Struggle | `*TRYING TO…*` | Spotlight or B&W | **Muffle the music** | Low-pass |
| time skip | — | `MOMENTS LATER` | Magenta wash | Riser → hit | Lift |
| ~75–80% | Just before the reveal | `BUT THEN HE DID THIS...` (magenta) | Word-by-word build | — | Brief drop |

## 11. Ending template (last 15–20%)
| Time | Visual | Text | Animation | SFX | Music |
|---|---|---|---|---|---|
| Payoff frame | The reveal | `SAVED` / punchline (green) | **Green wash** or white flash + zoom-blur | **Ding** / impact | **Filter opens / drop** |
| +0.2 s | Reaction | `*BRO LOSING IT 🤣*` / aura line | Heart/emoji pop, or bloom + shake | Pop | Music-only, louder |
| Last 0.6 s | Hold on the reaction | — (or a CTA "turn my like into…") | Fade to black (serious tone) or hard end (comedy) | — | Ends with the cut |

## 12. Workflow for a new Short (in this repo)
1. Drop the source in `footage/`. Run:
   ```
   python3 tools/transcribe.py footage/clip.mp4
   python3 tools/cuts.py footage/clip.mp4 > footage/clip.cuts.txt
   python3 tools/peaks.py footage/clip.mp4 5
   ```
2. **Pick the hook moment** (the loudest peak or the climax) and the **payoff moment**. Choose hook option A, B or C (§3).
3. **Cut the story to 20–45 s**: premise → problem → escalation ×2–3 → (cliffhanger line) → payoff → reaction.
4. **Plan punch-ins** so no shot holds longer than ~2.5 s without a change.
5. **Captions**: word-by-word from the transcript JSON. Color one keyword per line by emotion; asterisk the actions.
6. **Beat events**: 1 flash or wash every 5–8 s, on reaction beats only. Add arrows, circles or spotlight where the viewer must look.
7. **Sound pass**, in this order: music bed → muffle sections → risers into cuts → impacts on flashes → dings on washes → pops on stickers → ending music change.
8. **Build it** in Remotion (`src/`), or in CapCut/Premiere using `04_vfx_recreation.md`.
9. **QC**: watch muted (does the story read from the captions alone?), then audio-only (do the beats land?). Check that every second has a change. Export with `tools/export.sh` (−14 LUFS).
10. To check yourself against the references, run `tools/timeline.py` on your render and compare the cut, flash and audio patterns.
