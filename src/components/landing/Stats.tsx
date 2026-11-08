"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEMOS, GENRES } from "@/demos/registry";
import { FONTS } from "@/lib/fonts";
import { FontCycle } from "../Type";

/** Counts up while every digit hops between the site's typefaces, then settles into one. */
function Counter({ to, run, font }: { to: number; run: boolean; font: string }) {
  const [v, setV] = useState(0);
  const [counting, setCounting] = useState(false);
  useEffect(() => {
    if (!run) return;
    setCounting(true);
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)), onComplete: () => setCounting(false) });
    return () => c.stop();
  }, [run, to]);
  return <FontCycle text={String(v)} active={counting} settle={font} interval={70} chance={0.7} />;
}

const STATS = [
  { n: DEMOS.length, label: "Live pieces", font: "bitcrush" },
  { n: GENRES.length, label: "Genres", font: "lumen" },
  { n: FONTS.length, label: "Original fonts", font: "neon" },
  { n: FONTS.length * 63, label: "Glyphs drawn by code", font: "monolith" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <section ref={ref} className="grid grid-cols-2 bg-acid text-void lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={s.label} className={`flex flex-col justify-between gap-10 p-6 sm:p-8 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} border-void/15 lg:border-r lg:last:border-r-0`}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-void/60 sm:text-xs">{s.label}</span>
          <span className="text-[18vw] leading-none text-void lg:text-[9vw]">
            <Counter to={s.n} run={inView} font={s.font} />
          </span>
        </div>
      ))}
    </section>
  );
}
