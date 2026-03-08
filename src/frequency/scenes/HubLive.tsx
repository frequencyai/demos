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

const APPS = [
  { name: "debtmelt", desc: "Debt payoff calculator", color: "#4A9EFF" },
  { name: "weekpulse", desc: "Weekly productivity", color: "#30D158" },
  { name: "pennyscope", desc: "Expense tracking", color: "#FF6B35" },
  { name: "mileledger", desc: "Mileage logger", color: "#B27AFF" },
  { name: "notchpad", desc: "Minimal notes", color: "#FFD60A" },
  { name: "chartmint", desc: "Chart generator", color: "#00C7BE" },
];

/**
 * Scene 8 — Hub website mockup. Browser chrome springs in,
 * app cards pop into grid with bouncy springs and live badges ignite.
 */
export const HubLive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser chrome entrance
  const chromeSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.6 * fps),
  });

  // URL bar typing
  const url = "cashewcrate.com";
  const urlChars = Math.min(
    url.length,
    Math.max(0, Math.floor((frame - 0.3 * fps) / 1.5))
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)", pointerEvents: "none", zIndex: 40 }} />

      {/* Browser chrome */}
      <div
        style={{
          width: 1700,
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          overflow: "hidden",
          opacity: chromeSpring,
          transform: `scale(${interpolate(chromeSpring, [0, 1], [0.95, 1])}) translateY(${interpolate(chromeSpring, [0, 1], [20, 0])}px)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 20px",
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["#e14f4f", "#d9a83a", "#30D158"].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: c }} />
            ))}
          </div>
          <div
            style={{
              flex: 1,
              padding: "5px 14px",
              borderRadius: 6,
              backgroundColor: colors.bg,
              fontFamily: fonts.mono,
              fontSize: 14,
              color: colors.textMuted,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke={colors.positive} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{url.slice(0, urlChars)}</span>
            {urlChars < url.length && (
              <span style={{ color: colors.accent, opacity: frame % Math.round(fps / 2) < fps / 4 ? 1 : 0 }}>|</span>
            )}
          </div>
        </div>

        {/* Page content */}
        <div
          style={{
            padding: "40px 56px 56px",
            backgroundColor: colors.bg,
            minHeight: 520,
          }}
        >
          {/* Site header */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div>
              <h1 style={{ fontFamily: fonts.body, fontSize: 40, fontWeight: 800, color: colors.text, margin: 0, letterSpacing: "-0.02em" }}>cashewcrate</h1>
              <p style={{ fontFamily: fonts.mono, fontSize: 15, color: colors.textTertiary, marginTop: 5, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>App portfolio</p>
            </div>
            <span style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.textTertiary }}>{APPS.filter((_, i) => spring({ frame, fps, delay: Math.round(0.8 * fps + i * 0.28 * fps), config: { damping: 200 } }) > 0.5).length} apps</span>
          </div>

          {/* App grid */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 20 }}>
            {APPS.map((app, i) => {
              const cardSpring = spring({
                frame,
                fps,
                delay: Math.round(0.8 * fps + i * 0.28 * fps),
                config: { damping: 12, stiffness: 160 },
              });

              // Live badge ignite
              const liveSpring = spring({
                frame,
                fps,
                delay: Math.round(0.8 * fps + i * 0.28 * fps + 10),
                config: { damping: 8, stiffness: 250 },
              });

              return (
                <div
                  key={app.name}
                  style={{
                    width: 400,
                    padding: "22px 20px",
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    opacity: cardSpring,
                    transform: `scale(${interpolate(cardSpring, [0, 1], [0.8, 1])}) translateY(${interpolate(cardSpring, [0, 1], [25, 0])}px)`,
                  }}
                >
                  {/* App icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      backgroundColor: app.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: fonts.body,
                      fontSize: 24,
                      fontWeight: 700,
                      color: "white",
                      boxShadow: `0 4px 12px ${app.color}33`,
                    }}
                  >
                    {app.name[0].toUpperCase()}
                  </div>

                  <div>
                    <h3 style={{ fontFamily: fonts.body, fontSize: 20, fontWeight: 600, color: colors.text, margin: 0 }}>{app.name}</h3>
                    <p style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, marginTop: 3 }}>{app.desc}</p>
                  </div>

                  {/* Live badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: liveSpring }}>
                    <div
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        backgroundColor: colors.positive,
                        boxShadow: `0 0 ${4 + liveSpring * 6}px ${colors.positive}`,
                        transform: `scale(${liveSpring})`,
                      }}
                    />
                    <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.positive, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>live</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
