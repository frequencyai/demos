import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { colors, fonts } from "../theme";

/**
 * Scene 4 — "For a fraction of the cost."
 * Smooth word-by-word (same style as intro), camera jolts on "fraction".
 */

const WORDS: { text: string; serif?: boolean; big?: boolean }[] = [
  { text: "For" },
  { text: "a" },
  { text: "fraction", serif: true, big: true },
  { text: "of" },
  { text: "the" },
  { text: "cost." },
];

export const CostLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delayStart = Math.round(0.15 * fps);
  const wordGap = Math.round(0.1 * fps);

  // "fraction" is word index 2
  const fractionDelay = delayStart + 2 * wordGap;
  const fractionLand = fractionDelay + 8;

  // Camera impact on "fraction"
  const jolt = spring({
    frame,
    fps,
    delay: fractionLand,
    config: { damping: 200, stiffness: 500 },
  });
  const recover = spring({
    frame,
    fps,
    delay: fractionLand + 2,
    config: { damping: 10, stiffness: 160, mass: 0.6 },
  });
  const cameraY =
    interpolate(jolt, [0, 1], [0, 16]) -
    interpolate(recover, [0, 1], [0, 16]);
  const scaleBump =
    interpolate(jolt, [0, 1], [1, 1.03]) -
    interpolate(recover, [0, 1], [0, 0.03]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `translateY(${cameraY}px) scale(${scaleBump})`,
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "8px 22px",
            maxWidth: 1200,
          }}
        >
          {WORDS.map((word, i) => {
            const wordDelay = delayStart + i * wordGap;

            // Smooth ease-out for all words, slightly bouncier for "fraction"
            const progress = word.big
              ? spring({
                  frame,
                  fps,
                  delay: wordDelay,
                  config: { damping: 12, stiffness: 160, mass: 0.8 },
                })
              : interpolate(
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
              [180, 17],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const baseSize = word.big ? 104 : 84;

            return (
              <span
                key={i}
                style={{
                  fontFamily: word.serif ? fonts.serif : fonts.body,
                  fontSize: baseSize,
                  fontWeight: word.serif ? 400 : 800,
                  fontStyle: word.serif ? "italic" : "normal",
                  letterSpacing: "-0.02em",
                  color: `rgb(${Math.round(colorVal)}, ${Math.round(colorVal)}, ${Math.round(colorVal)})`,
                  display: "inline-block",
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [word.big ? 20 : 8, 0])}px) scale(${interpolate(progress, [0, 1], [word.big ? 0.75 : 0.97, 1])})`,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
