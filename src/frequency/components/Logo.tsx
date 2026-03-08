import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, LOGO_WAVE_PATH } from "../theme";

export const FrequencyLogo: React.FC<{
  scale?: number;
  showText?: boolean;
  animate?: boolean;
}> = ({ scale = 1, showText = true, animate = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dotGlow = animate
    ? interpolate(frame % (2 * fps), [0, fps, 2 * fps], [8, 24, 8])
    : 12;

  const pathLength = animate
    ? interpolate(frame, [0, 1.2 * fps], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12 * scale,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      {/* Logo mark — wave */}
      <svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="6" fill="transparent" />
        <path
          d={LOGO_WAVE_PATH}
          stroke={colors.accent}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="60"
          strokeDashoffset={60 * (1 - pathLength)}
        />
      </svg>

      {showText && (
        <span
          style={{
            fontFamily: "'Albert Sans', system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: colors.text,
          }}
        >
          FREQUENCY
        </span>
      )}

      {/* Glowing dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: colors.accent,
          boxShadow: `0 0 ${dotGlow}px ${colors.accent}, 0 0 ${dotGlow * 2}px rgba(255, 68, 0, 0.3)`,
        }}
      />
    </div>
  );
};
