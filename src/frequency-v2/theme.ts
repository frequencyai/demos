// Frequency V2 — Light Theme (Shipper-style kinetic typography)
// Mixed serif/sans typography, warm backgrounds, mint gradients

import { albertSansFamily, ibmPlexMonoFamily, bitterFamily } from "../frequency/fonts";

export const colors = {
  bg: "#FFFFFF",
  bgWarm: "#F0E8E0",        // Warm beige (like ref opening slide)
  bgDark: "#0F1117",
  bgCharcoal: "#2D3748",    // Dark charcoal contrast slide
  surface: "#F4F4F5",
  surfaceAlt: "#EEEEF0",
  border: "rgba(0, 0, 0, 0.08)",
  text: "#111111",
  textMuted: "#555555",
  textLight: "#999999",
  textFading: "#BCBCBC",     // Gray for words still "arriving"
  textOnDark: "#EAECE8",
  accent: "#FF4400",
  accentSoft: "rgba(255, 68, 0, 0.10)",
  accentBg: "rgba(255, 68, 0, 0.06)",
  positive: "#30D158",
  positiveSoft: "rgba(48, 209, 88, 0.10)",
  // Mint/teal gradient (like ref brand slides)
  mintDark: "#2D8E82",
  mintLight: "#E0F5F0",
  mintMid: "#4AADA1",
} as const;

export const fonts = {
  body: albertSansFamily,
  mono: ibmPlexMonoFamily,
  serif: bitterFamily,
} as const;

export const LOGO_WAVE_PATH =
  "M4 16 Q8 8, 12 16 Q16 24, 20 16 Q24 8, 28 16";

// Extended list of real deployed apps from app-factory
export const ALL_APPS = [
  "chartmint", "qrmint", "papermint", "crunchpix", "cutoutcraft",
  "codedelta", "fillfox", "invoicesnap", "debtmelt", "deskburn",
  "shelvd", "mileledger", "pennyscope", "batchmark", "formatflip",
  "rowsweep", "sigblock", "tallyo", "jsonloom", "clipshrink",
  "sizecraft", "weekpulse", "slicetune", "shotglow", "cuetalk",
  "renewpad", "typevolt", "snaptally", "notchpad", "bugjar",
] as const;

// Pipeline names from factory
export const PIPELINES = [
  { name: "ideas", color: "#6366F1" },
  { name: "build", color: "#F59E0B" },
  { name: "deploy", color: "#10B981" },
  { name: "release-shared", color: "#8B5CF6" },
  { name: "release", color: "#EC4899" },
  { name: "marketing", color: "#3B82F6" },
  { name: "seo", color: "#14B8A6" },
  { name: "bugjar", color: "#EF4444" },
  { name: "self-improve", color: "#F97316" },
  { name: "monitoring", color: "#6B7280" },
] as const;
