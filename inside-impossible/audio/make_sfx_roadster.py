# SFX for #005 (Roadster), own numpy synthesis. 48 kHz mono -> public/inside/sfx/.
#   python3 inside-impossible/audio/make_sfx_roadster.py
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt
SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'inside', 'sfx')
R = np.random.default_rng(5)
t_ = lambda d: np.arange(int(d * SR)) / SR
def filt(x, kind, f, order=4): return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)
def norm(x, p=0.9): return x / (np.max(np.abs(x)) + 1e-9) * p
def fade(x, a=0.003, b=0.04):
    x = x.copy(); na, nb = int(a * SR), int(b * SR); x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x
def save(name, x, p=0.9): sf.write(os.path.join(OUT, f'{name}.wav'), norm(fade(np.asarray(x, float)), p).astype(np.float32), SR)
def over(a, b, off=0.0):
    k = int(off * SR); n = max(len(a), k + len(b)); y = np.zeros(n); y[:len(a)] += a; y[k:k + len(b)] += b; return y
def ph(f): return 2 * np.pi * np.cumsum(f) / SR
def noise(n): return R.standard_normal(n)
def sweep(n, f0, f1, q=1.5):
    """band-passed noise whose centre glides f0 -> f1"""
    nz, y, fc = noise(n), np.zeros(n), f0 * (f1 / f0) ** (np.arange(n) / n)
    for k in range(0, n, 256): y[k:k + 256] = filt(nz[max(0, k - 512):k + 256], 'bandpass', [max(40, fc[k] / q), min(SR / 2 - 100, fc[k] * q)], 2)[-len(y[k:k + 256]):]
    return y
# morph: sparkly rising shimmer into a whoosh (transformation)
t = t_(0.8); sh = sum(np.sin(ph(f * (1 + 1.5 * t))) * (0.5 + 0.5 * np.sin(2 * np.pi * 22 * t + i)) / (i + 1) for i, f in enumerate([700, 1050, 1580, 2360]))
save('morph', 0.5 * sh * t / 0.8 + sweep(len(t), 300, 4000) * np.sin(np.pi * t / 0.8), 0.7)
# boom: soft cinematic hit
t = t_(1.2); save('boom', np.sin(ph(70 * np.exp(-t * 2))) * np.exp(-t / 0.35) + 0.4 * filt(noise(len(t)), 'lowpass', 900) * np.exp(-t / 0.15), 0.9)
# wave: sweeping whoosh across (the transformation wave)
t = t_(1.3); save('wave', sweep(len(t), 200, 2500) * np.sin(np.pi * t / 1.3) ** 1.5 + 0.2 * np.sin(ph(400 + 600 * t)) * np.sin(np.pi * t / 1.3), 0.6)
# thrust: cold-gas blast (pressurised hiss with a hard attack + low thump)
t = t_(1.2); hiss = filt(noise(len(t)), 'highpass', 900) * (1 - np.exp(-t / 0.01)) * np.exp(-t / 0.5)
save('thrust', hiss + 0.6 * np.sin(ph(60 * np.ones_like(t))) * np.exp(-t / 0.12), 0.85)
# launch: electric motor whine rising + tyre roar + whoosh
t = t_(1.6); f = 180 + 2600 * (t / 1.6) ** 0.6
whine = (np.sin(ph(f)) + 0.4 * np.sin(ph(2 * f))) * np.minimum(1, t / 0.05) * np.exp(-np.maximum(0, t - 1.0) / 0.3)
save('launch', 0.45 * whine + filt(noise(len(t)), 'bandpass', [80, 1200], 2) * np.minimum(1, t / 0.1) * np.exp(-t / 0.9) + 0.5 * sweep(len(t), 400, 3000) * np.sin(np.pi * t / 1.6), 0.85)
# rocket: shuttle rumble (brown noise roar)
t = t_(2.0); br = np.cumsum(noise(len(t))); br = filt(br - np.mean(br), 'bandpass', [30, 500], 2)
save('rocket', br * np.minimum(1, t / 0.3) * (0.8 + 0.2 * np.sin(2 * np.pi * 9 * t)) + 0.3 * filt(noise(len(t)), 'bandpass', [500, 3000], 2) * np.minimum(1, t / 0.3), 0.85)
# beep: traffic-light chirp
t = t_(0.18); save('beep', np.sin(ph(np.full_like(t, 1600))) * np.exp(-t / 0.08), 0.4)
# cup: plastic cup clatter + liquid splash
t = t_(0.6); clat = sum(filt(noise(len(t)), 'bandpass', [1200, 5000], 2) * np.exp(-np.maximum(0, t - c) / 0.02) * (t >= c) for c in [0.0, 0.11, 0.2])
save('cup', clat + 0.6 * filt(noise(len(t)), 'bandpass', [300, 2500], 2) * np.exp(-np.maximum(0, t - 0.18) / 0.15) * (t >= 0.18), 0.7)
# hiss: long refill hiss (4 s)
t = t_(4.0); save('hiss', filt(noise(len(t)), 'bandpass', [2500, 9000], 2) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t)), 0.4)
# yawn: breathy vocal-ish glide (formant noise)
t = t_(1.1); f = 260 - 90 * t; src = np.sign(np.sin(ph(f))) * 0.3 + np.sin(ph(f))
save('yawn', sum(g * filt(src + 0.6 * noise(len(t)), 'bandpass', [fc * 0.8, fc * 1.2], 2) for fc, g in [(700, 1), (1150, 0.6)]) * np.sin(np.pi * t / 1.1) ** 1.2, 0.5)
# register: cha-ching (bell + drawer)
t = t_(0.9); bell = sum(np.sin(ph(np.full_like(t, f))) * np.exp(-t / d) for f, d in [(2093, 0.4), (2637, 0.35), (3136, 0.3)])
save('register', over(filt(noise(int(0.12 * SR)), 'bandpass', [800, 3000], 2) * np.exp(-t_(0.12) / 0.03), bell, 0.08), 0.6)
# coins: cascade of clinks (cash avalanche)
y = np.zeros(int(1.6 * SR)); tc = t_(0.08)
for i in range(70): f0 = R.uniform(2500, 6000); y = over(y, np.sin(ph(np.full_like(tc, f0))) * np.exp(-tc / 0.015) * R.uniform(0.3, 1), R.uniform(0, 1.5) ** 1.3)
save('coins', y[:int(1.6 * SR)] + 0.15 * filt(noise(int(1.6 * SR)), 'bandpass', [2000, 7000], 2) * np.linspace(1, 0, int(1.6 * SR)), 0.6)
print('ok')
