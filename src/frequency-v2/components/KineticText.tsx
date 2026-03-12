import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { colors, fonts } from "../theme";

/**
 * Kinetic typography component — words appear one at a time with spring animation.
 * Inspired by the Shipper video style: large, bold, center-aligned text.
 */
export const KineticText: React.FC<{
  text: string;
  /** Delay in seconds before the first word appears */
  delay?: number;
  /** Seconds between each word appearing */
  wordGap?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  /** Words to highlight with accent color */
  highlightWords?: string[];
  /** Center or left align */
  align?: "center" | "left";
  maxWidth?: number;
  lineHeight?: number;
}> = ({
  text,
  delay = 0,
  wordGap = 0.12,
  fontSize = 72,
  fontWeight = 800,
  color = colors.text,
  highlightWords = [],
  align = "center",
  maxWidth = 1400,
  lineHeight = 1.15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");
  const delayFrames = Math.round(delay * fps);
  const gapFrames = Math.round(wordGap * fps);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "baseline",
        gap: `${fontSize * 0.15}px ${fontSize * 0.22}px`,
        maxWidth,
        lineHeight,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delayFrames + i * gapFrames;
        const s = spring({
          frame,
          fps,
          delay: wordDelay,
          config: { damping: 18, stiffness: 160, mass: 0.9 },
        });

        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().replace(/[.,!?]/, "") === hw.toLowerCase()
        );

        return (
          <span
            key={i}
            style={{
              fontFamily: fonts.body,
              fontSize,
              fontWeight,
              letterSpacing: "-0.03em",
              color: isHighlight ? colors.accent : color,
              display: "inline-block",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
