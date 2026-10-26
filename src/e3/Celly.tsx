// Edit3 · u2 "Celly": Trevor isn't a celebration guy, so the boys pitch him one: point and go "10, 10, 10" like a
// gem mint grade. Look: stadium night: LED dot-matrix type, a CELLY CAM jumbotron over the crowd, a celly meter that
// goes 0 → 10, grading-scale graphic, confetti. Mood funny → Du bist gut genug (full, 83.8 s drop on the first "10").
import type {CSSProperties} from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import track from '../plans/data/u2_psa10_celly.seats.json';
import {
  Cam, Captions, Emoji, FPS, Grain, H, Music, SfxTrack, SpeechTrack, Vignette, W, clamp, ease, f, flashAt, land,
  mattesFor, pop, punchAt, sfx, shakeAt, timeline, whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'pod2/u2_psa10_celly.mp4';
const tl = timeline([[2020, 6080], [7500, 9080], [12940, 14920], [19700, 29320], [29980, 33100, 700]]);
export const CELLY_MS = tl.total;
const S = tl.segOut; // 0 4060 5640 7620 17240
const T = {celly: 700, guy: 1040, no: 1580, doYou: 1940, gave: 2580, now: 3480, throwUp: 4220, maybe: 5040, choreo: 6420, notGood: 7200,
  collectors: 7920, cards: 9660, psa: 10580, ten: 11040, best: 12480, point: 14260, t1: 15500, t2: 15760, t3: 15920, easy: 16540,
  likeThat: 17260, iLike: 18000, yo: 19180};
const AMBER = '#FFB300';
const LED_RED = '#FF3D2E';
const BUNGEE = {fontFamily: 'Bungee', letterSpacing: '0.01em'} as const;
const LED = {fontFamily: 'VT323'} as const;
const shadow = '0 8px 30px rgba(0,0,0,0.65)';
const dots: CSSProperties = {WebkitMaskImage: 'radial-gradient(circle, #000 68%, transparent 74%)', WebkitMaskSize: '8px 8px'};

const who = (s: number) => {
  if (s < 3550) return 'L' as const;
  if (s < 3950) return 'M' as const;
  if (s < 8400) return 'L' as const;
  if (s < 19000) return 'M' as const;
  if (s < 30700) return 'L' as const;
  if (s < 31800) return 'M' as const;
  return 'L' as const;
};
const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who, mattes: mattesFor('u2'),
  grade: 'contrast(1.15) saturate(1.15) brightness(0.92)',
  zoom: (o) => punchAt([[T.no, T.doYou, 1.18], [T.notGood, S[3], 1.12], [T.t1, T.easy, 1.08], [T.yo, tl.total, 1.12]], o) * (1 + 0.04 * ((o % 4000) / 4000)),
};

// LED text: glowing dots
const LedText = ({t, size, color = AMBER, style}: {t: string; size: number; color?: string; style?: CSSProperties}) => (
  <div style={{...LED, fontSize: size, lineHeight: 0.85, color, textShadow: `0 0 18px ${color}, 0 0 40px ${color}88`, ...style}}>
    <span style={{...dots, display: 'inline-block'}}>{t}</span></div>
);
// celly meter 0..10
const Meter = ({v, x, y, s = 1}: {v: number; x: number; y: number; s?: number}) => {
  const a = -120 + (v / 10) * 240;
  return <div style={{position: 'absolute', left: x, top: y, width: 360, height: 230, transform: `scale(${s})`, transformOrigin: '0 0'}}>
    <svg width={360} height={230} viewBox="-180 -190 360 230">
      <path d="M-150,0 A150,150 0 1 1 150,0" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={26} strokeLinecap="round" />
      <path d="M-150,0 A150,150 0 1 1 150,0" fill="none" stroke={v > 5 ? '#3BFF8A' : LED_RED} strokeWidth={26} strokeLinecap="round"
        strokeDasharray={`${(v / 10) * 630} 999`} style={{filter: `drop-shadow(0 0 10px ${v > 5 ? '#3BFF8A' : LED_RED})`}} />
      <line x1={0} y1={0} x2={130 * Math.sin((a * Math.PI) / 180)} y2={-130 * Math.cos((a * Math.PI) / 180)} stroke="white" strokeWidth={9} strokeLinecap="round" />
      <circle r={16} fill="white" />
    </svg>
    <div style={{position: 'absolute', top: 150, left: -40, width: 440, textAlign: 'center', ...BUNGEE, fontSize: 28, color: 'white', textShadow: shadow, whiteSpace: 'nowrap'}}>CELLY METER · {Math.round(v)}/10</div>
  </div>;
};

