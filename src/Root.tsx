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
import {RigTest} from './zack/RigTest';
import {GoatExplainer, GOATX_MS} from './zack/GoatExplainer';
import {NewsGoat, NEWSGOAT_MS} from './news/NewsGoat';
import {Redeem29, RED29_MS} from './clipper/Redeem29';
import {GumShort, GUM_MS} from './inside/GumShort';
import {FlyShort, FLY_MS} from './inside/FlyShort';
import {WingTest} from './inside/WingTest';
import {DogTest} from './dogs/DogTest';
import {JawTest} from './dogs/JawTest';
import {PoseTest} from './dogs/PoseTest';
import {DogsShort, DogsStills, DOGS_MS} from './dogs/DogsShort';
import {SpitShort, SpitStills, SPIT_MS} from './inside/SpitShort';
import {Max2Test} from './inside/Max2Test';
import {RoadsterShort, RoadsterStills, ROADSTER_MS} from './inside/RoadsterShort';
import {GLASS_MEMORY_MS, GlassMemory} from './glass/memory';
import {GOAT30_MS, JorhoGoat30, GOAT28_MS, JorhoGoat28, GOAT26_MS, JorhoGoat26, RED25_MS, JorhoRedeem25, GOAT24_MS, JorhoGoat24, GOAT22_MS, JorhoGoat22, GOAT21A_MS, JorhoGoat21A, GOAT21B_MS, JorhoGoat21B, GOAT19_MS, JorhoGoat19, JorhoGoatInk, JorhoGoatJourney, JorhoGoatPixel, JorhoGoatCollage, JorhoGoatNeon, JorhoGoatPremium, JorhoGoat14, JorhoGoatArcade, JorhoGoatChalk, JorhoGoatChat, JorhoGoatComic, JorhoGoatWhiteboard, JorhoGoat12, JorhoTT11, TT11_MS, GOLF10_MS, JorhoGolf10, JorhoPlaybook10, PB10_MS, JorhoLefty9, JorhoLefty8, LEFTY8_MS, CELLY7_MS, GIFT7_MS, JorhoCelly7, JorhoGift7, JorhoNeck7, NECK7_MS, JOSH3D_MS, JorhoGoat3D, JorhoJosh3D, JorhoRedeem3D, REDEEM3D_MS, GOAT_MS, JorhoGoat, JorhoPen, JorhoPen3D, PEN_MS, JorhoLefty, JorhoPlaybook, LEFTY_J_MS, PLAYBOOK_J_MS, COEN_MS, GOLF_MS, JorhoCoen, JorhoGolf, JorhoPeyton, JorhoRedeem, PEYTON_MS, REDEEM_MS} from './jorho/clips';

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
  <Composition id="RigTest" component={RigTest} fps={30} width={1080} height={1920} durationInFrames={30} />
  <Composition id="DogTest" component={DogTest} fps={30} width={1920} height={1080} durationInFrames={300} />
  <Composition id="JawTest" component={JawTest} fps={30} width={1920} height={1080} durationInFrames={2} />
  <Composition id="PoseTest" component={PoseTest} fps={30} width={1080} height={1080} durationInFrames={8} />
  <Composition id="DogsShort" component={DogsShort} fps={30} width={1080} height={1920} durationInFrames={Math.ceil((DOGS_MS / 1000) * 30)} />
  <Composition id="DogsStills" component={DogsStills} fps={30} width={1080} height={1920} durationInFrames={21} />
  <Composition id="SpitShort" component={SpitShort} fps={30} width={1080} height={1920} durationInFrames={Math.ceil((SPIT_MS / 1000) * 30)} />
  <Composition id="SpitStills" component={SpitStills} fps={30} width={1080} height={1920} durationInFrames={14} />
  <Composition id="Max2Test" component={Max2Test} fps={30} width={1920} height={1080} durationInFrames={30} />
  <Composition id="RoadsterShort" component={RoadsterShort} fps={30} width={1080} height={1920} durationInFrames={Math.ceil((ROADSTER_MS / 1000) * 30)} />
  <Composition id="RoadsterStills" component={RoadsterStills} fps={30} width={1080} height={1920} durationInFrames={18} />
  <Composition id="WingTest" component={WingTest} fps={30} width={1080} height={1920} durationInFrames={10} />
  <Composition id="FlyShort" component={FlyShort} fps={30} width={1080} height={1920} durationInFrames={Math.round((FLY_MS / 1000) * 30)} />
  <Composition id="GumShort" component={GumShort} fps={30} width={1080} height={1920} durationInFrames={Math.round((GUM_MS / 1000) * 30)} />
  <Composition id="Redeem29" component={Redeem29} fps={30} width={1080} height={1920} durationInFrames={Math.round((RED29_MS / 1000) * 30)} />
  <Composition id="NewsGoat" component={NewsGoat} fps={30} width={1080} height={1920} durationInFrames={Math.round((NEWSGOAT_MS / 1000) * 30)} />
  <Composition id="GoatExplainer" component={GoatExplainer} fps={30} width={1080} height={1920} durationInFrames={Math.round((GOATX_MS / 1000) * 30)} />
  {E3_CLIPS.map(([id, C, ms]) => <Composition key={id} id={id} component={C} fps={30} width={1080} height={1920} durationInFrames={Math.round((ms / 1000) * 30)} />)}
  {([['JorhoPeyton', JorhoPeyton, PEYTON_MS], ['JorhoGolf', JorhoGolf, GOLF_MS], ['JorhoRedeem', JorhoRedeem, REDEEM_MS], ['JorhoCoen', JorhoCoen, COEN_MS], ['JorhoGoat', JorhoGoat, GOAT_MS], ['JorhoLefty', JorhoLefty, LEFTY_J_MS], ['JorhoPlaybook', JorhoPlaybook, PLAYBOOK_J_MS], ['JorhoPen', JorhoPen, PEN_MS], ['JorhoPen3D', JorhoPen3D, PEN_MS], ['JorhoGoat3D', JorhoGoat3D, GOAT_MS], ['JorhoRedeem3D', JorhoRedeem3D, REDEEM3D_MS], ['JorhoJosh3D', JorhoJosh3D, JOSH3D_MS], ['JorhoGift7', JorhoGift7, GIFT7_MS], ['JorhoCelly7', JorhoCelly7, CELLY7_MS], ['JorhoNeck7', JorhoNeck7, NECK7_MS], ['JorhoLefty8', JorhoLefty8, LEFTY8_MS], ['JorhoLefty9', JorhoLefty9, LEFTY8_MS], ['JorhoPlaybook10', JorhoPlaybook10, PB10_MS], ['JorhoGolf10', JorhoGolf10, GOLF10_MS], ['JorhoTT11', JorhoTT11, TT11_MS], ['JorhoGoat12', JorhoGoat12, GOAT_MS], ['JorhoGoatWhiteboard', JorhoGoatWhiteboard, GOAT_MS], ['JorhoGoatChalk', JorhoGoatChalk, GOAT_MS], ['JorhoGoatComic', JorhoGoatComic, GOAT_MS], ['JorhoGoatArcade', JorhoGoatArcade, GOAT_MS], ['JorhoGoatChat', JorhoGoatChat, GOAT_MS], ['JorhoGoat14', JorhoGoat14, GOAT_MS], ['JorhoGoatPremium', JorhoGoatPremium, GOAT_MS], ['JorhoGoatCollage', JorhoGoatCollage, GOAT_MS], ['JorhoGoatNeon', JorhoGoatNeon, GOAT_MS], ['JorhoGoatPixel', JorhoGoatPixel, GOAT_MS], ['JorhoGoatJourney', JorhoGoatJourney, GOAT_MS], ['JorhoGoatInk', JorhoGoatInk, GOAT_MS], ['JorhoGoat19', JorhoGoat19, GOAT19_MS], ['JorhoGoat21A', JorhoGoat21A, GOAT21A_MS], ['JorhoGoat21B', JorhoGoat21B, GOAT21B_MS], ['JorhoGoat22', JorhoGoat22, GOAT22_MS], ['JorhoGoat24', JorhoGoat24, GOAT24_MS], ['JorhoRedeem25', JorhoRedeem25, RED25_MS], ['JorhoGoat26', JorhoGoat26, GOAT26_MS], ['JorhoGoat28', JorhoGoat28, GOAT28_MS], ['JorhoGoat30', JorhoGoat30, GOAT30_MS]] as const).map(([id, C, ms]) => (
    <Composition key={id} id={id} component={C} fps={30} width={1080} height={1920} durationInFrames={Math.round((ms / 1000) * 30)} />))}
  </>
);
