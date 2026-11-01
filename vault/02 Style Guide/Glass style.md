---
tags: [style, glass, motion-design]
---
# Glass style (v1, 2026-11-01)

**User:** "Okay so it looks ass" (about the v7 hybrid: pills/stickers/emoji on the Jorho frame). "What I wanted was something like this https://vt.tiktok.com/ZSgTwQu8k/ NOT EXACTLY LIKE THAT BUT SOMETHING LIKE THAT… maybe some 2d animations of people (football)."

**Reference** (realaiassemble, "raw 15 second podcast clip … text behind his head, glass UI cards that morph with every line, a 3D globe and a full sound design pass"):
- full-frame 9:16 on the speaker, no black bars, no meme top line;
- dark cinematic blue grade with a vignette;
- phrase captions that build word by word (clean sans), with keywords in serif italic and a glow;
- huge serif italic word BEHIND the head ("realization", "proactive");
- a frosted glass UI card (Daily habits checklist + progress ring) that fills in line by line while the background blurs;
- orbit rings around the head with person avatar nodes and constellation lines;
- zoom out to a globe with the speaker's head on top;
- a black-and-white beat with a strike-through for "it's not X, it's Y", then colour comes back with light streaks;
- soft whooshes, clicks and dings, never meme SFX.

**Our version** (`src/glass/memory.tsx`, comp `GlassMemory`, t4 Trevor "keepsakes"):
- `Cam` full frame, baseH 1040, grade `contrast(1.16) saturate(0.7) brightness(0.8)`, plus a teal soft-light layer, a `color` layer at 0.16 and a vignette (Jaguars teal, not purple).
- **Captions:** Inter 500, 60 px white. Keywords use Instrument Serif italic 84 px in ice-teal with a glow (`src/mgFonts.ts`). Each word blurs in. Captions sit at y≈1330 and move up to y≈930 while a card is centred.
- **Behind-head words:** Instrument Serif italic 160–250 px with a gradient fill, in Cam's `behind` slot, with a rembg matte on top (`scripts/person_matte.py`, frames cropped to x 600–1260, `public/matte/g8a|g8b`).
- **Glass card** "Trevor's keepsakes": the rows tick on the matching lines, the ring goes 33 → 67 → 100 %, and it gets a gold glow at 100 %.
- **Orbit:** rings plus 7 fan avatar nodes, each drawing a gold signature squiggle ("I've signed a ton of these for people").
- **2D people:** a flat football QB #16 throws a spiral with a light trail to a receiver who runs in and catches it. The helmets need a light outline or they disappear on the dark grade.
- **B&W "look back" beat** with a glass timeline (2017 Clemson → 2019 Title → 2021 NFL → Now) that rewinds; colour comes back with light streaks.
- **SFX:** jorho-whoosh / swish / click / ting / pop, a soft love-impact. Music: Blue at 0.13.
- **Who talks:** checked with face crops. The left host asks "signed jerseys, game worn?", so the shot cuts to him.
