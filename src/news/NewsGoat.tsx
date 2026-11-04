// v27 "BREAKING NEWS" parody of the NBA GOAT clip — a new identity for the channel (no Jorho bars, no one-word captions):
// live two-box interview layout, red/navy broadcast palette, Oswald/Anton headlines, closed-caption subtitles, a crawling
// ticker, a BREAKING NEWS stinger on a freeze right before the answer, and "news footage" gag cards (goat fans, a goat
// coronation, the goat on a date with the trophy). Real podcast audio throughout; Curb-style credits music on the laugh.
import {loadFont} from '@remotion/fonts';
import type {ReactNode} from 'react';
import {AbsoluteFill, Img, Sequence, random, staticFile, useCurrentFrame} from 'remotion';
import {Cam, Music, SfxTrack, SpeechTrack, sfx, timeline, type CamCfg, type Seat, type Track} from '../e3/kit';
import goatWords from '../plans/data/nba_goat.words.json';
import goatTrack from '../plans/data/nba_goat.seats.json';

loadFont({family: 'Oswald', url: staticFile('fonts/oswald-700-normal.woff2'), weight: '700'});
loadFont({family: 'Anton', url: staticFile('fonts/anton-400-normal.woff2'), weight: '400'});
loadFont({family: 'Courier Prime', url: staticFile('fonts/courier-prime-700-normal.woff2'), weight: '700'});
loadFont({family: 'Permanent Marker', url: staticFile('fonts/permanent-marker-400-normal.woff2'), weight: '400'});

const FPS = 30;
const RED = '#D7141A', NAVY = '#0A1A33', NAVY2 = '#12284d', GOLD = '#FFC629', WHITE = '#ffffff';
const tl = timeline([[2150, 3650], [4380, 5150], [5550, 7350], [7350, 13800, 600], [13800, 18810]]);
export const NEWSGOAT_MS = tl.total; // 16.13 s
const o_ = tl.out;
const K = {nba: o_(4480), greatest: o_(5620), player: o_(6980), think: tl.segOut[3], gotta: o_(12780), freeze: tl.segOut[4] - 600, della: o_(13820), name: o_(14160),
  man: o_(14960), laugh: o_(15050), could: o_(17480), tension: o_(18220), end: tl.total};
const crown = K.laugh + 650, date = crown + 900, back = date + 900; // gag cards inside the laugh

// ---- layout -----------------------------------------------------------------------------------------------------------
const VY = 140, VH = 1320; // video region
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - (1 - clamp01(t)) ** 3;
const camCfg = (who: Seat, w: number, h: number, baseH: number, zoom?: () => number): CamCfg => ({src: 'input.mp4', tl, track: goatTrack as unknown as Track, who: () => who,
  grade: 'contrast(1.08) saturate(1.05)', box: [w, h], baseH, faceY: 0.4, wideX: 960, zoom});
const Box = ({o, who, y, h, baseH, active, tag, push = 0}: {o: number; who: Seat; y: number; h: number; baseH: number; active?: boolean; tag?: string; push?: number}) => (
  <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: h, overflow: 'hidden', background: '#000'}}>
    <Cam c={camCfg(who, 1080, h, baseH, push ? () => 1 + push : undefined)} o={o} />
    {active && <div style={{position: 'absolute', inset: 0, border: `8px solid ${RED}`, boxShadow: `inset 0 0 40px rgba(215,20,26,.35)`}} />}
    {tag && <div style={{position: 'absolute', left: 24, bottom: 22, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(10,26,51,.92)', padding: '8px 16px',
      borderLeft: `8px solid ${active ? RED : GOLD}`, fontFamily: 'Oswald', fontWeight: 700, fontSize: 34, color: WHITE, letterSpacing: 1}}>{tag}</div>}
  </div>
);

