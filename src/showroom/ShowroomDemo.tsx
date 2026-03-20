import React from "react";
import { useVideoConfig } from "remotion";
import { z } from "zod";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { HeroIntro } from "./scenes/HeroIntro";
import { DashboardView } from "./scenes/DashboardView";
import { CreateGallery } from "./scenes/CreateGallery";
import { UploadFlow } from "./scenes/UploadFlow";
import { GalleryDetail } from "./scenes/GalleryDetail";
import { InviteTeam } from "./scenes/InviteTeam";
import { SplitPreview } from "./scenes/SplitPreview";
import { ClosingCTA } from "./scenes/ClosingCTA";
import { Outro } from "./scenes/Outro";

export const ShowroomDemoSchema = z.object({});

/**
 * Showroom Demo — Dark theme product walkthrough.
 * Follows the screen recording flow: dashboard → create → upload → preview → invite → split view.
 */
export const ShowroomDemo: React.FC<z.infer<typeof ShowroomDemoSchema>> = () => {
  const { fps } = useVideoConfig();
  const t = (seconds: number) => Math.round(seconds * fps);

  const hardCut = () => linearTiming({ durationInFrames: 3 });
  const quickFade = (dur: number) =>
    springTiming({ config: { damping: 200 }, durationInFrames: t(dur) });

  return (
    <TransitionSeries>
      {/* 1. "Show your prototypes. Skip the meeting." */}
      <TransitionSeries.Sequence durationInFrames={t(3.0)}>
        <HeroIntro />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={quickFade(0.4)}
      />

      {/* 2. Dashboard with galleries */}
      <TransitionSeries.Sequence durationInFrames={t(3.8)}>
        <DashboardView />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 3. Create gallery modal */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <CreateGallery />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 4. Upload file flow */}
      <TransitionSeries.Sequence durationInFrames={t(4.2)}>
        <UploadFlow />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 5. Gallery detail with file */}
      <TransitionSeries.Sequence durationInFrames={t(3.0)}>
        <GalleryDetail />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={quickFade(0.3)}
      />

      {/* 6. Invite collaborators */}
      <TransitionSeries.Sequence durationInFrames={t(4.0)}>
        <InviteTeam />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={hardCut()}
      />

      {/* 7. Split pane preview */}
      <TransitionSeries.Sequence durationInFrames={t(4.5)}>
        <SplitPreview />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={quickFade(0.4)}
      />

      {/* 8. "Upload. Preview. Share." */}
      <TransitionSeries.Sequence durationInFrames={t(2.8)}>
        <ClosingCTA />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={quickFade(0.35)}
      />

      {/* 9. Outro — teal gradient brand */}
      <TransitionSeries.Sequence durationInFrames={t(3.5)}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
