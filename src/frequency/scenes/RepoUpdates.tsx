import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors, fonts } from "../theme";

const FILE_TREE = [
  { path: "apps/", type: "dir" as const },
  { path: "  implemented/", type: "dir" as const },
  { path: "    debtmelt/", type: "new-dir" as const },
  { path: "      index.html", type: "new" as const },
  { path: "      app.js", type: "new" as const },
  { path: "      styles.css", type: "new" as const },
  { path: "    weekpulse/", type: "new-dir" as const },
  { path: "      index.html", type: "new" as const },
  { path: "      app.js", type: "new" as const },
  { path: "    pennyscope/", type: "new-dir" as const },
  { path: "      index.html", type: "new" as const },
  { path: "      app.js", type: "new" as const },
  { path: "  hub/", type: "dir" as const },
  { path: "    index.html", type: "modified" as const },
  { path: "database/", type: "dir" as const },
  { path: "  migrations/", type: "dir" as const },
  { path: "    015_debtmelt.sql", type: "new" as const },
  { path: "    016_weekpulse.sql", type: "new" as const },
];

/**
 * Scene 7 — Repo file tree with spring-animated rows.
 * New files glow green as they appear, git-style diff indicators.
 */
export const RepoUpdates: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.5 * fps),
  });

  // Summary counters animate
  const filesAdded = Math.min(
    11,
    Math.floor(
      interpolate(frame, [0.4 * fps, 2.5 * fps], [0, 11], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

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
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 10 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 840 }}>
        {/* Header */}
        <div style={{ opacity: headerSpring, transform: `translateY(${interpolate(headerSpring, [0, 1], [15, 0])}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill={colors.accent}>
              <path d="M15.698 7.287L8.712.302a1.03 1.03 0 00-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 011.55 1.56l1.773 1.774a1.224 1.224 0 11-.733.69L8.56 5.94v4.286a1.224 1.224 0 11-1.006-.014V5.871a1.224 1.224 0 01-.664-1.605L5.08 2.456.302 7.234a1.03 1.03 0 000 1.457l6.986 6.986a1.03 1.03 0 001.457 0l6.953-6.953a1.03 1.03 0 000-1.457z" />
            </svg>
            <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>app-factory</h2>
          </div>

          {/* Git stats bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: fonts.mono, fontSize: 14 }}>
            <span style={{ color: colors.positive }}>+{filesAdded} added</span>
            <span style={{ color: colors.warning }}>~1 modified</span>
            <span style={{ color: colors.textTertiary }}>3 apps promoted</span>
          </div>
        </div>

        {/* File tree */}
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            backgroundColor: colors.surface,
            overflow: "hidden",
          }}
        >
          {FILE_TREE.map((file, i) => {
            const rowSpring = spring({
              frame,
              fps,
              delay: Math.round(0.3 * fps + i * 2.5),
              config: { damping: 200 },
            });

            const isNew = file.type === "new" || file.type === "new-dir";
            const isModified = file.type === "modified";

            // Green glow flash for new files
            const glowIntensity =
              isNew
                ? interpolate(
                    frame - (0.3 * fps + i * 2.5),
                    [0, 8, 20],
                    [0, 0.12, 0.03],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )
                : 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 18px",
                  borderBottom: i < FILE_TREE.length - 1 ? `1px solid ${colors.borderLight}` : "none",
                  opacity: rowSpring,
                  transform: `translateX(${interpolate(rowSpring, [0, 1], [-12, 0])}px)`,
                  backgroundColor: isNew
                    ? `rgba(48, 209, 88, ${glowIntensity})`
                    : isModified
                      ? "rgba(217, 168, 58, 0.03)"
                      : "transparent",
                }}
              >
                {/* File indicator */}
                {isNew && (
                  <div style={{ width: 3, height: 14, borderRadius: 1, backgroundColor: colors.positive, opacity: 0.8 }} />
                )}
                {isModified && (
                  <div style={{ width: 3, height: 14, borderRadius: 1, backgroundColor: colors.warning, opacity: 0.8 }} />
                )}
                {!isNew && !isModified && <div style={{ width: 3 }} />}

                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  color: isNew ? colors.positive : isModified ? colors.warning : colors.textMuted,
                  whiteSpace: "pre",
                  flex: 1,
                }}>
                  {file.path}
                </span>

                {isNew && (
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.positive, textTransform: "uppercase" as const, letterSpacing: "0.1em", opacity: 0.8 }}>new</span>
                )}
                {isModified && (
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.warning, textTransform: "uppercase" as const, letterSpacing: "0.1em", opacity: 0.8 }}>mod</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
