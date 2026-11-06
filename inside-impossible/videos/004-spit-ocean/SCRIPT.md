# 004 — How many times would you have to spit to fill the entire ocean? (HYPOTHETICAL, exaggerated on purpose)

## Narration (29.0 s, Kokoro `af_heart`, speed 1.06 — channel narrator)
> How many times would you have to spit to fill the entire ocean? The ocean holds about one point three billion cubic
> kilometers of water. Say one big spit is a teaspoon. That's two hundred sixty-seven sextillion spits. At one spit per
> second, nonstop, that takes eight quadrillion years. Six hundred thousand times the age of the universe. And your mouth
> only makes about a liter of spit a day. So, call everyone. All eight billion of us, spitting all day, every day, would
> still need hundreds of millions of years. Ready to start?

## Fact check (math shown so anyone can redo it)
| Claim | Status | Source / math |
|---|---|---|
| Ocean ≈ 1.335 billion km³ ("about 1.3 billion") | ✅ | NOAA Ocean Service, "How much water is in the ocean?" (NGDC ETOPO1 volume, Eakins & Sharman 2010) |
| All ocean water = one ball ~1,370 km across (chip) | ✅ derived | r = (3V/4π)^⅓ = (3·1.335e9/4π)^⅓ ≈ 683 km → Ø ≈ 1,366 km (cf. USGS "all Earth's water" sphere, 1,385 km incl. ice/groundwater) |
| One big spit = one teaspoon (5 mL) | 🟡 our stated ASSUMPTION — chip says "ASSUME" | a generous spit; real spits are usually smaller, which only makes the numbers bigger |
| ≈ 267 sextillion (2.67 × 10²³) spits | ✅ math | 1.335e21 L ÷ 0.005 L = 2.67e23 |
| 1 spit/s → ~8 quadrillion years | ✅ math, hedged "eight" (8.46) | 2.67e23 s ÷ 3.156e7 s/yr = 8.46e15 yr |
| ≈ 600,000 × the age of the universe | ✅ math | 8.46e15 ÷ 13.8e9 yr (Planck 2018 / NASA) ≈ 613,000 |
| Your mouth makes "about a liter" of saliva a day (chip: ~0.5–1.5 L) | ✅ hedged | typical adult range 0.5–1.5 L/day (physiology texts; Science Focus, "How much saliva do we produce in a lifetime?") |
| 8 billion people → "hundreds of millions of years" (chip ~300–450 M) | ✅ math, range | 1.335e21 L ÷ (8e9 × 1–1.5 L/day) = 1.1–1.7e11 days = 300–450 million yr (UN: world pop. ≈ 8.2 bn) |
| Drain plug, crowd of clones, beard to the floor | 🟡 visual exaggeration (labelled HYPOTHETICAL) | — |

## Shots (keyed to `src/inside/vo_spit.words.json`, +250 ms)
| # | From | Shot |
|---|---|---|
| 1 | 0 | Max at the edge of a DRAINED ocean (giant bathtub plug + chain, stranded ship, puddles), puffs, spits; the drop falls — HYPOTHETICAL |
| 2 | "The" (2nd) | Earth from space — OCEAN ≈ 1,335,000,000 km³ |
| 3 | "billion" | oceans drain (Earth goes brown), streams of water form one small ball above it — ~1,370 km WIDE |
| 4 | "Say" | close-up: spit lands in a teaspoon — ASSUME 1 SPIT = 1 TEASPOON (5 mL) |
| 5 | "That's" | drops multiply 1 → thousands, giant rolling counter to 267,000,000,000,000,000,000,000 |
| 6 | "At" | time-lapse: machine-gun spitting, days flicker, beard starts — YEAR counter |
| 7 | "that" | wider: white hair, beard to the floor — counter to 8.5 quadrillion |
| 8 | "600,000" | zoom out from Earth to the whole spiral galaxy — UNIVERSE 13.8 BN YRS · YOU ×600,000 |
| 9 | "And" | x-ray head: six glowing salivary glands drip into a 1 L bottle — ~0.5–1.5 L A DAY |
| 10 | "So" | Max clones pop in along the cliff, spit in unison |
| 11 | "all" | aerial: 1,500 spitters along the coast, spit rain down the strata — 8,000,000,000 SPITTERS |
| 12 | "still" | side view of the cliff: water creeps up the rock bands, day/night flicker — STILL ~300–450 MILLION YEARS |
| 13 | "Ready" | hook framing, ocean full again, Max turns to camera, wipes mouth — WOULD YOU HELP? 👇 (loops to 1) |

## Credits
Everything procedural (Max, cliff, seabed, plug, ship, Earth, galaxy, glands). Voice: Kokoro-82M (Apache-2.0).
SFX: our synthesis (`inside-impossible/audio/make_sfx_spit.py`). Music: "Sneaky Snitch" Kevin MacLeod (incompetech.com),
CC BY 4.0 — credit in the description.

## Production log
- Stills pass 1: hook showed no basin, ball off-frame, spoon off-frame, bottle blocking the x-ray, fill shot all sky,
  "camo" water (grey noise used as a normal map → bumpMap).
- Stills pass 2–3: the kit `Cam` hard-coded far = 200 → seabed (≤ 900), stars (400) and galaxy (≤ 1,200) were clipped.
  `Cam` now takes near/far. Screen side: looking down +z, world +x is screen LEFT.
- Stills pass 4: drained seabed read as a blank plane → darker wet sand, puddles, a 2× ship and a giant drain plug in the
  centre of frame; seabed/water planes 4 km with fog so no hard edge.
- Render v1 (925 frames): QA flagged "black" f511–524 — the cosmic zoom had a real dark gap (Earth shrunk, galaxy not
  yet in) → added a glowing Sun, faster pull-out (k^0.7), galaxy-core glow fades in with distance (it showed as a hard
  brown block up close); smaller polar cap; bottle + "≈1 L PER DAY" label brought into frame. Frames 487–640
  re-rendered and spliced; −14.0 LUFS, −1.4 dBFS. Remaining "black" flags (f504–526) are dark space with Earth/Sun/galaxy
  in frame (checked by eye) — false positives of the mean-luma detector.
- Final: `out/inside_004_spit.mp4`, 1080x1920, 30 fps, 30.9 s.
