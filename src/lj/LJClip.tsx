// Love & Justice campaign clip, cut in the house style (analysis/06_master_style_guide.md).
// Data from tools/lj/build.py -> src/lj/<id>.json (all frame numbers in it are VIDEO frames of public/lj/<id>.mp4).
// Output timeline = hook | freeze (FZ frames, inserted) | main.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import c1 from './c1.json';
import c2 from './c2.json';
import c3 from './c3.json';
import c4 from './c4.json';
import c5 from './c5.json';

loadFont({family: 'Montserrat', url: staticFile('fonts/montserrat-var-normal.woff2'), weight: '100 900'});
loadFont({family: 'Montserrat', url: staticFile('fonts/montserrat-var-italic.woff2'), weight: '100 900', style: 'italic'});

type Box = number[]; // [cx, cy, w, h] in output px
type Shot = {f0: number; n: number; mode: 'split' | 'full' | 'wide'; vw?: number; cx?: number[]; panels?: {top: number[]; bottom: number[]}; face: Box[] | null};
type Cap = {f0: number; f1: number; words: {t: string; f: number; col: string | null}[]};
export type ClipData = {
  id: string; frames: number; hook: number; title: string[][]; shots: Shot[]; captions: Cap[];
  actions: {f: number; n: number; text: string}[]; washes: {f: number; color: string}[]; punches: {f: number; scale: number}[]; shakes: number[]; tension: number[][];
};
export const CLIPS: Record<string, ClipData> = {c1, c2, c3, c4, c5} as unknown as Record<string, ClipData>;

