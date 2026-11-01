// Jorho v12 (user, 2026-11-01): "make your own, just a simplistic stickman then some images". Hand-made SVG stickmen
// (round strokes, posable joints) + real player photos in circles, in the v9 flat style. NBA GOAT clip.
import {Img, interpolate, staticFile} from 'remotion';
import {F9, Fill, Letters, Pill, T, Typer, Wipe, abs, ez, io, on, sp} from './flat9';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const R = Math.PI / 180;
type Pose = {lA: number; lF: number; rA: number; rF: number; lL: number; rL: number; lean: number; head: number};
const IDLE: Pose = {lA: 160, lF: 10, rA: 200, rF: -10, lL: 170, rL: 190, lean: 0, head: 0};
// angles in degrees from straight up (0) clockwise; arms hang at ~180
const mix = (a: Pose, b: Pose, t: number): Pose => Object.fromEntries(Object.keys(a).map((k) => [k, a[k as keyof Pose] + (b[k as keyof Pose] - a[k as keyof Pose]) * t])) as Pose;
const seg = (x: number, y: number, ang: number, len: number) => [x + Math.sin(ang * R) * len, y - Math.cos(ang * R) * len] as const;

// a stickman: hips at (x,y); s = scale; hat = 'cap' (Trevor) | 'wig' (host); num on the chest
export const Stick = ({x, y, s = 1.3, p, hat, flip, color = F9.INK, sweat = 0, fall = 0}: {x: number; y: number; s?: number; p: Pose; hat?: 'cap' | 'wig'; flip?: boolean; color?: string; sweat?: number; fall?: number}) => {
  const W = 10;
  const neck = seg(0, 0, p.lean, 120), head = seg(...neck, p.lean + p.head, 34);
  const sh = seg(0, 0, p.lean, 100);
  const arm = (a: number, f: number) => { const e = seg(...sh, a, 55); const h = seg(...e, a + f, 50); return `M ${sh[0]} ${sh[1]} L ${e[0]} ${e[1]} L ${h[0]} ${h[1]}`; };
  const leg = (a: number) => { const k = seg(0, 0, a, 62); const f = seg(...k, a + (a > 180 ? 8 : -8), 60); return `M 0 0 L ${k[0]} ${k[1]} L ${f[0]} ${f[1]}`; };
  return <svg width={300 * s} height={360 * s} viewBox="-150 -230 300 360" style={{...abs(x, y - 50 * s), overflow: 'visible', transform: `translate(-50%,-50%) scaleX(${flip ? -1 : 1}) rotate(${-fall * 80}deg)`, transformOrigin: '50% 90%'}}>
    <g stroke={color} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M 0 0 L ${neck[0]} ${neck[1]}`} />
      <path d={arm(p.lA, p.lF)} /><path d={arm(p.rA, p.rF)} />
      <path d={leg(p.lL)} /><path d={leg(p.rL)} />
      <circle cx={head[0]} cy={head[1]} r={34} fill="#fff" />
    </g>
    {hat === 'cap' && <path d={`M ${head[0] - 36} ${head[1] - 6} Q ${head[0]} ${head[1] - 52} ${head[0] + 36} ${head[1] - 6} Z M ${head[0] + 20} ${head[1] - 10} L ${head[0] + 62} ${head[1] - 4}`} fill={F9.INK} stroke={F9.INK} strokeWidth={8} strokeLinecap="round" />}
    {hat === 'wig' && <path d={`M ${head[0] - 42} ${head[1] + 30} Q ${head[0] - 48} ${head[1] - 50} ${head[0]} ${head[1] - 44} Q ${head[0] + 48} ${head[1] - 50} ${head[0] + 42} ${head[1] + 30} L ${head[0] + 30} ${head[1] - 8} L ${head[0] - 30} ${head[1] - 8} Z`} fill="#E8B84A" />}
    {hat === 'wig' && <rect x={head[0] - 36} y={head[1] - 22} width={72} height={14} rx={5} fill={F9.TEAL} />}
    <circle cx={head[0] - 11} cy={head[1] + 2} r={4} fill={F9.INK} /><circle cx={head[0] + 11} cy={head[1] + 2} r={4} fill={F9.INK} />
    {sweat > 0 && [0, 1].map((i) => { const t = ((sweat * 1.6 + i * 0.5) % 1); return <path key={i} d={`M ${head[0] + 30 + i * 12} ${head[1] - 20 + t * 40} q 6 10 0 14 q -6 -4 0 -14 Z`} fill="#5fc8ff" opacity={1 - t} />; })}
  </svg>;
};
const Photo = ({src, x, y, d, p = 1, ring = '#fff', label}: {src: string; x: number; y: number; d: number; p?: number; ring?: string; label?: string}) => (
  <div style={abs(x, y, {width: d * p, height: d * p})}>
    <div style={{width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: '#dfe6ec', border: `${6 * p}px solid ${ring}`, boxShadow: '0 12px 26px rgba(0,0,0,.2)', boxSizing: 'border-box'}}>
      <Img src={staticFile(`img/jorho/${src}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 18%'}} />
    </div>
    {label && p > 0.6 && <div style={abs(d * p / 2, d * p + 6, {...T({fontSize: 26}), background: '#fff', borderRadius: 20, padding: '4px 14px', boxShadow: '0 6px 12px rgba(0,0,0,.15)'})}>{label}</div>}
  </div>
);
const Bubble = ({x, y, w, h, p, children, tail = 'left'}: {x: number; y: number; w: number; h: number; p: number; children?: React.ReactNode; tail?: 'left' | 'right'}) => (
  <div style={abs(x, y, {width: w, height: h, transform: `translate(-50%,-50%) scale(${p})`, transformOrigin: tail === 'left' ? '15% 110%' : '85% 110%'})}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: '#fff', boxShadow: '0 14px 30px rgba(0,0,0,.14)'}} />
    {[0, 1].map((i) => <div key={i} style={{position: 'absolute', [tail]: 30 + i * 22, bottom: -30 - i * 26, width: 30 - i * 12, height: 30 - i * 12, borderRadius: '50%', background: '#fff', boxShadow: '0 6px 12px rgba(0,0,0,.1)'}} />)}
    <div style={{position: 'absolute', inset: 0}}>{children}</div>
  </div>
);

