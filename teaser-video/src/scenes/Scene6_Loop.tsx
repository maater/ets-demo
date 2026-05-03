import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 6 — Knowledge Loop (180 frames / 6s)

  Light background, matching Scene 5's tile style.
  Shows all 6 phase cards with arc trail from Learn → Discover.

  0-10f:    Fade in (continuing from Scene 5)
  10-50f:   Learn card pulses purple, arc trail animates
  50-80f:   Arc reaches Discover, Discover glows blue
  80-110f:  Bookend badges appear
  110-150f: Text overlay with dwell
  150-180f: Hold
*/

const PHASES = [
  { num: '① REACH', title: 'Reach', color: colors.reach },
  { num: '② DISCOVER', title: 'Discover', color: colors.discover },
  { num: '③ QUALIFY', title: 'Qualify', color: colors.qualify },
  { num: '④ PROPOSE', title: 'Propose & Agree', color: colors.propose },
  { num: '⑤ DELIVER', title: 'Deliver & Approve', color: colors.deliver },
  { num: '⑥ LEARN', title: 'Learn & Innovate', color: colors.learn },
];

export const Scene6Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const learnGlow = frame >= 0 && frame < 80;
  const discoverGlow = frame >= 50;

  const arcProgress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const badgeOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const textOpacity = interpolate(frame, [115, 135], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Nav bar — matching Scene 5 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB',
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 12,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, backgroundColor: '#2563EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
        }}>A</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: fonts.sans }}>
          Axon Labs
        </span>
        <div style={{ width: 1, height: 22, backgroundColor: '#E5E7EB', margin: '0 4px' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', fontFamily: fonts.sans }}>
          Customer Value Stream
        </span>
      </div>

      {/* Pipeline row — light style matching Scene 5 */}
      <div style={{
        position: 'absolute', top: 180, left: 0, right: 0,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '0 48px', maxWidth: 1260, margin: '0 auto', gap: 0,
      }}>
        {PHASES.map((phase, i) => {
          const isHighlighted = (i === 5 && learnGlow) || (i === 1 && discoverGlow);
          const glow = isHighlighted
            ? `0 0 0 3px ${phase.color}40, 0 0 20px ${phase.color}25`
            : '0 1px 3px rgba(0,0,0,0.04)';

          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{
                  width: 180, background: '#fff',
                  border: `2px solid ${isHighlighted ? phase.color : '#E5E7EB'}`,
                  borderRadius: 12, padding: '16px 14px',
                  boxShadow: glow,
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const, color: phase.color,
                    marginBottom: 6, fontFamily: fonts.sans,
                  }}>{phase.num}</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700, color: '#111827',
                    fontFamily: fonts.sans, lineHeight: 1.3,
                  }}>{phase.title}</div>
                </div>
                {/* Bookend badge on Discover */}
                {i === 1 && (
                  <div style={{
                    marginTop: 10, opacity: badgeOpacity,
                    padding: '6px 16px', borderRadius: 22,
                    backgroundColor: colors.qualifyLight,
                    border: `1px solid ${colors.qualifyBorder}`,
                    fontSize: 13, fontWeight: 700, color: colors.qualify,
                    fontFamily: fonts.sans, whiteSpace: 'nowrap',
                  }}>
                    Sourced from Knowledge Base
                  </div>
                )}
                {/* Bookend badge on Learn */}
                {i === 5 && (
                  <div style={{
                    marginTop: 10, opacity: badgeOpacity,
                    padding: '6px 16px', borderRadius: 22,
                    backgroundColor: colors.discoverLight,
                    border: `1px solid ${colors.discoverBorder}`,
                    fontSize: 13, fontWeight: 700, color: colors.discover,
                    fontFamily: fonts.sans, whiteSpace: 'nowrap',
                  }}>
                    Powers Education Hub
                  </div>
                )}
              </div>
              {i < PHASES.length - 1 && (
                <div style={{
                  fontSize: 18, color: '#D1D5DB',
                  alignSelf: 'center', padding: '0 6px', marginTop: 16,
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Arc trail SVG — from Learn back to Discover */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1920 1080"
      >
        <defs>
          <linearGradient id="arcGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={colors.learn} />
            <stop offset="100%" stopColor={colors.discover} />
          </linearGradient>
        </defs>
        <path
          d="M 1420 180 C 1420 70, 500 70, 500 180"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="3"
          strokeDasharray="1200"
          strokeDashoffset={1200 * (1 - arcProgress)}
          opacity={0.7}
        />
        {arcProgress > 0 && arcProgress < 1 && (() => {
          const t = arcProgress;
          const mt = 1 - t;
          const cx = mt*mt*mt*1420 + 3*mt*mt*t*1420 + 3*mt*t*t*500 + t*t*t*500;
          const cy = mt*mt*mt*180 + 3*mt*mt*t*70 + 3*mt*t*t*70 + t*t*t*180;
          return (
            <circle cx={cx} cy={cy} r="6" fill={colors.primary} opacity={0.9} />
          );
        })()}
      </svg>

      {/* Text overlay */}
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center',
        opacity: textOpacity,
      }}>
        <div style={{
          fontSize: 64, fontWeight: 800, color: '#111827', fontFamily: fonts.sans,
          lineHeight: 1.4,
        }}>
          And Axon Labs keeps getting smarter with every engagement.
        </div>
      </div>
    </AbsoluteFill>
  );
};
