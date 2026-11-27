# 01 · Individual video reports (timestamp breakdowns, hooks, pacing)

**Evidence legend**
- **[C] Confirmed**: seen in extracted frames, or measured (frame-difference, optical-flow zoom/shift, luma/saturation curves, spectrogram, transcript).
- **[G] Educated guess**: an inference. The main cases are naming a sound effect from its spectrogram shape (I can't listen to audio) and naming fonts. Treat these as starting points to check by ear.

**How it was measured**
- 0.25–0.5 s contact sheets for every video, plus frame-by-frame strips at each key moment.
- Scene/cut detection, then SIFT matching across each cut to tell a new camera shot from a digital punch-in on the same shot.
- Optical-flow zoom/shake curves and luma/saturation curves (flashes and color washes).
- faster-whisper word timings.
- Spectrogram + loudness envelope on the same time axis.
- EBU R128 integrated loudness.

Tools are in `tools/` (see README). Charts are in `footage/refs/sheets/`.

**Which file is which:** the uploads came without their YouTube IDs, so they're named by upload order. None of them is link #1 (`GdO_kBnp-ks`, 30 s, "Not All Heroes Wear Capes"); its metadata was read and the length doesn't match any upload.

| File | Length | Source res | fps | Loudness | Content |
|---|---|---|---|---|---|
| `video.mp4` → **V0** | 22.2 s | 360×640 | 30 | −14.2 LUFS | Airsoft POV skit: enemy breaks gun, pays $50 |
| `video_1.mp4` → **V1** | 38.7 s | 480×640 | 30 | **−6.1 LUFS** | Streamer meets old man in a deli ("@DEAGZZZSHORTS") |
| `video_2.mp4` → **V2** | 44.9 s | 480×640 | 30 | −12.3 LUFS | Narrated classroom story: light-bulb candy stuck in mouth ("@Shortsrender") |
| `video_3.mp4` → **V3** | 23.1 s | 512×640 | 25 | −15.6 LUFS | Staged dashcam skit: handcuffed man saves choking cop |

All four are 4:5-ish sources shown as vertical Shorts. V0 is the only one that keeps the 4:5 frame inside 9:16 with a **blurred, stretched copy of itself as the top/bottom fill** [C]. The others fill the frame.

---

## V0 · Airsoft "enemy breaks my gun"

**Format:** POV game footage plus speaker-labelled reaction captions. No voice-over. Real audio and a music bed.

### Timeline
| Time | Visual | Text on screen | Edit / effect | Audio |
|---|---|---|---|---|
| 0.00–1.40 | POV, hands on rifle in graffiti room | `Airsofter:` (small yellow) / `*LOOKING AROUND*` (0.0–0.9); `Enemy:` (small red) / `*EAT SH!T*` (1.0–1.4) | **Flash-forward cold open** [C]: this is the climax, shown first. The same "EAT SH!T" moment returns at 4.0 s | Music bed + loud broadband crash 0.71–1.4 s (gun smash, likely diegetic) [C] |
| **1.42** | **Freeze frame** | `*ENEMY BREAK MY GUN 💀*`, larger, upper third (y≈44%), **no box**, black outline | Hard cut into freeze. Frame **scaled ≈105%** and **darkened** (luma 110→65) [C] | Audio drops to a band **below ~1.5 kHz: low-pass "muffle"** [C] |
| 2.45–2.75 | (freeze held, 1.33 s) | same | — | **Riser / reverse-whoosh**: bright noise sweeping up to 11 kHz, ending exactly on the cut [C shape, G name] |
| **2.77** | Jump back to the start of the action | `Airsofter: NO.. 😰` (3.5) | Hard cut, freeze released, 100% scale | **+13.8 dB jump**: full-band audio returns with an impact-like attack [C] |
| 4.0–4.5 | Enemy grabs the gun | `Enemy: *EAT SH!T*` | Handheld whip (real camera) | Crash |
| 4.5–5.5 | Enemy, then hands | `Airsofter: *HURTS*` | — | — |
| 5.5–7.0 | Gun parts on floor | `NO BRO.... 😔` → `MY SNIPER....` | Jump cut 6.57 [C] | — |
| 7.47–9.5 | Group shot | `Enemy: *LAUGHING*` → `Airsofter: I JUST BOUGHT IT BRO` | Jump cut 7.47/7.50 [C] | — |
| 10.0–11.5 | Enemy holds out hand | `Enemy: IT'S $50 MAN` | — | — |
| 11.5–13.8 | Whip pan | `Airsofter: BRO F**K OFF` → `F**K` | Censored with `**` | — |
| **13.82** | **Freeze #2** on the enemy's hand with cash | `*GIVE ME MONEY 😲*` (upper third, no box) | Same recipe: freeze + 105% + darken (luma 100→55) [C] | Held tone slowly falling (~4.5 kHz); **riser 15.0–15.2** into the cut [C shape] |
| **15.20** | Resume | `Airsofter: YOU SAID-` → `*SEE MONEY*` | Cut | Full band returns |
| 16.5–17.5 | Cash handed over | `AAAA 😊` | — | Dense held tone 16.3–17.0, then **descending bright harmonic tones 16.9–18.1** [C]. Likely an "angelic aaah"/choir sting [G] |
| 17.77 | Money in hands, close | `Enemy: GO BUY` → `ANOTHER ONE` | Cut (re-framed, ×0.58 scale) [C] | — |
| 18.87–19.75 | Counting money | `OKAY 😁` → `*COUNTING MONEY*` | **Darkened section** (luma 100→55), no freeze [C] | Quieter |
| 19.75–20.7 | — | `Enemy: WHY YOU COUNTING IT` → `IT'S ENOUGH` | Brightness restored | — |
| **20.75–22.2** | Enemy laughs | `Enemy: *BRO LOSING IT 🤣*` | — | **Music drop with bass**: loudest part of the video (≈−8 dB short-term) [C] |

### Hook (0–3 s)
- **First visual:** fast POV movement into a tense moment. **First words:** `*LOOKING AROUND*`, then `EAT SH!T` at 1.0 s.
- **Device:** a **flash-forward with a freeze frame**. The worst moment is shown, frozen, and labelled (`ENEMY BREAK MY GUN 💀`). Then the edit rewinds.
- **Why it works:** the viewer already knows *what* happens. The open question becomes **"what happens next / how does he react?"**, which keeps them watching for the reaction and the payoff.
- **Pattern interrupt:** the freeze, the muffled audio and the darkened frame make a sudden quiet "time stop". The riser and the full-volume return then snap attention back.

### Retention devices
- Caption changes roughly **every 0.9 s**: about 25 caption states in 22 s [C].
- A second freeze at 13.8 s re-hooks the mid-point with the twist (*he wants money*).
- **Payoff:** a role reversal. The enemy *pays*, and the victim is suddenly happy (`AAAA 😊`).
- **Ending:** a music drop on the laugh. It isn't a seamless loop.

### Pacing
- About 9 real edit points in 22.2 s → **≈2.4 s average shot**. The footage itself is chaotic handheld POV, so the motion comes from the camera.
- The editor adds rhythm through **caption swaps and two freeze beats**, not through many cuts.

---

## V1 · Streamer × old man in a deli ("I'm the main man")

**Format:** a heavily stylised dialogue edit. Color grade, word-by-word glowing captions, color-coded words, flashes, punch-ins and an outro "aura" card. Watermark `@DEAGZZZSHORTS` at y≈82%.

### Timeline
| Time | Visual | Captions (word-by-word) | Edit / effect | Audio |
|---|---|---|---|---|
| 0.00 | Old man, close, mid-sentence | `WHO ARE YOU?` (pale yellow, wide tracking) | Video starts **mid-conversation** on a question [C] | Dialogue at full level; −6 LUFS overall (very loud, heavily limited) [C] |
| 0.33–0.43 | — | Words **fade in one by one**, about 3 frames each [C] | — | — |
| 0.40–0.56 | **Whip / motion-blur transition** from old man to streamer [C] | Caption stays on screen across the transition | — | — |
| 0.82–0.96 | Streamer close-up | Caption **fades out with a slight blur** over ~5 frames [C] | — | — |
| 1.0–1.7 | Streamer | `I'M SPEED` (red, italic) | — | — |
| **1.77** | Old man | `SPEED?` (yellow) | **Yellow flash**: frame washed yellow, decays over ~0.3 s [C] | **~7.6 kHz pure ring for ~0.65 s** (1.8–2.45) [C]. Likely a "ding/shine" or ear-ring sting [G] |
| 2.8–4.4 | — | `YEAH` (green) → `YEAH OKAY` (red) → `SO` → `SO WHAT?` | Smooth **punch-in at ~3.3 s** (zoom-in then settle) [C] | — |
| 5.0–5.17 | Streamer | `???` (red, small, above head) | — | — |
| **5.17** | Old man | `WHATS YOUR LAST NAME?` | **White flash** [C] | — |
| 6.5–7.3 | — | `YOU HAVE LAST NAME TOO?` (magenta) | — | — |
| 7.5–8.0 | Streamer | `RONALDO` (green **RON**, white, red **ALDO**: flag colors) | — | — |
| 8.5–9.5 | Old man | `"SPEED RONANO"` (red / green) | — | — |
| **9.97** | Old man | `SO` (yellow-green) | **Cut into black-and-white, fading back to full color over ~1 s** (saturation 0→normal by ~11.0) [C] | — |
| 10.5–11.3 | — | `SO YOU MUST BE ITALIAN RIGHT?` (**ITALIAN** in green/white/red) | Re-frame 11.33 [C] | — |
| 11.5–14.5 | Streamer ↔ old man | `I'M PORTUGUESE` (red) / `PORTUGUESE?` (green) / `PORTUGUENESE` (yellow, comedic misspelling kept from his speech) | — | Short 4–8 kHz noise burst at 13.3 s (≈0.3 s) [C]. Possibly a whoosh [G] |
| 15.93 | Old man | `WHAT ARE THEY FILMING` (cyan) → `WHY THEY FILMING?` | **Punch-out ×0.89** [C] + zoom drift | — |
| 17.4–18.3 | Streamer | `BECAUSE I'M STREAMING` (white + red) | Re-frames 17.43 / 18.27 | — |
| **18.9** | Old man | `WHAT?` (yellow) | **Yellow color wash** (saturation spike, ~0.5 s decay) [C] | — |
| 19.5–20.0 | — | `WHAT IS STREAMING?` (red) | — | — |
| 20.1–21.2 | Streamer | `I'M JUST LIVE RIGHT NOW` (green) | New shot | — |
| 21.5–25.5 | Old man | `I KNOW BUT WHAT-` / `WHY WOULD ANYBODY CARE?` (red) / `YOU AND ME?` (yellow) | **White flash at 23.27** [C] | — |
| 25.57–28.0 | Streamer | `???` / `I` / `I DON'T KNOW` (red) / `WHO?` → `WHO IS THIS?` | New shots | — |
| 28.3–31.4 | Two-shot | `WHY WOULD ANYBODY CARE?` (red) / `LIKE PEOPLE ARE WATCHING THIS?` (yellow) | — | — |
| **31.40** | Streamer | `YEAH THEY'RE JUST WATCHING` | **Punch-in ×1.22** [C] | — |
| **32.55** | Old man | `HEY` → `HEYYYYY` (yellow-green) | **Yellow flash** + **the same ~7.6 kHz ring** (32.6–33.15) [C] | — |
| 33.13 | Two-shot | `HE'S REALLY NOT THE GUY` (red) | **Punch-out ×0.83** [C] | — |
| 34.8–35.8 | Old man | `I'M THE MAIN MAN` (green, italic) | **Two eased zoom-in ramps** (34.8–35.2, 35.5–35.8) [C] | — |
| **36.13** | Old man, low angle | — | **1 white frame → radial/zoom-blur resolve over ~0.25 s** + continuous **camera shake** [C] | **Dialogue stops; music-only outro** with a beat every ~0.45 s (≈130 BPM) [C, BPM rough] |
| 36.4–38.0 | — | `*GRANDPA GOT AURA*` (red, heavy glow) + 😂 | **Lens-flare/bloom glow**, warm grade [C] | Music |
| 38.0–38.66 | — | — | **Fade to black** [C] | Music ends |

### Hook
- **First visual:** a close-up of an unexpected face. **First words:** "Who are you?", said *to a famous streamer*.
- **Device:** a **status mismatch**. The audience knows who he is; the old man doesn't. That dramatic irony makes the whole video an open loop: *will he ever get it?*
- **Speed of introduction:** both characters are on screen within 1.0 s, and the conflict is stated within 2 s (`I'M SPEED` / `SPEED?` + flash).

### Retention devices
- **Every spoken word becomes a visual event**: word-by-word captions, with a color change roughly every caption.
- **Color carries meaning:** flag colors on nationality words, red on confrontational lines.
- Flashes and color washes on the old man's reaction beats: 1.77, 5.17, 9.97, 18.9, 23.27, 32.55. That's about **one every 5–6 s** [C].
- **Payoff:** the old man claims status (`I'M THE MAIN MAN`). The editor answers it with an "aura" outro card: flash, blur, glow, music switch and fade out.

### Pacing
- About 15 edits in 38.7 s → **≈2.6 s average shot**. The motion comes from punch-ins, flashes and word-by-word text, not from cut count.
- Caption reveal is about **2–3 words per second**, synced to speech [C, from whisper timings].

---

## V2 · Light-bulb candy stuck in mouth (narrated)

**Format:** narrated story (voice-over) over the original clip. Small two-word captions with one colored keyword, meme stickers, color flashes and a like/laugh CTA. Watermark `@Shortsrender` bottom-center.

### Timeline
| Time | Visual | Caption | Edit / effect | Audio |
|---|---|---|---|---|
| 0.00 | Girl with a red bulb candy | `THIS GIRL` (**THIS** orange) | **Red 3D arrow** top-right pointing at her, **bobbing** about every 0.15 s, re-aimed toward the candy by 0.5 s [C] | VO starts at **0.0**: "This girl tried a light bulb candy in class," [C] |
| 1.0–2.5 | Candy in mouth, classmate behind | `LIGHT BULB` (magenta) → `CANDY IN CLASS` (cyan) | Cut 1.77 = caption swap only | VO + light music bed |
| 2.6–3.5 | — | `BUT IT GOT STUCK` (**GOT** red) | — | "but it got stuck in her mouth." |
| 3.5–4.4 | Girl struggling | `IN HER MOUTH` (**HER** magenta) | **Meme sticker** (sweating face) pops in bottom-right, about 4.0 s [C] | Faint high tones (4.9 / 7.8 kHz) [C] |
| **4.40** | New angle | — | **White flash**, ~0.5 s decay [C] | Broadband hit [C] |
| 5.3–7.0 | Girl, worried | (sticker continues) | — | **VO pause**: original audio only (classroom) [C] |
| 7.0–9.0 | Classmate | `WHEN HER` / `CLASSMATES` / `SAW THIS` / `BELIEVE HER` | — | "When her classmates saw this, he didn't believe her," |
| 9.0–12.8 | Boy tries the candy | `SO HE` / `TRIED IT TOO` / `ONLY TO GET ONE` / `STUCK IN HIS` / `MOUTH AS WELL` | **Punch-in ×2.23 at 10.07** onto his face [C] | — |
| 12.9–19.1 | Chaos: both stuck | `*YOU GUYS ARE RIDICULOUS*` (yellow/red, asterisks = action/quote) | 6 cuts in ~6 s; punch-in ×1.38 at 15.93 [C] | VO silent; original audio |
| **19.17–19.3** | — | `MOMENTS LATER` (green **MOMENTS**) | **Magenta/pink flash** (saturation spike) = **time-skip transition** [C] | **Rising sweep 19.0–19.2 into a hit at 19.3**; music gets louder after [C] |
| 20.0–22.4 | Teacher arrives | `THE TEACHER` / `CAUGHT THEM` / `THEY WERE` / `FAKING IT` | **Sticker:** cartoon bear with "?" (22.0) [C] | VO |
| 23.0–30.3 | Teacher vs boy | `*GET UP*`, `*TRYING TO SAY IT'S STUCK*`, `*TRIED TO EXPLAIN WHAT SHE MEANT*`, `*YOU'RE FAKING IT*` (cyan italic, asterisks) | Cuts about every 1 s | Original audio |
| **30.33** | Teacher pulls his jaw | — | **Red/pink flash** (~0.8 s decay) [C] | — |
| 32.7–36.0 | Teacher at desk | `BUT WHEN HE` / `TRIED IT HIMSELF` / `HE GOT` / `ONE STUCK TOO` | — | VO: "But when he tried it himself, he got one stuck too." |
| **37.93** | Girl laughing | `*LAUGHING*` + **screaming-cat meme** sticker | **Purple/magenta flash** [C] | **Repeating arched pitch sweeps 37.9–38.3**: likely the meme clip's own sound [G] |
| 39.1–41.9 | Teacher hides face, leaves | `*LEAVING THE CLASS*` | — | — |
| **42.0–43.4** | Teacher at door → girl laughing | `TURNING MY LIKE` → `INTO A LAUGHING EMOJI` | **CTA sticker:** white 👍 pops in at 42.3, **morphs into 😆 with red sparkles** 42.7–43.1, back to 👍 by 43.4 [C]. Punch-in ×2.15 at 41.93 | VO CTA + **music swell** from 42.25 [C] |

### Hook
- **First frame** already has: a strange object (giant red candy), a pointing arrow, and the subject's surprised eyes.
- **First words:** "This girl tried a light bulb candy in class, **but it got stuck**". Premise plus problem inside **4 s**.
- **Why it works:** a *physical-stakes* curiosity gap (how do you get it out?), plus a classic **escalation chain**: girl → classmate → teacher. Each step resets the open loop.

### Retention devices
- Rule-of-three escalation, each step announced by the VO.
- **Time-skip flash** (`MOMENTS LATER`) to skip dead time.
- Meme stickers about every 10–15 s as **emotional labels**: sweat, confusion, laughing.
- **Ending:** a CTA that asks for a *like* with a playful visual promise. No loop.

### Pacing
- About 33 edits in 44.9 s → **≈1.36 s average shot** [C].
- Captions are **2–3 words**, a new chunk about **every 0.5–0.8 s** during VO.

---

## V3 · "Cop in danger" (staged dashcam skit, music only)

**Format:** no speech at all. The story is told entirely through captions, arrows, a spotlight, flashes and color washes over music. A persistent **pink dot top-left** sits on every frame (a channel/REC-style marker [G]). A dashcam timestamp is visible.

### Timeline
| Time | Visual | Caption | Edit / effect | Audio |
|---|---|---|---|---|
| 0.00 | Wide: cop leading a handcuffed man | `*COP IN DANGER*` (white **COP**, red-glow **IN DANGER**) + small red ▼ pointer | Starts **punched in ×1.10** [C] | Music from frame 0 [C] |
| 0.4–1.2 | Closer | same | — | — |
| **1.24–1.56** | — | — | **Fade to white** (5 frames), hold 2 frames, fade back into the next shot [C] | **Impact hit at 1.48** (broadband) + whoosh noise 1.5–1.8 [C shape] |
| 1.48–2.72 | Cop clutches chest | **Typewriter:** `*H` → `*HE` → `*HE IS` → `C`…`CHOKING*`, about **1 character per frame** (≈0.4 s total) [C] | **Spotlight / vignette**: frame darkened, bright ellipse on the cop. **Red curved arrow** pointing at him [C] | — |
| **2.72–2.85** | — | — | **White flash** (luma 260, saturation 0) [C] | **Double hit** at 2.78 and 2.85 [C] |
| 3.44–5.5 | Punch-in on handcuffed man's face | `*CRIMINAL*` (cyan glow) | New shot; digital zoom. **White sparkle/bubble particles** at 5.2 [C] | **Music low-passed** (nothing above ~5.5 kHz) from 2.85 to 5.57 = muffled tension [C]. **Two-tone chime** (~1.65 + 1.95 kHz) 4.6–5.35 [C shape, G name] |
| **5.57** | Cop close-up | `HEY!` (green) | Cut | **Full-band music returns** on the cut [C] |
| 6.28–7.6 | Heavy digital zoom on cop (blurry) | `PLEASE, HELP ME!` (**HELP ME!** green) | Punch-in | — |
| 7.64–10.2 | Wide: man runs to the cop | `WHAT'S WRONG?` (cyan) → `UNCUFF ME, QUICK!` (white + cyan) | Caption pinned near the speaker's head [C] | — |
| **10.24** | — | `*HANDS OVER THE KEYS*` (magenta glow) | Re-frame | Hit + brief music dip about 10.35–10.45 [C] |
| 11.68 | Zoom out ×0.69 | `I'VE GOT YOU BRO!` (cyan) | Punch-out [C] | — |
| 13.68 | Punch-in ×1.13 | `*TRYING TO SAVE HIM*` (white + green) | — | Dense drum hits 13.7–15.0; **low-pass again** 14.9–15.8 [C] |
| 17.2 / 17.6 | Close | — | **Red hand-drawn circles** highlighting details (chest badge, ground) [C] | — |
| **18.20–18.9** | Man performs Heimlich | `SAVED` (green glow, appears 1 frame before the flash) | **Green color wash**: ~90% green overlay at 18.24, decaying to clear by ~18.9 [C] | **"Success ding"**: pure **2.65 kHz tone 18.25–19.0** with a 6.9 kHz blip at the attack [C shape, G name] |
| 19.76–21.3 | Cop recovering | `BUT` → `BUT THEN HE` → `BUT THEN HE DID THIS...` (**HE DID THIS** magenta) | Word-by-word build [C] | — |
| **21.40–22.2** | Man holds out cuffed hands calmly | — | **Heart emoji sticker** pops in at ~70% scale, overshoots to 100% within 0.08 s, then dissolves out by ~22.2 [C] | Pop/hit at 21.35 [C] |
| 22.2–23.06 | Hold | — | End | Music |

### Hook
- **Frame 0** is a *title card overlay on live action*: `*COP IN DANGER*`. Three words that promise stakes plus a role.
- By **1.5 s**: the flash, spotlight, arrow and `HE IS CHOKING`. The problem is fully stated with zero dialogue.
- **Why it works:** a role-reversal premise (the *criminal* is the only one who can help). The viewer's unanswered question is *"will he run or help?"*
- `BUT THEN HE DID THIS...` at 19.8 s is a **mini cliffhanger placed right before the final reveal**. It re-hooks people about to swipe at the end.

### Pacing
- About 17 edits in 23.1 s → **≈1.35 s average shot** [C].
- Something new (caption, effect or cut) roughly **every 0.6–1.0 s**.
- The audio filter state (muffled ↔ open) is the main *audio* storytelling tool, since nobody speaks.
