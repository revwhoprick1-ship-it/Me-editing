// Black-bar podcast frame for the Edit3 Trevor clips (Ref C, vault/01 Research/Reference Shorts.md):
// black bars top and bottom, the video in a 1080x1150 box at y=390, a plain sentence-case caption on the top bar
// with an iOS emoji that stays the whole video. The Edit3 graphics live in the box and use the bottom bar as a shelf.
import type {ReactNode} from 'react';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {W} from './kit';

export const BOX_TOP = 390;
export const BOX_H = 1150;
export const BOX_BOTTOM = BOX_TOP + BOX_H;
export const CAP_TOP = BOX_TOP + Math.round(BOX_H * 0.66); // speech captions: one fixed spot
export const MONT = 'Montserrat';
loadFont({family: MONT, url: staticFile('Montserrat-Black.woff2'), weight: '800'});

export const Bars = ({top, emoji, children, over}: {top: string; emoji: string; children: ReactNode; over?: ReactNode}) => (
  <AbsoluteFill style={{background: 'black'}}>
    <div style={{position: 'absolute', left: 0, top: BOX_TOP, width: W, height: BOX_H, overflow: 'hidden'}}>{children}</div>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', height: BOX_TOP - 28}}>
      <div style={{fontFamily: MONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: 'white', textAlign: 'center', padding: '0 70px'}}>
        {top} <Img src={staticFile(`emoji-ios/${emoji}.png`)} style={{width: 60, height: 60, verticalAlign: '-10px'}} />
      </div>
    </AbsoluteFill>
    {over}
  </AbsoluteFill>
);
