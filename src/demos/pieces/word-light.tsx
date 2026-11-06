"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useAutoScroll } from "../shared/useAutoScroll";

const TEXT =
  "Motion is not decoration. It is the grammar of interfaces — the way a product breathes, hesitates, celebrates and apologises. Every frame is a decision. Make each one count.";

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const a = i / n;
  const opacity = useTransform(p, [a * 0.85, a * 0.85 + 0.08], [0.12, 1]);
  const y = useTransform(p, [a * 0.85, a * 0.85 + 0.08], [8, 0]);
  const hot = /grammar|breathes|decision|count/.test(w);
  return (
    <motion.span className={`mr-[0.25em] inline-block ${hot ? "text-acid" : ""}`} style={{ opacity, y }}>
      {w}
    </motion.span>
  );
}

export default function WordLight({ mini }: { mini?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  useAutoScroll(ref, true, mini ? 0.16 : 0.07);
  const words = TEXT.split(" ");
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="no-scrollbar absolute inset-0 overflow-y-auto" data-lenis-prevent>
      <div className="h-[350%]">
        <div className="sticky top-0 flex h-[calc(100%/3.5)] flex-col justify-center px-[8cqw]">
          <div className="mb-[3cqh] font-mono text-[max(10px,1.3cqw)] uppercase tracking-[0.3em] text-mute">Manifesto — read slowly</div>
          <p className="font-sans font-medium tracking-tight text-ink" style={{ fontSize: "min(4.4cqw,7cqh)", lineHeight: 1.15 }}>
            {words.map((w, i) => (
              <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} />
            ))}
          </p>
          <div className="mt-[4cqh] h-px w-full bg-line">
            <motion.div className="h-full bg-acid" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </div>
  );
}
