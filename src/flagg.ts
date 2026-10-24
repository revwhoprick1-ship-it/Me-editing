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
  {from: 29400, layout: 'reveal'},
  {from: 30600, layout: 'reaction'},
];

// In-place whip (motion blur) where there's no cut but the scene changes.
export const WHIPS = [29400, 30600];

// Banner hides who it is until the reveal (curiosity), then names him.
export type BannerPart = {text?: string; color?: string; emoji?: string};
export const BANNER_BEFORE: BannerPart[] = [
  {text: 'ONLY '}, {text: '1', color: '#E8231F'}, {text: ' OF THIS '}, {text: '$13,725', color: '#16B83E'},
  {text: '\nROOKIE... WHO IS IT? '}, {emoji: '1f440'},
];
export const BANNER_AFTER: BannerPart[] = [
  {text: 'ONLY '}, {text: '1', color: '#E8231F'}, {text: ' OF THIS '}, {text: '$13,725', color: '#16B83E'},
  {text: '\nCOOPER FLAGG ROOKIE! '}, {emoji: '1f48e'},
];

export const CARD = {
  name: 'COOPER FLAGG', parallel: 'ARRIVALS 1/1', price: '$13,725',
  revealAt: 29400, // unblur + flash + money + music drop (card swipes in at 29.0)
  center: {x: 550, y: 1460}, // card centre in the source frame at the reveal
  serial: {x: 705, y: 1385}, // where the 1/1 is printed (the arrow points here)
};

// Cards stay blurred until they're named / revealed (source ms + box in source px).
export const BLURS: {from: number; to: number; box: [number, number, number, number]}[] = [
  {from: 5600, to: 7300, box: [170, 820, 720, 1060]}, // Joan Beringer card before it's named
  {from: 9100, to: 9250, box: [170, 820, 720, 1060]},
  {from: 10150, to: 11040, box: [170, 820, 720, 1060]}, // Larry Bird before "Larry Bird"
  {from: 28950, to: 29400, box: [170, 900, 760, 1000]}, // the Flagg card swiping in
];

// Small punch-in zooms on the beats that matter (source ms; x,y = focus in source px).
export const ZOOMS: {from: number; to: number; scale: number; x: number; y: number}[] = [
  {from: 5080, to: 5700, scale: 1.1, x: 540, y: 1300},
  {from: 6720, to: 7300, scale: 1.15, x: 540, y: 1300},
  {from: 9200, to: 10100, scale: 1.12, x: 470, y: 1250},
  {from: 11040, to: 12100, scale: 1.15, x: 500, y: 1250},
  {from: 14980, to: 16500, scale: 1.12, x: 520, y: 1250},
  {from: 17900, to: 18400, scale: 1.18, x: 520, y: 1250},
  // reaction layout: focus is in hosts-cam source px
  {from: 32500, to: 33300, scale: 1.18, x: 640, y: 120},
  {from: 35540, to: 36300, scale: 1.12, x: 620, y: 140},
  {from: 36700, to: 37380, scale: 1.12, x: 600, y: 140},
];

// Reveal: green flash + falling money (iOS 💵💸💰) for this long.
export const MONEY_MS = 2600;

export const QUESTION = {from: 40000, text: 'KEEP IT OR SELL IT?', emoji: '1f914'};

