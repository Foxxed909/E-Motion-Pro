"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useAutoScroll } from "../shared/useAutoScroll";

const CARDS = [
  { n: "01", t: "Anticipation", c: "#ff4f2e", f: "monolith" },
  { n: "02", t: "Follow-through", c: "#7a5cff", f: "velocity" },
  { n: "03", t: "Slow in, slow out", c: "#d4ff3a", f: "orbit" },
  { n: "04", t: "Arcs", c: "#33e1ff", f: "ribbon" },
  { n: "05", t: "Squash & stretch", c: "#ff5ca8", f: "bubblegum" },
];

function Card({ c, i, p }: { c: (typeof CARDS)[number]; i: number; p: MotionValue<number> }) {
  const N = CARDS.length;
  const start = i / N;
  const scale = useTransform(p, [start, 1], [1, 1 - (N - i - 1) * 0.06]);
  const bright = useTransform(p, [start, Math.min(1, start + 2 / N)], [1, 0.45]);
  const filter = useTransform(bright, (b) => `brightness(${b})`);
  const dark = c.c === "#d4ff3a" || c.c === "#33e1ff";
  return (
    <div className="sticky flex h-[60cqh] items-start justify-center" style={{ top: `${8 + i * 3}cqh` }}>
      <motion.div className="relative h-[52cqh] w-[78cqw] origin-top overflow-hidden rounded-[3cqh] p-[4cqh]" style={{ scale, filter, background: c.c, color: dark ? "#060608" : "#f3efe7" }}>
        <div className="flex justify-between font-mono text-[max(10px,1.6cqh)] uppercase tracking-[0.3em]">
          <span>Principle</span>
          <span>{c.n} / 05</span>
        </div>
        <div className={`font-${c.f} absolute bottom-[4cqh] left-[4cqh] leading-[0.9]`} style={{ fontSize: "min(8cqw,13cqh)" }}>
          {c.t}
        </div>
      </motion.div>
    </div>
  );
}

export default function StackingCards({ mini }: { mini?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  useAutoScroll(ref, true, mini ? 0.2 : 0.1);
  return (
    <div ref={ref} className="no-scrollbar absolute inset-0 overflow-y-auto" data-lenis-prevent>
      <div className="pb-[40cqh] pt-[4cqh]">
        {CARDS.map((c, i) => (
          <Card key={c.n} c={c} i={i} p={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}
