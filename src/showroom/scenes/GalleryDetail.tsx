import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { colors, fonts } from "../theme";

/**
 * Scene 5 — Gallery detail view with uploaded file thumbnail.
 * Shows "Showroom Prototypes" gallery with Proto 1 file card.
 */
export const GalleryDetail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round(s * fps);

  const pageS = spring({ frame, fps, delay: t(0.1), config: { damping: 200 } });
  const cardS = spring({ frame, fps, delay: t(0.4), config: { damping: 16, stiffness: 150 } });
  const discussionS = spring({ frame, fps, delay: t(0.8), config: { damping: 200 } });

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
      <div style={{
        width: 1600, height: 820,
        background: colors.bg, borderRadius: 16,
        overflow: "hidden", border: `1px solid ${colors.borderSubtle}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Chrome */}
        <div style={{
          height: 44, background: colors.chrome,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["#FF5F57", "#FFBD2E", "#28CA42"].map((c) => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c, opacity: 0.8 }} />
            ))}
          </div>
          <div style={{ flex: 1, maxWidth: 500, margin: "0 auto", background: colors.bgCard, borderRadius: 6, padding: "6px 16px" }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted }}>
              showroom.cashewcrate.com/gallery/showroom-prototypes
            </span>
          </div>
        </div>

        {/* Nav */}
        <div style={{
          height: 56, padding: "0 40px", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderBottom: `1px solid ${colors.borderSubtle}`,
          flexShrink: 0, opacity: pageS,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted }}>Showroom</span>
            <span style={{ color: colors.textDim }}>·</span>
            <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.accentLight, fontWeight: 500 }}>Showroom Prototypes</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Galleries", "Pricing", "Profile"].map((item) => (
              <span key={item} style={{ fontFamily: fonts.body, fontSize: 15, color: colors.textMuted }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "32px 40px", overflow: "hidden" }}>
          {/* Gallery header */}
          <div style={{ opacity: pageS, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
              <span style={{ fontFamily: fonts.body, fontSize: 36, fontWeight: 700, color: colors.text, letterSpacing: "-0.01em" }}>
                Showroom Prototypes
              </span>
              <div style={{
                fontFamily: fonts.mono, fontSize: 12, color: colors.accent,
                background: colors.accentBg, padding: "4px 10px", borderRadius: 4,
              }}>
                Owner
              </div>
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted }}>
              1 / 50 file · 1 / 10 members · Pro · max 5 MB
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, margin: "20px 0", opacity: pageS }}>
            {[
              { label: "1", icon: true },
              { label: "Edit" },
              { label: "Delete", danger: true },
              { label: "Upload", primary: true },
            ].map((btn) => (
              <div
                key={btn.label}
                style={{
                  fontFamily: fonts.body, fontSize: 14, fontWeight: 500,
                  padding: "8px 16px", borderRadius: 8,
                  color: btn.primary ? colors.bg : btn.danger ? colors.red : colors.text,
                  background: btn.primary ? colors.accent : "transparent",
                  border: btn.primary ? "none" : `1px solid ${colors.borderSubtle}`,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {btn.icon && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.text} strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                )}
                {btn.label}
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{
            background: colors.bgCard, borderRadius: 8, padding: "10px 16px",
            border: `1px solid ${colors.borderSubtle}`, marginBottom: 20,
            maxWidth: 400, opacity: pageS,
          }}>
            <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textDim }}>Search files...</span>
          </div>

          {/* File card */}
          <div style={{
            width: 360,
            background: colors.bgCard,
            borderRadius: 12,
            overflow: "hidden",
            border: `1px solid ${colors.borderSubtle}`,
            opacity: cardS,
            transform: `translateY(${interpolate(cardS, [0, 1], [20, 0])}px)`,
          }}>
            {/* Thumbnail */}
            <div style={{
              height: 220,
              background: `linear-gradient(135deg, #1a1614, #2a2220)`,
              position: "relative",
              overflow: "hidden",
              padding: 12,
            }}>
              {/* Fake prototype preview */}
              <div style={{
                width: "100%", height: "100%", borderRadius: 6,
                background: colors.bgSurface,
                border: `1px solid ${colors.borderSubtle}`,
                padding: 10, overflow: "hidden",
              }}>
                {/* Mini header */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontFamily: fonts.display, fontSize: 11, color: colors.accentLight, fontStyle: "italic" }}>
                    Verdant Archive
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: colors.textDim }} />
                    ))}
                  </div>
                </div>
                {/* Mini grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                  {[colors.accent, "#6366F1", "#F59E0B", "#EC4899", "#10B981", "#3B82F6"].map((c, i) => (
                    <div key={i} style={{
                      height: 40, borderRadius: 3,
                      background: `${c}20`, border: `1px solid ${c}25`,
                    }} />
                  ))}
                </div>
              </div>
              {/* File number badge */}
              <div style={{
                position: "absolute", top: 18, left: 18,
                fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted,
                background: "rgba(0,0,0,0.6)", padding: "2px 6px", borderRadius: 3,
              }}>
                01
              </div>
            </div>
            {/* File info */}
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontFamily: fonts.body, fontSize: 16, fontWeight: 600, color: colors.text }}>
                Proto 1
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                frequencyaidev · index.html · Mar 20
              </div>
            </div>
          </div>

          {/* Discussion section */}
          <div style={{ marginTop: 32, opacity: discussionS }}>
            <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 700, color: colors.text, marginBottom: 12 }}>
              Gallery Discussion
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textDim }}>
              No comments yet.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
