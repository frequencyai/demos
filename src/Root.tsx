import { Composition, Folder } from "remotion";
import "./index.css";

import { FrequencyShowcase, FrequencyShowcaseSchema } from "./frequency/Showcase";
import { DemoVideo, DemoVideoSchema } from "./frequency/DemoVideo";
import { DemoVideoV2, DemoVideoV2Schema } from "./frequency-v2/DemoVideoV2";
import { ShowroomDemo, ShowroomDemoSchema } from "./showroom/ShowroomDemo";

// Total duration: 12 scenes (~68.5s) minus ~6.6s transitions ≈ 61.9s
const DEMO_DURATION_FRAMES = 1830;

// V2: 10 scenes (~25.6s) minus ~1.8s transitions ≈ 23.8s
const DEMO_V2_DURATION_FRAMES = 721;

// Showroom: 9 scenes (~32.3s) minus ~1.9s transitions ≈ 30.4s
const SHOWROOM_DURATION_FRAMES = 913;

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
      <Folder name="Frequency-V2">
        <Composition
          id="FrequencyDemoV2"
          component={DemoVideoV2}
          schema={DemoVideoV2Schema}
          durationInFrames={DEMO_V2_DURATION_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{}}
        />
      </Folder>
      <Folder name="Showroom">
        <Composition
          id="ShowroomDemo"
          component={ShowroomDemo}
          schema={ShowroomDemoSchema}
          durationInFrames={SHOWROOM_DURATION_FRAMES}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{}}
        />
      </Folder>
    </>
  );
};
