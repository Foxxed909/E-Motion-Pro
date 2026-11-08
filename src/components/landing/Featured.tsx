"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Stage } from "@/demos/Stage";
import { demoBySlug, genreById, type Demo } from "@/demos/registry";
import { SectionLabel } from "../SectionLabel";
import { EASE } from "@/lib/motion";

const PICKS = ["aurora", "font-roulette", "dynamic-pill", "lava-lamp", "holo-card", "split-flap", "synth-horizon", "particle-type"];
const DEMOS = PICKS.map((s) => demoBySlug(s)!);
const N = DEMOS.length;

/** Masked slide-up title swap (replaces the old cipher effect). */
function Title({ d }: { d: Demo }) {
  const g = genreById(d.genre);
  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={d.slug} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.6, ease: EASE.expo }}>
          <h2 className="text-[10vw] font-medium leading-[0.95] tracking-[-0.04em] text-ink sm:text-[5.5vw]">{d.title}</h2>
          <div className={`font-${g.font} mt-1 text-lg text-acid sm:text-2xl`}>{g.name}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Counter({ active }: { active: number }) {
  return (
    <div className="text-right">
      <div className="font-bitcrush text-[12vw] leading-[0.8] text-ink sm:text-[6vw]">
        {String(active + 1).padStart(2, "0")}
        <span className="text-dim">/{String(N).padStart(2, "0")}</span>
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        {DEMOS.map((x, i) => (
          <motion.span key={x.slug} className="h-1 rounded-full bg-ink" animate={{ width: i === active ? 28 : 6, opacity: i === active ? 1 : 0.25 }} />
        ))}
      </div>
    </div>
  );
}

function Card({ d, i, p, active }: { d: Demo; i: number; p: MotionValue<number>; active: boolean }) {
  const dist = useTransform(p, (v) => Math.min(1, Math.abs(v * (N - 1) - i)));
  const scale = useTransform(dist, [0, 1], [1, 0.86]);
  // Dimming via an overlay's opacity (compositor-only) rather than a CSS filter over live canvases.
  const dim = useTransform(dist, [0, 1], [0, 0.6]);
  const meta = useTransform(dist, [0, 0.5], [1, 0]);
  return (
    <motion.div className="w-[58vw] shrink-0" style={{ scale }}>
      <Link href={`/motion/${d.slug}`} className="group block" data-cursor="view">
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-line">
          <Stage demo={d} mini live={active} className="aspect-[16/10] w-full" />
          <motion.div className="pointer-events-none absolute inset-0 bg-void" style={{ opacity: dim }} />
        </div>
        <motion.div className="mt-4 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.25em] text-mute" style={{ opacity: meta }}>
          <span>{d.tags.join(" · ")}</span>
          <span className="text-acid">Open piece →</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/** Desktop: pinned section; vertical scroll slides pieces past a centre focus point. */
function FeaturedPinned() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState({ start: 0, step: 0 });
  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t || t.children.length < 2) return;
      const a = t.children[0] as HTMLElement;
      const b = t.children[1] as HTMLElement;
      setGeo({ start: (window.innerWidth - a.offsetWidth) / 2 - a.offsetLeft, step: b.offsetLeft - a.offsetLeft });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => geo.start - v * (N - 1) * geo.step);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (N - 1))));
  return (
    <section ref={ref} className="relative hidden md:block" style={{ height: `calc(100svh + ${(N - 1) * geo.step * 0.9}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-6 overflow-hidden">
        <div className="flex items-end justify-between gap-6 px-8">
          <div>
            <SectionLabel n={2}>Featured reel</SectionLabel>
            <div className="mt-4">
              <Title d={DEMOS[active]} />
            </div>
          </div>
          <Counter active={active} />
        </div>
        <motion.div ref={track} className="flex w-max items-start gap-10" style={{ x }}>
          {DEMOS.map((d, i) => (
            <Card key={d.slug} d={d} i={i} p={scrollYProgress} active={i === active} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** Phones: a native swipe carousel with snap points — no scroll hijacking. */
function FeaturedSwipe() {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  return (
    <section className="py-16 md:hidden">
      <div className="flex items-end justify-between gap-4 px-4">
        <div className="min-w-0">
          <SectionLabel n={2}>Featured reel</SectionLabel>
          <div className="mt-4">
            <Title d={DEMOS[active]} />
          </div>
        </div>
        <Counter active={active} />
      </div>
      <div
        ref={strip}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scroll-padding-inline:1rem]"
        onScroll={() => {
          const el = strip.current!;
          const first = el.children[0] as HTMLElement | undefined;
          if (!first) return;
          const step = first.offsetWidth + 12;
          setActive(Math.max(0, Math.min(N - 1, Math.round(el.scrollLeft / step))));
        }}
      >
        {DEMOS.map((d, i) => (
          <Link key={d.slug} href={`/motion/${d.slug}`} className="block w-[84vw] shrink-0 snap-start">
            <div className="overflow-hidden rounded-2xl ring-1 ring-line">
              <Stage demo={d} mini live={i === active} className="aspect-[4/3] w-full" />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{d.tags.join(" · ")}</div>
          </Link>
        ))}
      </div>
      <div className="mt-3 px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">Swipe →</div>
    </section>
  );
}

export function Featured() {
  return (
    <>
      <FeaturedPinned />
      <FeaturedSwipe />
    </>
  );
}
