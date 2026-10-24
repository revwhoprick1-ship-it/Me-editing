// Trevor Lawrence clip: Grant roasts Davis Mills while ripping (Trevor Lawrence Clips tab).
import words from '../data/t6_davis_mills_joke.words.json';
import {makePodPlan} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod/t6_davis_mills_joke.mp4',
  cuts: [[2100, 16900]],
  speakers: [{from: 2100, who: 'L'}, {from: 9200, who: 'L'}, {from: 11200, who: 'M'}, {from: 14300, who: 'W'}],
  words,
  fix: {NASHON: 'NASHON', ADAM: 'ADAM'},
  colors: {DAVIS: '#FFE14D', MILLS: '#FFE14D', 'EW': '#FF4D4D', NECK: '#5CFF5C', MIKE: '#FFE14D', GLENNON: '#FFE14D', TREVOR: '#5CC8FF'},
  emoji: {EW: '1f922', NECK: '1f992', TREVOR: '1f602'},
  hook: {text: 'Grant had no mercy on Davis Mills', emoji: '1f480'},
  punch: {at: 6900, to: 8600, sticker: '1f480', sfx: 'vine-boom.mp3'},
  laugh: {from: 12000, to: 16900, emoji: ['1f602', '1f62d', '1f480']},
  cutouts: [{from: 10300, to: 11900, images: [{file: 'glennon.png', h: 600, x: 292}]}],
  circle: {at: 2100, who: 'M'},
  extraSfx: [{file: 'record-scratch.mp3', at: 9200, volume: 0.4, onset: 40}],
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH} = P;
