"use client";

import { motion } from "motion/react";

/** Route transition: a short, quiet fade (opacity only, so it never moves fixed or sticky elements). */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
