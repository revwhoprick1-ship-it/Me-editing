// Jorho motion graphics v4: three themes, one per reference editor, so no two videos look alike.
//   paper  (Mark Suy):  newspaper texture, tilted photo-print card, Playfair headlines, red marker circles/X's/stamps
//   grid   (Gary Vee):  dark grid, rounded glass card, Anton two-tone titles, orange chips, meters, pixel cursor
//   clean  (Elon):      light grey, lime accents, thin rings and labels, counters, minimal diagrams
// All box components use video-box coordinates (1080 x 1077).
import type {ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {MONT} from '../e3/bars';
import {clamp, ease, pop} from '../e3/kit';
import {BOX_H} from './kit';
import {LIME, ORANGE, RED_INK} from './mg';

const BW = 'grayscale(1) contrast(1.15)';
export type Theme = 'paper' | 'grid' | 'clean';

// ---- intro: the real footage plays inside a card on the theme background, then snaps full-frame on the strobe -----
export const cardTransform = (theme: Theme, o: number, to: number) => {
  if (o >= to) return {};
  const drift = o / 1000;
  const inP = ease(o, 0, 450);
  if (theme === 'paper') return {transform: `translate(0px, ${150 + (1 - inP) * 200}px) scale(0.6) rotate(${-4 + drift * 1.2}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,0.35)', outline: '18px solid #fbfaf6'};
  if (theme === 'grid') return {transform: `perspective(1600px) translate(-150px, 140px) scale(0.56) rotateY(${14 - drift * 3}deg) rotateZ(2deg)`, borderRadius: 40, overflow: 'hidden',
    boxShadow: `0 0 0 6px rgba(255,255,255,0.15), 0 40px 80px rgba(0,0,0,0.6)`};
  return {transform: `translate(0px, ${120 + (1 - inP) * 120}px) scale(${0.6 + 0.02 * drift})`, borderRadius: 48, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.18)'};
};

// newspaper texture: columns of grey "text" lines with a few photo blocks
export const PaperBg = ({seed = 1}: {seed?: number}) => (
  <AbsoluteFill style={{background: '#ece8df'}}>
    <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0, opacity: 0.55}}>
      {Array.from({length: 6}).flatMap((_, c) => Array.from({length: 70}).map((__, r) => {
        const w = 120 + ((r * 37 + c * 53 + seed * 11) % 50);
        return (r + c * 3) % 17 === 0 ? null : <rect key={`${c}-${r}`} x={20 + c * 178} y={20 + r * 15} width={w} height={6} fill="#8b877e" opacity={0.5 + ((r * c) % 5) / 10} />;
      }))}
      {[[200, 300, 150, 110], [740, 700, 170, 120], [380, 900, 140, 100]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#6d6a63" opacity={0.35} />)}
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(80,70,55,0.25) 100%)'}} />
  </AbsoluteFill>
);
export const GridBg = ({o}: {o: number}) => (
  <AbsoluteFill style={{background: '#0b0d0c', backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.06) 2px, transparent 2px)',
    backgroundSize: '90px 90px', backgroundPosition: `0 ${(o / 30) % 90}px`}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 55%, rgba(255,74,28,0.16), transparent 60%)'}} />
  </AbsoluteFill>
);
export const CleanBg = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #f7f7f7 0%, #e3e3e4 70%, #d6d6d8 100%)'}} />;

// red marker ellipse around an arbitrary box (paper theme)
export const Marker = ({o, at, x, y, w, h, color = RED_INK, rot = -4}: {o: number; at: number; x: number; y: number; w: number; h: number; color?: string; rot?: number}) => {
  if (o < at) return null;
  const p = ease(o, at, 320);
  const rx = w / 2, ry = h / 2, cx = x + rx, cy = y + ry;
  const d = `M ${cx - rx * 0.1} ${cy - ry} C ${cx + rx * 1.1} ${cy - ry * 1.1}, ${cx + rx * 1.1} ${cy + ry * 1.1}, ${cx} ${cy + ry} C ${cx - rx * 1.12} ${cy + ry}, ${cx - rx * 1.1} ${cy - ry * 1.2}, ${cx + rx * 0.3} ${cy - ry * 1.05}`;
  return <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <path d={d} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform={`rotate(${rot} ${cx} ${cy})`} />
  </svg>;
};
export const MarkerX = ({o, at, x, y, s}: {o: number; at: number; x: number; y: number; s: number}) => {
  if (o < at) return null;
  const a = ease(o, at, 160), b = ease(o, at + 160, 160);
  return <svg width={s} height={s} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <path d={`M 10 12 L ${s - 8} ${s - 14}`} stroke={RED_INK} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
    <path d={`M ${s - 12} 8 L 14 ${s - 10}`} stroke={RED_INK} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
  </svg>;
};
export const Stamp = ({o, at, text, x, y, rot = -12, size = 120}: {o: number; at: number; text: string; x: number; y: number; rot?: number; size?: number}) => {
  if (o < at) return null;
  const s = 2.2 - 1.2 * ease(o, at, 140);
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, (o - at) / 60), fontFamily: 'Anton', fontSize: size,
    color: RED_INK, border: `10px solid ${RED_INK}`, padding: '0 26px', lineHeight: 1.05, mixBlendMode: 'multiply', letterSpacing: '0.02em'}}>{text}</div>;
};
// a newspaper clipping with a B&W photo and a caption; pinned at an angle
export const Clipping = ({o, at, x, y, rot, file, label, bar, w = 270}: {o: number; at: number; x: number; y: number; rot: number; file?: string; label: string; bar?: boolean; w?: number}) => {
  if (o < at) return null;
  const s = pop(o, at, 12, 240);
  return <div style={{position: 'absolute', left: x, top: y, width: w, background: '#f7f4ec', padding: 14, boxShadow: '0 14px 28px rgba(0,0,0,0.3)', transform: `rotate(${rot}deg) scale(${s})`}}>
    <div style={{height: w * 0.82, background: '#d9d5cb', position: 'relative', overflow: 'hidden'}}>
      {file ? <Img src={staticFile(`img/jorho/${file}`)} style={{position: 'absolute', left: '50%', bottom: 0, height: '100%', transform: 'translateX(-50%)', filter: BW}} />
        : <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 110, color: '#2b2a27'}}>{label}</div>}
      {bar && <div style={{position: 'absolute', left: '18%', right: '18%', top: '34%', height: 30, background: RED_INK, transform: `scaleX(${ease(o, at + 250, 140)})`}} />}
    </div>
    <div style={{fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 38, color: '#1d1c1a', marginTop: 8, textAlign: 'center'}}>{label}</div>
  </div>;
};
// newspaper headline strip
export const Headline = ({o, at, to, text, sub, y = 70}: {o: number; at: number; to: number; text: ReactNode; sub?: string; y?: number}) => {
  if (o < at || o >= to) return null;
  return <div style={{position: 'absolute', left: 60, right: 60, top: y, background: '#f7f4ec', padding: '18px 28px 20px', boxShadow: '0 12px 26px rgba(0,0,0,0.3)',
    transform: `rotate(-1.5deg) translateY(${(1 - pop(o, at, 13, 240)) * -260}px)`}}>
    {sub && <div style={{fontFamily: 'Courier Prime', fontSize: 26, color: '#55524b', letterSpacing: '0.15em', borderBottom: '3px double #2b2a27', paddingBottom: 6, marginBottom: 8}}>{sub}</div>}
    <div style={{fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 72, lineHeight: 1.02, color: '#1d1c1a'}}>{text}</div>
  </div>;
};

// grid theme: a labelled meter (glass bar, lime fill, number ticks up)
export const Meter = ({o, at, label, value, x, y, w = 360}: {o: number; at: number; label: string; value: number; x: number; y: number; w?: number}) => {
  if (o < at) return null;
  const p = ease(o, at + 120, 700);
  return <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateX(${(1 - ease(o, at, 260)) * 80}px)`, opacity: ease(o, at, 200)}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Anton', fontSize: 44, color: '#fff'}}><span>{label}</span><span style={{color: LIME}}>{Math.round(value * p)}</span></div>
    <div style={{height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginTop: 6}}>
      <div style={{width: `${value * p}%`, height: '100%', background: LIME, boxShadow: `0 0 18px ${LIME}`}} /></div>
  </div>;
};
export const TwoTone = ({o, at, to, a, b, y = 60, size = 112}: {o: number; at: number; to: number; a: string; b: string; y?: number; size?: number}) => {
  if (o < at || o >= to) return null;
  return <div style={{position: 'absolute', top: y, width: 1080, textAlign: 'center', fontFamily: 'Anton', lineHeight: 0.98}}>
    <div style={{fontSize: size, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,0.6)', transform: `translateY(${(1 - pop(o, at, 12, 260)) * -60}px)`}}>{a}</div>
    <div style={{fontSize: size * 1.08, color: ORANGE, textShadow: '0 6px 0 rgba(0,0,0,0.6)', transform: `scale(${o < at + 200 ? 0 : pop(o, at + 200, 10, 260)})`}}>{b}</div>
  </div>;
};
// horizontal timeline with nodes that light up in turn (grid theme)
export const Timeline = ({o, from, to, stops}: {o: number; from: number; to: number; stops: [string, number][]}) => {
  if (o < from || o >= to) return null;
  const x0 = 110, x1 = 970, y = 150;
  const last = stops.filter(([, t]) => o >= t).length;
  const prog = interpolate(o, [stops[0][1], stops[stops.length - 1][1]], [0, 1], clamp);
  return <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', left: 40, right: 40, top: 70, height: 170, borderRadius: 24, background: 'rgba(8,10,9,0.72)', boxShadow: '0 0 0 3px rgba(255,255,255,0.08)',
      transform: `translateY(${(1 - pop(o, from, 13, 240)) * -220}px)`}} />
    <svg width={1080} height={300} style={{position: 'absolute', top: 0, left: 0, transform: `translateY(${(1 - pop(o, from, 13, 240)) * -220}px)`}}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={6} />
      <line x1={x0} y1={y} x2={x0 + (x1 - x0) * prog} y2={y} stroke={LIME} strokeWidth={6} />
      {stops.map(([, t], i) => <circle key={i} cx={x0 + ((x1 - x0) * i) / (stops.length - 1)} cy={y} r={i < last ? 18 : 12} fill={i < last ? LIME : '#333'} stroke="#fff" strokeWidth={3} />)}
    </svg>
    {stops.map(([label], i) => <div key={i} style={{position: 'absolute', top: 182, left: x0 + ((x1 - x0) * i) / (stops.length - 1) - 110, width: 220, textAlign: 'center',
      fontFamily: 'Anton', fontSize: 34, color: i < last ? '#fff' : 'rgba(255,255,255,0.35)', transform: `translateY(${(1 - pop(o, from, 13, 240)) * -220}px)`}}>{label}</div>)}
  </div>;
};
// a big title with a red bar striking through it (grid theme)
export const Struck = ({o, at, to, text}: {o: number; at: number; to: number; text: string}) => {
  if (o < at || o >= to) return null;
  return <div style={{position: 'absolute', top: 90, left: 40, right: 40, textAlign: 'center'}}>
    <div style={{display: 'inline-block', position: 'relative', fontFamily: 'Anton', fontSize: 96, lineHeight: 1.02, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,0.6)',
      transform: `scale(${pop(o, at, 12, 260)})`}}>{text}
      <div style={{position: 'absolute', left: -20, right: -20, top: '46%', height: 26, background: RED_INK, transform: `scaleX(${ease(o, at + 450, 200)}) rotate(-2deg)`, transformOrigin: '0 50%'}} />
    </div>
  </div>;
};

