"""For each cut time, decide new shot vs punch-in/out on the same shot (SIFT match, scale factor).
usage: python3 tools/shotcheck.py <video> <cuts.txt>"""
import cv2, sys, numpy as np
v, cutsf = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(v); fps = cap.get(5)
orb = cv2.SIFT_create(1500); bf = cv2.BFMatcher()
def frame(i):
    cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = cap.read(); return cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
for c in [float(x) for x in open(cutsf).read().split()]:
    i = round(c * fps); a, b = frame(i - 1), frame(i)
    ka, da = orb.detectAndCompute(a, None); kb, db = orb.detectAndCompute(b, None)
    res = 'new shot'
    if da is not None and db is not None and len(ka) > 10 and len(kb) > 10:
        m = [x for x, y in bf.knnMatch(da, db, k=2) if x.distance < 0.7 * y.distance] if len(kb) > 1 else []
        if len(m) >= 12:
            M, inl = cv2.estimateAffinePartial2D(np.float32([ka[x.queryIdx].pt for x in m]), np.float32([kb[x.trainIdx].pt for x in m]), ransacReprojThreshold=4)
            if M is not None and inl.sum() >= 12:
                s = np.hypot(M[0, 0], M[1, 0]); res = f'SAME SHOT scale x{s:.2f} shift({M[0,2]:.0f},{M[1,2]:.0f}) inliers={int(inl.sum())}'
    print(f'{c:6.2f}  {res}')
