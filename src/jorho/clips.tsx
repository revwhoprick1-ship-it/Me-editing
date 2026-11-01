// Jorho edits (v2 kit). Each clip: the ting on frame 0 under the intro reveal, a white strobe on the beat that
// carries a shot change, green tints with a swish on the names, a red tint on the laugh, one cut-out photo.
import type {ReactNode} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import peytonWords from '../plans/data/u4_peyton.words.json';
import peytonTrack from '../plans/data/u4_peyton.seats.json';
import golfWords from '../plans/data/t2_dream_golf_four.words.json';
import golfTrack from '../plans/data/t2_dream_golf_four.seats.json';
import redeemWords from '../plans/data/u3_redemptions.words.json';
import redeemTrack from '../plans/data/u3_redemptions.seats.json';
import coenWords from '../plans/data/u6_coen_duo.words.json';
import coenTrack from '../plans/data/u6_coen_duo.seats.json';
import goatWords from '../plans/data/nba_goat.words.json';
import goatTrack from '../plans/data/nba_goat.seats.json';
import t3Words from '../plans/data/t3_traveling_trevors.words.json';
import t3Track from '../plans/data/t3_traveling_trevors.seats.json';
import u1Words from '../plans/data/u1_playbook.words.json';
import u1Track from '../plans/data/u1_playbook.seats.json';
import {Cam, FPS, Music, SfxTrack, SpeechTrack, sfx, timeline, type CamCfg, type Seat, type Sfx, type TL, type Track} from '../e3/kit';
import {BOX_H, Cutout, Frame, GREEN, OneWord, RED, STROBE_CUT, Tints, strobe, wordsFrom, type Word} from './kit';
import {Chips, Cursor, HandCircle, LIME, RED_INK} from './mg';
import {Brackets, CleanBg, Clipping, Counter, GridBg, Headline, MarkerX, Meter, PaperBg, PlayGrid, RingTags, Stamp, Struck, Timeline, TwoTone, Typed, cardTransform, type Theme} from './mg2';
import {ease, pop} from '../e3/kit';

const GRADE = 'contrast(1.06) saturate(1.05)';
const inAny = (s: number, spans: [number, number][]) => spans.some(([a, b]) => s >= a && s < b);
type Shot = [from: number, who: Seat]; // output time → framing (hard cuts only, like the refs)
const shotAt = (shots: Shot[], o: number) => shots.reduce<Seat>((w, [t, s]) => (o >= t ? s : w), 'W');

type Spec = {
  tl: TL; src: string; track: Track; top: string; words: Word[]; wordY: number; wideX: number; shots: Shot[];
  strobes: number[]; beeps?: number[]; tints: [number, string][]; swish: number[]; cut?: {file: string; from: number; to: number; x: number; h: number};
  music: {file: string; from: number; level: number};
  box?: (o: number) => ReactNode; over?: (o: number) => ReactNode; fx?: Sfx[];
  intro?: {theme: Theme; to: number; bg: (o: number) => ReactNode; fg?: (o: number) => ReactNode};
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
      {s.over?.(o)}
      <SpeechTrack src={s.src} tl={s.tl} />
      <Music file={s.music.file} songFrom={s.music.from} level={(t) => s.music.level * Math.min(1, (s.tl.total - t) / 400)} />
      <SfxTrack list={[
        sfx('jorho-ting', 0, 0.55),
        ...s.strobes.map((t) => sfx('jorho-flash', t, 0.7)),
        ...s.swish.map((t) => sfx('jorho-swish', t, 0.45)),
        ...(s.beeps ?? []).map((t) => sfx('jorho-beep', t, 0.35)),
        ...(s.fx ?? []),
      ]} />
    </>}>
    <AbsoluteFill style={{filter: strobe(o, s.strobes) || undefined}}>
      {s.intro && o < s.intro.to && s.intro.bg(o)}
      <AbsoluteFill style={s.intro ? cardTransform(s.intro.theme, o, s.intro.to) : undefined}><Cam c={cam} o={o} /></AbsoluteFill>
      {s.intro && o < s.intro.to && s.intro.fg?.(o)}
      {s.box?.(o)}
      {s.cut && <Cutout o={o} {...s.cut} />}
    </AbsoluteFill>
    <Tints o={o} list={s.tints} />
  </Frame>;
};

