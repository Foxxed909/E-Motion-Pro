"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Stage } from "@/demos/Stage";
import { demoBySlug, genreById } from "@/demos/registry";

const PICKS = ["aurora", "font-roulette", "dynamic-pill", "particle-type", "holo-card", "circle-portal", "synth-horizon", "gooey-blobs"];

/** Pinned section whose vertical scroll drives a horizontal track of live pieces. */
export function Featured() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const f = () => track.current && setDist(track.current.scrollWidth - window.innerWidth);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const demos = PICKS.map((s) => demoBySlug(s)!);

  return (
    <section ref={ref} className="relative" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mb-6 flex items-end justify-between px-4 sm:px-8">
          <h2 className="font-monolith text-[11vw] uppercase leading-[0.85] text-ink sm:text-[7vw]">
            Featured
            <br />
            <span className="text-mute">reel</span>
          </h2>
          <div className="w-40 font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:w-60 sm:text-xs">
            <div className="flex justify-between">
              <span>Scroll →</span>
              <span>08 pieces</span>
            </div>
            <div className="mt-2 h-px bg-line">
              <motion.div className="h-full bg-acid" style={{ width: bar }} />
            </div>
          </div>
        </div>
        <motion.div ref={track} className="flex w-max gap-4 px-4 sm:gap-6 sm:px-8" style={{ x }}>
          {demos.map((d, i) => (
            <Link key={d.slug} href={`/motion/${d.slug}`} className="group block w-[82vw] shrink-0 sm:w-[54vw] lg:w-[42vw]" data-cursor="view">
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-line">
                <Stage demo={d} mini className="aspect-[16/10] w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xl text-ink sm:text-2xl">
                  <span className="mr-3 font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                  {d.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">{genreById(d.genre).name}</span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
