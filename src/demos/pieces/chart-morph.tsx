"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const MODES = ["bars", "line", "bubbles"] as const;
const N = 9;
const gen = () => Array.from({ length: N }, () => 15 + Math.random() * 80);
const spring = { type: "spring", stiffness: 140, damping: 18 } as const;

export default function ChartMorph() {
  const [mode, setMode] = useState(0);
  const [data, setData] = useState(gen);
  useEffect(() => {
    const id = setInterval(() => {
      setMode((m) => (m + 1) % MODES.length);
      setData((d) => d.map((v) => Math.max(10, Math.min(98, v + (Math.random() - 0.5) * 40))));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  const m = MODES[mode];
  const W = 400, H = 220, pad = 20;
  const step = (W - pad * 2) / N;
  const shape = (v: number, i: number) => {
    const cx = pad + step * (i + 0.5);
    if (m === "bars") {
      const bw = step * 0.62, bh = (v / 100) * (H - 40);
      return { x: cx - bw / 2, y: H - 20 - bh, width: bw, height: bh, rx: 4 };
    }
    if (m === "line") {
      const y = H - 20 - (v / 100) * (H - 40);
      return { x: cx - 5, y: y - 5, width: 10, height: 10, rx: 5 };
    }
    const s = Math.sqrt(v) * 4.4;
    return { x: cx - s / 2, y: H / 2 - s / 2 + (i % 2 ? 22 : -22), width: s, height: s, rx: s / 2 };
  };
  const linePts = data.map((v, i) => `${pad + step * (i + 0.5)},${H - 20 - (v / 100) * (H - 40)}`).join(" ");
  const total = Math.round(data.reduce((a, b) => a + b, 0) * 13.7);
  const colors = ["#d4ff3a", "#ff5ca8", "#7a5cff", "#33e1ff", "#ff9f43"];
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[6cqw]">
      <div className="mb-[3cqh] flex items-end justify-between">
        <div>
          <div className="font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-mute">Weekly frames rendered</div>
          <motion.div className="font-orbit text-ink" style={{ fontSize: "min(6cqw,11cqh)", lineHeight: 1 }} key={total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            {total.toLocaleString("en-US")}
          </motion.div>
        </div>
        <div className="flex gap-1 rounded-full bg-smoke p-1 font-mono text-[max(9px,1.1cqw)] uppercase tracking-[0.15em]">
          {MODES.map((x, i) => (
            <span key={x} className="relative rounded-full px-3 py-1">
              {i === mode && <motion.span layoutId="chart-mode" className="absolute inset-0 rounded-full bg-ink" transition={spring} />}
              <span className={`relative ${i === mode ? "text-void" : "text-mute"}`}>{x}</span>
            </span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="max-h-[62cqh] w-full overflow-visible">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={pad} x2={W - pad} y1={20 + (H - 40) * g} y2={20 + (H - 40) * g} stroke="rgba(255,255,255,.06)" />
        ))}
        <AnimatePresence>
          {m === "line" && (
            <motion.polyline key="l" points={linePts} fill="none" stroke="#f3efe7" strokeWidth={2} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: "easeInOut" }} />
          )}
        </AnimatePresence>
        {data.map((v, i) => (
          <motion.rect key={i} initial={false} animate={shape(v, i)} transition={{ ...spring, delay: i * 0.03 }} fill={colors[i % colors.length]} />
        ))}
      </svg>
    </div>
  );
}
