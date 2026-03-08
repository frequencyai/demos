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

const IDEA_APPS = [
  { name: "debtmelt", score: 92, tags: ["finance", "saas"], desc: "Debt snowball calculator" },
  { name: "weekpulse", score: 87, tags: ["productivity"], desc: "Weekly review dashboard" },
  { name: "pennyscope", score: 84, tags: ["finance", "tracker"], desc: "Expense insight engine" },
];

/**
 * Scene 4 — Ideas pipeline. Cards pop in with spring bounce,
 * shimmer bar fills, cards slide to validated column with physics.
 */
export const IdeasPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pipeline bar shimmer
  const barProgress = interpolate(frame, [0.3 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Cards spring in
  const cardSprings = IDEA_APPS.map((_, i) => {
    return spring({
      frame,
      fps,
      delay: Math.round(0.8 * fps + i * 0.5 * fps),
      config: { damping: 12, stiffness: 160 },
    });
  });

  // Validation moment — cards move right
  const validationStart = 3.2 * fps;
  const validationSprings = IDEA_APPS.map((_, i) => {
    return spring({
      frame,
      fps,
      delay: Math.round(validationStart + i * 0.3 * fps),
      config: { damping: 18, stiffness: 140 },
    });
  });

  // Check mark springs
  const checkSprings = IDEA_APPS.map((_, i) => {
    return spring({
      frame,
      fps,
      delay: Math.round(validationStart + i * 0.3 * fps + 6),
      config: { damping: 8, stiffness: 250 },
    });
  });

  // Sidebar progress
  const sidebarProgress = interpolate(frame, [0, 4.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Scan lines */}
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

      <div style={{ width: 1760, height: 840, display: "flex", borderRadius: 14, border: `1px solid ${colors.border}`, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}>
        {/* Minimal sidebar */}
        <div
          style={{
            width: 380,
            backgroundColor: colors.surface,
            borderRight: `1px solid ${colors.border}`,
            display: "flex",
            flexDirection: "column",
            padding: "24px 0",
          }}
        >
          <div style={{ padding: "0 24px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <path d={LOGO_WAVE_PATH} stroke={colors.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: fonts.body, fontSize: 19, fontWeight: 700, letterSpacing: "0.08em", color: colors.text }}>FREQUENCY</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: fonts.mono, fontSize: 13, color: colors.textTertiary, padding: "7px 10px", border: `1px solid ${colors.accent}`, borderRadius: 3, backgroundColor: colors.bg }}>app-factory</div>
          </div>

          {/* Lines with ideas highlighted */}
          {["ideas", "build", "deploy", "release-shared", "release", "marketing", "bugjar"].map((name, i) => {
            const isIdeas = name === "ideas";
            return (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "11px 24px", borderLeft: isIdeas ? `2px solid ${colors.accent}` : "2px solid transparent", backgroundColor: isIdeas ? colors.surfaceHover : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: colors.positive, boxShadow: `0 0 6px ${colors.positive}` }} />
                  <span style={{ fontFamily: fonts.body, fontSize: 16, color: isIdeas ? colors.text : colors.textMuted, fontWeight: isIdeas ? 500 : 400 }}>{name}</span>
                  {isIdeas && (
                    <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.accent }}>
                      {validationSprings.filter((s) => s > 0.5).length}/{IDEA_APPS.length}
                    </span>
                  )}
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 40px", gap: 16 }}>
          {/* Header */}
          <div>
            <h2 style={{ fontFamily: fonts.body, fontSize: 30, fontWeight: 800, color: colors.text, letterSpacing: "-0.03em", margin: 0 }}>ideas</h2>
            <p style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.accent, marginTop: 3 }}>generating & evaluating app ideas</p>
          </div>

          {/* Pipeline stages bar */}
          <div style={{ display: "flex", gap: 3 }}>
            {["ready", "generated", "validated"].map((stage, i) => {
              const stageProgress = i === 0 ? barProgress : i === 1
                ? interpolate(frame, [1.2 * fps, 2.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) })
                : interpolate(frame, [validationStart, validationStart + 1.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });

              const count = i === 2
                ? validationSprings.filter((s) => s > 0.5).length
                : i === 1
                  ? cardSprings.filter((s) => s > 0.5).length - validationSprings.filter((s) => s > 0.5).length
                  : 0;

              return (
                <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 24, fontWeight: 700, color: stageProgress > 0.5 ? (stage === "validated" ? colors.positive : colors.accent) : colors.text, fontVariantNumeric: "tabular-nums" }}>{Math.max(0, count)}</span>
                  <div style={{ width: "100%", height: 6, backgroundColor: colors.borderLight, borderRadius: 2, overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", width: `${stageProgress * 100}%`, backgroundColor: stage === "validated" ? colors.positive : colors.accent, borderRadius: 2 }} />
                    {/* Shimmer effect */}
                    {stageProgress > 0 && stageProgress < 1 && (
                      <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                        transform: `translateX(${(frame * 3) % 200 - 100}%)`,
                        opacity: 0.5,
                      }} />
                    )}
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textTertiary, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{stage}</span>
                </div>
              );
            })}
          </div>

          {/* Two-column card view */}
          <div style={{ display: "flex", gap: 20, marginTop: 8, flex: 1 }}>
            {/* Generated column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 6, borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: colors.accent }}>Generated</span>
              </div>
              {IDEA_APPS.map((app, i) => {
                const visible = cardSprings[i] > 0.01;
                const validated = validationSprings[i] > 0.5;
                if (!visible || validated) return null;
                return (
                  <div key={app.name} style={{
                    padding: "12px 14px", border: `1px solid ${colors.border}`, borderRadius: 8,
                    backgroundColor: colors.surface,
                    opacity: cardSprings[i],
                    transform: `translateY(${interpolate(cardSprings[i], [0, 1], [20, 0])}px) scale(${interpolate(cardSprings[i], [0, 1], [0.92, 1])})`,
                    display: "flex", flexDirection: "column", gap: 6,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 600, color: colors.text }}>{app.name}</span>
                      <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: app.score >= 90 ? colors.positive : colors.text, border: `1px solid ${app.score >= 90 ? colors.positive : colors.border}`, borderRadius: 3, padding: "1px 6px" }}>{app.score}/100</span>
                    </div>
                    <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMuted }}>{app.desc}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {app.tags.map((t) => (
                        <span key={t} style={{ fontFamily: fonts.mono, fontSize: 10, textTransform: "uppercase" as const, color: colors.textTertiary, border: `1px solid ${colors.borderLight}`, borderRadius: 2, padding: "1px 5px", letterSpacing: "0.05em" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validated column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 6, borderBottom: `1px solid rgba(48, 209, 88, 0.2)` }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.15em", color: colors.positive }}>Validated</span>
              </div>
              {IDEA_APPS.map((app, i) => {
                const validated = validationSprings[i] > 0.01;
                if (!validated) return null;
                return (
                  <div key={app.name} style={{
                    padding: "12px 14px",
                    border: `1px solid rgba(48, 209, 88, 0.15)`,
                    borderRadius: 8,
                    backgroundColor: "rgba(48, 209, 88, 0.03)",
                    opacity: validationSprings[i],
                    transform: `translateX(${interpolate(validationSprings[i], [0, 1], [40, 0])}px)`,
                    display: "flex", flexDirection: "column", gap: 6,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Animated check */}
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        backgroundColor: `rgba(48, 209, 88, ${0.15 * checkSprings[i]})`,
                        border: `1.5px solid ${colors.positive}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: `scale(${checkSprings[i]})`,
                      }}>
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7l3 3 5-6" stroke={colors.positive} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            strokeDasharray="20"
                            strokeDashoffset={20 * (1 - checkSprings[i])}
                          />
                        </svg>
                      </div>
                      <span style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 600, color: colors.text }}>{app.name}</span>
                      <span style={{ marginLeft: "auto", fontFamily: fonts.mono, fontSize: 11, color: colors.positive, border: `1px solid ${colors.positive}`, borderRadius: 3, padding: "1px 6px" }}>{app.score}/100</span>
                    </div>
                    <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textMuted }}>{app.desc}</span>
                    <div style={{ display: "flex", gap: 4 }}>
                      {app.tags.map((t) => (
                        <span key={t} style={{ fontFamily: fonts.mono, fontSize: 10, textTransform: "uppercase" as const, color: colors.textTertiary, border: `1px solid ${colors.borderLight}`, borderRadius: 2, padding: "1px 5px", letterSpacing: "0.05em" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
