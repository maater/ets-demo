import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { TypingText } from '../components/TypingText';

export const Scene1Pain: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade to black in the last 10 frames
  const opacity = interpolate(frame, [80, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <TypingText
        text={`"Our SAP system has 10 years of procurement data.\nNobody knows what to do with it."`}
        speed={45}
        fontSize={56}
        color="#E5E7EB"
      />
    </AbsoluteFill>
  );
};
