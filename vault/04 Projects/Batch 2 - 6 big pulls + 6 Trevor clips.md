---
tags: [project, batch, card-pull, podcast]
date: 2026-10-25
---
# Batch 2: 6 more big pulls + 6 more Trevor clips

User ask (2026-10-25):
- **Card edits:** add the hooks from the hooks folder.
- **Music:** use the music links instead of one song for everything.
- **Length:** every video 15–25 s.
- **Podcast captions:** don't cover faces.
- **Podcast music by mood:** Du bist gut genug (funny), Blue by Yung Kai (wholesome, as a W Speed edit), phonk (serious).
- **Motion tracking** on the speakers.
- 12 new outputs.

## What changed in the templates
- **Card (`src/plans/card/make.ts`, `src/CardPull.tsx`):**
  - `hookClip`: plays a hook from `public/hooks/` first (720x1280 green-screen scream), with their burned-in caption blurred (`cover`) and our own glow caption on top.
  - `music: {file, drop, length}` rotates phonk, so no two card edits share a song.
  - The 3-line narration format (tease / whisper / hype) fits 15–25 s. Make it with `python3 scripts/prep_narr.py <name> <line2 first word> <line3 first word>`.
  - Reaction captions sit lower when the host cam is short.
- **Podcast (`src/plans/pod/make.ts`, `src/ShortEdit.tsx`):**
  - `track` (from `scripts/seat_track.py`, YuNet face detector `models/yunet.onnx`): every close-up and stacked close-up follows the speaker's face.
  - Captions **never cover faces**:
    - in close-ups and wide shots they sit at 68% of the video box (chest level), with the emoji under the words;
    - in stacked shots they sit on the seam, with the emoji above.
  - `mood` picks the music: funny → du-bist-gut-genug, wholesome → blue-yung-kai (drop 23.5 s), serious → phonk (override with `music: {file, drop: [...]}`). The drop lands on the W slam or the punch.
  - `wspeed`: a "W TREVOR ❤️‍🩹" slam whose colour changes on each beat (0.74 s), with crowd cutaways (hook clips, framed from the top so their captions are cropped). Speech captions are hidden during it.
  - `actions`: narrated italic text `*TREVOR WALKS IN*` with the name in red.
- **Music:** the full songs come from SoundCloud (`yt-dlp`; YouTube is blocked). Drops are found with `scripts/find_drops.py`.

## Hooks folder (Drive `1DnNI_zX5q7eWpiDOP75SnCMDWNC5xYkI` → `public/hooks/`)
These are 22 Backyard Breaks Shorts. Each opens on a green-screen scream or hype line, which is the hook (the first 2–4 s). Transcripts are in `footage/hooks/*.words.json`.

| file | line | hook ms |
|---|---|---|
| no_way_he_did_it | "No way he did it! … One of one!" | 0–3800 |
| thats_the_goat | "That's the GOAT! greatest player of all time" | 0–2900 |
| the_greatest_player | "The greatest player to ever touch a basketball" | 0–3200 |
| rise_up_and_bring_the_earth_down | "Rise up and bring the earth down!" | 0–2600 |
| theyre_gonna_say_its_rigged | "Oh no, they're gonna say it's rigged" | 1000–4700 |
| trip_mind_boggling | "Nah! That is mind-boggling" | 600–3400 |
| costco_guys_boom | "Boom boom boom" | 0–3200 |
| oh_my_god_our_first_one | "Oh my god! Our first one!" | 0–2800 |
| holy_scream | "Oh my… god" | 0–4600 |
| it_burns, i_feel_like_a_dinasour, scream_yessir, cmon… | short screams | 0–2.5 s |

## Outputs
| out file | clip | hook / mood | music |
|---|---|---|---|
| ohtani.mp4 | Shohei Ohtani superfractor auto 1/1, $80K | no_way_he_did_it | montagem-pegadora |
| mahomes.mp4 | Mahomes Green Kaboom auto 1/1, $100K | thats_the_goat | eclipser |
| lebron2.mp4 | LeBron James Logoman, $350K | the_greatest_player | acido-iii |
| flagg2.mp4 | Cooper Flagg Papa auto 1/1, $100K+ | rise_up | vem-pere-reka |
| warriors.mp4 | Warriors triple Logoman, $350K | rigged | funk-do-balkan |
| starwars.mp4 | Obi-Wan/Anakin/Padme triple auto 1/1 | trip_mind_boggling | montagem-uranium |
| u1_playbook.mp4 | how much the playbook changes | serious | tipo-insta-buzeira |
| u2_psa10_celly.mp4 | PSA 10 TD celly | funny | du bist gut genug |
| u3_redemptions.mp4 | redemption lore | funny | du bist gut genug |
| u4_peyton.mp4 | Peyton checks in on Trevor | wholesome, W Speed | Blue |
| u5_trevor_enters.mp4 | "all hail the king" entrance + slow-mo replay | wholesome, W Speed | Blue |
| u6_coen_duo.mp4 | what Liam Coen changed | wholesome, W Speed | Blue |

## Gotchas hit this batch
- **ElevenLabs:** calls about 4 minutes apart still got blocked ("unusual activity") or returned a 429. **Wait 10+ minutes between generations.**
- AbsoluteFill + `top` needs `height: 'auto'`, or column-reverse content renders off-screen.
- The face-tracked crop must clamp y, or a black band shows when people stand.
- Warriors stream is 17 min long, so it was trimmed to a 60 s source (`public/cards2/warriors_logoman.mp4` from 425 s; plan times = stream time − 425000).
- u4 (Peyton) overlaps batch-1 t1, so batch 2 starts after the signature story.

## Feedback log
- (waiting)
