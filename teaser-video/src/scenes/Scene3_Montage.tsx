import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from 'remotion';
import { ChipGrid } from '../components/ChipGrid';
import { colors, fonts } from '../styles/tokens';

/* ── Beat durations (frames) ── */
const BEAT_A = 75;  // Module selection ~2.5s
const BEAT_B = 75;  // Pain points ~2.5s
const BEAT_C = 60;  // Deep dive ~2s
const BEAT_D = 60;  // Reporting stack + compress ~2s

/* ── Data ── */
const SAP_MODULES = [
  { label: 'MM', sub: 'Materials Mgmt' },
  { label: 'FI', sub: 'Financial Acctg' },
  { label: 'SD', sub: 'Sales & Dist' },
  { label: 'PP', sub: 'Production' },
  { label: 'CO', sub: 'Controlling' },
  { label: 'WM', sub: 'Warehouse' },
  { label: 'PM', sub: 'Plant Maint' },
  { label: 'QM', sub: 'Quality' },
  { label: 'PS', sub: 'Project Sys' },
  { label: 'Ariba', sub: 'Procurement' },
  { label: 'IBP', sub: 'Intg Planning' },
  { label: 'SF', sub: 'SuccessFactors' },
];

const PAIN_POINTS = [
  { label: 'Maverick spending', sub: 'Procurement' },
  { label: 'Stock-outs', sub: 'Inventory' },
  { label: 'Manual reporting', sub: 'Reporting' },
  { label: 'Supplier risk blind spots', sub: 'Procurement' },
  { label: 'Demand forecast misses', sub: 'Planning' },
  { label: 'Month-end close delays', sub: 'Finance' },
  { label: 'Unplanned downtime', sub: 'Maintenance' },
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

/** Shared step header */
const StepHeader: React.FC<{ step: string; title: string; count?: string }> = ({
  step, title, count,
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: fonts.sans,
    }}>
      {step}
    </div>
    <span style={{ fontSize: 20, fontWeight: 700, color: colors.text, fontFamily: fonts.sans }}>
      {title}
    </span>
    {count && (
      <span style={{
        fontSize: 13, fontWeight: 600, color: colors.primary, fontFamily: fonts.sans,
        backgroundColor: colors.primaryLight, padding: '2px 10px', borderRadius: 20,
      }}>
        {count}
      </span>
    )}
  </div>
);

/** AI chat bubble at top */
const AiBubble: React.FC<{ text: string; frame: number }> = ({ text, frame }) => {
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      backgroundColor: '#F0F9FF', border: `1px solid ${colors.primaryBorder}`,
      borderRadius: 12, padding: '12px 18px', maxWidth: 700,
      fontSize: 15, color: colors.text, fontFamily: fonts.sans, lineHeight: 1.6,
      opacity, marginBottom: 24,
    }}>
      <span style={{ fontSize: 14, marginRight: 8 }}>🤖</span>
      {text}
    </div>
  );
};

export const Scene3Montage: React.FC = () => {
  const frame = useCurrentFrame();

  // Cross-fade between beats
  const beatTransition = (localFrame: number, duration: number) => {
    const fadeIn = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
    const fadeOut = interpolate(localFrame, [duration - 8, duration], [1, 0], { extrapolateRight: 'clamp' });
    return fadeIn * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Shared app chrome */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 48,
        backgroundColor: '#fff', borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 8, zIndex: 10,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6, backgroundColor: colors.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: '#fff', fontWeight: 800, fontFamily: fonts.sans,
        }}>A</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, fontFamily: fonts.sans }}>
          Self-Assessment
        </span>
        <span style={{ fontSize: 11, color: colors.textLight, fontFamily: fonts.sans, marginLeft: 'auto' }}>
          Step {frame < BEAT_A ? '1' : frame < BEAT_A + BEAT_B ? '2' : frame < BEAT_A + BEAT_B + BEAT_C ? '3' : '4'} of 5
        </span>
      </div>

      {/* Content area */}
      <div style={{
        position: 'absolute', top: 48, left: 0, right: 0, bottom: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 60px',
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
              chipWidth={140}
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
              chipWidth={170}
            />
          </AbsoluteFill>
        </Sequence>

        {/* Beat C: Deep Dive — Procurement Reports + Data Access */}
        <Sequence from={BEAT_A + BEAT_B} durationInFrames={BEAT_C}>
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 30,
            opacity: beatTransition(frame - BEAT_A - BEAT_B, BEAT_C),
          }}>
            <AiBubble text="Which procurement reports does your team rely on?" frame={frame - BEAT_A - BEAT_B} />
            <StepHeader step="3" title="Procurement Deep Dive" />
            <div style={{ display: 'flex', gap: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Reports
                </span>
                <ChipGrid
                  chips={REPORTS}
                  selectedIndices={[0, 1]}
                  frame={frame - BEAT_A - BEAT_B}
                  selectionFrames={[18, 30]}
                  accentColor={colors.deliver}
                  accentBg={colors.deliverLight}
                  chipWidth={110}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, fontFamily: fonts.sans, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                  Data Access
                </span>
                <ChipGrid
                  chips={DATA_ACCESS}
                  selectedIndices={[0]}
                  frame={frame - BEAT_A - BEAT_B}
                  selectionFrames={[40]}
                  accentColor={colors.propose}
                  accentBg={colors.proposeLight}
                  chipWidth={130}
                />
              </div>
            </div>
          </AbsoluteFill>
        </Sequence>

        {/* Beat D: Reporting Stack + compress out */}
        <Sequence from={BEAT_A + BEAT_B + BEAT_C} durationInFrames={BEAT_D}>
          <AbsoluteFill style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center',
          }}>
            {(() => {
              const localF = frame - BEAT_A - BEAT_B - BEAT_C;
              const fadeIn = interpolate(localF, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
              // Compress + zoom at end
              const compressScale = interpolate(localF, [35, 60], [1, 0.3], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              const compressFade = interpolate(localF, [45, 60], [1, 0], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              });
              return (
                <div style={{
                  opacity: fadeIn * compressFade,
                  transform: `scale(${compressScale})`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                }}>
                  <AiBubble text="Almost done — what's your current reporting stack?" frame={localF} />
                  <StepHeader step="4" title="Reporting Stack" />
                  <ChipGrid
                    chips={[
                      { label: 'Excel / CSV' },
                      { label: 'Crystal Reports' },
                      { label: 'SAP BW' },
                      { label: 'Power BI' },
                      { label: 'Tableau' },
                      { label: 'SAP Analytics Cloud' },
                    ]}
                    selectedIndices={[0, 1]}
                    frame={localF}
                    selectionFrames={[12, 22]}
                    chipWidth={150}
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
