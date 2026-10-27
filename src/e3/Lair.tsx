// Edit3 (black bars) · "Would you ever come back to the Lair?" "Yeah, that would be awesome. You guys are always
// welcome in Jacksonville." Look: a Florida road-trip postcard on the bottom bar (Fort Lauderdale → Jacksonville up
// I-95), handwritten notes, "always welcome" behind Trevor, then a W Speed freeze (gray, Blue's "I'd" at 58.27 s,
// typed action text). Mood wholesome → Blue.
import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import track from '../plans/data/v_lair.seats.json';
import {BOX_BOTTOM, BOX_H, BOX_TOP, Bars, CAP_TOP, MONT} from './bars';
import {
  Cam, Captions, Draw, Emoji, FPS, Grain, Music, SfxTrack, Sparkle, SpeechTrack, W, clamp, ease, land, mattesFor, pop, punchAt, sfx, timeline,
  whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'b3/v_lair.mp4';
const FREEZE = 5200;
const tl = timeline([[0, 5550], [5650, 7850], [9680, 11650], [12300, 15000], [15400, 17700, FREEZE], [18150, 18950, 700]]);
export const LAIR_MS = tl.total;
const S = tl.segOut; // 0 5550 7750 9720 12420 19920
const FZ = S[4] + 17700 - 15400; // 14720 = Blue "I'd"
const T = {everything: 780, more: 1940, enjoy: 3560, honestly: 4760, comeBack: 6120, lair: 6580, offSeason: 7000, fortL: 8590, fortL2: 9210,
  rip: 10040, chill: 10800, awesome: 11820, welcome: 12480, jax: 14280, type: FZ + 260, w: FZ + 2500, appreciate: 20090};
const CREAM = '#FFF3DC';
const CORAL = '#FF7A59';
const SEA = '#1FB5B0';
const SCRIPT = {fontFamily: 'Pacifico'} as const;
const HAND = {fontFamily: 'Caveat', fontWeight: 700} as const;
const MONO = {fontFamily: 'Space Mono', fontWeight: 700} as const;
const shadow = '0 8px 28px rgba(0,0,0,0.6)';

const who = (s: number) => {
  if (s < 4300) return 'R' as const;
  if (s < 5600) return 'M' as const;
  if (s < 9600) return 'R' as const;
  if (s < 10500) return 'M' as const;
  if (s < 14200) return 'R' as const;
  if (s < 18000) return 'M' as const;
  return 'R' as const;
};
const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who, mattes: mattesFor('lair'), box: [W, BOX_H], baseH: 760,
  grade: 'contrast(1.06) saturate(1.12) brightness(0.98) sepia(0.08)',
  zoom: (o) => punchAt([[T.welcome, S[5], 1.08]], o) * (1 + 0.04 * ((o % 5000) / 5000)),
};