// ---- u4 · "Peyton Manning called me about my signature" --------------------------------------------------------
const pTl = timeline([[1000, 1620], [1620, 2300], [2700, 7100], [7700, 9500], [11300, 13050], [13600, 14450], [14800, 19950]]);
export const PEYTON_MS = pTl.total;
const P = {peyton: pTl.out(1680), called: pTl.out(4440), nice: pTl.out(9040), real: pTl.out(12420), text: pTl.out(17640), great: pTl.out(19640)};
const PEYTON: Spec = {
  tl: pTl, src: 'pod2/u4_peyton.mp4', track: peytonTrack as unknown as Track, top: 'Imagine having Peyton Manning on speed dial', wordY: 1170, wideX: 700,
  words: wordsFrom(peytonWords, pTl, {}, {Peyton: '#21F5E6', Manning: '#21F5E6'}),
  shots: [[0, 'W'], [P.called + STROBE_CUT, 'M'], [pTl.segOut[3], 'W'], [pTl.segOut[4], 'L'], [pTl.segOut[5], 'W'], [pTl.segOut[6], 'M'], [P.text - 240 + STROBE_CUT, 'W']],
  strobes: [P.called, P.text - 240],
  beeps: [P.peyton - 570],
  tints: [[P.peyton, GREEN], [P.nice, GREEN], [P.real, RED], [P.great, GREEN]],
  swish: [P.peyton, P.nice, P.great],
  cut: {file: 'peyton.png', from: P.peyton, to: P.called - 120, x: 270, h: 640},
  music: {file: 'blue-yung-kai.mp3', from: 37240 - P.called, level: 0.33},
};
export const JorhoPeyton = () => <Jorho s={PEYTON} />;

// ---- t2 · "dream golf foursome: throw Jesus in there … Tiger, the goat" ----------------------------------------
const gTl = timeline([[11250, 13900], [16820, 18500], [32200, 33440], [33440, 34150], [34750, 35700], [45450, 48450], [50400, 54400]]);
export const GOLF_MS = gTl.total;
const G = {dream: gTl.out(12380), humans: gTl.out(17740), jesus: gTl.out(33460), like: gTl.out(34780), tiger: gTl.out(48000), world: gTl.out(52140),
  heIs: gTl.out(52760)};
const GOLF: Spec = {
  tl: gTl, src: 'pod/t2_dream_golf_four.mp4', track: golfTrack as unknown as Track, top: "Trevor's dream golf foursome is undefeated", wordY: 1150, wideX: 720,
  words: wordsFrom(golfWords, gTl, {for: 'four', '-time': 'time'}, {Jesus: '#F9FC35', Tiger: '#21F5E6', goat: '#58EE28'}),
  shots: [[0, 'W'], [gTl.segOut[2], 'L'], [G.jesus + STROBE_CUT, 'M'], [gTl.segOut[5], 'W'], [G.heIs - 200 + STROBE_CUT, 'M']],
  strobes: [G.jesus, G.heIs - 200],
  beeps: [G.jesus - 570],
  tints: [[G.dream, GREEN], [G.humans, GREEN], [G.like, RED], [G.tiger, GREEN]],
  swish: [G.dream, G.humans, G.tiger],
  cut: {file: 'tiger.png', from: G.tiger, to: G.world + 250, x: 290, h: 640},
  music: {file: 'du-bist-full.mp3', from: 42050 - G.jesus, level: 0.32},
};
export const JorhoGolf = () => <Jorho s={GOLF} />;

// ---- u3 · "this card was $20,000… what is it now? 500 bucks maybe" ---------------------------------------------
const rTl = timeline([[0, 1780], [1780, 2900], [2900, 6000], [7000, 9600], [27050, 27900], [28950, 33700]]);
export const REDEEM_MS = rTl.total;
const RD = {k20: rTl.out(1140), d200: rTl.segOut[2], maybe: rTl.out(5520), redeem: rTl.out(8840), sale: rTl.out(32460) - 200};
const REDEEM: Spec = {
  tl: rTl, src: 'pod2/u3_redemptions.mp4', track: redeemTrack as unknown as Track, top: 'Imagine your card going from $20,000 to $500', wordY: 1160, wideX: 700,
  words: wordsFrom(redeemWords, rTl, {'20': '$20,000', '000': '', '200': '$200?', '500': '$500'}, {'$20,000': '#58EE28', '$500': '#F9FC35', redeem: '#21F5E6'}),
  shots: [[0, 'W'], [RD.d200 + STROBE_CUT, 'M'], [rTl.segOut[3], 'R'], [rTl.segOut[4], 'M'], [rTl.segOut[5], 'W'], [RD.sale + STROBE_CUT, 'M']],
  strobes: [RD.d200, RD.sale],
  beeps: [RD.d200 - 570],
  tints: [[RD.k20, GREEN], [RD.maybe, RED], [RD.redeem, GREEN]],
  swish: [RD.k20, RD.redeem],
  music: {file: 'du-bist-full.mp3', from: 42050 - RD.d200, level: 0.32},
};
export const JorhoRedeem = () => <Jorho s={REDEEM} />;

