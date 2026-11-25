export const ORGANIC_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const LIGHT_EMERGENCE_EASE: [number, number, number, number] = [
  0.65, 0, 0.3, 1,
];

export const CINEMATIC_ENTRY_EASE: [number, number, number, number] = [
  0.65, 0, 0.2, 1,
];

export const CONCENTRIC_ZOOM_EASE: [number, number, number, number] = [
  0.72, 0, 0.28, 1,
];

const INTRO_PAUSE_SECONDS = 1;
const INTRO_PACE = 1.2;
const afterPause = (seconds: number) =>
  INTRO_PAUSE_SECONDS + seconds * INTRO_PACE;

export function getPortalZoomScale(
  width: number,
  height: number,
  originY: number,
  dotDiameter: number,
) {
  if (dotDiameter <= 0) return 1;
  // The dot must reach the furthest corner, not just the centre of each edge.
  const cornerRadius = Math.hypot(width / 2, Math.max(originY, height - originY));
  return (2 * cornerRadius * 1.07) / dotDiameter;
}

export const GATEWAY_MOTION = {
  firstLight: {
    delay: INTRO_PAUSE_SECONDS,
    duration: 1.36 * INTRO_PACE,
  },
  innerLight: {
    delay: afterPause(1.98),
    duration: 0.84 * INTRO_PACE,
  },
  centreDot: {
    delay: afterPause(2.46),
    duration: 0.48 * INTRO_PACE,
  },
  formationDurationMs: afterPause(3.08) * 1000,
  introZoom: {
    breathDuration: 0.72,
    breathScale: 1.035,
    duration: 2.08,
  },
  incorrect: {
    duration: 0.42,
    displacement: 3,
  },
  success: {
    interfaceFade: 0.48,
  },
  reduced: {
    reveal: 0.2,
    symbolFade: 0.22,
    blackDelay: 0.12,
    blackDuration: 0.26,
    openedDelayMs: 550,
  },
  opened: {
    backgroundDuration: 0.95,
    textDelay: 0.62,
    textDuration: 0.55,
    reducedBackgroundDuration: 0.12,
  },
} as const;
