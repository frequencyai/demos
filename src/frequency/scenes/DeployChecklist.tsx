import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors, fonts, DEPLOY_CHECKLIST } from "../theme";

/**
 * Scene 6 — Deploy checklist. Items spring in with stagger,
 * checkmarks draw themselves with spring physics, progress ring fills.
 */
export const DeployChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.6 * fps),
  });

  // Progress ring
  const completedCount = DEPLOY_CHECKLIST.filter((_, i) => {
    const checkFrame = 0.5 * fps + i * 0.45 * fps;
    return frame >= checkFrame;
  }).length;
  const ringProgress = completedCount / DEPLOY_CHECKLIST.length;
  const ringCircumference = 2 * Math.PI * 48;

  // Overall completion flash
  const allDone = completedCount === DEPLOY_CHECKLIST.length;
  const doneSpring = allDone
    ? spring({
        frame,
        fps,
        delay: Math.round(0.5 * fps + (DEPLOY_CHECKLIST.length - 1) * 0.45 * fps + 8),
        config: { damping: 10, stiffness: 200 },
      })
    : 0;

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
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 10 }} />

      {/* Success glow when all done */}
      {allDone && (
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(48, 209, 88, ${0.06 * doneSpring}) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ display: "flex", gap: 56, alignItems: "flex-start", width: 920 }}>
        {/* Left: progress ring + info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [20, 0])}px)`,
            minWidth: 140,
          }}
        >
          {/* Progress ring */}
          <div style={{ position: "relative", width: 110, height: 110 }}>
            <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="55" cy="55" r="48" fill="none" stroke={colors.borderLight} strokeWidth="3.5" />
              <circle
                cx="55" cy="55" r="48" fill="none"
                stroke={allDone ? colors.positive : colors.accent}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringCircumference * (1 - ringProgress)}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 700, color: allDone ? colors.positive : colors.text, fontVariantNumeric: "tabular-nums" }}>
                {completedCount}/{DEPLOY_CHECKLIST.length}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontFamily: fonts.body, fontSize: 26, fontWeight: 800, color: colors.text, letterSpacing: "-0.02em", margin: 0 }}>Deploy</h2>
            <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.accent, marginTop: 4 }}>
              debtmelt · weekpulse · pennyscope
            </p>
          </div>
        </div>

        {/* Right: checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {DEPLOY_CHECKLIST.map((item, i) => {
            const checkFrame = 0.5 * fps + i * 0.45 * fps;

            // Item entrance
            const itemSpring = spring({
              frame,
              fps,
              delay: Math.round(0.2 * fps + i * 3),
              config: { damping: 200 },
            });

            // Check animation
            const checkSpring = spring({
              frame,
              fps,
              delay: Math.round(checkFrame),
              config: { damping: 10, stiffness: 220 },
            });
            const checked = checkSpring > 0.01;

            // Check path draw
            const checkDraw = spring({
              frame,
              fps,
              delay: Math.round(checkFrame + 2),
              config: { damping: 200 },
              durationInFrames: Math.round(0.3 * fps),
            });

            return (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 14px",
                  border: `1px solid ${checked ? "rgba(48, 209, 88, 0.15)" : colors.border}`,
                  borderRadius: 7,
                  backgroundColor: checked ? "rgba(48, 209, 88, 0.03)" : colors.surface,
                  opacity: itemSpring,
                  transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: 22, height: 22, borderRadius: 5,
                    border: `2px solid ${checked ? colors.positive : colors.border}`,
                    backgroundColor: checked ? `rgba(48, 209, 88, ${0.12 * checkSpring})` : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transform: `scale(${checked ? 0.9 + checkSpring * 0.1 : 1})`,
                  }}
                >
                  {checked && (
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7l3 3 5-6"
                        stroke={colors.positive}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="20"
                        strokeDashoffset={20 * (1 - checkDraw)}
                      />
                    </svg>
                  )}
                </div>

                <span style={{ fontFamily: fonts.body, fontSize: 17, fontWeight: 500, color: checked ? colors.positive : colors.text, flex: 1 }}>{item}</span>

                <span style={{ fontFamily: fonts.mono, fontSize: 11, color: checked ? colors.positive : colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.12em", opacity: checked ? 1 : 0.6 }}>
                  {checked ? "done" : "pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
