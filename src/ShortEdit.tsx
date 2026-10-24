import {loadFont} from '@remotion/fonts';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import {CAPTIONS, HOOK, SHOTS, type CaptionGroup, type Shot} from './edit';

const fontFamily = 'Montserrat';
loadFont({family: fontFamily, url: staticFile('Montserrat-Black.woff2'), weight: '900'});

const SRC_W = 1920;
const SRC_H = 1080;
const OUT_W = 1080;
const OUT_H = 1920;

const textStyle = {
  fontFamily, fontWeight: 900, textTransform: 'uppercase' as const,
  WebkitTextStroke: '10px black', paintOrder: 'stroke' as const,
  textShadow: '0 10px 24px rgba(0,0,0,0.55)', textAlign: 'center' as const,
};

const ShotView = ({shot, src}: {shot: Shot; src: string}) => {
  const frame = useCurrentFrame();
  // Slow push-in within every shot keeps it moving between cuts.
  const drift = interpolate(frame, [0, 90], [1, 1.04], {extrapolateRight: 'clamp'});

  if (shot.wide) {
    const w = OUT_W * 1.25;
    const h = (w * SRC_H) / SRC_W;
    return (
      <AbsoluteFill>
        <OffthreadVideo src={src} muted style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'blur(40px) brightness(0.6)', transform: 'scale(1.2)',
        }} />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <OffthreadVideo src={src} muted style={{width: w, height: h, transform: `scale(${drift})`}} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const k = OUT_H / shot.h!;
  return (
    <AbsoluteFill style={{overflow: 'hidden', transform: `scale(${drift})`}}>
      <OffthreadVideo src={src} muted style={{
        position: 'absolute', width: SRC_W * k, height: SRC_H * k,
        left: OUT_W / 2 - shot.x! * k, top: -shot.y! * k,
      }} />
    </AbsoluteFill>
  );
};

const Caption = ({c}: {c: CaptionGroup}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 10, stiffness: 260}});
  const long = c.text.length > 12;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', top: '62%'}}>
      <div style={{
        ...textStyle, fontSize: long ? 96 : 120, color: c.key ?? 'white',
        padding: '0 50px', lineHeight: 1.05,
        transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])})`,
      }}>{c.text}</div>
    </AbsoluteFill>
  );
};

const Hook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 170}}>
      <div style={{
        ...textStyle, fontSize: 64, color: '#FFE600', WebkitTextStroke: '8px black',
        padding: '0 60px', transform: `translateY(${interpolate(enter, [0, 1], [-60, 0])}px)`,
        opacity: enter,
      }}>{HOOK.text}</div>
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
      {CAPTIONS.map((c, i) => (
        <Sequence key={i} from={f(c.from)} durationInFrames={Math.max(1, f(c.to) - f(c.from))}>
          <Caption c={c} />
        </Sequence>
      ))}
      <Sequence durationInFrames={f(HOOK.to)}>
        <Hook />
      </Sequence>
    </AbsoluteFill>
  );
};
