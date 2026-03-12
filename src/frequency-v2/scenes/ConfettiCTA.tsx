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
 * Scene 9 — "Stop prompting. Start orchestrating."
 * Elegant dark slide with radial glow behind text. No confetti.
 * Clean, cinematic statement.
 */
export const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words: { text: string; serif?: boolean }[] = [
    { text: "Stop" },
    { text: "prompting." },
    { text: "Start" },
    { text: "orchestrating.", serif: true },
  ];

  const textDelay = Math.round(0.15 * fps);
  const wordGap = Math.round(0.1 * fps);

  // Radial glow expands behind the text
  const glowProgress = interpolate(
    frame,
    [Math.round(0.1 * fps), Math.round(1.2 * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Subtle line decoration
  const lineProgress = interpolate(
    frame,
    [Math.round(0.6 * fps), Math.round(1.4 * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgDark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}12 0%, transparent 70%)`,
          opacity: glowProgress,
          transform: `scale(${interpolate(glowProgress, [0, 1], [0.3, 1.6])})`,
        }}
      />

      {/* Horizontal accent lines */}
      <div
        style={{
          position: "absolute",
          width: `${lineProgress * 400}px`,
          height: 1,
          backgroundColor: `${colors.accent}30`,
          top: "38%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: `${lineProgress * 400}px`,
          height: 1,
          backgroundColor: `${colors.accent}30`,
          bottom: "38%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Text */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "8px 22px",
          maxWidth: 1200,
          zIndex: 10,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = textDelay + i * wordGap;

          const progress = interpolate(
            frame,
            [wordDelay, wordDelay + 10],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          const colorVal = interpolate(
            frame,
            [wordDelay, wordDelay + 12],
            [80, 235],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <span
              key={i}
              style={{
                fontFamily: word.serif ? fonts.serif : fonts.body,
                fontSize: word.serif ? 84 : 78,
                fontWeight: word.serif ? 400 : 800,
                fontStyle: word.serif ? "italic" : "normal",
                letterSpacing: "-0.02em",
                color: `rgb(${Math.round(colorVal)}, ${Math.round(colorVal)}, ${Math.round(colorVal)})`,
                display: "inline-block",
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [8, 0])}px)`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
