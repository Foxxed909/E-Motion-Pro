"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionLabel } from "../SectionLabel";
import { setPaletteOpen } from "@/lib/palette";
import { EASE } from "@/lib/motion";
import { PIECE_COUNT } from "@/lib/counts";

const CODE: [string, string][] = [
  ["dim", "// src/demos/pieces/magnify-dock.tsx"],
  ["ink", "const size = useSpring("],
  ["ink", "  useTransform(dist, [-140, 0, 140], [44, 84, 44]),"],
  ["acid", "  { stiffness: 320, damping: 22 },"],
  ["ink", ");"],
];
const TONE: Record<string, string> = { dim: "text-dim", ink: "text-ink/90", acid: "text-acid" };

// min-w-0: the code sample must clip inside its card, not widen the grid (and the page) on phones.
const card = "flex min-w-0 flex-col rounded-2xl bg-night p-6 ring-1 ring-line sm:p-7";
const visual = "mb-8 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-void ring-1 ring-line";

/** How the library is meant to be used: find a piece, read its source, take it. */
export function Workflow() {
  const steps = [
    {
      t: "Find the motion",
      d: `Search ${PIECE_COUNT} pieces by name, genre or technique from anywhere on the site.`,
      visual: (
        <button onClick={() => setPaletteOpen(true)} className="group flex items-center gap-3 rounded-full border border-line bg-night px-5 py-3 text-sm text-mute transition-colors hover:border-acid hover:text-ink">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" strokeLinecap="round" />
          </svg>
          Search the library
          <kbd className="rounded border border-ink/25 px-1.5 py-0.5 font-mono text-[11px] text-ink">⌘K</kbd>
        </button>
      ),
    },
    {
      t: "Read how it works",
      d: "Every piece page shows its complete source, syntax-highlighted, with one button to copy it.",
      visual: (
        <pre className="w-full min-w-0 self-stretch overflow-hidden p-4 font-mono text-[11px] leading-relaxed" aria-hidden>
          {CODE.map(([tone, line], i) => (
            <motion.span key={i} className={`block whitespace-pre ${TONE[tone]}`} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.09, duration: 0.5, ease: EASE.expo }}>
              {line}
            </motion.span>
          ))}
        </pre>
      ),
    },
    {
      t: "Make it yours",
      d: "One file per piece: React with Motion, Canvas 2D or raw WebGL. No images, no build plugins. The fonts are free under the SIL OFL.",
      visual: (
        <div className="flex flex-wrap justify-center gap-2 px-4 font-mono text-[11px] uppercase tracking-[0.14em]">
          {["React 19", "Motion", "Canvas 2D", "WebGL", "SVG", "TypeScript"].map((x, i) => (
            <motion.span key={x} className="rounded-full border border-line px-3 py-1.5 text-ink" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06, type: "spring", stiffness: 380, damping: 22 }}>
              {x}
            </motion.span>
          ))}
        </div>
      ),
    },
  ];
  return (
    <section className="border-t border-line px-4 py-[14vh] sm:px-8" aria-labelledby="workflow-title">
      <SectionLabel n={7}>How to use it</SectionLabel>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h2 id="workflow-title" className="text-[11vw] font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-[6vw] lg:text-[4.6vw]">
          Watch it. Read it.
          <br />
          <span className="text-acid">Take it.</span>
        </h2>
        <Link href="/gallery" className="inline-flex items-center gap-3 rounded-full border border-ink/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-void">
          Start in the gallery →
        </Link>
      </div>
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.li key={s.t} className={card} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.8, ease: EASE.expo, delay: i * 0.08 }}>
            <div className={visual}>{s.visual}</div>
            <div className="font-mono text-xs text-acid">0{i + 1}</div>
            <h3 className="mt-2 text-2xl tracking-[-0.02em] text-ink">{s.t}</h3>
            <p className="mt-2 text-mute">{s.d}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
