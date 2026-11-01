import {Composition} from 'remotion';
import {CARD_OUT_MS, CardPull} from './CardPull';
import {SRC as POD_SRC} from './activePod';
import {FPS, OUT_MS, ShortEdit} from './ShortEdit';
import {MG_FPS, MG_OUT_MS, MotionPod} from './MotionPod';
import {E2_FPS, E2_OUT_MS, Edit2} from './Edit2';
import {CV_FPS, CV_OUT_MS, E2Coverage} from './E2Coverage';
import {E3_FPS, E3_OUT_MS, E3Ant} from './E3Ant';
import {E3_CLIPS} from './e3/clips';
import {Test3D} from './jorho3d/Test3D';
import {GLASS_MEMORY_MS, GlassMemory} from './glass/memory';
import {GOLF10_MS, JorhoGolf10, JorhoPlaybook10, PB10_MS, JorhoLefty9, JorhoLefty8, LEFTY8_MS, CELLY7_MS, GIFT7_MS, JorhoCelly7, JorhoGift7, JorhoNeck7, NECK7_MS, JOSH3D_MS, JorhoGoat3D, JorhoJosh3D, JorhoRedeem3D, REDEEM3D_MS, GOAT_MS, JorhoGoat, JorhoPen, JorhoPen3D, PEN_MS, JorhoLefty, JorhoPlaybook, LEFTY_J_MS, PLAYBOOK_J_MS, COEN_MS, GOLF_MS, JorhoCoen, JorhoGolf, JorhoPeyton, JorhoRedeem, PEYTON_MS, REDEEM_MS} from './jorho/clips';

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
  <Composition
    id="E2Coverage"
    component={E2Coverage}
    fps={CV_FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((CV_OUT_MS / 1000) * CV_FPS)}
  />
  <Composition
    id="E3Ant"
    component={E3Ant}
    fps={E3_FPS}
    width={1080}
    height={1920}
    durationInFrames={Math.round((E3_OUT_MS / 1000) * E3_FPS)}
  />
  <Composition id="GlassMemory" component={GlassMemory} fps={30} width={1080} height={1920} durationInFrames={Math.round((GLASS_MEMORY_MS / 1000) * 30)} />
  <Composition id="Test3D" component={Test3D} fps={30} width={1080} height={1920} durationInFrames={60} />
  {E3_CLIPS.map(([id, C, ms]) => <Composition key={id} id={id} component={C} fps={30} width={1080} height={1920} durationInFrames={Math.round((ms / 1000) * 30)} />)}
  {([['JorhoPeyton', JorhoPeyton, PEYTON_MS], ['JorhoGolf', JorhoGolf, GOLF_MS], ['JorhoRedeem', JorhoRedeem, REDEEM_MS], ['JorhoCoen', JorhoCoen, COEN_MS], ['JorhoGoat', JorhoGoat, GOAT_MS], ['JorhoLefty', JorhoLefty, LEFTY_J_MS], ['JorhoPlaybook', JorhoPlaybook, PLAYBOOK_J_MS], ['JorhoPen', JorhoPen, PEN_MS], ['JorhoPen3D', JorhoPen3D, PEN_MS], ['JorhoGoat3D', JorhoGoat3D, GOAT_MS], ['JorhoRedeem3D', JorhoRedeem3D, REDEEM3D_MS], ['JorhoJosh3D', JorhoJosh3D, JOSH3D_MS], ['JorhoGift7', JorhoGift7, GIFT7_MS], ['JorhoCelly7', JorhoCelly7, CELLY7_MS], ['JorhoNeck7', JorhoNeck7, NECK7_MS], ['JorhoLefty8', JorhoLefty8, LEFTY8_MS], ['JorhoLefty9', JorhoLefty9, LEFTY8_MS], ['JorhoPlaybook10', JorhoPlaybook10, PB10_MS], ['JorhoGolf10', JorhoGolf10, GOLF10_MS]] as const).map(([id, C, ms]) => (
    <Composition key={id} id={id} component={C} fps={30} width={1080} height={1920} durationInFrames={Math.round((ms / 1000) * 30)} />))}
  </>
);
