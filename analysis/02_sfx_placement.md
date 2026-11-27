# 02 · Sound design: what's in the references, and where to place it

**Limits of this analysis.** I can't listen to audio. Every sound below was read from a spectrogram and loudness curve that line up frame-for-frame with the video.
- **Timing, frequency range, duration and level changes are measured [C].**
- **Names like "riser" or "ding" are educated guesses [G]** based on the spectral shape. Check them by ear before copying.

The songs themselves couldn't be identified.

## 1. Measured sound events in the references

| Video | Time | Visual trigger | Sound (spectral evidence) | Probable SFX [G] | Placement vs visual | Duration | Level |
|---|---|---|---|---|---|---|---|
| V0 | 0.71–1.40 | Gun smashed | Broadband burst to 11 kHz | Real crash audio (diegetic) | During action | 0.7 s | Loud |
| V0 | **1.42** | Freeze frame starts | Everything above ~1.5 kHz disappears | **Low-pass filter ("muffle") on the music** | Exactly on the freeze frame | Whole freeze (1.33 s) | Quieter |
| V0 | **2.45 → 2.75** | Before freeze releases | Noise sweeping upward to 11 kHz | **Riser / reverse whoosh** | **Ends exactly on the cut** (starts 0.3 s before) | 0.3 s | Building |
| V0 | **2.75** | Freeze releases, back to action | +13.8 dB jump, broadband attack | Full mix returns (+ impact) | **On the cut frame** | Attack | Loudest jump in the video |
| V0 | 13.82–15.20 | Freeze #2 | Held tone slowly falling ~4.5 kHz; muffled bed | Muffle + falling "uhh" tone | Over the freeze | 1.4 s | Quiet |
| V0 | **15.0 → 15.2** | Before cut | Upward noise sweep | **Riser** | Ends on the cut | 0.2 s | Building |
| V0 | 16.9–18.1 | Cash handed over (`AAAA 😊`) | Several bright harmonics gliding *down* | "Angelic aaah"/choir sting | Starts with the caption | 1.2 s | Medium |
| V0 | **20.75** | Last caption `*BRO LOSING IT 🤣*` | Strong bass arrives, loudest section | **Music drop** for the ending | On the caption | To end | ≈ −8 dB short-term |
| V1 | **1.77** | Yellow flash on "SPEED?" | Pure ~7.6 kHz tone | Bright "ding"/shine (or ear-ring) | **Starts on the flash frame** | 0.65 s | Quiet, cuts through the dialogue |
| V1 | 13.3 | Caption swap | 4–8 kHz noise burst | Short whoosh | On the swap | 0.3 s | Low |
| V1 | **32.55** | Yellow flash on "HEYYYYY" | Same ~7.6 kHz tone | Same "ding" (re-used = a signature sound) | On the flash | 0.6 s | Quiet |
| V1 | **36.13** | White flash + zoom blur into the outro | Dialogue stops; regular beat every ~0.45 s | **Hard switch to music-only outro** (≈130 BPM, rough estimate) | On the flash frame | To end, fades with the picture | Loud |
| V2 | 0.0 | First frame | Voice-over from frame 0 | VO (possibly text-to-speech [G]) | Frame 0 | — | Dominant |
| V2 | **4.40** | White flash | Broadband attack | Impact/hit | On the flash | short | Medium |
| V2 | **19.0 → 19.3** | Pink flash, `MOMENTS LATER` | Upward sweep, then a hit; music louder afterwards | **Whoosh/riser → hit** time-skip | Sweep before, hit on the new shot | 0.3 s | Medium-loud |
| V2 | **37.93** | Purple flash + laughing-cat meme | Repeating arch-shaped pitch sweeps (6–9 kHz) | The meme clip's own audio | On the sticker | 0.4 s | Medium |
| V2 | **42.25** | CTA line | Music swells under the VO | Music swell for the CTA | On the CTA | To end | Up |
| V3 | **1.48** | Fade-to-white transition | Broadband attack + noise tail | **Impact + whoosh** | At the white peak | 0.3 s | Loud |
| V3 | **2.78 & 2.85** | White flash | Two broadband hits | **Double hit** | On the flash frames | 2 frames apart | Loud |
| V3 | **2.85–5.57** | `*CRIMINAL*` segment | Nothing above ~5.5 kHz | **Low-pass on the music (tension)** | From the flash to the next cut | 2.7 s | Muffled |
| V3 | 4.6–5.35 | Sparkle particles on the criminal | Two steady tones ~1.65 + 1.95 kHz | Two-note chime | Under the sparkles | 0.75 s | Low |
| V3 | **5.57** | Cut to the cop `HEY!` | Full spectrum returns | **Filter opens** | On the cut | — | Full |
| V3 | 10.24–10.45 | `*HANDS OVER THE KEYS*` | Hit, then a ~0.1 s music dip | Hit + gap | On the caption | 0.2 s | — |
| V3 | 14.9–15.8 | `*TRYING TO SAVE HIM*` | Treble removed again | Muffle (tension before the save) | Over the struggle | 0.9 s | Muffled |
| V3 | **18.25** | Green flash + `SAVED` | Pure 2.65 kHz tone + 6.9 kHz blip at the start | **"Success" ding/chime** | **On the flash frame** | 0.75 s | Clearly audible over the music |
| V3 | **21.35** | Heart sticker pops in | Attack | Pop | On the pop | short | Medium |

