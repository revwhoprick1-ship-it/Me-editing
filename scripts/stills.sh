#!/bin/bash
# Render a few frames of a composition into one contact sheet.
# Usage: scripts/stills.sh CardPull out.jpg 30 200 400 ...
comp=$1; out=$2; shift 2
B=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
tmp=$(mktemp -d)
for fr in "$@"; do npx remotion still src/index.ts $comp $tmp/$fr.png --frame=$fr --browser-executable=$B --log=error >/dev/null 2>&1; done
python3 -c "
import sys,glob
from PIL import Image,ImageDraw
import os
fs=[f for f in sys.argv[2:] if os.path.exists('$tmp/%s.png'%f)]; ims=[]
for f in fs:
  im=Image.open('$tmp/%s.png'%f).resize((216,384)); ImageDraw.Draw(im).text((4,4),f,fill=(255,255,0)); ims.append(im)
o=Image.new('RGB',(216*min(8,len(ims)),384*((len(ims)+7)//8)))
for i,im in enumerate(ims): o.paste(im,((i%8)*216,(i//8)*384))
o.save(sys.argv[1])" $out "$@"
rm -rf $tmp
