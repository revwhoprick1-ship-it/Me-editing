// Jorho v7 "hybrid podcast motion graphics" 2D kit (user, 2026-11-01): "every element does not have to be 3D … make
// sure it also looks like a podcast motion graphics style". Clean sticker cut-outs with white outlines, name pills,
// bold Anton keywords, iOS emoji pops, hand-drawn arrows, a neck-stretch gag. 3D is kept for 1-2 hero props a clip.
// All coordinates are inside the 1080x1077 video box.
import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, spring, staticFile} from 'remotion';

const FPS = 30;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const P7 = {TEAL: '#00A3AD', TEAL_D: '#004a56', GOLD: '#D7A22A', RED: '#E3242B', LIME: '#7BE84A', INK: '#0d1417'};
export const pop = (o: number, at: number, damping = 10, stiffness = 190) => (o < at ? 0 : spring({frame: ((o - at) / 1000) * FPS, fps: FPS, config: {damping, stiffness}}));
export const ez7 = (o: number, a: number, d: number) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
const outK = (o: number, to?: number, d = 160) => (to === undefined ? 1 : interpolate(o, [to - d, to], [1, 0], clamp));
const live = (o: number, at: number, to?: number) => o >= at && (to === undefined || o < to);
const OUTLINE = 'drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 16px 18px rgba(0,0,0,.5))';
const abs = (x: number, y: number, s: CSSProperties = {}): CSSProperties => ({position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', ...s});

// rounded name/label pill
export const Pill = ({o, at, to, text, x, y, bg = P7.TEAL, fg = '#fff', size = 40, rot = -2, icon}: {o: number; at: number; to?: number; text: string; x: number; y: number; bg?: string; fg?: string; size?: number; rot?: number; icon?: string}) => {
  if (!live(o, at, to)) return null;
  const p = pop(o, at, 11, 220) * outK(o, to);
  return <div style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, background: bg, color: fg, padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: size,
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, letterSpacing: 0.5, whiteSpace: 'nowrap', boxShadow: '0 10px 24px rgba(0,0,0,.45), inset 0 -5px 0 rgba(0,0,0,.18)',
    border: '4px solid #fff', display: 'flex', alignItems: 'center', gap: size * 0.3})}>
    {icon && <Img src={staticFile(`emoji-ios/${icon}.png`)} style={{width: size * 1.15, height: size * 1.15}} />}{text}</div>;
};

