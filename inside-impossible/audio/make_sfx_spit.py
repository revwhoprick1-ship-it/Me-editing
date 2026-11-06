# SFX for #004 (spit vs the ocean), own numpy synthesis. 48 kHz mono -> public/inside/sfx/.
#   python3 inside-impossible/audio/make_sfx_spit.py
import os
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'inside', 'sfx')
R = np.random.default_rng(11)
t_ = lambda d: np.arange(int(d * SR)) / SR
def filt(x, kind, f, order=4): return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)
def norm(x, p=0.9): return x / (np.max(np.abs(x)) + 1e-9) * p
def fade(x, a=0.002, b=0.03):
    x = x.copy(); na, nb = int(a * SR), int(b * SR); x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x
def save(name, x, p=0.9): sf.write(os.path.join(OUT, f'{name}.wav'), norm(fade(np.asarray(x, float)), p).astype(np.float32), SR)
def over(a, b, off=0.0):
    k = int(off * SR); n = max(len(a), k + len(b)); y = np.zeros(n); y[:len(a)] += a; y[k:k + len(b)] += b; return y
def ph(f): return 2 * np.pi * np.cumsum(f) / SR
def noise(n): return R.standard_normal(n)

def spit(d=0.32, bright=1.0):
    """'ptoo': lip pop (low thump + click) then a wet hiss burst with a downward band sweep and a few wet crackles"""
    t = t_(d)
    pop = np.sin(ph(np.full_like(t, 140))) * np.exp(-t / 0.012) + 0.6 * filt(noise(len(t)), 'bandpass', [1500, 4000], 2) * np.exp(-t / 0.004)
    fc = 3200 * bright * (0.45 + 0.55 * np.exp(-t / 0.09)); y = np.zeros_like(t); nz = noise(len(t))
    for k in range(0, len(t), 256): y[k:k + 256] = filt(nz[max(0, k - 512):k + 256], 'bandpass', [fc[k] * 0.5, min(SR / 2 - 100, fc[k] * 1.6)], 2)[-len(y[k:k + 256]):]
    hiss = y * (1 - np.exp(-t / 0.01)) * np.exp(-t / 0.08)
    crack = np.zeros_like(t)
    for i in range(6): c = int(R.uniform(0.02, d * 0.6) * SR); crack[c:c + 120] += R.uniform(-1, 1) * np.hanning(120)
    return 0.7 * pop + hiss + 0.4 * filt(crack, 'highpass', 2000)

def drip(f0=900, d=0.18):
    t = t_(d); return np.sin(ph(f0 * (1 + 1.4 * np.exp(-t / 0.02)))) * np.exp(-t / 0.05) * (1 - np.exp(-t / 0.002))

save('spit', spit(), 0.85)
t = t_(0.7); save('puff', filt(noise(len(t)), 'bandpass', [200, 900], 2) * np.sin(np.pi * np.clip(t / 0.7, 0, 1)) ** 2 + 0.3 * np.sin(ph(np.full_like(t, 90 + 40 * t))) * np.sin(np.pi * t / 0.7), 0.4)
save('plip', drip(1300, 0.15) * 0.6, 0.35)
save('drip', over(drip(700, 0.2), 0.5 * drip(1100, 0.15), 0.06), 0.6)
# counter: accelerating ticks for 2.4 s
y = np.zeros(int(2.4 * SR)); tc = t_(0.02); tt = 0.0; gap = 0.16
while tt < 2.35: y = over(y, np.sin(ph(np.full_like(tc, 2600 + 1500 * tt / 2.4))) * np.exp(-tc / 0.004), tt); tt += gap; gap = max(0.022, gap * 0.9)
save('counter', y[:int(2.4 * SR)], 0.5)
# riser: time-lapse whoosh rising over 4 s
t = t_(4.0); f = 120 * (12 ** (t / 4)); save('riser', 0.6 * filt(noise(len(t)), 'bandpass', [300, 6000], 2) * (t / 4) ** 2 + 0.4 * np.sin(ph(f)) * (t / 4), 0.5)
# rapid spits (machine-gun ptoo) for 4 s, every 0.26 s
y = np.zeros(int(4.0 * SR))
for i in range(15): y = over(y, spit(0.2, R.uniform(0.9, 1.2)) * R.uniform(0.6, 1), i * 0.26 + 0.156)
save('spit_rapid', y[:int(4.0 * SR)], 0.6)
# clock bed: fast ticking (time flying)
y = np.zeros(int(2.0 * SR)); tc = t_(0.015)
for i in range(int(2.0 / 0.0625)): y = over(y, filt(noise(len(tc)), 'bandpass', [2500, 6000], 2) * np.exp(-tc / 0.003) * (1 if i % 2 else 0.6), i * 0.0625)
save('clock', y[:int(2.0 * SR)], 0.45)
# drain: big glug + suck
t = t_(1.3); glug = sum(np.sin(ph(np.full_like(t, f))) * np.exp(-((t - c) / 0.05) ** 2) for f, c in [(160, 0.1), (130, 0.35), (110, 0.6), (95, 0.85)])
save('drain', glug + 0.5 * filt(noise(len(t)), 'lowpass', 900) * np.sin(np.pi * t / 1.3) ** 2, 0.7)
# pour (bottle filling) 2.5 s: trickle + rising cavity resonance
t = t_(2.5); tr = filt(noise(len(t)), 'bandpass', [800, 5000], 2) * (0.6 + 0.4 * np.abs(np.sin(ph(np.full_like(t, 7)))))
save('pour', tr * np.minimum(1, t / 0.2) + 0.25 * np.sin(ph(400 + 500 * t / 2.5)) * np.minimum(1, t / 0.2), 0.45)
# dry cough / rasp
t = t_(0.5); save('cough', filt(noise(len(t)), 'bandpass', [300, 2400], 2) * (np.exp(-t / 0.06) + 0.7 * np.exp(-np.maximum(0, t - 0.2) / 0.06) * (t > 0.2)), 0.55)
# crowd spit: 40 overlapping spits
y = np.zeros(int(1.2 * SR))
for i in range(40): y = over(y, spit(R.uniform(0.18, 0.3), R.uniform(0.8, 1.3)) * R.uniform(0.3, 1), R.uniform(0, 0.25))
save('crowd_spit', y[:int(1.2 * SR)], 0.7)
# spit rain (2.6 s): dense drips + hiss
y = 0.3 * filt(noise(int(2.6 * SR)), 'bandpass', [1500, 7000], 2)
for i in range(260): y = over(y, drip(R.uniform(600, 1800), 0.08) * R.uniform(0.2, 0.7), R.uniform(0, 2.5))
save('spit_rain', y[:int(2.6 * SR)] * np.minimum(1, np.linspace(0, 6, int(2.6 * SR))), 0.6)
# water rising: low swell + flowing noise (2.4 s)
t = t_(2.4); save('water_rise', filt(noise(len(t)), 'lowpass', 600) * (0.3 + 0.7 * t / 2.4) + 0.4 * np.sin(ph(55 + 20 * t)) * (t / 2.4), 0.6)
print('ok')
