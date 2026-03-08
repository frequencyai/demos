import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors, fonts, DEPLOY_CHECKLIST, LOGO_WAVE_PATH } from "../theme";
import { AnimatedCursor } from "../components/Cursor";

/**
 * Scene 7 — Deploy checklist inside the dashboard frame.
 * Sidebar shows "deploy" highlighted, checklist items check off with spring physics.
 */
export const DeployChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const SCENE_FRAMES = Math.round(6 * fps);

  // Progress ring — discrete count for text, smooth for ring
  const completedCount = DEPLOY_CHECKLIST.filter((_, i) => {
    const checkFrame = 0.8 * fps + i * 0.4 * fps;
    return frame >= checkFrame;
  }).length;
  const smoothRingProgress = interpolate(
    frame,
    [0.8 * fps, 0.8 * fps + DEPLOY_CHECKLIST.length * 0.4 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Overall completion flash
  const allDone = completedCount === DEPLOY_CHECKLIST.length;
  const doneSpring = allDone
    ? spring({
        frame,
        fps,
        delay: Math.round(0.8 * fps + (DEPLOY_CHECKLIST.length - 1) * 0.4 * fps + 8),
        config: { damping: 10, stiffness: 200 },
      })
    : 0;

  // Sidebar progress
  const sidebarProgress = interpolate(frame, [0, 4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const ringCompleteFrame = 0.8 * fps + DEPLOY_CHECKLIST.length * 0.4 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {/* Scan lines */}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 40 }} />

      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1760, height: 840, display: "flex", borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}>
        {/* Sidebar */}
        <div style={{ width: 380, backgroundColor: colors.surface, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", padding: "24px 0" }}>
          <div style={{ padding: "0 24px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <path d={LOGO_WAVE_PATH} stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: fonts.body, fontSize: 19, fontWeight: 700, letterSpacing: "0.08em", color: colors.text }}>FREQUENCY</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary, padding: "7px 10px", border: `1px solid ${colors.accent}`, borderRadius: 3, backgroundColor: colors.bg }}>app-factory</div>
          </div>

          {["ideas", "build", "deploy", "release-shared", "release", "marketing", "bugjar"].map((name) => {
            const isDeploy = name === "deploy";
            return (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "11px 24px", borderLeft: isDeploy ? `2px solid ${colors.accent}` : "2px solid transparent", backgroundColor: isDeploy ? colors.surfaceHover : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: colors.positive, boxShadow: `0 0 6px ${colors.positive}` }} />
                  <span style={{ fontFamily: fonts.body, fontSize: 16, color: isDeploy ? colors.text : colors.textMuted, fontWeight: isDeploy ? 500 : 400 }}>{name}</span>
                  {isDeploy && (
                    <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.accent }}>
                      {completedCount}/{DEPLOY_CHECKLIST.length}
                    </span>
                  )}
                  {name === "ideas" && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.positive }}>3/3 ✓</span>}
                  {name === "build" && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.positive }}>3/3 ✓</span>}
                </div>
                {isDeploy && (
                  <div style={{ height: 2, backgroundColor: colors.borderLight, borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${sidebarProgress * 100}%`, backgroundColor: sidebarProgress >= 1 ? colors.positive : colors.accent, borderRadius: 1 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px", gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>deploy</h2>
            <p style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent, marginTop: 3 }}>debtmelt · weekpulse · pennyscope</p>
          </div>

          {/* Progress ring + checklist side by side */}
          <div style={{ display: "flex", gap: 48, alignItems: "flex-start", marginTop: 8 }}>
            {/* Left: progress ring */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, minWidth: 120 }}>
              <div style={{ position: "relative", width: 120, height: 120 }}>
                <svg width={120} height={120} viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={colors.borderLight} strokeWidth="4" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={allDone ? colors.positive : colors.accent}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - smoothRingProgress)}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, color: allDone ? colors.positive : colors.text, fontVariantNumeric: "tabular-nums" }}>
                    {completedCount}/{DEPLOY_CHECKLIST.length}
                  </span>
                </div>
              </div>

              {/* Success glow */}
              {allDone && (
                <div style={{
                  fontFamily: fonts.mono, fontSize: 11, color: colors.positive,
                  textTransform: "uppercase" as const, letterSpacing: "0.12em",
                  opacity: doneSpring,
                  transform: `scale(${interpolate(doneSpring, [0, 1], [0.8, 1])})`,
                }}>
                  All checks passed
                </div>
              )}
            </div>

            {/* Right: checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {DEPLOY_CHECKLIST.map((item, i) => {
                const checkFrame = 0.8 * fps + i * 0.4 * fps;

                const itemSpring = spring({
                  frame,
                  fps,
                  delay: Math.round(0.3 * fps + i * 3),
                  config: { damping: 200 },
                });

                const checkSpring = spring({
                  frame,
                  fps,
                  delay: Math.round(checkFrame),
                  config: { damping: 10, stiffness: 220 },
                });
                const checked = checkSpring > 0.01;

                const checkDraw = spring({
                  frame,
                  fps,
                  delay: Math.round(checkFrame + 2),
                  config: { damping: 200 },
                  durationInFrames: Math.round(0.3 * fps),
                });

                return (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      border: `1px solid ${checked ? "rgba(48, 209, 88, 0.15)" : colors.border}`,
                      borderRadius: 7,
                      backgroundColor: checked ? "rgba(48, 209, 88, 0.03)" : colors.surface,
                      opacity: itemSpring,
                      transform: `translateX(${interpolate(itemSpring, [0, 1], [-20, 0])}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 22, height: 22, borderRadius: 5,
                        border: `2px solid ${checked ? colors.positive : colors.border}`,
                        backgroundColor: checked ? `rgba(48, 209, 88, ${0.12 * checkSpring})` : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transform: `scale(${checked ? 0.9 + checkSpring * 0.1 : 1})`,
                      }}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M3 7l3 3 5-6"
                            stroke={colors.positive}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="20"
                            strokeDashoffset={20 * (1 - checkDraw)}
                          />
                        </svg>
                      )}
                    </div>

                    <span style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 500, color: checked ? colors.positive : colors.text, flex: 1 }}>{item}</span>

                    <span style={{ fontFamily: fonts.mono, fontSize: 11, color: checked ? colors.positive : colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.12em", opacity: checked ? 1 : 0.6 }}>
                      {checked ? "done" : "pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Cursor — watches checklist complete, then hides */}
      <AnimatedCursor
        waypoints={[
          [140, 340, 0],
          [800, 350, Math.round(0.8 * fps)],
          [600, 370, Math.round(ringCompleteFrame)],
          [600, 370, Math.round(ringCompleteFrame + 20)],
        ]}
        hideAfter={Math.round(ringCompleteFrame + 30)}
      />
    </AbsoluteFill>
  );
};
