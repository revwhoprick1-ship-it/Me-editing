"""Word-level transcript with faster-whisper.
usage: python3 tools/transcribe.py <media> [out.json] [--model small.en] [--beam 1]
out json: [{s, e, t, w: [[start, end, word], ...]}, ...]  (also prints the segments)"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opt = {a.split('=')[0][2:]: a.split('=')[1] for a in sys.argv[1:] if a.startswith('--') and '=' in a}
src = args[0]; out = args[1] if len(args) > 1 else src.rsplit('.', 1)[0] + '.json'
m = WhisperModel(opt.get('model', 'small.en'), device='cpu', compute_type='int8', cpu_threads=4)
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
segs, _ = m.transcribe(audio, word_timestamps=True, language='en', beam_size=int(opt.get('beam', 1)), vad_filter=True, condition_on_previous_text=False)
res = []
for s in segs:
    res.append({'s': round(s.start, 2), 'e': round(s.end, 2), 't': s.text.strip(), 'w': [[round(w.start, 2), round(w.end, 2), w.word] for w in s.words]})
    print(f'{s.start:7.1f} {s.text.strip()}', flush=True)
json.dump(res, open(out, 'w'))
