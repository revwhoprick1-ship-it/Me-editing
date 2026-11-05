# SFX for #003 (dogs), own numpy synthesis + a Kokoro "babble" bed (many voices at once). 48 kHz mono -> public/inside/sfx/.
#   python3 inside-impossible/audio/make_sfx_dogs.py [kokoro_models_dir]
import os, sys
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'inside', 'sfx')
os.makedirs(OUT, exist_ok=True)
R = np.random.default_rng(3)
t_ = lambda d: np.arange(int(d * SR)) / SR
def filt(x, kind, f, order=4): return sosfilt(butter(order, f, kind, fs=SR, output='sos'), x)
def norm(x, p=0.9): return x / (np.max(np.abs(x)) + 1e-9) * p
def fade(x, a=0.003, b=0.03):
    x = x.copy(); na, nb = int(a * SR), int(b * SR); x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb); return x
def save(name, x, p=0.9): sf.write(os.path.join(OUT, f'{name}.wav'), norm(fade(np.asarray(x, float)), p).astype(np.float32), SR)
def over(a, b, off=0.0):
    k = int(off * SR); n = max(len(a), k + len(b)); y = np.zeros(n); y[:len(a)] += a; y[k:k + len(b)] += b; return y
def ph(f): return 2 * np.pi * np.cumsum(f) / SR
def noise(n): return R.standard_normal(n)

def bark(f0=420, dur=0.22, bright=1.0):
    """formant bark: glottal-ish pulse train with a fast pitch rise-fall, through 3 vowel formants ('wuf'), plus breath"""
    t = t_(dur); f = f0 * (1 + 0.35 * np.exp(-((t - 0.03) / 0.03) ** 2)) * (1 - 0.25 * t / dur)
    src = np.sign(np.sin(ph(f))) * 0.5 + np.sin(ph(f)) + 0.4 * np.sin(ph(2 * f))
    y = sum(g * filt(src, 'bandpass', [fc * 0.8, fc * 1.25], 2) for fc, g in [(650 * bright, 1.0), (1250 * bright, 0.7), (2600 * bright, 0.35)])
    y += 0.25 * filt(noise(len(t)), 'bandpass', [900, 4000], 2)
    env = (1 - np.exp(-t / 0.006)) * np.exp(-t / (dur * 0.32))
    return y * env

save('bark', over(bark(380, 0.24), bark(400, 0.2), 0.26), 0.85)
save('bark_s', over(bark(620, 0.15, 1.3), bark(660, 0.13, 1.3), 0.17), 0.8)
crowd = np.zeros(int(2.6 * SR))
for i in range(34):
    crowd = over(crowd, bark(R.uniform(300, 750), R.uniform(0.12, 0.25), R.uniform(0.9, 1.35)) * R.uniform(0.3, 1.0), R.uniform(0, 2.3))
save('bark_crowd', crowd[:int(2.6 * SR)], 0.8)
# record scratch: noise through a fast up-down band sweep
t = t_(0.42); fc = 600 + 2800 * np.abs(np.sin(np.pi * t / 0.21)); y = np.zeros_like(t); nz = noise(len(t))
for k in range(0, len(t), 240): y[k:k + 240] = filt(nz[max(0, k - 480):k + 240], 'bandpass', [fc[k] * 0.7, fc[k] * 1.4], 2)[-len(y[k:k + 240]):]
save('scratch', y * np.exp(-t / 0.3), 0.7)
# gavel: wood knock (two modes + click) and a little room
t = t_(0.5); knock = (np.sin(ph(np.full_like(t, 190))) * np.exp(-t / 0.05) + 0.6 * np.sin(ph(np.full_like(t, 520))) * np.exp(-t / 0.025)
                      + 0.8 * filt(noise(len(t)), 'bandpass', [1500, 5000], 2) * np.exp(-t / 0.004))
