# Me-editing — Remotion + Whisper shorts editor

1. Put your video at `public/input.mp4`
2. `npm install && npm run transcribe` (installs whisper.cpp, writes `public/captions.json`)
3. `npm run studio` to preview, `npm run render` to export `out/edited.mp4`

Style: 1080x1920, bold uppercase word-by-word captions with a yellow active word,
pop-in spring per caption page, alternating 1.0x/1.15x punch-in zooms.
Tweak in `src/ShortEdit.tsx`.
