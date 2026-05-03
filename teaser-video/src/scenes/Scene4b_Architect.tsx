import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
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

        {/* James photo fills entire background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
          <Img
            src={staticFile('images/james-rivera.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          {/* Dark overlay so UI stays readable */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)',
          }} />
        </div>

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 56,
          backgroundColor: 'rgba(15,20,35,0.85)', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', padding: '0 32px', gap: 14, zIndex: 10,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', fontFamily: fonts.sans }}>Discovery Call</span>
          <span style={{ fontSize: 14, color: '#9CA3AF', fontFamily: fonts.sans }}>Meridian Partners + Axon Labs</span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontSize: 13, color: '#9CA3AF', fontFamily: fonts.sans,
            padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8,
          }}>🔴 Recording</span>
        </div>

        {/* James name badge — bottom-left of background */}
        <div style={{
          position: 'absolute', bottom: 120, left: 40, zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#F9FAFB', fontFamily: fonts.sans,
            textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>James Rivera</span>
          <span style={{ fontSize: 20, color: '#D1D5DB', fontFamily: fonts.sans,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Solution Architect · Axon Labs</span>
        </div>

        {/* Speaking indicator — bottom-left */}
        <div style={{
          position: 'absolute', bottom: 76, left: 40, zIndex: 10,
          display: 'flex', gap: 4, alignItems: 'flex-end',
        }}>
          {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
            <div key={i} style={{
              width: 4, height: 8 + h * 14 * (Math.sin(frame * 0.3 + i * 1.5) * 0.5 + 0.5),
              backgroundColor: '#34D399', borderRadius: 2,
            }} />
          ))}
        </div>

        {/* Sarah PIP — bottom-left corner */}
        <div style={{
          position: 'absolute', bottom: 24, left: 40, zIndex: 10,
          width: 240, height: 148, borderRadius: 14, overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <Img
            src={staticFile('images/sarah-mitchell.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
            padding: '14px 10px 7px',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB', fontFamily: fonts.sans }}>Sarah Mitchell</span>
          </div>
        </div>

        {/* Main layout: right-side AI notes panel only */}
        <div style={{
          position: 'absolute', top: 56, left: 0, right: 0, bottom: 0,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          {/* Right: AI-prepared notes panel */}
          <div style={{
            width: 460, borderLeft: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.97)', padding: '20px 24px', overflow: 'hidden',
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
