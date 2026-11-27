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
const shot = (id: string) => edl.shots.find((s) => s.id === id)!;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- picture ----------
const zoomRamp: Record<string, [number, number]> = {e6: [1.0, 1.08], m4: [1.0, 1.14], c2: [1.2, 1.3], f1: [1.0, 1.06]};
const Shot: React.FC<{s: (typeof edl.shots)[number]}> = ({s}) => {
  const f = useCurrentFrame();
  const ramp = zoomRamp[s.id];
  const z = ramp ? interpolate(f, [0, s.dur], ramp, {...clamp, easing: Easing.inOut(Easing.cubic)}) : s.z;
  const w = 2560 * z, h = 1440 * z;
  const left = w >= 1080 ? Math.min(0, Math.max(1080 - w, 540 - s.fx * w)) : (1080 - w) / 2;
  const isFreeze = s.id === 'hf';
  const video = <OffthreadVideo src={VID} trimBefore={s.sel} muted style={{width: '100%', height: '100%'}} />;
  const body = isFreeze ? <Freeze frame={21}>{video}</Freeze> : video;
  return (
    <AbsoluteFill>
      {/* blurred self-fill */}
      <AbsoluteFill style={{filter: 'blur(40px) brightness(0.55)', transform: 'scale(1.15)'}}>
        <div style={{position: 'absolute', left: (1080 - 3413) / 2, top: 0, width: 3413, height: 1920}}>{body}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: BOX_TOP, left: 0, width: 1080, height: BOX_H, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left, top: (BOX_H - h) / 2, width: w, height: h, filter: isFreeze ? 'brightness(0.6)' : undefined, transform: isFreeze ? 'scale(1.05)' : undefined}}>{body}</div>
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
const Pointer: React.FC<{x: number; y: number}> = ({x, y}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f * 0.85) * 10; const s = interpolate(f, [0, 3, 5], [0.4, 1.12, 1], clamp);
  return (
    <svg width={170} height={170} viewBox="0 0 100 100" style={{position: 'absolute', left: x - 85, top: y - 170 + bob, transform: `scale(${s})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.6))'}}>
      <path d="M50 96 L14 50 L36 50 L36 6 L64 6 L64 50 L86 50 Z" fill={C.red} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};
const Circle: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
  const f = useCurrentFrame(); const len = 2 * Math.PI * r;
  const p = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.9} fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform={`rotate(-80 ${x} ${y})`} style={{filter: 'drop-shadow(0 0 6px rgba(0,0,0,.7))'}} />
    </svg>
  );
};
const Spotlight: React.FC<{x: number; y: number; dur: number}> = ({x, y, dur}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 3, dur - 3, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity: a, background: `radial-gradient(ellipse 300px 340px at ${x}px ${y}px, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)`}} />;
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

export const TEST_EDIT_FRAMES = edl.total;
export const TestEdit: React.FC = () => {
  const f = useCurrentFrame();
  const [sx, sy] = shakeAt(f);
  const gray = interpolate(f, [369, 372, 410, 435], [0, 1, 1, 0], clamp);
  const c5 = shot('c5');
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${sx || sy ? 1.03 : 1})`, filter: gray ? `grayscale(${gray})` : undefined}}>
        {edl.shots.map((s) => <Sequence key={s.id} from={s.from} durationInFrames={s.dur} layout="none"><Shot s={s} /></Sequence>)}
        <Sequence from={c5.from} durationInFrames={c5.dur}><Spotlight x={590} y={470} dur={c5.dur} /></Sequence>
      </AbsoluteFill>
      {/* graphics */}
      <Sequence from={0} durationInFrames={33}><Pointer x={540} y={420} /></Sequence>
      <Sequence from={c5.from + 6} durationInFrames={c5.dur - 6}><Circle x={590} y={470} r={150} /></Sequence>
      <Sequence from={910} durationInFrames={54}><Sticker src="emoji/2764-fe0f-200d-1fa79.png" x={540} y={760} size={330} dur={54} /></Sequence>
      {CAPS.map((c, i) => <Sequence key={i} from={c.from} durationInFrames={c.to - c.from}><Caption lines={c.lines} y={c.y ?? 1150} size={c.size} italic={c.italic} mode={c.mode} dur={c.to - c.from} /></Sequence>)}
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
