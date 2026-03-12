import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

/**
 * Wraps a scene with a subtle camera "push-in" zoom effect.
 * Scale increases slowly from 1.0 to target over the scene duration.
 * Creates a cinematic feel of constant forward motion.
 */
export const ZoomPush: React.FC<{
  children: React.ReactNode;
  /** Starting scale (default 1.0) */
  from?: number;
  /** Ending scale (default 1.06) */
  to?: number;
  /** Also translate slightly? */
  translateY?: number;
}> = ({ children, from = 1.0, to = 1.06, translateY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const ty = interpolate(frame, [0, durationInFrames], [0, translateY], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translateY(${ty}px)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
