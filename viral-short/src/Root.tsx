import React from 'react';
import { Composition } from 'remotion';
import { ViralShort } from './ViralShort';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="GuessTheFakeMillionaire"
      component={ViralShort}
      durationInFrames={660}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
