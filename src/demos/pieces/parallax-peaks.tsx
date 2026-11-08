"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMemo, useRef } from "react";
import { useAutoScroll } from "../shared/useAutoScroll";

function ridge(seed: number, base: number, amp: number) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: string[] = [`M0 100 L0 ${base}`];
  let y = base;
  for (let x = 0; x <= 100; x += 2) {
    y = Math.max(base - amp, Math.min(base + amp * 0.3, y + (r() - 0.55) * amp * 0.5));
    pts.push(`L${x} ${y.toFixed(2)}`);
  }
  pts.push("L100 100 Z");
  return pts.join(" ");
}

const LAYERS = [
  { color: "#3b1f5c", base: 52, amp: 16, speed: 0.15 },
  { color: "#5a2a6e", base: 60, amp: 14, speed: 0.3 },
  { color: "#8a3470", base: 68, amp: 12, speed: 0.5 },
  { color: "#c2456a", base: 76, amp: 10, speed: 0.75 },
  { color: "#1a0b26", base: 86, amp: 8, speed: 1.1 },
];

function Layer({ l, i, p }: { l: (typeof LAYERS)[number]; i: number; p: MotionValue<number> }) {
  const y = useTransform(p, [0, 1], ["0%", `${-l.speed * 40}%`]);
  const d = useMemo(() => ridge(i * 977 + 13, l.base, l.amp), [i, l]);
  return (
    <motion.svg className="absolute inset-x-0 bottom-[-40%] h-[140%] w-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ y }}>
      <path d={d} fill={l.color} />
    </motion.svg>
  );
}

export default function ParallaxPeaks({ mini }: { mini?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ container: ref });
  useAutoScroll(ref, true, mini ? 0.18 : 0.08);
  const sunY = useTransform(p, [0, 1], ["10%", "70%"]);
  const sky = useTransform(p, [0, 1], ["#ff9f6b", "#140c22"]);
  const titleY = useTransform(p, [0, 1], ["0%", "-140%"]);
  const titleS = useTransform(p, [0, 0.6], [1, 1.6]);
  const titleO = useTransform(p, [0, 0.5], [1, 0]);
  const outro = useTransform(p, [0.6, 1], [0, 1]);
  return (
    <div ref={ref} className="no-scrollbar absolute inset-0 overflow-y-auto">
      <div className="h-[400%]">
        <motion.div className="sticky top-0 h-[25%] overflow-hidden" style={{ background: sky }}>
          <motion.div className="absolute left-1/2 h-[30cqh] w-[30cqh] -translate-x-1/2 rounded-full" style={{ top: sunY, background: "radial-gradient(circle,#ffe2a8,#ff7a59 60%,transparent 70%)" }} />
          {LAYERS.map((l, i) => (
            <Layer key={i} l={l} i={i} p={p} />
          ))}
          <motion.div className="absolute inset-x-0 top-[22%] text-center font-filament uppercase text-ink" style={{ y: titleY, scale: titleS, opacity: titleO, fontSize: "min(10cqw,18cqh)", lineHeight: 1 }}>
            Altitude
          </motion.div>
          <motion.div className="absolute inset-x-0 top-[40%] text-center font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.4em] text-ink/80" style={{ opacity: outro }}>
            ↓ 4,808 m · descending into night
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
