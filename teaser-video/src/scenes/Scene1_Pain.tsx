import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { TypingText } from '../components/TypingText';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 1 — Meridian Partners narrative (420 frames / 14s)

  5 panels, each with generous reading time.
  Key lines use typing animation; supporting text fades in after.

  Panel 1 (0-95f):     "Meet the customer" → type "Meridian Partners"
  Panel 2 (95-185f):   Company details fade in line-by-line
  Panel 3 (185-290f):  "The problem" → type the quote slowly
  Panel 4 (290-370f):  Supporting pain details fade in
  Panel 5 (370-420f):  "Then they find Axon" → email line types
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

  // Panel visibility
  const p1 = frame >= 0 && frame < 95;
  const p2 = frame >= 95 && frame < 185;
  const p3 = frame >= 185 && frame < 290;
  const p4 = frame >= 290 && frame < 370;
  const p5 = frame >= 370;

  // Panel fade helpers
  const panelOpacity = (enter: number, exit: number) => {
    const fadeIn = interpolate(frame, [enter, enter + 12], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const fadeOut = interpolate(frame, [exit - 12, exit], [1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return fadeIn * fadeOut;
  };

  const globalFade = interpolate(frame, [408, 420], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0B1120', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity: globalFade,
    }}>

      {/* Panel 1: Name reveal */}
      {p1 && (
        <div style={{
          opacity: panelOpacity(0, 95),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <FadeLine frame={frame} enterFrame={0} style={{
            fontSize: 18, fontWeight: 600, color: colors.primary,
            letterSpacing: '0.18em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            Meet the customer
          </FadeLine>
          <TypingText
            text="Meridian Partners"
            speed={18}
            fontSize={64}
            color="#F9FAFB"
            fontFamily={fonts.sans}
            startFrame={10}
            showCursor={false}
          />
        </div>
      )}

      {/* Panel 2: Company details — line by line */}
      {p2 && (
        <div style={{
          opacity: panelOpacity(95, 185),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          textAlign: 'center',
        }}>
          <FadeLine frame={frame} enterFrame={95} style={{
            fontSize: 32, fontWeight: 700, color: '#F9FAFB', fontFamily: fonts.sans,
          }}>
            Mid-market manufacturer
          </FadeLine>
          <FadeLine frame={frame} enterFrame={110} style={{
            fontSize: 24, color: '#9CA3AF', fontFamily: fonts.sans,
          }}>
            $120M revenue &middot; 850 employees &middot; Chicago, IL
          </FadeLine>
          <FadeLine frame={frame} enterFrame={125} style={{
            fontSize: 22, color: '#6B7280', fontFamily: fonts.sans, marginTop: 8,
          }}>
            Running SAP ECC 6.0
          </FadeLine>
          <FadeLine frame={frame} enterFrame={138} style={{
            display: 'flex', gap: 12, marginTop: 4,
          }}>
            {['MM', 'PP', 'FI', 'SD'].map((mod) => (
              <span key={mod} style={{
                padding: '5px 16px', borderRadius: 20,
                backgroundColor: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)',
                fontSize: 18, fontWeight: 700, color: colors.primary,
                fontFamily: fonts.mono, letterSpacing: '0.05em',
              }}>{mod}</span>
            ))}
          </FadeLine>
        </div>
      )}

      {/* Panel 3: The quote — typed slowly */}
      {p3 && (
        <div style={{
          opacity: panelOpacity(185, 290),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <FadeLine frame={frame} enterFrame={185} style={{
            fontSize: 18, fontWeight: 600, color: '#F87171',
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            The problem
          </FadeLine>
          <TypingText
            text={`"Our SAP system has 10 years of\nprocurement data. Nobody knows\nwhat to do with it."`}
            speed={28}
            fontSize={44}
            color="#E5E7EB"
            fontFamily={fonts.sans}
            startFrame={10}
            showCursor={true}
            cursorColor="#F87171"
          />
        </div>
      )}

      {/* Panel 4: Supporting pain — fades in */}
      {p4 && (
        <div style={{
          opacity: panelOpacity(290, 370),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          textAlign: 'center', maxWidth: 900,
        }}>
          <FadeLine frame={frame} enterFrame={290} style={{
            fontSize: 26, color: '#D1D5DB', fontFamily: fonts.sans, lineHeight: 1.7,
          }}>
            Weekly manual Excel exports from SAP.
          </FadeLine>
          <FadeLine frame={frame} enterFrame={305} style={{
            fontSize: 26, color: '#D1D5DB', fontFamily: fonts.sans, lineHeight: 1.7,
          }}>
            Crystal Reports nobody trusts.
          </FadeLine>
          <FadeLine frame={frame} enterFrame={320} style={{
            fontSize: 26, color: '#D1D5DB', fontFamily: fonts.sans, lineHeight: 1.7,
          }}>
            No visibility into supplier risk or spend patterns.
          </FadeLine>
        </div>
      )}

      {/* Panel 5: The trigger */}
      {p5 && (
        <div style={{
          opacity: panelOpacity(370, 420),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          textAlign: 'center',
        }}>
          <FadeLine frame={frame} enterFrame={370} style={{
            fontSize: 18, fontWeight: 600, color: '#34D399',
            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
            fontFamily: fonts.sans,
          }}>
            Then they find Axon Labs
          </FadeLine>
          <FadeLine frame={frame} enterFrame={378} style={{
            fontSize: 28, fontWeight: 600, color: '#D1D5DB', fontFamily: fonts.sans,
            lineHeight: 1.6,
          }}>
            LinkedIn &middot; SAP partner directories &middot; Manufacturing conferences
          </FadeLine>
          <FadeLine frame={frame} enterFrame={392} style={{
            fontSize: 28, fontWeight: 700, color: colors.primary,
            fontFamily: fonts.sans, marginTop: 4,
          }}>
            "See what we'd build for you — in 5 minutes."
          </FadeLine>
        </div>
      )}
    </AbsoluteFill>
  );
};
