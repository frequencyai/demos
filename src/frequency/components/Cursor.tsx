import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { colors } from "../theme";

export const AnimatedCursor: React.FC<{
  /** Array of [x, y, frameTime] waypoints */
  waypoints: [number, number, number][];
  /** Frame at which to show a click effect */
  clickAt?: number;
}> = ({ waypoints, clickAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Interpolate position through waypoints
  const times = waypoints.map((w) => w[2]);
  const xs = waypoints.map((w) => w[0]);
  const ys = waypoints.map((w) => w[1]);

  const x = interpolate(frame, times, xs, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, times, ys, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Click ripple
  const showClick = clickAt !== undefined && frame >= clickAt;
  const clickProgress = showClick
    ? interpolate(frame, [clickAt, clickAt + 0.4 * fps], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 0;

  // Only show after first waypoint time
  if (frame < times[0]) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Click ripple */}
      {showClick && clickProgress < 1 && (
        <div
          style={{
            position: "absolute",
            width: 30 + clickProgress * 20,
            height: 30 + clickProgress * 20,
            borderRadius: "50%",
            border: `2px solid ${colors.accent}`,
            opacity: 1 - clickProgress,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Cursor */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 20 24"
        fill="none"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
      >
        <path
          d="M1 1L1 18L6.5 13.5L11 22L14 20.5L9.5 12L16 11L1 1Z"
          fill="white"
          stroke="#0F1117"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
