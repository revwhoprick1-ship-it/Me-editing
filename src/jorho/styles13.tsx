// Jorho v13 (user, 2026-11-01): "create 5 NBA goat clips just like that but with a different style and approach. I'll
// pick the best and it will be the new jorho editing style". Same beats as v12 (ask → options → long think → Della →
// laugh (real) → tension); five looks: whiteboard, chalkboard, comic, arcade, text-message story.
import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {abs, ez, io, on, sp} from './flat9';
import {Stick} from './stick12';
import type {GoatK} from './stick12';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Pose = Parameters<typeof Stick>[0]['p'];
const P: Record<string, Pose> = {
  IDLE: {lA: 160, lF: 10, rA: 200, rF: -10, lL: 170, rL: 190, lean: 0, head: 0},
  ASK: {lA: 160, lF: 10, rA: 120, rF: -40, lL: 172, rL: 188, lean: 3, head: -4},
  SCRATCH: {lA: 160, lF: 10, rA: 150, rF: -165, lL: 172, rL: 188, lean: -2, head: 10},
  THINK: {lA: 160, lF: 10, rA: 140, rF: -150, lL: 172, rL: 188, lean: -3, head: 8},
  POINT: {lA: 165, lF: 5, rA: 80, rF: 0, lL: 165, rL: 195, lean: 4, head: -6},
  SHOCK: {lA: 40, lF: 20, rA: 320, rF: -20, lL: 160, rL: 200, lean: -6, head: -10},
};
export type Beat = 'ask' | 'options' | 'think' | 'reveal' | 'tension' | null;
export const beatOf = (o: number, K: GoatK): Beat => on(o, K.who + 600, K.nba) ? 'ask' : on(o, K.greatest, K.think) ? 'options' : on(o, K.think + 1200, K.gotta) ? 'think'
  : on(o, K.gotta, K.della + 1500) ? 'reveal' : o >= K.tension - 200 ? 'tension' : null;
const OPTS: [string, string][] = [['lebron.png', 'LeBron'], ['kobe.png', 'Kobe'], ['curry.png', 'Curry']];
const reel = (o: number, a: number, end: number) => OPTS[Math.floor((o - a) / interpolate(o, [a, end], [260, 90], clamp)) % 3][0];
const pic = (f: string, s: CSSProperties) => <Img src={staticFile(`img/jorho/${f}`)} style={{objectFit: 'cover', objectPosition: '50% 18%', display: 'block', ...s}} />;
const typed = (o: number, at: number, t: string, cps = 26) => t.slice(0, Math.max(0, Math.floor(((o - at) / 1000) * cps)));
type S = {o: number; K: GoatK};

