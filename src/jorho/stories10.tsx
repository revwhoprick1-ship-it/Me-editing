// Jorho v10 (2026-11-01): two "natural opening" Shorts in the v9 flat motion-design style. Each opens on the real question
// being asked (context first), then flat MG explains the answer while the voice continues; Trevor is shown on his key lines.
import type {ReactNode} from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {Arrow, Ball, Card, F9, Fill, Letters, NEU, Person, Pill, Ring, T, Typer, Wipe, abs, ez, io, on, sp} from './flat9';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---- shared: a small flat play diagram (O line, QB, one route) ----------------------------------------------------------
const Play = ({x, y, s = 1, route = 0, c = F9.TEAL, dim = 0}: {x: number; y: number; s?: number; route?: number; c?: string; dim?: number}) => {
  const routes = ['M 50 62 C 50 30 70 20 90 14', 'M 50 62 C 30 50 15 40 8 22', 'M 50 62 L 50 18', 'M 50 62 C 70 62 85 58 94 44'];
  return <div style={abs(x, y, {width: 100 * s, height: 80 * s, borderRadius: 16 * s, background: F9.BG, boxShadow: '6px 6px 14px #c3cad3, -6px -6px 14px #ffffff', opacity: 1 - 0.65 * dim, filter: `grayscale(${dim})`})}>
    <svg viewBox="0 0 100 80" width={100 * s} height={80 * s}>
      {[26, 38, 50, 62, 74].map((u) => <circle key={u} cx={u} cy={52} r={4} fill="none" stroke={F9.INK} strokeWidth={2} />)}
      <circle cx={50} cy={64} r={4} fill={c} />
      <path d={routes[route % 4]} fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />
    </svg>
  </div>;
};