// clean theme: typed question, counter, ring of labels, a grid of plays
export const Typed = ({o, at, text, y = 70, size = 50, color = '#2b2c2e'}: {o: number; at: number; text: string; y?: number; size?: number; color?: string}) => {
  if (o < at) return null;
  const n = Math.min(text.length, Math.floor((o - at) / 32));
  return <div style={{position: 'absolute', left: 70, right: 70, top: y, fontFamily: MONT, fontWeight: 700, fontSize: size, color, lineHeight: 1.15, textAlign: 'center'}}>
    {text.slice(0, n)}<span style={{opacity: Math.floor(o / 300) % 2 ? 1 : 0, color: LIME}}>▍</span></div>;
};
export const Counter = ({o, at, to, from = 0, value, prefix, suffix, label, dark}: {o: number; at: number; to: number; from?: number; value: number; prefix?: string; suffix?: string; label: string; dark?: boolean}) => {
  if (o < at || o >= to) return null;
  const v = Math.round(interpolate(o, [at, at + 900], [from, value], {...clamp, easing: (t) => 1 - (1 - t) ** 3}));
  return <div style={{position: 'absolute', top: 70, width: 1080, textAlign: 'center', transform: `scale(${pop(o, at, 12, 240)})`}}>
    <div style={{display: 'inline-block', padding: '14px 46px 20px', borderRadius: 34, background: dark ? 'rgba(10,10,10,0.7)' : 'rgba(250,250,250,0.92)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>
      <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: dark ? '#fff' : '#2b2c2e'}}>{prefix}{v}{suffix}</div>
      <div style={{fontFamily: MONT, fontWeight: 700, fontSize: 36, color: dark ? LIME : '#5d6f2f', letterSpacing: '0.08em'}}>{label}</div>
    </div>
  </div>;
};
export const RingTags = ({o, from, to, center, tags}: {o: number; from: number; to: number; center: string; tags: [string, number][]}) => {
  if (o < from || o >= to) return null;
  const R = 300, cx = 540, cy = 430;
  return <AbsoluteFill>
    <CleanBg />
    <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0}}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#c9cacc" strokeWidth={3} strokeDasharray={`${2 * Math.PI * R * ease(o, from, 800)} 4000`} transform={`rotate(-90 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={R * 0.42} fill="none" stroke={LIME} strokeWidth={4} opacity={0.8} />
      {tags.map(([, t], i) => {
        const a = -Math.PI * 0.75 + (i / tags.length) * Math.PI * 2;
        return o >= t ? <line key={i} x1={cx + Math.cos(a) * R * 0.42} y1={cy + Math.sin(a) * R * 0.42} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R} stroke={LIME} strokeWidth={3}
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease(o, t, 220)} /> : null;
      })}
    </svg>
    <div style={{position: 'absolute', top: cy - 34, width: 1080, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 44, color: '#2b2c2e'}}>{center}</div>
    {tags.map(([label, t], i) => {
      if (o < t) return null;
      const a = -Math.PI * 0.75 + (i / tags.length) * Math.PI * 2;
      return <div key={i} style={{position: 'absolute', left: cx + Math.cos(a) * R, top: cy + Math.sin(a) * R - 34, whiteSpace: 'nowrap', translate: '-50% 0', textAlign: 'center',
        transform: `scale(${pop(o, t, 11, 280)})`}}>
        <span style={{fontFamily: MONT, fontWeight: 800, fontSize: 38, color: '#2b2c2e', background: '#fff', padding: '8px 22px', borderRadius: 40, boxShadow: `0 0 0 4px ${LIME}, 0 12px 24px rgba(0,0,0,0.12)`}}>{label}</span>
      </div>;
    })}
  </AbsoluteFill>;
};
// the whole playbook as tiles; the week's plays light up lime as the cursor picks them
export const PlayGrid = ({o, from, to, pickAt}: {o: number; from: number; to: number; pickAt: number}) => {
  if (o < from || o >= to) return null;
  const cols = 12, rows = 16, cell = 74;
  const picks = new Set([5, 17, 30, 44, 58, 71, 86, 99, 113, 128]);
  return <AbsoluteFill>
    <CleanBg />
    <div style={{position: 'absolute', top: 40, width: 1080, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 52, color: '#2b2c2e'}}>
      {o < pickAt ? 'THE WHOLE INVENTORY' : <span>THIS WEEK: <span style={{color: '#5d8f1f'}}>10 PLAYS</span></span>}</div>
    {Array.from({length: cols * rows}).map((_, i) => {
      const r = Math.floor(i / cols), c = i % cols;
      const t = from + (r * cols + c) * 4;
      if (o < t) return null;
      const on = picks.has(i) && o >= pickAt + [...picks].indexOf(i) * 60;
      const dim = o >= pickAt && !picks.has(i);
      return <div key={i} style={{position: 'absolute', left: 96 + c * cell, top: 130 + r * 56, width: cell - 12, height: 44, borderRadius: 8, background: on ? LIME : '#fff',
        opacity: dim ? 0.35 : 1, boxShadow: on ? `0 0 16px ${LIME}` : '0 3px 8px rgba(0,0,0,0.12)', transform: `scale(${on ? 1.12 : pop(o, t, 14, 300)})`,
        fontFamily: MONT, fontWeight: 800, fontSize: 18, color: '#6a6b6e', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{(r * 7 + c * 3) % 2 ? 'X' : 'O'}</div>;
    })}
  </AbsoluteFill>;
};
// lime corner brackets around the intro card (clean theme)
export const Brackets = ({o, to}: {o: number; to: number}) => {
  if (o >= to) return null;
  const b = 'solid 8px ' + LIME;
  const box = {position: 'absolute' as const, width: 70, height: 70};
  const s = 1 + 0.03 * Math.sin(o / 200);
  return <div style={{position: 'absolute', left: 190, top: 330, width: 700, height: 690, transform: `scale(${s})`}}>
    <div style={{...box, left: 0, top: 0, borderLeft: b, borderTop: b}} /><div style={{...box, right: 0, top: 0, borderRight: b, borderTop: b}} />
    <div style={{...box, left: 0, bottom: 0, borderLeft: b, borderBottom: b}} /><div style={{...box, right: 0, bottom: 0, borderRight: b, borderBottom: b}} />
  </div>;
};
