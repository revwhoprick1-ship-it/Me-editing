---
tags: [style, motion-graphics, podcast]
date: 2026-10-25
---
# Motion-graphics podcast style (experiment 1)

Ref (user): TikTok `vt.tiktok.com/ZSgQr9Efs`, a Luke Belmar "quality over quantity" edit by an editor's page. Download it with `yt-dlp --impersonate chrome` (needs `pip install curl_cffi`).

## What the ref does
- **Face shot:** full-screen, tight face close-up (no black bars). Dark, moody, cool blue/purple grade with a vignette.
- **Kinetic type:** stacked words that **blur in** one by one as they're spoken. The fonts mix: serif ("Quality"), bold condensed sans ("DON'T"), and italic. Stacks sit on the chest, left or right aligned, with lines in different sizes.
- **Transitions:**
  - a thin **line draws** diagonally ("Quality / Quantity");
  - a **light leak** (pink/green glow) sweeps across on cuts;
  - the video **shrinks into a rounded card** on a light gray gradient;
  - then a **clean white UI scene** with italic text and blurred UI placeholder bars;
  - then a dark b-roll scene with yellow subtitles.
- **Subtitles:** small, plain, white, 1–3 words, between the big kinetic moments.
- **Music:** "Midnight Club" by ADTurnUp (`public/music/midnight-club.mp3`, 129 BPM, beat drop at 2.7 s, placed so the drop hits the first scene change).

## Our build
- **Code:** `src/MotionPod.tsx` (composition `MotionPod`). This is a bespoke edit, not a plan factory.
- **Fonts:** Inter 500/700/800/800 italic and Instrument Serif regular/italic, in `public/fonts/` (from fontsource via jsdelivr).
- **SFX:** `mg-whoosh`, `mg-swoosh`, `mg-swoosh2`, `mg-click`, `mg-boom` (cinematic) and `mg-shimmer`, from myinstants. Clicks go on UI items and counter ticks, the boom on the big words and on the stat landing, the shimmer on the outro.
- **Scenes in v1 (Peyton story, 25.6 s):**
  1. hook: tight face + "TREVOR LAWRENCE *on* PEYTON MANNING" kicker, "During my ROOKIE season / when it was NOT going well." with a line draw;
  2. light leak, then a card on a light gradient with the Peyton cut-out, "Peyton *Manning.*" and 5× MVP / 2× Super Bowl chips;
  3. white checklist (Routine / Film / Study habits), each row ticking ✓ as he says it;
  4. back on the face: "a *perspective.*", "CHALLENGES early on in Indy.";
  5. purple stat scene: 1998 rookie year, counter 0→28, "*interceptions.*", MOST IN THE NFL;
  6. "a couple rough years.";
  7. outro: "Even the greats *struggled first.*"
- **Facts used:** Peyton Manning has 5 MVPs and 2 Super Bowls, and threw 28 INTs as a rookie in 1998 (most in the NFL).


# Preset **Edit2** (user, 2026-10-25: "this will be preset Edit2")
Engine: `src/Edit2.tsx`. Plans: `src/plans/edit2/<name>.ts` (types in `types.ts`). Pick one with `node scripts/use-plan.mjs edit2 <name>`, then render the `Edit2` composition.

## Research: 6 refs (hooks + retention + motion graphics)
| ref | views | hook | keeps them watching | motion graphics to copy |
|---|---|---|---|---|
| TikTok editsbyvirgil, Luke Belmar "quality over quantity" (`vt.tiktok.com/ZSgQr9Efs`) | 60K | starts mid-thought on the strongest line ("Quality…") | something new every ~1.5 s; kinetic word stacks; 3 scene types in 13 s | blur-in stacked type (serif + bold sans + italic), diagonal line draw, light leak, the cam **shrinks into a rounded card** on a light gradient, white UI scene with blurred bars, dark glowing b-roll with yellow subs |
| TikTok editsbyvirgil, "Chris Boustedt style" (`/video/7506142668733320466`) | 29K | direct address + bold claim | **one word at a time** captions, b-roll cutaway every 2–3 s | words blur in; the payoff line becomes a big centred stack ("each and every single time.") |
| YT Shorts, Chris Williamson "10 Years Of Therapy In One Minute" (`oVblLn8NYr4`) | 1.4M | the **list promise** in the title / first line | **numbered chapter cards** (#1–#7, teal number on white) every ~4 s, cinematic b-roll | number cards, tiny single-line subs, moody grade |
| YT Shorts, Diary of a CEO "Three Predictions…" (`2mOendyaCts`) | 2.1M | **title text on top** for the first seconds | numbered prediction text cards on pastel bg | single-word chest captions, text cards |
| YT showreel VfYkGzcFbHY | 333K | "Looking for a… editor" kinetic type | constant UI motion | talking head inside **rounded player cards on white**, a search bar typing, floating review/profile cards |
| YT showreel WUB2pSkwN2M | 162K | glitchy title | fast scene changes | serif/sans glow titles, phone mockups |

**Rules we took:**
- **Hook:** a title on top for the first 2–4 s (a question or promise), and the strongest line first (a cold open from later in the clip is fine).
- **Retention:** a visual change every 1.5–3 s. Alternate face (kinetic type), then a graphic scene (card / UI / diagram / stat), then face. End on a 2 s quote card.
- **Graphics explain what he's saying:** lists become a checklist that ticks; numbers become a counter; football becomes an animated field diagram; a person named becomes a name card.

## Engine pieces
- **Face cam:** tight crop on the speaker's face (`seat_track` track), dark cool grade and vignette, slow push-in, punch-ins.
- **HookTitle** (top, first segment) · **KStack** (kinetic lines, source times) · **Subs** (3-word chunks or `one: true` single words).
- **Scenes:**
  - `card`: the cam becomes a card; serif name, chips, optional cut-out.
  - `checklist`: white; the cam becomes a corner card; rows tick ✓ with a click + ding.
  - `stat`: purple glow; counter; chip.
  - `field`: top-down field with variants `formation` / `coverage` / `cover3` / `rollout`, plus event chips.
  - `number`: Williamson chapter card.
- **Light leak** at every scene in/out. **Outro** quote card over a blurred freeze.
- **SFX (automatic):** whoosh in, swoosh out, clicks on UI events, ticks + boom on counters, a boom under the biggest kinetic word, shimmer on the outro.
- **Music by mood:**

  | Mood | Song (file) | Start at |
  |---|---|---|
  | Smart / techy | lose-you-adturnup | 12 s (beat drop on the first scene change) |
  | Tactical / genius | interstellar-piano | 10 s |
  | Inspirational | experience-einaudi | 44 s |

  The piano tracks were loudnorm'd to −15 LUFS.

## Edits made (batch 1)
| out | clip | hook | scenes |
|---|---|---|---|
| e2_playbook.mp4 | u1, how much the playbook changes | "How many plays does an NFL QB actually learn?" | HUNDREDS stack → checklist (runs / pass concepts / play action / screens) → field formation/motion/route → counter 10 new plays a week |
| e2_coverage.mp4 | u6, knowing the coverage pre-snap | "How an NFL QB knows the coverage before the snap" (cold open "most CONFIDENCE before the ball is snapped") | Liam Coen card → field: motion makes the D show it, wide open → Cover 3 zones + seams → "it's COVER 3. I got the seam." |
| e2_goleft.mp4 | t3, throwing on the move | "A righty who throws better going LEFT?" | "since I was a KID." → field: coaches roll you right ✗ → go LEFT → "only throw to his RIGHT." → "worked going LEFT so much." |
