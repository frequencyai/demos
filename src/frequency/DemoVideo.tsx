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
import { HubLive } from "./scenes/HubLive";
import { Outro } from "./scenes/Outro";
import { TextSlide } from "./components/TextSlide";

export const DemoVideoSchema = z.object({});

export const DemoVideo: React.FC<z.infer<typeof DemoVideoSchema>> = () => {
  const { fps } = useVideoConfig();
  const t = (seconds: number) => Math.round(seconds * fps);

  // Smooth spring fade — no bounce, natural deceleration
  const smoothFade = (dur: number) =>
    springTiming({ config: { damping: 200 }, durationInFrames: t(dur) });

  return (
    <TransitionSeries>
      {/* Scene 1: Hero intro */}
      <TransitionSeries.Sequence durationInFrames={t(5)}>
        <HeroIntro />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.8)}
      />

      {/* Scene 2: Select target repo */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <SelectRepo />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.7)}
      />

      {/* Scene 3: Start Frequency skill */}
      <TransitionSeries.Sequence durationInFrames={t(7.5)}>
        <StartSkill />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* Scene 4: Lines build + Run All */}
      <TransitionSeries.Sequence durationInFrames={t(6.5)}>
        <LinesAppear />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* TEXT: parallel pipelines */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <TextSlide
          parts={[
            { text: "parallel pipelines," },
            { text: "one", accent: true },
            { text: "command", bold: true },
          ]}
          sub="autonomous agent orchestration"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* Scene 5: Ideas pipeline */}
      <TransitionSeries.Sequence durationInFrames={t(7)}>
        <IdeasPipeline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* TEXT: orchestration */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <TextSlide
          parts={[
            { text: "agents build." },
            { text: "frequency", accent: true },
            { text: "orchestrates.", bold: true },
          ]}
          sub="cross-pipeline coordination"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* Scene 6: Build pipeline */}
      <TransitionSeries.Sequence durationInFrames={t(8)}>
        <BuildPipeline />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* TEXT: quality controls */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <TextSlide
          parts={[
            { text: "every step" },
            { text: "verified.", bold: true },
          ]}
          sub="retries \u2022 failure isolation \u2022 dependency checks"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.5)}
      />

      {/* Scene 7: Deploy checklist */}
      <TransitionSeries.Sequence durationInFrames={t(6)}>
        <DeployChecklist />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* TEXT: results */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <TextSlide
          parts={[
            { text: "from config" },
            { text: "to", accent: true },
            { text: "production.", bold: true },
          ]}
          sub="30+ apps shipped autonomously"
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.6)}
      />

      {/* Scene 8: Hub live */}
      <TransitionSeries.Sequence durationInFrames={t(6.5)}>
        <HubLive />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={smoothFade(0.8)}
      />

      {/* Scene 9: Outro */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