// ---- u6 · "Liam Coen has taught me more in this past year than my whole football life" ---------------------------
const cTl = timeline([[4700, 6500], [6500, 7900], [11400, 17950], [18300, 23000]]);
export const COEN_MS = cTl.total;
const C = {liam: cTl.segOut[1], taught: cTl.out(7280), life: cTl.out(14800), why: cTl.out(17240), yeah: cTl.segOut[3], half: cTl.out(21680)};
const COEN: Spec = {
  tl: cTl, src: 'pod2/u6_coen_duo.mp4', track: coenTrack as unknown as Track, top: "Liam Coen really changed Trevor's whole game fr", wordY: 1160, wideX: 690,
  words: wordsFrom(coenWords, cTl, {Cohen: 'Coen'}, {Liam: '#21F5E6', Coen: '#21F5E6', definitely: '#58EE28'}),
  shots: [[0, 'W'], [C.liam + STROBE_CUT, 'L'], [cTl.segOut[2], 'W'], [C.yeah + STROBE_CUT, 'M']],
  strobes: [C.liam, C.yeah],
  beeps: [C.liam + 120 - 570],
  tints: [[C.liam + STROBE_CUT, GREEN], [C.taught, GREEN], [C.life, GREEN], [C.why, RED], [C.half, GREEN]],
  swish: [C.liam + STROBE_CUT, C.taught, C.life, C.half],
  cut: {file: 'coen.png', from: C.liam + STROBE_CUT, to: C.life - 300, x: 250, h: 640},
  music: {file: 'blue-yung-kai.mp3', from: 37240 - C.yeah, level: 0.33},
};
export const JorhoCoen = () => <Jorho s={COEN} />;

// ---- NBA goat · PAPER theme (Mark Suy): front page intro, clippings of the usual GOATs crossed out in red marker,
// a stamp on the answer ------------------------------------------------------------------------------------------------
const nTl = timeline([[0, 7400], [8400, 18800]]);
export const GOAT_MS = nTl.total;
const N = {who: nTl.out(2280), goat: nTl.out(4800), nba: nTl.out(4480), greatest: nTl.out(5620), think: nTl.segOut[1], gotta: nTl.out(12780), della: nTl.out(13820),
  laugh: nTl.out(15050), tension: nTl.out(17740)};
