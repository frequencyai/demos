import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { colors, fonts } from "../theme";
import { InfoSlideFrame } from "../components/InfoSlideFrame";

const BEFORE_ITEMS = [
  "10 terminal tabs open, each running a separate agent",
  "Manually prompting each step, waiting for output, re-prompting on failure",
  "Agents stepping on each other's work, merge conflicts, lost progress",
  "Hoping nothing breaks while you're away from the keyboard",
];

const AFTER_ITEMS: { text: string; highlight?: string }[] = [
  { text: "One command. ", highlight: "Coordinated pipelines running in parallel." },
  { text: "Automatic retries, failure isolation, and ", highlight: "dead-letter review" },
  { text: "WIP limits, resource locks, ", highlight: "git worktree isolation" },
  { highlight: "Shipped while you slept.", text: " New outputs every day." },
];

export const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    delay: Math.round(0.2 * fps),
    config: { damping: 200 },
  });

  // Panel entrance
  const panelSpring = spring({
    frame,
    fps,
    delay: Math.round(0.3 * fps),
    config: { damping: 20, stiffness: 120 },
  });

  // Divider
  const dividerSpring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  // Item springs — before items then after items staggered
  const beforeSprings = BEFORE_ITEMS.map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.6 * fps + i * 0.15 * fps),
      config: { damping: 18, stiffness: 140 },
    })
  );

  const afterSprings = AFTER_ITEMS.map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.7 * fps + i * 0.15 * fps),
      config: { damping: 18, stiffness: 140 },
    })
  );

  const panelBase: React.CSSProperties = {
    padding: "52px 56px",
    display: "flex",
    flexDirection: "column",
    gap: 32,
    position: "relative",
  };

  const cornerMark = (
    top?: number,
    left?: number,
    bottom?: number,
    right?: number,
    bw: string = "1px 0 0 1px",
    color: string = "rgba(234,236,232,0.1)"
  ): React.CSSProperties => ({
    content: '""',
    position: "absolute",
    width: 8,
    height: 8,
    borderStyle: "solid",
    borderWidth: bw,
    borderColor: color,
    ...(top !== undefined && { top }),
    ...(left !== undefined && { left }),
    ...(bottom !== undefined && { bottom }),
    ...(right !== undefined && { right }),
  });

  return (
    <InfoSlideFrame headerPath={["FREQUENCY_AI", "BEFORE / AFTER"]}>
      {/* Title */}
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 44,
          color: colors.text,
          letterSpacing: "-0.02em",
          marginBottom: 6,
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [12, 0])}px)`,
        }}
      >
        Stop prompting. Start orchestrating.
      </div>
      <div
        style={{
          fontFamily: fonts.serif,
          fontWeight: 300,
          fontSize: 20,
          color: "#D0D3DC",
          textAlign: "center",
          marginBottom: 28,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [8, 0])}px)`,
        }}
      >
        The difference between managing agents and letting them manage themselves.
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          width: "100%",
          maxWidth: 1760,
          alignItems: "stretch",
          opacity: panelSpring,
          transform: `translateY(${interpolate(panelSpring, [0, 1], [16, 0])}px)`,
        }}
      >
        {/* BEFORE panel */}
        <div
          style={{
            ...panelBase,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          <div style={cornerMark(8, 8, undefined, undefined, "1px 0 0 1px", "rgba(234,236,232,0.1)")} />
          <div style={cornerMark(undefined, undefined, 8, 8, "0 1px 1px 0", "rgba(234,236,232,0.1)")} />

          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 13,
              letterSpacing: "0.06em",
              fontWeight: 500,
              color: colors.textTertiary,
            }}
          >
            BEFORE
          </span>
          <h2
            style={{
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "-0.02em",
              color: colors.textTertiary,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Manual agent prompting
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {BEFORE_ITEMS.map((text, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  opacity: beforeSprings[i],
                  transform: `translateX(${interpolate(beforeSprings[i], [0, 1], [-10, 0])}px)`,
                }}
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#A8ADBA"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  style={{ flexShrink: 0, marginTop: 4 }}
                >
                  {i === 0 && (
                    <>
                      <rect x="2" y="2" width="12" height="12" rx="1.5" />
                      <line x1="5" y1="6" x2="11" y2="6" />
                      <line x1="5" y1="8.5" x2="9" y2="8.5" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <path d="M8 1v6l4 2" />
                      <circle cx="8" cy="8" r="7" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <path d="M12 8H4M8 4v8" />
                      <circle cx="8" cy="8" r="7" />
                    </>
                  )}
                  {i === 3 && <path d="M2 14l4-4M6.5 6.5l3 3M10 2l4 4" />}
                </svg>
                <span
                  style={{
                    fontFamily: fonts.serif,
                    fontWeight: 300,
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: colors.textTertiary,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            gap: 12,
            opacity: dividerSpring,
          }}
        >
          <div
            style={{
              width: 1,
              flex: 1,
              background: `linear-gradient(to bottom, transparent, rgba(255,68,0,0.3), transparent)`,
            }}
          />
          <div
            style={{
              width: 44,
              height: 44,
              background: colors.bg,
              border: `1px solid rgba(255,68,0,0.3)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              stroke={colors.accent}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="8 4 14 10 8 16" />
            </svg>
          </div>
          <div
            style={{
              width: 1,
              flex: 1,
              background: `linear-gradient(to bottom, transparent, rgba(255,68,0,0.3), transparent)`,
            }}
          />
        </div>

        {/* AFTER panel */}
        <div
          style={{
            ...panelBase,
            background: colors.surface,
            border: `1px solid rgba(255,68,0,0.15)`,
            boxShadow: `0 0 40px rgba(255,68,0,0.04), inset 0 0 20px rgba(255,68,0,0.02)`,
          }}
        >
          <div style={cornerMark(8, 8, undefined, undefined, "1px 0 0 1px", "rgba(255,68,0,0.35)")} />
          <div style={cornerMark(undefined, undefined, 8, 8, "0 1px 1px 0", "rgba(255,68,0,0.35)")} />

          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 13,
              letterSpacing: "0.06em",
              fontWeight: 500,
              color: colors.accent,
            }}
          >
            WITH FREQUENCY
          </span>
          <h2
            style={{
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "-0.02em",
              color: colors.text,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Autonomous orchestration
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {AFTER_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  opacity: afterSprings[i],
                  transform: `translateX(${interpolate(afterSprings[i], [0, 1], [10, 0])}px)`,
                }}
              >
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  style={{ flexShrink: 0, marginTop: 4 }}
                >
                  <polyline points="4 8 7 11 12 5" />
                </svg>
                <span
                  style={{
                    fontFamily: fonts.serif,
                    fontWeight: 300,
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "#D0D3DC",
                  }}
                >
                  {item.text}
                  {item.highlight && (
                    <span style={{ color: colors.accent, fontWeight: 400 }}>
                      {item.highlight}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InfoSlideFrame>
  );
};
