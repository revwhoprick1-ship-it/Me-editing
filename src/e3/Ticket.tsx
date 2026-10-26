// Edit3 · t4 "Ticket": the boys gift Trevor a signed ticket from his own national championship game.
// Look: warm keepsake paper (Clemson orange + purple), 3D ticket stub that gets printed, stamped and signed on the
// beat, typewriter captions, and a W Speed freeze (gray, Blue's "I'd" at 58.27 s, typed action text). Wholesome → Blue.
import type {CSSProperties} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import track from '../plans/data/t4_natty_ticket.seats.json';
import {
  Cam, Captions, Emoji, FPS, Grain, H, Music, SfxTrack, Sparkle, SpeechTrack, Vignette, W, Written, clamp, ease, flashAt, land,
  mattesFor, pop, punchAt, sfx, shakeAt, timeline, whipAt, type Cap, type CamCfg, type Track,
} from './kit';

const SRC = 'pod/t4_natty_ticket.mp4';
const FREEZE = 5200;
const tl = timeline([[15580, 17480], [21460, 30120], [30400, 33420, FREEZE], [43300, 45540], [66300, 69960, 900]]);
export const TICKET_MS = tl.total;
const S = tl.segOut; // 0, 1900, 10560, 18780, 21020
const FZ = S[2] + 33420 - 30400; // freeze starts (13580) = Blue "I'd"
const T = {gifting: 160, you1: 380, you2: 720, ticket: 2920, natty: 4560, game: 5560, mvp: 6120, trevor: 6640, sig: 7800, onTicket: 8860,
  clemson: 9440, sweet: 9880, give: 11560, forMe: 12020, forYou: 12460, thanks: 12920, type: FZ + 260, w: FZ + 2500, memory: S[3] + 60,
  either: 20880, college: 21620, missing: 22060, ticket2: 22740, natty2: 23300, pretty: 23780, sweet2: 24320};
const ORANGE = '#F56600';
const PURPLE = '#522D80';
const CREAM = '#F7EEDC';
const PLAY = {fontFamily: 'Playfair Display', fontWeight: 800, letterSpacing: '-0.02em'} as const;
const PLAYI = {fontFamily: 'Playfair Display', fontWeight: 700, fontStyle: 'italic'} as const;
const TYPE = {fontFamily: 'Courier Prime', fontWeight: 700} as const;
const shadow = '0 8px 30px rgba(0,0,0,0.6)';

// who's on camera: the gifter (L) and Trevor (M) trade lines
const who = (s: number) => {
  if (s < 29300) return 'L' as const;
  if (s < 30400) return 'M' as const;
  if (s < 31800) return 'L' as const;
  if (s < 32300) return 'M' as const;
  if (s < 32800) return 'L' as const;
  return 'M' as const;
};
const cam: CamCfg = {
  src: SRC, tl, track: track as unknown as Track, who, mattes: mattesFor('t4'),
  grade: 'contrast(1.08) saturate(1.08) brightness(0.95) sepia(0.12)',
  zoom: (o) => punchAt([[T.you2, S[1], 1.12], [T.thanks, FZ, 1.1], [FZ, S[3], 1.06], [T.sweet2, tl.total, 1.1]], o) * (1 + 0.04 * ((o % 5000) / 5000)),
};

// ---- hook: "I'm gifting you... with you" ---------------------------------------------------------------
const HookBehind = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  return <div style={{position: 'absolute', top: 210, width: W, textAlign: 'center', lineHeight: 0.86}}>
    <div style={{...PLAYI, fontSize: 96, color: CREAM, textShadow: shadow, ...land(o, T.gifting, 'up')}}>gifting</div>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}>
      <span style={{...PLAY, fontSize: 250, color: 'white', textShadow: shadow, ...land(o, T.you1, 'slam')}}>YOU</span>
    </div>
  </div>;
};
const HookFront = ({o}: {o: number}) => {
  if (o >= S[1]) return null;
  const p = pop(o, T.you2, 11, 170);
  return <>
    <div style={{position: 'absolute', left: 90, top: 1060, ...PLAYI, fontSize: 110, color: ORANGE, textShadow: shadow, ...land(o, T.you2 - 140, 'left')}}>with…</div>
    {o >= T.you2 && <div style={{position: 'absolute', right: 40, top: 860, width: 420, height: 560, transform: `scale(${p}) rotate(${6 - 6 * p}deg)`, transformOrigin: '50% 100%'}}>
      <div style={{position: 'absolute', inset: 0, background: 'white', padding: 18, boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: 'rotate(5deg)'}}>
        <div style={{width: '100%', height: 440, background: `linear-gradient(160deg, ${ORANGE}, ${PURPLE})`, overflow: 'hidden', position: 'relative'}}>
          <Img src={staticFile('img/e2/trevor_sep2022_cut.png')} style={{position: 'absolute', left: -40, bottom: -40, height: 520}} />
        </div>
        <div style={{...PLAY, fontSize: 52, color: '#222', textAlign: 'center', marginTop: 10}}>YOU.</div>
      </div>
    </div>}
  </>;
};

