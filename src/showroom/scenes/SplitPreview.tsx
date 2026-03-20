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
 * Scene 7 — Split pane preview. File clicked, preview panel
 * slides open from the right showing the HTML prototype.
 */

const GALLERY_ITEMS = [
  { name: "Cartography UI", files: 12, date: "2026.02.18", colors: ["#3A8A6E", "#2D6B54", "#1F4D3C"] },
  { name: "Verdant Type System", files: 8, date: "2026.03.10", colors: ["#6366F1", "#4F46E5", "#3730A3"] },
  { name: "Fieldwork App", files: 9, date: "2026.03.10", colors: ["#3A8A6E", "#10B981", "#059669"] },
  { name: "Press & Hold", files: 8, date: "2026.01.30", colors: ["#EF4444", "#DC2626", "#6366F1"] },
  { name: "Archipelago Dashboard", files: 14, date: "2026.03.07", colors: ["#3B82F6", "#14B8A6"] },
  { name: "Mineral Grid", files: 7, date: "2026.01.15", colors: ["#6366F1", "#EC4899", "#3A8A6E"] },
];

export const SplitPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round(s * fps);

  const browserS = spring({ frame, fps, delay: t(0.1), config: { damping: 200 } });

  // Panel slides in
  const panelS = spring({
    frame, fps, delay: t(0.6),
    config: { damping: 20, stiffness: 120 },
  });
  const panelWidth = interpolate(panelS, [0, 1], [0, 580]);

  // File cards in preview panel
  const cardStagger = (i: number) =>
    spring({ frame, fps, delay: t(1.0) + i * 3, config: { damping: 16, stiffness: 180 } });

  // Scroll in preview
  const scrollStart = t(2.2);
  const scroll = interpolate(
    frame, [scrollStart, scrollStart + t(1.5)], [0, -80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
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
      <div style={{
        width: 1600, height: 820,
        background: colors.bg, borderRadius: 16,
        overflow: "hidden", border: `1px solid ${colors.borderSubtle}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
        opacity: browserS,
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

        {/* Main area with split */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left: gallery list */}
          <div style={{
            flex: 1, padding: "28px 32px", overflow: "hidden",
            borderRight: panelWidth > 0 ? `1px solid ${colors.borderSubtle}` : "none",
          }}>
            {/* Gallery header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: fonts.body, fontSize: 28, fontWeight: 700, color: colors.text }}>
                Showroom Prototypes
              </span>
              <div style={{
                fontFamily: fonts.mono, fontSize: 11, color: colors.accent,
                background: colors.accentBg, padding: "3px 8px", borderRadius: 4,
              }}>
                Owner
              </div>
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginBottom: 20 }}>
              1 / 50 file · 1 / 10 members · Pro · max 5 MB
            </div>

            {/* File card */}
            <div style={{
              width: 360,
              background: colors.bgCard, borderRadius: 12,
              overflow: "hidden", border: `1px solid ${panelWidth > 100 ? colors.accent : colors.borderSubtle}`,
            }}>
              <div style={{
                height: panelWidth > 100 ? 160 : 220,
                background: `linear-gradient(135deg, #1a1614, #2a2220)`,
                padding: 10, position: "relative",
              }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: 6,
                  background: colors.bgSurface, border: `1px solid ${colors.borderSubtle}`,
                  padding: 8, overflow: "hidden",
                }}>
                  <div style={{ fontFamily: fonts.display, fontSize: 9, color: colors.accentLight, fontStyle: "italic", marginBottom: 4 }}>
                    Verdant Archive
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
                    {[colors.accent, "#6366F1", "#F59E0B", "#EC4899", "#10B981", "#3B82F6"].map((c, i) => (
                      <div key={i} style={{ height: 28, borderRadius: 2, background: `${c}20`, border: `1px solid ${c}25` }} />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontFamily: fonts.body, fontSize: 15, fontWeight: 600, color: colors.text }}>Proto 1</div>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                  frequencyaidev · index.html · Mar 20
                </div>
              </div>
            </div>
          </div>

          {/* Right: preview panel */}
          <div style={{
            width: panelWidth,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}>
            {panelWidth > 50 && (
              <>
                {/* Preview header */}
                <div style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${colors.borderSubtle}`,
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  flexShrink: 0,
                }}>
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 20, fontWeight: 700, color: colors.text }}>
                      Proto 1
                    </div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                      file: index.html
                    </div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted }}>
                      published: Mar 20, 2026
                    </div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted }}>
                      gallery: Showroom Prototypes
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted }}>01 / 01</div>
                  </div>
                </div>

                {/* Preview content - fake HTML prototype */}
                <div style={{
                  flex: 1, overflow: "hidden",
                  background: colors.bgCard,
                }}>
                  <div style={{ transform: `translateY(${scroll}px)`, padding: 16 }}>
                    {/* Mini prototype: "Verdant Archive" */}
                    <div style={{
                      background: colors.bgSurface,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: `1px solid ${colors.borderSubtle}`,
                    }}>
                      {/* Proto header */}
                      <div style={{
                        padding: "16px 20px",
                        display: "flex", justifyContent: "space-between",
                        borderBottom: `1px solid ${colors.borderSubtle}`,
                      }}>
                        <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                          SHOWROOM
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                          {["Gallery", "Files", "Preview"].map(t => (
                            <span key={t} style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted }}>{t}</span>
                          ))}
                        </div>
                      </div>

                      {/* Hero */}
                      <div style={{ padding: "20px 20px 16px" }}>
                        <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 700, color: colors.text }}>
                          Verdant
                        </div>
                        <div style={{ fontFamily: fonts.display, fontSize: 28, fontStyle: "italic", color: colors.accentLight }}>
                          Archive
                        </div>
                      </div>

                      {/* Gallery grid */}
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 8, padding: "0 20px 20px",
                      }}>
                        {GALLERY_ITEMS.map((item, i) => {
                          const cS = cardStagger(i);
                          return (
                            <div key={item.name} style={{
                              borderRadius: 6,
                              overflow: "hidden",
                              border: `1px solid ${colors.borderSubtle}`,
                              opacity: cS,
                              transform: `translateY(${interpolate(cS, [0, 1], [10, 0])}px)`,
                            }}>
                              <div style={{
                                height: 60,
                                background: `linear-gradient(135deg, ${item.colors[0]}30, ${item.colors[1] || item.colors[0]}20)`,
                              }} />
                              <div style={{ padding: "6px 8px", background: colors.bgCard }}>
                                <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                                  {item.colors.map((c, j) => (
                                    <div key={j} style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c }} />
                                  ))}
                                </div>
                                <div style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 600, color: colors.text }}>
                                  {item.name}
                                </div>
                                <div style={{ fontFamily: fonts.mono, fontSize: 8, color: colors.textMuted }}>
                                  {item.files} files · {item.date}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
