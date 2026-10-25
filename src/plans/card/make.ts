// Builds a full CardPull plan from a short per-clip spec, applying every
// rule in vault/02 Style Guide/Card pull playbook.md (blur until reveal,
// suspense build, shocking reveal, phonk drop on the reveal, Alex narration,
// tracked red circle, zooms, whips). ALL SPEC TIMES ARE SOURCE MS.

export type Layout = 'full' | 'reveal' | 'reaction';
export type BannerPart = {text?: string; color?: string; emoji?: string};
export type Word = {text: string; at: number; color?: string};
export type Cap = {words: Word[]; to: number; emoji?: string; action?: boolean};
export type Line = {out: number; file: [number, number]; words: Word[]; emoji?: string};
export type Sfx = {file: string; at: number; volume: number; onset: number; maxMs?: number};
type Rect = {x: number; y: number; w: number; h: number};
type Pt = {x: number; y: number};
type Box = [number, number, number, number];

export type RawWord = {text: string; startMs: number; endMs: number};
export type NarrLine = {file: number[]; words: {text: string; at: number}[]};

export type CardSpec = {
  src: string; // in public/
  geom: {srcW: number; srcH: number; topH: number; hosts: Rect; card: Rect; react: Rect; ringR?: number};
  still: {file: string; w: number; h: number};
  card: {name: string; parallel: string; price: string; revealAt: number; center: Pt; serial: Pt; zoom?: number};
  stamp?: string;
  hook?: [number, number]; // reaction moment from this clip shown first (card blurred)
  // Hook clip from the user's hooks folder (public/hooks/*.mp4, 720x1280) shown first instead of `hook`.
  // Times are hook-file ms; `cover` = their burned-in caption box (hook px) to blur out.
  hookClip?: {file: string; from: number; to: number; cover?: Box; words: Word[]};
  music?: {file: string; drop: number; length: number}; // phonk: drop (song ms) lands on the reveal
  hookBlur?: Box; // blur this source box during the hook (card visible in the reaction shot)
  hookWords?: Word[]; // optional big caption over the hook
  cuts: [number, number][]; // story before the reveal (source ms, in order)
  suspense: [number, number]; // last bit before the reveal, played in slow motion
  after: [number, number][]; // from the reveal to the end (first range starts at revealAt)
  reactionAt: number; // switch from the card close-up to the reaction layout
  blurs: {from: number; to: number; box: Box}[]; // unrevealed cards (source px)
  zooms?: {from: number; to: number; scale: number; x: number; y: number}[];
  track?: {at: number; x: number; y: number}[];
  banner: {count: string; price: string; teaser: string; named: string};
  words: RawWord[]; // host transcript (for captions)
  narration?: NarrLine[]; // Alex take, 5 lines (prep_narr.py)
  narrFile?: string;
  narrColors?: Record<string, string>; // UPPERCASE word -> color
  quietBefore?: number; // dialogue gain before the reveal (quiet stream mics)
  questionAt?: number; // source ms; default: 5.5 s after the reaction starts
};

const Y = '#FFE14D';
const G = '#5CFF5C';
const R = '#FF4D4D';
const FIX: Record<string, string> = {
  BRAKES: 'BREAKS', LAMB: 'LAMBO', 'LAMB?': 'LAMBO?', JAYMO: 'J-MO', 'JAYMO.': 'J-MO.', MELLOW: 'MELO', TUDAH: 'TODAY', WIMBANYAMA: 'WEMBANYAMA', 'WIMBANYAMA!': 'WEMBANYAMA!', RAPPER: 'WRAPPER', WEMBEES: 'WEMBY', WEMBE: 'WEMBY', 'WEMBE.': 'WEMBY.', CONE: 'KON', CANOOPAL: 'KNUEPPEL', 'CANOOPAL,': 'KNUEPPEL,', CALCBRUNNER: 'COOPER FLAGG', CALCBRON: 'COOPER FLAGG', CHOMARANTA: 'CHROME', OTTO: 'AUTO', SHOHEY: 'SHOHEI', OBEY: 'OBI-WAN', 'OBEY,': 'OBI-WAN,', BADMEY: 'PADME', 'BADMEY.': 'PADME.', BADMAY: 'PADME', 'BADMAY,': 'PADME,', ANKIN: 'ANAKIN', 'ANKIN,': 'ANAKIN,', GOALS: 'GOAT', 'GOALS!': 'GOAT!', OTANI: 'OHTANI', FRACTOR: 'FRACTOR', JACKSON: 'JAXSON', 'FUCK': 'F*CK', 'FUCKING': 'F*CKING', 'SHIT': 'SH*T',
  'SHIT.': 'SH*T.', 'SHIT!': 'SH*T!', 'FUCK!': 'F*CK!', 'FUCKIN': 'F*CKIN', 'BITCH': 'B*TCH',
};
const clean = (t: string) => {
  const u = t.toUpperCase().replace(/^[,.]+/, '');
  return FIX[u] ?? FIX[u.replace(/[,.!?]$/, '')] ?? u;
};

