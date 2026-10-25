// Trevor Lawrence clip: the crew rates Trevor's autograph and roasts Anthony Richardson's (Trevor Lawrence Clips tab).
import words from '../data/t1_tiger_auto_pen.words.json';
import {makePodPlan} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod/t1_tiger_auto_pen.mp4',
  cuts: [[1500, 29400], [30800, 39500]],
  seats: {L: 450, M: 990, R: 1580},
  speakers: [{from: 1500, who: 'L'}, {from: 6100, who: 'M'}, {from: 7200, who: 'R'}, {from: 27800, who: 'M'}],
  words,
  fix: {GOADED: 'GOATED'},
  colors: {SIGNATURE: '#FFE14D', GOATED: '#5CFF5C', ANT: '#FF4D4D', RESPECT: '#FF4D4D', ANTHONY: '#FFE14D', "RICHARDSON'S": '#FFE14D',
    PEYTON: '#FFE14D', MANNING: '#FFE14D', BEAUTIFUL: '#5CFF5C', DISRESPECT: '#FF4D4D'},
  emoji: {GOATED: '1f410', ANT: '1f41c', DISRESPECT: '1f62c', BEAUTIFUL: '270d', PEYTON: '1f440'},
  hook: {text: "They roasted Anthony Richardson's autograph", emoji: '1f480'},
  punch: {at: 16100, to: 17600, sticker: '1f41c', sfx: 'vine-boom.mp3'},
  laugh: {from: 16200, to: 20500, emoji: ['1f602', '1f62d', '1f41c']},
  cutouts: [{from: 12700, to: 14800, images: [{file: 'richardson.png', h: 600, x: 274}]}],
  circle: {at: 1500, who: 'M'},
  extraSfx: [{file: 'record-scratch.mp3', at: 12700, volume: 0.35, onset: 40}],
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
