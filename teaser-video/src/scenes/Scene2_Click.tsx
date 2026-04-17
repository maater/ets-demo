import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { colors, fonts } from '../styles/tokens';

export const Scene2Click: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cursorX = interpolate(frame, [0, 30], [1400, 960], { extrapolateRight: 'clamp' });
  const cursorY = interpolate(frame, [0, 30], [800, 590], { extrapolateRight: 'clamp' });

  const btnShadow = frame >= 28
    ? '0 8px 24px rgba(37,99,235,0.25), 0 2px 8px rgba(0,0,0,0.1)'
    : '0 2px 8px rgba(0,0,0,0.08)';
  const btnY = frame >= 28 ? -3 : 0;

  const rippleProgress = frame >= 40 ? (frame - 40) / 10 : 0;
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.01, 2.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const zoom = interpolate(frame, [50, 60], [1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [55, 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: colors.bg, opacity: fadeOut,
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
          {frame >= 40 && rippleProgress <= 1 && (
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

      {/* Cursor */}
      <div style={{
        position: 'absolute', left: cursorX, top: cursorY,
        width: 0, height: 0, pointerEvents: 'none', zIndex: 100,
      }}>
        <svg width="32" height="40" viewBox="0 0 24 30" fill="none">
          <path d="M2 2L2 24L8 18L14 28L18 26L12 16L20 16L2 2Z"
            fill="#111827" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