## 2. Rules the references follow (use these when placing sound)

1. **A sound always lands on the frame where the visual peaks:** flash, sticker or caption. Exception: risers and whooshes, which *end* on that frame. Start a riser **0.2–0.3 s before** the cut it leads into.
2. **Freeze frame or "time stop" = low-pass the music** (cut-off around 1–1.5 kHz), and lower its level. Open the filter, at full level, on the next cut. This is the strongest audio trick in V0 and V3.
3. **Tension = muffled; release/payoff = open filter plus a bright tonal "ding".** Seen at V3's 18.25 s green "SAVED".
4. **Flash = transient.** White flashes get an impact (V2 4.40, V3 1.48/2.78). Colored "emotion" washes get a tonal ding (V1 yellow ↔ 7.6 kHz; V3 green ↔ 2.65 kHz).
5. **Re-use one signature sound** for the same kind of beat. V1 uses the same 7.6 kHz ding on both yellow "reaction" flashes.
6. **End on a music change:** a drop (V0), a switch to a music-only outro (V1) or a swell (V2).
7. **Dialogue/VO stays on top.** In V1 the music is barely visible on the spectrogram under the speech. V2 lets the original audio breathe while the VO is quiet (5.3–7.0 s, 12.9–19.1 s).
8. **Loudness:** the references measure −15.6 to −6.1 LUFS. V1 is crushed to −6. Your `tools/export.sh` already normalises to **−14 LUFS**, which YouTube plays back cleanly. Don't chase −6.

## 3. Placement sheet for your own edits (template)

| Visual event | SFX (pick from `public/sfx` / `public/resources`) | Exact placement | Length | Level vs dialogue |
|---|---|---|---|---|
| Hook title card appears (frame 0) | Bass hit / boom | Frame 0, on the text pop | 0.3–0.6 s | −6 dB |
| Freeze-frame hook | Muffle the music (low-pass ~1.2 kHz) + optional record scratch at freeze start | Filter on the freeze frame; scratch on the same frame | Whole freeze | Music −8 dB |
| Leaving a freeze or time skip | **Riser/reverse whoosh** | **Ends** on the resume cut (start 0.25 s earlier) | 0.25–0.4 s | −10 → −4 dB |
| Resume after a freeze | Impact | On the resume frame; filter opens here | 0.3 s | −4 dB |
| White flash transition | Impact (optional double hit 2 frames apart) | On the brightest frame | 0.2–0.4 s | −6 dB |
| Colored reaction wash (yellow/green/pink) | Bright "ding"/shine | On the wash frame | 0.5–0.8 s | −12 dB (thin, cuts through) |
| Meme sticker pop | Pop, or the meme's own audio | On the frame it appears | 0.2–0.5 s | −8 dB |
| Arrow / circle highlight | Soft click/swoosh | As the shape reaches full size | 0.15 s | −14 dB |
| Typewriter caption | (none in refs). Optional soft key ticks | Per 2–3 characters | — | −20 dB |
| Punch-in zoom | (none in refs). Optional short whoosh | During the zoom | 0.2 s | −14 dB |
| "Payoff" moment | Success ding + music lift | On the payoff frame | 0.75 s | −10 dB |
| Ending | Music drop/switch, or music-only outro | On the last caption | To end | Music up to −8 dB |
