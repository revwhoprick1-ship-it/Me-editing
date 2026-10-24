---
tags: [workflow]
---
# Edit workflow (repeatable)

Back to [[START HERE]] · Environment gotchas: [[Environment notes]]

## 1. Get the footage
- Put the source at `public/input.mp4`. (Not committed: `.gitignore` skips `public/*.mp4`.)
- From Google Drive: `curl -L -o public/input.mp4 "https://drive.usercontent.google.com/download?id=<FILE_ID>&export=download&confirm=t"`
- Look at it: `ffmpeg -i public/input.mp4 -vf "fps=1,scale=640:-1,tile=3x7" -frames:v 1 sheet.jpg` and note who sits where (x position in the 1920-wide frame).

## 2. Transcribe and fix timing
1. `python3 scripts/transcribe_words.py public/input.mp4` → `public/words.json` (faster-whisper large-v3, word timestamps).
2. `python3 scripts/speech_segments.py public/input.mp4` → where sound really starts/stops (20 ms).
3. **Whisper is often 0.2–2 s early on the first word after a pause** (it put "who" in silence, and "Gotta be…" 2 s early in the old whisper.cpp run). For each phrase, snap the first word to the real onset from step 2 and stretch the rest of the phrase's words to fit before the next silence.
4. Fix spellings of names (e.g. "Delvedova" → "DELLAVEDOVA").
5. Write the final word list (ms) into `src/edit.ts`.

## 3. Plan the edit (in `src/edit.ts`, all times in SOURCE ms)
- `CUTS`: source ranges to keep (dead air removed or shortened).
- `SHOTS`: layout per moment (close-up crop on speaker / stacked / wide / B&W).
- `CAPTIONS`: chunks of words + keyword colors + emoji.
- `SFX`, `MUSIC`, `HOOK` (+ title swap at the twist), punchline effects.
Follow [[Hooks and retention]] and [[Editing playbook]].

## 4. Preview & render
- `npm run studio` (local preview).
- `npm run render` → `out/edited.mp4`. In the cloud box add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.
- Check frames: `ffmpeg -i out/edited.mp4 -vf "select='eq(n\,100)+eq(n\,300)',scale=270:-1,tile=2x1" -vsync 0 -frames:v 1 check.jpg`.
- Copy to `edited.mp4` at repo root, commit, push.

## 5. Log feedback
Add what the user said to the project note in `04 Projects/` so the next session doesn't repeat mistakes.
