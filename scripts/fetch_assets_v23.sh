#!/usr/bin/env bash
# Downloads the rigged avatar used by the 3D explainer edit (src/zack). Kept out of git (binary).
#  - three.js example model examples/models/gltf/readyplayer.me.glb -> public/models/rpm_male.glb
set -e
cd "$(dirname "$0")/.."
mkdir -p public/models
curl -sSL -o public/models/rpm_male.glb "https://raw.githubusercontent.com/mrdoob/three.js/r169/examples/models/gltf/readyplayer.me.glb"
echo done
