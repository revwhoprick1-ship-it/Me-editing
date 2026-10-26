// Edit3 test: kinetic typography + motion-design storytelling + cinematic compositing, one clip.
// Clip: the boys roast Anthony Richardson's autograph ("looks like an ant"), then Trevor tells how Peyton Manning
// once told him a nice signature is a big deal (t1_tiger_auto_pen). After the 38% stayed-to-watch flop:
//  - no title card / UI panels / calm piano (read as an ad): cold open on the roast, every hook word typed big;
//  - text and photos BEHIND the speakers (person mattes: public/matte/ant, scripts/person_matte.py);
//  - story graphics: 3D autograph slab (A + R written in, measured next to an ant), real-card B-roll,
//    3D gold pen, MVP counter, Peyton's incoming call, Trevor's signature written out at the payoff;
//  - sound design: whoosh per cut, pop per word, drop-out before the punchline, riser into the reveal,
//    pen scribbles, phone buzz, booms with camera shake, ducked meme music.
import type {CSSProperties, ReactNode} from 'react';
import {loadFont} from '@remotion/fonts';
import {
  AbsoluteFill, Audio, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame,
} from 'remotion';
import {SANS, SERIF} from './mgFonts';
import track from './plans/data/t1_tiger_auto_pen.seats.json';

const SCRIPT = 'Allura';
loadFont({family: SCRIPT, url: staticFile('fonts/allura-400.woff2'), weight: '400'});

export const E3_FPS = 30;
const W = 1080;
const H = 1920;
const SRC = 'pod/t1_tiger_auto_pen.mp4';
const SRC_W = 1920;
const SRC_H = 1080;
const f = (ms: number) => Math.round((ms / 1000) * E3_FPS);
const GOLD = '#F5C84C';
const RED = '#FF3B3B';
const GREEN = '#52FF7A';

// ---- timeline (source ms, play order) -----------------------------------------------------
const SEGS: [number, number][] = [
  [12760, 13880], // "Anthony Richardson's"
  [14920, 22300], // "his auto looks like an ant ... no respect. And not to mention, it's so consistent."
  [23980, 27480], // "look how beautiful the signatures ... he's got a goated pen."
  [27860, 29665], // Trevor: "You know who told me that once?"
  [30840, 32300], // "Ironically, Peyton Manning did."
  [34190, 37200], // "He called me about something one time ... he's like, you know, it's"
  [37740, 39570], // "a big deal to have a nice signature."
];
const segOut = SEGS.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + SEGS[i - 1][1] - SEGS[i - 1][0] : 0], []);
const STORY = segOut[6] + SEGS[6][1] - SEGS[6][0];
const TAIL = 900;
export const E3_OUT_MS = STORY + TAIL;
const srcAt = (o: number) => {
  for (let i = SEGS.length - 1; i >= 0; i--) if (o >= segOut[i]) return Math.min(SEGS[i][1] - 1, SEGS[i][0] + o - segOut[i]);
  return SEGS[0][0];
};
// scene boundaries (out ms)
const T = {roast: 1120, ant: 2360, card: 3160, a: 3940, amp: 4120, r: 4400, big: 4960, back: 5900, stamp: 6020,
  right: 6720, so: 7480, cons: 7740, broll: 8500, beaut: 8840, sigs: 9340, every: 10020, goated: 11420, pen: 11620,
  trevor: 12000, who: 12380, told: 12620, peyton: 13805, pName: 14400, manning: 14725, mvp: 14800, phone: 15265,
  buzz: 15475, accept: 16295, phoneOut: 17600, itsA: 18075, bigDeal: 18815, deal: 18975, nice: 19535};
const CUTS = [T.roast, T.card, T.back, T.right, T.broll, T.every, T.trevor, T.peyton, T.phone, T.phoneOut];

// ---- helpers ---------------------------------------------------------------------------------
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (o: number, a: number, d: number) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const pop = (o: number, at: number, damping = 12, stiffness = 210) =>
  spring({frame: f(o - at), fps: E3_FPS, config: {damping, stiffness}});
