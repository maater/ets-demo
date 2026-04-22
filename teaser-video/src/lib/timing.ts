/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  pain:         { start: 0,    duration: 720 },  // 24s — 64px min + reading time
  click:        { start: 720,  duration: 210 },  // 7s — longer narrative dwell
  conversation: { start: 930,  duration: 330 },  // 11s — self-assessment + chat
  wow:          { start: 1260, duration: 300 },  // 10s — spec + wedge + expert review
  showcases:    { start: 1560, duration: 870 },  // 29s — overlay beats + 3 product showcases
  zoomOut:      { start: 2430, duration: 270 },  // 9s — pipeline zoom out (cards + expansions)
  loop:         { start: 2700, duration: 180 },  // 6s — knowledge loop
  cta:          { start: 2880, duration: 180 },  // 6s — CTA → Vixul (reading time)
} as const;

export const TOTAL_FRAMES = 3060; // 102s

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
