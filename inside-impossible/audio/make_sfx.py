# Synthesized SFX for "Inside the Impossible" (own numpy synthesis; reuses the MIT dsp/sfx_gen helpers vendored from
# mromidev/claude-animated-shorts). Writes 48 kHz mono WAVs to public/inside/sfx/.
#   python3 inside-impossible/audio/make_sfx.py
import os, sys
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'vendor', 'claude-animated-shorts', 'templates', 'audio'))
from dsp import SR, ns, rng, lp, hp, bp, colored, fades, phase  # noqa: E402
from sfx_gen import whoosh, bubbles  # noqa: E402

OUT = os.path.join(HERE, '..', '..', 'public', 'inside', 'sfx')
os.makedirs(OUT, exist_ok=True)
t_ = lambda d: np.arange(ns(d)) / SR


def norm(x, peak=0.9):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=float)
    if x.ndim == 2: x = x.mean(axis=0 if x.shape[0] <= 2 else 1)  # stereo helpers -> mono
    sf.write(os.path.join(OUT, f'{name}.wav'), norm(fades(x, 0.002, 0.02), peak).astype(np.float32), SR)


def over(a, b, off=0.0):
    """mix b into a at off seconds (a is extended if needed)"""
    k = ns(off); n = max(len(a), k + len(b)); y = np.zeros(n); y[:len(a)] += a; y[k:k + len(b)] += b
    return y


def squish(r, dur=0.18, f0=420, f1=180, q=1.0):
    """wet squish: band-passed noise burst whose centre glides down + a soft low thump"""
    t = t_(dur)
    nz = colored(len(t), r, 1.0)
    env = np.exp(-t / (dur * 0.35)) * (1 - np.exp(-t / 0.004))
    fc = f0 * (f1 / f0) ** (t / dur)
    y = np.zeros_like(t)
    for k in range(0, len(t), 256):  # piecewise band-pass sweep
        seg = nz[k:k + 512]
        y[k:k + 256] = bp(seg, max(60, fc[k] * 0.6), fc[k] * 1.6 * q)[:len(y[k:k + 256])]
    thump = np.sin(phase(90 * np.exp(-t * 8))) * np.exp(-t / 0.05)
    return y * env + 0.5 * thump


r = rng(7)
# chew: two quick wet clicks
save('chew', np.concatenate([squish(r, 0.12, 900, 500), np.zeros(ns(0.03)), squish(r, 0.1, 1100, 600)]), 0.6)
# gulp: low pitch-drop "gulp" (resonant) + wet tail
t = t_(0.42)
g = np.sin(phase(260 * np.exp(-t * 4.5))) * np.exp(-t / 0.12) * (1 - np.exp(-t / 0.01))
save('gulp', over(g, 0.5 * squish(r, 0.25, 500, 150), 0.05), 0.9)
# shimmer: x-ray reveal, rising glassy partials
t = t_(1.1)
sh = sum(np.sin(phase(f * (1 + 0.6 * t))) * np.exp(-t / 0.5) / (i + 1) for i, f in enumerate([880, 1320, 1760, 2640]))
save('shimmer', sh * (1 - np.exp(-t / 0.05)) + 0.15 * hp(colored(len(t), r, 0), 6000) * np.exp(-t / 0.3), 0.6)
# tick (counter)
t = t_(0.06)
save('tick', np.sin(phase(2400 * np.ones_like(t))) * np.exp(-t / 0.008), 0.6)
# whoosh into the mouth (late peak = suck-in)
save('whoosh_in', whoosh(1.0, r, peak=0.85, f_lo=200, f_hi=1600, width=0.9, tail=0.12, air=0.2), 0.8)
# squelch (entering an organ)
save('squelch', over(squish(r, 0.4, 700, 120, 1.3), 0.6 * squish(r, 0.2, 400, 160), 0.12), 0.85)
# squeeze: slow wet stretch (peristalsis)
t = t_(0.9)
nz = lp(colored(len(t), r, 1.6), 600)
save('squeeze', nz * np.sin(np.pi * np.clip(t / 0.9, 0, 1)) ** 2 * (1 + 0.5 * np.sin(phase(7 * np.ones_like(t)))), 0.6)
# splash into acid
t = t_(0.8)
sp = hp(colored(len(t), r, 0.8), 500) * np.exp(-t / 0.18) * (1 - np.exp(-t / 0.006))
save('splash', over(sp, 0.6 * bubbles(0.8, r, 40, 400, 2200)), 0.8)
# fizz: acid bubbling bed (loops ~3.6 s)
fz = over(0.35 * hp(colored(ns(3.6), r, 0.4), 2500) * (0.7 + 0.3 * np.sin(phase(1.3 * np.ones(ns(3.6))))), bubbles(3.6, r, 55, 500, 3000))
save('fizz', fz, 0.5)
# deny: soft low "nope" buzz
t = t_(0.45)
save('deny', (np.sign(np.sin(phase(110 * np.ones_like(t)))) * 0.3 + np.sin(phase(220 * np.ones_like(t)))) * np.exp(-t / 0.2) * (1 - np.exp(-t / 0.01)), 0.45)
# sparkle: absorption glitter
t = t_(1.2)
sk = np.zeros_like(t)
for i in range(26):
    k = int(r.uniform(0, 0.9) * SR); L = ns(0.25); f = r.uniform(2500, 6500)
    tl = np.arange(min(L, len(t) - k)) / SR
    sk[k:k + len(tl)] += np.sin(phase(f * np.ones_like(tl))) * np.exp(-tl / 0.05) * r.uniform(0.3, 1)
