import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 4b — Architect Discovery Call (360 frames / 12s)

  Sarah has a video call with Axon's solution architect,
  who comes prepared with an AI-enabled assessment.

  0-120f:   Dark overlay with narrative text
  80-360f:  Video call UI fades in
*/

const AI_NOTES = [
  { icon: '🎯', title: 'Fit Score: 94%', detail: 'Strong match based on SAP MM/FI landscape' },
  { icon: '⚠️', title: 'Key Risk', detail: 'S/4HANA migration planned — factor into phasing' },
  { icon: '💡', title: 'Recommended Wedge', detail: 'Procurement spend visibility (4-week sprint)' },
  { icon: '📊', title: 'Similar Engagements', detail: '12 comparable SAP landscapes in knowledge base' },
  { icon: '✅', title: 'Pre-Qual Status', detail: 'Auto-approved — meets all qualification criteria' },
];

const AGENDA_ITEMS = [
  { label: 'Validate SAP landscape assumptions', done: true },
  { label: 'Review procurement pain points', done: true },
  { label: 'Present recommended approach', done: false },
  { label: 'Discuss timeline & investment', done: false },
  { label: 'Agree on next steps', done: false },
];

function stagger(frame: number, index: number, delay: number = 8): number {
  return interpolate(frame, [index * delay, index * delay + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
}

export const Scene4bArchitect: React.FC = () => {
  const frame = useCurrentFrame();

  // Overlay text
  const overlayOpacity = interpolate(frame, [0, 10, 100, 125], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const overlayBg = interpolate(frame, [0, 5, 105, 130], [0.92, 0.92, 0.92, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Call UI
  const callOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Content stagger starts after call appears
  const contentFrame = Math.max(0, frame - 130);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>

      {/* ── Video call UI ── */}
      <div style={{ opacity: callOpacity }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 56,
          backgroundColor: '#1F2937', borderBottom: '1px solid #374151',
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 14, zIndex: 10,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444',
          }} />
          <span style={{
            fontSize: 16, fontWeight: 700, color: '#F9FAFB', fontFamily: fonts.sans,
          }}>Discovery Call</span>
          <span style={{
            fontSize: 14, color: '#9CA3AF', fontFamily: fonts.sans,
          }}>Meridian Partners + Axon Labs</span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontSize: 13, color: '#6B7280', fontFamily: fonts.sans,
            padding: '4px 12px', backgroundColor: '#374151', borderRadius: 8,
          }}>🔴 Recording</span>
        </div>

        {/* Main layout: video feeds left, AI notes right */}
        <div style={{
          position: 'absolute', top: 56, left: 0, right: 0, bottom: 0,
          display: 'flex',
        }}>
          {/* Left: Video feeds */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', gap: 16,
            padding: 24, justifyContent: 'center', alignItems: 'center',
          }}>
            {/* Architect (large) */}
            <div style={{
              width: '100%', maxWidth: 700, aspectRatio: '16/9',
              backgroundColor: '#1E293B', borderRadius: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 12, position: 'relative',
              border: '2px solid #334155',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', backgroundColor: colors.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: fonts.sans,
              }}>JR</div>
              <span style={{
                fontSize: 18, fontWeight: 600, color: '#E5E7EB', fontFamily: fonts.sans,
              }}>James Rivera</span>
              <span style={{
                fontSize: 14, color: '#9CA3AF', fontFamily: fonts.sans,
              }}>Solution Architect · Axon Labs</span>
              {/* Speaking indicator */}
              <div style={{
                position: 'absolute', bottom: 12, left: 12,
                display: 'flex', gap: 3, alignItems: 'flex-end',
              }}>
                {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
                  <div key={i} style={{
                    width: 3, height: 8 + h * 12 * (Math.sin(frame * 0.3 + i * 1.5) * 0.5 + 0.5),
                    backgroundColor: '#34D399', borderRadius: 2,
                  }} />
                ))}
              </div>
            </div>

            {/* Sarah (small, bottom-right) */}
            <div style={{
              position: 'absolute', bottom: 24, left: 24,
              width: 180, height: 110, backgroundColor: '#1E293B', borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 6, border: '2px solid #334155',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', backgroundColor: '#7C3AED',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: fonts.sans,
              }}>SM</div>
              <span style={{
                fontSize: 11, fontWeight: 600, color: '#E5E7EB', fontFamily: fonts.sans,
              }}>Sarah Mitchell</span>
            </div>
          </div>

          {/* Right: AI-prepared notes panel */}
          <div style={{
            width: 440, borderLeft: `1px solid ${colors.border}`,
            backgroundColor: '#fff', padding: '20px 24px', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: stagger(contentFrame, 0, 10),
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <span style={{
                fontSize: 15, fontWeight: 800, color: colors.primary, fontFamily: fonts.sans,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
              }}>AI-Prepared Brief</span>
            </div>

            {/* AI assessment notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AI_NOTES.map((note, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '10px 12px', borderRadius: 10,
                  backgroundColor: i === 0 ? '#F0FDF4' : i === 1 ? '#FFF7ED' : '#F9FAFB',
                  border: `1px solid ${i === 0 ? '#BBF7D0' : i === 1 ? '#FED7AA' : colors.border}`,
                  opacity: stagger(contentFrame, i + 1, 10),
                  transform: `translateX(${interpolate(contentFrame, [(i + 1) * 10, (i + 1) * 10 + 12], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{note.icon}</span>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: colors.text, fontFamily: fonts.sans,
                    }}>{note.title}</div>
                    <div style={{
                      fontSize: 12, color: colors.textMuted, fontFamily: fonts.sans, marginTop: 2,
                    }}>{note.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Agenda */}
            <div style={{
              marginTop: 'auto',
              opacity: stagger(contentFrame, 7, 10),
            }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans,
                letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 8,
              }}>Call Agenda</div>
              {AGENDA_ITEMS.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
                  opacity: stagger(contentFrame, i + 8, 6),
                }}>
                  <span style={{
                    fontSize: 14,
                    color: item.done ? '#059669' : '#D1D5DB',
                  }}>{item.done ? '✅' : '○'}</span>
                  <span style={{
                    fontSize: 13, color: item.done ? colors.textMuted : colors.text,
                    fontFamily: fonts.sans,
                    textDecoration: item.done ? 'line-through' : 'none',
                  }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Narrative overlay ── */}
      {frame < 130 && (
        <AbsoluteFill style={{
          backgroundColor: `rgba(11,17,32,${overlayBg})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, opacity: overlayOpacity,
        }}>
          <div style={{
            fontSize: 64, fontWeight: 600, color: '#E5E7EB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.4,
            maxWidth: 1300, padding: '0 80px',
          }}>
            Sarah then has a call with Axon's{' '}
            <span style={{ color: colors.primary, fontWeight: 700 }}>solution architect</span>,
            <br />
            who comes fully prepared.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
