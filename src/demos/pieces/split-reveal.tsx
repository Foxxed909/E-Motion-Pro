"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";

const LINES = [
  ["MAKE IT", "MOVE."],
  ["FEEL THE", "FRAME."],
  ["EASE IN.", "BLOW UP."],
];

export default function SplitReveal() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % LINES.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[7cqw] text-void">
      <div className="mb-[3cqh] flex justify-between font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.3em]">
        <span>Split / Stagger / Mask</span>
        <span>0{i + 1} — 0{LINES.length}</span>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div key={i} className="font-monolith uppercase" style={{ fontSize: "min(15cqw, 30cqh)", lineHeight: 0.92 }}>
          {LINES[i].map((line, li) => (
            <div key={li} className="overflow-hidden">
              {Array.from(line).map((c, ci) => (
                <motion.span
                  key={ci}
                  className="inline-block whitespace-pre"
                  initial={{ y: "105%", rotate: 12 }}
                  animate={{ y: "0%", rotate: 0 }}
                  exit={{ y: "-105%", rotate: -8 }}
                  transition={{ duration: 0.9, ease: EASE.expo, delay: li * 0.1 + ci * 0.035 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <motion.div key={`bar${i}`} className="mt-[4cqh] h-[3px] origin-left bg-void" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 2.8, ease: "linear" }} />
    </div>
  );
}
