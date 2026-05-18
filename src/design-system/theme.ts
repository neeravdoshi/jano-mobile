export const theme = {
  fonts: {
    display: '"Figtree", "Noto Sans", sans-serif',
    body: '"Figtree", "Noto Sans", sans-serif',
    support: '"Noto Sans", sans-serif'
  },
  colors: {
    canvas: "#ffffff",
    surface: "#ffffff",
    surfaceMuted: "#efefed",
    surfaceStrong: "#ffffff",
    text: "#252323",
    textStrong: "#252323",
    textMuted: "#6b7576",
    textSoft: "#343131",
    border: "#d4d8db",
    borderStrong: "#c9c9c5",
    accent: "#12b05f",
    accentSoft: "#12b05f26",
    accentStrong: "#12b05f",
    danger: "#e54b4b",
    dangerSoft: "#f6e7e7",
    dangerStrong: "#e71212",
    warning: "#ffd000",
    warningSoft: "#fff2b8",
    info: "#737ca5",
    infoSoft: "#a2a8c3",
    infoMuted: "#bec1d1",
    shadow: "rgba(37, 35, 35, 0.08)"
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32
  },
  radius: {
    xxs: 6,
    xs: 8,
    sm: 10,
    md: 12,
    lg: 16,
    xl: 24
  },
  motion: {
    fast: 0.18,
    base: 0.28,
    slow: 0.42
  }
} as const;
