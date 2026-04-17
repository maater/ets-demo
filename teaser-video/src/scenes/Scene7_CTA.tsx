import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

export const Scene7CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 80 }, from: 0.85, to: 1 });
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const ctaOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });


  return (
    <AbsoluteFill style={{
      backgroundColor: colors.bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 32,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 22,
        opacity: logoOpacity, transform: `scale(${logoScale})`,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, backgroundColor: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 42, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
        }}>A</div>
        <span style={{
          fontSize: 72, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
        }}>Axon Labs</span>
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 38, fontWeight: 500, color: colors.textMuted,
        fontFamily: fonts.sans, opacity: taglineOpacity,
        textAlign: 'center', lineHeight: 1.6, maxWidth: 1100,
      }}>
        Axon Labs is a hypothetical company, but these are exactly
        <br />
        the kind of companies we're building at <strong style={{ color: colors.text, fontWeight: 700 }}>Vixul</strong>.
      </div>

      {/* CTA */}
      <div style={{
        opacity: ctaOpacity,
        padding: '20px 52px', borderRadius: 16,
        backgroundColor: colors.primary, color: '#fff',
        fontSize: 36, fontWeight: 700, fontFamily: fonts.sans,
        boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
      }}>
        Learn more about this vision &rarr;
      </div>

      {/* (removed vixul.com line per user request) */}
    </AbsoluteFill>
  );
};
