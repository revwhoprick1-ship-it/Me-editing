"""Camera-cut / scene-change times (seconds), one per line.
usage: python3 tools/cuts.py <video> [threshold=0.3] > cuts.txt"""
import re, subprocess, sys
src = sys.argv[1]; th = sys.argv[2] if len(sys.argv) > 2 else '0.3'
err = subprocess.run(['ffmpeg', '-i', src, '-vf', f"scale=480:-1,select='gt(scene,{th})',showinfo", '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
for t in re.findall(r'pts_time:([0-9.]+)', err): print(t)