// ---- hook ------------------------------------------------------------------------------------------------------
const HookBehind = ({o}: {o: number}) => {
  if (o >= T.no) return null;
  return <div style={{position: 'absolute', top: 200, width: W, textAlign: 'center'}}>
    <LedText t="NOT A" size={150} color="white" style={land(o, 280, 'up')} />
    <LedText t="CELLY GUY" size={250} style={land(o, T.celly, 'slam')} />
  </div>;
};
const No = ({o}: {o: number}) => {
  if (o < T.no || o >= T.doYou) return null;
  return <>
    <div style={{position: 'absolute', top: 210, width: W, textAlign: 'center', ...BUNGEE, fontSize: 300, color: LED_RED, textShadow: `0 0 40px ${LED_RED}`, ...land(o, T.no, 'slam')}}>NO.</div>
    <Meter v={0} x={290} y={1120} s={1.4} />
  </>;
};

// ---- "if we gave you a celly right now": CELLY CAM on the jumbotron -----------------------------------------------------
const Jumbotron = ({o}: {o: number}) => {
  if (o < T.doYou || o >= S[2]) return null;
  const inP = pop(o, T.doYou, 15, 140);
  const segs = [0, 1];
  return <AbsoluteFill style={{background: '#02040a'}}>
    <Img src={staticFile('img/e2/stadium.jpg')} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', filter: 'brightness(0.55) saturate(1.1) blur(1px)',
      transform: `scale(${1.25 - (o - T.doYou) / 30000})`}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,20,0.2), rgba(0,0,0,0.75))'}} />
    {[...Array(14)].map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 83) % W, top: 1300 + ((i * 47) % 400), width: 6, height: 6, borderRadius: 3,
      background: 'white', opacity: Math.max(0, Math.sin(o / 90 + i * 1.7)), boxShadow: '0 0 14px white'}} />)}
    <div style={{position: 'absolute', left: 40, top: 300, width: 1000, height: 640, transform: `translateY(${(1 - inP) * -900}px)`, borderRadius: 18, background: '#0b0b0b',
      border: '14px solid #1c1c22', boxShadow: '0 40px 90px rgba(0,0,0,0.8), 0 0 60px rgba(255,179,0,0.15)'}}>
      <div style={{position: 'absolute', left: 16, top: 16, right: 16, bottom: 90, overflow: 'hidden', borderRadius: 6}}>
        {segs.map((i) => <Sequence key={i} from={f(tl.segOut[i])} durationInFrames={f(tl.segOut[i] + tl.segs[i][1] - tl.segs[i][0]) - f(tl.segOut[i])} layout="none">
          <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(tl.segs[i][0])} style={{position: 'absolute', left: -60, top: -40, width: 1060, height: 596,
            filter: 'contrast(1.2) saturate(1.2)'}} />
        </Sequence>)}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 5px)'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center'}}><LedText t="★ CELLY CAM ★" size={74} color={LED_RED} /></div>
    </div>
    <div style={{position: 'absolute', top: 1030, width: W, textAlign: 'center'}}>
      <LedText t="ONE TOUCHDOWN…" size={96} color="white" style={land(o, T.gave, 'up')} />
      <LedText t="THROW IT UP?" size={150} style={land(o, T.throwUp, 'slam')} />
      <div style={{...BUNGEE, fontSize: 90, color: '#3BFF8A', textShadow: shadow, marginTop: 10, ...land(o, T.maybe, 'zoom')}}>"MAYBE."</div>
    </div>
  </AbsoluteFill>;
};

