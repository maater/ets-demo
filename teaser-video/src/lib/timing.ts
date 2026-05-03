/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  preamble:     { start: 0,    duration: 720 },  // 24s
  pain:         { start: 720,  duration: 810 },  // 27s — Panel 4 extended
  click:        { start: 1530, duration: 210 },  // 7s
  conversation: { start: 1740, duration: 330 },  // 11s
  wow:          { start: 2070, duration: 360 },  // 12s — extended 2s for "Before any sales call" dwell
  architect:    { start: 2430, duration: 360 },  // 12s
  showcases:    { start: 2790, duration: 870 },  // 29s
  zoomOut:      { start: 3660, duration: 270 },  // 9s
  loop:         { start: 3930, duration: 180 },  // 6s
  cta:          { start: 4110, duration: 460 },  // 15s — extended for longer CTA VO (396f)
} as const;

export const TOTAL_FRAMES = 4570; // 152s (2:32)

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
