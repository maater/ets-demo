/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  pain:         { start: 0,    duration: 90  },  // 3s
  click:        { start: 90,   duration: 60  },  // 2s
  conversation: { start: 150,  duration: 270 },  // 9s
  wow:          { start: 420,  duration: 210 },  // 7s
  zoomOut:      { start: 630,  duration: 270 },  // 9s
  loop:         { start: 900,  duration: 135 },  // 4.5s
  cta:          { start: 1035, duration: 90  },  // 3s
} as const;

export const TOTAL_FRAMES = 1125; // ~37.5s

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
