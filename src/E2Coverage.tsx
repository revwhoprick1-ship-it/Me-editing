// Edit2 v2 test (user: "copy their motion graphics, current style is too simple, add images").
// Clip: Trevor Lawrence on reading the coverage before the snap (u6). What's new vs Edit2 v1:
//  - text BEHIND the speaker (per-frame person cut-outs, scripts/person_matte.py) like the viral talking-head edits;
//  - real photos (CC, Openverse/Commons) with Ken Burns, depth blur, 3D tilt, parallax, cut-outs popping out;
//  - a 3D broadcast-style telestrator field; whip-in transitions with motion blur; white flashes; film grain;
//  - everything keeps drifting (no static frame), polaroid outro.
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {SANS, SERIF} from './mgFonts';
import track from './plans/data/u6_coen_duo.seats.json';
import words from './plans/data/u6_coen_duo.words.json';

export const CV_FPS = 30;
const W = 1080;
const H = 1920;
const SRC = 'pod2/u6_coen_duo.mp4';
const SRC_W = 1920;
const SRC_H = 1080;
const f = (ms: number) => Math.round((ms / 1000) * CV_FPS);
const TEAL = '#0FA3B1';

// ---- timeline ----------------------------------------------------------------
const SEGS: [number, number][] = [[109000, 113400], [66480, 68200], [76580, 83300], [91800, 100100], [106720, 108700]];
const segOut = SEGS.reduce<number[]>((a, _, i) => [...a, i ? a[i - 1] + (SEGS[i - 1][1] - SEGS[i - 1][0]) : 0], []);
const STORY = segOut[4] + SEGS[4][1] - SEGS[4][0];
const OUTRO = 2200;
export const CV_OUT_MS = STORY + OUTRO;
const out = (src: number) => {
  let i = SEGS.findIndex(([a, b]) => src >= a && src < b);
  if (i < 0) i = SEGS.findIndex(([, b]) => src === b);
  return segOut[i] + src - SEGS[i][0];
};
const srcAt = (o: number) => {
  for (let i = SEGS.length - 1; i >= 0; i--) if (o >= segOut[i]) return Math.min(SEGS[i][1], SEGS[i][0] + o - segOut[i]);
  return SEGS[0][0];
};
const T = {s2: segOut[1], s3: segOut[2], s4: segOut[3], s4b: out(95820), throw: out(99840), s5: segOut[4]};

