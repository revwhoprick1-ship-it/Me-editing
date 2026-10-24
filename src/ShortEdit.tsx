import {loadFont} from '@remotion/fonts';
import type {CSSProperties} from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {
  AURA, CAPTIONS, CUTS, HOOK, LAUGH, MUSIC, PUNCH, SFX, SHOTS, SPEECH, YELLOW,
  type CaptionGroup, type Shot,
} from './edit';

const fontFamily = 'Montserrat';
loadFont({family: fontFamily, url: staticFile('Montserrat-Black.woff2'), weight: '800'});

export const FPS = 30;
const SRC_W = 1920;
const SRC_H = 1080;
const OUT_W = 1080;
const OUT_H = 1920;
// Height of the wide shot in the stacked layout (full source width).
const STACK_TOP = Math.round((OUT_W * SRC_H) / SRC_W);
const CAPTION_Y = 1130;

const f = (ms: number) => Math.round((ms / 1000) * FPS);

// ---- source time <-> output time ---------------------------------------
const cutStarts = CUTS.reduce<number[]>((acc, [a, b], i) => [...acc, i === 0 ? 0 : acc[i - 1] + (CUTS[i - 1][1] - CUTS[i - 1][0])], []);
export const OUT_MS = CUTS.reduce((t, [a, b]) => t + b - a, 0);

// Output ms for a source ms, or null if that moment was cut.
const outMs = (src: number): number | null => {
  for (let i = 0; i < CUTS.length; i++) {
    const [a, b] = CUTS[i];
    if (src >= a && src <= b) return cutStarts[i] + src - a;
  }
  return null;
};
const srcMs = (out: number): number => {
  for (let i = CUTS.length - 1; i >= 0; i--) {
    if (out >= cutStarts[i]) return CUTS[i][0] + out - cutStarts[i];
  }
  return out;
};
// Output frame range for a source range (clipped to what survives the cuts).
const outRange = (from: number, to: number) => {
  const a = outMs(from) ?? outMs(CUTS.find(([s]) => s > from)?.[0] ?? from);
  const b = outMs(to) ?? outMs(CUTS.filter(([, e]) => e < to).pop()?.[1] ?? to);
  if (a === null || b === null || b <= a) return null;
  return {from: f(a), dur: Math.max(1, f(b) - f(a))};
};

// ---- text ----------------------------------------------------------------
const glow = (color: string) =>
  `0 0 10px ${color}cc, 0 0 26px ${color}88, 0 4px 10px rgba(0,0,0,0.55)`;

const textStyle: CSSProperties = {
  fontFamily, fontWeight: 800, textTransform: 'uppercase', textAlign: 'center',
  color: 'white', lineHeight: 1.12,
};

const emojiSrc = (code: string) => staticFile(`emoji-ios/${code}.png`);

// ---- video layouts -------------------------------------------------------
// Shows the region {x, y, h} of the source so it fills a boxW x boxH box.
const CropVideo = ({src, trim, x, y, h, boxW, boxH, style}: {
  src: string; trim: number; x: number; y: number; h: number; boxW: number; boxH: number; style?: CSSProperties;
}) => {
  const k = boxH / h;
  return (
    <div style={{position: 'absolute', width: boxW, height: boxH, overflow: 'hidden', ...style}}>
      <OffthreadVideo src={src} muted trimBefore={trim} style={{
        position: 'absolute', width: SRC_W * k, height: SRC_H * k,
        left: boxW / 2 - x * k, top: -y * k,
      }} />
    </div>
  );
};

