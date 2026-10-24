// Edit decision list for public/input.mp4 (1920x1080 source).
// Times are in ms, taken from the whisper transcript (public/captions.json).

type Crop = {x: number; y: number; h: number};

// crop  = full-screen 9:16 close-up (smaller h = tighter punch-in)
// stack = wide shot on top, close-up underneath (reference #2 layout)
// wide  = full frame over a blurred fill
// bw    = black & white reaction punch-in
export type Shot =
  | ({from: number; kind: 'crop' | 'bw'} & Crop)
  | ({from: number; kind: 'stack'} & Crop)
  | {from: number; kind: 'wide'};

const LEFT = 370;
const MID = 960;
const RIGHT = 1490;

export const SHOTS: Shot[] = [
  {from: 0, kind: 'crop', x: LEFT, y: 0, h: 900},
  {from: 2080, kind: 'crop', x: LEFT, y: 60, h: 720},
  {from: 3160, kind: 'stack', x: LEFT, y: 60, h: 700},
  {from: 4400, kind: 'crop', x: MID, y: 0, h: 860},
  {from: 5520, kind: 'crop', x: LEFT, y: 40, h: 800},
  {from: 7700, kind: 'stack', x: MID, y: 40, h: 760},
  {from: 9500, kind: 'crop', x: MID, y: 80, h: 680},
  {from: 11000, kind: 'crop', x: MID, y: 60, h: 760},
  {from: 12200, kind: 'crop', x: MID, y: 90, h: 640},
  {from: 13480, kind: 'stack', x: MID, y: 110, h: 560},
  {from: 14300, kind: 'bw', x: LEFT, y: 60, h: 640},
  {from: 15040, kind: 'wide'},
  {from: 16200, kind: 'crop', x: LEFT, y: 0, h: 1000},
  {from: 17500, kind: 'crop', x: RIGHT, y: 40, h: 800},
];

export type Word = {text: string; from: number};
// Words on screen together; `to` is when the group leaves.
export type CaptionGroup = {words: Word[]; to: number; color?: string; emoji?: string};

const YELLOW = '#FFE600';
const GREEN = '#3DFF6E';

const w = (text: string, from: number): Word => ({text, from});

export const CAPTIONS: CaptionGroup[] = [
  {words: [w('BRING', 70), w('IT', 410), w('UP', 550)], to: 860},
  {words: [w('BUT', 860), w('I', 900), w('WANNA', 940), w('ASK', 1000)], to: 1060},
  {words: [w('YOU', 1060), w('THE', 1100), w('QUESTION', 1120)], to: 1570},
  {words: [w('BEFORE', 1570)], to: 2080},
  {words: [w('WHO', 2080), w('IS', 2440), w('YOUR', 2670)], to: 3160},
  {words: [w('NBA', 3160), w('GOAT?', 3520)], to: 4400, emoji: '1f410'},
  {words: [w('NBA', 4500), w('GOAT?', 4800)], to: 5520, emoji: '1f410'},
  {words: [w('GREATEST', 5590), w('OF', 6180), w('ALL', 6350), w('TIME', 6540)], to: 6830},
  {words: [w('NBA', 6830), w('PLAYER', 7040)], to: 7700, emoji: '1f3c0'},
  {words: [w('HMM...', 8000)], to: 11000, emoji: '1f914'},
  {words: [w('GOTTA', 11110), w('BE', 11890)], to: 12200},
  {words: [w('MATTHEW', 12200)], to: 13480, emoji: '1f440'},
  {words: [w('DELLAVEDOVA', 13480)], to: 15040, color: GREEN, emoji: '1f633'},
  {words: [w('I', 17560), w('CAN', 17620), w('FEEL', 17840), w('THE', 18060), w('TENSION', 18250)], to: 18810, emoji: '1f62c'},
].map((g) => ({color: YELLOW, ...g}));

// Persistent hook at the top, like "WAIT FOR PICK #1..." in the reference.
export const HOOK = 'WAIT FOR HIS NBA GOAT PICK...';

// The punchline: green flash, floating emoji and a label on the split line.
export const PUNCH = {from: 13480, to: 15040, label: '*MATTHEW DELLAVEDOVA*', emoji: ['1f3c0', '1f525', '1f410']};

// Emoji that float up during the laugh.
export const LAUGH = {from: 15040, to: 17500, emoji: ['1f923']};
