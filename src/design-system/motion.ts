export const motionTokens = {
  spring: {
    soft: { type: "spring", stiffness: 220, damping: 24, mass: 0.8 },
    crisp: { type: "spring", stiffness: 320, damping: 28, mass: 0.7 },
    sheet: { type: "spring", stiffness: 280, damping: 30, mass: 0.9 }
  },
  duration: {
    instant: 0.12,
    fast: 0.18,
    base: 0.26,
    slow: 0.4
  }
} as const;
