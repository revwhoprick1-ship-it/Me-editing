// "Glass" style v1 (user ref, 2026-11-01: realaiassemble TikTok "text behind his head, glass UI cards that morph with
// every line, a 3D globe and a full sound design pass" + "maybe some 2d animations of people (football)").
// Full-frame 9:16 on the speaker, dark teal cinematic grade, phrase captions (Inter + Instrument Serif italic keywords),
// big serif words BEHIND the head (person matte), a frosted glass checklist card that fills in line by line, orbit rings
// with fan avatars, flat 2D football players, a black-and-white "look back" beat. Clean sound design, not meme SFX.
import type {CSSProperties, ReactNode} from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {Cam, Music, SfxTrack, SpeechTrack, sfx, timeline, type CamCfg, type Track} from '../e3/kit';
import {SANS, SERIF} from '../mgFonts';
import t4Words from '../plans/data/t4_natty_ticket.words.json';
import t4Track from '../plans/data/t4_natty_ticket.seats.json';

const FPS = 30;
const C = {TEAL: '#00A3AD', TEAL_D: '#006778', ICE: '#7fe9ef', GOLD: '#E2B34A', INK: '#0b1418', JAG: '#101820'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ez = (o: number, a: number, d: number) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
const sp = (o: number, a: number, damping = 14, stiffness = 140) => (o < a ? 0 : spring({frame: ((o - a) / 1000) * FPS, fps: FPS, config: {damping, stiffness}}));
const win = (o: number, a: number, b: number, fi = 300, fo = 300) => interpolate(o, [a, a + fi, b - fo, b], [0, 1, 1, 0], clamp);

// ---- timeline: Trevor's lines + the left host's question --------------------------------------------------------------
const tl = timeline([[42700, 47500], [50900, 53300], [54700, 56000], [59330, 70300]]);
export const GLASS_MEMORY_MS = tl.total;
const S = tl.segOut, at = tl.out;
const K = {memory: at(43360), dontHave: at(44820), signed: at(45900), people: at(46660), jerseys: at(52120), college: at(55760), kept: at(59460),
  games: at(60520), closet: at(61680), gameWorn: at(62400), stuff: at(63140), downLine: at(64280), lookBack: at(65640), butCollege: at(66400),
  ticket: at(68020), national: at(68580), pretty: at(69220), sweet: at(69600), end: tl.total};

const cam: CamCfg = {
  src: 'pod/t4_natty_ticket.mp4', tl, track: t4Track as unknown as Track, grade: 'contrast(1.16) saturate(0.7) brightness(0.8)',
  who: (src) => (src >= 50800 && src < 53400 ? 'L' : 'M'), baseH: 1040, faceY: 0.42,
  mattes: [{src: [43300, 44900], dir: 'matte/g8a', n: 48, rect: [600, 0, 660, 1080]}, {src: [68500, 70300], dir: 'matte/g8b', n: 54, rect: [600, 0, 660, 1080]}],
};

// ---- captions: phrases build word by word; keywords in serif italic ----------------------------------------------------
type W = {t: number; text: string; key: boolean};
const KEYS = new Set(['memory', 'signed', 'people', 'jerseys', 'worn', 'college', 'games', 'closet', 'hold', 'back', 'championship', 'sweet', 'ticket']);
const words: W[] = (t4Words as {text: string; startMs: number}[])
  .filter((w) => tl.segs.some(([a, b]) => w.startMs >= a && w.startMs < b - 60))
  .map((w) => {
    const text = w.text.replace(/^war$/i, 'worn');
    return {t: at(w.startMs), text, key: KEYS.has(text.toLowerCase().replace(/[^a-z]/g, ''))};
  });
const phrases: W[][] = [];
words.forEach((w, i) => {
  const prev = words[i - 1];
  const cur = phrases[phrases.length - 1];
  if (!prev || /[.,?!]$/.test(prev.text) || w.t - prev.t > 420 || cur.length >= 5 || S.some((s) => s > prev.t && s <= w.t)) phrases.push([w]);
  else cur.push(w);
});
const Captions = ({o, y}: {o: number; y: number}) => {
  const i = phrases.findIndex((p, j) => o >= p[0].t - 60 && (j === phrases.length - 1 || o < phrases[j + 1][0].t - 60));
  if (i < 0) return null;
  const p = phrases[i];
  const fadeOut = i === phrases.length - 1 ? 1 : interpolate(o, [phrases[i + 1][0].t - 160, phrases[i + 1][0].t - 60], [1, 0], clamp);
  return <div style={{position: 'absolute', left: 70, right: 70, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '0 16px', opacity: fadeOut}}>
    {p.map((w, j) => {
      const k = ez(o, w.t - 60, 220);
      if (o < w.t - 60) return null;
      const s: CSSProperties = w.key
        ? {fontFamily: SERIF, fontStyle: 'italic', fontSize: 84, color: C.ICE, textShadow: '0 0 22px rgba(0,190,210,.75), 0 4px 18px rgba(0,0,0,.6)'}
        : {fontFamily: SANS, fontWeight: 500, fontSize: 60, color: '#fff', textShadow: '0 4px 18px rgba(0,0,0,.6)'};
      return <span key={j} style={{...s, opacity: k, filter: `blur(${(1 - k) * 8}px)`, transform: `translateY(${(1 - k) * 14}px)`, display: 'inline-block'}}>{w.text.replace(/[,]$/, '')}</span>;
    })}
  </div>;
};

// ---- big serif word behind the head --------------------------------------------------------------------------------
const Behind = ({o, a, b, text, size, colors}: {o: number; a: number; b: number; text: string; size: number; colors: [string, string]}) => {
  const v = win(o, a, b, 350, 250);
  if (v <= 0) return null;
  const k = ez(o, a, 700);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 560 - size * 0.55, textAlign: 'center', opacity: v, transform: `scale(${1.08 - 0.08 * k})`, filter: `blur(${(1 - k) * 10}px)`}}>
    <span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: size, lineHeight: 1, letterSpacing: 2, backgroundImage: `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`,
      WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 30px rgba(0,200,220,.55))'}}>{text}</span>
  </div>;
};

