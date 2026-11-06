"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { Stage } from "@/demos/Stage";
import { GENRES, demosInGenre } from "@/demos/registry";
import { EASE } from "@/lib/motion";

export function GenreIndex() {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22 });
  const sy = useSpring(y, { stiffness: 160, damping: 22 });

  return (
    <section
      id="genres"
      className="relative scroll-mt-20 px-4 py-[16vh] sm:px-8"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-[12vw] font-medium leading-[0.85] tracking-[-0.04em] text-ink sm:text-[7vw]">
          Every genre
          <br />
          <span className="font-scriptorium text-acid">of motion.</span>
        </h2>
        <p className="max-w-[34ch] text-mute">From micro-interactions to shaders, the vocabulary of modern interfaces in 13 chapters. Hover to preview a chapter.</p>
      </div>
      <ul>
        {GENRES.map((g, i) => {
          const count = demosInGenre(g.id).length;
          const on = active === i;
          return (
            <li key={g.id} onPointerEnter={() => setActive(i)} className="border-t border-line last:border-b">
              <Link href={`/gallery?genre=${g.id}`} className="group relative flex items-center justify-between gap-4 overflow-hidden py-4 sm:py-5" data-cursor="open">
                <motion.span
                  className="absolute inset-0 origin-bottom bg-ink"
                  initial={false}
                  animate={{ scaleY: on ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE.expo }}
                />
                <span className="relative flex items-baseline gap-4 sm:gap-8">
                  <span className={`font-mono text-xs transition-colors duration-300 ${on ? "text-void" : "text-mute"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <motion.span
                    className={`font-${g.font} text-[9vw] leading-none sm:text-[5vw] ${on ? "text-void" : "text-ink"}`}
                    animate={{ x: on ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  >
                    {g.name}
                  </motion.span>
                </span>
                <span className={`relative hidden text-right font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 md:block ${on ? "text-void" : "text-mute"}`}>
                  {g.line}
                  <br />
                  {String(count).padStart(2, "0")} pieces
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <motion.div className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[30vh] w-[22vw] min-w-[280px] -translate-x-1/2 -translate-y-1/2 md:block" style={{ x: sx, y: sy }}>
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10"
              initial={{ clipPath: "inset(50% 50% 50% 50% round 12px)", rotate: -6 }}
              animate={{ clipPath: "inset(0% 0% 0% 0% round 12px)", rotate: 0 }}
              exit={{ clipPath: "inset(50% 50% 50% 50% round 12px)", opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE.expo }}
            >
              <Stage demo={demosInGenre(GENRES[active].id)[0]} mini className="h-full w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
