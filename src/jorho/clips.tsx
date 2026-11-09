// Jorho edits (v2 kit). Each clip: the ting on frame 0 under the intro reveal, a white strobe on the beat that
// carries a shot change, green tints with a swish on the names, a red tint on the laugh, one cut-out photo.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
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
import t1Words from '../plans/data/t1_tiger_auto_pen.words.json';
import t1Track from '../plans/data/t1_tiger_auto_pen.seats.json';
import {Dim, PenBehind, PenFront, type PenTimes} from '../jorho3d/pen3d';
import {GoatFront, type GoatTimes} from '../jorho3d/goat3d';
import {RedeemFront, type RedeemTimes} from '../jorho3d/redeem3d';
import {JoshFront, type JoshTimes} from '../jorho3d/josh3d';
import {CellyFront, GiftFront, MillsFront} from '../jorho3d/pod7_3d';
import {LeftyWorld, type LeftyK} from '../jorho3d/lefty8';
import {LeftyFlat} from './flat9';
import {GolfFlat, PlaybookFlat, type GolfK, type PbK} from './stories10';
import {DrawnTT, type DrawnK} from './drawn11';
import {GoatStick, type GoatK} from './stick12';
import {Arcade, Chalk, Chat, Comic, Whiteboard} from './styles13';
import {GoatPoster, PO} from './poster14';
import {GoatCollage, GoatNeon, GoatPremium} from './refs15';
import {GoatPixel} from './pixel16';
import {GoatJourney} from './journey17';
import {beatOf} from './styles13';
import {OffthreadVideo} from 'remotion';
import {Arrow7, Band, Big, Emoji, Neck, P7, Pill, Rain, Ruler, Sticker} from './pod7';
import t4Words from '../plans/data/t4_natty_ticket.words.json';
import t4Track from '../plans/data/t4_natty_ticket.seats.json';
import u2Words from '../plans/data/u2_psa10_celly.words.json';
import u2Track from '../plans/data/u2_psa10_celly.seats.json';
import t6Words from '../plans/data/t6_davis_mills_joke.words.json';
import t5Words from '../plans/data/t5_ex_teammate.words.json';
import t5Track from '../plans/data/t5_ex_teammate.seats.json';
import {AntWalk, Dust, GlowTitle, Kinetic, Letters, Magnifier, Orb, PhoneCall, QuoteCard, SigCard, Silhouette} from './mg3';
import {Img, staticFile} from 'remotion';
const emo = (code: string, size: number) => <Img src={staticFile(`emoji-ios/${code}.png`)} style={{width: size, height: size}} />;
import {Cam, FPS, Music, SfxTrack, SpeechTrack, sfx, timeline, type CamCfg, type Matte, type Seat, type Sfx, type TL, type Track} from '../e3/kit';
import {SpeedActions, SpeedSlam, Vignette, typeMs, type Act} from './speed22';
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
  wideXAt?: (o: number) => number; mattes?: Matte[]; behind?: (o: number) => ReactNode; push?: boolean; capsOff?: [number, number][]; faceY?: (o: number) => number; grade?: string; musicLevel?: (o: number) => number; noIntro?: boolean; mirror?: boolean;
};
const Jorho = ({s}: {s: Spec}) => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  // the shot list is in output time; Cam asks by source time, so keep a reverse lookup on the output clock
  const cam: CamCfg = {src: s.src, tl: s.tl, track: s.track, grade: s.grade ?? GRADE, box: [1080, BOX_H], baseH: 640, faceY: s.faceY ?? 0.42, wideX: s.wideXAt ? () => s.wideXAt!(o) : s.wideX,
    who: () => shotAt(s.shots, o), mattes: s.mattes,
    // slow push-in that restarts on every hard cut, so the frame never sits still
    zoom: s.push ? () => { const st = s.shots.reduce((a, [t]) => (o >= t ? t : a), 0); return 1 + 0.07 * ease(o, st, 3500, (v) => v); } : undefined};
  return <Frame o={o} top={s.top} noIntro={s.noIntro}
    over={<>
      {!(s.capsOff ?? []).some(([a, b]) => o >= a && o < b) && <OneWord o={o} words={s.words} y={s.wordY} />}
      {s.over?.(o)}
      <SpeechTrack src={s.src} tl={s.tl} />
      <Music file={s.music.file} songFrom={s.music.from} level={(t) => (s.musicLevel ? s.musicLevel(t) : s.music.level) * Math.min(1, (s.tl.total - t) / 400)} />
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
      <AbsoluteFill style={s.intro ? cardTransform(s.intro.theme, o, s.intro.to) : s.mirror ? {transform: 'scaleX(-1)'} : undefined}><Cam c={cam} o={o} behind={s.behind?.(o)} /></AbsoluteFill>
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

// ---- t1 · "his auto looks like an ant" → Peyton Manning told Trevor a nice signature is a big deal ------------------
// ACTIVE theme (mg3): kinetic words behind the speakers (person mattes), quote cards, a self-writing signature on a
// card, a magnifier that finds the ant, slam letters A/R, a fan of signed cards, glow title, silhouette reveal,
// incoming-call phone. Something new lands about every second.
const tTl = timeline([[9390, 11770], [12040, 16510], [16850, 20180], [23860, 27650], [27790, 29670], [30670, 32500], [33760, 36400], [36400, 37320], [38170, 39570]]);
export const PEN_MS = tTl.total;
const o_ = (ms: number) => tTl.out(ms);
const T = {big: o_(9780), some: o_(10580), hobby: o_(10580) + 150, no: o_(11300), seen: o_(12620), anthony: o_(12800), rich: o_(13180), disrespect: o_(14020),
  haven: o_(14680), his: o_(14980), auto: o_(15320), looks: o_(15660), ant: o_(16160), A: o_(17740), R: o_(18200), thisBig: o_(18760), noResp: o_(19700),
  look: o_(24080), beautiful: o_(24320), sigs: o_(24820), every: o_(25500), goated: o_(26900), you: o_(27900), told: o_(28480), iron: o_(30960), peyton: o_(31360),
  manning: o_(31760), called: o_(33800), a: o_(38200), big2: o_(38280), toHave: o_(38640), nice: o_(39000), signature: o_(39200)};
const S = tTl.segOut;
const PEN_MATTES: Matte[] = [
  {src: [9390, 11770], dir: 'matte/jorho/t1a', n: 72, rect: [1180, 120, 660, 960]},
  {src: [27790, 32500], dir: 'matte/jorho/t1b', n: 142, rect: [660, 120, 660, 960]},
];
const PEN: Spec = {
  tl: tTl, src: 'pod/t1_tiger_auto_pen.mp4', track: t1Track as unknown as Track, top: "Bro said Anthony Richardson's auto looks like an ant", wordY: 1170, wideX: 1285,
  wideXAt: (o) => (o < S[1] ? 1400 : 1285),
  words: wordsFrom(t1Words, tTl, {goaded: 'goated', "Richardson's,": "Richardson's"}, {Anthony: '#21F5E6', "Richardson's": '#21F5E6', ant: '#58EE28', goated: '#58EE28', Peyton: '#F9FC35', Manning: '#F9FC35'}),
  capsOff: [[T.anthony, S[1] + (14680 - 12040)], [S[7] + 100, PEN_MS]],
  shots: [[0, 'W'], [S[1], 'W'], [T.haven, 'M'], [T.his, 'R'], [S[2], 'R'], [S[3], 'W'], [S[4], 'M']],
  push: true, mattes: PEN_MATTES,
  strobes: [S[1] - STROBE_CUT, S[3] - STROBE_CUT, S[4] - STROBE_CUT, S[6] - STROBE_CUT],
  tints: [[T.ant, GREEN], [T.noResp, RED], [T.goated, GREEN], [T.peyton, GREEN]],
  swish: [T.anthony, T.look, T.peyton, S[6], S[7] + 80],
  music: {file: 'du-bist-full.mp3', from: 45740 - (S[1] - STROBE_CUT), level: 0.3},
  behind: (o) => <>
    <Kinetic o={o} to={S[5]} words={[{text: 'you know', at: T.you, y: 90, size: 110, font: 'Playfair Display', italic: true, weight: 900, from: 'left'},
      {text: 'WHO', at: T.you + 300, y: 200, size: 340, from: 'slam'}, {text: 'told me?', at: T.told, y: 540, size: 110, font: 'Playfair Display', italic: true, weight: 900, from: 'right'}]} />
    <Kinetic o={o} to={S[6]} words={[{text: 'ironically,', at: T.iron, y: 90, size: 110, font: 'Playfair Display', italic: true, weight: 900, from: 'left'},
      {text: 'PEYTON', at: T.peyton, y: 200, size: 300, color: '#FF7A1A', from: 'left'}, {text: 'MANNING', at: T.manning, y: 480, size: 250, from: 'right'}]} />
  </>,
  box: (o) => <>
    <Dust o={o} />
    <AbsoluteFill style={{filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.55))'}}>
      <Kinetic o={o} to={T.some} words={[{text: 'a BIG', at: T.big, x: -200, y: 40, size: 100, font: 'Playfair Display', italic: true, weight: 900, from: 'left'},
        {text: 'THING', at: T.big + 220, x: -200, y: 135, size: 210, from: 'slam'}]} />
      <Kinetic o={o} to={T.no} words={[{text: 'some', at: T.some, x: -200, y: 30, size: 90, font: 'Playfair Display', italic: true, weight: 900, from: 'left'},
        {text: 'HOBBY', at: T.hobby, x: -200, y: 115, size: 150, from: 'left'}, {text: 'PLAYERS', at: T.hobby + 200, x: -200, y: 255, size: 150, from: 'left'}]} />
      <Kinetic o={o} to={S[1]} shake={T.no} words={[{text: 'NO', at: T.no, x: -200, y: 30, size: 230, color: RED_INK, from: 'slam'},
        {text: 'RESPECT', at: T.no + 120, x: -200, y: 250, size: 165, color: RED_INK, from: 'slam'}]} />
    </AbsoluteFill>
    <Orb o={o} at={S[1] + 120} to={T.anthony} x={850} y={300} size={210}>{emo('1f440', 110)}</Orb>
    <QuoteCard o={o} from={T.anthony - 60} to={T.haven} file="richardson.png" lines={[{text: 'ANTHONY', at: T.anthony, size: 170, font: 'Anton'},
      {text: "Richardson's", at: T.rich, size: 140, italic: true}, {text: 'autograph', at: T.rich + 350, size: 90, font: 'Anton', color: RED_INK},
      {text: '(no disrespect)', at: T.disrespect, size: 64, italic: true}]} />
    {o >= T.haven && o < T.his && <>{[[230, 260, -12], [760, 240, 12]].map(([x, y, r], i) => <div key={i} style={{position: 'absolute', left: x, top: y,
      transform: `scale(${pop(o, T.haven + i * 90, 10, 280)}) rotate(${r}deg)`}}>{emo('1f440', 130)}</div>)}</>}
    {o >= T.his && o < S[2] && <AbsoluteFill style={{background: 'rgba(0,0,0,0.45)'}} />}
    {o < S[2] && <SigCard o={o} at={T.his} x={390} y={180} rot={-4} file="richardson.png" frame="#0b4ea2" sig="AR" sigAt={T.auto} tiny />}
    <Magnifier o={o} from={T.looks - 200} to={S[2]} x={580} y={560} />
    <AntWalk o={o} from={T.ant} to={T.A} />
    <Letters o={o} a={T.A} r={T.R} small={T.thisBig} to={T.noResp + 80} />
    {o >= T.noResp && o < S[3] && <Stamp o={o} at={T.noResp + 60} text="NO RESPECT" x={150} y={260} rot={-10} size={150} />}
    {o >= S[3] && o < S[4] && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,5,12,0.78) 0%, rgba(5,5,12,0.55) 60%, rgba(5,5,12,0.2))'}} />}
    {o < T.goated && [[60, 130, -10, 0], [390, 90, 0, 1], [720, 130, 10, 2]].map(([x, y, r, i]) => <SigCard key={i} o={o} at={T.look + i * 120} x={x} y={y} rot={r}
      file="trevor_t3.png" sig="T. Lawrence" sigAt={T.beautiful + i * 260} />)}
    <Orb o={o} at={T.every} to={T.goated} x={540} y={640} size={180} color={LIME}><span style={{fontSize: 80, color: '#2a6b12', fontWeight: 900}}>✓</span></Orb>
    {o >= T.every && o < T.goated && <div style={{position: 'absolute', top: 560, left: 640, fontFamily: 'Anton', fontSize: 64, color: '#fff', transform: `translateX(${(1 - pop(o, T.every + 150, 12, 240)) * 300}px)`}}>SAME EVERY TIME</div>}
    <GlowTitle o={o} at={T.goated} to={S[4]} small="he's got a" big="goated pen" y={120} />
    <Orb o={o} at={T.goated + 200} to={S[4]} x={330} y={560} size={190}>{emo('1f410', 100)}</Orb>
    <Orb o={o} at={T.goated + 350} to={S[4]} x={750} y={560} size={190} color="#5ad1ff">{emo('1f58b-fe0f', 100)}</Orb>
    <Silhouette o={o} from={T.told} reveal={T.peyton} to={S[6]} file="peyton.png" x={640} h={520} />
    <PhoneCall o={o} from={S[6] - 60} to={S[7] + 100} file="peyton.png" name="Peyton Manning" />
    <QuoteCard o={o} from={S[7] + 80} to={PEN_MS} file="peyton.png" quote lines={[{text: "IT'S A BIG DEAL", at: T.a, size: 120, font: 'Anton'},
      {text: 'to have a', at: T.toHave, size: 84, italic: true}, {text: 'NICE SIGNATURE', at: T.nice, size: 120}]} sign={{text: 'Peyton Manning', at: T.toHave}} />
  </>,
  fx: [sfx('jorho-whoosh', 0, 0.3), sfx('jorho-pop', T.big, 0.5), sfx('jorho-pop', T.big + 220, 0.5), sfx('jorho-pop', T.some, 0.5), sfx('jorho-pop', T.hobby, 0.5),
    sfx('jorho-click', S[1] + 120, 0.45), sfx('jorho-snap', T.anthony - 60, 0.4), sfx('jorho-pop', T.rich, 0.5), sfx('jorho-pop', T.rich + 350, 0.5), sfx('jorho-pop', T.haven, 0.5),
    sfx('jorho-swish', T.his, 0.35), sfx('jorho-pen', T.auto, 0.5, 300), sfx('jorho-whoosh', T.looks - 200, 0.25), sfx('jorho-pop', T.looks + 300, 0.5),
    sfx('jorho-pop', T.A, 0.6), sfx('jorho-pop', T.R, 0.6), sfx('jorho-swish', T.thisBig, 0.35), sfx('jorho-click', T.noResp + 60, 0.6),
    ...[0, 1, 2].map((i) => sfx('jorho-pen', T.beautiful + i * 260, 0.4, 700)), sfx('jorho-click', T.every, 0.5), sfx('jorho-pop', T.goated + 200, 0.5), sfx('jorho-pop', T.goated + 350, 0.5),
    sfx('jorho-pop', T.you + 300, 0.5), sfx('jorho-pop', T.told, 0.45), sfx('jorho-pop', T.iron, 0.45), sfx('jorho-pop', T.manning, 0.5),
    sfx('jorho-ring', S[6], 0.22, S[7] - S[6]), sfx('jorho-snap', S[7] + 80, 0.4), sfx('jorho-pen', T.signature - 300, 0.45, 800)],
};
export const JorhoPen = () => <Jorho s={PEN} />;

