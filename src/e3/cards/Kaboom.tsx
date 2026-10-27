// Edit3 card pull · Trevor Lawrence Green Kaboom 1/1 (~$15,000) out of a $500 break.
// The Kaboom insert is drawn like a comic, so the whole edit is a comic: halftone, panel borders, caption boxes,
// a BOOM burst on every "boom" of the hook (Costco Guys), a KA-BOOM splash page at the reveal, speech bubbles on the
// hosts. Story graphic: $500 → $15,000 = 30×. Card blurred until the reveal; Alex narration (whisper + hype).
import type {CSSProperties} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import narr from '../../../public/narr/b3_kaboom.json';
import {Blurs, HookAudio, HookView, HostAudio, Narration, Riser, StreamView, cardTimeline, narrCaps, narrSpans, type NarrLine, type Placed} from '../cardkit';
import {Captions, FPS, Grain, H, Music, SfxTrack, W, clamp, ease, flashAt, land, pop, sfx, shakeAt, type Cap} from '../kit';

const SRC = 'b3/k_trevor_kaboom.mp4';
const SRC_W = 720;
const HOOK = {file: 'hooks/costco_guys_boom.mp4', from: 0, ms: 2900};
const tl = cardTimeline(HOOK.ms, [{src: [0, 2700]}, {src: [5200, 8800]}, {src: [8800, 10000], rate: 0.45}, {src: [10000, 12800]}, {src: [21000, 25000]}, {src: [36200, 39300]}]);
export const KABOOM_MS = tl.total;
const S = tl.segOut; // 2900 5600 9200 11867 14667 18667
const R = S[3]; // reveal
const LINES = narr as NarrLine[];
const PLACED: Placed[] = [{line: 1, at: S[2] + 100}, {line: 2, at: R + 250}];
const [L2, L3] = narrSpans(LINES, PLACED);
const T = {booms: [0, 1040, 1600, 2180, 2560], dollar: 4660, name: L3[0] + 60, kaboom: L3[0] + 1960, oneOf: L3[0] + 2820, price: L3[0] + 3920,
  no: 16587, heart: 17327, yo: 18467, sitting: 20447};
const YEL = '#FFE600';
const RED = '#E8262B';
const GRN = '#39D353';
const BANG = {fontFamily: 'Bangers', letterSpacing: '0.03em'} as const;
const ink = '0 0 0 #000, 4px 4px 0 #000';

// zoom/tremble per moment (output px focus = source px * 1.5)
const camAt = (o: number) => {
  const s = tl.srcAt(o);
  if (o >= S[2] && o < R) { const p = ease(o, S[2], R - S[2], Easing.in(Easing.quad)); return {z: 1 + 0.32 * p, x: 600, y: 1150, tr: p * 6}; }
  if (o >= R && o < S[4]) return s < 11000 ? {z: 1.45 - 0.2 * ease(o, R, 300), x: 607, y: 1260, tr: 0} : {z: 1.25, x: 560, y: 620, tr: 0};
  if (o >= S[5]) return {z: 1.55 + 0.1 * ease(o, S[5], 3000), x: 680, y: 1010, tr: 0};
  return {z: 1.03, x: 540, y: 960, tr: 0};
};

