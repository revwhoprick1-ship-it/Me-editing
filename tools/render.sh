#!/bin/bash
# Fastest render of a Remotion composition, then the final -14 LUFS export.
# usage: tools/render.sh <CompositionId> <out.mp4>
# Speed settings (the final quality comes from tools/export.sh, which re-encodes anyway):
#   - every CPU core rendering frames (concurrency = RENDER_CONCURRENCY, default = all cores; Remotion caps it there)
#   - x264 ultrafast + crf 12 for the intermediate file (fast to write, near-lossless)
#   - bigger OffthreadVideo cache so source frames are decoded once
set -e
cd "$(dirname "$0")/.."
comp="$1"; out="$2"
[ -z "$comp" ] || [ -z "$out" ] && { echo "usage: tools/render.sh <CompositionId> <out.mp4>"; exit 1; }
B=$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)
C=${RENDER_CONCURRENCY:-$(nproc)}
raw="${out%.mp4}_raw.mp4"
npx remotion render src/index.ts "$comp" "$raw" ${B:+--browser-executable="$B"} \
  --concurrency="$C" --x264-preset=ultrafast --crf=12 \
  --offthreadvideo-cache-size-in-bytes=2000000000 --log=error
tools/export.sh "$raw" "$out"
rm -f "$raw"
