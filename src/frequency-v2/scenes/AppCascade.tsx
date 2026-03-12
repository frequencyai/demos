import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
  Easing,
} from "remotion";
import { colors, fonts, ALL_APPS } from "../theme";

/**
 * Scene 3 — App cards cascade in.
 * Big fonts, taller cards, fills frame. Bold header/footer text.
 */

const cardColors = [
  "#6366F1", "#F59E0B", "#10B981", "#EC4899", "#3B82F6",
  "#8B5CF6", "#14B8A6", "#EF4444", "#F97316", "#06B6D4",
];

const COLS = 6;

export const AppCascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const settleProgress = interpolate(
    frame, [0, Math.round(1.5 * fps)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const cameraTilt = interpolate(settleProgress, [0, 1], [2.5, 0]);
  const cameraScale = interpolate(settleProgress, [0, 1], [1.08, 1.0]);
  const cameraY = interpolate(settleProgress, [0, 1], [30, 0]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: colors.bgWarm, overflow: "hidden", perspective: 1200 }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) translateY(${cameraY}px) rotateX(${cameraTilt}deg)`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px",
        }}
      >
        {/* Header — bold and dark */}
        {(() => {
          const s = spring({ frame, fps, delay: 2, config: { damping: 14, stiffness: 200 } });
          return (
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: colors.text,
                marginBottom: 14,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [-10, 0])}px)`,
              }}
            >
              Shipped Autonomously
            </div>
          );
        })()}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 10,
            maxWidth: 1820,
            width: "100%",
          }}
        >
          {ALL_APPS.map((app, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const waveDelay = Math.round(0.1 * fps + col * 1.5 + row * 3);
            const s = spring({ frame, fps, delay: waveDelay, config: { damping: 12, stiffness: 220, mass: 0.6 } });
            const rot = (random(`rot-${i}`) - 0.5) * 4;

            return (
              <div
                key={app}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  padding: "22px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])}) rotate(${interpolate(s, [0, 1], [rot, 0])}deg)`,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: cardColors[i % cardColors.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: fonts.body, fontSize: 26, fontWeight: 600, color: colors.text }}>
                  {app}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer — bold and dark */}
        {(() => {
          const s = spring({ frame, fps, delay: Math.round(1.3 * fps), config: { damping: 200 } });
          return (
            <div
              style={{
                fontFamily: fonts.serif,
                fontSize: 26,
                fontWeight: 400,
                fontStyle: "italic",
                color: colors.text,
                marginTop: 14,
                opacity: s,
              }}
            >
              ...with more shipping every day
            </div>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
