import { loadFont as loadAlbertSans } from "@remotion/google-fonts/AlbertSans";
import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";

const albert = loadAlbertSans("normal", {
  weights: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const ibm = loadIBMPlexMono("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

export const albertSansFamily = albert.fontFamily;
export const ibmPlexMonoFamily = ibm.fontFamily;
