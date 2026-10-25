// Edit2: how much an NFL playbook changes week to week (Trevor Lawrence Clips, u1).
import track from '../data/u1_playbook.seats.json';
import words from '../data/u1_playbook.words.json';
import type {Edit2Plan, SeatTrack} from './types';

export const PLAN: Edit2Plan = {
  name: 'playbook',
  src: 'pod2/u1_playbook.mp4',
  words,
  track: track as SeatTrack,
  speakers: [{from: 0, who: 'R'}, {from: 14000, who: 'M'}],
  segs: [[0, 2600], [14250, 18150], [18400, 23900], [41860, 47700], [48820, 55000]],
  hook: {small: 'TREVOR LAWRENCE', big: 'How many plays does an NFL QB actually learn?'},
  stacks: [
    {x: 80, y: 980, align: 'left', to: 18150, lines: [
      {t: "you're just installing", font: 'sans', size: 58, at: 14320},
      {t: 'your entire offense,', font: 'serif', size: 100, at: 15060},
      {t: 'HUNDREDS', font: 'bold', size: 168, at: 17000},
      {t: 'of plays.', font: 'serifI', size: 150, at: 17720},
    ]},
  ],
  subs: [
    {from: 0, to: 2600, one: true, y: 1080},
    {from: 41860, to: 47700, y: 1745, size: 44},
    {from: 48820, to: 55000, y: 1500, color: '#FFD84D', size: 52},
  ],
  fix: {"I'd": "I'd"},
  scenes: [
    {type: 'checklist', from: 18400, to: 23900, title: [
      {t: "It's a ton of", font: 'sans', size: 60, at: 18440, color: '#666'},
      {t: 'everything.', font: 'boldI', size: 130, at: 23420, color: '#111'},
    ], rows: [
      {t: 'Runs', at: 19260, emoji: '1f3c3'},
      {t: 'Pass concepts', at: 20820, emoji: '1f3c8'},
      {t: 'Play action', at: 21920, emoji: '1f3ad'},
      {t: 'Screens', at: 22620, emoji: '1f6e1'},
    ]},
    {type: 'field', from: 41860, to: 47700, variant: 'formation', title: 'This week we might change…',
      events: {formation: 43780, motion: 44640, route: 46100, progression: 47480}},
    {type: 'stat', from: 48820, to: 55000, at: 52580, kicker: 'EVERY WEEK', value: 10,
      label: 'new plays.', chip: 'GIVE OR TAKE · 8–10'},
  ],
  punches: [[17000, 17900, 1.12]],
  music: {file: 'lose-you-adturnup.mp3', from: 12000},
  outro: {lines: [
    {t: 'The playbook', font: 'sans', size: 66},
    {t: 'never', font: 'serif', size: 210},
    {t: 'stops.', font: 'serifI', size: 170, color: '#FFE3A3'},
  ]},
};
