# Contact sheet of tracked points: python3 scripts/track_check.py video track.json x0 y0 x1 y1 out.jpg
import json, sys, cv2, numpy as np
v, tj, x0, y0, x1, y1, out = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7]), sys.argv[7]
d = json.load(open(tj)); cap = cv2.VideoCapture(v); tiles = []
for p in d[::4]:
    cap.set(cv2.CAP_PROP_POS_MSEC, p['at']); ok, fr = cap.read()
    fr = fr[y0:y1, x0:x1].copy(); cv2.circle(fr, (p['x'] - x0, p['y'] - y0), 60, (0, 0, 255), 4)
    cv2.putText(fr, f"{p['at']} {p['by'][0]}", (5, 30), 0, 1, (0, 255, 255), 2)
    tiles.append(cv2.resize(fr, (300, int(300 * (y1 - y0) / (x1 - x0)))))
while len(tiles) % 6: tiles.append(np.zeros_like(tiles[0]))
cv2.imwrite(out, np.vstack([np.hstack(tiles[i:i + 6]) for i in range(0, len(tiles), 6)]))
print(len(d), 'points')
