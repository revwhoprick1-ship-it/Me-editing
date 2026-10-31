// The first two Jorho edits. Same recipe for both (see kit.tsx); what differs is the joke, who gets punched in on,
// where the flashes land and whose photo pops up.
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import antWords from '../plans/data/t1_tiger_auto_pen.words.json';
import antTrack from '../plans/data/t1_tiger_auto_pen.seats.json';
import joshWords from '../plans/data/t5_ex_teammate.words.json';
import joshTrack from '../plans/data/t5_ex_teammate.seats.json';
import {Cam, FPS, Music, SfxTrack, SpeechTrack, ease, pop, sfx, timeline, type CamCfg, type Seat, type Track} from '../e3/kit';
import {BOX_H, Cutout, Frame, JORHO, OneWord, exposure, wordsFrom} from './kit';

const GRADE = 'contrast(1.08) saturate(1.06)';
const inAny = (s: number, spans: [number, number][]) => spans.some(([a, b]) => s >= a && s < b);

// ---- t1 · "his auto looks like an ant" -------------------------------------------------------------------------
const antTl = timeline([[9300, 11850], [12200, 16600], [16900, 20300], [20450, 22000], [22400, 27500]]);
export const ANT_MS = antTl.total;
const A = {anthony: antTl.out(12800), haventEnd: antTl.out(14980), ant: antTl.out(16160), respect: antTl.out(19940), pen: antTl.out(27100)};
const antPunch = {M: [[14680, 14980], [21280, 22000], [26700, 27500]] as [number, number][], R: [[14980, 16600]] as [number, number][]};
const antCam: CamCfg = {
  src: 'pod/t1_tiger_auto_pen.mp4', tl: antTl, track: antTrack as unknown as Track, grade: GRADE, box: [1080, BOX_H], baseH: 640, faceY: 0.42,
  who: (s): Seat => (inAny(s, antPunch.M) ? 'M' : inAny(s, antPunch.R) ? 'R' : 'W'), wideX: 1285,
  zoom: (o) => 1 + 0.035 * ((o % 6000) / 6000),
};
const ANT_WORDS = wordsFrom(antWords, antTl, {goaded: 'goated', 'Richardson\'s': 'Richardson\'s'},
  {Anthony: JORHO.cyan, "Richardson's": JORHO.cyan, ant: JORHO.green, respect: JORHO.yellow, goated: JORHO.green, pen: JORHO.yellow});

export const JorhoAnt = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const flash = exposure([A.ant, A.respect, A.pen], o);
  const antP = o >= A.ant && o < A.ant + 440 ? pop(o, A.ant, 9, 280) * (1 - ease(o, A.ant + 330, 110)) : 0;
  return <Frame top="Imagine your autograph looking like an ant"
    over={<>
      <OneWord o={o} words={ANT_WORDS} />
      <SpeechTrack src="pod/t1_tiger_auto_pen.mp4" tl={antTl} />
      <Music file="du-bist-full.mp3" songFrom={21000} level={(t) => 0.075 * Math.min(1, t / 300, (antTl.total - t) / 400)} />
      <SfxTrack list={[
        sfx('mg-swoosh', A.anthony, 0.3), sfx('mg-click', A.anthony + 60, 0.25),
        sfx('fast-whoosh', antTl.out(14680), 0.22), sfx('fast-whoosh', antTl.out(14980), 0.22),
        sfx('camera-shutter', A.ant, 0.3), sfx('mg-click', A.ant, 0.2),
        sfx('camera-shutter', A.respect, 0.28), sfx('spongebob-boowomp', A.respect + 250, 0.22),
        sfx('fast-whoosh', antTl.out(21280), 0.2), sfx('fast-whoosh', antTl.out(26700), 0.22), sfx('camera-shutter', A.pen, 0.3), sfx('mg-shimmer', A.pen, 0.2),
      ]} />
    </>}>
    <AbsoluteFill style={{filter: flash || undefined}}>
      <Cam c={antCam} o={o} />
    </AbsoluteFill>
    <Cutout o={o} file="richardson.png" from={A.anthony} to={A.haventEnd - 380} x={430} h={700} />
    {antP > 0 && <div style={{position: 'absolute', left: 560, top: 150, transform: `scale(${antP}) rotate(${-8 + Math.sin(o / 120) * 6}deg)`,
      filter: 'drop-shadow(0 0 3px #FF8A1E) drop-shadow(0 0 14px rgba(255,138,30,0.85))'}}>
      <Img src={staticFile('emoji-ios/1f41c.png')} style={{width: 230, height: 230}} />
    </div>}
  </Frame>;
};

