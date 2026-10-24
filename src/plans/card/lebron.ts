// LeBron James Triple Logoman ($2.4M), Panini Flawless, Historical Big Pulls.
// Source: footage/batch/p1_lebron_triple_logoman.mp4 from 395 s (1920x1080: hosts left, Whatnot phone view right).
import narration from '../../../public/narr/lebron.json';
import words from '../data/c1_lebron.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards/c1_lebron.mp4',
  geom: {srcW: 1920, srcH: 1080, topH: 610,
    hosts: {x: 100, y: 60, w: 1150, h: 650}, card: {x: 1300, y: 0, w: 620, h: 1080}, react: {x: 150, y: 0, w: 1150, h: 1080}, ringR: 120},
  still: {file: 'cards/lebron.png', w: 610, h: 370},
  card: {name: 'LEBRON JAMES', parallel: 'TRIPLE LOGOMAN 1/1', price: '$2.4 MILLION', revealAt: 47000,
    center: {x: 1610, y: 800}, serial: {x: 1700, y: 760}, zoom: 1.2},
  stamp: '1 OF 1',
  hook: [59000, 62400],
  cuts: [[1400, 5000], [5200, 9600], [18000, 24700], [33300, 41000]],
  suspense: [45700, 47000],
  after: [[47000, 52000], [59000, 75000], [86000, 94000]],
  reactionAt: 59000,
  questionAt: 89000,
  blurs: [{from: 42000, to: 47000, box: [1300, 250, 620, 760]}],
  zooms: [{from: 18000, to: 19500, scale: 1.12, x: 700, y: 400}, {from: 33300, to: 35000, scale: 1.1, x: 700, y: 400},
    {from: 60400, to: 62400, scale: 1.12, x: 880, y: 250}, {from: 76400, to: 78300, scale: 1.12, x: 700, y: 300}],
  track: [{at: 59233, x: 993, y: 142}, {at: 59467, x: 1150, y: 101}, {at: 59700, x: 1240, y: 102}, {at: 59900, x: 1252, y: 110}, {at: 60100, x: 1246, y: 114}, {at: 60300, x: 1196, y: 116}, {at: 60500, x: 1150, y: 120}, {at: 60733, x: 1106, y: 121}, {at: 60967, x: 1032, y: 171}, {at: 61200, x: 918, y: 210}, {at: 61400, x: 876, y: 230}, {at: 61600, x: 856, y: 236}, {at: 61800, x: 846, y: 230}, {at: 62000, x: 838, y: 243}, {at: 62233, x: 830, y: 266}, {at: 62467, x: 812, y: 280}, {at: 62700, x: 784, y: 241}, {at: 62900, x: 792, y: 234}, {at: 63100, x: 840, y: 210}, {at: 63300, x: 946, y: 153}, {at: 63500, x: 979, y: 154}, {at: 63733, x: 960, y: 158}, {at: 63967, x: 1046, y: 142}, {at: 64167, x: 1076, y: 106}, {at: 64400, x: 1068, y: 106}, {at: 64633, x: 1074, y: 82}, {at: 64833, x: 964, y: 96}, {at: 65033, x: 898, y: 158}, {at: 65233, x: 836, y: 174}, {at: 65433, x: 822, y: 176}, {at: 65667, x: 908, y: 126}, {at: 65900, x: 1072, y: 84}, {at: 66100, x: 1054, y: 80}, {at: 66300, x: 910, y: 145}, {at: 66500, x: 800, y: 208}, {at: 66700, x: 876, y: 146}, {at: 66900, x: 968, y: 77}],
  banner: {count: '1', price: '$2.4 MILLION', teaser: 'NBA LEGEND... WHO IS IT?', named: 'LEBRON JAMES LOGOMAN!'},
  words,
  narration, narrFile: 'narr/lebron_loud.mp3',
  narrColors: {LEBRON: '#FFE14D', JAMES: '#FFE14D', TRIPLE: '#FFE14D', LOGO: '#FFE14D', MAN: '#FFE14D', '$2.4': '#5CFF5C',
    MILLION: '#5CFF5C', KEEP: '#5CFF5C', SELL: '#FF4D4D', FLAWLESS: '#FFE14D', EXPENSIVE: '#5CFF5C', NBA: '#5CC8FF', THREE: '#FF4D4D'},
  quietBefore: 1.0,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
