// Trevor Lawrence clip: how much an NFL playbook changes week to week (serious -> phonk).
import track from '../data/u1_playbook.seats.json';
import words from '../data/u1_playbook.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u1_playbook.mp4',
  cuts: [[0, 3300], [14400, 19000], [37000, 43100], [49000, 58200]],
  seats: {L: 405, M: 930, R: 1440},
  track: track as SeatTrack,
  speakers: [{from: 0, who: 'R'}, {from: 3400, who: 'M'}],
  words,
  mood: 'serious',
  music: {file: 'tipo-insta-buzeira.mp3', drop: [19300, 47800]},
  colors: {PLAYBOOK: '#FFE14D', HUNDREDS: '#FF4D4D', PLAYS: '#FFE14D', OFFENSE: '#5CC8FF', WEEK: '#5CFF5C', INVENTORY: '#FFE14D', EIGHT: '#5CFF5C', TEN: '#5CFF5C', COACHES: '#5CC8FF'},
  emoji: {HUNDREDS: '1f92f', INVENTORY: '1f4da', WEEK: '1f4c5'},
  hook: {text: 'How many plays does an NFL QB have to learn?', emoji: '1f92f'},
  punch: {at: 17100, to: 18300, sticker: '1f92f', sfx: 'bass-boosted-vine-boom.mp3'},
  circle: {at: 3400, who: 'M'},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
