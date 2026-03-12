import React from "react";
import { useVideoConfig } from "remotion";
import { z } from "zod";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { HookSleep } from "./scenes/HookSleep";
import { StatsImpact } from "./scenes/StatsImpact";
import { AppCascade } from "./scenes/AppCascade";
import { CostLine } from "./scenes/CostLine";
import { FrequencyReveal } from "./scenes/FrequencyReveal";
import { PipelineOrchestration } from "./scenes/PipelineOrchestration";
import { BuildFlow } from "./scenes/BuildFlow";
import { LiveProof } from "./scenes/LiveProof";
import { ClosingCTA } from "./scenes/ConfettiCTA";
import { OutroV2 } from "./scenes/OutroV2";

export const DemoVideoV2Schema = z.object({});

/**
 * Frequency V2 — Fast, punchy, kinetic typography demo.
 * Each scene trimmed 0.5s to eliminate dead air.
 */
export const DemoVideoV2: React.FC<z.infer<typeof DemoVideoV2Schema>> = () => {
  const { fps } = useVideoConfig();
  const t = (seconds: number) => Math.round(seconds * fps);

  const hardCut = () => linearTiming({ durationInFrames: 3 });
  const quickFade = (dur: number) =>
    springTiming({ config: { damping: 200 }, durationInFrames: t(dur) });

  return (
    <TransitionSeries>
      {/* 1. "Agents built apps while we slept." */}
      <TransitionSeries.Sequence durationInFrames={t(1.8)}>
        <HookSleep />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 2. Big "30" slam + stats */}
      <TransitionSeries.Sequence durationInFrames={t(2.4)}>
        <StatsImpact />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 3. App cascade — rapid-fire cards */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <AppCascade />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 4. "For a fraction of the cost." */}
      <TransitionSeries.Sequence durationInFrames={t(2.0)}>
        <CostLine />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={quickFade(0.3)}
      />

      {/* 5. "Only made possible by" → FREQUENCY on mint */}
      <TransitionSeries.Sequence durationInFrames={t(3.0)}>
        <FrequencyReveal />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={quickFade(0.3)}
      />

      {/* 6. Pipeline orchestration — dark dashboard */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <PipelineOrchestration />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={quickFade(0.3)}
      />

      {/* 7. Build flow — idea → live */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <BuildFlow />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 8. Live proof — browser with 3D tilt */}
      <TransitionSeries.Sequence durationInFrames={t(2.5)}>
        <LiveProof />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 9. "Stop prompting. Start orchestrating." */}
      <TransitionSeries.Sequence durationInFrames={t(2.3)}>
        <ClosingCTA />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={quickFade(0.35)}
      />

      {/* 10. Outro — mint gradient brand */}
      <TransitionSeries.Sequence durationInFrames={t(3.3)}>
        <OutroV2 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