export const FZ = 27; // freeze-frame length (0.9 s)
export const outFrames = (d: ClipData) => d.frames + FZ;
const o = (d: ClipData, v: number) => (v < d.hook ? v : v + FZ); // video frame -> output frame
const C: Record<string, string> = {red: '#FF3B3B', green: '#3DFF6E', cyan: '#3DE7FF', yellow: '#FFE53D', magenta: '#FF4FD8', white: '#FFFFFF'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 1080, H = 1920;
const MUSIC = 'music/Investigations.mp3', MUSIC_M = 'lj/investigations-muffled.mp3';

const shotAtV = (d: ClipData, v: number) => d.shots.find((s) => v >= s.f0 && v < s.f0 + s.n) ?? d.shots[d.shots.length - 1];
const faceAtV = (d: ClipData, v: number) => { const s = shotAtV(d, v); return s.face ? s.face[Math.min(s.n - 1, Math.max(0, v - s.f0))] : null; };

// punch-in zoom at video frame v: eased 10-frame ramp, held to the end of the shot it starts in
const punchAt = (d: ClipData, v: number) => {
  let z = 1;
  for (const p of d.punches) {
    const s = shotAtV(d, p.f);
    if (v >= p.f && v < s.f0 + s.n) z *= interpolate(v, [p.f, p.f + 10], [1, p.scale], {...clamp, easing: Easing.inOut(Easing.cubic)});
  }
  return z;
};

// ---------- picture ----------
const Frame: React.FC<{d: ClipData; s: Shot; dim?: boolean}> = ({d, s, dim}) => {
  const f = useCurrentFrame(); const lf = Math.min(f, s.n - 1); const v = s.f0 + lf;
  const z = punchAt(d, v) * (dim ? 1.05 : 1);
  const fc = s.face?.[lf];
  const src = staticFile(`lj/${d.id}.mp4`);
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={src} trimBefore={s.f0} muted style={{position: 'absolute', ...style}} />;
  const zoomAbout = (x: number, y: number): React.CSSProperties => ({transform: `scale(${z})`, transformOrigin: `${x}px ${y}px`});
  let body: React.ReactNode;
  if (s.mode === 'split') {
    const k = W / 950;
    const panel = (name: 'top' | 'bottom', y0: number, x0: number) => {
      const zoomed = fc && (name === 'top' ? fc[1] < 960 : fc[1] >= 960);
      return (
        <div style={{position: 'absolute', left: 0, top: y0, width: W, height: 960, overflow: 'hidden'}}>
          <div style={{position: 'absolute', inset: 0, ...(zoomed ? zoomAbout(fc![0], fc![1] - y0) : {})}}>
            {vid({left: -x0 * k, top: -s.panels![name][lf] * k, width: 1920 * k, height: 1080 * k})}
          </div>
        </div>
      );
    };
    body = (<>{panel('top', 0, 0)}{panel('bottom', 960, 965)}<div style={{position: 'absolute', left: 0, top: 956, width: W, height: 8, background: 'linear-gradient(90deg,#8a6a1c,#f4d27a,#8a6a1c)'}} /></>);
  } else {
    const vw = s.vw!; const k = W / vw; const cx = s.cx![lf];
    const boxH = s.mode === 'full' ? H : 1080 * k; const top = s.mode === 'full' ? 0 : 760 - boxH / 2;
    body = (<>
      {s.mode === 'wide' && <AbsoluteFill style={{filter: 'blur(45px) brightness(0.5)', transform: 'scale(1.2)'}}>{vid({left: (W - 3413) / 2, top: 0, width: 3413, height: H})}</AbsoluteFill>}
      <div style={{position: 'absolute', left: 0, top, width: W, height: boxH, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, ...(fc ? zoomAbout(fc[0], fc[1] - top) : {transform: `scale(${z})`})}}>
          {vid({left: -(cx - vw / 2) * k, top: 0, width: 1920 * k, height: 1080 * k})}
        </div>
      </div>
    </>);
  }
  return <AbsoluteFill style={{background: '#000', filter: dim ? 'brightness(0.6)' : undefined}}>{body}</AbsoluteFill>;
};

// ---------- text ----------
const txt = (size: number, color: string, glow: boolean, italic = false, weight = 800): React.CSSProperties => ({
  fontFamily: 'Montserrat', fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, color, letterSpacing: size * 0.04, textTransform: 'uppercase',
  textShadow: `${glow ? `0 0 18px ${color}B3, 0 0 36px ${color}55,` : ''} 0 4px 10px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.9)`, whiteSpace: 'nowrap', display: 'inline-block',
});

// caption y: 55% of height unless it would cover the tracked face
const captionTop = (d: ClipData, v: number, lines = 1) => {
  const s = shotAtV(d, v); const fc = faceAtV(d, v); const h = 82 * lines;
  if (s.mode === 'split') return 960 - h / 2;
  if (s.mode === 'wide') return Math.max(1240, 760 + (1080 * W) / s.vw! / 2 + 50);
  const clear = (y: number) => !fc || fc[1] + fc[3] * 0.75 < y - 20 || fc[1] - fc[3] * 0.6 > y + h + 20;
  return [1056, 1300, 1480].find(clear) ?? 1300;
};

const Caption: React.FC<{d: ClipData; cap: Cap}> = ({d, cap}) => {
  const f = useCurrentFrame() + cap.f0; // video frame
  const lines = cap.words.reduce((n, w) => n + w.t.length, 0) > 16 ? 2 : 1;
  const y = captionTop(d, cap.f0, lines);
  const out = interpolate(f, [cap.f1 - 3, cap.f1], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', top: y, width: W, padding: '0 70px', boxSizing: 'border-box', textAlign: 'center', lineHeight: 1.12, opacity: out}}>
      {cap.words.map((w, i) => {
        const a = interpolate(f, [w.f, w.f + 3], [0, 1], clamp);
        return <span key={i} style={{...txt(72, w.col ? C[w.col] : C.white, !!w.col), marginRight: 20, opacity: a, transform: `scale(${0.9 + 0.1 * a})`, filter: `blur(${(1 - a) * 6}px)`}}>{w.t}</span>;
      })}
    </div>
  );
};

const Action: React.FC<{d: ClipData; f0: number; n: number; text: string}> = ({d, f0, n, text}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 3], [0, 1], clamp); const out = interpolate(f, [n - 3, n], [1, 0], clamp);
  const y = captionTop(d, f0) - 92;
  return <div style={{position: 'absolute', top: y, width: W, textAlign: 'center', opacity: Math.min(a, out), transform: `scale(${0.85 + 0.15 * a})`}}><span style={txt(60, C.cyan, true, true)}>{text}</span></div>;
};

