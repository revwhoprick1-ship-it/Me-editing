// Builds a ShortEdit (podcast) plan from a short spec, applying the podcast
// rules in the vault: Ref C layout (black bars + plain top caption), glow
// captions with keyword colours + iOS emoji, cut-outs of people mentioned,
// one loud meme song looped (Du bist gut genug), whoosh on speaker cuts,
// punch-ins, vine boom on the punchline. ALL SPEC TIMES ARE SOURCE MS.

export const YELLOW = '#FFE14D';
export const GREEN = '#5CFF5C';
export const RED = '#FF4D4D';

type Crop = {x: number; y: number; h: number};
export type Shot =
  | ({from: number; kind: 'crop' | 'bw'; who?: 'L' | 'M' | 'R'} & Crop)
  | ({from: number; kind: 'stack'; circleX?: number; who?: 'L' | 'M' | 'R'} & Crop)
  | {from: number; kind: 'wide'; who?: undefined};
// Face track per seat from scripts/seat_track.py: [x, y, faceH] in source px every stepMs from fromMs.
export type SeatTrack = {stepMs: number; fromMs: number} & Partial<Record<'L' | 'M' | 'R', [number, number, number][]>>;
// W Speed slam (wholesome clips): big "W TREVOR ❤️‍🩹" on the Blue beat, cutting to crowd reactions.
export type WSpeed = {at: number; text: string; beatMs: number; beats: number; crowd: {file: string; from: number}[]};
// Narrated action text, W Speed style: *TREVOR WALKS IN* (italic, name in red).
export type Action = {at: number; to: number; name: string; text: string};
export type Mood = 'funny' | 'wholesome' | 'serious';
export type Word = {text: string; at: number; color?: string};
export type CaptionGroup = {words: Word[]; to: number; emoji?: string; action?: boolean; big?: boolean};
export type Sfx = {file: string; at: number; volume: number; onset: number; maxMs?: number};
export type MusicBed = {file: string; from: number; to: number; volume: number; duck: number; offset?: number; loop?: boolean};
export type RawWord = {text: string; startMs: number; endMs: number};
type Seat = 'L' | 'M' | 'R' | 'W';

export type PodSpec = {
  src: string;
  cuts: [number, number][]; // in play order (a hook may come first)
  speakers: {from: number; who: Seat}[]; // who to show from this source ms
  words: RawWord[];
  colors?: Record<string, string>; // UPPERCASE word (no punctuation) -> colour
  emoji?: Record<string, string>; // UPPERCASE word -> emoji code shown above its caption
  fix?: Record<string, string>; // transcription fixes
  hook: {text: string; emoji: string};
  punch?: {at: number; to: number; sticker: string; label?: string; sfx?: string};
  aura?: {at: number; to: number; text: string; emoji: string};
  laugh?: {from: number; to: number; emoji: string[]};
  cutouts?: {from: number; to: number; images: {file: string; h: number; x: number}[]}[];
  circle?: {at: number; who: Seat}; // red circle in a stacked shot (who it's about)
  extraSfx?: Sfx[];
  seats?: Partial<Record<'L' | 'M' | 'R', number>>; // per-clip seat x (source px) when people sit elsewhere
  track?: SeatTrack; // face track: crops follow each seat's face
  mood?: Mood; // music: funny = Du bist gut genug, wholesome = Blue (W Speed), serious = phonk
  music?: {file: string; drop?: number[]; dropAt?: number; volume?: number; duck?: number}; // drop (song ms) lands on dropAt (src ms)
  wspeed?: WSpeed;
  actions?: Action[];
};

// Default song per mood (drop = ms in the song where the beat comes in).
const MOOD_MUSIC: Record<Mood, {file: string; drop: number[]; volume: number; duck: number; loop: boolean}> = {
  funny: {file: 'du-bist-gut-genug.mp3', drop: [], volume: 0.32, duck: 0.17, loop: true},
  wholesome: {file: 'blue-yung-kai.mp3', drop: [23500, 58300], volume: 0.34, duck: 0.16, loop: false},
  serious: {file: 'montagem-uranium.mp3', drop: [9300, 37000, 73800], volume: 0.3, duck: 0.13, loop: false},
};