// ---- helpers -------------------------------------------------------------------
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const reveal = (frame: number, st: number, dist = 26) => {
  const p = interpolate(frame - st, [0, 9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return {opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `translateY(${(1 - p) * dist}px) scale(${1.06 - 0.06 * p})`};
};
// slide in from the side with motion blur (ref: "I don't want to be" sliding in blurred)
const slideIn = (frame: number, st: number, from = -140) => {
  const p = interpolate(frame - st, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return {opacity: p, filter: `blur(${(1 - p) * 16}px)`, transform: `translateX(${(1 - p) * from}px)`};
};
const font = {
  sans: {fontFamily: SANS, fontWeight: 500, letterSpacing: '-0.02em'},
  bold: {fontFamily: SANS, fontWeight: 800, letterSpacing: '-0.05em'},
  serif: {fontFamily: SERIF, fontWeight: 400},
  serifI: {fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic'},
} satisfies Record<string, CSSProperties>;
const shadow = '0 0 30px rgba(255,255,255,0.22), 0 6px 24px rgba(0,0,0,0.6)';

// film grain (animated noise)
const Grain = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 30} /></filter>
      <rect width={W} height={H} filter="url(#g)" />
    </svg>
  );
};
// every scene whips in: fast horizontal slide + motion blur (+ optional white flash)
const WhipIn = ({children, flash = false, dir = 1}: {children: ReactNode; flash?: boolean; dir?: number}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const fl = interpolate(frame, [0, 1, 6], [0.9, 0.7, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${(1 - p) * 260 * dir}px) scale(${1 + (1 - p) * 0.08})`, filter: `blur(${(1 - p) * 26}px)`}}>{children}</AbsoluteFill>
      {flash && <AbsoluteFill style={{background: 'white', opacity: fl}} />}
    </AbsoluteFill>
  );
};

// ---- face cam (with person cut-out layer for text behind the head) ---------------
type TrackT = {stepMs: number; fromMs: number; M: number[][]};
const TR = track as unknown as TrackT;
const faceAt = (src: number) => {
  const i = (src - TR.fromMs) / TR.stepMs;
  const a = TR.M[Math.max(0, Math.min(TR.M.length - 1, Math.floor(i)))];
  const b = TR.M[Math.max(0, Math.min(TR.M.length - 1, Math.floor(i) + 1))];
  const t = Math.min(1, Math.max(0, i - Math.floor(i)));
  return {x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t};
};
// person cut-outs: crop x 545..1345 of the source, all 1080 rows, saved at 480x648, 30 fps from the segment start
const MATTES: {seg: [number, number]; dir: string; n: number}[] = [
  {seg: [109000, 113400], dir: 'matte/coverage/a', n: 133}, {seg: [106720, 108700], dir: 'matte/coverage/b', n: 60}];
const GRADE = 'contrast(1.12) saturate(0.92) brightness(0.86)';

const FaceCam = ({behind}: {behind?: ReactNode}) => {
  const frame = useCurrentFrame();
  const o = (frame / CV_FPS) * 1000;
  const src = srcAt(Math.min(o, STORY - 1));
  const face = faceAt(src);
  const z = interpolate(o % 4400, [0, 4400], [1, 1.06]);
  const hs = 600 / z;
  const ws = (hs * W) / H;
  const x0 = Math.min(Math.max(face.x - ws / 2, 0), SRC_W - ws);
  const y0 = Math.min(Math.max(face.y - hs * 0.4, 0), SRC_H - hs);
  const k = W / ws;
  const m = MATTES.find((q) => src >= q.seg[0] && src < q.seg[1]);
  const mi = m ? Math.min(m.n, Math.max(1, Math.floor(((src - m.seg[0]) / 1000) * 30) + 1)) : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -x0 * k, top: -y0 * k, width: SRC_W * k, height: SRC_H * k, filter: GRADE}}>
        {SEGS.map(([a, b], i) => (
          <Sequence key={i} from={f(segOut[i])} durationInFrames={f(b - a)} layout="none">
            <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(a)} style={{width: '100%', height: '100%'}} />
          </Sequence>
        ))}
      </div>
      <AbsoluteFill style={{background: 'rgba(30,30,90,0.28)', mixBlendMode: 'soft-light'}} />
      {behind}
      {m && <Img src={staticFile(`${m.dir}/${String(mi).padStart(4, '0')}.png`)} style={{position: 'absolute',
        left: (545 - x0) * k, top: -y0 * k, width: 800 * k, height: 1080 * k, filter: GRADE}} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 38%, transparent 42%, rgba(5,5,20,0.72) 100%)'}} />
    </AbsoluteFill>
  );
};
// face cam inside a floating card (any scene)
const CamCard = ({x, y, w, h, rot = 0, src0}: {x: number; y: number; w: number; h: number; rot?: number; src0: number}) => {
  const frame = useCurrentFrame();
  const src = src0 + (frame / CV_FPS) * 1000;
  const face = faceAt(src);
  const hs = 640;
  const ws = (hs * w) / h;
  const x0 = Math.min(Math.max(face.x - ws / 2, 0), SRC_W - ws);
  const y0 = Math.min(Math.max(face.y - hs * 0.38, 0), SRC_H - hs);
  const k = w / ws;
  const float = Math.sin(frame / 20) * 6;
  return (
    <div style={{position: 'absolute', left: x, top: y + float, width: w, height: h, borderRadius: 36, overflow: 'hidden',
      transform: `perspective(1400px) rotateY(${rot}deg) rotateX(${rot * -0.35}deg)`, boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.15)'}}>
      <div style={{position: 'absolute', left: -x0 * k, top: -y0 * k, width: SRC_W * k, height: SRC_H * k, filter: GRADE}}>
        <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(src0)} style={{width: '100%', height: '100%'}} />
      </div>
    </div>
  );
};

// ---- photo layers -------------------------------------------------------------------
const Photo = ({file, from = 1.18, to = 1.05, panX = 0, blur = 0, grade = 'brightness(0.55) saturate(0.9)', style}: {
  file: string; from?: number; to?: number; panX?: number; blur?: number; grade?: string; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = frame / Math.max(1, durationInFrames);
  return (
    <AbsoluteFill style={{overflow: 'hidden', ...style}}>
      <Img src={staticFile(file)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `${grade} blur(${blur}px)`,
        transform: `scale(${from + (to - from) * p}) translateX(${panX * p}px)`}} />
    </AbsoluteFill>
  );
};

// ---- 3D telestrator field ----------------------------------------------------------------
// Top-down field (1000x1400) laid back in perspective like a broadcast graphic.
const FW = 1000;
const FH = 1400;
const pt = (x: number, y: number) => ({x: x * FW, y: y * FH});
const OFF: Record<string, [number, number]> = {
  lt: [0.38, 0.72], lg: [0.44, 0.72], c: [0.5, 0.72], rg: [0.56, 0.72], rt: [0.62, 0.72], qb: [0.5, 0.82], rb: [0.5, 0.92],
  x: [0.08, 0.72], te: [0.69, 0.73], slot: [0.8, 0.73], slotL: [0.25, 0.73],
};
const DEF: Record<string, [number, number]> = {
  de1: [0.36, 0.665], dt1: [0.46, 0.665], dt2: [0.54, 0.665], de2: [0.64, 0.665], lb1: [0.36, 0.56], lb2: [0.5, 0.56], lb3: [0.66, 0.56],
  cb1: [0.08, 0.56], cb2: [0.93, 0.56], s1: [0.3, 0.32], s2: [0.72, 0.32],
};
type Ev = Record<string, number>; // event -> frame inside the scene
const Field3D = ({variant, ev, tilt = 52}: {variant: 'coverage' | 'cover3'; ev: Ev; tilt?: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const prog = (k: string, d = 14) => (ev[k] === undefined ? 0 : interpolate(frame - ev[k], [0, d], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}));
  const pop = (i: number) => spring({frame: frame - 4 - i * 1.1, fps, config: {damping: 13, stiffness: 200}});
  const off = {...OFF};
  const def = {...DEF};
  const motion = prog('motion', 18);
  if (variant === 'coverage') { off.slot = [0.8 - 0.42 * motion, 0.73]; def.lb3 = [0.66 - 0.36 * prog('show', 16), 0.56]; def.s2 = [0.72, 0.32 + 0.1 * prog('show', 16)]; delete off.slotL; }
  if (variant === 'cover3') { def.s1 = [0.5, 0.2]; def.s2 = [0.5, 0.2]; def.cb1 = [0.14, 0.3 + 0.0 * prog('zones')]; def.cb2 = [0.86, 0.3]; delete off.slot; }
  const line = (a: [number, number], b: [number, number], p: number, c: string, dash = false, w = 12) => {
    const A = pt(...a), B = pt(...b);
    return <line x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={c} strokeWidth={w} strokeLinecap="round"
      strokeDasharray={dash ? '6 26' : undefined} style={{filter: `drop-shadow(0 0 14px ${c})`}} />;
  };
  const head = (a: [number, number], b: [number, number], p: number, c: string) => {
    if (p < 0.98) return null;
    const A = pt(...a), B = pt(...b); const g = Math.atan2(B.y - A.y, B.x - A.x); const s = 40;
    return <polygon points={`${B.x},${B.y} ${B.x - s * Math.cos(g - 0.45)},${B.y - s * Math.sin(g - 0.45)} ${B.x - s * Math.cos(g + 0.45)},${B.y - s * Math.sin(g + 0.45)}`} fill={c} />;
  };
  const sweep = interpolate(frame, [0, 40], [-0.3, 1.3], clamp);
  return (
    <div style={{position: 'absolute', left: (W - FW) / 2, top: 360, width: FW, height: FH, transformStyle: 'preserve-3d',
      transform: `perspective(1500px) rotateX(${tilt}deg) rotateZ(${Math.sin(frame / 60) * 1.5}deg) scale(${1.12 + frame * 0.0006})`, transformOrigin: '50% 75%'}}>
      <svg width={FW} height={FH} style={{overflow: 'visible'}}>
        <defs>
          <linearGradient id="t3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d3b24" stopOpacity="0.9" /><stop offset="1" stopColor="#1d6a3e" stopOpacity="0.95" /></linearGradient>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0"><stop offset={Math.max(0, sweep - 0.1)} stopColor="white" stopOpacity="0" />
            <stop offset={Math.max(0, Math.min(1, sweep))} stopColor="white" stopOpacity="0.18" /><stop offset={Math.min(1, sweep + 0.1)} stopColor="white" stopOpacity="0" /></linearGradient>
        </defs>
        <rect width={FW} height={FH} rx={30} fill="url(#t3)" stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
        {Array.from({length: 9}).map((_, i) => <line key={i} x1={0} x2={FW} y1={(i + 0.5) * FH / 9} y2={(i + 0.5) * FH / 9} stroke="rgba(255,255,255,0.22)" strokeWidth={4} />)}
        {Array.from({length: 18}).map((_, i) => <line key={`h${i}`} x1={FW * 0.36} x2={FW * 0.38} y1={i * FH / 18} y2={i * FH / 18} stroke="rgba(255,255,255,0.3)" strokeWidth={4} />)}
        {Array.from({length: 18}).map((_, i) => <line key={`k${i}`} x1={FW * 0.62} x2={FW * 0.64} y1={i * FH / 18} y2={i * FH / 18} stroke="rgba(255,255,255,0.3)" strokeWidth={4} />)}
        <line x1={0} x2={FW} y1={pt(0, 0.695).y} y2={pt(0, 0.695).y} stroke="#4FC3F7" strokeWidth={8} style={{filter: 'drop-shadow(0 0 12px #4FC3F7)'}} />
        <rect width={FW} height={FH} rx={30} fill="url(#sweep)" />
        {variant === 'cover3' && [0, 1, 2].map((i) => {
          const p = prog('zones', 12); const c = pt(0.17 + i * 0.33, 0.2);
          return <g key={i}><ellipse cx={c.x} cy={c.y} rx={155 * p} ry={210 * p} fill="rgba(79,195,247,0.25)" stroke="#4FC3F7" strokeWidth={6} style={{filter: 'drop-shadow(0 0 16px #4FC3F7)'}} />
            {p > 0.9 && <text x={c.x} y={c.y + 14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={44} fill="white">DEEP ⅓</text>}</g>;
        })}
        {variant === 'coverage' && <>
          {line(OFF.slot, [0.38, 0.73], motion, 'rgba(255,255,255,0.85)', true, 9)}
          {line(OFF.te, [0.69, 0.3], prog('open', 14), '#FFD84D')}{head(OFF.te, [0.69, 0.3], prog('open', 14), '#FFD84D')}
        </>}
        {variant === 'cover3' && <>
          {line(OFF.te, [0.67, 0.1], prog('seams', 16), '#FFD84D')}{head(OFF.te, [0.67, 0.1], prog('seams', 16), '#FFD84D')}
          {line(OFF.slotL, [0.33, 0.1], prog('seams', 16), '#FFD84D')}{head(OFF.slotL, [0.33, 0.1], prog('seams', 16), '#FFD84D')}
          {line(OFF.qb, [0.67, 0.28], prog('throw', 10), 'white', true, 9)}
        </>}
        {Object.entries(off).map(([k, [x, y]], i) => {
          const p = pt(x, y); const isQB = k === 'qb';
          return <g key={k} transform={`translate(${p.x},${p.y}) scale(${pop(i)})`}>
            <circle r={isQB ? 46 : 36} fill={isQB ? TEAL : 'white'} stroke="#071018" strokeWidth={6} style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))'}} />
            {isQB && <text y={15} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={42} fill="white">16</text>}
          </g>;
        })}
        {Object.entries(def).map(([k, [x, y]], i) => {
          const p = pt(x, y);
          return <g key={k} transform={`translate(${p.x},${p.y}) scale(${pop(i + 6)})`} stroke="#FF5A5A" strokeWidth={13} strokeLinecap="round" style={{filter: 'drop-shadow(0 0 8px rgba(255,90,90,0.7))'}}>
            <line x1={-26} y1={-26} x2={26} y2={26} /><line x1={26} y1={-26} x2={-26} y2={26} /></g>;
        })}
        {(() => {
          const k = variant === 'coverage' ? prog('open', 10) : prog('throw', 10);
          const c = variant === 'coverage' ? pt(0.69, 0.3) : pt(0.67, 0.28);
          return k > 0 && <circle cx={c.x} cy={c.y} r={95 * k} fill="rgba(59,255,138,0.15)" stroke="#3BFF8A" strokeWidth={10} style={{filter: 'drop-shadow(0 0 20px #3BFF8A)'}} />;
        })()}
      </svg>
    </div>
  );
};
const Chip = ({t, at, color = '#FFD84D', dark = true}: {t: string; at: number; color?: string; dark?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 240}});
  if (frame < at) return null;
  return <div style={{transform: `scale(${s})`, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: '0.08em', padding: '13px 24px',
    borderRadius: 30, background: color, color: dark ? '#111' : 'white', boxShadow: `0 0 24px ${color}88`, whiteSpace: 'nowrap'}}>{t}</div>;
};

// ---- subs ---------------------------------------------------------------------------------
type Wd = {text: string; startMs: number; endMs: number};
const WORDS = words as Wd[];
const FIX: Record<string, string> = {lineback: 'linebacker', covered: 'cover', through: 'three', 'through.': 'three.'};
const Subs = ({from, to, y, color = 'white', size = 46}: {from: number; to: number; y: number; color?: string; size?: number}) => {
  const frame = useCurrentFrame();
  const o = out(from) + (frame / CV_FPS) * 1000;
  const ws = WORDS.filter((w) => w.startMs >= from && w.startMs < to);
  const groups: {t: string; a: number; b: number}[] = [];
  for (let i = 0; i < ws.length; i += 3) {
    const g = ws.slice(i, i + 3);
    groups.push({t: g.map((w) => FIX[w.text] ?? w.text).join(' '), a: g[0].startMs, b: ws[i + 3]?.startMs ?? Math.min(to, g[g.length - 1].endMs + 400)});
  }
  const g = groups.find((q) => o >= out(q.a) && o < out(Math.min(q.b, to)));
  if (!g) return null;
  return <div style={{position: 'absolute', top: y, width: W, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: size, color,
    letterSpacing: '-0.02em', textShadow: '0 4px 18px rgba(0,0,0,0.7)', ...reveal(frame, f(out(g.a) - out(from)))}}>{g.t}</div>;
};

// ---- scenes ---------------------------------------------------------------------------------
const at = (src: number, sceneOut: number) => f(out(src) - sceneOut);

const S1Hook = () => {
  const frame = useCurrentFrame();
  const u = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const big = at(110460, 0);
  return (
    <AbsoluteFill>
      <FaceCam behind={
        <div style={{position: 'absolute', top: 430, width: W, textAlign: 'center', ...font.bold, fontSize: 150, color: 'rgba(255,255,255,0.96)',
          textShadow: '0 0 60px rgba(120,180,255,0.35)', ...reveal(frame, big, 60)}}>
          <span style={{display: 'inline-block', transform: `scale(${1 + Math.max(0, frame - big) * 0.002})`}}>CONFIDENCE</span>
        </div>} />
      <div style={{position: 'absolute', top: 120, left: 70, right: 70, textAlign: 'center'}}>
        <div style={{...font.bold, fontWeight: 700, fontSize: 30, letterSpacing: '0.26em', color: 'rgba(255,255,255,0.85)', ...reveal(frame, 0)}}>TREVOR LAWRENCE</div>
        <div style={{margin: '14px auto 18px', height: 3, width: 300 * u, background: 'white', boxShadow: '0 0 12px white'}} />
        <div style={{...font.bold, fontSize: 66, lineHeight: 1.03, color: 'white', textShadow: '0 6px 24px rgba(0,0,0,0.6)', ...reveal(frame, 3)}}>
          How an NFL QB knows the coverage <span style={{...font.serifI, fontSize: 78}}>before</span> the snap</div>
      </div>
      <div style={{position: 'absolute', left: 80, top: 1180, ...font.sans, fontSize: 56, color: 'white', textShadow: shadow, ...slideIn(frame, at(109080, 0))}}>I have the most</div>
      <div style={{position: 'absolute', right: 70, top: 1250, textAlign: 'right', lineHeight: 0.95, color: 'white', textShadow: shadow}}>
        <div style={{...font.serif, fontSize: 112, ...slideIn(frame, at(110920, 0), 140)}}>before the ball</div>
        <div style={{...font.serifI, fontSize: 140, ...slideIn(frame, at(111580, 0), 140)}}>is snapped.</div>
      </div>
      <Subs from={112000} to={113400} y={1580} />
    </AbsoluteFill>
  );
};

const S2Coen = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#04080c'}}>
      <Photo file="img/e2/stadium.jpg" from={1.3} to={1.12} panX={-60} blur={1.5} grade="brightness(0.78) saturate(0.95)" />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(4,40,48,0.15), rgba(2,8,12,0.35) 45%, rgba(2,8,12,0.88) 72%)`}} />
      <CamCard x={250} y={230} w={600} h={720} rot={-12} src0={66480} />
      <div style={{position: 'absolute', left: 80, top: 1150, lineHeight: 0.9, color: 'white', textShadow: shadow}}>
        <div style={{...font.serif, fontSize: 190, ...slideIn(frame, 5)}}>Liam</div>
        <div style={{...font.serifI, fontSize: 190, ...slideIn(frame, 9)}}>Coen.</div>
      </div>
      <div style={{position: 'absolute', left: 84, top: 1560, display: 'flex', gap: 14}}>
        <Chip t="JAGUARS HEAD COACH" at={14} color={TEAL} dark={false} />
      </div>
      <Subs from={66480} to={68200} y={1700} size={44} />
    </AbsoluteFill>
  );
};

