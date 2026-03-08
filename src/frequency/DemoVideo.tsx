import React from "react";
import { useVideoConfig } from "remotion";
import { z } from "zod";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { HeroIntro } from "./scenes/HeroIntro";
import { SelectRepo } from "./scenes/SelectRepo";
import { StartSkill } from "./scenes/StartSkill";
import { LinesAppear } from "./scenes/LinesAppear";
import { IdeasPipeline } from "./scenes/IdeasPipeline";
import { BuildPipeline } from "./scenes/BuildPipeline";
import { DeployChecklist } from "./scenes/DeployChecklist";
import { RepoUpdates } from "./scenes/RepoUpdates";
import { HubLive } from "./scenes/HubLive";
import { Outro } from "./scenes/Outro";

export const DemoVideoSchema = z.object({});

export const DemoVideo: React.FC<z.infer<typeof DemoVideoSchema>> = () => {
  const { fps } = useVideoConfig();
  const t = (seconds: number) => Math.round(seconds * fps);

  // Smooth spring fade — no bounce, natural deceleration
  const smoothFade = (dur: number) =>
    springTiming({ config: { damping: 200 }, durationInFrames: t(dur) });

  // Slightly faster slide
  const smoothSlide = (dur: number) =>
    springTiming({ config: { damping: 200 }, durationInFrames: t(dur) });

  return (
    <TransitionSeries>
      {/* Scene 1: Hero intro */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <HeroIntro />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.7)}
      />

      {/* Scene 2: Select target repo */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <SelectRepo />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* Scene 3: Start Frequency skill */}
      <TransitionSeries.Sequence durationInFrames={t(6)}>
        <StartSkill />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.7)}
      />

      {/* Scene 4: Lines build + Run All */}
      <TransitionSeries.Sequence durationInFrames={t(5)}>
        <LinesAppear />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={smoothSlide(0.5)}
      />

      {/* Scene 5: Ideas pipeline */}
      <TransitionSeries.Sequence durationInFrames={t(5.5)}>
        <IdeasPipeline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={smoothSlide(0.5)}
      />

      {/* Scene 6: Build pipeline */}
      <TransitionSeries.Sequence durationInFrames={t(5.5)}>
        <BuildPipeline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* Scene 7: Deploy checklist */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <DeployChecklist />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={smoothSlide(0.5)}
      />

      {/* Scene 8: Repo updates */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <RepoUpdates />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* Scene 9: Hub live */}
      <TransitionSeries.Sequence durationInFrames={t(5)}>
        <HubLive />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.7)}
      />

      {/* Scene 10: Outro */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
