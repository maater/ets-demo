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
  Scene 5 — Pipeline Zoom Out (390 frames / 13s)

  0-110f:    Large overlay with dwell: "What you just experienced was one step."
  100-135f:  Overlay fades, pipeline view fades in
  135-155f:  Phase cards enter with spring animation
  155-180f:  Arrows appear
  180-360f:  Sequential phase expansion (6 phases × 30f each)
  360-390f:  Settle + subtitle
*/

/* ── Data matching the actual demo ────────────────────── */

const PHASES = [
  {
    num: '① REACH', title: 'Reach', color: colors.reach,
    sub: 'Signal-based outbound, content, community, conferences.',
    actors: [
      { label: 'Marketing', bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3' },
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    ],
  },
  {
    num: '② DISCOVER', title: 'Discover', color: colors.discover,
    sub: 'Customer reads blog, reviews case studies, understands the approach.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    ],
  },
  {
    num: '③ QUALIFY', title: 'Qualify', color: colors.qualify,
    sub: 'Self-assessment, AI pre-qualification, human review.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Sales', bg: '#F0FDF4', color: '#059669', border: '#BBF7D0' },
    ],
  },
  {
    num: '④ PROPOSE', title: 'Propose & Agree', color: colors.propose,
    sub: 'Discovery call, AI-drafted proposal, interactive review.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Sales', bg: '#F0FDF4', color: '#059669', border: '#BBF7D0' },
    ],
  },
  {
    num: '⑤ DELIVER', title: 'Deliver & Approve', color: colors.deliver,
    sub: 'Agents build 24/7, engineers review, customer approves.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Delivery', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
    ],
  },
  {
    num: '⑥ LEARN', title: 'Learn & Innovate', color: colors.learn,
    sub: 'Usage insights generate AI improvement proposals.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Admin', bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
    ],
  },
];

interface StepData {
  icon: string; title: string; desc: string; tag: string;
  tagStyle: { bg: string; color: string; border: string };
}
interface LaneData { role: string; roleColor: string; steps: StepData[]; }

