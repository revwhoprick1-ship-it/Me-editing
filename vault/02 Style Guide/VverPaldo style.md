# VverPaldo style

The style used for the "Guess the fake millionaire" and Trevor stream edits (Nov 2026). Reference build: **Redemption v2**
(`viral-short` → comp `Guess-tvredeem2`, plan in `viral-short/plan7.py`, template `viral-short/src/Guess.tsx`).

## Structure (retention)
- **Hook in the first 1–3 s:** open on the wildest / most specific line (numbers, a shocking answer). Speech on frame 1, a person on screen.
- **Story, in order, with a payoff or a cliffhanger.** 15–22 s total. Cut dead air and repeated lines (when one person talks and nothing moves, cut it).
- Optional **rewind** (12-frame reverse scrub with ◀◀ + scanlines) when the hook comes from later in the source than the story.
- End on the payoff, or cut mid-sentence before it resolves so it loops / sends people to the full video.

## Camera (who's speaking)
- Zoom in on whoever is speaking (~1.6×). Check speakers by eye per line; auto mouth-motion picks laughers.
- **Two people trading lines → two-shot that fits both** (~1.1–1.25×, centred between them).
- **Hold on the main person** (e.g. Trevor) while others talk, so their reactions carry it.
- **Tight punch-in (1.75–1.9×) on reaction lines** ("What is it now?", "Oh really?") and on the final cliffhanger.
- Pull wide for room reactions. Hold each framing ≥ 0.4 s (no flicker).
- Slow push-in (+6 %) restarting on every cut, so the frame is never still.

## Look
- Black 1080×1920 frame, video box y 417–1494.
- **Intro:** box opens from 609/1308 to 417/1494 over 24 frames, starting from a blown-out, horizontally smeared image.
- Top text: Montserrat 700, 58 px, white, on the box, ending in 💀. Key word coloured (red `#FF2A2A` for the twist, green `#58EE28` for money/good).
- Captions: one word at a time, Montserrat 800, 68 px, **white with a 7 px black stroke**, 2-frame horizontal smear on entry, y ≈ 1060. Swears starred.
- Saturation 1.3, contrast 1.06.
- **Black flash 2:** constant 4 % black flash every 3 frames (0.1 s), no zoom.
- Effects: flat green/red tints (62 % multiply), white blow-out, motion-streak cuts, punch-ins (1.13×) on key words, tracked red circle + italic name call-out on masked people, italic CTA line mid-video.
- Blur the source's burned-in subtitles (bottom band).

## Sound
- Background music at **53 %**, loudness-matched copies (`res/*_n.mp3`), rotating **Chess → Phonk → Say Goodbye**.
- Every effect gets its reference SFX (one sound per 5-frame window):
  call-out / rewind / white blow-out → **flash**; green tint → **rizz** (riser 10 frames before the first); red tint / big flash → **shock**; punch-in → **pop** (22 %).
- Final mix: −14 LUFS, TP −1.5, metadata stripped.

## Text hooks
- Curiosity + specific number or twist, true to the footage: "$20,000 card… now worth $500?!", "They voted him the FAKE… he was REAL".
- Campaign rules win (e.g. FOMO: "Guess the millionaire LARPER" variants + @fomo; HardScope: @HardScope + #r3born, no FaZe).