// ---- broadcast chrome ----------------------------------------------------------------------------------------------------
const Header = ({o}: {o: number}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: VY, background: `linear-gradient(${NAVY2}, ${NAVY})`, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 22}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, background: RED, padding: '10px 22px', borderRadius: 8}}>
      <div style={{width: 20, height: 20, borderRadius: 10, background: WHITE, opacity: 0.4 + 0.6 * (Math.sin(o / 160) > 0 ? 1 : 0)}} />
      <span style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 46, color: WHITE, letterSpacing: 2}}>LIVE</span>
    </div>
    <span style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 46, color: WHITE, letterSpacing: 3}}>BALL KNOWLEDGE <span style={{color: GOLD}}>NEWS</span></span>
  </div>
);
type LT = {a: number; b: number; tag: string; text: string; sub?: string; alert?: boolean};
const LOWER: LT[] = [
  {a: 0, b: K.greatest, tag: 'QUESTION OF THE DAY', text: 'WHO IS YOUR NBA GOAT?'},
  {a: K.greatest, b: K.think, tag: 'THE USUAL PICKS', text: 'JORDAN · LEBRON · KOBE'},
  {a: K.think, b: K.gotta, tag: 'LIVE', text: 'AWAITING HIS ANSWER…'},
  {a: K.gotta, b: K.freeze, tag: 'LIVE', text: "HE'S ANSWERING…"},
  {a: K.della, b: K.laugh, tag: 'NEW NBA GOAT', text: 'MATTHEW DELLAVEDOVA', sub: 'CAREER 5.2 PPG · 2016 NBA CHAMPION'},
  {a: K.laugh, b: crown, tag: 'REACTION', text: 'THE ROOM IS NOT OK'},
  {a: crown, b: date, tag: 'LIVE', text: 'THE NEW GOAT IS CROWNED'},
  {a: date, b: back, tag: 'EXCLUSIVE', text: 'SPOTTED ON A DATE 👀'},
  {a: back, b: K.could, tag: 'REACTION', text: 'THE ROOM IS NOT OK'},
  {a: K.could, b: K.end + 100, tag: '⚠ DEVELOPING', text: 'TENSION IN THE ROOM', alert: true},
];
const Lower = ({o}: {o: number}) => {
  const l = LOWER.find((x) => o >= x.a && o < x.b);
  if (!l) return null;
  const p = l.a === 0 ? 1 : ease((o - l.a) / 260);
  const flash = l.alert && Math.sin(o / 120) > 0;
  const timer = l.text.startsWith('AWAITING') ? `  0:0${Math.min(9, Math.floor((o - K.think) / 1000))}` : '';
  return <div style={{position: 'absolute', left: 0, top: 1478, width: 1080}}>
    <div style={{display: 'flex', transform: `translateX(${(1 - p) * -1080}px)`}}>
      <div style={{background: flash ? GOLD : RED, color: flash ? NAVY : WHITE, fontFamily: 'Oswald', fontWeight: 700, fontSize: 38, padding: '10px 26px', letterSpacing: 2}}>{l.tag}</div>
    </div>
    <div style={{background: WHITE, padding: '8px 26px 10px', clipPath: `inset(0 ${l.a === 0 ? 0 : (1 - ease((o - l.a - 120) / 300)) * 100}% 0 0)`}}>
      <div style={{fontFamily: 'Anton', fontSize: 70, color: NAVY, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{l.text}<span style={{color: RED}}>{timer}</span></div>
      {l.sub && o >= K.name + 150 && <div style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 34, color: RED, letterSpacing: 1.5, opacity: ease((o - K.name - 150) / 250)}}>{l.sub}</div>}
    </div>
  </div>;
};
const TICKS: [number, string][] = [
  [0, 'QUESTION OF THE DAY: WHO IS THE NBA GOAT?  •  THE USUAL ANSWERS: JORDAN, LEBRON, KOBE  •  COMMENT YOURS BELOW  •  '],
  [K.think, 'DEVELOPING: QB HAS GONE COMPLETELY SILENT  •  STILL NO ANSWER  •  FANS GROWING NERVOUS  •  '],
  [K.della, 'CONFIRMED: THE ANSWER IS MATTHEW DELLAVEDOVA  •  CAREER 5.2 PPG  •  2016 NBA CHAMPION  •  VALID OR NAH? 👇  •  '],
];
const Ticker = ({o}: {o: number}) => {
  const [a, text] = [...TICKS].reverse().find(([t]) => o >= t)!;
  const x = 1080 - ((o - a) / 1000) * 260;
  return <div style={{position: 'absolute', left: 0, top: 1840, width: 1080, height: 80, background: NAVY, overflow: 'hidden', borderTop: `4px solid ${GOLD}`}}>
    <div style={{position: 'absolute', left: x, top: 12, whiteSpace: 'nowrap', fontFamily: 'Oswald', fontWeight: 700, fontSize: 40, color: WHITE, letterSpacing: 1}}>{text + text}</div>
    <div style={{position: 'absolute', left: 0, top: 0, height: 80, background: GOLD, color: NAVY, fontFamily: 'Anton', fontSize: 42, padding: '12px 22px', letterSpacing: 1}}>BREAKING</div>
  </div>;
};
// closed-caption subtitles: monospace on black, phrase lines that roll on word by word
const WORDS = goatWords.filter((w) => tl.segs.some(([a, b]) => w.startMs >= a && w.startMs < b))
  .map((w) => ({t: w.text.replace(/^Delvedova,?$/, 'Dellavedova,').replace(/^times$/, 'time'), at: tl.out(w.startMs)}));
