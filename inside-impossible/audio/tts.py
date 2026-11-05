# Narration for "Inside the Impossible": local Kokoro-82M TTS (Apache-2.0 weights, via kokoro-onnx) + word timings.
# Free and offline; use ElevenLabs instead when credits allow (same output files, same downstream code).
#   pip install kokoro-onnx soundfile faster-whisper
#   models: kokoro-v1.0.int8.onnx + voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
#   python3 inside-impossible/audio/tts.py <script.txt> <out_basename> [voice=af_heart] [speed=1.05] [models_dir]
# Writes public/inside/<out>.wav (48 kHz mono) and src/inside/<out>.words.json ([{text,startMs,endMs,p}]).
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

script, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else 'af_heart'
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.05
mdir = sys.argv[5] if len(sys.argv) > 5 else os.path.expanduser('~/kokoro')
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')

from kokoro_onnx import Kokoro  # noqa: E402
k = Kokoro(os.path.join(mdir, 'kokoro-v1.0.int8.onnx'), os.path.join(mdir, 'voices-v1.0.bin'))
text = open(script).read().strip()
a, sr = k.create(text, voice=voice, speed=speed, lang='en-us')
tmp = os.path.join(ROOT, 'public', 'inside', f'{out}_raw.wav'); sf.write(tmp, a, sr)
wav = os.path.join(ROOT, 'public', 'inside', f'{out}.wav')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-ar', '48000', '-ac', '1', wav], check=True); os.remove(tmp)

from faster_whisper import WhisperModel  # noqa: E402
m = WhisperModel('small.en', device='cpu', compute_type='int8')
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
segs, _ = m.transcribe(np.frombuffer(pcm, np.int16).astype(np.float32) / 32768, word_timestamps=True, language='en')
words = [{'text': w.word.strip(), 'startMs': round(w.start * 1000), 'endMs': round(w.end * 1000), 'p': round(w.probability, 2)} for s in segs for w in s.words]
json.dump(words, open(os.path.join(ROOT, 'src', 'inside', f'{out}.words.json'), 'w'), indent=0)
print(f'{len(a) / sr:.2f} s, {len(words)} words, mean p {np.mean([w["p"] for w in words]):.3f}')
print('CHECK homophones in the transcript against the script (e.g. waste/waist) and fix the JSON by hand.')
