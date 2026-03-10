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

/**
 * Scene 9 — Outro. Logo scales in with bounce, tagline + URL fade up.
 * Subtle accent glow radiates from center.
 */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance with bounce
  const logoSpring = spring({
    frame,
    fps,
    delay: Math.round(0.2 * fps),
    config: { damping: 10, stiffness: 140 },
  });

  // Wave path draw
  const waveDraw = interpolate(frame, [0.1 * fps, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Title springs per letter
  const title = "FREQUENCY";
  const letterSprings = title.split("").map((_, i) =>
    spring({
      frame,
      fps,
      delay: Math.round(0.4 * fps + i * 2),
      config: { damping: 14, stiffness: 180, mass: 0.8 },
    })
  );

  // Dot
  const dotSpring = spring({
    frame,
    fps,
    delay: Math.round(0.7 * fps),
    config: { damping: 8, stiffness: 200 },
  });
  const dotGlow = interpolate(frame % Math.round(2 * fps), [0, fps, 2 * fps], [8, 28, 8]);

  // Tagline
  const tagSpring = spring({
    frame,
    fps,
    delay: Math.round(1.0 * fps),
    config: { damping: 200 },
  });

  // URL
  const urlSpring = spring({
    frame,
    fps,
    delay: Math.round(1.3 * fps),
    config: { damping: 200 },
  });

  // Accent glow
  const glowSize = interpolate(frame, [0.3 * fps, 2 * fps], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255, 68, 0, 0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Corner marks */}
      {[
        { top: 0, left: 0, bT: true, bL: true },
        { top: 0, right: 0, bT: true, bR: true },
        { bottom: 0, left: 0, bB: true, bL: true },
        { bottom: 0, right: 0, bB: true, bR: true },
      ].map((pos, i) => {
        const m = spring({ frame, fps, delay: Math.round(0.5 * fps + i * 3), config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: pos.top, right: (pos as any).right, bottom: (pos as any).bottom, left: pos.left,
              width: 24, height: 24,
              borderTop: pos.bT ? `1px solid ${colors.accent}` : "none",
              borderBottom: pos.bB ? `1px solid ${colors.accent}` : "none",
              borderLeft: pos.bL ? `1px solid ${colors.accent}` : "none",
              borderRight: pos.bR ? `1px solid ${colors.accent}` : "none",
              opacity: 0.5 * m, zIndex: 20,
            }}
          />
        );
      })}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        {/* Wave + title row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg
            width={56} height={56} viewBox="0 0 32 32" fill="none"
            style={{
              opacity: logoSpring,
              transform: `scale(${logoSpring})`,
              filter: `drop-shadow(0 0 ${waveDraw * 12}px ${colors.accent})`,
            }}
          >
            <path
              d={LOGO_WAVE_PATH}
              stroke={colors.accent}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="60"
              strokeDashoffset={60 * (1 - waveDraw)}
            />
          </svg>

          {/* Title letters */}
          <div style={{ display: "flex", gap: 1 }}>
            {title.split("").map((char, i) => (
              <span
                key={i}
                style={{
                  fontFamily: fonts.body,
                  fontSize: 72,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: colors.text,
                  display: "inline-block",
                  opacity: letterSprings[i],
                  transform: `translateY(${interpolate(letterSprings[i], [0, 1], [20, 0])}px)`,
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Dot */}
          <div
            style={{
              width: 14, height: 14, borderRadius: "50%",
              backgroundColor: colors.accent,
              opacity: dotSpring,
              transform: `scale(${dotSpring})`,
              boxShadow: `0 0 ${dotGlow}px ${colors.accent}, 0 0 ${dotGlow * 2}px rgba(255, 68, 0, 0.3)`,
            }}
          />
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: 14,
            color: colors.textTertiary,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            opacity: tagSpring,
            transform: `translateY(${interpolate(tagSpring, [0, 1], [10, 0])}px)`,
          }}
        >
          Autonomous workflow automation
        </p>

        {/* URL */}
        <p
          style={{
            fontFamily: fonts.mono,
            fontSize: 16,
            color: colors.accent,
            letterSpacing: "0.1em",
            opacity: urlSpring,
            transform: `translateY(${interpolate(urlSpring, [0, 1], [10, 0])}px)`,
          }}
        >
          github.com/frequencyai
        </p>
      </div>
    </AbsoluteFill>
  );
};
