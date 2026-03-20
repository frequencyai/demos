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
 * Scene 3 — "New Gallery" modal appears over dashboard.
 * Types gallery name, cursor clicks Create.
 */
export const CreateGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round(s * fps);

  // Modal entrance
  const modalS = spring({
    frame, fps, delay: t(0.15),
    config: { damping: 18, stiffness: 140 },
  });

  // Backdrop
  const backdropOpacity = interpolate(
    frame, [0, t(0.3)], [0, 0.6],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Typewriter for gallery name
  const fullName = "Showroom Prototypes";
  const typeStart = t(0.6);
  const typeEnd = t(1.8);
  const charCount = interpolate(
    frame, [typeStart, typeEnd], [0, fullName.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );
  const displayName = fullName.slice(0, Math.round(charCount));

  // Cursor blink
  const cursorVisible = Math.floor(frame / 8) % 2 === 0 || frame < typeEnd;

  // Button hover + click
  const btnHover = interpolate(
    frame, [t(2.4), t(2.7)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const clickFrame = t(2.9);
  const clickRipple = interpolate(
    frame, [clickFrame, clickFrame + 8], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cursor moves to Create button
  const cursorMove = interpolate(
    frame, [t(2.0), t(2.6)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );
  // Modal is 520px wide centered at (960,540)
  // Modal left=700, right=1220, padding 36px 40px
  // "Create" button is flex-end at bottom-right of modal content
  const cursorX = interpolate(cursorMove, [0, 1], [750, 1150]);
  const cursorY = interpolate(cursorMove, [0, 1], [480, 690]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Dimmed dashboard behind */}
      <AbsoluteFill style={{ opacity: 0.3 }}>
        <div style={{ padding: "100px 160px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: fonts.body, fontSize: 42, fontWeight: 300, color: colors.text }}>Your </span>
            <span style={{ fontFamily: fonts.display, fontSize: 42, fontStyle: "italic", color: colors.accentLight }}>Galleries</span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Backdrop */}
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${backdropOpacity})` }} />

      {/* Modal */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 520,
            background: colors.bgModal,
            borderRadius: 16,
            padding: "36px 40px",
            border: `1px solid ${colors.borderSubtle}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            opacity: modalS,
            transform: `translateY(${interpolate(modalS, [0, 1], [30, 0])}px) scale(${interpolate(modalS, [0, 1], [0.95, 1])})`,
          }}
        >
          <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 700, color: colors.text, marginBottom: 28 }}>
            New Gallery
          </div>

          {/* Name field */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
              Name
            </div>
            <div style={{
              background: colors.bgInput, borderRadius: 8, padding: "12px 16px",
              border: `1px solid ${colors.border}`,
              display: "flex", alignItems: "center",
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 16, color: colors.text }}>
                {displayName}
              </span>
              {cursorVisible && (
                <div style={{ width: 2, height: 20, backgroundColor: colors.accentLight, marginLeft: 1 }} />
              )}
            </div>
          </div>

          {/* Description field */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 8 }}>
              Description <span style={{ color: colors.textDim, fontWeight: 400 }}>(optional)</span>
            </div>
            <div style={{
              background: colors.bgInput, borderRadius: 8, padding: "12px 16px",
              border: `1px solid ${colors.borderSubtle}`,
            }}>
              <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textDim }}>
                What these prototypes explore...
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <div style={{
              fontFamily: fonts.body, fontSize: 15, fontWeight: 500, color: colors.textMuted,
              padding: "10px 20px", borderRadius: 8,
            }}>
              Cancel
            </div>
            <div style={{
              fontFamily: fonts.body, fontSize: 15, fontWeight: 600, color: colors.bg,
              background: btnHover > 0.5 ? colors.accentLight : colors.accent,
              padding: "10px 24px", borderRadius: 8,
              transform: `scale(${interpolate(btnHover, [0, 0.5, 1], [1, 1, 1.03])})`,
            }}>
              Create
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Cursor */}
      <div
        style={{
          position: "absolute", left: cursorX, top: cursorY,
          opacity: interpolate(frame, [t(1.8), t(2.0)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
          <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.54.35-.85L5.86 2.36a.5.5 0 0 0-.36-.15z" />
        </svg>
        {clickRipple > 0 && clickRipple < 1 && (
          <div style={{
            position: "absolute", top: -10, left: -10,
            width: 40, height: 40, borderRadius: "50%",
            border: `2px solid ${colors.accentLight}`,
            opacity: 1 - clickRipple,
            transform: `scale(${interpolate(clickRipple, [0, 1], [0.5, 2])})`,
          }} />
        )}
      </div>
    </AbsoluteFill>
  );
};