// ---- the ticket ------------------------------------------------------------------------------------------
const Ticket = ({o, sigP, mvp, natty, clemson, tilt = 0}: {o: number; sigP: number; mvp: number; natty: number; clemson: number; tilt?: number}) => (
  <div style={{position: 'relative', width: 860, height: 360, borderRadius: 22, background: CREAM, overflow: 'hidden',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)', transform: `rotate(${tilt}deg)`}}>
    <div style={{position: 'absolute', inset: 0, background: `repeating-linear-gradient(90deg, rgba(82,45,128,0.06) 0 2px, transparent 2px 14px)`}} />
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 210, background: `linear-gradient(180deg, ${ORANGE}, #C24F00)`}}>
      <div style={{position: 'absolute', left: 14, top: 30, width: 180, ...TYPE, fontSize: 26, color: 'white', lineHeight: 1.25}}>SEC 116<br />ROW 12<br />SEAT 7</div>
      <div style={{position: 'absolute', left: 30, bottom: 26, width: 150, height: 70, background: 'repeating-linear-gradient(90deg,#fff 0 3px,transparent 3px 6px, #fff 6px 8px, transparent 8px 12px)'}} />
    </div>
    <div style={{position: 'absolute', left: 210, top: 0, bottom: 0, width: 0, borderLeft: '6px dotted rgba(0,0,0,0.25)'}} />
    <div style={{position: 'absolute', left: 250, top: 28, ...TYPE, fontSize: 24, color: PURPLE, letterSpacing: '0.2em'}}>ADMIT ONE · JAN 7, 2019</div>
    <div style={{position: 'absolute', left: 250, top: 66, width: 580, ...PLAY, fontSize: 52, lineHeight: 0.98, color: '#1b1b1b', clipPath: `inset(0 ${100 - natty * 100}% 0 0)`}}>
      NATIONAL<br />CHAMPIONSHIP</div>
    <div style={{position: 'absolute', left: 252, top: 196, ...TYPE, fontSize: 28, color: ORANGE, opacity: clemson}}>CLEMSON vs ALABAMA</div>
    <div style={{position: 'absolute', left: 300, top: 220}}><Written text="Trevor Lawrence" w={430} size={92} p={sigP} fill="#1d2b8f" /></div>
    {mvp > 0 && <div style={{position: 'absolute', right: 26, top: 24, width: 150, height: 150, borderRadius: 75, border: `8px solid ${ORANGE}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...PLAY, fontSize: 54, color: ORANGE, transform: `rotate(-14deg) scale(${2 - mvp})`,
      opacity: Math.min(1, mvp * 2), background: 'rgba(245,102,0,0.08)'}}>MVP</div>}
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${(o / 30) % 160 - 30}%, rgba(255,255,255,0.45) ${(o / 30) % 160 - 22}%, transparent ${(o / 30) % 160 - 14}%)`}} />
  </div>
);
const TicketScene = ({o}: {o: number}) => {
  if (o < T.ticket - 200 || o >= S[2]) return null;
  const inP = pop(o, T.ticket, 14, 110);
  const sigP = interpolate(o, [T.sig, T.onTicket + 300], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  return <>
    <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center', lineHeight: 0.92}}>
      <div style={{...PLAYI, fontSize: 72, color: CREAM, textShadow: shadow, ...land(o, T.ticket, 'up')}}>a signed ticket from your</div>
      <div style={{...PLAY, fontSize: 104, color: 'white', textShadow: shadow, ...land(o, T.natty, 'flip')}}>NATIONAL</div>
      <div style={{...PLAY, fontSize: 96, color: ORANGE, textShadow: shadow, ...land(o, T.natty + 380, 'flip')}}>CHAMPIONSHIP</div>
    </div>
    <div style={{position: 'absolute', left: 110, top: 1020, perspective: 1400}}>
      <div style={{transform: `translateY(${(1 - inP) * 1000}px) rotateX(${(1 - inP) * 60 + 8 + Math.sin(o / 700) * 4}deg) rotateY(${Math.sin(o / 900) * 9 - 6}deg) rotateZ(${(1 - inP) * -20}deg)`}}>
        <Ticket o={o} sigP={sigP} mvp={ease(o, T.mvp, 140)} natty={ease(o, T.natty, 600)} clemson={ease(o, T.clemson, 250)} tilt={-3} />
      </div>
    </div>
    {o >= T.sweet && [[180, 1000, 70, T.sweet], [930, 1080, 60, T.sweet + 150], [520, 1420, 80, T.sweet + 300]].map(([x, y, s, at], i) =>
      <Sparkle key={i} x={x} y={y} s={s} o={o} at={at} />)}
  </>;
};

// ---- the give + W Speed freeze -------------------------------------------------------------------------
const Exchange = ({o}: {o: number}) => {
  if (o < S[2] || o >= FZ) return null;
  const lines: [number, string, string][] = [[T.forMe, "that's for ME?", 'right'], [T.forYou, "that's for YOU.", 'left']];
  return <>{lines.map(([at, t, side], i) => o >= at && <div key={i} style={{position: 'absolute', top: 130 + i * 130, [side]: 60, ...PLAYI, fontSize: 104,
    color: i ? ORANGE : 'white', textShadow: shadow, ...land(o, at, side === 'left' ? 'left' : 'right')} as CSSProperties}>{t}</div>)}</>;
};
const WSpeed = ({o}: {o: number}) => {
  if (o < FZ || o >= S[3]) return null;
  const text = 'GIFTS TREVOR HIS OWN NATTY TICKET';
  const n = Math.max(0, Math.min(text.length, Math.floor((o - T.type) / 55)));
  const beat = Math.max(0, Math.cos(((o - FZ) / 740) * Math.PI * 2));
  const w = pop(o, T.w, 10, 140);
  return <>
    <AbsoluteFill style={{background: 'rgba(40,40,40,0.35)'}} />
    <div style={{position: 'absolute', top: 1180, left: 70, right: 70, textAlign: 'center', ...TYPE, fontStyle: 'italic', fontSize: 58, lineHeight: 1.25, color: 'white',
      textShadow: '0 4px 14px rgba(0,0,0,0.8)'}}>
      {o >= T.type && <><span style={{color: '#FF4D4D'}}>*THE BOYS</span> {text.slice(0, n)}{n === text.length ? '*' : (Math.floor(o / 250) % 2 ? '|' : '')}</>}
    </div>
    {o >= T.w && <div style={{position: 'absolute', top: 250, width: W, textAlign: 'center', transform: `scale(${w * (1 + beat * 0.05)})`}}>
      <div style={{...PLAYI, fontSize: 420, lineHeight: 0.8, color: 'white', textShadow: '0 0 60px rgba(255,255,255,0.6), 0 10px 40px rgba(0,0,0,0.6)'}}>W</div>
      <div style={{...PLAY, fontSize: 92, color: 'white', letterSpacing: '0.12em', textShadow: shadow}}>THE BOYS</div>
    </div>}
    {o >= T.w && <Emoji code="2764-fe0f-200d-1fa79" size={150} style={{left: 790, top: 250, transform: `scale(${0.9 + beat * 0.25}) rotate(12deg)`}} />}
    {[[150, 380, 80, T.w], [930, 720, 70, T.w + 300], [240, 900, 60, T.w + 700], [860, 300, 50, T.w + 1100], [520, 1050, 70, T.w + 1500]].map(([x, y, s, at], i) =>
      <Sparkle key={i} x={x} y={y} s={s} o={o % 1800 + T.w} at={at} color="#fff" glow="#fff" />)}
  </>;
};

// ---- "the memory... I don't have the ticket for the national championship" ------------------------------------
const Memory = ({o}: {o: number}) => {
  if (o < S[3] || o >= S[4]) return null;
  return <>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 20% 15%, rgba(255,170,90,0.35), transparent 55%)', mixBlendMode: 'screen'}} />
    <div style={{position: 'absolute', top: 210, width: W, textAlign: 'center', ...PLAYI, fontSize: 150, color: CREAM, textShadow: '0 0 50px rgba(255,200,140,0.5), 0 8px 30px rgba(0,0,0,0.6)',
      ...land(o, T.memory, 'up', 500)}}>the memory.</div>
    <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center', ...TYPE, fontSize: 56, color: 'white', textShadow: shadow, ...land(o, 20300, 'up')}}>
      "I don't have this either."</div>
  </>;
};
const MissingBehind = ({o}: {o: number}) => {
  if (o < S[4]) return null;
  return <div style={{position: 'absolute', top: 170, width: W, textAlign: 'center', lineHeight: 0.9}}>
    <div style={{...PLAYI, fontSize: 90, color: CREAM, textShadow: shadow, ...land(o, T.college, 'up')}}>from college,</div>
    <div style={{...PLAY, fontSize: 170, color: 'white', textShadow: shadow, ...land(o, T.natty2, 'slam')}}>THE NATTY</div>
  </div>;
};
const Frame = ({o}: {o: number}) => {
  if (o < T.missing - 100) return null;
  const inP = pop(o, T.missing, 15, 140);
  const fill = pop(o, T.sweet2 - 120, 13, 160);
  return <div style={{position: 'absolute', left: 90, top: 1020, width: 900, height: 420, transform: `scale(${inP})`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 16, border: '22px solid #2a1a10', boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.6)',
      background: '#1b1424'}} />
    {fill < 0.05 && <div style={{position: 'absolute', inset: 40, border: '5px dashed rgba(255,255,255,0.45)', borderRadius: 14, display: 'flex', alignItems: 'center',
      justifyContent: 'center', ...TYPE, fontSize: 40, color: 'rgba(255,255,255,0.7)'}}>NATTY TICKET — missing</div>}
    {fill >= 0.05 && <div style={{position: 'absolute', left: 20, top: 30, transform: `translateY(${(1 - fill) * -700}px) scale(0.98)`}}>
      <Ticket o={o} sigP={1} mvp={1} natty={1} clemson={1} /></div>}
    {fill > 0.6 && [[60, 40, 70, T.sweet2], [860, 360, 60, T.sweet2 + 200], [820, 30, 50, T.sweet2 + 400]].map(([x, y, s, at], i) =>
      <Sparkle key={i} x={x} y={y} s={s} o={o} at={at} />)}
  </div>;
};

