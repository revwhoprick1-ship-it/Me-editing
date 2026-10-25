import {Composition} from 'remotion';
import {CARD_OUT_MS, CardPull} from './CardPull';
import {SRC as POD_SRC} from './activePod';
import {FPS, OUT_MS, ShortEdit} from './ShortEdit';
import {MG_FPS, MG_OUT_MS, MotionPod} from './MotionPod';
import {E2_FPS, E2_OUT_MS, Edit2} from './Edit2';

export const RemotionRoot = () => (
  <>
  <Composition
    id="ShortEdit"
    component={ShortEdit}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((OUT_MS / 1000) * FPS)}
    defaultProps={{src: POD_SRC}}
  />
  <Composition
    id="CardPull"
    component={CardPull}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((CARD_OUT_MS / 1000) * FPS)}
  />
  <Composition
    id="MotionPod"
    component={MotionPod}
    fps={MG_FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((MG_OUT_MS / 1000) * MG_FPS)}
  />
  <Composition
    id="Edit2"
    component={Edit2}
    fps={E2_FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((E2_OUT_MS / 1000) * E2_FPS)}
  />
  </>
);
