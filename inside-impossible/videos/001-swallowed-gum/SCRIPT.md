# 001 — What happens if you swallow chewing gum?

## Narration (25.6 s, Kokoro `af_heart`, speed 1.05)
> You just swallowed your gum. People say it stays inside you for seven years. Let's follow it. Your esophagus squeezes
> it down in seconds. In your stomach, even acid can't break down its rubbery base. In the small intestine, your body
> soaks up the sugar and flavor, but the gum keeps sliding along, into the large intestine, where it joins the rest of
> your waste. Within a few days, it simply comes out. Not seven years. Just don't swallow lots at once. That can cause
> a blockage.

## Fact check (every claim on screen or in the voice)
| Claim | Status | Source |
|---|---|---|
| "Stays 7 years" is a myth | ✅ | Scientific American, "Fact or Fiction?: Chewing Gum Takes Seven Years to Digest" (colonoscopies and capsule endoscopies don't find old gum) |
| Gum base is not digested (synthetic polymers/resins/waxes) | ✅ | Duke Health, "Myth or fact: it takes seven years to digest chewing gum" (indigestible, like seeds/roughage, passes through) |
| Sugar/sweeteners and flavour are absorbed | ✅ (general physiology: soluble sugars are absorbed in the small intestine) | Duke Health; standard physiology |
| Swallowing moves food down the esophagus in seconds | ✅ (peristalsis; a swallow takes a few seconds) | standard physiology |
| Stomach acid pH 1.5–3.5 (chip) | ✅ | standard physiology (gastric acid) |
| Out "within a few days" | ✅ hedged ("usually", "a few days") | Chapman University SCST blog (one or two days); normal gut transit is roughly 1–3 days |
| Lots of gum at once can (rarely) cause a blockage | ✅ hedged ("rare") | Milov DE et al., "Chewing gum bezoars of the gastrointestinal tract", *Pediatrics* 1998;102(2):e22 (children who swallowed gum habitually) |

Not claimed (on purpose): exact transit hours, exact intestine lengths, any medical advice beyond "don't swallow lots at once".

## Shot list (video ms = narration + 250 ms; all keyed to word timestamps in `src/inside/gum.words.json`)
| # | From the word | Shot | New information |
|---|---|---|---|
| 1 | 0 "You just swallowed" | Max chewing → gulp → eyes widen | the situation |
| 2 | "People" | x-ray body, glowing gum in the stomach, "MYTH: STUCK FOR 7 YEARS? YEAR 1→7" | the misconception (curiosity) |
| 3 | "Let's follow it" | mouth opens, camera dives in | the promise |
| 4 | "Your esophagus" | tube with longitudinal folds, peristaltic ring squeezing behind the gum | mechanism 1 |
| 5 | "In your stomach" | rugae walls, acid pool, food dissolving, gum intact; chips pH / POLYMERS · NOT DIGESTED | why gum survives |
| 6 | "In the small intestine" | villi tunnel, sparkles leave the gum, gum turns pale | what IS absorbed |
| 7 | "into the large intestine" | wide brown haustra tunnel, gum joins waste | where it goes |
| 8 | "Within a few days" | desk calendar DAY 1 → 2 → 3, "USUALLY OUT IN A FEW DAYS" | the answer |
| 9 | "Not seven years" | "7 YEARS" page, red ✕ slams, "MYTH BUSTED" | payoff |
| 10 | "Just don't swallow lots" | clump of many gums blocking the intestine, red alarm light | safety note |
| 11 | after "blockage" | Max chewing again (same framing as shot 1) | loop |

## Production log
- v1 render → frame QA: black flicker + 24-frame freeze in the blockage shot (red point light inside glossy gum balls →
  HDR blowout → bloom NaN), large intestine too dark (luma 0.16). Viewer pass: weak gulp, static esophagus, 4.7 s same
  small-intestine view.
- v2 fixes: light moved in front of the clump; brighter large intestine; stronger gulp + punch-in on the uh-oh face;
  esophagus camera lags so the squeeze visibly travels; reverse angle on "but the gum keeps sliding".
- v2 QA: 1080x1920, 30 fps, 27.2 s; black frames only the planned dip (f160); no freezes; pops only on planned cuts,
  page flips and the ✕ slam; −14.2 LUFS, −1.4 dBTP after two-pass loudnorm. Final: `out/inside_001_gum.mp4`.
- Still weak: the large-intestine shot is fairly static; the last blockage frames go bright behind the caption.