const RedCircle = ({x}: {x: number}) => {
  const frame = useCurrentFrame();
  const r = 95;
  const cy = 270;
  const len = 2 * Math.PI * r;
  const draw = interpolate(frame, [4, 16], [len, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const cx = (x / SRC_W) * OUT_W;
  return (
    <svg width={OUT_W} height={STACK_TOP} style={{position: 'absolute', top: 0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF2A2A" strokeWidth={7}
        strokeDasharray={len} strokeDashoffset={draw} transform={`rotate(-90 ${cx} ${cy})`}
        style={{filter: 'drop-shadow(0 0 6px #ff0000aa)'}} />
    </svg>
  );
};

const ShotView = ({shot, src, trim}: {shot: Shot; src: string; trim: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Slow push-in inside every shot.
  const drift = interpolate(frame, [0, 120], [1, 1.06], {extrapolateRight: 'clamp'});

  if (shot.kind === 'wide') {
    const w = OUT_W * 1.2;
    return (
      <AbsoluteFill>
        <OffthreadVideo src={src} muted trimBefore={trim} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'blur(40px) brightness(0.55)', transform: 'scale(1.2)',
        }} />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <OffthreadVideo src={src} muted trimBefore={trim} style={{
            width: w, height: (w * SRC_H) / SRC_W, transform: `scale(${drift})`,
          }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  if (shot.kind === 'stack') {
    return (
      <AbsoluteFill>
        <OffthreadVideo src={src} muted trimBefore={trim} style={{position: 'absolute', top: 0, width: OUT_W, height: STACK_TOP}} />
        {shot.circleX !== undefined && <RedCircle x={shot.circleX} />}
        <CropVideo src={src} trim={trim} x={shot.x} y={shot.y} h={shot.h} boxW={OUT_W} boxH={OUT_H - STACK_TOP}
          style={{top: STACK_TOP, transform: `scale(${drift})`, transformOrigin: 'center top'}} />
        <div style={{position: 'absolute', top: STACK_TOP - 3, width: OUT_W, height: 6, background: 'black'}} />
      </AbsoluteFill>
    );
  }

  const bw = shot.kind === 'bw';
  const punch = bw ? interpolate(spring({frame, fps, config: {damping: 200}}), [0, 1], [1.3, 1.12]) : drift;
  return (
    <AbsoluteFill style={{transform: `scale(${punch})`}}>
      <CropVideo src={src} trim={trim} x={shot.x} y={shot.y} h={shot.h} boxW={OUT_W} boxH={OUT_H}
        style={bw ? {filter: 'grayscale(1) contrast(1.35) brightness(0.85)'} : undefined} />
    </AbsoluteFill>
  );
};

// ---- captions ------------------------------------------------------------
// Words appear as they're spoken (Ref A); keywords glow in their color.
const Caption = ({c}: {c: CaptionGroup}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = c.words[0].at;
  const nowSrc = start + (frame / fps) * 1000;
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 240}});
  const size = c.big ? 92 : c.action ? 58 : 74;

  return (
    <AbsoluteFill style={{alignItems: 'center', top: CAPTION_Y - (c.emoji ? 150 : 0)}}>
      {c.emoji && (
        <Img src={emojiSrc(c.emoji)} style={{
          width: 128, height: 128, marginBottom: 18,
          transform: `scale(${pop}) rotate(${interpolate(pop, [0, 1], [-25, 0])}deg) translateY(${Math.sin(frame / 5) * 5}px)`,
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
        }} />
      )}
      <div style={{...textStyle, fontSize: size, padding: '0 70px',
        transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`}}>
        {c.words.map((w, i) => {
          const said = nowSrc >= w.at;
          const wp = spring({frame: frame - f(w.at - start), fps, config: {damping: 10, stiffness: 320}});
          const color = w.color ?? 'white';
          return (
            <span key={i} style={{
              display: 'inline-block', margin: '0 0.22em', color,
              textShadow: glow(color === 'white' ? '#ffffff' : color),
              opacity: said ? 1 : 0,
              transform: said ? `scale(${interpolate(wp, [0, 1], [1.25, 1])})` : 'none',
            }}>{w.text}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Hook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const twistFrame = f(outMs(HOOK.twistAt)!);
  const twisted = frame >= twistFrame;
  const enter = spring({frame: twisted ? frame - twistFrame : frame, fps, config: {damping: 12}});
  const color = twisted ? '#FF4D4D' : YELLOW;
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 120}}>
      <div style={{
        ...textStyle, fontSize: twisted ? 60 : 50, color, textShadow: glow(color), padding: '0 60px',
        display: 'flex', alignItems: 'center', gap: 14,
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
      }}>
        {twisted ? HOOK.twist : HOOK.text}
        {twisted && <Img src={emojiSrc(HOOK.twistEmoji)} style={{width: 72, height: 72}} />}
      </div>
    </AbsoluteFill>
  );
};

// ---- effects -------------------------------------------------------------
const Bokeh = ({count, seed}: {count: number; seed: string}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: count}).map((_, i) => {
        const size = 14 + random(`${seed}s${i}`) * 34;
        const hue = random(`${seed}h${i}`) > 0.5 ? '#FFD84D' : '#FF9A3C';
        return (
          <div key={i} style={{
            position: 'absolute', width: size, height: size, borderRadius: '50%', background: hue,
            left: random(`${seed}x${i}`) * OUT_W,
            top: random(`${seed}y${i}`) * OUT_H - frame * (1 + random(`${seed}v${i}`) * 3),
            opacity: 0.55 + 0.4 * Math.sin(frame / 4 + i), filter: 'blur(2px)',
            boxShadow: `0 0 18px ${hue}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const FloatingEmoji = ({emoji, count, seed}: {emoji: string[]; count: number; seed: string}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: count}).map((_, i) => {
        const t = Math.max(0, frame - random(`${seed}d${i}`) * 24);
        const size = 80 + random(`${seed}s${i}`) * 70;
        return (
          <Img key={i} src={emojiSrc(emoji[i % emoji.length])} style={{
            position: 'absolute', width: size, height: size,
            left: random(`${seed}x${i}`) * OUT_W - size / 2 + Math.sin(t / 6 + i) * 30,
            top: OUT_H - t * (16 + random(`${seed}v${i}`) * 10),
            opacity: t > 0 ? 1 : 0, transform: `rotate(${Math.sin(t / 8 + i) * 20}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Punchline = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 2, 16], [0.8, 0.65, 0.35], {extrapolateRight: 'clamp'});
  const pop = spring({frame, fps, config: {damping: 8, stiffness: 220}});
  const slam = spring({frame, fps, config: {damping: 9, stiffness: 300}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#1EFF3C', opacity: flash, mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{backgroundColor: '#1EFF3C', opacity: flash * 0.25}} />
      <Bokeh count={22} seed="punch" />
      <Img src={emojiSrc(PUNCH.sticker)} style={{
        position: 'absolute', width: 190, height: 190, left: OUT_W / 2 - 95, top: 190,
        transform: `scale(${interpolate(slam, [0, 1], [3, 1])}) rotate(${interpolate(slam, [0, 1], [-30, 8])}deg)`,
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.5))',
      }} />
      <AbsoluteFill style={{alignItems: 'center', top: STACK_TOP - 44}}>
        <div style={{...textStyle, fontSize: 52, color: YELLOW, textShadow: glow(YELLOW), transform: `scale(${pop})`}}>
          {PUNCH.label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Aura = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 9, stiffness: 260}});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 520, background: 'radial-gradient(circle, transparent 45%, rgba(0,0,0,0.7))'}}>
      <Img src={emojiSrc(AURA.emoji)} style={{width: 150, height: 150, transform: `scale(${pop})`}} />
      <div style={{...textStyle, fontSize: 84, color: '#FF3B3B', textShadow: glow('#FF3B3B'), transform: `scale(${pop})`}}>
        {AURA.text}
      </div>
    </AbsoluteFill>
  );
};

// Shakes its children for a few frames (vine boom hit).
const Shake = ({at, children}: {at: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const amp = t >= 0 && t < 8 ? (8 - t) * 3 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(t * 2.7) * amp}px, ${Math.cos(t * 3.3) * amp}px)`}}>
      {children}
    </AbsoluteFill>
  );
};

// ---- composition ---------------------------------------------------------
const isSpeech = (src: number) => SPEECH.some(([a, b]) => src >= a - 150 && src <= b + 150);

export const ShortEdit = ({src}: {src: string}) => {
  const video = staticFile(src);

  // One piece per (kept range x shot) so each plays the right source moment.
  const pieces = CUTS.flatMap(([a, b]) =>
    SHOTS.map((s, i) => ({shot: s, from: Math.max(a, s.from), to: Math.min(b, SHOTS[i + 1]?.from ?? Infinity)}))
      .filter((p) => p.to > p.from));

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Shake at={f(outMs(PUNCH.at)!)}>
        {pieces.map((p, i) => {
          const r = outRange(p.from, p.to)!;
          return (
            <Sequence key={i} from={r.from} durationInFrames={r.dur}>
              <ShotView shot={p.shot} src={video} trim={f(p.from)} />
            </Sequence>
          );
        })}

        {(() => {
          const r = outRange(PUNCH.at, PUNCH.to)!;
          return <Sequence from={r.from} durationInFrames={r.dur}><Punchline /></Sequence>;
        })()}
      </Shake>

      {(() => {
        const r = outRange(AURA.at, AURA.to)!;
        return <Sequence from={r.from} durationInFrames={r.dur}><Aura /></Sequence>;
      })()}
      {(() => {
        const r = outRange(LAUGH.from, LAUGH.to)!;
        return <Sequence from={r.from} durationInFrames={r.dur}><FloatingEmoji emoji={LAUGH.emoji} count={12} seed="laugh" /></Sequence>;
      })()}

      {CAPTIONS.map((c, i) => {
        const r = outRange(c.words[0].at, c.to);
        return r && (
          <Sequence key={i} from={r.from} durationInFrames={r.dur}>
            <Caption c={c} />
          </Sequence>
        );
      })}
      <Hook />

      {/* Dialogue: one Audio per kept range, with a 2-frame fade at the joins. */}
      {CUTS.map(([a, b], i) => {
        const r = outRange(a, b)!;
        return (
          <Sequence key={`a${i}`} from={r.from} durationInFrames={r.dur}>
            <Audio src={video} trimBefore={f(a)} volume={(fr) =>
              0.85 * Math.min(1, fr / 2, (r.dur - fr) / 2)} />
          </Sequence>
        );
      })}

      {MUSIC.map((m, i) => {
        const r = outRange(m.from, m.to)!;
        return (
          <Sequence key={`m${i}`} from={r.from} durationInFrames={r.dur}>
            <Audio src={staticFile(`music/${m.file}`)} volume={(fr) => {
              const src = srcMs(((r.from + fr) / FPS) * 1000);
              const fade = Math.min(1, fr / 6, (r.dur - fr) / 3);
              return (isSpeech(src) ? m.duck : m.volume) * fade;
            }} />
          </Sequence>
        );
      })}

      {SFX.map((s, i) => {
        const o = outMs(s.at);
        if (o === null) return null;
        const from = Math.max(0, f(o - s.onset));
        return (
          <Sequence key={`s${i}`} from={from} durationInFrames={s.maxMs ? f(s.maxMs) : undefined}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
