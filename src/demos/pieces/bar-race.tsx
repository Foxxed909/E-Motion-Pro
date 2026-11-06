"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const TEAMS = [
  { n: "Springs", c: "#d4ff3a" },
  { n: "Shaders", c: "#ff5ca8" },
  { n: "Scroll", c: "#33e1ff" },
  { n: "Type", c: "#7a5cff" },
  { n: "Gestures", c: "#ff9f43" },
  { n: "Physics", c: "#f3efe7" },
];

/** A bar-chart race: values grow each tick and rows reorder with layout animations. */
export default function BarRace() {
  const [year, setYear] = useState(2016);
  const [vals, setVals] = useState(() => TEAMS.map(() => 10 + Math.random() * 20));
  useEffect(() => {
    const id = setInterval(() => {
      setYear((y) => (y >= 2026 ? 2016 : y + 1));
      setVals((v) => (year >= 2026 ? TEAMS.map(() => 10 + Math.random() * 20) : v.map((x) => x + Math.random() * 30)));
    }, 1100);
    return () => clearInterval(id);
  }, [year]);
  const order = TEAMS.map((t, i) => ({ ...t, v: vals[i] })).sort((a, b) => b.v - a.v);
  const max = order[0].v;
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[6cqw]">
      <div className="mb-[3cqh] flex items-end justify-between">
        <div className="font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-mute">Most-used motion techniques</div>
        <motion.div key={year} className="font-bitcrush text-acid" style={{ fontSize: "min(8cqw,14cqh)", lineHeight: 0.9 }} initial={{ y: 10, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }}>
          {year}
        </motion.div>
      </div>
      <div className="flex flex-col gap-[1.4cqh]">
        {order.map((t, i) => (
          <motion.div key={t.n} layout transition={{ type: "spring", stiffness: 200, damping: 26 }} className="flex items-center gap-[2cqw]">
            <span className="w-[3cqw] font-mono text-[max(10px,1.3cqw)] text-dim">{i + 1}</span>
            <div className="relative h-[7cqh] flex-1">
              <motion.div className="flex h-full items-center justify-end rounded-r-[1cqh] pr-[1.5cqw]" style={{ background: t.c }} animate={{ width: `${(t.v / max) * 100}%` }} transition={{ type: "spring", stiffness: 90, damping: 20 }}>
                <span className="font-mono text-[max(9px,1.3cqw)] font-semibold text-void">{Math.round(t.v * 37).toLocaleString("en-US")}</span>
              </motion.div>
              <span className="absolute left-[1.5cqw] top-1/2 -translate-y-1/2 font-orbit text-[max(11px,2.2cqw)] text-void mix-blend-normal">{t.n}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
