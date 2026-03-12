import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { colors, fonts } from "../theme";

/**
 * Scene 8 — Browser mockup showing "Your Apps" dashboard.
 * Header frozen at top. Cards appear progressively.
 * Slow scroll reveals additional rows — never runs out of content.
 */

const LIVE_APPS = [
  { name: "ChartMint", desc: "Chart generation", color: "#6366F1", users: "1.2K" },
  { name: "PaperMint", desc: "Doc templates", color: "#10B981", users: "890" },
  { name: "CutoutCraft", desc: "BG removal", color: "#F59E0B", users: "2.1K" },
  { name: "CodeDelta", desc: "Code diff viewer", color: "#EC4899", users: "650" },
  { name: "FileFox", desc: "Format converter", color: "#3B82F6", users: "1.8K" },
  { name: "QRMint", desc: "QR generator", color: "#8B5CF6", users: "3.4K" },
  { name: "InvoiceSnap", desc: "Invoice scanner", color: "#14B8A6", users: "920" },
  { name: "BatchMark", desc: "Watermarking", color: "#EF4444", users: "1.5K" },
  { name: "SizeKit", desc: "Image resizer", color: "#F97316", users: "2.8K" },
  { name: "JsonLoom", desc: "JSON formatter", color: "#06B6D4", users: "1.1K" },
  { name: "ClipShrink", desc: "Video compressor", color: "#8B5CF6", users: "780" },
  { name: "SnapTally", desc: "Receipt counter", color: "#10B981", users: "1.4K" },
  // Below the fold — revealed on scroll
  { name: "DebtMelt", desc: "Debt tracker", color: "#EF4444", users: "560" },
  { name: "NotchPad", desc: "Markdown notes", color: "#6366F1", users: "2.3K" },
  { name: "WeekPulse", desc: "Weekly planner", color: "#F59E0B", users: "1.7K" },
  { name: "FormatFlip", desc: "File converter", color: "#3B82F6", users: "940" },
  { name: "SigBlock", desc: "E-signatures", color: "#10B981", users: "1.1K" },
  { name: "ShotGlow", desc: "Screenshot tool", color: "#EC4899", users: "2.0K" },
  { name: "TypeVolt", desc: "Font previewer", color: "#F97316", users: "1.3K" },
  { name: "RowSweep", desc: "CSV cleaner", color: "#06B6D4", users: "870" },
  { name: "BugJar", desc: "Error tracker", color: "#EF4444", users: "1.6K" },
  { name: "CueTalk", desc: "Meeting notes", color: "#6366F1", users: "2.1K" },
  { name: "RenewPad", desc: "Subscription mgr", color: "#8B5CF6", users: "740" },
  { name: "SliceTune", desc: "Audio trimmer", color: "#10B981", users: "980" },
];

const CHROME_HEIGHT = 44;
const HEADER_HEIGHT = 90;
const BROWSER_HEIGHT = 780;
const GRID_AREA_HEIGHT = BROWSER_HEIGHT - CHROME_HEIGHT - HEADER_HEIGHT;

export const LiveProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserSpring = spring({
    frame, fps, delay: Math.round(0.15 * fps),
    config: { damping: 20, stiffness: 120 },
  });

  const tiltX = interpolate(browserSpring, [0, 1], [10, 0]);
  const tiltY = interpolate(browserSpring, [0, 1], [-5, 0]);

  // Scroll begins as first batch settles, gentle continuous reveal
  const scrollStart = Math.round(0.9 * fps);
  const contentScroll = interpolate(
    frame, [scrollStart, scrollStart + Math.round(1.8 * fps)], [0, -150],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
  );

  const headerS = spring({ frame, fps, delay: Math.round(0.3 * fps), config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgWarm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 40px",
        perspective: 1200,
      }}
    >
      <div
        style={{
          width: 1780,
          height: BROWSER_HEIGHT,
          background: colors.bg,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)",
          opacity: browserSpring,
          transform: `translateY(${interpolate(browserSpring, [0, 1], [50, 0])}px) scale(${interpolate(browserSpring, [0, 1], [0.92, 1])}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chrome */}
        <div
          style={{
            height: CHROME_HEIGHT,
            background: "#F5F5F5",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["#FF5F57", "#FFBD2E", "#28CA42"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c }} />
            ))}
          </div>
          <div style={{
            flex: 1, maxWidth: 600, margin: "0 auto", background: colors.bg,
            borderRadius: 6, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 15, color: colors.textMuted }}>
              yourapps.dev
            </span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: colors.positive, marginLeft: 4 }} />
          </div>
        </div>

        {/* Frozen header — stays at top, doesn't scroll */}
        <div
          style={{
            height: HEADER_HEIGHT,
            padding: "20px 40px 12px",
            flexShrink: 0,
            borderBottom: "1px solid rgba(0,0,0,0.04)",
            opacity: headerS,
          }}
        >
          <div style={{ fontFamily: fonts.body, fontSize: 40, fontWeight: 800, color: colors.text, letterSpacing: "-0.02em" }}>
            Your Apps
          </div>
          <div style={{ fontFamily: fonts.serif, fontSize: 20, color: colors.textMuted, fontWeight: 300, marginTop: 2 }}>
            30 production apps — built and deployed by AI agents
          </div>
        </div>

        {/* Scrollable grid area — clips overflow, scroll reveals more rows */}
        <div
          style={{
            height: GRID_AREA_HEIGHT,
            overflow: "hidden",
            padding: "0 40px",
          }}
        >
          <div style={{ transform: `translateY(${contentScroll}px)`, paddingTop: 16, paddingBottom: 40 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {LIVE_APPS.map((app, i) => {
                // Continuous stagger across all cards — no gap between batches
                const cardDelay = Math.round(0.35 * fps + i * 0.05 * fps);

                const cardSpring = spring({
                  frame, fps,
                  delay: cardDelay,
                  config: { damping: 14, stiffness: 150, mass: 0.8 },
                });
                return (
                  <div
                    key={app.name}
                    style={{
                      background: colors.bg, border: `1px solid ${colors.border}`,
                      borderRadius: 12, padding: "20px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                      opacity: cardSpring,
                      transform: `translateY(${interpolate(cardSpring, [0, 1], [14, 0])}px)`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        backgroundColor: `${app.color}18`, border: `1px solid ${app.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: app.color }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: fonts.body, fontSize: 20, fontWeight: 700, color: colors.text }}>
                          {app.name}
                        </div>
                        <div style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted }}>
                          {app.desc}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.positive, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: colors.positive }} />
                      {app.users}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const labelS = spring({ frame, fps, delay: Math.round(1.8 * fps), config: { damping: 200 } });
        return (
          <div style={{
            position: "absolute", bottom: 14, fontFamily: fonts.mono, fontSize: 16,
            fontWeight: 500, color: colors.textLight, letterSpacing: "0.1em", textTransform: "uppercase", opacity: labelS,
          }}>
            ALL BUILT BY FREQUENCY AGENTS
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