room = filt(noise(len(t)), 'lowpass', 2500) * np.exp(-t / 0.18) * 0.08
save('gavel', over(knock + room, 0.5 * knock, 0.0), 0.95)
# bowl clink (steel)
t = t_(0.7); save('bowl', sum(np.sin(ph(np.full_like(t, f))) * np.exp(-t / d) / (i + 1) for i, (f, d) in enumerate([(1870, 0.25), (3120, 0.15), (4410, 0.09), (980, 0.3)])), 0.6)
# pop (word cards)
t = t_(0.09); save('pop', np.sin(ph(900 + 1600 * np.exp(-t / 0.015))) * np.exp(-t / 0.025), 0.55)
# news chime: two-tone synth hit + sub
t = t_(1.2); tone = lambda f, a: np.sin(ph(np.full_like(t, f))) * np.exp(-np.maximum(0, t - a) / 0.35) * (t >= a)
save('chime', tone(659, 0) + tone(988, 0.12) + 0.5 * tone(1319, 0.12) + 0.7 * np.sin(ph(np.full_like(t, 82))) * np.exp(-t / 0.4), 0.7)
# cartoon boing (jump)
t = t_(0.55); save('boing', np.sin(ph(220 + 260 * np.sin(np.pi * t / 0.55) * (1 + 0.15 * np.sin(2 * np.pi * 28 * t)))) * np.exp(-t / 0.3), 0.6)
# short "aah!" scream-ish: rising formant tone
t = t_(0.45); f = 380 + 260 * (t / 0.45); src = np.sign(np.sin(ph(f))) * 0.4 + np.sin(ph(f))
save('scream', sum(g * filt(src, 'bandpass', [fc * 0.8, fc * 1.2], 2) for fc, g in [(850, 1), (1600, 0.6), (2800, 0.3)]) * np.sin(np.pi * t / 0.45) ** 0.5, 0.6)
# school bell: inharmonic ring
t = t_(1.4); save('bell', sum(np.sin(ph(np.full_like(t, f))) * np.exp(-t / d) for f, d in [(880, 0.9), (2380, 0.5), (3510, 0.3), (5040, 0.2)]) * (1 + 0.6 * np.sin(2 * np.pi * 18 * t)), 0.55)
# paper rustle/tear
t = t_(0.5); save('paper', filt(noise(len(t)), 'bandpass', [1800, 7000], 2) * (0.4 + 0.6 * (R.random(len(t)) > 0.97).astype(float).cumsum() % 2) * np.exp(-t / 0.25), 0.55)
# keyboard typing (1.6 s of clicks)
y = np.zeros(int(1.6 * SR)); tc = t_(0.03)
for i in range(22): y = over(y, (filt(noise(len(tc)), 'bandpass', [2000, 6000], 2) + 0.5 * np.sin(ph(np.full_like(tc, 340)))) * np.exp(-tc / 0.006) * R.uniform(0.5, 1), i * 0.07 + R.uniform(0, 0.03))
save('keys', y[:int(1.6 * SR)], 0.5)
# camera flash: click + charge whine
t = t_(0.35); save('flash', 0.9 * filt(noise(len(t)), 'highpass', 3000) * np.exp(-t / 0.01) + 0.15 * np.sin(ph(3000 + 6000 * t)) * np.exp(-t / 0.15), 0.5)
# crowd gasp: breathy swell
t = t_(0.7); save('gasp', filt(noise(len(t)), 'bandpass', [500, 3500], 2) * np.sin(np.pi * np.clip(t / 0.5, 0, 1)) ** 2 * np.exp(-np.maximum(0, t - 0.35) / 0.12), 0.6)
# applause/cheer (2.2 s): many clap transients
y = np.zeros(int(2.2 * SR)); tc = t_(0.02)
for i in range(420): y = over(y, filt(noise(len(tc)), 'bandpass', [900, 5000], 2) * np.exp(-tc / 0.004) * R.uniform(0.3, 1), R.uniform(0, 2.15))
save('cheer', y[:int(2.2 * SR)] * np.minimum(1, np.linspace(0, 5, int(2.2 * SR))) * np.linspace(1, 0.4, int(2.2 * SR)), 0.6)
# fanfare stinger: brassy saws I–IV–V–I
def brass(f, d):
    t = t_(d); s = sum(np.sin(ph(np.full_like(t, f * h))) / h for h in range(1, 9)); return filt(s, 'lowpass', 2500) * (1 - np.exp(-t / 0.03)) * np.exp(-t / (d * 0.8))
fan, off = np.zeros(1), 0.0
for ch, d in [((262, 330, 392), 0.18), ((262, 330, 392), 0.18), ((349, 440, 523), 0.2), ((392, 494, 587), 0.2), ((523, 659, 784), 0.9)]:
    fan = over(fan, sum(brass(f, d + 0.1) for f in ch), off); off += d
save('fanfare', fan, 0.7)
# beds (loopable-ish, 4 s): room tone, city, hall murmur, paw steps
n = int(4 * SR)
save('room', filt(noise(n), 'lowpass', 300) * 0.5 + filt(noise(n), 'bandpass', [80, 140], 2), 0.25)
city = filt(np.cumsum(noise(n)) / 400, 'highpass', 30) + 0.2 * filt(noise(n), 'bandpass', [300, 1500], 2)
city = over(city, 0.25 * np.sin(ph(np.full(int(0.5 * SR), 440))) * np.hanning(int(0.5 * SR)), 2.4)  # distant horn
save('city', city[:n], 0.35)
save('hall', filt(noise(n), 'bandpass', [200, 1200], 2) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * t_(4))), 0.3)
y = np.zeros(n); tc = t_(0.04)
for i in range(int(4 / 0.11)): y = over(y, filt(noise(len(tc)), 'bandpass', [400, 2500], 2) * np.exp(-tc / 0.008) * R.uniform(0.4, 1), i * 0.11 + R.uniform(0, 0.02))
save('steps', y[:n], 0.4)

# babble: several Kokoro voices saying dog things at once (local, Apache-2.0 model)
mdir = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/kokoro')
try:
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(mdir, 'kokoro-v1.0.int8.onnx'), os.path.join(mdir, 'voices-v1.0.bin'))
    said = [('am_puck', 'Squirrel! Squirrel! Where?'), ('bm_george', 'I would like a word about the vacuum.'), ('af_sky', 'Is it dinner? It feels like dinner.'),
            ('am_echo', 'Who is a good boy? Me. I am.'), ('af_nicole', 'Throw the ball. Throw it. Throw it!'), ('am_fenrir', 'The cat started it.'), ('bf_emma', 'Walk? Did someone say walk?')]
    bab = np.zeros(int(3.2 * SR))
    for i, (v, s) in enumerate(said):
        a, sr = k.create(s, voice=v, speed=1.15, lang='en-us'); a = resample_poly(a.astype(float), SR, sr)
        bab = over(bab, a * (0.55 + 0.45 * ((i + 1) % 3) / 2), 0.12 * i)
    save('babble', filt(bab[:int(3.2 * SR)], 'bandpass', [150, 6000], 2), 0.6)
except Exception as e:  # noqa: BLE001
    print('babble skipped:', e)
print('ok', sorted(os.listdir(OUT)))
