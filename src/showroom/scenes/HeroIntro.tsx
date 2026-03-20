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
 * Scene 1 — "Show your prototypes. Skip the meeting."
 * Word-by-word fade-in on dark background with teal accent.
 */
export const HeroIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "Show", accent: false },
    { text: "your", accent: false },
    { text: "prototypes.", accent: true },
    { text: "Skip", accent: false },
    { text: "the", accent: false },
    { text: "meeting.", accent: true },
  ];

  const delayStart = Math.round(0.3 * fps);
  const wordGap = Math.round(0.1 * fps);

  // Subtle tagline below
  const tagDelay = delayStart + words.length * wordGap + Math.round(0.4 * fps);
  const tagProgress = interpolate(
    frame,
    [tagDelay, tagDelay + 14],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "8px 20px",
          maxWidth: 1100,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = delayStart + i * wordGap;
          const progress = interpolate(
            frame,
            [wordDelay, wordDelay + 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
          );

          return (
            <span
              key={i}
              style={{
                fontFamily: word.accent ? fonts.display : fonts.body,
                fontSize: word.accent ? 88 : 82,
                fontWeight: word.accent ? 400 : 600,
                fontStyle: word.accent ? "italic" : "normal",
                letterSpacing: "-0.02em",
                color: word.accent ? colors.accentLight : colors.text,
                display: "inline-block",
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [12, 0])}px)`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: "0.08em",
          color: colors.textMuted,
          textTransform: "uppercase",
          opacity: tagProgress,
          transform: `translateY(${interpolate(tagProgress, [0, 1], [8, 0])}px)`,
        }}
      >
        A gallery for HTML prototypes
      </div>
    </AbsoluteFill>
  );
};
