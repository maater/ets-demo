/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  pain:         { start: 0,    duration: 720 },  // 24s — 64px min + reading time
  click:        { start: 720,  duration: 210 },  // 7s — longer narrative dwell
  conversation: { start: 930,  duration: 330 },  // 11s — self-assessment + chat
  wow:          { start: 1260, duration: 300 },  // 10s — spec + wedge + expert review
  zoomOut:      { start: 1560, duration: 420 },  // 14s — overlay (two beats) → pipeline
  loop:         { start: 1980, duration: 180 },  // 6s — knowledge loop
  cta:          { start: 2160, duration: 180 },  // 6s — CTA → Vixul (reading time)
} as const;

export const TOTAL_FRAMES = 2340; // 78s

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
