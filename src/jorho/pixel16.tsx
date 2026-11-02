// Jorho v16 pixel (user, 2026-11-02): "2d pixel animations (people)" → answers: chunky 8-bit, podcast table → dream court
// mix, mostly pixel (real footage only for the opening two-shot and the laugh), Game Boy green. Everything in the layer is
// drawn in greys and mapped to the 4 GB greens by one SVG filter, so player photos become 8-bit portraits too.
import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {on, sp} from './flat9';
import type {GoatK} from './stick12';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PX = 12; // screen pixels per art pixel
// greys that land on the 4 GB shades after the filter
const G = {d: '#111', m: '#555', l: '#aaa', w: '#eee'};
const map: Record<string, string> = {D: G.d, M: G.m, L: G.l, W: G.w};
// a sprite from rows of chars (D/M/L/W, '.' = clear)
const Spr = ({rows, x, y, s = PX, flip}: {rows: string[]; x: number; y: number; s?: number; flip?: boolean}) => (
  <svg width={rows[0].length * s} height={rows.length * s} shapeRendering="crispEdges" style={{position: 'absolute', left: x, top: y, transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible'}}>
    {rows.flatMap((r, j) => r.split('').map((c, i) => (c === '.' ? null : <rect key={`${i}-${j}`} x={i * s} y={j * s} width={s} height={s} fill={map[c]} />)))}
  </svg>
);
const BODY = {
  stand: ['..MMMMMM..', '.LMMMMMML.', 'L.MMMMMM.L', 'L.MMMMMM.L', '..MMMMMM..', '..DDDDDD..', '..DD..DD..', '..LL..LL..', '..LL..LL..', '.DDD..DDD.'],
  runA: ['..MMMMMM..', '.LMMMMMM.L', 'L.MMMMMM..', '..MMMMMM..', '..MMMMMM..', '..DDDDDD..', '.DD....DD.', 'LL......LL', 'L........L', 'DD.....DD.'],
  runB: ['..MMMMMM..', 'L.MMMMMML.', '..MMMMMM.L', '..MMMMMM..', '..MMMMMM..', '..DDDDDD..', '...DDDD...', '...LLLL...', '...L..L...', '..DD..DD..'],
  jump: ['L.MMMMMM.L', 'L.MMMMMM.L', '.LMMMMMML.', '..MMMMMM..', '..MMMMMM..', '..DDDDDD..', '.DD....DD.', 'LL......LL', '..........', '..........'],
};
const HEADS: Record<string, string[]> = {
  trevor: ['..DDDDDD..', '.DDDDDDDDD', '.LLLLLLL..', 'LLDLLLDLL.', 'LLLLLLLLL.', 'LLLLDDLLL.', 'WLLLLLLLW.', 'W.LLLLL.W.'],
  host: ['.WWWWWWWW.', 'WMMMMMMMMW', 'WLLLLLLLLW', 'WLDLLLDLLW', 'WLLLLLLLLW', 'WLLLDDLLLW', 'W.LLLLLL.W', 'W........W'],
};
// a pixel person: drawn head or a real photo pixelated into an 8-bit portrait
const Person = ({x, y, pose = 'stand', head, photo, num, flip, sweat, k = 1}: {x: number; y: number; pose?: keyof typeof BODY; head?: string; photo?: string; num?: string; flip?: boolean; sweat?: number; k?: number}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 10 * PX, height: 18 * PX, transform: `scale(${k})`, transformOrigin: '50% 100%'}}>
    {photo ? <div style={{position: 'absolute', left: PX, top: 0, width: 8 * PX, height: 8 * PX, overflow: 'hidden'}}>
      <Img src={staticFile(`img/jorho/${photo}`)} style={{width: 8, height: 8, objectFit: 'cover', objectPosition: '50% 15%', transform: `scale(${PX})`, transformOrigin: '0 0', imageRendering: 'pixelated'}} /></div>
      : <Spr rows={HEADS[head ?? 'trevor']} x={0} y={0} flip={flip} />}
    <Spr rows={BODY[pose]} x={0} y={8 * PX} flip={flip} />
    {num && <div style={{position: 'absolute', left: 3 * PX, top: 9 * PX, width: 4 * PX, textAlign: 'center', fontFamily: 'VT323', fontSize: 40, lineHeight: 1, color: G.w}}>{num}</div>}
    {sweat !== undefined && [0, 1].map((i) => <div key={i} style={{position: 'absolute', left: (flip ? -2 : 10) * PX + i * PX, top: ((sweat * 3 + i * 2) % 6) * PX, width: PX, height: PX * 2, background: G.w}} />)}
  </div>
);
const txt = (s: CSSProperties): CSSProperties => ({fontFamily: 'VT323', color: G.d, lineHeight: 1, whiteSpace: 'nowrap', ...s});
const Box = ({x, y, w, h, children, tail}: {x: number; y: number; w: number; h: number; children?: ReactNode; tail?: 'l' | 'r'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: G.w, border: `${PX / 2}px solid ${G.d}`, boxShadow: `${PX / 2}px ${PX / 2}px 0 ${G.m}`}}>
    {children}{tail && <div style={{position: 'absolute', [tail === 'l' ? 'left' : 'right']: 40, bottom: -PX * 2, width: PX * 2, height: PX * 2, background: G.d}} />}
  </div>
);
const type = (o: number, at: number, t: string, cps = 22) => t.slice(0, Math.max(0, Math.floor(((o - at) / 1000) * cps)));
const step = (o: number, ms = 160) => Math.floor(o / ms) % 2; // 2-frame animation clock