// Florida postcard map: Fort Lauderdale (the Lair) → Jacksonville
const FL = 'M10,30 L250,34 L292,40 L306,80 L322,140 L342,205 L356,250 L354,290 L336,322 L312,318 L286,290 L262,246 L246,196 L234,160 L216,128 L190,104 L156,90 L118,78 L64,60 L10,52 Z';
const Postcard = ({o}: {o: number}) => {
  const inP = pop(o, 200, 15, 130);
  const route = ease(o, T.jax - 300, 1100, Easing.inOut(Easing.cubic));
  const car = route > 0 && route < 1;
  const t = route;
  const cx = 354 - (354 - 292) * t + Math.sin(t * Math.PI) * 18;
  const cy = 262 - (262 - 46) * t;
  return <div style={{position: 'absolute', left: 50, top: BOX_BOTTOM + 30, width: 980, height: 340, transform: `translateY(${(1 - inP) * 400}px) rotate(-1.5deg)`}}>
    <div style={{position: 'absolute', inset: 0, background: CREAM, borderRadius: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.6)'}} />
    <div style={{position: 'absolute', left: 520, top: 20, bottom: 20, width: 3, background: 'rgba(0,0,0,0.15)'}} />
    <svg width={500} height={340} viewBox="0 -5 400 340" style={{position: 'absolute', left: 20, top: 0}}>
      <path d={FL} fill={SEA} fillOpacity={0.25} stroke={SEA} strokeWidth={4} />
      <Draw d="M354,262 C366,200 340,140 318,96 C306,70 298,56 292,46" p={route} color={CORAL} width={6} dash="10 8" />
      {o >= T.fortL && <circle cx={354} cy={262} r={9 + 6 * Math.max(0, 1 - (o - T.fortL) / 400)} fill={CORAL} />}
      <text x={344} y={300} textAnchor="end" fontFamily="Space Mono" fontWeight={700} fontSize={16} fill="#333">FORT LAUDERDALE</text>
      <text x={344} y={318} textAnchor="end" fontFamily="Caveat" fontWeight={700} fontSize={20} fill={CORAL}>the Lair</text>
      {route > 0.95 && <><circle cx={292} cy={46} r={9} fill={CORAL} /><text x={280} y={24} textAnchor="end" fontFamily="Space Mono" fontWeight={700} fontSize={16} fill="#333">JACKSONVILLE</text></>}
      {car && <g transform={`translate(${cx},${cy})`}><circle r={8} fill="#222" /></g>}
    </svg>
    <div style={{position: 'absolute', left: 560, top: 30, ...SCRIPT, fontSize: 46, color: CORAL, lineHeight: 1.1}}>Greetings<br />from the Lair</div>
    <div style={{position: 'absolute', left: 562, top: 160, width: 400, ...HAND, fontSize: 40, color: '#333', lineHeight: 1.05}}>
      <div style={land(o, T.rip, 'up')}>rip product & just chill</div>
      {o >= T.jax && <div style={land(o, T.jax, 'up')}>come see us in <span style={{color: SEA}}>Jacksonville</span> → ~320 mi</div>}
    </div>
    {o >= T.appreciate - 300 && <div style={{position: 'absolute', right: 30, bottom: 26, ...MONO, fontSize: 30, color: CORAL, border: `4px solid ${CORAL}`, padding: '4px 14px',
      borderRadius: 8, transform: `rotate(-8deg) scale(${2 - ease(o, T.appreciate - 300, 160)})`, opacity: ease(o, T.appreciate - 300, 160)}}>SEE YOU IN DUVAL</div>}
  </div>;
};

const Words = ({o}: {o: number}) => {
  const box = (children: ReactNode) => <div style={{position: 'absolute', top: BOX_TOP + 60, width: W, textAlign: 'center', textShadow: shadow}}>{children}</div>;
  if (o < S[1]) return box(<>
    <div style={{...SCRIPT, fontSize: 120, color: CREAM, ...land(o, T.everything, 'up', 450)}}>everything</div>
    <div style={{...HAND, fontSize: 84, color: CORAL, ...land(o, T.more, 'up')}}>…and more.</div>
  </>);
  if (o < S[2]) return box(<>
    <div style={{...HAND, fontSize: 80, color: 'white', ...land(o, T.comeBack, 'up')}}>come back to</div>
    <div style={{...SCRIPT, fontSize: 130, color: CORAL, ...land(o, T.lair, 'up', 450)}}>the Lair?</div>
  </>);
  if (o >= S[3] && o < S[4]) return box(<>
    <div style={{...SCRIPT, fontSize: 110, color: CREAM, ...land(o, T.awesome, 'up', 450)}}>"that'd be awesome"</div>
  </>);
  return null;
};
const WelcomeBehind = ({o}: {o: number}) => {
  if (o < S[4] || o >= FZ) return null;
  return <div style={{position: 'absolute', top: 40, width: W, textAlign: 'center', lineHeight: 0.95, textShadow: shadow}}>
    <div style={{...HAND, fontSize: 90, color: 'white', ...land(o, T.welcome, 'up')}}>you guys are</div>
    <div style={{...SCRIPT, fontSize: 170, color: CREAM, ...land(o, T.welcome + 350, 'up', 450)}}>always welcome</div>
  </div>;
};
// W Speed freeze
const WSpeed = ({o}: {o: number}) => {
  if (o < FZ || o >= S[5]) return null;
  const text = 'INVITES THE BOYS TO JACKSONVILLE';
  const n = Math.max(0, Math.min(text.length, Math.floor((o - T.type) / 55)));
  const beat = Math.max(0, Math.cos(((o - FZ) / 740) * Math.PI * 2));
  const w = pop(o, T.w, 10, 140);
  return <>
    <div style={{position: 'absolute', top: BOX_TOP + 640, left: 70, right: 70, textAlign: 'center', fontFamily: 'Courier Prime', fontWeight: 700, fontStyle: 'italic', fontSize: 56,
      lineHeight: 1.25, color: 'white', textShadow: '0 4px 14px rgba(0,0,0,0.85)'}}>
      {o >= T.type && <><span style={{color: '#FF4D4D'}}>*TREVOR</span> {text.slice(0, n)}{n === text.length ? '*' : (Math.floor(o / 250) % 2 ? '|' : '')}</>}
    </div>
    {o >= T.w && <div style={{position: 'absolute', top: BOX_TOP + 90, width: W, textAlign: 'center', transform: `scale(${w * (1 + beat * 0.05)})`}}>
      <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 200, lineHeight: 1, color: 'white', textShadow: '0 0 50px rgba(255,255,255,0.6), 0 10px 40px rgba(0,0,0,0.6)'}}>W TREVOR</div>
    </div>}
    {o >= T.w && <Emoji code="2764-fe0f-200d-1fa79" size={130} style={{left: 640, top: BOX_TOP + 70, transform: `scale(${0.9 + beat * 0.25})`}} />}
    {[[150, BOX_TOP + 200, 70, T.w], [930, BOX_TOP + 480, 60, T.w + 300], [260, BOX_TOP + 620, 50, T.w + 700], [880, BOX_TOP + 150, 50, T.w + 1100]].map(([x, y, s, at], i) =>
      <Sparkle key={i} x={x} y={y} s={s} o={o % 1800 + T.w} at={at} color="#fff" glow="#fff" />)}
  </>;
};

