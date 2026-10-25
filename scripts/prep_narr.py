# Prepare an Alex narration take for a plan:
#  - loud version (compress + loudnorm) -> public/narr/<name>_loud.mp3
#  - 5 lines (split on silence) with word times -> public/narr/<name>.json
# Usage: python3 scripts/prep_narr.py clark
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

name = sys.argv[1]
src = f"public/narr/{name}.mp3"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-af",
                "acompressor=threshold=-30dB:ratio=6:attack=5:release=120:makeup=10dB,loudnorm=I=-11:TP=-1:LRA=5",
                "-ar", "44100", f"public/narr/{name}_loud.mp3"], check=True)
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
db = np.array([20 * np.log10(np.sqrt(np.mean(a[i:i + 320] ** 2)) + 1e-9) for i in range(0, len(a), 320)])
on = db > -42
segs, start, quiet = [], None, 0
for i, v in enumerate(on):  # 20 ms frames; a line ends after >= 600 ms of silence
    if v:
        if start is None: start = i
        quiet = 0
    elif start is not None:
        quiet += 1
        if quiet >= 30:
            segs.append([start * 20, (i - quiet + 1) * 20]); start = None
if start is not None: segs.append([start * 20, len(on) * 20])
segs = [s for s in segs if s[1] - s[0] > 250]
model = WhisperModel("distil-large-v3", device="cpu", compute_type="int8")
ws, _ = model.transcribe(a, word_timestamps=True, language="en", beam_size=1)
words = [{"text": w.word.strip(), "at": round(w.start * 1000)} for s in ws for w in s.words]
lines = []
for a0, b0 in segs:
    lw = [w for w in words if a0 - 200 <= w["at"] < b0]
    if lw:
        lw[0]["at"] = max(lw[0]["at"], a0)
        lines.append({"file": [max(0, a0 - 60), b0 + 120], "words": lw})
# Merged lines (pause too short): split before "Would" (the closing question).
for i, l in enumerate(lines):
    k = next((j for j, w in enumerate(l["words"]) if j > 0 and w["text"].lower().startswith("would")), None)
    if k:
        cut = l["words"][k]["at"]
        lines[i:i + 1] = [{"file": [l["file"][0], cut - 40], "words": l["words"][:k]},
                          {"file": [cut - 40, l["file"][1]], "words": l["words"][k:]}]
        break
# Short format: `prep_narr.py name wait shohei` = one line per given first word (lines 2..n).
if len(sys.argv) > 2:
    keys = [k.lower() for k in sys.argv[2:]]
    words = [w for w in words if w["at"] < len(a) / 16]
    cuts, ki = [], 0
    for i, w in enumerate(words):
        if ki < len(keys) and i > 0 and w["text"].lower().strip(",.!?").startswith(keys[ki]):
            cuts.append(i); ki += 1
    assert ki == len(keys), f"line starts not found: {keys[ki:]}"
    lines = []
    for j, (s0, s1) in enumerate(zip([0] + cuts, cuts + [len(words)])):
        lw = words[s0:s1]
        nxt = words[s1]["at"] if s1 < len(words) else len(on) * 20
        end_f = max((i for i in range(lw[-1]["at"] // 20, min(len(on), nxt // 20)) if on[i]), default=lw[-1]["at"] // 20)
        lines.append({"file": [max(0, lw[0]["at"] - 60), min(nxt - 30, end_f * 20 + 120)], "words": lw})
json.dump(lines, open(f"public/narr/{name}.json", "w"), indent=1)
for l in lines:
    print(l["file"], " ".join(w["text"] for w in l["words"]))