// ---- t5 · "that's not rookie Josh Allen… that's the real Josh Hines-Allen" -----------------------------------------------
const joshTl = timeline([[1600, 4450], [11500, 13150], [14050, 14600], [15050, 16650], [17100, 18950], [19100, 25750]]);
export const JOSH_MS = joshTl.total;
const J = {josh: joshTl.out(12580), notRookie: joshTl.out(19380), notJosh: joshTl.out(19960), but: joshTl.out(21240), real: joshTl.out(22040),
  hines: joshTl.out(22360), name: joshTl.out(25180)};
const joshPunch = {M: [[17100, 17700], [19100, 21100]] as [number, number][], L: [] as [number, number][]};
const joshCam: CamCfg = {
  src: 'pod/t5_ex_teammate.mp4', tl: joshTl, track: joshTrack as unknown as Track, grade: GRADE, box: [1080, BOX_H], baseH: 660, faceY: 0.4,
  who: (s): Seat => (inAny(s, joshPunch.M) ? 'M' : inAny(s, joshPunch.L) ? 'L' : 'W'),
  wideX: (s) => (s < 3600 || (s >= 11500 && s < 17000) || s >= 21000 ? 860 : 1010),
  zoom: (o) => 1 + 0.035 * ((o % 6000) / 6000),
};
const JOSH_WORDS = wordsFrom(joshWords, joshTl, {Heinz: 'Hines'},
  {Josh: JORHO.cyan, Allen: JORHO.cyan, gold: JORHO.yellow, fire: JORHO.green, real: JORHO.green, Hines: JORHO.cyan, name: JORHO.yellow});

const BigX = ({o, at}: {o: number; at: number}) => {
  if (o < at) return null;
  const p = pop(o, at, 10, 300);
  return <svg width={420} height={420} viewBox="-60 -60 120 120" style={{position: 'absolute', left: 600, top: 300, transform: `scale(${p})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))'}}>
    <path d="M-42,-42 L42,42 M42,-42 L-42,42" stroke="#000" strokeWidth={26} strokeLinecap="round" />
    <path d="M-42,-42 L42,42 M42,-42 L-42,42" stroke="#FF2A2A" strokeWidth={16} strokeLinecap="round" />
  </svg>;
};

export const JorhoJosh = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const flash = exposure([J.real, J.name - 150], o);
  return <Frame top="Not the Josh Allen you were thinking of"
    over={<>
      <OneWord o={o} words={JOSH_WORDS} />
      <SpeechTrack src="pod/t5_ex_teammate.mp4" tl={joshTl} />
      <Music file="du-bist-full.mp3" songFrom={58000} level={(t) => 0.075 * Math.min(1, t / 300, (joshTl.total - t) / 400)} />
      <SfxTrack list={[
        sfx('mg-swoosh', J.josh, 0.3), sfx('mg-click', J.josh + 60, 0.25),
        sfx('fast-whoosh', joshTl.out(17100), 0.2), sfx('fast-whoosh', joshTl.out(19100), 0.22),
        sfx('mg-swoosh', J.notJosh, 0.25), sfx('error', J.notJosh + 220, 0.22),
        sfx('camera-shutter', J.real, 0.3), sfx('mg-swoosh', J.hines, 0.3), sfx('mg-shimmer', J.hines + 100, 0.2),
        sfx('camera-shutter', J.name - 150, 0.28),
      ]} />
    </>}>
    <AbsoluteFill style={{filter: flash || undefined}}>
      <Cam c={joshCam} o={o} />
    </AbsoluteFill>
    <Cutout o={o} file="josh_allen.png" from={J.josh} to={joshTl.out(15050)} x={520} h={760} />
    <Cutout o={o} file="josh_allen.png" from={J.notJosh} to={J.but} x={600} h={640} />
    {o >= J.notJosh && o < J.but + 160 && <BigX o={o} at={J.notJosh + 220} />}
    <Cutout o={o} file="hines_allen.png" from={J.hines} to={joshTl.out(24300)} x={360} h={720} />
  </Frame>;
};
