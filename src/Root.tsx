import {Composition, staticFile} from 'remotion';
import {getVideoMetadata} from '@remotion/media-utils';
import {ShortEdit} from './ShortEdit';

const FPS = 30;

export const RemotionRoot = () => (
  <Composition
    id="ShortEdit"
    component={ShortEdit}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={FPS * 30}
    defaultProps={{src: 'input.mp4', captions: 'captions.json'}}
    calculateMetadata={async ({props}) => {
      const meta = await getVideoMetadata(staticFile(props.src));
      return {durationInFrames: Math.ceil(meta.durationInSeconds * FPS)};
    }}
  />
);
