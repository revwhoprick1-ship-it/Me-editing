// Edit3 · t5 "True Gold": "Josh Allen, true gold"... it's not THAT Josh Allen: it's Josh Hines-Allen, before he
// changed his name. Look: black + metallic gold with a prism-rainbow sweep, a refractor card, RGB glitch type for the
// twist and the name morph (HINES- slides in, Jaguars teal). Wide handheld framing (people standing around).
// Mood funny → Du bist gut genug (full, first drop at 2.0 s on "true gold").
import type {CSSProperties} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import track from '../plans/data/t5_ex_teammate.seats.json';
import {
  Cam, Captions, Emoji, FPS, Grain, H, Music, SfxTrack, Sparkle, SpeechTrack, Vignette, W, ease, flashAt, land, pop, punchAt, sfx,
  shakeAt, timeline, whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'pod/t5_ex_teammate.mp4';
const tl = timeline([[12440, 13150], [14000, 14820], [1640, 4680], [7980, 10560], [15040, 25960, 900]]);
export const TRUEGOLD_MS = tl.total;
const S = tl.segOut; // 0 710 1530 4570 7150
const T = {josh: 140, allen: 360, tru: 850, gold: 970, isThat: 1550, haveTrue: 2330, prism: 3610, prismW: 3990, hand: 5150, glove: 6670,
  good: 7230, fire: 8510, trueGold: 9250, rookie: 10610, notRookie: 11250, notJosh: 12070, real: 14150, hines: 14910, hinesAllen: 15270,
  this: 15590, before: 17420, name: 17510};
const GOLD = '#F4C542';
const TEAL = '#00A3AD';
const GROT = {fontFamily: 'Space Grotesk', fontWeight: 700, letterSpacing: '-0.03em'} as const;
const BIG = {fontFamily: 'Unbounded', fontWeight: 800, letterSpacing: '-0.04em'} as const;
const GLITCH = {fontFamily: 'Rubik Glitch'} as const;
const shadow = '0 8px 30px rgba(0,0,0,0.7)';
const goldText: CSSProperties = {background: 'linear-gradient(180deg,#FFF6C8 0%, #F4C542 40%, #9C6B06 75%, #F8DC7A 100%)', WebkitBackgroundClip: 'text',
  backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(244,197,66,0.35))'};
// RGB-split glitch copy of a word
const Glitchy = ({t, size, o, color = 'white', style}: {t: string; size: number; o: number; color?: string; style?: CSSProperties}) => {
  const j = Math.sin(o * 0.7) * 6;
  const base: CSSProperties = {...GROT, fontSize: size, lineHeight: 0.9, position: 'absolute', left: 0, right: 0, textAlign: 'center'};
  return <div style={{position: 'relative', height: size * 0.95, ...style}}>
    <div style={{...base, color: '#ff0040', transform: `translate(${j}px, ${-j / 3}px)`, mixBlendMode: 'screen', opacity: 0.85}}>{t}</div>
    <div style={{...base, color: '#00e5ff', transform: `translate(${-j}px, ${j / 3}px)`, mixBlendMode: 'screen', opacity: 0.85}}>{t}</div>
    <div style={{...base, color, textShadow: shadow}}>{t}</div>
  </div>;
};

const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who: (s) => (s >= 15040 && s < 19000 ? 'M' : 'W'), wideX: 780,
  grade: 'contrast(1.18) saturate(0.95) brightness(0.86)', faceY: 0.4, baseH: 860,
  zoom: (o) => punchAt([[T.tru, S[2], 1.25], [T.prism, S[3], 1.12], [T.notRookie, T.real, 1.15], [T.hines, tl.total, 1.1]], o) * (1 + 0.05 * ((o % 3500) / 3500)),
};

