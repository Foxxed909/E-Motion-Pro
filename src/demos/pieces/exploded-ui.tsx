"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const LAYERS = [
  { label: "canvas", z: 0, el: <div className="h-full w-full rounded-[2cqh] bg-[#14141a]" /> },
  { label: "surface", z: 1, el: <div className="absolute inset-[6%] rounded-[1.6cqh] bg-[#1f1f28]" /> },
  {
    label: "media",
    z: 2,
    el: <div className="absolute inset-x-[10%] top-[10%] h-[45%] rounded-[1.2cqh]" style={{ background: "linear-gradient(135deg,#ff4f2e,#ff5ca8,#7a5cff)" }} />,
  },
  {
    label: "type",
    z: 3,
    el: (
      <div className="absolute inset-x-[10%] top-[60%] text-white">
        <div className="font-monolith text-[5cqh] leading-none">LAYERS</div>
        <div className="mt-[1cqh] h-[1cqh] w-[70%] rounded bg-white/30" />
        <div className="mt-[0.8cqh] h-[1cqh] w-[50%] rounded bg-white/20" />
      </div>
    ),
  },
  {
    label: "action",
    z: 4,
    el: <div className="absolute bottom-[8%] left-[10%] right-[10%] flex h-[9%] items-center justify-center rounded-full bg-acid font-mono text-[1.6cqh] uppercase tracking-[0.2em] text-void">Explore</div>,
  },
];

export default function ExplodedUi() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOpen((o) => !o), 2200);
    const t = setTimeout(() => setOpen(true), 400);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "200cqh" }}>
      <motion.div
        className="relative aspect-[3/4] h-[52cqh]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: open ? 58 : 0, rotateZ: open ? -40 : 0, y: open ? "6cqh" : "0cqh" }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
      >
        {LAYERS.map((l, i) => (
          <motion.div
            key={l.label}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ z: open ? l.z * 9 * 10 : l.z * 0.5 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: open ? i * 0.06 : (LAYERS.length - i) * 0.04 }}
          >
            {l.el}
            <motion.div
              className="absolute -right-[2cqh] top-0 flex translate-x-full items-center gap-2 whitespace-nowrap font-mono text-[1.6cqh] uppercase tracking-[0.2em] text-void"
              animate={{ opacity: open ? 1 : 0 }}
            >
              <span className="h-px w-[4cqh] bg-void" /> {String(i).padStart(2, "0")} {l.label}
            </motion.div>
            {open && <div className="pointer-events-none absolute inset-0 rounded-[2cqh] border border-void/20" />}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
