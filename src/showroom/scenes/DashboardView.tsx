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
 * Scene 2 — Dashboard "Your Galleries" with gallery cards appearing.
 * Cursor moves to "New Gallery" button.
 */

const GALLERIES = [
  { name: "Showroom Refresh", files: 7, date: "Mar 20" },
  { name: "Brand Explorations", files: 12, date: "Mar 18" },
];

export const DashboardView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round(s * fps);

  // Browser chrome entrance
  const browserS = spring({
    frame, fps, delay: t(0.1),
    config: { damping: 20, stiffness: 120 },
  });

  // Header text
  const headerS = spring({
    frame, fps, delay: t(0.25),
    config: { damping: 200 },
  });

  // Gallery cards stagger
  const card0S = spring({ frame, fps, delay: t(0.5), config: { damping: 16, stiffness: 150 } });
  const card1S = spring({ frame, fps, delay: t(0.65), config: { damping: 16, stiffness: 150 } });
  const cardSprings = [card0S, card1S];

  // Cursor animation to "New Gallery" button
  // Browser: 1600px wide centered → left=160. Chrome(44)+Nav(56)=100, content padding 36px 40px
  // Content right edge: 160+1600-40=1720. Button ~135px wide → center x≈1652
  // Content top: 130+100+36=266. Button padding 10px, text ~18px → center y≈285
  const cursorStartX = 600;
  const cursorStartY = 500;
  const cursorEndX = 1650;
  const cursorEndY = 305;
  const cursorMove = interpolate(
    frame, [t(1.8), t(2.8)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  const cursorX = interpolate(cursorMove, [0, 1], [cursorStartX, cursorEndX]);
  const cursorY = interpolate(cursorMove, [0, 1], [cursorStartY, cursorEndY]);

  // Button highlight on hover (trigger when cursor arrives ~t(2.7))
  const btnHighlight = interpolate(
    frame, [t(2.65), t(2.8)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Click ripple
  const clickFrame = t(3.0);
  const clickProgress = interpolate(
    frame, [clickFrame, clickFrame + 8], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      {/* Browser window */}
      <div
        style={{
          width: 1600,
          height: 820,
          background: colors.bg,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${colors.borderSubtle}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          opacity: browserS,
          transform: `translateY(${interpolate(browserS, [0, 1], [40, 0])}px) scale(${interpolate(browserS, [0, 1], [0.95, 1])})`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chrome bar */}
        <div
          style={{
            height: 44,
            background: colors.chrome,
            borderBottom: `1px solid ${colors.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["#FF5F57", "#FFBD2E", "#28CA42"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c, opacity: 0.8 }} />
            ))}
          </div>
          <div style={{
            flex: 1, maxWidth: 500, margin: "0 auto", background: colors.bgCard,
            borderRadius: 6, padding: "6px 16px", display: "flex", alignItems: "center",
          }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted }}>
              showroom.cashewcrate.com
            </span>
          </div>
        </div>

        {/* Nav bar */}
        <div style={{
          height: 56, padding: "0 40px", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderBottom: `1px solid ${colors.borderSubtle}`,
          flexShrink: 0, opacity: headerS,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="1.5" fill={colors.accent} />
              <rect x="11" y="2" width="7" height="7" rx="1.5" fill={colors.accent} opacity={0.6} />
              <rect x="2" y="11" width="7" height="7" rx="1.5" fill={colors.accent} opacity={0.6} />
              <rect x="11" y="11" width="7" height="7" rx="1.5" fill={colors.accent} opacity={0.3} />
            </svg>
            <span style={{ fontFamily: fonts.body, fontSize: 18, fontWeight: 600, color: colors.text, marginLeft: 8 }}>
              Show
            </span>
            <span style={{ fontFamily: fonts.display, fontSize: 18, fontWeight: 400, fontStyle: "italic", color: colors.text }}>
              room
            </span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Galleries", "Pricing", "Profile"].map((item) => (
              <span key={item} style={{ fontFamily: fonts.body, fontSize: 15, color: colors.textMuted, fontWeight: 400 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: "36px 40px", overflow: "hidden" }}>
          {/* Title */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, opacity: headerS }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontFamily: fonts.body, fontSize: 42, fontWeight: 300, color: colors.text, letterSpacing: "-0.02em" }}>
                  Your{" "}
                </span>
                <span style={{ fontFamily: fonts.display, fontSize: 42, fontWeight: 400, fontStyle: "italic", color: colors.accentLight }}>
                  Galleries
                </span>
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
                2 galleries · Pro
              </div>
            </div>

            {/* New Gallery button */}
            <div style={{
              background: interpolate(btnHighlight, [0, 1], [0, 1]) > 0.5
                ? colors.accentLight : colors.accent,
              borderRadius: 8, padding: "10px 20px",
              fontFamily: fonts.body, fontSize: 15, fontWeight: 600,
              color: colors.bg,
              transform: `scale(${interpolate(btnHighlight, [0, 0.5, 1], [1, 1, 1.04])})`,
            }}>
              New Gallery
            </div>
          </div>

          {/* Filter tabs + search */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", margin: "24px 0 20px", opacity: headerS }}>
            <div style={{
              background: colors.bgCard, borderRadius: 6, padding: "8px 16px",
              flex: 1, maxWidth: 300,
              fontFamily: fonts.body, fontSize: 14, color: colors.textDim,
            }}>
              Search galleries...
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {["All", "Owner", "Member"].map((tab, i) => (
                <div key={tab} style={{
                  padding: "6px 16px", fontFamily: fonts.body, fontSize: 14,
                  fontWeight: i === 1 ? 600 : 400,
                  color: i === 1 ? colors.text : colors.textMuted,
                  borderBottom: i === 1 ? `2px solid ${colors.accent}` : "2px solid transparent",
                }}>
                  {tab}
                </div>
              ))}
            </div>
          </div>

          {/* Gallery cards */}
          <div style={{ display: "flex", gap: 20 }}>
            {GALLERIES.map((gallery, i) => {
              const s = cardSprings[i];
              return (
                <div
                  key={gallery.name}
                  style={{
                    width: 280,
                    background: colors.bgCard,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1px solid ${colors.borderSubtle}`,
                    opacity: s,
                    transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
                  }}
                >
                  {/* Thumbnail area */}
                  <div style={{
                    height: 180, background: `linear-gradient(135deg, ${colors.bgSurface}, ${colors.bgCard})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* Fake thumbnail grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, width: "85%", height: "80%", opacity: 0.6 }}>
                      {[colors.accent, "#6366F1", "#F59E0B", "#EC4899"].map((c, j) => (
                        <div key={j} style={{
                          background: `${c}20`, borderRadius: 4,
                          border: `1px solid ${c}30`,
                        }} />
                      ))}
                    </div>
                  </div>
                  {/* Card footer */}
                  <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 600, color: colors.text }}>
                        {gallery.name}
                      </div>
                      <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                        {gallery.files} files · {gallery.date}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: fonts.mono, fontSize: 11, color: colors.accent,
                      background: colors.accentBg, padding: "3px 8px", borderRadius: 4,
                    }}>
                      Owner
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cursor */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          width: 20,
          height: 20,
          pointerEvents: "none",
          opacity: interpolate(frame, [t(1.5), t(1.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L5.86 2.36a.5.5 0 0 0-.36-.15z" />
        </svg>
        {/* Click ripple */}
        {clickProgress > 0 && clickProgress < 1 && (
          <div style={{
            position: "absolute", top: -10, left: -10,
            width: 40, height: 40, borderRadius: "50%",
            border: `2px solid ${colors.accentLight}`,
            opacity: 1 - clickProgress,
            transform: `scale(${interpolate(clickProgress, [0, 1], [0.5, 2])})`,
          }} />
        )}
      </div>
    </AbsoluteFill>
  );
};
