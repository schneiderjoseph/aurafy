/**
 * AURAFY design tokens — V0 initial brand lock.
 * Source of truth for docs: docs/07-design/BRAND.md
 */
export const colors = {
  bg: "#F8F7F4",
  surface: "#FFFFFF",
  text: "#171717",
  muted: "#77736D",
  border: "#E7E3DD",
  primary: "#7057D9",
  accent: "#D6A85F",
  success: "#2E8B72",
  warning: "#C58B3C",
  error: "#C95A5A",
} as const;

export const radius = {
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
} as const;

export const space = {
  base: 8,
} as const;

export const motion = {
  fast: 150,
  base: 200,
  slow: 300,
} as const;

export const typography = {
  sans: "Manrope, ui-sans-serif, system-ui, sans-serif",
  serif: "Instrument Serif, ui-serif, Georgia, serif",
} as const;

export const mediaRatios = {
  feedPost: "4 / 5",
  preview: "1 / 1",
  story: "9 / 16",
} as const;
