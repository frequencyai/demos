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
import { AnimatedCursor } from "../components/Cursor";

/**
 * Scene — Start Frequency Skill.
 * Shows a skill/plugin card for "Frequency for LLMs", user clicks Start,
 * and factory lines begin scaffolding into the target repo.
 */

const SKILL_LINES = [
  "Scanning app-factory repository...",
  "Detected: Node.js · Cloudflare Workers · D1",
  "Building factory lines from specs...",
  "  → ideas.frequency.yaml",
  "  → build.frequency.yaml",
  "  → deploy.frequency.yaml",
  "  → release-shared.frequency.yaml",
  "  → release.frequency.yaml",
  "  → marketing.frequency.yaml",
  "  → bugjar.frequency.yaml",
  "  → seo.frequency.yaml",
  "  → self-improvement.frequency.yaml",
  "9 factory lines initialized ✓",
];

export const StartSkill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140 },
    delay: Math.round(0.2 * fps),
  });

  // "Start" button highlight
  const btnHighlight = spring({
    frame,
    fps,
    delay: Math.round(1.0 * fps),
    config: { damping: 200 },
  });

  // Click moment
  const clickFrame = Math.round(1.6 * fps);
  const clicked = frame > clickFrame;

  // After click — terminal output typewriter
  const terminalSpring = spring({
    frame,
    fps,
    delay: Math.round(clickFrame + 6),
    config: { damping: 200 },
  });

  // Line-by-line terminal output
  const termLines = SKILL_LINES.map((line, i) => {
    const lineFrame = clickFrame + 0.3 * fps + i * 0.3 * fps;
    const visible = frame >= lineFrame;
    const lineSpring = visible
      ? spring({
          frame,
          fps,
          delay: Math.round(lineFrame),
          config: { damping: 200 },
        })
      : 0;
    return { text: line, visible, spring: lineSpring };
  });

  // Progress bar
  const progressStart = clickFrame + 0.3 * fps;
  const progressEnd = clickFrame + 0.3 * fps + SKILL_LINES.length * 0.3 * fps;
  const progress = interpolate(frame, [progressStart, progressEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Narration slide-in
  const narrationSpring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  // Done state
  const allDone = frame > progressEnd;
  const doneSpring = allDone
    ? spring({
        frame,
        fps,
        delay: Math.round(progressEnd + 4),
        config: { damping: 14, stiffness: 180 },
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: 1000,
          opacity: cardSpring,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.94, 1])}) translateY(${interpolate(cardSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        {/* Skill card */}
        <div
          style={{
            border: `1px solid ${clicked ? colors.accent : colors.border}`,
            borderRadius: 12,
            backgroundColor: colors.surface,
            padding: "36px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxShadow: clicked
              ? `0 0 40px rgba(255, 68, 0, 0.06)`
              : "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Frequency icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 10,
                backgroundColor: colors.accentLight,
                border: `1px solid ${colors.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={28} height={28} viewBox="0 0 32 32" fill="none">
                <path
                  d={LOGO_WAVE_PATH}
                  stroke={colors.accent}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: fonts.body,
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.text,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Frequency
              </h2>
              <p
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  color: colors.textTertiary,
                  marginTop: 3,
                }}
              >
                Autonomous agent orchestration
              </p>
            </div>

            {/* Start / Running button */}
            <div
              style={{
                padding: "10px 28px",
                borderRadius: 6,
                fontFamily: fonts.mono,
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                border: `1px solid ${clicked ? colors.positive : colors.accent}`,
                color: clicked ? colors.positive : "#fff",
                backgroundColor: clicked
                  ? "rgba(48, 209, 88, 0.08)"
                  : colors.accent,
                transform: `scale(${1 + btnHighlight * 0.04 * (clicked ? 0 : 1)})`,
                boxShadow: clicked
                  ? `0 0 16px rgba(48, 209, 88, 0.15)`
                  : btnHighlight > 0.5
                    ? `0 0 16px rgba(255, 68, 0, 0.2)`
                    : "none",
              }}
            >
              {clicked ? "Running" : "Start"}
            </div>
          </div>

          {/* Target repo info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 6,
              backgroundColor: colors.bg,
              border: `1px solid ${colors.borderLight}`,
            }}
          >
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.textTertiary,
                textTransform: "uppercase" as const,
                letterSpacing: "0.12em",
              }}
            >
              Target
            </span>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 15,
                color: colors.text,
                fontWeight: 500,
              }}
            >
              app-factory
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.textTertiary,
              }}
            >
              ~/GitHub/app-factory
            </span>
          </div>

          {/* Progress bar (after click) */}
          {clicked && (
            <div style={{ opacity: terminalSpring }}>
              <div
                style={{
                  height: 3,
                  backgroundColor: colors.borderLight,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    backgroundColor: allDone ? colors.positive : colors.accent,
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Terminal output */}
        {clicked && (
          <div
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              backgroundColor: colors.surface,
              padding: "24px 28px",
              opacity: terminalSpring,
              transform: `translateY(${interpolate(terminalSpring, [0, 1], [10, 0])}px)`,
              minHeight: 280,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                color: colors.textTertiary,
                textTransform: "uppercase" as const,
                letterSpacing: "0.15em",
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: `1px solid ${colors.borderLight}`,
              }}
            >
              Output
            </div>

            {termLines.map(
              (line, i) =>
                line.visible && (
                  <div
                    key={i}
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 15,
                      lineHeight: 1.8,
                      color: line.text.includes("✓")
                        ? colors.positive
                        : line.text.startsWith("  →")
                          ? colors.accent
                          : colors.textMuted,
                      opacity: line.spring,
                      transform: `translateX(${interpolate(line.spring, [0, 1], [-8, 0])}px)`,
                    }}
                  >
                    {line.text}
                  </div>
                )
            )}

            {/* Done badge */}
            {allDone && (
              <div
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px",
                  borderRadius: 5,
                  border: `1px solid rgba(48, 209, 88, 0.2)`,
                  backgroundColor: "rgba(48, 209, 88, 0.04)",
                  opacity: doneSpring,
                  transform: `scale(${interpolate(doneSpring, [0, 1], [0.9, 1])})`,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: colors.positive,
                    boxShadow: `0 0 8px ${colors.positive}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 13,
                    color: colors.positive,
                  }}
                >
                  Ready — opening control deck
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cursor — moves to the Start button on the right side of the card */}
      <AnimatedCursor
        waypoints={[
          [960, 600, Math.round(0.3 * fps)],
          [1370, 495, Math.round(0.9 * fps)],
          [1370, 495, clickFrame],
        ]}
        clickAt={clickFrame}
      />

      {/* Narration */}
      <div style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: narrationSpring,
        transform: `translateY(${interpolate(narrationSpring, [0, 1], [16, 0])}px)`,
      }}>
        <span style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 48,
          color: colors.text,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 1600,
          lineHeight: 1.3,
        }}>
          One command. Every workflow configured.
        </span>
      </div>
    </AbsoluteFill>
  );
};
