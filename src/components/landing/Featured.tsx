"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Stage } from "@/demos/Stage";
import { demoBySlug, genreById, type Demo } from "@/demos/registry";
import { Scramble } from "../Type";
import { SectionLabel } from "../SectionLabel";

const PICKS = ["aurora", "font-roulette", "dynamic-pill", "lava-lamp", "holo-card", "split-flap", "synth-horizon", "particle-type"];

function Card({ d, i, n, p }: { d: Demo; i: number; n: number; p: MotionValue<number> }) {
  // 0 when this card is centred, 1+ when it is one or more cards away.
  const dist = useTransform(p, (v) => Math.min(1, Math.abs(v * (n - 1) - i)));
  const scale = useTransform(dist, [0, 1], [1, 0.86]);
  const filter = useTransform(dist, [0, 1], ["brightness(1) saturate(1)", "brightness(0.45) saturate(0.6)"]);
  const meta = useTransform(dist, [0, 0.5], [1, 0]);
  return (
    <motion.div className="w-[82vw] shrink-0 sm:w-[64vw] lg:w-[58vw]" style={{ scale }}>
      <Link href={`/motion/${d.slug}`} className="group block" data-cursor="view">
        <motion.div className="overflow-hidden rounded-3xl ring-1 ring-line" style={{ filter }}>
          <Stage demo={d} mini className="aspect-[16/10] w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]" />
        </motion.div>
        <motion.div className="mt-4 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-mute sm:text-xs" style={{ opacity: meta }}>
          <span>{d.tags.join(" · ")}</span>
          <span className="text-acid">Open piece →</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/** Pinned reel: vertical scroll slides live pieces past a centre focus point. */
export function Featured() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ start: 0, step: 0 });
  const demos = PICKS.map((s) => demoBySlug(s)!);
  const n = demos.length;

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t || t.children.length < 2) return;
      const a = t.children[0] as HTMLElement;
      const b = t.children[1] as HTMLElement;
      const step = b.offsetLeft - a.offsetLeft;
      setGeo({ start: (window.innerWidth - a.offsetWidth) / 2 - a.offsetLeft, step });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => geo.start - v * (n - 1) * geo.step);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (n - 1))));
  const d = demos[active];

  return (
    <section ref={ref} className="relative" style={{ height: `calc(100svh + ${(n - 1) * geo.step * 0.9}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-6 overflow-hidden">
        <div className="flex items-end justify-between gap-6 px-4 sm:px-8">
          <div>
            <SectionLabel n={2}>Featured reel</SectionLabel>
            <h2 className="mt-4 text-[10vw] font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-[5.5vw]">
              <Scramble text={d.title} />
            </h2>
            <div className={`font-${genreById(d.genre).font} mt-1 text-lg text-acid sm:text-2xl`}>{genreById(d.genre).name}</div>
          </div>
          <div className="text-right">
            <div className="font-bitcrush text-[12vw] leading-[0.8] text-ink sm:text-[6vw]">
              {String(active + 1).padStart(2, "0")}
              <span className="text-dim">/{String(n).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 flex justify-end gap-1.5">
              {demos.map((x, i) => (
                <motion.span key={x.slug} className="h-1 rounded-full bg-ink" animate={{ width: i === active ? 28 : 6, opacity: i === active ? 1 : 0.25 }} />
              ))}
            </div>
          </div>
        </div>
        <motion.div ref={track} className="flex w-max items-start gap-6 sm:gap-10" style={{ x }}>
          {demos.map((dm, i) => (
            <Card key={dm.slug} d={dm} i={i} n={n} p={scrollYProgress} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
