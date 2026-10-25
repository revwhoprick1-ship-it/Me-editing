import {loadFont} from '@remotion/fonts';
import type {CSSProperties} from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {
  ACTIONS, AURA, CAPTIONS, CUTOUTS, CUTS, HOOK, LAUGH, MUSIC, PUNCH, SFX, SHOTS, SPEECH, TRACK, WSPEED, YELLOW,
  type CaptionGroup, type Shot, type Sfx,
} from './activePod';

const fontFamily = 'Montserrat';
loadFont({family: fontFamily, url: staticFile('Montserrat-Black.woff2'), weight: '800'});

export const FPS = 30;
const SRC_W = 1920;
const SRC_H = 1080;
const OUT_W = 1080;
const OUT_H = 1920;
// Height of the wide shot in the stacked layout (full source width).
const STACK_TOP = Math.round((OUT_W * SRC_H) / SRC_W);
// Podcast layout (TpwR9FMWQg4): black bars, video in a box, plain caption on the top bar.
const BOX_TOP = 390;
const BOX_H = 1150;
// Source y of the hosts' faces (centre of the close-up under the stacked wide shot).
const FACE_Y = 470;

export const f = (ms: number) => Math.round((ms / 1000) * FPS);

// ---- source time <-> output time ---------------------------------------
const cutStarts = CUTS.reduce<number[]>((acc, [a, b], i) => [...acc, i === 0 ? 0 : acc[i - 1] + (CUTS[i - 1][1] - CUTS[i - 1][0])], []);
export const OUT_MS = CUTS.reduce((t, [a, b]) => t + b - a, 0);