// ---- t1 · v6: real 3D (three.js) over the footage, meme SFX set from the user's TikTok refs ------------------------
const K3: PenTimes = {some: T.some, hobby: T.hobby, no: T.no, anthony: T.anthony, disrespect: T.disrespect, haven: T.haven, his: T.his, auto: T.auto, looks: T.looks, ant: T.ant,
  A: T.A, R: T.R, thisBig: T.thisBig, noResp: T.noResp, look: T.look, beautiful: T.beautiful, every: T.every, goated: T.goated, pen: o_(27100), you: T.you,
  peyton: T.peyton, manning: T.manning, big2: T.big2, nice: T.nice, signature: T.signature, S, end: PEN_MS};
// who talks (scripts/voice_diarize.py + frame check): the LEFT host does the roast and the "goated pen" line,
// Trevor (M) laughs "I haven't" and tells the Peyton story
const PEN3D: Spec = {
  ...PEN,
  top: "Bro said Anthony Richardson's autograph looks like an ant",
  wideXAt: () => 720,
  shots: [[0, 'W'], [S[1], 'W'], [T.haven, 'M'], [T.his, 'L'], [S[3], 'W'], [S[4], 'M']],
  words: wordsFrom(t1Words, tTl, {goaded: 'goated', "Richardson's,": "Richardson's", auto: 'autograph', autos: 'autographs'},
    {Anthony: '#21F5E6', "Richardson's": '#21F5E6', ant: '#58EE28', goated: '#58EE28', Peyton: '#F9FC35', Manning: '#F9FC35'}),
  capsOff: [],
  tints: [[T.noResp, RED], [T.goated, GREEN]],
  swish: [T.goated],
  music: {file: 'du-bist-full.mp3', from: 45740 - (S[1] - STROBE_CUT), level: 0.12},
  behind: (o) => <PenBehind o={o} K={K3} />,
  box: (o) => <>
    <Dim o={o} spans={[[T.anthony - 60, T.haven], [T.his, S[3]], [S[3], S[4]], [S[6] - 60, PEN_MS]]} />
    <PenFront o={o} K={K3} />
  </>,
  fx: [sfx('jorho-whoosh', 0, 0.25),
    sfx('meme-jet', T.some, 0.55), sfx('meme-jet', T.hobby + 200, 0.45), sfx('meme-dundun', T.no, 0.6),
    sfx('meme-flash', T.anthony - 60, 0.5), sfx('meme-fahh', T.disrespect, 0.5, 1400), sfx('meme-lwk', T.haven, 0.6),
    sfx('meme-shutter', T.his, 0.45), sfx('meme-radio', T.auto, 0.4), sfx('meme-build2', T.looks, 0.4), sfx('meme-orch', T.ant, 0.6),
    sfx('meme-impact', T.A, 0.5), sfx('meme-impact', T.R, 0.5), sfx('meme-trombone', T.thisBig + 100, 0.5, 1500), sfx('meme-violin', T.noResp, 0.45, 1300),
    ...[0, 1, 2].map((i) => sfx('meme-shutter', T.look + i * 120, 0.35)), ...[0, 1, 2].map((i) => sfx('jorho-pen', T.beautiful + i * 280, 0.4, 650)),
    sfx('meme-tada', T.every + 150, 0.5), sfx('meme-impact', T.goated, 0.55), sfx('meme-bonk', o_(27100), 0.45),
    sfx('meme-build', T.you, 0.45, 2300), sfx('meme-orch', T.peyton, 0.6), sfx('meme-jet', T.manning, 0.4),
    sfx('meme-radio', S[6], 0.45), sfx('jorho-ring', S[6] + 150, 0.2, S[7] - S[6] - 150), sfx('meme-flash', S[7] + 100, 0.4),
    sfx('meme-impact', T.big2, 0.5), sfx('jorho-pen', T.nice - 250, 0.45, 900), sfx('meme-tada', T.signature + 200, 0.5)],
};
export const JorhoPen3D = () => <Jorho s={PEN3D} />;

// ==== v6 3D set 2 (2026-11-01): who talks checked with scripts/voice_diarize.py + frames; plain on-screen words ====
// ---- NBA goat 3D (input.mp4): left host asks, Trevor (M) thinks and answers, right host "I could feel the tension"
const KG: GoatTimes = {who: N.who, nba: N.nba, greatest: N.greatest, think: N.think, gotta: N.gotta, della: N.della, laugh: N.laugh, tension: N.tension, end: GOAT_MS};
const GOAT3D: Spec = {
  ...GOAT, intro: undefined, cut: undefined, over: undefined, push: true,
  shots: [[0, 'W'], [N.who, 'L'], [N.nba, 'M'], [N.greatest, 'L'], [N.think, 'M'], [N.della + 1500, 'W'], [N.tension - 200, 'R']],
  strobes: [N.who - STROBE_CUT, N.gotta - STROBE_CUT],
  tints: [[N.della, GREEN], [N.tension, RED]], swish: [N.della],
  music: {file: 'joyful-chess-slowed.mp3', from: 40500 - N.della, level: 0.12},
  box: (o) => <><Dim o={o} spans={[[N.who, N.nba], [N.greatest, N.gotta], [N.della, N.laugh + 200]]} /><GoatFront o={o} K={KG} /></>,
  fx: [sfx('jorho-whoosh', 0, 0.25), sfx('meme-jet', 150, 0.45), sfx('meme-impact', N.who + 220, 0.45), sfx('meme-bonk', N.nba, 0.5),
    ...[0, 1, 2, 3].map((i) => sfx('meme-impact', N.greatest + 120 + i * 260, 0.3)), sfx('meme-shutter', N.think + 200, 0.35),
    sfx('meme-build', N.gotta - 2600, 0.4, 2500), sfx('meme-orch', N.della, 0.6), sfx('meme-trombone', N.laugh + 300, 0.45, 1600), sfx('meme-violin', N.tension, 0.45, 1300)],
};
export const JorhoGoat3D = () => <Jorho s={GOAT3D} />;

// ---- $20,000 → $500 3D (u3): standing host + Trevor (wide), seated LEFT host explains, Trevor "oh really"
const r3 = timeline([[0, 1780], [1780, 2900], [2900, 6000], [7000, 9600], [17160, 22600], [23980, 26500], [27050, 27900], [28950, 33050]]);
export const REDEEM3D_MS = r3.total;
const R3 = r3.segOut;
const KR: RedeemTimes = {k20: r3.out(1140), what: r3.out(1780), d200: r3.out(2940), d500: r3.out(4240), maybe: r3.out(5520), why: r3.out(7020), finish: r3.out(17780),
  product: r3.out(19940), notYet: r3.out(21160), people: r3.out(24320), really: r3.out(27260), product2: r3.out(30260), most: r3.out(31640), sale: r3.out(32460), end: REDEEM3D_MS, S: R3};
const REDEEM3D: Spec = {
  tl: r3, src: 'pod2/u3_redemptions.mp4', track: redeemTrack as unknown as Track, top: 'Imagine your card going from $20,000 to $500', wordY: 1170, wideX: 760, push: true,
  words: wordsFrom(redeemWords, r3, {'20': '$20,000', '000': '', '200': '$200?', '500': '$500'}, {'$20,000': '#58EE28', '$500': '#F9FC35', expensive: '#58EE28'}),
  shots: [[0, 'W'], [R3[3], 'W'], [R3[4], 'L'], [R3[6], 'M'], [R3[7], 'W'], [KR.sale - 900, 'L']],
  strobes: [R3[3] - STROBE_CUT, R3[7] - STROBE_CUT], tints: [[KR.d500, RED], [KR.sale, GREEN]], swish: [KR.sale],
  music: {file: 'du-bist-full.mp3', from: 42050 - KR.d500, level: 0.12},
  box: (o) => <><Dim o={o} spans={[[KR.k20, R3[3]], [KR.why, R3[6]], [R3[7], REDEEM3D_MS]]} /><RedeemFront o={o} K={KR} /></>,
  fx: [sfx('jorho-whoosh', 0, 0.25), sfx('meme-jet', 120, 0.45), sfx('meme-orch', KR.k20, 0.5), sfx('meme-radio', KR.what, 0.4), sfx('meme-shutter', KR.d200 - 150, 0.4),
    sfx('meme-trombone', KR.d500, 0.5, 1500), sfx('meme-lwk', KR.maybe, 0.5), sfx('meme-build2', KR.why, 0.4), sfx('meme-radio', KR.finish, 0.4), sfx('meme-jet', KR.product, 0.4),
    sfx('meme-impact', KR.notYet, 0.45), sfx('meme-fahh', KR.people + 100, 0.45, 1500), sfx('meme-bonk', KR.really, 0.5), sfx('meme-build', KR.product2, 0.35, 2000), sfx('meme-jet', KR.most, 0.35), sfx('meme-tada', KR.sale, 0.5)],
};
export const JorhoRedeem3D = () => <Jorho s={REDEEM3D} />;

// ---- wrong Josh Allen 3D (t5): the standing LEFT host does nearly all the talking → wide shot centred on him + Trevor
const j3 = timeline([[1600, 3500], [5300, 7950], [11500, 13150], [14050, 14600], [15050, 16650], [17100, 18950], [19100, 25750]]);
export const JOSH3D_MS = j3.total;
const J3 = j3.segOut;
const KJ: JoshTimes = {gold: j3.out(2020), prism: j3.out(3300), teal: j3.out(5920), josh: j3.out(12580), fire: j3.out(16400), rookie: j3.out(18500), notRookie: j3.out(19380),
  joshAllen: j3.out(19960), real: j3.out(22040), hines: j3.out(22800), before: j3.out(24400), changed: j3.out(24840), end: JOSH3D_MS, S: J3};
