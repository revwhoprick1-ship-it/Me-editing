// Motion-graphics podcast Short (ref: TikTok "quality over quantity" Luke Belmar edit).
// Full-screen face close-up with a dark moody grade, kinetic stacked typography that blurs in
// (serif / bold sans / italic mix), light-leak transitions, the video shrinking into a rounded card
// on a light background, clean white UI scenes, a glowing stat scene, small plain subtitles between.
// Clip: Trevor Lawrence on calling Peyton Manning as a rookie (public/pod2/u4_peyton.mp4).
// ALL SPEC TIMES BELOW ARE SOURCE MS unless named out*.
import {loadFont} from '@remotion/fonts';
import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import track from './plans/data/u4_peyton.seats.json';
import words from './plans/data/u4_peyton.words.json';

const SANS = 'Inter';
const SERIF = 'Instrument Serif';
loadFont({family: SANS, url: staticFile('fonts/inter-latin-500-normal.woff2'), weight: '500'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-700-normal.woff2'), weight: '700'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-800-normal.woff2'), weight: '800'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-800-italic.woff2'), weight: '800', style: 'italic'});
loadFont({family: SERIF, url: staticFile('fonts/instrument-serif-latin-400-normal.woff2'), weight: '400'});
loadFont({family: SERIF, url: staticFile('fonts/instrument-serif-latin-400-italic.woff2'), weight: '400', style: 'italic'});

export const MG_FPS = 30;
const W = 1080;
const H = 1920;
const SRC = 'pod2/u4_peyton.mp4';
const SRC_W = 1920;
const SRC_H = 1080;
const f = (ms: number) => Math.round((ms / 1000) * MG_FPS);

// ---- timeline -------------------------------------------------------------
// Hook first (the struggle), then the story in order, then the stat, then an outro card.
const SEGS: [number, number][] = [[38200, 41650], [25550, 29000], [29950, 36650], [41650, 51750]];
const OUTRO_MS = 1900;
const segOut = SEGS.reduce<number[]>((a, [s, e], i) => [...a, i ? a[i - 1] + (SEGS[i - 1][1] - SEGS[i - 1][0]) : 0], []);
const STORY_MS = segOut[3] + SEGS[3][1] - SEGS[3][0];
export const MG_OUT_MS = STORY_MS + OUTRO_MS;
// (a segment's end time is also the next segment's start: prefer the segment that starts there)
const out = (src: number) => {
  let i = SEGS.findIndex(([a, b]) => src >= a && src < b);
  if (i < 0) i = SEGS.findIndex(([, b]) => src === b);
  return i < 0 ? null : segOut[i] + src - SEGS[i][0];
};
const srcAt = (o: number) => {
  for (let i = SEGS.length - 1; i >= 0; i--) if (o >= segOut[i]) return Math.min(SEGS[i][1], SEGS[i][0] + o - segOut[i]);
  return SEGS[0][0];
};

// scene boundaries (output ms)
const T_CARD = out(25550)!; // video becomes a card on a light background
const T_CARD_IN = T_CARD + 850;
const T_WHITE = out(29950)!; // white UI scene
const T_FULL2 = segOut[3]; // back to the face
const T_STAT = out(47150)!; // 28 interceptions
const T_FULL3 = out(49950)!;

// ---- face track (Trevor = seat M) ------------------------------------------
type Track = {stepMs: number; fromMs: number; M: number[][]};
const TR = track as unknown as Track;
const faceAt = (ms: number) => {
  const i = (ms - TR.fromMs) / TR.stepMs;
  const a = TR.M[Math.max(0, Math.min(TR.M.length - 1, Math.floor(i)))];
  const b = TR.M[Math.max(0, Math.min(TR.M.length - 1, Math.floor(i) + 1))];
  const t = Math.min(1, Math.max(0, i - Math.floor(i)));
  return {x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t};
};

// ---- the camera: Trevor cropped into a rect (full screen or a card) --------
type Rect = {x: number; y: number; w: number; h: number; r: number};
const FULL: Rect = {x: 0, y: 0, w: W, h: H, r: 0};
const CARD_B: Rect = {x: 140, y: 170, w: 800, h: 900, r: 44};
const CARD_C: Rect = {x: 770, y: 110, w: 250, h: 330, r: 30};
const ease = Easing.bezier(0.7, 0, 0.2, 1);
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, w: a.w + (b.w - a.w) * t, h: a.h + (b.h - a.h) * t, r: a.r + (b.r - a.r) * t,
});
const camRect = (o: number): Rect => {
  const k = (a: number, b: number) => interpolate(o, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  if (o < T_CARD + 300) return FULL;
  if (o < T_WHITE) return lerpRect(FULL, CARD_B, k(T_CARD + 300, T_CARD_IN));
  if (o < T_FULL2) return lerpRect(CARD_B, CARD_C, k(T_WHITE, T_WHITE + 450));
  return lerpRect(CARD_C, FULL, k(T_FULL2, T_FULL2 + 450));
};
// punch-ins (output ms, zoom)
const PUNCH: [number, number, number][] = [[out(40900)!, out(41600)!, 1.12], [out(44700)!, out(46300)!, 1.08], [out(51100)!, out(51700)!, 1.1]];
const zoomAt = (o: number) => {
  const p = PUNCH.find(([a, b]) => o >= a - 120 && o <= b + 200);
  if (!p) return 1;
  return 1 + (p[2] - 1) * Math.min(1, (o - p[0] + 120) / 120, (p[1] + 200 - o) / 200);
};

const Cam = ({o, grade = true, style}: {o: number; grade?: boolean; style?: CSSProperties}) => {
  const rect = camRect(o);
  const ms = srcAt(Math.min(o, STORY_MS - 1));
  const face = faceAt(ms);
  const z = zoomAt(o) * interpolate(o % 4000, [0, 4000], [1, 1.03]);
  // source window with the card's aspect, face a third of the way down
  const hs = Math.min(SRC_H, (rect.r > 0 ? 640 : 600) / z); // tight on the face like the ref
  const ws = Math.min(SRC_W, (hs * rect.w) / rect.h);
  const hs2 = (ws * rect.h) / rect.w;
  const x0 = Math.min(Math.max(face.x - ws / 2, 0), SRC_W - ws);
  const y0 = Math.min(Math.max(face.y - hs2 * 0.36, 0), SRC_H - hs2);
  const k = rect.w / ws;
  return (
    <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, overflow: 'hidden',
      borderRadius: rect.r, boxShadow: rect.r > 0 ? '0 30px 60px rgba(0,0,0,0.25)' : undefined, ...style}}>
      <div style={{position: 'absolute', left: -x0 * k, top: -y0 * k, width: SRC_W * k, height: SRC_H * k,
        filter: grade ? 'contrast(1.12) saturate(0.9) brightness(0.86)' : undefined}}>
        {/* one video per story segment so each plays its own source time */}
        {SEGS.map(([a, b], i) => (
          <Sequence key={i} from={f(segOut[i])} durationInFrames={f(b - a) + (i === 3 ? f(OUTRO_MS) : 0)} layout="none">
            <OffthreadVideo src={staticFile(SRC)} muted trimBefore={f(a)} style={{width: '100%', height: '100%'}} />
          </Sequence>
        ))}
      </div>
      {grade && <>
        {/* cool night tint + vignette (ref's dark blue studio look) */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(30,30,90,0.28)', mixBlendMode: 'soft-light'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 38%, transparent 40%, rgba(5,5,20,0.7) 100%)'}} />
      </>}
    </div>
  );
};

