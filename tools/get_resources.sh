#!/bin/bash
# Re-download the EDITING RESOURCES Drive folder (songs, SFX, overlays, emoji PNGs, reaction clips) into public/resources/
# (kept out of git: ~400 MB). Needs gdown (pip install gdown). Drive may rate-limit: just run it again later.
set -e; cd "$(dirname "$0")/.."; mkdir -p public/resources
gdown --folder "https://drive.google.com/drive/folders/1Sf4n4Ve2tKlpiLiYoCbkFxcQIYEY1B0L" -O public/resources --remaining-ok