const JOSH3D: Spec = {
  tl: j3, src: 'pod/t5_ex_teammate.mp4', track: t5Track as unknown as Track, top: "When you pull Josh Allen but it's the wrong one", wordY: 1170, wideX: 880, push: true,
  words: wordsFrom(t5Words, j3, {Heinz: 'Hines'}, {gold: '#F9FC35', Josh: '#21F5E6', Allen: '#21F5E6', Hines: '#58EE28', fire: '#F9FC35'}),
  shots: [[0, 'W']],
  strobes: [J3[2] - STROBE_CUT, J3[6] - STROBE_CUT], tints: [[KJ.real, GREEN]], swish: [KJ.josh, KJ.real],
  music: {file: 'joyful-chess-slowed.mp3', from: 84700 - KJ.real, level: 0.12},
  box: (o) => <><Dim o={o} spans={[[0, JOSH3D_MS]]} /><JoshFront o={o} K={KJ} /></>,
  fx: [sfx('jorho-whoosh', 0, 0.25), sfx('meme-jet', KJ.gold, 0.5), sfx('meme-bonk', KJ.teal, 0.5), sfx('meme-orch', KJ.josh, 0.55), sfx('meme-jet', KJ.fire - 100, 0.5),
    sfx('meme-shutter', KJ.rookie, 0.4), sfx('meme-dundun', KJ.notRookie, 0.5), sfx('meme-violin', KJ.joshAllen, 0.35, 900), sfx('meme-tada', KJ.real, 0.55),
    sfx('meme-impact', KJ.changed, 0.45)],
};
export const JorhoJosh3D = () => <Jorho s={JOSH3D} />;

// ==== v7 HYBRID podcast motion graphics (user, 2026-11-01): "every element does not have to be 3D … make sure it also
// looks like a podcast motion graphics style". 2D stickers/pills/keywords/emoji (src/jorho/pod7.tsx) + 1-2 3D heroes.
// Speakers checked with face-crop strips (diarize was unsure on these): see vault Jorho style v7.
// ---- Gift ticket (t4): LEFT host gives Trevor a ticket from his own national title game signed by him; Trevor (M) reacts
const g7 = timeline([[9750, 11900], [14300, 17450], [21480, 25400], [26560, 29380], [32220, 33400], [38100, 42250], [66350, 69980]]);
export const GIFT7_MS = g7.total;
const G7 = g7.segOut, go = g7.out;
const KG7 = {gift: go(11460), weird: go(14680), youWith: go(16160), signed: go(22140), ticket: go(22480), national: go(24120), sig: go(27360), thank: go(32760),
  giving: go(39820), auto: go(41140), college: go(66900), ticket2: go(68020), sweet: go(69600)};
const GIFT7: Spec = {
  tl: g7, src: 'pod/t4_natty_ticket.mp4', track: t4Track as unknown as Track, top: 'He gifted Trevor a ticket signed by Trevor', wordY: 1170, wideX: 700, push: true,
  words: wordsFrom(t4Words, g7, {auto: 'autograph', into: 'in'}, {gift: '#F9FC35', weird: '#F9FC35', ticket: '#F9FC35', national: '#58EE28', championship: '#58EE28', signature: '#21F5E6', autograph: '#F9FC35', sweet: '#58EE28'}),
  shots: [[0, 'W'], [G7[5], 'M']],
  strobes: [G7[2] - STROBE_CUT, G7[5] - STROBE_CUT], tints: [[KG7.ticket, GREEN]], swish: [G7[5]],
  music: {file: 'blue-yung-kai.mp3', from: 23500 - KG7.ticket, level: 0.12},
  box: (o) => <>
    <Band o={o} from={G7[1]} to={G7[2]} h={420} /><Band o={o} from={G7[4]} to={GIFT7_MS} h={380} />
    <GiftFront o={o} K={{gift: KG7.gift, hide1: G7[1], seg3: G7[2], signed: KG7.signed, sigFrom: KG7.sig - 400, seg5: G7[4], seg7: G7[6], ticket2: KG7.ticket2, end: GIFT7_MS}} />
    <Pill o={o} at={KG7.gift - 150} to={G7[1]} text="A GIFT FOR TREVOR" icon="1f381" x={540} y={950} bg={P7.TEAL} />
    <Sticker o={o} at={KG7.weird} to={G7[2]} src="img/jorho/trevor_t3.png" x={230} y={190} w={250} rot={-6} label="TREVOR" />
    <Arrow7 o={o} at={KG7.youWith - 350} to={G7[2]} d="M 360 150 Q 540 20 720 150" />
    <Sticker o={o} at={KG7.youWith} to={G7[2]} src="img/jorho/trevor_t3.png" x={850} y={190} w={250} rot={6} label="TREVOR" flip />
    <Emoji o={o} at={KG7.youWith + 400} to={G7[2]} code="1f914" x={540} y={230} size={120} />
    <Pill o={o} at={KG7.national - 400} to={G7[3]} text="2019 NATIONAL TITLE GAME" x={540} y={950} bg="#F56600" size={38} />
    <Pill o={o} at={KG7.sig - 200} to={G7[4]} text="SIGNED BY HIM" icon="1f525" x={540} y={950} bg="#522D80" size={40} />
    <Emoji o={o} at={KG7.thank - 150} to={G7[5]} code="1f979" x={540} y={190} size={170} />
    <Pill o={o} at={KG7.thank + 100} to={G7[5]} text="HE LOVES IT" x={540} y={950} bg={P7.LIME} fg={P7.INK} />
    <Big o={o} at={KG7.giving - 300} to={G7[6]} text="HIS OWN AUTOGRAPH?" x={540} y={120} size={92} color={P7.GOLD} />
    <Emoji o={o} at={KG7.auto + 300} to={G7[6]} code="1f62c" x={900} y={330} size={140} />
    <Big o={o} at={KG7.college - 150} to={KG7.ticket2 + 500} text="HE NEVER HAD ONE" x={540} y={120} size={92} />
    <Big o={o} at={KG7.ticket2 + 500} text="NOW HE DOES" x={540} y={120} size={104} color={P7.LIME} rot={-4} />
    <Emoji o={o} at={KG7.ticket2 + 700} code="1f979" x={170} y={330} size={140} />
  </>,
  fx: [sfx('jorho-whoosh', 0, 0.25), sfx('meme-jet', 120, 0.4), sfx('meme-impact', KG7.gift, 0.45), sfx('meme-lwk', KG7.weird, 0.45), sfx('meme-bonk', KG7.youWith, 0.45),
    sfx('meme-build2', G7[2], 0.35), sfx('meme-orch', KG7.ticket, 0.55), sfx('meme-shutter', KG7.national - 400, 0.4), sfx('jorho-pen', KG7.sig - 400, 0.45, 1300),
    sfx('jorho-pop', KG7.thank - 150, 0.5), sfx('meme-dundun', KG7.giving - 300, 0.4), sfx('meme-bonk', KG7.auto + 300, 0.4), sfx('meme-trombone', KG7.college - 150, 0.4, 1300),
    sfx('meme-tada', KG7.ticket2 + 500, 0.5)],
};
export const JorhoGift7 = () => <Jorho s={GIFT7} />;

// ---- PSA 10 celly (u2): LEFT host pitches a touchdown celebration, Trevor (M) answers "No." / "Maybe." / "I'm not good" / "I like that"
const c7 = timeline([[2080, 8950], [12900, 15000], [19650, 32400]]);
export const CELLY7_MS = c7.total;
const C7 = c7.segOut, co = c7.out;
const KC7 = {celly: co(2720), no: co(3600), gave: co(4600), td: co(6880), maybe: co(8480), dance: co(13520), notGood: co(14540), collectors: co(20000), psa: co(22660),
  best: co(24560), point: co(26340), t1: co(27580), t2: co(27840), t3: co(28000), easy: co(28660), itsIt: co(29400), likeThat: co(30180), iLike: co(31000), yo: co(31920)};
const CELLY7: Spec = {
  tl: c7, src: 'pod2/u2_psa10_celly.mp4', track: u2Track as unknown as Track, top: 'Trevor finally got a touchdown celebration', wordY: 1170, wideX: 960, push: true,
  words: wordsFrom(u2Words, c7, {selly: 'celly', '1010': '10', tutti: 'TD'}, {celly: '#F9FC35', touchdown: '#58EE28', choreographed: '#F9FC35', PSA: '#21F5E6', '10': '#F9FC35', best: '#58EE28', grade: '#58EE28', easy: '#58EE28'}),
  shots: [[0, 'L'], [KC7.no - 80, 'M'], [KC7.gave - 600, 'L'], [KC7.maybe - 100, 'M'], [C7[2], 'L'], [KC7.itsIt - 80, 'M'], [KC7.likeThat - 250, 'L'], [KC7.iLike - 250, 'M']],
  strobes: [C7[2] - STROBE_CUT, KC7.t1 - STROBE_CUT], tints: [[KC7.psa, GREEN]], swish: [C7[1]],
  music: {file: 'joyful-chess-slowed.mp3', from: 40500 - KC7.t1, level: 0.12},
  box: (o) => <>
    <Band o={o} from={0} to={C7[1]} h={330} />
    <CellyFront o={o} K={{fbFrom: KC7.gave + 300, fbTo: KC7.maybe - 200, slabFrom: KC7.psa - 500, psa: KC7.psa, slabTo: KC7.point, yo: KC7.yo, end: CELLY7_MS}} />
    <Big o={o} at={KC7.celly - 200} to={KC7.no - 80} text="NO CELLY?" x={540} y={140} size={120} color={P7.GOLD} />
    <Emoji o={o} at={KC7.celly} to={KC7.gave - 600} code="1f3c8" x={900} y={330} size={130} />
    <Pill o={o} at={KC7.celly + 400} to={KC7.gave} text="CELLY = CELEBRATION" x={540} y={950} bg={P7.TEAL} size={40} />
    <Big o={o} at={KC7.no} to={KC7.gave - 600} text="NO." x={540} y={150} size={140} color="#fff" box={P7.RED} rot={-6} />
    <Pill o={o} at={KC7.td - 300} to={KC7.maybe - 100} text="ONE TOUCHDOWN" icon="1f3c8" x={540} y={950} bg={P7.LIME} fg={P7.INK} />
    <Emoji o={o} at={KC7.maybe} to={C7[1]} code="1f914" x={880} y={260} size={140} />
    <Big o={o} at={KC7.dance - 600} to={C7[2]} text="A DANCE?" x={540} y={140} size={120} />
    {o < C7[2] && <MarkerX o={o} at={KC7.notGood} x={415} y={15} s={250} />}
    <Sticker o={o} at={KC7.collectors - 200} to={KC7.psa - 300} src="img/j3d/card_lebron.png" x={150} y={330} w={190} rot={-12} />
    <Sticker o={o} at={KC7.collectors} to={KC7.psa - 300} src="img/j3d/card_jallen.png" x={930} y={330} w={190} rot={10} />
    <Sticker o={o} at={KC7.collectors + 200} to={KC7.psa - 300} src="img/j3d/card_trevor.png" x={540} y={140} w={160} rot={-3} />
    <Pill o={o} at={KC7.best - 200} to={KC7.point} text="PSA 10 = PERFECT GRADE" x={540} y={950} bg={P7.RED} size={40} />
    <Pill o={o} at={KC7.point - 200} to={KC7.t1} text="THE NEW CELLY" x={540} y={120} bg={P7.TEAL} size={44} />
    <Big o={o} at={KC7.t1} to={KC7.easy + 300} text="10" x={210} y={330} size={170} color={P7.RED} rot={-10} />
    <Big o={o} at={KC7.t2} to={KC7.easy + 300} text="10" x={540} y={150} size={190} color={P7.GOLD} rot={4} />
    <Big o={o} at={KC7.t3} to={KC7.easy + 300} text="10" x={870} y={330} size={170} color="#fff" rot={10} />
    <Pill o={o} at={KC7.easy + 300} to={KC7.iLike} text="NEW CELLY UNLOCKED" icon="1f525" x={540} y={950} bg={P7.GOLD} fg={P7.INK} size={42} />
    <Big o={o} at={KC7.iLike - 100} text="10/10" x={540} y={140} size={150} color={P7.LIME} />
    <Emoji o={o} at={KC7.yo - 100} code="1f525" x={880} y={300} size={140} />
  </>,
  fx: [sfx('jorho-whoosh', 0, 0.25), sfx('meme-jet', 120, 0.4), sfx('meme-impact', KC7.celly - 200, 0.45), sfx('meme-bonk', KC7.no, 0.5), sfx('meme-jet', KC7.gave + 300, 0.45),
    sfx('meme-impact', KC7.td - 300, 0.35), sfx('meme-lwk', KC7.maybe, 0.45), sfx('meme-dundun', KC7.dance - 600, 0.4), sfx('meme-trombone', KC7.notGood, 0.45, 1400),
    ...[0, 1, 2].map((i) => sfx('meme-shutter', KC7.collectors - 200 + i * 200, 0.35)), sfx('meme-build2', KC7.psa - 500, 0.35), sfx('meme-orch', KC7.psa, 0.55),
    sfx('meme-radio', KC7.point - 200, 0.35), ...[KC7.t1, KC7.t2, KC7.t3].map((t) => sfx('meme-impact', t, 0.45)), sfx('meme-tada', KC7.easy + 300, 0.5),
    sfx('meme-impact', KC7.iLike - 100, 0.4), sfx('jorho-pop', KC7.yo - 100, 0.5)],
};
export const JorhoCelly7 = () => <Jorho s={CELLY7} />;

