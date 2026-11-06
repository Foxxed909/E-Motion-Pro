"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";

const LINKS = ["Work", "Studio", "Lab", "Journal", "Contact"];

/** A tiny menu button that explodes into a full-screen menu with staggered links. */
export default function MenuTakeover({ mini }: { mini?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto && !mini) return;
    const id = setInterval(() => setOpen((o) => !o), 2400);
    return () => clearInterval(id);
  }, [auto, mini]);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#e9e5dd] text-void">
      <div className="flex items-center justify-between p-[3cqw] font-mono text-[max(9px,1.2cqw)] uppercase tracking-[0.25em]">
        <span className="font-orbit text-[max(12px,2cqw)] tracking-normal">◐ nº7</span>
        <span>Menu demo</span>
      </div>
      <div className="absolute inset-x-[3cqw] bottom-[6cqh] font-opera leading-[0.9]" style={{ fontSize: "min(9cqw,16cqh)" }}>
        Quiet
        <br />
        craft.
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col justify-center bg-void px-[6cqw]"
            initial={{ clipPath: "circle(0% at calc(100% - 6cqw) 6cqw)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 6cqw) 6cqw)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 6cqw) 6cqw)", transition: { duration: 0.6, ease: EASE.quart, delay: 0.2 } }}
            transition={{ duration: 0.8, ease: EASE.quart }}
          >
            {LINKS.map((l, i) => (
              <div key={l} className="overflow-hidden" onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
                <motion.div
                  className="flex items-baseline gap-[2cqw] text-ink"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-110%", transition: { duration: 0.35, delay: i * 0.03 } }}
                  transition={{ duration: 0.8, ease: EASE.expo, delay: 0.25 + i * 0.06 }}
                >
                  <span className="font-mono text-[max(9px,1.2cqw)] text-dim">0{i + 1}</span>
                  <motion.span className="font-monolith uppercase" style={{ fontSize: "min(7.5cqw,13cqh)", lineHeight: 1 }} animate={{ x: hover === i ? "2cqw" : 0, color: hover === i ? "#d4ff3a" : "#f3efe7" }}>
                    {l}
                  </motion.span>
                </motion.div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setAuto(false);
          setOpen((o) => !o);
        }}
        aria-label="Toggle menu"
        className="absolute right-[3cqw] top-[3cqw] z-20 flex h-[6cqw] max-h-12 w-[6cqw] max-w-12 flex-col items-center justify-center gap-[0.6cqw] rounded-full bg-void"
      >
        <motion.span className="block h-[2px] w-[45%] bg-ink" animate={open ? { rotate: 45, y: "0.35cqw" } : { rotate: 0, y: 0 }} />
        <motion.span className="block h-[2px] w-[45%] bg-ink" animate={open ? { rotate: -45, y: "-0.35cqw" } : { rotate: 0, y: 0 }} />
      </button>
    </div>
  );
}
