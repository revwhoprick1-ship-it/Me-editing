// Jaxson Dart Pink Papa auto 1/1 ($200,000+), Topps Chrome Sapphire NFL, Historical Big Pulls.
// Source: footage/batch/alt_jaxon_papa.mp4 from 20 s (1080x1920; hosts cam top, burned banner, card cam).
import narration from '../../../public/narr/dart.json';
import words from '../data/c3_dart.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards/c3_dart.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 440,
    hosts: {x: 0, y: 0, w: 1080, h: 440}, card: {x: 0, y: 495, w: 1080, h: 1425}, react: {x: 60, y: 100, w: 960, h: 340}, ringR: 105},
  still: {file: 'cards/dart.png', w: 450, h: 550},
  card: {name: 'JAXSON DART', parallel: 'PINK PAPA AUTO 1/1', price: '$200,000+', revealAt: 40500,
    center: {x: 440, y: 1035}, serial: {x: 560, y: 960}, zoom: 1.45},
  hook: [91000, 93800],
  cuts: [[0, 7000], [12400, 16300], [18800, 22400]],
  suspense: [39300, 40500],
  after: [[40500, 42500], [91000, 107300]],
  reactionAt: 91000,
  questionAt: 104700,
  blurs: [{from: 38000, to: 40500, box: [120, 760, 760, 760]}],
  zooms: [{from: 15000, to: 16300, scale: 1.12, x: 540, y: 1100}, {from: 18800, to: 20000, scale: 1.1, x: 540, y: 1100},
    {from: 97700, to: 100200, scale: 1.15, x: 700, y: 300}],
  track: [{at: 91200, x: 762, y: 239}, {at: 91400, x: 744, y: 150}, {at: 91600, x: 716, y: 143}, {at: 91800, x: 680, y: 154}, {at: 92000, x: 652, y: 152}, {at: 92200, x: 632, y: 142}, {at: 92400, x: 623, y: 114}, {at: 92600, x: 626, y: 94}, {at: 92800, x: 634, y: 89}, {at: 93000, x: 649, y: 90}, {at: 93200, x: 679, y: 100}, {at: 93400, x: 722, y: 162}, {at: 93600, x: 750, y: 260}, {at: 93800, x: 754, y: 254}, {at: 94000, x: 762, y: 195}, {at: 94200, x: 772, y: 187}, {at: 94400, x: 776, y: 248}, {at: 94600, x: 764, y: 378}, {at: 94800, x: 744, y: 446}, {at: 95000, x: 748, y: 364}, {at: 95200, x: 770, y: 288}, {at: 95400, x: 786, y: 314}, {at: 95600, x: 788, y: 362}, {at: 95800, x: 783, y: 389}, {at: 96000, x: 778, y: 318}, {at: 96200, x: 757, y: 228}, {at: 96400, x: 702, y: 170}, {at: 96600, x: 662, y: 141}, {at: 96800, x: 650, y: 118}, {at: 97000, x: 658, y: 98}, {at: 97200, x: 657, y: 104}, {at: 97400, x: 662, y: 105}, {at: 97600, x: 660, y: 104}, {at: 97800, x: 660, y: 104}, {at: 98000, x: 659, y: 104}, {at: 98200, x: 660, y: 104}, {at: 98400, x: 660, y: 104}, {at: 98600, x: 660, y: 104}, {at: 98800, x: 660, y: 104}, {at: 99000, x: 660, y: 104}, {at: 99200, x: 659, y: 104}, {at: 99400, x: 658, y: 102}, {at: 99600, x: 657, y: 101}, {at: 99800, x: 655, y: 100}, {at: 100000, x: 654, y: 100}, {at: 100200, x: 653, y: 100}, {at: 100400, x: 653, y: 99}, {at: 100600, x: 653, y: 99}, {at: 100800, x: 653, y: 99}, {at: 101000, x: 654, y: 100}],
  banner: {count: '1', price: '$200,000', teaser: 'NFL ROOKIE... WHO IS IT?', named: 'JAXSON DART ROOKIE!'},
  words,
  narration, narrFile: 'narr/dart_loud.mp3',
  narrColors: {JAXSON: '#FFE14D', DART: '#FFE14D', PAPA: '#FFE14D', AUTO: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D',
    '$200,000': '#5CFF5C', KEEP: '#5CFF5C', SELL: '#FF4D4D', SAPPHIRE: '#FFE14D', RED: '#FF4D4D', BLUE: '#5CC8FF'},
  quietBefore: 1.4,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
