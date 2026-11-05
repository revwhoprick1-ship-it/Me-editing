# Multi-voice dialogue for "Inside the Impossible": one Kokoro voice per character, assembled into one track.
#   python3 inside-impossible/audio/dialogue.py <lines.json> <out_wav> <out_json> [models_dir] [lead_ms=300]
# lines.json: [{id, who, voice, speed, gap (ms after the line), text}]
# out_json:   [{id, who, text, startMs, endMs, env: [0..1 per 30 fps frame, for jaw lip sync], words: [{text, startMs, endMs}]}]
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

src, out_wav, out_json = sys.argv[1], sys.argv[2], sys.argv[3]
mdir = sys.argv[4] if len(sys.argv) > 4 else os.path.expanduser('~/kokoro')
lead = int(sys.argv[5]) if len(sys.argv) > 5 else 300
SR, FPS = 48000, 30

from kokoro_onnx import Kokoro  # noqa: E402
from faster_whisper import WhisperModel  # noqa: E402
k = Kokoro(os.path.join(mdir, 'kokoro-v1.0.int8.onnx'), os.path.join(mdir, 'voices-v1.0.bin'))
wm = WhisperModel('small.en', device='cpu', compute_type='int8')

def trim(a, thr=0.012, pad=0.04, sr=SR):
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx): return a
    s, e = max(0, idx[0] - int(pad * sr)), min(len(a), idx[-1] + int(pad * sr))
    return a[s:e]

def envelope(a):
    hop = SR // FPS; n = int(np.ceil(len(a) / hop))
    rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    db = 20 * np.log10(rms + 1e-9)
    v = np.clip((db + 42) / 26, 0, 1)                      # -42 dBFS closed .. -16 dBFS fully open
    v = np.convolve(v, [0.25, 0.5, 0.25], mode='same')      # soften frame-to-frame chatter
    return [round(float(x), 3) for x in v]

lines = json.load(open(src))
track, out, t = [np.zeros(int(lead / 1000 * SR), np.float32)], [], lead
for L in lines:
    a, sr = k.create(L['text'], voice=L['voice'], speed=L.get('speed', 1.0), lang='en-us')
    a = resample_poly(a.astype(np.float64), SR // 1000 * 1, sr // 1000).astype(np.float32) if sr != SR else a.astype(np.float32)
    a = trim(a)
    a16 = resample_poly(a.astype(np.float64), 1, 3).astype(np.float32)      # 48k -> 16k for whisper
    segs, _ = wm.transcribe(a16, word_timestamps=True, language='en', initial_prompt=L['text'])
    words = [{'text': w.word.strip(), 'startMs': t + round(w.start * 1000), 'endMs': t + round(w.end * 1000)} for s in segs for w in s.words]
    dur = round(len(a) / SR * 1000)
    out.append({'id': L['id'], 'who': L['who'], 'text': L['text'], 'startMs': t, 'endMs': t + dur, 'env': envelope(a), 'words': words})
    print(f"{L['id']:10s} {t/1000:6.2f}s +{dur/1000:.2f}s  {' '.join(w['text'] for w in words)}")
    track += [a, np.zeros(int(L.get('gap', 250) / 1000 * SR), np.float32)]
    t += dur + L.get('gap', 250)
full = np.concatenate(track)
full = full / max(1e-6, np.max(np.abs(full))) * 0.89
os.makedirs(os.path.dirname(out_wav), exist_ok=True)
sf.write(out_wav, full, SR, subtype='PCM_16')
json.dump(out, open(out_json, 'w'))
print(f'total {len(full) / SR:.2f} s, {len(out)} lines -> {out_wav}, {out_json}')