save('sparkle', sk, 0.55)
# slide: wet slide
save('slide', squish(r, 0.6, 300, 140, 1.5), 0.6)
# thud: soft heavy bump
t = t_(0.5)
save('thud', over(np.sin(phase(70 * np.exp(-t * 3))) * np.exp(-t / 0.12), 0.3 * squish(r, 0.5, 250, 90)), 0.85)
# flip: paper page flip
t = t_(0.35)
save('flip', hp(colored(len(t), r, 0.2), 1500) * np.sin(np.pi * np.clip(t / 0.3, 0, 1)) ** 3 * (1 + 0.6 * np.sin(phase(40 * np.ones_like(t)))), 0.55)
# ding (check)
t = t_(1.2)
save('ding', (np.sin(phase(1568 * np.ones_like(t))) + 0.5 * np.sin(phase(2349 * np.ones_like(t)))) * np.exp(-t / 0.35), 0.5)
# stamp: big impact (X)
t = t_(0.9)
save('stamp', np.sin(phase(55 * np.exp(-t * 2))) * np.exp(-t / 0.25) + 0.7 * lp(colored(len(t), r, 0.5), 1800) * np.exp(-t / 0.06), 0.95)
# alarm: soft two-tone warning beep
t = t_(0.5)
save('alarm', np.sin(phase(np.where(t < 0.22, 880, 660))) * (np.mod(t, 0.25) < 0.18) * np.exp(-t / 0.6), 0.45)
# body ambience: low rumble + slow heartbeat-like pulses (loops 4 s)
t = t_(4.0)
amb = 0.5 * lp(colored(len(t), r, 2.0), 180)
for b0 in [0.2, 1.25, 2.3, 3.35]:
    for dt, a in [(0, 1.0), (0.18, 0.6)]:
        k = ns(b0 + dt); L = ns(0.25); tl = np.arange(L) / SR
        amb[k:k + L] += a * np.sin(phase(55 * np.exp(-tl * 6))) * np.exp(-tl / 0.07)
save('body_amb', amb, 0.5)

# ---- #002 flying ----
from sfx_gen import breeze  # noqa: E402
def rustle(r, dur):
    t = t_(dur); nz = hp(colored(len(t), r, 0.3), 2500)
    return nz * (0.4 + 0.6 * np.abs(np.sin(phase(18 * np.ones_like(t))))) * np.sin(np.pi * np.clip(t / dur, 0, 1))
save('wing_burst', over(whoosh(0.9, r, peak=0.25, f_lo=250, f_hi=2600, width=1.0, tail=0.3, air=0.3), 0.6 * rustle(r, 0.7), 0.05), 0.85)
t = t_(0.35)
save('flap', over(np.sin(phase(75 * np.exp(-t * 4))) * np.exp(-t / 0.08), 0.5 * lp(colored(len(t), r, 1.2), 900) * np.exp(-t / 0.1)), 0.8)
t = t_(0.7)
honk = sum(np.sign(np.sin(phase(f * np.ones_like(t)))) for f in (420, 530)) * 0.25
save('honk', lp(honk, 2500) * ((t < 0.18) | ((t > 0.28) & (t < 0.6))) , 0.5)
t = t_(1.6)
save('grow', np.sin(phase(80 + 160 * t)) * (1 - np.exp(-t / 0.2)) * np.exp(-np.maximum(0, t - 1.2) / 0.15) + 0.2 * lp(colored(len(t), r, 1.0), 400), 0.6)
t = t_(0.8)
save('strain', lp(colored(len(t), r, 1.0), 300) * np.sin(np.pi * np.clip(t / 0.8, 0, 1)) * (1 + 0.5 * np.sin(phase(9 * np.ones_like(t)))), 0.4)
t = t_(1.4)
save('dizzy', np.sin(phase(440 * (1 + 0.08 * np.sin(phase(5 * np.ones_like(t))))) ) * np.exp(-t / 0.7) * (1 - np.exp(-t / 0.05)), 0.4)
cr = np.zeros(ns(1.2))
for i in range(60):
    k = int(r.uniform(0, 1.1) * SR); L = ns(0.01); seg = hp(colored(L, r, 0), 3000) * np.exp(-np.arange(L) / SR / 0.002)
    cr[k:k + L] += seg[:len(cr[k:k + L])] * r.uniform(0.2, 1)
save('crackle', cr, 0.5)
t = t_(1.2)
save('strike', over(np.sin(phase(60 * np.exp(-t * 3))) * np.exp(-t / 0.2), lp(colored(len(t), r, 0.6), 2500) * np.exp(-t / 0.15) * 0.8), 0.95)
sw = np.zeros(ns(2.4))
for i in range(90):
    k = int(r.uniform(0, 2.1) * SR); L = ns(0.25); tl = np.arange(L) / SR
    b = np.sin(phase(70 * np.exp(-tl * 4))) * np.exp(-tl / 0.06) * r.uniform(0.2, 1)
    sw[k:k + L] += b[:len(sw[k:k + L])]
save('swarm', over(sw, 0.4 * hp(colored(len(sw), r, 0.6), 1200)), 0.7)
save('wind', breeze(4.0, r, level=1.0, gust=0.3, bright=900), 0.6)
t = t_(4.0)
jet = lp(colored(len(t), r, 1.4), 700) + 0.3 * bp(colored(len(t), r, 0.2), 2000, 4000) + 0.2 * np.sin(phase(180 * np.ones_like(t)))
save('jet', jet, 0.6)
print('ok', sorted(os.listdir(OUT)))
