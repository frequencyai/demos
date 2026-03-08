import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, LINES } from "../theme";
import { FrequencyLogo } from "./Logo";

// ── Sidebar Line Item ──────────────────────────────────────────

export const LineItem: React.FC<{
  name: string;
  running?: boolean;
  progress?: number; // 0-1
  count?: string; // e.g. "3/5"
  highlighted?: boolean;
  delayFrames?: number;
}> = ({
  name,
  running = false,
  progress = 0,
  count,
  highlighted = false,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delayFrames);
  const opacity = interpolate(localFrame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slideX = interpolate(localFrame, [0, 0.3 * fps], [-20, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "8px 16px",
        opacity,
        transform: `translateX(${slideX}px)`,
        backgroundColor: highlighted ? colors.surfaceHover : "transparent",
        borderLeft: highlighted ? `2px solid ${colors.accent}` : "2px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Status dot */}
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: running ? colors.positive : colors.textMuted,
            opacity: running ? 1 : 0.4,
            boxShadow: running
              ? `0 0 6px ${colors.positive}, 0 0 12px rgba(48, 209, 88, 0.3)`
              : "none",
          }}
        />
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 13,
            fontWeight: 450,
            color: colors.text,
          }}
        >
          {name}
        </span>
        {count && (
          <span
            style={{
              marginLeft: "auto",
              fontFamily: fonts.mono,
              fontSize: 10,
              color: colors.textTertiary,
            }}
          >
            {count}
          </span>
        )}
      </div>
      {/* Progress bar */}
      <div
        style={{
          height: 1,
          width: "100%",
          backgroundColor: colors.borderLight,
          borderRadius: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            backgroundColor: progress >= 1 ? colors.positive : colors.text,
            borderRadius: 1,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
};

// ── Sidebar ────────────────────────────────────────────────────

export const Sidebar: React.FC<{
  repoName?: string;
  lines?: {
    name: string;
    running?: boolean;
    progress?: number;
    count?: string;
    highlighted?: boolean;
  }[];
  showRunButton?: boolean;
  runButtonHighlighted?: boolean;
  children?: React.ReactNode;
}> = ({
  repoName = "app-factory",
  lines = [],
  showRunButton = true,
  runButtonHighlighted = false,
  children,
}) => {
  return (
    <div
      style={{
        width: 260,
        height: "100%",
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 16px 12px" }}>
        <FrequencyLogo animate={false} />
        {/* Repo selector */}
        <div
          style={{
            marginTop: 12,
            padding: "6px 10px",
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.textMuted,
            backgroundColor: colors.bg,
          }}
        >
          {repoName}
        </div>
      </div>

      {/* Action buttons */}
      {showRunButton && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "0 16px 12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              border: `1px solid ${runButtonHighlighted ? colors.accent : colors.border}`,
              borderRadius: 4,
              fontFamily: fonts.mono,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              color: runButtonHighlighted ? colors.accent : colors.textMuted,
              backgroundColor: runButtonHighlighted
                ? colors.accentLight
                : "transparent",
              letterSpacing: "0.05em",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 1.5l7 4.5-7 4.5V1.5z"
                fill="currentColor"
              />
            </svg>
            Run All
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              border: `1px solid ${colors.border}`,
              borderRadius: 4,
              fontFamily: fonts.mono,
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              color: colors.textMuted,
              letterSpacing: "0.05em",
            }}
          >
            Pause All
          </div>
        </div>
      )}

      {/* Lines */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {lines.map((line, i) => (
          <LineItem key={line.name} {...line} delayFrames={i * 4} />
        ))}
      </div>

      {children}
    </div>
  );
};

// ── Subject Card ───────────────────────────────────────────────

export const SubjectCard: React.FC<{
  title: string;
  state?: string;
  score?: number;
  tags?: string[];
  progress?: number; // 0-1
  progressLabel?: string;
  delayFrames?: number;
}> = ({
  title,
  state,
  score,
  tags = [],
  progress = 0,
  progressLabel,
  delayFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - delayFrames);
  const opacity = interpolate(localFrame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slideY = interpolate(localFrame, [0, 0.3 * fps], [15, 0], {
    extrapolateRight: "clamp",
  });

  const scoreColor =
    score !== undefined
      ? score >= 90
        ? colors.positive
        : score >= 70
          ? colors.text
          : score >= 50
            ? colors.warning
            : colors.danger
      : colors.textMuted;

  return (
    <div
      style={{
        padding: "10px 12px",
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        backgroundColor: colors.surface,
        opacity,
        transform: `translateY(${slideY}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 14,
            fontWeight: 500,
            color: colors.text,
            flex: 1,
          }}
        >
          {title}
        </span>
        {score !== undefined && (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              fontWeight: 500,
              color: scoreColor,
              border: `1px solid ${scoreColor}`,
              borderRadius: 3,
              padding: "1px 6px",
            }}
          >
            {score}/100
          </span>
        )}
      </div>

      {/* State */}
      {state && (
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            color: colors.textTertiary,
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
          }}
        >
          {state}
        </span>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: fonts.mono,
                fontSize: 9,
                textTransform: "uppercase" as const,
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
                borderRadius: 3,
                padding: "1px 6px",
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {progress > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              flex: 1,
              height: 3,
              backgroundColor: colors.borderLight,
              borderRadius: 2,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(progress, 1) * 100}%`,
                backgroundColor:
                  progress >= 1 ? colors.positive : colors.accent,
                borderRadius: 2,
              }}
            />
          </div>
          {progressLabel && (
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 9,
                color: colors.textTertiary,
              }}
            >
              {progressLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ── Board Column ───────────────────────────────────────────────

export const BoardColumn: React.FC<{
  title: string;
  count?: number;
  accentColor?: string;
  children?: React.ReactNode;
}> = ({ title, count = 0, accentColor, children }) => {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 180,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingBottom: 8,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            fontWeight: 600,
            textTransform: "uppercase" as const,
            letterSpacing: "0.15em",
            color: accentColor || colors.textTertiary,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 10,
            color: colors.textTertiary,
          }}
        >
          {count}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </div>
  );
};

// ── Dashboard Shell ────────────────────────────────────────────

export const DashboardShell: React.FC<{
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
}> = ({ children, sidebar }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.bg,
        display: "flex",
        position: "relative",
      }}
    >
      {/* Corner marks */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderTop: `1px solid ${colors.accent}`,
          borderLeft: `1px solid ${colors.accent}`,
          opacity: 0.5,
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 12,
          height: 12,
          borderTop: `1px solid ${colors.accent}`,
          borderRight: `1px solid ${colors.accent}`,
          opacity: 0.5,
          zIndex: 50,
        }}
      />

      {/* CRT scan lines */}
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

      {sidebar}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
