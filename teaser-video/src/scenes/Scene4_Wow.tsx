import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { colors, fonts } from '../styles/tokens';

const SAP_PILLS = ['EKKO', 'EKPO', 'EBAN', 'MARC'];

export const Scene4Wow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Beat 4a: Spec card builds (0–90f / 3s) ── */
  const cardSlide = spring({ frame, fps, config: { damping: 20, stiffness: 80 }, from: 200, to: 0 });
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  const sections = [
    { title: 'Executive Summary', delay: 10 },
    { title: 'SAP Modules in Scope: MM, FI, SD', delay: 25 },
    { title: 'Primary Pain Points: Procurement visibility, stock-out risk', delay: 40 },
    { title: 'Complexity Estimate: Medium', delay: 55 },
  ];

  /* ── Beat 4b: Wedge recommendation slides in (70–150f) ── */
  const wedgeX = interpolate(frame, [70, 95], [600, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const wedgeOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  /* ── Beat 4c: Text overlay (150–210f) ── */
  const overlayBg = interpolate(frame, [145, 160], [0, 0.6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const overlayTextOpacity = interpolate(frame, [155, 170], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  // Fade out at very end
  const finalFade = interpolate(frame, [200, 210], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: finalFade }}>
      {/* Two-column layout */}
      <div style={{
        display: 'flex', gap: 32, padding: '80px 80px 60px',
        height: '100%',
      }}>
        {/* Left: Spec document */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          padding: '32px 36px',
          opacity: cardOpacity,
          transform: `translateY(${cardSlide}px)`,
          overflow: 'hidden',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: colors.primary, fontFamily: fonts.sans,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 20,
          }}>
            AI-Generated Spec Preview
          </div>

          {sections.map((section, i) => {
            const sectionOpacity = interpolate(frame, [section.delay, section.delay + 12], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });
            const blur = interpolate(frame, [section.delay, section.delay + 10], [6, 0], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            });

            return (
              <div key={i} style={{ marginBottom: 20, opacity: sectionOpacity }}>
                <div style={{
                  fontSize: 16, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
                  marginBottom: 6, filter: `blur(${blur}px)`,
                }}>
                  {section.title}
                </div>
                <div style={{
                  height: 12, backgroundColor: colors.borderLight, borderRadius: 4,
                  width: `${70 + i * 5}%`, filter: `blur(${blur}px)`,
                }} />
                <div style={{
                  height: 12, backgroundColor: colors.borderLight, borderRadius: 4,
                  width: `${50 + i * 8}%`, marginTop: 6, filter: `blur(${blur}px)`,
                }} />
              </div>
            );
          })}
        </div>

        {/* Right: Wedge recommendation */}
        <div style={{
          flex: 1,
          transform: `translateX(${wedgeX}px)`,
          opacity: wedgeOpacity,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            border: `2px solid ${colors.proposeBorder}`,
            boxShadow: `0 0 0 4px ${colors.proposeLight}, 0 4px 24px rgba(5,150,105,0.1)`,
            padding: '28px 32px',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: colors.propose, fontFamily: fonts.sans,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 12,
            }}>
              Recommended Starting Point
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: colors.text, fontFamily: fonts.sans,
              marginBottom: 8,
            }}>
              Procurement Intelligence
            </div>
            <div style={{
              fontSize: 14, color: colors.textMuted, fontFamily: fonts.sans,
              lineHeight: 1.7, marginBottom: 16,
            }}>
              Real-time spend visibility across all purchasing orgs. Automated maverick detection.
              Supplier risk scoring from live PO data.
            </div>

            {/* SAP table pills */}
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16,
            }}>
              {SAP_PILLS.map((pill, i) => {
                const pillDelay = 95 + i * 6;
                const pillOpacity = interpolate(frame, [pillDelay, pillDelay + 8], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                });
                const pillScale = frame >= pillDelay
                  ? spring({ frame: frame - pillDelay, fps, config: { damping: 12, stiffness: 200 }, from: 1.2, to: 1 })
                  : 0;

                return (
                  <div
                    key={pill}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      backgroundColor: colors.proposeLight,
                      border: `1px solid ${colors.proposeBorder}`,
                      fontSize: 12,
                      fontWeight: 700,
                      color: colors.propose,
                      fontFamily: fonts.mono,
                      letterSpacing: '0.05em',
                      opacity: pillOpacity,
                      transform: `scale(${pillScale})`,
                    }}
                  >
                    {pill}
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'inline-block',
              padding: '5px 14px', borderRadius: 20,
              backgroundColor: colors.deliverLight,
              border: `1px solid ${colors.deliverBorder}`,
              fontSize: 11, fontWeight: 700, color: colors.deliver,
              fontFamily: fonts.sans,
            }}>
              Quick win — 4 week delivery
            </div>
          </div>
        </div>
      </div>

      {/* Text overlay */}
      {frame >= 145 && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(0,0,0,${overlayBg})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 800,
            color: '#fff',
            fontFamily: fonts.sans,
            textAlign: 'center',
            lineHeight: 1.4,
            opacity: overlayTextOpacity,
            maxWidth: 800,
          }}>
            From problem to solution preview.
            <br />
            <span style={{ color: colors.primaryBorder }}>No sales call.</span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