// ==== 1) WHITEBOARD: blue marker sticks with line "boil", taped photos, red marker circle =================================
const boil = (o: number) => Math.floor(o / 110) % 3; // redraw jitter like hand-drawn animation
export const Whiteboard = ({o, K}: S) => {
  const b = beatOf(o, K); if (!b) return null;
  const j = boil(o), jr = [-0.6, 0.4, 0.1][j], M = '#1d3a8a', RD = '#d62828';
  const mk = (s: CSSProperties): CSSProperties => ({fontFamily: 'Permanent Marker', color: M, ...s});
  const Tape = ({x, y, f, d, at, rot}: {x: number; y: number; f: string; d: number; at: number; rot: number}) => {
    const p = sp(o, at, 12, 220); if (p <= 0.01) return null;
    return <div style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot + jr}deg) scale(${p})`, background: '#fff', padding: 10, boxShadow: '0 8px 16px rgba(0,0,0,.18)'})}>
      {pic(f, {width: d, height: d})}<div style={abs(d / 2 + 10, -4, {width: 90, height: 26, background: 'rgba(255,230,140,.85)', transform: 'translate(-50%,-50%) rotate(-4deg)'})} />
    </div>;
  };
  return <div style={{position: 'absolute', inset: 0, background: '#fbfbf6', backgroundImage: 'linear-gradient(#e9eef7 2px, transparent 2px), linear-gradient(90deg, #e9eef7 2px, transparent 2px)', backgroundSize: '60px 60px'}}>
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${jr * 0.3}deg)`}}>
      {b === 'ask' && <>
        <Stick x={300} y={640} p={P.ASK} hat="wig" color={M} />
        <Stick x={790} y={640} p={P.IDLE} hat="cap" flip color={M} />
        <div style={abs(430, 220, mk({fontSize: 64, transform: `translate(-50%,-50%) rotate(-3deg)`}))}>{typed(o, K.who + 700, '"WHO\'S YOUR NBA GOAT?"', 30)}</div>
      </>}
      {b === 'options' && <>
        <Stick x={220} y={650} p={P.SCRATCH} hat="cap" color={M} />
        {OPTS.map(([f, l], i) => <Tape key={i} x={470 + i * 210} y={300 + (i % 2) * 60} f={f} d={150} at={K.greatest + 200 + i * 220} rot={[-6, 4, -2][i]} />)}
        {o > K.greatest + 900 && <div style={abs(680, 560, mk({fontSize: 80, color: RD}))}>???</div>}
      </>}
      {b === 'think' && <>
        <Stick x={300} y={650} p={{...P.THINK, rL: 188 + Math.max(0, Math.sin(o / 110)) * 14}} hat="cap" color={M} />
        <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}><ellipse cx={680} cy={300} rx={230} ry={170} fill="none" stroke={M} strokeWidth={8} strokeDasharray="30 16" /></svg>
        <Tape x={680} y={300} f={reel(o, K.think + 1200, K.gotta)} d={180} at={K.think + 1200} rot={(o / 90) % 10 - 5} />
        <div style={abs(680, 560, mk({fontSize: 52}))}>{'thinking' + '.'.repeat(1 + (Math.floor(o / 300) % 3))}</div>
      </>}
      {b === 'reveal' && <>
        <Stick x={240} y={650} p={P.POINT} hat="cap" color={M} />
        <Stick x={830} y={650} p={o > K.della ? P.SHOCK : P.IDLE} hat="wig" flip color={M} fall={ez(o, K.della + 250, 450) * 0.9} />
        <Tape x={560} y={320} f={o >= K.della - 150 ? 'della.png' : reel(o, K.gotta - 2000, K.gotta)} d={230} at={K.gotta} rot={-3} />
        {o >= K.della && <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>
          <path d="M 420 190 C 600 120 760 240 700 420 C 640 560 400 520 400 360 C 400 260 480 210 560 200" fill="none" stroke={RD} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${io(o, K.della, 450)} 1`} /></svg>}
        {o >= K.della + 300 && <div style={abs(560, 590, mk({fontSize: 70, color: RD, transform: `translate(-50%,-50%) rotate(-4deg) scale(${sp(o, K.della + 300, 10, 220)})`}))}>HIS GOAT?!</div>}
      </>}
      {b === 'tension' && <>
        <Stick x={270} y={640} p={{...P.IDLE, lA: 200, rA: 160}} hat="cap" color={M} sweat={(o - K.tension) / 1000} />
        <Stick x={810} y={640} p={{...P.IDLE, lA: 200, rA: 160}} hat="wig" flip color={M} sweat={(o - K.tension) / 1000 + 0.3} />
        <div style={abs(540, 200, mk({fontSize: 110, color: RD, transform: `translate(-50%,-50%) rotate(${Math.sin(o / 30) * 2}deg)`}))}>TENSION</div>
        <div style={abs(540, 420, mk({fontSize: 90, color: RD}))}>⚡⚡⚡</div>
      </>}
    </div>
  </div>;
};

// ==== 2) CHALKBOARD PLAYBOOK: chalk sticks, X/O doodles, magnet-pinned photos ==============================================
export const Chalk = ({o, K}: S) => {
  const b = beatOf(o, K); if (!b) return null;
  const C = '#f4f1e6', Y = '#ffe066';
  const ch = (s: CSSProperties): CSSProperties => ({fontFamily: 'Caveat', fontWeight: 700, color: C, textShadow: '0 0 2px rgba(255,255,255,.5)', ...s});
  const Pin = ({x, y, f, d, at, rot = 0}: {x: number; y: number; f: string; d: number; at: number; rot?: number}) => {
    const p = sp(o, at, 12, 220); if (p <= 0.01) return null;
    return <div style={abs(x, y, {transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, border: `5px solid ${C}`, boxShadow: '0 10px 20px rgba(0,0,0,.4)'})}>
      {pic(f, {width: d, height: d})}<div style={abs(d / 2, -6, {width: 30, height: 30, borderRadius: 15, background: '#e63946', boxShadow: '0 3px 6px rgba(0,0,0,.4)'})} /></div>;
  };
  const XO = <svg width={1080} height={1077} style={{position: 'absolute', inset: 0, opacity: 0.25}}>
    {[[120, 150], [960, 160], [130, 900], [940, 880]].map(([x, y], i) => <g key={i} stroke={C} strokeWidth={6} fill="none">{i % 2 ? <circle cx={x} cy={y} r={28} /> : <path d={`M ${x - 26} ${y - 26} L ${x + 26} ${y + 26} M ${x + 26} ${y - 26} L ${x - 26} ${y + 26}`} />}</g>)}
  </svg>;
  return <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, #2f5a45, #173326 80%)', boxShadow: 'inset 0 0 0 22px #6b4a2b'}}>
    {XO}
    <div style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 0 1.5px rgba(255,255,255,.55))', opacity: 0.94}}>
      {b === 'ask' && <><Stick x={300} y={640} p={P.ASK} hat="wig" color={C} /><Stick x={790} y={640} p={P.IDLE} hat="cap" flip color={C} />
        <div style={abs(470, 220, ch({fontSize: 76}))}>{typed(o, K.who + 700, 'Who\'s your NBA GOAT?')}</div></>}
      {b === 'options' && <><Stick x={220} y={650} p={P.SCRATCH} hat="cap" color={C} />
        {OPTS.map(([f, l], i) => <Pin key={i} x={480 + i * 205} y={300} f={f} d={150} at={K.greatest + 200 + i * 220} rot={[-4, 3, -2][i]} />)}
        {OPTS.map(([, l], i) => o > K.greatest + 300 + i * 220 && <div key={i} style={abs(480 + i * 205, 430, ch({fontSize: 46}))}>{l}</div>)}
        {o > K.greatest + 900 && <div style={abs(690, 560, ch({fontSize: 64, color: Y}))}>GOAT = ?</div>}</>}
      {b === 'think' && <><Stick x={300} y={650} p={{...P.THINK, rL: 188 + Math.max(0, Math.sin(o / 110)) * 14}} hat="cap" color={C} />
        <Pin x={690} y={300} f={reel(o, K.think + 1200, K.gotta)} d={200} at={K.think + 1200} />
        <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}><path d="M 380 360 C 460 280 520 300 560 300" stroke={C} strokeWidth={7} fill="none" strokeDasharray="14 12" /></svg>
        <div style={abs(690, 540, ch({fontSize: 56}))}>{'hmm' + '.'.repeat(1 + (Math.floor(o / 300) % 3))}</div></>}
      {b === 'reveal' && <><Stick x={240} y={650} p={P.POINT} hat="cap" color={C} />
        <Stick x={830} y={650} p={o > K.della ? P.SHOCK : P.IDLE} hat="wig" flip color={C} fall={ez(o, K.della + 250, 450) * 0.9} />
        <Pin x={560} y={310} f={o >= K.della - 150 ? 'della.png' : reel(o, K.gotta - 2000, K.gotta)} d={230} at={K.gotta} />
        {o >= K.della && <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}><ellipse cx={560} cy={310} rx={175} ry={175} fill="none" stroke={Y} strokeWidth={9} pathLength={1} strokeDasharray={`${io(o, K.della, 450)} 1`} /></svg>}
        {o >= K.della + 300 && <div style={abs(560, 560, ch({fontSize: 80, color: Y, transform: `translate(-50%,-50%) scale(${sp(o, K.della + 300, 10, 220)})`}))}>THE PICK: DELLA</div>}</>}
      {b === 'tension' && <><Stick x={270} y={640} p={{...P.IDLE, lA: 200, rA: 160}} hat="cap" color={C} sweat={(o - K.tension) / 1000} />
        <Stick x={810} y={640} p={{...P.IDLE, lA: 200, rA: 160}} hat="wig" flip color={C} sweat={(o - K.tension) / 1000 + 0.3} />
        <div style={abs(540, 200, ch({fontSize: 120, color: Y, transform: `translate(-50%,-50%) rotate(${Math.sin(o / 30) * 2}deg)`}))}>tension...</div></>}
    </div>
  </div>;
};

// ==== 3) COMIC BOOK: halftone, thick outlines, balloons, KA-BOOM ===========================================================
export const Comic = ({o, K}: S) => {
  const b = beatOf(o, K); if (!b) return null;
  const k = '#111';
  const bang = (s: CSSProperties): CSSProperties => ({fontFamily: 'Bangers', letterSpacing: 2, color: k, ...s});
  const Panel = ({x, y, w, h, children, bg = '#fff', rot = 0, at}: {x: number; y: number; w: number; h: number; children?: ReactNode; bg?: string; rot?: number; at: number}) => {
    const p = sp(o, at, 13, 220);
    return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, border: `8px solid ${k}`, background: bg, overflow: 'hidden', transform: `rotate(${rot}deg) scale(${p})`, boxShadow: '10px 10px 0 rgba(0,0,0,.85)'}}>{children}</div>;
  };
  const Balloon = ({x, y, text, size = 46, at}: {x: number; y: number; text: string; size?: number; at: number}) => <div style={abs(x, y, {background: '#fff', border: `6px solid ${k}`, borderRadius: '50%', padding: '24px 34px',
    ...bang({fontSize: size}), transform: `translate(-50%,-50%) scale(${sp(o, at, 12, 220)})`, whiteSpace: 'nowrap'})}>{text}</div>;
  const Burst = ({x, y, r, c, text, at}: {x: number; y: number; r: number; c: string; text: string; at: number}) => {
    const pts = Array.from({length: 24}).map((_, i) => { const a = (i / 24) * Math.PI * 2, rr = i % 2 ? r * 0.62 : r; return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`; }).join(' ');
    const p = sp(o, at, 9, 240);
    return <><svg width={1080} height={1077} style={{position: 'absolute', inset: 0, transform: `scale(${p})`, transformOrigin: `${x}px ${y}px`}}><polygon points={pts} fill={c} stroke={k} strokeWidth={8} /></svg>
      <div style={abs(x, y, bang({fontSize: r * 0.42, color: '#fff', WebkitTextStroke: `4px ${k}`, paintOrder: 'stroke fill', transform: `translate(-50%,-50%) rotate(-8deg) scale(${p})`}))}>{text}</div></>;
  };
  return <div style={{position: 'absolute', inset: 0, background: '#ffd23f', backgroundImage: 'radial-gradient(rgba(0,0,0,.18) 22%, transparent 24%)', backgroundSize: '22px 22px'}}>
    {b === 'ask' && <><Panel x={40} y={40} w={1000} h={720} at={K.who + 600}>
      <Stick x={300} y={620} p={P.ASK} hat="wig" color={k} /><Stick x={760} y={620} p={P.IDLE} hat="cap" flip color={k} /></Panel>
      <Balloon x={430} y={190} text="WHO'S YOUR NBA GOAT?!" at={K.who + 800} /></>}
    {b === 'options' && <>{OPTS.map(([f, l], i) => <Panel key={i} x={40 + i * 340} y={60 + (i % 2) * 40} w={320} h={420} rot={[-2, 2, -1][i]} at={K.greatest + 150 + i * 220}>
      {pic(f, {width: '100%', height: 340})}<div style={{...bang({fontSize: 52}), textAlign: 'center'}}>{l}?</div></Panel>)}
      {o > K.greatest + 900 && <Balloon x={540} y={620} text="HMMMM..." at={K.greatest + 900} />}</>}
    {b === 'think' && <><Panel x={40} y={40} w={1000} h={720} at={K.think + 1200} bg="#9be7ff">
      <Stick x={300} y={640} p={{...P.THINK, rL: 188 + Math.max(0, Math.sin(o / 110)) * 14}} hat="cap" color={k} />
      <div style={abs(700, 300, {border: `8px solid ${k}`, borderRadius: '50%', overflow: 'hidden', width: 280, height: 280, background: '#fff'})}>{pic(reel(o, K.think + 1200, K.gotta), {width: '100%', height: '100%'})}</div></Panel>
      <div style={abs(700, 660, bang({fontSize: 70}))}>{'. '.repeat(1 + (Math.floor(o / 250) % 3))}</div></>}
    {b === 'reveal' && <><Burst x={540} y={330} r={330} c="#e63946" text="" at={K.della - 150} />
      <div style={abs(540, 330, {border: `10px solid ${k}`, borderRadius: '50%', overflow: 'hidden', width: 300, height: 300, transform: `translate(-50%,-50%) scale(${sp(o, K.della - 150, 9, 220)})`})}>{pic(o >= K.della - 150 ? 'della.png' : 'lebron.png', {width: '100%', height: '100%'})}</div>
      {o >= K.della + 150 && <Burst x={820} y={150} r={150} c="#3a86ff" text="KA-BOOM!" at={K.della + 150} />}
      <Stick x={170} y={700} p={P.POINT} hat="cap" color={k} s={1.1} />
      <Stick x={920} y={700} p={P.SHOCK} hat="wig" flip color={k} s={1.1} fall={ez(o, K.della + 250, 450) * 0.9} /></>}
    {b === 'tension' && <><svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}>{Array.from({length: 28}).map((_, i) => { const a = (i / 28) * Math.PI * 2;
      return <line key={i} x1={540 + Math.cos(a) * 200} y1={420 + Math.sin(a) * 200} x2={540 + Math.cos(a) * 800} y2={420 + Math.sin(a) * 800} stroke={k} strokeWidth={i % 2 ? 4 : 10} opacity={0.6} />; })}</svg>
      <Stick x={270} y={650} p={{...P.IDLE, lA: 200, rA: 160}} hat="cap" color={k} sweat={(o - K.tension) / 1000} />
      <Stick x={810} y={650} p={{...P.IDLE, lA: 200, rA: 160}} hat="wig" flip color={k} sweat={(o - K.tension) / 1000 + 0.3} />
      <Burst x={540} y={190} r={210} c="#e63946" text="TENSION!" at={K.tension - 150} /></>}
  </div>;
};