// ---- typography -----------------------------------------------------------
type Line = {t: string; font: 'sans' | 'bold' | 'serif' | 'serifI' | 'boldI'; size: number; at: number; color?: string};
const fontOf = (l: Line): CSSProperties => ({
  sans: {fontFamily: SANS, fontWeight: 500, letterSpacing: '-0.02em'},
  bold: {fontFamily: SANS, fontWeight: 800, letterSpacing: '-0.045em'},
  boldI: {fontFamily: SANS, fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.045em'},
  serif: {fontFamily: SERIF, fontWeight: 400, letterSpacing: '-0.01em'},
  serifI: {fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em'},
}[l.font]);

// Blur-in reveal (ref): each line fades up from a heavy blur at its spoken time.
const reveal = (frame: number, startF: number) => {
  const t = Math.max(0, frame - startF);
  const p = interpolate(t, [0, 9], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return {opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `translateY(${(1 - p) * 26}px) scale(${1.06 - 0.06 * p})`};
};

// A stack of kinetic lines; times are source ms, the stack lives from its first line to `to`.
const KStack = ({lines, x, y, align, from, glow = true}: {lines: Line[]; x: number; y: number; align: 'left' | 'right' | 'center'; from: number; glow?: boolean}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', top: y, left: align === 'right' ? undefined : x, right: align === 'right' ? W - x : undefined,
      width: align === 'center' ? W - 2 * x : undefined, textAlign: align, lineHeight: 0.92}}>
      {lines.map((l, i) => (
        <div key={i} style={{...fontOf(l), fontSize: l.size, color: l.color ?? 'white', whiteSpace: 'nowrap',
          textShadow: glow ? '0 0 30px rgba(255,255,255,0.25), 0 6px 24px rgba(0,0,0,0.55)' : undefined,
          ...reveal(frame, f(out(l.at)! - from))}}>{l.t}</div>
      ))}
    </div>
  );
};

