import {Composition} from 'remotion';
import {Main} from './Main';
import {TestEdit, TEST_EDIT_FRAMES} from './testedit/TestEdit';
import {LJClip, CLIPS} from './lj/LJClip';

// Add compositions here. Main is an empty vertical canvas to start from.
export const Root: React.FC = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={30 * 15} fps={30} width={1080} height={1920} />
    <Composition id="TestEdit" component={TestEdit} durationInFrames={TEST_EDIT_FRAMES} fps={30} width={1080} height={1920} />
    {Object.values(CLIPS).map((c) => (
      <Composition key={c.id} id={`LJ-${c.id}`} component={LJClip} defaultProps={{id: c.id}} durationInFrames={c.frames} fps={30} width={1080} height={1920} />
    ))}
  </>
);