// refractor card: gold with a prism sweep
const Card = ({o, name = 'JOSH ALLEN', rc = 0}: {o: number; name?: string; rc?: number}) => (
  <div style={{position: 'relative', width: 420, height: 588, borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', border: '6px solid #f7e08a',
    background: 'linear-gradient(150deg, #8a5a00, #F4C542 35%, #fff0b0 50%, #c58f12 65%, #6e4500)'}}>
    <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${o / 8}deg at 30% 30%, rgba(255,0,0,0.25), rgba(255,200,0,0.25), rgba(0,255,120,0.25), rgba(0,160,255,0.25), rgba(200,0,255,0.25), rgba(255,0,0,0.25))`, mixBlendMode: 'overlay'}} />
    <svg width={420} height={588} style={{position: 'absolute', inset: 0}}>
      <g transform="translate(10,40)" fill="rgba(30,18,0,0.78)">
        <path d="M70,300 C60,170 170,100 270,120 C350,135 395,200 385,280 L300,292 L300,330 L385,330 L385,362 L250,372 C185,410 85,395 70,300 Z" />
        <path d="M300,292 L300,372 M330,290 L330,368 M355,288 L355,365" stroke="rgba(30,18,0,0.78)" strokeWidth={10} fill="none" />
        <circle cx={190} cy={260} r={26} fill="rgba(255,240,190,0.55)" />
      </g>
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: 'rgba(10,6,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...GROT, fontSize: name.length > 12 ? 34 : 44, color: GOLD}}>{name}</div>
    {rc > 0 && <div style={{position: 'absolute', right: 18, top: 18, width: 96, height: 110, transform: `scale(${rc})`, clipPath: 'polygon(50% 0, 100% 18%, 100% 70%, 50% 100%, 0 70%, 0 18%)',
      background: '#c8102e', display: 'flex', alignItems: 'center', justifyContent: 'center', ...BIG, fontSize: 48, color: 'white'}}>RC</div>}
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${(o / 20) % 180 - 40}%, rgba(255,255,255,0.6) ${(o / 20) % 180 - 32}%, transparent ${(o / 20) % 180 - 24}%)`}} />
  </div>
);

// ---- hook: "Josh Allen... true gold" ----------------------------------------------------------------------------
const Hook = ({o}: {o: number}) => {
  if (o >= S[2]) return null;
  const c = pop(o, T.tru - 150, 13, 130);
  return <>
    <div style={{position: 'absolute', top: 160, width: W}}>
      <Glitchy t="JOSH ALLEN" size={150} o={o} style={land(o, T.josh, 'slam')} />
      <div style={{...GROT, fontSize: 54, textAlign: 'center', color: 'rgba(255,255,255,0.75)', marginTop: 8, ...land(o, T.allen + 120, 'up')}}>(the QB?)</div>
    </div>
    {o >= T.tru - 150 && <div style={{position: 'absolute', left: 330, top: 560, perspective: 1200}}>
      <div style={{transform: `translateY(${(1 - c) * 1000}px) rotateY(${(1 - c) * 180 + Math.sin(o / 300) * 14}deg) rotateX(6deg)`}}><Card o={o} /></div>
    </div>}
    <div style={{position: 'absolute', top: 1210, width: W, textAlign: 'center', ...BIG, fontSize: 150, lineHeight: 0.9, ...goldText, ...land(o, T.tru, 'slam')}}>TRUE<br />GOLD</div>
  </>;
};

