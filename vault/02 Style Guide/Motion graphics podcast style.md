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