const TAG_AI    = { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
const TAG_HUMAN = { bg: '#F0FDF4', color: '#059669', border: '#BBF7D0' };
const TAG_BOTH  = { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' };

const PHASE_DETAILS: { header: string; lanes: LaneData[] }[] = [
  {
    header: 'Multiple touchpoints build familiarity before the first click',
    lanes: [{
      role: 'Customer', roleColor: colors.reach,
      steps: [
        { icon: '🎯', title: 'Targeted Outbound', desc: 'Signal engine detects SAP pain', tag: 'Signal', tagStyle: { bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3' } },
        { icon: '💼', title: 'LinkedIn Content', desc: 'SAP spend analysis in feed', tag: 'Signal', tagStyle: { bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3' } },
        { icon: '🔍', title: 'Search & SEO', desc: 'Education hub ranks first', tag: 'Self-serve', tagStyle: TAG_HUMAN },
        { icon: '🗣️', title: 'Referrals', desc: '"They built exactly what you need"', tag: 'Human', tagStyle: TAG_HUMAN },
      ],
    }],
  },
  {
    header: 'Customer explores, reads, and builds conviction',
    lanes: [{
      role: 'Customer', roleColor: colors.discover,
      steps: [
        { icon: '🏠', title: 'Lands on Homepage', desc: 'Value prop, social proof, clear CTA', tag: 'Human', tagStyle: TAG_HUMAN },
        { icon: '📚', title: 'Education Hub', desc: 'SAP data strategy articles', tag: 'Self-serve', tagStyle: TAG_HUMAN },
        { icon: '📊', title: 'Case Studies', desc: 'Real metrics, timelines, outcomes', tag: 'Self-serve', tagStyle: TAG_HUMAN },
        { icon: '⚙️', title: 'How We Work', desc: 'Sprint loop, pricing, model', tag: 'Self-serve', tagStyle: TAG_HUMAN },
      ],
    }],
  },
  {
    header: 'From interest to qualified lead',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '💬', title: 'Self-Assessment', desc: 'SAP modules, pain points, stack', tag: 'AI-led', tagStyle: TAG_AI },
        ],
      },
      {
        role: 'Axon Sales', roleColor: colors.propose,
        steps: [
          { icon: '🤖', title: 'AI Pre-Qual', desc: 'Fit score from KB patterns', tag: 'AI', tagStyle: TAG_AI },
          { icon: '👤', title: 'Human Review', desc: 'Sales SME reviews & approves', tag: 'Human + AI', tagStyle: TAG_BOTH },
        ],
      },
    ],
  },
  {
    header: 'From discovery to signed scope',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '📞', title: 'Discovery Call', desc: 'AI captures context live', tag: 'Human + AI', tagStyle: TAG_BOTH },
          { icon: '📄', title: 'Reviews Proposal', desc: 'Interactive, sets priorities', tag: 'Both loops', tagStyle: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' } },
          { icon: '✅', title: 'Approves Scope', desc: 'Signs off, work begins', tag: 'Human', tagStyle: TAG_HUMAN },
        ],
      },
      {
        role: 'Axon Sales', roleColor: colors.propose,
        steps: [
          { icon: '🗒️', title: 'AI Discovery', desc: 'Completeness score, agenda', tag: 'AI-assisted', tagStyle: TAG_AI },
          { icon: '✍️', title: 'AI Drafts Proposal', desc: 'Epics, stories, timeline', tag: 'Human + AI', tagStyle: TAG_BOTH },
        ],
      },
    ],
  },
  {
    header: 'Agents build, humans approve, customers watch',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '👁️', title: 'Full Visibility', desc: 'Sprint progress, milestones', tag: 'Self-serve', tagStyle: TAG_HUMAN },
          { icon: '🎬', title: 'Early Demos', desc: 'Working software mid-sprint', tag: 'Human', tagStyle: TAG_HUMAN },
          { icon: '✅', title: 'Approves Work', desc: 'Reviews, full audit trail', tag: 'Human', tagStyle: TAG_HUMAN },
        ],
      },
      {
        role: 'Axon Delivery', roleColor: colors.deliver,
        steps: [
          { icon: '🤖', title: 'Agents Build', desc: 'Code, test, document. 24/7', tag: 'AI-driven', tagStyle: TAG_AI },
          { icon: '💡', title: 'Surface Ideas', desc: 'Improvements during build', tag: '→ Loop A', tagStyle: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' } },
          { icon: '👤', title: 'PR Review', desc: 'Human reviews every output', tag: 'Human gate', tagStyle: TAG_HUMAN },
        ],
      },
    ],
  },
  {
    header: 'Usage intelligence drives the next cycle',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '📊', title: 'Uses Product', desc: 'Patterns, friction, gaps', tag: 'Human', tagStyle: TAG_HUMAN },
          { icon: '💡', title: 'AI Suggestions', desc: 'Improvement proposals', tag: '→ Loop B', tagStyle: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' } },
        ],
      },
      {
        role: 'Axon Admin', roleColor: colors.learn,
        steps: [
          { icon: '🧠', title: 'Knowledge Base', desc: 'Compounds every engagement', tag: 'AI + Human', tagStyle: TAG_BOTH },
        ],
      },
    ],
  },
];

/* ── Step card component ──────── */
const StepCard: React.FC<{ step: StepData }> = ({ step }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
    padding: '11px 13px',
    minWidth: 120, maxWidth: 200, flex: '1 1 0',
  }}>
    <div style={{ fontSize: 20, marginBottom: 5 }}>{step.icon}</div>
    <div style={{
      fontSize: 13, fontWeight: 700, color: '#111827',
      lineHeight: 1.3, marginBottom: 3, fontFamily: fonts.sans,
    }}>{step.title}</div>
    <div style={{
      fontSize: 10, color: '#6B7280', lineHeight: 1.5,
      flex: 1, fontFamily: fonts.sans,
    }}>{step.desc}</div>
    <span style={{
      marginTop: 7, display: 'inline-block',
      fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
      padding: '2px 7px', borderRadius: 20,
      textTransform: 'uppercase' as const, alignSelf: 'flex-start',
      background: step.tagStyle.bg, color: step.tagStyle.color,
      border: `1px solid ${step.tagStyle.border}`, fontFamily: fonts.sans,
    }}>{step.tag}</span>
  </div>
);

