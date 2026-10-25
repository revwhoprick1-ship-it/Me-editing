// Trevor Lawrence clip: Trevor names Tiger as his dream golf partner, then gets a Tiger game-worn auto as a gift (Trevor Lawrence Clips tab).
import words from '../data/t2_dream_golf_four.words.json';
import {makePodPlan} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod/t2_dream_golf_four.mp4',
  cuts: [[11200, 14000], [45400, 54300], [76800, 90700], [97500, 108200]],
  seats: {L: 450, M: 960, R: 1530},
  speakers: [{from: 11200, who: 'L'}, {from: 45400, who: 'M'}, {from: 76800, who: 'L'}, {from: 84000, who: 'M'},
    {from: 86000, who: 'L'}, {from: 97500, who: 'M'}, {from: 102800, who: 'L'}],
  words,
  fix: {TIGERS: "TIGER'S"},
  colors: {TIGER: '#FFE14D', "TIGER'S": '#FFE14D', GOAT: '#5CFF5C', DREAM: '#5CC8FF', GOLF: '#5CFF5C', GIFTS: '#FFE14D',
    EXQUISITE: '#5CFF5C', WORN: '#FF4D4D', PATCH: '#FFE14D', AUTO: '#FFE14D', GLOVE: '#FFE14D', CAP: '#FFE14D', GOLFER: '#5CFF5C'},
  emoji: {GOAT: '1f410', GOLF: '26f3', GIFTS: '1f381', WOW: '1f631'},
  hook: {text: 'Trevor named his dream golf partner... then got THIS', emoji: '1f633'},
  punch: {at: 86000, to: 87600, sticker: '1f631', sfx: 'vine-boom.mp3'},
  cutouts: [{from: 47900, to: 50300, images: [{file: 'tiger.png', h: 620, x: 244}]}],
  circle: {at: 11200, who: 'M'},
  extraSfx: [{file: 'crowd-cheer.mp3', at: 102500, volume: 0.25, onset: 100, maxMs: 2500}],
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
