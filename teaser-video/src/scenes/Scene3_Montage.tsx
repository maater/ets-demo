import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Sequence,
} from 'remotion';
import { ChipGrid } from '../components/ChipGrid';
import { colors, fonts } from '../styles/tokens';

const BEAT_A = 75;
const BEAT_B = 75;
const BEAT_C = 60;
const BEAT_D = 60;

const SAP_MODULES = [
  { label: 'MM', sub: 'Materials Mgmt' },
  { label: 'FI', sub: 'Financial Acctg' },
  { label: 'SD', sub: 'Sales & Dist' },
  { label: 'PP', sub: 'Production' },
  { label: 'CO', sub: 'Controlling' },
  { label: 'WM', sub: 'Warehouse' },
  { label: 'PM', sub: 'Plant Maint' },
  { label: 'QM', sub: 'Quality' },
  { label: 'Ariba', sub: 'Procurement' },
  { label: 'IBP', sub: 'Intg Planning' },
];

const PAIN_POINTS = [
  { label: 'Maverick spending', sub: 'Procurement' },
  { label: 'Stock-outs', sub: 'Inventory' },
  { label: 'Manual reporting', sub: 'Reporting' },
  { label: 'Supplier risk blind spots', sub: 'Procurement' },
  { label: 'Demand forecast misses', sub: 'Planning' },
  { label: 'Month-end close delays', sub: 'Finance' },
  { label: 'Excess inventory', sub: 'Inventory' },
  { label: 'Approval bottlenecks', sub: 'Process' },
];

const REPORTS = [
  { label: 'ME2M' }, { label: 'MB5B' }, { label: 'MD04' },
  { label: 'KSB1' }, { label: 'ME80FN' }, { label: 'MCBA' },
];

const DATA_ACCESS = [
  { label: 'CDS / OData' }, { label: 'RFC / BAPI' },
  { label: 'SLT / ODP' }, { label: 'Direct DB' },
];

const StepHeader: React.FC<{ step: string; title: string; count?: string }> = ({
  step, title, count,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10, backgroundColor: colors.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: fonts.sans,
    }}>{step}</div>
    <span style={{ fontSize: 28, fontWeight: 700, color: colors.text, fontFamily: fonts.sans }}>
      {title}
    </span>
    {count && (
      <span style={{
        fontSize: 18, fontWeight: 600, color: colors.primary, fontFamily: fonts.sans,
        backgroundColor: colors.primaryLight, padding: '4px 14px', borderRadius: 20,
      }}>{count}</span>
    )}
  </div>
);

const AiBubble: React.FC<{ text: string; frame: number }> = ({ text, frame }) => {
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      backgroundColor: '#F0F9FF', border: `1px solid ${colors.primaryBorder}`,
      borderRadius: 14, padding: '16px 24px', maxWidth: 900,
      fontSize: 22, color: colors.text, fontFamily: fonts.sans, lineHeight: 1.6,
      opacity, marginBottom: 32,
    }}>
      <span style={{ fontSize: 20, marginRight: 10 }}>🤖</span>
      {text}
    </div>
  );
};

