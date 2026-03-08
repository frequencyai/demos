import { z } from "zod";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { fonts } from "./theme";

const fontFamily = fonts.mono;

export const FrequencyShowcaseSchema = z.object({
  productName: z.string(),
  tagline: z.string(),
  accentColor: z.string(),
});

type Props = z.infer<typeof FrequencyShowcaseSchema>;

// --- Scenes ---

const IntroScene: React.FC<Props> = ({ productName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = interpolate(frame, [0, 1 * fps], [40, 0], {
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [0.3 * fps, 1.2 * fps], [0, 320], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#0a0e1a", fontFamily }}
      className="flex items-center justify-center"
    >
      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      <div className="flex flex-col items-center gap-6">
        <h1
          className="text-8xl font-bold tracking-tight"
          style={{
            color: accentColor,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {productName}
        </h1>
        <div
          className="h-0.5"
          style={{
            width: lineWidth,
            backgroundColor: accentColor,
            opacity: 0.8,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const TaglineScene: React.FC<Props> = ({ tagline, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.6 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const charCount = Math.floor(
    interpolate(frame, [0.2 * fps, 2 * fps], [0, tagline.length], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#0a0e1a", fontFamily }}
      className="flex items-center justify-center"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      <div className="flex flex-col items-center gap-8 px-20">
        <p
          className="text-5xl font-medium text-center leading-tight"
          style={{ color: "#e2e8f0", opacity }}
        >
          {tagline.slice(0, charCount)}
          <span
            style={{
              color: accentColor,
              opacity: frame % (fps / 2) < fps / 4 ? 1 : 0,
            }}
          >
            _
          </span>
        </p>
      </div>
    </AbsoluteFill>
  );
};

const FeatureScene: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { label: "YAML specs", icon: "{ }" },
    { label: "Pipeline engine", icon: ">>>" },
    { label: "Live dashboard", icon: "[ ]" },
  ];

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#0a0e1a", fontFamily }}
      className="flex items-center justify-center"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      <div className="flex gap-16">
        {features.map((f, i) => {
          const delay = i * 0.3 * fps;
          const opacity = interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const y = interpolate(frame, [delay, delay + 0.5 * fps], [30, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });

          return (
            <div
              key={f.label}
              className="flex flex-col items-center gap-4"
              style={{ opacity, transform: `translateY(${y}px)` }}
            >
              <div
                className="w-28 h-28 rounded-lg flex items-center justify-center text-3xl font-bold"
                style={{
                  border: `2px solid ${accentColor}`,
                  color: accentColor,
                  backgroundColor: "rgba(255, 68, 0, 0.08)",
                }}
              >
                {f.icon}
              </div>
              <span className="text-xl text-slate-300 font-medium">
                {f.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<Props> = ({ productName, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const glowRadius = interpolate(frame, [0, 2 * fps], [0, 60], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#0a0e1a", fontFamily }}
      className="flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-6" style={{ opacity }}>
        <h1
          className="text-9xl font-bold"
          style={{
            color: accentColor,
            textShadow: `0 0 ${glowRadius}px ${accentColor}40`,
          }}
        >
          {productName}
        </h1>
        <p className="text-2xl text-slate-400 tracking-widest uppercase">
          frequencyai.com
        </p>
      </div>
    </AbsoluteFill>
  );
};

// --- Main Composition ---

export const FrequencyShowcase: React.FC<Props> = (props) => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={4 * fps}>
        <IntroScene {...props} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={3.5 * fps}>
        <TaglineScene {...props} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={4 * fps}>
        <FeatureScene accentColor={props.accentColor} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: Math.round(0.6 * fps) })}
      />

      <TransitionSeries.Sequence durationInFrames={4 * fps}>
        <OutroScene {...props} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
