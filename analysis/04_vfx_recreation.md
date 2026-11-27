# 04 · Visual effects: what's used and how to rebuild each one

Only effects actually seen in the references are listed [C]. Durations are measured in frames at 30 fps (V3 is 25 fps).

| # | Effect | Seen at | What it does | Measured timing |
|---|---|---|---|---|
| E1 | **Freeze frame + darken + scale** | V0 1.42–2.77, 13.82–15.20 | Stops time on the key moment while the hook text is read | Hard cut in; scale ≈105%; brightness ≈ −40%; hold 1.3–1.4 s; hard cut out |
| E2 | **Flash-forward cold open** | V0 0.0–1.42 | Shows the climax first, then rewinds | 1.4 s of climax → freeze → rewind |
| E3 | **White flash transition** | V3 1.24–1.56; V1 5.17, 23.27; V2 4.40 | Hides a cut and adds punch | Fade-up 4–5 frames → 1–2 frames full white → fade-down 3–5 frames |
| E4 | **Single-frame white + zoom-blur resolve** | V1 36.13–36.40 | Transition into the outro card | 1 white frame, then radial blur shrinking to 0 over ~8 frames |
| E5 | **Color wash ("emotion flash")** | V1 yellow 1.77, 18.9, 32.55; V2 pink 19.17, red 30.33, purple 37.93; V3 green 18.24 | Colors the beat's emotion | Peak on frame 1 (~90% tint), exponential decay over 0.3–0.8 s |
| E6 | **B&W → color fade** | V1 9.97–11.0 | A "thinking/dramatic" beat | Saturation 0 → 100% over ~1 s |
| E7 | **Spotlight / vignette** | V3 1.56–2.72; V0 18.87–19.75 (darken only) | Forces the eye onto the subject | Whole frame −50% brightness with a feathered bright ellipse on the subject |
| E8 | **Punch-in / punch-out (digital re-frame on a cut)** | V2 ×2.23 @10.07, ×1.38 @15.93, ×2.15 @41.93; V1 ×1.22 @31.40, ×0.83 @33.13; V3 ×1.10 @0, ×1.13 @13.68, ×0.69 @11.68 | Fakes a second camera; emphasis on a face | Instant (on the cut) |
| E9 | **Eased zoom ramp** | V1 3.3, 34.8–35.2, 35.5–35.8 | Builds intensity while someone speaks | ~0.3–0.4 s ease-in-out, ~+8–12% scale |
| E10 | **Whip / motion-blur pan** | V1 0.40–0.56 | Hands over between two speakers | ~5 frames of directional blur |
| E11 | **Camera shake** | V1 36.15–36.6 (outro) | Energy on the payoff | Small, fast random X/Y jitter (±4–8 px at 1080) |
| E12 | **Bloom / lens-flare glow** | V1 outro 36.4–38.0 | "Aura" look | Warm glow, flare behind the subject |
| E13 | **Fade to black** | V1 38.0–38.66 | Ending | ~0.6 s |
| E14 | **Red 3D arrow, bobbing** | V2 0.0–0.5 | Points at the subject in the hook | Small position oscillation, re-aimed after 0.5 s |
| E15 | **Red curved arrow / ▼ pointer** | V3 0.0–2.7 | Points at the subject under the hook text | Static once on screen |
| E16 | **Hand-drawn red circle** | V3 17.2, 17.6 | Highlights a detail | On screen ~0.2–0.4 s each |
| E17 | **Meme stickers** (sweat face, "?" bear, screaming cat) | V2 4.0, 22.0, 37.93 | Emotional label | Pop in, held 1–3 s, corner placement (bottom-right/right) |
| E18 | **Emoji sticker pop (heart)** | V3 21.40–22.2 | Wholesome payoff | Scale 70→100% in 2 frames (overshoot), hold ~4 frames, dissolve ~0.6 s |
| E19 | **Particles / sparkles** | V3 5.2 | "Shine" on a reveal | ~0.3 s |
| E20 | **Animated CTA sticker (👍 → 😆 → 👍)** | V2 42.3–43.4 | Asks for a like | Pop in 42.3, squash/morph 42.7–43.1, back by 43.4 |
| E21 | **Blurred background fill** | V0 (whole video) | Fits 4:5 footage into 9:16 | Same clip, scaled to fill, gaussian blur ~40 |
| E22 | **Color grade** | V1 (whole video) | Warm highlights, deep shadows, high contrast | — |
| E23 | **Watermark** | V1 y≈82%, V2 bottom | Branding | Small, ~50% opacity |

---

## How to rebuild each effect

