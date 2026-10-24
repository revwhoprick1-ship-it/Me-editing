import {useEffect, useState} from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, continueRender, delayRender,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import {createTikTokStyleCaptions, type Caption, type TikTokPage} from '@remotion/captions';

// Shorts-style edit: punch-in zooms on every caption page, bold
// word-by-word captions with the active word highlighted and popped.
const HIGHLIGHT = '#FFE600';

const Page = ({page}: {page: TikTokPage}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  const enter = spring({frame, fps, config: {damping: 12, stiffness: 200}});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: '35%'}}>
      <div style={{
        transform: `scale(${interpolate(enter, [0, 1], [0.6, 1])})`,
        fontFamily: 'Montserrat, Arial Black, sans-serif', fontWeight: 900,
        fontSize: 96, textAlign: 'center', textTransform: 'uppercase',
        padding: '0 60px', lineHeight: 1.1, WebkitTextStroke: '6px black',
        paintOrder: 'stroke', textShadow: '0 8px 20px rgba(0,0,0,0.6)',
      }}>
        {page.tokens.map((t) => {
          const active = nowMs >= t.fromMs && nowMs < t.toMs;
          return (
            <span key={t.fromMs} style={{
              color: active ? HIGHLIGHT : 'white',
              display: 'inline-block',
              transform: active ? 'scale(1.15) rotate(-2deg)' : 'none',
              whiteSpace: 'pre',
            }}>{t.text}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ShortEdit = ({src, captions}: {src: string; captions: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [pages, setPages] = useState<TikTokPage[] | null>(null);
  const [handle] = useState(() => delayRender('captions'));

  useEffect(() => {
    fetch(staticFile(captions))
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => [])
      .then((c: Caption[]) => {
        setPages(createTikTokStyleCaptions({captions: c, combineTokensWithinMilliseconds: 900}).pages);
        continueRender(handle);
      });
  }, [captions, handle]);

  // Alternate punch-in zoom on each caption page (jump-cut feel).
  const idx = pages?.findIndex((p, i) => {
    const next = pages[i + 1];
    const ms = (frame / fps) * 1000;
    return ms >= p.startMs && (!next || ms < next.startMs);
  }) ?? -1;
  const zoom = idx >= 0 && idx % 2 === 1 ? 1.15 : 1.0;

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      {pages?.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const end = next ? next.startMs : page.startMs + page.durationMs;
        const dur = Math.max(1, Math.round((end / 1000) * fps) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Page page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
