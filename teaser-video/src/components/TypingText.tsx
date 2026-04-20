import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fonts } from '../styles/tokens';

interface TypingTextProps {
  text: string;
  /** Chars per second */
  speed?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  /** Frame at which typing starts (local to this component) */
  startFrame?: number;
  showCursor?: boolean;
  cursorColor?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 40,
  fontSize = 36,
  color = '#FFFFFF',
  fontFamily = fonts.mono,
  startFrame = 0,
  showCursor = true,
  cursorColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  const charsPerFrame = speed / fps;
  const visibleChars = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const done = visibleChars >= text.length;

  // Cursor blinks every 15 frames when done
  const cursorVisible = !done || Math.floor(elapsed / 15) % 2 === 0;

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        color,
        lineHeight: 1.6,
        maxWidth: '95%',
        whiteSpace: 'pre-wrap',
      }}
    >
      {text.slice(0, visibleChars)}
      {showCursor && cursorVisible && (
        <span
          style={{
            display: 'inline-block',
            width: fontSize * 0.55,
            height: fontSize * 1.1,
            backgroundColor: cursorColor || color,
            opacity: 0.9,
            marginLeft: 2,
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </div>
  );
};