const CAPS: Cap[] = [
  [S[1] + 80, 'BUT THIS IS'], [T.ticket - 340, 'A SIGNED TICKET', 'TICKET'], [3400, 'FROM YOUR'], [T.natty, 'NATIONAL CHAMPIONSHIP', 'NATIONAL CHAMPIONSHIP'],
  [T.game, 'GAME, WITH'], [T.mvp, 'MVP TREVOR', 'MVP'], [7060, 'WITH YOUR SIGNATURE', 'SIGNATURE'], [8300, 'ON THE TICKET'], [9160, 'INTO CLEMSON', 'CLEMSON'],
  [T.sweet, "THAT'S SWEET."], [10640, 'SO I WANT TO'], [11420, 'GIVE IT TO YOU.'], [T.forMe, "THAT'S FOR ME?"], [T.forYou, "THAT'S FOR YOU."],
  [T.thanks, 'DUDE, THANK YOU.', 'THANK YOU'], [T.memory, 'THE MEMORY,'], [19540, "I DON'T HAVE,"], [20300, "I DON'T HAVE THIS EITHER."],
  [21120, 'BUT LIKE COLLEGE,'], [22060, "I DON'T HAVE"], [22620, 'THE TICKET FOR'], [23200, 'THE NATIONAL CHAMPIONSHIP.', 'NATIONAL CHAMPIONSHIP'],
  [T.pretty, 'THIS IS PRETTY,'], [T.sweet2 - 120, 'THIS IS SWEET.', 'SWEET'],
];

