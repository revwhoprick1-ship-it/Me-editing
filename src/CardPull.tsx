import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import {
  BANNER_AFTER, BANNER_BEFORE, BLURS, CAPTIONS, CARD, CUTS, DIALOGUE_GAIN, HOOK_CAPTIONS, HOOK_CUT, HOOK_SFX,
  HOOK_TITLE, LAYOUTS, MONEY_MS, MUSIC, NARRATION, NARRATION_CHUNK, NARRATION_FILE, OUT_SFX, QUESTION, SFX,
  SPEECH, SRC, SUSPENSE, TRACK, TRACK_UNTIL, WHIPS, ZOOMS,
  type BannerPart, type Cap, type Layout, type Sfx,
} from './flagg';

const fontFamily = 'Montserrat';
loadFont({family: fontFamily, url: staticFile('Montserrat-Black.woff2'), weight: '800'});

export const FPS = 30;
const W = 1080;
const H = 1920;
const f = (ms: number) => Math.round((ms / 1000) * FPS);

// ---- timeline: hook first, then the main cuts --------------------------
// rate < 1 = slow motion: a source ms lasts 1/rate output ms.
type Seg = {src: [number, number]; out: number; hook: boolean; rate: number};
const SEGS: Seg[] = [];
{
  let t = 0;
  for (const [i, c] of [{src: HOOK_CUT, rate: 1}, ...CUTS].entries()) {
    const rate = c.rate ?? 1;
    SEGS.push({src: c.src, out: t, hook: i === 0, rate});
    t += (c.src[1] - c.src[0]) / rate;
  }
}
const segLen = (s: Seg) => (s.src[1] - s.src[0]) / s.rate;
export const CARD_OUT_MS = SEGS.reduce((t, s) => t + segLen(s), 0);

// Output ms of a source moment (main cuts, or the hook when hook=true).
const outMs = (src: number, hook = false): number | null => {
  const s = SEGS.find((g) => g.hook === hook && src >= g.src[0] && src <= g.src[1]);
  return s ? s.out + (src - s.src[0]) / s.rate : null;
};
const segAtOut = (out: number) => [...SEGS].reverse().find((s) => out >= s.out)!;
const srcAtOut = (out: number) => {
  const s = segAtOut(out);
  return s.src[0] + (out - s.out) * s.rate;
};
const REVEAL_OUT = outMs(CARD.revealAt)!;
// 0 → 1 across the suspense build (output time).
const suspenseAt = (out: number) =>
  Math.min(1, Math.max(0, (out - SUSPENSE.from) / (REVEAL_OUT - SUSPENSE.from)));
const NARR_RANGES = NARRATION.map((l) => [l.out, l.out + l.file[1] - l.file[0]] as const);
const narratingAt = (out: number) => NARR_RANGES.some(([a, b]) => out >= a - 100 && out <= b + 100);
const layoutAt = (src: number): Layout =>
  [...LAYOUTS].reverse().find((l) => src >= l.from)!.layout;

// Punch-in zoom at a source moment: eases in/out over ~150 ms.
const zoomAt = (src: number) => {
  const z = ZOOMS.find((q) => src >= q.from - 150 && src <= q.to + 150);
  if (!z) return {scale: 1, x: 540, y: 1300};
  const k = Math.min(1, (src - z.from + 150) / 150, (z.to + 150 - src) / 150);
  const e = 1 - Math.pow(1 - Math.max(0, k), 3);
  return {scale: 1 + (z.scale - 1) * e, x: z.x, y: z.y};
};
const blurAt = (src: number) => BLURS.find((b) => src >= b.from && src < b.to);

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
// Top of the card cam in the source layout (under the burned-in banner).
const CARD_CAM_TOP = 607;
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

const Banner = ({layout, parts}: {layout: Layout; parts: BannerPart[]}) => (
  <div style={{
    position: 'absolute', top: bannerTop(layout), left: 0, width: W, height: 180, background: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
  }}>
    <div style={{...text, color: 'black', fontSize: 58, lineHeight: 1.05, whiteSpace: 'pre-line'}}>
      {parts.map((b, i) => b.emoji
        ? <Img key={i} src={emojiSrc(b.emoji)} style={{width: 58, height: 58, verticalAlign: '-8px'}} />
        : <span key={i} style={{color: b.color ?? 'black'}}>{b.text}</span>)}
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
  const y = sy * CAM_K;
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

type Title = {name: string; parallel: string; price: string};
const TitleStack = ({top, start, title = CARD}: {top: number; start: number; title?: Title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pops = [0, 6, 18].map((d) => spring({frame: frame - start - d, fps, config: {damping: 9, stiffness: 260}}));
  const lines: [string, string, number][] = [[title.name, 'white', 62], [title.parallel, '#FF3B3B', 62], [title.price, '#5CFF5C', 84]];
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
// Blurs a not-yet-revealed card (curiosity) with a ❓ on top.
const BlurBox = ({box}: {box: [number, number, number, number]}) => {
  const frame = useCurrentFrame();
  const [x, y, w, h] = box;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 40,
      backdropFilter: 'blur(38px) saturate(0.6)', WebkitBackdropFilter: 'blur(38px)', background: 'rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={emojiSrc('2753')} style={{width: 220, height: 220, transform: `scale(${1 + Math.sin(frame / 4) * 0.06})`,
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.6))'}} />
    </div>
  );
};