const font = {
  sans: {fontFamily: SANS, fontWeight: 500, letterSpacing: '-0.02em'},
  bold: {fontFamily: SANS, fontWeight: 800, letterSpacing: '-0.05em'},
  boldI: {fontFamily: SANS, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.05em'},
  serif: {fontFamily: SERIF, fontWeight: 400},
  serifI: {fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic'},
} satisfies Record<string, CSSProperties>;
const glow = '0 0 40px rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.65)';
// a word that lands: blur + scale down onto its spot (or slides in from a side)
const land = (o: number, at: number, kind: 'slam' | 'up' | 'left' | 'right' = 'up'): CSSProperties => {
  if (o < at) return {opacity: 0};
  const p = ease(o, at, kind === 'slam' ? 160 : 280);
  const t = kind === 'slam' ? `scale(${1.9 - 0.9 * p})` : kind === 'up' ? `translateY(${(1 - p) * 50}px) scale(${1.08 - 0.08 * p})`
    : `translateX(${(1 - p) * (kind === 'left' ? -160 : 160)}px)`;
  return {opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * 16}px)`, transform: t};
};
const goldText: CSSProperties = {background: 'linear-gradient(180deg, #FFF2B0 0%, #F5C84C 45%, #B07A12 100%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.55))'};

// ---- camera: punch-ins + shake ---------------------------------------------------------------------
const PUNCH: [number, number, number][] = [[T.ant, T.card, 1.22], [T.stamp, T.right, 1.15], [T.goated, T.trevor, 1.12],
  [T.pName, T.phone, 1.1], [T.bigDeal, STORY, 1.14]];
const punchAt = (o: number) => PUNCH.reduce((z, [a, b, k]) => z * (1 + (k - 1) * Math.min(ease(o, a, 90), 1 - ease(o, b, 150))), 1);
const SHAKE: [number, number][] = [[40, 8], [T.ant, 22], [T.stamp, 18], [T.pName, 16], [T.bigDeal, 20], [T.deal, 12]];
const shakeAt = (o: number) => SHAKE.reduce((s, [t, a]) => {
  if (o < t || o > t + 500) return s;
  const k = a * Math.exp(-(o - t) / 110);
  return {x: s.x + k * Math.sin(o * 0.11 + t), y: s.y + k * Math.cos(o * 0.087 + t)};
}, {x: 0, y: 0});
// whip at every cut: horizontal smear for 200 ms
const whipAt = (o: number) => {
  const c = CUTS.find((t) => o >= t && o < t + 200);
  if (c === undefined) return {x: 0, blur: 0};
  const p = ease(o, c, 200);
  return {x: (1 - p) * 60 * (CUTS.indexOf(c) % 2 ? -1 : 1), blur: (1 - p) * 22};
};

// ---- face cam: follows only the person talking -----------------------------------------------------
type Seat = 'L' | 'M' | 'R';
type TrackT = {stepMs: number; fromMs: number} & Record<Seat, number[][]>;
const TR = track as unknown as TrackT;
const whoAt = (src: number): Seat => (src < 20420 ? 'L' : src < 27700 ? 'R' : 'M');
const faceAt = (who: Seat, src: number) => {
  const arr = TR[who];
  const i = (src - TR.fromMs) / TR.stepMs;
  const a = arr[Math.max(0, Math.min(arr.length - 1, Math.floor(i)))];
  const b = arr[Math.max(0, Math.min(arr.length - 1, Math.floor(i) + 1))];
  const t = Math.min(1, Math.max(0, i - Math.floor(i)));
  return {x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t};
};
// person cut-outs (30 fps from the range start, crop rect in source px)
const MATTES: {src: [number, number]; dir: string; n: number; rect: [number, number, number, number]}[] = [
  {src: [12760, 13880], dir: 'a', n: 34, rect: [120, 120, 660, 960]},
  {src: [14920, 16700], dir: 'b', n: 53, rect: [120, 120, 660, 960]},
  {src: [27860, 29665], dir: 'c', n: 54, rect: [700, 120, 580, 960]},
  {src: [30840, 33300], dir: 'd', n: 74, rect: [700, 120, 580, 960]},
  {src: [36900, 39570], dir: 'e', n: 80, rect: [700, 120, 580, 960]},
];
const GRADE = 'contrast(1.14) saturate(1.06) brightness(0.9) sepia(0.06)';

const camRect = (o: number) => {
  const src = srcAt(Math.min(o, STORY - 1));
  const who = whoAt(src);
  const face = faceAt(who, src);
  const si = SEGS.findIndex(([a, b]) => src >= a && src < b);
  const segP = si < 0 ? 1 : (src - SEGS[si][0]) / (SEGS[si][1] - SEGS[si][0]);
  const drift = (si === 1 ? 1.07 : 1) + 0.05 * segP + (o > STORY ? 0.08 * ease(o, STORY, TAIL) : 0);
  const hs = 800 / (drift * punchAt(o));
  const ws = (hs * W) / H;
  const x0 = Math.min(Math.max(face.x - ws / 2, 0), SRC_W - ws);
  const y0 = Math.min(Math.max(face.y - hs * 0.42, 0), SRC_H - hs);
  return {src, x0, y0, k: W / ws};
};

const Cam = ({o, behind, blur = 0}: {o: number; behind?: ReactNode; blur?: number}) => {
  const {src, x0, y0, k} = camRect(o);
  const m = MATTES.find((q) => src >= q.src[0] && src < q.src[1]);
  const mi = m ? Math.min(m.n, Math.max(1, Math.floor(((src - m.src[0]) / 1000) * 30) + 1)) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: blur ? `blur(${blur}px) brightness(${1 - 0.5 * Math.min(1, blur / 16)})` : undefined}}>
      <div style={{position: 'absolute', left: -x0 * k, top: -y0 * k, width: SRC_W * k, height: SRC_H * k, filter: GRADE}}>
        {SEGS.map(([a, b], i) => (
          <Sequence key={i} from={f(segOut[i])} durationInFrames={f(segOut[i] + b - a) - f(segOut[i])} layout="none">
            <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(a)} style={{width: '100%', height: '100%'}} />
          </Sequence>
        ))}
        <Sequence from={f(STORY)} layout="none">
          <Freeze frame={0}><OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(SEGS[6][1] - 40)} style={{width: '100%', height: '100%'}} /></Freeze>
        </Sequence>
      </div>
      {behind}
      {m && <Img src={staticFile(`matte/ant/${m.dir}/${String(mi).padStart(4, '0')}.png`)} style={{position: 'absolute',
        left: (m.rect[0] - x0) * k, top: (m.rect[1] - y0) * k, width: m.rect[2] * k, height: m.rect[3] * k, filter: GRADE}} />}
    </AbsoluteFill>
  );
};

// ---- graphic pieces ------------------------------------------------------------------------------------
const Emoji = ({code, size, style}: {code: string; size: number; style?: CSSProperties}) => (
  <Img src={staticFile(`emoji-ios/${code}.png`)} style={{position: 'absolute', width: size, height: size, ...style}} />
);
// a signature written left to right (SVG text forced to a width so the pen can follow the ink)
const Signature = ({text, w, size, p, pen = false, color = 'gold'}: {text: string; w: number; size: number; p: number; pen?: boolean; color?: 'gold' | 'ink'}) => {
  const h = size * 1.25;
  const id = `${text.replace(/\W/g, '')}${w}${color}`;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <svg width={w} height={h} style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            {color === 'gold' ? <><stop offset="0" stopColor="#FFF4BE" /><stop offset="0.5" stopColor="#F5C84C" /><stop offset="1" stopColor="#A86F0C" /></>
              : <><stop offset="0" stopColor="#1B3FA0" /><stop offset="1" stopColor="#0B1F5C" /></>}
          </linearGradient>
          <clipPath id={`c${id}`}><rect x={-20} y={-h} width={(w + 40) * p} height={h * 3} /></clipPath>
        </defs>
        <text x={0} y={size} textLength={w} lengthAdjust="spacingAndGlyphs" fontFamily={SCRIPT} fontSize={size} fill={`url(#g${id})`}
          clipPath={`url(#c${id})`} style={{filter: color === 'gold' ? 'drop-shadow(0 0 14px rgba(245,200,76,0.55))' : undefined}}>{text}</text>
      </svg>
      {pen && p > 0 && p < 1 && <div style={{position: 'absolute', left: w * p, top: size * (0.62 + 0.18 * Math.sin(p * 40)),
        transform: 'rotate(-40deg)', transformOrigin: '0 0'}}><div style={{position: 'absolute', left: 0, top: -22}}><GoldPen len={300} /></div></div>}
    </div>
  );
};
// gold fountain pen, nib at the bottom-left corner of its box
const GoldPen = ({len = 420, spin = 0}: {len?: number; spin?: number}) => {
  const h = len * 0.15;
  const shine = 0.5 + 0.5 * Math.sin(spin);
  return (
    <svg width={len} height={h} viewBox="0 0 420 63" style={{overflow: 'visible', filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.6))'}}>
      <defs>
        <linearGradient id="penBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6B4A0A" /><stop offset={0.25 + 0.2 * shine} stopColor="#FFF0A8" /><stop offset="0.7" stopColor="#D4A02A" /><stop offset="1" stopColor="#5A3C06" />
        </linearGradient>
        <linearGradient id="penNib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4F4F4" /><stop offset="1" stopColor="#8A8A8A" /></linearGradient>
      </defs>
      <polygon points="0,31.5 70,12 70,51" fill="url(#penNib)" />
      <line x1={8} y1={31.5} x2={62} y2={31.5} stroke="#555" strokeWidth={2} />
      <rect x={66} y={8} width={130} height={47} rx={8} fill="#141414" />
      <rect x={190} y={4} width={225} height={55} rx={22} fill="url(#penBody)" />
      <rect x={186} y={4} width={14} height={55} fill="#2A1C04" />
      <rect x={300} y={-6} width={110} height={10} rx={5} fill="url(#penBody)" />
    </svg>
  );
};
const Sparkle = ({x, y, s, o, at}: {x: number; y: number; s: number; o: number; at: number}) => {
  const p = Math.max(0, Math.sin(((o - at) / 420) * Math.PI));
  if (o < at) return null;
  return <svg width={s} height={s} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity: p,
    transform: `scale(${0.4 + 0.8 * p}) rotate(${(o - at) / 8}deg)`}}>
    <path d="M0,-10 Q1,-1 10,0 Q1,1 0,10 Q-1,1 -10,0 Q-1,-1 0,-10Z" fill="#FFF6D0" style={{filter: 'drop-shadow(0 0 4px #F5C84C)'}} /></svg>;
};

