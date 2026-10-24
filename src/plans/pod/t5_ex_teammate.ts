// Trevor Lawrence clip: Trevor rips a true gold Josh Hines-Allen from before the name change (Trevor Lawrence Clips tab).
import words from '../data/t5_ex_teammate.words.json';
import {makePodPlan} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod/t5_ex_teammate.mp4',
  cuts: [[1600, 25500]],
  seats: {L: 760, M: 1000, R: 1480},
  speakers: [{from: 1600, who: 'L'}, {from: 3600, who: 'M'}, {from: 7800, who: 'R'}, {from: 9200, who: 'M'},
    {from: 12000, who: 'L'}, {from: 17000, who: 'M'}, {from: 21000, who: 'L'}],
  words,
  fix: {HEINZ: 'HINES'},
  colors: {GOLD: '#FFE14D', TEAL: '#5CC8FF', JOSH: '#FFE14D', ALLEN: '#FFE14D', HINES: '#FFE14D', FIRE: '#FF4D4D',
    ROOKIE: '#5CFF5C', GLOVE: '#FF4D4D', PRISM: '#5CC8FF', NAME: '#FF4D4D'},
  emoji: {FIRE: '1f525', WAY: '1f633', GLOVE: '1f914'},
  hook: {text: "Trevor pulled his own teammate's card", emoji: '1f633'},
  punch: {at: 22700, to: 24200, sticker: '1f923', sfx: 'vine-boom.mp3'},
  laugh: {from: 23400, to: 25500, emoji: ['1f602', '1f923', '1f62d']},
  cutouts: [{from: 12500, to: 15000, images: [{file: 'hines_allen.png', h: 560, x: 213}]}],
  circle: {at: 1600, who: 'M'},
  extraSfx: [{file: 'anime-wow.mp3', at: 12500, volume: 0.4, onset: 60}],
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH} = P;
