// Shared parts for the Edit3 clips (kinetic type + story graphics + compositing). Each clip in src/e3/ builds
// its own scenes, palette, fonts, transitions and sound on top of these; only the plumbing is shared.
// See vault/02 Style Guide/Edit3 kinetic storytelling compositing.md.
import type {CSSProperties, ReactNode} from 'react';
import {loadFont} from '@remotion/fonts';
import {
  AbsoluteFill, Audio, Easing, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
} from 'remotion';
import {SANS, SERIF} from '../mgFonts';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const SRC_W = 1920;
export const SRC_H = 1080;
export const f = (ms: number) => Math.round((ms / 1000) * FPS);
export {SANS, SERIF};

// ---- fonts (public/fonts, fontsource) ---------------------------------------------------------------
const FONTS: [string, string, string, string?][] = [
  ['Allura', 'allura-400.woff2', '400'], ['Anton', 'anton-400-normal.woff2', '400'], ['Caveat', 'caveat-700-normal.woff2', '700'],
  ['Permanent Marker', 'permanent-marker-400-normal.woff2', '400'], ['Playfair Display', 'playfair-display-800-normal.woff2', '800'],
  ['Playfair Display', 'playfair-display-700-italic.woff2', '700', 'italic'], ['Courier Prime', 'courier-prime-700-normal.woff2', '700'],
  ['Archivo Black', 'archivo-black-400-normal.woff2', '400'], ['Cormorant Garamond', 'cormorant-garamond-700-normal.woff2', '700'],
  ['Cormorant Garamond', 'cormorant-garamond-700-italic.woff2', '700', 'italic'], ['Bungee', 'bungee-400-normal.woff2', '400'],
  ['VT323', 'vt323-400-normal.woff2', '400'], ['Space Grotesk', 'space-grotesk-700-normal.woff2', '700'],
  ['Rubik Glitch', 'rubik-glitch-400-normal.woff2', '400'], ['Oswald', 'oswald-700-normal.woff2', '700'],
  ['Space Mono', 'space-mono-700-normal.woff2', '700'], ['Unbounded', 'unbounded-800-normal.woff2', '800'],
];
FONTS.forEach(([family, file, weight, style]) => loadFont({family, url: staticFile(`fonts/${file}`), weight, style: style ?? 'normal'}));

// ---- easing helpers ---------------------------------------------------------------------------------
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (o: number, a: number, d: number, e = Easing.out(Easing.cubic)) => interpolate(o - a, [0, d], [0, 1], {...clamp, easing: e});
export const pop = (o: number, at: number, damping = 12, stiffness = 210) => spring({frame: f(o - at), fps: FPS, config: {damping, stiffness}});
export type Land = 'slam' | 'up' | 'down' | 'left' | 'right' | 'zoom' | 'flip';
// a word arriving on its beat
export const land = (o: number, at: number, kind: Land = 'up', d?: number): CSSProperties => {
  if (o < at) return {opacity: 0};
  const p = ease(o, at, d ?? (kind === 'slam' ? 160 : 280));
  const t = {
    slam: `scale(${1.9 - 0.9 * p})`, up: `translateY(${(1 - p) * 50}px) scale(${1.08 - 0.08 * p})`, down: `translateY(${(p - 1) * 60}px)`,
    left: `translateX(${(1 - p) * -170}px)`, right: `translateX(${(1 - p) * 170}px)`, zoom: `scale(${0.3 + 0.7 * p})`,
    flip: `perspective(800px) rotateX(${(1 - p) * 90}deg)`,
  }[kind];
  return {opacity: Math.min(1, p * 1.6), filter: `blur(${(1 - p) * 16}px)`, transform: t};
};

// ---- timeline: [srcFrom, srcTo, holdMs?] in play order; hold freezes the last frame -----------------------
export type Seg = [number, number] | [number, number, number];
export const timeline = (segs: Seg[]) => {
  const segOut: number[] = [];
  let t = 0;
  for (const s of segs) { segOut.push(t); t += s[1] - s[0] + (s[2] ?? 0); }
  const total = t;
  const srcAt = (o: number) => {
    for (let i = segs.length - 1; i >= 0; i--) if (o >= segOut[i]) return Math.min(segs[i][1] - 1, segs[i][0] + o - segOut[i]);
    return segs[0][0];
  };
  const out = (src: number) => {
    const i = segs.findIndex(([a, b]) => src >= a && src < b);
    return i < 0 ? 0 : segOut[i] + src - segs[i][0];
  };
  const playing = (o: number) => segs.some((s, i) => o >= segOut[i] && o < segOut[i] + s[1] - s[0]);
  return {segs, segOut, total, srcAt, out, playing};
};
export type TL = ReturnType<typeof timeline>;

