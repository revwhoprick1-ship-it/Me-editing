import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import {
  BANNER, CAPTIONS, CARD, CUTS, DIALOGUE_GAIN, HOOK_CAPTIONS, HOOK_CUT, HOOK_SFX, LAYOUTS,
  MUSIC, QUESTION, SFX, SPEECH, SRC, TRACK, TRACK_UNTIL, WHIPS,
  type Cap, type Layout, type Sfx,
} from './flagg';

const fontFamily = 'Montserrat';
loadFont({family: fontFamily, url: staticFile('Montserrat-Black.woff2'), weight: '800'});

export const FPS = 30;
const W = 1080;
const H = 1920;
const f = (ms: number) => Math.round((ms / 1000) * FPS);

// ---- timeline: hook first, then the main cuts --------------------------
type Seg = {src: [number, number]; out: number; hook: boolean};
const SEGS: Seg[] = [];
{
  let t = 0;
  for (const [i, c] of [HOOK_CUT, ...CUTS].entries()) {
    SEGS.push({src: c, out: t, hook: i === 0});
    t += c[1] - c[0];
  }
}
export const CARD_OUT_MS = SEGS.reduce((t, s) => t + s.src[1] - s.src[0], 0);

// Output ms of a source moment (main cuts, or the hook when hook=true).
const outMs = (src: number, hook = false): number | null => {
  const s = SEGS.find((g) => g.hook === hook && src >= g.src[0] && src <= g.src[1]);
  return s ? s.out + src - s.src[0] : null;
};
const segAtOut = (out: number) => [...SEGS].reverse().find((s) => out >= s.out)!;
const srcAtOut = (out: number) => {
  const s = segAtOut(out);
  return s.src[0] + out - s.out;
};
const layoutAt = (src: number): Layout =>
  [...LAYOUTS].reverse().find((l) => src >= l.from)!.layout;

// ---- shared bits -------------------------------------------------------
const glow = (c: string) => `0 0 10px ${c}cc, 0 0 26px ${c}88, 0 4px 10px rgba(0,0,0,0.6)`;
const emojiSrc = (code: string) => staticFile(`emoji-ios/${code}.png`);
const text: CSSProperties = {
  fontFamily, fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', color: 'white', lineHeight: 1.1,
};

// Reaction layout geometry: hosts cam crop scaled up on top.
const CAM = {x0: 230, x1: 890, h: 420};
const CAM_K = W / (CAM.x1 - CAM.x0);
const CAM_H = Math.round(CAM.h * CAM_K);
const bannerTop = (l: Layout) => (l === 'reaction' ? CAM_H + 10 : 427);
const captionY = (l: Layout) => (l === 'full' ? 1000 : l === 'reveal' ? 250 : CAM_H - 210);

