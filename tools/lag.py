"""Share of repeated (frozen/dropped) frames, i.e. source lag. 0.00 = smooth.
usage: python3 tools/lag.py <video> [start end]"""
import re, subprocess, sys
src = sys.argv[1]; a = float(sys.argv[2]) if len(sys.argv) > 2 else 0; b = float(sys.argv[3]) if len(sys.argv) > 3 else None
dur = b - a if b else float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout) - a
fps = eval(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip())
err = subprocess.run(['ffmpeg', '-ss', str(a), '-t', str(dur), '-i', src, '-vf', 'mpdecimate=hi=64*4:lo=64*2:frac=0.33', '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
n = int(re.findall(r'frame=\s*(\d+)', err)[-1])
print(f'repeated {1 - n / (dur * fps):.2f}  ({n} unique of {round(dur * fps)})')