// ---- face cam: crop follows only the person talking; person mattes for text behind them ----------------------
export type Seat = 'L' | 'M' | 'R' | 'W';
export type Track = {stepMs: number; fromMs: number} & Partial<Record<'L' | 'M' | 'R', number[][]>>;
export type Matte = {src: [number, number]; dir: string; n: number; rect: [number, number, number, number]};
export type CamCfg = {
  src: string; tl: TL; track: Track; who: (src: number) => Seat; mattes?: Matte[]; grade: string;
  baseH?: number; wideX?: number; zoom?: (o: number) => number; faceY?: number | ((o: number) => number);
};
const faceAt = (tr: Track, who: 'L' | 'M' | 'R', src: number) => {
  const arr = tr[who]!;
  const i = (src - tr.fromMs) / tr.stepMs;
  const a = arr[Math.max(0, Math.min(arr.length - 1, Math.floor(i)))];
  const b = arr[Math.max(0, Math.min(arr.length - 1, Math.floor(i) + 1))];
  const t = Math.min(1, Math.max(0, i - Math.floor(i)));
  return {x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t};
};
export const camRect = (c: CamCfg, o: number) => {
  const src = c.tl.srcAt(Math.min(o, c.tl.total - 1));
  const who = c.who(src);
  const z = c.zoom ? c.zoom(o) : 1;
  let hs = (c.baseH ?? 800) / z;
  let face = {x: c.wideX ?? 960, y: 540};
  if (who === 'W') hs = Math.min(SRC_H, 1080 / z);
  else face = faceAt(c.track, who, src);
  const ws = (hs * W) / H;
  const x0 = Math.min(Math.max(face.x - ws / 2, 0), SRC_W - ws);
  const fy = typeof c.faceY === 'function' ? c.faceY(o) : c.faceY ?? 0.42;
  const y0 = Math.min(Math.max(face.y - hs * fy, 0), SRC_H - hs);
  return {src, x0, y0, k: W / ws};
};
export const Cam = ({c, o, behind, blur = 0, style}: {c: CamCfg; o: number; behind?: ReactNode; blur?: number; style?: CSSProperties}) => {
  const {src, x0, y0, k} = camRect(c, o);
  const m = c.mattes?.find((q) => src >= q.src[0] && src < q.src[1]);
  const mi = m ? Math.min(m.n, Math.max(1, Math.floor(((src - m.src[0]) / 1000) * 30) + 1)) : 0;
  const {segs, segOut} = c.tl;
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: blur ? `blur(${blur}px) brightness(${1 - 0.5 * Math.min(1, blur / 16)})` : undefined, ...style}}>
      <div style={{position: 'absolute', left: -x0 * k, top: -y0 * k, width: SRC_W * k, height: SRC_H * k, filter: c.grade}}>
        {segs.map(([a, b, hold], i) => (
          <Sequence key={i} from={f(segOut[i])} durationInFrames={f(segOut[i] + b - a + (hold ?? 0)) - f(segOut[i])} layout="none">
            <Sequence durationInFrames={f(segOut[i] + b - a) - f(segOut[i])} layout="none">
              <OffthreadVideo src={staticFile(c.src)} muted trimBefore={f(a)} style={{width: '100%', height: '100%'}} />
            </Sequence>
            {hold ? <Sequence from={f(segOut[i] + b - a) - f(segOut[i])} layout="none">
              <Freeze frame={0}><OffthreadVideo src={staticFile(c.src)} muted trimBefore={f(b - 40)} style={{width: '100%', height: '100%'}} /></Freeze>
            </Sequence> : null}
          </Sequence>
        ))}
      </div>
      {behind}
      {m && <Img src={staticFile(`${m.dir}/${String(mi).padStart(4, '0')}.png`)} style={{position: 'absolute',
        left: (m.rect[0] - x0) * k, top: (m.rect[1] - y0) * k, width: m.rect[2] * k, height: m.rect[3] * k, filter: c.grade}} />}
    </AbsoluteFill>
  );
};

// ---- camera moves: punch-ins, shake, transition smear --------------------------------------------------------
export const punchAt = (punches: [number, number, number][], o: number) =>
  punches.reduce((z, [a, b, k]) => z * (1 + (k - 1) * Math.min(ease(o, a, 90), 1 - ease(o, b, 150))), 1);
