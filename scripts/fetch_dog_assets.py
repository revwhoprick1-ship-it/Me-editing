# Downloads the CC-BY models used by Inside the Impossible #003 (dogs) from the Objaverse mirror of Sketchfab
# (huggingface.co/datasets/allenai/objaverse) into public/dogs/ (gitignored). Credits: inside-impossible/videos/003-dogs-talk/CREDITS.md
import gzip, json, os, urllib.request
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
MODELS = {'golden': 'a43ed994cafc43ebae92dad0440c246b', 'lab': '3207e243f9bb42ffa33ee8a2c67eaeb4', 'shiba': '9abfce885a834399b2c3ccaed51cd474',
          'boxer': 'fa6e0f59ca8e4a06b703a9bca60270e4', 'shiba_tricks': 'd9020159339145e6b9ecd5f3d830830f', 'jeff': 'fc093db562ca464aa0efc7e77483befa',
          'bizman': 'b6f6740f883b4749abac47af0045a9dd', 'walkers': 'bbaa566445074509a32ef5059a9d0bc2', 'woman': 'f473b521c80c473b962593b6bcec3e41'}
HF = 'https://huggingface.co/datasets/allenai/objaverse/resolve/main/'
paths_file = os.path.join(ROOT, '.work', 'object-paths.json.gz')
if not os.path.exists(paths_file): urllib.request.urlretrieve(HF + 'object-paths.json.gz', paths_file)
paths = json.load(gzip.open(paths_file))
os.makedirs(os.path.join(ROOT, 'public', 'dogs'), exist_ok=True)
for k, uid in MODELS.items():
    out = os.path.join(ROOT, 'public', 'dogs', f'{k}.glb')
    if not os.path.exists(out): urllib.request.urlretrieve(HF + paths[uid], out); print('got', k)
