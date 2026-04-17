import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { colors, fonts } from '../styles/tokens';

/* ── Data matching the actual demo ────────────────────── */

const PHASES = [
  {
    num: '① REACH', title: 'Reach', color: colors.reach,
    sub: 'Signal-based outbound, content, community, conferences. Multiple touchpoints build familiarity.',
    actors: [
      { label: 'Marketing', bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3' },
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    ],
  },
  {
    num: '② DISCOVER', title: 'Discover', color: colors.discover,
    sub: 'Customer explores the site — reads blog, reviews case studies, understands the approach.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    ],
  },
  {
    num: '③ QUALIFY', title: 'Qualify', color: colors.qualify,
    sub: 'Self-assessment, AI pre-qualification, human review. From interest to qualified lead.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Sales', bg: '#F0FDF4', color: '#059669', border: '#BBF7D0' },
    ],
  },
  {
    num: '④ PROPOSE', title: 'Propose & Agree', color: colors.propose,
    sub: 'Discovery call, AI-drafted proposal, interactive review. Both loops feed back here.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Sales', bg: '#F0FDF4', color: '#059669', border: '#BBF7D0' },
    ],
  },
  {
    num: '⑤ DELIVER', title: 'Deliver & Approve', color: colors.deliver,
    sub: 'Agents build 24/7, engineers review, customer approves. Loop A feeds back to backlog.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Delivery', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
    ],
  },
  {
    num: '⑥ LEARN', title: 'Learn & Innovate', color: colors.learn,
    sub: 'Usage insights generate AI improvement proposals. Loop B feeds back to proposal.',
    actors: [
      { label: 'Customer', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
      { label: 'Admin', bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
    ],
  },
];

interface StepData {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  tagStyle: { bg: string; color: string; border: string };
}

interface LaneData {
  role: string;
  roleColor: string;
  steps: StepData[];
}

const TAG_AI    = { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
const TAG_HUMAN = { bg: '#F0FDF4', color: '#059669', border: '#BBF7D0' };
const TAG_BOTH  = { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' };

const PHASE_DETAILS: { header: string; lanes: LaneData[] }[] = [
  // Reach — simplified single lane
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
  // Discover
  {
    header: 'Customer explores, reads, and builds conviction',
    lanes: [{
      role: 'Customer', roleColor: colors.discover,
      steps: [
        { icon: '🏠', title: 'Lands on Homepage', desc: 'Value prop clicks, social proof, clear CTA', tag: 'Human', tagStyle: TAG_HUMAN },
        { icon: '📚', title: 'Reads Education Hub', desc: 'SAP data strategy, procurement optimization', tag: 'Self-serve', tagStyle: TAG_HUMAN },
        { icon: '📊', title: 'Reviews Case Studies', desc: 'Real metrics, timelines, outcomes', tag: 'Self-serve', tagStyle: TAG_HUMAN },
        { icon: '⚙️', title: 'How We Work', desc: 'Engagement model, pricing, sprint loop', tag: 'Self-serve', tagStyle: TAG_HUMAN },
      ],
    }],
  },
  // Qualify — two lanes
  {
    header: 'From interest to qualified lead',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '💬', title: 'Self-Assessment', desc: 'SAP modules, pain points, reporting stack', tag: 'AI-led', tagStyle: TAG_AI },
        ],
      },
      {
        role: 'Axon Sales', roleColor: colors.propose,
        steps: [
          { icon: '🤖', title: 'AI Pre-Qualification', desc: 'Fit score, complexity from KB patterns', tag: 'AI-generated', tagStyle: TAG_AI },
          { icon: '👤', title: 'Human Reviews Brief', desc: 'Sales SME reviews AI report, approves', tag: 'Human + AI', tagStyle: TAG_BOTH },
        ],
      },
    ],
  },
  // Propose
  {
    header: 'From discovery to signed scope',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '📞', title: 'Discovery Call', desc: 'AI captures context in real time', tag: 'Human + AI', tagStyle: TAG_BOTH },
          { icon: '📄', title: 'Reviews & Prioritizes', desc: 'Interactive proposal, sets priorities', tag: 'Both loops', tagStyle: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' } },
          { icon: '✅', title: 'Approves Scope', desc: 'Signs off, work begins immediately', tag: 'Human', tagStyle: TAG_HUMAN },
        ],
      },
      {
        role: 'Axon Sales', roleColor: colors.propose,
        steps: [
          { icon: '🗒️', title: 'AI-Guided Discovery', desc: 'Context completeness score, pre-loaded agenda', tag: 'AI-assisted', tagStyle: TAG_AI },
          { icon: '✍️', title: 'AI Drafts Proposal', desc: 'Epics, stories, timeline from KB', tag: 'Human + AI', tagStyle: TAG_BOTH },
        ],
      },
    ],
  },
  // Deliver
  {
    header: 'Agents build, humans approve, customers watch',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '👁️', title: 'Full Visibility', desc: 'Sprint progress, agent activity, milestones', tag: 'Self-serve', tagStyle: TAG_HUMAN },
          { icon: '🎬', title: 'Reviews Early Demos', desc: 'Working software mid-sprint', tag: 'Human', tagStyle: TAG_HUMAN },
          { icon: '✅', title: 'Approves Deliverables', desc: 'Reviews, approves, full audit trail', tag: 'Human', tagStyle: TAG_HUMAN },
        ],
      },
      {
        role: 'Axon Delivery', roleColor: colors.deliver,
        steps: [
          { icon: '🤖', title: 'Agents Build', desc: 'Research, code, test, document. 24/7', tag: 'AI-driven', tagStyle: TAG_AI },
          { icon: '💡', title: 'Engineers Surface Ideas', desc: 'Improvements spotted during implementation', tag: '→ Loop A', tagStyle: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' } },
          { icon: '👤', title: 'Human PR Review', desc: 'Every agent output reviewed by a human', tag: 'Human gate', tagStyle: TAG_HUMAN },
        ],
      },
    ],
  },
  // Learn
  {
    header: 'Usage intelligence drives the next cycle',
    lanes: [
      {
        role: 'Customer', roleColor: colors.discover,
        steps: [
          { icon: '📊', title: 'Uses the Product', desc: 'Usage patterns, friction, gaps detected', tag: 'Human', tagStyle: TAG_HUMAN },
          { icon: '💡', title: 'Reviews AI Suggestions', desc: 'AI generates improvement proposals', tag: '→ Loop B', tagStyle: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' } },
        ],
      },
      {
        role: 'Axon Admin', roleColor: colors.learn,
        steps: [
          { icon: '🧠', title: 'Knowledge Base', desc: 'Compounds every engagement. Powers Education Hub.', tag: 'AI + Human', tagStyle: TAG_BOTH },
        ],
      },
    ],
  },
];

