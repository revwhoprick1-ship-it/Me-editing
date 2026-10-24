// Cade Cunningham 75th anniversary Logoman rookie auto 1/1 ($27,000+), National Treasures, Historical Big Pulls.
// Source: footage/batch/p6_cade_logoman.mp4 from 50 s (808x1432, single camera: table, then green-screen reaction).
import narration from '../../../public/narr/cade.json';
import words from '../data/c6_cade.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards/c6_cade.mp4',
  geom: {srcW: 808, srcH: 1432, topH: 0,
    hosts: {x: 0, y: 0, w: 808, h: 10}, card: {x: 0, y: 150, w: 808, h: 1180}, react: {x: 0, y: 200, w: 808, h: 760}, ringR: 120},
  still: {file: 'cards/cade.png', w: 560, h: 700},
  card: {name: 'CADE CUNNINGHAM', parallel: 'LOGOMAN AUTO 1/1', price: '$27,000+', revealAt: 56800,
    center: {x: 385, y: 780}, serial: {x: 400, y: 880}, zoom: 1.3},
  hook: [65000, 67500],
  hookBlur: [330, 560, 478, 760],
  cuts: [[0, 9500], [18200, 24600]],
  suspense: [55300, 56800],
  after: [[56800, 62500], [65000, 76000]],
  reactionAt: 65000,
  questionAt: 71500,
  blurs: [{from: 55300, to: 56800, box: [0, 450, 808, 900]}],
  zooms: [{from: 3900, to: 7000, scale: 1.12, x: 400, y: 700}, {from: 22600, to: 24600, scale: 1.1, x: 400, y: 700},
    {from: 69400, to: 71000, scale: 1.12, x: 330, y: 600}],
  track: [{at: 65200, x: 338, y: 668}, {at: 65400, x: 356, y: 641}, {at: 65633, x: 372, y: 624}, {at: 65833, x: 376, y: 579}, {at: 66033, x: 436, y: 552}, {at: 66233, x: 457, y: 526}, {at: 66433, x: 444, y: 576}, {at: 66667, x: 366, y: 780}, {at: 66900, x: 419, y: 723}],
  banner: {count: '1', price: '$27,000', teaser: 'NBA ROOKIE... WHO IS IT?', named: 'CADE CUNNINGHAM ROOKIE!'},
  words,
  narration, narrFile: 'narr/cade_loud.mp3',
  narrColors: {CADE: '#FFE14D', CUNNINGHAM: '#FFE14D', LOGO: '#FFE14D', MAN: '#FFE14D', ROOKIE: '#FFE14D', AUTO: '#FFE14D',
    ONE: '#FF4D4D', OF: '#FF4D4D', '$27,000': '#5CFF5C', KEEP: '#5CFF5C', SELL: '#FF4D4D', NBA: '#5CC8FF'},
  quietBefore: 1.1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
