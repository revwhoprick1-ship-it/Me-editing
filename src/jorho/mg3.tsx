// Jorho "active" motion kit (vault/02 Style Guide/Jorho style.md, v5). From YouTube Shorts references with
// non-stop animation:
//   Pavel Durov edit (qKJpQyj0D3c): kinetic words BEHIND the speaker in mixed type, a full-screen phone mockup with
//     the stat on it, a cream quote card with a B&W portrait and huge mixed serif type
//   Viral talking-head reel (UbdleuYhvac): glowing 3D icon orbs, two-size gradient captions
//   Content-ideas reel (z63j_EgCAf4): italic serif + bold sans glow words
// Rule: something new moves at least every ~1 s. All box components use video-box coordinates (1080 x 1077).
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {MONT} from '../e3/bars';
import {clamp, ease, pop} from '../e3/kit';
import {BOX_H} from './kit';
import {LIME, RED_INK} from './mg';

const BW = 'grayscale(1) contrast(1.15)';
const CREAM = '#f3ecdc';
export const PURPLE = '#a46bff';
const emo = (code: string, size: number, style?: CSSProperties) => <Img src={staticFile(`emoji-ios/${code}.png`)} style={{width: size, height: size, ...style}} />;

// ---- always-on texture: drifting dust + soft light sweep ------------------------------------------------------
export const Dust = ({o, a = 0.55}: {o: number; a?: number}) => (
  <svg width={1080} height={BOX_H} style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: a}}>
    {Array.from({length: 26}).map((_, i) => {
      const x = (i * 211 + o * (0.012 + (i % 5) * 0.004)) % 1080;
      const y = (i * 137 + 900 - o * (0.02 + (i % 3) * 0.01)) % BOX_H;
      return <circle key={i} cx={x} cy={(y + BOX_H) % BOX_H} r={1.5 + (i % 4)} fill="#fff" opacity={0.25 + 0.5 * Math.abs(Math.sin(o / 700 + i))} />;
    })}
  </svg>
);

// ---- kinetic words (used behind the speaker via the person matte) -----------------------------------------------
export type KWord = {text: string; at: number; x?: number; y: number; size: number; font?: string; italic?: boolean; color?: string; from?: 'left' | 'right' | 'up' | 'slam'; weight?: number};
export const Kinetic = ({o, to, words, shake}: {o: number; to: number; words: KWord[]; shake?: number}) => {
  if (o < words[0].at || o >= to) return null;
  const sh = shake && o >= shake ? Math.exp(-(o - shake) / 160) * 14 : 0;
  return <AbsoluteFill style={{transform: sh ? `translate(${Math.sin(o * 0.9) * sh}px, ${Math.cos(o * 1.1) * sh}px)` : undefined}}>
    {words.map((w, i) => {
      if (o < w.at) return null;
      const p = pop(o, w.at, 12, 240);
      const tr = w.from === 'left' ? `translateX(${(1 - p) * -700}px)` : w.from === 'right' ? `translateX(${(1 - p) * 700}px)` : w.from === 'up' ? `translateY(${(1 - p) * 300}px)`
        : `scale(${2.4 - 1.4 * ease(o, w.at, 170)})`;
      const drift = (o - w.at) * 0.02 * (i % 2 ? 1 : -1);
      return <div key={i} style={{position: 'absolute', top: w.y, left: 0, width: 1080, textAlign: 'center', whiteSpace: 'nowrap', fontFamily: w.font ?? 'Anton', fontStyle: w.italic ? 'italic' : 'normal',
        fontWeight: w.weight ?? 400, fontSize: w.size, lineHeight: 1, color: w.color ?? '#fff', transform: `${tr} translateX(${drift + (w.x ?? 0)}px)`, opacity: Math.min(1, (o - w.at) / 80)}}>{w.text}</div>;
    })}
  </AbsoluteFill>;
};