// ---- "is that gold? true gold prism" ------------------------------------------------------------------------------
const Prism = ({o}: {o: number}) => {
  if (o < S[2] || o >= S[3]) return null;
  const sw = ease(o, T.prism, 900);
  return <>
    {o >= T.prism && <AbsoluteFill style={{background: `linear-gradient(110deg, transparent ${sw * 140 - 40}%, rgba(255,0,0,0.3) ${sw * 140 - 30}%, rgba(255,220,0,0.3) ${sw * 140 - 24}%,
      rgba(0,255,140,0.3) ${sw * 140 - 18}%, rgba(0,170,255,0.3) ${sw * 140 - 12}%, rgba(190,0,255,0.3) ${sw * 140 - 6}%, transparent ${sw * 140}%)`, mixBlendMode: 'screen'}} />}
    <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center'}}>
      <div style={{...GROT, fontSize: 110, color: 'white', textShadow: shadow, ...land(o, T.isThat, 'up')}}>is that gold?</div>
      <Emoji code="1f9d0" size={110} style={{left: 870, top: -10, transform: `scale(${pop(o, T.isThat + 200, 9, 220)})`}} />
    </div>
    <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center', lineHeight: 0.92}}>
      <div style={{...BIG, fontSize: 130, ...goldText, ...land(o, T.haveTrue, 'slam')}}>TRUE GOLD</div>
      <div style={{...BIG, fontSize: 150, background: 'linear-gradient(90deg,#ff3b3b,#ffd400,#3bff8a,#29b6ff,#c03bff)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
        color: 'transparent', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.6))', ...land(o, T.prismW, 'slam')}}>PRISM</div>
    </div>
  </>;
};

// ---- "that's not your hand though" / "it's a glove" -----------------------------------------------------------------
const Glove = ({o}: {o: number}) => {
  if (o < S[3] || o >= S[4]) return null;
  return <>
    <div style={{position: 'absolute', top: 180, width: W, textAlign: 'center'}}>
      <div style={{...GROT, fontSize: 104, color: 'white', textShadow: shadow, ...land(o, 4770, 'left')}}>"not your hand"</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50}}>
      <div style={{...GROT, fontSize: 96, color: 'rgba(255,255,255,0.4)', textDecoration: o > T.glove ? 'line-through' : 'none', ...land(o, T.hand, 'up')}}>HAND</div>
      <div style={{...GROT, fontSize: 90, color: 'white', ...land(o, T.glove - 100, 'up')}}>→</div>
      <div style={{...BIG, fontSize: 96, ...goldText, ...land(o, T.glove, 'slam')}}>GLOVE</div>
    </div>
    <Emoji code="1f9e4" size={170} style={{left: 455, top: 870, transform: `scale(${pop(o, T.glove, 8, 220)}) rotate(${Math.sin(o / 100) * 10}deg)`}} />
  </>;
};

// ---- "that's fire... rookie card... that's not rookie Josh Allen" ---------------------------------------------------------
const Rookie = ({o}: {o: number}) => {
  if (o < S[4] || o >= T.real - 100) return null;
  const c = pop(o, S[4], 14, 140);
  const no = o >= T.notRookie;
  return <>
    <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center'}}>
      {!no && <><div style={{...GROT, fontSize: 96, color: 'white', textShadow: shadow, ...land(o, T.good, 'up')}}>that's</div>
        <div style={{...BIG, fontSize: 170, color: '#FF7A1A', textShadow: '0 0 40px rgba(255,122,26,0.6)', ...land(o, T.fire, 'slam')}}>FIRE</div></>}
      {no && <><Glitchy t="NOT" size={200} o={o} color="#ff3b3b" style={land(o, T.notRookie, 'slam')} />
        <div style={{position: 'relative', display: 'inline-block', marginTop: 20}}><Glitchy t="JOSH ALLEN" size={120} o={o} style={{width: 900}} />
          <div style={{position: 'absolute', left: -10, right: -10, top: '45%', height: 14, background: '#ff3b3b', transform: `scaleX(${ease(o, T.notJosh, 250)})`, transformOrigin: 'left'}} /></div></>}
    </div>
    {!no && o >= T.fire && <Emoji code="1f525" size={160} style={{left: 820, top: 140, transform: `scale(${pop(o, T.fire, 8, 220)})`}} />}
    <div style={{position: 'absolute', left: 330, top: 820, perspective: 1200, opacity: no ? 0.85 : 1}}>
      <div style={{transform: `translateY(${(1 - c) * 1000}px) rotateY(${Math.sin(o / 400) * 16}deg) rotateZ(${no ? -4 : 0}deg)`,
        filter: no ? `hue-rotate(${Math.sin(o / 30) * 40}deg) saturate(0.6)` : undefined}}><Card o={o} rc={ease(o, T.rookie, 220)} /></div>
    </div>
    {!no && o >= T.trueGold && [[250, 860, 70, T.trueGold], [800, 1000, 60, T.trueGold + 200], [300, 1350, 60, T.trueGold + 400]].map(([x, y, s, at], i) =>
      <Sparkle key={i} x={x} y={y} s={s} o={o} at={at} />)}
  </>;
};

