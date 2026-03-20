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
 * Scene 4 — Upload file modal. Shows drag-drop zone,
 * file appears, title rename, Upload button click.
 */
export const UploadFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (s: number) => Math.round(s * fps);

  const modalS = spring({
    frame, fps, delay: t(0.1),
    config: { damping: 20, stiffness: 140 },
  });

  // File drop animation
  const fileDropStart = t(1.0);
  const fileDropEnd = t(1.4);
  const fileDrop = interpolate(
    frame, [fileDropStart, fileDropEnd], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // After file drops: show selected state
  const showSelected = frame > t(1.6);

  // Title typewriter: "index" -> clear -> "Proto 1"
  const titleStart = t(2.0);
  const title1End = t(2.3);
  const clearStart = t(2.4);
  const title2Start = t(2.5);
  const title2End = t(2.9);

  let displayTitle = "index";
  if (frame >= titleStart && frame < clearStart) {
    const selectProgress = interpolate(frame, [titleStart, title1End], [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    displayTitle = selectProgress > 0.5 ? "index" : "index";
  }
  if (frame >= clearStart && frame < title2Start) {
    displayTitle = "";
  }
  if (frame >= title2Start) {
    const chars = interpolate(frame, [title2Start, title2End], [0, 7],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    displayTitle = "Proto 1".slice(0, Math.round(chars));
  }

  // Upload button
  const uploadClick = interpolate(
    frame, [t(3.2), t(3.4)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Loading state
  const isLoading = frame > t(3.4);
  const loadProgress = interpolate(
    frame, [t(3.4), t(3.8)], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cursor blink
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      {/* Dimmed gallery behind */}
      <AbsoluteFill style={{ opacity: 0.15 }}>
        <div style={{ padding: "80px 120px" }}>
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
          <div style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 4 }}>
            Add to Gallery
          </div>
          <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted, marginBottom: 24 }}>
            0 / 50 files used · max 5 MB each
          </div>

          {/* Drop zone */}
          <div style={{
            border: `2px dashed ${fileDrop > 0 ? colors.accentLight : colors.textDim}`,
            borderRadius: 12,
            padding: "36px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
            background: fileDrop > 0 ? `${colors.accent}08` : "transparent",
          }}>
            {/* Upload icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 15V3m0 0l-4 4m4-4l4 4" />
              <path d="M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
            </svg>
            <div style={{ fontFamily: fonts.body, fontSize: 15, color: colors.textMuted }}>
              Drop .html files here or click to browse
            </div>

            {/* Dropping file animation */}
            {fileDrop > 0 && fileDrop < 1 && (
              <div style={{
                position: "absolute",
                background: colors.accentBg,
                border: `1px solid ${colors.accent}`,
                borderRadius: 6,
                padding: "6px 12px",
                fontFamily: fonts.mono, fontSize: 13, color: colors.accentLight,
                opacity: fileDrop,
                transform: `translateY(${interpolate(fileDrop, [0, 1], [-30, 0])}px)`,
              }}>
                index.html
              </div>
            )}
          </div>

          {/* File selected state */}
          {showSelected && (
            <div style={{
              opacity: interpolate(frame, [t(1.6), t(1.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <div style={{ fontFamily: fonts.body, fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 4 }}>
                1 file selected
              </div>
              <div style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
                index.html (45.2 KB)
              </div>

              {/* Title input */}
              <div style={{
                display: "flex", gap: 12, alignItems: "center",
              }}>
                <div style={{
                  flex: 1,
                  background: colors.bgInput, borderRadius: 8, padding: "10px 14px",
                  border: `1px solid ${colors.border}`,
                  display: "flex", alignItems: "center",
                }}>
                  <span style={{
                    fontFamily: fonts.body, fontSize: 15,
                    color: frame >= clearStart && displayTitle === "" ? colors.textDim : colors.text,
                  }}>
                    {displayTitle || " "}
                  </span>
                  {frame >= titleStart && frame < t(3.0) && cursorBlink && (
                    <div style={{ width: 2, height: 18, backgroundColor: colors.accentLight, marginLeft: 1 }} />
                  )}
                </div>

                {/* Upload button */}
                <div style={{
                  fontFamily: fonts.body, fontSize: 14, fontWeight: 600,
                  color: colors.bg,
                  background: isLoading ? colors.accentLight : colors.accent,
                  padding: "10px 20px", borderRadius: 8,
                  whiteSpace: "nowrap",
                  transform: `scale(${uploadClick > 0.5 ? 0.96 : 1})`,
                }}>
                  {isLoading ? (
                    <span>
                      Uploading{loadProgress < 1 ? "..." : ""}
                    </span>
                  ) : "Upload"}
                </div>
              </div>
            </div>
          )}

          {/* URL import option */}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textDim, marginBottom: 8 }}>or</div>
            <div style={{
              display: "flex", gap: 8, alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                background: colors.bgInput, borderRadius: 8, padding: "10px 14px",
                border: `1px solid ${colors.borderSubtle}`, flex: 1,
              }}>
                <span style={{ fontFamily: fonts.body, fontSize: 13, color: colors.textDim }}>
                  Paste any URL - Vercel, CodePen, Lovable...
                </span>
              </div>
              <div style={{
                fontFamily: fonts.body, fontSize: 14, fontWeight: 500,
                color: colors.accent, padding: "10px 14px",
              }}>
                Import
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.textMuted }}>
              Cancel
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
