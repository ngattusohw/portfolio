export const tourStops = [0, 0.2, 0.4, 0.6, 0.8, 0.98];
const tourFrames = [[0, 0], [0.055, 0], [0.17, 1], [0.24, 1], [0.37, 2], [0.44, 2], [0.57, 3], [0.64, 3], [0.77, 4], [0.84, 4], [0.96, 5], [1, 5]];

/** Each chapter has a short travel and a generous, still reading interval. */
export function tourPose(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  for (let i = 1; i < tourFrames.length; i++) {
    if (p <= tourFrames[i][0]) {
      const [a, from] = tourFrames[i - 1];
      const [b, to] = tourFrames[i];
      const t = (p - a) / (b - a);
      return from + (to - from) * t * t * (3 - 2 * t);
    }
  }
  return 5;
}

export type WorkshopFrame = {
  progress: number;
  active: number;
  motion: boolean;
  visible: boolean;
  fanOn: boolean;
  flipped: boolean;
  alternate: boolean;
  strumming: boolean;
  storyWidth: number;
  storyHeight: number;
  mobile: boolean;
};
