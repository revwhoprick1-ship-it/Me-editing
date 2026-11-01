// Jorho v15 (user, 2026-11-01): 3 more NBA GOAT edits from the other Pinterest refs — premium gold podcast, colour-block
// collage, dark neon. Same beats as v12–v14 (ask → options → think → Della → laugh real → tension), half footage.
import type {CSSProperties} from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {ez, io, sp} from './flat9';
import type {GoatK} from './stick12';
import {beatOf} from './styles13';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const C3: [string, string][] = [['lebron.png', 'LeBron'], ['kobe.png', 'Kobe'], ['curry.png', 'Curry']];
const img = (f: string, s: CSSProperties) => <Img src={staticFile(`img/jorho/${f}`)} style={{objectFit: 'cover', objectPosition: '50% 18%', display: 'block', ...s}} />;
const cycle = (o: number, a: number, b: number) => C3[Math.floor((o - a) / interpolate(o, [a, b], [300, 90], clamp)) % 3][0];
type P = {o: number; K: GoatK};

// ==== 1) PREMIUM GOLD: dark gradient, glowing gold serif italics, floating rounded cards in perspective =====================
const GOLD = '#f5c45e';
const serif = (s: CSSProperties): CSSProperties => ({fontFamily: 'Instrument Serif', fontStyle: 'italic', color: GOLD, textShadow: '0 0 28px rgba(245,196,94,.65)', lineHeight: 1, whiteSpace: 'nowrap', ...s});
const sans = (s: CSSProperties): CSSProperties => ({fontFamily: 'Inter', fontWeight: 700, color: '#fff', ...s});
const GCard = ({f, x, y, w, rot, p, label}: {f: string; x: number; y: number; w: number; rot: number; p: number; label?: string}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `perspective(900px) rotateY(${rot}deg) translateY(${(1 - p) * 120}px)`, opacity: p}}>
    <div style={{borderRadius: 34, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,.6), 0 0 0 2px rgba(245,196,94,.5)'}}>{img(f, {width: w, height: w * 1.15})}</div>
    {label && <div style={{...sans({fontSize: 30}), textAlign: 'center', marginTop: 14}}>{label}</div>}
  </div>
);
export const GoatPremium = ({o, K}: P) => {
  const b = beatOf(o, K); if (!b) return null;
  const bg = 'radial-gradient(ellipse at 50% 35%, #2a2117 0%, #0b0a09 70%)';
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: bg}}>
    {b === 'ask' && <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', ...sans({fontSize: 60, opacity: ez(o, K.who + 600, 300)})}}>who is your</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', ...serif({fontSize: 230, opacity: ez(o, K.who + 800, 400), filter: `blur(${(1 - ez(o, K.who + 800, 400)) * 12}px)`})}}>NBA goat?</div>
    </>}
    {b === 'options' && <>{C3.map(([f, l], i) => <GCard key={i} f={f} x={210 + i * 330} y={170 + (i === 1 ? -30 : 20)} w={270} rot={[22, 0, -22][i]} p={sp(o, K.greatest + i * 200, 15, 170)} label={l} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', ...serif({fontSize: 96, opacity: ez(o, K.greatest + 800, 400)})}}>greatest of all time?</div></>}
    {b === 'think' && <>
      <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}><circle cx={540} cy={330} r={230} fill="none" stroke="rgba(245,196,94,.18)" strokeWidth={10} />
        <circle cx={540} cy={330} r={230} fill="none" stroke={GOLD} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${io(o, K.think + 1200, K.gotta - K.think - 1200)} 1`} transform="rotate(-90 540 330)" style={{filter: 'drop-shadow(0 0 10px rgba(245,196,94,.8))'}} /></svg>
      <div style={{position: 'absolute', left: 540 - 190, top: 140, width: 380, height: 380, borderRadius: '50%', overflow: 'hidden'}}>{img(cycle(o, K.think + 1200, K.gotta), {width: '100%', height: '100%', filter: 'brightness(.85)'})}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', ...serif({fontSize: 90})}}>{'thinking' + '.'.repeat(1 + (Math.floor(o / 300) % 3))}</div></>}
    {b === 'reveal' && (o < K.della - 150 ? <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', ...serif({fontSize: 150, opacity: ez(o, K.gotta, 300)})}}>gotta be…</div> : <>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 38%, rgba(245,196,94,${0.35 * ez(o, K.della - 150, 400)}), transparent 55%)`}} />
      <GCard f="della.png" x={540} y={110} w={360} rot={Math.sin(o / 600) * 8} p={sp(o, K.della - 150, 13, 200)} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', ...serif({fontSize: 130, opacity: ez(o, K.della + 250, 400)})}}>the GOAT.</div></>)}
    {b === 'tension' && <>
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 220px rgba(0,0,0,.9)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', transform: `translateX(${Math.sin(o / 28) * 6}px)`, ...serif({fontSize: 210})}}>tension</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 580, textAlign: 'center', ...sans({fontSize: 40, color: 'rgba(255,255,255,.7)', letterSpacing: 8})}}>YOU COULD FEEL IT</div></>}
  </div>;
};

// ==== 2) COLOUR-BLOCK COLLAGE: solid brights, torn paper, tape, white-outlined sticker cut-outs, mixed fonts =================
const OR = '#ff6b1a', YE = '#ffd23f', BL = '#2f5bff', K0 = '#111';
const sticker = 'drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 16px 14px rgba(0,0,0,.35))';
const Torn = ({x, y, w, h, rot, c = '#fff', p = 1}: {x: number; y: number; w: number; h: number; rot: number; c?: string; p?: number}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: c, transform: `rotate(${rot}deg) scaleX(${p})`, transformOrigin: '0 50%',
    clipPath: 'polygon(0 6%,8% 0,17% 5%,26% 1%,38% 6%,49% 0,61% 5%,72% 1%,84% 6%,93% 1%,100% 5%,100% 95%,92% 100%,81% 94%,70% 99%,58% 95%,46% 100%,35% 94%,24% 99%,13% 95%,4% 100%,0 94%)', boxShadow: '0 8px 16px rgba(0,0,0,.2)'}} />
);
const Tape = ({x, y, rot}: {x: number; y: number; rot: number}) => <div style={{position: 'absolute', left: x, top: y, width: 120, height: 38, background: 'rgba(255,255,255,.75)', transform: `rotate(${rot}deg)`}} />;
const Stk = ({f, x, y, w, p, rot = 0}: {f: string; x: number; y: number; w: number; p: number; rot?: number}) => (
  <Img src={staticFile(`img/jorho/${f}`)} style={{position: 'absolute', left: x - w / 2, top: y, width: w, filter: sticker, transform: `rotate(${rot + (1 - p) * 20}deg) scale(${p})`, transformOrigin: '50% 100%'}} />
);
const big = (font: string, s: CSSProperties): CSSProperties => ({fontFamily: font, color: K0, lineHeight: 0.9, whiteSpace: 'nowrap', ...s});
export const GoatCollage = ({o, K}: P) => {
  const b = beatOf(o, K); if (!b) return null;
  const bg = b === 'options' ? YE : b === 'reveal' ? BL : OR;
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: bg}}>
    {b === 'ask' && <>
      <Torn x={60} y={170} w={760} h={190} rot={-4} p={io(o, K.who + 600, 300)} />
      <div style={{position: 'absolute', left: 110, top: 200, transform: 'rotate(-4deg)', ...big('Anton', {fontSize: 140, opacity: ez(o, K.who + 750, 200)})}}>WHO'S YOUR</div>
      <Torn x={240} y={380} w={780} h={230} rot={3} c={K0} p={io(o, K.who + 900, 300)} />
      <div style={{position: 'absolute', left: 280, top: 400, transform: 'rotate(3deg)', ...big('Bangers', {fontSize: 190, color: YE, opacity: ez(o, K.who + 1050, 200)})}}>NBA GOAT?</div>
      <Tape x={40} y={160} rot={-30} /><Tape x={900} y={560} rot={25} />
    </>}
    {b === 'options' && <>{C3.map(([f, l], i) => { const p = sp(o, K.greatest + i * 220, 11, 220); const x = 190 + i * 350;
      return <div key={i}><Torn x={x - 150} y={120 + (i % 2) * 60} w={300} h={380} rot={[-5, 4, -3][i]} p={p} /><Stk f={f} x={x} y={160 + (i % 2) * 60} w={300} p={p} rot={[-5, 4, -3][i]} />
        <div style={{position: 'absolute', left: x - 120, top: 470 + (i % 2) * 60, transform: `rotate(${[-5, 4, -3][i]}deg) scale(${p})`, ...big('Permanent Marker', {fontSize: 58})}}>{l}?</div><Tape x={x - 60} y={100 + (i % 2) * 60} rot={-8 + i * 6} /></div>; })}
      {o > K.greatest + 900 && <div style={{position: 'absolute', left: 340, top: 610, transform: `rotate(-3deg) scale(${sp(o, K.greatest + 900, 10, 230)})`, ...big('Bangers', {fontSize: 110, color: '#fff', WebkitTextStroke: `5px ${K0}`, paintOrder: 'stroke fill'})}}>PICK ONE!</div>}</>}
    {b === 'think' && <>
      <Torn x={160} y={110} w={760} h={480} rot={2} />
      <Stk f={cycle(o, K.think + 1200, K.gotta)} x={540} y={150} w={420} p={1} rot={Math.sin(o / 120) * 4} />
      {['🤔', '⏳', '❓'].map((e, i) => <div key={i} style={{position: 'absolute', left: [110, 860, 900][i], top: [130, 160, 470][i], fontSize: 110, transform: `rotate(${Math.sin(o / 200 + i) * 14}deg) scale(${sp(o, K.think + 1300 + i * 300, 10, 220)})`}}>{e}</div>)}
      <div style={{position: 'absolute', left: 230, top: 600, transform: 'rotate(-2deg)', background: K0, padding: '6px 28px', ...big('Permanent Marker', {fontSize: 70, color: '#fff'})}}>{'still thinking' + '.'.repeat(1 + (Math.floor(o / 300) % 3))}</div></>}
    {b === 'reveal' && (o < K.della - 150 ? <div style={{position: 'absolute', left: 120, top: 330, transform: 'rotate(-3deg)', ...big('Bangers', {fontSize: 190, color: '#fff'})}}>GOTTA BE...</div> : <>
      {Array.from({length: 10}).map((_, i) => <div key={i} style={{position: 'absolute', left: 540, top: 330, width: 900, height: 70, background: i % 2 ? YE : OR, transformOrigin: '0 50%', transform: `rotate(${i * 36 + (o - K.della) / 30}deg) scaleX(${ez(o, K.della - 150, 400)})`, opacity: 0.9}} />)}
      <Torn x={290} y={70} w={500} h={540} rot={-3} p={sp(o, K.della - 150, 12, 220)} />
      <Stk f="della.png" x={540} y={130} w={460} p={sp(o, K.della - 50, 10, 220)} rot={-3} />
      <div style={{position: 'absolute', left: 160, top: 610, transform: `rotate(-4deg) scale(${sp(o, K.della + 300, 10, 230)})`, background: YE, padding: '0 26px', border: `6px solid ${K0}`, ...big('Bangers', {fontSize: 120})}}>THE GOAT ★</div></>)}
    {b === 'tension' && <>
      {[0, 1, 2].map((i) => <Torn key={i} x={-40} y={150 + i * 190} w={1160} h={130} rot={[-3, 2, -2][i]} c={i === 1 ? K0 : '#fff'} p={io(o, K.tension - 200 + i * 120, 300)} />)}
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 60 + Math.sin(o / 25 + i) * 6, top: 160 + i * 190, transform: `rotate(${[-3, 2, -2][i]}deg)`, opacity: ez(o, K.tension - 50 + i * 120, 200),
        ...big(['Anton', 'Bangers', 'Permanent Marker'][i], {fontSize: 110, color: i === 1 ? OR : K0})}}>TENSION TENSION</div>)}</>}
  </div>;
};

