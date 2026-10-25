# Insert a freeze frame (W Speed "paused screen") into a source clip and shift its data to match.
# Video holds the frame at at_ms for dur_ms (audio silent there); words/seat-track times after at_ms move by dur_ms.
# Usage: python3 scripts/insert_freeze.py in.mp4 out.mp4 at_ms dur_ms words_in words_out [seats_in seats_out]
import json, subprocess, sys

src, out, at, dur = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
T, D = at / 1000, dur / 1000
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex',
                f'[0:v]trim=0:{T},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={D}[a];'
                f'[0:v]trim=start={T},setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v];'
                f'[0:a]atrim=0:{T},asetpts=PTS-STARTPTS,apad=pad_dur={D}[x];'
                f'[0:a]atrim=start={T},asetpts=PTS-STARTPTS[y];[x][y]concat=n=2:v=0:a=1[au]',
                '-map', '[v]', '-map', '[au]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-r', '30',
                '-c:a', 'aac', '-b:a', '192k', out], check=True)

words = json.load(open(sys.argv[5]))
sh = lambda t: t + dur if t >= at else t
json.dump([{**w, 'startMs': sh(w['startMs']), 'endMs': sh(w['endMs'])} for w in words], open(sys.argv[6], 'w'), indent=0)

if len(sys.argv) > 8:
    tr = json.load(open(sys.argv[7]))
    i = max(0, (at - tr['fromMs']) // tr['stepMs'])
    n = dur // tr['stepMs']
    for k in ('L', 'M', 'R'):
        if k in tr and tr[k]:
            p = tr[k][min(i, len(tr[k]) - 1)]
            tr[k] = tr[k][:i] + [p] * n + tr[k][i:]
    json.dump(tr, open(sys.argv[8], 'w'))
print('freeze', at, dur, '->', out)
