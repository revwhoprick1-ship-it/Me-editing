---
tags: [workflow, setup]
---
# Environment notes (cloud session gotchas)

Back to [[START HERE]]

- **Network access must be "Full"** in the cloud environment settings, or Google Drive / Hugging Face / YouTube are blocked. The setting applies when a session starts.
- **YouTube:** search, hashtag feeds, thumbnails (`i.ytimg.com/vi/<id>/maxres1.jpg` etc. = frames at 25/50/75 %) and storyboards work (`yt-dlp --extractor-args "youtube:player_client=mweb" -f sb0`). **Video and audio downloads are blocked** ("Sign in to confirm you're not a bot").
- **Chrome for Remotion:** use the preinstalled one: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell` (Remotion's own download host is blocked).
- **Fonts:** load from `public/` with `@remotion/fonts`. `@remotion/google-fonts` fails (cert error through the proxy).
- **whisper.cpp model download** via `@remotion/install-whisper-cpp` writes a 0-byte file here; fetch the model with curl from huggingface instead (see `scripts/transcribe.mjs`). Preferred now: `scripts/transcribe_words.py` (faster-whisper large-v3, `pip install faster-whisper`).
- **faster-whisper + PyAV mismatch**: the script decodes audio with ffmpeg itself to avoid it.
- First `git push` failed with 403 until GitHub was reconnected (claude.ai/connect-github).
