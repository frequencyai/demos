// Frequency Dashboard — Dark Theme Design Tokens
// Extracted from factory_runtime/ui/styles.css

export const colors = {
  bg: "#0F1117",
  surface: "#171B24",
  surfaceHover: "rgba(255, 68, 0, 0.04)",
  border: "rgba(234, 236, 232, 0.10)",
  borderLight: "rgba(234, 236, 232, 0.06)",
  text: "#EAECE8",
  textMuted: "#B2B7C4",
  textTertiary: "#8F93A1",
  accent: "#FF4400",
  accentLight: "rgba(255, 68, 0, 0.08)",
  positive: "#30D158",
  warning: "#d9a83a",
  danger: "#e14f4f",
} as const;

// Import font loader to ensure fonts are registered
import { albertSansFamily, ibmPlexMonoFamily } from "./fonts";

export const fonts = {
  mono: ibmPlexMonoFamily,
  body: albertSansFamily,
} as const;

// Logo SVG path (frequency wave)
export const LOGO_WAVE_PATH =
  "M4 16 Q8 8, 12 16 Q16 24, 20 16 Q24 8, 28 16";

// Factory line definitions matching app-factory specs
export const LINES = [
  { name: "ideas", group: "create" },
  { name: "build", group: "create" },
  { name: "deploy", group: "ship" },
  { name: "release-shared", group: "ship" },
  { name: "release", group: "ship" },
  { name: "marketing", group: "ship" },
  { name: "bugjar", group: "support" },
] as const;

// Example app names from app-factory
export const SAMPLE_APPS = [
  "debtmelt",
  "weekpulse",
  "pennyscope",
  "mileledger",
  "fillfox",
  "chartmint",
  "notchpad",
  "jsonloom",
] as const;

// Build pipeline stages
export const BUILD_STAGES = [
  "selected",
  "implemented",
  "ready_for_build",
  "built",
  "seo_ready",
  "promoted",
] as const;

// Deploy stages
export const DEPLOY_STAGES = [
  "queued",
  "polar_ready",
  "env_ready",
  "deployed_pending",
  "deployed",
] as const;

// Deploy checklist items
export const DEPLOY_CHECKLIST = [
  "Payments integrated",
  "Environment synced",
  "Deployed to Cloudflare",
  "DNS configured",
  "App page updated",
  "Health verified",
] as const;
