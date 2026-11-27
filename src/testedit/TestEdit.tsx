// Test edit: Big Buck Bunny (CC-BY Blender Foundation) cut as a 34 s silent "skit" Short
// using the PUNCH system from analysis/06_master_style_guide.md.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import edl from './edl.json';

loadFont({family: 'Montserrat', url: staticFile('fonts/montserrat-var-normal.woff2'), weight: '100 900'});
loadFont({family: 'Montserrat', url: staticFile('fonts/montserrat-var-italic.woff2'), weight: '100 900', style: 'italic'});

const C = {red: '#FF3B3B', green: '#3DFF6E', cyan: '#3DE7FF', yellow: '#FFE53D', magenta: '#FF4FD8', white: '#FFFFFF'};
type Col = keyof typeof C;
const VID = staticFile('test/selects.mp4');
const BOX_TOP = 240, BOX_H = 1440; // 3:4 picture box inside 9:16, blurred self-fill around it
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- picture: tracked virtual camera ----------
// edl.json (from tools/testedit/track.py) holds per-frame camera centre `cam` [x, y] in 1280x720 source px,
// a fixed zoom `z` per shot, and smoothed subject tracks `track[name]` = [cx, cy, w, h] per frame.
type ShotT = (typeof edl.shots)[number] & {cam: number[][]; track: Record<string, number[][]>};
const SHOTS = edl.shots as ShotT[];
const FREEZE_AT: Record<string, number> = {hf: 21};
const zoomRamp: Record<string, [number, number]> = {e6: [1.0, 1.08], m4: [1.0, 1.14], c2: [1.0, 1.08], f1: [1.0, 1.06]}; // multipliers
const localFrame = (s: ShotT, f: number) => FREEZE_AT[s.id] ?? Math.max(0, Math.min(s.dur - 1, f));
// camera transform for shot s at local frame f: output px per source px (k) and the picture offset inside the box
const camAt = (s: ShotT, f: number) => {
  const lf = localFrame(s, f);
  const r = zoomRamp[s.id];
  const z = s.z * (r ? interpolate(f, [0, s.dur], r, {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1);
  const k = 2 * z, w = 1280 * k, h = 720 * k;
  const [cx, cy] = s.cam[lf];
  const left = w >= 1080 ? Math.min(0, Math.max(1080 - w, 540 - cx * k)) : (1080 - w) / 2;
  const top = h >= BOX_H ? Math.min(0, Math.max(BOX_H - h, BOX_H / 2 - cy * k)) : (BOX_H - h) / 2;
  return {k, w, h, left, top};
};
// where a tracked subject is on the 1080x1920 output at local frame f
const subjectAt = (s: ShotT, name: string, f: number) => {
  const c = camAt(s, f); const [x, y, w, h] = s.track[name][localFrame(s, f)];
  return {x: c.left + x * c.k, y: BOX_TOP + c.top + y * c.k, w: w * c.k, h: h * c.k};
};
const Shot: React.FC<{s: ShotT}> = ({s}) => {
  const f = useCurrentFrame();
  const c = camAt(s, f);
  const isFreeze = s.id in FREEZE_AT;
  const video = <OffthreadVideo src={VID} trimBefore={s.sel} muted style={{width: '100%', height: '100%'}} />;
  const body = isFreeze ? <Freeze frame={FREEZE_AT[s.id]}>{video}</Freeze> : video;
  return (
    <AbsoluteFill>
      {/* blurred self-fill */}
      <AbsoluteFill style={{filter: 'blur(40px) brightness(0.55)', transform: 'scale(1.15)'}}>
        <div style={{position: 'absolute', left: (1080 - 3413) / 2, top: 0, width: 3413, height: 1920}}>{body}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: BOX_TOP, left: 0, width: 1080, height: BOX_H, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: c.left, top: c.top, width: c.w, height: c.h, filter: isFreeze ? 'brightness(0.6)' : undefined}}>{body}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- captions ----------
type Word = [string, Col?];
const Caption: React.FC<{lines: Word[][]; y: number; size?: number; italic?: boolean; mode?: 'words' | 'type' | 'pop'; dur: number}> = ({lines, y, size = 72, italic, mode = 'words', dur}) => {
  const f = useCurrentFrame();
  const all = lines.flat();
  const totalChars = all.reduce((n, [w]) => n + w.length + 1, 0);
  let wi = 0, ci = 0;
  const out = interpolate(f, [dur - 3, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', top: y, width: 1080, textAlign: 'center', opacity: out}}>
      {lines.map((line, li) => (
        <div key={li} style={{lineHeight: 1.12}}>
          {line.map(([word, col], k) => {
            const i = wi++; const c0 = ci; ci += word.length + 1;
            const color = C[col ?? 'white'];
            const glow = col ? `0 0 18px ${color}B0, 0 0 36px ${color}60` : '0 0 14px rgba(0,0,0,0.5)';
            const base: React.CSSProperties = {fontFamily: 'Montserrat', fontWeight: italic ? 800 : 900, fontStyle: italic ? 'italic' : 'normal', fontSize: size, letterSpacing: size * 0.03,
              color, textTransform: 'uppercase', textShadow: `${glow}, 0 4px 10px rgba(0,0,0,0.75), 0 0 3px #000`, display: 'inline-block', marginRight: size * 0.28};
            if (word.startsWith('emoji:')) {
              const es = mode === 'words' ? i * 5 : 0;
              const a = interpolate(f, [es, es + 3], [0, 1], clamp);
              return <Img key={k} src={staticFile(`emoji/${word.slice(6)}.png`)} style={{width: size * 1.05, height: size * 1.05, verticalAlign: '-0.18em', opacity: a, transform: `scale(${0.6 + 0.4 * a})`}} />;
            }
            if (mode === 'type') {
              // typewriter: ~1 character per frame
              const n = Math.floor(interpolate(f, [0, Math.min(dur - 4, totalChars)], [0, totalChars], clamp));
              const vis = Math.max(0, Math.min(word.length, n - c0));
              return <span key={k} style={base}>{word.slice(0, vis)}<span style={{opacity: 0}}>{word.slice(vis)}</span></span>;
            }
            const start = mode === 'pop' ? 0 : i * 5;
            const a = interpolate(f, [start, start + 3], [0, 1], clamp);
            return <span key={k} style={{...base, opacity: a, transform: `scale(${0.9 + 0.1 * a})`, filter: `blur(${(1 - a) * 6}px)`}}>{word}</span>;
          })}
        </div>
      ))}
    </div>
  );
};

const E = (code: string): Word => [`emoji:${code}`];
const CAPS: {from: number; to: number; lines: Word[][]; y?: number; size?: number; italic?: boolean; mode?: 'words' | 'type' | 'pop'}[] = [
  {from: 0, to: 33, lines: [[['*BULLY'], ['IN', 'red'], ['DANGER*', 'red']]], y: 130, size: 88, mode: 'type'},
  {from: 33, to: 75, lines: [[['HE'], ['MESSED'], ['WITH'], ['THE']], [['WRONG', 'red'], ['BUNNY'], E('1f480')]], y: 560, size: 84, mode: 'pop'},
  {from: 75, to: 123, lines: [[['JUST'], ['A'], ['CHILL', 'green'], ['BUNNY']]], y: 1150},
  {from: 123, to: 159, lines: [[['AND'], ['HIS'], ['BUTTERFLY', 'cyan']]], y: 1150},
  {from: 159, to: 201, lines: [[['*3'], ['BULLIES*', 'red']]], y: 1150, size: 84, mode: 'pop'},
  {from: 201, to: 261, lines: [[['*THREW'], ['FRUIT', 'cyan'], ['AT'], ['HIM*']]], y: 1150, italic: true},
  {from: 261, to: 330, lines: [[['THEN'], ['THEY'], ['GRABBED', 'red']], [['HIS'], ['BUTTERFLY']]], y: 1120},
  {from: 330, to: 369, lines: [[['*ATTACKED'], ['IT*', 'red'], E('1f631')]], y: 1150, italic: true},
  {from: 369, to: 435, lines: [[['BIG', 'magenta'], ['MISTAKE', 'magenta']]], y: 1150, size: 84},
  {from: 435, to: 496, lines: [[['*HE'], ['STARTED'], ['PREPARING*', 'cyan']]], y: 1150, italic: true},
  {from: 496, to: 544, lines: [[['*REVENGE'], ['MODE*', 'red']]], y: 1150, size: 88, mode: 'pop'},
  {from: 544, to: 574, lines: [[['*TRAPS'], ['READY*', 'cyan']]], y: 1150, italic: true},
  {from: 574, to: 610, lines: [[['*GOT'], ['ONE*', 'green'], E('1f633')]], y: 1150, italic: true, mode: 'pop'},
  {from: 610, to: 646, lines: [[['*GOT'], ['TWO*', 'green']]], y: 1150, italic: true, mode: 'pop'},
  {from: 646, to: 685, lines: [[['THE'], ['LEADER', 'red']], [['TRIED'], ['TO'], ['FLY'], ['AWAY']]], y: 1120},
  {from: 685, to: 715, lines: [[['*NOT'], ['IMPRESSED*', 'yellow']]], y: 1150, italic: true},
  {from: 715, to: 820, lines: [[['BUT'], ['THEN'], ['HE', 'magenta']], [['FLEW', 'magenta'], ['INTO', 'magenta'], ['THIS...', 'magenta']]], y: 1120},
  {from: 820, to: 874, lines: [[['*CAUGHT'], ['HIM*', 'green']]], y: 1150, size: 88, mode: 'pop'},
  {from: 874, to: 910, lines: [[['*BRO'], ['IS'], ['DONE*', 'red'], E('1f480')]], y: 1150, italic: true},
  {from: 910, to: 964, lines: [[['*JUSTICE*', 'green']]], y: 1150, size: 88, mode: 'pop'},
  {from: 964, to: 1016, lines: [[['NOW'], ["HE'S"], ['A'], ['KITE', 'yellow'], E('1f923')]], y: 1150, size: 80},
];

// ---------- overlays ----------
const Flash: React.FC<{color: string; peak?: number; decay: number}> = ({color, peak = 1, decay}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: color, opacity: interpolate(f, [0, 2, decay], [peak, peak, 0], {...clamp, easing: Easing.out(Easing.quad)})}} />;
};
const WhiteFlash: React.FC = () => {
  const f = useCurrentFrame(); // 4 up, 1 hold, 4 down; centred on the cut at local frame 4
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 4, 5, 9], [0, 1, 1, 0], clamp)}} />;
};
// Tracked overlays: they sit inside a <Sequence> that starts `delay` frames into shot `shot`,
// and re-read the smoothed subject track + camera every frame, so they ride with the character.
type Tracked = {shot: string; subj: string; delay?: number};
const useSubject = ({shot, subj, delay = 0}: Tracked) => {
  const f = useCurrentFrame(); const s = SHOTS.find((x) => x.id === shot)!;
  return {f, p: subjectAt(s, subj, f + delay)};
};
const Pointer: React.FC<Tracked & {side?: 'top' | 'right' | 'left'; at?: number}> = ({side = 'top', at = 0.5, ...t}) => {
  const {f, p} = useSubject(t);
  const bob = Math.sin(f * 0.85) * 10; const sc = interpolate(f, [0, 3, 5], [0.4, 1.12, 1], clamp);
  const S = 150, gap = 14;
  // tip position + rotation (arrow artwork points down)
  const [tx, ty, rot] = side === 'top' ? [p.x, p.y - p.h / 2 - gap - bob, 0]
    : side === 'right' ? [p.x + p.w / 2 + gap + bob, p.y - p.h / 2 + p.h * at, 90] : [p.x - p.w / 2 - gap - bob, p.y - p.h / 2 + p.h * at, -90];
  return (
    <svg width={S} height={S} viewBox="0 0 100 100" style={{position: 'absolute', left: tx - S / 2, top: ty - S, transformOrigin: '50% 100%', transform: `rotate(${rot}deg) scale(${sc})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.6))'}}>
      <path d="M50 96 L14 50 L36 50 L36 6 L64 6 L64 50 L86 50 Z" fill={C.red} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};
const Circle: React.FC<Tracked> = (t) => {
  const {f, p} = useSubject(t);
  const rx = p.w * 0.72, ry = p.h * 0.72; const len = Math.PI * (rx + ry);
  const pr = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <ellipse cx={p.x} cy={p.y} rx={rx} ry={ry} fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pr)} transform={`rotate(-80 ${p.x} ${p.y})`} style={{filter: 'drop-shadow(0 0 6px rgba(0,0,0,.7))'}} />
    </svg>
  );
};
const Spotlight: React.FC<Tracked & {dur: number}> = ({dur, ...t}) => {
  const {f, p} = useSubject(t);
  const a = interpolate(f, [0, 3, dur - 3, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity: a, background: `radial-gradient(ellipse ${p.w * 1.1}px ${p.h * 1.1}px at ${p.x}px ${p.y}px, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)`}} />;
};
const Sticker: React.FC<{src: string; x: number; y: number; size: number; dur: number}> = ({src, x, y, size, dur}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 2, 4], [0.7, 1.08, 1], clamp);
  const o = interpolate(f, [dur - 18, dur], [1, 0], clamp);
  return <Img src={staticFile(src)} style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${s})`, opacity: o, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.5))'}} />;
};
// whole-frame transforms: shake + B&W
const shakeAt = (f: number) => {
  const zones: [number, number, number][] = [[496, 520, 12], [574, 582, 9], [820, 832, 7]];
  for (const [a, b, amp] of zones) if (f >= a && f < b) { const k = amp * (1 - (f - a) / (b - a)); return [Math.sin(f * 2.7) * k, Math.cos(f * 3.9) * k]; }
  return [0, 0];
};

// ---------- sound ----------
type Snd = {at: number; src: string; vol: number; from?: number; dur?: number};
const SFX: Snd[] = [
  {at: 0, src: 'sfx/808-boom.mp3', vol: 0.8},
  {at: 33, src: 'sfx/record-scratch.mp3', vol: 0.55},
  {at: 38, src: 'sfx/rev-whoosh.mp3', vol: 0.8},
  {at: 75, src: 'sfx/meme-impact.mp3', vol: 0.6},
  {at: 159, src: 'sfx/vine-boom.mp3', vol: 0.45},
  {at: 162, src: 'sfx/jorho-pop.mp3', vol: 0.5},
  {at: 167, src: 'sfx/jorho-pop.mp3', vol: 0.5},
  {at: 172, src: 'sfx/jorho-pop.mp3', vol: 0.5},
  {at: 250, src: 'sfx/meme-bonk.mp3', vol: 0.8},
  {at: 303, src: 'sfx/fast-whoosh.mp3', vol: 0.45},
  {at: 330, src: 'sfx/meme-impact.mp3', vol: 0.55},
  {at: 369, src: 'sfx/heartbeat-loud.mp3', vol: 0.75, dur: 66},
  {at: 435, src: 'sfx/jorho-swish.mp3', vol: 0.6},
  {at: 455, src: 'sfx/jorho-swish.mp3', vol: 0.6},
  {at: 475, src: 'sfx/jorho-swish.mp3', vol: 0.6},
  {at: 492, src: 'sfx/808-boom.mp3', vol: 0.55},
  {at: 574, src: 'sfx/meme-bonk.mp3', vol: 0.8},
  {at: 610, src: 'sfx/mg-whoosh.mp3', vol: 0.45},
  {at: 685, src: 'sfx/jorho-pop.mp3', vol: 0.7},
  {at: 757, src: 'sfx/fast-whoosh.mp3', vol: 0.55},
  {at: 784, src: 'sfx/meme-dundun.mp3', vol: 0.6},
  {at: 790, src: 'sfx/jorho-pop.mp3', vol: 0.5},
  {at: 820, src: 'sfx/ding.mp3', vol: 0.85},
  {at: 874, src: 'sfx/vine-boom.mp3', vol: 0.5},
  {at: 910, src: 'sfx/jorho-pop.mp3', vol: 0.8},
  {at: 910, src: 'sfx/mg-shimmer.mp3', vol: 0.25, dur: 54},
  {at: 964, src: 'sfx/jorho-ting.mp3', vol: 0.6},
];
const URA = 'music/montagem-uranium.mp3', URA_M = 'test/uranium-muffled.mp3', SNK = 'music/Sneaky_Snitch.mp3', SNK_M = 'test/sneaky-muffled.mp3';
const uraB = Math.round((36.935 - (496 - 435) / 30) * 30); // drop of the 2nd uranium section lands on m4 (frame 496)
const MUSIC: Snd[] = [
  {at: 0, src: URA, vol: 0.3, from: Math.round(9.31 * 30), dur: 33},           // hook on the drop
  {at: 33, src: URA_M, vol: 0.3, from: Math.round(9.31 * 30) + 33, dur: 42},  // freeze: muffled
  {at: 75, src: SNK, vol: 0.6, from: 0, dur: 294},                             // story bed
  {at: 369, src: SNK_M, vol: 0.45, from: 294, dur: 66},                        // BIG MISTAKE: muffled
  {at: 435, src: URA, vol: 0.3, from: uraB, dur: 280},                         // revenge: drop at 496
  {at: 715, src: URA_M, vol: 0.32, from: uraB + 280, dur: 105},                // cliffhanger: muffled
  {at: 820, src: URA, vol: 0.32, from: uraB + 385, dur: 196},                  // payoff: filter opens
];

// Caption placement: test the caption band against every tracked subject's head (top 45% of its box,
// or the whole box for face/eyes tracks) at the caption's first, middle and last frame; use the first clear slot.
const SLOTS = [1150, 1480, 1320, 880];
const placeCaption = (c: (typeof CAPS)[number]) => {
  const size = c.size ?? 72; const bandH = c.lines.length * size * 1.12;
  const pref = c.y ?? 1150; if (pref < 700) return pref; // hook titles keep their spot
  const heads: {x0: number; x1: number; y0: number; y1: number}[] = [];
  for (const g of [c.from, Math.floor((c.from + c.to) / 2), c.to - 1]) {
    const s = SHOTS.find((x) => g >= x.from && g < x.from + x.dur); if (!s) continue;
    for (const name of Object.keys(s.track)) {
      const p = subjectAt(s, name, g - s.from); const full = /face|eyes/.test(name);
      heads.push({x0: p.x - p.w / 2, x1: p.x + p.w / 2, y0: p.y - p.h / 2, y1: p.y - p.h / 2 + p.h * (full ? 1 : 0.45)});
    }
  }
  const clear = (y: number) => heads.every((h) => h.x1 < 140 || h.x0 > 940 || h.y1 < y - 10 || h.y0 > y + bandH + 10);
  return [pref, ...SLOTS].find(clear) ?? pref;
};
const CAP_Y = CAPS.map(placeCaption);

export const TEST_EDIT_FRAMES = edl.total;
export const TestEdit: React.FC = () => {
  const f = useCurrentFrame();
  const [sx, sy] = shakeAt(f);
  const gray = interpolate(f, [369, 372, 410, 435], [0, 1, 1, 0], clamp);
  const at = (id: string) => SHOTS.find((x) => x.id === id)!;
  const c5 = at('c5'), s3 = at('s3'), f2 = at('f2');
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${sx || sy ? 1.03 : 1})`, filter: gray ? `grayscale(${gray})` : undefined}}>
        {SHOTS.map((s) => <Sequence key={s.id} from={s.from} durationInFrames={s.dur} layout="none"><Shot s={s} /></Sequence>)}
        <Sequence from={c5.from} durationInFrames={c5.dur}><Spotlight shot="c5" subj="frank" dur={c5.dur} /></Sequence>
      </AbsoluteFill>
      {/* graphics */}
      <Sequence from={0} durationInFrames={33}><Pointer shot="h1" subj="face" side="right" /></Sequence>
      {(['frank', 'rinky', 'chin'] as const).map((n, i) => <Sequence key={n} from={s3.from + 3 + i * 5} durationInFrames={s3.dur - 3 - i * 5}><Pointer shot="s3" subj={n} delay={3 + i * 5} /></Sequence>)}
      <Sequence from={c5.from + 6} durationInFrames={c5.dur - 6}><Circle shot="c5" subj="frank" delay={6} /></Sequence>
      <Sequence from={f2.from + 8} durationInFrames={f2.dur - 8}><Pointer shot="f2" subj="frank" delay={8} side="left" at={0.3} /></Sequence>
      <Sequence from={910} durationInFrames={54}><Sticker src="emoji/2764-fe0f-200d-1fa79.png" x={540} y={760} size={330} dur={54} /></Sequence>
      {CAPS.map((c, i) => <Sequence key={i} from={c.from} durationInFrames={c.to - c.from}><Caption lines={c.lines} y={CAP_Y[i]} size={c.size} italic={c.italic} mode={c.mode} dur={c.to - c.from} /></Sequence>)}
      {/* flashes and washes */}
      <Sequence from={71} durationInFrames={10}><WhiteFlash /></Sequence>
      <Sequence from={330} durationInFrames={20}><Flash color={C.red} peak={0.55} decay={18} /></Sequence>
      <Sequence from={492} durationInFrames={10}><WhiteFlash /></Sequence>
      <Sequence from={574} durationInFrames={14}><Flash color={C.yellow} peak={0.45} decay={12} /></Sequence>
      <Sequence from={715} durationInFrames={16}><Flash color={C.magenta} peak={0.5} decay={14} /></Sequence>
      <Sequence from={820} durationInFrames={22}><Flash color={C.green} peak={0.85} decay={20} /></Sequence>
      {/* audio */}
      {MUSIC.map((m, i) => <Sequence key={`m${i}`} from={m.at} durationInFrames={m.dur}><Audio src={staticFile(m.src)} trimBefore={m.from} volume={m.vol} /></Sequence>)}
      {SFX.map((s, i) => <Sequence key={`s${i}`} from={s.at} durationInFrames={s.dur ?? 90}><Audio src={staticFile(s.src)} volume={s.vol} /></Sequence>)}
    </AbsoluteFill>
  );
};
