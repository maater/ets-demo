/** Frame-based timing constants for each scene. All at 30fps. */

export const FPS = 30;

export const scenes = {
  pain:         { start: 0,    duration: 660 },  // 22s — generous reading pace
  click:        { start: 660,  duration: 120 },  // 4s — website landing + CTA
  conversation: { start: 780,  duration: 270 },  // 9s — self-assessment montage
  wow:          { start: 1050, duration: 300 },  // 10s — spec + wedge + expert review
  zoomOut:      { start: 1350, duration: 390 },  // 13s — overlay → pipeline walkthrough
  loop:         { start: 1740, duration: 180 },  // 6s — knowledge loop
  cta:          { start: 1920, duration: 180 },  // 6s — CTA → Vixul
} as const;

export const TOTAL_FRAMES = 2100; // 70s

/** Helper: get a 0-1 progress value within a scene */
export function sceneProgress(frame: number, sceneName: keyof typeof scenes): number {
  const s = scenes[sceneName];
  const local = frame - s.start;
  if (local < 0) return 0;
  if (local >= s.duration) return 1;
  return local / s.duration;
}
