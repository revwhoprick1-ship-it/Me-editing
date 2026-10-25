// Caitlin Clark Select Gold Vinyl auto 1/1 ($234,000), Historical Big Pulls.
// Source: footage/batch/p3_caitlin_clark_gold_vinyl.mp4 (720x1280; hosts PiP top, card cam below).
import narration from '../../../public/narr/clark.json';
import words from '../data/c2_clark.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards/c2_clark.mp4',
  geom: {srcW: 720, srcH: 1280, topH: 560,
    hosts: {x: 125, y: 75, w: 470, h: 295}, card: {x: 0, y: 380, w: 720, h: 900}, react: {x: 125, y: 75, w: 470, h: 295}, ringR: 110},
  still: {file: 'cards/clark.png', w: 280, h: 460},
  card: {name: 'CAITLIN CLARK', parallel: 'GOLD VINYL 1/1', price: '$234,000', revealAt: 16000,
    center: {x: 330, y: 780}, serial: {x: 300, y: 860}, zoom: 1.5},
  hook: [20000, 23400],
  cuts: [[0, 4400], [5000, 11800]],
  suspense: [14700, 16000],
  after: [[16000, 34500]],
  reactionAt: 18000,
  questionAt: 31000,
  blurs: [{from: 0, to: 16000, box: [40, 470, 660, 560]}],
  zooms: [{from: 5000, to: 6000, scale: 1.12, x: 360, y: 760}, {from: 9300, to: 11000, scale: 1.15, x: 360, y: 760},
    {from: 19800, to: 22000, scale: 1.15, x: 330, y: 200}],
  track: [{at: 18200, x: 324, y: 162}, {at: 18400, x: 339, y: 160}, {at: 18600, x: 348, y: 154}, {at: 18800, x: 358, y: 159}, {at: 19000, x: 390, y: 154}, {at: 19200, x: 400, y: 130}, {at: 19400, x: 398, y: 128}, {at: 19600, x: 378, y: 158}, {at: 19800, x: 350, y: 170}],
  banner: {count: '1', price: '$234,000', teaser: 'WNBA ROOKIE... WHO IS IT?', named: 'CAITLIN CLARK ROOKIE!'},
  words,
  narration, narrFile: 'narr/clark_loud.mp3',
  narrColors: {CAITLIN: '#FFE14D', CLARK: '#FFE14D', GOLD: '#FFE14D', VINYL: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D',
    '$234,000': '#5CFF5C', KEEP: '#5CFF5C', SELL: '#FF4D4D', SELECT: '#FFE14D', NAME: '#5CFF5C'},
  quietBefore: 1.3,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
