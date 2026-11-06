"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { PIECES } from "./components";
import type { Demo } from "./registry";

/** True on touch-first devices (phones, tablets). */
function useCoarse() {
  const [c, setC] = useState(false);
  useEffect(() => setC(window.matchMedia("(pointer: coarse)").matches), []);
  return c;
}

/**
 * Container every piece renders into. It is a CSS size container, so pieces scale
 * with cqw / cqh units. Thumbnails only mount while near the viewport and never
 * capture pointer/touch input (so swiping past them always scrolls the page).
 */
export function Stage({ demo, mini = false, className = "", replayKey = 0 }: { demo: Demo; mini?: boolean; className?: string; replayKey?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ margin: "200px" });
  const coarse = useCoarse();
  const [engaged, setEngaged] = useState(false);
  const Piece = PIECES[demo.slug];
  const gated = !mini && coarse && !!demo.gate;
  return (
    <div ref={ref} className={`relative overflow-hidden [container-type:size] ${className}`} style={{ background: demo.tone }}>
      <div className={`absolute inset-0 ${mini || (gated && !engaged) ? "pointer-events-none" : ""}`}>
        {(inView || !mini) && Piece && <Piece key={replayKey} mini={mini} />}
      </div>
      <AnimatePresence>
        {gated && !engaged && (
          <motion.button
            key="gate"
            className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-black/50 via-transparent to-transparent pb-6"
            onClick={() => setEngaged(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label={`Interact with ${demo.title}`}
          >
            <span className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-void shadow-lg">
              <span className="h-2 w-2 animate-pulse rounded-full bg-acid" />
              Tap to {demo.gate === "scroll" ? "scroll inside" : "interact"}
            </span>
          </motion.button>
        )}
        {gated && engaged && (
          <motion.button
            key="release"
            className="absolute right-3 top-3 z-10 flex h-11 items-center gap-2 rounded-full bg-black/60 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur"
            onClick={() => setEngaged(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Release the piece and scroll the page"
          >
            Done ✕
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
