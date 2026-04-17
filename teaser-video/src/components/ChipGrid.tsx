import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

interface Chip {
  label: string;
  sub?: string;
  selected?: boolean;
}

interface ChipGridProps {
  chips: Chip[];
  /** Which chip indices are selected */
  selectedIndices: number[];
  /** Current frame (local) */
  frame: number;
  /** Frame at which each selection happens (ordered) */
  selectionFrames: number[];
  accentColor?: string;
  accentBg?: string;
  chipWidth?: number;
}

export const ChipGrid: React.FC<ChipGridProps> = ({
  chips,
  selectedIndices,
  frame,
  selectionFrames,
  accentColor = colors.primary,
  accentBg = colors.primaryLight,
  chipWidth = 160,
}) => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        maxWidth: 900,
      }}
    >
      {chips.map((chip, i) => {
        const selIdx = selectedIndices.indexOf(i);
        const isSelected =
          selIdx !== -1 && frame >= (selectionFrames[selIdx] ?? Infinity);

        const popScale = isSelected
          ? spring({
              frame: frame - (selectionFrames[selIdx] ?? 0),
              fps,
              config: { damping: 12, stiffness: 200 },
              from: 1.15,
              to: 1,
            })
          : 1;

        return (
          <div
            key={i}
            style={{
              width: chipWidth,
              padding: '10px 14px',
              borderRadius: 10,
              border: `2px solid ${isSelected ? accentColor : colors.border}`,
              backgroundColor: isSelected ? accentBg : '#fff',
              fontFamily: fonts.sans,
              fontSize: 13,
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? accentColor : colors.text,
              transform: `scale(${popScale})`,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span>{chip.label}</span>
            {chip.sub && (
              <span style={{ fontSize: 10, color: colors.textLight, fontWeight: 400 }}>
                {chip.sub}
              </span>
            )}
            {isSelected && (
              <span style={{ fontSize: 10, marginTop: 2 }}>&#10003;</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