// ---- the twist: "the real Josh Hines-Allen... before he changed his name" ----------------------------------------------
const NameMorph = ({o}: {o: number}) => {
  if (o < T.real - 100) return null;
  const ins = ease(o, T.hines, 300);
  const card = pop(o, T.before, 14, 140);
  return <>
    <AbsoluteFill style={{background: `rgba(0,30,34,${0.35 * ease(o, T.real, 300)})`}} />
    <div style={{position: 'absolute', top: 180, width: W, textAlign: 'center'}}>
      <div style={{...GROT, fontSize: 90, color: 'white', textShadow: shadow, ...land(o, T.real - 100, 'up')}}>the REAL</div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', ...BIG, fontSize: 74, lineHeight: 1.1, color: 'white', textShadow: shadow, marginTop: 10}}>
        <span>JOSH&nbsp;</span>
        <span style={{display: 'inline-block', maxWidth: 520 * ins, overflow: 'hidden', whiteSpace: 'nowrap', color: TEAL, textShadow: `0 0 30px ${TEAL}`}}>HINES-</span>
        <span>ALLEN</span>
      </div>
    </div>
    {o >= T.before - 200 && <div style={{position: 'absolute', left: 60, top: 1030, width: 960, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transform: `translateY(${(1 - card) * 900}px)`}}>
      <div style={{textAlign: 'center'}}><div style={{...GROT, fontSize: 34, color: 'rgba(255,255,255,0.7)'}}>BEFORE</div>
        <div style={{transform: 'scale(0.62)', transformOrigin: 'top center', height: 370}}><Card o={o} /></div></div>
      <div style={{...BIG, fontSize: 100, color: TEAL}}>→</div>
      <div style={{textAlign: 'center'}}><div style={{...GROT, fontSize: 34, color: TEAL}}>NAME CHANGE</div>
        <div style={{transform: 'scale(0.62)', transformOrigin: 'top center', height: 370, filter: 'hue-rotate(140deg) saturate(1.2)'}}><Card o={o} name="JOSH HINES-ALLEN" /></div></div>
    </div>}
    {o >= tl.total - 900 && <Emoji code="1f92f" size={170} style={{left: 455, top: 760, transform: `scale(${pop(o, tl.total - 900, 8, 200)})`}} />}
  </>;
};

const CAPS: Cap[] = [
  [S[2] + 20, 'IS THAT GOLD?', 'GOLD'], [T.haveTrue, 'WE HAVE TRUE GOLD.', 'TRUE GOLD'], [T.prism, 'TRUE GOLD PRISM.', 'PRISM'],
  [4770, "THAT'S NOT YOUR HAND THOUGH."], [5930, "IT'S NOT MY HAND."], [6590, "IT'S A GLOVE.", 'GLOVE'], [T.good, "THAT'S A GOOD ONE."],
  [8210, "NO, THAT'S FIRE.", 'FIRE', '#FF7A1A'], [T.trueGold, "THAT'S TRUE GOLD.", 'TRUE GOLD'], [10230, "THAT'S A ROOKIE CARD.", 'ROOKIE'],
  [T.notRookie, "THAT'S NOT ROOKIE", 'NOT', '#ff3b3b'], [T.notJosh, 'JOSH ALLEN,'], [13350, 'BUT THAT IS THE REAL'], [14470, 'JOSH HINES-ALLEN.', 'HINES-', TEAL],
  [T.this, 'THIS IS JOSH HINES-ALLEN', 'HINES-', TEAL], [T.before, 'BEFORE HE CHANGED HIS NAME.', 'CHANGED HIS NAME'],
];

