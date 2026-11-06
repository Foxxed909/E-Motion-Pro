"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";
import { SoundFX } from "./Sound";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <SoundFX />
        {children}
      </SmoothScroll>
    </MotionConfig>
  );
}
