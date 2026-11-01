// Jorho motion-graphics layer (vault/02 Style Guide/Jorho style.md, "Motion graphics" section), from three editor
// showcase Shorts: the Elon "studio" card (light grey, black-and-white cut-out, lime orbit ring + nodes, big grey title),
// the Elon logo orbit diagram, the Gary Vee poster (dark grid, two-tone heavy title, red bar over the eyes, pixel hand
// cursor) and the Mark Suy annotations (red hand-drawn circle + underline on the key word).
// Box components draw in video-box coordinates (1080 x 1077); `over` components in full-frame coordinates.
import type {CSSProperties} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {MONT} from '../e3/bars';
import {clamp, ease, pop} from '../e3/kit';
import {BOX_H} from './kit';

export const LIME = '#B9F46E';
export const RED_INK = '#E3242B';
export const ORANGE = '#FF4A1C';
const BW = 'grayscale(1) contrast(1.12) brightness(1.04)';

// slow skyline silhouettes behind the studio subject (Elon card)
const Skyline = ({o}: {o: number}) => {
  const bs = [[120, 330], [190, 470], [265, 380], [330, 560], [420, 430], [640, 520], [720, 400], [790, 610], [870, 450], [950, 360]];
  return <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0, transform: `translateY(${-o / 120}px)`}}>
    <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cfd0d2" stopOpacity="0" /><stop offset="0.5" stopColor="#b9bbbe" stopOpacity="0.9" /><stop offset="1" stopColor="#e6e6e6" stopOpacity="0" /></linearGradient></defs>
    {bs.map(([x, h], i) => <g key={i}>
      <rect x={x} y={760 - h} width={78} height={h} fill="url(#fade)" />
      {Array.from({length: Math.floor(h / 34)}).map((_, j) => <rect key={j} x={x + 10} y={770 - h + j * 34} width={58} height={2} fill="#ffffff" opacity={0.35} />)}
    </g>)}
  </svg>;
};

// lime orbit ring with nodes; back half drawn behind the subject, front half in front
const Ring = ({o, cy, rx, ry, half}: {o: number; cy: number; rx: number; ry: number; half: 'back' | 'front'}) => {
  const n = 6;
  const a0 = o / 700;
  const grow = ease(o, 0, 500);
  return <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <path d={half === 'back' ? `M ${540 - rx} ${cy} A ${rx} ${ry} 0 0 1 ${540 + rx} ${cy}` : `M ${540 - rx} ${cy} A ${rx} ${ry} 0 0 0 ${540 + rx} ${cy}`}
      fill="none" stroke={LIME} strokeWidth={4} opacity={0.9 * grow} />
    {Array.from({length: n}).map((_, i) => {
      const a = a0 + (i / n) * Math.PI * 2;
      const front = Math.sin(a) > 0;
      if ((half === 'front') !== front) return null;
      const r = (front ? 26 : 18) * grow;
      return <circle key={i} cx={540 + Math.cos(a) * rx} cy={cy + Math.sin(a) * ry} r={r} fill={LIME} opacity={front ? 0.95 : 0.6}
        style={{filter: `drop-shadow(0 0 12px ${LIME})`}} />;
    })}
  </svg>;
};

// the hook card: studio backdrop, B&W cut-out, title + subtitle, orbit ring (Elon ref)
export const StudioCard = ({o, from, to, file, title, sub}: {o: number; from: number; to: number; file: string; title: string; sub: string}) => {
  if (o < from || o >= to) return null;
  const t = o - from;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #f4f4f4 0%, #dcdcdd 70%, #cfcfd1 100%)', overflow: 'hidden'}}>
    <Skyline o={t} />
    <Ring o={t} cy={800} rx={380} ry={95} half="back" />
    <Img src={staticFile(`img/jorho/${file}`)} style={{position: 'absolute', left: '50%', bottom: 0, height: 560, transform: `translateX(-50%) scale(${1.06 - 0.06 * ease(o, from, 700)})`,
      transformOrigin: '50% 100%', filter: `${BW} drop-shadow(0 18px 30px rgba(0,0,0,0.25))`}} />
    <Ring o={t} cy={800} rx={380} ry={95} half="front" />
    <div style={{position: 'absolute', top: 92, width: 1080, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 92, color: '#3b3c3e', letterSpacing: '-0.01em',
      transform: `translateY(${(1 - ease(o, from + 60, 420)) * 40}px)`, opacity: ease(o, from + 60, 260)}}>{title}</div>
    <div style={{position: 'absolute', top: 198, width: 1080, textAlign: 'center', fontFamily: MONT, fontWeight: 600, fontSize: 32, color: '#5d5f62',
      opacity: ease(o, from + 260, 300)}}>{sub}</div>
  </AbsoluteFill>;
};