const CAPS: Cap[] = [
  [0, 'HE WAS EVERYTHING', 'EVERYTHING'], [1240, 'WE ENVISIONED AND MORE.'], [2500, "I'VE ENJOYED THAT."], [3560, 'BUT DUDE, DID YOU ENJOY IT?'],
  [T.honestly, 'I HONESTLY DID.', 'HONESTLY'], [5600, 'WOULD YOU EVER COME BACK', 'COME BACK'], [6580, 'TO THE LAIR', 'LAIR'], [7000, 'IF IT WAS AN OFF SEASON?'],
  [7830, 'YEAH, WHERE YOU GUYS AT,'], [8590, 'FORT LAUDERDALE?', 'FORT LAUDERDALE', SEA], [9210, 'FORT LAUDERDALE.', 'FORT LAUDERDALE', SEA],
  [9800, 'LIKE, JUST TO RIP PRODUCT'], [10800, 'AND JUST CHILL.'], [11660, 'YEAH, THAT WOULD BE AWESOME.', 'AWESOME'],
  [12440, 'YOU GUYS ARE ALWAYS WELCOME.', 'ALWAYS WELCOME'], [13720, 'YOU GUYS KNOW THAT', ''], [14280, 'IN JACKSONVILLE.', 'JACKSONVILLE', SEA],
  [19990, 'WE APPRECIATE IT.'],
];

export const Lair = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const wh = whipAt([S[1], S[2], S[3], S[4], S[5]], o, 'zoom', 260);
  const frozen = o >= FZ && o < S[5];
  const gray = frozen ? Math.min(1, (o - FZ) / 160) : 0;
  const flash = interpolate(o - FZ, [0, 30, 160], [0, 0.5, 0], clamp);
  return (
    <Bars top="Trevor wants to come back to the Lair" emoji="1f979" over={<>
      <Postcard o={o} />
      <Words o={o} />
      <WSpeed o={o} />
      <Captions o={o} caps={CAPS} off={[[FZ, S[5]]]} top={CAP_TOP} keyColor={CORAL}
        style={{fontFamily: MONT, fontWeight: 800, fontSize: 58, color: 'white', WebkitTextStroke: '3px black', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.7)'}} />
      <Grain frame={frame} opacity={0.08} />
      {flash > 0 && <AbsoluteFill style={{background: 'white', opacity: flash, top: BOX_TOP, height: BOX_H}} />}
    </>}>
      <AbsoluteFill style={{transform: wh.transform, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        <Cam c={cam} o={o} behind={<WelcomeBehind o={o} />} style={gray ? {filter: `grayscale(${gray}) brightness(${1 - 0.3 * gray})`} : undefined} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(30,10,0,0.45) 100%)'}} />
        {frozen && <AbsoluteFill style={{background: 'rgba(40,40,40,0.35)'}} />}
      </AbsoluteFill>
      <SpeechTrack src={SRC} tl={tl} />
      <Music file="blue-yung-kai.mp3" songFrom={58270 - FZ} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= FZ && t < S[5]) return 0.6;
        return (tl.playing(t) ? 0.13 : 0.3) * end * Math.min(1, t / 150);
      }} />
      <SfxTrack list={[
        sfx('mg-swoosh2', 0, 0.22), sfx('mg-shimmer', T.everything, 0.25), sfx('mg-swoosh', S[1], 0.25), sfx('pen-scribble', T.lair, 0.3),
        sfx('mg-swoosh', 200, 0.25), sfx('mg-click', T.fortL, 0.25), sfx('pen-scribble', T.rip, 0.3), sfx('mg-shimmer', T.awesome, 0.25),
        sfx('pen-scribble', T.welcome + 350, 0.3), sfx('mg-whoosh', T.jax - 300, 0.25), sfx('mg-click', T.jax + 800, 0.25),
        sfx('camera-shutter', FZ, 0.4), sfx('keyboard-typing', T.type, 0.45, 32 * 55 + 200), sfx('mg-shimmer', T.w, 0.35),
        sfx('whoosh', S[5], 0.3), sfx('mg-click', T.appreciate - 300, 0.3),
      ]} />
    </Bars>
  );
};