export const shakeAt = (shakes: [number, number][], o: number) => shakes.reduce((s, [t, a]) => {
  if (o < t || o > t + 500) return s;
  const k = a * Math.exp(-(o - t) / 110);
  return {x: s.x + k * Math.sin(o * 0.11 + t), y: s.y + k * Math.cos(o * 0.087 + t)};
}, {x: 0, y: 0});
export type Whip = 'x' | 'y' | 'zoom' | 'spin';
// transform + blur for the 200 ms after each cut
export const whipAt = (cuts: number[], o: number, mode: Whip | ((i: number) => Whip) = 'x', d = 200): {transform: string; blur: number} => {
  const i = cuts.findIndex((t) => o >= t && o < t + d);
  if (i < 0) return {transform: '', blur: 0};
  const p = 1 - ease(o, cuts[i], d);
  const m = typeof mode === 'function' ? mode(i) : mode;
  const dir = i % 2 ? -1 : 1;
  const tr = {x: `translateX(${p * 70 * dir}px)`, y: `translateY(${p * 90 * dir}px)`, zoom: `scale(${1 + p * 0.18})`, spin: `rotate(${p * 6 * dir}deg) scale(${1 + p * 0.1})`}[m];
  return {transform: tr, blur: p * 20};
};

// ---- captions: one fixed spot, ≤3 words, keyword colour ---------------------------------------------------------
export type Cap = [number, string, string?, string?]; // at, text, key, key colour
export const Captions = ({o, caps, off = [], top = 1560, style, keyColor = '#FFD84D', anim = 'pop', box}: {
  o: number; caps: Cap[]; off?: [number, number][]; top?: number; style: CSSProperties; keyColor?: string; anim?: 'pop' | 'type' | 'rise'; box?: CSSProperties;
}) => {
  if (off.some(([a, b]) => o >= a && o < b)) return null;
  let i = -1;
  caps.forEach(([t], j) => { if (o >= t) i = j; });
  if (i < 0) return null;
  const [t, text, key, kc] = caps[i];
  const s = pop(o, t, 11, 300);
  const shown = anim === 'type' ? text.slice(0, Math.max(1, Math.ceil((o - t) / 28))) : text;
  const parts = key ? shown.split(key) : [shown];
  const tr = anim === 'rise' ? `translateY(${(1 - ease(o, t, 160)) * 30}px)` : anim === 'pop' ? `scale(${0.8 + 0.2 * s})` : '';
  return <div style={{position: 'absolute', top, width: W, textAlign: 'center', transform: tr, opacity: anim === 'rise' ? ease(o, t, 120) : 1, ...style}}>
    <span style={box}>{parts.map((p, j) => <span key={j}>{p}{j < parts.length - 1 && <span style={{color: kc ?? keyColor}}>{key}</span>}</span>)}</span>
  </div>;
};

// ---- sound ---------------------------------------------------------------------------------------------------------
// peak = ms into the file where the hit is, so the hit lands on `at`. No bass-boosted booms (user: too loud).
export const PEAK: Record<string, number> = {
  'fast-whoosh': 550, 'mg-whoosh': 780, 'mg-swoosh': 0, 'mg-swoosh2': 0, 'mg-click': 300, 'mg-boom': 290, '808-boom': 120,
  'ding-2': 200, 'ding': 100, 'mg-shimmer': 700, 'camera-shutter': 30, 'pen-scribble': 0, 'phone-buzz': 0, 'keyboard-typing': 0,
  'cha-ching': 100, 'crowd-cheer': 300, 'record-scratch': 50, 'anime-wow': 200, 'huh-cat': 100, 'error': 50, 'rizz-sound-effect': 100,
  'whoosh': 300, 'taco-bell-bong': 50, 'crickets': 0, 'air-horn': 50, 'spongebob-boowomp': 50, 'cinematic-suspense-riser': 6390,
};
export type Sfx = {file: string; at: number; vol: number; maxMs?: number};
export const sfx = (file: string, at: number, vol: number, maxMs?: number): Sfx => ({file, at, vol, maxMs});
export const SfxTrack = ({list}: {list: Sfx[]}) => <>{list.map((x, i) => {
  const start = x.at - (PEAK[x.file] ?? 0);
  const trim = Math.max(0, -start);
  return <Sequence key={i} from={f(start + trim)} durationInFrames={x.maxMs ? f(x.maxMs) : undefined}>
    <Audio src={staticFile(`sfx/${x.file}.mp3`)} trimBefore={f(trim)} volume={(fr) => x.vol * (x.maxMs ? Math.min(1, (f(x.maxMs) - fr) / 4) : 1)} />
  </Sequence>;
})}</>;
export const SpeechTrack = ({src, tl, gain = 1.05}: {src: string; tl: TL; gain?: number}) => <>{tl.segs.map(([a, b], i) => (
  <Sequence key={i} from={f(tl.segOut[i])} durationInFrames={f(tl.segOut[i] + b - a) - f(tl.segOut[i])}>
    <Audio src={staticFile(src)} trimBefore={f(a)} volume={(fr) => Math.min(1, (fr + 1) / 2, (f(b - a) - fr) / 2) * gain} />
  </Sequence>
))}</>;
// music bed: songFrom = song ms playing at out 0; level(o) gives the volume
export const Music = ({file, songFrom, level, loop}: {file: string; songFrom: number; level: (o: number) => number; loop?: boolean}) => (
  <Audio src={staticFile(`music/${file}`)} trimBefore={f(songFrom)} loop={loop} volume={(fr) => level((fr / FPS) * 1000)} />
);

