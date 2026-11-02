// Jorho v17 "side quest" (user ref 2026-11-02, vt.tiktok.com/ZSgEuSfBD: a dot character with squash & stretch on a
// paper world that draws itself, flies through pink clouds into a starry night, falls like a comet, trail becomes brush
// lettering). Our own character: a little basketball with eyes. Same NBA GOAT beats; real footage at the usual moments.
import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {ez, io, on, sp} from './flat9';
import type {GoatK} from './stick12';
import {beatOf} from './styles13';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#26222e', PAPER = '#efe8dc';
// bounce physics: hop height and squash at contact
const hop = (t: number, period: number, h: number) => { const u = ((t % period) + period) % period / period; return {y: -4 * h * u * (1 - u), squash: u < 0.12 || u > 0.88 ? 1 - Math.abs(u < 0.5 ? 0.12 - u : u - 0.88) / 0.12 : 0}; };

// the hero: a basketball with eyes; squash/stretch, look direction, sweat, mood
const Ball = ({x, y, r = 46, squash = 0, stretch = 0, mood = 'calm', look = 0, sweat}: {x: number; y: number; r?: number; squash?: number; stretch?: number; mood?: 'calm' | 'wow' | 'worry'; look?: number; sweat?: number}) => {
  const sx = 1 + 0.35 * squash - 0.25 * stretch, sy = 1 - 0.3 * squash + 0.45 * stretch;
  return <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{position: 'absolute', left: x - r * 2, top: y - r * 2, overflow: 'visible'}}>
    <ellipse cx={0} cy={r + 6} rx={r * 0.9 * (1 + squash * 0.3)} ry={r * 0.18} fill="rgba(0,0,0,.12)" />
    <g transform={`translate(0 ${r * (1 - sy)}) scale(${sx} ${sy})`}>
      <circle r={r} fill="#ef6c2f" />
      <circle r={r} fill="url(#ballShade)" />
      <path d={`M ${-r} 0 Q 0 ${r * 0.18} ${r} 0 M 0 ${-r} Q ${r * 0.2} 0 0 ${r} M ${-r * 0.7} ${-r * 0.7} Q ${-r * 0.2} 0 ${-r * 0.7} ${r * 0.7} M ${r * 0.7} ${-r * 0.7} Q ${r * 0.2} 0 ${r * 0.7} ${r * 0.7}`} stroke="#7a2e10" strokeWidth={3} fill="none" opacity={0.55} />
      {[-1, 1].map((s) => <g key={s} transform={`translate(${s * r * 0.32 + look * r * 0.18} ${-r * 0.12})`}>
        <ellipse rx={r * 0.13} ry={mood === 'wow' ? r * 0.2 : r * 0.15} fill="#fff" /><circle cx={look * 3} cy={1} r={r * 0.07} fill={INK} />
        {mood === 'worry' && <path d={`M ${-r * 0.16} ${-r * 0.24} L ${r * 0.14} ${-r * 0.18 * s}`} stroke={INK} strokeWidth={3} />}</g>)}
      {mood === 'wow' && <ellipse cx={0} cy={r * 0.32} rx={r * 0.12} ry={r * 0.16} fill={INK} />}
    </g>
    {sweat !== undefined && <path d={`M ${r * 0.9} ${-r * 0.6 + (sweat % 1) * r} q 7 11 0 16 q -7 -5 0 -16 Z`} fill="#7cc8ff" opacity={1 - (sweat % 1)} />}
    <defs><radialGradient id="ballShade" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#fff" stopOpacity={0.35} /><stop offset="0.6" stopColor="#fff" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.25} /></radialGradient></defs>
  </svg>;
};
const Paper = ({children, bg = PAPER}: {children?: ReactNode; bg?: string}) => <div style={{position: 'absolute', inset: 0, background: bg, overflow: 'hidden'}}>
  {children}
  <svg width={1080} height={1077} style={{position: 'absolute', inset: 0, opacity: 0.22, mixBlendMode: 'multiply', pointerEvents: 'none'}}><filter id="paperN"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} seed={3} /><feColorMatrix type="saturate" values="0" /></filter><rect width={1080} height={1077} filter="url(#paperN)" /></svg>
  <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 160px rgba(80,60,40,.25)', pointerEvents: 'none'}} />