/* ── Step card component (matches demo's .step) ──────── */
const StepCard: React.FC<{ step: StepData; scale?: number }> = ({ step, scale = 1 }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10 * scale,
    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
    padding: `${11 * scale}px ${13 * scale}px`,
    minWidth: 120 * scale, maxWidth: 200 * scale,
    flex: '1 1 0',
  }}>
    <div style={{ fontSize: 20 * scale, marginBottom: 5 * scale }}>{step.icon}</div>
    <div style={{
      fontSize: 13 * scale, fontWeight: 700, color: '#111827',
      lineHeight: 1.3, marginBottom: 3 * scale, fontFamily: fonts.sans,
    }}>{step.title}</div>
    <div style={{
      fontSize: 10 * scale, color: '#6B7280', lineHeight: 1.5,
      flex: 1, fontFamily: fonts.sans,
    }}>{step.desc}</div>
    <span style={{
      marginTop: 7 * scale, display: 'inline-block',
      fontSize: 9 * scale, fontWeight: 700, letterSpacing: '0.07em',
      padding: `${2 * scale}px ${7 * scale}px`, borderRadius: 20,
      textTransform: 'uppercase' as const, alignSelf: 'flex-start',
      background: step.tagStyle.bg, color: step.tagStyle.color,
      border: `1px solid ${step.tagStyle.border}`,
      fontFamily: fonts.sans,
    }}>{step.tag}</span>
  </div>
);

/* ── Main scene ──────────────────────────────────────── */
export const Scene5ZoomOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arrowOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Phase cards enter 0-80f, then expand sequentially 90-240f, settle 240-270f
  const FLASH_START = 90;
  const FLASH_PER = 25;

  // Scale factor: the demo fits in ~1260px max-width. Video is 1920px.
  // We want the expanded detail to fill most of the width.
  const S = 1.5; // scale up from demo sizes

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Nav bar — matching demo */}
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
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', fontFamily: fonts.sans, marginBottom: 6 }}>
          AI-First Service Delivery
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', fontFamily: fonts.sans }}>
          Follow one customer — Meridian Partners — from first signal through delivery and continuous innovation.
        </div>
      </div>

      {/* Pipeline row — matching demo's .pipeline */}
      <div style={{
        position: 'absolute', top: 120, left: 0, right: 0,
        display: 'flex', alignItems: 'stretch', gap: 0,
        padding: '0 32px', maxWidth: 1260, margin: '0 auto',
      }}>
        {PHASES.map((phase, i) => {
          const enterFrame = 5 + i * 10;
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
                {/* Active indicator bar */}
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

      {/* Expanded detail panel — slides in below pipeline when a phase is "active" */}
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
            maxWidth: 1260, margin: '0 auto',
            opacity: detailOpacity,
          }}>
            <div style={{
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
              padding: '24px 24px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              {/* Header */}
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

              {/* Swimlanes */}
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr' }}>
                {detail.lanes.map((lane, li) => (
                  <React.Fragment key={li}>
                    {/* Role cell */}
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
                    {/* Steps row */}
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

      {/* Subtitle */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(frame, [60, 80], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }),
      }}>
        <span style={{ fontSize: 18, color: '#6B7280', fontFamily: fonts.sans }}>
          What you just saw is{' '}
          <strong style={{ color: colors.qualify }}>step 3 of 6</strong>
          . There's a whole machine behind it.
        </span>
      </div>

      {/* Loop legend */}
      <div style={{
        position: 'absolute', bottom: 12, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 20,
        opacity: interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#6B7280', fontFamily: fonts.sans }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#2563EB' }} /> AI-led
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#6B7280', fontFamily: fonts.sans }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#059669' }} /> Human-led
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#6B7280', fontFamily: fonts.sans }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#D97706' }} /> Human + AI
        </div>
      </div>
    </AbsoluteFill>
  );
};
