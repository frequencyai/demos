import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { fonts, colors } from "../theme";

/**
 * Animated counter that counts up to a target number.
 */
export const CountUp: React.FC<{
  target: number;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  fontSize?: number;
  color?: string;
  suffix?: string;
  prefix?: string;
}> = ({
  target,
  delay = 0,
  duration = 1.2,
  fontSize = 160,
  color = colors.text,
  suffix = "",
  prefix = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.round(delay * fps);
  const endFrame = startFrame + Math.round(duration * fps);

  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const currentValue = Math.round(progress * target);

  const opacity = interpolate(frame, [startFrame, startFrame + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(
    frame,
    [startFrame, startFrame + Math.round(0.3 * fps)],
    [0.8, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontSize,
        fontWeight: 800,
        color,
        letterSpacing: "-0.04em",
        opacity,
        transform: `scale(${scale})`,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {currentValue}
      {suffix}
    </div>
  );
};