// ==== 4) ARCADE: pixel font, PLAYER SELECT grid, cursor, health bars ======================================================
const PIX = ['..XXX..', '..XXX..', '...X...', '.XXXXX.', 'X..X..X', '...X...', '..X.X..', '.X...X.'];
const Sprite = ({x, y, px = 18, c = '#fff', flip, hat}: {x: number; y: number; px?: number; c?: string; flip?: boolean; hat?: string}) => (
  <div style={abs(x, y, {transform: `translate(-50%,-50%) scaleX(${flip ? -1 : 1})`})}>
    {hat && <div style={{display: 'flex', justifyContent: 'center', marginBottom: -2}}><div style={{width: px * 4, height: px, background: hat}} /></div>}
    {PIX.map((r, i) => <div key={i} style={{display: 'flex'}}>{r.split('').map((ch, j) => <div key={j} style={{width: px, height: px, background: ch === 'X' ? c : 'transparent'}} />)}</div>)}
  </div>
);
export const Arcade = ({o, K}: S) => {
  const b = beatOf(o, K); if (!b) return null;
  const px = (s: CSSProperties): CSSProperties => ({fontFamily: 'VT323', color: '#fff', textShadow: '4px 4px 0 #ff2e88', letterSpacing: 2, ...s});
  const tiles: [string, string][] = [...OPTS, ['della.png', 'DELLA']];
  const Grid = ({cursor, lock}: {cursor: number; lock?: boolean}) => <div style={{position: 'absolute', left: 90, top: 150, display: 'grid', gridTemplateColumns: 'repeat(4, 210px)', gap: 20}}>
    {tiles.map(([f, l], i) => { const hidden = i === 3 && !lock; const sel = i === cursor;
      return <div key={i} style={{width: 210, height: 260, border: `8px solid ${sel ? (Math.floor(o / 120) % 2 ? '#ffd60a' : '#ff2e88') : '#3a3a7a'}`, background: '#14143a', imageRendering: 'pixelated', position: 'relative'}}>
        {hidden ? <div style={abs(105, 120, px({fontSize: 140}))}>?</div> : pic(f, {width: '100%', height: 200, filter: sel ? 'none' : 'grayscale(.6) brightness(.7)'})}
        <div style={{...px({fontSize: 38, textShadow: 'none'}), textAlign: 'center'}}>{hidden ? '???' : l.toUpperCase()}</div></div>; })}
  </div>;
  return <div style={{position: 'absolute', inset: 0, background: '#0b0b2a', backgroundImage: 'radial-gradient(#fff 1px, transparent 1.5px)', backgroundSize: '70px 70px'}}>
    {b === 'ask' && <><Sprite x={300} y={420} hat="#E8B84A" /><Sprite x={780} y={420} hat="#111" c="#7fe9ef" flip />
      <div style={{position: 'absolute', left: 60, right: 60, top: 600, height: 150, border: '6px solid #fff', background: '#000', padding: 24, ...px({fontSize: 52, textShadow: 'none'})}}>
        HOST: {typed(o, K.who + 700, 'WHO IS YOUR NBA GOAT?', 24)}{Math.floor(o / 300) % 2 ? '▮' : ''}</div></>}
    {b === 'options' && <><div style={abs(540, 80, px({fontSize: 84}))}>PLAYER SELECT</div><Grid cursor={Math.floor((o - K.greatest) / 400) % 3} />
      <div style={abs(540, 560, px({fontSize: 48}))}>CHOOSE YOUR GOAT</div></>}
    {b === 'think' && <><div style={abs(540, 80, px({fontSize: 84}))}>PLAYER SELECT</div><Grid cursor={Math.floor((o - K.think) / interpolate(o, [K.think, K.gotta], [380, 120], clamp)) % 3} />
      <div style={abs(540, 560, px({fontSize: 52, color: '#ffd60a'}))}>{`TIME: ${Math.max(0, 9 - Math.floor((o - K.think - 1200) / 380))}`}</div></>}
    {b === 'reveal' && <><div style={abs(540, 80, px({fontSize: 84}))}>{o >= K.della - 150 ? 'P1 SELECTS...' : 'PLAYER SELECT'}</div><Grid cursor={o >= K.della - 150 ? 3 : Math.floor(o / 90) % 3} lock={o >= K.della - 150} />
      {o >= K.della + 150 && <div style={abs(540, 570, px({fontSize: 96, color: '#ffd60a', transform: `translate(-50%,-50%) scale(${sp(o, K.della + 150, 9, 240)})`}))}>DELLAVEDOVA!!</div>}</>}
    {b === 'tension' && <>{[0, 1].map((i) => { const hp = Math.max(0.12, 1 - ez(o, K.tension, 900) * (0.6 + i * 0.2));
      return <div key={i} style={{position: 'absolute', top: 90, [i ? 'right' : 'left']: 60, width: 420}}><div style={px({fontSize: 40, textShadow: 'none'})}>{i ? 'HOST' : 'TREVOR'}</div>
        <div style={{height: 40, border: '5px solid #fff', background: '#300'}}><div style={{width: `${hp * 100}%`, height: '100%', background: hp > 0.4 ? '#2fd25a' : '#ff2e88'}} /></div></div>; })}
      <Sprite x={320} y={460} hat="#111" c="#7fe9ef" /><Sprite x={760} y={460} hat="#E8B84A" flip />
      <div style={abs(540 + Math.sin(o / 30) * 6, 650, px({fontSize: 120, color: '#ff2e88', textShadow: '6px 6px 0 #ffd60a'}))}>TENSION!</div></>}
  </div>;
};

