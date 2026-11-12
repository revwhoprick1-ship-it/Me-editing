import React from 'react';
import { Composition } from 'remotion';
import { ViralShort } from './ViralShort';
import { TOTAL_FRAMES } from './clipData';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GuessTheFakeMillionaire"
      component={ViralShort}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
