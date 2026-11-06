"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { SectionLabel } from "../SectionLabel";

type Token = { w: string; kind?: "font" | "pill" | "accent"; font?: string };

const TOKENS: Token[] = [
  { w: "Interfaces" }, { w: "should" }, { w: "feel" }, { w: "alive.", kind: "font", font: "inkwell" },
  { w: "Every" }, { w: "tap", kind: "pill" }, { w: "deserves" }, { w: "a" }, { w: "reply," },
  { w: "every" }, { w: "page" }, { w: "a" }, { w: "grand", kind: "font", font: "opera" }, { w: "entrance." },
  { w: "We" }, { w: "collect" }, { w: "the" }, { w: "motion", kind: "accent" }, { w: "that" }, { w: "makes" },
  { w: "people" }, { w: "lean" }, { w: "closer", kind: "font", font: "velocity" }, { w: "to" }, { w: "the" }, { w: "screen." },
];

function Word({ t, i, n, p }: { t: Token; i: number; n: number; p: MotionValue<number> }) {
  const a = i / n;
  const o = useTransform(p, [a, a + 1.5 / n], [0.1, 1]);
  const blur = useTransform(p, [a, a + 1.5 / n], ["blur(6px)", "blur(0px)"]);
  if (t.kind === "pill")
    return (
      <motion.span style={{ opacity: o }} className="relative mx-[0.15em] inline-flex h-[0.85em] w-[1.8em] translate-y-[0.08em] items-center rounded-full bg-acid align-baseline">
        <motion.span className="absolute h-[0.65em] w-[0.65em] rounded-full bg-void" animate={{ left: ["8%", "56%", "8%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: [0.76, 0, 0.24, 1] }} />
      </motion.span>
    );
  return (
    <motion.span
      style={{ opacity: o, filter: blur }}
      className={`mr-[0.25em] inline-block ${t.kind === "font" ? `font-${t.font} text-[1.08em] text-ink` : ""} ${t.kind === "accent" ? "text-iris" : ""}`}
    >
      {t.w}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  return (
    <section ref={ref} className="relative mx-auto max-w-[1400px] px-4 pb-[12vh] pt-[18vh] sm:px-8">
      <div className="mb-10">
        <SectionLabel n={1}>Manifesto</SectionLabel>
      </div>
      <p className="text-[8.5vw] font-medium leading-[1.02] tracking-[-0.03em] text-ink sm:text-[5.6vw] lg:text-[4.6vw]">
        {TOKENS.map((t, i) => (
          <Word key={i} t={t} i={i} n={TOKENS.length} p={scrollYProgress} />
        ))}
      </p>
    </section>
  );
}
