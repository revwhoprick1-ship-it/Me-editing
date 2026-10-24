// Edit decision list for public/input.mp4 (1920x1080 source).
// Times are in ms, taken from the whisper transcript (public/captions.json).

export type Shot = {
  from: number;
  // 'wide' = full frame over a blurred fill; otherwise a 9:16 crop
  // centred on x with height h (smaller h = tighter punch-in), top at y.
  wide?: boolean;
  x?: number;
  y?: number;
  h?: number;
};

const LEFT = 370;
const MID = 960;
const RIGHT = 1490;

export const SHOTS: Shot[] = [
  {from: 0, x: LEFT, y: 0, h: 900},
  {from: 2080, x: LEFT, y: 60, h: 720}, // punch in on the question
  {from: 4400, x: MID, y: 0, h: 900}, // "NBA GOAT?"
  {from: 5520, x: LEFT, y: 40, h: 820},
  {from: 7700, x: MID, y: 0, h: 900}, // thinking...
  {from: 11000, x: MID, y: 60, h: 720}, // "Gotta be"
  {from: 13480, x: MID, y: 110, h: 600}, // the pick, hard punch
  {from: 15040, wide: true}, // everyone loses it
  {from: 17500, x: RIGHT, y: 40, h: 820},
];

export type CaptionGroup = {from: number; to: number; text: string; key?: string};

export const CAPTIONS: CaptionGroup[] = [
  {from: 70, to: 860, text: 'BRING IT UP'},
  {from: 860, to: 1570, text: 'BUT I WANNA ASK YOU'},
  {from: 1570, to: 2080, text: 'BEFORE'},
  {from: 2080, to: 3160, text: 'WHO IS YOUR'},
  {from: 3160, to: 4400, text: 'NBA GOAT?', key: '#2EC8FF'},
  {from: 4450, to: 5520, text: 'NBA GOAT?', key: '#2EC8FF'},
  {from: 5590, to: 6350, text: 'GREATEST OF', key: '#4DFF6A'},
  {from: 6350, to: 6830, text: 'ALL TIME'},
  {from: 6830, to: 7700, text: 'NBA PLAYER'},
  {from: 11110, to: 12200, text: 'GOTTA BE'},
  {from: 12200, to: 13480, text: 'MATTHEW', key: '#FF4FD8'},
  {from: 13480, to: 15040, text: 'DELLAVEDOVA', key: '#FF4FD8'},
  {from: 17560, to: 18060, text: 'I CAN FEEL'},
  {from: 18060, to: 18810, text: 'THE TENSION', key: '#FF5A3C'},
];

export const HOOK = {to: 4400, text: 'HIS NBA GOAT PICK IS CRAZY...'};
