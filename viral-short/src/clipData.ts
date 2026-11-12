export interface WordTiming { word: string; startFrame: number; endFrame: number; color?: string; flash?: boolean }
export interface SceneConfig { id: string; videoStartSec: number; durationInFrames: number; cropX: number; words: WordTiming[] }
// generated from Whisper word timings of the source (scratchpad plan.py); cropX = centre of a vertical crop in the 1920x1080 source
export const SCENES: SceneConfig[] = [
 {
  "id": "hook",
  "videoStartSec": 217.2,
  "durationInFrames": 54,
  "cropX": 700,
  "words": [
   {
    "word": "What's",
    "startFrame": 0,
    "endFrame": 6
   },
   {
    "word": "the",
    "startFrame": 6,
    "endFrame": 8
   },
   {
    "word": "most",
    "startFrame": 8,
    "endFrame": 13
   },
   {
    "word": "expensive",
    "startFrame": 13,
    "endFrame": 24
   },
   {
    "word": "thing",
    "startFrame": 24,
    "endFrame": 32
   },
   {
    "word": "they",
    "startFrame": 32,
    "endFrame": 37
   },
   {
    "word": "bought?",
    "startFrame": 37,
    "endFrame": 45
   }
  ]
 },
 {
  "id": "hulk-lotus",
  "videoStartSec": 219.0,
  "durationInFrames": 65,
  "cropX": 880,
  "words": [
   {
    "word": "Lotus",
    "startFrame": 3,
    "endFrame": 8,
    "color": "#4ADE80",
    "flash": true
   },
   {
    "word": "Emira",
    "startFrame": 8,
    "endFrame": 16,
    "color": "#4ADE80"
   },
   {
    "word": "V6",
    "startFrame": 16,
    "endFrame": 35
   },
   {
    "word": "first",
    "startFrame": 35,
    "endFrame": 52
   },
   {
    "word": "edition",
    "startFrame": 52,
    "endFrame": 64
   }
  ]
 },
 {
  "id": "mercedes",
  "videoStartSec": 229.0,
  "durationInFrames": 35,
  "cropX": 1000,
  "words": [
   {
    "word": "Mercedes",
    "startFrame": 2,
    "endFrame": 2,
    "color": "#4ADE80",
    "flash": true
   },
   {
    "word": "AMG",
    "startFrame": 2,
    "endFrame": 23,
    "color": "#4ADE80"
   },
   {
    "word": "GT",
    "startFrame": 26,
    "endFrame": 31
   },
   {
    "word": "63",
    "startFrame": 31,
    "endFrame": 35
   }
  ]
 },
 {
  "id": "ironman-m3",
  "videoStartSec": 244.25,
  "durationInFrames": 57,
  "cropX": 1000,
  "words": [
   {
    "word": "I",
    "startFrame": 2,
    "endFrame": 2
   },
   {
    "word": "bought",
    "startFrame": 2,
    "endFrame": 7
   },
   {
    "word": "my",
    "startFrame": 7,
    "endFrame": 13
   },
   {
    "word": "dad",
    "startFrame": 13,
    "endFrame": 20
   },
   {
    "word": "a",
    "startFrame": 20,
    "endFrame": 26
   },
   {
    "word": "M3",
    "startFrame": 26,
    "endFrame": 38,
    "color": "#4ADE80",
    "flash": true
   },
   {
    "word": "in",
    "startFrame": 38,
    "endFrame": 44
   },
   {
    "word": "Singapore",
    "startFrame": 44,
    "endFrame": 56
   }
  ]
 },
 {
  "id": "nothing-for-mom",
  "videoStartSec": 246.15,
  "durationInFrames": 35,
  "cropX": 840,
  "words": [
   {
    "word": "No",
    "startFrame": 2,
    "endFrame": 8
   },
   {
    "word": "mom?",
    "startFrame": 11,
    "endFrame": 15,
    "color": "#38BDF8"
   },
   {
    "word": "Nothing",
    "startFrame": 17,
    "endFrame": 21
   },
   {
    "word": "for",
    "startFrame": 21,
    "endFrame": 26
   },
   {
    "word": "mom?",
    "startFrame": 26,
    "endFrame": 34,
    "color": "#38BDF8"
   }
  ]
 },
 {
  "id": "batman-rolex",
  "videoStartSec": 257.45,
  "durationInFrames": 39,
  "cropX": 900,
  "words": [
   {
    "word": "Rolex",
    "startFrame": 0,
    "endFrame": 9,
    "color": "#4ADE80",
    "flash": true
   },
   {
    "word": "Day-Date",
    "startFrame": 9,
    "endFrame": 21
   },
   {
    "word": "$40K",
    "startFrame": 22,
    "endFrame": 37,
    "color": "#4ADE80"
   }
  ]
 },
 {
  "id": "clown-mustangs",
  "videoStartSec": 269.45,
  "durationInFrames": 135,
  "cropX": 760,
  "words": [
   {
    "word": "I",
    "startFrame": 3,
    "endFrame": 3
   },
   {
    "word": "had",
    "startFrame": 3,
    "endFrame": 11
   },
   {
    "word": "two",
    "startFrame": 11,
    "endFrame": 18,
    "color": "#4ADE80"
   },
   {
    "word": "Mustangs",
    "startFrame": 18,
    "endFrame": 36,
    "color": "#4ADE80",
    "flash": true
   },
   {
    "word": "GTs",
    "startFrame": 42,
    "endFrame": 56,
    "color": "#4ADE80"
   },
   {
    "word": "that",
    "startFrame": 56,
    "endFrame": 64
   },
   {
    "word": "were",
    "startFrame": 64,
    "endFrame": 67
   },
   {
    "word": "like",
    "startFrame": 67,
    "endFrame": 72
   },
   {
    "word": "all",
    "startFrame": 72,
    "endFrame": 87
   },
   {
    "word": "specced",
    "startFrame": 87,
    "endFrame": 98
   },
   {
    "word": "out",
    "startFrame": 98,
    "endFrame": 105
   },
   {
    "word": "but",
    "startFrame": 105,
    "endFrame": 112
   },
   {
    "word": "I",
    "startFrame": 112,
    "endFrame": 119
   },
   {
    "word": "had",
    "startFrame": 119,
    "endFrame": 122
   },
   {
    "word": "to",
    "startFrame": 122,
    "endFrame": 125
   },
   {
    "word": "sell",
    "startFrame": 125,
    "endFrame": 132,
    "color": "#4ADE80"
   }
  ]
 },
 {
  "id": "laughing",
  "videoStartSec": 273.95,
  "durationInFrames": 57,
  "cropX": 750,
  "words": [
   {
    "word": "Why",
    "startFrame": 2,
    "endFrame": 3,
    "color": "#38BDF8"
   },
   {
    "word": "do",
    "startFrame": 3,
    "endFrame": 6
   },
   {
    "word": "you",
    "startFrame": 6,
    "endFrame": 8
   },
   {
    "word": "guys",
    "startFrame": 8,
    "endFrame": 11
   },
   {
    "word": "keep",
    "startFrame": 11,
    "endFrame": 16
   },
   {
    "word": "laughing?",
    "startFrame": 16,
    "endFrame": 27,
    "color": "#38BDF8"
   },
   {
    "word": "I",
    "startFrame": 32,
    "endFrame": 35
   },
   {
    "word": "don't",
    "startFrame": 35,
    "endFrame": 38
   },
   {
    "word": "believe",
    "startFrame": 38,
    "endFrame": 43
   },
   {
    "word": "this",
    "startFrame": 43,
    "endFrame": 54
   }
  ]
 },
 {
  "id": "two-same-car",
  "videoStartSec": 277.65,
  "durationInFrames": 108,
  "cropX": 960,
  "words": [
   {
    "word": "Could",
    "startFrame": 2,
    "endFrame": 7
   },
   {
    "word": "be",
    "startFrame": 7,
    "endFrame": 17
   },
   {
    "word": "right",
    "startFrame": 17,
    "endFrame": 27
   },
   {
    "word": "but",
    "startFrame": 27,
    "endFrame": 31
   },
   {
    "word": "at",
    "startFrame": 31,
    "endFrame": 34
   },
   {
    "word": "the",
    "startFrame": 34,
    "endFrame": 38
   },
   {
    "word": "same",
    "startFrame": 38,
    "endFrame": 41,
    "color": "#38BDF8"
   },
   {
    "word": "time",
    "startFrame": 41,
    "endFrame": 49
   },
   {
    "word": "like",
    "startFrame": 49,
    "endFrame": 51
   },
   {
    "word": "why",
    "startFrame": 51,
    "endFrame": 57,
    "color": "#38BDF8"
   },
   {
    "word": "would",
    "startFrame": 57,
    "endFrame": 61
   },
   {
    "word": "you",
    "startFrame": 61,
    "endFrame": 64
   },
   {
    "word": "need",
    "startFrame": 64,
    "endFrame": 69
   },
   {
    "word": "two",
    "startFrame": 69,
    "endFrame": 81,
    "color": "#4ADE80"
   },
   {
    "word": "of",
    "startFrame": 81,
    "endFrame": 89
   },
   {
    "word": "the",
    "startFrame": 89,
    "endFrame": 93
   },
   {
    "word": "same",
    "startFrame": 93,
    "endFrame": 100,
    "color": "#38BDF8"
   },
   {
    "word": "car?",
    "startFrame": 100,
    "endFrame": 108,
    "color": "#38BDF8"
   }
  ]
 },
 {
  "id": "step-forward",
  "videoStartSec": 1521.6,
  "durationInFrames": 78,
  "cropX": 960,
  "words": [
   {
    "word": "Will",
    "startFrame": 3,
    "endFrame": 4
   },
   {
    "word": "the",
    "startFrame": 4,
    "endFrame": 8
   },
   {
    "word": "real",
    "startFrame": 8,
    "endFrame": 16,
    "color": "#4ADE80"
   },
   {
    "word": "fake",
    "startFrame": 16,
    "endFrame": 28,
    "color": "#4ADE80"
   },
   {
    "word": "please",
    "startFrame": 28,
    "endFrame": 45
   },
   {
    "word": "step",
    "startFrame": 45,
    "endFrame": 53
   },
   {
    "word": "forward?",
    "startFrame": 53,
    "endFrame": 67
   }
  ]
 },
 {
  "id": "yes-i-am",
  "videoStartSec": 1547.0,
  "durationInFrames": 78,
  "cropX": 960,
  "words": [
   {
    "word": "Yeah",
    "startFrame": 4,
    "endFrame": 9
   },
   {
    "word": "the",
    "startFrame": 9,
    "endFrame": 11
   },
   {
    "word": "larp",
    "startFrame": 11,
    "endFrame": 25
   },
   {
    "word": "Yes",
    "startFrame": 58,
    "endFrame": 65
   },
   {
    "word": "I",
    "startFrame": 68,
    "endFrame": 69
   },
   {
    "word": "am",
    "startFrame": 69,
    "endFrame": 78
   }
  ]
 },
 {
  "id": "fair-play",
  "videoStartSec": 1558.15,
  "durationInFrames": 78,
  "cropX": 1000,
  "words": [
   {
    "word": "Fair",
    "startFrame": 1,
    "endFrame": 17
   },
   {
    "word": "play",
    "startFrame": 17,
    "endFrame": 24
   },
   {
    "word": "to",
    "startFrame": 24,
    "endFrame": 30
   },
   {
    "word": "Iron",
    "startFrame": 30,
    "endFrame": 38,
    "color": "#4ADE80"
   },
   {
    "word": "Man",
    "startFrame": 38,
    "endFrame": 46,
    "color": "#4ADE80"
   },
   {
    "word": "Like",
    "startFrame": 49,
    "endFrame": 53
   },
   {
    "word": "nah",
    "startFrame": 56,
    "endFrame": 60
   },
   {
    "word": "you",
    "startFrame": 60,
    "endFrame": 64
   },
   {
    "word": "got",
    "startFrame": 64,
    "endFrame": 68
   },
   {
    "word": "me",
    "startFrame": 68,
    "endFrame": 76
   },
   {
    "word": "man",
    "startFrame": 76,
    "endFrame": 78,
    "color": "#4ADE80"
   }
  ]
 }
];
export const TOTAL_FRAMES = 819;
