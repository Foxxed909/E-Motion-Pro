"use client";

// Lazy component map for every motion piece (code-split per piece).
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DemoProps } from "./types";

const load = (f: () => Promise<{ default: ComponentType<DemoProps> }>) => dynamic(f, { ssr: false, loading: () => null });

export const PIECES: Record<string, ComponentType<DemoProps>> = {
  "font-roulette": load(() => import("./pieces/font-roulette")),
  "split-reveal": load(() => import("./pieces/split-reveal")),
  "decoder": load(() => import("./pieces/decoder")),
  "magnetic-type": load(() => import("./pieces/magnetic-type")),
  "velocity-marquee": load(() => import("./pieces/velocity-marquee")),
  "curtain-wipe": load(() => import("./pieces/curtain-wipe")),
  "circle-portal": load(() => import("./pieces/circle-portal")),
  "pixel-dissolve": load(() => import("./pieces/pixel-dissolve")),
  "shared-zoom": load(() => import("./pieces/shared-zoom")),
  "liquid-buttons": load(() => import("./pieces/liquid-buttons")),
  "morph-toggles": load(() => import("./pieces/morph-toggles")),
  "submit-flow": load(() => import("./pieces/submit-flow")),
  "elastic-slider": load(() => import("./pieces/elastic-slider")),
  "dynamic-pill": load(() => import("./pieces/dynamic-pill")),
  "card-stack": load(() => import("./pieces/card-stack")),
  "bottom-sheet": load(() => import("./pieces/bottom-sheet")),
  "tab-morph": load(() => import("./pieces/tab-morph")),
  "notification-stack": load(() => import("./pieces/notification-stack")),
  "parallax-peaks": load(() => import("./pieces/parallax-peaks")),
  "stacking-cards": load(() => import("./pieces/stacking-cards")),
  "word-light": load(() => import("./pieces/word-light")),
  "aurora": load(() => import("./pieces/aurora")),
  "liquid-chrome": load(() => import("./pieces/liquid-chrome")),
  "warp-tunnel": load(() => import("./pieces/warp-tunnel")),
  "plasma-orb": load(() => import("./pieces/plasma-orb")),
  "halftone-wave": load(() => import("./pieces/halftone-wave")),
  "particle-type": load(() => import("./pieces/particle-type")),
  "flow-field": load(() => import("./pieces/flow-field")),
  "constellation-net": load(() => import("./pieces/constellation-net")),
  "holo-card": load(() => import("./pieces/holo-card")),
  "orbit-carousel": load(() => import("./pieces/orbit-carousel")),
  "exploded-ui": load(() => import("./pieces/exploded-ui")),
  "loader-lab": load(() => import("./pieces/loader-lab")),
  "liquid-progress": load(() => import("./pieces/liquid-progress")),
  "rgb-glitch": load(() => import("./pieces/rgb-glitch")),
  "crt-boot": load(() => import("./pieces/crt-boot")),
  "synth-horizon": load(() => import("./pieces/synth-horizon")),
  "chart-morph": load(() => import("./pieces/chart-morph")),
  "activity-rings": load(() => import("./pieces/activity-rings")),
  "gooey-blobs": load(() => import("./pieces/gooey-blobs")),
  "blob-morph": load(() => import("./pieces/blob-morph")),
  "swiss-shuffle": load(() => import("./pieces/swiss-shuffle")),
  "hover-index": load(() => import("./pieces/hover-index")),
};
