import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { colors, fonts, LOGO_WAVE_PATH } from "../theme";

/**
 * Shared frame for info-graphic slides — matches the social HTML design language.
 * Provides: grid background, corner marks, header bar, badge.
 */
export const InfoSlideFrame: React.FC<{
  headerPath: string[];
  children: React.ReactNode;
}> = ({ headerPath, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.5 * fps),
  });

  const cornerStyle = (
    pos: Record<string, number>,
    bw: string
  ): React.CSSProperties => ({
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: `rgba(255,68,0,${0.5 * entrance})`,
    borderStyle: "solid",
    borderWidth: bw,
    zIndex: 50,
    opacity: entrance,
    ...pos,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        backgroundImage: `linear-gradient(rgba(234,236,232,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(234,236,232,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        overflow: "hidden",
      }}
    >
      {/* Corner marks */}
      <div style={cornerStyle({ top: 16, left: 16 }, "2px 0 0 2px")} />
      <div style={cornerStyle({ top: 16, right: 16 }, "2px 2px 0 0")} />
      <div style={cornerStyle({ bottom: 16, left: 16 }, "0 0 2px 2px")} />
      <div style={cornerStyle({ bottom: 16, right: 16 }, "0 2px 2px 0")} />

      {/* Header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          background: "rgba(11,12,15,0.9)",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          fontSize: 10,
          fontFamily: fonts.mono,
          color: "#D0D3DC",
          zIndex: 50,
          opacity: entrance,
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {headerPath.map((segment, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span style={{ color: "rgba(234,236,232,0.2)" }}>/</span>
              )}
              <span>{segment}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: colors.accent,
              boxShadow: `0 0 4px rgba(255,68,0,0.6), 0 0 10px rgba(255,68,0,0.3)`,
            }}
          />
          <span>LIVE</span>
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 40px",
        }}
      >
        {children}
      </div>

      {/* Badge */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 32,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 50,
          opacity: entrance,
        }}
      >
        <svg width={28} height={28} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill={colors.surface} stroke="rgba(234,236,232,0.1)" strokeWidth="1" />
          <path
            d={LOGO_WAVE_PATH}
            stroke={colors.accent}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 14,
            color: colors.text,
            letterSpacing: "0.02em",
          }}
        >
          FREQUENCY AI
        </span>
      </div>
    </AbsoluteFill>
  );
};
