"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { MOCK_PAGES, MockPage } from "../shared/MockPage";

const N = 7;

/** The outgoing page is cut into skewed slices that fly out in alternating directions. */
export default function SliceSwipe() {
  const [page, setPage] = useState(0);
  const [out, setOut] = useState<number | null>(null);
  useEffect(() => {
    const id = setInterval(() => {
      setPage((p) => {
        setOut(p);
        return (p + 1) % MOCK_PAGES.length;
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <MockPage page={MOCK_PAGES[page]} />
      {out !== null &&
        Array.from({ length: N }).map((_, i) => {
          const top = (i / N) * 100;
          const bottom = 100 - ((i + 1) / N) * 100;
          return (
            <motion.div
              key={`${out}-${i}`}
              className="absolute inset-0"
              style={{ clipPath: `polygon(0 ${top - 4}%, 100% ${top + 4}%, 100% ${100 - bottom + 4}%, 0 ${100 - bottom - 4}%)` }}
              initial={{ x: "0%" }}
              animate={{ x: i % 2 ? "105%" : "-105%" }}
              transition={{ duration: 0.9, ease: EASE.quart, delay: 0.04 * Math.abs(i - (N - 1) / 2) }}
              onAnimationComplete={() => i === N - 1 && setOut(null)}
            >
              <MockPage page={MOCK_PAGES[out]} />
            </motion.div>
          );
        })}
    </div>
  );
}
