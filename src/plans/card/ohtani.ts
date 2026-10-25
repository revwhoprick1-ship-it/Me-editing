// Shohei Ohtani Bowman's Best superfractor auto 1/1 ($80,000), Historical Big Pulls (batch 2).
// Source: footage/batch/b2_ohtani_1of1.mp4 (1080x1920: hosts cam 0-520, burned banner, card cam from 750).
import narration from '../../../public/narr/ohtani.json';
import words from '../data/b2_ohtani_1of1.words.json';
import {makeCardPlan} from './make';

export * from './make';
const P = makeCardPlan({
  src: 'cards2/ohtani_1of1.mp4',
  geom: {srcW: 1080, srcH: 1920, topH: 520,
    hosts: {x: 0, y: 0, w: 1080, h: 520}, card: {x: 0, y: 750, w: 1080, h: 1170}, react: {x: 180, y: 0, w: 820, h: 520}, ringR: 110},
  still: {file: 'cards2/ohtani.png', w: 740, h: 880},
  card: {name: 'SHOHEI OHTANI', parallel: 'SUPERFRACTOR AUTO 1/1', price: '$80,000', revealAt: 15500,
    center: {x: 590, y: 1160}, serial: {x: 720, y: 1420}, zoom: 1.15},
  hookClip: {file: 'hooks/no_way_he_did_it.mp4', from: 0, to: 3800, cover: [60, 930, 600, 160],
    words: [{text: 'NO', at: 0}, {text: 'WAY', at: 900, color: '#5CFF5C'}, {text: 'HE', at: 1300}, {text: 'DID', at: 1500}, {text: 'IT!', at: 1800, color: '#FFE14D'}]},
  music: {file: 'montagem-pegadora.mp3', drop: 15700, length: 112000},
  cuts: [[5800, 9900], [11200, 14000]],
  suspense: [14000, 15500],
  after: [[15500, 20000], [29400, 34800]],
  reactionAt: 17500,
  questionAt: 32600,
  blurs: [{from: 5800, to: 15500, box: [60, 780, 960, 1120]}],
  zooms: [{from: 7900, to: 9800, scale: 1.12, x: 540, y: 1250}, {from: 30500, to: 32300, scale: 1.12, x: 700, y: 280}],
  track: [{at: 17700, x: 710, y: 282}, {at: 17900, x: 706, y: 282}, {at: 18133, x: 706, y: 282}, {at: 18333, x: 704, y: 284}, {at: 18533, x: 704, y: 282}, {at: 18733, x: 702, y: 280}, {at: 18967, x: 700, y: 278}, {at: 19167, x: 698, y: 289}, {at: 19367, x: 700, y: 296}, {at: 19567, x: 688, y: 312}, {at: 19767, x: 672, y: 318}, {at: 19967, x: 666, y: 327}, {at: 20167, x: 668, y: 331}, {at: 20367, x: 670, y: 333}, {at: 20567, x: 670, y: 322}, {at: 20767, x: 690, y: 288}, {at: 20967, x: 718, y: 285}, {at: 21167, x: 740, y: 257}, {at: 21367, x: 740, y: 278}],
  banner: {count: '1', price: '$80,000', teaser: 'MLB GOAT... WHO IS IT?', named: 'SHOHEI OHTANI 1/1!'},
  words,
  narration, narrFile: 'narr/ohtani_loud.mp3',
  narrColors: {SHOHEI: '#FFE14D', OHTANI: '#FFE14D', SUPER: '#FFE14D', FRACTOR: '#FFE14D', AUTO: '#FFE14D', ONE: '#FF4D4D', OF: '#FF4D4D',
    '$80,000': '#5CFF5C', PACK: '#5CC8FF'},
  quietBefore: 1,
});
export const {SRC, GEOM, CARD_STILL, STAMP, HOOK_CUT, HOOK_CLIP, CUTS, SUSPENSE, LAYOUTS, WHIPS, BANNER_BEFORE, BANNER_AFTER, CARD,
  BLURS, ZOOMS, MONEY_MS, QUESTION, TRACK, TRACK_UNTIL, HOOK_TITLE, HOOK_CAPTIONS, CAPTIONS, NARRATION_FILE, NARRATION,
  NARRATION_CHUNK, OUT_SFX, HOOK_SFX, SFX, DIALOGUE_GAIN, MUSIC, SPEECH, HOOK_BLUR} = P;