export const TrueGold = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.josh, 8], [T.tru, 12], [T.notRookie, 14], [T.hines, 10]], o);
  const wh = whipAt([S[1], S[2], S[3], S[4], T.notRookie, T.real], o, 'spin', 220);
  const flash = flashAt([[T.tru, 0.3], [T.notRookie, 0.3], [T.hines, 0.25]], o);
  const glitch = (o >= T.notRookie && o < T.notRookie + 300) || (o >= T.hines && o < T.hines + 200);
  return (
    <AbsoluteFill style={{background: '#050403'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x + (glitch ? Math.sin(o) * 14 : 0)}px, ${sh.y}px) ${wh.transform} scale(1.03)`,
        filter: `${wh.blur ? `blur(${wh.blur}px)` : ''} ${glitch ? `hue-rotate(${Math.sin(o / 20) * 90}deg) contrast(1.4)` : ''}`.trim() || undefined}}>
        <Cam c={cam} o={o} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
        <Hook o={o} />
        <Prism o={o} />
        <Glove o={o} />
        <Rookie o={o} />
        <NameMorph o={o} />
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, S[2]]]} top={1640} keyColor={GOLD}
        style={{...GROT, fontSize: 58, color: 'white', WebkitTextStroke: '3px #000', paintOrder: 'stroke fill', textShadow: '0 6px 20px rgba(0,0,0,0.8)'}} />
      <Vignette color="0,0,0" strength={0.8} />
      <Grain frame={frame} opacity={0.09} />
      {flash > 0 && <AbsoluteFill style={{background: GOLD, opacity: flash * 0.7, mixBlendMode: 'screen'}} />}
      <SpeechTrack src={SRC} tl={tl} gain={1.1} />
      {/* Du bist gut genug (full): first drop (2.0 s) on "true gold" */}
      <Music file="du-bist-full.mp3" songFrom={Math.max(0, 2000 - T.tru)} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= T.notRookie - 200 && t < T.notRookie + 300) return 0.02;
        if (t >= tl.total - 900) return 0.42 * end;
        return (tl.playing(t) ? 0.12 : 0.28) * Math.min(1, t / 100);
      }} />
      <SfxTrack list={[
        sfx('mg-swoosh2', 0, 0.3), sfx('mg-click', T.josh, 0.3), sfx('mg-whoosh', T.tru - 150, 0.3), sfx('mg-shimmer', T.tru, 0.4), sfx('mg-boom', T.tru, 0.16),
        sfx('whoosh', S[2], 0.3), sfx('huh-cat', T.isThat + 150, 0.15), sfx('mg-click', T.haveTrue, 0.3), sfx('mg-shimmer', T.prism, 0.35), sfx('mg-click', T.prismW, 0.3),
        sfx('whoosh', S[3], 0.3), sfx('mg-click', T.hand, 0.25), sfx('spongebob-boowomp', T.glove, 0.18), sfx('mg-click', T.glove, 0.3),
        sfx('whoosh', S[4], 0.3), sfx('mg-swoosh', S[4] + 60, 0.3), sfx('mg-click', T.fire, 0.3), sfx('mg-shimmer', T.trueGold, 0.3), sfx('mg-click', T.rookie, 0.3),
        sfx('record-scratch', T.notRookie, 0.3), sfx('error', T.notRookie + 120, 0.18), sfx('mg-click', T.notJosh, 0.25),
        sfx('mg-whoosh', T.real - 100, 0.3), sfx('mg-swoosh2', T.hines, 0.35), sfx('anime-wow', T.hinesAllen, 0.22),
        sfx('mg-swoosh', T.before - 200, 0.3), sfx('mg-click', T.name, 0.3), sfx('mg-shimmer', tl.total - 900, 0.35),
      ]} />
    </AbsoluteFill>
  );
};
