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
 * Scene 1 — "Agents built apps while we slept."
 * Smooth, gentle word-by-word fade-in. No pop/bounce.
 * Words ease in with subtle rise — like the reference video.
 */
export const HookSleep: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: "Agents", serif: false },
    { text: "built", serif: false },
    { text: "apps", serif: true },
    { text: "while", serif: false },
    { text: "we", serif: false },
    { text: "slept.", serif: true },
  ];

  const delayStart = Math.round(0.2 * fps);
  const wordGap = Math.round(0.12 * fps); // Slower pacing for smooth feel

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgWarm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "8px 20px",
          maxWidth: 1200,
        }}
      >
        {words.map((word, i) => {
          const wordDelay = delayStart + i * wordGap;

          // Smooth ease-out over ~10 frames — no spring bounce
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

          // Gentle gray → black
          const colorVal = interpolate(
            frame,
            [wordDelay, wordDelay + 12],
            [180, 17],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <span
              key={i}
              style={{
                fontFamily: word.serif ? fonts.serif : fonts.body,
                fontSize: word.serif ? 92 : 88,
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