// ---- finishing layers ----------------------------------------------------------------------------------------------
export const Grain = ({frame, opacity = 0.08}: {frame: number; opacity?: number}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <filter id="kgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 30} /></filter>
    <rect width={W} height={H} filter="url(#kgrain)" />
  </svg>
);
export const Vignette = ({color = '4,4,12', strength = 0.7}: {color?: string; strength?: number}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, transparent 48%, rgba(${color},${strength}) 100%)`, pointerEvents: 'none'}} />
);
export const flashAt = (list: [number, number][], o: number) => Math.max(0, ...list.map(([t, a]) => interpolate(o - t, [0, 30, 140], [0, a, 0], clamp)));

// ---- small graphics ------------------------------------------------------------------------------------------------
export const Emoji = ({code, size, style}: {code: string; size: number; style?: CSSProperties}) => (
  <Img src={staticFile(`emoji-ios/${code}.png`)} style={{position: 'absolute', width: size, height: size, ...style}} />
);
export const Sparkle = ({x, y, s, o, at, color = '#FFF6D0', glow = '#F5C84C'}: {x: number; y: number; s: number; o: number; at: number; color?: string; glow?: string}) => {
  if (o < at) return null;
  const p = Math.max(0, Math.sin(((o - at) / 420) * Math.PI));
  return <svg width={s} height={s} viewBox="-10 -10 20 20" style={{position: 'absolute', left: x - s / 2, top: y - s / 2, opacity: p,
    transform: `scale(${0.4 + 0.8 * p}) rotate(${(o - at) / 8}deg)`}}>
    <path d="M0,-10 Q1,-1 10,0 Q1,1 0,10 Q-1,1 -10,0 Q-1,-1 0,-10Z" fill={color} style={{filter: `drop-shadow(0 0 4px ${glow})`}} /></svg>;
};
// handwriting reveal: SVG text forced to a width, revealed left to right
export const Written = ({text, w, size, p, family = 'Allura', fill = '#F5C84C', style, stroke}: {
  text: string; w: number; size: number; p: number; family?: string; fill?: string; style?: CSSProperties; stroke?: string}) => {
  const h = size * 1.3;
  const id = `w${text.replace(/\W/g, '')}${w}${size}`;
  return <svg width={w} height={h} style={{overflow: 'visible', ...style}}>
    <defs><clipPath id={id}><rect x={-20} y={-h} width={(w + 40) * p} height={h * 3} /></clipPath></defs>
    <text x={0} y={size} textLength={w} lengthAdjust="spacingAndGlyphs" fontFamily={family} fontSize={size} fill={fill} clipPath={`url(#${id})`}
      stroke={stroke} strokeWidth={stroke ? 2 : 0}>{text}</text>
  </svg>;
};
// a path drawn on (stroke-dashoffset); len = rough path length
export const Draw = ({d, p, color, width = 10, dash, len = 2000, glow}: {d: string; p: number; color: string; width?: number; dash?: string; len?: number; glow?: string}) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
    strokeDasharray={dash ?? len} strokeDashoffset={dash ? undefined : len * (1 - p)}
    style={{filter: glow ? `drop-shadow(0 0 10px ${glow})` : undefined, opacity: dash ? Math.min(1, p * 3) : 1}} />
);

// person mattes made for these clips (src/e3/mattes.json, from scripts/person_matte.py)
import MATTES from './mattes.json';
export const mattesFor = (clip: string): Matte[] => Object.entries(MATTES as unknown as Record<string, Matte>)
  .filter(([k]) => k.startsWith(`${clip}/`)).map(([, v]) => v);