// ---- Davis Mills neck (t6): standing LEFT host reads the pulls, RIGHT host roasts the neck, Trevor laughs
const n7 = timeline([[1500, 16700]]);
export const NECK7_MS = n7.total;
const no7 = n7.out;
const KN7 = {red: no7(3360), nashon: no7(4400), adam: no7(5140), davis: no7(5820), ew: no7(6940), hes: no7(9160), longer: no7(9700), neck: no7(9940), glennon: no7(10580),
  trevor: no7(11940), oh: no7(14320), nothing: no7(16640)};
const NECK7: Spec = {
  tl: n7, src: 'pod/t6_davis_mills_joke.mp4', track: t5Track as unknown as Track, top: 'Bro roasted Davis Mills neck mid pack opening', wordY: 1170, wideX: 700, push: false,
  wideXAt: (o) => (o < KN7.ew - 150 ? 700 : o < KN7.oh - 150 ? 1220 : o < KN7.nothing - 300 ? 1000 : 760),
  words: wordsFrom(t6Words, n7, {}, {Davis: '#21F5E6', Mills: '#21F5E6', 'Ew': '#F9FC35', longer: '#F9FC35', neck: '#58EE28', Mike: '#21F5E6', Glennon: '#21F5E6', nothing: '#F9FC35'}),
  shots: [[0, 'W']],
  strobes: [KN7.davis - STROBE_CUT], tints: [[KN7.ew, RED]], swish: [KN7.ew - 150, KN7.oh - 150, KN7.nothing - 300],
  music: {file: 'du-bist-full.mp3', from: 42500 - KN7.neck, level: 0.12},
  box: (o) => <>
    <Band o={o} from={KN7.hes - 300} to={KN7.oh} h={430} />
    <MillsFront o={o} K={{names: [KN7.red, KN7.nashon, KN7.adam], davis: KN7.davis, ew: KN7.ew, out: KN7.hes - 300}} />
    <Pill o={o} at={150} to={KN7.davis} text="PACK OPENING" icon="1f525" x={540} y={950} bg={P7.TEAL} />
    <Pill o={o} at={KN7.davis} to={KN7.hes - 300} text="DAVIS MILLS" x={540} y={950} bg="#A71930" size={44} />
    <Big o={o} at={KN7.ew} to={KN7.hes - 300} text="EW" x={860} y={160} size={150} color="#fff" box={P7.RED} rot={8} />
    <Emoji o={o} at={KN7.ew + 250} to={KN7.hes - 300} code="1f62c" x={180} y={190} size={130} />
    <Neck o={o} at={KN7.hes - 200} to={KN7.oh} src="img/jorho/mills.png" x={210} y={180} w={300} from={KN7.longer} amount={200} label="DAVIS MILLS" bg="#A71930" />
    <Ruler o={o} at={KN7.neck} to={KN7.oh} x={385} y={398} h={370} />
    <Neck o={o} at={KN7.glennon - 250} to={KN7.oh} src="img/jorho/glennon.png" x={560} y={180} w={300} from={KN7.glennon} amount={110} label="MIKE GLENNON" bg="#0B2265" />
    <Emoji o={o} at={KN7.glennon + 350} to={KN7.oh} code="1f992" x={880} y={150} size={150} />
    <Big o={o} at={KN7.longer - 150} to={KN7.oh} text="LONGER NECK?!" x={540} y={955} size={96} color={P7.GOLD} />
    <Emoji o={o} at={KN7.trevor} to={KN7.oh} code="1f923" x={300} y={470} size={120} />
    <Rain o={o} at={KN7.oh - 100} to={KN7.nothing} code="1f62d" n={16} />
    <Big o={o} at={KN7.nothing - 150} text="NOTHING" x={540} y={150} size={130} color="#fff" box={P7.INK} rot={-5} />
  </>,
  fx: [sfx('jorho-whoosh', 0, 0.25), sfx('meme-jet', 150, 0.4), ...[KN7.red, KN7.nashon, KN7.adam].map((t) => sfx('meme-bonk', t, 0.35)), sfx('meme-build', KN7.adam - 300, 0.35, 900),
    sfx('meme-orch', KN7.davis, 0.55), sfx('meme-violin', KN7.ew, 0.45, 1300), sfx('meme-dundun', KN7.hes - 200, 0.4), sfx('meme-build2', KN7.longer, 0.4),
    sfx('meme-impact', KN7.glennon, 0.5), sfx('meme-lwk', KN7.trevor, 0.4), sfx('meme-trombone', KN7.nothing - 150, 0.45, 1300)],
};
export const JorhoNeck7 = () => <Jorho s={NECK7} />;

// ==== v8 (user, 2026-11-01): "80-90% motion graphics/animation … visually shows what they are talking about … just the
// voice speaking (should sometimes show him) … download models from the internet … keep the black bars caption stuff".
// Trevor (M) on loving to throw on the move / coaches only rolling kids right / so he trained LEFT; left host (L) closes
// with "you're the best quarterback I've ever seen". Only S1, S4 and the first 1.25 s of S7 show real footage.
const lf = timeline([[47880, 50760], [19450, 21050], [22450, 24000], [26550, 31650], [32050, 33650], [34250, 39850], [44800, 46600], [50800, 53200]]);
export const LEFTY8_MS = lf.total;
const LS = lf.segOut, lo = lf.out;
const KL: LeftyK = {S: LS, throw0: lo(48300), left0: lo(49440), right0: lo(49920), kid: lo(23500), coachRight: lo(28900), most: lo(29560), hated: lo(32800),
  threw: lo(34440), leftB: lo(36060), onlyRight: lo(38380), rolling: lo(39380), worked: lo(45000), much: lo(46240), best: lo(51080), end: LEFTY8_MS};
const Reps = ({o}: {o: number}) => {
  if (o < LS[5] || o >= LS[7]) return null;
  const n = o < LS[6] ? Math.round(interpolate(o, [LS[5], LS[6]], [1, 999], {extrapolateRight: 'clamp'})) : 10000;
  return <div style={{position: 'absolute', left: 36, top: 30, padding: '10px 22px', borderRadius: 18, background: 'rgba(0,30,36,.72)', border: '3px solid #2fd25a',
    fontFamily: 'Anton', color: '#fff', fontSize: 40, lineHeight: 1.05, transform: `scale(${o < LS[6] ? 1 : 1 + 0.25 * Math.max(0, 1 - (o - LS[6]) / 300)})`, transformOrigin: '0 0'}}>
    <div style={{fontSize: 26, color: '#2fd25a', letterSpacing: 2}}>LEFT REPS</div>{n.toLocaleString('en-US')}</div>;
};
const LEFTY8: Spec = {
  tl: lf, src: 'pod/t3_traveling_trevors.mp4', track: t3Track as unknown as Track, top: 'Why Trevor is better rolling to his LEFT', wordY: 1170, wideX: 990, push: true,
  words: wordsFrom(t3Words, lf, {}, {left: '#58EE28', right: '#FFFFFF', kid: '#21F5E6', move: '#21F5E6', hated: '#F9FC35', quarterback: '#F9FC35', much: '#F9FC35'}),
  shots: [[0, 'M'], [LS[7], 'L']],
  strobes: [LS[1] - STROBE_CUT, LS[4] - STROBE_CUT, LS[7] - STROBE_CUT], tints: [[KL.left0, GREEN], [KL.hated, RED], [KL.leftB, GREEN]],
  swish: [LS[2], LS[3], LS[5], LS[6], KL.best + 1250],
  music: {file: 'funk-sigilo.mp3', from: 36900 - LS[5], level: 0.12},
  box: (o) => <><LeftyWorld o={o} K={KL} /><Reps o={o} /></>,
  fx: [sfx('jorho-whoosh', 0, 0.3), sfx('meme-jet', KL.throw0, 0.45), sfx('meme-impact', KL.left0, 0.45), sfx('meme-bonk', KL.right0 + 120, 0.45),
    sfx('jorho-pop', KL.kid - 100, 0.45), sfx('meme-radio', LS[3] + 100, 0.3), sfx('jorho-pen', KL.coachRight - 500, 0.4, 900), sfx('meme-dundun', KL.most - 250, 0.35),
    sfx('meme-violin', KL.hated, 0.4, 1200), ...[KL.threw, KL.leftB, KL.rolling].map((t) => sfx('meme-jet', t, 0.35)), sfx('meme-impact', KL.leftB, 0.4),
    sfx('meme-bonk', KL.onlyRight + 150, 0.4), sfx('meme-build', LS[6] - 1200, 0.35, 1300), sfx('meme-orch', KL.much - 150, 0.5), sfx('meme-tada', KL.best + 1250, 0.5)],
};
export const JorhoLefty8 = () => <Jorho s={LEFTY8} />;

// ==== v9 FLAT motion design (user, 2026-11-01): "I don't want realistic bro. I want motion graphics style animation and
// simplistic anims" + juneedit3d neumorphism ref. Same lefty story/timeline/captions as v8; the box is flat 2D MG.
const endA9 = KL.best + 1250;
const LEFTY9: Spec = {
  ...LEFTY8,
  box: (o) => <LeftyFlat o={o} K={KL} />,
  fx: [sfx('jorho-pop', 0, 0.45), sfx('jorho-whoosh', KL.throw0 - 80, 0.4), sfx('jorho-swish', 650, 0.25), sfx('jorho-click', KL.left0 - 120, 0.5), sfx('meme-impact', KL.left0, 0.35),
    sfx('meme-bonk', KL.right0, 0.4), sfx('jorho-ting', KL.right0 + 250, 0.3),
    sfx('jorho-whoosh', LS[2], 0.35), sfx('keyboard-typing', LS[2] + 250, 0.35, 900), sfx('jorho-pop', KL.kid - 300, 0.45), sfx('jorho-click', KL.kid, 0.3),
    sfx('jorho-swish', LS[3] - 150, 0.35), sfx('jorho-pop', LS[3] + 100, 0.3), sfx('jorho-pen', KL.coachRight - 600, 0.35, 800), sfx('jorho-click', KL.coachRight, 0.35),
    sfx('jorho-whoosh', KL.most - 300, 0.3), sfx('meme-dundun', KL.most - 100, 0.3), sfx('meme-violin', KL.hated, 0.4, 1200),
    sfx('jorho-whoosh', LS[5] - 300, 0.3), ...[KL.threw, KL.leftB, KL.rolling].map((t) => sfx('meme-jet', t, 0.3)), sfx('meme-impact', KL.leftB - 100, 0.4),
    sfx('keyboard-typing', KL.onlyRight - 100, 0.35, 900), sfx('meme-bonk', KL.rolling - 300, 0.45),
    sfx('jorho-whoosh', LS[6] - 200, 0.35), sfx('meme-build', LS[6] - 1200, 0.3, 1100), sfx('meme-orch', KL.much - 150, 0.5),
    sfx('jorho-pop', endA9 + 100, 0.45), sfx('meme-tada', endA9 + 300, 0.5)],
};
export const JorhoLefty9 = () => <Jorho s={LEFTY9} />;

// ==== v10 (2026-11-01): natural openings — each Short opens on the real question being asked (context first), then
// flat MG (v9 style) answers while the voice continues. Hooks reviewed as a viewer before render (see vault v10 notes).
// ---- A) Playbook (u1): LEFT host asks, Trevor (M) answers
const pb = timeline([[0, 2700], [14150, 18300], [18400, 22900], [36800, 42900], [48800, 54850]]);
export const PB10_MS = pb.total;
const PBS = pb.segOut, po = pb.out;
const KPB: PbK = {S: PBS, mg1: PBS[1] + 1500, runs: po(19200), pass: po(20800), pa: po(21900), screens: po(22600), inventory: po(39000), thisWeek: po(42200),
  mg3: PBS[4] + 1250, eight: po(52500), ten: po(53900), end: PB10_MS};
const PB10: Spec = {
  tl: pb, src: 'pod2/u1_playbook.mp4', track: u1Track as unknown as Track, top: 'How many new plays an NFL team adds each week', wordY: 1170, wideX: 930, push: true,
  words: wordsFrom(u1Words, pb, {}, {playbook: '#F9FC35', hundreds: '#58EE28', plays: '#F9FC35', week: '#21F5E6', eight: '#58EE28', ten: '#58EE28', inventory: '#21F5E6'}),
  wideXAt: (o) => (o < PBS[1] ? 735 : 930), // question on a two-shot: asker + Trevor in frame (context first)
  shots: [[0, 'W'], [PBS[1], 'M']],
  strobes: [PBS[1] - STROBE_CUT], tints: [[KPB.eight, GREEN]], swish: [KPB.mg1, PBS[2], PBS[3] + 1250, KPB.mg3],
  music: {file: 'funk-sigilo.mp3', from: 36900 - KPB.mg1, level: 0.12},
  box: (o) => <PlaybookFlat o={o} K={KPB} />,
  fx: [sfx('jorho-whoosh', KPB.mg1 - 250, 0.35), ...[0, 1, 2, 3].map((i) => sfx('jorho-click', KPB.mg1 + 150 + i * 400, 0.25)), sfx('meme-impact', PBS[2] - 1300, 0.35),
    ...[KPB.runs, KPB.pass, KPB.pa, KPB.screens].map((t) => sfx('jorho-pop', t - 150, 0.35)), sfx('jorho-whoosh', KPB.inventory - 300, 0.3), sfx('jorho-swish', KPB.thisWeek - 900, 0.3),
    sfx('jorho-ting', KPB.thisWeek, 0.35), sfx('jorho-whoosh', KPB.mg3 - 250, 0.3), sfx('jorho-ting', KPB.eight, 0.35), sfx('meme-tada', KPB.ten, 0.45)],
};
export const JorhoPlaybook10 = () => <Jorho s={PB10} />;