// ---- frosted glass panel -----------------------------------------------------------------------------------------------
const glass: CSSProperties = {background: 'linear-gradient(160deg, rgba(60,95,115,.62), rgba(10,26,34,.78))', border: '1.5px solid rgba(255,255,255,.2)', borderRadius: 34,
  boxShadow: '0 30px 70px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.28)', backdropFilter: 'blur(18px)'};

const Ring = ({p, size = 96}: {p: number; size?: number}) => {
  const r = size / 2 - 7, L = 2 * Math.PI * r;
  return <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
    <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.14)" strokeWidth={8} fill="none" />
    <circle cx={size / 2} cy={size / 2} r={r} stroke={p >= 0.99 ? C.GOLD : C.TEAL} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} />
    <text x={size / 2} y={size / 2 + 8} textAnchor="middle" transform={`rotate(90 ${size / 2} ${size / 2})`} fontFamily={SANS} fontWeight={700} fontSize={22} fill="#fff">{Math.round(p * 100)}%</text>
  </svg>;
};
const Check = ({on, pulse}: {on: number; pulse?: number}) => (
  <div style={{width: 50, height: 50, borderRadius: 25, border: `3px solid ${on > 0.5 ? C.TEAL : pulse ? `rgba(227,80,80,${0.5 + 0.5 * Math.sin(pulse / 90)})` : 'rgba(255,255,255,.35)'}`,
    background: on > 0.5 ? C.TEAL : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, on) * Math.PI)})`}}>
    {on > 0.5 && <svg width={28} height={28} viewBox="0 0 24 24"><path d="M4 12.5 L10 18 L20 6" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
  </div>
);
const ROWS: [string, string][] = [['College jersey', 'Clemson'], ['Big-game NFL jerseys', 'kept in his closet'], ['2019 title game ticket', 'never had one']];
const Keepsakes = ({o, a, b, checks, y, scale = 1, pulse3}: {o: number; a: number; b: number; checks: number[]; y: number; scale?: number; pulse3?: number}) => {
  const v = win(o, a, b, 380, 300);
  if (v <= 0) return null;
  const on = checks.map((c) => ez(o, c, 260));
  const prog = interpolate(on.reduce((s, x) => s + x, 0), [0, 3], [0, 1]);
  return <div style={{position: 'absolute', left: 540 - 410 * scale, top: y, width: 820, transform: `scale(${scale}) translateY(${(1 - ez(o, a, 450)) * 70}px)`, transformOrigin: '0 0', opacity: v,
    ...glass, padding: '30px 34px', boxShadow: prog >= 0.99 ? `0 0 ${40 * ez(o, checks[2], 500)}px rgba(226,179,74,.7), ${glass.boxShadow}` : glass.boxShadow}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{width: 76, height: 76, borderRadius: 22, background: `linear-gradient(150deg, ${C.TEAL}, ${C.TEAL_D})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={48} height={48} viewBox="0 0 48 48"><ellipse cx={24} cy={24} rx={20} ry={12} transform="rotate(-35 24 24)" fill="#8a4b22" /><path d="M16 30 L32 18 M20 22 l3 3 M23 20 l3 3 M26 18 l3 3" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" /></svg>
      </div>
      <div style={{flex: 1}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: '#fff'}}>Trevor's keepsakes</div>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: 'rgba(255,255,255,.6)'}}>game-worn collection</div>
      </div>
      <Ring p={prog} />
    </div>
    {ROWS.map(([t, s], i) => (
      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 22, opacity: 0.55 + 0.45 * Math.max(on[i], i === 2 && pulse3 && o >= pulse3 ? 1 : 0)}}>
        <div style={{width: 60, height: 60, borderRadius: 18, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30}}>
          {i === 2 ? <Img src={staticFile('emoji-ios/1f39f.png')} style={{width: 36}} /> : <svg width={34} height={34} viewBox="0 0 34 34"><path d="M9 4 L13 4 Q17 8 21 4 L25 4 L32 10 L28 15 L25 13 L25 30 L9 30 L9 13 L6 15 L2 10 Z" fill={i === 0 ? '#F56600' : C.TEAL} /></svg>}
        </div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: '#fff'}}>{t}</div>
          <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 24, color: 'rgba(255,255,255,.55)'}}>{i === 2 && on[2] > 0.5 ? 'finally his' : s}</div>
        </div>
        <Check on={on[i]} pulse={i === 2 && pulse3 && o >= pulse3 && on[2] < 0.5 ? o : undefined} />
      </div>
    ))}
  </div>;
};

