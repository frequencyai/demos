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
 * Scene 8 — "Upload. Preview. Share." kinetic text CTA.
 */
export const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "Upload.", delay: 0.2 },
    { text: "Preview.", delay: 0.55 },
    { text: "Share.", delay: 0.9 },
  ];

  // Subtle camera zoom
  const zoom = interpolate(
    frame, [0, Math.round(2.5 * fps)], [1.0, 1.04],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${zoom})`,
      }}
    >
      <div style={{
        display: "flex",
        gap: 32,
        alignItems: "baseline",
      }}>
        {words.map((word, i) => {
          const wordDelay = Math.round(word.delay * fps);
          const progress = interpolate(
            frame,
            [wordDelay, wordDelay + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
          );

          const isLast = i === words.length - 1;

          return (
            <span
              key={i}
              style={{
                fontFamily: isLast ? fonts.display : fonts.body,
                fontSize: isLast ? 90 : 84,
                fontWeight: isLast ? 400 : 700,
                fontStyle: isLast ? "italic" : "normal",
                letterSpacing: "-0.02em",
                color: isLast ? colors.accentLight : colors.text,
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      {(() => {
        const subDelay = Math.round(1.4 * fps);
        const subProgress = interpolate(
          frame, [subDelay, subDelay + 12], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
        );
        return (
          <div style={{
            position: "absolute",
            bottom: 180,
            fontFamily: fonts.mono, fontSize: 18, fontWeight: 400,
            color: colors.textMuted, letterSpacing: "0.06em",
            opacity: subProgress,
            transform: `translateY(${interpolate(subProgress, [0, 1], [8, 0])}px)`,
          }}>
            No installs. No config files. Just prototypes.
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
