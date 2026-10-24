---
tags: [project, card-pull]
status: v1 sent
---
# Project: Cooper Flagg Arrivals 1/1 (Topps Finest, $13,725)

Back to [[START HERE]] · Template: [[Card pull playbook]] · Refs: [[Card pull and clip refs D-G]]

- Sheet: Backyard Breaks clip sheet → tab **🏆 Historical Big Pulls**, row "Cooper Flagg Arrivals 1/1", value 13,725 USD, hype ⚡ HIGH.
- Drive id `1BsfycKV19D3637gjKAX_j2CHn-2sXSle` → `footage/flagg_arrivals.mp4` (also copied to `public/flagg/input.mp4`; neither is committed). 1080×1920, 30 fps, 45.9 s, already the stream layout.
- Plan: `src/flagg.ts` · Renderer: `src/CardPull.tsx` (composition `CardPull`) · `npm run render:card` → `out/flagg_edit.mp4` → copy to `flagg_edit.mp4`.

## What happens in the source
| Source | |
|---|---|
| 0–8 s | ripping, "come on, come on" (quiet mic, ~-25 dB) |
| 9–12 s | Joan Beringer, Larry Bird |
| 13–18 s | VJ Edgecombe "First", "nice hit there, going to the Sixers" |
| 29.0 s | **Arrivals Cooper Flagg 1/1 swipes in** (clean still at 29.7 s → `public/flagg/card.png`) |
| 30.0 s | "oh my gosh" |
| 31.3–37 s | host in the white tee jumps/screams ("one of one!", "let's go") |
| 41–44 s | "this is why Antoine stayed in the room" |

## v1 (28.5 s)
Hook (screams + "ONE OF ONE!", tracked red circle, card + title) → whip → rips with name captions + dings → "*NEXT CARD...*" → reveal: card-cam punch-in 1.5×, red arrow jabbing at the printed 1/1, title stack COOPER FLAGG / ARRIVALS 1/1 / $13,725 (vine boom, ding, cha-ching) → reaction layout: hosts cam enlarged with red circle tracking the white-tee host + arrow, our white banner, big card still + title, air horn + crowd cheer → "KEEP IT OR SELL IT? 🤔" from 40 s.
Banner: "ONLY **1** OF THIS **$13,725** / COOPER FLAGG ROOKIE!" covers the burned-in banner.

## Feedback log
1. **v1 → v2** user: blur/beep cards before they're revealed (curiosity) · fix the tracking · add a few appropriate zooms · non-podcast music = their phonk list, timed to the reveal · green flash + falling money overlay + ka-ching at the reveal.
   - Cards blurred (with ❓) until named: Joan Beringer, Larry Bird, and the Flagg card from 28.95 s until the reveal at 29.4 s. Hook shows the card blurred with "WHO IS IT? / 1/1 / $13,725"; banner says "ROOKIE... WHO IS IT? 👀" until the reveal, then "COOPER FLAGG ROOKIE! 💎".
   - Tracking redone with `scripts/track.py` (CSRT head + torso fallback); the old hand keyframes were ~80 px off.
   - Zooms on COME ON / names / NICE HIT (card cam only) and ONE OF ONE / LET'S GO / GOSH (hosts cam).
   - Montagem Alquimia: intro build under "*NEXT CARD...*", drop on the reveal; green flash + 💵💸💰 rain + ka-ching + vine boom on the same frame.
   - No audio beep added: no player name is said before its card is shown.
2. **v2 → v3** user: no suspense before the reveal, the reveal isn't shocking, use AI narration.
   - Added the suspense build + impact from [[Card pull playbook#Suspense → reveal recipe (user: "no suspense", "reveal isn't shocking", v3)]]. Output is now 30.0 s; the reveal is at 14.0 s.
   - AI narration: `public/flagg/narration/full.mp3` (5 lines), placed by `NARRATION` in `src/flagg.ts`.
3. **v3 → v3.1** user: narration too quiet → compressed + loudnormed it (-11 LUFS); hosts 18 % and music 0.06–0.09 under it; air horn/crowd lowered.
4. User: **only use the Alex voice** → regenerated with "Alex - Young American Male" (`public/flagg/narration/alex.mp3`, loud version `alex_loud.mp3`), re-timed.
