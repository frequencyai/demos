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
 * Scene 6 — Invite modal with tabs (Invite Link / By Email).
 * Shows link tab, then switches to email tab, types email.
 */
export const InviteTeam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round(s * fps);

  const modalS = spring({
    frame, fps, delay: t(0.1),
    config: { damping: 18, stiffness: 140 },
  });

  // Tab switch: starts on "Invite Link", switches to "By Email"
  const switchTime = t(1.5);
  const isEmailTab = frame >= switchTime;

  const tabSwitch = interpolate(
    frame, [switchTime, switchTime + 8], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Email typewriter
  const emailText = "rohan@frequency.sh";
  const typeStart = t(2.0);
  const typeEnd = t(3.2);
  const charCount = interpolate(
    frame, [typeStart, typeEnd], [0, emailText.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );
  const displayEmail = emailText.slice(0, Math.round(charCount));

  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Dimmed gallery behind */}
      <AbsoluteFill style={{ opacity: 0.15 }}>
        <div style={{ padding: "100px 120px" }}>
          <div style={{ fontFamily: fonts.body, fontSize: 36, fontWeight: 700, color: colors.text }}>
            Showroom Prototypes
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.5)" }} />

      {/* Modal */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 540,
          background: colors.bgModal,
          borderRadius: 16,
          padding: "32px 36px",
          border: `1px solid ${colors.borderSubtle}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          opacity: modalS,
          transform: `translateY(${interpolate(modalS, [0, 1], [20, 0])}px)`,
        }}>
          <div style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: 700, color: colors.text, marginBottom: 24 }}>
            Invite People
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
            {["Invite Link", "By Email"].map((tab, i) => {
              const isActive = (i === 0 && !isEmailTab) || (i === 1 && isEmailTab);
              return (
                <div key={tab} style={{
                  padding: "8px 20px",
                  fontFamily: fonts.mono, fontSize: 14, fontWeight: isActive ? 600 : 400,
                  color: isActive ? colors.text : colors.textMuted,
                  borderBottom: isActive ? `2px solid ${colors.accent}` : `2px solid transparent`,
                }}>
                  {tab}
                </div>
              );
            })}
          </div>

          {/* Tab content */}
          {!isEmailTab ? (
            // Invite Link tab
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted }}>
                  Expires in
                </div>
                <div style={{
                  background: colors.bgInput, borderRadius: 6, padding: "6px 12px",
                  border: `1px solid ${colors.borderSubtle}`,
                  fontFamily: fonts.body, fontSize: 14, color: colors.text,
                }}>
                  7 days
                </div>
                <div style={{
                  background: colors.accent, borderRadius: 8, padding: "8px 18px",
                  fontFamily: fonts.body, fontSize: 14, fontWeight: 600, color: colors.bg,
                }}>
                  Create Link
                </div>
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>
                No active invite links. Create one above — anyone with the link can join this gallery.
              </div>
            </div>
          ) : (
            // By Email tab
            <div style={{ opacity: tabSwitch }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  flex: 1,
                  background: colors.bgInput, borderRadius: 8, padding: "12px 16px",
                  border: `1px solid ${colors.border}`,
                  display: "flex", alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: fonts.body, fontSize: 15,
                    color: displayEmail ? colors.text : colors.textDim,
                  }}>
                    {displayEmail || "colleague@company.com"}
                  </span>
                  {frame >= typeStart && cursorBlink && (
                    <div style={{ width: 2, height: 18, backgroundColor: colors.accentLight, marginLeft: 1 }} />
                  )}
                </div>
                <div style={{
                  background: colors.accent, borderRadius: 8, padding: "12px 20px",
                  fontFamily: fonts.body, fontSize: 14, fontWeight: 600, color: colors.bg,
                }}>
                  Send
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted }}>Done</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
