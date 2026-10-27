// Plumbing for the Edit3 card pulls (vault/02 Style Guide/Card pull playbook.md + Edit3 note): a hook clip from the
// hooks folder first, then the stream in play order (slow-mo segments allowed), cards kept blurred until the reveal,
// Alex narration lines placed by hand, hosts ducked under the narrator. The look of each card lives in its own file.
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {FPS, H, W, f, type Cap} from './kit';

export type CSeg = {src: [number, number]; rate?: number};
export const cardTimeline = (hookMs: number, segs: CSeg[]) => {
  const segOut: number[] = [];
  let t = hookMs;
  for (const s of segs) { segOut.push(t); t += (s.src[1] - s.src[0]) / (s.rate ?? 1); }
  const total = t;
  const segAt = (o: number) => { let i = -1; segOut.forEach((s, j) => { if (o >= s) i = j; }); return i; };
  const srcAt = (o: number) => {
    const i = segAt(o);
    if (i < 0) return segs[0].src[0];
    const s = segs[i];
    return Math.min(s.src[1] - 1, s.src[0] + (o - segOut[i]) * (s.rate ?? 1));
  };
  const out = (src: number) => {
    const i = segs.findIndex((s) => src >= s.src[0] && src < s.src[1]);
    return i < 0 ? -1 : segOut[i] + (src - segs[i].src[0]) / (segs[i].rate ?? 1);
  };
  return {hookMs, segs, segOut, total, segAt, srcAt, out};
};
export type CTL = ReturnType<typeof cardTimeline>;

// hook clip (hooks folder: 720x1280 or 360x640), scaled to fill the frame; their burned-in caption blurred out
export const HookView = ({file, w, from, cover, push = 1.06}: {file: string; w: number; from: number; cover?: [number, number, number, number]; push?: number}) => {
  const k = W / w;
  const h = (w * 16) / 9;
  return <AbsoluteFill style={{background: 'black', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: (W - w) / 2, top: (H - h) / 2, width: w, height: h, transformOrigin: '50% 45%', transform: `scale(${k * push})`}}>
      <OffthreadVideo src={staticFile(file)} muted trimBefore={f(from)} style={{width: w, height: h}} />
      {cover && <div style={{position: 'absolute', left: cover[0], top: cover[1], width: cover[2], height: cover[3], borderRadius: 18 / k,
        backdropFilter: `blur(${30 / k}px)`, WebkitBackdropFilter: `blur(${30 / k}px)`, background: 'rgba(0,0,0,0.2)'}} />}
    </div>
  </AbsoluteFill>;
};

// the stream, every segment in play order, scaled to 1080 wide (source px * k)
export const StreamView = ({src, srcW, tl}: {src: string; srcW: number; tl: CTL}) => {
  const k = W / srcW;
  return <div style={{position: 'absolute', left: 0, top: 0, width: srcW * k, height: ((srcW * 16) / 9) * k}}>
    {tl.segs.map((s, i) => (
      <Sequence key={i} from={f(tl.segOut[i])} durationInFrames={f(tl.segOut[i] + (s.src[1] - s.src[0]) / (s.rate ?? 1)) - f(tl.segOut[i])} layout="none">
        <OffthreadVideo src={staticFile(src)} muted trimBefore={f(s.src[0])} playbackRate={s.rate ?? 1} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
      </Sequence>
    ))}
  </div>;
};
// unrevealed cards: blurred boxes (source px) while the source time is inside [from, to)
export const Blurs = ({tl, o, srcW, boxes}: {tl: CTL; o: number; srcW: number; boxes: {src: [number, number]; box: [number, number, number, number]}[]}) => {
  if (o < tl.hookMs) return null;
  const s = tl.srcAt(o);
  const k = W / srcW;
  return <>{boxes.filter((b) => s >= b.src[0] && s < b.src[1]).map((b, i) => <div key={i} style={{position: 'absolute', left: b.box[0] * k, top: b.box[1] * k,
    width: b.box[2] * k, height: b.box[3] * k, borderRadius: 24, backdropFilter: 'blur(38px) saturate(0.6)', WebkitBackdropFilter: 'blur(38px) saturate(0.6)',
    background: 'rgba(10,10,10,0.15)'}} />)}</>;
};

// hosts' audio: muted in slow-mo, `gain(o)` everywhere else (duck under the narrator, mute where they say the name)
export const HostAudio = ({src, tl, gain}: {src: string; tl: CTL; gain: (o: number) => number}) => <>{tl.segs.map((s, i) => {
  if ((s.rate ?? 1) !== 1) return null;
  const len = s.src[1] - s.src[0];
  return <Sequence key={i} from={f(tl.segOut[i])} durationInFrames={f(tl.segOut[i] + len) - f(tl.segOut[i])}>
    <Audio src={staticFile(src)} trimBefore={f(s.src[0])} volume={(fr) => Math.min(1, (fr + 1) / 2, (f(len) - fr) / 2) * gain(tl.segOut[i] + (fr / FPS) * 1000)} />
  </Sequence>;
})}</>;
export const HookAudio = ({file, from, ms, vol = 1}: {file: string; from: number; ms: number; vol?: number}) => (
  <Sequence durationInFrames={f(ms)}><Audio src={staticFile(file)} trimBefore={f(from)} volume={(fr) => vol * Math.min(1, (f(ms) - fr) / 3)} /></Sequence>
);

// Alex narration: each line = a range of the loud take, placed at an output time
export type NarrLine = {file: number[]; words: {text: string; at: number}[]};
export type Placed = {line: number; at: number};
export const Narration = ({file, lines, placed, vol = 1}: {file: string; lines: NarrLine[]; placed: Placed[]; vol?: number}) => <>{placed.map((p, i) => {
  const [a, b] = lines[p.line].file;
  return <Sequence key={i} from={f(p.at)} durationInFrames={f(b - a)}><Audio src={staticFile(file)} trimBefore={f(a)} volume={vol} /></Sequence>;
})}</>;
export const narrSpans = (lines: NarrLine[], placed: Placed[]) => placed.map((p) => [p.at, p.at + lines[p.line].file[1] - lines[p.line].file[0]] as [number, number]);
// narration captions in chunks of `n` words; fix = word replacements (UPPERCASE)
export const narrCaps = (lines: NarrLine[], placed: Placed[], n = 3, fix: Record<string, string> = {}, keys: Record<string, string> = {}): Cap[] => placed.flatMap((p) => {
  const l = lines[p.line];
  const ws = l.words.map((w) => ({t: fix[w.text.toUpperCase()] ?? w.text.toUpperCase(), at: p.at + w.at - l.file[0]}));
  const out: Cap[] = [];
  for (let i = 0; i < ws.length; i += n) {
    const g = ws.slice(i, i + n);
    const text = g.map((w) => w.t).join(' ');
    const key = Object.keys(keys).find((k) => text.includes(k));
    out.push([g[0].at, text, key, key ? keys[key] : undefined]);
  }
  return out;
});
// riser whose peak (6.39 s into the file) lands on `peakAt`, heard for `lead` ms before it
export const Riser = ({peakAt, lead = 2200, vol = 0.25}: {peakAt: number; lead?: number; vol?: number}) => (
  <Sequence from={f(peakAt - lead)} durationInFrames={f(lead + 200)}>
    <Audio src={staticFile('sfx/cinematic-suspense-riser.mp3')} trimBefore={f(6390 - lead)} volume={(fr) => vol * Math.min(1, fr / 10)} />
  </Sequence>
);
