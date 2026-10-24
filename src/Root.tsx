import {Composition} from 'remotion';
import {FPS, OUT_MS, ShortEdit} from './ShortEdit';

export const RemotionRoot = () => (
  <Composition
    id="ShortEdit"
    component={ShortEdit}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((OUT_MS / 1000) * FPS)}
    defaultProps={{src: 'input.mp4'}}
  />
);
