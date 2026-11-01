// Jorho v9 "flat motion design" (user, 2026-11-01): "I don't want realistic bro. I want motion graphics style animation
// and simplistic anims. Something like this https://vt.tiktok.com/ZSgwjsfpN/" (juneedit3d neumorphism ad: soft white UI,
// one accent colour, circle pops, typewriter text, colour wipes, line sweeps, rings, neumorphic cards, bouncy letters).
// Same Jorho frame/captions; this fills the video box (1080x1077) for most of the clip, Trevor shows on a few lines.
import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, spring, staticFile} from 'remotion';
import {SANS} from '../mgFonts';

const FPS = 30;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const F9 = {BG: '#E9EEF3', TEAL: '#00A3AD', TEAL_D: '#007C85', GOLD: '#D7A22A', RED: '#E3504F', INK: '#24323a', GREY: '#9aa7b2'};
export const ez = (o: number, a: number, d: number) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 4});
export const io = (o: number, a: number, d: number) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2)});
export const sp = (o: number, a: number, damping = 13, stiffness = 170) => (o < a ? 0 : spring({frame: ((o - a) / 1000) * FPS, fps: FPS, config: {damping, stiffness}}));
export const on = (o: number, a: number, b: number) => o >= a && o < b;
export const NEU = '16px 16px 34px #c3cad3, -16px -16px 34px #ffffff';
export const NEU_IN = 'inset 10px 10px 20px #c6ccd5, inset -10px -10px 20px #ffffff';
export const abs = (x: number, y: number, s: CSSProperties = {}): CSSProperties => ({position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', ...s});
export const T = (s: CSSProperties): CSSProperties => ({fontFamily: SANS, fontWeight: 800, color: F9.INK, letterSpacing: -0.5, whiteSpace: 'nowrap', ...s});

// ---- primitives ------------------------------------------------------------------------------------------------------------
export const Fill = ({c}: {c: string}) => <div style={{position: 'absolute', inset: 0, background: c}} />;
// circle wipe from a point (the ref's main transition)
export const Wipe = ({o, at, c, x = 540, y = 538, d = 520}: {o: number; at: number; c: string; x?: number; y?: number; d?: number}) => {
  const r = io(o, at, d) * 1600;
  return r <= 0 ? null : <div style={{position: 'absolute', inset: 0, background: c, clipPath: `circle(${r}px at ${x}px ${y}px)`}} />;
};
// diagonal line sweep (white bar shooting across)
export const Sweep = ({o, at, c = '#fff'}: {o: number; at: number; c?: string}) => {
  const t = (o - at) / 450;
  if (t < 0 || t > 1) return null;
  return <div style={{position: 'absolute', left: -400 + t * 1900, top: -200, width: 46, height: 1500, background: c, transform: 'rotate(35deg)', boxShadow: '0 0 30px rgba(0,0,0,.15)'}} />;
};
export const Typer = ({o, at, text, cps = 22, s, caret = F9.TEAL}: {o: number; at: number; text: string; cps?: number; s: CSSProperties; caret?: string}) => {
  if (o < at) return null;
  const n = Math.min(text.length, Math.floor(((o - at) / 1000) * cps));
  const blink = Math.floor(o / 300) % 2 === 0 || n < text.length;
  return <div style={{...T({}), ...s, display: 'flex', alignItems: 'center'}}>{text.slice(0, n)}<span style={{display: 'inline-block', width: 7, height: '0.9em', background: caret, marginLeft: 6, opacity: blink ? 1 : 0}} /></div>;
};
export const Letters = ({o, at, text, size, color, x, y, gap = 0.06}: {o: number; at: number; text: string; size: number; color: string; x: number; y: number; gap?: number}) => (
  <div style={abs(x, y, {display: 'flex'})}>{text.split('').map((ch, i) => {
    const p = sp(o, at + i * 70, 11, 210);
    return <span key={i} style={{...T({fontSize: size, color}), display: 'inline-block', transform: `translateY(${(1 - p) * -120}px) rotate(${(1 - p) * (i % 2 ? 25 : -25)}deg)`, opacity: Math.min(1, p * 2), marginRight: size * gap}}>{ch === ' ' ? ' ' : ch}</span>;
  })}</div>
);
export const Pill = ({o, at, to, text, x, y, bg = F9.TEAL, fg = '#fff', size = 38, icon}: {o: number; at: number; to?: number; text: string; x: number; y: number; bg?: string; fg?: string; size?: number; icon?: string}) => {
  if (o < at || (to && o >= to)) return null;
  const p = sp(o, at, 14, 200) * (to ? 1 - ez(o, to - 200, 200) : 1);
  return <div style={abs(x, y, {transform: `translate(-50%,-50%) scale(${p})`, background: bg, color: fg, borderRadius: 60, padding: `${size * 0.32}px ${size * 0.75}px`, ...T({fontSize: size, color: fg}),
    boxShadow: bg === F9.BG ? NEU : '0 14px 30px rgba(0,124,133,.35)', display: 'flex', alignItems: 'center', gap: 12})}>
    {icon && <Img src={staticFile(`emoji-ios/${icon}.png`)} style={{width: size * 1.1}} />}{text}</div>;
};
export const Ring = ({p, r, w = 16, c = F9.TEAL, track = 'rgba(0,0,0,.07)'}: {p: number; r: number; w?: number; c?: string; track?: string}) => {
  const L = 2 * Math.PI * r;
  return <svg width={2 * r + w} height={2 * r + w} style={{transform: 'rotate(-90deg)', overflow: 'visible'}}>
    <circle cx={r + w / 2} cy={r + w / 2} r={r} fill="none" stroke={track} strokeWidth={w} />
    <circle cx={r + w / 2} cy={r + w / 2} r={r} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} />
  </svg>;
};
export const Ball = ({x, y, s = 1, rot = 0, c = '#8a4b22'}: {x: number; y: number; s?: number; rot?: number; c?: string}) => (
  <svg width={110 * s} height={66 * s} viewBox="0 0 110 66" style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot}deg)`, filter: 'drop-shadow(0 10px 12px rgba(0,0,0,.18))'})}>
    <ellipse cx={55} cy={33} rx={52} ry={30} fill={c} /><path d="M33 33 H77" stroke="#fff" strokeWidth={4} strokeLinecap="round" />{[42, 50, 58, 66].map((q) => <path key={q} d={`M${q} 26 V40`} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />)}
  </svg>
);
// flat person (circle head + rounded body), optional number
export const Person = ({x, y, s = 1, c = F9.TEAL, num, face = '#fff', hop = 0}: {x: number; y: number; s?: number; c?: string; num?: string; face?: string; hop?: number}) => (
  <div style={abs(x, y - hop, {width: 120 * s, height: 190 * s})}>
    <div style={{position: 'absolute', left: 30 * s, top: 0, width: 60 * s, height: 60 * s, borderRadius: '50%', background: face === '#fff' ? c : face, boxShadow: 'inset -6px -8px 0 rgba(0,0,0,.12)'}} />
    <div style={{position: 'absolute', left: 8 * s, top: 68 * s, width: 104 * s, height: 122 * s, borderRadius: `${50 * s}px ${50 * s}px ${22 * s}px ${22 * s}px`, background: c, boxShadow: 'inset -8px -10px 0 rgba(0,0,0,.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 46 * s, color: '#fff'})}}>{num}</div>
  </div>
);
export const Card = ({x, y, w, h, children, p = 1, inset}: {x: number; y: number; w: number; h: number; children?: ReactNode; p?: number; inset?: boolean}) => (
  <div style={abs(x, y, {width: w, height: h, borderRadius: 44, background: F9.BG, boxShadow: inset ? NEU_IN : NEU, transform: `translate(-50%,-50%) translateY(${(1 - p) * 80}px) scale(${0.9 + 0.1 * p})`, opacity: p})}>{children}</div>
);
export const Arrow = ({d, p, c = F9.TEAL, w = 10, dash}: {d: string; p: number; c?: string; w?: number; dash?: boolean}) => {
  const id = `m${c.slice(1)}${Math.round(w)}${dash ? 'd' : ''}`;
  return <svg width={1080} height={1077} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <defs>
      <marker id={`ah${id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={c} /></marker>
      <mask id={id} maskUnits="userSpaceOnUse" x={-200} y={-200} width={1480} height={1480}><path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={w + 6} strokeDasharray={`${p} 1`} /></mask>
    </defs>
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash ? '22 18' : undefined} mask={`url(#${id})`} markerEnd={p > 0.97 ? `url(#ah${id})` : undefined} />
  </svg>;
};

