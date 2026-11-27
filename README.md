# Me-editing

Clean video-editing setup: **Remotion** (React) for building edits, **ffmpeg + Python** tools for the prep and export work.

## Layout
- `src/` Remotion project. `Root.tsx` registers compositions; `Main.tsx` is an empty 1080x1920, 30 fps canvas.
- `public/` assets for `staticFile()`:
  - `sfx/`, `music/`, `fonts/`, `emoji/`: committed.
  - `resources/`: the EDITING RESOURCES Drive folder (songs, SFX, overlays, emoji PNGs, reaction clips). Not in git; get it with `tools/get_resources.sh`.
- `tools/`
  - `transcribe.py`: word-level transcript (faster-whisper).
  - `cuts.py`: camera-cut and scene-change times.
  - `lag.py`: share of frozen/repeated frames in a clip or window.
  - `peaks.py`: loudest moments, for finding reactions.
  - `export.sh`: final 1080x1920 H.264 / AAC encode at -14 LUFS.
  - `get_resources.sh`: re-download the resources folder.
  - `sheet.py`, `timeline.py`, `vismetrics.py`, `audonsets.py`, `shotcheck.py`: reference-video analysis (contact sheets, frame+spectrogram timelines, zoom/flash metrics, audio onsets, punch-in detection).
- `analysis/`: editing-style breakdown of the reference Shorts and the master style guide.
- `footage/` and `out/` are local only (gitignored).

## Commands
```
npm install
npm run studio                                   # preview
npm run render -- Main out/main.mp4              # render a composition
python3 tools/transcribe.py footage/clip.mp4     # -> footage/clip.json
python3 tools/cuts.py footage/clip.mp4 > footage/clip.cuts.txt
python3 tools/lag.py footage/clip.mp4 [start end]
python3 tools/peaks.py footage/clip.mp4 5
tools/export.sh out/main.mp4 out/final.mp4
```

Chromium for rendering is pre-installed at `/opt/pw-browsers` (pass `--browser-executable` if Remotion can't find one).