// Red circle tracking the host who loses it (source px, hosts cam).
// From scripts/track.py (OpenCV CSRT on his head, torso fallback when he jumps
// out of frame); y clamped so the ring stays on screen.
export const TRACK: {at: number; x: number; y: number}[] = [
  {at: 30600, x: 658, y: 178},
  {at: 30800, x: 658, y: 180},
  {at: 31000, x: 658, y: 186},
  {at: 31200, x: 654, y: 189},
  {at: 31400, x: 656, y: 169},
  {at: 31633, x: 660, y: 80},
  {at: 31833, x: 678, y: 45},
  {at: 32067, x: 684, y: 45},
  {at: 32300, x: 658, y: 45},
  {at: 32533, x: 642, y: 45},
  {at: 32733, x: 624, y: 45},
  {at: 32933, x: 626, y: 45},
  {at: 33133, x: 626, y: 45},
  {at: 33333, x: 644, y: 45},
  {at: 33567, x: 656, y: 45},
  {at: 33800, x: 670, y: 45},
  {at: 34033, x: 680, y: 45},
  {at: 34233, x: 696, y: 45},
  {at: 34433, x: 694, y: 45},
  {at: 34633, x: 680, y: 45},
  {at: 34833, x: 639, y: 84},
  {at: 35033, x: 622, y: 118},
  {at: 35233, x: 612, y: 94},
  {at: 35433, x: 604, y: 94},
  {at: 35633, x: 598, y: 95},
  {at: 35833, x: 604, y: 96},
  {at: 36033, x: 600, y: 97},
  {at: 36233, x: 588, y: 98},
  {at: 36433, x: 582, y: 98},
  {at: 36633, x: 580, y: 98},
  {at: 36833, x: 582, y: 100},
  {at: 37033, x: 582, y: 100},
  {at: 37233, x: 582, y: 100},
  {at: 37433, x: 586, y: 98},
  {at: 37633, x: 594, y: 95},
  {at: 37833, x: 596, y: 92},
  {at: 38033, x: 594, y: 91},
  {at: 38233, x: 584, y: 96},
  {at: 38433, x: 578, y: 100},
  {at: 38633, x: 576, y: 108}

];
export const TRACK_UNTIL = 38600;

const Y = '#FFE14D';
const G = '#5CFF5C';
const R = '#FF4D4D';
export const HOOK_TITLE = {name: 'WHO IS IT?', parallel: '1/1', price: '$13,725'};

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
  {file: 'air-horn.mp3', at: 32300, volume: 0.3, onset: 30, maxMs: 1500},
];
export const SFX: Sfx[] = [
  {file: 'ding-2.mp3', at: 9200, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'ding-2.mp3', at: 11040, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'ding-2.mp3', at: 14980, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'fast-whoosh.mp3', at: 29400, volume: 0.6, onset: 550},
  {file: 'vine-boom.mp3', at: 29400, volume: 0.55, onset: 80},
  {file: 'cha-ching.mp3', at: 29420, volume: 0.9, onset: 640}, // ka-ching with the money drop
  {file: 'ding-2.mp3', at: 29550, volume: 0.3, onset: 140, maxMs: 1200},
  {file: 'cha-ching.mp3', at: 30000, volume: 0.6, onset: 640}, // price line pops
  {file: 'fast-whoosh.mp3', at: 30600, volume: 0.6, onset: 550},
  {file: 'air-horn.mp3', at: 31700, volume: 0.35, onset: 30},
  {file: 'crowd-cheer.mp3', at: 31700, volume: 0.3, onset: 380, maxMs: 6000},
  {file: 'ding-2.mp3', at: 40000, volume: 0.35, onset: 140, maxMs: 1200},
];
// Every cut boundary also gets a whoosh + motion-blur whip (added in code).

// Quiet stream mic before the pull → boost it; music sits lower there.
export const DIALOGUE_GAIN = (src: number) => (src < 30000 ? 1.9 : 0.85);
// Non-podcast music (user's phonk list). Montagem Alquimia: intro build 0–3.92 s,
// bass drop at 3.92 s (librosa: 107.7 BPM). The drop lands exactly on the reveal.
export const MUSIC = {file: 'montagem-alquimia.mp3', dropAt: 3920, bodyFrom: 4600, length: 14990,
  quiet: 0.12, gap: 0.18, build: 0.24, loud: 0.3};
export const SPEECH: [number, number][] = [
  [5080, 7300], [9200, 12100], [14980, 18400], [30000, 45400],
];
