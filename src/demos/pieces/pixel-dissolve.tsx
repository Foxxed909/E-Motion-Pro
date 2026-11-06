"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { MOCK_PAGES, MockPage } from "../shared/MockPage";

const C = 10;
const R = 7;

export default function PixelDissolve() {
  const [page, setPage] = useState(0);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  useEffect(() => {
    if (phase === "idle") {
      const t = setTimeout(() => setPhase("in"), 1800);
      return () => clearTimeout(t);
    }
    const total = (C + R) * 0.035 + 0.45;
    const t = setTimeout(() => {
      if (phase === "in") {
        setPage((p) => (p + 1) % MOCK_PAGES.length);
        setPhase("out");
      } else setPhase("idle");
    }, total * 1000);
    return () => clearTimeout(t);
  }, [phase]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <MockPage page={MOCK_PAGES[page]} />
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${C}, 1fr)`, gridTemplateRows: `repeat(${R}, 1fr)` }}>
        {Array.from({ length: C * R }).map((_, k) => {
          const x = k % C;
          const y = Math.floor(k / C);
          const d = (x + y) * 0.035;
          return (
            <motion.div
              key={k}
              className="bg-acid"
              initial={false}
              animate={
                phase === "in"
                  ? { scale: 1.02, rotate: 0, borderRadius: "0%" }
                  : { scale: 0, rotate: phase === "out" ? 90 : -90, borderRadius: "50%" }
              }
              transition={{ duration: 0.45, ease: EASE.expo, delay: phase === "idle" ? 0 : d }}
            />
          );
        })}
      </div>
    </div>
  );
}
