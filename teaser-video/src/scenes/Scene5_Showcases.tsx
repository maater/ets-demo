import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 5a — Product Showcases (870 frames / 29s)

  0-100f:    Beat 1 overlay: "What you just experienced was one step in this engagement."
  100-210f:  Beat 2 overlay: "Imagine an entire customer engagement that is AI-enabled."
  210-510f:  Showcase 1 — Interactive Proposal (10s)
  510-720f:  Showcase 2 — Engagement Control Tower (7s)
  720-870f:  Showcase 3 — Customer Dashboard (5s)
*/

// ── Shared helpers ──────────────────────────────────────

const NavBar: React.FC<{ title: string; subtitle: string; badge?: string; badgeColor?: string }> = ({
  title, subtitle, badge, badgeColor = colors.propose,
}) => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: 56,
    backgroundColor: '#fff', borderBottom: `1px solid ${colors.border}`,
    display: 'flex', alignItems: 'center', padding: '0 40px', gap: 12, zIndex: 10,
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: 7, backgroundColor: colors.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
    }}>A</div>
    <span style={{ fontSize: 18, fontWeight: 700, color: colors.text, fontFamily: fonts.sans }}>
      {title}
    </span>
    <div style={{ width: 1, height: 22, backgroundColor: colors.border, margin: '0 4px' }} />
    <span style={{ fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans }}>
      {subtitle}
    </span>
    {badge && (
      <span style={{
        marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: badgeColor,
        backgroundColor: `${badgeColor}15`, padding: '4px 14px', borderRadius: 20,
        border: `1px solid ${badgeColor}30`, fontFamily: fonts.sans,
      }}>{badge}</span>
    )}
  </div>
);

/** Bottom label bar with showcase title */
const ShowcaseLabel: React.FC<{ title: string; opacity: number }> = ({ title, opacity }) => (
  <div style={{
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: `rgba(11,17,32,0.88)`, padding: '28px 60px',
    display: 'flex', justifyContent: 'center', zIndex: 20, opacity,
  }}>
    <div style={{
      fontSize: 48, fontWeight: 700, color: '#F9FAFB',
      fontFamily: fonts.sans, textAlign: 'center',
    }}>{title}</div>
  </div>
);