const S3Open = () => {
  const frame = useCurrentFrame();
  const ev = {open: at(77300, T.s3), motion: at(79360, T.s3), show: at(82100, T.s3)};
  return (
    <AbsoluteFill style={{background: '#03060b'}}>
      <Photo file="img/e2/trevor_cam.jpg" from={1.45} to={1.25} panX={40} blur={14} grade="brightness(0.35) saturate(0.8)" />
      <Field3D variant="coverage" ev={ev} />
      <div style={{position: 'absolute', left: 70, top: 200, lineHeight: 0.92, color: 'white', textShadow: shadow}}>
        <div style={{...font.serifI, fontSize: 130, ...slideIn(frame, 4)}}>Why's he</div>
        <div style={{...font.bold, fontSize: 150, ...slideIn(frame, at(77300, T.s3))}}>WIDE OPEN?</div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 520, display: 'flex', gap: 14}}>
        <Chip t="MOTION" at={ev.motion} />
        <Chip t="FORMATION" at={at(80180, T.s3)} />
        <Chip t="DEFENSE SHOWS IT" at={ev.show} color="#FF8A8A" />
      </div>
      <Subs from={76580} to={83300} y={1780} size={42} />
    </AbsoluteFill>
  );
};

const S4See = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = f(T.s4b - T.s4); // field part starts
  const th = f(T.throw - T.s4);
  const cutIn = spring({frame: frame - 2, fps, config: {damping: 18, stiffness: 90}});
  const toField = interpolate(frame, [b, b + 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const thr = interpolate(frame, [th, th + 2, th + 8], [0, 0.9, 0], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #0e2a3a 0%, #04070d 70%)'}}>
      {/* part A: giant serif behind the cut-out */}
      <div style={{position: 'absolute', top: 330, width: W, textAlign: 'center', lineHeight: 0.85, color: 'white', opacity: 1 - toField}}>
        <div style={{...font.sans, fontSize: 60, ...reveal(frame, 2)}}>and then</div>
        <div style={{...font.serifI, fontSize: 290, ...reveal(frame, 6, 60)}}>you see</div>
        <div style={{...font.bold, fontSize: 330, ...reveal(frame, 10, 60)}}>IT.</div>
      </div>
      {toField > 0 && <AbsoluteFill style={{opacity: toField}}>
        <Field3D variant="cover3" ev={{seams: b, zones: at(98320, T.s4), throw: th}} tilt={48} />
        <div style={{position: 'absolute', left: 70, top: 250, display: 'flex', gap: 14}}>
          <Chip t="SEAMS" at={b + 4} />
          <Chip t="COVER 3" at={at(98320, T.s4)} color="#4FC3F7" />
          <Chip t="THROW IT" at={th} color="#3BFF8A" />
        </div>
        <div style={{position: 'absolute', left: 70, top: 340, ...font.serifI, fontSize: 120, color: 'white', textShadow: shadow, ...slideIn(frame, b + 2)}}>Then you see it.</div>
      </AbsoluteFill>}
      {/* Trevor cut-out: big in front, then steps aside to the corner when the field comes in; swaps to the throw */}
      {(() => {
        const s = interpolate(toField, [0, 1], [1, 0.55]);
        const x = interpolate(toField, [0, 1], [90, -60]);
        const y = interpolate(toField, [0, 1], [760, 1080]);
        const file = frame >= th ? 'img/e2/trevor_sep2022_cut.png' : 'img/e2/trevor_action_cut.png';
        return <Img src={staticFile(file)} style={{position: 'absolute', left: x, top: y + (1 - cutIn) * 600, height: 1360 * s,
          filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6)) contrast(1.05)'}} />;
      })()}
      <AbsoluteFill style={{background: 'white', opacity: thr}} />
      <Subs from={91800} to={100100} y={1780} size={42} />
    </AbsoluteFill>
  );
};

const S5Cover3 = () => {
  const frame = useCurrentFrame();
  const big = at(107760, T.s5);
  return (
    <AbsoluteFill>
      <FaceCam behind={
        <div style={{position: 'absolute', top: 330, width: W, textAlign: 'center', ...font.bold, fontSize: 215, color: 'white',
          textShadow: '0 0 60px rgba(79,195,247,0.5)', ...reveal(frame, big, 60)}}>COVER 3</div>} />
      <div style={{position: 'absolute', left: 80, top: 1230, ...font.sans, fontSize: 56, color: 'white', textShadow: shadow, ...slideIn(frame, 0)}}>I know right away,</div>
      <div style={{position: 'absolute', right: 70, top: 1330, ...font.serifI, fontSize: 140, color: '#FFE3A3', textShadow: shadow, ...slideIn(frame, at(108260, T.s5), 140)}}>I got the seam.</div>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pics = ['img/e2/stadium.jpg', 'img/e2/trevor_cam.jpg', 'img/e2/trevor_action.jpg'];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #13202c 0%, #04070d 75%)'}}>
      {pics.map((p, i) => {
        const s = spring({frame: frame - i * 5, fps, config: {damping: 13, stiffness: 120}});
        const rot = [-9, 7, -3][i];
        return <div key={p} style={{position: 'absolute', left: 190 + i * 40, top: 260 + i * 60, width: 620, height: 760, background: 'white', padding: 22,
          boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', transform: `translateY(${(1 - s) * -900}px) rotate(${rot * s}deg)`}}>
          <Img src={staticFile(p)} style={{width: '100%', height: 620, objectFit: 'cover'}} />
        </div>;
      })}
      <div style={{position: 'absolute', top: 1260, width: W, textAlign: 'center', lineHeight: 0.92, color: 'white', textShadow: shadow}}>
        <div style={{...font.sans, fontSize: 66, ...reveal(frame, 14)}}>Know it</div>
        <div style={{...font.serif, fontSize: 210, ...reveal(frame, 19)}}>before</div>
        <div style={{...font.serifI, fontSize: 170, color: '#FFE3A3', ...reveal(frame, 25)}}>the snap.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- sound ------------------------------------------------------------------------------------
type Sfx = {file: string; at: number; vol: number; peak: number};
const SFX: Sfx[] = [
  {file: 'mg-swoosh2', at: 0, vol: 0.35, peak: 0},
  {file: 'mg-boom', at: out(110460), vol: 0.45, peak: 190},
  ...[T.s2, T.s3, T.s4, T.s5].map((t) => ({file: 'mg-whoosh', at: t, vol: 0.5, peak: 780})),
  {file: 'mg-click', at: T.s2 + 470, vol: 0.5, peak: 300},
  {file: 'mg-click', at: out(77300), vol: 0.45, peak: 300}, {file: 'mg-swoosh2', at: out(79360), vol: 0.35, peak: 0},
  {file: 'mg-click', at: out(79360), vol: 0.45, peak: 300}, {file: 'mg-click', at: out(80180), vol: 0.45, peak: 300},
  {file: 'mg-click', at: out(82100), vol: 0.45, peak: 300}, {file: 'mg-swoosh2', at: out(82100), vol: 0.3, peak: 0},
  {file: 'mg-boom', at: T.s4 + 330, vol: 0.4, peak: 190},
  {file: 'mg-whoosh', at: T.s4b, vol: 0.4, peak: 780}, {file: 'mg-click', at: T.s4b + 130, vol: 0.45, peak: 300},
  {file: 'mg-click', at: out(98320), vol: 0.45, peak: 300},
  {file: 'mg-boom', at: T.throw, vol: 0.5, peak: 190}, {file: 'mg-swoosh2', at: T.throw, vol: 0.4, peak: 0},
  {file: 'mg-boom', at: out(107760), vol: 0.45, peak: 190},
  ...[0, 1, 2].map((i) => ({file: 'camera-shutter', at: STORY + i * 170, vol: 0.4, peak: 30})),
  {file: 'mg-shimmer', at: STORY + 500, vol: 0.45, peak: 700},
];
const SPEECH = WORDS.filter((w) => SEGS.some(([a, b]) => w.startMs >= a && w.startMs < b)).map((w) => [out(w.startMs), out(w.startMs) + w.endMs - w.startMs]);
const talking = (o: number) => SPEECH.some(([a, b]) => o >= a - 150 && o <= b + 150);

// ---- composition --------------------------------------------------------------------------------
export const E2Coverage = () => {
  const total = f(CV_OUT_MS);
  const seq = (a: number, b: number, n: ReactNode) => <Sequence from={f(a)} durationInFrames={f(b) - f(a)}>{n}</Sequence>;
  return (
    <AbsoluteFill style={{background: 'black'}}>
      {seq(0, T.s2, <S1Hook />)}
      {seq(T.s2, T.s3, <WhipIn flash><S2Coen /></WhipIn>)}
      {seq(T.s3, T.s4, <WhipIn dir={-1}><S3Open /></WhipIn>)}
      {seq(T.s4, T.s5, <WhipIn><S4See /></WhipIn>)}
      {seq(T.s5, STORY, <WhipIn flash dir={-1}><S5Cover3 /></WhipIn>)}
      {seq(STORY, CV_OUT_MS, <WhipIn><Outro /></WhipIn>)}
      <Grain />
      {SEGS.map(([a, b], i) => (
        <Sequence key={`a${i}`} from={f(segOut[i])} durationInFrames={f(b - a)}>
          <Audio src={staticFile(SRC)} trimBefore={f(a)} volume={(fr) => Math.min(1, fr / 2, (f(b - a) - fr) / 2)} />
        </Sequence>
      ))}
      <Audio src={staticFile('music/interstellar-piano.mp3')} trimBefore={f(10000)} volume={(fr) => {
        const t = (fr / CV_FPS) * 1000;
        const end = Math.min(1, (total - fr) / 20);
        if (t >= STORY) return 0.55 * end;
        return (talking(t) ? 0.14 : 0.32) * Math.min(1, fr / 6);
      }} />
      {SFX.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(s.at - s.peak))}><Audio src={staticFile(`sfx/${s.file}.mp3`)} volume={s.vol} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
