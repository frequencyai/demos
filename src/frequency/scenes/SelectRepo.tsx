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
 * Scene 2 — Dashboard fades in, cursor selects the repo.
 * The whole dashboard "boots up" with a scale/opacity spring,
 * then the cursor flows to the dropdown and selects app-factory.
 */
export const SelectRepo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dashboard boot-up
  const bootSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.8 * fps),
  });
  const bootScale = interpolate(bootSpring, [0, 1], [0.96, 1]);
  const bootOpacity = interpolate(bootSpring, [0, 1], [0, 1]);

  // Dropdown open
  const dropdownSpring = spring({
    frame,
    fps,
    delay: Math.round(1.2 * fps),
    config: { damping: 18, stiffness: 200 },
  });

  // Selection highlight
  const highlightProgress = interpolate(
    frame,
    [1.8 * fps, 2.0 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Dropdown closes
  const closeSpring = spring({
    frame,
    fps,
    delay: Math.round(2.4 * fps),
    config: { damping: 200 },
  });
  const dropdownClosed = frame > 2.6 * fps;
  const selected = frame > 2.2 * fps;

  // "Loading..." pulse after selection
  const loadingPulse =
    selected
      ? interpolate(
          frame % Math.round(fps * 0.8),
          [0, fps * 0.4, fps * 0.8],
          [0.4, 1, 0.4]
        )
      : 0;

  // Narration slide-in
  const narrationSpring = spring({
    frame,
    fps,
    delay: Math.round(0.8 * fps),
    config: { damping: 200 },
  });

  const repos = ["app-factory", "content creation", "growth marketing"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 92,
        overflow: "hidden",
      }}
    >
      {/* Dashboard container with boot animation */}
      <div
        style={{
          width: 1760,
          height: 600,
          display: "flex",
          borderRadius: 14,
          border: `1px solid ${colors.border}`,
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          opacity: bootOpacity,
          transform: `scale(${bootScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 380,
            backgroundColor: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            padding: 24,
            gap: 14,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
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
                fontSize: 18,
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

          {/* Repo selector */}
          <div
            style={{
              padding: "9px 12px",
              border: `1px solid ${selected ? colors.accent : colors.border}`,
              borderRadius: 4,
              fontFamily: fonts.mono,
              fontSize: 13,
              color: selected ? colors.text : colors.textMuted,
              backgroundColor: colors.bg,
              position: "relative",
              transition: "border-color 0.2s",
            }}
          >
            {selected ? "app-factory" : "Select repository..."}
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: `translateY(-50%) rotate(${dropdownSpring * (dropdownClosed ? 0 : 180)}deg)`,
                color: colors.textTertiary,
                fontSize: 8,
              }}
            >
              ▼
            </span>
          </div>

          {/* Dropdown */}
          {dropdownSpring > 0 && !dropdownClosed && (
            <div
              style={{
                position: "absolute",
                top: 118,
                left: 16,
                right: 16,
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                opacity: dropdownSpring * (1 - closeSpring),
                transform: `translateY(${interpolate(dropdownSpring, [0, 1], [-8, 0])}px) scaleY(${dropdownSpring})`,
                transformOrigin: "top center",
                zIndex: 20,
                overflow: "hidden",
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              {repos.map((repo, i) => (
                <div
                  key={repo}
                  style={{
                    padding: "10px 14px",
                    fontFamily: fonts.mono,
                    fontSize: 13,
                    color:
                      repo === "app-factory" && highlightProgress > 0.5
                        ? colors.accent
                        : colors.text,
                    backgroundColor:
                      repo === "app-factory" && highlightProgress > 0
                        ? `rgba(255, 68, 0, ${0.08 * highlightProgress})`
                        : "transparent",
                    borderBottom:
                      i < repos.length - 1
                        ? `1px solid ${colors.borderLight}`
                        : "none",
                  }}
                >
                  {repo}
                </div>
              ))}
            </div>
          )}

          {/* Line placeholders after selection */}
          {selected && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {["ideas", "build", "deploy"].map((name, i) => {
                const lineSpring = spring({
                  frame,
                  fps,
                  delay: Math.round(2.6 * fps + i * 4),
                  config: { damping: 200 },
                });
                return (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 0",
                      opacity: lineSpring,
                      transform: `translateX(${interpolate(lineSpring, [0, 1], [-15, 0])}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: colors.textMuted,
                        opacity: 0.4,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 15,
                        color: colors.textMuted,
                        opacity: loadingPulse,
                      }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 16,
                color: colors.textTertiary,
              }}
            >
              {selected
                ? "Initializing app-factory..."
                : "Select a repository to begin"}
            </p>
            {selected && (
              <div
                style={{
                  width: 120,
                  height: 2,
                  backgroundColor: colors.borderLight,
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${interpolate(frame, [2.4 * fps, 3.2 * fps], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
                    backgroundColor: colors.accent,
                    borderRadius: 1,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cursor */}
      <AnimatedCursor
        waypoints={[
          [960, 540, Math.round(0.3 * fps)],
          [260, 284, Math.round(0.9 * fps)],
          [260, 284, Math.round(1.2 * fps)],
          [260, 314, Math.round(1.8 * fps)],
          [260, 314, Math.round(2.2 * fps)],
        ]}
        clickAt={Math.round(2.2 * fps)}
      />

      {/* Narration */}
      <div style={{
        position: "absolute",
        top: 824,
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
          Point Frequency at any repo. It finds your workflows.
        </span>
      </div>
    </AbsoluteFill>
  );
};