export const makeCardPlan = (s: CardSpec) => {
  const HOOK_CUT: [number, number] = s.hookClip ? [s.hookClip.from, s.hookClip.to] : s.hook!;
  const HOOK_CLIP = s.hookClip ? {file: s.hookClip.file, cover: s.hookClip.cover ?? null} : null;
  const CUTS: {src: [number, number]; rate?: number}[] = [
    ...s.cuts.map((c) => ({src: c})),
    {src: s.suspense, rate: 0.4},
    ...s.after.map((a) => ({src: a})),
  ];
  // output time helpers (hook first)
  const segs: {src: [number, number]; out: number; rate: number}[] = [];
  let t = HOOK_CUT[1] - HOOK_CUT[0];
  for (const c of CUTS) {
    const rate = c.rate ?? 1;
    segs.push({src: c.src, out: t, rate});
    t += (c.src[1] - c.src[0]) / rate;
  }
  const total = t;
  const out = (src: number) => {
    const g = segs.find((q) => src >= q.src[0] && src <= q.src[1]);
    return g ? g.out + (src - g.src[0]) / g.rate : null;
  };
  const revealOut = out(s.card.revealAt)!;
  const reactOut = out(s.reactionAt)!;
  const hookLen = HOOK_CUT[1] - HOOK_CUT[0];

  const LAYOUTS: {from: number; layout: Layout}[] = [
    {from: 0, layout: 'full'},
    {from: s.card.revealAt, layout: 'reveal'},
    {from: s.reactionAt, layout: 'reaction'},
  ];
  const WHIPS = [s.card.revealAt, s.reactionAt];
  const SUSPENSE = {from: Math.max(hookLen + 500, revealOut - 3500), waitText: revealOut - 1100};

  const BANNER_BEFORE: BannerPart[] = [
    {text: 'ONLY '}, {text: s.banner.count, color: '#E8231F'}, {text: ' OF THIS '}, {text: s.banner.price, color: '#16B83E'},
    {text: `\n${s.banner.teaser} `}, {emoji: '1f440'},
  ];
  const BANNER_AFTER: BannerPart[] = [
    {text: 'ONLY '}, {text: s.banner.count, color: '#E8231F'}, {text: ' OF THIS '}, {text: s.banner.price, color: '#16B83E'},
    {text: `\n${s.banner.named} `}, {emoji: '1f48e'},
  ];
  const CARD = {...s.card, zoom: s.card.zoom ?? 1.5};
  const HOOK_TITLE = {name: 'WHO IS IT?', parallel: s.stamp ?? '1/1', price: s.card.price};
  const questionSrc = s.questionAt ?? s.reactionAt + 5500;
  const QUESTION = {from: questionSrc, text: 'KEEP IT OR SELL IT?', emoji: '1f914'};

  // ---- host captions: chunks of <= 3 words, split on pauses ----
  const kept = (ms: number) => [...s.cuts, ...s.after].some(([a, b]) => ms >= a && ms < b);
  const capsFrom = (inRange: (ms: number) => boolean, end: number): Cap[] => {
    const ws = s.words.filter((w) => inRange(w.startMs) && w.text.trim());
    const caps: Cap[] = [];
    let cur: RawWord[] = [];
    const flush = (next?: RawWord) => {
      if (!cur.length) return;
      const last = cur[cur.length - 1];
      const to = Math.min(next ? next.startMs : end, last.endMs + 450);
      caps.push({words: cur.map((w) => {
        const tx = clean(w.text);
        const c = /GOD|WAY|LOGO|GO!|LET'S|ONE|LAMB/.test(tx) ? (/GOD|WAY|GO/.test(tx) ? G : Y) : undefined;
        return {text: tx, at: w.startMs, color: c};
      }), to});
      cur = [];
    };
    ws.forEach((w, i) => {
      const prev = cur[cur.length - 1];
      if (cur.length >= 3 || (prev && w.startMs - prev.endMs > 400)) flush(w);
      cur.push(w);
      if (i === ws.length - 1) flush();
    });
    return caps;
  };
  // quietBefore: 0 = the hosts give the player away before the reveal: mute them and drop their captions.
  const CAPTIONS = capsFrom((ms) => kept(ms) && !(ms >= s.suspense[0] && ms < s.card.revealAt) && (s.quietBefore !== 0 || ms >= s.card.revealAt), s.after[s.after.length - 1][1]);
  const HOOK_CAPTIONS: Cap[] = s.hookClip
    ? [{words: s.hookClip.words, to: s.hookClip.to, emoji: '1f631'}]
    : s.hookWords
    ? [{words: s.hookWords, to: HOOK_CUT[1], emoji: '1f631'}]
    : capsFrom((ms) => ms >= HOOK_CUT[0] && ms < HOOK_CUT[1], HOOK_CUT[1]);

  // ---- narration placement (output ms) ----
  const NARRATION: Line[] = [];
  // merge split numbers ("$200" ",000") back into one word
  const n = (s.narration ?? []).map((l) => ({...l, words: l.words.reduce<{text: string; at: number}[]>((acc, w) => {
    if (acc.length && /^[,.]?\d/.test(w.text) && /\d$/.test(acc[acc.length - 1].text)) {
      acc[acc.length - 1] = {...acc[acc.length - 1], text: acc[acc.length - 1].text + w.text.trim()};
    } else acc.push(w);
    return acc;
  }, []).filter((w, i, ws) => i === 0 || w.text !== ws[i - 1].text)})); // whisper sometimes doubles the last word
  if (n.length === 3) {
    // short format (15-25 s Shorts): tease after the hook, whisper right before the reveal, hype on it
    const len = (l: NarrLine) => l.file[1] - l.file[0];
    const color = (tx: string) => s.narrColors?.[tx.replace(/[!?.,]/g, '')];
    const mk = (l: NarrLine, at: number, emoji?: string): Line => ({
      out: Math.round(at), file: [l.file[0], l.file[1]], emoji,
      words: l.words.map((w) => ({text: clean(w.text), at: w.at, color: color(clean(w.text))})),
    });
    const l2at = revealOut - 250 - len(n[1]);
    NARRATION.push(mk(n[0], Math.min(hookLen + 200, l2at - len(n[0]) - 150)), mk(n[1], l2at, '1f440'), mk(n[2], revealOut + 500, '1f48e'));
  }
  if (n.length >= 5) {
    const len = (l: NarrLine) => l.file[1] - l.file[0];
    const color = (tx: string) => s.narrColors?.[tx.replace(/[!?.,]/g, '')];
    const mk = (l: NarrLine, at: number, emoji?: string): Line => ({
      out: Math.round(at), file: [l.file[0], l.file[1]], emoji,
      words: l.words.map((w) => {
        const tx = clean(w.text);
        return {text: tx, at: w.at, color: color(tx)};
      }),
    });
    const l3at = revealOut - 250 - len(n[2]);
    const l1at = hookLen + 250;
    const l2at = Math.max(l1at + len(n[0]) + 600, (l1at + len(n[0]) + l3at - len(n[1])) / 2);
    NARRATION.push(mk(n[0], l1at), mk(n[1], Math.min(l2at, l3at - len(n[1]) - 200)), mk(n[2], l3at, '1f440'),
      mk(n[3], revealOut + 550, '1f48e'), mk(n[4], Math.min(total - len(n[4]) - 200, out(questionSrc) ?? total - 2500)));
  }

  const OUT_SFX: Sfx[] = [
    {file: 'cinematic-suspense-riser.mp3', at: revealOut, volume: 0.55, onset: 6200, maxMs: 6200},
    {file: 'heartbeat-loud.mp3', at: SUSPENSE.from, volume: 0.9, onset: 280, maxMs: revealOut - SUSPENSE.from - 50},
    {file: 'bass-boosted-vine-boom.mp3', at: revealOut, volume: 0.35, onset: 20},
    {file: '808-boom.mp3', at: revealOut, volume: 0.45, onset: 0},
  ];
  const HOOK_SFX: Sfx[] = [{file: 'air-horn.mp3', at: HOOK_CUT[0] + 150, volume: s.hookClip ? 0.12 : 0.25, onset: 30, maxMs: 1400}];
  const SFX: Sfx[] = [
    {file: 'fast-whoosh.mp3', at: s.card.revealAt, volume: 0.6, onset: 550},
    {file: 'cha-ching.mp3', at: s.card.revealAt + 20, volume: 0.9, onset: 640},
    {file: 'cha-ching.mp3', at: s.card.revealAt + 600, volume: 0.6, onset: 640},
    {file: 'fast-whoosh.mp3', at: s.reactionAt, volume: 0.6, onset: 550},
    {file: 'air-horn.mp3', at: s.reactionAt + 300, volume: 0.15, onset: 30},
    {file: 'crowd-cheer.mp3', at: s.reactionAt + 300, volume: 0.1, onset: 380, maxMs: 6000},
    {file: 'ding-2.mp3', at: questionSrc, volume: 0.35, onset: 140, maxMs: 1200},
  ];
  const quiet = s.quietBefore ?? 1;
  const DIALOGUE_GAIN = (src: number) => (src < s.card.revealAt ? quiet : 0.85);
  const MUSIC = {file: s.music?.file ?? 'montagem-alquimia.mp3', dropAt: s.music?.drop ?? 3920,
    bodyFrom: s.music ? s.music.drop : 4600, length: s.music?.length ?? 14990,
    quiet: 0.12, gap: 0.18, build: 0.28, loud: 0.3, underNarration: 0.06, gapBeforeDrop: 250};
  const SPEECH: [number, number][] = s.words.map((w) => [w.startMs, w.endMs]);

  return {
    SRC: s.src, GEOM: s.geom, CARD_STILL: s.still, STAMP: s.stamp ?? '1 OF 1',
    HOOK_CUT, HOOK_CLIP, HOOK_BLUR: s.hookBlur ?? null, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
    BLURS: s.blurs, ZOOMS: s.zooms ?? [], MONEY_MS: 2600, QUESTION,
    TRACK: s.track ?? [], TRACK_UNTIL: s.track?.length ? s.track[s.track.length - 1].at : 0,
    HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS,
    NARRATION_FILE: s.narrFile ?? '', NARRATION, NARRATION_CHUNK: 3,
    OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH,
  };
};