// small plain subtitles (1-3 words) between the big moments
const W_ = (words as {text: string; startMs: number; endMs: number}[]);
const FIXW: Record<string, string> = {had: 'had', Indy: 'Indy.'};
const chunks = (from: number, to: number, max = 3) => {
  const ws = W_.filter((w) => w.startMs >= from && w.startMs < to);
  const res: {text: string; at: number; end: number}[] = [];
  let cur: typeof ws = [];
  ws.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    if (cur.length >= max || (prev && w.startMs - prev.endMs > 300)) {
      res.push({text: cur.map((c) => FIXW[c.text] ?? c.text).join(' '), at: cur[0].startMs, end: w.startMs}); cur = [];
    }
    cur.push(w);
    if (i === ws.length - 1) res.push({text: cur.map((c) => FIXW[c.text] ?? c.text).join(' '), at: cur[0].startMs, end: Math.min(to, w.endMs + 400)});
  });
  return res;
};
const Subs = ({from, to, y, color = 'white', size = 50, fix}: {from: number; to: number; y: number; color?: string; size?: number; fix?: (t: string) => string}) => {
  const frame = useCurrentFrame();
  const o = frame / MG_FPS * 1000;
  const c = chunks(from, to).find((q) => o >= out(q.at)! - out(from)! && o < out(q.end)! - out(from)!);
  if (!c) return null;
  const st = f(out(c.at)! - out(from)!);
  return (
    <div style={{position: 'absolute', top: y, width: W, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: size,
      letterSpacing: '-0.02em', color, textShadow: color === 'white' ? '0 4px 18px rgba(0,0,0,0.6)' : undefined, ...reveal(frame, st)}}>
      {fix ? fix(c.text) : c.text}
    </div>
  );
};

// ---- effects ----------------------------------------------------------------
// Light leak: a soft pink/green glow sweeping across (ref 3.4 s)
const LightLeak = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 7, 16], [0, 1, 0], {extrapolateRight: 'clamp'});
  const x = interpolate(frame, [0, 16], [-30, 120]);
  return (
    <AbsoluteFill style={{opacity: p, mixBlendMode: 'screen', background:
      `radial-gradient(ellipse 70% 90% at ${x}% 40%, rgba(255,110,190,0.95), transparent 70%), radial-gradient(ellipse 60% 70% at ${x - 30}% 80%, rgba(120,255,190,0.8), transparent 70%)`}} />
  );
};
// Thin line drawn diagonally (ref "Quality / Quantity")
const DrawLine = ({x1, y1, x2, y2}: {x1: number; y1: number; x2: number; y2: number}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke="white" strokeWidth={4} strokeLinecap="round"
        style={{filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.7))'}} />
    </svg>
  );
};