const FullView = ({trim, srcStart, rate, outStart}: {trim: number; srcStart: number; rate: number; outStart: number}) => {
  const frame = useCurrentFrame();
  const src = srcStart + (frame / FPS) * 1000 * rate;
  const sp = suspenseAt(outStart + (frame / FPS) * 1000);
  // Suspense: card cam creeps in and trembles harder and harder.
  const push = interpolate(frame, [0, 150], [1, 1.05], {extrapolateRight: 'clamp'}) * (1 + 0.35 * Math.pow(sp, 1.4));
  const amp = sp * sp * 12;
  const z = zoomAt(src);
  const b = blurAt(src);
  // Hosts cam stays still; only the card cam (below the burned banner) pushes/zooms.
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} playbackRate={rate} style={{width: W, height: H}} />
      <div style={{position: 'absolute', top: CARD_CAM_TOP, width: W, height: H - CARD_CAM_TOP, overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: -CARD_CAM_TOP, width: W, height: H,
          transform: `translate(${Math.sin(frame * 2.3) * amp}px, ${Math.cos(frame * 3.1) * amp}px) scale(${push * z.scale})`,
          transformOrigin: `${z.x}px ${z.y}px`, filter: sp > 0 ? `saturate(${1 - 0.6 * sp}) contrast(${1 + 0.25 * sp})` : undefined}}>
          <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} playbackRate={rate} style={{width: W, height: H}} />
          {b && <BlurBox box={b.box} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RevealView = ({trim}: {trim: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Slam: starts way in (2.2x) and snaps back to 1.5x.
  const z = interpolate(spring({frame, fps, config: {damping: 11, stiffness: 260}}), [0, 1], [2.2, 1.5]);
  const {x, y} = CARD.center;
  // Only the card cam (below the burned banner) zooms; hosts cam stays put.
  const camTop = CARD_CAM_TOP;
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

const ReactionView = ({trim, outStartMs, srcStart, hook, showQuestion}: {
  trim: number; outStartMs: number; srcStart: number; hook: boolean; showQuestion: (frame: number) => boolean;
}) => {
  const frame = useCurrentFrame();
  const z = zoomAt(srcStart + (frame / FPS) * 1000);
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
        <div style={{position: 'absolute', inset: 0, transform: `scale(${z.scale})`,
          transformOrigin: `${(z.x - CAM.x0) * CAM_K}px ${z.y * CAM_K}px`}}>
          <OffthreadVideo src={staticFile(SRC)} muted trimBefore={trim} style={{
            position: 'absolute', width: W * CAM_K, height: H * CAM_K, left: -CAM.x0 * CAM_K, top: 0,
          }} />
          <TrackedCircle outStartMs={outStartMs} />
        </div>
      </div>
      {q ? <QuestionText top={CAM_H + 210} /> : <TitleStack top={CAM_H + 200} start={0} title={hook ? HOOK_TITLE : CARD} />}
      <div style={{position: 'absolute', height: cardH, width: (cardH * 440) / 640, left: W / 2 - (cardH * 440) / 640 / 2,
        top: H - cardH - 50, transform: `scale(${cardPop}) rotate(${Math.sin(frame / 20) * 2}deg)`}}>
        <Img src={staticFile('flagg/card.png')} style={{
          width: '100%', height: '100%', borderRadius: 18,
          boxShadow: '0 0 40px rgba(255,255,255,0.35), 0 20px 40px rgba(0,0,0,0.7)',
          filter: hook ? 'blur(34px) saturate(0.7)' : 'none',
        }} />
        {hook && <Img src={emojiSrc('2753')} style={{position: 'absolute', left: '50%', top: '50%', width: 260, height: 260,
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame / 4) * 0.06})`}} />}
      </div>
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

// Green flash + falling money at the reveal.
const MoneyRain = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 2, 14], [0.85, 0.7, 0], {extrapolateRight: 'clamp'});
  const bills = ['1f4b5', '1f4b8', '1f4b5', '1f4b0'];
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: '#1EFF3C', opacity: flash, mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: '#1EFF3C', opacity: flash * 0.45, mixBlendMode: 'multiply'}} />
      {Array.from({length: 34}).map((_, i) => {
        const seed = (n: number) => { const v = Math.sin(i * 9301 + n * 49297) * 233280; return v - Math.floor(v); };
        const t = frame - seed(1) * 30;
        if (t < 0) return null;
        const size = 90 + seed(2) * 90;
        const x = seed(3) * W + Math.sin(t / 7 + i) * 50 - size / 2;
        const y = -size + t * (22 + seed(4) * 16);
        return <Img key={i} src={emojiSrc(bills[i % bills.length])} style={{position: 'absolute', left: x, top: y,
          width: size, height: size, transform: `rotate(${Math.sin(t / 9 + i) * 35 + seed(5) * 40}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};

// Vignette closing in + "WAIT FOR IT..." during the suspense build.
const SuspenseOverlay = () => {
  const frame = useCurrentFrame();
  const out = SUSPENSE.from + (frame / FPS) * 1000;
  const sp = suspenseAt(out);
  const wait = out >= SUSPENSE.waitText;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 60%, transparent ${55 - 30 * sp}%, rgba(0,0,0,${0.35 + 0.55 * sp}) 100%)`}} />
      {wait && (
        <div style={{position: 'absolute', top: 700, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
          opacity: Math.floor(frame / 5) % 2 === 0 ? 1 : 0.35}}>
          <div style={{...text, fontSize: 84, color: '#FFE14D', textShadow: `${glow('#FFE14D')}, 0 5px 0 rgba(0,0,0,0.8)`}}>WAIT FOR IT...</div>
          <Img src={emojiSrc('23f3')} style={{width: 96, height: 96}} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Reveal impact: white flash, then a giant "1 OF 1" stamp slams on.
const Impact = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const white = interpolate(frame, [0, 2, 6], [1, 0.9, 0], {extrapolateRight: 'clamp'});
  const stamp = spring({frame: frame - 3, fps, config: {damping: 9, stiffness: 320}});
  const out = interpolate(frame, [36, 46], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'white', opacity: white}} />
      {frame >= 3 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: 120, opacity: out}}>
          <div style={{...text, fontSize: 230, color: '#FF2A2A', lineHeight: 1,
            WebkitTextStroke: '10px white', paintOrder: 'stroke',
            textShadow: '0 0 40px rgba(255,40,40,0.9), 0 14px 0 rgba(0,0,0,0.85)',
            transform: `scale(${interpolate(stamp, [0, 1], [3.2, 1])}) rotate(-10deg)`}}>1 OF 1</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Big shake right on the reveal.
const Shake = ({at, children}: {at: number; children: ReactNode}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const amp = t >= 0 && t < 16 ? (16 - t) * 2.6 : 0;
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(t * 2.9) * amp}px, ${Math.cos(t * 3.7) * amp}px)`}}>
      {children}
    </AbsoluteFill>
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
  const pieces: {src: [number, number]; out: number; layout: Layout; whip: boolean; hook: boolean; rate: number}[] = [];
  for (const s of SEGS) {
    const bounds = [s.src[0], ...LAYOUTS.map((l) => l.from).filter((t) => t > s.src[0] && t < s.src[1]), s.src[1]];
    for (let i = 0; i < bounds.length - 1; i++) {
      const a = bounds[i];
      pieces.push({
        src: [a, bounds[i + 1]], out: s.out + (a - s.src[0]) / s.rate,
        layout: s.hook ? 'reaction' : layoutAt(a),
        whip: i === 0 || WHIPS.includes(a), hook: s.hook, rate: s.rate,
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
    ...SEGS.slice(1).filter((g) => g.src[0] !== CARD.revealAt)
      .map((g) => ({s: {file: 'fast-whoosh.mp3', at: 0, volume: 0.5, onset: 550} as Sfx, o: g.out})),
    ...OUT_SFX.map((s) => ({s, o: s.at as number | null})),
  ];
  // Narration captions: each line split into chunks of NARRATION_CHUNK words.
  const narrCaps = NARRATION.flatMap((l) => {
    const chunks: Cap[] = [];
    for (let i = 0; i < l.words.length; i += NARRATION_CHUNK) {
      const words = l.words.slice(i, i + NARRATION_CHUNK);
      const next = l.words[i + NARRATION_CHUNK];
      chunks.push({words, to: next ? next.at : l.file[1], emoji: i === 0 ? l.emoji : undefined});
    }
    return chunks.map((c) => ({c, out: l.out + c.words[0].at - l.file[0], end: l.out + c.to - l.file[0]}));
  });
  const isSpeech = (src: number) => SPEECH.some(([a, b]) => src >= a - 150 && src <= b + 150);
  const total = f(CARD_OUT_MS);
  const revealOut = outMs(CARD.revealAt)!;
  const hookEnd = HOOK_CUT[1] - HOOK_CUT[0];
  const buildEnd = revealOut - MUSIC.gapBeforeDrop; // a beat of silence right before the drop
  const buildStart = buildEnd - MUSIC.dropAt;
  const afterDrop = MUSIC.length - MUSIC.dropAt;
  // [out from, out to, file offset, volume rule]
  const musicPlan: [number, number, number, 'loud' | 'talk' | 'build'][] = [
    [0, hookEnd, 8000, 'loud'],
    [hookEnd, buildStart, MUSIC.bodyFrom, 'talk'],
    [buildStart, buildEnd, 0, 'build'], // intro builds... (then silence)
    [revealOut, revealOut + afterDrop, MUSIC.dropAt, 'loud'], // ...drop on the reveal
    [revealOut + afterDrop, CARD_OUT_MS, MUSIC.bodyFrom, 'loud'],
  ];

  return (
    <AbsoluteFill style={{background: 'black'}}>
      <Shake at={f(revealOut)}>
      {pieces.map((p, i) => {
        const from = f(p.out);
        const dur = f(p.out + (p.src[1] - p.src[0]) / p.rate) - from;
        const outStartMs = p.out;
        const body = p.layout === 'full' ? <FullView trim={f(p.src[0])} srcStart={p.src[0]} rate={p.rate} outStart={p.out} />
          : p.layout === 'reveal' ? <RevealView trim={f(p.src[0])} />
          : <ReactionView trim={f(p.src[0])} outStartMs={outStartMs} srcStart={p.src[0]} hook={p.hook}
              showQuestion={(fr) => !p.hook && f(outStartMs) + fr >= f(qOut)} />;
        const parts = p.hook || p.src[0] < CARD.revealAt ? BANNER_BEFORE : BANNER_AFTER;
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {p.whip ? <Whip>{body}</Whip> : body}
            <Banner layout={p.layout} parts={parts} />
          </Sequence>
        );
      })}

      </Shake>
      <Sequence from={f(SUSPENSE.from)} durationInFrames={f(revealOut) - f(SUSPENSE.from)}><SuspenseOverlay /></Sequence>
      <Sequence from={f(revealOut)} durationInFrames={f(MONEY_MS)}><MoneyRain /></Sequence>
      <Sequence from={f(revealOut)} durationInFrames={50}><Impact /></Sequence>

      {narrCaps.map(({c, out, end}, i) => (
        <Sequence key={`n${i}`} from={f(out)} durationInFrames={Math.max(1, f(end) - f(out))}>
          <Caption c={c} y={captionY(layoutAt(srcAtOut(out)))} />
        </Sequence>
      ))}
      {NARRATION.map((l, i) => (
        <Sequence key={`na${i}`} from={f(l.out)} durationInFrames={f(l.file[1] - l.file[0])}>
          <Audio src={staticFile(NARRATION_FILE)} trimBefore={f(l.file[0])} volume={1} />
        </Sequence>
      ))}

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
      {SEGS.filter((s) => s.rate === 1).map((s, i) => {
        const from = f(s.out);
        const dur = f(s.out + segLen(s)) - from;
        return (
          <Sequence key={`a${i}`} from={from} durationInFrames={dur}>
            <Audio src={video} trimBefore={f(s.src[0])} volume={(fr) =>
              DIALOGUE_GAIN(s.src[0] + (fr / FPS) * 1000) * Math.min(1, fr / 2, (dur - fr) / 2)
              * (narratingAt(((from + fr) / FPS) * 1000) ? 0.18 : 1)} />
          </Sequence>
        );
      })}
      {/* one phonk song, its drop landing exactly on the reveal */}
      {musicPlan.filter(([a, b]) => b > a).map(([a, b, off, rule], i) => {
        const from = f(a);
        const dur = f(b) - from;
        return (
          <Sequence key={`mu${i}`} from={from} durationInFrames={dur}>
            <Audio src={staticFile(`music/${MUSIC.file}`)} trimBefore={f(off)} loop volume={(fr) => {
              const fade = Math.min(1, (fr + 1) / 3, (dur - fr) / 3, (total - from - fr) / 6);
              const narr = narratingAt(((from + fr) / FPS) * 1000);
              if (rule === 'loud') return (narr ? 0.09 : MUSIC.loud) * fade;
              if (rule === 'build') return MUSIC.build * (0.35 + 0.65 * (fr / dur)) * fade;
              if (narr) return MUSIC.underNarration * fade;
              const src = srcAtOut(((from + fr) / FPS) * 1000);
              return (isSpeech(src) ? MUSIC.quiet : MUSIC.gap) * fade;
            }} />
          </Sequence>
        );
      })}
      {sfxOut.map(({s, o}, i) => o === null ? null : (
        <Sequence key={`s${i}`} from={Math.max(0, f(o - s.onset))} durationInFrames={s.maxMs ? f(s.maxMs) : undefined}>
          <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