// Output ms for a source ms, or null if that moment was cut.
export const outMs = (src: number): number | null => {
  for (let i = 0; i < CUTS.length; i++) {
    const [a, b] = CUTS[i];
    if (src >= a && src <= b) return cutStarts[i] + src - a;
  }
  return null;
};
export const srcMs = (out: number): number => {
  for (let i = CUTS.length - 1; i >= 0; i--) {
    if (out >= cutStarts[i]) return CUTS[i][0] + out - cutStarts[i];
  }
  return out;
};
// Output frame range for a source range (clipped to what survives the cuts).
export const outRange = (from: number, to: number) => {
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
  const half = boxW / k / 2;
  x = Math.min(Math.max(x, half), SRC_W - half);
  y = Math.min(Math.max(y, 0), SRC_H - h);
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

// Tracked face [x, y] of a seat at a source ms (null when there's no track).
const faceAt = (who: Shot['who'], ms: number): [number, number] | null => {
  const tr = who && TRACK ? TRACK[who] : undefined;
  if (!TRACK || !tr || !tr.length) return null;
  const i = (ms - TRACK.fromMs) / TRACK.stepMs;
  const a = tr[Math.max(0, Math.min(tr.length - 1, Math.floor(i)))];
  const b = tr[Math.max(0, Math.min(tr.length - 1, Math.floor(i) + 1))];
  const t = Math.min(1, Math.max(0, i - Math.floor(i)));
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

const ShotView = ({shot, src, trim, srcFrom}: {shot: Shot; src: string; trim: number; srcFrom: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Motion tracking: the crop follows the speaker's face (face sits a third of the way down).
  const face = shot.kind === 'wide' ? null : faceAt(shot.who, srcFrom + (frame / fps) * 1000);
  if (face && shot.kind !== 'wide') {
    shot = {...shot, x: face[0], y: face[1] - shot.h * (shot.kind === 'stack' ? 0.5 : 0.36)};
  }
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
        <CropVideo src={src} trim={trim} x={shot.x} y={(face ? face[1] : FACE_Y) - (shot.h * (BOX_H - STACK_TOP) / (OUT_H - STACK_TOP)) * (face ? 0.42 : 0.5)} h={shot.h * (BOX_H - STACK_TOP) / (OUT_H - STACK_TOP)} boxW={OUT_W} boxH={BOX_H - STACK_TOP}
          style={{top: STACK_TOP, transform: `scale(${drift})`, transformOrigin: 'center top'}} />
        <div style={{position: 'absolute', top: STACK_TOP - 3, width: OUT_W, height: 6, background: 'black'}} />
      </AbsoluteFill>
    );
  }

  const bw = shot.kind === 'bw';
  const punch = bw ? interpolate(spring({frame, fps, config: {damping: 200}}), [0, 1], [1.3, 1.12]) : drift;
  return (
    <AbsoluteFill style={{transform: `scale(${punch})`}}>
      <CropVideo src={src} trim={trim} x={shot.x} y={shot.y} h={shot.h} boxW={OUT_W} boxH={BOX_H}
        style={bw ? {filter: 'grayscale(1) contrast(1.35) brightness(0.85)'} : undefined} />
    </AbsoluteFill>
  );
};

// ---- captions ------------------------------------------------------------
// Words appear as they're spoken (Ref A); keywords glow in their color.
// Captions always sit in ONE place (user: don't move them around; covering a face now and then is fine).
const captionPlace = (_at: number) => ({top: BOX_TOP + Math.round(BOX_H * 0.66), emojiBelow: false});

const Caption = ({c}: {c: CaptionGroup}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = c.words[0].at;
  const nowSrc = start + (frame / fps) * 1000;
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 240}});
  const size = c.big ? 92 : c.action ? 58 : 70;
  const place = captionPlace(start);

  return (
    <AbsoluteFill style={{alignItems: 'center', top: place.top - (c.emoji && !place.emojiBelow ? 146 : 0),
      flexDirection: place.emojiBelow ? 'column-reverse' : 'column', justifyContent: 'flex-end', bottom: 'auto', height: 'auto'}}>
      {c.emoji && (
        <Img src={emojiSrc(c.emoji)} style={{
          width: 116, height: 116, marginBottom: place.emojiBelow ? 0 : 18, marginTop: place.emojiBelow ? 10 : 0,
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

// Plain sentence-case caption on the top black bar (podcast reference).
const TopCaption = () => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', height: BOX_TOP - 28}}>
    <div style={{
      fontFamily, fontWeight: 800, fontSize: 56, color: 'white', textAlign: 'center',
      padding: '0 60px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      {HOOK.text}
      <Img src={emojiSrc(HOOK.emoji)} style={{width: 64, height: 64}} />
    </div>
  </AbsoluteFill>
);

// Cut-out photos popping up from the bottom of the video box.
const Cutouts = ({images}: {images: {file: string; h: number; x: number}[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      {images.map((im, i) => {
        const pop = spring({frame: frame - i * 3, fps, config: {damping: 11, stiffness: 200}});
        return (
          <Img key={i} src={staticFile(`cutouts/${im.file}`)} style={{
            position: 'absolute', height: im.h, left: im.x, bottom: OUT_H - (BOX_TOP + BOX_H) - 40,
            transform: `translateY(${interpolate(pop, [0, 1], [400, 0])}px)`,
            filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.6))',
          }} />
        );
      })}
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
      <Img src={emojiSrc(PUNCH!.sticker)} style={{
        position: 'absolute', width: 190, height: 190, left: OUT_W / 2 - 95, top: 190,
        transform: `scale(${interpolate(slam, [0, 1], [3, 1])}) rotate(${interpolate(slam, [0, 1], [-30, 8])}deg)`,
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.5))',
      }} />
      {PUNCH!.label && <AbsoluteFill style={{alignItems: 'center', top: STACK_TOP - 44}}>
        <div style={{...textStyle, fontSize: 52, color: YELLOW, textShadow: glow(YELLOW), transform: `scale(${pop})`}}>
          {PUNCH!.label}
        </div>
      </AbsoluteFill>}
    </AbsoluteFill>
  );
};

const Aura = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 9, stiffness: 260}});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: 520, background: 'radial-gradient(circle, transparent 45%, rgba(0,0,0,0.7))'}}>
      <Img src={emojiSrc(AURA!.emoji)} style={{width: 150, height: 150, transform: `scale(${pop})`}} />
      <div style={{...textStyle, fontSize: 84, color: '#FF3B3B', textShadow: glow('#FF3B3B'), transform: `scale(${pop})`}}>
        {AURA!.text}
      </div>
    </AbsoluteFill>
  );
};

