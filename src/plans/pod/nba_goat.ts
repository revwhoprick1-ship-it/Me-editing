// Edit decision list for public/input.mp4 (1920x1080 source).
// ALL TIMES ARE SOURCE MILLISECONDS. Word times come from faster-whisper,
// snapped to real speech onsets from scripts/speech_segments.py
// (see vault/04 Projects/NBA GOAT pick.md for the verified table).

// Source ranges to keep. The 6 s thinking silence is cut down to ~3.3 s.
export const CUTS: [number, number][] = [
  [0, 9700],
  [12500, 18810],
];

const LEFT = 370;
const MID = 960;
const RIGHT = 1490;

type Crop = {x: number; y: number; h: number};
// crop  = full-screen close-up (smaller h = tighter)
// stack = wide shot top third + close-up underneath (Ref A)
// wide  = full frame over a blurred fill
// bw    = black & white reaction punch-in
export type Shot =
  | ({from: number; kind: 'crop' | 'bw'; who?: 'L' | 'M' | 'R'} & Crop)
  | ({from: number; kind: 'stack'; circleX?: number; who?: 'L' | 'M' | 'R'} & Crop)
  | {from: number; kind: 'wide'; who?: undefined};

export const SHOTS: Shot[] = [
  {from: 0, kind: 'stack', x: LEFT, y: 40, h: 760, circleX: MID}, // circle who's about to be asked
  {from: 2300, kind: 'crop', x: LEFT, y: 50, h: 760}, // "who is your"
  {from: 3250, kind: 'crop', x: LEFT, y: 90, h: 600}, // punch on "GOAT?"
  {from: 3560, kind: 'crop', x: MID, y: 20, h: 820}, // his reaction
  {from: 4400, kind: 'crop', x: MID, y: 70, h: 640}, // "NBA GOAT?" (disbelief)
  {from: 5560, kind: 'crop', x: LEFT, y: 40, h: 800},
  {from: 7400, kind: 'stack', x: MID, y: 40, h: 760}, // thinking...
  {from: 8850, kind: 'crop', x: MID, y: 90, h: 620}, // sigh
  {from: 12500, kind: 'crop', x: MID, y: 30, h: 820}, // after the jump cut
  {from: 13480, kind: 'crop', x: MID, y: 60, h: 720}, // "gotta be"
  {from: 14085, kind: 'crop', x: MID, y: 100, h: 580}, // "Matthew"
  {from: 14414, kind: 'stack', x: MID, y: 110, h: 560}, // the pick: flash + label
  {from: 14950, kind: 'bw', x: LEFT, y: 40, h: 700}, // asker's reaction
  {from: 15700, kind: 'wide'}, // everyone loses it
  {from: 17450, kind: 'crop', x: RIGHT, y: 40, h: 800}, // "I can feel the tension"
];

export const YELLOW = '#FFE14D';
export const GREEN = '#5CFF5C';
export const RED = '#FF4D4D';

export type Word = {text: string; at: number; color?: string};
export type CaptionGroup = {
  words: Word[];
  to: number;
  emoji?: string; // public/emoji-ios/<code>.png, shown above the line
  action?: boolean; // *ASTERISK* sound/action caption
  big?: boolean;
};

const w = (text: string, at: number, color?: string): Word => ({text, at, color});

export const CAPTIONS: CaptionGroup[] = [
  {words: [w('BRING', 20), w('IT', 111), w('UP', 225)], to: 317},
  {words: [w('BUT', 317), w('I', 454), w('WANT', 522), w('TO', 613)], to: 704},
  {words: [w('ASK', 704), w('YOU', 910), w('THE', 1024), w('QUESTION', 1138, YELLOW)], to: 1412},
  {words: [w('BEFORE', 1412)], to: 2000},
  {words: [w('WHO', 2300), w('IS', 2470), w('YOUR', 2620)], to: 2800},
  {words: [w('NBA', 2800, YELLOW), w('GOAT?', 3250, GREEN)], to: 3800, emoji: '1f410'},
  {words: [w('NBA', 4400, YELLOW), w('GOAT?', 4800, GREEN)], to: 5400, emoji: '1f62e'},
  {words: [w('GREATEST', 5560, YELLOW), w('OF', 6081), w('ALL', 6260), w('TIME', 6390)], to: 6586},
  {words: [w('NBA', 6586, YELLOW), w('PLAYER', 7025)], to: 7400, emoji: '1f3c0'},
  {words: [w('*THINKING...*', 7600)], to: 8850, action: true, emoji: '1f914'},
  {words: [w('*SIGHS*', 8850)], to: 9700, action: true, emoji: '23f3'},
  {words: [w('GOTTA', 13480), w('BE', 13895)], to: 14085},
  {words: [w('MATTHEW', 14085, YELLOW)], to: 14414},
  {words: [w('DELLAVEDOVA', 14414, GREEN)], to: 15000, big: true},
  {words: [w('*LAUGHS*', 15700)], to: 17400, action: true},
  {words: [w('I', 17500), w('CAN', 17640), w('FEEL', 17780)], to: 17980},
  {words: [w('THE', 17980), w('TENSION', 18140, RED)], to: 18810, emoji: '1f62c'},
];

