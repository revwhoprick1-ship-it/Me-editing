// Jorho edits (v2 kit). Each clip: the ting on frame 0 under the intro reveal, a white strobe on the beat that
// carries a shot change, green tints with a swish on the names, a red tint on the laugh, one cut-out photo.
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import peytonWords from '../plans/data/u4_peyton.words.json';
import peytonTrack from '../plans/data/u4_peyton.seats.json';
import golfWords from '../plans/data/t2_dream_golf_four.words.json';
import golfTrack from '../plans/data/t2_dream_golf_four.seats.json';
import redeemWords from '../plans/data/u3_redemptions.words.json';
import redeemTrack from '../plans/data/u3_redemptions.seats.json';
import coenWords from '../plans/data/u6_coen_duo.words.json';
import coenTrack from '../plans/data/u6_coen_duo.seats.json';
import {Cam, FPS, Music, SfxTrack, SpeechTrack, sfx, timeline, type CamCfg, type Seat, type TL, type Track} from '../e3/kit';
import {BOX_H, Cutout, Frame, GREEN, OneWord, RED, STROBE_CUT, Tints, strobe, wordsFrom, type Word} from './kit';

const GRADE = 'contrast(1.06) saturate(1.05)';
const inAny = (s: number, spans: [number, number][]) => spans.some(([a, b]) => s >= a && s < b);
type Shot = [from: number, who: Seat]; // output time → framing (hard cuts only, like the refs)
const shotAt = (shots: Shot[], o: number) => shots.reduce<Seat>((w, [t, s]) => (o >= t ? s : w), 'W');

type Spec = {
  tl: TL; src: string; track: Track; top: string; words: Word[]; wordY: number; wideX: number; shots: Shot[];
  strobes: number[]; beeps?: number[]; tints: [number, string][]; swish: number[]; cut?: {file: string; from: number; to: number; x: number; h: number};
  music: {file: string; from: number; level: number};
};
const Jorho = ({s}: {s: Spec}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  // the shot list is in output time; Cam asks by source time, so keep a reverse lookup on the output clock
  const cam: CamCfg = {src: s.src, tl: s.tl, track: s.track, grade: GRADE, box: [1080, BOX_H], baseH: 640, faceY: 0.42, wideX: s.wideX,
    who: () => shotAt(s.shots, o)};
  return <Frame o={o} top={s.top}
    over={<>
      <OneWord o={o} words={s.words} y={s.wordY} />
      <SpeechTrack src={s.src} tl={s.tl} />
      <Music file={s.music.file} songFrom={s.music.from} level={(t) => s.music.level * Math.min(1, (s.tl.total - t) / 400)} />
      <SfxTrack list={[
        sfx('jorho-ting', 0, 0.55),
        ...s.strobes.map((t) => sfx('jorho-flash', t, 0.7)),
        ...s.swish.map((t) => sfx('jorho-swish', t, 0.45)),
        ...(s.beeps ?? []).map((t) => sfx('jorho-beep', t, 0.35)),
      ]} />
    </>}>
    <AbsoluteFill style={{filter: strobe(o, s.strobes) || undefined}}>
      <Cam c={cam} o={o} />
      {s.cut && <Cutout o={o} {...s.cut} />}
    </AbsoluteFill>
    <Tints o={o} list={s.tints} />
  </Frame>;
};

// ---- u4 · "Peyton Manning called me about my signature" --------------------------------------------------------
const pTl = timeline([[1000, 1620, 480], [1620, 2300], [2700, 7100], [7700, 9500], [11300, 13050], [13600, 14450], [14800, 19950]]);
export const PEYTON_MS = pTl.total;
const P = {peyton: pTl.out(1680), called: pTl.out(4440), nice: pTl.out(9040), real: pTl.out(12420), text: pTl.out(17640), great: pTl.out(19640)};
const PEYTON: Spec = {
  tl: pTl, src: 'pod2/u4_peyton.mp4', track: peytonTrack as unknown as Track, top: 'Imagine having Peyton Manning on speed dial', wordY: 1170, wideX: 700,
  words: wordsFrom(peytonWords, pTl, {}, {Peyton: '#21F5E6', Manning: '#21F5E6'}),
  shots: [[0, 'W'], [P.called + STROBE_CUT, 'M'], [pTl.segOut[3], 'W'], [pTl.segOut[4], 'L'], [pTl.segOut[5], 'W'], [pTl.segOut[6], 'M'], [P.text - 240 + STROBE_CUT, 'W']],
  strobes: [P.called, P.text - 240],
  beeps: [pTl.segOut[0] + 620],
  tints: [[P.peyton, GREEN], [P.nice, GREEN], [P.real, RED], [P.great, GREEN]],
  swish: [P.peyton, P.nice, P.great],
  cut: {file: 'peyton.png', from: P.peyton, to: P.called - 120, x: 270, h: 640},
  music: {file: 'blue-yung-kai.mp3', from: 37240 - P.called, level: 0.33},
};
export const JorhoPeyton = () => <Jorho s={PEYTON} />;

