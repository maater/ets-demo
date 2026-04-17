import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

interface Chip {
  label: string;
  sub?: string;
}

interface ChipGridProps {
  chips: Chip[];
  selectedIndices: number[];
  frame: number;
  selectionFrames: number[];
  accentColor?: string;
  accentBg?: string;
  chipWidth?: number;
}

export const ChipGrid: React.FC<ChipGridProps> = ({
  chips, selectedIndices, frame, selectionFrames,
  accentColor = colors.primary, accentBg = colors.primaryLight,
  chipWidth = 185,
}) => {
  const { fps } = useVideoConfig();

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 12,
      justifyContent: 'center', maxWidth: 1100,
    }}>
      {chips.map((chip, i) => {
        const selIdx = selectedIndices.indexOf(i);
        const isSelected = selIdx !== -1 && frame >= (selectionFrames[selIdx] ?? Infinity);

        const popScale = isSelected
          ? spring({ frame: frame - (selectionFrames[selIdx] ?? 0), fps,
              config: { damping: 12, stiffness: 200 }, from: 1.15, to: 1 })
          : 1;

        return (
          <div key={i} style={{
            width: chipWidth, padding: '12px 16px', borderRadius: 12,
            border: `2px solid ${isSelected ? accentColor : colors.border}`,
            backgroundColor: isSelected ? accentBg : '#fff',
            fontFamily: fonts.sans, fontSize: 18, fontWeight: isSelected ? 700 : 500,
            color: isSelected ? accentColor : colors.text,
            transform: `scale(${popScale})`,
            display: 'flex', flexDirection: 'column', gap: 3,
          }}>
            <span>{chip.label}</span>
            {chip.sub && (
              <span style={{ fontSize: 13, color: colors.textLight, fontWeight: 400 }}>
                {chip.sub}
              </span>
            )}
            {isSelected && <span style={{ fontSize: 14, marginTop: 2 }}>&#10003;</span>}
          </div>
        );
      })}
    </div>
  );
};
