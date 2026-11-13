# scientific clip finder: audio reaction energy (crowd laughter / overlap) + transcript hook/payoff features
import json, re, subprocess, sys, numpy as np
src, txp = sys.argv[1], sys.argv[2]
SR = 16000
x = np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',src,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout, np.float32)
n = len(x)//SR; fr = x[:n*SR].reshape(n, SR)
rms = np.sqrt((fr**2).mean(1)) + 1e-6; db = 20*np.log10(rms)
# laughter proxy: high-band (2-6k) energy share + loudness above local (60 s) median
F = np.abs(np.fft.rfft(fr.reshape(n, 10, SR//10), axis=2)); f = np.fft.rfftfreq(SR//10, 1/SR)
hi = F[..., (f > 2000) & (f < 6000)].sum(-1).mean(1) / (F[..., (f > 100) & (f < 6000)].sum(-1).mean(1) + 1e-9)
var = (20*np.log10(np.sqrt((fr.reshape(n,10,-1)**2).mean(2))+1e-6)).std(1)   # bursty
med = np.array([np.median(db[max(0,i-30):i+30]) for i in range(n)])
react = np.clip(db - med, 0, None) * 0.6 + (hi - np.median(hi)) / (hi.std()+1e-9) * 0.8 + (var - np.median(var)) / (var.std()+1e-9) * 0.4
react = np.convolve(react, np.ones(3)/3, 'same')
segs = json.load(open(txp))
MONEY = re.compile(r'(\$|\d|million|mil\b|figures|figs|k\b|100x|grand|thousand|lambo|rolex|mustang|mercedes|lotus|m3|bowling|car|house|net worth)', re.I)
CONFLICT = re.compile(r'(larp|fake|lying|liar|sus|believe|trust|delusional|wrong|paid|caught|exposed|mistake|no way|bro what|what\?)', re.I)
rows = []
for i, s in enumerate(segs):
    for j in range(i, min(i+30, len(segs))):
        a, b = s['s'], segs[j]['e']; L = b - a
        if L < 9 or L > 22: continue
        text = ' '.join(t['t'] for t in segs[i:j+1]); hook = ' '.join(t['t'] for t in segs[i:i+2] if t['s'] < a + 3.5)
        h = 2.0*bool(MONEY.search(hook)) + 1.5*bool(CONFLICT.search(hook)) + 0.8*('?' in hook) + 0.6*len(MONEY.findall(hook))
        r = react[int(a):int(b)+1]; k = len(r)
        body = r.mean(); peakend = r[int(k*0.6):].max(initial=0); dead = (r < np.percentile(react, 30)).mean()
        dens = len(MONEY.findall(text)) / L * 10 + len(CONFLICT.findall(text)) / L * 10
        score = h*1.0 + body*1.2 + peakend*0.8 + dens*0.5 - dead*2 - abs(L-14)*0.08
        rows.append((score, a, b, h, body, peakend, dens, hook, text))
rows.sort(key=lambda r: -r[0]); picked = []
for r in rows:
    if all(r[2] <= p[1] - 2 or r[1] >= p[2] + 2 for p in picked): picked.append(r)
    if len(picked) == 15: break
for r in picked: print(f'{r[0]:5.2f} {r[1]:7.1f}-{r[2]:7.1f} hook={r[3]:.1f} react={r[4]:.2f} end={r[5]:.2f} dens={r[6]:.1f} | {r[8][:170]}')
