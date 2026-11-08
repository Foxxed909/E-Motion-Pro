"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Stage } from "@/demos/Stage";
import { DEMOS, GENRES, genreById, type GenreId } from "@/demos/registry";
import { Reveal } from "./Type";
import { EASE } from "@/lib/motion";

export function GalleryView() {
  const params = useSearchParams();
  const router = useRouter();
  const g = params.get("genre") as GenreId | null;
  const active = g && GENRES.some((x) => x.id === g) ? g : null;
  const list = active ? DEMOS.filter((d) => d.genre === active) : DEMOS;
  const set = (id: GenreId | null) => router.replace(id ? `/gallery?genre=${id}` : "/gallery", { scroll: false });

  return (
    <section className="px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-[16vw] font-medium leading-[0.82] tracking-[-0.05em] text-ink sm:text-[11vw]">
          <Reveal text="Gallery" by="char" stagger={0.04} />
        </h1>
        <div className="pb-2 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs">
          <AnimatePresence mode="popLayout">
            <motion.span key={list.length} className="block font-bitcrush text-5xl tracking-normal text-acid" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              {String(list.length).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          {active ? genreById(active).name : "All pieces"}
        </div>
      </div>

      <div className="no-scrollbar sticky top-16 z-20 -mx-4 mt-10 overflow-x-auto px-4 py-3 [mask-image:linear-gradient(90deg,#000_85%,transparent)] sm:top-20 sm:-mx-8 sm:px-8 md:[mask-image:none]">
        <div className="flex w-max gap-1 rounded-full bg-night/80 p-1 ring-1 ring-line backdrop-blur-xl">
          {[{ id: null as GenreId | null, name: "All" }, ...GENRES].map((x) => {
            const on = active === x.id;
            return (
              <button key={x.id ?? "all"} onClick={() => set(x.id)} className="relative rounded-full px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] sm:py-2 sm:text-xs">
                {on && <motion.span layoutId="gallery-chip" className="absolute inset-0 rounded-full bg-acid" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className={`relative whitespace-nowrap ${on ? "text-void" : "text-mute hover:text-ink"}`}>{x.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((d, i) => (
            <motion.li
              key={d.slug}
              layout
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: EASE.expo, delay: Math.min(i, 8) * 0.04 }}
            >
              <Link href={`/motion/${d.slug}`} className="group block" data-cursor="view">
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-line transition-[box-shadow] duration-500 group-hover:shadow-[0_30px_80px_-30px_rgba(212,255,58,.25)]">
                  <Stage demo={d} mini className="aspect-[4/3] w-full transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full md:block bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
                    <p className="text-sm leading-snug text-white/90">{d.blurb}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="flex items-baseline gap-3 text-lg text-ink">
                    <span className="font-mono text-xs text-dim">{String(DEMOS.indexOf(d) + 1).padStart(2, "0")}</span>
                    <span className="relative">
                      {d.title}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-acid transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                    </span>
                  </span>
                  <span className={`font-${genreById(d.genre).font} text-sm text-mute`}>{genreById(d.genre).name}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-mute md:hidden">{d.blurb}</p>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