// ---- B) Dream golf foursome (t2): RIGHT host asks, Trevor (M) answers "Jesus" and "Tiger"
const gf = timeline([[11200, 13900], [23650, 24600], [26500, 28400], [32200, 34300], [34700, 35600], [45400, 48700], [50300, 54400]]);
export const GOLF10_MS = gf.total;
const GFS = gf.segOut, gfo = gf.out;
const KGF: GolfK = {S: GFS, card: gfo(12300), week: gfo(27300), jesus: gfo(33400), tiger: gfo(48000), goat: gfo(51300), end: GOLF10_MS};
const GOLF10: Spec = {
  tl: gf, src: 'pod/t2_dream_golf_four.mp4', track: golfTrack as unknown as Track, top: 'Trevor picks his dream golf foursome', wordY: 1170, wideX: 1000, push: true,
  words: wordsFrom(golfWords, gf, {for: 'foursome', some: '', of: 'on'}, {dream: '#F9FC35', foursome: '#F9FC35', golf: '#58EE28', Jesus: '#F9FC35', Tiger: '#58EE28', goat: '#21F5E6', week: '#21F5E6'}),
  wideXAt: (o) => (o < GFS[1] ? 1250 : 1000), // question on a two-shot: Trevor + right host
  shots: [[0, 'W'], [GFS[1], 'M'], [GFS[4], 'W'], [GFS[5], 'M']],
  strobes: [GFS[1] - STROBE_CUT], tints: [[KGF.jesus, GREEN]], swish: [GFS[2], GFS[3], GFS[5]],
  music: {file: 'joyful-chess-slowed.mp3', from: 40500 - KGF.tiger, level: 0.12},
  box: (o) => <GolfFlat o={o} K={KGF} />,
  fx: [sfx('jorho-swish', KGF.card - 200, 0.3), sfx('jorho-click', KGF.card + 700, 0.35), sfx('jorho-whoosh', GFS[2] - 200, 0.3), sfx('keyboard-typing', GFS[2] + 150, 0.3, 700),
    sfx('jorho-ting', KGF.week, 0.3), sfx('jorho-ting', KGF.jesus, 0.35), sfx('meme-impact', KGF.jesus, 0.3), sfx('jorho-whoosh', GFS[5] - 250, 0.3),
    sfx('jorho-pop', KGF.tiger - 100, 0.45), sfx('meme-orch', KGF.goat - 150, 0.4), sfx('jorho-click', GOLF10_MS - 1700, 0.35)],
};
export const JorhoGolf10 = () => <Jorho s={GOLF10} />;

// ==== v11 (2026-11-01): animated 2D drawings (unDraw, recoloured teal) in the flat style. Traveling Trevors (t3):
// LEFT host asks "how much do you know of us?", Trevor (M) answers. Opens on the real two-shot with who's-who labels.
const tt = timeline([[59400, 62950], [64600, 66650], [68450, 71800], [78450, 83250], [91550, 92750], [97050, 98600], [100050, 101950], [105350, 107000]]);
export const TT11_MS = tt.total;
const TTS = tt.segOut, tto = tt.out;
const KTT: DrawnK = {S: TTS, labels: 500, follow: tto(65800), algo: tto(70800), mgD: TTS[3], realD: tto(81100), second: TTS[4], funny: tto(97900), jax: tto(100700), games: tto(105900), end: TT11_MS};
const TT11: Spec = {
  tl: tt, src: 'pod/t3_traveling_trevors.mp4', track: t3Track as unknown as Track, top: 'What Trevor thinks of fans who dress like him', wordY: 1170, wideX: 990, push: true,
  wideXAt: (o) => (o < TTS[1] ? 715 : 990),
  words: wordsFrom(t3Words, tt, {traveling: 'Traveling', trevers: 'Trevors', instagram: 'Instagram', i: 'I'},
    {Traveling: '#F9FC35', Trevors: '#F9FC35', videos: '#21F5E6', algorithm: '#58EE28', Instagram: '#58EE28', whacked: '#F9FC35', funny: '#58EE28', Jax: '#21F5E6', fans: '#21F5E6', pumped: '#F9FC35'}),
  shots: [[0, 'W'], [TTS[1], 'M']],
  strobes: [KTT.realD - STROBE_CUT], tints: [[KTT.funny, GREEN]], swish: [TTS[1] + 900, TTS[2], TTS[3], TTS[4], TTS[5], TTS[6], TTS[7]],
  music: {file: 'du-bist-full.mp3', from: 42500 - KTT.funny, level: 0.12},
  box: (o) => <DrawnTT o={o} K={KTT} />,
  fx: [sfx('jorho-pop', KTT.labels, 0.35), sfx('jorho-pop', KTT.labels + 350, 0.35), ...[TTS[1] + 900, TTS[2], TTS[3] + 150, TTS[4] + 200, TTS[5], TTS[6], TTS[7]].map((t) => sfx('jorho-whoosh', t - 200, 0.3)),
    sfx('jorho-click', KTT.follow, 0.35), sfx('jorho-click', KTT.algo, 0.35), sfx('meme-bonk', tto(83000), 0.45), sfx('jorho-ting', TTS[4] + 250, 0.3),
    sfx('meme-impact', KTT.funny - 150, 0.35), sfx('meme-impact', KTT.jax - 200, 0.35), sfx('meme-tada', KTT.games - 150, 0.45)],
};
export const JorhoTT11 = () => <Jorho s={TT11} />;

// ==== v12 (2026-11-01): "make your own just a simplistic stickman then some images" — NBA GOAT (input.mp4) with
// hand-made SVG stickmen + player photos, v9 flat style. LEFT host asks, Trevor (M) thinks/answers, RIGHT host "tension".
const KG12: GoatK = {...N, end: GOAT_MS};
const GOAT12: Spec = {
  ...GOAT, top: 'Who is Trevor’s NBA GOAT?', beeps: undefined, intro: undefined, cut: undefined, over: undefined, push: true,
  shots: [[0, 'W'], [N.who, 'L'], [N.nba, 'M'], [N.greatest, 'L'], [N.think, 'M'], [N.della + 1500, 'W'], [N.tension - 200, 'R']],
  strobes: [N.gotta - STROBE_CUT], tints: [[N.della, GREEN]], swish: [N.who + 600, N.greatest, N.think + 1200, N.tension - 200],
  music: {file: 'joyful-chess-slowed.mp3', from: 40500 - N.della, level: 0.12},
  box: (o) => <GoatStick o={o} K={KG12} />,
  fx: [sfx('jorho-whoosh', N.who + 400, 0.3), sfx('jorho-pop', N.who + 800, 0.35), sfx('keyboard-typing', N.who + 900, 0.3, 800),
    ...[0, 1, 2].map((i) => sfx('jorho-pop', N.greatest + 250 + i * 220, 0.35)), sfx('jorho-ting', N.greatest + 900, 0.3),
    ...[0, 1, 2, 3, 4].map((i) => sfx('jorho-click', N.think + 1300 + i * 520, 0.22)), sfx('meme-build', N.gotta - 1400, 0.35, 1300),
    sfx('meme-orch', N.della - 150, 0.55), sfx('meme-bonk', N.della + 450, 0.45), sfx('meme-violin', N.tension - 200, 0.4, 1200)],
};
export const JorhoGoat12 = () => <Jorho s={GOAT12} />;

// ==== v13 (2026-11-01): 5 style candidates of the NBA GOAT clip (user picks one as the new Jorho style)
const goatV = (box: (p: {o: number; K: GoatK}) => ReactNode): Spec => ({...GOAT12, box: (o) => box({o, K: KG12})});
export const JorhoGoatWhiteboard = () => <Jorho s={goatV(Whiteboard)} />;
export const JorhoGoatChalk = () => <Jorho s={goatV(Chalk)} />;
export const JorhoGoatComic = () => <Jorho s={goatV(Comic)} />;
export const JorhoGoatArcade = () => <Jorho s={goatV(Arcade)} />;
export const JorhoGoatChat = () => <Jorho s={goatV(Chat)} />;

// ==== v14 sports poster (user, 2026-11-01): Pinterest sports-motion-design look; answers: keep Jorho frame, half footage /
// half graphics, black & white + one accent (#ff4d2e). Real footage is graded B&W too; captions white, keywords accent.
const POSTER_KEYS = new Set(['goat', 'GOAT', 'Matthew', 'Dellavedova', 'tension', 'greatest']);
const GOAT14: Spec = {
  ...GOAT12, grade: 'grayscale(1) contrast(1.18) brightness(1.02)',
  words: GOAT12.words.map((w) => ({...w, color: POSTER_KEYS.has(w.text) ? PO.AC : '#ffffff'})),
  tints: [[N.della, PO.AC]], box: (o) => <GoatPoster o={o} K={KG12} />,
  fx: [sfx('jorho-whoosh', N.who + 400, 0.3), ...[0, 160, 330, 520].map((d) => sfx('meme-impact', N.who + 600 + d, 0.28)), sfx('meme-jet', N.who + 1300, 0.3),
    ...[0, 1, 2].map((i) => sfx('jorho-swish', N.greatest + i * 260, 0.3)), sfx('meme-dundun', N.greatest + 1100, 0.35),
    ...[0, 1, 2, 3, 4].map((i) => sfx('jorho-click', N.think + 1300 + i * 520, 0.22)), sfx('meme-build', N.gotta - 1400, 0.35, 1300),
    sfx('jorho-flash', N.della - 150, 0.4), sfx('meme-orch', N.della - 150, 0.55), sfx('meme-impact', N.della + 450, 0.4), sfx('meme-violin', N.tension - 200, 0.4, 1200)],
};
export const JorhoGoat14 = () => <Jorho s={GOAT14} />;

// ==== v15 (2026-11-01): 3 more NBA GOAT edits from the other Pinterest refs. Top lines are creative, not about Trevor.
export const JorhoGoatPremium = () => <Jorho s={{...goatV(GoatPremium), top: 'This man is better than MJ and LeBron combined'}} />;
export const JorhoGoatCollage = () => <Jorho s={{...goatV(GoatCollage), top: 'Real ball knowledge is knowing who the GOAT is'}} />;
export const JorhoGoatNeon = () => <Jorho s={{...goatV(GoatNeon), top: 'The NBA GOAT debate is finally over'}} />;

// ==== v16 pixel (2026-11-02): chunky 8-bit people, table → dream court, mostly pixel, Game Boy green
export const JorhoGoatPixel = () => <Jorho s={{...goatV(GoatPixel), top: '8-bit proof the GOAT is not LeBron',
  fx: [...GOAT12.fx!, ...[0, 1, 2].map((i) => sfx('jorho-click', N.della - 600 + i * 120, 0.3)), sfx('jorho-ting', N.della + 150, 0.35)]}} />;

// ==== v17 "side quest" (2026-11-02): own basketball character with squash & stretch on a self-drawing paper world
export const JorhoGoatJourney = () => <Jorho s={{...goatV(GoatJourney), top: 'Finding the real NBA GOAT was a whole side quest',
  fx: [...GOAT12.fx!, sfx('jorho-pop', N.who + 950, 0.35), ...[0, 1, 2].map((i) => sfx('jorho-pop', N.greatest + 520 * (i + 1), 0.3)), sfx('jorho-whoosh', N.think + 1200, 0.35), sfx('jorho-ting', N.della - 150, 0.35)]}} />;

// ==== v18 (2026-11-02): the animate skill (github.com/cth9191/animate), crosshatch-ink style, original basketball hero.
// The piece (pieces/goat-ink, 1:1, same 17.8 s timeline) is exported to public/animate/goat_ink.mp4 and shown in the
// Jorho box on the graphics beats; real footage on the usual moments; podcast audio + our SFX.
const InkLayer = ({o}: {o: number}) => (beatOf(o, KG12) ? <OffthreadVideo src={staticFile('animate/goat_ink.mp4')} muted style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1077, objectFit: 'cover'}} /> : null);
export const JorhoGoatInk = () => <Jorho s={{...GOAT12, top: 'Ball knowledge level: picking this guy over MJ', box: (o) => <InkLayer o={o} />,
  fx: [...GOAT12.fx!, sfx('jorho-pen', N.who + 200, 0.35, 1200), sfx('jorho-pen', N.della + 250, 0.35, 700)]}} />;

