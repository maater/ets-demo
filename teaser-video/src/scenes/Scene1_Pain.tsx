import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts } from '../styles/tokens';

/*
  Scene 1 — Meridian Partners narrative (270 frames / 9s)

  Panel 1 (0-80f):   Company intro — who they are
  Panel 2 (80-160f):  The pain — what they're struggling with
  Panel 3 (160-240f): The trigger — how they found Axon
  Fade out (240-270f)
*/

const Panel: React.FC<{
  children: React.ReactNode;
  frame: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ children, frame, enterFrame, exitFrame }) => {
  const fadeIn = interpolate(frame, [enterFrame, enterFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const slideY = interpolate(frame, [enterFrame, enterFrame + 15], [30, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      opacity: fadeIn * fadeOut,
      transform: `translateY(${slideY}px)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 20, maxWidth: 1100, textAlign: 'center',
    }}>
      {children}
    </div>
  );
};

export const Scene1Pain: React.FC = () => {
  const frame = useCurrentFrame();

  const globalFade = interpolate(frame, [250, 270], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0B1120', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', opacity: globalFade,
    }}>
      {/* Panel 1: Company intro */}
      <Panel frame={frame} enterFrame={0} exitFrame={80}>
        <div style={{
          fontSize: 20, fontWeight: 600, color: colors.primary,
          letterSpacing: '0.15em', textTransform: 'uppercase' as const,
          fontFamily: fonts.sans,
        }}>
          Meet the customer
        </div>
        <div style={{
          fontSize: 56, fontWeight: 800, color: '#F9FAFB',
          fontFamily: fonts.sans, lineHeight: 1.2,
        }}>
          Meridian Partners
        </div>
        <div style={{
          fontSize: 26, color: '#9CA3AF', fontFamily: fonts.sans, lineHeight: 1.7,
        }}>
          Mid-market manufacturer &middot; $120M revenue &middot; 850 employees
          <br />
          Running SAP ECC 6.0 &mdash; MM, PP, FI, SD
        </div>
      </Panel>

      {/* Panel 2: The pain */}
      <Panel frame={frame} enterFrame={80} exitFrame={160}>
        <div style={{
          fontSize: 20, fontWeight: 600, color: '#F87171',
          letterSpacing: '0.12em', textTransform: 'uppercase' as const,
          fontFamily: fonts.sans,
        }}>
          The problem
        </div>
        <div style={{
          fontSize: 44, fontWeight: 700, color: '#F9FAFB',
          fontFamily: fonts.sans, lineHeight: 1.35,
        }}>
          "Our SAP system has 10 years of procurement data.
          <br />
          Nobody knows what to do with it."
        </div>
        <div style={{
          fontSize: 24, color: '#9CA3AF', fontFamily: fonts.sans, lineHeight: 1.7,
        }}>
          Weekly manual Excel exports. Crystal Reports nobody trusts.
          <br />
          No visibility into supplier risk, spend patterns, or reorder timing.
        </div>
      </Panel>

      {/* Panel 3: The trigger */}
      <Panel frame={frame} enterFrame={160} exitFrame={250}>
        <div style={{
          fontSize: 20, fontWeight: 600, color: '#34D399',
          letterSpacing: '0.12em', textTransform: 'uppercase' as const,
          fontFamily: fonts.sans,
        }}>
          Then they find Axon Labs
        </div>
        <div style={{
          fontSize: 40, fontWeight: 700, color: '#F9FAFB',
          fontFamily: fonts.sans, lineHeight: 1.4,
        }}>
          LinkedIn posts. SAP partner directories.
          <br />
          Manufacturing conferences. Peer referrals.
        </div>
        <div style={{
          fontSize: 26, color: '#9CA3AF', fontFamily: fonts.sans, lineHeight: 1.7,
        }}>
          Then an email arrives from Axon:
        </div>
        <div style={{
          fontSize: 30, fontWeight: 700, color: colors.primary,
          fontFamily: fonts.sans, marginTop: 4,
        }}>
          "See what we'd build for you &mdash; in 5 minutes."
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