// W Speed slam (wholesome): the source is frozen here (insert_freeze.py); the frame goes gray and
// "W TREVOR ❤️‍🩹" pulses, changing colour on every beat, while the moonlight-skies lyric plays.
const WSpeedSlam = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = WSPEED!;
  const beatF = (w.beatMs / 1000) * fps;
  const beat = Math.floor(frame / beatF);
  const inBeat = frame - beat * beatF;
  const colors = ['#FF3B3B', '#3BFF5C', '#3BE8FF'];
  const color = colors[beat % 3];
  const pulse = interpolate(inBeat, [0, 3, beatF], [1.25, 1, 0.97], {extrapolateRight: 'clamp'});
  const flash = interpolate(frame, [0, 4], [0.85, 0], {extrapolateRight: 'clamp'});
  const gray = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      {/* gray overlay on the paused frame */}
      <div style={{position: 'absolute', top: BOX_TOP, width: OUT_W, height: BOX_H, opacity: gray,
        backdropFilter: 'grayscale(1) brightness(0.8)', WebkitBackdropFilter: 'grayscale(1) brightness(0.8)',
        background: 'rgba(90,90,90,0.35)'}} />
      <AbsoluteFill style={{backgroundColor: 'white', opacity: flash}} />
      <AbsoluteFill style={{top: BOX_TOP + BOX_H * 0.66, bottom: 'auto', height: 'auto', alignItems: 'center', flexDirection: 'row',
        justifyContent: 'center', gap: 18, transform: `scale(${pulse})`}}>
        <div style={{...textStyle, fontSize: 118, color, fontStyle: 'italic', textShadow: glow(color),
          WebkitTextStroke: '3px rgba(0,0,0,0.35)'}}>{w.text}</div>
        <Img src={emojiSrc('2764-fe0f-200d-1fa79')} style={{width: 120, height: 120}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// *TREVOR WALKS IN*: narrated action text, typed on word by word, name in red.
const ActionText = ({name, text}: {name: string; text: string}) => {
  const frame = useCurrentFrame();
  const words = [name, ...text.split(' ')];
  return (
    <AbsoluteFill style={{top: BOX_TOP + 70, bottom: 'auto', height: 'auto', alignItems: 'center'}}>
      <div style={{...textStyle, fontSize: 60, fontStyle: 'italic', padding: '0 60px'}}>
        {words.map((wd, i) => {
          const shown = frame >= i * 4;
          const red = i === 0;
          const tx = `${i === 0 ? '*' : ''}${wd}${i === words.length - 1 ? '*' : ''}`;
          return <span key={i} style={{opacity: shown ? 1 : 0, margin: '0 0.18em', color: red ? '#FF3B3B' : 'white',
            textShadow: glow(red ? '#FF3B3B' : '#ffffff')}}>{tx}</span>;
        })}
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
      <Shake at={PUNCH ? f(outMs(PUNCH.at)!) : -999}>
        <div style={{position: 'absolute', top: BOX_TOP, width: OUT_W, height: BOX_H, overflow: 'hidden'}}>
        {pieces.map((p, i) => {
          const r = outRange(p.from, p.to)!;
          return (
            <Sequence key={i} from={r.from} durationInFrames={r.dur}>
              <ShotView shot={p.shot} src={video} trim={f(p.from)} srcFrom={p.from} />
            </Sequence>
          );
        })}

        {PUNCH && (() => {
          const r = outRange(PUNCH.at, PUNCH.to)!;
          return <Sequence from={r.from} durationInFrames={r.dur}><Punchline /></Sequence>;
        })()}
        </div>
        {CUTOUTS.map((c, i) => {
          const r = outRange(c.from, c.to);
          return r && <Sequence key={`c${i}`} from={r.from} durationInFrames={r.dur}><Cutouts images={c.images} /></Sequence>;
        })}
      </Shake>

      {AURA && (() => {
        const r = outRange(AURA.at, AURA.to)!;
        return <Sequence from={r.from} durationInFrames={r.dur}><Aura /></Sequence>;
      })()}
      {LAUGH && (() => {
        const r = outRange(LAUGH.from, LAUGH.to)!;
        return <Sequence from={r.from} durationInFrames={r.dur}><FloatingEmoji emoji={LAUGH.emoji} count={12} seed="laugh" /></Sequence>;
      })()}

      {ACTIONS.map((a, i) => {
        const r = outRange(a.at, a.to);
        return r && <Sequence key={`act${i}`} from={r.from} durationInFrames={r.dur}><ActionText name={a.name} text={a.text} /></Sequence>;
      })}
      {WSPEED && (() => {
        const o = outMs(WSPEED.at)!;
        return <Sequence from={f(o)} durationInFrames={Math.round((WSPEED.beats * WSPEED.beatMs / 1000) * FPS)}><WSpeedSlam /></Sequence>;
      })()}

      {CAPTIONS.filter((c) => !WSPEED || c.to <= WSPEED.at || c.words[0].at >= WSPEED.at + WSPEED.beats * WSPEED.beatMs).map((c, i) => {
        const r = outRange(c.words[0].at, c.to);
        return r && (
          <Sequence key={i} from={r.from} durationInFrames={r.dur}>
            <Caption c={c} />
          </Sequence>
        );
      })}
      <TopCaption />

      <AudioMix video={video} sfx={SFX} />
    </AbsoluteFill>
  );
};

// Dialogue + music + SFX, shared by every layout.
export const AudioMix = ({video, sfx}: {video: string; sfx: Sfx[]}) => (
  <>
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
            <Audio src={staticFile(`music/${m.file}`)} trimBefore={f(m.offset ?? 0)} loop={m.loop} volume={(fr) => {
              const src = srcMs(((r.from + fr) / FPS) * 1000);
              const fade = Math.min(1, fr / 6, (r.dur - fr) / 3);
              return (isSpeech(src) ? m.duck : m.volume) * fade;
            }} />
          </Sequence>
        );
      })}

      {sfx.map((s, i) => {
        const o = outMs(s.at);
        if (o === null) return null;
        const from = Math.max(0, f(o - s.onset));
        return (
          <Sequence key={`s${i}`} from={from} durationInFrames={s.maxMs ? f(s.maxMs) : undefined}>
            <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
          </Sequence>
        );
      })}
  </>
);
