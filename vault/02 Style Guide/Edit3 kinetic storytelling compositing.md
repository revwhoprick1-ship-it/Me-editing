# Edit3: kinetic type + motion-design storytelling + cinematic compositing

User request (2026-10-26) after the Edit2 v2 test got only **38% stayed-to-watch**: "maybe it looks like an AD and the hook sucks". Combine three styles:
1. **Kinetic typography**: big, expressive text synced to the important words.
2. **Motion-design storytelling**: graphics, animated stats, 3D objects and B-roll that show what the speaker says.
3. **Cinematic compositing**: the speaker interacts with graphics, photos and text moving through the frame (text and photos BEHIND the person).

First build: `src/E3Ant.tsx` (composition `E3Ant`). Clip: t1_tiger_auto_pen, the Anthony Richardson "auto looks like an ant" roast into Trevor's Peyton Manning story. The arena run picked this clip in 11 of 16 plans.

## What made the last one feel like an ad (avoid)
- A title card / headline banner on top ("How an NFL QB knows…"), white UI panels, chips and a "tagline" polaroid outro.
- Calm piano music.
- The hook opened on setup instead of the funniest/strongest line.

## Rules that came out of it
- **Cold open on the strongest line**, with no banner. Every hook word is typed big (the hook IS the typography). The punchline lands by about 2.5 s.
- **Text behind the speaker's head** (person mattes, `scripts/person_matte.py` → `public/matte/<clip>/`). Place words low enough that the hair or cap covers part of them, but keep the key word readable.
- **One story graphic per idea**, tied to the words:
  - autograph slab with letters written in on the beat;
  - zoom plus a measuring bar "for scale" next to an ant;
  - real-card B-roll from the same video on a 3D-tilted panel;
  - 3D gold pen;
  - MVP counter;
  - an incoming-call phone for "he called me";
  - the signature written out with a pen at the payoff.
- **Photos composited into the scene**: the person being talked about rises behind the speaker (Richardson, then Peyton).
- **Camera**: snap punch-ins on punchlines, decaying shake on impacts, a whip smear on every cut, grain plus vignette, a slightly warm grade.
- **Cut dead air hard.** Re-transcribe unclear lines (faster-whisper; pass a numpy array, since the file-path input breaks on this av version). Remove garbled parts instead of captioning them wrong.
- Captions stay in **one fixed spot** (y=1560). Hide them only while kinetic text already says the same words (the hook, B-roll).

## No loud booms (user, 2026-10-26)
"Don't use that super loud BOOM sound." The **bass-boosted vine boom is banned**. Impacts are soft: mg-boom / 808 at 0.16–0.2 at most. Let the music drop and the camera shake carry the hit.

## Batch: 6 clips, each a different world (user: "each output should be unique, not mass produced")
Code: `src/e3/kit.tsx` holds only the plumbing (timeline with freeze holds, face cam + mattes, captions, sound tracks). Each clip has its own file with its own concept, palette, fonts, caption style, transition and music:
| clip | file | concept | type | transitions | music |
|---|---|---|---|---|---|
| t3 rollout-left | `e3/Lefty.tsx` | chalkboard X's & O's split screen, sepia flashback, mirror flip, chalk tallies | Anton + Caveat | smear left | Funk Sigilo (drop on LEFT) |
| t4 natty ticket | `e3/Ticket.tsx` | 3D ticket printed/stamped/signed, empty frame filled at the end | Playfair + Courier, typed captions | soft zoom | Blue W Speed freeze at 58.27 s |
| t2 golf foursome | `e3/Foursome.tsx` | scorecard filling in, heaven rays, Tiger behind Trevor, 15 majors counter, ball-in-cup iris | Cormorant + Archivo Black + pencil | vertical | Du bist (full) 42.5 s drop |
| u2 PSA-10 celly | `e3/Celly.tsx` | LED dot-matrix, CELLY CAM jumbotron, celly meter 0→10, gem-mint scale, confetti | Bungee + VT323 | zoom | Du bist (full) 83.8 s drop |
| t5 true gold | `e3/TrueGold.tsx` | gold refractor card, prism sweep, RGB glitch twist, HINES- name morph | Unbounded + Space Grotesk | spin + glitch | Du bist (full) 2.0 s drop |
| u1 playbook | `e3/Playbook.tsx` | blueprint: install progress bar, route tiles, inventory wall → THIS WEEK | Oswald + Space Mono, boxed captions | scanline | Montagem Pegadora 15.7 s drop |
Synthesized foley in `public/sfx/`: chalk-scratch, projector, paper-tear, scan-beep (plus pen-scribble, phone-buzz).

## Sound design checklist
- Whoosh (fast-whoosh) on every cut; a pop/click per kinetic word.
- **Music drop-out about 0.2 s before the punchline**, then a soft impact (mg-boom ≤ 0.2; the bass-boosted vine boom is banned).
- A riser (cinematic-suspense-riser) timed so its peak lands on the reveal.
- Boom on the reveal, plus a 2-frame white flash and a camera shutter.
- Literal foley for the story:
  - pen scribble on writing (`sfx/pen-scribble.mp3`, synthesized);
  - phone buzz on the call (`sfx/phone-buzz.mp3`, synthesized);
  - clicks for counters and stamps;
  - ding-2 on "GOATED".
- Music follows the mood (funny → Du bist gut genug): ducked to about 0.11 under speech, about 0.28 in gaps, a swell on the ending.
- An alimiter pass after the render.

## Edit3 on black bars (Trevor podcast clips, batch 3)
User: "still use the black bars with a normal caption." `src/e3/bars.tsx`:
- a video box at y 390–1540, with a **plain top caption** above it (Montserrat 800, 54 px, white, plus one iOS emoji);
- spoken captions inside the box at 66 % of its height;
- all Edit3 graphics live **inside the box** (words behind the speaker via matte, story graphics) or in the **bottom bar** (y 1540+).

The bottom bar is never left empty. It always carries a story graphic that builds through the clip: a read-progress ring, a slot reel, a crowd-noise meter, a postcard map.

## Edit3 card pulls (batch 3)
`src/e3/cardkit.tsx`:
- `cardTimeline(hookMs, segs)`, which supports slow-mo segments (`rate`);
- `HookView` for the hooks-folder clip, with its burned caption blurred;
- `StreamView`;
- `Blurs`, which keeps the card blurred until the reveal;
- `HostAudio`, which ducks the hosts under Alex and mutes them in slow-mo;
- `Narration` / `narrCaps`, which place lines by hand.

Each card gets a world taken from the card itself: a comic for the Kaboom insert, a museum for the presidents cut auto, binder plus odds grid for the Pokémon god pack, a space-mission HUD for Buzz.

The stream's burned-in banner is **covered by our own themed bar**: a velvet rope, a mission checklist. Put that bar **inside the camera transform**, so it stays on the banner through zooms. Keep its content padded about 130 px from the edges, so a 1.25× zoom doesn't crop it.

**No spoilers before the reveal.** That covers the name in any HUD or checklist too: encrypt it (`#*$# 1/1`) and decode it on the name.

**Captions:** `Captions` now picks the latest-starting cap, so mixed narration/host lists don't need sorting. Turn captions off wherever the kinetic text already says the same words.
