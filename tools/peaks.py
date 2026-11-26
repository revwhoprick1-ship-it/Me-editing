"""Loudest moments (screams / reactions): momentary loudness peaks at least 4 s apart.
usage: python3 tools/peaks.py <media> [count=5]"""
import re, subprocess, sys
src = sys.argv[1]; k = int(sys.argv[2]) if len(sys.argv) > 2 else 5
err = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
P = sorted(((float(t), float(m)) for t, m in re.findall(r't:\s*([0-9.]+).*?M:\s*(-?[0-9.]+)', err)), key=lambda x: -x[1])
out = []
for t, m in P:
    if all(abs(t - p) > 4 for p, _ in out): out.append((t, m))
    if len(out) == k: break
for t, m in sorted(out): print(f'{t:7.1f}s  {m:6.1f} LUFS')
