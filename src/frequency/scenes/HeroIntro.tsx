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
 * Scene 1 — Cinematic hero reveal.
 * The wave draws in with a glow trail, title springs up with stagger,
 * a ruled line sweeps across, tagline types itself in.
 */
export const HeroIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Wave draw-in with glow ──
  const waveProgress = interpolate(frame, [8, 1.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const waveGlow = interpolate(
    frame,
    [0.5 * fps, 1.2 * fps, 2 * fps],
    [0, 20, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Title letters spring in with stagger ──
  const title = "FREQUENCY";
  const letterEntries = title.split("").map((char, i) => {
    const s = spring({
      frame,
      fps,
      delay: Math.round(0.7 * fps + i * 2),
      config: { damping: 14, stiffness: 180, mass: 0.8 },
    });
    return { char, progress: s };
  });

  // ── Dot appears with bounce ──
  const dotSpring = spring({
    frame,
    fps,
    delay: Math.round(1.2 * fps),
    config: { damping: 8, stiffness: 200 },
  });
  const dotGlow = interpolate(
    frame % Math.round(2 * fps),
    [0, fps, 2 * fps],
    [8, 28, 8]
  );

  // ── Ruled line sweeps ──
  const lineWidth = interpolate(
    frame,
    [1.4 * fps, 2.2 * fps],
    [0, 400],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // ── Tagline typewriter ──
  const tagline = "Autonomous workflow automation";
  const tagStart = 2.0 * fps;
  const charFrames = 1.5;
  const typedCount = Math.min(
    tagline.length,
    Math.max(0, Math.floor((frame - tagStart) / charFrames))
  );
  const tagOpacity = interpolate(frame, [tagStart, tagStart + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorVisible =
    frame >= tagStart && frame % Math.round(fps / 2) < fps / 4;

  // ── Subtle vignette ──
  const vignetteOpacity = interpolate(frame, [0, fps], [0, 0.6], {
    extrapolateRight: "clamp",
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
      {/* Radial vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, ${colors.bg} 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Corner marks */}
      {[
        { top: 0, left: 0, borderTop: true, borderLeft: true },
        { top: 0, right: 0, borderTop: true, borderRight: true },
        { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
        { bottom: 0, right: 0, borderBottom: true, borderRight: true },
      ].map((pos, i) => {
        const markSpring = spring({
          frame,
          fps,
          delay: Math.round(0.2 * fps + i * 4),
          config: { damping: 200 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...Object.fromEntries(
                Object.entries(pos).filter(
                  ([k]) => !k.startsWith("border")
                )
              ),
              width: 24,
              height: 24,
              borderTop: pos.borderTop
                ? `1px solid ${colors.accent}`
                : "none",
              borderBottom: pos.borderBottom
                ? `1px solid ${colors.accent}`
                : "none",
              borderLeft: pos.borderLeft
                ? `1px solid ${colors.accent}`
                : "none",
              borderRight: pos.borderRight
                ? `1px solid ${colors.accent}`
                : "none",
              opacity: 0.5 * markSpring,
              transform: `scale(${markSpring})`,
              zIndex: 20,
            }}
          />
        );
      })}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* Large wave logo */}
        <svg
          width={220}
          height={120}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: `drop-shadow(0 0 ${waveGlow}px ${colors.accent})`,
          }}
        >
          <path
            d={LOGO_WAVE_PATH}
            stroke={colors.accent}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset={60 * (1 - waveProgress)}
          />
        </svg>

        {/* Title — staggered spring letters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {letterEntries.map(({ char, progress }, i) => (
            <span
              key={i}
              style={{
                fontFamily: fonts.body,
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: colors.text,
                display: "inline-block",
                opacity: progress,
                transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px) scale(${interpolate(progress, [0, 1], [0.7, 1])})`,
              }}
            >
              {char}
            </span>
          ))}

          {/* Glowing dot */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: colors.accent,
              marginLeft: 12,
              opacity: dotSpring,
              transform: `scale(${dotSpring})`,
              boxShadow: `0 0 ${dotGlow}px ${colors.accent}, 0 0 ${dotGlow * 2}px rgba(255, 68, 0, 0.3)`,
            }}
          />
        </div>

        {/* Ruled sweep line */}
        <div
          style={{
            height: 1,
            width: lineWidth,
            background: `linear-gradient(90deg, transparent, ${colors.accent} 20%, ${colors.accent} 80%, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Tagline typewriter */}
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 15,
            color: colors.textTertiary,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: tagOpacity,
            minHeight: 20,
          }}
        >
          <span>{tagline.slice(0, typedCount)}</span>
          <span
            style={{
              color: colors.accent,
              opacity: cursorVisible ? 1 : 0,
            }}
          >
            |
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
