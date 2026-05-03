import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile } from 'remotion';
import { TypingText } from '../components/TypingText';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 1 — Meridian Partners narrative (660 frames / 22s)

  5 panels with generous dwell time on each.

  Panel 1 (0-140f / 4.7s):     "Meet the customer" → type "Meridian Partners"
  Panel 2 (140-280f / 4.7s):   Company details fade in line-by-line
  Panel 3 (280-440f / 5.3s):   "The problem" → type the quote very slowly
  Panel 4 (440-570f / 4.3s):   Supporting pain details fade in one at a time
  Panel 5 (570-660f / 3s):     "Then they find Axon" → channels + email
*/

const FadeLine: React.FC<{
  children: React.ReactNode;
  frame: number;
  enterFrame: number;
  style?: React.CSSProperties;
}> = ({ children, frame, enterFrame, style }) => {
  const opacity = interpolate(frame, [enterFrame, enterFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const slideY = interpolate(frame, [enterFrame, enterFrame + 18], [16, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{ opacity, transform: `translateY(${slideY}px)`, ...style }}>
      {children}
    </div>
  );
};

export const Scene1Pain: React.FC = () => {
  const frame = useCurrentFrame();

  const p1 = frame >= 0 && frame < 140;
  const p2 = frame >= 140 && frame < 280;
  const p3 = frame >= 280 && frame < 440;
  const p4 = frame >= 440 && frame < 680;
  const p5 = frame >= 680;

  const panelOpacity = (enter: number, exit: number) => {
    const fadeIn = interpolate(frame, [enter, enter + 12], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(frame, [exit - 15, exit], [1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return fadeIn * fadeOut;
  };

  const globalFade = interpolate(frame, [790, 810], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0B1120', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity: globalFade,
    }}>

      {/* Panel 1: Name reveal — 4.7s */}
      {p1 && (
        <div style={{
          opacity: panelOpacity(0, 140),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        }}>
          {/* Sarah portrait */}
          <FadeLine frame={frame} enterFrame={0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: '3px solid rgba(37,99,235,0.5)',
              boxShadow: '0 0 0 6px rgba(37,99,235,0.12)',
            }}>
              <Img src={staticFile('images/sarah-mitchell.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{
              fontSize: 28, color: '#9CA3AF', fontFamily: fonts.sans, letterSpacing: '0.05em',
            }}>Sarah Mitchell · VP of IT</span>
          </FadeLine>
          <FadeLine frame={frame} enterFrame={8} style={{
            fontSize: 56, fontWeight: 600, color: colors.primary,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            Meet the customer
          </FadeLine>
          <TypingText
            text="Meridian Partners"
            speed={12}
            fontSize={96}
            color="#F9FAFB"
            fontFamily={fonts.sans}
            startFrame={15}
            showCursor={false}
          />
        </div>
      )}

      {/* Panel 2: Company details — 4.7s, lines staggered */}
      {p2 && (
        <div style={{
          opacity: panelOpacity(140, 280),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          textAlign: 'center',
        }}>
          <FadeLine frame={frame} enterFrame={140} style={{
            fontSize: 64, fontWeight: 700, color: '#F9FAFB', fontFamily: fonts.sans,
          }}>
            Mid-market manufacturer
          </FadeLine>
          <FadeLine frame={frame} enterFrame={162} style={{
            fontSize: 64, color: '#9CA3AF', fontFamily: fonts.sans,
          }}>
            $220M revenue &middot; 2,200 employees &middot; Chicago, IL
          </FadeLine>
          <FadeLine frame={frame} enterFrame={184} style={{
            fontSize: 64, color: '#6B7280', fontFamily: fonts.sans, marginTop: 8,
          }}>
            Running SAP ECC 6.0
          </FadeLine>
          <FadeLine frame={frame} enterFrame={206} style={{
            display: 'flex', gap: 16, marginTop: 8,
          }}>
            {['MM', 'PP', 'FI', 'SD'].map((mod) => (
              <span key={mod} style={{
                padding: '10px 28px', borderRadius: 28,
                backgroundColor: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
                fontSize: 44, fontWeight: 700, color: colors.primary,
                fontFamily: fonts.mono, letterSpacing: '0.05em',
              }}>{mod}</span>
            ))}
          </FadeLine>
        </div>
      )}

      {/* Panel 3: Sarah + quote — magazine interview layout */}
      {p3 && (
        <div style={{
          opacity: panelOpacity(280, 440),
          display: 'flex', flexDirection: 'row', alignItems: 'stretch',
          width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
        }}>
          {/* Left column — Sarah's photo, large */}
          <FadeLine frame={frame} enterFrame={280} style={{
            width: '38%', position: 'relative', overflow: 'hidden', flexShrink: 0,
          }}>
            <Img
              src={staticFile('images/sarah-mitchell.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
            {/* Right-side gradient bleed */}
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: 120,
              background: 'linear-gradient(to right, transparent, #0B1120)',
            }} />
            {/* Name badge at bottom */}
            <div style={{
              position: 'absolute', bottom: 48, left: 36,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <span style={{
                fontSize: 30, fontWeight: 700, color: '#F9FAFB', fontFamily: fonts.sans,
              }}>Sarah Mitchell</span>
              <span style={{
                fontSize: 22, color: '#9CA3AF', fontFamily: fonts.sans,
              }}>VP of IT · Meridian Partners</span>
            </div>
          </FadeLine>

          {/* Right column — label + quote */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '0 80px 0 60px', gap: 32,
          }}>
            {/* "The problem" label */}
            <FadeLine frame={frame} enterFrame={285} style={{
              fontSize: 48, fontWeight: 600, color: '#F87171',
              letterSpacing: '0.14em', textTransform: 'uppercase' as const,
              fontFamily: fonts.sans,
            }}>
              The problem
            </FadeLine>

            {/* Quote */}
            <TypingText
              text={`"Our SAP system has 10 years of\nprocurement data. Nobody knows\nwhat to do with it."`}
              speed={18}
              fontSize={58}
              color="#E5E7EB"
              fontFamily={fonts.sans}
              startFrame={20}
              showCursor={true}
              cursorColor="#F87171"
            />
          </div>
        </div>
      )}

      {/* Panel 4: Supporting pain — extended to 8s so lines breathe */}
      {p4 && (
        <div style={{
          opacity: panelOpacity(440, 680),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          textAlign: 'center', maxWidth: 1200,
        }}>
          <FadeLine frame={frame} enterFrame={440} style={{
            fontSize: 64, color: '#D1D5DB', fontFamily: fonts.sans, lineHeight: 1.5,
          }}>
            Weekly manual Excel exports from SAP.
          </FadeLine>
          <FadeLine frame={frame} enterFrame={470} style={{
            fontSize: 64, color: '#D1D5DB', fontFamily: fonts.sans, lineHeight: 1.5,
          }}>
            Crystal Reports nobody trusts.
          </FadeLine>
          <FadeLine frame={frame} enterFrame={500} style={{
            fontSize: 64, color: '#D1D5DB', fontFamily: fonts.sans, lineHeight: 1.5,
          }}>
            No visibility into supplier risk or spend patterns.
          </FadeLine>
        </div>
      )}

      {/* Panel 5: The trigger — starts at f680 */}
      {p5 && (
        <div style={{
          opacity: panelOpacity(680, 810),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          textAlign: 'center',
        }}>
          <FadeLine frame={frame} enterFrame={680} style={{
            fontSize: 64, fontWeight: 600, color: '#34D399',
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            Then they find Axon Labs
          </FadeLine>
          <FadeLine frame={frame} enterFrame={700} style={{
            fontSize: 64, fontWeight: 600, color: '#D1D5DB', fontFamily: fonts.sans,
            lineHeight: 1.5,
          }}>
            LinkedIn &middot; SAP partner directories &middot; Conferences
          </FadeLine>
          <FadeLine frame={frame} enterFrame={725} style={{
            fontSize: 64, fontWeight: 700, color: colors.primary,
            fontFamily: fonts.sans, marginTop: 4,
          }}>
            "See what we'd build for you. In 5 minutes."
          </FadeLine>
        </div>
      )}
    </AbsoluteFill>
  );
};