const Halftone = ({a = 0.18, color = '#000'}: {a?: number; color?: string}) => (
  <AbsoluteFill style={{opacity: a, backgroundImage: `radial-gradient(circle, ${color} 28%, transparent 30%)`, backgroundSize: '14px 14px', mixBlendMode: 'multiply', pointerEvents: 'none'}} />
);
const Panel = () => (
  <AbsoluteFill style={{border: '14px solid #0b0b0b', boxShadow: 'inset 0 0 0 6px #fff', pointerEvents: 'none'}} />
);
// spiky burst with a word in it
const Burst = ({x, y, r, text, fill, at, o, rot = 0, size}: {x: number; y: number; r: number; text: string; fill: string; at: number; o: number; rot?: number; size: number}) => {
  if (o < at) return null;
  const s = pop(o, at, 9, 260);
  const n = 14;
  const pts = Array.from({length: n * 2}).map((_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const rr = i % 2 ? r * 0.62 : r * (0.95 + 0.08 * Math.sin(i * 3.1));
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(' ');
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, transform: `scale(${s}) rotate(${rot}deg)`}}>
    <svg width={r * 2} height={r * 2} viewBox={`${-r} ${-r} ${r * 2} ${r * 2}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <polygon points={pts} fill={fill} stroke="#000" strokeWidth={8} strokeLinejoin="round" />
    </svg>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...BANG, fontSize: size, color: '#fff',
      WebkitTextStroke: '6px #000', paintOrder: 'stroke fill', textShadow: ink}}>{text}</div>
  </div>;
};
const CapBox = ({o, at, until, text, x, y, rot = -2, style}: {o: number; at: number; until: number; text: string; x: number; y: number; rot?: number; style?: CSSProperties}) => {
  if (o < at || o >= until) return null;
  return <div style={{position: 'absolute', left: x, top: y, background: YEL, border: '6px solid #000', padding: '10px 24px', ...BANG, fontSize: 58, color: '#000',
    transform: `rotate(${rot}deg) scale(${pop(o, at, 12, 240)})`, transformOrigin: '0 0', boxShadow: '8px 8px 0 #000', ...style}}>{text}</div>;
};
const Bubble = ({o, at, until, text, x, y, tail = 'left'}: {o: number; at: number; until: number; text: string; x: number; y: number; tail?: 'left' | 'right'}) => {
  if (o < at || o >= until) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${pop(o, at, 10, 260)})`}}>
    <div style={{background: '#fff', border: '6px solid #000', borderRadius: '50%', padding: '26px 40px', ...BANG, fontSize: 72, color: '#000'}}>{text}</div>
    <svg width={80} height={60} style={{position: 'absolute', [tail]: 60, bottom: -50} as CSSProperties}><polygon points={tail === 'left' ? '10,0 50,0 0,60' : '30,0 70,0 80,60'} fill="#fff" stroke="#000" strokeWidth={6} /></svg>
  </div>;
};

