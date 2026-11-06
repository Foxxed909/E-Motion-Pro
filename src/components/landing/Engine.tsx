"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { FONTS } from "@/lib/fonts";
import { SectionLabel } from "../SectionLabel";
import { EASE } from "@/lib/motion";

// The real centre-line skeleton of "EMO" from scripts/fonts/skeleton.mjs (y-up, cap height 700).
const PATHS = [
  "M450 700 L0 700 L0 0 L450 0 M0 360 L380 360",
  "M570 0 L570 700 L870 190 L1170 700 L1170 0",
  "M1620 700 A330 350 0 1 1 1620 0 A330 350 0 1 1 1620 700",
];
const NODES = [
  [450, 700], [0, 700], [0, 0], [450, 0], [0, 360], [380, 360],
  [570, 0], [570, 700], [870, 190], [1170, 700], [1170, 0],
  [1620, 700], [1620, 0], [1290, 350], [1950, 350],
];
const STEPS = [
  { t: "Skeleton", d: "One hand-built alphabet of centre lines on a 700-unit grid. No outlines, just intent." },
  { t: "Render", d: `${FONTS.length} strategies turn the same lines into ink: pen nibs, pixels, tubes, stencils, slices.` },
  { t: "Export", d: "Every style compiles to a real OpenType font: OTF and WOFF2, free under the SIL OFL." },
];

function Stroke({ d, i, p }: { d: string; i: number; p: MotionValue<number> }) {
  const len = useTransform(p, [0.02 + i * 0.09, 0.11 + i * 0.09], [0, 1]);
  return <motion.path d={d} fill="none" stroke="#d4ff3a" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" style={{ pathLength: len }} />;
}

export function Engine() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const [font, setFont] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    setStep(v < 0.36 ? 0 : v < 0.82 ? 1 : 2);
    setFont(Math.min(FONTS.length - 1, Math.max(0, Math.floor(((v - 0.36) / 0.46) * FONTS.length))));
  });
  const skelOpacity = useTransform(p, [0.3, 0.42], [1, 0.12]);
  const nodes = useTransform(p, [0.05, 0.3], [0, 1]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const f = FONTS[font];

  return (
    <section ref={ref} className="relative h-[230vh] border-t border-line md:h-[340vh]">
      <div className="sticky top-0 grid h-[100svh] items-center gap-8 overflow-hidden px-4 pt-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-10">
          <SectionLabel n={4}>The font engine</SectionLabel>
          <h2 className="mt-5 text-[11vw] font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-[6vw] lg:text-[4.4vw]">
            One skeleton.
            <br />
            <span className="text-iris">{FONTS.length} voices.</span>
          </h2>
          <ol className="mt-8 hidden space-y-5 sm:block">
            {STEPS.map((s, i) => (
              <motion.li key={s.t} className="flex gap-5" animate={{ opacity: i === step ? 1 : 0.3, x: i === step ? 0 : -8 }} transition={{ duration: 0.5, ease: EASE.expo }}>
                <span className="font-mono text-xs text-acid">0{i + 1}</span>
                <div>
                  <div className="text-xl text-ink">{s.t}</div>
                  <p className="mt-1 max-w-[42ch] text-sm text-mute">{s.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          <div className="mt-8 h-px w-full max-w-md bg-line">
            <motion.div className="h-full bg-acid" style={{ width: bar }} />
          </div>
        </div>

        <div className="relative flex aspect-[2070/900] w-full items-center justify-center [container-type:inline-size]">
          <motion.svg viewBox="-60 -100 2070 900" className="absolute inset-0 h-full w-full" style={{ opacity: skelOpacity }} aria-hidden>
            <g transform="translate(0,700) scale(1,-1)">
              {[0, 175, 350, 525, 700].map((y) => (
                <line key={y} x1={-60} x2={2010} y1={y} y2={y} stroke="rgba(243,239,231,.08)" strokeWidth={2} strokeDasharray={y % 350 ? "8 12" : undefined} />
              ))}
              {PATHS.map((d, i) => (
                <Stroke key={i} d={d} i={i} p={p} />
              ))}
              <motion.g style={{ opacity: nodes }}>
                {NODES.map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={16} fill="#060608" stroke="#f3efe7" strokeWidth={4} />
                  </g>
                ))}
              </motion.g>
            </g>
          </motion.svg>
          <AnimatePresence mode="popLayout">
            {step > 0 && (
              <motion.div
                key={f.slug}
                className={`font-${f.slug} relative whitespace-nowrap leading-none text-ink`}
                style={{ fontSize: "41cqw", marginTop: "4cqw" }}
                initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
                transition={{ duration: 0.25 }}
              >
                EMO
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute left-0 right-0 top-full mt-4 flex flex-col items-start gap-3 font-mono text-[10px] uppercase tracking-[0.25em] sm:flex-row sm:items-center sm:justify-between sm:text-xs">
            <AnimatePresence mode="wait">
              <motion.span key={step === 0 ? "skel" : f.slug} className="text-mute" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                {step === 0 ? "centre lines · 15 nodes · 3 strokes" : (
                  <>
                    <span className="text-acid">{String(f.index).padStart(2, "0")}</span> <span className="text-ink">{f.name}</span> · {f.genre}
                  </>
                )}
              </motion.span>
            </AnimatePresence>
            <AnimatePresence>
              {step === 2 && (
                <motion.span className="flex flex-wrap gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {[".otf", ".woff2", "OFL 1.1"].map((b, i) => (
                    <motion.span key={b} className="rounded-full border border-acid/60 px-3 py-1 text-acid" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 18 }}>
                      {b}
                    </motion.span>
                  ))}
                  <Link href="/fonts" className="rounded-full bg-acid px-3 py-1 text-void">Get them →</Link>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
