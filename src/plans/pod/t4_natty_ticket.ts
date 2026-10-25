// Trevor Lawrence clip: Trevor gets gifted a signed ticket from his own national championship game (Trevor Lawrence Clips tab).
import words from '../data/t4_natty_ticket.words.json';
import {makePodPlan} from './make';

export * from './make';
const P = makePodPlan({
  src: 'pod/t4_natty_ticket.mp4',
  cuts: [[9800, 13700], [21500, 35000], [37400, 42400], [43400, 50300], [66400, 69700], [72600, 81600]],
  seats: {L: 450, M: 1020, R: 1560},
  speakers: [{from: 9800, who: 'L'}, {from: 29300, who: 'M'}, {from: 32200, who: 'L'}, {from: 32700, who: 'M'},
    {from: 33300, who: 'L'}, {from: 35400, who: 'M'}, {from: 48000, who: 'L'}, {from: 66400, who: 'M'}, {from: 72600, who: 'L'}],
  words,
  fix: {WAR: 'WORN'},
  colors: {GIFT: '#FFE14D', SIGNED: '#FFE14D', TICKET: '#FFE14D', NATIONAL: '#5CFF5C', CHAMPIONSHIP: '#5CFF5C', MVP: '#FFE14D',
    CLEMSON: '#FF8C1A', WEIRD: '#FF4D4D', AWESOME: '#5CFF5C', '$2000': '#5CFF5C', '$500': '#5CFF5C', MILLION: '#5CFF5C', NFL: '#5CC8FF'},
  emoji: {GIFT: '1f381', CHAMPIONSHIP: '1f3c6', WEIRD: '1f62c', AWESOME: '1f525'},
  hook: {text: 'Trevor got gifted a ticket from his OWN natty', emoji: '1f3c6'},
  punch: {at: 80300, to: 81600, sticker: '1f4b0', sfx: 'cha-ching.mp3'},
  circle: {at: 9800, who: 'M'},
  extraSfx: [{file: 'anime-wow.mp3', at: 22300, volume: 0.35, onset: 60}],
});
export const {SRC, CUTS, SHOTS, CAPTIONS, HOOK, CUTOUTS, PUNCH, AURA, LAUGH, SFX, MUSIC, SPEECH, TRACK, WSPEED, ACTIONS} = P;
