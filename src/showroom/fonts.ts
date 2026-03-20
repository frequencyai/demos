import { loadFont as loadPlayfairDisplay } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadWorkSans } from "@remotion/google-fonts/WorkSans";
import { loadFont as loadOverpassMono } from "@remotion/google-fonts/OverpassMono";

const playfair = loadPlayfairDisplay("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const playfairItalic = loadPlayfairDisplay("italic", {
  weights: ["400"],
  subsets: ["latin"],
});

const workSans = loadWorkSans("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const overpass = loadOverpassMono("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

export const playfairFamily = playfair.fontFamily;
export const workSansFamily = workSans.fontFamily;
export const overpassMonoFamily = overpass.fontFamily;
