import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { colors, fonts } from "../theme";
import { InfoSlideFrame } from "../components/InfoSlideFrame";

const STEPS = [
  {
    code: "01",
    label: "Your Repo",
    desc: "Existing codebase with patterns worth automating",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
    shipped: false,
  },
  {
    code: "02",
    label: "Analyse",
    desc: "Frequency reads your codebase and identifies workflows",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    shipped: false,
  },
  {
    code: "03",
    label: "Generate Config",
    desc: "YAML state machines stored in your repo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
    shipped: false,
  },
  {
    code: "04",
    label: "Run Pipelines",
    desc: "Agents and scripts execute across parallel workflows",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    shipped: false,
  },
  {
    code: "05",
    label: "Coordinate",
    desc: "Pipelines synchronise through state predicates and locks",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
    shipped: false,
  },
  {
    code: "06",
    label: "Ship",
    desc: "Continuous output, autonomously, at scale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#28c840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    shipped: true,
  },
];

export const ArchitectureFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    delay: Math.round(0.2 * fps),
    config: { damping: 200 },
  });

  // Step springs — staggered left to right
  const stepSprings = STEPS.map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.5 * fps + i * 0.35 * fps),
      config: { damping: 18, stiffness: 140 },
    })
  );

  // Arrow springs — appear slightly after their preceding step
  const arrowSprings = STEPS.slice(0, -1).map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.7 * fps + i * 0.35 * fps),
      config: { damping: 200 },
    })
  );

  // Bracket at bottom
  const bracketSpring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps + 5 * 0.35 * fps + 0.3 * fps),
    config: { damping: 200 },
  });

  return (
    <InfoSlideFrame headerPath={["FREQUENCY_AI", "ARCHITECTURE", "HOW IT WORKS"]}>
      {/* Title */}
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 48,
          color: colors.text,
          letterSpacing: "-0.02em",
          marginBottom: 8,
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [12, 0])}px)`,
        }}
      >
        From Repo to Running Workflow
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 14,
          color: colors.textTertiary,
          letterSpacing: "0.04em",
          marginBottom: 32,
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [8, 0])}px)`,
        }}
      >
        YOUR REPO ALREADY HAS PATTERNS WORTH AUTOMATING
      </div>

      {/* Flow */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
          maxWidth: 1800,
          justifyContent: "center",
        }}
      >
        {STEPS.map((step, i) => (
          <React.Fragment key={i}>
            {/* Step */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
                opacity: stepSprings[i],
                transform: `translateY(${interpolate(stepSprings[i], [0, 1], [16, 0])}px)`,
              }}
            >
              <div
                style={{
                  background: colors.surface,
                  border: `1px solid ${
                    step.shipped
                      ? "rgba(40,200,64,0.3)"
                      : i > 0
                        ? "rgba(255,68,0,0.3)"
                        : colors.border
                  }`,
                  boxSizing: "border-box" as const,
                  padding: "34px 28px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  width: 260,
                  boxShadow: step.shipped
                    ? "0 0 24px rgba(40,200,64,0.08)"
                    : i > 0
                      ? "0 0 24px rgba(255,68,0,0.08)"
                      : "none",
                }}
              >
                {/* Inner corner marks */}
                <div
                  style={{
                    position: "absolute",
                    top: 5,
                    left: 5,
                    width: 6,
                    height: 6,
                    borderStyle: "solid",
                    borderWidth: "1px 0 0 1px",
                    borderColor: step.shipped
                      ? "rgba(40,200,64,0.25)"
                      : "rgba(255,68,0,0.25)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    width: 6,
                    height: 6,
                    borderStyle: "solid",
                    borderWidth: "0 1px 1px 0",
                    borderColor: step.shipped
                      ? "rgba(40,200,64,0.25)"
                      : "rgba(255,68,0,0.25)",
                  }}
                />
                <div style={{ width: 40, height: 40 }}>{step.icon}</div>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 12,
                    color: step.shipped ? "#28c840" : colors.accent,
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                  }}
                >
                  {step.code}
                </span>
                <span
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 800,
                    fontSize: 22,
                    color: colors.text,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: fonts.serif,
                  fontWeight: 300,
                  fontSize: 15,
                  color: colors.textTertiary,
                  textAlign: "center",
                  lineHeight: 1.5,
                  maxWidth: 240,
                  minHeight: 34,
                }}
              >
                {step.desc}
              </span>
            </div>

            {/* Arrow */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  padding: "0 4px",
                  marginTop: 84,
                  opacity: arrowSprings[i],
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 1,
                    background: `linear-gradient(90deg, rgba(255,68,0,0.1), rgba(255,68,0,0.35))`,
                  }}
                />
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: "8px solid rgba(255,68,0,0.35)",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bracket label */}
      <div
        style={{
          marginTop: 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: bracketSpring,
          transform: `translateY(${interpolate(bracketSpring, [0, 1], [8, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 700,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(255,68,0,0.2), rgba(255,68,0,0.3), rgba(255,68,0,0.2), transparent)`,
          }}
        />
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 13,
            color: colors.accent,
            letterSpacing: "0.06em",
            fontWeight: 500,
          }}
        >
          FREQUENCY HANDLES EVERYTHING AFTER YOUR REPO
        </span>
      </div>
    </InfoSlideFrame>
  );
};
