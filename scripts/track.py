# Track a person through a clip with OpenCV CSRT and print keyframes (source ms, x, y)
# for the red circle. Tracks the head box and a torso box; if the head is lost
# (e.g. jumps out of frame), the head is estimated from the torso.
# Usage: python3 scripts/track.py video start_ms end_ms "hx,hy,hw,hh" "tx,ty,tw,th" [step_ms]
import json, sys
import cv2

video, start, end = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
head = tuple(int(v) for v in sys.argv[4].split(','))
torso = tuple(int(v) for v in sys.argv[5].split(','))
step = int(sys.argv[6]) if len(sys.argv) > 6 else 100

cap = cv2.VideoCapture(video)
cap.set(cv2.CAP_PROP_POS_MSEC, start)
ok, frame = cap.read()
th = cv2.legacy.TrackerCSRT_create(); th.init(frame, head)
tt = cv2.legacy.TrackerCSRT_create(); tt.init(frame, torso)
off = (head[0] + head[2] / 2 - (torso[0] + torso[2] / 2), head[1] + head[3] / 2 - torso[1])
out, t, last = [], start, start
while t <= end:
    ok, frame = cap.read()
    if not ok:
        break
    t = cap.get(cv2.CAP_PROP_POS_MSEC)
    okh, bh = th.update(frame)
    okt, bt = tt.update(frame)
    if okh and bh[1] > -bh[3] / 2:
        x, y, src = bh[0] + bh[2] / 2, bh[1] + bh[3] / 2, 'head'
    elif okt:
        x, y, src = bt[0] + bt[2] / 2 + off[0], bt[1] + off[1], 'torso'
    else:
        continue
    if t - last >= step:
        out.append({'at': round(t), 'x': round(x), 'y': round(y), 'by': src})
        last = t
print(json.dumps(out))
