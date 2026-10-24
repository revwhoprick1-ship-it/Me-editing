// Edit plan: "Cooper Flagg Arrivals 1/1" (Topps Finest, $13,725) from the
// Backyard Breaks sheet, Historical Big Pulls tab. Source: footage/flagg_arrivals.mp4
// (1080x1920, already the stream layout: hosts cam y 0-420, burned banner
// ~427-607, card cam below). ALL TIMES ARE SOURCE MS.

export const SRC = 'flagg/input.mp4';

// Hook: open on the screaming (plays first, before the main cuts).
export const HOOK_CUT: [number, number] = [32300, 33900];
// Main story, in order.
export const CUTS: [number, number][] = [
  [4900, 7300], // "come on, come on"
  [9100, 12100], // Joan Beringer, Larry Bird
  [14900, 18400], // VJ Edgecombe "First", nice hit
  [27400, 45400], // next card... ARRIVALS 1/1 → reaction
];

export type Layout = 'full' | 'reveal' | 'reaction';
export const LAYOUTS: {from: number; layout: Layout}[] = [
  {from: 0, layout: 'full'},
  {from: 29000, layout: 'reveal'},
  {from: 30600, layout: 'reaction'},
];

// In-place whip (motion blur) where there's no cut but the scene changes.
export const WHIPS = [29000, 30600];

export const BANNER = [
  {text: 'ONLY ', color: 'black'}, {text: '1', color: '#E8231F'}, {text: ' OF THIS ', color: 'black'},
  {text: '$13,725', color: '#16B83E'}, {text: '\nCOOPER FLAGG ROOKIE!', color: 'black'},
];

export const CARD = {
  name: 'COOPER FLAGG', parallel: 'ARRIVALS 1/1', price: '$13,725',
  revealAt: 29000, // card swipes in
  center: {x: 550, y: 1460}, // card centre in the source frame at the reveal
  serial: {x: 705, y: 1385}, // where the 1/1 is printed (the arrow points here)
};

export const QUESTION = {from: 40000, text: 'KEEP IT OR SELL IT?', emoji: '1f914'};

// Red circle tracking the host who loses it (source px, hosts cam).
export const TRACK: {at: number; x: number; y: number}[] = [
  {at: 30600, x: 580, y: 135}, {at: 31000, x: 615, y: 110}, {at: 31400, x: 640, y: 80}, {at: 32000, x: 560, y: 80}, {at: 32500, x: 615, y: 50},
  {at: 33000, x: 585, y: 55}, {at: 33500, x: 630, y: 45}, {at: 34000, x: 750, y: 85},
  {at: 34500, x: 570, y: 85}, {at: 35000, x: 540, y: 110}, {at: 35500, x: 600, y: 110},
  {at: 36000, x: 630, y: 110}, {at: 36500, x: 630, y: 110}, {at: 37000, x: 600, y: 110},
  {at: 37500, x: 525, y: 95}, {at: 38000, x: 540, y: 100},
];
export const TRACK_UNTIL = 38200;

const Y = '#FFE14D';
const G = '#5CFF5C';
const R = '#FF4D4D';
export type Word = {text: string; at: number; color?: string};
export type Cap = {words: Word[]; to: number; emoji?: string; action?: boolean};
const w = (text: string, at: number, color?: string): Word => ({text, at, color});

export const HOOK_CAPTIONS: Cap[] = [
  {words: [w('ONE', 32500, R), w('OF', 32700, R), w('ONE!', 32760, R)], to: 33900, emoji: '1f631'},
];

// Word times: whisper, snapped to speech onsets (scripts/speech_segments.py).
export const CAPTIONS: Cap[] = [
  {words: [w('COME', 5080), w('ON', 5250, G)], to: 5700},
  {words: [w('COME', 5780), w('ON', 5950, G)], to: 6600},
  {words: [w('COME', 6720), w('ON!', 6880, G)], to: 7300},
  {words: [w('JOAN', 9200, Y), w('BERINGER', 9500, Y)], to: 10900},
  {words: [w('LARRY', 11040, Y), w('BIRD', 11450, Y)], to: 12100, emoji: '1f410'},
  {words: [w('VJ', 14980, Y), w('EDGECOMBE', 15420, Y)], to: 16500},
  {words: [w('ON', 16600), w('THE', 16800), w('FIRST', 17000, G)], to: 17600},
  {words: [w('NICE', 17700), w('HIT', 17900, G), w('THERE', 18160)], to: 18400, emoji: '1f525'},
  {words: [w('*NEXT CARD...*', 27600)], to: 29000, action: true, emoji: '1f440'},
  {words: [w('OH', 30020), w('MY', 30300), w('GOSH', 30600, G)], to: 31400, emoji: '1f631'},
  {words: [w('ONE', 32500, R), w('OF', 32700, R), w('ONE!', 32760, R)], to: 33300, emoji: '1f48e'},
  {words: [w('*SCREAMING*', 33300)], to: 34380, action: true},
  {words: [w("LET'S", 34380), w('GO!', 35540, G)], to: 35740},
  {words: [w('OH', 35740), w('MY', 36540), w('GOSH', 36700, G)], to: 37380},
  {words: [w("LET'S", 37380), w('GO!', 37580, G)], to: 37940},
  {words: [w('OH', 37940), w("I'M", 38260), w('GLAD', 38500, Y)], to: 39060},
  {words: [w("I'M", 39060), w('JOINING', 39560)], to: 40280},
  {words: [w('THIS', 41450), w('IS', 41860), w('WHY', 42200)], to: 42660},
  {words: [w('ANTOINE', 42660, Y), w('STAYED', 43200)], to: 43420},
  {words: [w('IN', 43420), w('THE', 43740), w('ROOM', 43840, G)], to: 45400},
];

export type Sfx = {file: string; at: number; volume: number; onset: number; maxMs?: number};
// `at` in source ms of the MAIN cuts; hook SFX are in HOOK_SFX.
export const HOOK_SFX: Sfx[] = [
  {file: 'air-horn.mp3', at: 32300, volume: 0.35, onset: 30, maxMs: 1500},
];
export const SFX: Sfx[] = [
  {file: 'ding-2.mp3', at: 9200, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'ding-2.mp3', at: 11040, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'ding-2.mp3', at: 14980, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'fast-whoosh.mp3', at: 29000, volume: 0.6, onset: 550},
  {file: 'vine-boom.mp3', at: 29050, volume: 0.6, onset: 80},
  {file: 'ding-2.mp3', at: 29300, volume: 0.35, onset: 140, maxMs: 1200},
  {file: 'cha-ching.mp3', at: 29900, volume: 0.9, onset: 640},
  {file: 'fast-whoosh.mp3', at: 30600, volume: 0.6, onset: 550},
  {file: 'air-horn.mp3', at: 31700, volume: 0.35, onset: 30},
  {file: 'crowd-cheer.mp3', at: 31700, volume: 0.3, onset: 380, maxMs: 6000},
  {file: 'ding-2.mp3', at: 40000, volume: 0.35, onset: 140, maxMs: 1200},
];
// Every cut boundary also gets a whoosh + motion-blur whip (added in code).

// Quiet stream mic before the pull → boost it; music sits lower there.
export const DIALOGUE_GAIN = (src: number) => (src < 30000 ? 1.9 : 0.85);
export const MUSIC = {file: 'du-bist-gut-genug.mp3', quiet: 0.13, gap: 0.2, loud: 0.3, loudFrom: 30000};
export const SPEECH: [number, number][] = [
  [5080, 7300], [9200, 12100], [14980, 18400], [30000, 45400],
];