</div>;
// brush lettering revealed left→right like it's being written
const Write = ({o, at, d, text, x, y, size, color = INK, s}: {o: number; at: number; d: number; text: string; x: number; y: number; size: number; color?: string; s?: CSSProperties}) => {
  const p = io(o, at, d);
  return <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', fontFamily: 'Allura', fontSize: size, color, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, lineHeight: 1.1, ...s}}>{text}</div>;
};
const Cloud = ({x, y, s = 1, tint = '#fff'}: {x: number; y: number; s?: number; tint?: string}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: '0 0'}}>
    {[[0, 30, 70], [50, 0, 90], [120, 25, 70], [30, 40, 80]].map(([cx, cy, d], i) => <div key={i} style={{position: 'absolute', left: cx, top: cy, width: d, height: d, borderRadius: '50%', background: tint, boxShadow: '0 8px 0 rgba(0,0,0,.06)'}} />)}
  </div>
);
const Portrait = ({f, x, y, d, p = 1, ring = '#fff', glow}: {f: string; x: number; y: number; d: number; p?: number; ring?: string; glow?: string}) => (
  <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden', border: `6px solid ${ring}`, transform: `scale(${p})`, boxShadow: glow ? `0 0 40px ${glow}` : '0 10px 20px rgba(0,0,0,.18)', background: '#ddd'}}>
    <Img src={staticFile(`img/jorho/${f}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}} /></div>
);
const C3: [string, string][] = [['lebron.png', 'LeBron'], ['kobe.png', 'Kobe'], ['curry.png', 'Curry']];

export const GoatJourney = ({o, K}: {o: number; K: GoatK}) => {
  const b = beatOf(o, K); if (!b) return null;
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    {b === 'ask' && <Ask o={o} K={K} />}
    {b === 'options' && <Hills o={o} K={K} />}
    {b === 'think' && <Night o={o} K={K} />}
    {b === 'reveal' && <Fall o={o} K={K} />}
    {b === 'tension' && <Tension o={o} K={K} />}
  </div>;
};
type P = {o: number; K: GoatK};
// ball drops in, bounces to rest, the question writes itself in brush ink
const Ask = ({o, K}: P) => {
  const a = K.who + 600, t = o - a;
  const fall = Math.min(1, t / 350);
  const h = t < 350 ? {y: -600 * (1 - fall * fall), squash: 0} : hop(t - 350, 420 * (1 + (t - 350) / 900), 120 * Math.max(0, 1 - (t - 350) / 1100));
  return <Paper>
    <div style={{position: 'absolute', left: 120, top: 640, width: 840 * ez(o, a, 500), height: 4, background: INK, borderRadius: 2}} />
    <Ball x={540} y={590 + h.y} squash={h.squash} stretch={t < 350 ? 0.6 : 0} look={-0.4} mood={t > 900 ? 'wow' : 'calm'} />
    <Write o={o} at={a + 300} d={1100} text="who's the GOAT?" x={540} y={250} size={150} />
  </Paper>;
};
// a hill landscape draws itself; the ball hops from pedestal to pedestal past the usual answers
const Hills = ({o, K}: P) => {
  const a = K.greatest, t = o - a;
  const grow = ez(o, a, 600);
  const xs = [220, 540, 860];
  const seg = Math.min(2, Math.floor(t / 520)), u = (t % 520) / 520;
  const bx = t < 1560 ? xs[seg] + (xs[Math.min(2, seg + 1)] - xs[seg]) * (seg < 2 ? u : 0) : 860;
  const by = 420 - (seg < 2 && t < 1560 ? Math.sin(u * Math.PI) * 170 : 0);
  return <Paper>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: 'linear-gradient(#cfe3f2, #efe8dc)', opacity: grow}} />
    <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>
      <path d={`M 0 ${700 - 120 * grow} Q 270 ${560 - 140 * grow} 540 ${640 - 100 * grow} T 1080 ${600 - 120 * grow} V 1077 H 0 Z`} fill="#9fcf7a" />
      <path d={`M 0 ${780 - 80 * grow} Q 360 ${700 - 90 * grow} 720 ${760 - 70 * grow} T 1080 ${720 - 60 * grow} V 1077 H 0 Z`} fill="#7cb85e" />
    </svg>
    <div style={{position: 'absolute', left: 860, top: 70, width: 130, height: 130, borderRadius: '50%', background: '#ffcf4a', boxShadow: '0 0 60px rgba(255,200,60,.7)', transform: `scale(${sp(o, a + 200, 12, 160)}) rotate(${t / 40}deg)`}} />
    <Cloud x={120 + t * 0.04} y={90} s={0.9} /><Cloud x={520 - t * 0.03} y={160} s={0.7} />
    {xs.map((x, i) => <div key={i}>
      <div style={{position: 'absolute', left: x - 6, top: 480, width: 12, height: 160 * ez(o, a + 150 + i * 120, 400), background: '#6b4a2b', borderRadius: 6}} />
      <Portrait f={C3[i][0]} x={x} y={300} d={170} p={sp(o, a + 300 + i * 220, 11, 220)} />
      <div style={{position: 'absolute', left: x, top: 400, transform: `translateX(-50%) scale(${sp(o, a + 450 + i * 220, 11, 220)})`, fontFamily: 'Allura', fontSize: 64, color: INK}}>{C3[i][1]}?</div>
    </div>)}
    <Ball x={bx} y={by + 70} r={36} squash={seg < 2 && (u < 0.1 || u > 0.92) ? 0.8 : 0} look={0.8} />
  </Paper>;
};
// up through pink clouds into the night: candidates become stars, constellation lines connect, the ball floats thinking
const Night = ({o, K}: P) => {
  const a = K.think + 1200, t = o - a;
  const rise = io(o, a, 700); // camera passes through the clouds
  const stars = Array.from({length: 40}).map((_, i) => ({x: (i * 263) % 1080, y: (i * 151) % 640, r: 2 + (i % 3)}));
  const nodes = [[230, 220], [540, 140], [850, 230]];
  const lit = Math.floor(t / interpolate(o, [a, K.gotta], [500, 160], clamp)) % 3;
  return <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#141a3a, #2c2a5a 55%, #e9a3a8)'}}>
    {stars.map((s, i) => <div key={i} style={{position: 'absolute', left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, borderRadius: '50%', background: '#fff', opacity: 0.4 + 0.6 * Math.abs(Math.sin(o / 400 + i))}} />)}
    <div style={{position: 'absolute', left: 120, top: 70, width: 90, height: 90, borderRadius: '50%', boxShadow: '-22px 8px 0 0 #fdf3c8'}} />
    <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>
      {nodes.slice(0, -1).map(([x, y], i) => <line key={i} x1={x} y1={y} x2={nodes[i + 1][0]} y2={nodes[i + 1][1]} stroke="rgba(255,255,255,.6)" strokeWidth={3} strokeDasharray="6 8" pathLength={1} />)}
      <circle cx={540} cy={420} r={300} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={2} />
    </svg>
    {nodes.map(([x, y], i) => <Portrait key={i} f={C3[i][0]} x={x} y={y} d={i === lit ? 150 : 120} ring={i === lit ? '#ffe27a' : 'rgba(255,255,255,.5)'} glow={i === lit ? 'rgba(255,226,122,.9)' : undefined} />)}
    <Ball x={540 + Math.sin(t / 600) * 30} y={470 + Math.sin(t / 350) * 18} r={40} look={(lit - 1) * 0.8} mood="calm" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: 'Allura', fontSize: 80, color: '#fdf3c8'}}>{'hmm' + '.'.repeat(1 + (Math.floor(o / 300) % 3))}</div>
    {/* pink clouds the camera rises through */}
    <div style={{position: 'absolute', left: -80, top: 700 - rise * 900, width: 1300}}>{[0, 1, 2, 3, 4].map((i) => <Cloud key={i} x={i * 260} y={(i % 2) * 40} s={1.6} tint="#fde6e3" />)}</div>
  </div>;
};
// the ball falls like a comet back to the paper, lands on the top pedestal; Della appears; the trail writes his name
const Fall = ({o, K}: P) => {
  const a = K.gotta, d = K.della - 150;
  if (o < d) {
    const u = io(o, a, d - a);
    return <div style={{position: 'absolute', inset: 0, background: `linear-gradient(#2c2a5a, #e9a3a8 ${40 + u * 50}%, ${PAPER})`}}>
      <div style={{position: 'absolute', left: 540 - 6, top: -200 + u * 650, width: 12, height: 260, background: 'linear-gradient(transparent, #ffb36b)', borderRadius: 6}} />
      <Ball x={540} y={80 + u * 650} r={38} stretch={0.8} mood="wow" />
      {[0, 1, 2].map((i) => <Cloud key={i} x={i * 380 - 60} y={760 - u * 300} s={1.4} tint="#fde6e3" />)}
    </div>;
  }
  const t = o - d;
  const land = hop(t, 520, 70 * Math.max(0, 1 - t / 900));
  return <Paper>
    {Array.from({length: 26}).map((_, i) => { const q = (t - (i % 5) * 30) / 1000; if (q < 0) return null; const ang = (i / 26) * Math.PI * 2, v = 520 + (i % 3) * 120;
      return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(ang) * v * q, top: 300 + Math.sin(ang) * v * q + 700 * q * q, width: 14, height: 8, background: ['#ef6c2f', '#3d8bd8', '#f2c14e', INK][i % 4], transform: `rotate(${q * 500}deg)`, opacity: Math.max(0, 1 - q)}} />; })}
    <Portrait f="della.png" x={540} y={260} d={300} p={sp(o, d, 11, 220)} ring="#f2c14e" glow="rgba(242,193,78,.6)" />
    <Write o={o} at={d + 300} d={900} text="Dellavedova" x={540} y={520} size={130} />
    <div style={{position: 'absolute', left: 300, top: 640, width: 480, height: 4, background: INK, borderRadius: 2, transform: `scaleX(${ez(o, d, 400)})`}} />
    <Ball x={540 + 190 * Math.min(1, t / 900)} y={598 + land.y} r={34} squash={land.squash} mood="wow" look={-0.6} />
  </Paper>;
};
// tension: the ball trembles and sweats; "tension…" writes itself shakily
const Tension = ({o, K}: P) => {
  const a = K.tension - 200, j = Math.sin(o / 22) * 5;
  return <Paper bg="#e9e1d4">
    <div style={{position: 'absolute', left: 200, top: 640, width: 680, height: 4, background: INK}} />
    <Ball x={540 + j} y={590} r={56} mood="worry" sweat={(o - a) / 400} look={Math.sin(o / 300)} />
    <Write o={o} at={a + 100} d={800} text="the tension..." x={540 + j * 0.6} y={260} size={150} color="#8a1c1c" />
  </Paper>;
};
export {on};
