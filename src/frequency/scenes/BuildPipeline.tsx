import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from "remotion";
import { colors, fonts, BUILD_STAGES, LOGO_WAVE_PATH } from "../theme";
import { AnimatedCursor } from "../components/Cursor";


const APPS = [
  { name: "debtmelt", tags: ["finance"] },
  { name: "weekpulse", tags: ["productivity"] },
  { name: "pennyscope", tags: ["finance"] },
];

/**
 * Scene 5 — Build pipeline. Cards flow through stages like a conveyor belt.
 * Each stage lights up as cards pass through. Smooth spring physics.
 */
export const BuildPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each app progresses through stages with spring-eased movement
  const getAppStageProgress = (appIndex: number): number => {
    const startDelay = appIndex * 0.35 * fps;
    return interpolate(
      Math.max(0, frame - startDelay),
      [0, 5 * fps],
      [0, BUILD_STAGES.length - 0.01],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
    );
  };

  // Staircase function: hold each stage for a dwell period before jumping
  // This prevents jitter by snapping to stages with hysteresis
  const getAppStage = (appIndex: number): number => {
    const progress = getAppStageProgress(appIndex);
    const stage = Math.floor(progress);
    const frac = progress - stage;
    // Only advance to next stage when progress is >70% through current stage
    // This creates a clean hold-then-snap behavior
    if (frac > 0.7 && stage < BUILD_STAGES.length - 1) {
      return stage + 1;
    }
    return stage;
  };

  // Get opacity for a card in a given column (cross-fade during transitions)
  const getCardOpacityInStage = (appIndex: number, stageIndex: number): number => {
    const progress = getAppStageProgress(appIndex);
    const currentStage = getAppStage(appIndex);
    if (currentStage !== stageIndex) return 0;
    // Fade in when entering, fade out when leaving
    const frac = progress - Math.floor(progress);
    if (Math.floor(progress) === stageIndex) {
      // In the stage based on floor — fade out as we approach threshold
      if (frac > 0.6) return interpolate(frac, [0.6, 0.7], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return 1;
    }
    // Just entered via threshold — fade in
    if (frac > 0.7) return interpolate(frac, [0.7, 0.85], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return 1;
  };

  // Overall sidebar progress
  const overallProgress = interpolate(frame, [0, 4.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Continuous fill for each stage (smooth bar progression)
  const getStageFill = (stageIndex: number): number => {
    return APPS.reduce((sum, _, ai) => {
      const progress = getAppStageProgress(ai);
      if (progress >= stageIndex + 1) return sum + 1;
      if (progress >= stageIndex) return sum + (progress - stageIndex);
      return sum;
    }, 0);
  };

  const SCENE_FRAMES = Math.round(8 * fps);
  const sidebarClickFrame = SCENE_FRAMES - 35;
  const promotedStart = 3.5 * fps;

  // Visible stages (condensed)
  const visibleStages = [
    { key: "selected", index: 0 },
    { key: "implemented", index: 1 },
    { key: "built", index: 3 },
    { key: "promoted", index: 5 },
  ];

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
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none"><path d={LOGO_WAVE_PATH} stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: fonts.body, fontSize: 19, fontWeight: 700, letterSpacing: "0.08em", color: colors.text }}>FREQUENCY</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary, padding: "7px 10px", border: `1px solid ${colors.accent}`, borderRadius: 3, backgroundColor: colors.bg }}>app-factory</div>
          </div>
          {["ideas", "build", "deploy", "release-shared", "release", "marketing", "bugjar"].map((name) => {
            const isBuild = name === "build";
            const isDeploy = name === "deploy";
            const isIdeas = name === "ideas";
            const deployClicked = frame > sidebarClickFrame;
            const isActive = (isBuild && !deployClicked) || (isDeploy && deployClicked);
            return (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "11px 24px", borderLeft: isActive ? `2px solid ${colors.accent}` : "2px solid transparent", backgroundColor: isActive ? colors.surfaceHover : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: colors.positive, boxShadow: `0 0 6px ${colors.positive}` }} />
                  <span style={{ fontFamily: fonts.body, fontSize: 16, color: isBuild ? colors.text : colors.textMuted, fontWeight: isBuild ? 500 : 400 }}>{name}</span>
                  {isBuild && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.accent }}>{APPS.filter((_, i) => getAppStage(i) >= BUILD_STAGES.length - 1).length}/{APPS.length}</span>}
                  {isIdeas && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.positive }}>3/3 ✓</span>}
                </div>
                {isBuild && (
                  <div style={{ height: 2, backgroundColor: colors.borderLight, borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${overallProgress * 100}%`, backgroundColor: overallProgress >= 1 ? colors.positive : colors.accent, borderRadius: 1 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px", gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>build</h2>
            <p style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent, marginTop: 3 }}>implement, review, build & promote</p>
          </div>

          {/* Full pipeline bar */}
          <div style={{ display: "flex", gap: 2 }}>
            {BUILD_STAGES.map((stage, i) => {
              const stageFill = getStageFill(i);
              const isTerminal = i === BUILD_STAGES.length - 1;
              const displayCount = Math.round(stageFill);
              const fillFraction = stageFill / APPS.length;

              return (
                <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: fillFraction > 0.01 ? (isTerminal ? colors.positive : colors.accent) : colors.text }}>{displayCount}</span>
                  <div style={{ width: "100%", height: 6, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${fillFraction * 100}%`, backgroundColor: isTerminal ? colors.positive : colors.accent, borderRadius: 2 }} />
                    {fillFraction > 0.01 && fillFraction < 0.99 && !isTerminal && (
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)", transform: `translateX(${(frame * 3) % 200 - 100}%)`, opacity: 0.4 }} />
                    )}
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{stage.replace(/_/g, " ")}</span>
                </div>
              );
            })}
          </div>

          {/* Card columns */}
          <div style={{ display: "flex", gap: 14, marginTop: 8, flex: 1 }}>
            {visibleStages.map(({ key, index }) => {
              const isTerminal = key === "promoted";
              const appsHere = APPS.map((app, ai) => ({
                ...app,
                ai,
                inStage: getAppStage(ai) === index,
                stageProgress: getAppStageProgress(ai),
                fadeOpacity: getCardOpacityInStage(ai, index),
              })).filter((a) => a.inStage);

              return (
                <div key={key} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 6, borderBottom: `1px solid ${isTerminal ? "rgba(48, 209, 88, 0.2)" : colors.border}` }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: isTerminal ? colors.positive : colors.textTertiary }}>{key.replace(/_/g, " ")}</span>
                    <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textTertiary }}>{appsHere.length}</span>
                  </div>

                  {appsHere.map((app) => {
                    const cardSpring = spring({ frame, fps, delay: Math.round(app.ai * 0.35 * fps + index * 0.3 * fps), config: { damping: 200, stiffness: 160 } });
                    return (
                      <div key={app.name} style={{
                        padding: "10px 12px", border: `1px solid ${isTerminal ? "rgba(48, 209, 88, 0.15)" : colors.border}`, borderRadius: 7,
                        backgroundColor: isTerminal ? "rgba(48, 209, 88, 0.03)" : colors.surface,
                        transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`, opacity: cardSpring * app.fadeOpacity,
                        display: "flex", flexDirection: "column", gap: 5,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {isTerminal && (
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-6" stroke={colors.positive} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                          <span style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 500, color: colors.text }}>{app.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: 3 }}>
                          {app.tags.map((t) => (
                            <span key={t} style={{ fontFamily: fonts.mono, fontSize: 10, textTransform: "uppercase" as const, color: colors.textTertiary, border: `1px solid ${colors.borderLight}`, borderRadius: 2, padding: "1px 5px" }}>{t}</span>
                          ))}
                        </div>
                        {/* Stage progress bar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ flex: 1, height: 3, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${((index + 1) / BUILD_STAGES.length) * 100}%`, backgroundColor: isTerminal ? colors.positive : colors.accent, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textTertiary }}>{index + 1}/{BUILD_STAGES.length}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Cursor — drifts to content, then clicks "deploy" sidebar */}
      <AnimatedCursor
        waypoints={[
          [140, 300, 0],
          [800, 350, Math.round(1.2 * fps)],
          [1200, 400, Math.round(promotedStart)],
          [1200, 400, Math.round(promotedStart + 1.5 * fps)],
          [140, 340, sidebarClickFrame],
          [140, 340, sidebarClickFrame + 5],
        ]}
        clickAt={[sidebarClickFrame]}
        hideAfter={SCENE_FRAMES - 5}
      />
      </div>
    </AbsoluteFill>
  );
};