// ---- scenes ---------------------------------------------------------------------------------------------
// HOOK: every word typed big behind the speaker
const HookBehind = ({o}: {o: number}) => {
  if (o >= T.card) return null;
  if (o < T.roast) {
    const rp = ease(o, -200, 700);
    return <>
      <Img src={staticFile('cutouts/richardson.png')} style={{position: 'absolute', left: 560 + (1 - rp) * 500, top: 560, height: 820,
        filter: 'grayscale(0.35) contrast(1.1) brightness(0.85) drop-shadow(0 0 40px rgba(80,160,255,0.45))', opacity: rp}} />
      <div style={{position: 'absolute', top: 300, width: W, textAlign: 'center', ...font.bold, fontSize: 214, lineHeight: 1, color: 'white', textShadow: glow,
        ...land(o, 0, 'slam')}}>ANTHONY</div>
      <div style={{position: 'absolute', top: 500, width: W, textAlign: 'center', ...font.serifI, fontSize: 160, lineHeight: 1, ...goldText,
        ...land(o, 420, 'up')}}>Richardson's</div>
    </>;
  }
  if (o < T.ant) return <div style={{position: 'absolute', top: 300, width: W, textAlign: 'center', lineHeight: 0.95}}>
    <div style={{...font.bold, fontSize: 170, color: 'white', textShadow: glow}}>
      <span style={{display: 'inline-block', ...land(o, 1180, 'left')}}>HIS</span> <span style={{display: 'inline-block', ...land(o, 1520, 'right')}}>AUTO</span>
    </div>
    <div style={{...font.serifI, fontSize: 130, color: 'white', textShadow: glow, ...land(o, 1860, 'up')}}>looks like an</div>
  </div>;
  const walk = interpolate(o, [T.ant + 150, T.card], [-120, 1180], clamp);
  return <>
    <div style={{position: 'absolute', top: 120, left: 70, width: W, textAlign: 'center', ...font.bold, fontSize: 400, lineHeight: 1, color: RED,
      textShadow: '0 0 60px rgba(255,59,59,0.55), 0 10px 40px rgba(0,0,0,0.6)', ...land(o, T.ant, 'slam')}}>ANT.</div>
    {o > T.ant + 150 && <Emoji code="1f41c" size={190} style={{left: walk, top: 60 + Math.abs(Math.sin(o / 60)) * -14,
      transform: `scaleX(-1) rotate(${Math.sin(o / 45) * 7}deg)`}} />}
  </>;
};
const LaughPops = ({o}: {o: number}) => {
  const items: [string, number, number, number][] = [['1f62d', 2600, 90, 1250], ['1f602', 2760, 820, 1180], ['1f62d', 2920, 760, 1420]];
  return <>{items.map(([c, at, x, y], i) => {
    if (o < at || o > T.card) return null;
    const s = pop(o, at, 9, 240);
    return <Emoji key={i} code={c} size={150} style={{left: x, top: y - (o - at) * 0.08, transform: `scale(${s}) rotate(${(i - 1) * 12}deg)`}} />;
  })}</>;
};