const THINK: Pose = {lA: 160, lF: 10, rA: 140, rF: -150, lL: 172, rL: 188, lean: -3, head: 8};
const POINT: Pose = {lA: 165, lF: 5, rA: 80, rF: 0, lL: 165, rL: 195, lean: 4, head: -6};
const ASK: Pose = {lA: 160, lF: 10, rA: 120, rF: -40, lL: 172, rL: 188, lean: 3, head: -4};
const SCRATCH: Pose = {lA: 160, lF: 10, rA: 150, rF: -165, lL: 172, rL: 188, lean: -2, head: 10};
const SHOCK: Pose = {lA: 40, lF: 20, rA: 320, rF: -20, lL: 160, rL: 200, lean: -6, head: -10};

export type GoatK = {who: number; nba: number; greatest: number; think: number; gotta: number; della: number; laugh: number; tension: number; end: number};
export const GoatStick = ({o, K}: {o: number; K: GoatK}) => {
  const A = on(o, K.who + 600, K.nba), B = on(o, K.greatest, K.think), C = on(o, K.think + 1200, K.gotta), D = on(o, K.gotta, K.della + 1500), E = o >= K.tension - 200;
  if (!(A || B || C || D || E)) return null;
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <Fill c={F9.BG} />
    {A && <Ask o={o} K={K} />}
    {B && <Options o={o} K={K} />}
    {C && <Thinking o={o} K={K} />}
    {D && <Reveal o={o} K={K} />}
    {E && <Tension o={o} K={K} />}
  </div>;
};
type P = {o: number; K: GoatK};
const breathe = (o: number, p: Pose): Pose => ({...p, lean: p.lean + Math.sin(o / 400) * 1.5});
// host asks; question bubble types out
const Ask = ({o, K}: P) => {
  const a = K.who + 600;
  return <>
    <Wipe o={o} at={a - 200} c={F9.BG} />
    <Stick x={300} y={640} p={breathe(o, mix(IDLE, ASK, ez(o, a, 300)))} hat="wig" s={1.3 * sp(o, a, 14, 200)} />
    <Stick x={780} y={640} p={breathe(o + 300, IDLE)} hat="cap" flip s={1.3 * sp(o, a + 120, 14, 200)} />
    <Bubble x={420} y={220} w={560} h={180} p={sp(o, a + 200, 13, 220)}>
      <Typer o={o} at={a + 300} text="Who's your NBA GOAT?" cps={28} s={{position: 'absolute', left: 40, top: 60, fontSize: 48}} />
    </Bubble>
  </>;
};
// "greatest of all time NBA player": Trevor scratches his head, the usual answers pop in his thought bubble, empty #1 podium
const Options = ({o, K}: P) => {
  const a = K.greatest;
  const opts: [string, string][] = [['lebron.png', 'LeBron'], ['kobe.png', 'Kobe'], ['curry.png', 'Curry']];
  return <>
    <Wipe o={o} at={a - 200} c={F9.BG} />
    <Stick x={230} y={640} p={mix(SCRATCH, {...SCRATCH, rF: -140}, (Math.sin(o / 90) + 1) / 2)} hat="cap" />
    <Bubble x={640} y={260} w={700} h={300} p={sp(o, a, 13, 220)} tail="left">
      {opts.map(([f, l], i) => <div key={i} style={{position: 'absolute', left: 60 + i * 210, top: 50}}><Photo src={f} x={80} y={80} d={160} p={sp(o, a + 250 + i * 220, 12, 230)} label={l} /></div>)}
    </Bubble>
    <div style={abs(700, 610, {width: 260, height: 120 * ez(o, a + 600, 400), background: F9.TEAL, borderRadius: '18px 18px 0 0', ...T({fontSize: 70, color: '#fff'}), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translate(-50%,-100%)'})}>1</div>
    {o > a + 900 && <div style={abs(700, 420, T({fontSize: 110, color: F9.GREY, transform: `translate(-50%,-50%) scale(${sp(o, a + 900, 10, 220)})`}))}>?</div>}
  </>;
};
// the long think: hand on chin, foot tapping, the candidates spin like a slot reel, hourglass
const REEL = ['lebron.png', 'kobe.png', 'curry.png'];
const Thinking = ({o, K}: P) => {
  const a = K.think + 1200;
  const speed = interpolate(o, [a, K.gotta], [260, 90], clamp);
  const idx = Math.floor((o - a) / speed) % REEL.length;
  return <>
    <Wipe o={o} at={a - 200} c={F9.BG} />
    <Stick x={300} y={650} p={{...THINK, rL: 188 + Math.max(0, Math.sin(o / 110)) * 14}} hat="cap" />
    <Bubble x={650} y={280} w={460} h={330} p={sp(o, a, 13, 220)} tail="left">
      <div style={{position: 'absolute', left: 130, top: 40}}><Photo src={REEL[idx]} x={100} y={100} d={200} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', ...T({fontSize: 40, color: F9.GREY})}}>{'thinking' + '.'.repeat(1 + (Math.floor(o / 300) % 3))}</div>
    </Bubble>
    <Img src={staticFile('emoji-ios/23f3.png')} style={abs(880, 560, {width: 100, transform: `translate(-50%,-50%) rotate(${Math.floor((o - a) / 900) * 180 + ez(o, a + Math.floor((o - a) / 900) * 900, 300) * 180}deg)`})} />
  </>;
};
// "gotta be Matthew Dellavedova, man": reel stops on Della, Trevor points, host falls over, Della on the #1 podium
const Reveal = ({o, K}: P) => {
  const a = K.gotta;
  const lock = o >= K.della - 150;
  const fall = ez(o, K.della + 250, 450);
  return <>
    <Stick x={250} y={650} p={mix(THINK, POINT, ez(o, a, 300))} hat="cap" />
    <Stick x={820} y={650} p={mix(IDLE, SHOCK, ez(o, K.della, 250))} hat="wig" flip fall={fall * 0.9} />
    {!lock ? <div style={abs(560, 300)}><Photo src={REEL[Math.floor((o - a) / 80) % 3]} x={0} y={0} d={240} /></div>
      : <>
        <div style={abs(560, 470, {width: 280, height: 130, background: F9.GOLD, borderRadius: '18px 18px 0 0', ...T({fontSize: 76, color: '#fff'}), display: 'flex', alignItems: 'center', justifyContent: 'center'})}>1</div>
        <div style={abs(560, 290)}><Photo src="della.png" x={0} y={0} d={260 * (0.6 + 0.4 * sp(o, K.della - 150, 9, 220))} ring={F9.GOLD} /></div>
        <Img src={staticFile('emoji-ios/1f451.png')} style={abs(560, 140, {width: 110 * sp(o, K.della + 100, 9, 220), transform: `translate(-50%,-50%) rotate(${Math.sin(o / 150) * 8}deg)`})} />
        <Pill o={o} at={K.della + 250} text="HIS #1 PICK" x={560} y={600} bg={F9.TEAL} size={40} />
      </>}
  </>;
};
// "I could feel the tension": two stickmen face off, sweat drops, zigzag between them
const Tension = ({o, K}: P) => {
  const a = K.tension - 200;
  const shake = Math.sin(o / 25) * 4;
  return <>
    <Wipe o={o} at={a - 150} c={F9.BG} />
    <Stick x={270 + shake} y={640} p={{...IDLE, lA: 200, rA: 160, lean: 6}} hat="cap" sweat={(o - a) / 1000} />
    <Stick x={810 - shake} y={640} p={{...IDLE, lA: 200, rA: 160, lean: 6}} hat="wig" flip sweat={(o - a) / 1000 + 0.3} />
    <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>
      <path d="M 400 420 L 450 390 L 490 440 L 540 395 L 590 440 L 630 390 L 680 420" fill="none" stroke={F9.RED} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={`${io(o, a, 300)} 1`} transform={`translate(0 ${shake})`} />
    </svg>
    <Letters o={o} at={a + 100} text="TENSION" size={120} color={F9.RED} x={540 + shake} y={170} gap={0.04} />
  </>;
};
export {Pill};