/* ── Main scene ──────────────────────────────────────── */
export const Scene5ZoomOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overlay phase — two beats with pause
  // Beat 1: 10 words × 7f = 70f. Visible 12-90 = 78f. ✓
  const beat1Opacity = interpolate(frame, [0, 12, 90, 105], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Beat 2: 5 words × 7f = 35f. Visible 115-160 = 45f. ✓
  const beat2Opacity = interpolate(frame, [105, 115, 160, 175], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const overlayBgOpacity = interpolate(frame, [0, 5, 155, 175], [0.92, 0.92, 0.92, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const pipelineOpacity = interpolate(frame, [160, 185], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const arrowOpacity = interpolate(frame, [215, 235], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase expansion starts at frame 235
  const FLASH_START = 235;
  const FLASH_PER = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>

      {/* ── Large overlay: two beats ── */}
      {frame < 175 && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(11,17,32,${overlayBgOpacity})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 24, zIndex: 50,
        }}>
          {/* Beat 1: "What you just experienced was one step" */}
          <div style={{
            fontSize: 64, fontWeight: 800, color: '#F9FAFB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.3,
            maxWidth: 1100, opacity: beat1Opacity,
          }}>
            What you just experienced was
            <br />
            <span style={{ color: colors.primary }}>one step</span> in this engagement.
          </div>
          {/* Beat 2: "But there are five more." */}
          <div style={{
            fontSize: 64, fontWeight: 800, color: '#F9FAFB',
            fontFamily: fonts.sans, textAlign: 'center',
            opacity: beat2Opacity,
          }}>
            But there are <span style={{ color: colors.primary }}>five more.</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Pipeline view (fades in during overlay fadeout) ── */}
      <div style={{ opacity: pipelineOpacity }}>

        {/* Nav bar */}
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

        {/* Hero */}
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', fontFamily: fonts.sans, marginBottom: 6 }}>
            AI-First Service Delivery
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', fontFamily: fonts.sans }}>
            Follow Meridian Partners from first signal through delivery and continuous innovation.
          </div>
        </div>

        {/* Pipeline row */}
        <div style={{
          position: 'absolute', top: 120, left: 0, right: 0,
          display: 'flex', alignItems: 'stretch', gap: 0,
          padding: '0 32px', maxWidth: 1260, margin: '0 auto',
        }}>
          {PHASES.map((phase, i) => {
            const enterFrame = 180 + i * 8;
            const entered = frame >= enterFrame;
            const slideY = entered
              ? spring({ frame: frame - enterFrame, fps, config: { damping: 14, stiffness: 80 }, from: 80, to: 0 })
              : 80;
            const cardOpacity = entered
              ? spring({ frame: frame - enterFrame, fps, config: { damping: 20, stiffness: 100 }, from: 0, to: 1 })
              : 0;

            const flashFrame = frame - FLASH_START - i * FLASH_PER;
            const isActive = flashFrame >= 0 && flashFrame < FLASH_PER;

            return (
              <React.Fragment key={i}>
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  background: '#fff', border: `2px solid ${isActive ? phase.color : '#E5E7EB'}`,
                  borderRadius: 12, padding: '16px 14px 14px',
                  position: 'relative', overflow: 'hidden', minWidth: 0,
                  opacity: cardOpacity, transform: `translateY(${slideY}px)`,
                  boxShadow: isActive
                    ? `0 4px 16px ${phase.color}33`
                    : '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)',
                      width: 40, height: 4, backgroundColor: phase.color, borderRadius: '2px 2px 0 0',
                    }} />
                  )}
                  <div style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const, color: phase.color,
                    marginBottom: 6, fontFamily: fonts.sans,
                  }}>{phase.num}</div>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: '#111827',
                    marginBottom: 4, lineHeight: 1.3, fontFamily: fonts.sans,
                  }}>{phase.title}</div>
                  <div style={{
                    fontSize: 10.5, color: '#9CA3AF', lineHeight: 1.5, flex: 1, fontFamily: fonts.sans,
                  }}>{phase.sub}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {phase.actors.map((a, j) => (
                      <span key={j} style={{
                        fontSize: 8.5, fontWeight: 700, letterSpacing: '0.06em',
                        padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase' as const,
                        background: a.bg, color: a.color, border: `1px solid ${a.border}`,
                        fontFamily: fonts.sans,
                      }}>{a.label}</span>
                    ))}
                  </div>
                  <div style={{
                    fontSize: 9, color: isActive ? phase.color : '#D1D5DB',
                    marginTop: 6, fontFamily: fonts.sans,
                  }}>
                    {isActive ? '▲ Collapse' : '▼ Expand'}
                  </div>
                </div>
                {i < PHASES.length - 1 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: '#D1D5DB', flex: '0 0 20px',
                    opacity: arrowOpacity,
                  }}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        {PHASES.map((phase, i) => {
          const flashFrame = frame - FLASH_START - i * FLASH_PER;
          const isActive = flashFrame >= 0 && flashFrame < FLASH_PER;
          if (!isActive) return null;

          const detail = PHASE_DETAILS[i];
          const detailOpacity = interpolate(flashFrame, [0, 4, FLASH_PER - 4, FLASH_PER], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });

          return (
            <div key={`detail-${i}`} style={{
              position: 'absolute', top: 370, left: 32, right: 32,
              maxWidth: 1260, margin: '0 auto', opacity: detailOpacity,
            }}>
              <div style={{
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
                padding: '24px 24px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F3F4F6',
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const, color: phase.color, fontFamily: fonts.sans,
                  }}>{phase.num}</span>
                  <span style={{
                    fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: fonts.sans,
                  }}>{detail.header}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr' }}>
                  {detail.lanes.map((lane, li) => (
                    <React.Fragment key={li}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                        paddingRight: 12, borderRight: '2px solid #E5E7EB',
                      }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                          textTransform: 'uppercase' as const,
                          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                          textAlign: 'center', color: lane.roleColor, fontFamily: fonts.sans,
                        }}>{lane.role}</span>
                      </div>
                      <div style={{
                        padding: '12px 0 12px 18px',
                        borderBottom: li < detail.lanes.length - 1 ? '1px solid #F3F4F6' : 'none',
                      }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 6,
                        }}>
                          {lane.steps.map((step, si) => (
                            <React.Fragment key={si}>
                              {si > 0 && (
                                <span style={{
                                  fontSize: 16, color: '#2563EB', flex: '0 0 auto',
                                  alignSelf: 'center', fontFamily: fonts.sans,
                                }}>→</span>
                              )}
                              <StepCard step={step} />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom text during tile expansion */}
        <div style={{
          position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(frame, [FLASH_START, FLASH_START + 15], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}>
          <span style={{ fontSize: 64, color: '#6B7280', fontFamily: fonts.sans, lineHeight: 1.4 }}>
            All steps are <span style={{ color: colors.primary, fontWeight: 700 }}>AI-enabled</span>
            <br />for both Sarah and the service provider.
          </span>
        </div>

        {/* Loop legend */}
        <div style={{
          position: 'absolute', bottom: 12, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 20,
          opacity: interpolate(frame, [230, 250], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {[
            { label: 'AI-led', color: '#2563EB' },
            { label: 'Human-led', color: '#059669' },
            { label: 'Human + AI', color: '#D97706' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#6B7280', fontFamily: fonts.sans }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
