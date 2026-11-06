# Download CC-BY Sketchfab models from the Objaverse mirror (huggingface.co/datasets/allenai/objaverse) by uid.
#   python3 scripts/fetch_objaverse.py <out_dir> name=uid [name=uid ...]
# Check each model's licence on its Sketchfab page first and credit it (see the video's CREDITS.md).
import gzip, json, os, sys, urllib.request
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
HF = 'https://huggingface.co/datasets/allenai/objaverse/resolve/main/'
paths_file = os.path.join(ROOT, '.work', 'object-paths.json.gz')
os.makedirs(os.path.dirname(paths_file), exist_ok=True)
if not os.path.exists(paths_file): urllib.request.urlretrieve(HF + 'object-paths.json.gz', paths_file)
paths = json.load(gzip.open(paths_file))
out_dir = sys.argv[1]; os.makedirs(out_dir, exist_ok=True)
for spec in sys.argv[2:]:
    name, uid = spec.split('=')
    out = os.path.join(out_dir, f'{name}.glb')
    if not os.path.exists(out): urllib.request.urlretrieve(HF + paths[uid], out); print('got', name, os.path.getsize(out) // 1024, 'KB')
