/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  pain:         { start: 0,    duration: 420 },  // 14s — slow-paced Meridian Partners narrative
  click:        { start: 420,  duration: 90  },  // 3s — website landing + CTA
  conversation: { start: 510,  duration: 270 },  // 9s — self-assessment montage
  wow:          { start: 780,  duration: 270 },  // 9s — spec + wedge + expert review
  zoomOut:      { start: 1050, duration: 360 },  // 12s — overlay → pipeline walkthrough
  loop:         { start: 1410, duration: 150 },  // 5s — knowledge loop (light style)
  cta:          { start: 1560, duration: 90  },  // 3s — CTA → Vixul
} as const;

export const TOTAL_FRAMES = 1650; // 55s

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
