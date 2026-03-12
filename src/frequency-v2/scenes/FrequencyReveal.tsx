import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { colors, fonts, LOGO_WAVE_PATH } from "../theme";

/**
 * Scene 5 — "Only made possible by" → FREQUENCY brand slam.
 * Phase 1 uses smooth ease-in (like intro). Camera pushes through on transition.
 */
export const FrequencyReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: smooth word-by-word
  const prefixWords: { text: string; serif?: boolean }[] = [
    { text: "Only" },
    { text: "made" },
    { text: "possible", serif: true },
    { text: "by" },
  ];

  const prefixProgress = prefixWords.map((_, i) => {
    const delay = Math.round(0.15 * fps + i * 0.1 * fps);
    return interpolate(
      frame,
      [delay, delay + 10],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      }
    );
  });

  // Phase 2: Brand reveal (starts at ~1.2s)
  const brandStart = Math.round(1.2 * fps);

  const gradientOpacity = interpolate(
    frame,
    [brandStart, brandStart + Math.round(0.3 * fps)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const prefixFadeOut = interpolate(
    frame,
    [brandStart - 4, brandStart + 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Camera: push-through → pull-back
  const pushPhase = interpolate(
    frame,
    [brandStart - 8, brandStart + 4],
    [1.0, 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );
  const pullBack = spring({
    frame,
    fps,
    delay: brandStart + 4,
    config: { damping: 16, stiffness: 70, mass: 1.3 },
  });
  const cameraScale =
    frame < brandStart + 4
      ? pushPhase
      : interpolate(pullBack, [0, 1], [1.5, 1.0]);

  // Wave draw
  const waveProgress = interpolate(
    frame,
    [brandStart + 4, brandStart + Math.round(0.6 * fps)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const titleSpring = spring({
    frame,
    fps,
    delay: brandStart + Math.round(0.15 * fps),
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });

  const tagSpring = spring({
    frame,
    fps,
    delay: brandStart + Math.round(0.6 * fps),
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Mint gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${colors.mintLight} 0%, ${colors.mintMid} 50%, ${colors.mintDark} 100%)`,
            opacity: gradientOpacity,
          }}
        />

        {/* Phase 1: words — smooth fade-in */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: prefixFadeOut,
          }}
        >
          <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
            {prefixWords.map((word, i) => {
              const delay = Math.round(0.15 * fps + i * 0.1 * fps);
              const colorVal = interpolate(
                frame,
                [delay, delay + 12],
                [180, 17],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: word.serif ? fonts.serif : fonts.body,
                    fontSize: word.serif ? 84 : 80,
                    fontWeight: word.serif ? 400 : 800,
                    fontStyle: word.serif ? "italic" : "normal",
                    color: `rgb(${Math.round(colorVal)}, ${Math.round(colorVal)}, ${Math.round(colorVal)})`,
                    opacity: prefixProgress[i],
                    transform: `translateY(${interpolate(prefixProgress[i], [0, 1], [8, 0])}px)`,
                    display: "inline-block",
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* Phase 2: Brand lockup */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: gradientOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <svg
              width={140}
              height={70}
              viewBox="0 0 32 32"
              fill="none"
              style={{
                filter: `drop-shadow(0 0 16px rgba(255,255,255,0.6))`,
              }}
            >
              <path
                d={LOGO_WAVE_PATH}
                stroke="#FFFFFF"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="60"
                strokeDashoffset={60 * (1 - waveProgress)}
              />
            </svg>

            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 100,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                opacity: titleSpring,
                transform: `scale(${interpolate(titleSpring, [0, 1], [0.7, 1])}) translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
                textShadow: "0 2px 24px rgba(0,0,0,0.12)",
              }}
            >
              FREQUENCY
            </div>

            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                opacity: tagSpring,
                transform: `translateY(${interpolate(tagSpring, [0, 1], [10, 0])}px)`,
              }}
            >
              Agent Orchestration
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
