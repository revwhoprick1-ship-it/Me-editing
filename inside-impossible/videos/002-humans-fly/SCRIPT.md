# 002 — What if every human could fly? (HYPOTHETICAL)

## Narration (26.2 s, Kokoro `af_heart`, speed 1.05 — same narrator as #001 for the channel's voice)
> What if every human could fly? First, you'd need wings six to seven meters wide. Longer than a car. Plus a chest packed
> with flight muscle, like a bird. Even then, scientists think you couldn't flap your way up. You'd mostly glide. Above
> two and a half kilometers, thin air can make you sick. And every kilometer up is about six degrees colder. The sky is
> already crowded. US planes hit over twenty thousand animals a year. Now add eight billion flying people. Would you
> still want wings?

## Fact check
| Claim | Status | Source |
|---|---|---|
| ~6–7 m wingspan for a ~70 kg person | ✅ estimate, hedged "six to seven" | Live Science, "If humans could fly, how big would our wings be?" (Ty Hedrick, UNC, using Nudds' bird-wing scaling: ~6 m / 20 ft); other estimates ~6.7 m |
| Wings longer than a car (chip: car ≈ 4.5 m) | ✅ typical mid-size car ~4.5–4.9 m | general |
| Birds devote a big share of muscle to flight (chip: ~16–18 %) | ✅ | Live Science (same article): "an average of 16% to 18% of their muscle mass" |
| Couldn't flap your way up, would mostly glide | ✅ hedged "scientists think" | Live Science (Hedrick: with wings that large we couldn't flap our way up); the largest known flyer Argentavis likely glided |
| Altitude illness risk above ~2.5 km | ✅ hedged "can" | CDC Yellow Book, High-Altitude Travel (risk from ≥2,450 m sleeping altitude); ISTM fact sheet (2,500 m) |
| ~6.5 °C colder per km | ✅ ("about six degrees") | International Standard Atmosphere lapse rate (6.5 K/km, troposphere) |
| US planes hit >20,000 animals a year (chip: 22,372 in 2024) | ✅ | FAA, Wildlife Strikes to Civil Aircraft in the United States 1990–2024 |
| Eight billion people | ✅ world population ≈ 8.1–8.2 bn | UN World Population Prospects |

## Shots (keyed to words in `src/inside/vo_fly.words.json`, +250 ms)
| # | From | Shot |
|---|---|---|
| 1 | 0 | rooftop, Max's wings burst open — chip HYPOTHETICAL |
| 2 | "First" | full span from 3/4 behind + measuring line — WINGSPAN ≈ 6–7 m |
| 3 | "longer" | wings over a car on the roof, two measuring lines |
| 4 | "plus" | x-ray chest: pectorals swell, a keel grows — BIRDS: ~16–18 % … |
| 5 | "Even" | flapping hard on a field, barely hopping, dust — TOO HEAVY TO FLAP UP |
| 6 | "You'd" (2nd) | gliding over clouds from above — SO… YOU GLIDE |
| 7 | "Above" | climbing through clouds, altimeter, face turns green — SICKNESS RISK |
| 8 | "and" (2nd) | high and cold: frost, breath puffs, km/°C counter |
| 9 | "The" | airliner + bird flock — THE SKY IS ALREADY BUSY |
| 10 | "hit" | engine close-up, bird strike flash + feathers — FAA 22,372 |
| 11 | "Now" | airliner in a swarm of flying people — + 8,000,000,000 FLYERS |
| 12 | "Would" | rooftop, wings fold, Max looks at you — WOULD YOU? 👇 (loops to 1) |

## Production log
- Stills pass 1: wings read as a "fence" (straight edge + hanging feathers) → arched leading edge, 30 longer overlapping
  feathers + coverts, tone variation; skyline lowered; clouds moved off the climb camera; glide camera moved above.
- Render v1 QA clean, but the viewer pass found black skies in the car and swarm shots (declarative background detached
  on shot swaps; stills can't show it) → imperative `<Env/>`; airliner camera pulled back, birds larger. Verified with a
  `--frames` transition render.
- Final v2: 1080x1920, 30 fps, 27.4 s; no black/white/frozen frames; pops only on cuts + the strike flash; −14.1 LUFS,
  −1.2 dBTP. `out/inside_002_fly.mp4`.
- Still weak: the airliner reads small/side-on in the "sky is busy" shot (birds barely visible).
