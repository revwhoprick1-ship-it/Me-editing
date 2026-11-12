import React from 'react';
import {
  AbsoluteFill,
  Series,
  Sequence,
  OffthreadVideo,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SCENES, WordTiming } from './clipData';

const TopBanner: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 110,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 50,
    }}
  >
    <div style={{ fontSize: 64, marginBottom: 8 }}>😵</div>
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '10px 26px',
        borderRadius: 14,
        fontFamily: 'Montserrat, Inter, sans-serif',
        fontWeight: 900,
        fontSize: 42,
        color: '#FFFFFF',
        boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
      }}
    >
      &ldquo;<span style={{ color: '#facc15' }}>Guess</span> the{' '}
      <span style={{ fontStyle: 'italic' }}>Fake</span>{' '}
      <span style={{ color: '#22c55e' }}>millionaire..</span>&rdquo;
    </div>
  </div>
);

const AssetOverlay: React.FC<{ price: string; imageFile?: string }> = ({
  price,
  imageFile,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 280,
        zIndex: 20,
      }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Impact, Montserrat, sans-serif',
            fontWeight: 900,
            fontSize: 78,
            color: '#4ade80',
            WebkitTextStroke: '3px #000',
            textShadow: '0px 8px 16px rgba(0,0,0,0.85)',
            marginBottom: -15,
            zIndex: 2,
          }}
        >
          {price}
        </div>
        {imageFile && (
          <Img
            src={staticFile(imageFile)}
            style={{
              width: 650,
              height: 'auto',
              filter: 'drop-shadow(0px 16px 24px rgba(0,0,0,0.8))',
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};

const ActiveSubtitles: React.FC<{ words: WordTiming[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentWord = words.find(
    (w) => frame >= w.startFrame && frame < w.endFrame
  );

  if (!currentWord) return null;

  const wordFrame = frame - currentWord.startFrame;
  const scale = spring({
    frame: wordFrame,
    fps,
    config: { damping: 14, stiffness: 260 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 120,
        zIndex: 40,
      }}
    >
      <div
        style={{
          fontFamily: 'Montserrat, Arial Black, sans-serif',
          fontWeight: 900,
          fontSize: 72,
          color: currentWord.color || '#FFFFFF',
          WebkitTextStroke: '4px #000000',
          textShadow: '0px 8px 18px rgba(0,0,0,0.95)',
          transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
          textAlign: 'center',
        }}
      >
        {currentWord.word}
      </div>
    </AbsoluteFill>
  );
};

export const ViralShort: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <TopBanner />

      <Series>
        {SCENES.map((scene) => {
          const startFromFrame = Math.round(scene.videoStartSec * fps);
          const endAtFrame = startFromFrame + scene.durationInFrames;

          return (
            <Series.Sequence
              key={scene.id}
              durationInFrames={scene.durationInFrames}
            >
              <AbsoluteFill style={{ overflow: 'hidden' }}>
                <OffthreadVideo
                  src={staticFile('source.mp4')}
                  startFrom={startFromFrame}
                  endAt={endAtFrame}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scene.zoom || 1})`,
                  }}
                />
              </AbsoluteFill>

              {scene.overlay && (
                <Sequence from={scene.overlay.delayFrames || 0}>
                  <AssetOverlay
                    price={scene.overlay.price}
                    imageFile={scene.overlay.imageFile}
                  />
                </Sequence>
              )}

              <ActiveSubtitles words={scene.words} />
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