// ==== v19 (2026-11-02): NBA GOAT in the ORIGINAL Jorho style, evidence-based hook pass (see vault v19 report).
// Opens on the real question on a two-shot (context first), cuts the confusing lead-in, trims the silent think from
// 5.4 s to 3.6 s, scores it with the Jeopardy think cue, cuts the music to silence before the answer, and explains the
// joke for non-fans with a verified stat (Dellavedova: 5.2 PPG career, landofbasketball.com / ESPN).
const g19 = timeline([[2150, 3650], [4380, 5150], [5550, 7350], [7350, 18810]]); // full real pause kept: campaign needs 15 s+
export const GOAT19_MS = g19.total;
const G19 = g19.segOut, go19 = g19.out;
const K19 = {who: go19(2280), nba: go19(4480), greatest: go19(5620), think: G19[3], gotta: go19(12780), della: go19(13820), name: go19(14160),
  laugh: go19(15050), could: go19(17480), tension: go19(18220)};
const Lbl = ({o, at, to, children, x, y}: {o: number; at: number; to: number; children: ReactNode; x: number; y: number}) => {
  if (o < at || o >= to) return null;
  const p = Math.min(1, (o - at) / 180), q = Math.min(1, (to - o) / 180);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translateY(${(1 - p) * 20}px)`, opacity: Math.min(p, q), background: 'rgba(0,0,0,.78)', color: '#fff',
    fontFamily: 'Montserrat', fontWeight: 800, fontSize: 34, padding: '10px 20px', borderRadius: 12, whiteSpace: 'nowrap', borderLeft: '6px solid #F9FC35'}}>{children}</div>;
};
const GOAT19: Spec = {
  tl: g19, src: 'input.mp4', track: goatTrack as unknown as Track, top: 'This NBA GOAT pick broke the whole room', wordY: 1170, wideX: 960, push: true,
  wideXAt: (o) => (o < G19[1] ? 665 : o < K19.laugh ? 960 : 960),
  words: wordsFrom(goatWords, g19, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova'}, {goat: '#58EE28', Matthew: '#21F5E6', Dellavedova: '#21F5E6', tension: '#F9FC35'}),
  capsOff: [[K19.think + 150, K19.gotta - 60]],
  shots: [[0, 'W'], [G19[1], 'M'], [G19[2], 'L'], [K19.think, 'M'], [K19.laugh + 200, 'W'], [K19.could - 100, 'R']],
  strobes: [K19.della - STROBE_CUT], tints: [[K19.della, GREEN], [K19.tension, RED]], swish: [K19.laugh + 200],
  cut: {file: 'della.png', from: K19.della, to: K19.laugh + 700, x: 600, h: 560},
  music: {file: 'du-bist-full.mp3', from: 42500 - K19.della, level: 0.12},
  // music under the question, out for the think (Jeopardy cue), silent for the beat before the answer, back on the payoff
  musicLevel: (o) => (o < K19.think - 200 ? 0.1 : o < K19.della ? 0 : 0.14),
  box: (o) => <>
    <Lbl o={o} at={350} to={G19[1]} x={600} y={40}>TREVOR LAWRENCE · NFL QB</Lbl>
    {o >= K19.think + 300 && o < K19.gotta && <>
      <Lbl o={o} at={K19.think + 300} to={K19.gotta} x={40} y={40}>THE USUAL ANSWERS…</Lbl>
      {[['lebron.png', 40, 0], ['kobe.png', 380, 1], ['curry.png', 720, 2]].map(([f, x, i]) => (
        <Cutout key={f as string} o={o} file={f as string} from={K19.think + 600 + (i as number) * 700} to={K19.gotta - 100} x={x as number} h={300} />))}
      <Lbl o={o} at={K19.think + 300} to={K19.gotta} x={690} y={40}>{`⏱ ${((o - K19.think) / 1000 + 0.0).toFixed(1)}s of silence`}</Lbl>
    </>}
    <Lbl o={o} at={K19.name + 500} to={K19.laugh + 700} x={40} y={40}>MATTHEW DELLAVEDOVA · CAREER 5.2 PPG</Lbl>
  </>,
  fx: [sfx('jeopardy-think', K19.think + 100, 0.32, K19.gotta - K19.think - 200), ...[0, 1, 2].map((i) => sfx('jorho-pop', K19.think + 600 + i * 700, 0.3)),
    sfx('meme-orch', K19.della, 0.5), sfx('jorho-ting', K19.name + 500, 0.3), sfx('meme-violin', K19.tension, 0.35, 1100)],
};
export const JorhoGoat19 = () => <Jorho s={GOAT19} />;

// ==== v21 (2026-11-03): the 13k "premium gold" style, rebuilt from its retention graph.
// 13k analytics (18 s, 71.9% stayed, 101% avg viewed): steepest drop 0–2 s = the filler opening ("Bring it up, but I
// want to ask you the question before") → cut it, open on the question with the gold question on screen at frame 0;
// flat 9–14 s through the think → kept; second drop 14–18 s after the answer (laugh + tension card, nothing new) →
// the laugh now carries the comment prompt + a LeBron-vs-Della vote, the tension card a like prompt; loop kept.
const GOLDC = '#f5c45e';
const gSerif = (s: CSSProperties): CSSProperties => ({fontFamily: 'Instrument Serif', fontStyle: 'italic', color: GOLDC, textShadow: '0 0 26px rgba(245,196,94,.65)', lineHeight: 1, whiteSpace: 'nowrap', ...s});
const gSans = (s: CSSProperties): CSSProperties => ({fontFamily: 'Inter', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', ...s});
const fadeIn = (o: number, a: number, d = 250) => Math.max(0, Math.min(1, (o - a) / d));
// engagement overlay over the real laugh: comment prompt + a two-way vote (premium gold look)
const Engage = ({o, a, b}: {o: number; a: number; b: number}) => {
  if (o < a || o >= b) return null;
  const p = fadeIn(o, a), q = fadeIn(o, a + 350);
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 430, background: 'linear-gradient(rgba(11,10,9,.88), rgba(11,10,9,0))'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * -20}px)`, ...gSerif({fontSize: 92})}}>who's YOUR goat?</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center', gap: 26, opacity: q, transform: `scale(${0.9 + 0.1 * q})`}}>
      {[['lebron.png', 'LeBron'], ['della.png', 'Della']].map(([f, l], i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 26px 10px 10px', borderRadius: 60,
        background: 'rgba(20,17,13,.92)', border: `3px solid ${GOLDC}`, boxShadow: '0 0 24px rgba(245,196,94,.4)'}}>
        <Img src={staticFile(`img/jorho/${f}`)} style={{width: 74, height: 74, borderRadius: 37, objectFit: 'cover', objectPosition: '50% 15%'}} />
        <span style={gSans({fontSize: 40})}>{l}</span></div>)}
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', opacity: fadeIn(o, a + 700), ...gSans({fontSize: 34, color: 'rgba(255,255,255,.85)', letterSpacing: 2})}}>COMMENT YOUR PICK 👇</div>
  </>;
};
const LikeNudge = ({o, a}: {o: number; a: number}) => (o < a ? null : <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', opacity: fadeIn(o, a), ...gSans({fontSize: 36, color: 'rgba(255,255,255,.88)'})}}>
  ❤️ like if you felt it too<div style={{fontSize: 30, marginTop: 10, color: GOLDC, opacity: fadeIn(o, a + 400)}}>+ follow for more ball knowledge</div></div>);
