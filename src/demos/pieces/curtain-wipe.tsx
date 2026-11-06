"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { MOCK_PAGES, MockPage } from "../shared/MockPage";

const N = 5;

export default function CurtainWipe() {
  const [page, setPage] = useState(0);
  const [covering, setCovering] = useState(false);
  const next = MOCK_PAGES[(page + 1) % MOCK_PAGES.length];
  useEffect(() => {
    const id = setInterval(() => setCovering(true), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <MockPage page={MOCK_PAGES[page]} />
      <AnimatePresence>
        {covering && (
          <div className="absolute inset-0 flex">
            {Array.from({ length: N }).map((_, i) => (
              <motion.div
                key={i}
                className="relative h-full flex-1"
                style={{ background: next.bg === "#0e0e12" ? "#d4ff3a" : "#0b0b0b" }}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.65, ease: EASE.quart, delay: i * 0.06 }}
                onAnimationComplete={(def) => {
                  if (i === N - 1 && (def as { y?: string }).y === "0%") {
                    setPage((p) => (p + 1) % MOCK_PAGES.length);
                    setTimeout(() => setCovering(false), 120);
                  }
                }}
              />
            ))}
            <motion.span
              className="absolute inset-0 flex items-center justify-center font-mono text-[max(10px,1.5cqw)] uppercase tracking-[0.4em] mix-blend-difference text-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              → {next.name}
            </motion.span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
