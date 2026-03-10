import React from "react";
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { colors, fonts } from "../theme";
import { InfoSlideFrame } from "../components/InfoSlideFrame";

const CELLS = [
  {
    code: "SYS_01",
    title: "Any Agent",
    desc: "Claude Code, Codex, Cursor, or any CLI tool. A step is just a command. Swap agents without changing the workflow.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    code: "SYS_02",
    title: "Any Workflow",
    desc: "Apps, content pipelines, data processing, release management, research. The runtime doesn't care what the workflow does.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    code: "SYS_03",
    title: "Cross-Pipeline Coordination",
    desc: "Workflows are aware of each other. State predicates and shared resource locks keep pipelines synchronised.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    code: "SYS_04",
    title: "Control Centre",
    desc: "Real-time status, logs per step, fine-grained controls. Observe first, intervene when needed, increase autonomy over time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    code: "SYS_05",
    title: "File-Backed State",
    desc: "Repo-local JSON. No database, no message queue. Inspect everything with git log. Zero infrastructure dependencies.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    code: "SYS_06",
    title: "Auto-Generated Config",
    desc: "Frequency analyses your codebase and generates YAML state machines. Workflows live in your repo alongside your code.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF4400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
];

export const FeatureGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleSpring = spring({
    frame,
    fps,
    delay: Math.round(0.2 * fps),
    config: { damping: 200 },
  });

  // Cell springs — staggered row by row, left to right
  const cellSprings = CELLS.map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.5 * fps + i * 0.18 * fps),
      config: { damping: 18, stiffness: 140 },
    })
  );

  return (
    <InfoSlideFrame headerPath={["FREQUENCY_AI", "CAPABILITIES", "v2.1"]}>
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
          lineHeight: 1.1,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [12, 0])}px)`,
        }}
      >
        Agent orchestration that runs your workflows without you.
      </div>
      <div
        style={{
          fontFamily: fonts.serif,
          fontWeight: 300,
          fontSize: 20,
          color: "#D0D3DC",
          textAlign: "center",
          marginBottom: 32,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [8, 0])}px)`,
        }}
      >
        Define once. Run continuously. At scale.
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: colors.border,
          width: "100%",
          maxWidth: 1700,
        }}
      >
        {CELLS.map((cell, i) => (
          <div
            key={i}
            style={{
              background: colors.surface,
              padding: "44px 40px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: cellSprings[i],
              transform: `scale(${interpolate(cellSprings[i], [0, 1], [0.96, 1])})`,
            }}
          >
            {/* Inner corner marks */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                width: 8,
                height: 8,
                borderStyle: "solid",
                borderWidth: "1px 0 0 1px",
                borderColor: "rgba(255,68,0,0.3)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                width: 8,
                height: 8,
                borderStyle: "solid",
                borderWidth: "0 1px 1px 0",
                borderColor: "rgba(255,68,0,0.3)",
              }}
            />

            <div style={{ width: 32, height: 32, marginBottom: 2 }}>
              {cell.icon}
            </div>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.accent,
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              {cell.code}
            </span>
            <span
              style={{
                fontFamily: fonts.body,
                fontWeight: 800,
                fontSize: 26,
                color: colors.text,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {cell.title}
            </span>
            <span
              style={{
                fontFamily: fonts.serif,
                fontWeight: 300,
                fontSize: 18,
                color: "#D0D3DC",
                lineHeight: 1.6,
              }}
            >
              {cell.desc}
            </span>
          </div>
        ))}
      </div>
    </InfoSlideFrame>
  );
};