// hand-set phrase lines (word index ranges) so lines break at natural pauses, not mid-phrase
const LINE_IDX: [number, number][] = [[0, 4], [5, 6], [7, 10], [11, 12], [13, 14], [15, 17], [18, 22]];
const LINES = LINE_IDX.map(([i, j], k) => {
  const w = WORDS.slice(i, j + 1);
  const next = LINE_IDX[k + 1] ? WORDS[LINE_IDX[k + 1][0]].at : tl.total + 100;
  return {a: w[0].at, b: Math.min(next, w[w.length - 1].at + 1200), w};
});
const CC = ({o}: {o: number}) => {
  const l = LINES.find((x) => o >= x.a && o < x.b);
  if (!l) return null;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 1676, display: 'flex', justifyContent: 'center'}}>
    <div style={{background: 'rgba(0,0,0,.88)', padding: '10px 22px', fontFamily: 'Courier Prime', fontWeight: 700, fontSize: 52, color: WHITE, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
      {l.w.filter((w) => o >= w.at).map((w) => w.t).join(' ')}
    </div>
  </div>;
};

// ---- gag cards ("news footage") ---------------------------------------------------------------------------------------
const Heart = ({x, y, s, c = '#ff3b6b'}: {x: number; y: number; s: number; c?: string}) => (
  <svg width={s} height={s} viewBox="0 0 32 29" style={{position: 'absolute', left: x, top: y}}><path d="M16 29 L3 15 A8 8 0 0 1 16 4 A8 8 0 0 1 29 15 Z" fill={c} /></svg>
);
const CardFrame = ({label, children, bg}: {label: string; children: ReactNode; bg: string}) => (
  <div style={{position: 'absolute', left: 0, top: VY, width: 1080, height: VH, overflow: 'hidden', background: bg}}>
    {children}
    <div style={{position: 'absolute', left: 24, top: 24, background: RED, color: WHITE, fontFamily: 'Oswald', fontWeight: 700, fontSize: 36, padding: '8px 18px', letterSpacing: 2}}>{label}</div>
  </div>
);
const Fans = ({o, a, b}: {o: number; a: number; b: number}) => {
  if (o < a || o >= b) return null;
  const p = ease((o - a) / 250), q = 1 - ease((o - (b - 200)) / 200);
  const signs = ['LEBRON?', 'MJ?', 'KOBE?', 'STEPH?'];
  return <div style={{position: 'absolute', left: 560, top: 820, width: 490, height: 600, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: '100% 100%', opacity: Math.min(p, q),
    border: `6px solid ${WHITE}`, boxShadow: '0 20px 50px rgba(0,0,0,.6)', overflow: 'hidden', background: 'linear-gradient(#071226, #1b2d55)'}}>
    {Array.from({length: 12}, (_, i) => {
      const cx = 40 + (i % 4) * 110 + (Math.floor(i / 4) % 2) * 40, cy = 150 + Math.floor(i / 4) * 140, bob = Math.sin(o / 140 + i * 1.7) * 6;
      return <div key={i} style={{position: 'absolute', left: cx, top: cy + bob}}>
        {i < 4 && <div style={{position: 'absolute', left: -14, top: -70, background: '#f4ead7', padding: '4px 8px', fontFamily: 'Permanent Marker', fontSize: 24, color: '#222', transform: `rotate(${(i % 2 ? 1 : -1) * 6}deg)`}}>{signs[i]}</div>}
        <Img src={staticFile('emoji-ios/1f410.png')} style={{width: 92, height: 92}} />
      </div>;
    })}
    <div style={{position: 'absolute', left: 0, bottom: 0, width: '100%', background: RED, color: WHITE, fontFamily: 'Oswald', fontWeight: 700, fontSize: 30, padding: '6px 14px'}}>LIVE · FANS OUTSIDE THE ARENA</div>
  </div>;
};
const Coronation = ({o}: {o: number}) => {
  const t = o - crown, p = ease(t / 300);
  return <CardFrame label="LIVE · CENTER COURT" bg="radial-gradient(ellipse at 50% 30%, #3b2a08 0%, #0b0a12 70%)">
    <div style={{position: 'absolute', left: 340, top: 0, width: 400, height: VH, background: 'linear-gradient(rgba(255,230,150,.35), rgba(255,230,150,0))', clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0 100%)'}} />
    <svg width={1080} height={VH} style={{position: 'absolute', inset: 0}}>
      <path d="M330 1180 L330 700 Q330 560 400 520 L420 640 L480 560 L540 660 L600 560 L660 640 L680 520 Q750 560 750 700 L750 1180 Z" fill="#c99a2e" stroke="#ffe08a" strokeWidth={8} />
      <rect x={290} y={1060} width={500} height={150} rx={18} fill="#a77b1c" stroke="#ffe08a" strokeWidth={8} />
    </svg>
    <Img src={staticFile('emoji-ios/1f410.png')} style={{position: 'absolute', left: 340, top: 640, width: 400, height: 400, transform: `scale(${0.4 + 0.6 * p})`}} />
    <Img src={staticFile('emoji-ios/1f451.png')} style={{position: 'absolute', left: 365, top: 575 - (1 - p) * 300, width: 150, height: 150, transform: 'rotate(-14deg)'}} />
    {Array.from({length: 46}, (_, i) => <div key={i} style={{position: 'absolute', left: random(`cx${i}`) * 1080, top: -40 + ((random(`cy${i}`) * VH + t * (0.35 + random(`cv${i}`) * 0.4)) % VH),
      width: 14, height: 22, background: i % 3 ? GOLD : WHITE, transform: `rotate(${t / 4 + i * 40}deg)`}} />)}
    {[0, 1, 2, 3, 4].map((i) => { const ft = 120 + i * 160 + random(`ft${i}`) * 80; const on = t > ft && t < ft + 70;
      return on ? <div key={i} style={{position: 'absolute', left: 80 + random(`fx${i}`) * 900, top: 900 + random(`fy${i}`) * 300, width: 130, height: 130, borderRadius: 65, background: 'radial-gradient(white, rgba(255,255,255,0) 70%)'}} /> : null; })}
  </CardFrame>;
};
const DateCard = ({o}: {o: number}) => {
  const t = o - date, p = ease(t / 260);
  return <CardFrame label="EXCLUSIVE · PAPARAZZI PHOTO" bg="radial-gradient(ellipse at 50% 55%, #7a1236 0%, #2a0614 75%)">
    {t < 90 && <AbsoluteFill style={{background: WHITE, opacity: 1 - t / 90}} />}
    <div style={{position: 'absolute', left: 0, top: 1010, width: 1080, height: 26, background: '#e9d9c4'}} />
    <div style={{position: 'absolute', left: 0, top: 1036, width: 1080, height: 300, background: '#3d0a1c'}} />
    {[420, 640].map((x) => <div key={x} style={{position: 'absolute', left: x, top: 880}}>
      <div style={{width: 22, height: 120, background: '#f6efe2', borderRadius: 4}} />
      <div style={{position: 'absolute', left: -7, top: -48, width: 36, height: 50, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'radial-gradient(#fff6c8, #ffb02e 60%, rgba(255,120,0,0))',
        transform: `scaleY(${1 + Math.sin(o / 60 + x) * 0.12})`}} />
    </div>)}
    <Img src={staticFile('emoji-ios/1f410.png')} style={{position: 'absolute', left: 60, top: 640 + (1 - p) * 120, width: 380, height: 380, transform: 'scaleX(-1)'}} />
    <Img src={staticFile('emoji-ios/1f3c6.png')} style={{position: 'absolute', left: 690, top: 690 + (1 - p) * 120, width: 300, height: 300}} />
    <Img src={staticFile('emoji-ios/1f979.png')} style={{position: 'absolute', left: 300, top: 600, width: 120, height: 120, opacity: p}} />
    {Array.from({length: 14}, (_, i) => { const y = 900 - ((t * (0.25 + random(`hv${i}`) * 0.25) + random(`hy${i}`) * 700) % 800);
      return <Heart key={i} x={380 + random(`hx${i}`) * 320 + Math.sin(t / 200 + i) * 20} y={y} s={36 + random(`hs${i}`) * 40} />; })}
  </CardFrame>;
};

// ---- BREAKING NEWS stinger over the freeze ----------------------------------------------------------------------------
const Stinger = ({o}: {o: number}) => {
  const t = o - K.freeze, d = K.della - K.freeze;
  if (t < 0 || t >= d) return null;
  const inP = (k: number) => ease((t - k * 50) / 180), outP = ease((t - (d - 160)) / 160);
  const bar = (k: number, y: number, h: number, c: string, child?: ReactNode) => (
    <div style={{position: 'absolute', left: 0, top: y, width: 1080, height: h, background: c, transform: `translateX(${(1 - inP(k)) * -1100 + outP * 1100}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{child}</div>);
  return <>
    {t < 80 && <AbsoluteFill style={{background: WHITE, opacity: 0.8 * (1 - t / 80)}} />}
    {bar(0, 620, 40, GOLD)}
    {bar(1, 660, 230, RED, <span style={{fontFamily: 'Anton', fontSize: 170, color: WHITE, letterSpacing: 4, transform: `scale(${1 + 0.04 * Math.sin(t / 40)})`}}>BREAKING</span>)}
    {bar(2, 890, 120, NAVY, <span style={{fontFamily: 'Oswald', fontWeight: 700, fontSize: 70, color: WHITE, letterSpacing: 18}}>NEWS</span>)}
  </>;
};

// ---- shots ---------------------------------------------------------------------------------------------------------------
const Video = ({o}: {o: number}) => {
  const h2 = (VH - 10) / 2;
  const split = (top: Seat, bot: Seat, act: 'top' | 'bot' | 'both', tags: [string?, string?], pushBot = 0) => <>
    <Box o={o} who={top} y={VY} h={h2} baseH={560} active={act !== 'bot'} tag={tags[0]} />
    <div style={{position: 'absolute', left: 0, top: VY + h2, width: 1080, height: 10, background: NAVY}} />
    <Box o={o} who={bot} y={VY + h2 + 10} h={h2} baseH={560} active={act !== 'top'} tag={tags[1]} push={pushBot} />
  </>;
  if (o < K.nba) return split('L', 'M', 'top', ['HOST', 'TREVOR LAWRENCE · NFL QB']);
  if (o < K.greatest) return split('L', 'M', 'bot', ['HOST', 'TREVOR LAWRENCE · NFL QB'], 0.06 * ease((o - K.nba) / 200));
  if (o < K.think) return split('L', 'M', 'top', ['HOST', 'TREVOR LAWRENCE']);
  if (o < K.laugh) {
    const push = o < K.freeze ? 0.1 * clamp01((o - K.think) / (K.freeze - K.think)) : o < K.della ? 0.1 : 0.1 + 0.06 * ease((o - K.della) / 200);
    return <Box o={o} who="M" y={VY} h={VH} baseH={620} push={push} />;
  }
  if (o < K.could) return split('L', 'R', 'both', ['HOST', 'HOST']);
  return <Box o={o} who="R" y={VY} h={VH} baseH={600} push={0.08 * clamp01((o - K.could) / 1300)} />;
};

export const NewsGoat = () => {
  const frame = useCurrentFrame();
  const o = (frame / FPS) * 1000;
  return <AbsoluteFill style={{background: NAVY}}>
    <Video o={o} />
    <Fans o={o} a={K.think + 1500} b={K.think + 4300} />
    {o >= K.della && o < K.laugh && <div style={{position: 'absolute', left: 30, top: VY + 40, width: 300, background: WHITE, padding: 8, boxShadow: '0 16px 40px rgba(0,0,0,.6)',
      transform: `translateX(${(1 - ease((o - K.della) / 220)) * -360}px)`}}>
      <Img src={staticFile('img/jorho/della.png')} style={{width: 284, height: 300, objectFit: 'cover', objectPosition: '50% 15%', background: '#ddd'}} />
      <div style={{fontFamily: 'Anton', fontSize: 44, color: NAVY, textAlign: 'center'}}>THE GOAT?</div>
    </div>}
    {o >= crown && o < date && <Coronation o={o} />}
    {o >= date && o < back && <DateCard o={o} />}
    {o >= K.could && <AbsoluteFill style={{background: `rgba(215,20,26,${0.1 + 0.08 * Math.sin(o / 120)})`, mixBlendMode: 'multiply', top: VY, height: VH}} />}
    <Stinger o={o} />
    <Header o={o} />
    <Lower o={o} />
    <CC o={o} />
    <Ticker o={o} />
    <SpeechTrack src="input.mp4" tl={tl} />
    <Music file="Investigations.mp3" songFrom={0} level={(t) => (t < K.think ? 0.07 : t < K.gotta - 150 ? 0.1 : 0)} />
    <Sequence from={Math.round((K.laugh / 1000) * FPS)}>
      <Music file="Curb_Credits.mp3" songFrom={0} level={(t) => (K.laugh + t < K.could ? 0.32 : 0.12) * Math.min(1, (K.end - K.laugh - t) / 300)} />
    </Sequence>
    <SfxTrack list={[
      sfx('scan-beep', 60, 0.25), sfx('keyboard-typing', 200, 0.18, 700), sfx('mg-click', K.nba, 0.3),
      sfx('keyboard-typing', K.greatest + 120, 0.16, 600),
      ...Array.from({length: Math.floor((K.gotta - K.think) / 1000)}, (_, i) => sfx('clock-tick', K.think + 1000 * (i + 1), 0.4)),
      sfx('camera-shutter', K.think + 1500, 0.35), sfx('phone-buzz', K.freeze - 40, 0.3, 500),
      sfx('mg-boom', K.freeze, 0.5), sfx('meme-dundun', K.freeze + 20, 0.45, 700), sfx('fast-whoosh', K.della - 180, 0.35),
      sfx('meme-impact', K.della, 0.35), sfx('record-scratch', K.laugh - 40, 0.35), sfx('camera-shutter', crown, 0.35), sfx('mg-shimmer', crown + 100, 0.3),
      sfx('camera-shutter', date, 0.4), sfx('camera-shutter', date + 160, 0.3), sfx('error', K.could, 0.3), sfx('error', K.could + 450, 0.25),
    ]} />
  </AbsoluteFill>;
};
