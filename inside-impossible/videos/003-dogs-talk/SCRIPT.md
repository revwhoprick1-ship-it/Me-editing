# 003 — What if dogs learned to talk and became civilized? (HYPOTHETICAL)

Cast (Kokoro voices): Goldie the golden retriever `am_michael` · owner `af_bella` · Shiba `am_puck` · Lab (office, Speaker)
`bm_george` · Boxer pup `af_sky` · businessman `am_adam` · narrator `af_heart` (channel voice). Lines + gaps:
`lines.json` → `inside-impossible/audio/dialogue.py` → `public/dogsvo/dialogue.wav` + `src/dogs/lines.gen.json`
(start/end, words, 30 fps jaw envelope per line). Total 42.0 s of dialogue, video 43.5 s.

## Dialogue
| Scene | Who | Line |
|---|---|---|
| 1 First word | Goldie | I'm tired of eating dog food. |
| | Owner | Did you... just talk? |
| | Narrator | What if dogs could suddenly talk? Real dogs already respond to about eighty-nine words. |
| 2 Revolution | Narrator | Now imagine every dog on Earth, talking at once. |
| | Shiba | Nice shoes. Can I chew them? |
| | Lab | We need to talk about the mailman. |
| 3 Civilization | Narrator | Soon, they go to school. |
| | Pup | I ate my homework. On purpose. |
| | Narrator | They get jobs. |
| | Lab | Send me the quarterly bark report. |
| 4 New society | Narrator | Then, dogs build their own parliament. |
| | Lab (Speaker) | Order! The Belly Rub Act is now law. |
| 5 Conflict | Narrator | Humans try to negotiate. |
| | Businessman | Fine. Equal rights. |
| | Shiba | And the couch. *(paw lands on the treaty)* |
| 6 Twist | Narrator | Then a golden retriever becomes president. |
| | Goldie | Effective immediately, humans must now take us for walks. |
| | Narrator | Wait. Who's walking who? Would you vote for him? *(dogs drag their humans through a square on leashes)* |

## Fact check
| Claim | Status | Source |
|---|---|---|
| Whole premise (talking dogs, parliament, president) | 🟡 HYPOTHETICAL — chip on screen | — |
| Real dogs respond to ~89 words on average (chip: "REAL DOGS: ~89 WORDS · 2021 STUDY") | ✅ hedged "about", "respond to" (not "understand") | Reeve & Jacques, *Applied Animal Behaviour Science* 246 (2021), doi:10.1016/j.applanim.2021.105513 — owner survey of 165 dogs, range 15–215; Dalhousie University news, 17 Dec 2021 |
| ~600–900 million dogs on Earth (chip, "EST.") | ✅ estimate, range shown | Widely cited range (WorldAtlas; Psychology Today "How many dogs are there in the world", 2012); most are free-ranging, not pets |

## Shots (all keyed to `lines.gen.json` line starts / word times)
| # | From | Set | Shot |
|---|---|---|---|
| 1 | 0 | lounge | Goldie sits by the bowl, push-in — "I'm tired of eating dog food." |
| 2 | owner −120 ms | lounge | reverse: owner frozen (idle_fear), snap zoom — record scratch |
| 3 | n_what | lounge | wide over her shoulder — chip HYPOTHETICAL |
| 4 | "Real" | lounge | head CU, word cards orbit (SIT, WALK?, TREAT…) — chip ~89 WORDS |
| 5 | n_now | street | five dogs trot at the camera (procedural gait), mouths babble — BREAKING chyron, ~600–900 M chip |
| 6 | shoes −150 | street | low shot: Shiba eyes Jeff's shoes |
| 7 | mail −150 | street | Lab + businessman; he jumps on "mailman" (boing) |
| 8 | n_school | school hall | pup with backpack, chalkboard "HOMEWORK DUE TODAY", paper scraps |
| 9 | homework | school hall | pup CU |
| 10 | n_jobs | lobby | Lab at a desk in a tie, laptop "Q3 BARK REPORT" |
| 11 | report | lobby | profile CU, report on screen |
| 12 | n_parl | music hall | DOG PARLIAMENT: two benches of dogs, Speaker Lab in a wig at the sealed podium |
| 13 | order −120 | music hall | Speaker CU, head-nod + gavel bang, pull back on "law" — dogs bounce, crowd barks — LIVE chyron |
| 14 | n_nego | meeting room | treaty table: businessman vs Shiba on a stool |
| 15 | rights −120 | meeting room | businessman MS (idle + talking cycle layered) |
| 16 | couch −120 | meeting room | Shiba CU, paw slaps the treaty |
| 17 | n_pres | theatre | Goldie at the presidential podium, rosette, flags, confetti, flashes — BREAKING chyron, fanfare |
| 18 | decree −120 | theatre | podium CU with mics |
| 19 | "walks" +380 | theatre | humans' reaction — gasp |
| 20 | n_end | square | dogs trot ahead dragging running humans on leashes — WOULD YOU VOTE FOR HIM? 👇 |

## Production log
- Gait test 1: golden/Lab legs didn't move. GLTFLoader strips "." from node names (`UpperArm.L` → `UpperArmL`), so the
  leg regexes missed → `\.?` in every map.
- Jaw test: all four rigs open on +X; Lab amp 0.3, Shiba 0.3 (fangs), golden/boxer 0.42–0.45.
- Stills pass 1: `<Freeze>` around the comp froze every frame at the same time → the sheet comp passes `at` instead.
- Stills pass 2: close-ups aimed by guessed head heights missed (chest shots) → `CamAt` frames off the head bone's live
  world position. Props read bone positions during render → `Actor` now sets its transforms imperatively; values read
  in a parent's JSX need `<Defer>`. Backpack moved to the spine bone; chair back removed (blocked the Shiba).
- Render v1 (49 min, 1306 frames): no black/frozen frames; −22.6 LUFS. Viewer pass: Lab head snapped every ~3.5 s (its
  idle clip is only 2.08 s and wrapped mid-shot — QA pop at f672) → ping-pong the idle clips (Lab, boxer); presidential
  flags were dark blocks cut by the frame top → lowered, striped flag with the paw seal. Frames 416–1305 re-rendered
  and spliced onto v1 (`--frames`, `--muted`, then one re-encode + v1 audio), loudnorm to −14 LUFS.
