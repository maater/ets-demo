import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
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

/** Simplified phase detail snippets for the flash-expand */
const PHASE_SNIPPETS = [
  // Reach: channel icons
  ['🎯', '💼', '💬', '🎤', '🔍', '🗣️'],
  // Discover: step icons
  ['🏠', '📚', '📊', '⚙️'],
  // Qualify
  ['💬', '🤖', '👤'],
  // Propose
  ['📞', '📄', '✅'],
  // Deliver
  ['🤖', '💡', '👤'],
  // Learn
  ['📊', '💡', '🧠'],
];

export const Scene5ZoomOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A: Cards enter (0-90f / 3s)
  // Phase B: Flash-expand each (90-240f / 5s) — ~25f per phase
  // Phase C: All settled (240-270f / 1s)

  // Arrow opacity
  const arrowOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Flash expand for each phase
  const FLASH_START = 90;
  const FLASH_PER = 25;

  return (
    <AbsoluteFill style={{ backgroundColor: '#111827' }}>
      {/* Title */}
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: colors.textLight, fontFamily: fonts.sans,
          letterSpacing: '0.15em', textTransform: 'uppercase' as const,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
        }}>
          The Full Value Stream
        </div>
      </div>

      {/* Pipeline row */}
      <div style={{
        position: 'absolute',
        top: 140,
        left: 0, right: 0,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0,
      }}>
        {PHASES.map((phase, i) => {
          const enterFrame = 10 + i * 12;
          // Determine if this phase is currently "flashing"
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

                {/* Flash detail snippet */}
                {isFlashing && (
                  <div style={{
                    marginTop: 12,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex', gap: 8, flexWrap: 'wrap',
                    justifyContent: 'center',
                    opacity: interpolate(flashFrame, [0, 5, FLASH_PER - 5, FLASH_PER], [0, 1, 1, 0], {
                      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                    }),
                    width: 170,
                  }}>
                    {PHASE_SNIPPETS[i].map((icon, j) => (
                      <div key={j} style={{
                        width: 32, height: 32, borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {icon}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {i < PHASES.length - 1 && (
                <div style={{
                  fontSize: 22, color: 'rgba(255,255,255,0.3)',
                  alignSelf: 'center', padding: '0 8px',
                  opacity: arrowOpacity,
                  marginTop: 16,
                }}>
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Subtitle: "what you just saw is step 3 of 6" */}
      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(frame, [60, 80], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }),
      }}>
        <span style={{
          fontSize: 18, color: 'rgba(255,255,255,0.6)', fontFamily: fonts.sans,
        }}>
          What you just saw is{' '}
          <strong style={{ color: colors.qualify }}>step 3 of 6</strong>
          . There's a whole machine behind it.
        </span>
      </div>
    </AbsoluteFill>
  );
};