// hook title: Montserrat Black 88 px, typewriter ~1 char/frame, y 25%
// title placement: above the subject's eyes over the whole hook (or above the picture box in a wide shot)
const titleTop = (d: ClipData, lines: number) => {
  const h = lines * 95; let limit = 330 + h;
  for (let v = 0; v < d.hook; v++) {
    const s = shotAtV(d, v);
    if (s.mode === 'wide') limit = Math.min(limit, 760 - (1080 * W) / s.vw! / 2 - 10);
    const fc = faceAtV(d, v); if (fc && s.mode !== 'wide') limit = Math.min(limit, fc[1] - fc[3] * 0.2 - 20);
  }
  return Math.max(70, Math.min(330, limit - h));
};
const HookTitle: React.FC<{title: string[][]; outAt: number; top: number}> = ({title, outAt, top}) => {
  const f = useCurrentFrame();
  const total = title.reduce((n, [t]) => n + t.length + 1, 0);
  const shown = Math.floor(interpolate(f, [0, total], [0, total], clamp));
  const out = interpolate(f, [outAt, outAt + 8], [1, 0], clamp);
  const size = Math.min(86, 960 / (Math.max(...title.map(([t]) => t.length)) * 0.78));
  let used = 0;
  return (
    <div style={{position: 'absolute', top, width: W, padding: '0 50px', boxSizing: 'border-box', textAlign: 'center', lineHeight: 1.1, opacity: out}}>
      {title.map(([t, col], i) => {
        const vis = Math.max(0, Math.min(t.length, shown - used)); used += t.length + 1;
        return <div key={i}><span style={txt(size, C[col ?? 'white'], !!col, false, 900)}>{t.slice(0, vis)}<span style={{opacity: 0}}>{t.slice(vis)}</span></span></div>;
      })}
    </div>
  );
};

