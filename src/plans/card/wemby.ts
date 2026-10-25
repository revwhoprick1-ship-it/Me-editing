// Victor Wembanyama Championship Tag auto 1/1 ($170,000+), Mercury, Historical Big Pulls.
// Source: footage/batch/p4_wemby_champ_tag.mp4 (1080x1920, single camera: card, then the room).
import narration from '../../../public/narr/wemby.json';
import words from '../data/c5_wemby.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards/c5_wemby.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 0,
    hosts: {x: 0, y: 0, w: 1080, h: 10}, card: {x: 0, y: 200, w: 1080, h: 1500}, react: {x: 0, y: 420, w: 1080, h: 1075}, ringR: 120},
  still: {file: 'cards/wemby.png', w: 960, h: 1450},
  card: {name: 'VICTOR WEMBANYAMA', parallel: 'CHAMP TAG AUTO 1/1', price: '$170,000+', revealAt: 3300,
    center: {x: 520, y: 760}, serial: {x: 620, y: 900}, zoom: 1.25},
  hook: [5500, 8600],
  cuts: [[0, 1300]],
  suspense: [1300, 3300],
  after: [[3300, 5000], [5000, 19500]],
  reactionAt: 5000,
  questionAt: 16900,
  blurs: [{from: 0, to: 3300, box: [120, 300, 840, 1100]}],
  zooms: [{from: 9500, to: 11500, scale: 1.12, x: 620, y: 800}, {from: 12800, to: 15500, scale: 1.1, x: 600, y: 900}],
  track: [{at: 5800, x: 675, y: 566}, {at: 6000, x: 664, y: 590}, {at: 6200, x: 670, y: 590}, {at: 6400, x: 692, y: 612}, {at: 6600, x: 702, y: 692}, {at: 6800, x: 668, y: 786}, {at: 7000, x: 618, y: 852}, {at: 7200, x: 591, y: 884}, {at: 7433, x: 568, y: 902}, {at: 7667, x: 547, y: 888}, {at: 7900, x: 542, y: 930}, {at: 8100, x: 530, y: 971}, {at: 8300, x: 527, y: 962}, {at: 8500, x: 554, y: 809}, {at: 8700, x: 524, y: 666}, {at: 8900, x: 432, y: 654}, {at: 9100, x: 413, y: 635}, {at: 9300, x: 388, y: 618}, {at: 9500, x: 360, y: 616}, {at: 9700, x: 334, y: 612}, {at: 9900, x: 308, y: 612}, {at: 10100, x: 276, y: 604}, {at: 10300, x: 229, y: 594}, {at: 10500, x: 214, y: 598}, {at: 10700, x: 214, y: 602}],
  banner: {count: '1', price: '$170,000', teaser: 'NBA STAR... WHO IS IT?', named: 'VICTOR WEMBANYAMA!'},
  words,
  narration, narrFile: 'narr/wemby_loud.mp3',
  narrColors: {VICTOR: '#FFE14D', WEMBANYAMA: '#FFE14D', CHAMPIONSHIP: '#FFE14D', TAG: '#FFE14D', AUTO: '#FFE14D', ONE: '#FF4D4D',
    OF: '#FF4D4D', '$170,000': '#5CFF5C', KEEP: '#5CFF5C', SELL: '#FF4D4D', BIG: '#5CFF5C'},
  quietBefore: 0,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