// ==== 3) DARK NEON: black, glowing cyan lines, live counters, a "GOAT RATING" chart =========================================
const NE = '#3df2ff';
const glow = (s: CSSProperties): CSSProperties => ({fontFamily: 'Inter', fontWeight: 800, color: '#fff', textShadow: `0 0 18px ${NE}, 0 0 40px rgba(61,242,255,.5)`, whiteSpace: 'nowrap', ...s});
const NCircle = ({f, x, y, d, p, on = false}: {f: string; x: number; y: number; d: number; p: number; on?: boolean}) => (
  <div style={{position: 'absolute', left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: '50%', overflow: 'hidden', border: `4px solid ${on ? NE : 'rgba(255,255,255,.25)'}`, boxShadow: on ? `0 0 30px ${NE}` : 'none', transform: `scale(${p})`}}>
    {img(f, {width: '100%', height: '100%', filter: on ? 'none' : 'grayscale(1) brightness(.6)'})}</div>
);
export const GoatNeon = ({o, K}: P) => {
  const b = beatOf(o, K); if (!b) return null;
  const grid = <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(61,242,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(61,242,255,.07) 1px, transparent 1px)', backgroundSize: '54px 54px'}} />;
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#05070a'}}>{grid}
    {b === 'ask' && <>
      <div style={{position: 'absolute', left: 90, top: 200, ...glow({fontSize: 40, color: NE, textShadow: 'none', letterSpacing: 6, opacity: ez(o, K.who + 600, 300)})}}>QUERY</div>
      <div style={{position: 'absolute', left: 90, top: 260, ...glow({fontSize: 110})}}>{'NBA GOAT?'.slice(0, Math.floor((o - K.who - 700) / 70))}<span style={{opacity: Math.floor(o / 300) % 2}}>▌</span></div>
      <div style={{position: 'absolute', left: 90, top: 420, width: 900 * io(o, K.who + 900, 500), height: 4, background: NE, boxShadow: `0 0 16px ${NE}`}} /></>}
    {b === 'options' && <>{C3.map(([f, l], i) => { const v = [0.92, 0.9, 0.86][i] * ez(o, K.greatest + 300 + i * 200, 700);
      return <div key={i} style={{position: 'absolute', left: 90, top: 130 + i * 170, display: 'flex', alignItems: 'center', gap: 26}}>
        <NCircle f={f} x={65} y={65} d={130} p={sp(o, K.greatest + i * 200, 14, 220)} on />
        <div style={{position: 'relative', left: 130}}><div style={glow({fontSize: 40})}>{l}</div>
          <div style={{width: 620, height: 18, background: 'rgba(255,255,255,.1)', marginTop: 10, borderRadius: 9}}><div style={{width: `${v * 100}%`, height: '100%', background: NE, borderRadius: 9, boxShadow: `0 0 14px ${NE}`}} /></div></div>
        <div style={{position: 'absolute', left: 900, ...glow({fontSize: 40})}}>{Math.round(v * 100)}</div></div>; })}
      <div style={{position: 'absolute', left: 90, top: 660, ...glow({fontSize: 34, color: NE, textShadow: 'none', letterSpacing: 6})}}>GOAT RATING · CALCULATING</div></>}
    {b === 'think' && <>
      {[0, 1, 2].map((i) => <NCircle key={i} f={C3[i][0]} x={260 + i * 280} y={320} d={210} p={1} on={Math.floor((o - K.think) / interpolate(o, [K.think, K.gotta], [380, 100], clamp)) % 3 === i} />)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', ...glow({fontSize: 130})}}>{((o - K.think) / 1000 + 0.6).toFixed(1)}s</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 670, textAlign: 'center', ...glow({fontSize: 32, color: NE, textShadow: 'none', letterSpacing: 6})}}>PROCESSING…</div></>}
    {b === 'reveal' && (o < K.della - 150 ? <div style={{position: 'absolute', left: 90, top: 320, ...glow({fontSize: 120})}}>MATCH FOUND</div> : <>
      <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}><path d="M 60 620 L 300 600 L 470 590 L 620 560 L 700 140 L 1020 120" fill="none" stroke={NE} strokeWidth={8} pathLength={1} strokeDasharray={`${io(o, K.della - 150, 600)} 1`} style={{filter: `drop-shadow(0 0 10px ${NE})`}} /></svg>
      <NCircle f="della.png" x={760} y={300} d={300} p={sp(o, K.della, 12, 220)} on />
      <div style={{position: 'absolute', left: 80, top: 160, ...glow({fontSize: 46, color: NE, textShadow: 'none', letterSpacing: 4})}}>GOAT RATING</div>
      <div style={{position: 'absolute', left: 80, top: 210, ...glow({fontSize: 150})}}>{Math.round(interpolate(o, [K.della, K.della + 700], [86, 100], clamp))}</div>
      <div style={{position: 'absolute', left: 80, top: 380, ...glow({fontSize: 44})}}>DELLAVEDOVA</div></>)}
    {b === 'tension' && <>
      <svg width={1080} height={1077} style={{position: 'absolute', inset: 0}}><path d={`M 0 400 ${Array.from({length: 27}).map((_, i) => `L ${i * 42} ${400 + (i % 2 ? -1 : 1) * (40 + 120 * Math.abs(Math.sin(o / 90 + i)))}`).join(' ')}`} fill="none" stroke="#ff3b5c" strokeWidth={6} style={{filter: 'drop-shadow(0 0 10px #ff3b5c)'}} /></svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', ...glow({fontSize: 150, textShadow: '0 0 20px #ff3b5c, 0 0 50px rgba(255,59,92,.6)'})}}>TENSION</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', ...glow({fontSize: 34, color: '#ff3b5c', textShadow: 'none', letterSpacing: 6})}}>⚠ LEVELS CRITICAL</div></>}
  </div>;
};
