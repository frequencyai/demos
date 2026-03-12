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
 * Scene 7 — Ideate → Build → Deploy → Live pipeline.
 * Bigger content, less border. Camera tracks left-to-right.
 */

const STAGES = [
  { label: "Ideate", icon: "💡", color: "#6366F1" },
  { label: "Build", icon: "🔨", color: "#F59E0B" },
  { label: "Deploy", icon: "🚀", color: "#10B981" },
  { label: "Live", icon: "✓", color: "#30D158" },
];

const APPS_IN_STAGES = [
  ["notchpad", "weekpulse"],
  ["fillfox", "tallyo"],
  ["debtmelt"],
  ["chartmint", "qrmint", "papermint"],
];

export const BuildFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, delay: 2, config: { damping: 14, stiffness: 200 } });

  const trackProgress = interpolate(
    frame, [Math.round(0.15 * fps), Math.round(2.0 * fps)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  const cameraX = interpolate(trackProgress, [0, 1], [160, 0]);
  const cameraScale = interpolate(trackProgress, [0, 1], [1.12, 1.0]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale}) translateX(${cameraX}px)`,
          transformOrigin: "left center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            opacity: titleSpring,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [16, 0])}px)`,
          }}
        >
          <div style={{
            fontFamily: fonts.mono, fontSize: 22, fontWeight: 600,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: colors.textMuted, marginBottom: 10,
          }}>
            AUTONOMOUS PIPELINE
          </div>
          <div style={{
            fontFamily: fonts.body, fontSize: 72, fontWeight: 800,
            color: colors.text, letterSpacing: "-0.03em",
          }}>
            From idea to live.{" "}
            <span style={{ fontFamily: fonts.serif, fontWeight: 400, fontStyle: "italic", color: colors.accent }}>
              No humans required.
            </span>
          </div>
        </div>

        {/* Stage columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 340px)", gap: 36, alignItems: "start" }}>
          {STAGES.map((stage, stageIdx) => {
            const stageSpring = spring({
              frame, fps,
              delay: Math.round(0.2 * fps + stageIdx * 0.08 * fps),
              config: { damping: 12, stiffness: 200, mass: 0.7 },
            });

            return (
              <div
                key={stage.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  opacity: stageSpring,
                  transform: `translateX(${interpolate(stageSpring, [0, 1], [-40, 0])}px) scale(${interpolate(stageSpring, [0, 1], [0.85, 1])})`,
                }}
              >
                <div style={{
                  width: 90, height: 90, borderRadius: 22,
                  backgroundColor: `${stage.color}15`, border: `2px solid ${stage.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
                }}>
                  {stage.icon}
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 32, fontWeight: 700, color: colors.text }}>
                  {stage.label}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 100 }}>
                  {APPS_IN_STAGES[stageIdx].map((app, appIdx) => {
                    const appSpring = spring({
                      frame, fps,
                      delay: Math.round(0.5 * fps + stageIdx * 0.1 * fps + appIdx * 0.06 * fps),
                      config: { damping: 14, stiffness: 200 },
                    });
                    return (
                      <div
                        key={app}
                        style={{
                          padding: "14px 28px",
                          background: `${stage.color}10`, border: `1px solid ${stage.color}30`,
                          borderRadius: 8, fontFamily: fonts.mono, fontSize: 24, fontWeight: 500,
                          color: stage.color, opacity: appSpring,
                          transform: `translateX(${interpolate(appSpring, [0, 1], [20, 0])}px)`,
                        }}
                      >
                        {app}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrows — centered between each column pair */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -10px)", display: "flex", gap: 336 }}>
          {[0, 1, 2].map((i) => {
            const arrowS = spring({ frame, fps, delay: Math.round(0.4 * fps + i * 0.08 * fps), config: { damping: 14, stiffness: 200 } });
            return (
              <svg key={i} width={40} height={40} viewBox="0 0 24 24" fill="none" style={{ opacity: interpolate(arrowS, [0, 1], [0, 0.45]) }}>
                <path d="M5 12h14m-6-6l6 6-6 6" stroke={colors.accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