// red pointer that rides on the tracked face (freeze frame)
const Pointer: React.FC<{face: Box}> = ({face}) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f * 0.85) * 10; const sc = interpolate(f, [0, 3, 5], [0.4, 1.12, 1], clamp);
  const S = 150; const tipX = face[0] + face[2] * 0.55 + 14 + bob, tipY = face[1];
  return (
    <svg width={S} height={S} viewBox="0 0 100 100" style={{position: 'absolute', left: tipX - S / 2, top: tipY - S, transformOrigin: '50% 100%', transform: `rotate(90deg) scale(${sc})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.6))'}}>
      <path d="M50 96 L14 50 L36 50 L36 6 L64 6 L64 50 L86 50 Z" fill={C.red} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

const Wash: React.FC<{color: string; peak: number; decay: number}> = ({color, peak, decay}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: color, mixBlendMode: 'screen', opacity: interpolate(f, [0, 2, decay], [peak, peak, 0], {...clamp, easing: Easing.out(Easing.quad)})}} />;
};
const WhiteFlash: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 4, 5, 9], [0, 1, 1, 0], clamp)}} />;
};
const EndCard: React.FC = () => {
  const f = useCurrentFrame(); const s = interpolate(f, [0, 3, 6], [0.6, 1.08, 1], clamp);
  return <div style={{position: 'absolute', top: 1640, width: W, textAlign: 'center', transform: `scale(${s})`}}><span style={{...txt(46, C.white, false, false, 800), background: C.red, padding: '12px 24px', borderRadius: 12}}>FULL EPISODE ON @HARDSCOPE</span></div>;
};

const Snd: React.FC<{at: number; src: string; vol: number; dur?: number}> = ({at, src, vol, dur = 60}) => (
  <Sequence from={at} durationInFrames={dur}><Audio src={staticFile(src)} volume={vol} /></Sequence>
);

export const LJClip: React.FC<{id: string}> = ({id}) => {
  const d = CLIPS[id]; const g = useCurrentFrame(); const N = outFrames(d);
  const src = staticFile(`lj/${id}.mp4`);
  const hookShot = shotAtV(d, d.hook - 1);
  const freezeFace = faceAtV(d, d.hook - 1);
  // shake (output frames): decaying 12-frame jitter on each shake hit
  let sx = 0, sy = 0;
  for (const v of d.shakes) { const a = o(d, v); if (g >= a && g < a + 12) { const k = 10 * (1 - (g - a) / 12); sx = Math.sin(g * 2.7) * k; sy = Math.cos(g * 3.9) * k; } }
  // music bed: open / muffled intervals in output frames
  const muffled: number[][] = [[d.hook, d.hook + FZ], ...d.tension.map(([a, b]) => [o(d, a), o(d, b)])].sort((x, y) => x[0] - y[0]);
  const bed: {a: number; b: number; m: boolean}[] = []; let cur = 0;
  for (const [a, b] of muffled) { if (a > cur) bed.push({a: cur, b: a, m: false}); bed.push({a: Math.max(a, cur), b, m: true}); cur = Math.max(cur, b); }
  if (cur < N) bed.push({a: cur, b: N, m: false});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: sx || sy ? `translate(${sx}px, ${sy}px) scale(1.03)` : undefined}}>
        {d.shots.map((s) => <Sequence key={s.f0} from={o(d, s.f0)} durationInFrames={s.n} layout="none"><Frame d={d} s={s} /></Sequence>)}
        {/* freeze frame: last hook frame held, darkened, 105% */}
        <Sequence from={d.hook} durationInFrames={FZ} layout="none"><Freeze frame={d.hook - 1 - hookShot.f0}><Frame d={d} s={hookShot} dim /></Freeze></Sequence>
      </AbsoluteFill>
      {/* captions + action captions */}
      {d.captions.map((c, i) => <Sequence key={i} from={o(d, c.f0)} durationInFrames={c.f1 - c.f0} layout="none"><Caption d={d} cap={c} /></Sequence>)}
      {d.actions.map((a, i) => <Sequence key={`a${i}`} from={o(d, a.f)} durationInFrames={a.n} layout="none"><Action d={d} f0={a.f} n={a.n} text={a.text} /></Sequence>)}
      {/* hook: title from frame 0, pointer on the freeze */}
      <Sequence from={0} durationInFrames={d.hook + FZ + 20}><HookTitle title={d.title} outAt={d.hook + FZ + 10} top={titleTop(d, d.title.length)} /></Sequence>
      {freezeFace && <Sequence from={d.hook} durationInFrames={FZ}><Pointer face={freezeFace} /></Sequence>}
      <Sequence from={d.hook + FZ - 4} durationInFrames={10}><WhiteFlash /></Sequence>
      {d.washes.map((w, i) => <Sequence key={`w${i}`} from={o(d, w.f)} durationInFrames={18}><Wash color={C[w.color]} peak={0.75} decay={15} /></Sequence>)}
      <Sequence from={N - 45}><EndCard /></Sequence>
      {/* dialogue: hook part, silence on the freeze, main part */}
      <Sequence from={0} durationInFrames={d.hook}><Audio src={src} /></Sequence>
      <Sequence from={d.hook + FZ}><Audio src={src} trimBefore={d.hook} /></Sequence>
      {/* music bed (Investigations, Kevin MacLeod, CC-BY) under dialogue; muffled on freeze + tension; lifts on the last 1.5 s */}
      {bed.map((s, i) => (
        <Sequence key={`b${i}`} from={s.a} durationInFrames={s.b - s.a}>
          <Audio src={staticFile(s.m ? MUSIC_M : MUSIC)} trimBefore={s.a} volume={(f) => (s.m ? 0.22 : s.a + f >= N - 45 ? 0.3 : 0.12)} />
        </Sequence>
      ))}
      {/* sfx */}
      <Snd at={0} src="sfx/808-boom.mp3" vol={0.5} />
      <Snd at={d.hook} src="sfx/record-scratch.mp3" vol={0.5} />
      <Snd at={d.hook + FZ - 37} src="sfx/rev-whoosh.mp3" vol={0.6} dur={40} />
      <Snd at={d.hook + FZ} src="sfx/meme-impact.mp3" vol={0.45} />
      {d.washes.map((w, i) => <React.Fragment key={`s${i}`}><Snd at={o(d, w.f)} src="sfx/ding.mp3" vol={0.35} />{w.color === 'red' && <Snd at={o(d, w.f)} src="sfx/meme-impact.mp3" vol={0.3} />}</React.Fragment>)}
      {d.actions.map((a, i) => <Snd key={`p${i}`} at={o(d, a.f)} src="sfx/jorho-pop.mp3" vol={0.35} />)}
      {d.punches.map((p, i) => <Snd key={`z${i}`} at={o(d, p.f)} src="sfx/jorho-swish.mp3" vol={0.2} />)}
    </AbsoluteFill>
  );
};