// ---- t2 · "dream golf foursome: throw Jesus in there … Tiger, the goat" ----------------------------------------
const gTl = timeline([[11250, 13900], [16820, 18500], [32200, 33440, 480], [33440, 34150], [34750, 35700], [45450, 48450], [50400, 54400]]);
export const GOLF_MS = gTl.total;
const G = {dream: gTl.out(12380), humans: gTl.out(17740), jesus: gTl.out(33460), like: gTl.out(34780), tiger: gTl.out(48000), world: gTl.out(52140),
  heIs: gTl.out(52760)};
const GOLF: Spec = {
  tl: gTl, src: 'pod/t2_dream_golf_four.mp4', track: golfTrack as unknown as Track, top: "Trevor's dream golf foursome is undefeated", wordY: 1150, wideX: 720,
  words: wordsFrom(golfWords, gTl, {for: 'four', '-time': 'time'}, {Jesus: '#F9FC35', Tiger: '#21F5E6', goat: '#58EE28'}),
  shots: [[0, 'W'], [gTl.segOut[2], 'L'], [G.jesus + STROBE_CUT, 'M'], [gTl.segOut[5], 'W'], [G.heIs - 200 + STROBE_CUT, 'M']],
  strobes: [G.jesus, G.heIs - 200],
  beeps: [gTl.segOut[2] + 1240],
  tints: [[G.dream, GREEN], [G.humans, GREEN], [G.like, RED], [G.tiger, GREEN]],
  swish: [G.dream, G.humans, G.tiger],
  cut: {file: 'tiger.png', from: G.tiger, to: G.world + 250, x: 290, h: 640},
  music: {file: 'du-bist-full.mp3', from: 42050 - G.jesus, level: 0.32},
};
export const JorhoGolf = () => <Jorho s={GOLF} />;

// ---- u3 · "this card was $20,000… what is it now? 500 bucks maybe" ---------------------------------------------
const rTl = timeline([[0, 1780], [1780, 2900, 480], [2900, 6000], [7000, 9600], [27050, 27900], [28950, 33700]]);
export const REDEEM_MS = rTl.total;
const RD = {k20: rTl.out(1140), d200: rTl.segOut[2], maybe: rTl.out(5520), redeem: rTl.out(8840), sale: rTl.out(32460) - 200};
const REDEEM: Spec = {
  tl: rTl, src: 'pod2/u3_redemptions.mp4', track: redeemTrack as unknown as Track, top: 'Imagine your card going from $20,000 to $500', wordY: 1160, wideX: 700,
  words: wordsFrom(redeemWords, rTl, {'20': '$20,000', '000': '', '200': '$200?', '500': '$500'}, {'$20,000': '#58EE28', '$500': '#F9FC35', redeem: '#21F5E6'}),
  shots: [[0, 'W'], [RD.d200 + STROBE_CUT, 'M'], [rTl.segOut[3], 'R'], [rTl.segOut[4], 'M'], [rTl.segOut[5], 'W'], [RD.sale + STROBE_CUT, 'M']],
  strobes: [RD.d200, RD.sale],
  beeps: [rTl.segOut[1] + 1120],
  tints: [[RD.k20, GREEN], [RD.maybe, RED], [RD.redeem, GREEN]],
  swish: [RD.k20, RD.redeem],
  music: {file: 'du-bist-full.mp3', from: 42050 - RD.d200, level: 0.32},
};
export const JorhoRedeem = () => <Jorho s={REDEEM} />;

// ---- u6 · "Liam Coen has taught me more in this past year than my whole football life" ---------------------------
const cTl = timeline([[4700, 6500, 480], [6500, 7900], [11400, 17950], [18300, 23000]]);
export const COEN_MS = cTl.total;
const C = {liam: cTl.segOut[1], taught: cTl.out(7280), life: cTl.out(14800), why: cTl.out(17240), yeah: cTl.segOut[3], half: cTl.out(21680)};
const COEN: Spec = {
  tl: cTl, src: 'pod2/u6_coen_duo.mp4', track: coenTrack as unknown as Track, top: "Liam Coen really changed Trevor's whole game fr", wordY: 1160, wideX: 690,
  words: wordsFrom(coenWords, cTl, {Cohen: 'Coen'}, {Liam: '#21F5E6', Coen: '#21F5E6', definitely: '#58EE28'}),
  shots: [[0, 'W'], [C.liam + STROBE_CUT, 'L'], [cTl.segOut[2], 'W'], [C.yeah + STROBE_CUT, 'M']],
  strobes: [C.liam, C.yeah],
  beeps: [cTl.segOut[0] + 1800],
  tints: [[C.liam + STROBE_CUT, GREEN], [C.taught, GREEN], [C.life, GREEN], [C.why, RED], [C.half, GREEN]],
  swish: [C.liam + STROBE_CUT, C.taught, C.life, C.half],
  cut: {file: 'coen.png', from: C.liam + STROBE_CUT, to: C.life - 300, x: 250, h: 640},
  music: {file: 'blue-yung-kai.mp3', from: 37240 - C.yeah, level: 0.33},
};
export const JorhoCoen = () => <Jorho s={COEN} />;