// ---- the cream quote card (Durov / Franklin frame) ---------------------------------------------------------------
export type QLine = {text: string; at: number; size: number; font?: string; italic?: boolean; color?: string};
export const QuoteCard = ({o, from, to, file, lines, sign, quote}: {o: number; from: number; to: number; file: string; lines: QLine[]; sign?: {text: string; at: number}; quote?: boolean}) => {
  if (o < from || o >= to) return null;
  const inP = pop(o, from, 14, 220);
  return <AbsoluteFill style={{background: CREAM, transform: `translateY(${(1 - inP) * BOX_H}px)`}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(120,96,60,0.25) 100%)'}} />
    <Img src={staticFile(`img/jorho/${file}`)} style={{position: 'absolute', left: '50%', top: 40, height: 430, transform: `translateX(-50%) scale(${1.08 - 0.08 * ease(o, from, 1200)})`, filter: `${BW} sepia(0.25)`,
      maskImage: 'linear-gradient(180deg, black 75%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, black 75%, transparent 100%)'}} />
    {quote && <div style={{position: 'absolute', left: 50, top: 450, fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 200, color: '#1d1a14', lineHeight: 1, opacity: ease(o, from + 200, 200)}}>“</div>}
    <div style={{position: 'absolute', top: 500, left: 40, right: 40, textAlign: 'center', color: '#1d1a14'}}>
      {lines.map((l, i) => o >= l.at && <div key={i} style={{fontFamily: l.font ?? 'Playfair Display', fontStyle: l.italic ? 'italic' : 'normal', fontWeight: l.font ? 400 : 900, fontSize: l.size, lineHeight: 0.98,
        color: l.color ?? '#1d1a14', letterSpacing: l.font === 'Anton' ? '0.01em' : '-0.01em', transform: `translateY(${(1 - pop(o, l.at, 13, 260)) * 60}px)`, opacity: ease(o, l.at, 140)}}>{l.text}</div>)}
    </div>
    {sign && o >= sign.at && <div style={{position: 'absolute', right: 40, bottom: 36, fontFamily: 'Allura', fontSize: 88, whiteSpace: 'nowrap', color: '#1d1a14',
      clipPath: `inset(0 ${100 - 100 * ease(o, sign.at, 650)}% 0 0)`}}>{sign.text}</div>}
  </AbsoluteFill>;
};

