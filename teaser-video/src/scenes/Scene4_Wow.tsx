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
  Scene 4 — AI-Generated Spec + Wedge Recommendation (270 frames / 9s)

  0-15f:   Left card slides in (richer spec content)
  15-80f:  Spec sections materialize
  80-120f: Right wedge card slides in with flow diagram
  120-150f: SAP pills + delivery estimate
  150-170f: "Request Expert Review" button appears
  170-210f: Hold
  210-240f: Overlay text: "Before any sales call."
  240-270f: Fade out
*/

const SAP_PILLS = ['EKKO', 'EKPO', 'EBAN', 'MARC', 'LFA1'];

const TIMELINE_STEPS = [
  { label: 'Procurement Analytics', weeks: 'Wk 1-5', color: colors.primary },
  { label: 'Supplier Risk', weeks: 'Wk 6-8', color: '#7C3AED' },
  { label: 'Executive Dashboard', weeks: 'Wk 9-12', color: colors.propose },
];

export const Scene4Wow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSlide = spring({ frame, fps, config: { damping: 20, stiffness: 80 }, from: 200, to: 0 });
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  const specSections = [
    { title: 'Executive Summary', body: 'Custom SAP Intelligence Platform, transforming raw data into actionable procurement insights and supplier risk intelligence.', delay: 10 },
    { title: 'SAP Modules in Scope', body: 'MM (Materials Management), FI (Financial Accounting), SD (Sales & Distribution), PP (Production Planning)', delay: 25 },
    { title: 'Primary Pain Points', body: 'Manual Excel exports weekly · Crystal Reports nobody trusts · No spend visibility across purchasing orgs · No predictive capability for reorder timing', delay: 40 },
    { title: 'Fit Score: 87 · Complexity: Medium', body: 'Strong fit. Classic procurement intelligence engagement with well-defined data sources and 12+ identified users across procurement, ops, and finance.', delay: 55 },
    { title: 'Estimated Timeline: 12 weeks', body: 'Phased delivery starting with procurement analytics, then supplier risk and inventory optimization. Pricing: Professional tier.', delay: 70 },
  ];

  const wedgeX = interpolate(frame, [80, 105], [600, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wedgeOpacity = interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const expertBtnOpacity = interpolate(frame, [160, 175], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const overlayBg = interpolate(frame, [220, 240], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const overlayTextOpacity = interpolate(frame, [230, 248], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const finalFade = interpolate(frame, [282, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Opening overlay: "And Sarah gets a project preview"
  const introOverlayBgOpacity = interpolate(frame, [0, 5, 85, 115], [0.92, 0.92, 0.92, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const introOverlayOpacity = interpolate(frame, [0, 8, 90, 115], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: finalFade }}>
      {/* Opening narrative overlay */}
      {frame < 115 && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(11,17,32,${introOverlayBgOpacity})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 20, zIndex: 20,
          opacity: introOverlayOpacity,
        }}>
          <div style={{
            fontSize: 46, fontWeight: 600, color: '#E5E7EB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.5,
            maxWidth: 1100,
          }}>
            And Sarah gets a
            <br />
            <span style={{ color: colors.primary, fontWeight: 700 }}>
              project preview.
            </span>
          </div>
          <div style={{
            fontSize: 32, color: '#9CA3AF', fontFamily: fonts.sans,
            textAlign: 'center', lineHeight: 1.6,
          }}>
            AI-generated. Tailored to her exact SAP environment.
          </div>
        </AbsoluteFill>
      )}

      <div style={{ display: 'flex', gap: 32, padding: '72px 60px 60px', height: '100%' }}>
        {/* Left: Spec document — richer content */}
        <div style={{
          flex: 1.1, backgroundColor: '#fff', borderRadius: 18,
          border: `1px solid ${colors.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          padding: '32px 36px', opacity: cardOpacity,
          transform: `translateY(${cardSlide}px)`, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: colors.primary, fontFamily: fonts.sans,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6,
          }}>
            AI-Generated Spec Preview
          </div>
          <div style={{
            fontSize: 11, color: colors.textMuted, fontFamily: fonts.sans, marginBottom: 22,
          }}>
            For Meridian Partners &middot; Generated from self-assessment data
          </div>

          {specSections.map((section, i) => {
            const sectionOpacity = interpolate(frame, [section.delay, section.delay + 12], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const blur = interpolate(frame, [section.delay, section.delay + 10], [4, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <div key={i} style={{ marginBottom: 18, opacity: sectionOpacity }}>
                <div style={{
                  fontSize: 17, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
                  marginBottom: 5, filter: `blur(${blur}px)`,
                }}>
                  {section.title}
                </div>
                <div style={{
                  fontSize: 13, color: colors.textMuted, fontFamily: fonts.sans,
                  lineHeight: 1.6, filter: `blur(${blur}px)`,
                }}>
                  {section.body}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Wedge recommendation + flow diagram */}
        <div style={{
          flex: 1, transform: `translateX(${wedgeX}px)`, opacity: wedgeOpacity,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {/* Recommendation card */}
          <div style={{
            backgroundColor: '#fff', borderRadius: 18,
            border: `2px solid ${colors.proposeBorder}`,
            boxShadow: `0 0 0 4px ${colors.proposeLight}, 0 4px 24px rgba(5,150,105,0.1)`,
            padding: '28px 32px',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: colors.propose, fontFamily: fonts.sans,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14,
            }}>
              Recommended Starting Point
            </div>
            <div style={{
              fontSize: 28, fontWeight: 800, color: colors.text, fontFamily: fonts.sans, marginBottom: 10,
            }}>
              Procurement Intelligence
            </div>
            <div style={{
              fontSize: 16, color: colors.textMuted, fontFamily: fonts.sans,
              lineHeight: 1.7, marginBottom: 18,
            }}>
              Real-time spend visibility across all purchasing orgs.
              Automated maverick detection. Supplier risk scoring from live PO data.
            </div>

            {/* SAP table pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              {SAP_PILLS.map((pill, i) => {
                const pillDelay = 105 + i * 5;
                const pillOpacity = interpolate(frame, [pillDelay, pillDelay + 8], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                });
                const pillScale = frame >= pillDelay
                  ? spring({ frame: frame - pillDelay, fps, config: { damping: 12, stiffness: 200 }, from: 1.2, to: 1 })
                  : 0.01;

                return (
                  <div key={pill} style={{
                    padding: '5px 14px', borderRadius: 22,
                    backgroundColor: colors.proposeLight, border: `1px solid ${colors.proposeBorder}`,
                    fontSize: 14, fontWeight: 700, color: colors.propose,
                    fontFamily: fonts.mono, letterSpacing: '0.05em',
                    opacity: pillOpacity, transform: `scale(${pillScale})`,
                  }}>
                    {pill}
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'inline-block', padding: '7px 16px', borderRadius: 22,
              backgroundColor: colors.deliverLight, border: `1px solid ${colors.deliverBorder}`,
              fontSize: 14, fontWeight: 700, color: colors.deliver, fontFamily: fonts.sans,
            }}>
              Quick win · 4 week delivery
            </div>
          </div>

          {/* Mini phased timeline flow */}
          <div style={{
            backgroundColor: '#fff', borderRadius: 14,
            border: `1px solid ${colors.border}`, padding: '20px 24px',
            opacity: interpolate(frame, [120, 135], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 14,
            }}>
              Phased Delivery Roadmap
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {TIMELINE_STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  }}>
                    <div style={{
                      width: '100%', height: 8, borderRadius: 4, backgroundColor: step.color,
                      opacity: 0.8,
                    }} />
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
                      textAlign: 'center',
                    }}>{step.label}</span>
                    <span style={{
                      fontSize: 11, color: colors.textMuted, fontFamily: fonts.sans,
                    }}>{step.weeks}</span>
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div style={{
                      flex: '0 0 20px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 16, color: '#D1D5DB',
                      marginBottom: 24,
                    }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Expert Review CTA */}
          <div style={{
            opacity: expertBtnOpacity,
            display: 'flex', justifyContent: 'center',
          }}>
            <div style={{
              padding: '14px 32px', borderRadius: 14,
              backgroundColor: colors.primary, color: '#fff',
              fontSize: 18, fontWeight: 700, fontFamily: fonts.sans,
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span>Request Expert Review</span>
              <span style={{ fontSize: 14, opacity: 0.8 }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Text overlay */}
      {frame >= 210 && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(0,0,0,${overlayBg})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 54, fontWeight: 800, color: '#fff', fontFamily: fonts.sans,
            textAlign: 'center', lineHeight: 1.4, opacity: overlayTextOpacity, maxWidth: 1000,
          }}>
            From problem to solution preview.
            <br />
            <span style={{ color: colors.primaryBorder }}>Before any sales call.</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
