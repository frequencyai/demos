import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { colors, fonts } from "../theme";

/**
 * Scene 9 — Outro. Teal gradient, Showroom brand, URL.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterDelay = Math.round(0.6 * fps);

  // Logo grid icon
  const logoProgress = interpolate(
    frame, [enterDelay, enterDelay + 14], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Brand name
  const titleProgress = interpolate(
    frame, [enterDelay + 6, enterDelay + 20], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Tagline
  const tagProgress = interpolate(
    frame, [enterDelay + Math.round(0.3 * fps), enterDelay + Math.round(0.3 * fps) + 12], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // URL
  const urlProgress = interpolate(
    frame, [enterDelay + Math.round(0.5 * fps), enterDelay + Math.round(0.5 * fps) + 12], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Cashew Crate badge
  const badgeProgress = interpolate(
    frame, [enterDelay + Math.round(0.7 * fps), enterDelay + Math.round(0.7 * fps) + 12], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0a1f1a 0%, #0f2e25 30%, #1a4a3e 60%, #3A8A6E 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Logo icon */}
      <svg
        width={60} height={60} viewBox="0 0 20 20" fill="none"
        style={{
          opacity: logoProgress,
          transform: `translateY(${interpolate(logoProgress, [0, 1], [-15, 0])}px)`,
        }}
      >
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" opacity={0.7} />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" opacity={0.7} />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" opacity={0.4} />
      </svg>

      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [10, 0])}px)`,
        }}
      >
        <span style={{
          fontFamily: fonts.body,
          fontSize: 80,
          fontWeight: 600,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
        }}>
          Show
        </span>
        <span style={{
          fontFamily: fonts.display,
          fontSize: 80,
          fontWeight: 400,
          fontStyle: "italic",
          color: "#FFFFFF",
        }}>
          room
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)",
          opacity: tagProgress,
          transform: `translateY(${interpolate(tagProgress, [0, 1], [8, 0])}px)`,
          marginTop: -8,
        }}
      >
        A gallery for HTML prototypes
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.85)",
          opacity: urlProgress,
          transform: `translateY(${interpolate(urlProgress, [0, 1], [8, 0])}px)`,
          marginTop: 8,
        }}
      >
        showroom.cashewcrate.com
      </div>

      {/* Cashew Crate badge */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontFamily: fonts.mono,
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          opacity: badgeProgress,
        }}
      >
        A Cashew Crate tool
      </div>
    </AbsoluteFill>
  );
};
