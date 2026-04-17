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

export const Scene6Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-15f: Learn card pulses purple
  // 15-60f: Arc trail from Learn → Discover
  // 60-75f: Discover card pulses blue
  // 75-90f: Bookend badges appear
  // 90-135f: Text overlay

  // Learn glow
  const learnGlow = frame >= 0 && frame < 60;
  // Discover glow
  const discoverGlow = frame >= 50;

  // Arc trail progress (SVG)
  const arcProgress = interpolate(frame, [15, 55], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Bookend badges
  const badgeOpacity = interpolate(frame, [70, 82], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Text overlay
  const textOpacity = interpolate(frame, [88, 100], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#111827' }}>
      {/* Pipeline row */}
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0,
      }}>
        {PHASES.map((phase, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <PipelineCard
                num={phase.num}
                title={phase.title}
                color={phase.color}
                frame={frame}
                enterFrame={-1}
                isHighlighted={(i === 5 && learnGlow) || (i === 1 && discoverGlow)}
                glowColor={phase.color}
              />
              {/* Bookend badge on Discover */}
              {i === 1 && (
                <div style={{
                  marginTop: 10, opacity: badgeOpacity,
                  padding: '6px 16px', borderRadius: 22,
                  backgroundColor: colors.qualifyLight,
                  border: `1px solid ${colors.qualifyBorder}`,
                  fontSize: 14, fontWeight: 700, color: colors.qualify,
                  fontFamily: fonts.sans, whiteSpace: 'nowrap',
                }}>
                  🧠 Sourced from ⑥ Knowledge Base
                </div>
              )}
              {/* Bookend badge on Learn */}
              {i === 5 && (
                <div style={{
                  marginTop: 10, opacity: badgeOpacity,
                  padding: '6px 16px', borderRadius: 22,
                  backgroundColor: colors.discoverLight,
                  border: `1px solid ${colors.discoverBorder}`,
                  fontSize: 14, fontWeight: 700, color: colors.discover,
                  fontFamily: fonts.sans, whiteSpace: 'nowrap',
                }}>
                  📚 Powers ② Education Hub
                </div>
              )}
            </div>
            {i < PHASES.length - 1 && (
              <div style={{
                fontSize: 22, color: 'rgba(255,255,255,0.3)',
                alignSelf: 'center', padding: '0 8px', marginTop: 16,
              }}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Arc trail SVG — from Learn (right) back over to Discover (left) */}
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
        {/* Arc path from ~Learn card center to ~Discover card center */}
        <path
          d="M 1520 200 C 1520 60, 400 60, 400 200"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="3"
          strokeDasharray="1200"
          strokeDashoffset={1200 * (1 - arcProgress)}
          opacity={0.8}
        />
        {/* Leading dot — manually positioned along the cubic bezier */}
        {arcProgress > 0 && arcProgress < 1 && (() => {
          // Cubic bezier: P0(1520,200) C1(1520,60) C2(400,60) P3(400,200)
          const t = arcProgress;
          const mt = 1 - t;
          const cx = mt*mt*mt*1520 + 3*mt*mt*t*1520 + 3*mt*t*t*400 + t*t*t*400;
          const cy = mt*mt*mt*200 + 3*mt*mt*t*60 + 3*mt*t*t*60 + t*t*t*200;
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
          fontSize: 48, fontWeight: 800, color: '#fff', fontFamily: fonts.sans,
          lineHeight: 1.4,
        }}>
          Every engagement makes the next one smarter.
        </div>
      </div>
    </AbsoluteFill>
  );
};
