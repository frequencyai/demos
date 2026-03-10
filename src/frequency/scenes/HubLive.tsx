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

const APPS = [
  { name: "PaperMint", desc: "Free PDF tools, right in your browser", color: "#ff0000", features: ["Merge multiple PDFs into one", "Split PDFs and extract pages", "Compress while maintaining quality"] },
  { name: "Cutout Craft", desc: "AI background removal in your browser", color: "#FF2E97", features: ["One-click AI background removal", "Replace with colors or gradients", "Export as PNG, JPG, or WebP"] },
  { name: "CodeDelta", desc: "Visual code comparison tool", color: "#00fff5", features: ["Side-by-side and inline diff views", "Syntax highlighting for 50+ languages", "Export to PNG, PDF, or SVG"] },
  { name: "SliceTune", desc: "Browser-based audio editor", color: "#ffb800", features: ["Waveform visualization with trim", "Format conversion (MP3, WAV, OGG)", "Fade in/out effects"] },
  { name: "CrunchPix", desc: "Squeeze every pixel without losing the picture", color: "#FF6EC7", features: ["Batch compression with parallel processing", "Convert between JPEG, PNG, WebP", "Files stay on device"] },
  { name: "QRMint", desc: "Beautiful QR codes in seconds", color: "#10B981", features: ["Custom colors, gradients, dot styles", "Logo embedding with error correction", "WiFi, vCard, and event QR codes"] },
];

/**
 * Scene 9 — Hub website mockup matching cashewcrate.com's actual design.
 * Browser chrome springs in, site header appears, app cards pop into grid.
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

  // Site header entrance
  const headerSpring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          width: 1700,
          display: "flex",
          flexDirection: "column",
          border: `1px solid rgba(255,255,255,0.08)`,
          borderRadius: 12,
          overflow: "hidden",
          opacity: chromeSpring,
          transform: `scale(${interpolate(chromeSpring, [0, 1], [0.95, 1])}) translateY(${interpolate(chromeSpring, [0, 1], [20, 0])}px)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "11px 20px",
            backgroundColor: "#141414",
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
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
              backgroundColor: "#0a0a0a",
              fontFamily: fonts.mono,
              fontSize: 14,
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#30D158" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{url.slice(0, urlChars)}</span>
            {urlChars < url.length && (
              <span style={{ color: "#00fff5", opacity: frame % Math.round(fps / 2) < fps / 4 ? 1 : 0 }}>|</span>
            )}
          </div>
        </div>

        {/* Page content — matching cashewcrate.com */}
        <div
          style={{
            backgroundColor: "#0a0a0a",
            minHeight: 700,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Site navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 48px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              opacity: headerSpring,
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                backgroundColor: "#ff0000",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width={16} height={16} viewBox="0 0 32 32" fill="none">
                  <path d={LOGO_WAVE_PATH} stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 700, color: "#EAECE8" }}>Cashew Crate</span>
            </div>

            {/* Nav links */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 28 }}>
              {["Tools", "Pricing", "Blog", "About"].map((link) => (
                <span key={link} style={{ fontFamily: fonts.body, fontSize: 14, color: "#888", fontWeight: 400 }}>{link}</span>
              ))}
              <span style={{ fontFamily: fonts.body, fontSize: 14, color: "#EAECE8", fontWeight: 500, padding: "6px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6 }}>Sign in</span>
            </div>
          </div>

          {/* Tools section */}
          <div style={{ padding: "32px 48px 48px" }}>
            {/* Section label */}
            <div style={{ opacity: headerSpring, marginBottom: 24 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 11, color: "#00fff5", textTransform: "uppercase" as const, letterSpacing: "0.15em" }}>
                free tools · no install · runs in your browser
              </span>
              <h1 style={{ fontFamily: fonts.body, fontSize: 36, fontWeight: 800, color: "#EAECE8", margin: 0, marginTop: 8, letterSpacing: "-0.02em" }}>
                Cashew Crate
              </h1>
              <p style={{ fontFamily: fonts.body, fontSize: 16, color: "#888", marginTop: 6 }}>
                Apps and tools for every task. Fast, free, focused.
              </p>
            </div>

            {/* App grid — 3x2 matching real site */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 16 }}>
              {APPS.map((app, i) => {
                const cardSpring = spring({
                  frame,
                  fps,
                  delay: Math.round(0.9 * fps + i * 0.25 * fps),
                  config: { damping: 14, stiffness: 160 },
                });

                return (
                  <div
                    key={app.name}
                    style={{
                      width: 520,
                      padding: "22px 24px",
                      border: `1px solid rgba(255,255,255,0.06)`,
                      borderRadius: 12,
                      backgroundColor: "#141414",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      opacity: cardSpring,
                      transform: `scale(${interpolate(cardSpring, [0, 1], [0.85, 1])}) translateY(${interpolate(cardSpring, [0, 1], [20, 0])}px)`,
                    }}
                  >
                    {/* App header row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: `${app.color}18`,
                          border: `1px solid ${app.color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: fonts.body,
                          fontSize: 18,
                          fontWeight: 700,
                          color: app.color,
                        }}
                      >
                        {app.name[0]}
                      </div>
                      <div>
                        <h3 style={{ fontFamily: fonts.body, fontSize: 17, fontWeight: 600, color: "#EAECE8", margin: 0 }}>{app.name}</h3>
                        <p style={{ fontFamily: fonts.body, fontSize: 12, color: "#888", marginTop: 1 }}>{app.desc}</p>
                      </div>
                    </div>

                    {/* Feature bullets */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {app.features.map((feature) => (
                        <div key={feature} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7l3 3 5-6" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span style={{ fontFamily: fonts.body, fontSize: 12, color: "#999" }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Learn more link */}
                    <span style={{ fontFamily: fonts.body, fontSize: 13, color: "#00fff5", fontWeight: 500, marginTop: 2 }}>
                      Learn more →
                    </span>
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
