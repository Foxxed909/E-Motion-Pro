"use client";

import { motion } from "motion/react";

const inf = { repeat: Infinity, ease: "easeInOut" } as const;

const LOADERS: { name: string; el: React.ReactNode }[] = [
  {
    name: "orbit",
    el: (
      <div className="relative h-12 w-12">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 1 + i * 0.35, repeat: Infinity, ease: "linear" }}>
            <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full" style={{ background: ["#d4ff3a", "#ff5ca8", "#33e1ff"][i] }} />
          </motion.span>
        ))}
      </div>
    ),
  },
  {
    name: "morph",
    el: <motion.span className="block h-10 w-10 bg-flare" animate={{ borderRadius: ["10%", "50%", "10%"], rotate: [0, 180, 360], scale: [1, 0.7, 1] }} transition={{ duration: 1.6, ...inf }} />,
  },
  {
    name: "equalizer",
    el: (
      <div className="flex h-10 items-end gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span key={i} className="w-1.5 rounded-full bg-ink" animate={{ height: ["20%", "100%", "35%", "70%", "20%"] }} transition={{ duration: 1, ...inf, delay: i * 0.1 }} />
        ))}
      </div>
    ),
  },
  {
    name: "pulse",
    el: (
      <div className="relative flex h-12 w-12 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="absolute h-full w-full rounded-full border-2 border-iris" animate={{ scale: [0, 1.2], opacity: [1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }} />
        ))}
        <span className="h-2 w-2 rounded-full bg-iris" />
      </div>
    ),
  },
  {
    name: "arc",
    el: (
      <motion.span
        className="block h-12 w-12 rounded-full"
        style={{ background: "conic-gradient(from 0deg, transparent, #d4ff3a)", mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))", WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px))" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
    ),
  },
  {
    name: "bounce",
    el: (
      <div className="flex h-14 flex-col items-center justify-end">
        <motion.span className="block h-6 w-6 rounded-full bg-glow" animate={{ y: [0, -30, 0], scaleX: [1.3, 0.9, 1.3], scaleY: [0.7, 1.1, 0.7] }} transition={{ duration: 0.7, repeat: Infinity, ease: [0.5, 0, 0.5, 1], times: [0, 0.5, 1] }} />
        <motion.span className="mt-1 block h-1 w-6 rounded-full bg-black/60" animate={{ scaleX: [1, 0.5, 1], opacity: [0.8, 0.3, 0.8] }} transition={{ duration: 0.7, repeat: Infinity }} />
      </div>
    ),
  },
  {
    name: "grid",
    el: (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.span key={i} className="h-3 w-3 rounded-[2px] bg-tide" animate={{ scale: [1, 0.2, 1], opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, ...inf, delay: ((i % 3) + Math.floor(i / 3)) * 0.1 }} />
        ))}
      </div>
    ),
  },
  {
    name: "infinity",
    el: (
      <svg viewBox="0 0 100 50" className="h-12 w-24">
        <path id="inf" d="M50 25 C 30 0, 5 0, 5 25 C 5 50, 30 50, 50 25 C 70 0, 95 0, 95 25 C 95 50, 70 50, 50 25" fill="none" stroke="rgba(243,239,231,.15)" strokeWidth="4" />
        <motion.path d="M50 25 C 30 0, 5 0, 5 25 C 5 50, 30 50, 50 25 C 70 0, 95 0, 95 25 C 95 50, 70 50, 50 25" fill="none" stroke="#ff9f43" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0.2, pathOffset: 0 }} animate={{ pathOffset: [0, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
      </svg>
    ),
  },
  {
    name: "type",
    el: (
      <div className="flex font-lumen text-2xl text-acid">
        {Array.from("LOADING").map((c, i) => (
          <motion.span key={i} animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, ...inf, delay: i * 0.08 }}>
            {c}
          </motion.span>
        ))}
      </div>
    ),
  },
];

export default function LoaderLab() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
      {LOADERS.map((l, i) => (
        <div key={l.name} className="relative flex items-center justify-center border-line" style={{ borderRightWidth: i % 3 < 2 ? 1 : 0, borderBottomWidth: i < 6 ? 1 : 0 }}>
          <div>{l.el}</div>
          <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
            {String(i + 1).padStart(2, "0")} {l.name}
          </span>
        </div>
      ))}
    </div>
  );
}