// KA-BOOM splash page
const Splash = ({o}: {o: number}) => {
  if (o < R || o >= S[4] + 400) return null;
  const lines = interpolate(o, [R, R + 900], [1, 0], clamp);
  const card = pop(o, R + 350, 13, 150);
  return <>
    {lines > 0 && <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: lines}}>
      {Array.from({length: 48}).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return <line key={i} x1={540 + Math.cos(a) * 260} y1={960 + Math.sin(a) * 260} x2={540 + Math.cos(a) * 1400} y2={960 + Math.sin(a) * 1400} stroke={i % 2 ? '#fff' : GRN} strokeWidth={i % 3 ? 6 : 14} />;
      })}
    </svg>}
    <Burst x={540} y={430} r={330} text="KA-BOOM!" fill={RED} at={R} o={o} rot={-6} size={150} />
    {o >= R + 350 && <div style={{position: 'absolute', left: 290, top: 760, width: 500, height: 644, transform: `translateY(${(1 - card) * 900}px) rotate(${4 - 2 * card}deg)`,
      border: '10px solid #000', boxShadow: '14px 14px 0 #000', background: '#000'}}>
      <Img src={staticFile('img/b3/kaboom_card.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${(o / 12) % 180 - 40}%, rgba(255,255,255,0.45) ${(o / 12) % 180 - 32}%, transparent ${(o / 12) % 180 - 24}%)`}} />
    </div>}
    {o >= T.oneOf && <div style={{position: 'absolute', left: 640, top: 1290, ...BANG, fontSize: 96, color: '#fff', background: RED, border: '7px solid #000', padding: '0 26px',
      transform: `rotate(-12deg) scale(${2.2 - 1.2 * ease(o, T.oneOf, 150)})`, boxShadow: '8px 8px 0 #000'}}>1 OF 1</div>}
    {o >= T.name && <div style={{position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center', ...BANG, fontSize: 110, color: YEL, WebkitTextStroke: '7px #000',
      paintOrder: 'stroke fill', textShadow: ink, ...land(o, T.name, 'slam')}}>TREVOR LAWRENCE</div>}
  </>;
};
// $500 → $15,000
const Math30 = ({o}: {o: number}) => {
  if (o < T.price) return null;
  const n = Math.round(interpolate(o, [T.price, T.price + 700], [500, 15000], {...clamp, easing: Easing.out(Easing.cubic)}));
  return <div style={{position: 'absolute', left: 60, right: 60, top: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, ...land(o, T.price, 'up')}}>
    <div style={{background: '#fff', border: '6px solid #000', padding: '6px 20px', ...BANG, fontSize: 64, color: '#000', boxShadow: '8px 8px 0 #000'}}>$500 BREAK</div>
    <div style={{...BANG, fontSize: 80, color: '#fff', WebkitTextStroke: '5px #000', paintOrder: 'stroke fill'}}>→</div>
    <div style={{background: GRN, border: '6px solid #000', padding: '6px 20px', ...BANG, fontSize: 64, color: '#000', boxShadow: '8px 8px 0 #000'}}>${n.toLocaleString('en-US')}</div>
    {o >= T.price + 800 && <div style={{position: 'absolute', right: 10, top: 92, ...BANG, fontSize: 120, color: YEL, WebkitTextStroke: '7px #000', paintOrder: 'stroke fill',
      transform: `rotate(8deg) scale(${pop(o, T.price + 800, 9, 260)})`}}>30×</div>}
  </div>;
};

const CAPS: Cap[] = [
  [S[0], 'THIS WAS A'], [4460, '$500 BREAK,', '$500', GRN],
  ...narrCaps(LINES, PLACED, 2, {'KIBOUM,': 'KABOOM,', '$15': '$15,000!', ',000.': ''}, {GREEN: GRN, KABOOM: GRN, 'ONE OF ONE': RED, '$15,000!': GRN}),
  [L3[1] + 80, 'NO, MY HEART', 'HEART', RED], [17567, 'IS DROPPED.'], [T.yo, 'YO!'], [18727, 'LOOK AT BUGSY.'], [19907, 'NO, IT WAS'], [T.sitting, 'SITTING IN THERE'],
  [21167, 'THE WHOLE TIME.', 'WHOLE TIME', YEL],
];

export const Kaboom = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const cam = camAt(o);
  const sh = shakeAt([[R, 26], [T.oneOf, 10], [T.price, 8], ...T.booms.map((b) => [b, 10] as [number, number])], o);
  const trem = cam.tr ? {x: Math.sin(o * 0.9) * cam.tr, y: Math.cos(o * 1.1) * cam.tr} : {x: 0, y: 0};
  const flash = flashAt([[R, 0.95]], o);
  const green = o >= S[2] && o < R ? ease(o, S[2], R - S[2]) * 0.35 : 0;
  const hostGain = (t: number) => (t < S[1] ? 1 : t < S[3] ? 0 : t >= L3[0] - 100 && t < L3[1] ? 0.2 : 0.95);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x + trem.x}px, ${sh.y + trem.y}px)`}}>
        {o < HOOK.ms ? <HookView file={HOOK.file} w={720} from={HOOK.from} cover={[90, 950, 540, 140]} push={1.04 + 0.05 * (o / HOOK.ms)} />
          : <AbsoluteFill style={{overflow: 'hidden'}}>
            <AbsoluteFill style={{transformOrigin: `${cam.x}px ${cam.y}px`, transform: `scale(${cam.z})`, filter: 'contrast(1.12) saturate(1.15)'}}>
              <StreamView src={SRC} srcW={SRC_W} tl={tl} />
              <Blurs tl={tl} o={o} srcW={SRC_W} boxes={[{src: [8800, 10000], box: [220, 480, 470, 660]}]} />
            </AbsoluteFill>
            {o >= S[4] && o < S[5] && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0 24%, transparent 26% 74%, rgba(0,0,0,0.85) 76%)'}} />}
          </AbsoluteFill>}
        <Halftone a={o < R ? 0.16 : 0.1} />
        {green > 0 && <AbsoluteFill style={{boxShadow: `inset 0 0 220px rgba(57,211,83,${green})`}} />}
        {T.booms.map((b, i) => o < HOOK.ms && <Burst key={i} x={[260, 820, 300, 780, 540][i]} y={[380, 560, 1180, 1340, 760][i]} r={[150, 160, 170, 180, 260][i]}
          text="BOOM!" fill={[YEL, RED, YEL, RED, GRN][i]} at={b} o={o} rot={[-12, 10, -6, 8, -4][i]} size={[64, 70, 74, 78, 110][i]} />)}
        <CapBox o={o} at={S[0] + 100} until={S[1]} text="MEANWHILE…" x={50} y={140} />
        <CapBox o={o} at={T.dollar} until={S[1]} text="A $500 BREAK" x={420} y={250} rot={3} style={{background: GRN}} />
        <CapBox o={o} at={S[1] + 100} until={S[2]} text="THE LAST PACK." x={60} y={150} />
        {o >= L2[0] + 1500 && o < R && <Bubble o={o} at={L2[0] + 1500} until={R} text="…GREEN?!" x={560} y={260} tail="left" />}
        <Splash o={o} />
        <Math30 o={o} />
        <Bubble o={o} at={T.no} until={T.heart} text="NO!" x={70} y={300} />
        <Bubble o={o} at={T.heart} until={S[5]} text="MY HEART!" x={500} y={280} tail="right" />
        {o >= HOOK.ms && <Panel />}
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, HOOK.ms], [R, S[4]]]} top={1600} anim="pop" keyColor={YEL}
        style={{...BANG, fontSize: 84, color: '#fff', WebkitTextStroke: '6px #000', paintOrder: 'stroke fill', textShadow: ink}} />
      {o < HOOK.ms && <div style={{position: 'absolute', top: 1500, width: W, textAlign: 'center', ...BANG, fontSize: 92, color: YEL, WebkitTextStroke: '6px #000',
        paintOrder: 'stroke fill', textShadow: ink, ...land(o, 300, 'slam')}}><span style={{color: '#fff'}}>$500 BREAK →</span> $??,???</div>}
      <Grain frame={frame} opacity={0.06} />
      {flash > 0 && <AbsoluteFill style={{background: o < R + 60 ? '#fff' : GRN, opacity: flash}} />}
      <HookAudio file={HOOK.file} from={HOOK.from} ms={HOOK.ms} vol={0.9} />
      <HostAudio src={SRC} tl={tl} gain={hostGain} />
      <Narration file="narr/b3_kaboom_loud.mp3" lines={LINES} placed={PLACED} />
      <Riser peakAt={R} lead={2400} vol={0.22} />
      {/* Midnight Club: 62.7 s drop on the reveal; cut right before it */}
      <Music file="midnight-club.mp3" songFrom={62700 - R} level={(t) => {
        if (t < HOOK.ms) return 0;
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= R - 350 && t < R) return 0;
        if (t >= L2[0] && t < R) return 0.05;
        if (t >= L3[0] && t < L3[1]) return 0.08 * end;
        return (t < R ? 0.14 : 0.3) * end;
      }} />
      <SfxTrack list={[
        sfx('fast-whoosh', S[0], 0.35), sfx('mg-click', T.dollar, 0.3), sfx('fast-whoosh', S[1], 0.3), sfx('mg-click', S[1] + 100, 0.25),
        sfx('heartbeat-loud', S[2] + 200, 0.35, R - S[2] - 300),
        sfx('mg-boom', R, 0.22), sfx('mg-swoosh2', R, 0.4), sfx('mg-shimmer', R + 350, 0.35), sfx('mg-click', T.oneOf, 0.4),
        sfx('cha-ching', T.price + 700, 0.4), sfx('mg-click', T.price + 800, 0.3),
        sfx('fast-whoosh', S[4], 0.3), sfx('mg-click', T.no, 0.25), sfx('mg-click', T.heart, 0.25), sfx('fast-whoosh', S[5], 0.3),
      ]} />
    </AbsoluteFill>
  );
};
