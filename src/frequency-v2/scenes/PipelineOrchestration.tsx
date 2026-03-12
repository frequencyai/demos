import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { colors, fonts, PIPELINES, LOGO_WAVE_PATH } from "../theme";

/**
 * Scene 6 — Parallel pipelines on dark dashboard.
 * Bigger text, less border, fills the frame. Camera pans down.
 */
export const PipelineOrchestration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    delay: 2,
    config: { damping: 14, stiffness: 200 },
  });

  // Camera pan down
  const panProgress = interpolate(
    frame,
    [Math.round(0.2 * fps), Math.round(2.8 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );
  const cameraY = interpolate(panProgress, [0, 1], [-80, 0]);
  const cameraScale = interpolate(panProgress, [0, 1], [1.08, 1.0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgDark,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          transformOrigin: "center top",
        }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Header bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 50,
            background: "rgba(0,0,0,0.4)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 48px",
            opacity: titleSpring,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg width={26} height={26} viewBox="0 0 32 32" fill="none">
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
                fontFamily: fonts.mono,
                fontSize: 16,
                color: "rgba(234,236,232,0.6)",
                letterSpacing: "0.08em",
              }}
            >
              FREQUENCY / CONTROL CENTER
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: colors.positive,
                boxShadow: `0 0 6px rgba(48,209,88,0.5)`,
              }}
            />
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 15,
                color: "rgba(234,236,232,0.5)",
              }}
            >
              10 PIPELINES ACTIVE
            </span>
          </div>
        </div>

        {/* Content */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 50,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 56,
              fontWeight: 800,
              color: colors.textOnDark,
              letterSpacing: "-0.02em",
              marginBottom: 36,
              textAlign: "center",
              opacity: titleSpring,
              transform: `translateY(${interpolate(titleSpring, [0, 1], [14, 0])}px)`,
            }}
          >
            10 parallel pipelines.{" "}
            <span style={{ color: colors.accent }}>State-coordinated.</span>
          </div>

          {/* Pipeline rows */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: 1600,
              padding: "0 48px",
            }}
          >
            {PIPELINES.map((pipeline, i) => {
              const rowSpring = spring({
                frame,
                fps,
                delay: Math.round(0.15 * fps + i * 0.04 * fps),
                config: { damping: 12, stiffness: 200 },
              });

              const speeds = [
                0.75, 0.55, 0.92, 0.35, 0.65, 0.45, 0.85, 0.6, 0.7, 0.5,
              ];
              const barProgress = interpolate(
                frame,
                [
                  Math.round(0.3 * fps + i * 0.05 * fps),
                  Math.round(3.0 * fps),
                ],
                [0, speeds[i]],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.quad),
                }
              );

              const isActive =
                frame > Math.round(0.3 * fps + i * 0.05 * fps);

              const dotPos = interpolate(
                (frame + i * 12) % Math.round(1.5 * fps),
                [0, Math.round(1.5 * fps)],
                [0, 1]
              );

              return (
                <div
                  key={pipeline.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "190px 1fr 70px",
                    alignItems: "center",
                    gap: 18,
                    opacity: rowSpring,
                    transform: `translateX(${interpolate(rowSpring, [0, 1], [-30, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: isActive
                          ? pipeline.color
                          : "rgba(255,255,255,0.2)",
                        boxShadow: isActive
                          ? `0 0 8px ${pipeline.color}40`
                          : "none",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: fonts.mono,
                        fontSize: 20,
                        fontWeight: 500,
                        color: "rgba(234,236,232,0.75)",
                      }}
                    >
                      {pipeline.name}
                    </span>
                  </div>

                  <div
                    style={{
                      height: 34,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 4,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${barProgress * 100}%`,
                        background: `linear-gradient(90deg, ${pipeline.color}30, ${pipeline.color}70)`,
                        borderRadius: 4,
                      }}
                    />
                    {isActive && barProgress > 0.05 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: `${dotPos * barProgress * 100}%`,
                          transform: "translate(-50%, -50%)",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: pipeline.color,
                          boxShadow: `0 0 8px ${pipeline.color}`,
                        }}
                      />
                    )}
                  </div>

                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 19,
                      color: pipeline.color,
                      fontVariantNumeric: "tabular-nums",
                      textAlign: "right",
                    }}
                  >
                    {Math.round(barProgress * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
