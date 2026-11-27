"""Contact sheet: frames every STEP seconds with timestamps.
usage: python3 tools/sheet.py <video> <out.png> <step> <start> <end> <cols> <tile_width>"""
# usage: sheet.py video out_prefix step start end cols w
import cv2, sys, numpy as np
v, out, step = sys.argv[1], sys.argv[2], float(sys.argv[3])
start, end = float(sys.argv[4]), float(sys.argv[5]); cols = int(sys.argv[6]); W = int(sys.argv[7])
cap = cv2.VideoCapture(v); fps = cap.get(5); n = cap.get(7); dur = n / fps
end = min(end, dur - 0.01)
tiles = []; t = start
while t <= end + 1e-6:
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, f = cap.read()
    if not ok: break
    h = int(f.shape[0] * W / f.shape[1]); f = cv2.resize(f, (W, h))
    cv2.rectangle(f, (0, 0), (92, 24), (0, 0, 0), -1)
    cv2.putText(f, f'{t:05.2f}', (3, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    tiles.append(f); t = round(t + step, 3)
rows = [np.hstack(tiles[i:i+cols] + [np.zeros_like(tiles[0])] * (cols - len(tiles[i:i+cols]))) for i in range(0, len(tiles), cols)]
cv2.imwrite(out, np.vstack(rows)); print(out, len(tiles))