### CapCut (mobile/desktop)
- **E1 freeze:** split at the frame → *Freeze* (sets 3 s; trim to 1.3 s) → *Adjust › Brightness −40* → *Basic › Scale 105%*. Put the hook text on top. Audio: select the music → *Split* at the same frame → *Voice effects/Filter* "Low-pass" (or *Audio › EQ*, cut highs) for that piece only. Add a riser ending on the next cut.
- **E2 cold open:** copy the 1–1.5 s climax clip to the very start, ending on the freeze. The original timeline continues after it.
- **E3 white flash:** *Transitions › Basic › "Flash"* (or "White flash"), 0.3 s. Alternatively, a white Solid with opacity keyframes 0→100→0 over frames 0/5/10.
- **E5 color wash:** *Effects › Basic › "Color flash"*, or add a colored *Solid/Overlay* (blend mode *Screen*). Opacity keyframes: 90% at the hit frame → 0% after 0.5 s (ease-out).
- **E6 B&W→color:** *Adjust › Saturation −50* keyframed to 0 over 1 s.
- **E7 spotlight:** *Effects › "Spotlight"*, or a duplicate of the clip with *Mask › Circle* (feather 40) over the darkened base clip (Brightness −50).
- **E8 punch-in:** split on the cut point → second piece *Scale 130–220%*, re-position on the face.
- **E9 zoom ramp:** keyframe Scale 100% → 110% over 0.35 s; set the keyframe curve to *Ease in-out*.
- **E10/E11:** *Effects › "Shake" / "Camera shake"* at low intensity; transition *"Blur"/"Swipe"* for the whip.
- **E14–E20 stickers/arrows:** *Stickers* (search "red arrow", "circle"), or import PNG/GIF overlays from `public/resources`. Animation *In › "Pop"* (0.2 s).
- **Captions:** *Text › Auto captions* → style ALL CAPS, Montserrat ExtraBold, glow. *Animation › In › "Fade in"* 0.1 s, or "Typewriter" for the hook.

### Premiere Pro
- **E1:** *Frame Hold Segment* (right-click › Add Frame Hold) → *Lumetri › Exposure −1.0* → *Motion › Scale 105*. On the music clip: *Lowpass* effect (cutoff 1200 Hz) keyframed on for the freeze segment.
- **E3:** *Dip to White* 8–10 frames, centered on the cut.
- **E5:** *Color Matte* on V3 above the footage, *Blend Mode: Screen* or *Color*. Opacity 90% → 0% over 15 frames (Bezier ease-out).
- **E7:** duplicate the clip; bottom copy *Lumetri Exposure −1.5*; top copy *Opacity › ellipse mask*, feather 150.
- **E8/E9:** *Motion › Scale* keyframes (instant or 10 frames eased). *Transform* effect if you need shutter-angle motion blur (180°).
- **E10:** *Transform* with a position keyframe across 5 frames, shutter angle 360. Or the Directional Blur effect.

### After Effects
- **E4:** a white solid for 1 frame + *CC Radial Fast Blur* (Amount 80→0 over 8 frames, center on the face).
- **E11:** `wiggle(25, 6)` on Position.
- **E12:** *Optical Flares*, or *Glow* (radius 80, intensity 1.2) on an adjustment layer.
- **E14:** arrow layer Position `wiggle(6, 8)`, or a sine bob: `value + [0, Math.sin(time*40)*6]`.
- **E16:** an ellipse shape layer, stroke 6 px red, *Trim Paths* 0→100% over 6 frames.
- **E18:** Scale keyframes 70 → 108 → 100 over frames 0/2/4, Opacity 100 → 0 over the last 15 frames.
- **Typewriter caption:** Text › *Animate › Opacity*, Range Selector Start 0→100% over (characters ÷ 30) seconds, Smoothness 0%.
- **Word fade caption:** Text › *Animate › Opacity + Blur*, based on Words, Offset 0→100% synced to the speech. Use Ease High 50 for a soft 3-frame reveal.

### FFmpeg (batch-friendly snippets)
```bash
# E21 blurred background fill (4:5 footage -> 9:16)
ffmpeg -i in.mp4 -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=40[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -c:a copy out.mp4

# E1 freeze 1.33 s at t=1.42, darkened and scaled 105%
ffmpeg -i in.mp4 -vf "trim=0:1.42,setpts=PTS-STARTPTS" a.mp4
ffmpeg -ss 1.42 -i in.mp4 -frames:v 1 f.png
ffmpeg -loop 1 -t 1.33 -i f.png -vf "scale=iw*1.05:-2,crop=iw/1.05:ih/1.05,eq=brightness=-0.15,fps=30" b.mp4

# E3 white flash centered at t=3.0 (ramps up 0.15 s, full white at 3.0, ramps down 0.15 s). Put it on the joined edit, centered on the cut
ffmpeg -i in.mp4 -vf "eq=eval=frame:brightness='if(between(t,2.85,3.15),1-abs(t-3.0)/0.15,0)'" -c:a copy out.mp4

# Low-pass "muffle" on music between 1.42 and 2.77 s
ffmpeg -i music.mp3 -af "lowpass=f=1200:enable='between(t,1.42,2.77)'" muffled.mp3
```

### Remotion (this repo, `src/`)
These map one-to-one onto React components:
- **Freeze:** `<Freeze frame={n}>` around `<OffthreadVideo>`.
- **Flash / color wash:** an `<AbsoluteFill style={{background:'#fff', opacity: interpolate(f,[0,4,7,12],[0,1,1,0])}}>`.
- **Punch-in:** `transform: scale()` on the video wrapper.
- **Zoom ramp:** `interpolate` with `Easing.inOut(Easing.cubic)`.
- **Captions:** `@remotion/captions` + per-word `spring`/opacity.
- **Low-pass:** pre-render the muffled music section with the FFmpeg line above, then cross-cut it as `<Audio>` pieces.

---

## Layer order (top → bottom)
1. Color wash / flash solids
2. CTA / emoji stickers, meme stickers
3. Arrows, circles, pointers
4. Captions (hook title above the dialogue captions)
5. Watermark
6. Spotlight mask copy (if used)
7. Main footage (graded, punch-in transforms)
8. Blurred background fill (if the source isn't 9:16)
