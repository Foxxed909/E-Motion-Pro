"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEMOS, GENRES } from "@/demos/registry";
import { FONTS } from "@/lib/fonts";

function Counter({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [run, to]);
  return <>{v}</>;
}

const STATS = [
  { n: DEMOS.length, label: "Live pieces", font: "bitcrush" },
  { n: GENRES.length, label: "Genres", font: "lumen" },
  { n: FONTS.length, label: "Original fonts", font: "neon" },
  { n: 0, label: "Stock images", font: "monolith" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <section ref={ref} className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={s.label} className={`flex flex-col justify-between gap-10 p-6 sm:p-8 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} border-line lg:border-r lg:last:border-r-0`}>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs">{s.label}</span>
          <span className={`font-${s.font} text-[18vw] leading-none text-ink lg:text-[9vw]`}>
            <Counter to={s.n} run={inView} />
          </span>
        </div>
      ))}
    </section>
  );
}
