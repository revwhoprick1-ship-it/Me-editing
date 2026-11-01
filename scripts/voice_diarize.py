# Voice-based speaker check: embed each phrase (resemblyzer), cluster voices, then name each cluster by the seat whose
# mouth moves most across ALL of that cluster's phrases (laughs average out). Prints phrases with their seat.
# Usage: python3 scripts/voice_diarize.py video.mp4 seats.json words.json from_ms to_ms [n_speakers]
import json, subprocess, sys
import numpy as np
from resemblyzer import VoiceEncoder, preprocess_wav
from sklearn.cluster import AgglomerativeClustering
sys.argv += [] ; video, seats_p, words_p, a, b = sys.argv[1:6]; a, b = int(a), int(b)
n_spk = int(sys.argv[6]) if len(sys.argv) > 6 else 3
words = [w for w in json.load(open(words_p)) if a <= w['startMs'] < b]
raw = subprocess.run(['ffmpeg', '-v', '0', '-i', video, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
pcm = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
# phrases: split on gaps > 350 ms or every ~1.6 s
ph, cur = [], []
for j, w in enumerate(words):
    if cur and (w['startMs'] - cur[-1]['startMs'] > 700 or w['startMs'] - cur[0]['startMs'] > 1600):
        ph.append(cur); cur = []
    cur.append(w)
if cur: ph.append(cur)
enc = VoiceEncoder(verbose=False)
embs, keep = [], []
for p in ph:
    s = p[0]['startMs']; e = p[-1]['startMs'] + 350
    seg = pcm[int(s * 16):int(e * 16)]
    if len(seg) < 16000 * 0.45: seg = pcm[int(s * 16):int((s + 600) * 16)]
    embs.append(enc.embed_utterance(preprocess_wav(seg, source_sr=16000))); keep.append(p)
E = np.array(embs)
lab = AgglomerativeClustering(n_clusters=min(n_spk, len(E)), metric='cosine', linkage='average').fit_predict(E)
# visual naming via speaker_check's per-word mouth scores
out = subprocess.run(['python3', 'scripts/speaker_check.py', video, seats_p, words_p, str(a), str(b), '-v'], capture_output=True, text=True).stdout
score = {}
for line in out.splitlines():
    parts = line.split()
    if len(parts) > 3 and parts[0].isdigit() and ':' in parts[2]:
        score.setdefault(int(parts[0]), {k: float(v) for k, v in (x.split(':') for x in parts if ':' in x and x[0] in 'LMR')})
names = {}
for c in sorted(set(lab)):
    tot = {}
    for p, l in zip(keep, lab):
        if l != c: continue
        for w in p:
            for k, v in score.get(w['startMs'], {}).items(): tot[k] = tot.get(k, 0) + v
    names[c] = max(tot, key=tot.get) if tot else '?'
    print(f'cluster {c} -> {names[c]}  ' + ' '.join(f'{k}:{v:.1f}' for k, v in sorted(tot.items())))
for p, l in zip(keep, lab):
    print(f"{p[0]['startMs']:>6}-{p[-1]['startMs']:>6} c{l} {names[l]}  " + ' '.join(w['text'] for w in p))
