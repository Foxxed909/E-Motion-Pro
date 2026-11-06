"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

const COLS = 6;

/** Route transition: staggered columns sweep away to reveal each new page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[80] flex" aria-hidden>
        {Array.from({ length: COLS }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 origin-top bg-acid"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.9, ease: EASE.quart, delay: 0.05 * i }}
            style={{ transformOrigin: i % 2 ? "bottom" : "top" }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE.expo, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