// Plain caption on the top black bar for the whole video (podcast reference).
export const HOOK = {text: 'Do you agree with this?', emoji: '1f480'};

// Cut-out photos (Wikimedia Commons, CC BY / CC BY-SA, see vault) that pop up
// at the bottom of the video box when someone is named, like the podcast reference.
export const CUTOUTS = [
  {from: 2800, to: 3560, images: [
    {file: 'kobe.png', h: 520, x: -20}, {file: 'lebron.png', h: 560, x: 330}, {file: 'jordan.png', h: 420, x: 640}]},
  {from: 5560, to: 7400, images: [
    {file: 'kobe.png', h: 520, x: -20}, {file: 'lebron.png', h: 560, x: 330}, {file: 'jordan.png', h: 420, x: 640}]},
  {from: 14414, to: 17450, images: [
    {file: 'delly3.png', h: 470, x: 40}, {file: 'delly1.png', h: 500, x: 520}]},
];

// Punchline: vine boom, green flash + bokeh, 💀 slam on the table, label on the split.
export const PUNCH: {at: number; to: number; label: string; sticker: string} | null = {at: 14414, to: 14950, label: '', sticker: '1f480'};

// B&W reaction meme counter.
export const AURA: {at: number; to: number; text: string; emoji: string} | null = {at: 15100, to: 15700, text: 'AURA -10000', emoji: '1f480'};

// Floating emoji while everyone laughs.
export const LAUGH: {from: number; to: number; emoji: string[]} | null = {from: 15700, to: 17450, emoji: ['1f602', '1f62d', '1f480']};

// at = the moment the sound should hit; onset (ms of silence at the start of the file)
// is subtracted automatically. maxMs trims long files.
export type Sfx = {file: string; at: number; volume: number; onset: number; maxMs?: number};
export const SFX: Sfx[] = [
  {file: 'fast-whoosh.mp3', at: 0, volume: 0.63, onset: 550},
  {file: 'fast-whoosh.mp3', at: 2300, volume: 0.36, onset: 550},
  {file: 'ding-2.mp3', at: 3250, volume: 0.5, onset: 140, maxMs: 1500},
  {file: 'record-scratch.mp3', at: 4400, volume: 0.45, onset: 40},
  {file: 'fast-whoosh.mp3', at: 5560, volume: 0.27, onset: 550},
  {file: 'crickets.mp3', at: 7550, volume: 0.5, onset: 120, maxMs: 2150},
  {file: 'fast-whoosh.mp3', at: 12500, volume: 0.54, onset: 550},
  {file: 'vine-boom.mp3', at: 14414, volume: 0.6, onset: 80},
  {file: 'camera-shutter.mp3', at: 14950, volume: 0.6, onset: 10},
  {file: 'error.mp3', at: 15100, volume: 0.5, onset: 110},
  {file: 'fast-whoosh.mp3', at: 15700, volume: 0.36, onset: 550},
];

// Music beds (Kevin MacLeod, CC BY 4.0 — credit in the description).
// Suspense under the question, cut to silence right before the answer,
// goofy track back in for the laugh. `duck` = volume while someone talks.
// offset = ms to skip at the start of the file (leading silence).
export type MusicBed = {file: string; from: number; to: number; volume: number; duck: number; offset?: number; loop?: boolean};
export const MUSIC: MusicBed[] = [
  // One song for the whole video (looped): the "Du bist gut genug" meme.
  {file: 'du-bist-gut-genug.mp3', from: 0, to: 18810, volume: 0.32, duck: 0.17, loop: true},
];

// Speech ranges (source ms) for ducking the music.
export const SPEECH: [number, number][] = [
  [20, 1800], [2300, 3560], [4400, 5340], [5560, 7400], [13480, 14950], [17500, 18700],
];
export const SRC = 'input.mp4';

// No face track / W Speed / action text in this older plan.
export const TRACK: import('./make').SeatTrack | null = null;
export const WSPEED: import('./make').WSpeed | null = null;
export const ACTIONS: import('./make').Action[] = [];