// frame-0 hook over the real two-shot: the question is already on screen
const Frame0Q = ({o, b}: {o: number; b: number}) => (o >= b ? null : <>
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 420, background: 'linear-gradient(rgba(11,10,9,0), rgba(11,10,9,.85))'}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', ...gSerif({fontSize: 110})}}>who's your NBA goat?</div>
</>);
const mkGoat21 = (tl: TL, K: GoatK, extra: {intro?: number; cta?: [number, number]}) => {
  const fx: Sfx[] = [sfx('jorho-whoosh', K.who + 450, 0.3), ...[0, 1, 2].map((i) => sfx('jorho-pop', K.greatest + i * 200, 0.32)), sfx('jorho-ting', K.greatest + 800, 0.25),
    ...[0, 1, 2, 3, 4].map((i) => sfx('jorho-click', K.think + 1300 + i * 520, 0.22)), sfx('meme-build', K.gotta - 1400, 0.3, 1300), sfx('meme-orch', K.della - 150, 0.5),
    sfx('jorho-pop', K.della + 1600, 0.35), sfx('jorho-click', K.della + 1950, 0.35), sfx('meme-violin', K.tension - 200, 0.35, 1100)];
  return {
    tl, src: 'input.mp4', track: goatTrack as unknown as Track, top: '', wordY: 1170, noIntro: true, wideX: 960, push: true,
    wideXAt: (o: number) => (o < K.nba ? 665 : 960),
    words: wordsFrom(goatWords, tl, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#58EE28', Matthew: '#21F5E6', Dellavedova: '#21F5E6'}),
    capsOff: [[K.think + 150, K.gotta - 60], ...(extra.intro ? [[0, extra.intro] as [number, number]] : []), ...(extra.cta ? [extra.cta] : [])],
    shots: [[0, 'W'], [K.nba, 'M'], [K.greatest, 'L'], [K.think, 'M'], [K.della + 1500, 'W'], [K.tension - 200, 'R']],
    strobes: [K.gotta - STROBE_CUT], tints: [[K.della, GREEN]], swish: [K.della + 1500],
    music: {file: 'joyful-chess-slowed.mp3', from: 40500 - K.della, level: 0.12},
    musicLevel: (o: number) => (extra.intro && o < extra.intro ? 0.06 : extra.cta && o >= extra.cta[0] ? 0.07 : o >= K.think + 100 && o < K.della ? 0.05 : 0.12),
    box: (o: number) => <>
      <GoatPremium o={o} K={K} />
      <Frame0Q o={o} b={K.who + 600} />
      <Engage o={o} a={K.della + 1600} b={K.tension - 200} />
      {o >= K.tension - 200 && <LikeNudge o={o} a={K.tension + 100} />}
    </>,
    fx,
  } as Spec;
};
// ---- A) no voice-over: one continuous take from the question to the end (16.7 s)
const a21 = timeline([[2150, 18810]]);
export const GOAT21A_MS = a21.total;
const KA21: GoatK = {who: a21.out(2280), nba: a21.out(4480), greatest: a21.out(5620), think: a21.out(7350), gotta: a21.out(12780), della: a21.out(13820), laugh: a21.out(15050), tension: a21.out(17740), end: a21.total};
export const JorhoGoat21A = () => <Jorho s={{...mkGoat21(a21, KA21, {}), top: 'This NBA GOAT is better than MJ and LeBron combined'}} />;
// ---- B) ElevenLabs VO cold open over a premium gold card, then the same engaged take (21.3 s)
const VO_IN = 4600;
const voWords = [['We', 0], ['asked', 200], ['an', 480], ['NFL', 640], ['quarterback', 1000], ['for', 1380], ['his', 1680], ['NBA', 1840], ['goat', 2240], ['and', 2660], ['the', 3160], ['room', 3240], ['went', 3440], ['silent', 3640]] as const;
const VO_COL: Record<string, string> = {NFL: '#21F5E6', goat: '#58EE28', silent: '#FFE81F'};
const IntroCard = ({o}: {o: number}) => {
  if (o >= VO_IN) return null;
  const out = 1 - fadeIn(o, VO_IN - 260, 260);
  const pop = 0.85 + 0.15 * fadeIn(o, 560, 220), q = 1, hush = fadeIn(o, 2640, 300);
  return <div style={{position: 'absolute', inset: 0, opacity: out, background: 'radial-gradient(ellipse at 50% 35%, #2a2116 0%, #0b0a09 70%)'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', ...gSans({fontSize: 40, letterSpacing: 6, color: 'rgba(255,255,255,.8)'})}}>WE ASKED AN NFL QB</div>
    <div style={{position: 'absolute', left: 540 - 200, top: 140, width: 400, height: 355, borderRadius: 26, overflow: 'hidden', border: `4px solid ${GOLDC}`,
      boxShadow: `0 0 ${40 + 30 * hush}px rgba(245,196,94,.5)`, opacity: 1, transform: `perspective(900px) rotateY(${(1 - pop) * -60}deg) scale(${(0.8 + 0.2 * pop) * (1 - 0.06 * hush)})`,
      filter: `brightness(${1 - 0.35 * hush})`}}>
      <Img src={staticFile('img/jorho/trevor_goat.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', opacity: q * (1 - hush), transform: `translateY(${(1 - q) * 20}px)`, ...gSerif({fontSize: 112})}}>his NBA goat?</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', opacity: hush, ...gSerif({fontSize: 96, color: '#fff', textShadow: '0 0 22px rgba(255,255,255,.35)'})}}>the room went silent…</div>
  </div>;
};
const b21 = timeline([[2150, 2200, VO_IN - 50], [2200, 18810]]);
export const GOAT21B_MS = b21.total;
const KB21: GoatK = {who: b21.out(2280), nba: b21.out(4480), greatest: b21.out(5620), think: b21.out(7350), gotta: b21.out(12780), della: b21.out(13820), laugh: b21.out(15050), tension: b21.out(17740), end: b21.total};
const g21b = mkGoat21(b21, KB21, {});
export const JorhoGoat21B = () => <Jorho s={{...g21b, top: 'Nobody in the room was ready for this NBA GOAT pick',
  words: [...voWords.map(([t, at]) => ({text: t, at, color: VO_COL[t] ?? '#fff'})), ...g21b.words.filter((w) => w.at >= VO_IN)],
  musicLevel: (o: number) => (o < VO_IN ? 0.05 : g21b.musicLevel!(o)),
  box: (o: number) => <>{g21b.box!(o)}<IntroCard o={o} /></>,
  fx: [sfx('vo-goat-intro-tight', 0, 1.0), sfx('jorho-whoosh', 560, 0.22), sfx('jorho-ting', 1840, 0.18), sfx('jorho-whoosh', VO_IN - 180, 0.3), ...g21b.fx!]}} />;
// ---- v22: IShowSpeed "W Speed edit be like" format on the NBA GOAT clip (no VO). Freeze slam after "Dellavedova, man".
const FRZ = 15250, BEAT22 = 740, BEATS22 = 4;
const s22 = timeline([[2150, FRZ, BEAT22 * BEATS22], [FRZ, 18810]]);
export const GOAT22_MS = s22.total;
const K22 = {nba: s22.out(4480), greatest: s22.out(5620), think: s22.out(7350), gotta: s22.out(12780), della: s22.out(13820), slam: s22.out(FRZ - 1) + 1, after: s22.segOut[1], tension: s22.out(17480)};
const acts22: Act[] = [[0, K22.nba - 80, 'TREVOR GETS THE QUESTION'], [K22.nba, K22.greatest, 'TREVOR STALLS'], [K22.think + 150, K22.think + 2600, 'TREVOR THINKS'],
  [K22.think + 2600, K22.gotta - 60, 'TREVOR THINKS HARDER'], [K22.gotta, K22.slam, 'TREVOR LOCKS IN'], [K22.after + 200, K22.tension - 150, 'THE ROOM LOSES IT'], [K22.tension - 150, s22.total, 'TENSION RISES']];
export const JorhoGoat22 = () => <Jorho s={{
  tl: s22, src: 'input.mp4', track: goatTrack as unknown as Track, top: 'This is what peak ball knowledge looks like', wordY: 1170, wideX: 960, push: true, noIntro: true,
  wideXAt: (o) => (o < K22.nba ? 665 : 960), grade: 'contrast(1.14) saturate(1.35) brightness(1.03)',
  words: wordsFrom(goatWords, s22, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#58EE28', Matthew: '#21F5E6', Dellavedova: '#21F5E6'}),
  capsOff: [[K22.think + 150, K22.gotta - 60], [K22.slam, K22.after]],
  shots: [[0, 'W'], [K22.nba, 'M'], [K22.greatest, 'L'], [K22.think, 'M'], [K22.after, 'W'], [K22.tension - 200, 'R']],
  strobes: [K22.gotta - STROBE_CUT], tints: [], swish: [K22.after],
  music: {file: 'blue-yung-kai.mp3', from: 58270 - K22.slam, level: 0.07},
  musicLevel: (o) => (o >= K22.slam && o < K22.after ? 0.8 : o >= K22.think + 100 && o < K22.gotta ? 0.16 : 0.07),
  box: (o) => <><Vignette /><SpeedActions o={o} acts={acts22} /><SpeedSlam o={o} a={K22.slam} beats={BEATS22} beatMs={BEAT22} text="REAL BALL KNOWLEDGE" emoji="1f410" /></>,
  fx: [...acts22.map(([a, , t]) => sfx('keyboard-typing', a, 0.3, typeMs(t))), sfx('fast-whoosh', K22.slam - 60, 0.4), sfx('keyboard-typing', K22.slam + 200, 0.3, typeMs('REAL BALL KNOWLEDGE') * 2)],
}} />;

// ==== v24 (2026-11-04): v19 (9.7K views, 0:28 avg = 180% → rewatches) improved from its retention graph + made a distinct edit.
// Graph: steepest loss 0–2 s (blurred intro frame, generic top line), gentle 2–9 s, flat 9–13 s (answer), small dip
// 13–15 s (laugh: nothing new). Changes: sharp frame 0 + curiosity-gap top line, a 0.5 s comedic hold on the answer with
// the stat, a second reveal during the laugh (2016 champion: true), mirrored footage, new music/colours/labels/payoff hit.
const g24 = timeline([[2150, 3650], [4380, 5150], [5550, 7350], [7350, 15250, 500], [15250, 18810]]);
export const GOAT24_MS = g24.total; // 16.03 s
const G24 = g24.segOut, go24 = g24.out;
const K24 = {think: G24[3], gotta: go24(12780), della: go24(13820), name: go24(14160), hold: G24[4] - 500, laugh: G24[4] + 0, could: go24(17480), tension: go24(18220)};
const GOAT24: Spec = {
  tl: g24, src: 'input.mp4', track: goatTrack as unknown as Track, top: 'The NBA GOAT debate just got a new answer', wordY: 1170, wideX: 960, push: true, noIntro: true, mirror: true,
  grade: 'contrast(1.1) saturate(1.12) brightness(1.02)',
  wideXAt: (o) => (o < G24[1] ? 665 : 960),
  words: wordsFrom(goatWords, g24, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#FFC83D', Matthew: '#58EE28', Dellavedova: '#58EE28', tension: '#FF5A5A'}),
  capsOff: [[K24.think + 150, K24.gotta - 60]],
  shots: [[0, 'W'], [G24[1], 'M'], [G24[2], 'L'], [K24.think, 'M'], [K24.laugh + 150, 'W'], [K24.could - 100, 'R']],
  strobes: [K24.della - STROBE_CUT], tints: [[K24.della, '#FFC83D'], [K24.tension, RED]], swish: [K24.laugh + 150],
  cut: {file: 'della.png', from: K24.della, to: K24.laugh + 200, x: 640, h: 520},
  music: {file: 'interstellar-piano.mp3', from: 232200 - K24.della, level: 0.12},
  musicLevel: (o) => (o < K24.think - 200 ? 0.09 : o < K24.della ? 0 : 0.18),
  box: (o) => <>
    <Lbl o={o} at={300} to={G24[1]} x={40} y={40}>NFL QB · ASKED HIS NBA GOAT</Lbl>
    {o >= K24.think + 300 && o < K24.gotta && <>
      <Lbl o={o} at={K24.think + 300} to={K24.gotta} x={40} y={40}>EVERYONE ELSE SAYS…</Lbl>
      {[['curry.png', 720, 0], ['kobe.png', 380, 1], ['lebron.png', 40, 2]].map(([f, x, i]) => (
        <Cutout key={f as string} o={o} file={f as string} from={K24.think + 600 + (i as number) * 700} to={K24.gotta - 100} x={x as number} h={300} />))}
      <Lbl o={o} at={K24.think + 1200} to={K24.gotta} x={600} y={130}>{`still thinking… ${((o - K24.think) / 1000).toFixed(1)}s`}</Lbl>
    </>}
    <Lbl o={o} at={K24.name + 300} to={K24.laugh + 450} x={500} y={40}>CAREER: 5.2 PPG</Lbl>
    <Lbl o={o} at={K24.laugh + 450} to={K24.tension} x={330} y={40}>…BUT HE DOES HAVE A 2016 RING 💍</Lbl>
  </>,
  fx: [sfx('jeopardy-think', K24.think + 100, 0.3, K24.gotta - K24.think - 200), ...[0, 1, 2].map((i) => sfx('mg-click', K24.think + 600 + i * 700, 0.35)),
    sfx('mg-boom', K24.della, 0.55), sfx('meme-dundun', K24.hold, 0.4, 900), sfx('jorho-ting', K24.laugh + 450, 0.3), sfx('heartbeat-loud', K24.tension - 100, 0.4, 1000)],
};
export const JorhoGoat24 = () => <Jorho s={GOAT24} />;

// ==== v25 (2026-11-04): redemption clip with the goat19 formula (v24 post-mortem): Jorho intro kept, famous-name label in
// second 1, bold concrete top line, real setup first, plain-words fact label, silent beat before the roast, twist payoff,
// cut-off last line loops into the first. Voices checked (voice_diarize + large-v3): left host carries the explanation.
const t25 = timeline([[0, 6000], [8080, 14300], [24320, 27000], [27000, 27900], [30000, 33950]]);
export const RED25_MS = t25.total; // 19.75 s
const S25 = t25.segOut, o25 = t25.out;
const K25 = {k20: o25(1140), what: o25(1780), d200: o25(2940), d500: o25(4240), bucks: o25(5080), redeem: o25(8840), onTime: o25(12000), react: o25(12940), see: o25(13840),
  dislike: o25(25940), really: o25(27080), most: o25(31640), sale: o25(32460), ever: o25(32780)};
const RED25: Spec = {
  tl: t25, src: 'pod2/u3_redemptions.mp4', track: redeemTrack as unknown as Track, top: 'This card went from $20,000 to $500 in 3 seconds', wordY: 1170, wideX: 640, push: true,
  wideXAt: (o) => ((o >= K25.what && o < K25.bucks) || (o >= S25[3] && o < S25[4]) ? 1140 : 640),
  words: wordsFrom(redeemWords, t25, {'20': '$20,000', '000': '', '200': '$200?', '500': '$500'}, {'$20,000': '#58EE28', '$200?': '#FF5A5A', '$500': '#FF5A5A', redeem: '#21F5E6', dislike: '#FF5A5A', expensive: '#58EE28'}),
  shots: [[0, 'W'], [S25[1], 'L'], [K25.react, 'W'], [S25[2], 'L'], [S25[3], 'W'], [S25[4], 'L'], [K25.ever, 'W']],
  strobes: [K25.sale - STROBE_CUT], tints: [[K25.k20, GREEN], [K25.d500, RED], [K25.dislike, RED], [K25.sale, GREEN]], swish: [S25[1], S25[4]],
  music: {file: 'joyful-chess-slowed.mp3', from: 40500 - K25.most, level: 0.1},
  musicLevel: (o) => (o >= K25.react - 100 && o < S25[2] ? 0 : o >= K25.most ? 0.16 : 0.1),
  box: (o) => <>
    <Lbl o={o} at={350} to={K25.what} x={430} y={40}>TREVOR LAWRENCE · NFL QB</Lbl>
    <Lbl o={o} at={K25.k20} to={S25[1]} x={40} y={40}>{o < K25.d200 ? 'CARD VALUE: $20,000' : o < K25.d500 ? 'CARD VALUE: $200?' : 'CARD VALUE: $500 📉'}</Lbl>
    <Lbl o={o} at={K25.redeem} to={K25.onTime - 100} x={40} y={40}>REDEEM = MAIL IT IN FOR THE SIGNED CARD</Lbl>
    <Lbl o={o} at={K25.onTime} to={S25[2]} x={40} y={40}>⏰ PLAYER SIGNS LATE = CARD COMES LATE</Lbl>
    <Lbl o={o} at={K25.most} to={t25.total} x={40} y={40}>HIS MOST EXPENSIVE SALE EVER 💰</Lbl>
  </>,
  fx: [sfx('cha-ching', K25.k20, 0.35), sfx('meme-shutter', K25.d200 - 120, 0.35), sfx('meme-trombone', K25.d500, 0.45, 1400), sfx('jorho-pop', K25.redeem, 0.3),
    sfx('jorho-pop', K25.onTime, 0.3), sfx('meme-dundun', K25.see - 150, 0.4, 900), sfx('jorho-pop', K25.really, 0.3), sfx('meme-orch', K25.most, 0.45), sfx('cha-ching', K25.sale, 0.4)],
};
export const JorhoRedeem25 = () => <Jorho s={RED25} />;

// ==== v26 (2026-11-04): NBA GOAT, goat19 formula (best channel result) + fixes aimed at its graph dips.
// Kept: Jorho intro, real question first, name label in second 1, Jeopardy think, silent beat before the answer, stat, loop.
// New: slot-machine reel through the think (decelerating = anticipation), reverse-whoosh into the answer, impact burst +
// layered orch/808 on "Dellavedova", 0.5 s comedic hold with the stat, second reveal during the laugh (2016 champion, true).
const g26 = timeline([[2150, 3650], [4380, 5150], [5550, 7350], [7350, 15250, 500], [15250, 18810]]);
export const GOAT26_MS = g26.total; // 16.03 s
const G26 = g26.segOut, go26 = g26.out;
const K26 = {think: G26[3], gotta: go26(12780), della: go26(13820), name: go26(14160), laugh: G26[4], could: go26(17480), tension: go26(18220)};
// reel: card changes slow down from 90 ms to ~650 ms, last stop is the "?" card just before "Gotta be"
const REEL = (() => { const out: number[] = []; let t = K26.think + 700, d = 90; while (t < K26.gotta - 500) { out.push(t); t += d; d *= 1.17; } return out; })();
const REEL_IMG = ['lebron.png', 'kobe.png', 'curry.png'];
const Reel = ({o}: {o: number}) => {
  if (o < REEL[0] || o >= K26.gotta) return null;
  let i = 0; REEL.forEach((t, j) => { if (o >= t) i = j; });
  const last = i === REEL.length - 1;
  const k = Math.min(1, (o - REEL[i]) / 70);
  return <div style={{position: 'absolute', left: 40, top: 610, width: 250, height: 320, borderRadius: 20, overflow: 'hidden', background: '#111',
    border: `6px solid ${last ? '#F9FC35' : '#fff'}`, boxShadow: last ? '0 0 34px rgba(249,252,53,.7)' : '0 10px 30px rgba(0,0,0,.5)', transform: `translateY(${(1 - k) * -14}px)`}}>
    {last ? <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 200, color: '#F9FC35'}}>?</div>
      : <Img src={staticFile(`img/jorho/${REEL_IMG[i % 3]}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%'}} />}
  </div>;
};
// radial speed-line burst behind the answer cutout
const Burst = ({o, at, x, y}: {o: number; at: number; x: number; y: number}) => {
  const t = (o - at) / 600;
  if (t < 0 || t > 1) return null;
  return <svg width={1080} height={1077} style={{position: 'absolute', inset: 0, opacity: 1 - t}}>
    {Array.from({length: 28}, (_, i) => { const a = (i / 28) * Math.PI * 2, r0 = 90 + 140 * t, r1 = r0 + 150;
      return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={i % 2 ? '#F9FC35' : '#fff'} strokeWidth={i % 2 ? 10 : 6} strokeLinecap="round" />; })}
  </svg>;
};
const GOAT26: Spec = {
  tl: g26, src: 'input.mp4', track: goatTrack as unknown as Track, top: 'This NBA GOAT pick made the whole room lose it', wordY: 1170, wideX: 960, push: true,
  wideXAt: (o) => (o < G26[1] ? 665 : 960),
  words: wordsFrom(goatWords, g26, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#58EE28', Matthew: '#21F5E6', Dellavedova: '#21F5E6', tension: '#F9FC35'}),
  capsOff: [[K26.think + 150, K26.gotta - 60]],
  shots: [[0, 'W'], [G26[1], 'M'], [G26[2], 'L'], [K26.think, 'M'], [K26.laugh + 150, 'W'], [K26.could - 100, 'R']],
  strobes: [K26.della - STROBE_CUT], tints: [[K26.della, GREEN], [K26.tension, RED]], swish: [K26.laugh + 150],
  cut: {file: 'della.png', from: K26.della, to: K26.laugh + 200, x: 600, h: 560},
  music: {file: 'du-bist-full.mp3', from: 42500 - K26.della, level: 0.12},
  musicLevel: (o) => (o < K26.think - 200 ? 0.1 : o < K26.della ? 0 : 0.14),
  box: (o) => <>
    <Burst o={o} at={K26.della} x={880} y={860} />
    <Lbl o={o} at={350} to={G26[1]} x={430} y={40}>TREVOR LAWRENCE · NFL QB</Lbl>
    {o >= K26.think + 300 && o < K26.gotta && <>
      <Lbl o={o} at={K26.think + 300} to={K26.gotta} x={40} y={40}>THE USUAL ANSWERS…</Lbl>
      <Lbl o={o} at={K26.think + 300} to={K26.gotta} x={690} y={40}>{`⏱ ${((o - K26.think) / 1000).toFixed(1)}s of silence`}</Lbl>
    </>}
    <Reel o={o} />
    <Lbl o={o} at={K26.name + 300} to={K26.laugh + 450} x={40} y={40}>MATTHEW DELLAVEDOVA · CAREER 5.2 PPG</Lbl>
    <Lbl o={o} at={K26.laugh + 450} to={K26.tension} x={40} y={40}>…BUT HE IS A 2016 NBA CHAMPION 💍</Lbl>
  </>,
  fx: [sfx('jeopardy-think', K26.think + 100, 0.28, K26.gotta - K26.think - 200), ...REEL.map((t) => sfx('mg-click', t, 0.14)), sfx('jorho-ting', K26.gotta - 520, 0.3),
    sfx('rev-whoosh', K26.della - 1220, 0.4), sfx('meme-orch', K26.della, 0.5), sfx('808-boom', K26.della, 0.4), sfx('meme-dundun', G26[4] - 500, 0.35, 800),
    sfx('jorho-ting', K26.laugh + 450, 0.3), sfx('meme-violin', K26.tension, 0.35, 1100)],
};
export const JorhoGoat26 = () => <Jorho s={GOAT26} />;

// ==== v28 (2026-11-04): Jorho style (kept: intro, black bars, top line, captions, strobe/tint, cutout, stat label, loop) with
// new details: freeze BEFORE the name (suspense), an AI-parody insert during the think (MJ + LeBron "waiting"), and an
// absurd ultrasound gag during the laugh ("IT'S A… DELLAVEDOVA"). User-supplied AI images of real players: only the
// obviously-impossible / harmless ones are used (no kissing ones), each tagged "AI PARODY".
const g28 = timeline([[2150, 3650], [4380, 5150], [5550, 7350], [7350, 13800, 600], [13800, 18810]]);
export const GOAT28_MS = g28.total; // 16.13 s
const G28 = g28.segOut, go28 = g28.out;
const K28 = {think: G28[3], gotta: go28(12780), freeze: G28[4] - 600, della: go28(13820), name: go28(14160), laugh: go28(15050), could: go28(17480), tension: go28(18220)};
const AI1 = [K28.think + 1500, K28.think + 3250] as const, LB = [K28.laugh, K28.laugh + 900] as const, ST = [LB[1], LB[1] + 850] as const;
const AiShot = ({o, a, b, file, fit, pos = '50% 50%'}: {o: number; a: number; b: number; file: string; fit: 'cover' | 'contain'; pos?: string}) => {
  if (o < a || o >= b) return null;
  const t = o - a, z = 1 + 0.07 * (t / (b - a)), hit = Math.max(0, 1 - t / 130);
  const src = staticFile(`img/ai/${file}`);
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1077, overflow: 'hidden', background: '#000'}}>
    {fit === 'contain' && <Img src={src} style={{position: 'absolute', inset: -40, width: 1160, height: 1157, objectFit: 'cover', filter: 'blur(28px) brightness(.55)'}} />}
    <Img src={src} style={{position: 'absolute', inset: 0, width: 1080, height: 1077, objectFit: fit, objectPosition: pos, transform: `scale(${z * (1 + 0.12 * hit)})`}} />
    {hit > 0 && <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: 0.7 * hit}} />}
    <div style={{position: 'absolute', right: 18, bottom: 18, background: 'rgba(0,0,0,.65)', color: '#fff', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 24, padding: '5px 12px', borderRadius: 8, letterSpacing: 1}}>AI PARODY</div>
  </div>;
};
const Reveal = ({o, a, b}: {o: number; a: number; b: number}) => {
  if (o < a || o >= b) return null;
  const t = o - a, s = t < 120 ? 1.4 - 0.4 * (t / 120) : 1, second = t > 280;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', transform: `scale(${s})`, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 64, color: '#fff',
    WebkitTextStroke: '10px #111', paintOrder: 'stroke fill', lineHeight: 1.1}}>
    IT'S A…{second && <><br /><span style={{color: '#5EC8FF', fontSize: 84}}>DELLAVEDOVA 💀</span></>}
  </div>;
};
const GOAT28: Spec = {
  tl: g28, src: 'input.mp4', track: goatTrack as unknown as Track, top: 'This NBA GOAT pick got LeBron pregnant', wordY: 1170, wideX: 960, push: true,
  wideXAt: (o) => (o < G28[1] ? 665 : 960),
  words: wordsFrom(goatWords, g28, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#FF9F1C', Matthew: '#5EC8FF', Dellavedova: '#5EC8FF', tension: '#FF4D6D'}),
  capsOff: [[K28.think + 150, K28.gotta - 60], [LB[0] + 200, K28.could - 40]],
  shots: [[0, 'W'], [G28[1], 'M'], [G28[2], 'L'], [K28.think, 'M'], [ST[1], 'W'], [K28.could - 100, 'R']],
  strobes: [K28.della - STROBE_CUT], tints: [[K28.della, GREEN], [K28.tension, RED]], swish: [ST[1]],
  cut: {file: 'della.png', from: K28.della, to: K28.laugh, x: 600, h: 560},
  music: {file: 'Sneaky_Snitch.mp3', from: 0, level: 0.12},
  musicLevel: (o) => (o < K28.think - 200 ? 0.12 : 0),
  box: (o) => <>
    <Lbl o={o} at={350} to={G28[1]} x={430} y={40}>TREVOR LAWRENCE · NFL QB</Lbl>
    <Lbl o={o} at={K28.think + 300} to={K28.gotta} x={690} y={40}>{`⏱ ${((o - K28.think) / 1000).toFixed(1)}s`}</Lbl>
    <AiShot o={o} a={AI1[0]} b={AI1[1]} file="mj_lebron_court.jpg" fit="contain" />
    <Lbl o={o} at={AI1[0] + 100} to={AI1[1]} x={40} y={40}>MJ & LEBRON WAITING ON HIS ANSWER…</Lbl>
    <Lbl o={o} at={K28.name + 300} to={K28.laugh} x={40} y={40}>MATTHEW DELLAVEDOVA · CAREER 5.2 PPG</Lbl>
    <AiShot o={o} a={LB[0]} b={LB[1]} file="lebron_ultrasound.jpg" fit="cover" pos="59% 50%" />
    <Lbl o={o} at={LB[0] + 60} to={LB[1]} x={40} y={40}>MEANWHILE: LEBRON'S ULTRASOUND</Lbl>
    <Reveal o={o} a={LB[0] + 380} b={LB[1]} />
    <AiShot o={o} a={ST[0]} b={ST[1]} file="steph_ultrasound.jpg" fit="cover" pos="40% 50%" />
    <Lbl o={o} at={ST[0] + 60} to={ST[1]} x={40} y={40}>STEPH TOO?? 😭</Lbl>
  </>,
  fx: [sfx('mg-click', G28[1], 0.3), ...Array.from({length: 5}, (_, i) => sfx('clock-tick', K28.think + 1000 * (i + 1), 0.35)),
    sfx('camera-shutter', AI1[0], 0.35), sfx('mg-swoosh', AI1[1] - 60, 0.25), sfx('meme-build2', K28.freeze, 0.35, 600),
    sfx('meme-impact', K28.della, 0.5), sfx('808-boom', K28.della, 0.4), sfx('jorho-ting', K28.name + 300, 0.3),
    sfx('record-scratch', LB[0] - 60, 0.4), sfx('montagem-drop', LB[0], 0.14, ST[1] - LB[0] + 300), sfx('scan-beep', LB[0] + 120, 0.3),
    sfx('meme-tada', LB[0] + 660, 0.35), sfx('huh-cat', ST[0] + 40, 0.4), sfx('meme-violin', K28.tension, 0.35, 1100)],
};
export const JorhoGoat28 = () => <Jorho s={GOAT28} />;

// ==== v30 (2026-11-08): "best hook" — goat19/v26 formula kept whole (intro motion at frame 0, real question first, name
// label in second 1, think + reel, silent beat, answer slam, stat, loop). Only the top line changes (one variable), fusing
// the two best-performing hooks on this channel: the 13k "Premium" bold claim (71.9% stayed, best) + goat19's subject/
// reaction framing (9.7K, 180% avg viewed). Scored in vault/02 Style Guide/Jorho style.md (v30 hook lab).
const GOAT30: Spec = {...GOAT26, top: 'His NBA GOAT is better than MJ and LeBron combined'};
export const GOAT30_MS = GOAT26_MS;
export const JorhoGoat30 = () => <Jorho s={GOAT30} />;

// v31 (2026-11-09): low-cost variant of v26 — new top line, music, keyword colours, tints, framing.
const GOAT31: Spec = {...GOAT26, top: 'He picked this guy over MJ and LeBron 💀', wideXAt: (o) => (o < G26[1] ? 700 : 900),
  words: wordsFrom(goatWords, g26, {'Delvedova,': 'Dellavedova', Delvedova: 'Dellavedova', times: 'time'}, {goat: '#FF9F1C', Matthew: '#FF4DCB', Dellavedova: '#FF4DCB', tension: '#5EC8FF'}),
  tints: [[K26.della, '#FF4DCB'], [K26.tension, '#2b6cff']], music: {file: 'Sneaky_Snitch.mp3', from: 0, level: 0.12}};
export const GOAT31_MS = GOAT26_MS;
export const JorhoGoat31 = () => <Jorho s={GOAT31} />;
