# Inside the Impossible — production pipeline

Research topic → fact sheet + script → narration + word timings → shot plan keyed to words → 3D scenes (three.js in
Remotion) → post (DOF/bloom/ACES/vignette) → synthesized SFX + music bed → render → QA (stills, frame QA, loudness) → fix → final.

## Tools chosen (and why)
| Tool | Role | Why |
|---|---|---|
| **Remotion 4 + @remotion/three** | timeline, compositing, captions, audio, render | already the repo's engine; deterministic frame-by-frame render |
| **three.js / React Three Fiber** | all 3D: character, organs, props | real geometry, materials, lights, cameras; runs headless here (swangle) |
| **postprocessing 6.39 + @react-three/postprocessing 2.16** (Zlib/MIT) | depth of field, bloom, ACES tone map, vignette | the "expensive" macro look of the references |
| **Kokoro-82M TTS** (Apache-2.0, via kokoro-onnx) | narration, offline, free | ElevenLabs free tier was busy; Kokoro `af_heart` transcribes at 98 % word confidence |
| **faster-whisper** | word timestamps | every cut/caption/SFX is keyed to words |
| **numpy/scipy synthesis** | all SFX (`inside-impossible/audio/make_sfx.py`) | original sound, no licensing; reuses MIT dsp helpers |
| **FFmpeg** | mux, loudness (−14 LUFS), QA | |
| Blender | *not used yet* | not installed here and CPU Cycles would take hours per short; three.js + post covers v1. Worth adding later for hero models (export glTF → load in three.js). |

## Skills evaluated (repos inspected read-only: SKILL.md, code, scripts, licences — nothing executed)
| Skill | Licence | Verdict |
|---|---|---|
| `mromidev/claude-animated-shorts` | MIT | **Adopted as a code library** (vendored to `inside-impossible/vendor/claude-animated-shorts`, minus the reference frames it ships from another channel). Reused: DSP + whoosh/bubble synths, the post-processing approach, the camera rules (glides, creeping push-ins, impact kicks), the QA script `short_qa.py`. **Not** its look (2D bean-head cards in a painted 3D town), which is not our target. |
| `JulianVolodia/claudestory_claude-remotion-skill` | MIT | Not installed: 2D motion-graphics rules (easing, stagger, grain, verification loop) that duplicate the Remotion skills already installed. Its "render → look → fix" rule is followed here anyway. |
| `remotion-dev/skills` (official) | Remotion licence | **Already installed** in this environment (`remotion:*` skills). |
| Others found (three.js skill packs: OpenAEC/Impertio, CloudAI-X; claudedesignskills Blender pipeline) | various | Not needed for v1: they teach three.js basics we already use; no skill renders full 3D shorts end to end. |

Installed for this channel: our own skill `.claude/skills/inside-impossible/SKILL.md` (this pipeline as instructions).

## Reusable code
- `src/inside/kit/three.tsx`: noise/gradient textures, `tissueMat` (wet organ material), `xrayMat`, `Cam`, `useTunnel` + `shapeTunnel` + `ring` (any tube organ with peristalsis), `Post`.
- `src/inside/kit/character.tsx`: **Max**, the channel's recurring procedural character (jaw/chew, blink, eyes wide, brows, look, gulp, x-ray mode).
- `src/inside/GumShort.tsx`: the first video; copy it as the template for the next (shot table `S`, `CHIPS`, `FX`).
- `inside-impossible/audio/tts.py`: script → narration WAV + words JSON. `inside-impossible/audio/make_sfx.py`: SFX bank.

## Make the next video
1. Fact sheet + script (~3.4 words/s, 22–30 s). Hook = the situation in one line; "you might think…" misconception; the visual journey; the true answer; a short safety/real-world note; a loopable end.
2. `python3 inside-impossible/audio/tts.py script.txt vo_<slug>` → fix homophones in the JSON.
3. Copy `GumShort.tsx` → new file; set the word anchors in `T`/`S`, build each shot from the kit; register in `src/Root.tsx`.
4. Stills: `cd .work && bash stills.sh <Comp> <name> <ms…>` → look at every shot, fix.
5. Render: `bash .work/render.sh <Comp>:<out>` → loudnorm −14 LUFS → `python3 inside-impossible/vendor/claude-animated-shorts/templates/scripts/short_qa.py out/<out>.mp4 .work/qa_<out>`.

## Licences (keep this list current)
- 3D models/textures: **all procedural, ours** (no third-party models). Two candidate models were rejected because their licences are unclear (three.js example `facecap.glb`, a Ready Player Me avatar).
- Narration: Kokoro-82M weights, Apache-2.0 (commercial use allowed).
- Music: "Investigations", Kevin MacLeod (incompetech.com), **CC BY 4.0: put the credit in the description**:
  `Music: "Investigations" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0`
- SFX: synthesized in-house.
- Vendored code: MIT (claude-animated-shorts), see its LICENSE.
