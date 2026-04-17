import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 }, from: 0.85, to: 1 });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const ctaOpacity = interpolate(frame, [42, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const vixulOpacity = interpolate(frame, [55, 68], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: colors.bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        opacity: logoOpacity, transform: `scale(${logoScale})`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, backgroundColor: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
        }}>A</div>
        <span style={{
          fontSize: 48, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
        }}>Axon Labs</span>
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 26, fontWeight: 500, color: colors.textMuted,
        fontFamily: fonts.sans, opacity: taglineOpacity,
        textAlign: 'center', lineHeight: 1.6, maxWidth: 800,
      }}>
        Axon Labs is a hypothetical company — but these are exactly
        <br />
        the kind of companies we're building at <strong style={{ color: colors.text, fontWeight: 700 }}>Vixul</strong>.
      </div>

      {/* CTA */}
      <div style={{
        opacity: ctaOpacity,
        padding: '16px 40px', borderRadius: 14,
        backgroundColor: colors.primary, color: '#fff',
        fontSize: 24, fontWeight: 700, fontFamily: fonts.sans,
        boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
      }}>
        Learn more about this vision &rarr;
      </div>

      {/* Vixul note */}
      <div style={{
        opacity: vixulOpacity,
        fontSize: 18, color: colors.textLight, fontFamily: fonts.sans,
        textAlign: 'center',
      }}>
        See what our companies are building at vixul.com
      </div>
    </AbsoluteFill>
  );
};
