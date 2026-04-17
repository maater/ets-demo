import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
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
  const p4 = frame >= 440 && frame < 590;
  const p5 = frame >= 590;

  const panelOpacity = (enter: number, exit: number) => {
    const fadeIn = interpolate(frame, [enter, enter + 12], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(frame, [exit - 15, exit], [1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return fadeIn * fadeOut;
  };

  const globalFade = interpolate(frame, [700, 720], [1, 0], {
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
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <FadeLine frame={frame} enterFrame={0} style={{
            fontSize: 64, fontWeight: 600, color: colors.primary,
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
            $120M revenue &middot; 850 employees &middot; Chicago, IL
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

      {/* Panel 3: The quote — 5.3s, types very slowly */}
      {p3 && (
        <div style={{
          opacity: panelOpacity(280, 440),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <FadeLine frame={frame} enterFrame={280} style={{
            fontSize: 64, fontWeight: 600, color: '#F87171',
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            The problem
          </FadeLine>
          <TypingText
            text={`"Our SAP system has 10 years of\nprocurement data. Nobody knows\nwhat to do with it."`}
            speed={18}
            fontSize={64}
            color="#E5E7EB"
            fontFamily={fonts.sans}
            startFrame={15}
            showCursor={true}
            cursorColor="#F87171"
          />
        </div>
      )}

      {/* Panel 4: Supporting pain — 4.3s, lines well spaced */}
      {p4 && (
        <div style={{
          opacity: panelOpacity(440, 590),
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

      {/* Panel 5: The trigger — 3s */}
      {p5 && (
        <div style={{
          opacity: panelOpacity(590, 720),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          textAlign: 'center',
        }}>
          <FadeLine frame={frame} enterFrame={590} style={{
            fontSize: 64, fontWeight: 600, color: '#34D399',
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            Then they find Axon Labs
          </FadeLine>
          <FadeLine frame={frame} enterFrame={610} style={{
            fontSize: 64, fontWeight: 600, color: '#D1D5DB', fontFamily: fonts.sans,
            lineHeight: 1.5,
          }}>
            LinkedIn &middot; SAP partner directories &middot; Conferences
          </FadeLine>
          <FadeLine frame={frame} enterFrame={635} style={{
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
