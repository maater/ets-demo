import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import { fonts } from '../styles/tokens';

/*
  Cover — Cinematic Title Card (120 frames / 4s)

  Full-screen dark. Sarah's portrait large on the left.
  Name + company + one-liner fades in on the right.
  Fades to black at the end into the preamble.

  0-30f:   Background fades up, photo slides+fades in
  20-60f:  Name + title fade in
  50-90f:  Tagline fades in
  100-120f: Fade to black
*/

export const SceneCover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const photoScale = spring({ frame, fps, config: { damping: 28, stiffness: 60 }, from: 1.06, to: 1 });
  const photoOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const nameOpacity = interpolate(frame, [22, 42], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const nameY = interpolate(frame, [22, 42], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [35, 52], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [52, 72], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [100, 120], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#080E1C',
      opacity: bgOpacity * fadeOut,
      display: 'flex', flexDirection: 'row',
      alignItems: 'stretch',
    }}>
      {/* Left — Sarah's photo, fills left 45% */}
      <div style={{
        width: '45%', position: 'relative', overflow: 'hidden',
        opacity: photoOpacity,
      }}>
        <Img
          src={staticFile('images/sarah-mitchell.jpg')}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            transform: `scale(${photoScale})`,
            transformOrigin: 'center top',
          }}
        />
        {/* Gradient bleed into right side */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 160,
          background: 'linear-gradient(to right, transparent, #080E1C)',
        }} />
        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
          background: 'linear-gradient(to top, #080E1C, transparent)',
        }} />
      </div>

      {/* Right — text block */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '0 80px 0 60px', gap: 20,
      }}>
        {/* Name */}
        <div style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
        }}>
          <div style={{
            fontSize: 88, fontWeight: 800, color: '#F9FAFB',
            fontFamily: fonts.sans, lineHeight: 1.05, letterSpacing: '-0.02em',
          }}>
            Sarah Mitchell
          </div>
        </div>

        {/* Title */}
        <div style={{
          opacity: titleOpacity,
          fontSize: 34, color: '#6B7280',
          fontFamily: fonts.sans, fontWeight: 500,
          letterSpacing: '0.02em',
        }}>
          VP of Information Technology
          <br />
          <span style={{ color: '#4B5563' }}>Meridian Partners</span>
        </div>

        {/* Divider */}
        <div style={{
          opacity: taglineOpacity,
          width: 60, height: 2, backgroundColor: '#2563EB', borderRadius: 2,
        }} />

        {/* Tagline */}
        <div style={{
          opacity: taglineOpacity,
          fontSize: 40, color: '#9CA3AF',
          fontFamily: fonts.sans, fontWeight: 400,
          lineHeight: 1.5, maxWidth: 540,
        }}>
          Her company is sitting on{' '}
          <span style={{ color: '#E5E7EB', fontWeight: 600 }}>
            10 years of SAP data.
          </span>
          <br />
          Nobody knows what to do with it.
        </div>
      </div>
    </AbsoluteFill>
  );
};
