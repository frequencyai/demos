import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { colors, fonts, LINES, LOGO_WAVE_PATH } from "../theme";
import { AnimatedCursor } from "../components/Cursor";
import { MetricsRibbon } from "../components/MetricsRibbon";

/**
 * Scene 4 — Lines cascade in with spring physics, cursor clicks Run,
 * status dots ignite green. Metrics ribbon appears. Cursor clicks "ideas".
 */
export const LinesAppear: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const SCENE_FRAMES = Math.round(6.5 * fps);

  // Each line springs in with stagger
  const lineData = LINES.map((line, i) => {
    const entrySpring = spring({
      frame,
      fps,
      delay: Math.round(0.2 * fps + i * 5),
      config: { damping: 16, stiffness: 160 },
    });
    return { ...line, entrySpring };
  });

  // All lines visible threshold
  const allLinesFrame = 0.2 * fps + LINES.length * 5 + 0.5 * fps;

  // Run button pulses after lines are in
  const runBtnSpring = spring({
    frame,
    fps,
    delay: Math.round(allLinesFrame),
    config: { damping: 12, stiffness: 200 },
  });

  // Click moment
  const clickFrame = Math.round(allLinesFrame + 0.8 * fps);
  const clicked = frame > clickFrame;

  // Dots ignite with staggered ripple after click
  const dotIgniteData = LINES.map((_, i) => {
    if (!clicked) return 0;
    return spring({
      frame,
      fps,
      delay: Math.round(clickFrame + i * 3),
      config: { damping: 10, stiffness: 250 },
    });
  });

  // Pipeline bar segments spring in
  const pipelineReveal = spring({
    frame,
    fps,
    delay: Math.round(allLinesFrame + 0.3 * fps),
    config: { damping: 200 },
  });

  // Status message
  const statusSpring = spring({
    frame,
    fps,
    delay: Math.round(clickFrame + LINES.length * 3 + 6),
    config: { damping: 200 },
  });

  // Metrics ribbon entrance
  const metricsSpring = spring({
    frame,
    fps,
    delay: Math.round(clickFrame + 8),
    config: { damping: 200 },
  });

  // WIP count animates after click
  const wipCount = clicked
    ? Math.min(9, Math.round(interpolate(frame, [clickFrame, clickFrame + fps], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))
    : 0;

  // Narration slide-in
  const narrationSpring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  // Sidebar click frame
  const sidebarClickFrame = SCENE_FRAMES - 35;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>

      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", paddingBottom: 92 }}>
        <div style={{ width: 1760, height: 600, display: "flex", borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}>
          {/* Sidebar */}
          <div style={{ width: 380, backgroundColor: colors.surface, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 24px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                  <path d={LOGO_WAVE_PATH} stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: fonts.body, fontSize: 19, fontWeight: 700, letterSpacing: "0.08em", color: colors.text }}>FREQUENCY</span>
                <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: colors.accent, boxShadow: `0 0 8px ${colors.accent}` }} />
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", border: `1px solid ${colors.accent}`, borderRadius: 4, fontFamily: fonts.mono, fontSize: 13, color: colors.text, backgroundColor: colors.bg }}>app-factory</div>
            </div>

            {/* Run / Pause / Stop controls */}
            <div style={{ padding: "0 24px 10px", display: "flex", gap: 1 }}>
              {[
                { label: "Run", icon: "M2.5 1.5l7 4.5-7 4.5V1.5z", active: clicked, color: clicked ? colors.positive : colors.accent },
                { label: "Pause", icon: "M3 1.5h2v9H3zM7 1.5h2v9H7z", active: false, color: colors.textMuted },
                { label: "Stop", icon: "M2.5 2.5h7v7h-7z", active: false, color: colors.textMuted },
              ].map((btn) => (
                <div
                  key={btn.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    fontFamily: fonts.mono,
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    color: btn.active ? btn.color : colors.textMuted,
                    border: `1px solid ${btn.active ? btn.color : colors.borderLight}`,
                    backgroundColor: btn.active ? `${btn.color}10` : "transparent",
                    borderRadius: 3,
                    transform: btn.label === "Run" ? `scale(${1 + runBtnSpring * 0.04 * (clicked ? 0 : 1)})` : undefined,
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d={btn.icon} fill="currentColor" /></svg>
                  {btn.label}
                </div>
              ))}
            </div>

            <div style={{ flex: 1, overflow: "hidden", paddingBottom: 20 }}>
              {lineData.map((line, i) => {
                const isIdeas = line.name === "ideas";
                const ideasHighlight = isIdeas && frame > sidebarClickFrame;
                return (
                  <div key={line.name} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "11px 24px",
                    opacity: line.entrySpring,
                    transform: `translateX(${interpolate(line.entrySpring, [0, 1], [-30, 0])}px)`,
                    borderLeft: ideasHighlight ? `2px solid ${colors.accent}` : "2px solid transparent",
                    backgroundColor: ideasHighlight ? colors.surfaceHover : "transparent",
                  }}>
                    <div style={{ position: "relative" }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        backgroundColor: dotIgniteData[i] > 0.5 ? colors.positive : colors.textMuted,
                        opacity: dotIgniteData[i] > 0.5 ? 1 : 0.4,
                        boxShadow: dotIgniteData[i] > 0.5 ? `0 0 ${6 + dotIgniteData[i] * 8}px ${colors.positive}` : "none",
                      }} />
                      {dotIgniteData[i] > 0.1 && dotIgniteData[i] < 0.95 && (
                        <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `1px solid ${colors.positive}`, opacity: 1 - dotIgniteData[i], transform: `scale(${1 + dotIgniteData[i] * 2})` }} />
                      )}
                    </div>
                    <span style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 450, color: colors.text }}>{line.name}</span>
                    <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{line.group}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px", gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>app-factory</h2>
              <p style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.accent, marginTop: 4 }}>9 parallel pipelines</p>
            </div>

            {/* Pipeline segments */}
            <div style={{ display: "flex", gap: 3, opacity: pipelineReveal }}>
              {LINES.map((line, i) => {
                const segSpring = spring({ frame, fps, delay: Math.round(allLinesFrame + 0.3 * fps + i * 3), config: { damping: 200 } });
                const fillWidth = clicked ? interpolate(frame, [clickFrame + i * 6, clickFrame + i * 6 + fps], [0, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
                return (
                  <div key={line.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: segSpring, transform: `translateY(${interpolate(segSpring, [0, 1], [12, 0])}px)` }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, color: colors.text, fontVariantNumeric: "tabular-nums" }}>0</span>
                    <div style={{ width: "100%", height: 4, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${fillWidth}%`, backgroundColor: colors.accent, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{line.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Metrics ribbon */}
            <MetricsRibbon
              throughput="0"
              failureRate="—"
              wip={String(wipCount)}
              leadTime="—"
              terminal="0"
              retryDlq="0 / 0"
              opacity={metricsSpring}
            />

            {clicked && (
              <div style={{ padding: "10px 16px", border: `1px solid rgba(48, 209, 88, 0.2)`, borderRadius: 6, fontFamily: fonts.mono, fontSize: 11, color: colors.positive, backgroundColor: "rgba(48, 209, 88, 0.04)", opacity: statusSpring, transform: `translateY(${interpolate(statusSpring, [0, 1], [8, 0])}px)`, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: colors.positive, boxShadow: `0 0 8px ${colors.positive}` }} />
                All 9 pipelines running
              </div>
            )}
          </div>
        </div>

        {/* Cursor — clicks Run, then clicks "ideas" sidebar */}
        <AnimatedCursor
          waypoints={[
            [960, 540, 0],
            [140, 323, Math.round(allLinesFrame + 0.5 * fps)],
            [140, 323, clickFrame],
            [140, 323, clickFrame + 15],
            [140, 369, sidebarClickFrame],
            [140, 369, sidebarClickFrame + 5],
          ]}
          clickAt={[clickFrame, sidebarClickFrame]}
          hideAfter={SCENE_FRAMES - 5}
        />
      </div>

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
          Parallel pipelines. State-coordinated.
        </span>
      </div>
    </AbsoluteFill>
  );
};
