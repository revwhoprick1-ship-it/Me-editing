# auto shots + crops + mask tracks for a list of edits -> auto_edits.json (scenes) + tracks/<id>.json
import json, subprocess, sys, numpy as np
src = sys.argv[1]; spec = json.load(open(sys.argv[2])); outdir = sys.argv[3]
W, H = 480, 270; s = 1920 / W
def frames(t0, t1, fps=30):
    raw = subprocess.run(['ffmpeg','-v','error','-ss',str(t0),'-i',src,'-t',str(t1-t0),'-vf',f'fps={fps},scale={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32) / 255
def cuts(t0, t1):
    out = subprocess.run(['ffmpeg','-ss',str(t0),'-t',str(t1-t0),'-i',src,'-vf',"scale=320:-1,select='gt(scene,0.25)',showinfo",'-an','-f','null','-'],capture_output=True,text=True).stderr
    import re; return [round(t0 + float(m), 2) for m in re.findall(r'pts_time:([0-9.]+)', out)]
def masks(im):
    r, g, b = im[...,0], im[...,1], im[...,2]; mx = im.max(-1); mn = im.min(-1); sat = (mx-mn)/(mx+1e-6)
    return {'ironman': (r>0.45)&(r>=g)&(g>b+0.05)&(sat>0.45)&(r-b>0.3), 'thanos': (b>g+0.12)&(r>g+0.06)&(sat>0.3)&(mx>0.2),
            'hulk': (g>r+0.12)&(g>b+0.08)&(sat>0.4)&(mx>0.25), 'pikachu': (r>0.7)&(g>0.6)&(b<0.35), 'clown': (r>0.55)&(g<0.3)&(b<0.3)}
def crop_center(im):
    bg = np.median(np.concatenate([im[:, :8].reshape(-1,3), im[:, -8:].reshape(-1,3), im[:12].reshape(-1,3)]), 0)
    fg = (np.abs(im - bg).sum(-1) > 0.25)[:int(H*0.65)]
    col = fg.sum(0).astype(float)
    if col.sum() < 200: return 960
    xs = np.arange(W); c = (col*xs).sum()/col.sum(); spread = np.sqrt((col*(xs-c)**2).sum()/col.sum())
    if spread > W*0.28: return 960           # wide group shot -> centre
    return int(min(1380, max(540, c*s)))
res = {}
for eid, e in spec.items():
    a, b = e['range']; cs = [c for c in cuts(a - 0.3, b + 0.3)]
    nx = [c for c in cs if a < c < a + 0.6]
    if nx: a = nx[-1]
    pv = [c for c in cs if b - 0.6 < c < b]
    if pv: b = pv[0]
    shots = [a] + [c for c in cs if a + 0.05 < c < b - 0.05] + [b]
    crops, track, calls = [], {}, []
    for s0, s1 in zip(shots, shots[1:]):
        fr = frames(s0 + 0.02, s1 - 0.02)
        if len(fr) == 0: continue
        mid = fr[len(fr)//2]; cx = crop_center(mid)
        for name in e.get('masks', []):
            P = []
            for im in fr:
                m = masks(im)[name]; m[int(H*0.6):] = False; ys, xs = np.nonzero(m)
                if len(xs) >= 10:
                    mxs, mys = np.median(xs), np.median(ys); k = (abs(xs-mxs)<40)&(abs(ys-mys)<40); xs, ys = xs[k], ys[k]
                P.append([xs.mean()*s, ys.mean()*s + (-60 if name=='clown' else 0), max(np.sqrt(len(xs)/np.pi)*s, 95 if name=='clown' else 60)] if len(xs) >= 10 else [np.nan]*3)
            P = np.array(P)
            if np.isnan(P[:,0]).mean() > 0.4: continue
            ok = ~np.isnan(P[:,0])
            for k in range(3): P[:,k] = np.interp(np.arange(len(P)), np.nonzero(ok)[0], P[ok,k])
            for k in range(3): P[:,k] = np.convolve(np.pad(P[:,k],2,mode='edge'), np.ones(5)/5, 'valid')
            # keep crop on the mask if it would fall outside the window
            mxc = float(np.median(P[:,0]))
            if abs(mxc - cx) > 430: cx = int(min(1380, max(540, mxc)))
            for i, p in enumerate(P): track[f'{s0 + 0.02 + i/30:.2f}'] = [round(v) for v in p]
            calls.append([round(s0, 2), round(s1, 2), e['label'][name]]); break
        crops.append([round(s0, 2), cx])
    json.dump(track, open(f'{outdir}/{eid}.json', 'w'))
    res[eid] = {'start': round(a, 2), 'end': round(b, 2), 'crops': crops, 'calls': calls}
    print(eid, round(a,2), round(b,2), 'shots', len(crops), 'min', round(min(y-x for x, y in zip(shots, shots[1:])),2), 'calls', len(calls))
json.dump(res, open(f'{outdir}/auto_edits.json', 'w'), indent=0)