// ---- scenes -----------------------------------------------------------------
// Hook kicker: who this is about (top), with an underline that draws itself.
const Kicker = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top: 150, width: W, textAlign: 'center', ...reveal(frame, 0)}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.92)'}}>
        TREVOR LAWRENCE <span style={{fontFamily: SERIF, fontStyle: 'italic', letterSpacing: 0, fontSize: 46}}>on</span> PEYTON MANNING
      </div>
      <div style={{margin: '14px auto 0', height: 3, width: 560 * p, background: 'white', borderRadius: 2, boxShadow: '0 0 12px white'}} />
    </div>
  );
};

// Light background + Peyton card text (scene B)
const PeytonPanel = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inF = f(T_CARD_IN - T_CARD - 250);
  const cut = spring({frame: frame - inF, fps, config: {damping: 16, stiffness: 120}});
  const chip = (d: number) => spring({frame: frame - inF - d, fps, config: {damping: 12, stiffness: 220}});
  return (
    <AbsoluteFill>
      <Img src={staticFile('cutouts/peyton.png')} style={{position: 'absolute', left: -60, bottom: 0, height: 820,
        transform: `translateX(${(1 - cut) * -500}px)`, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))'}} />
      <div style={{position: 'absolute', right: 70, top: 1130, textAlign: 'right', lineHeight: 0.9, color: '#111'}}>
        <div style={{fontFamily: SERIF, fontSize: 150, ...reveal(frame, inF + 4)}}>Peyton</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, ...reveal(frame, inF + 9)}}>Manning.</div>
        <div style={{display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 34}}>
          {['5× MVP', '2× SUPER BOWL'].map((t, i) => (
            <div key={t} style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: '0.04em', padding: '14px 24px',
              borderRadius: 40, background: '#111', color: 'white', transform: `scale(${chip(16 + i * 6)})`}}>{t}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// White UI scene (C): heading + checklist rows that light up when he says each one
const ROWS = [{t: 'Routine', at: 31060, emoji: '23f0'}, {t: 'Film', at: 33640, emoji: '1f3ac'}, {t: 'Study habits', at: 35520, emoji: '1f4da'}];
const Checklist = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <KStack x={80} y={230} align="left" from={T_WHITE} glow={false} lines={[
        {t: 'Just about', font: 'sans', size: 60, at: 30020, color: '#666'},
        {t: 'how he', font: 'serifI', size: 140, at: 31860, color: '#111'},
        {t: 'did things.', font: 'boldI', size: 120, at: 32560, color: '#111'},
      ]} />
      {ROWS.map((r, i) => {
        const st = f(out(r.at)! - T_WHITE);
        const rowIn = spring({frame: frame - 6 - i * 4, fps, config: {damping: 18, stiffness: 140}});
        const on = interpolate(frame - st, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const tick = spring({frame: frame - st - 4, fps, config: {damping: 9, stiffness: 260}});
        return (
          <div key={r.t} style={{position: 'absolute', left: 80, width: 920, top: 760 + i * 230, height: 190, borderRadius: 36,
            background: 'white', boxShadow: `0 ${18 + on * 12}px ${40 + on * 20}px rgba(0,0,0,${0.08 + on * 0.06})`,
            display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', boxSizing: 'border-box',
            opacity: rowIn, transform: `translateY(${(1 - rowIn) * 60}px) scale(${1 + on * 0.02})`}}>
            <div style={{width: 110, height: 110, borderRadius: 55, background: on ? '#111' : '#E6E6EA', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Img src={staticFile(`emoji-ios/${r.emoji}.png`)} style={{width: 64, height: 64, opacity: 0.35 + 0.65 * on}} />
            </div>
            <div style={{flex: 1, position: 'relative', height: 120}}>
              {/* blurred placeholder bars until it's said (ref UI mock) */}
              <div style={{position: 'absolute', top: 24, height: 30, width: 420, borderRadius: 15, background: '#D9D9DE', filter: 'blur(3px)', opacity: 1 - on}} />
              <div style={{position: 'absolute', top: 70, height: 26, width: 260, borderRadius: 13, background: '#E4E4E8', filter: 'blur(3px)', opacity: 1 - on}} />
              <div style={{position: 'absolute', top: 6, fontFamily: SANS, fontWeight: 800, fontStyle: 'italic', fontSize: 92,
                letterSpacing: '-0.04em', color: '#111', whiteSpace: 'nowrap', ...reveal(frame, st)}}>{r.t}</div>
            </div>
            <div style={{width: 84, height: 84, borderRadius: 42, background: '#22C55E', color: 'white', fontFamily: SANS,
              fontWeight: 800, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: `scale(${frame >= st + 4 ? tick : 0})`, boxShadow: '0 8px 20px rgba(34,197,94,0.45)'}}>✓</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Stat scene (E): dark purple glow, counter 0 → 28, "led the league" chip, yellow subtitles
const Stat = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.round(interpolate(frame, [6, 30], [0, 28], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const land = spring({frame: frame - 30, fps, config: {damping: 8, stiffness: 240}});
  const chip = spring({frame: frame - 38, fps, config: {damping: 11, stiffness: 220}});
  const beam = (i: number) => 0.5 + 0.5 * Math.sin(frame / 12 + i * 2);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #3b1170 0%, #12062e 55%, #050212 100%)'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 140 + i * 300, top: -200, width: 180, height: 1300, borderRadius: 90,
          background: 'linear-gradient(#b14cff, transparent)', filter: 'blur(60px)', opacity: 0.35 + 0.25 * beam(i),
          transform: `rotate(${(i - 1) * 14}deg)`}} />
      ))}
      <div style={{position: 'absolute', top: 520, width: W, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 40,
        letterSpacing: '0.3em', color: 'rgba(255,255,255,0.75)', ...reveal(frame, 2)}}>1998 · ROOKIE YEAR</div>
      <div style={{position: 'absolute', top: 600, width: W, ...reveal(frame, 4)}}>
        <div style={{textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 420, letterSpacing: '-0.06em', color: 'white',
          lineHeight: 1, transform: `scale(${frame >= 30 ? 0.92 + 0.08 * land : 1})`,
          textShadow: '0 0 60px rgba(190,120,255,0.8), 0 0 140px rgba(150,80,255,0.6)'}}>{n}</div>
      </div>
      <div style={{position: 'absolute', top: 1080, width: W, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 130,
        color: 'white', ...reveal(frame, 14)}}>interceptions.</div>
      <div style={{position: 'absolute', top: 1270, width: W, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: '0.12em', padding: '16px 34px', borderRadius: 40,
          background: '#FFD84D', color: '#111', transform: `scale(${chip})`}}>MOST IN THE NFL</div>
      </div>
    </AbsoluteFill>
  );
};

// Outro: blurred dark freeze + the line
const Outro = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: 'rgba(5,5,20,0.55)', backdropFilter: 'blur(18px)'}}>
      <div style={{textAlign: 'center', lineHeight: 0.95, color: 'white'}}>
        <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 64, letterSpacing: '-0.02em', ...reveal(frame, 4)}}>Even the</div>
        <div style={{fontFamily: SERIF, fontSize: 200, ...reveal(frame, 10)}}>greats</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 150, color: '#FFE3A3', ...reveal(frame, 18)}}>struggled first.</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- sound --------------------------------------------------------------------