/** Staggered fade-in helper */
function stagger(frame: number, index: number, delay: number = 8): number {
  return interpolate(frame, [index * delay, index * delay + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
}

function staggerY(frame: number, index: number, delay: number = 8): number {
  return interpolate(frame, [index * delay, index * delay + 12], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
}

// ── Showcase 1: Interactive Proposal ─────────────────────

const TOC_SECTIONS = [
  'Executive Summary',
  'Problem Analysis',
  'Recommended Approach',
  'Sprint Plan & Phasing',
  'Investment & Timeline',
  'Risk Assessment',
];

const PROPOSAL_CONTENT = [
  {
    title: 'Recommended Approach',
    items: [
      'Phase 1: Procurement spend visibility dashboard with real-time SAP MM/FI integration',
      'Phase 2: Supplier risk scoring engine using historical PO and delivery data',
      'Phase 3: Demand forecast module connecting IBP signals to inventory optimization',
    ],
  },
];

const ProposalScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const contentStart = 15; // elements start appearing

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <NavBar title="Interactive Proposal" subtitle="Meridian Partners" badge="Draft for Review" badgeColor="#D97706" />

      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, bottom: 0,
        display: 'flex',
      }}>
        {/* Sidebar TOC */}
        <div style={{
          width: 280, borderRight: `1px solid ${colors.border}`,
          backgroundColor: '#fff', padding: '28px 20px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 800, color: colors.textMuted, fontFamily: fonts.sans,
            letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12,
          }}>Table of Contents</div>
          {TOC_SECTIONS.map((sec, i) => {
            const isActive = i === 2;
            return (
              <div key={i} style={{
                fontSize: 15, fontFamily: fonts.sans, padding: '10px 14px',
                borderRadius: 8, cursor: 'pointer',
                backgroundColor: isActive ? colors.primaryLight : 'transparent',
                color: isActive ? colors.primary : colors.text,
                fontWeight: isActive ? 700 : 500,
                opacity: stagger(frame - contentStart, i, 6),
                transform: `translateX(${interpolate(frame - contentStart, [i * 6, i * 6 + 10], [-15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
              }}>{sec}</div>
            );
          })}

          {/* AI Status */}
          <div style={{
            marginTop: 'auto', padding: '14px 14px', borderRadius: 10,
            backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
            opacity: stagger(frame - contentStart, 8, 6),
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#059669', fontFamily: fonts.sans }}>
              AI Confidence: 94%
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', fontFamily: fonts.sans, marginTop: 4 }}>
              Based on 47 similar engagements
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1, padding: '32px 48px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          {/* Section header */}
          <div style={{
            opacity: stagger(frame - contentStart, 1, 10),
            transform: `translateY(${staggerY(frame - contentStart, 1, 10)}px)`,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: colors.primary, fontFamily: fonts.sans,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8,
            }}>Section 3 of 6</div>
            <div style={{
              fontSize: 32, fontWeight: 800, color: colors.text, fontFamily: fonts.sans,
            }}>Recommended Approach</div>
          </div>

          {/* Content items */}
          {PROPOSAL_CONTENT[0].items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, alignItems: 'flex-start',
              opacity: stagger(frame - contentStart, i + 3, 12),
              transform: `translateY(${staggerY(frame - contentStart, i + 3, 12)}px)`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primaryLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: colors.primary, fontFamily: fonts.sans,
                flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{
                fontSize: 18, color: colors.text, fontFamily: fonts.sans,
                lineHeight: 1.6, backgroundColor: '#fff', padding: '16px 20px',
                borderRadius: 10, border: `1px solid ${colors.border}`, flex: 1,
              }}>{item}</div>
            </div>
          ))}

          {/* AI Suggestion highlight */}
          <div style={{
            backgroundColor: '#EFF6FF', border: `2px solid ${colors.primary}`,
            borderRadius: 12, padding: '18px 24px', marginTop: 8,
            opacity: stagger(frame - contentStart, 7, 12),
            transform: `translateY(${staggerY(frame - contentStart, 7, 12)}px)`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
            }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <span style={{
                fontSize: 14, fontWeight: 800, color: colors.primary, fontFamily: fonts.sans,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
              }}>AI Suggestion</span>
            </div>
            <div style={{
              fontSize: 16, color: colors.text, fontFamily: fonts.sans, lineHeight: 1.6,
            }}>
              Consider a phased rollout starting with MM spend analytics. Based on similar
              SAP landscapes, this delivers measurable ROI within the first sprint and builds
              stakeholder confidence for subsequent phases.
            </div>
          </div>

          {/* Footer */}
          <div style={{
            fontSize: 13, color: colors.textLight, fontFamily: fonts.sans,
            marginTop: 'auto',
            opacity: stagger(frame - contentStart, 9, 12),
          }}>
            Last updated by AI: 2 minutes ago · v3.1 · 94% confidence score
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Showcase 2: Engagement Control Tower ─────────────────

const METRICS = [
  { label: 'Sprint Velocity', value: '34', unit: 'pts', trend: '+12%', trendUp: true, color: colors.primary },
  { label: 'Risk Score', value: 'Low', unit: '', trend: '2 items', trendUp: true, color: '#059669' },
  { label: 'Budget Burn', value: '67%', unit: '', trend: 'On track', trendUp: true, color: '#D97706' },
  { label: 'Timeline', value: 'Sprint 3', unit: '', trend: 'Week 2 of 2', trendUp: true, color: '#7C3AED' },
];

const MILESTONES = [
  { label: 'Kickoff', done: true, x: 5 },
  { label: 'Sprint 1', done: true, x: 20 },
  { label: 'Sprint 2', done: true, x: 40 },
  { label: 'Sprint 3', done: false, x: 60 },
  { label: 'UAT', done: false, x: 80 },
  { label: 'Go-Live', done: false, x: 95 },
];

const ACTIVITIES = [
  { icon: '🤖', text: 'Agent completed PR #47: Spend dashboard date filters', time: '12 min ago', color: colors.primary },
  { icon: '👤', text: 'Sarah approved Sprint 2 deliverables', time: '2 hours ago', color: '#059669' },
  { icon: '💡', text: 'AI flagged: supplier data gap in MARA table', time: '4 hours ago', color: '#D97706' },
  { icon: '✅', text: 'Risk item resolved: API rate limit increase approved', time: 'Yesterday', color: '#059669' },
];

const ControlTowerScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const cs = 10; // content start

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <NavBar title="Engagement Control Tower" subtitle="Meridian Partners · Sprint 3" badge="All Systems Normal" badgeColor="#059669" />

      <div style={{
        position: 'absolute', top: 72, left: 40, right: 40, bottom: 20,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Metric cards */}
        <div style={{ display: 'flex', gap: 18 }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 12,
              border: `1px solid ${colors.border}`, padding: '20px 22px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              opacity: stagger(frame - cs, i, 6),
              transform: `translateY(${staggerY(frame - cs, i, 6)}px)`,
            }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 8,
              }}>{m.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  fontSize: 36, fontWeight: 800, color: m.color, fontFamily: fonts.sans,
                }}>{m.value}</span>
                {m.unit && <span style={{ fontSize: 16, color: colors.textMuted, fontFamily: fonts.sans }}>{m.unit}</span>}
              </div>
              <div style={{
                fontSize: 13, color: m.trendUp ? '#059669' : '#EF4444', fontFamily: fonts.sans, marginTop: 4,
              }}>{m.trend}</div>
            </div>
          ))}
        </div>

        {/* Timeline / Gantt */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 12, border: `1px solid ${colors.border}`,
          padding: '20px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          opacity: stagger(frame - cs, 5, 6),
          transform: `translateY(${staggerY(frame - cs, 5, 6)}px)`,
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: colors.text, fontFamily: fonts.sans, marginBottom: 16,
          }}>Project Timeline</div>
          <div style={{ position: 'relative', height: 50 }}>
            {/* Track */}
            <div style={{
              position: 'absolute', top: 14, left: 0, right: 0, height: 4,
              backgroundColor: '#E5E7EB', borderRadius: 2,
            }} />
            {/* Progress */}
            <div style={{
              position: 'absolute', top: 14, left: 0, width: '55%', height: 4,
              backgroundColor: colors.primary, borderRadius: 2,
            }} />
            {/* Milestones */}
            {MILESTONES.map((ms, i) => (
              <div key={i} style={{
                position: 'absolute', left: `${ms.x}%`, top: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                transform: 'translateX(-50%)',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  backgroundColor: ms.done ? colors.primary : '#fff',
                  border: `3px solid ${ms.done ? colors.primary : '#D1D5DB'}`,
                  marginBottom: 6,
                }} />
                <span style={{
                  fontSize: 10, fontWeight: 600, color: ms.done ? colors.text : colors.textLight,
                  fontFamily: fonts.sans, whiteSpace: 'nowrap',
                }}>{ms.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 12, border: `1px solid ${colors.border}`,
          padding: '20px 28px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          opacity: stagger(frame - cs, 6, 6),
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: colors.text, fontFamily: fonts.sans, marginBottom: 14,
          }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: stagger(frame - cs, i + 7, 5),
              }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <span style={{
                  fontSize: 14, color: colors.text, fontFamily: fonts.sans, flex: 1,
                }}>{a.text}</span>
                <span style={{
                  fontSize: 12, color: colors.textLight, fontFamily: fonts.sans, whiteSpace: 'nowrap',
                }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Showcase 3: Customer Dashboard ──────────────────────

const DASH_METRICS = [
  { label: 'Project Health', value: '87%', icon: '💚' },
  { label: 'Stories Completed', value: '12 / 16', icon: '📋' },
  { label: 'Milestones Hit', value: '3 / 5', icon: '🎯' },
  { label: 'Active Sprint', value: 'Sprint 3', icon: '🏃' },
];

const DELIVERABLES = [
  { name: 'Spend visibility dashboard v2', status: 'Delivered', statusColor: '#059669' },
  { name: 'Supplier risk scoring API', status: 'Delivered', statusColor: '#059669' },
  { name: 'Demand forecast module', status: 'In Review', statusColor: '#D97706' },
  { name: 'Executive reporting package', status: 'In Progress', statusColor: colors.primary },
  { name: 'S/4HANA migration readiness audit', status: 'Upcoming', statusColor: '#9CA3AF' },
];

const DashboardScreen: React.FC<{ frame: number }> = ({ frame }) => {
  const cs = 8;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <NavBar title="Customer Portal" subtitle="Meridian Partners" badge="Last updated: 2 min ago" badgeColor={colors.primary} />

      <div style={{
        position: 'absolute', top: 72, left: 40, right: 40, bottom: 20,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Metric cards */}
        <div style={{ display: 'flex', gap: 18 }}>
          {DASH_METRICS.map((m, i) => (
            <div key={i} style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 12,
              border: `1px solid ${colors.border}`, padding: '22px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              opacity: stagger(frame - cs, i, 5),
              transform: `translateY(${staggerY(frame - cs, i, 5)}px)`,
            }}>
              <span style={{ fontSize: 28 }}>{m.icon}</span>
              <span style={{
                fontSize: 32, fontWeight: 800, color: colors.text, fontFamily: fonts.sans,
              }}>{m.value}</span>
              <span style={{
                fontSize: 13, color: colors.textMuted, fontFamily: fonts.sans, fontWeight: 600,
              }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Deliverables table */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 12, border: `1px solid ${colors.border}`,
          padding: '24px 28px', flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          opacity: stagger(frame - cs, 5, 5),
        }}>
          <div style={{
            fontSize: 16, fontWeight: 700, color: colors.text, fontFamily: fonts.sans, marginBottom: 18,
          }}>Deliverables</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Header row */}
            <div style={{
              display: 'flex', padding: '10px 16px', borderBottom: `2px solid ${colors.border}`,
            }}>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Name</span>
              <span style={{ width: 140, fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase' as const, textAlign: 'right' }}>Status</span>
            </div>
            {DELIVERABLES.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '14px 16px',
                borderBottom: i < DELIVERABLES.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                opacity: stagger(frame - cs, i + 6, 4),
              }}>
                <span style={{
                  flex: 1, fontSize: 15, color: colors.text, fontFamily: fonts.sans,
                }}>{d.name}</span>
                <span style={{
                  width: 140, textAlign: 'right',
                  fontSize: 13, fontWeight: 700, color: d.statusColor, fontFamily: fonts.sans,
                  backgroundColor: `${d.statusColor}12`, padding: '4px 12px', borderRadius: 16,
                  display: 'inline-block',
                }}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main scene ──────────────────────────────────────────

// Showcase timing (local frames)
const OVERLAY_END = 210;
const SC1_START = 210;
const SC1_END = 510;   // 300f = 10s
const SC2_START = 510;
const SC2_END = 720;   // 210f = 7s
const SC3_START = 720;
const SC3_END = 870;   // 150f = 5s

const FADE = 15; // fade duration between showcases

export const Scene5Showcases: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Overlay beats ──
  const beat1Opacity = interpolate(frame, [0, 12, 90, 105], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const beat2Opacity = interpolate(frame, [100, 112, 190, 205], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const overlayBgOpacity = interpolate(frame, [0, 5, 195, OVERLAY_END], [0.92, 0.92, 0.92, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Showcase envelopes ──
  const sc1Opacity = interpolate(frame,
    [SC1_START, SC1_START + FADE, SC1_END - FADE, SC1_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const sc2Opacity = interpolate(frame,
    [SC2_START, SC2_START + FADE, SC2_END - FADE, SC2_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const sc3Opacity = interpolate(frame,
    [SC3_START, SC3_START + FADE, SC3_END - FADE, SC3_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Label fade-in (appears a beat after UI)
  const sc1LabelOp = interpolate(frame, [SC1_START + 40, SC1_START + 55, SC1_END - FADE, SC1_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sc2LabelOp = interpolate(frame, [SC2_START + 30, SC2_START + 42, SC2_END - FADE, SC2_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const sc3LabelOp = interpolate(frame, [SC3_START + 25, SC3_START + 35, SC3_END - FADE, SC3_END], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B1120' }}>

      {/* ── Overlay beats ── */}
      {frame < OVERLAY_END && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(11,17,32,${overlayBgOpacity})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 24, zIndex: 50,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 800, color: '#F9FAFB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.3,
            maxWidth: 1100, opacity: beat1Opacity,
          }}>
            What you just experienced was
            <br />
            <span style={{ color: colors.primary }}>one step</span> in this engagement.
          </div>
          <div style={{
            fontSize: 64, fontWeight: 800, color: '#F9FAFB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.3,
            maxWidth: 1200, opacity: beat2Opacity,
          }}>
            Imagine an entire customer engagement
            <br />
            that is <span style={{ color: colors.primary }}>AI-enabled.</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Showcase 1: Interactive Proposal ── */}
      {frame >= SC1_START && frame < SC1_END && (
        <AbsoluteFill style={{ opacity: sc1Opacity }}>
          <ProposalScreen frame={frame - SC1_START} />
          <ShowcaseLabel title="An Interactive, AI-Enabled Proposal" opacity={sc1LabelOp} />
        </AbsoluteFill>
      )}

      {/* ── Showcase 2: Engagement Control Tower ── */}
      {frame >= SC2_START && frame < SC2_END && (
        <AbsoluteFill style={{ opacity: sc2Opacity }}>
          <ControlTowerScreen frame={frame - SC2_START} />
          <ShowcaseLabel title="A Live Engagement Control Tower" opacity={sc2LabelOp} />
        </AbsoluteFill>
      )}

      {/* ── Showcase 3: Customer Dashboard ── */}
      {frame >= SC3_START && frame < SC3_END && (
        <AbsoluteFill style={{ opacity: sc3Opacity }}>
          <DashboardScreen frame={frame - SC3_START} />
          <ShowcaseLabel title="An Always Up-to-Date Customer Dashboard" opacity={sc3LabelOp} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
