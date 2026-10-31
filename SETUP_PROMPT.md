You're taking over my Shorts editing system. Set it up completely, learn every editing style in it, and then tell me which styles you have available. Work in Claude Code (claude.ai/code cloud session or desktop), with Network access set to "Full".

## 1. Get the system
- Clone https://github.com/revwhoprick1-ship-it/Me-editing and check out the branch `claude/remotion-whisper-video-edit-iz6rt2`. Everything lives there: the Remotion project, the scripts, the sounds, music, fonts and emoji, and the `vault/`.
- Read `vault/START HERE.md` first, then EVERY note it links to:
  - Research: 50-Shorts analysis, hooks and retention, editing playbook, Reference Shorts A–C, refs D–G, W speed edits.
  - Style Guide: Caption style, SFX and music library, Card pull playbook, Motion graphics podcast style, Edit3 kinetic storytelling compositing, Jorho style.
  - Workflow: Edit workflow, Environment notes.
  - Projects: the batch notes and their feedback logs.
  The vault is the memory and the rulebook. Follow it over your own defaults, and add to it whenever I give new feedback (new rules go in `START HERE.md` → User preferences, with the date).

## 2. Install the tools
- `npm install`.
- Python: `pip install faster-whisper opencv-python rembg[cpu] librosa soundfile numpy pillow`. For reference analysis, also install CPU torch from https://download.pytorch.org/whl/cpu, then `pip install demucs`.
- ffmpeg must be on PATH.
- Remotion needs Chrome. In a cloud box, pass the preinstalled headless shell with `--browser-executable=…` (see `vault/03 Workflow/Environment notes.md`).
- Copy the render helpers into a scratch folder:
  - stills: one frame per ms timestamp, tiled 6x2;
  - render: `npx remotion render src/index.ts <Comp> out/raw_x.mp4 --concurrency=4`, then `ffmpeg -i raw -c:v copy -af alimiter=limit=0.89:level=disabled -c:a aac -b:a 192k out/x.mp4`.
- Smoke test: render a still of `B3PreSnap` or `JorhoGolf`, once footage is in place.

## 3. Footage and assets that are NOT in git (big files, gitignored)
- Source clips go in `public/pod/`, `public/pod2/`, `public/b3/`, `public/cards*/` and `public/hooks/`. I'll give you the Google Drive links. Download one file at a time with `scripts/drive_dl.sh` (parallel pulls get blocked).
- Transcripts (`src/plans/data/*.words.json`) and seat tracks (`*.seats.json`) ARE in git.
- YouTube video/audio can't be downloaded from cloud boxes (bot check). Don't try to bypass it. I'll drop reference videos on Drive.
- Sound effects: get them from **myinstants.com**, never synthesize your own.
- Pictures for meme cut-outs: grab them from anywhere (team sites, ESPN headshots, `static.clubs.nfl.com`, Wikipedia), then cut them out with rembg `u2net_human_seg`.
- ElevenLabs narration (card pulls only): needs the ElevenLabs connector. Use ONLY voice "Alex – Young American Male" `yl2ZDV1MzN4HbQJbMihG`, model eleven_v4, made loud with `scripts/prep_narr.py`.

## 4. How I want every job done (short version; the vault has the details)
- Each Short is 15–25 s and ends on a finished sentence.
- Every video is sent to me as a file, with a **title + a 3–5 sentence story description + 8–15 hashtags**.
- Everything must be unique, not look like an ad, not look "vibecoded", and have a strong hook.
- iOS emoji only. whoosh = fast-whoosh, ding = ding-2. **No loud bass-boosted vine boom.**
- Podcasts:
  - face-track only the speaker; captions stay in one fixed spot;
  - mood music: funny → Du bist gut genug, wholesome → Blue (Yung Kai) W-speed edit, serious → phonk;
  - never use hook clips in podcasts.
- Card pulls:
  - open with a hook clip, and blur the card until the reveal;
  - never name the player before the reveal;
  - build suspense, then a shocking reveal with the phonk drop on it;
  - Alex narration.
- Before rendering, check stills for overlaps, text running off the frame and wrong timing. After rendering, check duration, `volumedetect` and a contact sheet. Commit and push when done.

## 5. When setup is finished
Reply with:
1. what's installed and what's missing (footage, connectors);
2. a list of **every editing style** in the system, each with one line on what it is, when to use it, and where the code and vault note live.

The list should cover at least these:
- **Edit1 – Motion-graphics podcast** (`src/MotionPod.tsx`, `ShortEdit.tsx`; "Motion graphics podcast style"): Ref C black-bar podcast layout, glow captions, keyword colors, punch-ins, tracked red circle, cut-outs of people mentioned, meme SFX, mood music.
- **Card pull** (`src/CardPull.tsx`, `src/plans/card/`; "Card pull playbook"): stream card pulls with a hook clip, white-banner hook, whip transitions, tracked red circle and arrow, blurred card, suspense build, green-flash/money/ka-ching reveal, "1 OF 1" stamp, Alex narration, phonk drop.
- **W Speed edit** ("W speed edits"): the wholesome podcast version. Freeze with a gray overlay on Blue's "I'd imagine we fell in love", typed *ACTION TEXT* with keyboard SFX, "W TREVOR ❤️‍🩹".
- **Edit2** (`src/Edit2.tsx`, `E2Coverage.tsx`): the second-generation podcast edit.
- **Edit3 – Kinetic typography + motion-design storytelling + cinematic compositing** (`src/e3/kit.tsx` + one file per clip; "Edit3" note): every clip is its own world (chalkboard, ticket, scorecard, LED, blueprint…), text behind speakers via person mattes, a story graphic that builds, no loud booms.
- **Edit3 on black bars** (`src/e3/bars.tsx`): Edit3 for Trevor podcast clips with black bars and a plain top caption, plus a bottom-bar story graphic.
- **Edit3 card pulls** (`src/e3/cardkit.tsx`, `src/e3/cards/`): a themed world per card (comic, museum, binder/odds, space HUD), hook clip, blur until reveal, Alex narration, phonk drop.
- **Jorho** (`src/jorho/kit.tsx`, `clips.tsx`; "Jorho style", measured frame by frame from 4 reference Shorts):
  - black frame, centered 1077 px box that opens in the first 24 frames from blown-out and blurred, Montserrat Bold top line ending in 💀, one-word captions (yellow/cyan/green/white) with a 2-frame smear;
  - 11-frame white strobe as the cut, green rgb(167,234,4) and red rgb(244,3,5) tints at 62 %;
  - meme cut-out with a yellow outline that blinks out;
  - censor-beep pause before a name;
  - myinstants SFX: proper ding, camera flash sound effect, roblox swoosh hd, censor beep;
  - music about 10 dB under the voice, strobes on the beat.

Then wait for my first clip.
