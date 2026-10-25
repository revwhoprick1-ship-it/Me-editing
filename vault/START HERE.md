---
tags: [index]
---
# START HERE

This repo is a **Remotion + Whisper Shorts editing setup**, and this `vault/` folder is its memory (open it in Obsidian, or just read the Markdown). A new session should read this file first, then follow the links.

## What the user wants
Edit podcast/streamer clips into viral vertical Shorts in a **meme / brainrot clipping style**, copying the references they gave and the patterns from researching 50 top Shorts. They give feedback on each version, so check the feedback log in the project note before editing again.

## User preferences
- **Always send the finished video file directly in chat** (SendUserFile) so they can download it.
- iOS emoji only; Ref A glow font; whoosh = `fast-whoosh.mp3`, ding = `ding-2.mp3`.
- Music: **podcasts** → one meme song looped, loud (`du-bist-gut-genug.mp3`). **Non-podcasts** → the user's slowed Brazilian phonk list, drop timed to the big reveal (see [[SFX and music library#Music for NON-podcast clips (user's phonk list)]]).
- **Blur (and/or beep) cards until they're revealed**: makes viewers curious who was pulled. Don't name the player in the banner/hook before the reveal.
- Red circle must **really track** the face: use `scripts/track.py` (OpenCV CSRT), never hand-guessed keyframes.
- Add small punch-in zooms on key words (1.1–1.18×), only the relevant part of the frame.
- Big reveal = **green screen flash + falling money (💵💸💰) + ka-ching**, and it has to be **shocking**: white flash, shake, zoom slam, "1 OF 1" stamp. Before it, **build suspense** (slow-mo, heartbeat, riser, trembling zoom, vignette, "WAIT FOR IT", music cut right before the drop).
- **AI narration** (ElevenLabs) on card pulls, **ONLY the "Alex - Young American Male" voice** (`yl2ZDV1MzN4HbQJbMihG`); see [[Card pull playbook#AI narration]].

- **Length: every Short 15–25 s** (30 s is too long, never under 15 s; go a bit over only if the moment really needs it). (2026-10-25)
- **Card edits: open with a hook clip from the user's hooks folder** (Drive `1DnNI_zX5q7eWpiDOP75SnCMDWNC5xYkI`, local `public/hooks/`). (2026-10-25)
- **Music variety: don't reuse one song for every video.** Rotate through the user's phonk list for card pulls. Podcast music by mood:
  - funny → Du bist gut genug;
  - wholesome → "Blue" (Yung Kai), edited as a **W speed edit** in our usual style;
  - serious → phonk. (2026-10-25)
- **Podcast captions stay in ONE fixed spot** (66% down the video box). Never move them per shot; covering a face sometimes is OK. (2026-10-25, replaces the earlier "under the faces" rule)
- **Podcast: motion-track the speakers**: the crop follows the face of whoever is talking, never random people in the background. `scripts/seat_track.py` only accepts faces near the seat and at seated head height. When people walk around, use wide shots instead. (2026-10-25)
- **Hook clips are ONLY for card pulls**, never in podcast videos. (2026-10-25)
- **W Speed edits:**
  - freeze the screen (`scripts/insert_freeze.py`) and put a **gray overlay** on it;
  - the "W TREVOR ❤️‍🩹" caption lands on Blue's **"I'd imagine we fell in love / under moonlight skies with you"** (song 55.7–65.4 s; the freeze starts on 59.9 s);
  - the narrated action text (*TREVOR WALKS IN*) gets a **keyboard typing SFX** (`sfx/keyboard-typing.mp3`). (2026-10-25)
- **Let the speaker finish the story before the video ends.** End cuts on a finished sentence, even if it runs a bit past 25 s. (2026-10-25)
- **ElevenLabs retries: don't wait long.** If a call is rate-limited, retry after a couple of minutes, not 15–30. On 2026-10-25 an immediate retry worked and two back-to-back calls went through. (2026-10-25)
- **Podcast clips:** use the Ref C layout (black bars, video box, plain top caption "Do you agree with this? 💀", cut-out photos of people mentioned) **on top of** our normal edit style. See [[Reference Shorts#Ref C: podcast layout (user: "for podcast style videos make it like this")]].

- **Card pulls (stream clips from the Backyard Breaks sheet):** follow [[Card pull playbook]] (white banner hook, whip transitions, tracked red circle + arrow, card title stack with price).

## Map
- **Research**
  - [[Shorts analysis - 50 clips]]: the 50 Shorts, views, format, hook and edit notes for each
  - [[Hooks and retention]]: how they hook and keep viewers watching
  - [[Editing playbook]]: what SFX, effects and memes go when and where
  - [[Reference Shorts]]: Refs A–C (A = same show as their footage, C = podcast layout)
  - [[Card pull and clip refs D-G]]: SFX, red circle/arrow tracking, transitions (round 2 training)
- **Style guide**
  - [[Caption style]]: font (Montserrat 800 + glow), keyword colors, iOS emoji
  - [[SFX and music library]]: every sound/music file, when to use it, licensing
  - [[Card pull playbook]]: template for card-pull stream clips
  - [[Motion graphics podcast style]]: kinetic-type / card / UI-scene edit (experiment, `src/MotionPod.tsx`)
- **Workflow**
  - [[Edit workflow]]: step by step, from Drive link to rendered MP4
  - [[Environment notes]]: cloud-box gotchas (blocked hosts, Chrome path, fonts)
- **Projects**
  - [[NBA GOAT pick]]: Trevor Lawrence podcast clip: seat map, verified timings, **feedback log**
  - [[Cooper Flagg Arrivals 1-1]]: card pull from the sheet
  - [[Batch 1 - 6 big pulls + 6 Trevor clips]]: 12 Shorts from the sheet, how the batch pipeline works, titles/descriptions

## Quick start (new session)
1. Read [[NBA GOAT pick]] (feedback log) and [[Caption style]].
2. `npm install` (and `pip install faster-whisper` if transcribing).
3. Download footage one file at a time with `scripts/drive_dl.sh` (parallel Drive pulls get blocked).
4. Transcribe with `scripts/batch_transcribe.py`.
5. Write a plan:
   - card pull → `src/plans/card/<name>.ts` with `makeCardPlan`;
   - podcast → `src/plans/pod/<name>.ts` with `makePodPlan`.
   Copy an existing plan as the template.
6. Check stills (`scripts/stills.sh`), then render with `scripts/render_card.sh <name>` / `scripts/render_pod.sh <name>`.
7. Send the MP4s in chat, plus titles and descriptions (see [[Batch 1 - 6 big pulls + 6 Trevor clips#Titles + descriptions (sent to user)]]).

## Repo layout
| Path | What |
|---|---|
| `src/plans/pod/*.ts` | podcast edit plans (`make.ts` = `makePodPlan` factory: captions, shots, SFX, music from a short spec) |
| `src/plans/card/*.ts` | card-pull edit plans (`make.ts` = `makeCardPlan` factory: suspense, reveal, narration, banner) |
| `src/activePod.ts`, `src/activeCard.ts` | which plan renders; switch with `node scripts/use-plan.mjs pod\|card <name>` |
| `src/ShortEdit.tsx`, `src/CardPull.tsx` | the Remotion renderers (podcast layout / card-pull layout) |
| `scripts/drive_dl.sh`, `batch_transcribe.py`, `prep_narr.py`, `track.py`, `seat_motion.py`, `stills.sh`, `render_*.sh` | batch pipeline (see [[Batch 1 - 6 big pulls + 6 Trevor clips#How it was built (reuse this)]]) |
| `scripts/transcribe_words.py` | faster-whisper word timestamps → `public/words.json` |
| `scripts/speech_segments.py` | real speech on/off times from the audio (to fix whisper timing) |
| `public/emoji-ios/` | Apple emoji PNGs (160 px) |
| `public/sfx/`, `public/music/` | sound effects and royalty-free music |
| `vault/assets/research/` | contact sheets of the 50 analysed Shorts + the hashtag pool |
| `vault/assets/references/` | full-res frames of the two reference Shorts |
