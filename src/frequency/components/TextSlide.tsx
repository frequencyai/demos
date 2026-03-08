import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors, fonts, LOGO_WAVE_PATH } from "../theme";

/**
 * Narration text slide — large mixed-weight text on dark bg.
 * Inspired by reference video pattern: short phrases between UI scenes.
 *
 * `parts` is an array of { text, bold? } to create mixed weight text.
 * E.g. [{ text: "generate" }, { text: "app ideas", bold: true }]
 */
export const TextSlide: React.FC<{
  parts: { text: string; bold?: boolean; accent?: boolean }[];
  sub?: string;
}> = ({ parts, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overall entrance
  const entrance = spring({
    frame,
    fps,
    delay: 4,
    config: { damping: 200, stiffness: 100 },
  });

  // Stagger each word part
  const partSprings = parts.map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.15 * fps + i * 0.12 * fps),
      config: { damping: 18, stiffness: 120 },
    })
  );

  // Subtitle
  const subSpring = spring({
    frame,
    fps,
    delay: Math.round(0.4 * fps + parts.length * 0.12 * fps),
    config: { damping: 200, stiffness: 100 },
  });

  // Accent glow behind text
  const glowOpacity = interpolate(frame, [0.3 * fps, 1 * fps], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle wave logo in corner
  const waveOpacity = interpolate(frame, [0, 0.5 * fps], [0, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Subtle accent glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Small wave mark */}
      <svg
        width={40}
        height={40}
        viewBox="0 0 32 32"
        fill="none"
        style={{
          position: "absolute",
          top: 48,
          left: 48,
          opacity: waveOpacity,
        }}
      >
        <path
          d={LOGO_WAVE_PATH}
          stroke={colors.accent}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Main text line */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {parts.map((part, i) => (
            <span
              key={i}
              style={{
                fontFamily: fonts.body,
                fontSize: part.bold ? 64 : 56,
                fontWeight: part.bold ? 800 : 300,
                letterSpacing: part.bold ? "-0.03em" : "-0.01em",
                color: part.accent ? colors.accent : colors.text,
                opacity: partSprings[i],
                transform: `translateY(${interpolate(
                  partSprings[i],
                  [0, 1],
                  [24, 0]
                )}px)`,
                display: "inline-block",
              }}
            >
              {part.text}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        {sub && (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              color: colors.textTertiary,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: subSpring,
              transform: `translateY(${interpolate(
                subSpring,
                [0, 1],
                [12, 0]
              )}px)`,
            }}
          >
            {sub}
          </span>
        )}
      </div>
    </AbsoluteFill>
  );
};
