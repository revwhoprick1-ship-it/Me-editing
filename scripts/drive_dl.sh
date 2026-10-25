#!/bin/bash
# Download Google Drive files one at a time (slow, verified, retried).
# Usage: scripts/drive_dl.sh list.txt outdir   (list lines: name id)
list=$1; out=$2; mkdir -p "$out"
while read -r name id; do
  [ -z "$name" ] && continue
  f="$out/$name.mp4"
  for try in 1 2 3 4; do
    if [ -s "$f" ] && ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" >/dev/null 2>&1 && [ "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" | cut -d. -f1)" -ge 0 ]; then
      echo "OK $name $(ffprobe -v error -show_entries format=duration:stream=width,height -of csv=p=0 "$f" | tr '\n' ' ')"; break
    fi
    curl -sSL --retry 3 -o "$f" "https://drive.usercontent.google.com/download?id=$id&export=download&confirm=t"
    if ! ffprobe -v error "$f" >/dev/null 2>&1; then echo "retry $name ($try): $(file -b "$f" | cut -c1-60)"; rm -f "$f"; sleep $((try*20)); fi
  done
  [ -s "$f" ] || echo "FAILED $name"
  sleep 15
done < "$list"
echo DONE
