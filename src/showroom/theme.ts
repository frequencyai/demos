import { playfairFamily, workSansFamily, overpassMonoFamily } from "./fonts";

export const colors = {
  bg: "#0f0a08",
  bgCard: "#1a1310",
  bgSurface: "#231b16",
  bgModal: "#1e1814",
  bgInput: "#2a2320",
  border: "rgba(58, 138, 110, 0.18)",
  borderSubtle: "rgba(255, 255, 255, 0.06)",
  text: "#E8E0D4",
  textMuted: "#8A8278",
  textDim: "#5a5450",
  accent: "#3A8A6E",
  accentLight: "#4CAF85",
  accentBg: "rgba(58, 138, 110, 0.12)",
  white: "#FFFFFF",
  red: "#EF4444",
  chrome: "#1c1614",
} as const;

export const fonts = {
  display: playfairFamily,
  body: workSansFamily,
  mono: overpassMonoFamily,
} as const;