type Sfx = {file: string; at: number; vol: number; peak: number};
const SFX: Sfx[] = [
  {file: 'mg-swoosh2', at: 0, vol: 0.35, peak: 0},
  {file: 'mg-boom', at: out(40900)!, vol: 0.32, peak: 190},
  {file: 'mg-whoosh', at: T_CARD, vol: 0.5, peak: 780},
  {file: 'mg-swoosh2', at: T_CARD + 300, vol: 0.35, peak: 0},
  {file: 'mg-boom', at: T_CARD_IN - 250, vol: 0.28, peak: 190},
  {file: 'mg-click', at: T_CARD_IN + 300, vol: 0.5, peak: 300},
  {file: 'mg-click', at: T_CARD_IN + 500, vol: 0.5, peak: 300},
  {file: 'mg-whoosh', at: T_WHITE, vol: 0.45, peak: 780},
  ...ROWS.map((r) => ({file: 'mg-click', at: out(r.at)!, vol: 0.6, peak: 300})),
  ...ROWS.map((r) => ({file: 'ding-2', at: out(r.at)! + 140, vol: 0.12, peak: 140})),
  {file: 'mg-swoosh', at: T_FULL2, vol: 0.45, peak: 1460},
  {file: 'mg-swoosh2', at: out(44700)!, vol: 0.3, peak: 0},
  {file: 'mg-whoosh', at: T_STAT, vol: 0.5, peak: 780},
  ...[0, 1, 2, 3, 4, 5].map((i) => ({file: 'mg-click', at: T_STAT + 230 + i * 110, vol: 0.22, peak: 300})),
  {file: 'mg-boom', at: T_STAT + 1000, vol: 0.55, peak: 190},
  {file: 'mg-swoosh2', at: T_FULL3, vol: 0.35, peak: 0},
  {file: 'mg-shimmer', at: STORY_MS + 100, vol: 0.45, peak: 700},
];
const SPEECH = W_.map((w) => [out(w.startMs), out(w.startMs) === null ? null : out(w.startMs)! + w.endMs - w.startMs] as const)
  .filter(([a]) => a !== null) as [number, number][];