export const TicketEdit = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  const sh = shakeAt([[T.you1, 8], [T.mvp, 10], [T.natty2, 10]], o);
  const wh = whipAt([S[1], S[2], S[3], S[4]], o, 'zoom', 260);
  const frozen = o >= FZ && o < S[3];
  const gray = frozen ? Math.min(1, (o - FZ) / 160) : 0;
  const flash = flashAt([[FZ, 0.55], [T.mvp, 0.25], [S[3], 0.3]], o);
  return (
    <AbsoluteFill style={{background: '#120c08'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) ${wh.transform} scale(1.03)`, filter: wh.blur ? `blur(${wh.blur}px)` : undefined}}>
        <Cam c={cam} o={o} style={gray ? {filter: `grayscale(${gray}) brightness(${1 - 0.25 * gray})`} : undefined}
          behind={<><HookBehind o={o} /><MissingBehind o={o} /></>} />
        <HookFront o={o} />
        <TicketScene o={o} />
        <Exchange o={o} />
        <WSpeed o={o} />
        <Memory o={o} />
        <Frame o={o} />
      </AbsoluteFill>
      <Captions o={o} caps={CAPS} off={[[0, S[1]], [FZ, S[3]]]} top={1580} anim="type" keyColor={ORANGE}
        style={{...PLAY, fontSize: 64, color: '#FFF6E8', WebkitTextStroke: '3px #1a0d05', paintOrder: 'stroke fill', textShadow: '0 6px 20px rgba(0,0,0,0.75)'}} />
      <Vignette color="20,8,2" strength={0.7} />
      <Grain frame={frame} opacity={0.1} />
      {flash > 0 && <AbsoluteFill style={{background: 'white', opacity: flash}} />}
      <SpeechTrack src={SRC} tl={tl} />
      {/* Blue (Yung Kai): 58.27 s = "I'd" of "I'd imagine we fell in love" lands on the freeze */}
      <Music file="blue-yung-kai.mp3" songFrom={58270 - FZ} level={(t) => {
        const end = Math.min(1, (tl.total - t) / 300);
        if (t >= FZ && t < S[3]) return 0.6;
        return (tl.playing(t) ? 0.13 : 0.3) * end * Math.min(1, t / 150);
      }} />
      <SfxTrack list={[
        sfx('mg-swoosh2', 0, 0.3), sfx('mg-click', T.you1, 0.3), sfx('camera-shutter', T.you2, 0.45), sfx('mg-swoosh', T.you2 - 140, 0.25),
        sfx('mg-whoosh', S[1], 0.3), sfx('mg-swoosh', T.ticket, 0.4), sfx('paper-tear', T.ticket + 200, 0.3), sfx('keyboard-typing', T.natty, 0.25, 700),
        sfx('mg-boom', T.mvp, 0.18), sfx('mg-click', T.mvp, 0.4), sfx('pen-scribble', T.sig, 0.5), sfx('pen-scribble', T.sig + 600, 0.45),
        sfx('mg-click', T.clemson, 0.3), sfx('mg-shimmer', T.sweet, 0.35),
        sfx('mg-whoosh', S[2], 0.3), sfx('mg-click', T.forMe, 0.3), sfx('mg-click', T.forYou, 0.3),
        sfx('camera-shutter', FZ, 0.4), sfx('keyboard-typing', T.type, 0.45, 33 * 55 + 200), sfx('mg-shimmer', T.w, 0.4),
        sfx('whoosh', S[3], 0.32), sfx('mg-shimmer', T.memory, 0.3),
        sfx('mg-whoosh', S[4], 0.3), sfx('mg-swoosh2', T.missing, 0.3), sfx('mg-click', T.natty2, 0.3),
        sfx('mg-swoosh', T.sweet2 - 120, 0.35), sfx('ding-2', T.sweet2 + 200, 0.4),
      ]} />
    </AbsoluteFill>
  );
};
