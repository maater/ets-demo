import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 2 — Website landing + CTA click (120 frames / 4s)

  0-40f:   Dark overlay with narrative text (large, readable)
  35-55f:  Overlay fades out, website fades in
  55-80f:  Cursor moves toward CTA
  80-90f:  Click ripple
  90-120f: Zoom into button + fade out
*/

export const Scene2Click: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Narrative overlay — shown first, before the website
  const narrativeOpacity = interpolate(frame, [0, 8, 30, 45], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Website fades in after narrative
  const pageOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const cursorX = interpolate(frame, [50, 78], [1400, 960], { extrapolateRight: 'clamp' });
  const cursorY = interpolate(frame, [50, 78], [800, 590], { extrapolateRight: 'clamp' });

  const btnShadow = frame >= 75
    ? '0 8px 24px rgba(37,99,235,0.25), 0 2px 8px rgba(0,0,0,0.1)'
    : '0 2px 8px rgba(0,0,0,0.08)';
  const btnY = frame >= 75 ? -3 : 0;

  const rippleProgress = frame >= 82 ? (frame - 82) / 10 : 0;
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.01, 2.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const zoom = interpolate(frame, [92, 112], [1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [100, 115], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B1120' }}>

      {/* Narrative overlay — shown FIRST on dark bg */}
      {frame < 50 && (
        <AbsoluteFill style={{
          backgroundColor: '#0B1120',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: narrativeOpacity, zIndex: 20,
        }}>
          <div style={{
            fontSize: 48, fontWeight: 600, color: '#E5E7EB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.5,
            maxWidth: 1200,
          }}>
            Sarah from Meridian visits Axon's website —
            <br />
            and starts finding answers to her everyday problems.
          </div>
        </AbsoluteFill>
      )}

      {/* Website — fades in after narrative */}
      <AbsoluteFill style={{
        backgroundColor: colors.bg, opacity: pageOpacity * fadeOut,
        transform: `scale(${zoom})`, transformOrigin: '50% 55%',
      }}>
        {/* Nav bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 72,
          backgroundColor: '#fff', borderBottom: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', padding: '0 48px', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
          }}>A</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: colors.text, fontFamily: fonts.sans }}>
            Axon Labs
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 16, color: colors.textMuted, fontFamily: fonts.sans }}>Education Hub</span>
          <span style={{ fontSize: 16, color: colors.textMuted, fontFamily: fonts.sans, marginLeft: 24 }}>Case Studies</span>
          <span style={{ fontSize: 16, color: colors.textMuted, fontFamily: fonts.sans, marginLeft: 24 }}>How We Work</span>
        </div>

        {/* Hero content */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', gap: 28,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 800, color: colors.text, fontFamily: fonts.sans,
            textAlign: 'center', lineHeight: 1.15, maxWidth: 1000,
          }}>
            SAP Intelligence That Tells You What To Do
          </div>
          <div style={{
            fontSize: 28, color: colors.textMuted, fontFamily: fonts.sans,
            textAlign: 'center', maxWidth: 700, lineHeight: 1.6,
          }}>
            We turn your SAP data into decisions — delivered as working software, not slide decks.
          </div>

          {/* CTA Button */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <div style={{
              padding: '20px 44px', fontSize: 24, fontWeight: 700,
              color: '#fff', backgroundColor: colors.primary, borderRadius: 14,
              fontFamily: fonts.sans, boxShadow: btnShadow,
              transform: `translateY(${btnY}px)`,
            }}>
              See what we'd build for you &rarr;
            </div>
            {frame >= 82 && rippleProgress <= 1 && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 80, height: 80, borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.4)',
                transform: `translate(-50%, -50%) scale(${rippleScale})`,
                opacity: rippleOpacity,
              }} />
            )}
          </div>
        </div>

        {/* Cursor — only visible after website shows */}
        {frame >= 50 && (
          <div style={{
            position: 'absolute', left: cursorX, top: cursorY,
            width: 0, height: 0, pointerEvents: 'none', zIndex: 100,
          }}>
            <svg width="32" height="40" viewBox="0 0 24 30" fill="none">
              <path d="M2 2L2 24L8 18L14 28L18 26L12 16L20 16L2 2Z"
                fill="#111827" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