// "it's just an A and an R and it's like this big": 3D autograph slab
const CardScene = ({o}: {o: number}) => {
  const lo = o - T.card;
  const inP = pop(o, T.card, 15, 120);
  const zoom = interpolate(o, [T.big - 60, T.big + 420], [1, 2.1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const sway = Math.sin(lo / 520) * 9 * (1 - (zoom - 1) / 1.1);
  const aP = ease(o, T.a, 300);
  const rP = ease(o, T.r, 300);
  const measure = ease(o, T.big + 380, 300);
  return (
    <AbsoluteFill>
      {/* the slab */}
      <div style={{position: 'absolute', left: 220, top: 470, width: 640, height: 940, perspective: 1500}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: '53% 72%',
          transform: `translateY(${(1 - inP) * 900}px) rotateY(${sway + (1 - inP) * 50}deg) rotateX(${4 + (1 - inP) * 20}deg) scale(${zoom})`}}>
          <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: 'linear-gradient(160deg, rgba(255,255,255,0.32), rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.18))',
            border: '4px solid rgba(255,255,255,0.65)', boxShadow: '0 50px 90px rgba(0,0,0,0.7), inset 0 0 40px rgba(255,255,255,0.15)'}} />
          <div style={{position: 'absolute', left: 30, top: 26, width: 580, height: 100, borderRadius: 12, background: 'linear-gradient(180deg,#fafafa,#d9d9d9)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 26, boxSizing: 'border-box'}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: '#B3121B', letterSpacing: '0.02em'}}>ANTHONY RICHARDSON</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, color: '#333', letterSpacing: '0.12em'}}>ROOKIE AUTO · ON-CARD</div>
          </div>
          <div style={{position: 'absolute', left: 40, top: 150, width: 560, height: 760, borderRadius: 18, overflow: 'hidden',
            background: 'linear-gradient(170deg, #1F5BB5 0%, #002C5F 60%, #00163A 100%)'}}>
            <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 14px, transparent 14px 34px)'}} />
            <Img src={staticFile('cutouts/richardson.png')} style={{position: 'absolute', left: -60, bottom: 0, height: 700}} />
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: 'linear-gradient(180deg, transparent, rgba(0,10,30,0.9))'}} />
            <div style={{position: 'absolute', left: 24, bottom: 22, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: 'white', letterSpacing: '-0.02em', opacity: 2 - zoom}}>ANTHONY RICHARDSON</div>
            {/* sticker auto box */}
            <div style={{position: 'absolute', left: 150, top: 470, width: 300, height: 120, borderRadius: 8, background: 'rgba(255,255,255,0.94)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.4)'}}>
              <div style={{position: 'absolute', left: 128, top: 44, fontFamily: SCRIPT, fontSize: 40, color: '#12318A', display: 'flex', gap: 2}}>
                <span style={{clipPath: `inset(0 ${100 - aP * 100}% 0 0)`}}>A</span>
                <span style={{clipPath: `inset(0 ${100 - rP * 100}% 0 0)`}}>R</span>
              </div>
              {measure > 0 && <>
                <div style={{position: 'absolute', left: 124, top: 92, width: 46 * measure, height: 3, background: RED}} />
                <div style={{position: 'absolute', left: 122, top: 85, width: 3, height: 16, background: RED, opacity: measure}} />
                <div style={{position: 'absolute', left: 124 + 46 * measure, top: 85, width: 3, height: 16, background: RED}} />
                <div style={{position: 'absolute', left: 116, top: 100, fontFamily: SANS, fontWeight: 800, fontSize: 13, color: RED, opacity: measure}}>0.4 IN</div>
                <Emoji code="1f41c" size={34} style={{left: 196, top: 40, opacity: measure, transform: `rotate(${Math.sin(o / 50) * 10}deg)`}} />
                <div style={{position: 'absolute', left: 190, top: 76, fontFamily: SANS, fontWeight: 700, fontSize: 11, color: '#333', opacity: measure}}>for scale</div>
              </>}
            </div>
          </div>
          {/* plastic glare */}
          <div style={{position: 'absolute', inset: 0, borderRadius: 34, background: `linear-gradient(115deg, transparent ${30 + Math.sin(lo / 700) * 25}%, rgba(255,255,255,0.22) ${38 + Math.sin(lo / 700) * 25}%, transparent ${46 + Math.sin(lo / 700) * 25}%)`}} />
        </div>
      </div>
      {/* kinetic words across the top */}
      <div style={{position: 'absolute', top: 120, width: W, height: 300}}>
        {o < T.big && <>
          <div style={{position: 'absolute', left: 70, top: 10, ...font.serifI, fontSize: 96, color: 'white', textShadow: glow, ...land(o, T.card + 40, 'left')}}>just an</div>
          <div style={{position: 'absolute', left: 120, top: 90, ...font.bold, fontSize: 240, color: 'white', textShadow: glow, ...land(o, T.a, 'slam')}}>A</div>
          <div style={{position: 'absolute', left: 440, top: 130, ...font.serifI, fontSize: 170, ...goldText, ...land(o, T.amp, 'up')}}>&amp;</div>
          <div style={{position: 'absolute', left: 700, top: 90, ...font.bold, fontSize: 240, color: 'white', textShadow: glow, ...land(o, T.r, 'slam')}}>R</div>
        </>}
        {o >= T.big && <div style={{position: 'absolute', top: 30, width: W, textAlign: 'center', ...font.bold, fontSize: 170, color: 'white', textShadow: glow,
          ...land(o, T.big, 'slam')}}>THIS <span style={{color: RED}}>BIG</span></div>}
      </div>
    </AbsoluteFill>
  );
};

