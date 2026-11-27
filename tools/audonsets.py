"""Audio onsets (spectral flux) with band energies, loudness envelope and a rough tempo estimate.
usage: python3 tools/audonsets.py <media> <out.json>"""
# audio: RMS envelope, onsets with band energies, BPM estimate
import subprocess, sys, json, numpy as np
src = sys.argv[1]; sr = 22050
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
hop, win = 220, 1024  # 10ms hop
n = 1 + (len(x) - win) // hop
w = np.hanning(win)
frames = np.lib.stride_tricks.as_strided(x, (n, win), (x.strides[0] * hop, x.strides[0]))
spec = np.abs(np.fft.rfft(frames * w, axis=1)); freqs = np.fft.rfftfreq(win, 1 / sr)
rms = np.sqrt((frames ** 2).mean(1)); db = 20 * np.log10(rms + 1e-6)
logS = np.log1p(spec * 10)
flux = np.maximum(0, np.diff(logS, axis=0)).sum(1); flux = np.concatenate([[0], flux])
bands = {'sub': (20, 120), 'low': (120, 500), 'mid': (500, 2500), 'high': (2500, 6000), 'air': (6000, 11000)}
be = {k: spec[:, (freqs >= a) & (freqs < b)].sum(1) for k, (a, b) in bands.items()}
tot = sum(be.values()) + 1e-9
cent = (spec * freqs).sum(1) / (spec.sum(1) + 1e-9)
# onset peaks: local max of flux above adaptive threshold
med = np.array([np.median(flux[max(0, i - 50):i + 50]) for i in range(n)])
thr = med + 1.5 * np.std(flux)
ons = []
for i in range(3, n - 4):
    if flux[i] > thr[i] and flux[i] == flux[i - 3:i + 4].max():
        seg = slice(i, min(n, i + 25))
        dur = 0
        base = db[max(0, i - 5)]
        for j in range(i, min(n, i + 300)):
            if db[j] < db[i:i+3].max() - 12: break
            dur += 1
        ons.append(dict(t=round(i * hop / sr, 2), strength=round(float(flux[i] / np.std(flux)), 1), db=round(float(db[i:i + 5].max()), 1), jump=round(float(db[i:i + 5].max() - db[max(0, i - 8):i].mean()), 1),
                        cent=int(cent[seg].mean()), **{k: round(float((be[k][seg].sum()) / tot[seg].sum()), 2) for k in bands}, dur=round(dur / 100, 2)))
# tempo: autocorr of flux 60-180bpm
f0 = flux - flux.mean(); ac = np.correlate(f0, f0, 'full')[len(f0) - 1:]
lags = np.arange(len(ac)); bpm_l = (60 / (lags[33:101] * hop / sr)); best = lags[33:101][np.argmax(ac[33:101])]
bpm = 60 / (best * hop / sr)
env = [dict(t=round(i * hop / sr, 1), db=round(float(db[i:i + 10].mean()), 1), cent=int(cent[i:i + 10].mean()), sub=round(float(be['sub'][i:i+10].sum() / tot[i:i+10].sum()), 2)) for i in range(0, n, 10)]
json.dump(dict(onsets=ons, bpm=round(bpm, 1), env=env, lufs_like=round(float(db.mean()), 1)), open(sys.argv[2], 'w'))
print(sys.argv[2], 'onsets', len(ons), 'bpm', round(bpm, 1))
