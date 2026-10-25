// Trevor Lawrence clip: Trevor learns redemption lore (funny).
import track from '../data/u3_redemptions.seats.json';
import words from '../data/u3_redemptions.words.json';
import {makePodPlan, type SeatTrack} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod2/u3_redemptions.mp4',
  cuts: [[0, 6100], [7000, 10000], [17200, 27900]],
  seats: {L: 360, M: 900, R: 1380},
  track: track as SeatTrack,
  speakers: [{from: 0, who: 'L'}, {from: 7000, who: 'R'}, {from: 17200, who: 'L'}, {from: 26900, who: 'M'}, {from: 27700, who: 'L'}],
  words,
  mood: 'funny',
  fix: {'000': ',000'},
  colors: {'20': '#5CFF5C', '200': '#FF4D4D', '500': '#FF4D4D', BUCKS: '#FF4D4D', REDEEM: '#FFE14D', TIME: '#FFE14D', DISLIKE: '#FF4D4D', HOBBY: '#5CC8FF', PROMISE: '#FFE14D'},
  emoji: {PROMISE: '1f64f', DISLIKE: '1f62c', REALLY: '1f633'},
  hook: {text: 'Trevor found out what redemptions are', emoji: '1f480'},
  punch: {at: 4200, to: 5600, sticker: '1f480', sfx: 'spongebob-boowomp.mp3'},
  laugh: {from: 4300, to: 6100, emoji: ['1f602', '1f480', '1f4c9']},
  circle: {at: 7000, who: 'M'},
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