// radial diagram (Elon logo orbit): a centre mark with avatars/labels popping in around it, thin grey arc
export type Node = {label: string; file?: string; at: number; bar?: boolean};
export const OrbitDiagram = ({o, from, to, center, nodes}: {o: number; from: number; to: number; center: string; nodes: Node[]}) => {
  if (o < from || o >= to) return null;
  const R = 300;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #f6f6f6 0%, #dedede 75%, #d2d2d3 100%)'}}>
    <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0}}>
      <circle cx={540} cy={540} r={R} fill="none" stroke="#c4c5c7" strokeWidth={3} strokeDasharray={`${2 * Math.PI * R * ease(o, from, 900)} 4000`} transform="rotate(-90 540 540)" />
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 540 - 90, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 150, color: '#3b3c3e',
      transform: `scale(${0.9 + 0.1 * pop(o, from, 12, 220)}) rotate(${Math.sin(o / 300) * 3}deg)`}}>{center}</div>
    {nodes.map((n, i) => {
      if (o < n.at) return null;
      const a = -Math.PI / 2 + (i / nodes.length) * Math.PI * 2;
      const x = 540 + Math.cos(a) * R, y = 540 + Math.sin(a) * R;
      const s = pop(o, n.at, 11, 260);
      return <div key={i} style={{position: 'absolute', left: x - 105, top: y - 105, width: 210, height: 210, transform: `scale(${s})`}}>
        <div style={{width: 210, height: 210, borderRadius: '50%', overflow: 'hidden', background: '#fff', border: `5px solid ${n.bar ? RED_INK : LIME}`,
          boxShadow: '0 12px 26px rgba(0,0,0,0.18)', position: 'relative'}}>
          {n.file ? <Img src={staticFile(`img/jorho/${n.file}`)} style={{position: 'absolute', left: '50%', bottom: 0, height: 200, transform: 'translateX(-50%)', filter: BW}} />
            : <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 70, color: '#3b3c3e'}}>{n.label}</div>}
          {n.bar && <div style={{position: 'absolute', left: 30, right: 30, top: 70, height: 34, background: RED_INK, transform: `scaleX(${ease(o, n.at + 250, 160)}) rotate(-3deg)`}} />}
        </div>
        <div style={{position: 'absolute', top: 218, width: 210, textAlign: 'center', fontFamily: MONT, fontWeight: 700, fontSize: 30, color: '#4a4b4e'}}>{n.label}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// Gary Vee poster: footage pushed back under a dark grid, heavy two-tone title on top
export const Poster = ({o, from, to, a, b}: {o: number; from: number; to: number; a: string; b: string}) => {
  if (o < from || o >= to) return null;
  return <AbsoluteFill>
    <AbsoluteFill style={{background: 'rgba(8,10,9,0.55)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.07) 2px, transparent 2px)',
      backgroundSize: '90px 90px', backgroundPosition: `${(o / 40) % 90}px 0`}} />
    <div style={{position: 'absolute', top: 70, width: 1080, textAlign: 'center', fontFamily: 'Anton', lineHeight: 0.98, letterSpacing: '0.005em'}}>
      <div style={{fontSize: 120, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,0.6)', transform: `translateY(${(1 - pop(o, from, 12, 260)) * -60}px)`}}>{a}</div>
      <div style={{fontSize: 132, color: ORANGE, textShadow: '0 6px 0 rgba(0,0,0,0.6)', transform: `scale(${o < from + 220 ? 0 : pop(o, from + 220, 10, 260)})`}}>{b}</div>
    </div>
  </AbsoluteFill>;
};

// chips that pop in one per word (poster typography), then optionally collapse into a single big stat
export const Chips = ({o, items, top, collapseAt, stat}: {o: number; items: [string, number][]; top: number; collapseAt?: number; stat?: string}) => {
  if (o < items[0][1]) return null;
  const col = collapseAt !== undefined && o >= collapseAt ? ease(o, collapseAt, 260) : 0;
  return <div style={{position: 'absolute', top, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>
    {col < 1 && items.map(([t, at], i) => o >= at && <div key={i} style={{fontFamily: 'Anton', fontSize: 64, color: i % 2 ? '#fff' : '#111', background: i % 2 ? ORANGE : '#fff',
      padding: '4px 24px', transform: `scale(${pop(o, at, 11, 280) * (1 - col)}) rotate(${i % 2 ? 2 : -2}deg)`, boxShadow: '0 8px 0 rgba(0,0,0,0.5)'}}>{t}</div>)}
    {col > 0 && stat && <div style={{fontFamily: 'Anton', fontSize: 170, color: '#fff', lineHeight: 1, textShadow: `0 8px 0 ${ORANGE}`, transform: `scale(${pop(o, collapseAt!, 10, 260)})`}}>{stat}</div>}
  </div>;
};

// pixel hand cursor (Gary Vee ref): glides in, taps at `at`
const HAND = ['....XX......', '...XWWX.....', '...XWWX.....', '...XWWXXX...', '...XWWXWWXX.', 'XX.XWWXWWXWX', 'XWXXWWWWWWWX', 'XWWXWWWWWWWX', '.XWWWWWWWWWX', '..XWWWWWWWX.', '...XWWWWWX..', '....XXXXXX..'];
export const Cursor = ({o, from, at, to, x, y, flip}: {o: number; from: number; at: number; to: number; x: number; y: number; flip?: boolean}) => {
  if (o < from || o >= to) return null;
  const p = ease(o, from, at - from);
  const tap = o >= at && o < at + 160 ? 0.88 : 1;
  const dx = (1 - p) * (flip ? -380 : 380);
  const px = 9;
  return <svg width={12 * px} height={12 * px} style={{position: 'absolute', left: x - 6 * px + dx, top: y + (1 - p) * 120, transform: `rotate(${flip ? 90 : -90}deg) scale(${tap})`,
    filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))'}}>
    {HAND.flatMap((row, j) => [...row].map((c, i) => c === '.' ? null : <rect key={`${i}-${j}`} x={i * px} y={j * px} width={px} height={px} fill={c === 'X' ? '#111' : '#fff'} />))}
  </svg>;
};

// red hand-drawn circle + underline around the caption word (Mark Suy ref); full-frame coordinates
export const HandCircle = ({o, at, to, y, w}: {o: number; at: number; to: number; y: number; w: number}) => {
  if (o < at || o >= to) return null;
  const p = ease(o, at, 300);
  const rx = w / 2 + 40, ry = 62;
  const d = `M ${540 - rx * 0.2} ${y - ry} C ${540 + rx * 1.05} ${y - ry * 1.1}, ${540 + rx * 1.08} ${y + ry * 1.05}, ${540} ${y + ry} C ${540 - rx * 1.1} ${y + ry * 0.95}, ${540 - rx * 1.05} ${y - ry * 1.15}, ${540 + rx * 0.35} ${y - ry * 1.02}`;
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    <path d={d} fill="none" stroke={RED_INK} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(-3 540 ${y})`} />
  </svg>;
};

// small "editor" frame grain so the graphics sit in the footage
export const Grain = ({frame, a = 0.05}: {frame: number; a?: number}) => (
  <AbsoluteFill style={{opacity: a, mixBlendMode: 'overlay', pointerEvents: 'none',
    backgroundImage: `repeating-radial-gradient(circle at ${(frame * 37) % 100}% ${(frame * 61) % 100}%, #fff 0 1px, #000 1px 3px)`}} />
);
export const style = (s: CSSProperties) => s;
export const fadeIn = (o: number, at: number, d = 200) => interpolate(o, [at, at + d], [0, 1], clamp);
