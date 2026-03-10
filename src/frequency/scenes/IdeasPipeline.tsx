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
import { MetricsRibbon } from "../components/MetricsRibbon";

const IDEA_APPS = [
  { name: "debtmelt", score: "92/100", tier: "A" as const, tags: ["finance", "saas"], desc: "Debt snowball calculator" },
  { name: "weekpulse", score: "87/100", tier: "B" as const, tags: ["productivity"], desc: "Weekly review dashboard" },
  { name: "pennyscope", score: "84/100", tier: "B" as const, tags: ["finance", "tracker"], desc: "Expense insight engine" },
];

const STATES = ["ready", "generated", "validated"] as const;

const TIER_COLORS: Record<string, string> = {
  A: colors.positive,
  B: colors.text,
  C: "#d9a83a",
  D: colors.danger,
};

/**
 * Scene 5 — Ideas pipeline with subject table.
 * Rows spring in, states transition from generated → validated with smooth animations.
 */
export const IdeasPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pipeline bar progress
  const barProgress = interpolate(frame, [0.3 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad),
  });

  // Row entry springs (staggered)
  const rowSprings = IDEA_APPS.map((_, i) =>
    spring({ frame, fps, delay: Math.round(0.6 * fps + i * 0.2 * fps), config: { damping: 200, stiffness: 120 } })
  );

  // Validation moment — state transitions
  const validationStart = 3.2 * fps;
  const validationSprings = IDEA_APPS.map((_, i) =>
    spring({ frame, fps, delay: Math.round(validationStart + i * 0.3 * fps), config: { damping: 18, stiffness: 140 } })
  );

  // Sidebar progress
  const sidebarProgress = interpolate(frame, [0, 4.5 * fps], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
  });

  const terminalCount = validationSprings.filter((s) => s > 0.5).length;
  const generatedCount = rowSprings.filter((s) => s > 0.5).length - terminalCount;

  // Narration slide-in
  const narrationSpring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  const SCENE_FRAMES = Math.round(7 * fps);
  const sidebarClickFrame = SCENE_FRAMES - 35;

  // Per-app computed state
  const getAppState = (i: number) => {
    if (validationSprings[i] > 0.5) return "validated";
    if (rowSprings[i] > 0.5) return "generated";
    return "ready";
  };

  const getStep = (i: number) => {
    const s = getAppState(i);
    if (s === "validated") return "complete";
    if (s === "generated") return "evaluate";
    return "queue";
  };

  const getTimeInState = (i: number): string => {
    const s = getAppState(i);
    if (s === "validated") return "2m";
    if (s === "generated") {
      const t = Math.max(1, Math.round((frame - (0.6 * fps + i * 0.2 * fps)) / fps));
      return `${Math.min(t, 5)}m`;
    }
    return "—";
  };

  // State dot color interpolation
  const getDotColor = (i: number) => {
    if (validationSprings[i] > 0.01) {
      return `rgb(${Math.round(interpolate(validationSprings[i], [0, 1], [255, 48]))}, ${Math.round(interpolate(validationSprings[i], [0, 1], [68, 209]))}, ${Math.round(interpolate(validationSprings[i], [0, 1], [0, 88]))})`;
    }
    if (rowSprings[i] > 0.5) return colors.accent;
    return colors.textMuted;
  };

  // Row flash on state transition
  const getRowFlash = (i: number) => {
    const v = validationSprings[i];
    if (v > 0.1 && v < 0.9) return interpolate(v, [0.1, 0.4, 0.6, 0.9], [0, 0.06, 0.06, 0]);
    return 0;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>

      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", paddingBottom: 92 }}>
      <div style={{ width: 1760, height: 600, display: "flex", borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}>
        {/* Sidebar */}
        <div style={{ width: 380, backgroundColor: colors.surface, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", padding: "24px 0 20px" }}>
          <div style={{ padding: "0 24px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <path d={LOGO_WAVE_PATH} stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
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

          {/* Lines */}
          {["ideas", "build", "deploy", "release-shared", "release", "marketing", "seo", "bugjar", "self-improvement"].map((name) => {
            const isIdeas = name === "ideas";
            const isBuild = name === "build";
            const highlighted = (isIdeas && frame <= sidebarClickFrame) || (isBuild && frame > sidebarClickFrame);
            return (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "11px 24px", borderLeft: highlighted ? `2px solid ${colors.accent}` : "2px solid transparent", backgroundColor: highlighted ? colors.surfaceHover : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: colors.positive, boxShadow: `0 0 6px ${colors.positive}` }} />
                  <span style={{ fontFamily: fonts.body, fontSize: 16, color: isIdeas ? colors.text : colors.textMuted, fontWeight: isIdeas ? 500 : 400 }}>{name}</span>
                  {isIdeas && <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.accent }}>{terminalCount}/{IDEA_APPS.length}</span>}
                </div>
                {isIdeas && (
                  <div style={{ height: 2, backgroundColor: colors.borderLight, borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${sidebarProgress * 100}%`, backgroundColor: sidebarProgress >= 1 ? colors.positive : colors.accent, borderRadius: 1 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px", gap: 12 }}>
          {/* Header */}
          <div>
            <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>ideas</h2>
            <p style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent, marginTop: 3 }}>generating & evaluating app ideas</p>
          </div>

          {/* Pipeline segments bar */}
          <div style={{ display: "flex", gap: 3 }}>
            {STATES.map((stage, i) => {
              const stageProgress = i === 0 ? barProgress : i === 1
                ? interpolate(frame, [1.2 * fps, 2.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) })
                : interpolate(frame, [validationStart, validationStart + 1.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
              const count = stage === "validated" ? terminalCount : stage === "generated" ? generatedCount : 0;
              return (
                <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 18, fontWeight: 700, color: stageProgress > 0.5 ? (stage === "validated" ? colors.positive : colors.accent) : colors.textTertiary, fontVariantNumeric: "tabular-nums" }}>{Math.max(0, count)}</span>
                  <div style={{ width: "100%", height: 4, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${stageProgress * 100}%`, backgroundColor: stage === "validated" ? colors.positive : colors.accent, borderRadius: 2 }} />
                    {stageProgress > 0 && stageProgress < 1 && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)", transform: `translateX(${(frame * 3) % 200 - 100}%)`, opacity: 0.5 }} />
                    )}
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{stage}</span>
                </div>
              );
            })}
          </div>

          {/* Metrics ribbon */}
          <MetricsRibbon
            throughput="0"
            failureRate="0%"
            wip={String(IDEA_APPS.length - terminalCount)}
            leadTime={terminalCount > 0 ? "2m" : "—"}
            terminal={String(terminalCount)}
            retryDlq="0 / 0"
          />

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
            <div style={{ padding: "4px 12px", fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", border: `1px solid ${colors.accent}`, borderRadius: 3, color: colors.accent, backgroundColor: colors.accentLight }}>
              All <span style={{ marginLeft: 4, opacity: 0.7 }}>{IDEA_APPS.length}</span>
            </div>
            {STATES.filter((s) => s !== "ready").map((state) => {
              const count = state === "validated" ? terminalCount : state === "generated" ? generatedCount : 0;
              const isActive = count > 0;
              return (
                <div key={state} style={{ padding: "4px 12px", fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", border: `1px solid ${isActive ? (state === "validated" ? colors.positive : colors.border) : colors.borderLight}`, borderRadius: 3, color: isActive ? (state === "validated" ? colors.positive : colors.text) : colors.textTertiary, backgroundColor: "transparent" }}>
                  {state} {count > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>{count}</span>}
                </div>
              );
            })}
          </div>

          {/* Subject table */}
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: 0, overflow: "hidden", flex: 1, backgroundColor: colors.surface }}>
            {/* Header row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1fr 0.7fr 0.7fr 1.5fr",
              padding: "10px 16px",
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              {["Subject", "State", "Step", "Score", "Time", "Progress"].map((col, ci) => (
                <span key={col} style={{
                  fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.15em",
                  textTransform: "uppercase" as const, color: colors.textTertiary,
                  textAlign: ci === 0 ? "left" : "center",
                }}>{col}</span>
              ))}
            </div>

            {/* Data rows */}
            {IDEA_APPS.map((app, i) => {
              const appState = getAppState(i);
              const step = getStep(i);
              const dotColor = getDotColor(i);
              const isTerminal = appState === "validated";
              const rowFlash = getRowFlash(i);
              const stageIdx = isTerminal ? 3 : appState === "generated" ? 2 : 0;
              const progress = stageIdx / 3;

              return (
                <div
                  key={app.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.2fr 1fr 0.7fr 0.7fr 1.5fr",
                    padding: "12px 16px",
                    borderBottom: i < IDEA_APPS.length - 1 ? `1px solid ${colors.borderLight}` : "none",
                    alignItems: "center",
                    opacity: rowSprings[i],
                    transform: `translateX(${interpolate(rowSprings[i], [0, 1], [-20, 0])}px)`,
                    backgroundColor: rowFlash > 0 ? `rgba(48, 209, 88, ${rowFlash})` : "transparent",
                  }}
                >
                  {/* Subject */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontFamily: fonts.body, fontSize: 15, fontWeight: 500, color: colors.text }}>{app.name}</span>
                    <span style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textTertiary }}>{app.desc}</span>
                  </div>

                  {/* State */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: dotColor, boxShadow: isTerminal ? `0 0 6px ${colors.positive}` : "none", flexShrink: 0 }} />
                    <span style={{ fontFamily: fonts.mono, fontSize: 13, color: isTerminal ? colors.positive : colors.text }}>{appState}</span>
                  </div>

                  {/* Step */}
                  <span style={{ fontFamily: fonts.mono, fontSize: 12, fontStyle: "italic", color: colors.textMuted, textAlign: "center" }}>{step}</span>

                  {/* Score */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 10, fontWeight: 600,
                      padding: "2px 8px", borderRadius: 3,
                      color: TIER_COLORS[app.tier],
                      border: `1px solid ${TIER_COLORS[app.tier]}`,
                      backgroundColor: app.tier === "A" ? "rgba(48, 209, 88, 0.08)" : "transparent",
                    }}>{app.score}</span>
                  </div>

                  {/* Time */}
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textTertiary, textAlign: "center" }}>{getTimeInState(i)}</span>

                  {/* Progress */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                    <div style={{ flex: 1, height: 3, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden", maxWidth: 100 }}>
                      <div style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: isTerminal ? colors.positive : colors.accent, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textTertiary, fontVariantNumeric: "tabular-nums" }}>{stageIdx}/3</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Cursor */}
      <AnimatedCursor
        waypoints={[
          [140, 331, 0],
          [800, 474, Math.round(1.5 * fps)],
          [1100, 574, Math.round(validationStart)],
          [1100, 574, Math.round(validationStart + 1.5 * fps)],
          [140, 414, sidebarClickFrame],
          [140, 414, sidebarClickFrame + 5],
        ]}
        clickAt={[sidebarClickFrame]}
        hideAfter={SCENE_FRAMES - 5}
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
          Define once. Run continuously. At scale.
        </span>
      </div>
    </AbsoluteFill>
  );
};