const CLIPS = [
  {label: 'LeBron', file: 'lebron.png', x: 90, y: 250, rot: -5, bar: true}, {label: 'Kobe', file: 'kobe.png', x: 560, y: 230, rot: 4},
  {label: 'Curry', file: 'curry.png', x: 130, y: 640, rot: 3}, {label: 'MJ', x: 600, y: 620, rot: -3},
].map((c, i) => ({...c, at: N.think + 300 + i * 550, x2: N.think + 2700 + i * 380}));
const GOAT: Spec = {
  tl: nTl, src: 'input.mp4', track: goatTrack as unknown as Track, top: "Imagine having an NBA goat that's not LeBron fr", wordY: 1170, wideX: 960,
  words: wordsFrom(goatWords, nTl, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#58EE28', Matthew: '#21F5E6', Dellavedova: '#21F5E6'}),
  shots: [[0, 'W'], [N.nba + STROBE_CUT, 'M'], [N.greatest, 'L'], [N.think, 'M'], [N.della + 1500, 'W'], [N.tension - 200, 'R']],
  strobes: [N.who - STROBE_CUT, N.nba, N.gotta - STROBE_CUT],
  beeps: [N.della - 570],
  tints: [[N.della, GREEN], [N.laugh + 400, RED], [N.tension + 480, GREEN]],
  swish: [N.della, N.tension + 480, N.think + 250],
  cut: {file: 'della.png', from: N.della, to: N.laugh + 900, x: 250, h: 640},
  music: {file: 'du-bist-full.mp3', from: 42050 - N.nba, level: 0.32},
  intro: {theme: 'paper', to: N.who, bg: () => <PaperBg />, fg: (o) => <>
    <Headline o={o} at={0} to={N.who} sub="THE BACKYARD TIMES · SPORTS · EXTRA" text={<>Trevor Lawrence names his <span style={{color: RED_INK}}>NBA GOAT</span></>} y={36} />
    <Stamp o={o} at={900} text="EXCLUSIVE" x={610} y={360} rot={9} size={60} />
  </>},
  box: (o) => <>
    {o >= N.greatest && o < N.think && <Headline o={o} at={N.greatest} to={N.think} sub="DEFINITION" text="Greatest of all time." y={40} />}
    {o >= N.think && o < N.gotta && <AbsoluteFill>
      <PaperBg seed={3} />
      {CLIPS.map((c, i) => <Clipping key={i} o={o} at={c.at} x={c.x} y={c.y} rot={c.rot} file={c.file} label={c.label} bar={c.bar} w={330} />)}
      {CLIPS.map((c, i) => <MarkerX key={i} o={o} at={c.x2} x={c.x + 40} y={c.y + 40} s={290} />)}
      <div style={{position: 'absolute', top: 40, width: 1080, textAlign: 'center', fontFamily: 'Courier Prime', fontWeight: 700, fontSize: 44, color: '#1d1c1a'}}>
        TREVOR IS THINKING… {((o - N.think) / 1000).toFixed(1)}s</div>
    </AbsoluteFill>}
    {o < N.laugh + 900 && <Stamp o={o} at={N.della + 650} text="GOAT?!" x={560} y={170} rot={-14} size={130} />}
    {o >= N.tension && <Headline o={o} at={N.tension} to={GOAT_MS} sub="BREAKING" text="Tension: 100%" y={40} />}
  </>,
  over: (o) => <><HandCircle o={o} at={N.goat} to={N.greatest} y={1170} w={150} /><HandCircle o={o} at={N.della + 380} to={N.laugh} y={1170} w={420} /></>,
  fx: [sfx('jorho-whoosh', 0, 0.3), sfx('jorho-click', 900, 0.5), ...CLIPS.map((c) => sfx('jorho-click', c.at, 0.45)), ...CLIPS.map((c) => sfx('jorho-pen', c.x2, 0.4, 350)),
    sfx('jorho-pen', N.goat, 0.45, 600), sfx('jorho-pen', N.della + 380, 0.5, 700), sfx('jorho-click', N.della + 650, 0.6), sfx('jorho-click', N.tension, 0.45)],
};
export const JorhoGoat = () => <Jorho s={GOAT} />;

// ---- t3 · GRID theme (Gary Vee): glass card on a dark grid with stat meters, a career timeline, the play diagram,
// struck-out titles -----------------------------------------------------------------------------------------------------
const lTl = timeline([[1760, 3850], [4300, 6000], [11260, 12750], [16220, 18950], [25700, 31250], [32100, 33250], [33860, 39600]]);
export const LEFTY_J_MS = lTl.total;
const L = {accuracy: lTl.out(1760), velocity: lTl.out(2020), incredible: lTl.out(2760), god: lTl.out(5440), worked: lTl.out(17120), kid: lTl.out(18860),
  coaches: lTl.out(26820), rollouts: lTl.out(28220), right: lTl.out(28900), hated: lTl.out(32800), left: lTl.out(36060), guy: lTl.out(37980)};
const Rollout = ({o, from, to, dir, label}: {o: number; from: number; to: number; dir: 1 | -1; label: string}) => {
  if (o < from || o >= to) return null;
  const p = ease(o, from + 150, 700);
  const qx = 540, qy = 620, ex = 540 + dir * 330;
  return <AbsoluteFill>
    <AbsoluteFill style={{background: 'rgba(7,12,9,0.72)', backgroundImage: 'linear-gradient(rgba(185,244,110,0.10) 2px, transparent 2px), linear-gradient(90deg, rgba(185,244,110,0.10) 2px, transparent 2px)',
      backgroundSize: '90px 90px'}} />
    <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0}}>
      {[-2, -1, 0, 1, 2].map((k) => <circle key={k} cx={540 + k * 120} cy={420} r={22} fill="none" stroke="#fff" strokeWidth={5} opacity={0.8} />)}
      <circle cx={qx} cy={qy} r={30} fill={LIME} />
      <path d={`M ${qx} ${qy} Q ${qx + dir * 60} ${qy + 170} ${ex} ${qy + 120}`} fill="none" stroke={dir > 0 ? '#fff' : LIME} strokeWidth={10} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={`M ${ex} ${qy + 120} L ${ex - dir * 34} ${qy + 96} M ${ex} ${qy + 120} L ${ex - dir * 30} ${qy + 150}`} stroke={dir > 0 ? '#fff' : LIME} strokeWidth={10} strokeLinecap="round" opacity={p > 0.95 ? 1 : 0} />
    </svg>
    <div style={{position: 'absolute', top: 110, width: 1080, textAlign: 'center', fontFamily: 'Anton', fontSize: 120, color: dir > 0 ? '#fff' : LIME, lineHeight: 1,
      textShadow: '0 6px 0 rgba(0,0,0,0.6)', transform: `scale(${pop(o, from, 11, 260)})`}}>{label}</div>
  </AbsoluteFill>;
};
const LEFTY_J: Spec = {
  tl: lTl, src: 'pod/t3_traveling_trevors.mp4', track: t3Track as unknown as Track, top: 'Trevor trained himself to throw LEFT on purpose fr', wordY: 1160, wideX: 990,
  words: wordsFrom(t3Words, lTl, {}, {God: '#F9FC35', right: '#FFFFFF', left: '#58EE28', kid: '#21F5E6'}),
  shots: [[0, 'W'], [lTl.segOut[2], 'M'], [lTl.segOut[4], 'W'], [L.right + 900, 'M'], [L.left - 200 + STROBE_CUT, 'M']],
  strobes: [lTl.segOut[1] - STROBE_CUT, L.left - 200],
  tints: [[L.god, GREEN], [L.hated, RED], [L.left, GREEN]],
  swish: [L.god, L.left, L.worked],
  music: {file: 'funk-abnormal.mp3', from: 37570 - (lTl.segOut[1] - STROBE_CUT), level: 0.3},
  intro: {theme: 'grid', to: lTl.segOut[1], bg: (o) => <GridBg o={o} />, fg: (o) => <>
    <TwoTone o={o} at={0} to={lTl.segOut[1]} a="HOW IS HE THIS" b="ACCURATE?" y={34} size={92} />
    <Meter o={o} at={L.accuracy + 60} label="ACCURACY" value={99} x={720} y={470} w={310} />
    <Meter o={o} at={L.velocity + 60} label="VELOCITY" value={97} x={720} y={610} w={310} />
    <Cursor o={o} from={lTl.segOut[1] - 900} at={lTl.segOut[1] - 260} to={lTl.segOut[1]} x={420} y={640} />
  </>},
  box: (o) => <>
    {o >= L.god && o < lTl.segOut[2] && <Chips o={o} top={90} items={[['GOD-GIVEN?', L.god], ['OR WORK?', L.god + 450]]} />}
    <Timeline o={o} from={L.worked - 150} to={lTl.segOut[4]} stops={[['KID', L.worked], ['HIGH SCHOOL', L.worked + 450], ['CLEMSON', L.worked + 900], ['NFL', L.kid]]} />
    {o >= L.coaches && o < L.rollouts - 200 && <TwoTone o={o} at={L.coaches} to={L.rollouts - 200} a="COACHES ONLY CALL" b="ROLLOUTS RIGHT" y={60} size={84} />}
    <Rollout o={o} from={L.rollouts - 200} to={lTl.segOut[5]} dir={1} label="ROLL RIGHT" />
    <Struck o={o} at={L.hated} to={lTl.segOut[6]} text="ONLY-RIGHT" />
    <Rollout o={o} from={L.left - 100} to={L.guy - 300} dir={-1} label="GO LEFT" />
    <Struck o={o} at={L.guy - 100} to={LEFTY_J_MS} text="THE ONE-WAY QB" />
  </>,
  over: (o) => <HandCircle o={o} at={L.left + 100} to={L.left + 1500} y={1160} w={150} />,
  fx: [sfx('jorho-whoosh', 0, 0.3), sfx('jorho-click', L.accuracy + 60, 0.45), sfx('jorho-click', L.velocity + 60, 0.45), sfx('jorho-click', lTl.segOut[1] - 260, 0.6),
    sfx('jorho-click', L.god, 0.5), sfx('jorho-click', L.god + 450, 0.5), ...[0, 450, 900].map((d) => sfx('jorho-click', L.worked + d, 0.4)),
    sfx('jorho-pen', L.rollouts, 0.45, 800), sfx('jorho-pen', L.hated + 450, 0.45, 400), sfx('jorho-pen', L.left, 0.45, 800), sfx('jorho-pen', L.guy + 350, 0.45, 400)],
};
export const JorhoLefty = () => <Jorho s={LEFTY_J} />;

