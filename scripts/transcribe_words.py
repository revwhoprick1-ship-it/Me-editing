# Word-level transcript with faster-whisper -> public/words.json
# Usage: python3 scripts/transcribe_words.py public/input.mp4
import json, subprocess, sys

import numpy as np
from faster_whisper import WhisperModel

model = WhisperModel("large-v3", device="cpu", compute_type="int8")
# Decode with ffmpeg ourselves (avoids PyAV version issues).
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
segments, _ = model.transcribe(audio, word_timestamps=True, vad_filter=False, language="en")
words = []
for seg in segments:
    for w in seg.words:
        words.append({"text": w.word.strip(), "startMs": round(w.start * 1000), "endMs": round(w.end * 1000), "p": round(w.probability, 2)})
json.dump(words, open("public/words.json", "w"), indent=1)
for w in words:
    print(f'{w["startMs"]:>6}-{w["endMs"]:<6} {w["p"]:.2f} {w["text"]}')