// rubber stamp over the speaker
const Stamp = ({o}: {o: number}) => {
  if (o < T.stamp || o >= T.right) return null;
  const p = ease(o, T.stamp, 130);
  return <div style={{position: 'absolute', top: 250, width: W, display: 'flex', justifyContent: 'center'}}>
    <div style={{border: `12px solid ${RED}`, borderRadius: 26, padding: '6px 36px', ...font.bold, fontSize: 116, color: RED, letterSpacing: '-0.02em',
      transform: `rotate(-9deg) scale(${2.4 - 1.4 * p})`, opacity: 0.94 * Math.min(1, p * 2), filter: `blur(${(1 - p) * 10}px) drop-shadow(0 10px 30px rgba(0,0,0,0.6))`,
      background: 'rgba(255,255,255,0.06)', textShadow: '0 0 30px rgba(255,59,59,0.4)'}}>NO RESPECT.</div>
  </div>;
};

// "it's so consistent": the same signature stamped 4 times
const Consistent = ({o}: {o: number}) => {
  if (o < T.so || o >= T.broll) return null;
  return <>
    <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center', lineHeight: 0.92}}>
      <div style={{...font.serifI, fontSize: 110, color: 'white', textShadow: glow, ...land(o, T.so, 'up')}}>so</div>
      <div style={{...font.bold, fontSize: 140, color: GREEN, textShadow: '0 0 40px rgba(82,255,122,0.45), 0 8px 30px rgba(0,0,0,0.6)', ...land(o, T.cons, 'slam')}}>CONSISTENT.</div>
    </div>
    {[0, 1, 2, 3].map((i) => {
      const at = T.cons + 120 + i * 140;
      if (o < at) return null;
      const p = ease(o, at, 120);
      return <div key={i} style={{position: 'absolute', left: i % 2 ? 560 : 50, top: 1080 + Math.floor(i / 2) * 200,
        transform: `scale(${1.6 - 0.6 * p}) rotate(${[-5, 4, 3, -4][i]}deg)`, opacity: Math.min(1, p * 2), filter: `blur(${(1 - p) * 8}px)`}}>
        <Signature text="Trevor Lawrence" w={470} size={118} p={1} />
      </div>;
    })}
  </>;
};