// ---- u1 · CLEAN theme (Elon): typed question over a framed card, a play counter, the offense as a ring diagram,
// the whole inventory as tiles with this week's picks lighting up, then the 8–10 counter ---------------------------
const bTl = timeline([[0, 2700], [14260, 18100], [18420, 22700], [36840, 42800], [48820, 54700]]);
export const PLAYBOOK_J_MS = bTl.total;
const B = {hundreds: bTl.out(17000), runs: bTl.out(19260), pass: bTl.out(20820), action: bTl.out(21920), screens: bTl.out(22620), inventory: bTl.out(39060),
  week: bTl.out(42500), eight: bTl.out(52580), ten: bTl.out(53980)};
const PLAYBOOK_J: Spec = {
  tl: bTl, src: 'pod2/u1_playbook.mp4', track: u1Track as unknown as Track, top: 'How big an NFL playbook really is fr', wordY: 1170, wideX: 930,
  words: wordsFrom(u1Words, bTl, {}, {hundreds: '#58EE28', plays: '#F9FC35', eight: '#21F5E6', ten: '#21F5E6'}),
  shots: [[0, 'R'], [bTl.segOut[1], 'M'], [bTl.segOut[2], 'W'], [bTl.segOut[3], 'M'], [B.week - 200 + STROBE_CUT, 'W'], [B.eight - 300, 'M']],
  strobes: [bTl.segOut[1] - STROBE_CUT, B.week - 200],
  tints: [[B.hundreds, GREEN], [B.eight, GREEN]],
  swish: [B.hundreds, B.runs - 300, B.inventory, B.eight],
  music: {file: 'versatile.mp3', from: 36730 - (bTl.segOut[1] - STROBE_CUT), level: 0.3},
  intro: {theme: 'clean', to: bTl.segOut[1], bg: () => <CleanBg />, fg: (o) => <>
    <Typed o={o} at={150} text="How much does an NFL playbook change week to week?" y={60} size={52} />
    <Brackets o={o} to={bTl.segOut[1]} />
  </>},
  box: (o) => <>
    <Counter o={o} at={B.hundreds} to={B.runs - 300} value={300} suffix="+" label="PLAYS INSTALLED" dark />
    <RingTags o={o} from={B.runs - 300} to={bTl.segOut[3]} center="THE OFFENSE" tags={[['RUNS', B.runs], ['PASS CONCEPTS', B.pass], ['PLAY ACTION', B.action], ['SCREENS', B.screens]]} />
    <PlayGrid o={o} from={B.inventory - 200} to={B.week - 200} pickAt={B.week - 1300} />
    <Cursor o={o} from={B.week - 1700} at={B.week - 1300} to={B.week - 200} x={520} y={420} flip />
    <Counter o={o} at={B.eight} to={PLAYBOOK_J_MS} from={0} prefix="8–" value={10} label="NEW PLAYS A WEEK" dark />
  </>,
  over: (o) => <HandCircle o={o} at={B.ten} to={PLAYBOOK_J_MS} y={1170} w={110} />,
  fx: [sfx('jorho-whoosh', 0, 0.3), ...Array.from({length: 12}).map((_, i) => sfx('jorho-click', 150 + i * 190, 0.18)), sfx('jorho-click', B.hundreds, 0.5),
    ...[B.runs, B.pass, B.action, B.screens].map((t) => sfx('jorho-click', t, 0.5)), sfx('jorho-click', B.week - 1300, 0.6), sfx('jorho-pen', B.ten, 0.5, 700)],
};
export const JorhoPlaybook = () => <Jorho s={PLAYBOOK_J} />;
