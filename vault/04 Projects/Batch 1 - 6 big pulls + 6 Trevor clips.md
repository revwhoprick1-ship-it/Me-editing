---
tags: [project, batch, card-pull, podcast]
date: 2026-10-24
---
# Batch 1: 6 Historical Big Pulls + 6 Trevor Lawrence clips

User ask: "Check Historical Big Pulls and Trevor Lawrence clips. Make sure the downloads go through (batch downloads might get blocked). Select 6 from each and edit them… following my preferences… don't make the same mistakes… send proper titles and descriptions."

Sheet: `1eX0vqF73N9x2gtkRbalnKMHRd3nbd-CEv0Rt4D2glM4`. Tabs: Historical Big Pulls `gid=1203111212`, Trevor Lawrence Clips `gid=1029565171`. Export with `.../export?format=csv&gid=<gid>`.

## How it was built (reuse this)
- **Downloads:** `scripts/drive_dl.sh`. One file at a time, retry, and check the size and that ffprobe reads it. Never run parallel Drive pulls.
- **Transcribe:** `scripts/batch_transcribe.py` (faster-whisper **distil-large-v3**, beam 1; large-v3 is too slow on 4 CPUs). It writes `footage/work/*.words.json` and `*.segs.txt`, which are then copied to `src/plans/data/` because footage/ is gitignored.
- **Plans:**
  - One file per clip.
  - Card pulls: `src/plans/card/<name>.ts` → `makeCardPlan()`.
  - Podcasts: `src/plans/pod/<name>.ts` → `makePodPlan()`.
  - `node scripts/use-plan.mjs card|pod <name>` points `src/activeCard.ts` / `src/activePod.ts` at the plan.
- **Render:** `scripts/render_card.sh <name>` / `scripts/render_pod.sh <name>` (Remotion, then an `alimiter` pass). Check contact sheets first with `scripts/stills.sh`.
- **Narration:** ElevenLabs, Alex voice only. Make **one call at a time, a few minutes apart**: parallel calls trip the "unusual activity / free tier disabled" block. Then run `scripts/prep_narr.py` to get the loud version and a 5-line JSON.
- **Tracking:** `scripts/track.py` (CSRT), checked with `scripts/track_check.py`.
- **Cut-outs:** Wikipedia summary API → `rembg` (isnet-general-use) → `public/cutouts/`. Wikimedia rate-limits (429), so fetch one at a time with sleeps.
- **Podcast speaker map:**
  - `scripts/seat_motion.py` (motion energy per seat) narrows down who is talking, combined with reading the transcript.
  - Seat x positions differ per clip, so use the `seats` override in `makePodPlan`.

## Card pulls (Historical Big Pulls)
| Out file | Card | Reveal (src ms) | Notes |
|---|---|---|---|
| lebron.mp4 | LeBron James Triple Logoman 1/1, $2.4M | 47000 | 1920x1080 split: hosts left, Whatnot phone right |
| clark.mp4 | Caitlin Clark Gold Vinyl auto 1/1, $234K | 16000 | PiP hosts |
| dart.mp4 | Jaxson Dart Pink Papa auto 1/1, $200K+ | 40500 | burned-in banner covered by ours |
| kon.mp4 | Kon Knueppel Papa auto 1/1, $100K | 22600 | |
| wemby.mp4 | Wembanyama Champ Tag auto 1/1, $170K+ | 3300 | single camera, hosts muted pre-reveal (they say the name) |
| cade.mp4 | Cade Cunningham Logoman auto 1/1, $27K+ | 56800 | single camera, `hookBlur` hides the card in the hook |

## Trevor Lawrence clips (podcast layout)
| Out file | Clip | Punch | Cut-outs |
|---|---|---|---|
| t1_tiger_auto_pen.mp4 | crew rates Trevor's autograph, roasts Anthony Richardson's ("looks like an ant") | 16.1 s ANT 🐜 | Anthony Richardson |
| t2_dream_golf_four.mp4 | dream golf partner = Tiger → gifted a Tiger game-worn patch auto | 86.0 s TIGER 😱 | Tiger Woods |
| t3_traveling_trevors.mp4 | Trevor on his superfans ("these guys are whacked") | 83.0 s 💀 | none |
| t4_natty_ticket.mp4 | gifted a signed ticket from his own national title game | 80.3 s MILLION 💰 + cha-ching | none |
| t5_ex_teammate.mp4 | Trevor rips a true gold Josh Allen (now Hines-Allen) card | 22.7 s HINES 🤣 | Josh Hines-Allen |
| t6_davis_mills.mp4 | Grant roasts Davis Mills ("longer neck than Mike Glennon") | 6.9 s EW 💀 | Mike Glennon |

Cut-out photo credits (Wikimedia Commons):
- Tiger Woods: White House photo by Molly Riley (public domain, US Gov).
- Josh Hines-Allen: Joe Glorioso / All-Pro Reels.
- Anthony Richardson: NFL Combine (cropped).
- Mike Glennon: Mike_Glennon.JPG.
- Peyton Manning and Davis Mills: no photo; the API rate-limited.

## Titles + descriptions (sent to user)
See the chat message from 2026-10-24. Rules used:
- **Card titles never name the player.** Same curiosity rule as the video: value + "who is it?". The player name goes in the description/hashtags for search.
- Podcast titles name Trevor (he is the search draw) plus the funny beat.
- 3–5 hashtags, first line of the description is the hook.

## Feedback log
- (waiting on user feedback for this batch)
