import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors, fonts, LINES, LOGO_WAVE_PATH } from "../theme";
import { AnimatedCursor } from "../components/Cursor";

/**
 * Scene 3 — Lines cascade in with spring physics, cursor clicks Run All,
 * status dots ignite green with a ripple effect.
 */
export const LinesAppear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each line springs in with stagger
  const lineData = LINES.map((line, i) => {
    const entrySpring = spring({
      frame,
      fps,
      delay: Math.round(0.2 * fps + i * 5),
      config: { damping: 16, stiffness: 160 },
    });
    return { ...line, entrySpring };
  });

  // All lines visible threshold
  const allLinesFrame = 0.2 * fps + LINES.length * 5 + 0.5 * fps;

  // Run All button pulses after lines are in
  const runBtnSpring = spring({
    frame,
    fps,
    delay: Math.round(allLinesFrame),
    config: { damping: 12, stiffness: 200 },
  });

  // Click moment
  const clickFrame = Math.round(allLinesFrame + 0.8 * fps);
  const clicked = frame > clickFrame;

  // Dots ignite with staggered ripple after click
  const dotIgniteData = LINES.map((_, i) => {
    if (!clicked) return 0;
    const igniteSpring = spring({
      frame,
      fps,
      delay: Math.round(clickFrame + i * 3),
      config: { damping: 10, stiffness: 250 },
    });
    return igniteSpring;
  });

  // Pipeline bar segments spring in
  const pipelineReveal = spring({
    frame,
    fps,
    delay: Math.round(allLinesFrame + 0.3 * fps),
    config: { damping: 200 },
  });

  // Status message
  const statusSpring = spring({
    frame,
    fps,
    delay: Math.round(clickFrame + LINES.length * 3 + 6),
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
          zIndex: 40,
        }}
      />

      <div style={{ width: 1760, height: 840, display: "flex", borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}>
        {/* Sidebar */}
        <div
          style={{
            width: 380,
            backgroundColor: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ padding: "24px 24px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <path
                  d={LOGO_WAVE_PATH}
                  stroke={colors.accent}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: fonts.body,
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: colors.text,
                }}
              >
                FREQUENCY
              </span>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: colors.accent,
                  boxShadow: `0 0 8px ${colors.accent}`,
                }}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                border: `1px solid ${colors.accent}`,
                borderRadius: 4,
                fontFamily: fonts.mono,
                fontSize: 13,
                color: colors.text,
                backgroundColor: colors.bg,
              }}
            >
              app-factory
            </div>
          </div>

          {/* Run All button */}
          <div style={{ padding: "0 24px 14px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 14px",
                border: `1px solid ${clicked ? colors.positive : colors.accent}`,
                borderRadius: 4,
                fontFamily: fonts.mono,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
                color: clicked ? colors.positive : colors.accent,
                backgroundColor: clicked
                  ? "rgba(48, 209, 88, 0.08)"
                  : colors.accentLight,
                transform: `scale(${1 + runBtnSpring * 0.06 * (clicked ? 0 : 1)})`,
                boxShadow: clicked
                  ? `0 0 16px rgba(48, 209, 88, 0.2)`
                  : runBtnSpring > 0.5
                    ? `0 0 12px rgba(255, 68, 0, 0.15)`
                    : "none",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 1.5l7 4.5-7 4.5V1.5z" fill="currentColor" />
              </svg>
              {clicked ? "Running" : "Run All"}
            </div>
          </div>

          {/* Line items with spring entrance */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            {lineData.map((line, i) => (
              <div
                key={line.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 24px",
                  opacity: line.entrySpring,
                  transform: `translateX(${interpolate(line.entrySpring, [0, 1], [-30, 0])}px)`,
                }}
              >
                {/* Status dot with ignite effect */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: dotIgniteData[i] > 0.5
                        ? colors.positive
                        : colors.textMuted,
                      opacity: dotIgniteData[i] > 0.5 ? 1 : 0.4,
                      boxShadow: dotIgniteData[i] > 0.5
                        ? `0 0 ${6 + dotIgniteData[i] * 8}px ${colors.positive}`
                        : "none",
                    }}
                  />
                  {/* Ignite ripple */}
                  {dotIgniteData[i] > 0.1 && dotIgniteData[i] < 0.95 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -4,
                        borderRadius: "50%",
                        border: `1px solid ${colors.positive}`,
                        opacity: 1 - dotIgniteData[i],
                        transform: `scale(${1 + dotIgniteData[i] * 2})`,
                      }}
                    />
                  )}
                </div>

                <span
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 16,
                    fontWeight: 450,
                    color: colors.text,
                  }}
                >
                  {line.name}
                </span>

                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: fonts.mono,
                    fontSize: 11,
                    color: colors.textTertiary,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                  }}
                >
                  {line.group}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "24px 40px",
            gap: 20,
          }}
        >
          {/* Title bar */}
          <div>
            <h2
              style={{
                fontFamily: fonts.body,
                fontSize: 30,
                fontWeight: 800,
                color: colors.text,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              app-factory
            </h2>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                color: colors.accent,
                marginTop: 4,
              }}
            >
              7 factory lines
            </p>
          </div>

          {/* Pipeline bar visualization */}
          <div
            style={{
              display: "flex",
              gap: 3,
              marginTop: 12,
              opacity: pipelineReveal,
            }}
          >
            {LINES.map((line, i) => {
              const segSpring = spring({
                frame,
                fps,
                delay: Math.round(allLinesFrame + 0.3 * fps + i * 3),
                config: { damping: 200 },
              });

              // Bar fill after running
              const fillWidth = clicked
                ? interpolate(
                    frame,
                    [clickFrame + i * 6, clickFrame + i * 6 + fps],
                    [0, 20],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )
                : 0;

              return (
                <div
                  key={line.name}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    opacity: segSpring,
                    transform: `translateY(${interpolate(segSpring, [0, 1], [12, 0])}px)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 24,
                      fontWeight: 700,
                      color: colors.text,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    0
                  </span>
                  <div
                    style={{
                      width: "100%",
                      height: 6,
                      backgroundColor: colors.borderLight,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${fillWidth}%`,
                        backgroundColor: colors.accent,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 10,
                      color: colors.textTertiary,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.12em",
                    }}
                  >
                    {line.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Running status */}
          {clicked && (
            <div
              style={{
                marginTop: 16,
                padding: "10px 16px",
                border: `1px solid rgba(48, 209, 88, 0.2)`,
                borderRadius: 6,
                fontFamily: fonts.mono,
                fontSize: 11,
                color: colors.positive,
                backgroundColor: "rgba(48, 209, 88, 0.04)",
                opacity: statusSpring,
                transform: `translateY(${interpolate(statusSpring, [0, 1], [8, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: colors.positive,
                  boxShadow: `0 0 8px ${colors.positive}`,
                }}
              />
              All 7 factory lines running
            </div>
          )}
        </div>
      </div>

      {/* Cursor */}
      <AnimatedCursor
        waypoints={[
          [960, 540, 0],
          [170, 270, Math.round(allLinesFrame + 0.5 * fps)],
          [170, 270, clickFrame],
        ]}
        clickAt={clickFrame}
      />
    </AbsoluteFill>
  );
};