const SEAT = {L: 370, M: 960, R: 1490};
const CLEAN: Record<string, string> = {FUCK: 'F*CK', FUCKING: 'F*CKING', SHIT: 'SH*T', BITCH: 'B*TCH'};

export const makePodPlan = (s: PodSpec) => {
  const SEAT_X = {...SEAT, ...(s.seats ?? {})};
  const inCut = (ms: number) => s.cuts.some(([a, b]) => ms >= a && ms < b);
  const fix = {...CLEAN, ...(s.fix ?? {})};
  const key = (t: string) => t.toUpperCase().replace(/[^A-Z0-9$'-]/g, '');
  const clean = (t: string) => {
    const u = t.toUpperCase().replace(/^[,.-]+/, '');
    const k = key(u);
    return fix[k] ? u.replace(new RegExp(k.replace(/[$]/g, '\\$'), 'i'), fix[k]) : u;
  };

  // ---- captions: <= 3 words, split on pauses ----
  // merge split numbers ("$2" + ",000" -> "$2,000")
  const merged = s.words.reduce<RawWord[]>((acc, w) => {
    const prev = acc[acc.length - 1];
    if (prev && /^[,.]\d/.test(w.text.trim()) && /\d$/.test(prev.text.trim())) acc[acc.length - 1] = {...prev, text: prev.text.trim() + w.text.trim(), endMs: w.endMs};
    else acc.push(w);
    return acc;
  }, []);
  const ws = merged.filter((w) => inCut(w.startMs) && w.text.trim());
  const CAPTIONS: CaptionGroup[] = [];
  let cur: RawWord[] = [];
  const flush = (next?: RawWord) => {
    if (!cur.length) return;
    const last = cur[cur.length - 1];
    const cutEnd = s.cuts.find(([a, b]) => last.startMs >= a && last.startMs < b)![1];
    const to = Math.min(next ? next.startMs : cutEnd, last.endMs + 500, cutEnd);
    let emoji: string | undefined;
    const words = cur.map((w) => {
      const tx = clean(w.text);
      emoji = emoji ?? s.emoji?.[key(tx)];
      return {text: tx, at: w.startMs, color: s.colors?.[key(tx)]};
    });
    CAPTIONS.push({words, to, emoji});
    cur = [];
  };
  ws.forEach((w, i) => {
    const prev = cur[cur.length - 1];
    const sameCut = prev && s.cuts.some(([a, b]) => prev.startMs >= a && prev.startMs < b && w.startMs >= a && w.startMs < b);
    if (cur.length >= 3 || (prev && (w.startMs - prev.endMs > 350 || !sameCut))) flush(w);
    cur.push(w);
    if (i === ws.length - 1) flush();
  });

  // ---- shots: per speaker segment, alternate framings every ~1.8 s ----
  const sp = [...s.speakers].sort((a, b) => a.from - b.from);
  const SHOTS: Shot[] = [];
  sp.forEach((seg, i) => {
    const end = sp[i + 1]?.from ?? Infinity;
    const lastCut = Math.max(...s.cuts.map(([, b]) => b));
    let t = seg.from;
    let k = 0;
    while (t < Math.min(end, lastCut)) {
      if (seg.who === 'W') {
        SHOTS.push({from: t, kind: 'wide'});
      } else {
        const x = SEAT_X[seg.who];
        const framings: Crop[] = [{x, y: 40, h: 800}, {x, y: 80, h: 680}, {x, y: 30, h: 860}];
        const f = framings[k % 3];
        const who = seg.who as 'L' | 'M' | 'R';
        SHOTS.push(k % 4 === 3 ? {from: t, kind: 'stack', who, ...f} : {from: t, kind: 'crop', who, ...f});
      }
      t += 1800;
      k++;
    }
  });
  // punch-in on the punchline (tight crop on whoever is speaking then)
  if (s.punch) {
    const who = [...sp].reverse().find((q) => q.from <= s.punch!.at)?.who ?? 'M';
    const x = who === 'W' ? SEAT_X.M : SEAT_X[who];
    const idx = SHOTS.findIndex((q) => q.from > s.punch!.at);
    const shot: Shot = {from: s.punch.at, kind: 'stack', x, y: 110, h: 560, who: who === 'W' ? 'M' : who};
    SHOTS.splice(idx < 0 ? SHOTS.length : idx, 0, shot);
    if (s.aura) SHOTS.splice(SHOTS.findIndex((q) => q.from > s.aura!.at), 0, {from: s.aura.at, kind: 'bw', x: SEAT_X.M, y: 60, h: 640, who: 'M'});
  }
  if (s.circle) {
    const first = SHOTS.find((q) => q.from <= s.circle!.at) ?? SHOTS[0];
    const i = SHOTS.indexOf(first);
    if (first.kind !== 'wide') SHOTS[i] = {...first, kind: 'stack', circleX: s.circle.who === 'W' ? undefined : SEAT_X[s.circle.who]} as Shot;
  }
  SHOTS.sort((a, b) => a.from - b.from);

  // ---- sound ----
  const SFX: Sfx[] = [
    {file: 'fast-whoosh.mp3', at: s.cuts[0][0], volume: 0.55, onset: 550},
    // whoosh on each speaker change and each jump cut
    ...sp.slice(1).filter((q) => inCut(q.from)).map((q) => ({file: 'fast-whoosh.mp3', at: q.from, volume: 0.32, onset: 550})),
    ...s.cuts.slice(1).map(([a]) => ({file: 'fast-whoosh.mp3', at: a, volume: 0.4, onset: 550})),
    // ding when an emoji pops
    ...CAPTIONS.filter((c) => c.emoji).map((c) => ({file: 'ding-2.mp3', at: c.words[0].at, volume: 0.3, onset: 140, maxMs: 1200})),
    ...(s.punch ? [{file: s.punch.sfx ?? 'vine-boom.mp3', at: s.punch.at, volume: 0.6, onset: 80}] : []),
    ...(s.aura ? [{file: 'camera-shutter.mp3', at: s.aura.at - 150, volume: 0.6, onset: 10},
      {file: 'error.mp3', at: s.aura.at, volume: 0.5, onset: 110}] : []),
    ...(s.extraSfx ?? []),
  ];
  const lastEnd = Math.max(...s.cuts.map(([, b]) => b));
  // music by mood; the song's drop lands on dropAt (default: the W slam or the punch)
  const mm = MOOD_MUSIC[s.mood ?? 'funny'];
  const song = {...mm, ...(s.music ?? {})};
  const outOf = (src: number) => {
    let t = 0;
    for (const [a, b] of s.cuts) { if (src >= a && src <= b) return t + src - a; t += b - a; }
    return 0;
  };
  const dropAt = s.music?.dropAt ?? s.wspeed?.at ?? s.punch?.at;
  // first drop late enough to line up (song can't start before 0)
  const drop = dropAt === undefined ? undefined : song.drop.find((d) => d >= outOf(dropAt));
  const offset = drop === undefined ? 0 : drop - outOf(dropAt!);
  const MUSIC: MusicBed[] = [{file: song.file, from: s.cuts[0][0], to: lastEnd, volume: song.volume, duck: song.duck,
    loop: mm.loop, offset: Math.max(0, offset)}];
  const SPEECH: [number, number][] = s.words.map((w) => [w.startMs, w.endMs]);

  return {
    SRC: s.src, CUTS: s.cuts, SHOTS, CAPTIONS, HOOK: s.hook,
    CUTOUTS: s.cutouts ?? [], PUNCH: s.punch ? {at: s.punch.at, to: s.punch.to, label: s.punch.label ?? '', sticker: s.punch.sticker} : null,
    AURA: s.aura ?? null, LAUGH: s.laugh ?? null, SFX, MUSIC, SPEECH,
    TRACK: s.track ?? null, WSPEED: s.wspeed ?? null, ACTIONS: s.actions ?? [],
  };
};
