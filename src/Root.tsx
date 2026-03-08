import { Composition, Folder } from "remotion";
import "./index.css";

import { FrequencyShowcase, FrequencyShowcaseSchema } from "./frequency/Showcase";
import { DemoVideo, DemoVideoSchema } from "./frequency/DemoVideo";

// Total duration: 10 scenes (~45.5s) minus ~5.6s transitions ≈ 40s
const DEMO_DURATION_FRAMES = 1200;

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Frequency">
        <Composition
          id="FrequencyDemo"
          component={DemoVideo}
          schema={DemoVideoSchema}
          durationInFrames={DEMO_DURATION_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{}}
        />
        <Composition
          id="FrequencyShowcase"
          component={FrequencyShowcase}
          schema={FrequencyShowcaseSchema}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            productName: "Frequency",
            tagline: "Config-driven workflow automation",
            accentColor: "#FF4400",
          }}
        />
      </Folder>
    </>
  );
};
