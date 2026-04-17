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

  const cardSlide = spring({ frame, fps, config: { damping: 20, stiffness: 80 }, from: 200, to: 0 });
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  const sections = [
    { title: 'Executive Summary', delay: 10 },
    { title: 'SAP Modules in Scope: MM, FI, SD', delay: 25 },
    { title: 'Primary Pain Points: Procurement visibility, stock-out risk', delay: 40 },
    { title: 'Complexity Estimate: Medium', delay: 55 },
  ];

  const wedgeX = interpolate(frame, [70, 95], [600, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wedgeOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const overlayBg = interpolate(frame, [145, 160], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const overlayTextOpacity = interpolate(frame, [155, 170], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const finalFade = interpolate(frame, [200, 210], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: finalFade }}>
      <div style={{ display: 'flex', gap: 40, padding: '80px 80px 60px', height: '100%' }}>
        {/* Left: Spec document */}
        <div style={{
          flex: 1, backgroundColor: '#fff', borderRadius: 18,
          border: `1px solid ${colors.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          padding: '36px 40px', opacity: cardOpacity,
          transform: `translateY(${cardSlide}px)`, overflow: 'hidden',
        }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: colors.primary, fontFamily: fonts.sans,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 28,
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
              <div key={i} style={{ marginBottom: 28, opacity: sectionOpacity }}>
                <div style={{
                  fontSize: 22, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
                  marginBottom: 8, filter: `blur(${blur}px)`,
                }}>
                  {section.title}
                </div>
                <div style={{
                  height: 14, backgroundColor: colors.borderLight, borderRadius: 4,
                  width: `${70 + i * 5}%`, filter: `blur(${blur}px)`,
                }} />
                <div style={{
                  height: 14, backgroundColor: colors.borderLight, borderRadius: 4,
                  width: `${50 + i * 8}%`, marginTop: 8, filter: `blur(${blur}px)`,
                }} />
              </div>
            );
          })}
        </div>

        {/* Right: Wedge recommendation */}
        <div style={{
          flex: 1, transform: `translateX(${wedgeX}px)`, opacity: wedgeOpacity,
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 18,
            border: `2px solid ${colors.proposeBorder}`,
            boxShadow: `0 0 0 4px ${colors.proposeLight}, 0 4px 24px rgba(5,150,105,0.1)`,
            padding: '32px 36px',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: colors.propose, fontFamily: fonts.sans,
              letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16,
            }}>
              Recommended Starting Point
            </div>
            <div style={{
              fontSize: 30, fontWeight: 800, color: colors.text, fontFamily: fonts.sans, marginBottom: 12,
            }}>
              Procurement Intelligence
            </div>
            <div style={{
              fontSize: 19, color: colors.textMuted, fontFamily: fonts.sans,
              lineHeight: 1.7, marginBottom: 20,
            }}>
              Real-time spend visibility across all purchasing orgs. Automated maverick detection.
              Supplier risk scoring from live PO data.
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {SAP_PILLS.map((pill, i) => {
                const pillDelay = 95 + i * 6;
                const pillOpacity = interpolate(frame, [pillDelay, pillDelay + 8], [0, 1], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
                });
                const pillScale = frame >= pillDelay
                  ? spring({ frame: frame - pillDelay, fps, config: { damping: 12, stiffness: 200 }, from: 1.2, to: 1 })
                  : 0.01;

                return (
                  <div key={pill} style={{
                    padding: '6px 16px', borderRadius: 22,
                    backgroundColor: colors.proposeLight, border: `1px solid ${colors.proposeBorder}`,
                    fontSize: 16, fontWeight: 700, color: colors.propose,
                    fontFamily: fonts.mono, letterSpacing: '0.05em',
                    opacity: pillOpacity, transform: `scale(${pillScale})`,
                  }}>
                    {pill}
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'inline-block', padding: '8px 18px', borderRadius: 22,
              backgroundColor: colors.deliverLight, border: `1px solid ${colors.deliverBorder}`,
              fontSize: 16, fontWeight: 700, color: colors.deliver, fontFamily: fonts.sans,
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
