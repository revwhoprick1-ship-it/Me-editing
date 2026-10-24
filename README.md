# Me-editing: Remotion + Whisper Shorts editor

**New session? Read [`vault/START HERE.md`](vault/START%20HERE.md) first.** It holds the research, style guide, workflow and feedback log.

Quick version:
1. Put your video at `public/input.mp4`
2. `npm install && pip install faster-whisper`
3. `python3 scripts/transcribe_words.py public/input.mp4` and `python3 scripts/speech_segments.py public/input.mp4` (fix word timing)
4. Edit `src/edit.ts` (cuts, shots, captions, SFX, music)
5. `npm run studio` to preview, `npm run render` to export `out/edited.mp4`
