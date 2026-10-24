#!/bin/bash
# Render one card-pull plan to out/<name>.mp4 (with limiter). Usage: scripts/render_card.sh clark
set -e
node scripts/use-plan.mjs card $1
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
npx remotion render src/index.ts CardPull out/raw_$1.mp4 --browser-executable=$B --log=error
ffmpeg -y -v error -i out/raw_$1.mp4 -c:v copy -af alimiter=limit=0.89:level=disabled -c:a aac -b:a 192k out/$1.mp4
rm out/raw_$1.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 out/$1.mp4