// ---- "I can't be choreographed. I'm not good." --------------------------------------------------------------------
const Choreo = ({o}: {o: number}) => {
  if (o < S[2] || o >= S[3]) return null;
  const xP = ease(o, T.notGood, 250);
  return <>
    <div style={{position: 'absolute', top: 190, width: W, textAlign: 'center'}}>
      {'CHOREOGRAPHED'.split('').map((c, i) => <span key={i} style={{display: 'inline-block', ...BUNGEE, fontSize: 100, color: 'white', textShadow: shadow,
        transform: `translateY(${Math.sin(o / 90 + i) * 14}px) rotate(${Math.sin(o / 120 + i) * 8}deg)`, ...(o < T.choreo - 200 + i * 25 ? {opacity: 0} : {})}}>{c}</span>)}
    </div>
    <svg width={W} height={500} style={{position: 'absolute', left: 0, top: 1060}}>
      {[[300, 120, -20], [430, 220, 15], [580, 110, -10], [700, 230, 20], [820, 140, -15]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`} opacity={ease(o, S[2] + 200 + i * 160, 120)}>
          <ellipse rx={30} ry={56} fill="rgba(255,255,255,0.85)" /><circle cy={-74} r={16} fill="rgba(255,255,255,0.85)" />
          <text x={42} y={10} fontFamily="Bungee" fontSize={34} fill={AMBER}>{i + 1}</text></g>))}
      {xP > 0 && <g stroke={LED_RED} strokeWidth={22} strokeLinecap="round"><line x1={220} y1={40} x2={220 + 640 * xP} y2={40 + 330 * xP} />
        <line x1={860} y1={40} x2={860 - 640 * xP} y2={40 + 330 * xP} /></g>}
    </svg>
    <div style={{position: 'absolute', top: 1420, width: W, textAlign: 'center', ...BUNGEE, fontSize: 80, color: LED_RED, textShadow: shadow, ...land(o, T.notGood, 'slam')}}>"I'M NOT GOOD."</div>
    <Emoji code="1f62c" size={140} style={{left: 890, top: 1380, transform: `scale(${pop(o, T.notGood + 100, 9, 220)})`}} />
  </>;
};

// ---- the pitch: gem mint 10 ---------------------------------------------------------------------------------------
const Grade = ({o}: {o: number}) => {
  if (o < S[3] || o >= 13420) return null;
  const lab = pop(o, T.psa - 200, 14, 140);
  const sc = ease(o, T.best - 300, 600);
  return <>
    <div style={{position: 'absolute', top: 180, width: W, textAlign: 'center'}}>
      <LedText t="WE'RE COLLECTORS" size={110} color="white" style={land(o, T.collectors - 200, 'up')} />
    </div>
    <div style={{position: 'absolute', left: 120, top: 1000, width: 840, transform: `translateY(${(1 - lab) * 900}px) rotate(-2deg)`, borderRadius: 14, background: 'linear-gradient(180deg,#fdfdfd,#d8d8d8)',
      padding: '20px 30px', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div><div style={{...BUNGEE, fontSize: 44, color: '#c8102e'}}>GEM MINT</div><div style={{fontFamily: 'Space Mono', fontWeight: 700, fontSize: 26, color: '#333'}}>THE BEST GRADE YOU CAN GET</div></div>
      <div style={{...BUNGEE, fontSize: 120, color: '#111', lineHeight: 1}}>10</div>
    </div>
    {sc > 0 && <div style={{position: 'absolute', left: 90, top: 1270, width: 900, display: 'flex', gap: 8, alignItems: 'flex-end'}}>
      {Array.from({length: 10}).map((_, i) => <div key={i} style={{flex: 1, height: 30 + i * 13 * Math.min(1, sc * 10 - i), borderRadius: 6,
        background: i === 9 ? AMBER : 'rgba(255,255,255,0.35)', boxShadow: i === 9 ? `0 0 26px ${AMBER}` : undefined, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        ...BUNGEE, fontSize: 30, color: i === 9 ? '#111' : 'white'}}>{i + 1}</div>)}
    </div>}
  </>;
};
const TensBehind = ({o}: {o: number}) => {
  if (o < 13420 || o >= S[4]) return null;
  const tens = [T.t1, T.t2, T.t3];
  return <>
    <div style={{position: 'absolute', top: 50, width: W, textAlign: 'center'}}>
      <LedText t="YOU POINT…" size={110} color="white" style={land(o, T.point, 'left')} />
    </div>
    <div style={{position: 'absolute', top: 150, width: W, display: 'flex', justifyContent: 'center', gap: 20}}>
      {tens.map((at, i) => <div key={i} style={land(o, at, 'slam', 120)}><LedText t="10" size={280} color={i === 2 ? AMBER : 'white'} /></div>)}
    </div>
  </>;
};
const Rings = ({o}: {o: number}) => {
  if (o < T.t1 || o >= S[4]) return null;
  return <>{[T.t1, T.t2, T.t3].map((at, i) => {
    const p = ease(o, at, 600);
    return o >= at && <div key={i} style={{position: 'absolute', left: W / 2 - 600 * p, top: 1000 - 600 * p, width: 1200 * p, height: 1200 * p, borderRadius: '50%',
      border: `${10 * (1 - p) + 2}px solid ${AMBER}`, opacity: 1 - p}} />;
  })}
    <div style={{position: 'absolute', top: 1380, width: W, textAlign: 'center', ...BUNGEE, fontSize: 84, color: '#3BFF8A', textShadow: shadow, ...land(o, T.easy, 'zoom')}}>IT'S EASY.</div>
  </>;
};

// ---- "All right, I like that." "Yo!" ---------------------------------------------------------------------------------
const Unlocked = ({o}: {o: number}) => {
  if (o < S[4]) return null;
  const v = interpolate(o, [T.iLike, T.iLike + 600], [0, 10], clamp);
  return <>
    <Meter v={v} x={180} y={1000} s={2} />
    {o >= T.yo && <div style={{position: 'absolute', top: 200, width: W, textAlign: 'center'}}>
      <LedText t="NEW CELLY" size={130} color="white" style={land(o, T.yo, 'up')} />
      <LedText t="UNLOCKED" size={170} color="#3BFF8A" style={land(o, T.yo + 150, 'slam')} />
    </div>}
    {o >= T.yo && Array.from({length: 46}).map((_, i) => {
      const t = (o - T.yo) / 1000;
      const x = (i * 97) % W + Math.sin(t * 3 + i) * 40;
      const y = -60 + t * (500 + (i % 7) * 90);
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 18, height: 30, background: ['#FFB300', '#3BFF8A', '#FF3D2E', '#4FC3F7', '#fff'][i % 5],
        transform: `rotate(${t * 400 + i * 30}deg)`}} />;
    })}
  </>;
};

const CAPS: Cap[] = [
  [T.no, 'NO.'], [T.doYou, 'DO YOU THINK IF'], [T.gave, 'WE GAVE YOU A CELLY', 'CELLY'], [T.now, 'RIGHT NOW,'], [4060, 'YOU JUST THROW IT UP?'],
  [T.maybe, 'MAYBE.'], [S[2], "I CAN'T BE LIKE"], [6200, 'CHOREOGRAPHED.', 'CHOREOGRAPHED'], [T.notGood, "I'M NOT GOOD.", 'NOT GOOD', LED_RED],
  [7640, "WE'RE COLLECTORS."], [8760, 'SO ON SOME OF'], [9420, 'OUR CARDS,'], [10300, 'YOU GET A PSA 10.', 'PSA 10'], [11040, '10 IS LIKE'],
  [12040, 'THE BEST GRADE', 'BEST'], [12940, 'YOU COULD GET.'], [13420, "SO IT'S ALMOST"], [13800, 'LIKE THIS, YOU POINT', 'POINT'],
  [14460, 'AND GO LIKE JUST'], [T.t1, '10,', '10'], [T.t2, '10, 10,', '10, 10'], [T.t3, '10, 10, 10.', '10, 10, 10'], [T.easy, "IT'S EASY."],
  [T.likeThat, 'YOU LIKE THAT?'], [T.iLike, 'ALL RIGHT,'], [18260, 'I LIKE THAT.', 'LIKE THAT', '#3BFF8A'], [T.yo, 'YO!'],
];

export const Celly = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.celly, 8], [T.no, 12], [T.t1, 8], [T.t2, 8], [T.t3, 12], [T.yo, 12]], o);
  const wh = whipAt([S[1], S[2], S[3], S[4], T.doYou], o, 'zoom', 220);
  const flash = flashAt([[T.t3, 0.4], [T.yo, 0.35], [T.no, 0.25]], o);
  return (
    <AbsoluteFill style={{background: '#020309'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.03)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        <Cam c={cam} o={o} behind={<><HookBehind o={o} /><TensBehind o={o} /></>} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,10,40,0.35), transparent 40%, rgba(0,0,0,0.3))', mixBlendMode: 'multiply'}} />
        <No o={o} />
        <Jumbotron o={o} />
        <Choreo o={o} />
        <Grade o={o} />
        <Rings o={o} />
        <Unlocked o={o} />
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, T.no], [S[4] + 2000, S[4] + 2200]]} top={1610} keyColor={AMBER}
        style={{...BUNGEE, fontSize: 56, color: 'white', WebkitTextStroke: '3px #07070f', paintOrder: 'stroke fill', textShadow: '0 6px 20px rgba(0,0,0,0.75)'}} />
      <Vignette color="2,2,12" strength={0.75} />
      <Grain frame={frame} opacity={0.08} />
      {flash > 0 && <AbsoluteFill style={{background: AMBER, opacity: flash * 0.6}} />}
      <SpeechTrack src={SRC} tl={tl} />
      {/* Du bist gut genug (full): 83.8 s drop on the first "10" */}
      <Music file="du-bist-full.mp3" songFrom={83800 - T.t1} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.t1 - 200 && t < T.t1) return 0.03;
        if (t >= tl.total - 700) return 0.42 * end;
        return (tl.playing(t) ? 0.13 : 0.3) * Math.min(1, t / 120);
      }} />
      <SfxTrack list={[
        sfx('mg-click', 280, 0.25), sfx('mg-swoosh2', T.celly, 0.3), sfx('error', T.no, 0.25), sfx('mg-click', T.no, 0.3),
        sfx('mg-whoosh', T.doYou, 0.32), sfx('crowd-cheer', T.doYou + 100, 0.12, 3400), sfx('mg-click', T.gave, 0.25), sfx('mg-click', T.throwUp, 0.3), sfx('huh-cat', T.maybe + 50, 0.18),
        sfx('whoosh', S[2], 0.3), ...Array.from({length: 5}).map((_, i) => sfx('mg-click', S[2] + 200 + i * 160, 0.18)), sfx('record-scratch', T.notGood, 0.25),
        sfx('whoosh', S[3], 0.3), sfx('mg-swoosh', T.psa - 200, 0.35), ...Array.from({length: 10}).map((_, i) => sfx('mg-click', T.best - 300 + i * 60, 0.12)), sfx('ding-2', T.best + 300, 0.3),
        sfx('mg-swoosh2', T.point, 0.25), sfx('mg-boom', T.t1, 0.16), sfx('mg-boom', T.t2, 0.16), sfx('mg-boom', T.t3, 0.2), sfx('crowd-cheer', T.t1, 0.3, 2400),
        sfx('whoosh', S[4], 0.3), ...Array.from({length: 6}).map((_, i) => sfx('mg-click', T.iLike + i * 100, 0.15)), sfx('ding-2', T.iLike + 600, 0.3),
        sfx('crowd-cheer', T.yo, 0.35), sfx('mg-shimmer', T.yo + 100, 0.35),
      ]} />
    </AbsoluteFill>
  );
};
