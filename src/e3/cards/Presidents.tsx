// Edit3 card pull · Quad President cut autos 1/1 (Topps Transcendent): Washington, Jefferson, Adams, Madison.
// The hosts keep saying "this belongs in a museum", so the edit is a museum exhibit: gilt frame on the hook, a velvet
// rope over the stream banner, a spotlight on the briefcase, four portrait frames that light up as the narrator names
// them, a red wax-seal "1 of 1", the exhibit placard at the end. Hosts are muted where they name it before the reveal.
import type {ReactNode} from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import narr from '../../../public/narr/b3_presidents.json';
import {Blurs, HookAudio, HookView, HostAudio, Narration, Riser, StreamView, cardTimeline, narrCaps, narrSpans, type NarrLine, type Placed} from '../cardkit';
import {Captions, Emoji, FPS, Grain, H, Music, SfxTrack, W, ease, flashAt, land, pop, sfx, shakeAt, type Cap} from '../kit';

const SRC = 'b3/k_presidents.mp4';
const HOOK = {file: 'hooks/this_product_is_unbelievable.mp4', from: 0, ms: 1900};
const tl = cardTimeline(HOOK.ms, [{src: [8400, 11200]}, {src: [12800, 16700]}, {src: [21800, 23800], rate: 0.5}, {src: [24000, 32800]}, {src: [34300, 36400]}, {src: [42800, 44700]}]);
export const PRESIDENTS_MS = tl.total;
const S = tl.segOut; // 1900 4700 8600 12600 21400 23500
const R = S[3];
const LINES = narr as NarrLine[];
const PLACED: Placed[] = [{line: 0, at: HOOK.ms + 50}, {line: 1, at: S[2] + 50}, {line: 2, at: R + 200}];
const [L1, L2, L3] = narrSpans(LINES, PLACED);
const n3 = (fileMs: number) => L3[0] + fileMs - LINES[2].file[0];
const T = {briefcase: L1[0] + 400, card: L1[0] + 2180, real: L2[0] + 1720, names: [n3(8280), n3(9220), n3(10020), n3(10660)], four: n3(11640), oneOf: n3(13880),
  quad: 20220, museum: 21620, holding: 23900, history: 24220};
const GOLD = '#D4AF37';
const IVORY = '#F6EEDB';
const WINE = '#5C0F1B';
const CIN = {fontFamily: 'Cinzel', fontWeight: 700, letterSpacing: '0.04em'} as const;
const SER = {fontFamily: 'Cormorant Garamond', fontWeight: 700, fontStyle: 'italic'} as const;
const PRES: [string, string][] = [['WASHINGTON', 'George_Washington'], ['JEFFERSON', 'Thomas_Jefferson'], ['ADAMS', 'John_Adams'], ['MADISON', 'James_Madison']];
const shadow = '0 6px 24px rgba(0,0,0,0.7)';

const camAt = (o: number) => {
  if (o >= S[2] && o < R) { const p = ease(o, S[2], R - S[2], Easing.in(Easing.quad)); return {z: 1 + 0.3 * p, x: 540, y: 1000, tr: p * 5}; }
  if (o >= R && o < S[4]) return {z: 1.3 - 0.15 * ease(o, R, 900), x: 540, y: 1150, tr: 0};
  if (o >= S[4] && o < S[5]) return {z: 1.45, x: 540, y: 250, tr: 0};
  if (o >= S[5]) return {z: 1.2 + 0.05 * ease(o, S[5], 1900), x: 540, y: 1000, tr: 0};
  return {z: 1.02, x: 540, y: 960, tr: 0};
};

