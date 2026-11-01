// Jorho v14 "sports poster" (user, 2026-11-01): "find motion graphics stuff on Pinterest and copy them" → answers: keep the
// Jorho frame, half real footage / half graphics, black & white + one accent. Look taken from Pinterest sports-motion-design
// pins: giant condensed type stacked/repeated behind cut-out players, outline vs filled rows, marquee rows sliding in
// alternate directions, photo inside the letters, caution-tape bands, grain + halftone, monochrome with one hot accent.
import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, random, staticFile} from 'remotion';
import {ez, io, sp} from './flat9';
import type {GoatK} from './stick12';
import {beatOf} from './styles13';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const PO = {BK: '#0c0c0c', WH: '#f3f1ec', AC: '#ff4d2e'};
const cond = (s: CSSProperties): CSSProperties => ({fontFamily: 'Anton', lineHeight: 0.86, letterSpacing: -1, whiteSpace: 'nowrap', textTransform: 'uppercase', ...s});
const bw = 'grayscale(1) contrast(1.25) brightness(1.05)';

// film grain + halftone dots over everything (poster texture)
const Grain = ({o, dark}: {o: number; dark?: boolean}) => <>
  <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'} 1.2px, transparent 1.6px)`, backgroundSize: '9px 9px', mixBlendMode: dark ? 'screen' : 'multiply'}} />
  <svg width={1080} height={1077} style={{position: 'absolute', inset: 0, opacity: 0.16, mixBlendMode: 'overlay'}}>
    <filter id={`g${Math.floor(o / 66) % 4}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(o / 66) % 4} /></filter>
    <rect width={1080} height={1077} filter={`url(#g${Math.floor(o / 66) % 4})`} />
  </svg>
</>;
// a row of repeated giant words sliding sideways; outline rows alternate with filled ones
const Row = ({o, y, text, size, dir, fill, stroke, speed = 0.12, at = 0}: {o: number; y: number; text: string; size: number; dir: 1 | -1; fill: string; stroke?: string; speed?: number; at?: number}) => {
  const p = ez(o, at, 380);
  const x = dir * ((o - at) * speed) % 1400 - 700 + (1 - p) * dir * -600;
  return <div style={{position: 'absolute', left: x, top: y, opacity: p, ...cond({fontSize: size, color: stroke ? 'transparent' : fill, WebkitTextStroke: stroke ? `3px ${stroke}` : undefined})}}>{Array(6).fill(text).join(' ')}</div>;
};
// diagonal caution-tape band with a repeating label
const Tape = ({o, y, rot, text, at, bg = PO.AC, fg = PO.BK}: {o: number; y: number; rot: number; text: string; at: number; bg?: string; fg?: string}) => {
  const p = io(o, at, 420);
  return <div style={{position: 'absolute', left: -300, top: y, width: 1700, height: 74, background: bg, transform: `rotate(${rot}deg) translateX(${(1 - p) * (rot > 0 ? -1700 : 1700)}px)`, overflow: 'hidden', boxShadow: '0 10px 0 rgba(0,0,0,.25)'}}>
    <div style={{...cond({fontSize: 60, color: fg}), paddingTop: 7, transform: `translateX(${-((o * 0.25) % 400)}px)`}}>{Array(14).fill(text).join('  ✕  ')}</div>
  </div>;
};
// cut-out player, black & white with a hard accent offset shadow
const Cut = ({f, x, y, w, p = 1, accent = PO.AC, s}: {f: string; x: number; y: number; w: number; p?: number; accent?: string; s?: CSSProperties}) => (
  <Img src={staticFile(`img/jorho/${f}`)} style={{position: 'absolute', left: x - w / 2, top: y, width: w, filter: `${bw} drop-shadow(14px 14px 0 ${accent})`, transform: `translateY(${(1 - p) * 160}px) scale(${0.9 + 0.1 * p})`, opacity: Math.min(1, p * 1.5), transformOrigin: '50% 100%', ...s}} />
);
// photo shown inside giant letters (text as a window)
const PhotoText = ({text, f, x, y, size, p}: {text: string; f: string; x: number; y: number; size: number; p: number}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,0) scale(${0.85 + 0.15 * p})`, opacity: p, ...cond({fontSize: size, color: 'transparent',
    backgroundImage: `url(${staticFile(`img/jorho/${f}`)})`, backgroundSize: 'cover', backgroundPosition: '50% 20%', WebkitBackgroundClip: 'text', backgroundClip: 'text', filter: bw, WebkitTextStroke: `2px ${PO.BK}`})}}>{text}</div>
);
const Slam = ({o, at, children, x, y, rot = 0}: {o: number; at: number; children: ReactNode; x: number; y: number; rot?: number}) => {
  const p = sp(o, at, 12, 260);
  return o < at ? null : <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: Math.min(1, p * 2)}}>{children}</div>;
};
const shake = (o: number, a: number, amt = 10) => (o < a || o > a + 400 ? 0 : (random(`s${Math.floor(o / 33)}`) - 0.5) * amt * (1 - (o - a) / 400));

export const GoatPoster = ({o, K}: {o: number; K: GoatK}) => {
  const b = beatOf(o, K); if (!b) return null;
  const dark = b === 'options' || b === 'reveal';
  return <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: dark ? PO.BK : PO.WH}}>
    {b === 'ask' && <Ask o={o} K={K} />}
    {b === 'options' && <Options o={o} K={K} />}
    {b === 'think' && <Think o={o} K={K} />}
    {b === 'reveal' && <Reveal o={o} K={K} />}
    {b === 'tension' && <Tension o={o} K={K} />}
    <Grain o={o} dark={dark} />
  </div>;
};
type P = {o: number; K: GoatK};
// "who is your NBA goat?": the question slams in word by word, stacked like a poster headline; NBA GOAT tape crosses
const Ask = ({o, K}: P) => {
  const a = K.who + 600;
  const words: [string, number, string][] = [['WHO', 0, PO.BK], ['IS YOUR', 160, PO.BK], ['NBA', 330, PO.BK], ['GOAT?', 520, PO.AC]];
  return <>
    <Row o={o} y={-30} text="GOAT" size={250} dir={1} fill="" stroke="rgba(0,0,0,.14)" at={a} />
    <Row o={o} y={760} text="GOAT" size={250} dir={-1} fill="" stroke="rgba(0,0,0,.14)" at={a} />
    {words.map(([w, d, c], i) => <Slam key={i} o={o} at={a + d} x={540 + shake(o, a + d, 16)} y={210 + i * 150} rot={i % 2 ? 1.5 : -1.5}>
      <div style={cond({fontSize: i === 3 ? 230 : 170, color: c})}>{w}</div></Slam>)}
    <Tape o={o} y={640} rot={-6} text="NBA GOAT" at={a + 700} />
  </>;
};
// "greatest of all time NBA player": three candidate panels wipe up, B&W cut-outs over their giant outlined names
const CANDS: [string, string][] = [['lebron.png', 'LEBRON'], ['kobe.png', 'KOBE'], ['curry.png', 'CURRY']];
const Options = ({o, K}: P) => {
  const a = K.greatest;
  return <>{CANDS.map(([f, n], i) => {
    const p = io(o, a + i * 260, 520);
    return <div key={i} style={{position: 'absolute', left: i * 360, top: 0, width: 360, height: 1077, overflow: 'hidden', borderRight: `6px solid ${PO.BK}`,
      background: i === 1 ? '#1d1d1d' : '#141414', clipPath: `inset(${(1 - p) * 100}% 0 0 0)`}}>
      <div style={{position: 'absolute', left: 180, top: 40, transform: 'translateX(-50%) rotate(90deg) translateY(-50%)', transformOrigin: '0 0'}} />
      <div style={{position: 'absolute', left: -40, top: 60, ...cond({fontSize: 220, color: 'transparent', WebkitTextStroke: '3px rgba(255,255,255,.35)'}), writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 1000}}>{n}</div>
      <Cut f={f} x={180} y={330} w={420} p={sp(o, a + i * 260 + 250, 13, 200)} />
      <div style={{position: 'absolute', left: 24, bottom: 330, ...cond({fontSize: 34, color: PO.AC})}}>{`CANDIDATE 0${i + 1}`}</div>
    </div>;
  })}
  {o > a + 1100 && <Slam o={o} at={a + 1100} x={540} y={140}><div style={{...cond({fontSize: 120, color: PO.WH}), background: PO.AC, padding: '4px 26px'}}>OR...?</div></Slam>}
  </>;
};
// the long think: THINKING rows scroll both ways, a round window cycles the candidates faster, a seconds counter runs
const Think = ({o, K}: P) => {
  const a = K.think + 1200;
  const speed = interpolate(o, [a, K.gotta], [300, 90], clamp);
  const f = CANDS[Math.floor((o - a) / speed) % 3][0];
  const secs = ((o - K.think) / 1000 + 0.6).toFixed(1);
  return <>
    {[0, 1, 2, 3, 4].map((i) => <Row key={i} o={o} y={-20 + i * 165} text="THINKING" size={170} dir={i % 2 ? 1 : -1} fill={PO.BK} stroke={i % 2 ? undefined : 'rgba(0,0,0,.25)'} speed={0.18 + i * 0.02} at={a} />)}
    <div style={{position: 'absolute', left: 540 - 220, top: 120, width: 440, height: 440, borderRadius: '50%', overflow: 'hidden', background: PO.BK, border: `12px solid ${PO.AC}`, transform: `scale(${sp(o, a, 13, 220)})`}}>
      <Img src={staticFile(`img/jorho/${f}`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', filter: bw}} />
    </div>
    <div style={{position: 'absolute', left: 540, top: 600, transform: 'translateX(-50%)', ...cond({fontSize: 90, color: PO.WH}), background: PO.BK, padding: '6px 24px'}}>{secs}s</div>
  </>;
};
// "gotta be Matthew Dellavedova": black flash, DELLA with his photo inside the letters, cut-out slams in front, #1
const Reveal = ({o, K}: P) => {
  const a = K.gotta, d = K.della - 150;
  if (o < d) {
    const f = CANDS[Math.floor((o - a) / 80) % 3][0];
    return <><Row o={o} y={300} text="GOTTA BE" size={200} dir={-1} fill={PO.WH} at={a} speed={0.3} />
      <Img src={staticFile(`img/jorho/${f}`)} style={{position: 'absolute', left: 340, top: 520, width: 400, filter: `${bw} blur(2px)`, opacity: 0.6}} /></>;
  }
  const p = sp(o, d, 11, 220);
  return <>
    <div style={{position: 'absolute', inset: 0, background: PO.WH, opacity: Math.max(0, 1 - (o - d) / 160)}} />
    <Row o={o} y={20} text="GOAT?" size={130} dir={1} fill={PO.AC} at={d} speed={0.2} />
    <div style={{position: 'absolute', left: 540 + shake(o, d, 30), top: 150, transform: `translateX(-50%) scale(${0.85 + 0.15 * p})`, opacity: p, ...cond({fontSize: 330, color: PO.WH})}}>DELLA</div>
    <Cut f="della.png" x={560} y={430} w={560} p={sp(o, d + 180, 11, 200)} />
    {o > d + 450 && <Slam o={o} at={d + 450} x={190} y={560} rot={-8}><div style={{...cond({fontSize: 200, color: PO.BK}), background: PO.AC, padding: '0 22px'}}>#1</div></Slam>}
    <Tape o={o} y={700} rot={4} text="MATTHEW DELLAVEDOVA" at={d + 300} bg={PO.WH} fg={PO.BK} />
  </>;
};
// "I could feel the tension": caution tapes cross, TENSION rows glitch, Trevor cut-out in the middle
const Tension = ({o, K}: P) => {
  const a = K.tension - 200;
  const g = Math.floor(o / 50) % 2 ? 8 : -8;
  return <>
    {[0, 1, 2, 3].map((i) => <Row key={i} o={o} y={20 + i * 200} text="TENSION" size={200} dir={i % 2 ? 1 : -1} fill={i === 1 ? PO.AC : PO.BK} stroke={i % 2 ? undefined : 'rgba(0,0,0,.3)'} speed={0.25} at={a} />)}
    <div style={{position: 'absolute', left: 230 + g, top: 300, ...cond({fontSize: 10, color: 'transparent'})}} />
    <Cut f="trevor_u1.png" x={540 + g} y={340} w={560} p={sp(o, a + 100, 12, 220)} />
    <Tape o={o} y={250} rot={-8} text="TENSION" at={a + 150} />
    <Tape o={o} y={600} rot={7} text="TENSION" at={a + 300} bg={PO.BK} fg={PO.AC} />
  </>;
};
