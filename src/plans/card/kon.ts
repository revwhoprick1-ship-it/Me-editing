// Kon Knueppel Papa auto 1/1 ($100,000), Topps Chrome Sapphire NBA, Historical Big Pulls.
// Source: footage/batch/alt_kon_papa.mp4 (1080x1920; hosts cam top, burned banner, card cam).
import narration from '../../../public/narr/kon.json';
import words from '../data/c4_kon.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards/c4_kon.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 480,
    hosts: {x: 0, y: 0, w: 1080, h: 480}, card: {x: 0, y: 620, w: 1080, h: 1300}, react: {x: 40, y: 0, w: 1000, h: 480}, ringR: 110},
  still: {file: 'cards/kon.png', w: 390, h: 470},
  card: {name: 'KON KNUEPPEL', parallel: 'PAPA AUTO 1/1', price: '$100,000', revealAt: 22600,
    center: {x: 500, y: 1230}, serial: {x: 600, y: 1150}, zoom: 1.5},
  hook: [24000, 27300],
  cuts: [[11500, 15500], [15900, 20600]],
  suspense: [21300, 22600],
  after: [[22600, 30000], [46000, 50500], [54300, 61900]],
  reactionAt: 24000,
  questionAt: 58800,
  blurs: [{from: 21300, to: 22600, box: [150, 980, 800, 820]}],
  zooms: [{from: 11700, to: 13600, scale: 1.12, x: 540, y: 1200}, {from: 18100, to: 20600, scale: 1.15, x: 540, y: 1250},
    {from: 24300, to: 26000, scale: 1.15, x: 320, y: 160}, {from: 56900, to: 58500, scale: 1.12, x: 400, y: 200}],
  track: [{at: 24200, x: 346, y: -33}, {at: 24400, x: 408, y: 30}, {at: 24600, x: 407, y: 28}, {at: 24800, x: 386, y: 26}, {at: 25000, x: 356, y: 34}, {at: 25200, x: 324, y: 36}, {at: 25400, x: 294, y: 34}, {at: 25600, x: 292, y: 32}, {at: 25800, x: 293, y: 34}, {at: 26000, x: 302, y: 38}, {at: 26200, x: 312, y: 37}, {at: 26400, x: 310, y: 41}, {at: 26633, x: 298, y: 41}, {at: 26833, x: 272, y: 44}, {at: 27033, x: 214, y: 51}, {at: 27233, x: 164, y: 51}, {at: 27467, x: 142, y: 42}, {at: 27667, x: 156, y: 47}, {at: 27867, x: 192, y: 51}, {at: 28067, x: 250, y: 54}, {at: 28300, x: 308, y: 52}, {at: 28500, x: 346, y: 48}, {at: 28700, x: 380, y: 53}, {at: 28900, x: 424, y: 58}, {at: 29133, x: 480, y: 55}, {at: 29333, x: 504, y: 46}, {at: 29533, x: 526, y: 42}, {at: 29733, x: 554, y: 42}, {at: 29967, x: 592, y: 46}],
  banner: {count: '1', price: '$100,000', teaser: 'NBA ROOKIE... WHO IS IT?', named: 'KON KNUEPPEL ROOKIE!'},
  words,
  narration, narrFile: 'narr/kon_loud.mp3',
  narrColors: {KON: '#FFE14D', KNUEPPEL: '#FFE14D', PAPA: '#FFE14D', AUTO: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D',
    '$100,000': '#5CFF5C', KEEP: '#5CFF5C', SELL: '#FF4D4D', SAPPHIRE: '#FFE14D', PINK: '#FF6EC7', AGAIN: '#5CFF5C'},
  quietBefore: 1.2,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
