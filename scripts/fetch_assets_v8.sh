#!/usr/bin/env bash
# Downloads the free 3D assets used by Jorho v8 (src/jorho3d/lefty8.tsx). Kept out of git (big binaries).
#  - three.js example models (MIT): Xbot, Soldier, RobotExpressive  -> public/models/*.glb
#  - Poly Haven CC0 models (gltf 1k): american_football, standing_chalkboard_01 -> public/models/<id>/
#  - Poly Haven CC0 panoramas (tonemapped JPG, resized to 8k): orlando_stadium, suburban_football_field -> public/env/
set -e
cd "$(dirname "$0")/.."
mkdir -p public/models public/env .work/models
for m in Xbot.glb Soldier.glb RobotExpressive/RobotExpressive.glb; do
  curl -sSL -o "public/models/$(basename $m)" "https://raw.githubusercontent.com/mrdoob/three.js/r169/examples/models/gltf/$m"
done
for id in american_football standing_chalkboard_01; do
  curl -sS "https://api.polyhaven.com/files/$id" -o ".work/models/f_$id.json"
  python3 - "$id" <<'PY'
import json,sys,os,urllib.request
id=sys.argv[1]; g=json.load(open(f'.work/models/f_{id}.json'))['gltf']['1k']['gltf']
base=f'public/models/{id}'; os.makedirs(base+'/textures',exist_ok=True)
urllib.request.urlretrieve(g['url'], f'{base}/{id}.gltf')
for p,v in g['include'].items(): urllib.request.urlretrieve(v['url'], f'{base}/{p}')
PY
done
for id in orlando_stadium suburban_football_field; do
  curl -sS -o ".work/models/$id.jpg" "https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/$id.jpg"
  python3 -c "from PIL import Image; Image.MAX_IMAGE_PIXELS=None; Image.open('.work/models/$id.jpg').convert('RGB').resize((8192,4096), Image.LANCZOS).save('public/env/${id}_8k.jpg', quality=88)"
done
echo done
