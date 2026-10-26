# Cut the person out of video frames (rembg u2net_human_seg) for "text behind the speaker" shots.
# Usage: python3 scripts/person_matte.py frames_dir out_dir   (frames from ffmpeg, RGBA PNGs out, same names)
import sys, glob, os
from PIL import Image
from rembg import remove, new_session
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
s = new_session('u2net_human_seg')
for f in sorted(glob.glob(f'{src}/*.png')):
    im = Image.open(f).convert('RGB')
    remove(im, session=s, post_process_mask=True).save(f'{out}/{os.path.basename(f)}', optimize=True)
print('done', out)
