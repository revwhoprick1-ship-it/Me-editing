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
- Music: **one meme song looped through the whole video, loud** (currently `du-bist-gut-genug.mp3`).

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
- **Workflow**
  - [[Edit workflow]]: step by step, from Drive link to rendered MP4
  - [[Environment notes]]: cloud-box gotchas (blocked hosts, Chrome path, fonts)
- **Projects**
  - [[NBA GOAT pick]]: Trevor Lawrence podcast clip: seat map, verified timings, **feedback log**
  - [[Cooper Flagg Arrivals 1-1]]: card pull from the sheet

## Quick start (new session)
1. Read [[NBA GOAT pick]] (feedback log) and [[Caption style]].
2. `npm install` (and `pip install faster-whisper` if transcribing).
3. Download the footage to `public/input.mp4` (see [[Edit workflow#1. Get the footage]]).
4. Change `src/edit.ts`, then render (see [[Edit workflow#4. Preview & render]]).

## Repo layout
| Path | What |
|---|---|
| `src/edit.ts` | the edit decision list: cuts, shots, captions, SFX, music (all in source ms) |
| `src/ShortEdit.tsx` | the Remotion renderer for that list |
| `scripts/transcribe_words.py` | faster-whisper word timestamps → `public/words.json` |
| `scripts/speech_segments.py` | real speech on/off times from the audio (to fix whisper timing) |
| `public/emoji-ios/` | Apple emoji PNGs (160 px) |
| `public/sfx/`, `public/music/` | sound effects and royalty-free music |
| `vault/assets/research/` | contact sheets of the 50 analysed Shorts + the hashtag pool |
| `vault/assets/references/` | full-res frames of the two reference Shorts |