// "look how beautiful the signatures": B-roll of the real cards on the table
const BRoll = ({o}: {o: number}) => {
  const lo = o - T.broll;
  const k0 = W / 700;
  const k = k0 * (1 + lo / 9000);
  const cx = 960;
  const cy = 915;
  const sweep = ((lo / 1300) % 1) * 160 - 30;
  return (
    <AbsoluteFill style={{background: '#06070b'}}>
      <AbsoluteFill style={{overflow: 'hidden', filter: 'blur(18px) brightness(0.45) saturate(1.1)'}}>
        <div style={{position: 'absolute', left: W / 2 - cx * 3.6, top: H / 2 - cy * 3.6, width: SRC_W * 3.6, height: SRC_H * 3.6}}>
          <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(SEGS[2][0])} style={{width: '100%', height: '100%'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 20, top: 720, width: 1040, height: 470, perspective: 1300}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 30, overflow: 'hidden', boxShadow: '0 50px 90px rgba(0,0,0,0.75), 0 0 0 3px rgba(255,255,255,0.18)',
          transform: `rotateX(${20 - lo / 120}deg) rotateZ(${-2 + lo / 900}deg) scale(${0.92 + ease(o, T.broll, 400) * 0.08})`}}>
          <div style={{position: 'absolute', left: 520 - cx * k, top: 235 - cy * k, width: SRC_W * k, height: SRC_H * k, filter: GRADE}}>
            <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(SEGS[2][0])} style={{width: '100%', height: '100%'}} />
          </div>
          <div style={{position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent ${sweep}%, rgba(255,240,200,0.28) ${sweep + 8}%, transparent ${sweep + 16}%)`}} />
        </div>
      </div>
      {[[150, 810, 70, 140], [880, 760, 90, 420], [520, 1130, 60, 700], [300, 1020, 50, 980], [950, 1080, 70, 1180], [700, 800, 55, 1400]].map(([x, y, s, at], i) =>
        <Sparkle key={i} x={x} y={y} s={s} o={o} at={T.broll + at} />)}
      <div style={{position: 'absolute', top: 180, width: W, textAlign: 'center', lineHeight: 0.9}}>
        <div style={{...font.sans, fontSize: 64, color: 'white', textShadow: glow, ...land(o, 8600, 'up')}}>look how</div>
        <div style={{...font.serifI, fontSize: 220, ...goldText, ...land(o, T.beaut, 'slam')}}>beautiful</div>
        <div style={{...font.sans, fontWeight: 600, fontSize: 66, color: 'white', textShadow: glow, ...land(o, T.sigs - 180, 'up')}}>the signatures are.</div>
      </div>
    </AbsoluteFill>
  );
};

// "he's got a goated pen": the pen spins in
const Goated = ({o}: {o: number}) => {
  if (o < T.goated || o >= T.trevor) return null;
  const pp = pop(o, T.pen, 13, 110);
  return <>
    <div style={{position: 'absolute', top: 150, width: W, textAlign: 'center'}}>
      <div style={{...font.bold, fontSize: 196, color: GREEN, textShadow: '0 0 40px rgba(82,255,122,0.5), 0 8px 30px rgba(0,0,0,0.6)', ...land(o, T.goated, 'slam')}}>GOATED</div>
    </div>
    <Emoji code="1f410" size={150} style={{left: 860, top: 70, transform: `scale(${pop(o, T.goated + 80, 9, 240)}) rotate(14deg)`}} />
    {o >= T.pen && <div style={{position: 'absolute', left: 260 + (1 - pp) * 900, top: 360, perspective: 900}}>
      <div style={{transform: `rotateZ(${-6 + (1 - pp) * 140}deg) rotateY(${(1 - pp) * 260 + Math.sin(o / 300) * 18}deg)`}}>
        <GoldPen len={580} spin={o / 160} />
      </div>
    </div>}
  </>;
};

// Trevor: "you know who told me that once?"
const WhoBehind = ({o}: {o: number}) => {
  if (o < T.trevor || o >= T.peyton) return null;
  return <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center', lineHeight: 0.85}}>
    <div style={{...font.sans, fontSize: 68, color: 'white', textShadow: glow, ...land(o, 12040, 'up')}}>you know</div>
    <div style={{...font.serifI, fontSize: 360, color: 'white', textShadow: glow, ...land(o, T.who, 'slam')}}>who</div>
    <div style={{...font.bold, fontSize: 92, color: 'white', textShadow: glow, ...land(o, T.told, 'up')}}>TOLD ME THAT?</div>
  </div>;
};

// "ironically, Peyton Manning did." Peyton rises behind Trevor
const PeytonBehind = ({o}: {o: number}) => {
  if (o < T.peyton || o >= T.phone) return null;
  const rise = pop(o, T.pName, 16, 90);
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: H, background: `radial-gradient(ellipse at 80% 70%, rgba(251,79,20,${0.35 * rise}) 0%, transparent 55%)`}} />
    <Img src={staticFile('cutouts/peyton.png')} style={{position: 'absolute', left: 540, top: 700 + (1 - rise) * 1100, height: 1150,
      filter: 'drop-shadow(0 0 40px rgba(251,79,20,0.6)) contrast(1.05) brightness(0.92)'}} />
    <div style={{position: 'absolute', top: 160, width: W, textAlign: 'center', lineHeight: 0.9}}>
      <div style={{...font.serifI, fontSize: 84, color: 'white', textShadow: glow, ...land(o, 14024, 'up')}}>ironically,</div>
      <div style={{...font.bold, fontSize: 236, color: 'white', textShadow: '0 0 60px rgba(251,79,20,0.6), 0 8px 30px rgba(0,0,0,0.6)', ...land(o, T.pName, 'slam')}}>PEYTON</div>
      <div style={{...font.serifI, fontSize: 170, ...goldText, ...land(o, T.manning, 'up')}}>Manning</div>
    </div>
  </>;
};
const MvpCounter = ({o}: {o: number}) => {
  if (o < T.mvp || o >= T.phone) return null;
  const n = Math.max(1, Math.min(5, Math.floor(interpolate(o, [T.mvp, T.mvp + 300], [1, 5.99], clamp))));
  return <div style={{position: 'absolute', left: 60, top: 1080, lineHeight: 0.85, ...land(o, T.mvp, 'left')}}>
    <div style={{...font.bold, fontSize: 210, ...goldText}}>{n}×</div>
    <div style={{...font.bold, fontSize: 70, color: 'white', letterSpacing: '0.04em', textShadow: glow}}>MVP</div>
  </div>;
};

// "he called me about something one time": Peyton calling
const Phone = ({o}: {o: number}) => {
  const lo = o - T.phone;
  const inP = pop(o, T.phone, 15, 130);
  const out = ease(o, T.phoneOut, 220);
  const buzzing = o >= T.buzz && o < T.accept && ((o - T.buzz) % 550) < 380;
  const bx = buzzing ? Math.sin(o * 1.7) * 9 : 0;
  const answered = o >= T.accept;
  const secs = answered ? Math.floor((o - T.accept) / 1000) + 1 : 0;
  const acc = pop(o, T.accept, 10, 260);
  return (
    <div style={{position: 'absolute', left: 270, top: 300, width: 540, height: 1120, perspective: 1600}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 86, background: '#050505', border: '10px solid #2b2b2e',
        boxShadow: '0 60px 120px rgba(0,0,0,0.8), 0 0 0 2px #555 inset', overflow: 'hidden',
        transform: `translateX(${bx - out * 900}px) translateY(${(1 - inP) * 1300}px) rotateY(${-14 + Math.sin(lo / 600) * 5 - out * 70}deg) rotateX(${6 + (1 - inP) * 25}deg)`,
        filter: `blur(${out * 12}px)`}}>
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, #FB4F14 0%, #7A2A10 35%, #0A1A3A 75%, #02050E 100%)', filter: 'blur(4px)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)'}} />
        <div style={{position: 'absolute', left: 185, top: 22, width: 150, height: 42, borderRadius: 21, background: 'black'}} />
        <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,0.75)'}}>
          {answered ? `0:0${secs}` : 'incoming call…'}</div>
        <div style={{position: 'absolute', top: 165, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 58, color: 'white', letterSpacing: '-0.02em'}}>Peyton Manning</div>
        <div style={{position: 'absolute', top: 240, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 26, color: GOLD, letterSpacing: '0.08em'}}>5× MVP · HALL OF FAME</div>
        <div style={{position: 'absolute', left: 120, top: 330, width: 280, height: 280, borderRadius: 140, overflow: 'hidden', background: '#FB4F14',
          boxShadow: buzzing ? '0 0 0 14px rgba(255,255,255,0.12), 0 0 0 30px rgba(255,255,255,0.06)' : '0 0 0 6px rgba(255,255,255,0.1)'}}>
          <Img src={staticFile('cutouts/peyton.png')} style={{position: 'absolute', left: -90, top: 10, width: 460}} />
        </div>
        {!answered ? <>
          <div style={{position: 'absolute', left: 60, top: 860, width: 130, height: 130, borderRadius: 65, background: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Img src={staticFile('emoji-ios/1f4de.png')} style={{width: 64, transform: 'rotate(135deg)'}} /></div>
          <div style={{position: 'absolute', right: 60, top: 860, width: 130, height: 130, borderRadius: 65, background: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${1 + 0.08 * Math.sin(o / 70)})`}}>
            <Img src={staticFile('emoji-ios/1f4de.png')} style={{width: 64}} /></div>
        </> : <div style={{position: 'absolute', left: 195, top: 860, width: 130, height: 130, borderRadius: 65, background: '#FF3B30', transform: `scale(${acc})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Img src={staticFile('emoji-ios/1f4de.png')} style={{width: 64, transform: 'rotate(135deg)'}} /></div>}
        {answered && [0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{position: 'absolute', left: 150 + i * 34, top: 700 - 30 * Math.abs(Math.sin(o / 90 + i)), width: 16,
          height: 60 * Math.abs(Math.sin(o / 90 + i)) + 10, borderRadius: 8, background: 'rgba(255,255,255,0.8)'}} />)}
      </div>
    </div>
  );
};

// payoff: "it's a BIG DEAL to have a nice signature"
const BigDealBehind = ({o}: {o: number}) => {
  if (o < T.itsA) return null;
  return <div style={{position: 'absolute', top: 90, width: W, textAlign: 'center', lineHeight: 0.8}}>
    <div style={{...font.sans, fontSize: 72, color: 'white', textShadow: glow, ...land(o, T.itsA, 'up')}}>it's a</div>
    <div style={{...font.bold, fontSize: 300, color: 'white', textShadow: glow, ...land(o, T.bigDeal, 'slam')}}>BIG</div>
    <div style={{...font.bold, fontSize: 300, ...goldText, ...land(o, T.deal, 'slam')}}>DEAL.</div>
  </div>;
};
const FinalSignature = ({o}: {o: number}) => {
  if (o < T.nice - 100) return null;
  const p = interpolate(o, [T.nice, STORY - 60], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const shine = o > STORY ? 0.5 + 0.5 * Math.sin((o - STORY) / 90) : 0;
  return <>
    <div style={{position: 'absolute', left: 90, top: 1130, filter: `drop-shadow(0 0 ${20 + shine * 30}px rgba(245,200,76,${0.4 + shine * 0.4}))`}}>
      <Signature text="Trevor Lawrence" w={900} size={210} p={p} pen />
    </div>
    {[[200, 1180, 70, STORY], [930, 1260, 80, STORY + 180], [560, 1120, 60, STORY + 360]].map(([x, y, s, at], i) =>
      <Sparkle key={i} x={x} y={y} s={s} o={o} at={at} />)}
  </>;
};

// ---- captions: one fixed spot, ≤3 words, keyword colour -----------------------------------------------------
const CAPS: [number, string, string?][] = [
  [3160, "LIKE, IT'S JUST"], [3740, 'AN A', 'A'], [4120, 'AND AN R', 'R'], [4680, "AND IT'S LIKE"], [4960, 'THIS BIG', 'BIG'],
  [5560, "AND IT'S LIKE,"], [5900, "THAT'S NO RESPECT", 'RESPECT'], [6720, 'AND NOT TO MENTION'], [7480, "IT'S SO"], [7740, 'CONSISTENT', 'CONSISTENT'],
  [10020, 'EVERY TIME'], [10500, "WE'RE ALWAYS LIKE"], [11080, "HE'S GOT A"], [11420, 'GOATED PEN', 'GOATED'],
  [12040, 'YOU KNOW WHO'], [12620, 'TOLD ME THAT ONCE?'], [14024, 'IRONICALLY,'], [14400, 'PEYTON MANNING', 'PEYTON MANNING'], [14985, 'DID.'],
  [15335, 'HE CALLED ME'], [15815, 'ABOUT SOMETHING'], [16295, 'ONE TIME,'], [16775, 'AND HE MENTIONED'], [17295, 'THAT TO ME.'],
  [17735, "HE'S LIKE, YOU KNOW,"], [18075, "IT'S"], [18735, 'A BIG DEAL', 'BIG DEAL'], [19175, 'TO HAVE A'], [19535, 'NICE SIGNATURE', 'NICE SIGNATURE'],
];
const CAP_OFF: [number, number][] = [[0, 3160], [T.broll, T.every], [6520, 6720], [8400, 8500], [11840, 12040], [13800, 14024]];
const Captions = ({o}: {o: number}) => {
  if (CAP_OFF.some(([a, b]) => o >= a && o < b)) return null;
  let i = -1;
  CAPS.forEach(([t], j) => { if (o >= t) i = j; });
  if (i < 0) return null;
  const [t, text, key] = CAPS[i];
  const s = pop(o, t, 11, 300);
  const color = key === 'RESPECT' ? RED : key === 'CONSISTENT' || key === 'GOATED' ? GREEN : GOLD;
  const parts = key ? text.split(key) : [text];
  return <div style={{position: 'absolute', top: 1560, width: W, textAlign: 'center', ...font.bold, fontWeight: 800, fontSize: 70, letterSpacing: '-0.03em',
    color: 'white', WebkitTextStroke: '3px black', paintOrder: 'stroke fill', textShadow: '0 6px 20px rgba(0,0,0,0.7)', transform: `scale(${0.8 + 0.2 * s})`}}>
    {parts.map((p, j) => <span key={j}>{p}{j < parts.length - 1 && <span style={{color}}>{key}</span>}</span>)}
  </div>;
};

// ---- sound -------------------------------------------------------------------------------------------------
type Sfx = {file: string; at: number; vol: number; peak: number};
const PEAK: Record<string, number> = {'fast-whoosh': 550, 'mg-whoosh': 780, 'mg-swoosh2': 0, 'mg-click': 300, 'mg-boom': 290, '808-boom': 120,
  'bass-boosted-vine-boom': 1430, 'ding-2': 200, 'mg-shimmer': 700, 'camera-shutter': 30, 'pen-scribble': 0, 'phone-buzz': 0};
const s = (file: string, at: number, vol: number): Sfx => ({file, at, vol, peak: PEAK[file]});
const SFX: Sfx[] = [
  s('mg-boom', 40, 0.4), s('mg-swoosh2', 420, 0.35),
  ...CUTS.map((t) => s('fast-whoosh', t, 0.42)),
  s('mg-click', 1180, 0.35), s('mg-click', 1520, 0.35), s('mg-click', 1860, 0.3),
  s('bass-boosted-vine-boom', T.ant, 0.55),
  s('mg-swoosh2', T.card + 40, 0.3), s('pen-scribble', T.a, 0.5), s('mg-click', T.amp, 0.3), s('pen-scribble', T.r, 0.5),
  s('mg-whoosh', T.big, 0.35), s('mg-click', T.big + 400, 0.4),
  s('808-boom', T.stamp, 0.55), s('mg-click', T.stamp, 0.4),
  s('mg-swoosh2', T.so, 0.25), s('mg-boom', T.cons, 0.32), ...[0, 1, 2, 3].map((i) => s('mg-click', T.cons + 120 + i * 140, 0.4)),
  s('mg-shimmer', T.beaut, 0.45),
  s('ding-2', T.goated, 0.5), s('mg-swoosh2', T.pen, 0.4),
  s('mg-click', T.who, 0.35), s('mg-boom', T.pName, 0.55), s('camera-shutter', T.pName + 60, 0.35),
  ...[0, 1, 2, 3].map((i) => s('mg-click', T.mvp + i * 75, 0.3)),
  s('phone-buzz', T.buzz, 0.6), s('mg-click', T.accept, 0.5),
  s('mg-swoosh2', T.itsA, 0.25), s('mg-boom', T.bigDeal, 0.55), s('808-boom', T.deal, 0.4),
  s('pen-scribble', T.nice, 0.55), s('pen-scribble', T.nice + 420, 0.45), s('mg-shimmer', STORY, 0.5),
];
const RISER_PEAK = 6390;
const SPEECH: [number, number][] = [[0, 2560], [3160, 8400], [8600, 9720], [10020, 11840], [12040, 13800], [14024, 15265], [15335, 20105]];
const talking = (o: number) => SPEECH.some(([a, b]) => o >= a - 120 && o <= b + 150);

// ---- composition ---------------------------------------------------------------------------------------------
export const E3Ant = () => {
  const frame = useCurrentFrame();
  const o = (frame / E3_FPS) * 1000;
  const total = f(E3_OUT_MS);
  const sh = shakeAt(o);
  const wh = whipAt(o);
  const inCard = o >= T.card && o < T.back;
  const inBroll = o >= T.broll && o < T.every;
  const inPhone = o >= T.phone && o < T.phoneOut + 220;
  const behind = <>
    <HookBehind o={o} />
    <WhoBehind o={o} />
    <PeytonBehind o={o} />
    <BigDealBehind o={o} />
  </>;
  const flash = Math.max(interpolate(o - T.pName, [0, 40, 160], [0, 0.85, 0], clamp), interpolate(o - T.stamp, [0, 30, 120], [0, 0.5, 0], clamp),
    interpolate(o - T.ant, [0, 30, 120], [0, 0.45, 0], clamp));
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x + wh.x}px, ${sh.y}px) scale(1.03)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        {!inBroll && <Cam o={o} behind={behind} blur={inCard ? 22 : inPhone ? 16 * Math.min(ease(o, T.phone, 200), 1 - ease(o, T.phoneOut, 220)) : 0} />}
        {inCard && <CardScene o={o} />}
        {inBroll && <Sequence from={f(T.broll)} durationInFrames={f(T.every) - f(T.broll)}><BRoll o={o} /></Sequence>}
        {inPhone && <Phone o={o} />}
        <LaughPops o={o} />
        <Stamp o={o} />
        <Consistent o={o} />
        <Goated o={o} />
        <MvpCounter o={o} />
        <FinalSignature o={o} />
      </AbsoluteFill>
      <Captions o={o} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 48%, rgba(4,4,12,0.7) 100%)', pointerEvents: 'none'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
        <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 30} /></filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
      {flash > 0 && <AbsoluteFill style={{background: 'white', opacity: flash}} />}
      {/* speech */}
      {SEGS.map(([a, b], i) => (
        <Sequence key={`v${i}`} from={f(segOut[i])} durationInFrames={f(segOut[i] + b - a) - f(segOut[i])}>
          <Audio src={staticFile(SRC)} trimBefore={f(a)} volume={(fr) => Math.min(1, (fr + 1) / 2, (f(b - a) - fr) / 2) * 1.05} />
        </Sequence>
      ))}
      {/* music: ducked under speech, dropped out right before the punchline, swells on the ending */}
      <Audio src={staticFile('music/du-bist-gut-genug.mp3')} loop volume={(fr) => {
        const t = (fr / E3_FPS) * 1000;
        const end = Math.min(1, (total - fr) / 12);
        if (t >= T.ant - 220 && t < T.ant + 220) return 0;
        if (t >= STORY) return 0.42 * end;
        return (talking(t) ? 0.11 : 0.28) * Math.min(1, fr / 4);
      }} />
      <Sequence from={f(T.pName - 2000)}>
        <Audio src={staticFile('sfx/cinematic-suspense-riser.mp3')} trimBefore={f(RISER_PEAK - 2000)} volume={(fr) => {
          const t = (fr / E3_FPS) * 1000;
          return t < 2000 ? 0.15 + 0.35 * (t / 2000) : Math.max(0, 0.5 - (t - 2000) / 400);
        }} />
      </Sequence>
      {SFX.map((x, i) => {
        const start = x.at - x.peak;
        const trim = Math.max(0, -start);
        return <Sequence key={`s${i}`} from={f(start + trim)}>
          <Audio src={staticFile(`sfx/${x.file}.mp3`)} trimBefore={f(trim)} volume={x.vol} />
        </Sequence>;
      })}
    </AbsoluteFill>
  );
};