// ---- orbit rings with fan avatars ("I've signed a ton of these for people") --------------------------------------------
const Person = ({size}: {size: number}) => (
  <div style={{width: size, height: size, borderRadius: size, background: `radial-gradient(circle at 35% 30%, #5fd6ff, #1c6fd1)`, border: '2px solid rgba(255,255,255,.75)',
    boxShadow: '0 0 18px rgba(80,190,255,.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden'}}>
    <svg width={size * 0.7} height={size * 0.78} viewBox="0 0 20 22"><circle cx={10} cy={7} r={4.6} fill="#fff" /><path d="M1 22 Q1 13 10 13 Q19 13 19 22 Z" fill="#fff" /></svg>
  </div>
);
const Orbit = ({o, a, b}: {o: number; a: number; b: number}) => {
  const v = win(o, a, b, 400, 300);
  if (v <= 0) return null;
  const draw = ez(o, a, 700), cx = 540, cy = 800;
  const rings = [[400, 150, -14], [470, 190, 10]] as const;
  return <div style={{position: 'absolute', inset: 0, opacity: v}}>
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {rings.map(([rx, ry, rot], i) => <ellipse key={i} cx={cx} cy={cy + 40} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill="none" stroke="rgba(150,225,255,.75)"
        strokeWidth={3} pathLength={1} strokeDasharray={`${draw} 1`} style={{filter: 'drop-shadow(0 0 8px rgba(80,200,255,.9))'}} />)}
    </svg>
    {Array.from({length: 7}).map((_, i) => {
      const [rx, ry, rot] = rings[i % 2];
      const ang = (o - a) / 1400 + (i / 7) * Math.PI * 2;
      const r = (rot * Math.PI) / 180, px = Math.cos(ang) * rx, py = Math.sin(ang) * ry;
      const x = cx + px * Math.cos(r) - py * Math.sin(r), y = cy + 40 + px * Math.sin(r) + py * Math.cos(r);
      const p = sp(o, a + 250 + i * 140, 12, 200);
      const front = Math.sin(ang) > 0;
      return <div key={i} style={{position: 'absolute', left: x - 34, top: y - 34, transform: `scale(${p * (front ? 1 : 0.75)})`, opacity: front ? 1 : 0.55, zIndex: front ? 2 : 0}}>
        <Person size={68} />
        {o > a + 600 + i * 140 && <svg width={70} height={26} style={{position: 'absolute', left: 50, top: -14}} viewBox="0 0 70 26">
          <path d="M2 18 C10 2 14 26 22 12 S34 4 38 16 S52 8 66 10" stroke={C.GOLD} strokeWidth={3} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ez(o, a + 600 + i * 140, 400)} 1`} /></svg>}
      </div>;
    })}
  </div>;
};

// ---- flat 2D football players ------------------------------------------------------------------------------------------
const Player = ({x, y, s, arm, run, flip, num = '16', jersey = C.TEAL}: {x: number; y: number; s: number; arm: number; run: number; flip?: boolean; num?: string; jersey?: string}) => (
  <svg viewBox="-110 -150 220 300" width={220 * s} height={300 * s} style={{position: 'absolute', left: x - 110 * s, top: y - 150 * s, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined,
    filter: 'drop-shadow(0 14px 16px rgba(0,0,0,.55))'}}>
    {[1, -1].map((d) => <g key={d} transform={`rotate(${d * Math.sin(run) * 30} 0 40)`}>
      <rect x={d > 0 ? -24 : 2} y={36} width={22} height={84} rx={10} fill={d > 0 ? '#f4f4f4' : '#dcdcdc'} />
      <rect x={d > 0 ? -26 : 0} y={114} width={30} height={16} rx={7} fill={C.JAG} />
    </g>)}
    <g transform={`rotate(${30 + Math.sin(run) * 25} -40 -50)`}><rect x={-52} y={-56} width={20} height={74} rx={10} fill={C.TEAL_D} /></g>
    <path d="M-50,-46 Q-54,-66 -30,-70 L30,-70 Q54,-66 50,-46 L40,46 L-40,46 Z" fill={jersey} />
    <path d="M-40,30 L40,30 L40,46 L-40,46 Z" fill={C.JAG} opacity={0.35} />
    <text x={0} y={16} textAnchor="middle" fontFamily="Anton" fontSize={58} fill="#fff">{num}</text>
    <circle cx={0} cy={-104} r={38} fill="#2a3a44" stroke="rgba(220,250,255,.7)" strokeWidth={4} />
    <ellipse cx={-12} cy={-120} rx={16} ry={9} fill="rgba(255,255,255,.28)" />
    <circle cx={30} cy={-100} r={14} fill="#c98f63" />
    <path d="M-6,-141 Q-2,-104 -6,-70" stroke={C.GOLD} strokeWidth={9} fill="none" />
    <path d="M20,-110 L46,-110 M20,-94 L46,-94 M44,-116 L44,-88" stroke="#c9c9c9" strokeWidth={5} fill="none" strokeLinecap="round" />
    <g transform={`rotate(${arm} 42 -50)`}><rect x={33} y={-56} width={20} height={78} rx={10} fill={jersey} /><circle cx={43} cy={24} r={11} fill="#c98f63" /></g>
  </svg>
);
const Ball = ({x, y, rot, s = 1}: {x: number; y: number; rot: number; s?: number}) => (
  <svg width={70 * s} height={44 * s} viewBox="0 0 70 44" style={{position: 'absolute', left: x - 35 * s, top: y - 22 * s, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.5))'}}>
    <ellipse cx={35} cy={22} rx={33} ry={20} fill="#8a4b22" /><path d="M22 22 L48 22" stroke="#fff" strokeWidth={3} />{[26, 31, 36, 41].map((q) => <path key={q} d={`M${q} 17 L${q} 27`} stroke="#fff" strokeWidth={2.5} />)}
  </svg>
);
// QB #16 drops, throws; ball spirals with a light trail to a receiver running in who catches it
const PlayAnim = ({o, a, b}: {o: number; a: number; b: number}) => {
  const v = win(o, a, b, 250, 300);
  if (v <= 0) return null;
  const t = o - a, rel = 650, flight = 750;
  const arm = t < 300 ? interpolate(t, [0, 300], [20, -150]) : t < rel ? interpolate(t, [300, rel], [-150, 70], {...clamp, easing: (q) => q * q}) : 70 - 50 * ez(o, a + rel, 400);
  const u = Math.min(1, Math.max(0, (t - rel) / flight));
  const bx = 330 + 440 * u, by = 1520 - 300 * Math.sin(u * Math.PI) - 40 * u;
  const rx = interpolate(t, [0, rel + flight], [1150, 830], clamp);
  return <div style={{position: 'absolute', inset: 0, opacity: v}}>
    <div style={{position: 'absolute', left: 120, right: 120, top: 1795, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, transparent, rgba(127,233,239,.6), transparent)'}} />
    <Player x={250} y={1600} s={1.25} arm={arm} run={0} />
    <Player x={rx} y={1610} s={1.15} arm={t > rel + flight - 250 ? -160 : 30} run={t < rel + flight ? t / 70 : 0} flip num="1" jersey={C.TEAL_D} />
    {t >= rel && u < 1 && <>
      {[0.06, 0.12, 0.18].map((d, i) => { const w = Math.max(0, u - d); return <div key={i} style={{position: 'absolute', left: 330 + 440 * w - 8, top: 1520 - 300 * Math.sin(w * Math.PI) - 40 * w - 78, width: 16, height: 16,
        borderRadius: 8, background: C.ICE, opacity: 0.5 - i * 0.14, filter: 'blur(3px)'}} />; })}
      <Ball x={bx} y={by - 70} rot={-20 + u * 60} />
    </>}
    {t < rel && <Ball x={250 + 75} y={1380} rot={-30} s={0.9} />}
  </div>;
};

// ---- glass ticket card, jersey, timeline ---------------------------------------------------------------------------
const TicketCard = ({o, a, b}: {o: number; a: number; b: number}) => {
  const v = win(o, a, b, 300, 250);
  if (v <= 0) return null;
  return <div style={{position: 'absolute', left: 700, top: 980, width: 290, padding: 16, ...glass, borderRadius: 26, opacity: v, transform: `rotate(${-5 + Math.sin(o / 700) * 1.5}deg) translateY(${(1 - sp(o, a)) * 60}px)`}}>
    <Img src={staticFile('img/j3d/ticket_nc.png')} style={{width: '100%', borderRadius: 14, display: 'block'}} />
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: '#fff', marginTop: 10, textAlign: 'center'}}>2019 title game ticket</div>
  </div>;
};
const Jersey = ({o, a, b}: {o: number; a: number; b: number}) => {
  const v = win(o, a, b, 300, 250);
  if (v <= 0) return null;
  return <div style={{position: 'absolute', left: 735, top: 980, opacity: v, transform: `translateY(${(1 - sp(o, a, 12, 160)) * 80}px) rotate(${Math.sin(o / 600) * 4}deg)`}}>
    <svg width={260} height={250} viewBox="0 0 260 250" style={{filter: 'drop-shadow(0 18px 24px rgba(0,0,0,.6))'}}>
      <path d="M70 10 L100 10 Q130 34 160 10 L190 10 L250 60 L222 104 L196 88 L196 240 L64 240 L64 88 L38 104 L10 60 Z" fill={C.TEAL} stroke="rgba(255,255,255,.7)" strokeWidth={3} />
      <path d="M100 10 Q130 34 160 10" stroke={C.JAG} strokeWidth={8} fill="none" />
      <text x={130} y={86} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={22} fill="#fff" letterSpacing={3}>LAWRENCE</text>
      <text x={130} y={190} textAnchor="middle" fontFamily="Anton" fontSize={110} fill="#fff">16</text>
    </svg>
    <div style={{position: 'absolute', left: 40, top: 225, ...glass, borderRadius: 30, padding: '8px 22px', fontFamily: SANS, fontWeight: 700, fontSize: 26, color: '#fff'}}>game worn</div>
  </div>;
};
const STOPS = ['2017 · Clemson', '2019 · Title', '2021 · NFL', 'Now'];
const Rewind = ({o, a, b, back}: {o: number; a: number; b: number; back: number}) => {
  const v = win(o, a, b, 350, 300);
  if (v <= 0) return null;
  const pos = interpolate(o, [a, a + 500, back, back + 700], [3, 3, 3, 1], {...clamp, easing: (q) => q * q * (3 - 2 * q)});
  const X = (i: number) => 90 + i * 280;
  return <div style={{position: 'absolute', left: 60, top: 1560, width: 960, height: 150, ...glass, opacity: v, transform: `translateY(${(1 - ez(o, a, 400)) * 50}px)`}}>
    <div style={{position: 'absolute', left: 90, right: 90, top: 52, height: 4, background: 'rgba(255,255,255,.25)'}} />
    {STOPS.map((s, i) => <div key={i} style={{position: 'absolute', left: X(i) - 90, width: 180, top: 40, textAlign: 'center'}}>
      <div style={{width: 28, height: 28, borderRadius: 14, margin: '0 auto', background: Math.abs(pos - i) < 0.3 ? '#fff' : 'rgba(255,255,255,.35)'}} />
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 25, color: Math.abs(pos - i) < 0.3 ? '#fff' : 'rgba(255,255,255,.55)', marginTop: 14}}>{s}</div>
    </div>)}
    <div style={{position: 'absolute', left: X(pos) - 3, top: 18, width: 6, height: 74, borderRadius: 3, background: '#fff', boxShadow: '0 0 14px #fff'}} />
    <div style={{position: 'absolute', right: 26, top: 12, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: 'rgba(255,255,255,.7)'}}>{o > back ? '◀◀ rewind' : ''}</div>
  </div>;
};
const ContextPill = ({o, a, b, children}: {o: number; a: number; b: number; children: ReactNode}) => {
  const v = win(o, a, b, 300, 350);
  if (v <= 0) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', opacity: v, transform: `translateY(${(1 - ez(o, a, 400)) * -30}px)`}}>
    <div style={{...glass, borderRadius: 40, padding: '14px 30px', display: 'flex', alignItems: 'center', gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: '#fff'}}>{children}</div>
  </div>;
};
const Streak = ({o, a}: {o: number; a: number}) => {
  const t = (o - a) / 600;
  if (t < 0 || t > 1) return null;
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
    {[520, 610, 700, 1240].map((y, i) => <div key={i} style={{position: 'absolute', top: y, left: -600 + t * 2400 - i * 180, width: 700, height: 3 + (i % 2) * 3, background: 'linear-gradient(90deg, transparent, #bff6ff, transparent)', filter: 'blur(1.5px)', opacity: 1 - t}} />)}
    <AbsoluteFill style={{background: 'rgba(160,240,255,.25)', opacity: Math.max(0, 1 - t * 4)}} />
  </AbsoluteFill>;
};

// ---- the clip ------------------------------------------------------------------------------------------------------------
export const GlassMemory = () => {
  const o = (useCurrentFrame() / FPS) * 1000;
  const blurA = win(o, K.college - 1300, K.gameWorn - 300, 400, 400);
  const bw = win(o, K.downLine - 500, K.butCollege + 150, 450, 250);
  const capY = blurA > 0.5 ? 930 : K.butCollege + 200 < o ? 1290 : 1330;
  const card1: [number, number] = [K.college - 1300, K.gameWorn - 300];
  const card2: [number, number] = [K.butCollege + 250, K.end + 400];
  const zoom = 1 + 0.05 * ez(o, S.reduce((s, x) => (o >= x ? x : s), 0), 4000) + 0.06 * ez(o, K.national - 300, 1600);
  return <AbsoluteFill style={{background: C.INK}}>
    <Cam c={{...cam, zoom: () => zoom}} o={o} style={{filter: `${blurA ? `blur(${14 * blurA}px) ` : ''}grayscale(${bw}) brightness(${1 - 0.12 * bw - 0.25 * blurA})`}}
      behind={<>
        <Behind o={o} a={K.memory - 60} b={at(44900)} text="memory" size={250} colors={['#ffffff', C.ICE]} />
        <Behind o={o} a={K.national - 100} b={K.end + 300} text="championship" size={160} colors={['#fff6dc', C.GOLD]} />
      </>} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0d4a5c 0%, #072531 55%, #04131b 100%)', mixBlendMode: 'soft-light', opacity: 0.85 * (1 - bw)}} />
    <AbsoluteFill style={{background: '#0a3946', mixBlendMode: 'color', opacity: 0.16 * (1 - bw)}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 60% at 50% 42%, transparent 45%, rgba(2,10,14,.82) 100%)'}} />
    <ContextPill o={o} a={0} b={K.dontHave - 150}><Img src={staticFile('emoji-ios/1f39f.png')} style={{width: 40}} />Trevor just got his 2019 title game ticket</ContextPill>
    <TicketCard o={o} a={K.dontHave - 100} b={K.signed - 100} />
    <Orbit o={o} a={K.signed - 150} b={S[1] + 80} />
    <Jersey o={o} a={K.jerseys - 300} b={S[2] - 200} />
    <Keepsakes o={o} a={card1[0]} b={card1[1]} checks={[K.college + 150, K.games + 100, 1e9]} y={1080} />
    <PlayAnim o={o} a={K.gameWorn - 350} b={K.downLine - 300} />
    <Rewind o={o} a={K.downLine - 200} b={K.butCollege + 100} back={K.lookBack - 200} />
    <Keepsakes o={o} a={card2[0]} b={card2[1]} checks={[card2[0] - 400, card2[0] - 400, K.pretty]} pulse3={K.ticket - 100} y={1470} scale={0.86} />
    <Captions o={o} y={capY} />
    <Streak o={o} a={K.butCollege - 80} />
    <Streak o={o} a={K.national - 120} />
    <SpeechTrack src="pod/t4_natty_ticket.mp4" tl={tl} />
    <Music file="blue-yung-kai.mp3" songFrom={23500 - K.memory} level={() => 0.13} />
    <SfxTrack list={MEMORY_SFX} />
  </AbsoluteFill>;
};

const MEMORY_SFX = [sfx('jorho-whoosh', 0, 0.22), sfx('jorho-whoosh', K.memory - 120, 0.3), sfx('jorho-pop', K.dontHave - 100, 0.28), sfx('jorho-swish', K.signed - 150, 0.3),
  ...[0, 1, 2, 3].map((i) => sfx('jorho-click', K.signed + 150 + i * 240, 0.22)), sfx('jorho-swish', S[1], 0.28), sfx('jorho-whoosh', K.jerseys - 300, 0.26),
  sfx('jorho-swish', K.college - 1300, 0.28), sfx('jorho-ting', K.college + 150, 0.28), sfx('jorho-ting', K.games + 100, 0.28), sfx('jorho-whoosh', K.gameWorn + 250, 0.32),
  sfx('jorho-pop', K.gameWorn + 1000, 0.26), sfx('jorho-whoosh', K.lookBack - 200, 0.3), sfx('meme-impact', K.butCollege - 80, 0.22), sfx('jorho-click', K.ticket - 100, 0.25),
  sfx('meme-impact', K.national - 120, 0.3), sfx('jorho-ting', K.pretty, 0.34), sfx('jorho-pop', K.sweet, 0.25)];
