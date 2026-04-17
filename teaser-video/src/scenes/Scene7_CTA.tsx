import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scales in
  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 }, from: 0.85, to: 1 });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // Tagline types in after 15 frames
  const taglineChars = "AI-first service delivery.";
  const taglineElapsed = Math.max(0, frame - 15);
  const tagVisible = Math.min(taglineChars.length, Math.floor(taglineElapsed * (30 / fps)));

  // CTA link fades in at frame 45
  const ctaOpacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            color: '#fff',
            fontWeight: 800,
            fontFamily: fonts.sans,
          }}
        >
          A
        </div>
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: colors.text,
            fontFamily: fonts.sans,
          }}
        >
          Axon Labs
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 500,
          color: colors.textMuted,
          fontFamily: fonts.sans,
          height: 40,
        }}
      >
        {taglineChars.slice(0, tagVisible)}
      </div>

      {/* CTA */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: colors.primary,
          fontFamily: fonts.sans,
          opacity: ctaOpacity,
          textDecoration: 'underline',
          textUnderlineOffset: 4,
        }}
      >
        See the full demo &rarr;
      </div>
    </AbsoluteFill>
  );
};
