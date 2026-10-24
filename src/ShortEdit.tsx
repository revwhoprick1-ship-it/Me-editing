import {loadFont} from '@remotion/fonts';
import type {CSSProperties} from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {CAPTIONS, HOOK, LAUGH, PUNCH, SHOTS, type CaptionGroup, type Shot} from './edit';

const fontFamily = 'Montserrat';
loadFont({family: fontFamily, url: staticFile('Montserrat-Black.woff2'), weight: '900'});

const SRC_W = 1920;
const SRC_H = 1080;
const OUT_W = 1080;
const OUT_H = 1920;
// Height of the wide shot in the stacked layout (full source width).
const STACK_TOP = Math.round((OUT_W * SRC_H) / SRC_W);

const textStyle: CSSProperties = {
  fontFamily, fontWeight: 900, textTransform: 'uppercase',
  WebkitTextStroke: '9px black', paintOrder: 'stroke',
  textShadow: '0 6px 16px rgba(0,0,0,0.6)', textAlign: 'center',
};

const emojiSrc = (code: string) => staticFile(`emoji/${code}.svg`);

// Shows the region {x, y, h} of the source so it fills a boxW x boxH box.
const CropVideo = ({src, x, y, h, boxW, boxH, style}: {
  src: string; x: number; y: number; h: number; boxW: number; boxH: number; style?: CSSProperties;
}) => {
  const k = boxH / h;
  return (
    <div style={{position: 'absolute', width: boxW, height: boxH, overflow: 'hidden', ...style}}>
      <OffthreadVideo src={src} muted style={{
        position: 'absolute', width: SRC_W * k, height: SRC_H * k,
        left: boxW / 2 - x * k, top: -y * k,
      }} />
    </div>
  );
};