// Motion-blur whip on the first frames of a scene (Refs D/E/F).
const Whip = ({children}: {children: ReactNode}) => {
  const frame = useCurrentFrame();
  const k = Math.max(0, 5 - frame);
  if (k === 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {[-2, -1, 0].map((g) => (
        <AbsoluteFill key={g} style={{
          transform: `translateX(${(g * 60 - 40) * k / 5}px) scale(${1 + 0.06 * k / 5})`,
          opacity: g === 0 ? 1 : 0.35, filter: `blur(${k * 2.5}px)`,
        }}>{children}</AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

const Banner = ({layout}: {layout: Layout}) => (
  <div style={{
    position: 'absolute', top: bannerTop(layout), left: 0, width: W, height: 180, background: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
  }}>
    <div style={{...text, color: 'black', fontSize: 58, lineHeight: 1.05, whiteSpace: 'pre-line'}}>
      {BANNER.map((b, i) => <span key={i} style={{color: b.color}}>{b.text}</span>)}
    </div>
  </div>
);

// Chunky red arrow with a dark shadow, pointing at (x, y), jabbing in.
const Arrow = ({x, y, from = 'right'}: {x: number; y: number; from?: 'right' | 'left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 10, stiffness: 220}});
  const jab = Math.sin(frame / 3.2) * 14 * enter;
  const dir = from === 'right' ? 1 : -1;
  const dist = 70 + (1 - enter) * 160 + jab;
  const ang = from === 'right' ? 225 : 315; // arrow points up-left / up-right
  return (
    <div style={{
      position: 'absolute', left: x + dir * dist * 0.7, top: y + dist * 0.7,
      transform: `translate(-50%, -50%) rotate(${ang}deg)`, opacity: enter,
    }}>
      <svg width={220} height={120} viewBox="0 0 220 120" style={{filter: 'drop-shadow(6px 8px 0 rgba(0,0,0,0.75))', overflow: 'visible'}}>
        <path d="M0 40 H130 V0 L220 60 L130 120 V80 H0 Z" fill="#FF1E1E" stroke="#7a0000" strokeWidth={4} />
      </svg>
    </div>
  );
};

// Red ring that follows TRACK (source px) in the reaction layout.
const TrackedCircle = ({outStartMs}: {outStartMs: number}) => {
  const frame = useCurrentFrame();
  const src = srcAtOut(outStartMs + (frame / FPS) * 1000);
  if (src > TRACK_UNTIL || src < TRACK[0].at) return null;
  const xs = TRACK.map((t) => t.at);
  const sx = interpolate(src, xs, TRACK.map((t) => t.x), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sy = interpolate(src, xs, TRACK.map((t) => t.y), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = (sx - CAM.x0) * CAM_K;
  const y = sy * CAM_K + 40;
  const r = 125;
  const len = 2 * Math.PI * r;
  const draw = interpolate(frame, [0, 10], [len, 0], {extrapolateRight: 'clamp'});
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', top: 0, left: 0}}>
        <circle cx={x} cy={y} r={r} fill="none" stroke="#FF1E1E" strokeWidth={11}
          strokeDasharray={len} strokeDashoffset={draw} transform={`rotate(-90 ${x} ${y})`}
          style={{filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,0.6))'}} />
      </svg>
      <Arrow x={x + 95} y={y + 95} />
    </>
  );
};

const TitleStack = ({top, start}: {top: number; start: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pops = [0, 6, 18].map((d) => spring({frame: frame - start - d, fps, config: {damping: 9, stiffness: 260}}));
  const lines: [string, string, number][] = [[CARD.name, 'white', 62], [CARD.parallel, '#FF3B3B', 62], [CARD.price, '#5CFF5C', 84]];
  return (
    <div style={{position: 'absolute', top, width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {lines.map(([t, c, s], i) => (
        <div key={i} style={{...text, fontSize: s, color: c, textShadow: `${glow(c === 'white' ? '#ffffff' : c)}, 0 5px 0 rgba(0,0,0,0.8)`,
          transform: `scale(${pops[i]})`}}>{t}</div>
      ))}
    </div>
  );
};

// ---- layouts -----------------------------------------------------------
const FullView = ({trim}: {trim: number}) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 150], [1, 1.05], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 60%'}}>
      <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} style={{width: W, height: H}} />
    </AbsoluteFill>
  );
};

const RevealView = ({trim}: {trim: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const z = interpolate(spring({frame, fps, config: {damping: 14, stiffness: 120}}), [0, 1], [1, 1.5]);
  const {x, y} = CARD.center;
  // Only the card cam (below the burned banner) zooms; hosts cam stays put.
  const camTop = 607;
  const sx = x + (CARD.serial.x - x) * 1.5;
  const sy = y + (CARD.serial.y - y) * 1.5;
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} style={{width: W, height: H}} />
      <div style={{position: 'absolute', top: camTop, width: W, height: H - camTop, overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: -camTop, width: W, height: H,
          transform: `scale(${z})`, transformOrigin: `${x}px ${y}px`}}>
          <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} style={{width: W, height: H}} />
        </div>
      </div>
      <Arrow x={sx} y={sy} />
      <TitleStack top={650} start={4} />
    </AbsoluteFill>
  );
};

const ReactionView = ({trim, outStartMs, showQuestion}: {trim: number; outStartMs: number; showQuestion: (frame: number) => boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardPop = spring({frame, fps, config: {damping: 12, stiffness: 160}});
  const cardH = H - (CAM_H + 200) - 250 - 40;
  const q = showQuestion(frame);
  return (
    <AbsoluteFill style={{background: 'black'}}>
      <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} style={{
        width: W, height: H, filter: 'blur(36px) brightness(0.45)', transform: 'scale(1.15)',
      }} />
      <div style={{position: 'absolute', top: 0, width: W, height: CAM_H, overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} style={{
          position: 'absolute', width: W * CAM_K, height: H * CAM_K, left: -CAM.x0 * CAM_K, top: 0,
        }} />
      </div>
      <TrackedCircle outStartMs={outStartMs} />
      {q ? <QuestionText top={CAM_H + 210} /> : <TitleStack top={CAM_H + 200} start={0} />}
      <Img src={staticFile('flagg/card.png')} style={{
        position: 'absolute', height: cardH, left: W / 2 - (cardH * 440) / 640 / 2, top: H - cardH - 50,
        borderRadius: 18, transform: `scale(${cardPop}) rotate(${Math.sin(frame / 20) * 2}deg)`,
        boxShadow: '0 0 40px rgba(255,255,255,0.35), 0 20px 40px rgba(0,0,0,0.7)',
      }} />
    </AbsoluteFill>
  );
};

const QuestionText = ({top}: {top: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16}}>
      <div style={{...text, fontSize: 70, color: '#FFE14D', textShadow: glow('#FFE14D'),
        transform: `scale(${1 + Math.sin(frame / 6) * 0.03})`}}>{QUESTION.text}</div>
      <Img src={emojiSrc(QUESTION.emoji)} style={{width: 96, height: 96}} />
    </div>
  );
};

// ---- captions ----------------------------------------------------------
const Caption = ({c, y}: {c: Cap; y: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = c.words[0].at;
  const now = start + (frame / fps) * 1000;
  const pop = spring({frame, fps, config: {damping: 12, stiffness: 240}});
  return (
    <AbsoluteFill style={{alignItems: 'center', top: y - (c.emoji ? 140 : 0)}}>
      {c.emoji && <Img src={emojiSrc(c.emoji)} style={{width: 118, height: 118, marginBottom: 16, transform: `scale(${pop})`}} />}
      <div style={{...text, fontSize: c.action ? 60 : 78, padding: '0 60px', fontStyle: c.action ? 'italic' : 'normal',
        transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`}}>
        {c.words.map((w, i) => {
          const said = now >= w.at;
          const color = w.color ?? (c.action ? '#FFE14D' : 'white');
          return (
            <span key={i} style={{display: 'inline-block', margin: '0 0.2em', color, opacity: said ? 1 : 0,
              textShadow: `${glow(color === 'white' ? '#ffffff' : color)}, 0 5px 0 rgba(0,0,0,0.75)`}}>{w.text}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---- composition -------------------------------------------------------
export const CardPull = () => {
  const video = staticFile(SRC);
  const qOut = outMs(QUESTION.from)!;

  // Pieces = segments split at layout changes.
  const pieces: {src: [number, number]; out: number; layout: Layout; whip: boolean; hook: boolean}[] = [];
  for (const s of SEGS) {
    const bounds = [s.src[0], ...LAYOUTS.map((l) => l.from).filter((t) => t > s.src[0] && t < s.src[1]), s.src[1]];
    for (let i = 0; i < bounds.length - 1; i++) {
      const a = bounds[i];
      pieces.push({
        src: [a, bounds[i + 1]], out: s.out + a - s.src[0],
        layout: s.hook ? 'reaction' : layoutAt(a),
        whip: i === 0 || WHIPS.includes(a), hook: s.hook,
      });
    }
  }

  const caps: {c: Cap; hook: boolean}[] = [
    ...HOOK_CAPTIONS.map((c) => ({c, hook: true})), ...CAPTIONS.map((c) => ({c, hook: false})),
  ];
  const sfx: Sfx[] = [...SFX];
  const sfxOut = [
    ...HOOK_SFX.map((s) => ({s, o: outMs(s.at, true)})),
    ...sfx.map((s) => ({s, o: outMs(s.at)})),
    // whoosh on every cut boundary (peak lands on the cut)
    ...SEGS.slice(1).map((g) => ({s: {file: 'fast-whoosh.mp3', at: 0, volume: 0.5, onset: 550} as Sfx, o: g.out})),
  ];
  const isSpeech = (src: number) => SPEECH.some(([a, b]) => src >= a - 150 && src <= b + 150);
  const total = f(CARD_OUT_MS);

  return (
    <AbsoluteFill style={{background: 'black'}}>
      {pieces.map((p, i) => {
        const from = f(p.out);
        const dur = f(p.out + p.src[1] - p.src[0]) - from;
        const outStartMs = p.out;
        const body = p.layout === 'full' ? <FullView trim={f(p.src[0])} />
          : p.layout === 'reveal' ? <RevealView trim={f(p.src[0])} />
          : <ReactionView trim={f(p.src[0])} outStartMs={outStartMs}
              showQuestion={(fr) => !p.hook && f(outStartMs) + fr >= f(qOut)} />;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {p.whip ? <Whip>{body}</Whip> : body}
            <Banner layout={p.layout} />
          </Sequence>
        );
      })}

      {caps.map(({c, hook}, i) => {
        const a = outMs(c.words[0].at, hook);
        const b = outMs(c.to, hook);
        if (a === null || b === null) return null;
        const y = captionY(hook ? 'reaction' : layoutAt(c.words[0].at));
        return (
          <Sequence key={`c${i}`} from={f(a)} durationInFrames={Math.max(1, f(b) - f(a))}>
            <Caption c={c} y={y} />
          </Sequence>
        );
      })}

      {/* dialogue */}
      {SEGS.map((s, i) => {
        const from = f(s.out);
        const dur = f(s.out + s.src[1] - s.src[0]) - from;
        return (
          <Sequence key={`a${i}`} from={from} durationInFrames={dur}>
            <Audio src={video} trimBefore={f(s.src[0])} volume={(fr) =>
              DIALOGUE_GAIN(s.src[0] + (fr / FPS) * 1000) * Math.min(1, fr / 2, (dur - fr) / 2)} />
          </Sequence>
        );
      })}
      {/* one song, looped, ducked under talk */}
      <Audio src={staticFile(`music/${MUSIC.file}`)} loop volume={(fr) => {
        const out = (fr / FPS) * 1000;
        const s = segAtOut(out);
        const src = srcAtOut(out);
        const fade = Math.min(1, fr / 6, (total - fr) / 6);
        if (s.hook || src >= MUSIC.loudFrom) return MUSIC.loud * fade;
        return (isSpeech(src) ? MUSIC.quiet : MUSIC.gap) * fade;
      }} />
      {sfxOut.map(({s, o}, i) => o === null ? null : (
        <Sequence key={`s${i}`} from={Math.max(0, f(o - s.onset))} durationInFrames={s.maxMs ? f(s.maxMs) : undefined}>
          <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
