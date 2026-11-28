#!/bin/bash
# Final export for Reels / TikTok / Shorts: 1080x1920, H.264 High, constant 30 fps, ~12 Mbps, AAC 128k stereo 48 kHz,
# two-pass loudness to -14 LUFS / -1.5 dBTP, faststart, metadata stripped.
# usage: tools/export.sh <in.mp4> <out.mp4>   (EXPORT_PRESET=slow for max quality; default fast)
set -e; IN="$1"; OUT="$2"
J=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$IN" -map_metadata -1 -map_chapters -1 -vf "scale=1080:1920,fps=30,format=yuv420p" \
  -c:v libx264 -profile:v high -level 4.1 -preset ${EXPORT_PRESET:-fast} -threads 0 -b:v 12M -maxrate 15M -bufsize 24M -g 60 -r 30 -fps_mode cfr \
  -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true \
  -ar 48000 -ac 2 -c:a aac -b:a 128k -movflags +faststart "$OUT"
ffprobe -v error -select_streams v -show_entries stream=profile,width,height,r_frame_rate -of csv=p=0 "$OUT"
