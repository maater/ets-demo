/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  pain:         { start: 0,    duration: 660 },  // 22s — generous reading pace
  click:        { start: 660,  duration: 150 },  // 5s — website landing + CTA (slower zoom)
  conversation: { start: 810,  duration: 330 },  // 11s — self-assessment + chat
  wow:          { start: 1140, duration: 300 },  // 10s — spec + wedge + expert review
  zoomOut:      { start: 1440, duration: 420 },  // 14s — overlay (two beats) → pipeline
  loop:         { start: 1860, duration: 180 },  // 6s — knowledge loop
  cta:          { start: 2040, duration: 150 },  // 5s — CTA → Vixul
} as const;

export const TOTAL_FRAMES = 2190; // 73s

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
