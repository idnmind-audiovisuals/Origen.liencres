export const ORGANIC_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const GATEWAY_MOTION = {
  firstLight: {
    delay: 0.08,
    duration: 1.48,
    scale: 1.48,
  },
  darkCircle: {
    delay: 1.22,
    duration: 1.12,
  },
  innerLight: {
    delay: 2.08,
    duration: 0.82,
  },
  centreDot: {
    delay: 2.48,
    duration: 0.48,
  },
  exactMark: {
    delay: 2.68,
    duration: 0.34,
  },
  formRevealMs: 3540,
  incorrect: {
    duration: 0.42,
    displacement: 3,
  },
  success: {
    symbolResponse: 0.72,
    interfaceFade: 0.44,
    washDelay: 0.38,
    washDuration: 1.24,
    openedDelayMs: 1520,
  },
  reduced: {
    reveal: 0.2,
  },
} as const;