export const Scene3Montage: React.FC = () => {
  const frame = useCurrentFrame();

  const beatTransition = (localFrame: number, duration: number) => {
    const fadeIn = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(localFrame, [duration - 8, duration], [1, 0], { extrapolateRight: 'clamp' });
    return fadeIn * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Narrative overlay — large, centered, stays visible over the assessment */}
      {frame < 110 && (
        <AbsoluteFill style={{
          backgroundColor: interpolate(frame, [0, 5, 80, 110], [0.92, 0.92, 0.92, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }) > 0 ? `rgba(11,17,32,${interpolate(frame, [0, 5, 80, 110], [0.92, 0.92, 0.92, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })})` : 'transparent',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 20, zIndex: 20,
          opacity: interpolate(frame, [0, 8, 85, 110], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          }),
        }}>
          <div style={{
            fontSize: 46, fontWeight: 600, color: '#E5E7EB',
            fontFamily: fonts.sans, textAlign: 'center', lineHeight: 1.5,
            maxWidth: 1100,
          }}>
            Sarah shares details about her SAP environment.
            <br />
            <span style={{ color: colors.primary, fontWeight: 700 }}>
              But this isn't ChatGPT.
            </span>
          </div>
          <div style={{
            fontSize: 32, color: '#9CA3AF', fontFamily: fonts.sans,
            textAlign: 'center', lineHeight: 1.6,
          }}>
            These questions come from deep SAP domain expertise
            <br />
            and real engagement patterns.
          </div>
        </AbsoluteFill>
      )}

      {/* App chrome */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 56,
        backgroundColor: '#fff', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', padding: '0 40px', gap: 10, zIndex: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, backgroundColor: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
        }}>A</div>
        <span style={{ fontSize: 18, fontWeight: 600, color: colors.text, fontFamily: fonts.sans }}>
          Self-Assessment
        </span>
        <span style={{ fontSize: 16, color: colors.textLight, fontFamily: fonts.sans, marginLeft: 'auto' }}>
          Step {frame < BEAT_A ? '1' : frame < BEAT_A + BEAT_B ? '2' : frame < BEAT_A + BEAT_B + BEAT_C ? '3' : '4'} of 5
        </span>
      </div>

      {/* Content area */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 80px',
      }}>
        {/* Beat A: Module Selection */}
        <Sequence from={0} durationInFrames={BEAT_A}>
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', opacity: beatTransition(frame, BEAT_A),
          }}>
            <AiBubble text="Which SAP modules does Meridian currently run?" frame={frame} />
            <StepHeader step="1" title="SAP Modules" count={`${frame > 20 ? (frame > 40 ? (frame > 55 ? 3 : 2) : 1) : 0} selected`} />
            <ChipGrid
              chips={SAP_MODULES}
              selectedIndices={[0, 1, 2]}
              frame={frame}
              selectionFrames={[20, 40, 55]}
              chipWidth={185}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat B: Pain Points */}
        <Sequence from={BEAT_A} durationInFrames={BEAT_B}>
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center',
            opacity: beatTransition(frame - BEAT_A, BEAT_B),
          }}>
            <AiBubble text="What decisions do you wish you had better data for?" frame={frame - BEAT_A} />
            <StepHeader step="2" title="Pain Points" count={`${(frame - BEAT_A) > 15 ? ((frame - BEAT_A) > 35 ? ((frame - BEAT_A) > 50 ? 3 : 2) : 1) : 0} selected`} />
            <ChipGrid
              chips={PAIN_POINTS}
              selectedIndices={[0, 1, 2]}
              frame={frame - BEAT_A}
              selectionFrames={[15, 35, 50]}
              accentColor="#7C3AED"
              accentBg={colors.qualifyLight}
              chipWidth={210}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat C: Deep Dive */}
        <Sequence from={BEAT_A + BEAT_B} durationInFrames={BEAT_C}>
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 36,
            opacity: beatTransition(frame - BEAT_A - BEAT_B, BEAT_C),
          }}>
            <AiBubble text="Which procurement reports does your team rely on?" frame={frame - BEAT_A - BEAT_B} />
            <StepHeader step="3" title="Procurement Deep Dive" />
            <div style={{ display: 'flex', gap: 60 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Reports
                </span>
                <ChipGrid chips={REPORTS} selectedIndices={[0, 1]} frame={frame - BEAT_A - BEAT_B}
                  selectionFrames={[18, 30]} accentColor={colors.deliver} accentBg={colors.deliverLight} chipWidth={130} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Data Access
                </span>
                <ChipGrid chips={DATA_ACCESS} selectedIndices={[0]} frame={frame - BEAT_A - BEAT_B}
                  selectionFrames={[40]} accentColor={colors.propose} accentBg={colors.proposeLight} chipWidth={160} />
              </div>
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat D: Reporting Stack + compress */}
        <Sequence from={BEAT_A + BEAT_B + BEAT_C} durationInFrames={BEAT_D}>
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            {(() => {
              const localF = frame - BEAT_A - BEAT_B - BEAT_C;
              const fadeIn = interpolate(localF, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
              const compressScale = interpolate(localF, [35, 60], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const compressFade = interpolate(localF, [45, 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div style={{
                  opacity: fadeIn * compressFade, transform: `scale(${compressScale})`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                }}>
                  <AiBubble text="Almost done — what's your current reporting stack?" frame={localF} />
                  <StepHeader step="4" title="Reporting Stack" />
                  <ChipGrid
                    chips={[
                      { label: 'Excel / CSV' }, { label: 'Crystal Reports' },
                      { label: 'SAP BW' }, { label: 'Power BI' },
                      { label: 'Tableau' }, { label: 'SAP Analytics Cloud' },
                    ]}
                    selectedIndices={[0, 1]} frame={localF} selectionFrames={[12, 22]}
                    chipWidth={195}
                  />
                </div>
              );
            })()}
          </AbsoluteFill>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
