# Which seat (L/M/R) moves most each second: a rough "who is talking" guide for podcast speaker maps.
# Usage: python3 scripts/seat_motion.py public/pod/<clip>.mp4
import sys,subprocess,numpy as np
f=sys.argv[1]
W,H=320,180
p=subprocess.run(['ffmpeg','-v','error','-i',f,'-vf','fps=10,scale=320:180,format=gray','-f','rawvideo','-'],capture_output=True).stdout
a=np.frombuffer(p,np.uint8).reshape(-1,H,W).astype(np.float32)
d=np.abs(np.diff(a,axis=0))
# head boxes (rows 20-80 of 180), cols by seat
boxes={'L':(20,120),'M':(120,200),'R':(200,300)}
for s in range(0,len(d)//10):
    seg=d[s*10:(s+1)*10]
    v={k:seg[:,15:75,c0:c1].mean() for k,(c0,c1) in boxes.items()}
    top=max(v,key=v.get)
    print(f"{s:3d}s "+' '.join(f"{k}{v[k]:5.1f}" for k in v)+f"  {top}")