// ---- the clip's animation layer --------------------------------------------------------------------------------------------
export type Flat9K = {S: number[]; throw0: number; left0: number; right0: number; kid: number; coachRight: number; most: number; hated: number;
  threw: number; leftB: number; onlyRight: number; rolling: number; worked: number; much: number; best: number; end: number};
export const LeftyFlat = ({o, K}: {o: number; K: Flat9K}) => {
  const S = K.S;
  const endA = K.best + 1250;
  if (on(o, S[1], S[2]) || on(o, S[4], S[5]) || on(o, S[7], endA)) return null; // real footage lines
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    {o < S[1] && <Hook o={o} K={K} />}
    {on(o, S[2], S[3]) && <Kid o={o} K={K} />}
    {on(o, S[3], S[4]) && <Coach o={o} K={K} />}
    {on(o, S[5], S[6]) && <Reps o={o} K={K} />}
    {on(o, S[6], S[7]) && <SoMuch o={o} K={K} />}
    {o >= endA && <EndCard o={o} K={K} a={endA} />}
  </div>;
};
type P = {o: number; K: Flat9K};

// HOOK: ball pops, flies LEFT on a dashed arc; LEFT | RIGHT switch snaps LEFT; RIGHT struck; bars LEFT > RIGHT
const Hook = ({o, K}: P) => {
  const pop = sp(o, 0, 12, 230);
  const fly = io(o, K.throw0 - 80, 650);
  const knob = io(o, K.left0 - 120, 380);
  const sw = sp(o, 650, 15, 190);
  const strike = ez(o, K.right0, 260);
  const bars = ez(o, K.right0 + 250, 600);
  const bx = 540 - 380 * fly, by = 210 - Math.sin(fly * Math.PI) * 120 + fly * 20;
  return <>
    <Fill c={F9.BG} />
    <div style={abs(540, 210, {width: 190 * pop * (1 - fly), height: 190 * pop * (1 - fly), borderRadius: '50%', background: F9.TEAL, boxShadow: '0 20px 40px rgba(0,163,173,.35)'})} />
    {fly > 0 && <><Arrow d="M 540 210 Q 350 40 160 230" p={fly} c={F9.TEAL} w={8} dash /><Ball x={bx} y={by} s={1.1} rot={-25 - fly * 40} /></>}
    <div style={abs(540, 430, {width: 700, height: 150, borderRadius: 80, background: F9.BG, boxShadow: NEU_IN, opacity: sw, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * sw})`})}>
      <div style={{position: 'absolute', top: 15, left: 15 + (1 - knob) * 340, width: 330, height: 120, borderRadius: 60, background: knob > 0.5 ? F9.TEAL : F9.BG, boxShadow: knob > 0.5 ? '0 12px 26px rgba(0,163,173,.45)' : NEU}} />
      <div style={{position: 'absolute', left: 15, top: 15, width: 330, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 52, color: knob > 0.5 ? '#fff' : F9.GREY})}}>LEFT{knob > 0.95 ? ' ✓' : ''}</div>
      <div style={{position: 'absolute', right: 15, top: 15, width: 330, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 52, color: strike > 0 ? F9.RED : F9.GREY})}}>
        <span style={{position: 'relative'}}>RIGHT<span style={{position: 'absolute', left: -8, top: '52%', height: 8, width: `${strike * 112}%`, background: F9.RED, borderRadius: 4}} /></span></div>
    </div>
    {bars > 0 && [['LEFT', 1, F9.TEAL], ['RIGHT', 0.72, F9.GREY]].map(([l, v, c], i) => (
      <div key={i} style={{position: 'absolute', left: 170, top: 560 + i * 64, display: 'flex', alignItems: 'center', gap: 18, opacity: bars}}>
        <div style={T({fontSize: 30, width: 110, color: F9.INK})}>{l as string}</div>
        <div style={{width: 600 * (v as number) * bars, height: 34, borderRadius: 17, background: c as string}} />
      </div>))}
  </>;
};
// KID: teal wipe, typewriter, little #16 pops
const Kid = ({o, K}: P) => {
  const a = K.S[2];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a} c={F9.TEAL} y={760} />
    <Typer o={o} at={a + 250} text="back when I was a kid" cps={26} caret="#fff" s={{position: 'absolute', left: 120, top: 120, fontSize: 64, color: '#fff'}} />
    <Person x={480} y={420 + (1 - sp(o, K.kid - 300, 10, 200)) * 600} s={1.75} c="#ffffff" face="#ffd6b0" num="16" hop={Math.abs(Math.sin((o - a) / 260)) * 28} />
    <Ball x={700} y={470 - Math.abs(Math.sin((o - a) / 260 + 1)) * 80} s={0.9} rot={(o - a) / 8} />
    <Pill o={o} at={K.kid} text="LIL TREVOR" x={540} y={655} bg="#fff" fg={F9.TEAL} size={40} />
  </>;
};
// COACH: playbook card, the rollout arrow draws to the RIGHT; then everyone slides right
const Coach = ({o, K}: P) => {
  const a = K.S[3];
  const pc = sp(o, a + 100, 15, 170);
  const out = io(o, K.most - 300, 450);
  const draw = ez(o, K.coachRight - 600, 800);
  const crowd = o >= K.most - 150;
  return <>
    <Fill c={F9.BG} /><Sweep o={o} at={a - 150} c={F9.TEAL} />
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${-out * 900}px)`}}>
      <Card x={540} y={350} w={860} h={560} p={pc}>
        <div style={{position: 'absolute', left: 40, top: 30, display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{width: 64, height: 64, borderRadius: 32, background: F9.TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 30, color: '#fff'})}}>C</div>
          <div style={T({fontSize: 38})}>Coach's playbook</div>
        </div>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 230 + i * 85, top: 330, width: 56, height: 56, borderRadius: 28, border: `7px solid ${F9.INK}`, boxSizing: 'border-box', transform: `scale(${sp(o, a + 250 + i * 70, 12, 220)})`}} />)}
        <div style={{position: 'absolute', left: 400, top: 420, width: 60, height: 60, borderRadius: 30, background: F9.TEAL, transform: `scale(${sp(o, a + 650, 12, 220)})`, ...T({fontSize: 24, color: '#fff'}), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>QB</div>
        {[[220, 180], [430, 150], [640, 180]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, ...T({fontSize: 64, color: F9.GREY}), transform: `scale(${sp(o, a + 400 + i * 80, 12, 220)})`}}>×</div>)}
        <svg width={860} height={560} style={{position: 'absolute', inset: 0}}>
          <path d="M 460 450 C 560 470 650 440 760 360" fill="none" stroke={F9.RED} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
          {draw > 0.97 && <path d="M 760 360 l -34 4 l 22 26 z" fill={F9.RED} />}
        </svg>
      </Card>
      <Pill o={o} at={K.coachRight} text="ROLL RIGHT →" x={700} y={670} bg={F9.RED} size={40} />
    </div>
    {crowd && <>
      <Pill o={o} at={K.most - 100} text="EVERYONE GOES RIGHT" x={540} y={170} bg={F9.BG} fg={F9.INK} size={42} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = -60 + i * 190 + ((o - K.most) / 1000) * 170;
        return <Person key={i} x={x} y={470} s={0.8} c={i === 2 ? F9.TEAL : F9.GREY} num={i === 2 ? '16' : undefined} hop={Math.abs(Math.sin((o + i * 120) / 200)) * 14} />;
      })}
      <Arrow d="M 160 640 H 920" p={ez(o, K.most, 700)} c={F9.GREY} w={9} />
    </>}
  </>;
};
// LEFT REPS: little #16 runs LEFT against a grey crowd running right; counter card + ring; LEFT bounce letters; search gag
const Reps = ({o, K}: P) => {
  const a = K.S[5], b = K.S[6];
  const n = Math.round(interpolate(o, [a + 200, b], [1, 999], clamp));
  const run = (o - a) / (b - a);
  const kx = 860 - 560 * run;
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 300} c={F9.BG} x={540} y={538} />
    {[0, 1, 2, 3].map((i) => <Person key={i} x={-120 + i * 330 + run * 700} y={560} s={0.62} c={F9.GREY} hop={Math.abs(Math.sin((o + i * 150) / 190)) * 10} />)}
    <Person x={kx} y={540} s={0.95} c={F9.TEAL} num="16" hop={Math.abs(Math.sin((o - a) / 160)) * 26} />
    <Arrow d={`M ${kx + 80} 650 H ${kx - 200}`} p={1} c={F9.TEAL} w={8} />
    {[K.threw, K.leftB, K.rolling].map((t, i) => { const u = io(o, t, 700); return u > 0 && u < 1 ? <Ball key={i} x={kx - 60 - u * 520} y={430 - Math.sin(u * Math.PI) * 110} s={0.75} rot={-20 - u * 30} /> : null; })}
    <Card x={850} y={150} w={340} h={200} p={sp(o, a + 150, 15, 180)}>
      <div style={{position: 'absolute', left: 26, top: 26}}><Ring p={n / 999} r={58} w={14} /></div>
      <div style={{position: 'absolute', left: 175, top: 44, ...T({fontSize: 22, color: F9.GREY})}}>LEFT REPS</div>
      <div style={{position: 'absolute', left: 175, top: 76, ...T({fontSize: 58, color: F9.TEAL})}}>{n}</div>
    </Card>
    {on(o, K.leftB - 100, K.onlyRight - 250) && <Letters o={o} at={K.leftB - 100} text="LEFT" size={200} color={F9.TEAL} x={400} y={230} />}
    {o >= K.onlyRight - 250 && <div style={abs(470, 230, {width: 760, height: 120, borderRadius: 60, background: F9.BG, boxShadow: NEU_IN, opacity: sp(o, K.onlyRight - 250, 15, 200)})}>
      <div style={{position: 'absolute', left: 40, top: 32, width: 48, height: 48, borderRadius: 24, border: `6px solid ${F9.GREY}`, boxSizing: 'border-box'}} />
      <Typer o={o} at={K.onlyRight - 100} text="QB who can only roll right" cps={30} s={{position: 'absolute', left: 110, top: 30, fontSize: 40, fontWeight: 500}} />
      {o >= K.rolling - 300 && <div style={abs(700, 60, {width: 80, height: 80, borderRadius: 40, background: F9.RED, transform: `translate(-50%,-50%) scale(${sp(o, K.rolling - 300, 10, 240)})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 46, color: '#fff'})})}>✕</div>}
    </div>}
  </>;
};
// SO MUCH: teal wipe, white core "LEFT", dashed ring with icon nodes spinning, progress ring fills, 10,000
const SoMuch = ({o, K}: P) => {
  const a = K.S[6];
  const core = sp(o, a + 150, 12, 200);
  const fill = ez(o, a + 300, 1400);
  const icons = ['1f3c8', '1f525', '1f3c3', '1f451'];
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.TEAL} x={540} y={380} />
    <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>
      <circle cx={540} cy={380} r={250} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={5} strokeDasharray="22 18" transform={`rotate(${(o - a) / 12} 540 380)`} />
    </svg>
    <div style={abs(540, 380)}><Ring p={fill} r={185} w={18} c="#fff" track="rgba(255,255,255,.18)" /></div>
    <div style={abs(540, 380, {width: 300 * core, height: 300 * core, borderRadius: '50%', background: '#fff', boxShadow: '0 24px 50px rgba(0,0,0,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 92 * core, color: F9.TEAL})})}>LEFT</div>
    {icons.map((c, i) => {
      const ang = (o - a) / 900 + (i / 4) * Math.PI * 2;
      const p = sp(o, a + 300 + i * 120, 12, 220);
      return <div key={i} style={abs(540 + Math.cos(ang) * 250, 380 + Math.sin(ang) * 250, {width: 96 * p, height: 96 * p, borderRadius: '50%', background: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'})}><Img src={staticFile(`emoji-ios/${c}.png`)} style={{width: 54 * p}} /></div>;
    })}
    {o >= K.much - 150 && <Letters o={o} at={K.much - 150} text="10,000 REPS" size={86} color="#fff" x={540} y={690} gap={0.02} />}
  </>;
};
// END: crown pop + BEST QB EVER? letters + dot confetti
const EndCard = ({o, K, a}: P & {a: number}) => {
  const p = sp(o, a + 100, 11, 200);
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 150} c={F9.BG} />
    <div style={abs(540, 300, {width: 260 * p, height: 260 * p, borderRadius: '50%', background: F9.TEAL, boxShadow: '0 24px 50px rgba(0,163,173,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'})}>
      <Img src={staticFile('emoji-ios/1f451.png')} style={{width: 140 * p}} />
    </div>
    <Letters o={o} at={a + 300} text="BEST QB EVER?" size={96} color={F9.INK} x={540} y={560} gap={0.02} />
    {Array.from({length: 26}).map((_, i) => {
      const t = (o - a - 350 - (i % 5) * 40) / 1000; if (t < 0) return null;
      const ang = (i / 26) * Math.PI * 2, v = 520 + (i % 4) * 90;
      return <div key={i} style={abs(540 + Math.cos(ang) * v * t, 300 + Math.sin(ang) * v * t + 500 * t * t, {width: 22, height: 22, borderRadius: i % 3 ? '50%' : 5, background: [F9.TEAL, F9.GOLD, F9.RED, F9.GREY][i % 4], opacity: Math.max(0, 1 - t * 0.9)})} />;
    })}
  </>;
};