// ==== 5) TEXT MESSAGE STORY: the chat between host and Trevor, "Trevor is typing…" through the long pause ================
export const Chat = ({o, K}: S) => {
  const b = beatOf(o, K); if (!b) return null;
  const msgs: {me: boolean; at: number; text?: string; img?: string; react?: number}[] = [
    {me: false, at: K.who + 650, text: 'who is your NBA GOAT? 🏀'},
    {me: true, at: K.nba - 100, text: 'NBA goat?'},
    {me: false, at: K.greatest, text: 'greatest of all time NBA player'},
    {me: true, at: K.della - 400, text: 'gotta be Matthew Dellavedova, man'},
    {me: true, at: K.della + 150, img: 'della.png', react: K.della + 800},
    {me: false, at: K.tension - 150, text: 'I could feel the tension 😬'},
  ];
  const shown = msgs.filter((m) => o >= m.at);
  const typing = on(o, K.think + 1200, K.della - 400);
  const H = shown.reduce((h, m) => h + (m.img ? 250 : 110), 0) + (typing ? 110 : 0);
  const shift = Math.max(0, H - 520);
  return <div style={{position: 'absolute', inset: 0, background: '#f2f2f7', fontFamily: '-apple-system, Inter, sans-serif'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 140, background: 'rgba(248,248,250,.96)', borderBottom: '1px solid #ddd', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2}}>
      <div style={{width: 74, height: 74, borderRadius: 37, background: '#00A3AD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 34, fontFamily: 'Inter'}}>16</div>
      <div style={{fontSize: 28, fontFamily: 'Inter', fontWeight: 700, marginTop: 4}}>Trevor 🏈</div>
    </div>
    <div style={{position: 'absolute', left: 30, right: 30, top: 160, transform: `translateY(${-shift}px)`, display: 'flex', flexDirection: 'column', gap: 18}}>
      {shown.map((m, i) => { const p = sp(o, m.at, 14, 260);
        return <div key={i} style={{alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: 760, transform: `scale(${p})`, transformOrigin: m.me ? '100% 100%' : '0 100%', position: 'relative'}}>
          {m.img ? <div style={{borderRadius: 30, overflow: 'hidden', border: '4px solid #fff'}}>{pic(m.img, {width: 300, height: 220})}</div>
            : <div style={{background: m.me ? '#0a84ff' : '#e5e5ea', color: m.me ? '#fff' : '#111', borderRadius: 36, padding: '22px 32px', fontSize: 46, fontFamily: 'Inter', fontWeight: 500}}>{m.text}</div>}
          {m.react && o >= m.react && <div style={{position: 'absolute', left: -40, top: -40, width: 90, height: 90, borderRadius: 45, background: '#e5e5ea', border: '5px solid #f2f2f7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${sp(o, m.react, 10, 260)})`}}><Img src={staticFile('emoji-ios/1f602.png')} style={{width: 56}} /></div>}
        </div>; })}
      {typing && <div style={{alignSelf: 'flex-end', background: '#0a84ff', borderRadius: 36, padding: '30px 34px', display: 'flex', gap: 12}}>
        {[0, 1, 2].map((i) => <div key={i} style={{width: 20, height: 20, borderRadius: 10, background: '#fff', opacity: 0.4 + 0.6 * Math.max(0, Math.sin(o / 160 - i * 0.9))}} />)}</div>}
    </div>
    {typing && <div style={{position: 'absolute', left: 0, right: 0, top: 150, zIndex: 3, textAlign: 'center', fontFamily: 'Inter', fontWeight: 600, fontSize: 30, color: '#8e8e93'}}>Trevor is typing… ({Math.floor((o - K.think) / 1000) + 1}s)</div>}
  </div>;
};
