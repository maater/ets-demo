import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

interface PipelineCardProps {
  num: string;
  title: string;
  sub?: string;
  color: string;
  frame: number;
  enterFrame: number;
  isHighlighted?: boolean;
  glowColor?: string;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  num, title, sub, color, frame, enterFrame, isHighlighted, glowColor,
}) => {
  const { fps } = useVideoConfig();
  const entered = frame >= enterFrame;

  const slideY = entered
    ? spring({ frame: frame - enterFrame, fps, config: { damping: 14, stiffness: 80 }, from: 120, to: 0 })
    : 120;

  const opacity = entered
    ? spring({ frame: frame - enterFrame, fps, config: { damping: 20, stiffness: 100 }, from: 0, to: 1 })
    : 0;

  const glow = isHighlighted && glowColor
    ? `0 0 0 3px ${glowColor}40, 0 0 24px ${glowColor}30`
    : '0 2px 8px rgba(0,0,0,0.06)';

  return (
    <div style={{
      width: 220, backgroundColor: '#fff',
      border: `2px solid ${isHighlighted ? color : colors.border}`,
      borderRadius: 14, padding: '18px 16px',
      opacity, transform: `translateY(${slideY}px)`,
      boxShadow: glow,
    }}>
      <div style={{
        fontSize: 12, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase' as const, color, marginBottom: 8,
        fontFamily: fonts.sans,
      }}>
        {num}
      </div>
      <div style={{
        fontSize: 18, fontWeight: 700, color: colors.text,
        fontFamily: fonts.sans, lineHeight: 1.3,
      }}>
        {title}
      </div>
      {sub && (
        <div style={{
          fontSize: 13, color: colors.textMuted,
          fontFamily: fonts.sans, lineHeight: 1.5, marginTop: 4,
        }}>
          {sub}
        </div>
      )}
    </div>
  );
};
