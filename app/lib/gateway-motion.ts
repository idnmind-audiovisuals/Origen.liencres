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

const BLACK_SCREEN_SECONDS = 1;
const INTRO_PACE = 1.2;
const afterBlack = (seconds: number) =>
  BLACK_SCREEN_SECONDS + seconds * INTRO_PACE;

export const GATEWAY_MOTION = {
  firstLight: {
    delay: BLACK_SCREEN_SECONDS,
    duration: 1.36 * INTRO_PACE,
    scale: 1,
  },
  darkCircle: {
    delay: afterBlack(1.18),
    duration: 1.06 * INTRO_PACE,
  },
  innerLight: {
    delay: afterBlack(1.98),
    duration: 0.84 * INTRO_PACE,
  },
  centreDot: {
    delay: afterBlack(2.46),
    duration: 0.48 * INTRO_PACE,
  },
  formRevealMs: afterBlack(3.08) * 1000,
  incorrect: {
    duration: 0.42,
    displacement: 3,
  },
  success: {
    interfaceFade: 0.48,
    reactionDuration: 0.58,
    symbolCloneDelay: 0.38,
    symbolCloneFade: 0.22,
    zoomDelay: 0.72,
    zoomDuration: 2.08,
    handoffScale: 1.035,
    coverageOverscan: 1.14,
    innerCoverageOverscan: 1.04,
    blackHold: 0.5,
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
