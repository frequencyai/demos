import React from "react";
import { useVideoConfig } from "remotion";
import { z } from "zod";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { HeroIntro } from "./scenes/HeroIntro";
import { ArchitectureFlow } from "./scenes/ArchitectureFlow";
import { SelectRepo } from "./scenes/SelectRepo";
import { StartSkill } from "./scenes/StartSkill";
import { LinesAppear } from "./scenes/LinesAppear";
import { IdeasPipeline } from "./scenes/IdeasPipeline";
import { BuildPipeline } from "./scenes/BuildPipeline";
import { DeployChecklist } from "./scenes/DeployChecklist";
import { HubLive } from "./scenes/HubLive";
import { BeforeAfter } from "./scenes/BeforeAfter";
import { FeatureGrid } from "./scenes/FeatureGrid";
import { Outro } from "./scenes/Outro";

export const DemoVideoSchema = z.object({});

export const DemoVideo: React.FC<z.infer<typeof DemoVideoSchema>> = () => {
  const { fps } = useVideoConfig();
  const t = (seconds: number) => Math.round(seconds * fps);

  // Smooth spring fade — no bounce, natural deceleration
  const smoothFade = (dur: number) =>
    springTiming({ config: { damping: 200 }, durationInFrames: t(dur) });

  return (
    <TransitionSeries>
      {/* 1. Hero intro */}
      <TransitionSeries.Sequence durationInFrames={t(4)}>
        <HeroIntro />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.8)}
      />

      {/* 2. Architecture flow — how Frequency works */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <ArchitectureFlow />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.7)}
      />

      {/* 3. Select target repo — start the demo */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <SelectRepo />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.7)}
      />

      {/* 4. Start Frequency skill */}
      <TransitionSeries.Sequence durationInFrames={t(7.5)}>
        <StartSkill />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* 5. Lines build + Run All */}
      <TransitionSeries.Sequence durationInFrames={t(6.5)}>
        <LinesAppear />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* 6. Ideas pipeline */}
      <TransitionSeries.Sequence durationInFrames={t(7)}>
        <IdeasPipeline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* 7. Build pipeline */}
      <TransitionSeries.Sequence durationInFrames={t(8)}>
        <BuildPipeline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* 8. Deploy checklist */}
      <TransitionSeries.Sequence durationInFrames={t(6)}>
        <DeployChecklist />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* 9. Hub live — shipped results */}
      <TransitionSeries.Sequence durationInFrames={t(6.5)}>
        <HubLive />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* 10. Before / After — the contrast */}
      <TransitionSeries.Sequence durationInFrames={t(4)}>
        <BeforeAfter />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* 11. Feature grid — capabilities */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <FeatureGrid />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.8)}
      />

      {/* 12. Outro */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