const ShotView = ({shot, src}: {shot: Shot; src: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Slow push-in within every shot keeps it moving between cuts.
  const drift = interpolate(frame, [0, 90], [1, 1.05], {extrapolateRight: 'clamp'});

  if (shot.kind === 'wide') {
    const w = OUT_W * 1.25;
    return (
      <AbsoluteFill>
        <OffthreadVideo src={src} muted style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'blur(40px) brightness(0.6)', transform: 'scale(1.2)',
        }} />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <OffthreadVideo src={src} muted style={{
            width: w, height: (w * SRC_H) / SRC_W, transform: `scale(${drift})`,
          }} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  if (shot.kind === 'stack') {
    return (
      <AbsoluteFill>
        <OffthreadVideo src={src} muted style={{position: 'absolute', top: 0, width: OUT_W, height: STACK_TOP}} />
        <CropVideo src={src} x={shot.x} y={shot.y} h={shot.h} boxW={OUT_W} boxH={OUT_H - STACK_TOP}
          style={{top: STACK_TOP, transform: `scale(${drift})`, transformOrigin: 'center top'}} />
        <div style={{position: 'absolute', top: STACK_TOP - 3, width: OUT_W, height: 6, background: 'black'}} />
      </AbsoluteFill>
    );
  }

  // B&W reaction: hard zoom that keeps pushing, like a meme cutaway.
  const bw = shot.kind === 'bw';
  const punch = bw ? interpolate(spring({frame, fps, config: {damping: 200}}), [0, 1], [1.25, 1.1]) : drift;
  return (
    <AbsoluteFill style={{transform: `scale(${punch})`}}>
      <CropVideo src={src} x={shot.x} y={shot.y} h={shot.h} boxW={OUT_W} boxH={OUT_H}
        style={bw ? {filter: 'grayscale(1) contrast(1.3) brightness(0.9)'} : undefined} />
    </AbsoluteFill>
  );
};

// Word-by-word captions: spoken words white, current word coloured,
// upcoming words dimmed. Emoji pops above the line.
const Caption = ({c}: {c: CaptionGroup}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = c.words[0].from;
  const nowMs = start + (frame / fps) * 1000;
  const pop = spring({frame, fps, config: {damping: 10, stiffness: 260}});
  const len = c.words.map((w) => w.text).join(' ').length;
  const size = len > 18 ? 70 : len > 10 ? 84 : 100;
  const active = c.words.findLastIndex((w) => nowMs >= w.from);
  const wordPop = spring({
    frame: frame - Math.round(((c.words[Math.max(0, active)].from - start) / 1000) * fps),
    fps, config: {damping: 9, stiffness: 300},
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', top: 1120}}>
      {c.emoji && (
        <Img src={emojiSrc(c.emoji)} style={{
          width: 130, height: 130, marginBottom: 14,
          transform: `scale(${pop}) rotate(${interpolate(pop, [0, 1], [-30, 0])}deg) translateY(${Math.sin(frame / 5) * 6}px)`,
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
        }} />
      )}
      <div style={{...textStyle, fontSize: size, padding: '0 60px', lineHeight: 1.1,
        transform: `scale(${interpolate(pop, [0, 1], [0.7, 1])})`}}>
        {c.words.map((w, i) => (
          <span key={i} style={{
            display: 'inline-block', margin: '0 0.32em',
            color: i === active ? c.color : 'white',
            opacity: i > active ? 0.35 : 1,
            transform: i === active ? `scale(${interpolate(wordPop, [0, 1], [1.18, 1.04])})` : 'none',
          }}>{w.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Hook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 150}}>
      <div style={{
        ...textStyle, fontSize: 54, color: '#FFE600', WebkitTextStroke: '7px black',
        padding: '0 60px', transform: `translateY(${interpolate(enter, [0, 1], [-60, 0])}px)`,
      }}>{HOOK}</div>
    </AbsoluteFill>
  );
};

const FloatingEmoji = ({emoji, count, seed}: {emoji: string[]; count: number; seed: string}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const delay = random(`${seed}d${i}`) * 20;
        const t = Math.max(0, frame - delay);
        const x = random(`${seed}x${i}`) * OUT_W;
        const size = 70 + random(`${seed}s${i}`) * 70;
        return (
          <Img key={i} src={emojiSrc(emoji[i % emoji.length])} style={{
            position: 'absolute', width: size, height: size,
            left: x - size / 2 + Math.sin(t / 6 + i) * 30,
            top: OUT_H - t * (14 + random(`${seed}v${i}`) * 10),
            opacity: t > 0 ? 1 : 0, transform: `rotate(${Math.sin(t / 8 + i) * 25}deg)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Punchline = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flash = interpolate(frame, [0, 3, 18], [0.75, 0.6, 0.12], {extrapolateRight: 'clamp'});
  const pop = spring({frame, fps, config: {damping: 8, stiffness: 220}});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#22FF44', opacity: flash, mixBlendMode: 'multiply'}} />
      <FloatingEmoji emoji={PUNCH.emoji} count={14} seed="punch" />
      <AbsoluteFill style={{alignItems: 'center', top: STACK_TOP - 50}}>
        <div style={{...textStyle, fontSize: 46, color: '#FFE600', padding: '0 40px', transform: `scale(${pop})`}}>{PUNCH.label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ShortEdit = ({src}: {src: string}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const f = (ms: number) => Math.round((ms / 1000) * fps);
  const video = staticFile(src);

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {SHOTS.map((shot, i) => {
        const from = f(shot.from);
        const to = i + 1 < SHOTS.length ? f(SHOTS[i + 1].from) : durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            {/* Offset into the source so each shot plays the right moment. */}
            <Sequence from={-from}>
              <ShotView shot={shot} src={video} />
            </Sequence>
          </Sequence>
        );
      })}
      {/* Audio from one continuous track so cuts never pop. */}
      <Audio src={video} />
      <Sequence from={f(PUNCH.from)} durationInFrames={f(PUNCH.to) - f(PUNCH.from)}>
        <Punchline />
      </Sequence>
      <Sequence from={f(LAUGH.from)} durationInFrames={f(LAUGH.to) - f(LAUGH.from)}>
        <FloatingEmoji emoji={LAUGH.emoji} count={10} seed="laugh" />
      </Sequence>
      {CAPTIONS.map((c, i) => {
        const from = f(c.words[0].from);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, f(c.to) - from)}>
            <Caption c={c} />
          </Sequence>
        );
      })}
      <Hook />
    </AbsoluteFill>
  );
};
