"""Per-frame visual metrics (luma, saturation, RGB, frame diff, global zoom/shift/rotation via optical flow).
usage: python3 tools/vismetrics.py <video> <out.json>"""
# per-frame visual metrics: luma, sat, hue tint, frame diff, global scale/translation (zoom/shake)
import cv2, sys, json, numpy as np
v = sys.argv[1]; cap = cv2.VideoCapture(v); fps = cap.get(5)
prev = None; rows = []; i = 0
while True:
    ok, f = cap.read()
    if not ok: break
    small = cv2.resize(f, (180, int(180 * f.shape[0] / f.shape[1])))
    g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
    b, gr, r = [float(small[..., k].mean()) for k in range(3)]
    row = dict(t=round(i / fps, 3), Y=round(float(g.mean()), 1), S=round(float(hsv[..., 1].mean()), 1), R=round(r, 1), G=round(gr, 1), B=round(b, 1), diff=0, scale=1, dx=0, dy=0, rot=0, blur=round(float(cv2.Laplacian(g, cv2.CV_64F).var()), 1))
    if prev is not None:
        row['diff'] = round(float(np.abs(g.astype(int) - prev.astype(int)).mean()), 1)
        p0 = cv2.goodFeaturesToTrack(prev, 200, 0.01, 6)
        if p0 is not None and len(p0) > 10:
            p1, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, p0, None)
            m, inl = cv2.estimateAffinePartial2D(p0[st == 1], p1[st == 1]) if (st == 1).sum() >= 6 else (None, None)
            if m is not None:
                s = float(np.hypot(m[0, 0], m[1, 0])); row.update(scale=round(s, 4), dx=round(float(m[0, 2]), 2), dy=round(float(m[1, 2]), 2), rot=round(float(np.degrees(np.arctan2(m[1, 0], m[0, 0]))), 2))
    rows.append(row); prev = g; i += 1
json.dump(dict(fps=fps, frames=rows), open(sys.argv[2], 'w'))
print(sys.argv[2], len(rows))
