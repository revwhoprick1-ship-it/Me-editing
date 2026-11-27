"""timeline.py video vis.json words.json cuts out.png t0 t1 : thumbs + spectrogram + rms + visual metrics, shared time axis"""
# usage: python3 tools/timeline.py <video> <vis.json> <words.json> <cuts.txt> <out.png> <t0> <t1>  (needs matplotlib)
import sys, json, subprocess, cv2, numpy as np, matplotlib
matplotlib.use('Agg'); import matplotlib.pyplot as plt
v, visf, wordsf, cutsf, out, t0, t1 = sys.argv[1:8]; t0, t1 = float(t0), float(t1)
sr = 22050
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t0), '-t', str(t1 - t0), '-i', v, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True).stdout, np.int16) / 32768
vis = json.load(open(visf))['frames']; vis = [r for r in vis if t0 <= r['t'] <= t1]
cuts = [float(c) for c in open(cutsf).read().split() if t0 <= float(c) <= t1]
try: words = [w for s in json.load(open(wordsf)) for w in s['w'] if t0 <= w[0] <= t1]
except Exception: words = []
fig, ax = plt.subplots(5, 1, figsize=(26, 15), sharex=True, gridspec_kw=dict(height_ratios=[2.2, 3, 1, 1, 1]))
cap = cv2.VideoCapture(v); step = 0.25 if t1 - t0 <= 12 else 0.5
for t in np.arange(t0, t1, step):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, f = cap.read()
    if ok: ax[0].imshow(cv2.cvtColor(f, cv2.COLOR_BGR2RGB), extent=(t, t + step * 0.96, 0, 1), aspect='auto')
ax[0].set_ylim(0, 1); ax[0].set_yticks([])
ax[1].specgram(x, NFFT=1024, Fs=sr, noverlap=768, cmap='magma', vmin=-110, xextent=(t0, t1)); ax[1].set_ylim(0, 11000); ax[1].set_ylabel('Hz')
hop = 220; rms = [20 * np.log10(np.sqrt(np.mean(x[i:i + 1024] ** 2)) + 1e-6) for i in range(0, len(x) - 1024, hop)]
ax[2].plot(t0 + np.arange(len(rms)) * hop / sr, rms, lw=0.8); ax[2].set_ylabel('dB'); ax[2].set_ylim(-60, 0)
for w in words: ax[2].text(w[0], -8, w[2].strip(), fontsize=9, rotation=0, color='darkgreen')
T = [r['t'] for r in vis]
ax[3].plot(T, [r['Y'] for r in vis], label='luma'); ax[3].plot(T, [r['S'] for r in vis], label='sat'); ax[3].plot(T, [r['diff'] * 3 for r in vis], label='diff x3'); ax[3].legend(loc='upper left', fontsize=8)
ax[4].plot(T, [(r['scale'] - 1) * 1000 for r in vis], label='zoom (scale-1)x1000'); ax[4].plot(T, [r['dx'] for r in vis], label='dx px'); ax[4].plot(T, [r['dy'] for r in vis], label='dy px'); ax[4].set_ylim(-40, 40); ax[4].legend(loc='upper left', fontsize=8)
for a in ax[1:]:
    for c in cuts: a.axvline(c, color='cyan', lw=1, ls='--')
ax[4].set_xticks(np.arange(np.ceil(t0 * 4) / 4, t1, 0.25), minor=True); ax[4].set_xticks(np.arange(np.ceil(t0), t1 + 0.01, 1)); ax[4].grid(True, which='both', axis='x', alpha=0.35)
for a in ax[1:4]: a.grid(True, which='both', axis='x', alpha=0.35)
ax[4].set_xlim(t0, t1); plt.tight_layout(); plt.savefig(out, dpi=60); print(out)