export const GoatPixel = ({o, K}: {o: number; K: GoatK}) => {
  const live = on(o, K.who + 600, K.della + 1500) || o >= K.tension - 200;
  if (!live) return null;
  const scene = o < K.think ? 'table' : o < K.della + 1500 ? 'court' : 'tension';
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
    <svg width={0} height={0} style={{position: 'absolute'}}><filter id="gb" colorInterpolationFilters="sRGB"><feColorMatrix type="saturate" values="0" />
      <feComponentTransfer><feFuncR type="discrete" tableValues="0.059 0.188 0.545 0.608" /><feFuncG type="discrete" tableValues="0.22 0.384 0.675 0.737" /><feFuncB type="discrete" tableValues="0.059 0.188 0.059 0.059" /></feComponentTransfer></filter></svg>
    <div style={{position: 'absolute', inset: 0, filter: 'url(#gb)', background: G.w}}>
      {scene === 'table' && <Table o={o} K={K} />}
      {scene === 'court' && <Court o={o} K={K} />}
      {scene === 'tension' && <Tension o={o} K={K} />}
    </div>
    {/* LCD dot grid */}
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(15,56,15,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(15,56,15,.18) 1px, transparent 1px)', backgroundSize: `${PX / 2}px ${PX / 2}px`, pointerEvents: 'none'}} />
  </div>;
};
type P = {o: number; K: GoatK};
// podcast table: host asks, Trevor echoes, candidates pop in Trevor's thought bubble
const Table = ({o, K}: P) => {
  const tblY = 640;
  const cands: [string, string][] = [['lebron.png', 'LBJ'], ['kobe.png', 'KOBE'], ['curry.png', 'CURRY']];
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: G.l}} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} style={{position: 'absolute', left: i * 140, top: 380, width: 140, height: 12, background: G.m}} />)}
    <Person k={1.8} x={200} y={tblY - 8 * PX - 4} head="host" pose={on(o, K.who + 600, K.nba) || on(o, K.greatest, K.think) ? (step(o) ? 'jump' : 'stand') : 'stand'} />
    <Person k={1.8} x={760} y={tblY - 8 * PX - 4} head="trevor" flip num="16" />
    <div style={{position: 'absolute', left: 60, top: tblY, width: 960, height: 120, background: G.d, borderTop: `${PX}px solid ${G.m}`}} />
    {[290, 830].map((x) => <Spr key={x} rows={['.DD.', 'DMMD', 'DMMD', '.DD.', '..D.', '..D.']} x={x} y={tblY - 6 * PX} />)}
    {on(o, K.who + 600, K.nba) && <Box x={90} y={140} w={620} h={120} tail="l"><div style={txt({fontSize: 64, padding: '22px 26px'})}>{type(o, K.who + 700, "WHO'S YOUR NBA GOAT?")}</div></Box>}
    {on(o, K.nba, K.greatest) && <Box x={560} y={160} w={360} h={110} tail="r"><div style={txt({fontSize: 64, padding: '20px 26px'})}>NBA GOAT?</div></Box>}
    {on(o, K.greatest, K.think) && <>
      <Box x={70} y={60} w={560} h={110} tail="l"><div style={txt({fontSize: 52, padding: '22px 22px'})}>{type(o, K.greatest, 'GREATEST OF ALL TIME!', 30)}</div></Box>
      <Box x={560} y={190} w={460} h={170} tail="r">{cands.map(([f, l], i) => o > K.greatest + 300 + i * 250 && <div key={i} style={{position: 'absolute', left: 20 + i * 145, top: 14}}>
        <div style={{width: 8 * 13, height: 8 * 13, overflow: 'hidden', border: `4px solid ${G.d}`}}><Img src={staticFile(`img/jorho/${f}`)} style={{width: 8, height: 8, objectFit: 'cover', objectPosition: '50% 15%', transform: 'scale(13)', transformOrigin: '0 0', imageRendering: 'pixelated'}} /></div>
        <div style={txt({fontSize: 30, textAlign: 'center'})}>{l}</div></div>)}</Box>
    </>}
  </>;
};
// dream court: candidates dribble as pixel players while the timer runs; Della runs in and dunks
const Court = ({o, K}: P) => {
  const reveal = o >= K.della - 600;
  const secs = Math.max(0, (o - K.think) / 1000);
  const hoopX = 820;
  const dx = interpolate(o, [K.della - 600, K.della], [80, hoopX - 120], clamp);
  const jumpY = Math.sin(interpolate(o, [K.della - 250, K.della + 250], [0, Math.PI], clamp)) * 230;
  return <>
    {/* dream border + court */}
    <div style={{position: 'absolute', inset: 0, background: G.l}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, bottom: 0, background: G.m}} />
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: 'absolute', left: i * 190 - 20, top: 560, width: 12, height: 520, background: G.l, opacity: 0.4}} />)}
    {Array.from({length: 22}).map((_, i) => <div key={i} style={{position: 'absolute', left: (i * 53) % 1080, top: 430 + (i % 3) * 30 - (step(o + i * 70, 220) ? PX : 0), width: PX * 3, height: PX * 4, background: G.m}} />)}
    {/* hoop */}
    <div style={{position: 'absolute', left: hoopX + 90, top: 170, width: PX * 2, height: 400, background: G.d}} />
    <div style={{position: 'absolute', left: hoopX - 10, top: 150, width: 130, height: 90, background: G.w, border: `${PX / 2}px solid ${G.d}`}} />
    <div style={{position: 'absolute', left: hoopX - 30, top: 240, width: 100, height: PX, background: G.d}} />
    {!reveal ? <>
      {[['lebron.png', '23'], ['kobe.png', '24'], ['curry.png', '30']].map(([f, n], i) => {
        const x = 90 + i * 230 + Math.sin(o / 500 + i) * 40;
        return <div key={i}><Person k={1.5} x={x} y={560 - 2 * PX} photo={f} num={n} pose={step(o + i * 80) ? 'runA' : 'runB'} />
          <div style={{position: 'absolute', left: x + 8 * PX, top: 560 + 9 * PX + (step(o + i * 80, 120) ? 0 : 3 * PX), width: PX * 3, height: PX * 3, background: G.d, borderRadius: 0}} />
          <div style={txt({position: 'absolute', left: x + 30, top: 380 - (step(o + i * 120, 300) ? 10 : 0), fontSize: 80, color: G.d})}>?</div></div>;
      })}
      <Box x={60} y={40} w={430} h={100}><div style={txt({fontSize: 60, padding: '16px 22px'})}>{`THINKING ${secs.toFixed(1)}s`}</div></Box>
    </> : <>
      <Person k={1.6} x={dx} y={560 - 2 * PX - jumpY} photo="della.png" num="8" pose={o < K.della - 250 ? (step(o, 100) ? 'runA' : 'runB') : 'jump'} />
      {o >= K.della + 150 && <>
        <Box x={110} y={60} w={600} h={140}><div style={txt({fontSize: 110, padding: '14px 26px'})}>DELLA!!</div></Box>
        <Box x={240} y={250} w={560} h={90}><div style={txt({fontSize: 56, padding: '14px 22px'})}>{step(o, 250) ? '★ NEW GOAT ★' : '  NEW GOAT  '}</div></Box>
      </>}
    </>}
  </>;
};
// back at the table: both sweating, screen shakes, TENSION blinks
const Tension = ({o, K}: P) => {
  const sh = (step(o, 60) ? 1 : -1) * PX / 2;
  return <div style={{position: 'absolute', inset: 0, transform: `translateX(${sh}px)`}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 380, background: G.l}} />
    <Person k={1.8} x={200} y={640 - 8 * PX - 4} head="trevor" num="16" sweat={(o - K.tension) / 300} />
    <Person k={1.8} x={760} y={640 - 8 * PX - 4} head="host" flip sweat={(o - K.tension) / 300 + 1} />
    <div style={{position: 'absolute', left: 60, top: 640, width: 960, height: 120, background: G.d, borderTop: `${PX}px solid ${G.m}`}} />
    {step(o, 200) ? <Box x={240} y={110} w={600} h={150}><div style={txt({fontSize: 130, padding: '8px 30px'})}>TENSION</div></Box> : null}
    {[0, 1, 2].map((i) => <Spr key={i} rows={['..D', '.D.', 'DDD', '.D.', 'D..']} x={470 + i * 50} y={380 + (step(o + i * 50, 90) ? PX : 0)} />)}
  </div>;
};
export {sp};
