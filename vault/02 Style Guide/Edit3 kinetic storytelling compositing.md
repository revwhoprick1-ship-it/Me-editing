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

## Sound design checklist
- Whoosh (fast-whoosh) on every cut; a pop/click per kinetic word.
- **Music drop-out about 0.2 s before the punchline**, then a bass-boosted vine boom.
- A riser (cinematic-suspense-riser) timed so its peak lands on the reveal.
- Boom on the reveal, plus a 2-frame white flash and a camera shutter.
- Literal foley for the story:
  - pen scribble on writing (`sfx/pen-scribble.mp3`, synthesized);
  - phone buzz on the call (`sfx/phone-buzz.mp3`, synthesized);
  - clicks for counters and stamps;
  - ding-2 on "GOATED".
- Music follows the mood (funny → Du bist gut genug): ducked to about 0.11 under speech, about 0.28 in gaps, a swell on the ending.
- An alimiter pass after the render.
