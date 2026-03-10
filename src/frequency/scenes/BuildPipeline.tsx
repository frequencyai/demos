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
import { MetricsRibbon } from "../components/MetricsRibbon";

const APPS = [
  { name: "debtmelt", tags: ["finance"] },
  { name: "weekpulse", tags: ["productivity"] },
  { name: "pennyscope", tags: ["finance"] },
];

const STEP_FOR_STAGE: Record<string, string> = {
  selected: "implement",
  implemented: "review",
  ready_for_build: "build",
  built: "seo_check",
  seo_ready: "promote",
  promoted: "complete",
};

/**
 * Scene 6 — Build pipeline as subject table.
 * Rows animate as apps progress through build stages.
 */
export const BuildPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each app progresses through stages
  const getAppStageProgress = (appIndex: number): number => {
    const startDelay = appIndex * 0.35 * fps;
    return interpolate(
      Math.max(0, frame - startDelay),
      [0, 5 * fps],
      [0, BUILD_STAGES.length - 0.01],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
    );
  };

  const getAppStage = (appIndex: number): number => {
    const progress = getAppStageProgress(appIndex);
    const stage = Math.floor(progress);
    const frac = progress - stage;
    if (frac > 0.7 && stage < BUILD_STAGES.length - 1) return stage + 1;
    return stage;
  };

  // Row entry springs
  const rowSprings = APPS.map((_, i) =>
    spring({ frame, fps, delay: Math.round(0.3 * fps + i * 0.15 * fps), config: { damping: 200, stiffness: 120 } })
  );

  const overallProgress = interpolate(frame, [0, 4.8 * fps], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
  });

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

  const promotedCount = APPS.filter((_, i) => getAppStage(i) >= BUILD_STAGES.length - 1).length;

  // State dot color for each app
  const getDotColor = (i: number) => {
    const stage = getAppStage(i);
    if (stage >= BUILD_STAGES.length - 1) return colors.positive;
    return colors.accent;
  };

  // Row flash when reaching promoted
  const getRowFlash = (i: number) => {
    const progress = getAppStageProgress(i);
    const target = BUILD_STAGES.length - 1;
    if (progress >= target - 0.3 && progress <= target + 0.3) {
      return interpolate(progress, [target - 0.3, target, target + 0.3], [0, 0.06, 0]);
    }
    return 0;
  };

  // Per-stage counts for filter bar
  const stageCounts = BUILD_STAGES.map((_, si) =>
    APPS.filter((_, ai) => getAppStage(ai) === si).length
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>

      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1760, height: 840, display: "flex", borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}>
        {/* Sidebar */}
        <div style={{ width: 380, backgroundColor: colors.surface, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", padding: "24px 0" }}>
          <div style={{ padding: "0 24px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none"><path d={LOGO_WAVE_PATH} stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
              <span style={{ fontFamily: fonts.body, fontSize: 19, fontWeight: 700, letterSpacing: "0.08em", color: colors.text }}>FREQUENCY</span>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: colors.accent, boxShadow: `0 0 8px ${colors.accent}` }} />
            </div>
            <div style={{ marginTop: 10, fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary, padding: "7px 10px", border: `1px solid ${colors.accent}`, borderRadius: 3, backgroundColor: colors.bg }}>app-factory</div>
          </div>

          {/* Run / Pause / Stop */}
          <div style={{ padding: "0 24px 8px", display: "flex", gap: 1 }}>
            {[
              { label: "Run", icon: "M2.5 1.5l7 4.5-7 4.5V1.5z", active: true, color: colors.positive },
              { label: "Pause", icon: "M3 1.5h2v9H3zM7 1.5h2v9H7z", active: false, color: colors.textMuted },
              { label: "Stop", icon: "M2.5 2.5h7v7h-7z", active: false, color: colors.textMuted },
            ].map((btn) => (
              <div key={btn.label} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: btn.active ? btn.color : colors.textMuted, border: `1px solid ${btn.active ? btn.color : colors.borderLight}`, backgroundColor: btn.active ? `${btn.color}10` : "transparent", borderRadius: 3 }}>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d={btn.icon} fill="currentColor" /></svg>
                {btn.label}
              </div>
            ))}
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
                  {isBuild && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.accent }}>{promotedCount}/{APPS.length}</span>}
                  {isIdeas && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.positive }}>3/3</span>}
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px", gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>build</h2>
            <p style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent, marginTop: 3 }}>implement, review, build & promote</p>
          </div>

          {/* Pipeline segments bar */}
          <div style={{ display: "flex", gap: 2 }}>
            {BUILD_STAGES.map((stage, i) => {
              const stageFill = getStageFill(i);
              const isTerminal = i === BUILD_STAGES.length - 1;
              const displayCount = Math.round(stageFill);
              const fillFraction = stageFill / APPS.length;
              return (
                <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: fillFraction > 0.01 ? (isTerminal ? colors.positive : colors.accent) : colors.textTertiary }}>{displayCount}</span>
                  <div style={{ width: "100%", height: 4, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${fillFraction * 100}%`, backgroundColor: isTerminal ? colors.positive : colors.accent, borderRadius: 2 }} />
                    {fillFraction > 0.01 && fillFraction < 0.99 && !isTerminal && (
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)", transform: `translateX(${(frame * 3) % 200 - 100}%)`, opacity: 0.4 }} />
                    )}
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{stage.replace(/_/g, " ")}</span>
                </div>
              );
            })}
          </div>

          {/* Metrics ribbon */}
          <MetricsRibbon
            throughput="3"
            failureRate="0%"
            wip={String(APPS.length - promotedCount)}
            leadTime={promotedCount > 0 ? "4m" : "—"}
            terminal={String(3 + promotedCount)}
            retryDlq="0 / 0"
          />

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
            <div style={{ padding: "4px 12px", fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", border: `1px solid ${colors.accent}`, borderRadius: 3, color: colors.accent, backgroundColor: colors.accentLight }}>
              All <span style={{ marginLeft: 4, opacity: 0.7 }}>{APPS.length}</span>
            </div>
            {BUILD_STAGES.map((stage, si) => {
              const count = stageCounts[si];
              const isTerminal = si === BUILD_STAGES.length - 1;
              const isActive = count > 0;
              return (
                <div key={stage} style={{ padding: "4px 10px", fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", border: `1px solid ${isActive ? (isTerminal ? colors.positive : colors.border) : colors.borderLight}`, borderRadius: 3, color: isActive ? (isTerminal ? colors.positive : colors.text) : colors.textTertiary, backgroundColor: "transparent" }}>
                  {stage.replace(/_/g, " ")} {count > 0 && <span style={{ opacity: 0.7 }}>{count}</span>}
                </div>
              );
            })}
          </div>

          {/* Subject table */}
          <div style={{ border: `1px solid ${colors.border}`, overflow: "hidden", flex: 1, backgroundColor: colors.surface }}>
            {/* Header row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1.5fr 1fr 0.8fr 1.5fr",
              padding: "10px 16px",
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              {["Subject", "State", "Step", "Time", "Progress"].map((col, ci) => (
                <span key={col} style={{
                  fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.15em",
                  textTransform: "uppercase" as const, color: colors.textTertiary,
                  textAlign: ci === 0 ? "left" : "center",
                }}>{col}</span>
              ))}
            </div>

            {/* Data rows */}
            {APPS.map((app, i) => {
              const stageIdx = getAppStage(i);
              const stageName = BUILD_STAGES[stageIdx];
              const isTerminal = stageIdx >= BUILD_STAGES.length - 1;
              const step = STEP_FOR_STAGE[stageName] || "—";
              const dotColor = getDotColor(i);
              const rowFlash = getRowFlash(i);
              const progress = (stageIdx + 1) / BUILD_STAGES.length;
              const timeInState = isTerminal ? "4m" : `${Math.max(1, Math.round((stageIdx + 1) * 1.3))}m`;

              return (
                <div
                  key={app.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1.5fr 1fr 0.8fr 1.5fr",
                    padding: "14px 16px",
                    borderBottom: i < APPS.length - 1 ? `1px solid ${colors.borderLight}` : "none",
                    alignItems: "center",
                    opacity: rowSprings[i],
                    transform: `translateX(${interpolate(rowSprings[i], [0, 1], [-20, 0])}px)`,
                    backgroundColor: rowFlash > 0 ? `rgba(48, 209, 88, ${rowFlash})` : "transparent",
                  }}
                >
                  {/* Subject */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontFamily: fonts.body, fontSize: 15, fontWeight: 500, color: colors.text }}>{app.name}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {app.tags.map((t) => (
                        <span key={t} style={{ fontFamily: fonts.mono, fontSize: 9, textTransform: "uppercase" as const, color: colors.textTertiary, border: `1px solid ${colors.borderLight}`, borderRadius: 2, padding: "1px 5px" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* State */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: dotColor, boxShadow: isTerminal ? `0 0 6px ${colors.positive}` : "none", flexShrink: 0 }} />
                    <span style={{ fontFamily: fonts.mono, fontSize: 13, color: isTerminal ? colors.positive : colors.text }}>{stageName.replace(/_/g, " ")}</span>
                  </div>

                  {/* Step */}
                  <span style={{ fontFamily: fonts.mono, fontSize: 12, fontStyle: "italic", color: colors.textMuted, textAlign: "center" }}>{step}</span>

                  {/* Time */}
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textTertiary, textAlign: "center" }}>{timeInState}</span>

                  {/* Progress */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <div style={{ flex: 1, height: 3, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden", maxWidth: 120 }}>
                      <div style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: isTerminal ? colors.positive : colors.accent, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textTertiary, fontVariantNumeric: "tabular-nums" }}>{stageIdx + 1}/{BUILD_STAGES.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Cursor */}
      <AnimatedCursor
        waypoints={[
          [140, 300, 0],
          [800, 400, Math.round(1.2 * fps)],
          [1200, 500, Math.round(promotedStart)],
          [1200, 500, Math.round(promotedStart + 1.5 * fps)],
          [140, 385, sidebarClickFrame],
          [140, 385, sidebarClickFrame + 5],
        ]}
        clickAt={[sidebarClickFrame]}
        hideAfter={SCENE_FRAMES - 5}
      />
      </div>
    </AbsoluteFill>
  );
};
