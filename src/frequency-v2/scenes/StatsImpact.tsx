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
 * Scene 2 — Big "30" counter with purposeful camera zoom.
 *
 * Camera holds TIGHT while counter ticks up.
 * Quick scale pulse (no shake) when it hits 30.
 * Camera snaps out to reveal context.
 */
export const StatsImpact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Counter: 0→30
  const countEnd = Math.round(0.55 * fps);
  const count = Math.round(
    interpolate(frame, [Math.round(0.05 * fps), countEnd], [0, 30], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  // Camera: hold at 2.2x, snap out AFTER count finishes
  const zoomOutSpring = spring({
    frame,
    fps,
    delay: Math.round(0.65 * fps),
    config: { damping: 16, stiffness: 140, mass: 0.7 },
  });
  const cameraScale = interpolate(zoomOutSpring, [0, 1], [2.2, 1.0]);
  const cameraY = interpolate(zoomOutSpring, [0, 1], [60, 0]);

  // Scale pulse on the number when count hits 30 (no shake)
  const pulseStart = Math.round(0.55 * fps);
  const pulse = interpolate(
    frame,
    [pulseStart, pulseStart + 3, pulseStart + 10],
    [1, 1.08, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Number entrance
  const numOpacity = interpolate(
    frame,
    [0, Math.round(0.12 * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Labels after zoom-out
  const labelSpring = spring({
    frame,
    fps,
    delay: Math.round(0.9 * fps),
    config: { damping: 20, stiffness: 140 },
  });

  // Stats
  const stats = ["Working payments", "Live users", "Zero manual deploys"];
  const statSprings = stats.map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(1.15 * fps + i * 0.06 * fps),
      config: { damping: 20, stiffness: 160 },
    })
  );

  const circles = [
    { x: 200, y: 180, size: 90, speed: 0.5 },
    { x: 1640, y: 620, size: 75, speed: 0.35 },
    { x: 320, y: 700, size: 55, speed: 0.6 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          transformOrigin: "center center",
        }}
      >
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {circles.map((c, i) => {
            const drift = Math.sin((frame * c.speed) / fps) * 25;
            const circleOpacity = interpolate(
              frame, [0, Math.round(0.4 * fps)], [0, 0.18],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: c.y + drift,
                  width: c.size,
                  height: c.size,
                  borderRadius: "50%",
                  backgroundColor: colors.accent,
                  opacity: circleOpacity,
                }}
              />
            );
          })}

          {/* Big number with scale pulse */}
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 260,
              fontWeight: 800,
              color: colors.text,
              letterSpacing: "-0.04em",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              opacity: numOpacity,
              transform: `scale(${pulse})`,
            }}
          >
            {count}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              marginTop: -12,
              opacity: labelSpring,
              transform: `translateY(${interpolate(labelSpring, [0, 1], [14, 0])}px)`,
            }}
          >
            <span style={{ fontFamily: fonts.serif, fontSize: 58, fontWeight: 400, fontStyle: "italic", color: colors.text }}>
              production
            </span>
            <span style={{ fontFamily: fonts.body, fontSize: 56, fontWeight: 800, color: colors.text }}>
              apps
            </span>
            <span style={{ fontFamily: fonts.serif, fontSize: 34, fontWeight: 300, fontStyle: "italic", color: colors.textLight }}>
              and counting
            </span>
          </div>

          <div style={{ display: "flex", gap: 44, marginTop: 44 }}>
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: statSprings[i],
                  transform: `translateY(${interpolate(statSprings[i], [0, 1], [24, 0])}px)`,
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: colors.positive }} />
                <span style={{ fontFamily: fonts.body, fontSize: 26, fontWeight: 600, color: colors.textMuted }}>
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
