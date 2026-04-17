import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { PipelineCard } from '../components/PipelineCard';
import { colors, fonts } from '../styles/tokens';

const PHASES = [
  { num: '① REACH', title: 'Reach', color: colors.reach },
  { num: '② DISCOVER', title: 'Discover', color: colors.discover },
  { num: '③ QUALIFY', title: 'Qualify', color: colors.qualify },
  { num: '④ PROPOSE', title: 'Propose & Agree', color: colors.propose },
  { num: '⑤ DELIVER', title: 'Deliver & Approve', color: colors.deliver },
  { num: '⑥ LEARN', title: 'Learn & Innovate', color: colors.learn },
];

/** Expanded detail text for each phase — readable labels, not just icons */
const PHASE_DETAILS: { icon: string; label: string }[][] = [
  // Reach
  [
    { icon: '🎯', label: 'Outbound' },
    { icon: '💼', label: 'LinkedIn' },
    { icon: '💬', label: 'Community' },
    { icon: '🎤', label: 'Events' },
    { icon: '🔍', label: 'SEO' },
    { icon: '🗣️', label: 'Referrals' },
  ],
  // Discover
  [
    { icon: '🏠', label: 'Homepage' },
    { icon: '📚', label: 'Education Hub' },
    { icon: '📊', label: 'Case Studies' },
    { icon: '⚙️', label: 'How We Work' },
  ],
  // Qualify
  [
    { icon: '💬', label: 'Self-Assessment' },
    { icon: '🤖', label: 'AI Pre-Qual' },
    { icon: '👤', label: 'Human Review' },
  ],
  // Propose
  [
    { icon: '📞', label: 'Discovery Call' },
    { icon: '📄', label: 'AI Proposal' },
    { icon: '✅', label: 'Customer Approves' },
  ],
  // Deliver
  [
    { icon: '🤖', label: 'Agents Build' },
    { icon: '💡', label: 'Engineers Review' },
    { icon: '👤', label: 'Human PR Gate' },
  ],
  // Learn
  [
    { icon: '📊', label: 'Usage Insights' },
    { icon: '💡', label: 'AI Suggestions' },
    { icon: '🧠', label: 'Knowledge Base' },
  ],
];

export const Scene5ZoomOut: React.FC = () => {
  const frame = useCurrentFrame();

  const arrowOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const FLASH_START = 90;
  const FLASH_PER = 25;

  return (
    <AbsoluteFill style={{ backgroundColor: '#111827' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{
          fontSize: 18, fontWeight: 700, color: colors.textLight, fontFamily: fonts.sans,
          letterSpacing: '0.15em', textTransform: 'uppercase' as const,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          The Full Value Stream
        </div>
      </div>

      {/* Pipeline row */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0,
        padding: '0 40px',
      }}>
        {PHASES.map((phase, i) => {
          const enterFrame = 10 + i * 12;
          const flashFrame = frame - FLASH_START - i * FLASH_PER;
          const isFlashing = flashFrame >= 0 && flashFrame < FLASH_PER;

          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PipelineCard
                  num={phase.num}
                  title={phase.title}
                  color={phase.color}
                  frame={frame}
                  enterFrame={enterFrame}
                  isHighlighted={isFlashing}
                  glowColor={phase.color}
                />

                {/* Expanded detail — actual text labels, not just icons */}
                {isFlashing && (
                  <div style={{
                    marginTop: 14, backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '14px 16px',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    opacity: interpolate(flashFrame, [0, 4, FLASH_PER - 4, FLASH_PER], [0, 1, 1, 0], {
                      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                    }),
                    width: 220,
                  }}>
                    {PHASE_DETAILS[i].map((item, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        fontSize: 14, color: 'rgba(255,255,255,0.85)',
                        fontFamily: fonts.sans, fontWeight: 500,
                      }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {i < PHASES.length - 1 && (
                <div style={{
                  fontSize: 24, color: 'rgba(255,255,255,0.3)',
                  alignSelf: 'center', padding: '0 8px',
                  opacity: arrowOpacity, marginTop: 16,
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Subtitle */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(frame, [60, 80], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }),
      }}>
        <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', fontFamily: fonts.sans }}>
          What you just saw is{' '}
          <strong style={{ color: colors.qualify }}>step 3 of 6</strong>
          . There's a whole machine behind it.
        </span>
      </div>
    </AbsoluteFill>
  );
};
