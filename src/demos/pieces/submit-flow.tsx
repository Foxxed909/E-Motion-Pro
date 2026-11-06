"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type S = "idle" | "loading" | "done";

export default function SubmitFlow({ mini }: { mini?: boolean }) {
  const [s, setS] = useState<S>("idle");
  const go = () => s === "idle" && setS("loading");
  useEffect(() => {
    if (s === "loading") {
      const t = setTimeout(() => setS("done"), 1600);
      return () => clearTimeout(t);
    }
    if (s === "done") {
      const t = setTimeout(() => setS("idle"), 1800);
      return () => clearTimeout(t);
    }
    if (mini) {
      const t = setTimeout(() => setS("loading"), 900);
      return () => clearTimeout(t);
    }
  }, [s, mini]);
  const W = s === "idle" ? "26cqw" : "9cqw";
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[5cqh]">
      <motion.button
        onClick={go}
        className="relative flex h-[9cqw] items-center justify-center overflow-hidden rounded-full font-mono text-[max(10px,1.5cqw)] uppercase tracking-[0.3em]"
        animate={{ width: W, backgroundColor: s === "done" ? "#2fbf71" : s === "loading" ? "#14141a" : "#d4ff3a" }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {s === "idle" && (
            <motion.span key="l" className="flex items-center gap-2 text-void" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              Send <span aria-hidden>→</span>
            </motion.span>
          )}
          {s === "loading" && (
            <motion.svg key="sp" viewBox="0 0 40 40" className="h-[55%] w-[55%]" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1, rotate: 360 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ rotate: { duration: 0.9, repeat: Infinity, ease: "linear" } }}>
              <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(243,239,231,.15)" strokeWidth="4" />
              <motion.circle cx="20" cy="20" r="15" fill="none" stroke="#d4ff3a" strokeWidth="4" strokeLinecap="round" animate={{ pathLength: [0.1, 0.7, 0.1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            </motion.svg>
          )}
          {s === "done" && (
            <motion.svg key="ok" viewBox="0 0 24 24" className="h-[50%] w-[50%]" initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ opacity: 0 }}>
              <motion.path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
            </motion.svg>
          )}
        </AnimatePresence>
        {s === "done" && <motion.span className="absolute inset-0 rounded-full border-2 border-[#2fbf71]" initial={{ scale: 1, opacity: 1 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 0.8 }} />}
      </motion.button>
      <div className="h-6 font-mono text-[max(10px,1.3cqw)] uppercase tracking-[0.3em] text-mute">
        <AnimatePresence mode="wait">
          <motion.span key={s} className="block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {s === "idle" ? "ready" : s === "loading" ? "transmitting…" : "delivered ✓"}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
