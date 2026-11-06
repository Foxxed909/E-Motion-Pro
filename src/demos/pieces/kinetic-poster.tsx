"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const POSES = [
  { a: { x: "0%", y: "0%", r: 0 }, b: { x: "0%", y: "0%", r: 0 }, c: { r: 0, s: 1 }, d: "0%" },
  { a: { x: "18%", y: "6%", r: -8 }, b: { x: "-10%", y: "-30%", r: 90 }, c: { r: 45, s: 1.4 }, d: "55%" },
  { a: { x: "-6%", y: "40%", r: 4 }, b: { x: "30%", y: "10%", r: 0 }, c: { r: 180, s: 0.7 }, d: "20%" },
  { a: { x: "10%", y: "-4%", r: 90 }, b: { x: "-20%", y: "38%", r: -6 }, c: { r: 270, s: 1.1 }, d: "75%" },
];
const spring = { type: "spring", stiffness: 120, damping: 16 } as const;

/** A Swiss-style poster whose type blocks and shapes re-compose to a beat. */
export default function KineticPoster() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % POSES.length), 1400);
    return () => clearInterval(id);
  }, []);
  const p = POSES[i];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-[3/4] h-[90cqh] overflow-hidden bg-[#f3efe7] text-[#111]">
        <motion.div className="absolute left-[8%] top-[8%] h-[38%] w-[38%] rounded-full bg-[#e63b2e]" animate={{ rotate: p.c.r, scale: p.c.s }} transition={spring}>
          <span className="absolute left-0 top-1/2 h-1/2 w-full rounded-b-full bg-[#111]" />
        </motion.div>
        <motion.div className="absolute bottom-[22%] h-[3%] w-[70%] bg-[#1d4ed8]" animate={{ left: p.d }} transition={spring} />
        <motion.div className="absolute left-[8%] top-[48%] origin-left font-monolith leading-[0.85]" style={{ fontSize: "11cqh" }} animate={{ x: p.a.x, y: p.a.y, rotate: p.a.r }} transition={spring}>
          MOVE
          <br />
          MENT
        </motion.div>
        <motion.div className="absolute right-[8%] top-[10%] origin-right text-right font-opera leading-none" style={{ fontSize: "7cqh" }} animate={{ x: p.b.x, y: p.b.y, rotate: p.b.r }} transition={spring}>
          Nº {String(i + 1).padStart(2, "0")}
        </motion.div>
        <div className="absolute inset-x-[8%] bottom-[6%] flex justify-between font-mono text-[1.4cqh] uppercase tracking-[0.25em]">
          <span>E-Motion Pro</span>
          <span>Form follows motion</span>
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(#0001 1px,transparent 1px),linear-gradient(90deg,#0001 1px,transparent 1px)", backgroundSize: "12.5% 8.33%" }} />
      </div>
    </div>
  );
}
