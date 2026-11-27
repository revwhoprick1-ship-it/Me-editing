"""Cut the test-edit shots out of Big Buck Bunny into one 30 fps selects file + edl.json for Remotion.
usage: python3 tools/testedit/build_selects.py footage/bbb/x/big_buck_bunny_720p_h264.mov"""
import json, subprocess, sys, os
SRC = sys.argv[1]; FPS = 30
# id, source start (s), duration (s), horizontal focus 0-1, punch scale
SHOTS = [
    ('h1', 443.25, 1.10, .50, 1.15), ('hf', 446.60, 1.40, .40, 1.05),
    ('s1', 84.00, 1.60, .50, 1.00), ('s2', 109.40, 1.20, .45, 1.00), ('s3', 119.30, 1.40, .50, .85),
    ('e1', 163.40, 1.00, .45, 1.00), ('e2', 175.00, 1.00, .55, 1.00), ('e3', 186.10, 1.40, .55, 1.00),
    ('e4', 196.00, 0.90, .50, 1.30), ('e5', 217.30, 1.30, .50, 1.00), ('e6', 234.00, 2.20, .50, 1.10),
    ('m1', 252.10, 0.65, .50, 1.00), ('m2', 257.10, 0.65, .50, 1.00), ('m3', 267.20, 0.70, .45, 1.00),
    ('m4', 282.00, 1.60, .50, 1.00), ('t1', 315.00, 1.00, .50, 1.00), ('t2', 334.40, 1.20, .50, 1.00),
    ('t3', 352.40, 1.20, .40, 1.00), ('c1', 400.00, 1.30, .50, 1.00), ('c2', 405.30, 1.00, .45, 1.20),
    ('c3', 434.00, 1.40, .50, 1.00), ('c4', 442.30, 0.90, .50, 1.00), ('c5', 446.30, 1.20, .38, 1.00),
    ('c6', 456.00, 1.80, .45, 1.00), ('c7', 459.00, 1.20, .50, 1.25), ('f1', 474.50, 1.80, .50, 1.00),
    ('f2', 482.00, 1.75, .50, 1.00),
]
tmp = 'footage/bbb/chunks'; os.makedirs(tmp, exist_ok=True)
edl, t, sel, parts = [], 0, 0, []
for sid, s, d, fx, z in SHOTS:
    n = round(d * FPS); out = f'{tmp}/{sid}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{s:.3f}', '-i', SRC, '-an', '-vf', f'fps={FPS},scale=1280:720', '-frames:v', str(n),
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', out], check=True)
    edl.append(dict(id=sid, src=s, from_=t, dur=n, sel=sel, fx=fx, z=z)); t += n; sel += n; parts.append(out)
open(f'{tmp}/list.txt', 'w').write(''.join(f"file '{os.path.abspath(p)}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/list.txt', '-c', 'copy', 'public/test/selects.mp4'], check=True)
json.dump(dict(fps=FPS, total=t, shots=[{k.rstrip('_'): v for k, v in e.items()} for e in edl]), open('src/testedit/edl.json', 'w'), indent=1)
print('frames', t, 'seconds', t / FPS)