const talking = (o: number) => SPEECH.some(([a, b]) => o >= a - 150 && o <= b + 150);
const MUSIC_START = 750; // song's beat drop (2.7 s) lands on the first scene change

// ---- composition --------------------------------------------------------------
export const MotionPod = () => {
  const frame = useCurrentFrame();
  const o = (frame / MG_FPS) * 1000;
  const total = f(MG_OUT_MS);
  const lightBg = o >= T_CARD + 300 && o < T_FULL2;
  const bgIn = interpolate(o, [T_CARD + 300, T_CARD_IN], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const seq = (from: number, to: number, node: ReactNode, key: string) => (
    <Sequence key={key} from={f(from)} durationInFrames={Math.max(1, f(to) - f(from))}>{node}</Sequence>
  );
  return (
    <AbsoluteFill style={{background: '#06060f'}}>
      {lightBg && <AbsoluteFill style={{opacity: bgIn, background: o < T_WHITE
        ? 'linear-gradient(160deg, #f4f4f7 0%, #dcdce3 55%, #f7f7fa 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f1f1f4 100%)'}} />}
      {o < T_STAT || o >= T_FULL3 ? <Cam o={o} grade={!lightBg || o < T_CARD_IN} /> : null}

      {/* ---- hook ---- */}
      {seq(0, segOut[1], <Kicker />, 'kick')}
      {seq(0, out(39900)!, <KStack x={80} y={1080} align="left" from={0} lines={[
        {t: 'During my', font: 'sans', size: 64, at: 38260},
        {t: 'ROOKIE', font: 'bold', size: 190, at: 39380},
        {t: 'season', font: 'serifI', size: 150, at: 39620},
      ]} />, 's1')}
      {seq(out(39900)!, segOut[1], <KStack x={1000} y={960} align="right" from={out(39900)!} lines={[
        {t: 'I talked to him', font: 'sans', size: 60, at: 39900},
        {t: 'when it was', font: 'serif', size: 110, at: 40560},
        {t: 'NOT', font: 'bold', size: 260, at: 40900},
        {t: 'going well.', font: 'serifI', size: 130, at: 41120},
      ]} />, 's2')}
      {seq(out(40900)!, segOut[1], <DrawLine x1={120} y1={1520} x2={980} y2={1120} />, 'line')}

      {/* ---- Peyton card ---- */}
      {seq(T_CARD, T_CARD + 700, <LightLeak />, 'leak1')}
      {seq(T_CARD + 300, T_WHITE, <PeytonPanel />, 'peyton')}
      {seq(T_CARD, T_WHITE, <Subs from={25550} to={29000} y={o < T_CARD_IN ? 1180 : 940} size={o < T_CARD_IN ? 56 : 46} />, 'subB')}

      {/* ---- white checklist ---- */}
      {seq(T_WHITE, T_FULL2, <Checklist />, 'check')}
      {seq(T_WHITE, T_FULL2, <Subs from={29950} to={36650} y={1530} color="#8a8a94" size={40} />, 'subC')}

      {/* ---- back on Trevor ---- */}
      {seq(T_FULL2, T_FULL2 + 700, <LightLeak />, 'leak2')}
      {seq(T_FULL2, out(43760)!, <KStack x={80} y={1060} align="left" from={T_FULL2} lines={[
        {t: 'just to try to get', font: 'sans', size: 58, at: 41700},
        {t: 'a', font: 'serif', size: 120, at: 42800},
        {t: 'perspective.', font: 'serifI', size: 170, at: 42960},
      ]} />, 's3')}
      {seq(out(43760)!, T_STAT, <KStack x={1000} y={980} align="right" from={out(43760)!} lines={[
        {t: 'because he had some', font: 'sans', size: 56, at: 43760},
        {t: 'CHALLENGES', font: 'bold', size: 150, at: 44700},
        {t: 'early on', font: 'serifI', size: 130, at: 45340},
        {t: 'in Indy.', font: 'bold', size: 120, at: 46240},
      ]} />, 's4')}

      {/* ---- the stat ---- */}
      {seq(T_STAT, T_FULL3, <Stat />, 'stat')}
      {seq(T_STAT, T_FULL3, <Subs from={47150} to={49950} y={1560} color="#FFD84D" size={52}
        fix={(t) => t.replace(/\bhad\b/, 'led').replace(/\band\b/, 'in')} />, 'subE')}
      {seq(T_STAT - 200, T_STAT + 500, <LightLeak />, 'leak3')}

      {/* ---- rough years ---- */}
      {seq(T_FULL3, STORY_MS, <KStack x={80} y={1000} align="left" from={T_FULL3} lines={[
        {t: 'Yeah.', font: 'sans', size: 58, at: 50540},
        {t: 'He had a couple', font: 'serif', size: 110, at: 50960},
        {t: 'rough', font: 'bold', size: 230, at: 51140},
        {t: 'years.', font: 'serifI', size: 170, at: 51420},
      ]} />, 's5')}
      {seq(STORY_MS, MG_OUT_MS, <Outro />, 'outro')}

      {/* ---- audio ---- */}
      {SEGS.map(([a, b], i) => (
        <Sequence key={`a${i}`} from={f(segOut[i])} durationInFrames={f(b - a)}>
          <Audio src={staticFile(SRC)} trimBefore={f(a)} volume={(fr) => Math.min(1, fr / 2, (f(b - a) - fr) / 2)} />
        </Sequence>
      ))}
      <Sequence from={f(MUSIC_START)}>
        <Audio src={staticFile('music/midnight-club.mp3')} volume={(fr) => {
          const t = MUSIC_START + (fr / MG_FPS) * 1000;
          const end = Math.min(1, (total - f(MUSIC_START) - fr) / 20);
          if (t >= STORY_MS) return 0.5 * end;
          return (talking(t) ? 0.13 : 0.3) * Math.min(1, fr / 6);
        }} />
      </Sequence>
      {SFX.map((s, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(s.at - s.peak))}>
          <Audio src={staticFile(`sfx/${s.file}.mp3`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