const GiltFrame = ({w, h, children}: {w: number; h: number; children?: ReactNode}) => (
  <div style={{position: 'relative', width: w, height: h, padding: 16, boxSizing: 'border-box', borderRadius: 6,
    background: `linear-gradient(135deg, #7a5a12, ${GOLD} 25%, #fff2b8 45%, #b8860b 60%, #6b4c0c)`, boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 0 3px rgba(0,0,0,0.35)'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', boxShadow: 'inset 0 0 0 4px rgba(0,0,0,0.5)', background: '#111'}}>{children}</div>
  </div>
);
// velvet rope over the stream's burned-in banner
const Rope = ({o}: {o: number}) => (
  <div style={{position: 'absolute', left: 0, top: 470, width: W, height: 120, background: `linear-gradient(180deg, ${WINE}, #2a0509)`, borderTop: `4px solid ${GOLD}`,
    borderBottom: `4px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width={W} height={120} style={{position: 'absolute', inset: 0}}>
      <path d={`M60,30 Q300,${92 + Math.sin(o / 400) * 4} 540,30 Q780,${92 + Math.cos(o / 400) * 4} 1020,30`} stroke="#b0182c" strokeWidth={14} fill="none" strokeLinecap="round" />
      {[60, 540, 1020].map((x) => <g key={x}><rect x={x - 9} y={10} width={18} height={100} fill={GOLD} /><circle cx={x} cy={14} r={14} fill={GOLD} /></g>)}
    </svg>
    <div style={{position: 'relative', ...CIN, fontSize: 30, color: IVORY, letterSpacing: '0.3em', marginTop: 40}}>
      {o < R ? 'PLEASE DO NOT TOUCH THE EXHIBIT' : 'NOW ON DISPLAY'}</div>
  </div>
);
const Spotlight = ({o}: {o: number}) => {
  const a = o >= S[2] && o < R ? ease(o, S[2], 600) : o >= R && o < S[4] ? 1 - 0.6 * ease(o, R + 1500, 1500) : 0;
  if (!a) return null;
  return <>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 40% 55% at 50% 58%, transparent 0%, rgba(0,0,0,${0.7 * a}) 100%)`}} />
    <AbsoluteFill style={{background: `conic-gradient(from 168deg at 50% -8%, transparent 0deg, rgba(255,240,200,${0.16 * a}) 10deg, rgba(255,240,200,${0.16 * a}) 14deg, transparent 24deg)`, mixBlendMode: 'screen'}} />
    {Array.from({length: 22}).map((_, i) => <div key={i} style={{position: 'absolute', left: 380 + ((i * 53) % 320) + Math.sin(o / 700 + i) * 20, top: 200 + ((i * 97) % 900) - (o / 30) % 120,
      width: 4, height: 4, borderRadius: 2, background: 'rgba(255,240,200,0.7)', opacity: a * (0.3 + 0.7 * Math.abs(Math.sin(o / 300 + i)))}} />)}
  </>;
};
const Portraits = ({o}: {o: number}) => {
  if (o < T.names[0] - 100 || o >= S[4]) return null;
  const merge = ease(o, T.four, 500, Easing.inOut(Easing.cubic));
  return <div style={{position: 'absolute', left: 0, top: 50, width: W, height: 420}}>
    {PRES.map(([name, img], i) => {
      if (o < T.names[i]) return null;
      const p = pop(o, T.names[i], 12, 170);
      const x = 30 + i * 260;
      const cx = 540 - 115;
      return <div key={name} style={{position: 'absolute', left: x + (cx - x) * merge * 0.15, top: 0, transform: `scale(${p * (1 - 0.1 * merge)}) translateY(${(1 - p) * -60}px)`, opacity: 1 - merge * 0.25}}>
        <GiltFrame w={240} h={300}><Img src={staticFile(`img/b3/${img}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.25) contrast(1.05)'}} /></GiltFrame>
        <div style={{marginTop: 8, textAlign: 'center', ...CIN, fontSize: 30, color: IVORY, textShadow: shadow}}>{name}</div>
      </div>;
    })}
  </div>;
};
const Plaque = ({o}: {o: number}) => {
  if (o < T.four || o >= S[4]) return null;
  return <div style={{position: 'absolute', left: 120, top: 1490, width: 840, textAlign: 'center', padding: '16px 0 18px', background: `linear-gradient(180deg, #e9cf73, ${GOLD} 50%, #a07a1c)`,
    border: '4px solid #5a4210', borderRadius: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.6)', ...land(o, T.four, 'up')}}>
    <div style={{...CIN, fontSize: 64, color: '#2a1d05', lineHeight: 1}}>4 PRESIDENTS · 1 CARD</div>
  </div>;
};
const WaxSeal = ({o}: {o: number}) => {
  if (o < T.oneOf) return null;
  const s = ease(o, T.oneOf, 160);
  return <div style={{position: 'absolute', left: 720, top: 1080, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #d23a3a, #8e1414 60%, #5a0b0b)',
    boxShadow: '0 16px 30px rgba(0,0,0,0.6), inset 0 0 0 14px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    transform: `scale(${2.2 - 1.2 * s}) rotate(${-10 + 6 * s}deg)`, opacity: Math.min(1, s * 2)}}>
    <div style={{...CIN, fontSize: 70, color: '#f3d2c8', lineHeight: 0.9}}>1/1</div>
    <div style={{...CIN, fontSize: 22, color: '#f3d2c8', letterSpacing: '0.2em'}}>ONE OF ONE</div>
  </div>;
};
const Money = ({o}: {o: number}) => {
  if (o < T.oneOf || o > T.oneOf + 2200) return null;
  const t = (o - T.oneOf) / 1000;
  return <>{Array.from({length: 18}).map((_, i) => <Emoji key={i} code="1f4b5" size={90} style={{left: (i * 113) % W - 20, top: -120 + t * (700 + (i % 5) * 160) - (i % 4) * 120,
    transform: `rotate(${Math.sin(t * 4 + i) * 30}deg)`, opacity: Math.min(1, (2.2 - t) * 2)}} />)}</>;
};
const Placard = ({o}: {o: number}) => {
  if (o < S[5] - 100) return null;
  return <div style={{position: 'absolute', left: 90, top: 1290, width: 900, padding: '26px 34px', background: IVORY, borderRadius: 6, boxShadow: '0 24px 50px rgba(0,0,0,0.7)',
    transform: `translateY(${(1 - pop(o, S[5] - 100, 15, 130)) * 600}px)`}}>
    <div style={{...CIN, fontSize: 24, color: '#7a6a4a', letterSpacing: '0.25em'}}>EXHIBIT Nº 1 · TOPPS TRANSCENDENT</div>
    <div style={{...CIN, fontSize: 48, color: '#1d1408', marginTop: 8}}>Quad President Cut Auto</div>
    <div style={{...SER, fontSize: 36, color: '#3d2f18', marginTop: 4}}>Washington · Jefferson · Adams · Madison — one of one</div>
  </div>;
};

const CAPS: Cap[] = [
  ...narrCaps(LINES, PLACED, 3, {}, {BRIEFCASE: GOLD, 'ONE CARD': GOLD, 'REAL?': '#ff8a8a', WASHINGTON: GOLD, JEFFERSON: GOLD, 'ADAMS,': GOLD, 'MADISON,': GOLD, 'ONE OF ONE!': '#ff6b6b'}),
  [4920, 'YOU SAW WHO IT WAS?'], [7200, 'NO.'], [7700, 'OH MY GOD.'],
  [T.quad, 'QUAD PRESIDENT!', 'QUAD PRESIDENT', GOLD], [21200, 'NO!'], [21480, 'THAT BELONGS'], [21960, 'IN A MUSEUM!', 'MUSEUM', GOLD],
  [23620, 'WE ARE HOLDING'], [T.history, 'HISTORY', 'HISTORY', GOLD], [24720, 'IN OUR HANDS!'],
];

export const Presidents = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const cam = camAt(o);
  const sh = shakeAt([[R, 20], [T.oneOf, 10], [T.quad, 10]], o);
  const trem = cam.tr ? {x: Math.sin(o * 0.9) * cam.tr, y: Math.cos(o * 1.1) * cam.tr} : {x: 0, y: 0};
  const flash = flashAt([[R, 0.9]], o);
  const hostGain = (t: number) => (t < L1[1] ? 0.22 : t < S[2] ? 0.95 : t >= L3[0] - 100 && t < L3[1] ? 0.14 : 1);
  return (
    <AbsoluteFill style={{background: '#0a0605'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x + trem.x}px, ${sh.y + trem.y}px)`}}>
        {o < HOOK.ms ? <AbsoluteFill style={{background: WINE, padding: 34}}>
          <GiltFrame w={W - 68} h={H - 68}><HookView file={HOOK.file} w={720} from={HOOK.from} cover={[56, 924, 612, 170]} push={1.05 + 0.04 * (o / HOOK.ms)} /></GiltFrame>
        </AbsoluteFill>
          : <AbsoluteFill style={{overflow: 'hidden'}}>
            <AbsoluteFill style={{transformOrigin: `${cam.x}px ${cam.y}px`, transform: `scale(${cam.z})`, filter: 'contrast(1.08) saturate(0.92) sepia(0.12) brightness(0.95)'}}>
              <StreamView src={SRC} srcW={1080} tl={tl} />
              <Blurs tl={tl} o={o} srcW={1080} boxes={[{src: [12800, 23950], box: [60, 600, 960, 900]}]} />
              <Rope o={o} />
            </AbsoluteFill>
          </AbsoluteFill>}
        <Spotlight o={o} />
        {o < HOOK.ms && <div style={{position: 'absolute', top: 1500, width: W, textAlign: 'center', ...CIN, fontSize: 70, color: IVORY, textShadow: shadow, ...land(o, 600, 'up')}}>
          WHAT'S IN THE BRIEFCASE?</div>}
        {o >= L1[0] && o < S[2] && <div style={{position: 'absolute', top: 130, width: W, textAlign: 'center', ...CIN, color: IVORY, textShadow: shadow}}>
          <div style={{fontSize: 92, ...land(o, T.briefcase, 'up')}}>ONE BRIEFCASE.</div>
          <div style={{fontSize: 72, color: GOLD, ...land(o, T.card, 'up')}}>ONE CARD INSIDE.</div>
        </div>}
        {o >= T.real && o < R && <div style={{position: 'absolute', top: 160, width: W, textAlign: 'center', ...SER, fontSize: 150, color: IVORY, textShadow: shadow, ...land(o, T.real, 'up', 500)}}>real?</div>}
        <Portraits o={o} />
        <Plaque o={o} />
        <WaxSeal o={o} />
        <Money o={o} />
        {o >= S[4] && o < S[5] && <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center', ...CIN, fontSize: 84, color: IVORY, textShadow: shadow}}>
          <div style={land(o, T.museum, 'up')}>BELONGS IN A</div><div style={{fontSize: 130, color: GOLD, ...land(o, T.museum + 340, 'slam')}}>MUSEUM</div></div>}
        <Placard o={o} />
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, HOOK.ms], [T.four, S[4]], [S[5], S[5] + 400]]} top={o >= S[5] ? 1150 : 1620} anim="rise" keyColor={GOLD}
        style={{...CIN, fontSize: 62, color: IVORY, WebkitTextStroke: '3px #1a0b05', paintOrder: 'stroke fill', textShadow: shadow}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10,4,2,0.7) 100%)', pointerEvents: 'none'}} />
      <Grain frame={frame} opacity={0.09} />
      {flash > 0 && <AbsoluteFill style={{background: '#fff4dc', opacity: flash}} />}
      <HookAudio file={HOOK.file} from={HOOK.from} ms={HOOK.ms} vol={0.9} />
      <HostAudio src={SRC} tl={tl} gain={hostGain} />
      <Narration file="narr/b3_presidents_loud.mp3" lines={LINES} placed={PLACED} />
      <Riser peakAt={R} lead={2600} vol={0.22} />
      {/* Amor Na Praia: 13.5 s drop on the reveal */}
      <Music file="amor-na-praia.mp3" songFrom={13500 - R} level={(t) => {
        if (t < HOOK.ms) return 0;
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= R - 350 && t < R) return 0;
        if ((t >= L1[0] && t < L1[1]) || (t >= L2[0] && t < R)) return 0.06;
        if (t >= L3[0] && t < L3[1]) return 0.08 * end;
        return (t < R ? 0.14 : 0.3) * end;
      }} />
      <SfxTrack list={[
        sfx('fast-whoosh', S[0], 0.32), sfx('mg-click', T.briefcase, 0.25), sfx('mg-click', T.card, 0.25), sfx('fast-whoosh', S[1], 0.3),
        sfx('heartbeat-loud', S[2] + 200, 0.32, R - S[2] - 300), sfx('mg-swoosh2', T.real, 0.25),
        sfx('mg-boom', R, 0.2), sfx('mg-shimmer', R, 0.35), ...T.names.map((t) => sfx('camera-shutter', t, 0.35)),
        sfx('mg-swoosh', T.four, 0.3), sfx('mg-click', T.oneOf, 0.4), sfx('cha-ching', T.oneOf + 100, 0.35),
        sfx('fast-whoosh', S[4], 0.3), sfx('mg-click', T.museum + 340, 0.3), sfx('fast-whoosh', S[5], 0.3), sfx('mg-shimmer', T.history, 0.3),
      ]} />
    </AbsoluteFill>
  );
};