// ==== A) PLAYBOOK: "How much does the playbook change week to week?" =====================================================
export type PbK = {S: number[]; mg1: number; runs: number; pass: number; pa: number; screens: number; inventory: number; thisWeek: number; mg3: number; eight: number; ten: number; end: number};
export const PlaybookFlat = ({o, K}: {o: number; K: PbK}) => {
  const S = K.S;
  const live = on(o, K.mg1, S[3]) || on(o, S[3] + 1250, S[4]) || o >= K.mg3;
  if (!live) return null;
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    {on(o, K.mg1, S[2]) && <Install o={o} K={K} />}
    {on(o, S[2], S[3]) && <Types o={o} K={K} />}
    {on(o, S[3] + 1250, S[4]) && <Funnel o={o} K={K} />}
    {o >= K.mg3 && <NewPlays o={o} K={K} />}
  </div>;
};
type PP = {o: number; K: PbK};
const GRID = Array.from({length: 48}).map((_, i) => ({x: 120 + (i % 8) * 120, y: 120 + Math.floor(i / 8) * 95, r: i}));
// "installing your entire offense, which is hundreds of plays": cards multiply into a full grid
const Install = ({o, K}: PP) => {
  const a = K.mg1;
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 250} c={F9.BG} x={540} y={420} />
    {GRID.map((g, i) => { const p = sp(o, a + 100 + i * 38, 14, 220); return p > 0.01 && <div key={i} style={{position: 'absolute', inset: 0, transform: `scale(${p})`, transformOrigin: `${g.x}px ${g.y}px`}}><Play x={g.x} y={g.y} s={0.95} route={g.r} /></div>; })}
    {o >= K.S[2] - 1300 && <div style={abs(540, 650, {padding: '14px 40px', borderRadius: 50, background: F9.TEAL, ...T({fontSize: 56, color: '#fff'}), transform: `translate(-50%,-50%) scale(${sp(o, K.S[2] - 1300, 12, 220)})`, boxShadow: '0 14px 30px rgba(0,124,133,.35)'})}>HUNDREDS OF PLAYS</div>}
  </>;
};
// "a ton of runs, all these pass concepts, play action, screens": category pills land one by one with their route
const Types = ({o, K}: PP) => {
  const items: [string, number, number][] = [['RUNS', K.runs, 2], ['PASS CONCEPTS', K.pass, 0], ['PLAY ACTION', K.pa, 1], ['SCREENS', K.screens, 3]];
  return <>
    <Fill c={F9.BG} />
    <div style={abs(540, 90, T({fontSize: 40, color: F9.GREY}))}>everything gets installed</div>
    {items.map(([t, at, r], i) => {
      const p = sp(o, at - 150, 14, 200);
      return <div key={i} style={{position: 'absolute', left: 90, top: 160 + i * 125, display: 'flex', alignItems: 'center', gap: 30, opacity: p, transform: `translateX(${(1 - p) * -120}px)`}}>
        <div style={{width: 100, height: 100, borderRadius: 30, background: F9.BG, boxShadow: NEU, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Play x={50} y={50} s={0.85} route={r} /></div>
        <div style={T({fontSize: 58})}>{t}</div>
        <div style={{marginLeft: 10, width: 48, height: 48, borderRadius: 24, background: F9.TEAL, ...T({fontSize: 30, color: '#fff'}), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${sp(o, at + 150, 10, 240)})`}}>✓</div>
      </div>;
    })}
  </>;
};
// "the coaches take our whole inventory … this is what we're running this week": grid greys out, a few slide into THIS WEEK
const PICK = [3, 12, 21, 26, 34, 41];
const Funnel = ({o, K}: PP) => {
  const sel = io(o, K.thisWeek - 900, 900);
  return <>
    <Fill c={F9.BG} />
    <Pill o={o} at={K.inventory - 300} text="THE WHOLE INVENTORY" x={540} y={60} bg={F9.BG} fg={F9.INK} size={36} />
    {GRID.map((g, i) => {
      const pick = PICK.indexOf(i);
      const tx = pick >= 0 ? 260 + pick * 112 : g.x, ty = pick >= 0 ? 620 : g.y;
      const x = g.x + (tx - g.x) * (pick >= 0 ? sel : 0), y = g.y + (ty - g.y) * (pick >= 0 ? sel : 0);
      return <Play key={i} x={x} y={y - 0} s={0.95} route={g.r} dim={pick >= 0 ? 0 : 0.85 * ez(o, K.thisWeek - 1100, 600)} />;
    })}
    {sel > 0 && <div style={abs(540, 620, {width: 760, height: 150, borderRadius: 40, border: `5px dashed ${F9.TEAL}`, opacity: sel})} />}
    <Pill o={o} at={K.thisWeek} text="THIS WEEK'S PLAN" x={540} y={500} bg={F9.TEAL} size={40} />
  </>;
};
// "we might add a couple new plays, give or take eight to ten a week"
const NewPlays = ({o, K}: PP) => {
  const a = K.mg3;
  const n = o < K.eight ? 0 : o < K.ten ? 8 : 10;
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 250} c={F9.BG} />
    <Card x={540} y={330} w={900} h={470} p={sp(o, a, 15, 180)}>
      <div style={{position: 'absolute', left: 44, top: 34, ...T({fontSize: 40})}}>New plays this week</div>
      <div style={{position: 'absolute', right: 40, top: 22}}><Ring p={n / 10} r={44} w={12} /></div>
      {Array.from({length: 10}).map((_, i) => {
        const filled = i < n, at = i < 8 ? K.eight + i * 60 : K.ten + (i - 8) * 90;
        return <div key={i} style={{position: 'absolute', left: 60 + (i % 5) * 160, top: 140 + Math.floor(i / 5) * 150}}>
          {filled ? <div style={{transform: `scale(${sp(o, at, 12, 230)})`}}><Play x={60} y={50} s={1.15} route={i} /></div>
            : <div style={{width: 115, height: 92, borderRadius: 18, border: `4px dashed ${F9.GREY}`, opacity: 0.6, position: 'absolute', left: 2, top: 4}} />}
        </div>;
      })}
    </Card>
    {o >= K.eight && <Letters o={o} at={K.eight} text={n >= 10 ? '8–10 NEW' : '8 NEW'} size={110} color={F9.TEAL} x={540} y={650} gap={0.02} />}
  </>;
};

// ==== B) GOLF: "What would be your dream foursome on the golf course?" =================================================
export type GolfK = {S: number[]; card: number; week: number; jesus: number; tiger: number; goat: number; end: number};
const SLOTS: [string, string, string][] = [['TREVOR', '1f3c8', F9.TEAL], ['JESUS', '1f64f', F9.GOLD], ['TIGER', '26f3', '#C8102E'], ['?', '2753', F9.GREY]];
// the scorecard: 4 empty slots (an open question you can see), filled as he answers
const Scorecard = ({o, K, y = 140, s = 1, fill}: {o: number; K: GolfK; y?: number; s?: number; fill: number[]}) => {
  const p = sp(o, K.card, 15, 190);
  return <div style={abs(540, y, {width: 960, height: 210, borderRadius: 40, background: 'rgba(233,238,243,.96)', boxShadow: '0 18px 40px rgba(0,0,0,.25)',
    transform: `translate(-50%,-50%) translateY(${(1 - p) * -260}px) scale(${s})`})}>
    <div style={{position: 'absolute', left: 36, top: 18, ...T({fontSize: 30, color: F9.GREY})}}>DREAM GOLF FOURSOME ⛳</div>
    {SLOTS.map(([name, em, c], i) => {
      const f = fill[i] ?? 1e9, q = sp(o, f, 11, 220);
      return <div key={i} style={{position: 'absolute', left: 40 + i * 230, top: 70, width: 200, height: 118, borderRadius: 26, background: q > 0.5 ? c : 'transparent',
        border: q > 0.5 ? 'none' : `4px dashed ${F9.GREY}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transform: `scale(${q > 0 ? 0.85 + 0.15 * q : 1})`, boxShadow: q > 0.5 ? '0 10px 22px rgba(0,0,0,.18)' : 'none'}}>
        {q > 0.5 ? <><Img src={staticFile(`emoji-ios/${em}.png`)} style={{width: 44}} /><span style={T({fontSize: name.length > 5 ? 32 : 36, color: '#fff'})}>{name}</span></>
          : <span style={T({fontSize: 50, color: F9.GREY})}>{i + 1}</span>}
      </div>;
    })}
  </div>;
};
export const GolfFlat = ({o, K}: {o: number; K: GolfK}) => {
  const S = K.S;
  const fill = [K.card + 700, K.jesus, K.tiger, 1e9];
  const parts: ReactNode[] = [];
  // overlay scorecard on the real footage (question, Trevor's answer, the reaction)
  if (o < S[2] || on(o, S[3], S[5])) parts.push(<Scorecard key="sc" o={o} K={K} fill={fill} />);
  // MG: "I need like a week to think about these" — 7-day calendar fills
  if (on(o, S[2], S[3])) parts.push(<Week key="wk" o={o} K={K} />);
  // MG: Tiger + "the goat in the golf world"
  if (o >= S[5]) parts.push(<Tiger key="tg" o={o} K={K} fill={fill} />);
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>{parts}</div>;
};
const Week = ({o, K}: {o: number; K: GolfK}) => {
  const a = K.S[2], d = interpolate(o, [a + 300, K.S[3] - 200], [0, 7], clamp);
  return <>
    <Fill c={F9.BG} /><Wipe o={o} at={a - 200} c={F9.BG} />
    <Typer o={o} at={a + 150} text="thinking…" cps={14} s={{position: 'absolute', left: 120, top: 110, fontSize: 64}} />
    <div style={{position: 'absolute', left: 120, top: 250, display: 'flex', gap: 22}}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => <div key={i} style={{width: 100, height: 120, borderRadius: 24, background: i < d ? F9.TEAL : F9.BG, boxShadow: i < d ? '0 10px 20px rgba(0,163,173,.35)' : NEU,
        display: 'flex', alignItems: 'center', justifyContent: 'center', ...T({fontSize: 44, color: i < d ? '#fff' : F9.GREY}), transform: `scale(${i < d ? 1 : 0.96})`}}>{l}</div>)}
    </div>
    <Pill o={o} at={K.week} text="NEEDS A WEEK" x={540} y={560} bg={F9.TEAL} size={44} icon="1f914" />
  </>;
};
const Tiger = ({o, K, fill}: {o: number; K: GolfK; fill: number[]}) => {
  const a = K.S[5], roll = io(o, a + 200, 1500);
  return <>
    <Fill c="#dff0e6" /><Wipe o={o} at={a - 250} c="#dff0e6" x={540} y={700} />
    <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>
      <path d="M -50 760 Q 300 600 620 690 T 1150 640 V 1100 H -50 Z" fill="#8fd19e" />
      <path d="M -50 840 Q 360 720 700 790 T 1150 760 V 1100 H -50 Z" fill="#6cc283" />
      <line x1={820} y1={700} x2={820} y2={520} stroke={F9.INK} strokeWidth={6} />
      <path d="M 820 520 L 900 548 L 820 576 Z" fill="#C8102E" />
      <ellipse cx={820} cy={702} rx={26} ry={9} fill={F9.INK} />
    </svg>
    <div style={abs(160 + 640 * roll, 690 - Math.sin(roll * Math.PI) * 120 - roll * 12, {width: 34, height: 34, borderRadius: 17, background: '#fff', boxShadow: '0 6px 10px rgba(0,0,0,.25)', opacity: roll < 0.99 ? 1 : 0})} />
    <Scorecard o={o} K={K} y={140} fill={fill} />
    <div style={abs(205, 470, {width: 250 * sp(o, K.tiger - 100, 12, 200), height: 250 * sp(o, K.tiger - 100, 12, 200), borderRadius: '50%', overflow: 'hidden', background: '#fff', boxShadow: '0 16px 34px rgba(0,0,0,.22)'})}>
      <Img src={staticFile('img/jorho/tiger.png')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%'}} />
    </div>
    {o >= K.goat - 150 && <>
      <Letters o={o} at={K.goat - 150} text="THE GOAT" size={110} color={F9.INK} x={660} y={420} gap={0.02} />
      <Img src={staticFile('emoji-ios/1f410.png')} style={abs(930, 300, {width: 120 * sp(o, K.goat + 300, 10, 220)})} />
    </>}
    <Pill o={o} at={K.end - 1700} text="WHO'S #4?" x={660} y={560} bg={F9.INK} size={44} />
  </>;
};
export {Arrow, Ball, Person};
