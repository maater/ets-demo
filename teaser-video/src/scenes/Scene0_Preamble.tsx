import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 0 — Preamble (600 frames / 20s)

  Sets context for the viewer: what Vixul believes, and what they're about to see.

  0-180f:    Beat 1 — "What you are about to see..."
  180-510f:  Beat 2 — "Human-led discovery, AI-led delivery..."
  490-600f:  Beat 3 — "This is what Service as Software feels like..."
*/

export const Scene0Preamble: React.FC = () => {
  const frame = useCurrentFrame();

  const beat1Opacity = interpolate(frame, [0, 15, 165, 185], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Beat 2 audio (preamble2.mp3) is 339 frames, starting at f190 → ends at f529.
  // Hold beat 2 text until audio finishes, then fade out so next slide doesn't
  // appear while "and EBITDA" is still playing.
  const beat2Opacity = interpolate(frame, [185, 200, 515, 535], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const beat3Opacity = interpolate(frame, [535, 550, 695, 715], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Subtle gradient bg shift
  const bgBrightness = interpolate(frame, [0, 360, 720], [0.02, 0.04, 0.02], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: `rgb(${Math.round(11 * (1 + bgBrightness))},${Math.round(17 * (1 + bgBrightness))},${Math.round(32 * (1 + bgBrightness))})`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Vixul wordmark — subtle, top area */}
      <div style={{
        position: 'absolute', top: 48, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(frame, [0, 30, 680, 720], [0, 0.4, 0.4, 0], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }),
      }}>
        <span style={{
          fontSize: 24, fontWeight: 700, color: '#9CA3AF', fontFamily: fonts.sans,
          letterSpacing: '0.2em', textTransform: 'uppercase' as const,
        }}>Vixul</span>
      </div>

      {/* Beat 1 */}
      <div style={{
        position: 'absolute', opacity: beat1Opacity,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 120px', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 56, fontWeight: 600, color: '#E5E7EB',
          fontFamily: fonts.sans, lineHeight: 1.4, maxWidth: 1200,
        }}>
          What you are about to see is what we at{' '}
          <span style={{ color: colors.primary, fontWeight: 700 }}>Vixul</span>{' '}
          believe will be the future of technology services companies.
        </div>
      </div>

      {/* Beat 2 */}
      <div style={{
        position: 'absolute', opacity: beat2Opacity,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 100px', textAlign: 'center', gap: 32,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 600, color: '#E5E7EB',
          fontFamily: fonts.sans, lineHeight: 1.5, maxWidth: 1300,
        }}>
          Companies that use{' '}
          <span style={{ color: '#34D399', fontWeight: 700 }}>human-led, AI-enabled discovery</span>
          {' '}and{' '}
          <span style={{ color: colors.primary, fontWeight: 700 }}>AI-led delivery</span>.
        </div>
        <div style={{
          fontSize: 48, fontWeight: 500, color: '#9CA3AF',
          fontFamily: fonts.sans, lineHeight: 1.5, maxWidth: 1200,
        }}>
          To deliver excellent customer experience,
          <br />
          high gross margins, and EBITDA.
        </div>
      </div>

      {/* Beat 3 */}
      <div style={{
        position: 'absolute', opacity: beat3Opacity,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 120px', textAlign: 'center',
      }}>
        <div style={{
          fontSize: 56, fontWeight: 700, color: '#F9FAFB',
          fontFamily: fonts.sans, lineHeight: 1.4, maxWidth: 1200,
        }}>
          This is what{' '}
          <span style={{
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
          }}>Service as Software</span>{' '}
          feels like.
        </div>
      </div>
    </AbsoluteFill>
  );
};
