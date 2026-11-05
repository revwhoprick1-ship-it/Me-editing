---
name: inside-impossible
description: Make a 20–30 s vertical 3D-animated science/biology/hypothetical Short for the "Inside the Impossible" channel (Zack D.-style storytelling, our own look) with three.js inside Remotion, Kokoro or ElevenLabs narration, synthesized SFX and DOF/bloom post. Use when the user asks for a new "Inside the Impossible" video, a "what happens if…" 3D explainer, or "another one like the gum video".
---

# Inside the Impossible — 3D explainer Short

Read `inside-impossible/PIPELINE.md` (tools, licences, commands) and `inside-impossible/REFERENCE_ANALYSIS.md` (what the
reference channels do) first. The first video is `src/inside/GumShort.tsx` — copy it as the template.

## Rules
1. **Facts first.** Every on-screen or spoken claim gets a row in the video's `SCRIPT.md` fact table with a source; hedge
   anything approximate ("usually", "a few days", "rare"). Hypotheticals are labelled as hypothetical.
2. **Narration is the clock.** Cuts, captions, chips and SFX are keyed to word timestamps (`T`/`S` tables), never to
   hand-typed times.
3. **A new image every 1–2.5 s, cut on meaning.** Every hold moves (creeping push / glide). Scale jumps (person → organ →
   cell → person) are the signature.
4. **Own assets only.** Characters, organs and props are procedural (`src/inside/kit/`). No celebrity likeness, no film
   IP, no models with unclear licences.
5. **Look:** sky-blue gradient studio for people, wet physical tissue + endoscope point light + fog for insides,
   DOF on the subject, bloom only on highlights, ACES, vignette. One cold/warm colour code per story.
6. **Captions:** 2–3 words, centred at y≈1240, Inter 800, one yellow keyword; chips (top, y≈250) carry numbers and terms.
7. **Sound:** a sound for every visible action (`make_sfx.py`), body ambience under insides, music ducked under the
   voice, final −14 LUFS.
8. **Loop:** the last shot matches the first framing.
9. **Verify:** stills of every shot before the render; after the render, frame QA + loudness; fix and re-render.

## Gotchas
- `at(word, n)` matches lower-case words: "In" also matches "in" ("down in seconds"), "Just" matches "just" — check
  the n-th occurrence against the words JSON.
- Eyes: iris/pupil must sit ON the eyeball (spherical caps), or they render as rings.
- Capsules are Y-aligned: rotate brows by π/2.
- Tunnel villi are static instances at 0.93 × radius; keep that tube's squeeze mild.