// big bold keyword (Anton, thick outline), slams in from big and settles with a slow float
export const Big = ({o, at, to, text, x, y, size = 130, color = '#fff', stroke = P7.INK, rot = -3, box}: {o: number; at: number; to?: number; text: ReactNode; x: number; y: number; size?: number; color?: string; stroke?: string; rot?: number; box?: string}) => {
  if (!live(o, at, to)) return null;
  const p = pop(o, at, 12, 240);
  const s = (1.7 - 0.7 * p) * outK(o, to) * (1 + Math.sin((o - at) / 500) * 0.015);
  return <div style={abs(x, y + Math.sin((o - at) / 420) * 4, {transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, p * 2), fontFamily: 'Anton', fontSize: size, lineHeight: 1,
    color, WebkitTextStroke: `${size * 0.06}px ${stroke}`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 ${stroke}, 0 14px 26px rgba(0,0,0,.55)`, whiteSpace: 'nowrap', textAlign: 'center',
    ...(box ? {background: box, padding: '0 22px 6px', borderRadius: 14, border: '5px solid #fff', WebkitTextStroke: '0px', textShadow: 'none', boxShadow: '0 12px 26px rgba(0,0,0,.5)'} : {})})}>{text}</div>;
};

// iOS emoji pop with a bob
export const Emoji = ({o, at, to, code, x, y, size = 150, rot = 0}: {o: number; at: number; to?: number; code: string; x: number; y: number; size?: number; rot?: number}) => {
  if (!live(o, at, to)) return null;
  const p = pop(o, at, 8, 200) * outK(o, to);
  return <Img src={staticFile(`emoji-ios/${code}.png`)} style={abs(x, y + Math.sin((o - at) / 300) * 10, {width: size, height: size, transform: `translate(-50%,-50%) rotate(${rot + Math.sin((o - at) / 350) * 8}deg) scale(${p})`, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,.45))'})} />;
};

// white-outlined photo cut-out sticker with an optional name pill under it
export const Sticker = ({o, at, to, src, x, y, w, rot = 0, label, bg = P7.TEAL, flip}: {o: number; at: number; to?: number; src: string; x: number; y: number; w: number; rot?: number; label?: string; bg?: string; flip?: boolean}) => {
  if (!live(o, at, to)) return null;
  const p = pop(o, at, 9, 200) * outK(o, to);
  return <div style={abs(x, y, {width: w, transform: `translate(-50%,-50%) rotate(${rot + Math.sin((o - at) / 280) * 2.5}deg) scale(${p})`})}>
    <Img src={staticFile(src)} style={{width: '100%', display: 'block', transform: flip ? 'scaleX(-1)' : undefined, filter: OUTLINE}} />
    {label && <div style={{position: 'absolute', left: '50%', bottom: -18, transform: 'translateX(-50%) rotate(-3deg)', background: bg, color: '#fff', border: '4px solid #fff', borderRadius: 40,
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.12, padding: `${w * 0.02}px ${w * 0.06}px`, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,.45)'}}>{label}</div>}
  </div>;
};

// hand-drawn curved arrow that draws itself on
export const Arrow7 = ({o, at, to, d, color = '#fff', w = 12}: {o: number; at: number; to?: number; d: string; color?: string; w?: number}) => {
  if (!live(o, at, to)) return null;
  const p = ez7(o, at, 380), k = outK(o, to);
  return <svg width={1080} height={1077} style={{position: 'absolute', inset: 0, opacity: k, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.5))'}}>
    <defs><marker id="ah7" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={color} /></marker></defs>
    <path d={d} pathLength={1} fill="none" stroke={P7.INK} strokeWidth={w + 8} strokeLinecap="round" strokeDasharray={`${p} 1`} />
    <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${p} 1`} markerEnd={p > 0.95 ? 'url(#ah7)' : undefined} />
  </svg>;
};

// emoji rain (falls from the top of the box)
export const Rain = ({o, at, to, code, n = 14}: {o: number; at: number; to: number; code: string; n?: number}) => {
  if (!live(o, at, to)) return null;
  return <>{Array.from({length: n}).map((_, i) => {
    const t = (o - at - i * 90) / 1000; if (t < 0) return null;
    const x = 60 + ((i * 397) % 960), y = -120 + t * t * 900 + t * 380;
    return <Img key={i} src={staticFile(`emoji-ios/${code}.png`)} style={{position: 'absolute', left: x, top: y, width: 90 + (i % 3) * 25, transform: `rotate(${t * 200 * (i % 2 ? 1 : -1)}deg)`}} />;
  })}</>;
};

// neck-stretch gag on a head-and-shoulders cut-out (ESPN headshot, 600x436): the neck band stretches, the head rises
export const Neck = ({o, at, to, src, x, y, w, from, amount, label, bg = P7.RED}: {o: number; at: number; to?: number; src: string; x: number; y: number; w: number; from: number; amount: number; label?: string; bg?: string}) => {
  if (!live(o, at, to)) return null;
  const h = (w * 436) / 600, cut = 0.6, band = 0.12;
  const s = amount * ez7(o, from, 900) + (o > from + 900 ? Math.sin((o - from) / 180) * 10 : 0);
  const p = pop(o, at, 9, 200) * outK(o, to);
  const k = (band * h + s) / (band * h);
  const img = (st: CSSProperties) => <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: h, ...st}} />;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - s, width: w, height: h + s, transform: `scale(${p})`, transformOrigin: '50% 100%', filter: OUTLINE}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: cut * h + 1, overflow: 'hidden'}}>{img({})}</div>
    <div style={{position: 'absolute', left: 0, top: cut * h, width: w, height: band * h + s + 1, overflow: 'hidden'}}>{img({transformOrigin: '0 0', transform: `translateY(${-cut * h * k}px) scaleY(${k})`})}</div>
    <div style={{position: 'absolute', left: 0, top: (cut + band) * h + s, width: w, height: (1 - cut - band) * h, overflow: 'hidden'}}>{img({transform: `translateY(${-(cut + band) * h}px)`})}</div>
    {label && <div style={{position: 'absolute', left: '50%', bottom: -14, transform: 'translateX(-50%) rotate(-3deg)', background: bg, color: '#fff', border: '4px solid #fff', borderRadius: 40,
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.11, padding: `${w * 0.015}px ${w * 0.06}px`, whiteSpace: 'nowrap'}}>{label}</div>}
  </div>;
};

// vertical ruler that measures up to a height
export const Ruler = ({o, at, to, x, y, h}: {o: number; at: number; to?: number; x: number; y: number; h: number}) => {
  if (!live(o, at, to)) return null;
  const hh = h * ez7(o, at, 700) * outK(o, to);
  return <div style={{position: 'absolute', left: x - 26, top: y - hh, width: 52, height: hh, background: '#F7D84A', border: '4px solid #fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,.5)'}}>
    {Array.from({length: Math.ceil(h / 24)}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, bottom: i * 24, width: i % 4 ? 18 : 32, height: 4, background: P7.INK}} />)}
  </div>;
};

// soft dark band behind 2D graphics so they read over the footage (top or bottom of the box)
export const Band = ({o, from, to, top = true, h = 360}: {o: number; from: number; to: number; top?: boolean; h?: number}) => {
  const a = interpolate(o, [from, from + 200, to - 200, to], [0, 1, 1, 0], clamp);
  if (a <= 0) return null;
  return <div style={{position: 'absolute', left: 0, width: 1080, height: h, [top ? 'top' : 'bottom']: 0, opacity: a,
    background: `linear-gradient(${top ? '180deg' : '0deg'}, rgba(0,20,26,.72), rgba(0,20,26,0))`}} />;
};