// ---- trading card with a signature that writes itself -------------------------------------------------------------
export const SigCard = ({o, at, x, y, rot, w = 300, sig, sigAt, file, frame = '#0a8c96', tiny}: {o: number; at: number; x: number; y: number; rot: number; w?: number; sig: string; sigAt: number;
  file: string; frame?: string; tiny?: boolean}) => {
  if (o < at) return null;
  const h = w * 1.4;
  const p = pop(o, at, 13, 230);
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateY(${(1 - p) * 700}px) rotate(${rot}deg)`, borderRadius: 14,
    background: `linear-gradient(150deg, ${frame}, #04363b)`, padding: 12, boxShadow: '0 24px 50px rgba(0,0,0,0.5)'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(180deg,#d9e6e7,#9fb8bb)'}}>
      <Img src={staticFile(`img/jorho/${file}`)} style={{position: 'absolute', left: '50%', bottom: 0, height: '78%', transform: 'translateX(-50%)', filter: 'contrast(1.05)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '22%', background: 'rgba(255,255,255,0.92)'}} />
      <div style={{position: 'absolute', left: tiny ? '64%' : '6%', right: tiny ? '6%' : '6%', bottom: tiny ? '4%' : '1%', fontFamily: 'Allura', fontSize: tiny ? w * 0.06 : w * 0.24, color: '#0b2a8a',
        whiteSpace: 'nowrap', clipPath: `inset(0 ${100 - 100 * ease(o, sigAt, tiny ? 250 : 800)}% 0 0)`}}>{sig}</div>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${(o / 9) % 220 - 60}%, rgba(255,255,255,0.45) ${(o / 9) % 220 - 50}%, transparent ${(o / 9) % 220 - 40}%)`}} />
    </div>
  </div>;
};

// ---- magnifier that drifts to a point and the ant that walks out of it -------------------------------------------------
export const Magnifier = ({o, from, to, x, y}: {o: number; from: number; to: number; x: number; y: number}) => {
  if (o < from || o >= to) return null;
  const p = ease(o, from, 600);
  const cx = x + (1 - p) * 300, cy = y + (1 - p) * -260;
  return <div style={{position: 'absolute', left: cx - 120, top: cy - 120, width: 240, height: 240}}>
    <div style={{width: 240, height: 240, borderRadius: '50%', border: '14px solid #1b1b1b', background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 60%)',
      boxShadow: '0 18px 30px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      {o >= from + 500 && <div style={{transform: `scale(${pop(o, from + 500, 10, 260)})`}}>{emo('1f41c', 140)}</div>}
    </div>
    <div style={{position: 'absolute', left: 200, top: 200, width: 40, height: 150, background: '#1b1b1b', borderRadius: 18, transform: 'rotate(-45deg)', transformOrigin: '20px 0'}} />
  </div>;
};
export const AntWalk = ({o, from, to}: {o: number; from: number; to: number}) => {
  if (o < from || o >= to) return null;
  const t = (o - from) / (to - from);
  return <>{[0, 1, 2].map((k) => {
    const tt = t - k * 0.12;
    if (tt < 0) return null;
    return <div key={k} style={{position: 'absolute', left: -120 + tt * 1300, top: 820 + Math.sin(tt * 18 + k) * 14 - k * 60, transform: `rotate(${90 + Math.sin(tt * 30) * 10}deg)`}}>{emo('1f41c', 90 - k * 15)}</div>;
  })}</>;
};

// ---- giant letters that slam in then shrink to "this big" with a ruler -----------------------------------------------
export const Letters = ({o, a, r, small, to}: {o: number; a: number; r: number; small: number; to: number}) => {
  if (o < a || o >= to) return null;
  const sh = o >= small ? ease(o, small, 350) : 0;
  const letter = (ch: string, at: number, x: number) => o >= at && <div style={{position: 'absolute', top: 150 + sh * 300, left: x + sh * (x < 540 ? 230 : -230), width: 420, textAlign: 'center',
    fontFamily: 'Playfair Display', fontWeight: 900, fontStyle: 'italic', fontSize: 560 - sh * 470, lineHeight: 1, color: '#fff', textShadow: '0 10px 0 rgba(0,0,0,0.45)',
    transform: `scale(${2 - ease(o, at, 160)})`, opacity: Math.min(1, (o - at) / 60)}}>{ch}</div>;
  return <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.25) 70%, transparent)'}} />
    {letter('A', a, 90)}{letter('R', r, 570)}
    {sh > 0 && <div style={{position: 'absolute', top: 470, left: 0, width: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: sh}}>
      <div style={{width: 260, height: 26, borderLeft: '6px solid #FFD84D', borderRight: '6px solid #FFD84D', borderBottom: '6px solid #FFD84D'}} />
      <div style={{fontFamily: 'Anton', fontSize: 60, color: '#FFD84D', marginTop: 6}}>THIS BIG 🤏</div>
    </div>}
  </AbsoluteFill>;
};

// ---- glowing 3D-ish orb with an icon (UbdleuYhvac) ---------------------------------------------------------------------
export const Orb = ({o, at, to, x, y, size, children, color = PURPLE}: {o: number; at: number; to: number; x: number; y: number; size: number; children: ReactNode; color?: string}) => {
  if (o < at || o >= to) return null;
  const s = pop(o, at, 11, 240);
  return <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${s})`}}>
    <svg width={size} height={size} style={{position: 'absolute', inset: 0, transform: `rotate(${o / 8}deg)`}}>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 6} fill="none" stroke={color} strokeWidth={6} strokeDasharray="30 18" opacity={0.9} />
    </svg>
    <div style={{position: 'absolute', inset: size * 0.12, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #ffffff, #d8d4ef 45%, #6f63a8 100%)`,
      boxShadow: `0 0 40px ${color}, inset -10px -14px 30px rgba(0,0,0,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </div>;
};

// ---- two-tier glow title (z63j / UbdleuYhvac caption look) ---------------------------------------------------------------
export const GlowTitle = ({o, at, to, small, big, y = 90}: {o: number; at: number; to: number; small: string; big: string; y?: number}) => {
  if (o < at || o >= to) return null;
  return <div style={{position: 'absolute', top: y, width: 1080, textAlign: 'center'}}>
    <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 54, color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.6)', transform: `translateY(${(1 - pop(o, at, 12, 240)) * -40}px)`}}>{small}</div>
    <div style={{fontFamily: 'Playfair Display', fontWeight: 900, fontStyle: 'italic', fontSize: 170, lineHeight: 1, background: `linear-gradient(90deg, #ff7ad9, ${PURPLE}, #5ad1ff)`,
      WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 22px ${PURPLE})`, transform: `scale(${o < at + 150 ? 0 : pop(o, at + 150, 10, 260)})`}}>{big}</div>
  </div>;
};

// ---- black silhouette with a question mark that reveals into the person -------------------------------------------------
export const Silhouette = ({o, from, reveal, to, file, x, h}: {o: number; from: number; reveal: number; to: number; file: string; x: number; h: number}) => {
  if (o < from || o >= to) return null;
  const r = o >= reveal ? ease(o, reveal, 250) : 0;
  const s = pop(o, from, 12, 220);
  return <div style={{position: 'absolute', left: x, bottom: 0, height: h, transform: `translateY(${(1 - s) * 500}px)`}}>
    <Img src={staticFile(`img/jorho/${file}`)} style={{height: '100%', filter: `brightness(${r}) drop-shadow(0 0 ${r ? 0 : 18}px rgba(255,255,255,0.6))`}} />
    {r < 1 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton', fontSize: 260, color: '#fff',
      opacity: 1 - r, transform: `rotate(${Math.sin(o / 200) * 8}deg)`}}>?</div>}
  </div>;
};

// ---- iPhone incoming-call mockup (Durov phone shot) ----------------------------------------------------------------------
export const PhoneCall = ({o, from, to, file, name}: {o: number; from: number; to: number; file: string; name: string}) => {
  if (o < from || o >= to) return null;
  const inP = pop(o, from, 13, 220);
  const buzz = Math.sin(o / 18) * 4 * (Math.floor(o / 600) % 2 ? 1 : 0);
  const ring = ((o - from) % 1200) / 1200;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2b6ed6 0%, #10305f 70%, #081a36 100%)'}}>
    <div style={{position: 'absolute', left: 230, top: 60, width: 620, height: 980, borderRadius: 90, background: '#0d0d0f', padding: 22, boxShadow: '0 0 0 6px #3a3a3e, 0 40px 80px rgba(0,0,0,0.55)',
      transform: `translateY(${(1 - inP) * 1100}px) rotate(${buzz * 0.4}deg) translateX(${buzz}px)`}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 70, overflow: 'hidden', background: 'linear-gradient(180deg, #4a5d73, #1c2633)'}}>
        <div style={{position: 'absolute', left: '50%', top: 16, width: 180, height: 46, borderRadius: 30, background: '#000', transform: 'translateX(-50%)'}} />
        <div style={{position: 'absolute', top: 110, width: '100%', textAlign: 'center', fontFamily: MONT, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,0.75)'}}>incoming call…</div>
        <div style={{position: 'absolute', left: '50%', top: 175, width: 260, height: 260, transform: 'translateX(-50%)'}}>
          <div style={{position: 'absolute', inset: -40 * ring, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.5)', opacity: 1 - ring}} />
          <div style={{width: 260, height: 260, borderRadius: '50%', overflow: 'hidden', background: '#c9d3df', position: 'relative'}}>
            <Img src={staticFile(`img/jorho/${file}`)} style={{position: 'absolute', left: '50%', bottom: 0, height: 250, transform: 'translateX(-50%)'}} /></div>
        </div>
        <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: MONT, fontWeight: 700, fontSize: 58, color: '#fff'}}>{name}</div>
        <div style={{position: 'absolute', top: 545, width: '100%', textAlign: 'center', fontFamily: MONT, fontWeight: 500, fontSize: 30, color: 'rgba(255,255,255,0.7)'}}>mobile</div>
        {[['#ff3b30', '✕', 120], ['#34c759', '✆', 400]].map(([c, ic, x], i) => <div key={i} style={{position: 'absolute', left: x as number, top: 760, width: 120, height: 120, borderRadius: '50%',
          background: c as string, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, color: '#fff', transform: `scale(${i ? 1 + 0.08 * Math.sin(o / 120) : 1})`}}>{ic}</div>)}
      </div>
    </div>
  </AbsoluteFill>;
};

export const fade = (o: number, a: number, b: number) => interpolate(o, [a, a + 150, b - 150, b], [0, 1, 1, 0], clamp);
export {LIME, RED_INK};
