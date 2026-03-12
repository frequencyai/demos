import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { colors, fonts, LOGO_WAVE_PATH } from "../theme";

/**
 * Scene 10 — Outro. Mint gradient, brand slam, URL.
 * Smooth fade-in like intro — no pop.
 */
export const OutroV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Delay content so slide transition completes + beat before brand appears
  const enterDelay = Math.round(0.85 * fps);

  // Wave draw
  const waveProgress = interpolate(
    frame,
    [enterDelay, enterDelay + Math.round(0.5 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // Logo — smooth fade in + gentle drop
  const logoProgress = interpolate(
    frame,
    [enterDelay, enterDelay + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Title — smooth fade in
  const titleProgress = interpolate(
    frame,
    [enterDelay + 6, enterDelay + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Subtitle — smooth fade in
  const subtitleProgress = interpolate(
    frame,
    [enterDelay + Math.round(0.35 * fps), enterDelay + Math.round(0.35 * fps) + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // URL — smooth fade in
  const urlProgress = interpolate(
    frame,
    [enterDelay + Math.round(0.5 * fps), enterDelay + Math.round(0.5 * fps) + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.mintLight} 0%, ${colors.mintMid} 50%, ${colors.mintDark} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Wave logo */}
      <svg
        width={130}
        height={65}
        viewBox="0 0 32 32"
        fill="none"
        style={{
          filter: `drop-shadow(0 0 12px rgba(255,255,255,0.4))`,
          opacity: logoProgress,
          transform: `translateY(${interpolate(logoProgress, [0, 1], [-20, 0])}px)`,
        }}
      >
        <path
          d={LOGO_WAVE_PATH}
          stroke="#FFFFFF"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset={60 * (1 - waveProgress)}
        />
      </svg>

      {/* Brand */}
      <div
        style={{
          fontFamily: fonts.body,
          fontSize: 96,
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [10, 0])}px)`,
          textShadow: "0 2px 24px rgba(0,0,0,0.1)",
        }}
      >
        FREQUENCY
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          opacity: subtitleProgress,
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [8, 0])}px)`,
          marginTop: -8,
        }}
      >
        Agent Orchestration
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.8)",
          opacity: urlProgress,
          transform: `translateY(${interpolate(urlProgress, [0, 1], [8, 0])}px)`,
        }}
      >
        frequency.sh
      </div>
    </AbsoluteFill>
  );
};
