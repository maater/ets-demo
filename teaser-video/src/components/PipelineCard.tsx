import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { colors, fonts } from '../styles/tokens';

interface PipelineCardProps {
  num: string;
  title: string;
  color: string;
  frame: number;
  enterFrame: number;
  isHighlighted?: boolean;
  glowColor?: string;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  num, title, color, frame, enterFrame, isHighlighted, glowColor,
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
    ? `0 0 0 3px ${glowColor}40, 0 0 20px ${glowColor}30`
    : '0 2px 8px rgba(0,0,0,0.06)';

  return (
    <div style={{
      width: 170,
      backgroundColor: '#fff',
      border: `2px solid ${isHighlighted ? color : colors.border}`,
      borderRadius: 14,
      padding: '16px 14px',
      opacity,
      transform: `translateY(${slideY}px)`,
      boxShadow: glow,
      transition: 'box-shadow 300ms ease',
    }}>
      <div style={{
        fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase' as const, color, marginBottom: 6,
        fontFamily: fonts.sans,
      }}>
        {num}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 700, color: colors.text,
        fontFamily: fonts.sans, lineHeight: 1.3,
      }}>
        {title}
      </div>
    </div>
  );
};
