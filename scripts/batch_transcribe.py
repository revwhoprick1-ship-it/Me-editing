# Transcribe every footage/work/*.mp4 once (faster-whisper large-v3, word times)
# -> footage/work/<name>.words.json and <name>.segs.txt. Skips files already done.
import json, subprocess, sys, pathlib
import numpy as np
from faster_whisper import WhisperModel

model = WhisperModel("distil-large-v3", device="cpu", compute_type="int8", cpu_threads=4)
for mp4 in sorted(pathlib.Path("footage/work").glob("*.mp4")):
    out = mp4.with_suffix(".words.json")
    if out.exists():
        continue
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    segs, _ = model.transcribe(audio, word_timestamps=True, language="en", beam_size=1, condition_on_previous_text=False)
    words = [{"text": w.word.strip(), "startMs": round(w.start * 1000), "endMs": round(w.end * 1000)}
             for s in segs for w in s.words]
    json.dump(words, open(out, "w"), indent=1)
    seg = subprocess.run([sys.executable, "scripts/speech_segments.py", str(mp4), "-32"], capture_output=True, text=True).stdout
    mp4.with_suffix(".segs.txt").write_text(seg)
    print(mp4.name, len(words), "words", flush=True)
