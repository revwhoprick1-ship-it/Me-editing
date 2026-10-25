// Fonts for the motion-graphics presets (MotionPod, Edit2): Inter + Instrument Serif (public/fonts, fontsource).
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const SANS = 'Inter';
export const SERIF = 'Instrument Serif';
loadFont({family: SANS, url: staticFile('fonts/inter-latin-500-normal.woff2'), weight: '500'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-700-normal.woff2'), weight: '700'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-800-normal.woff2'), weight: '800'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-800-italic.woff2'), weight: '800', style: 'italic'});
loadFont({family: SERIF, url: staticFile('fonts/instrument-serif-latin-400-normal.woff2'), weight: '400'});
loadFont({family: SERIF, url: staticFile('fonts/instrument-serif-latin-400-italic.woff2'), weight: '400', style: 'italic'});
