# VverPaldo style

The style used for the "Guess the fake millionaire" and Trevor stream edits (Nov 2026). Reference build: **Redemption v2**
(`viral-short` → comp `Guess-tvredeem2`, plan in `viral-short/plan7.py`, template `viral-short/src/Guess.tsx`).

## Structure (retention)
- **Hook in the first 1–3 s:** open on the wildest / most specific line (numbers, a shocking answer). Speech on frame 1, a person on screen.
- **Story, in order, with a payoff or a cliffhanger.** 15–22 s total. Cut dead air and repeated lines (when one person talks and nothing moves, cut it).
- **Default: hook + straight cut** (user pick, Nov 15): payoff line first, then a hard cut into the story with a 2-frame white flash + flash SFX (the refs' shot-change strobe). cfg `hardcut: true`, no `rw` scene. Best when the story ends right before the hook line, so it loops seamlessly into its own hook.
- **Rejected: "WAIT FOR IT" PiP box + progress bar** ("looks AI"). Don't use.
- Old option: hook replay + rewind (12-frame reverse scrub with ◀◀).
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
- Saturation 1.3, contrast 1.06 in the template, then the **CapCut "4K filter" grade** in the master step (user's CapCut look: 4K filter + saturation 50 + sharpness 50; **current: sharpness 67 + saturation 67** → unsharp 1.74 + 0.79, saturation 1.26, contrast 1.11, glow 24.5 %. **Grade the source footage only** (pre-graded src file, e.g. `public/goat_g67.mp4`), never the text/emojis/overlays; master with `-c:v copy`):
  soft-light glow (gblur 14, 22 %), unsharp 1.3 + 0.6, contrast 1.10, saturation 1.18, gentle S-curve. **Export stays 1080×1920 — never 4K.**
- **Black flash 2:** constant 4 % black flash every 3 frames (0.1 s), no zoom.
- Effects: flat green/red tints (62 % multiply), white blow-out, motion-streak cuts, punch-ins (1.13×) on key words, tracked red circle + italic name call-out on masked people, italic CTA line mid-video.
- Blur the source's burned-in subtitles (bottom band).

## Anti-dupe re-edits (Nov 15)
- **Always change the text hook** on every re-edit/repost; never reuse a hook (check `04 Projects/Titles used.md`).
- **Extra effects only from the editing-resources Drive folder:** emoji PNG pops (😂 e_laugh / 😭 e_sob / ❤️ e_heart, scale-pop + wobble), greenflash2 / cashfall overlays (screen blend), meme SFX (huh, fahhh, wow, awk, ding, correct, camera flash on the hard cut).
- **Change the song per video, only from the resources' BGSONGS:** suspense, sentamento, montagem, funk ABN, empire, brevis (`res/*_n.mp3`, loudness-matched, energetic start offset, looped if short).
- Pipeline: `viral-short/planX.py` clones an edit under a new id with new hook/song/extras (`src/x.cfg.json`).

## Sound
- Background music at **53 %**, loudness-matched copies (`res/*_n.mp3`), rotating **Chess → Phonk → Say Goodbye** (originals); re-edits use a different resources song each (see above).
- Every effect gets its reference SFX (one sound per 5-frame window):
  call-out / rewind / white blow-out → **flash**; green tint → **rizz** (riser 10 frames before the first); red tint / big flash → **shock**; punch-in → **pop** (22 %).
- Final mix: −14 LUFS, TP −1.5, metadata stripped.

## Text hooks
- Curiosity + specific number or twist, true to the footage: "$20,000 card… now worth $500?!", "They voted him the FAKE… he was REAL".
- Campaign rules win (e.g. FOMO: "Guess the millionaire LARPER" variants + @fomo; HardScope: @HardScope + #r3born, no FaZe).

- ~~only MEME songs~~ superseded → **ONLY these 6 songs (2026-11-19):** Du bist (mdubist_n), Let Me Know (mletme_n), Say Walahi (mwalahi_n), Fat Little Chud (mchud_n), Chess (chess_n), Say Goodbye (goodbye_n). Music volume 0.40 (was 0.53).
- old note: only MEME songs, never phonk (no montagem/funk/brega/Ogryzek). Library: `res/m*_n.mp3` = mjeopardy, msubway, mmonkeys, mletme, mdubist, mduck, mwalahi, mmiles, msneaky, mchud (loudnorm -20, 60 s). One different song per clip.
- **Nothing under the video** (no ask pill, promo line, sub line, progress bar): user said it looks AI generated.

- **Clip picking > editing (user, 2026-11-19).** Spend the effort on finding moments people would actually stop for: real interaction, someone getting roasted/caught, awkward pauses, people breaking. Watch frames, not just the transcript. Avoid 'textbook funny' lines.
- **Text hooks = 2026 TikTok shitpost voice:** lowercase, slang (bro, NOT real, cause, 💀😭), quote the line or react to it, e.g. "bro said H&M like it's paris fashion week 😭". Never formal/AI phrasing like 'His X had a Y'.
