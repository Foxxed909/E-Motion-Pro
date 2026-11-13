"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Stage } from "@/demos/Stage";
import { DEMOS, GENRES, genreById, type Demo, type GenreId } from "@/demos/registry";
import { Reveal } from "./Type";
import { EASE } from "@/lib/motion";

const COUNTS = Object.fromEntries(GENRES.map((g) => [g.id, DEMOS.filter((d) => d.genre === g.id).length])) as Record<GenreId, number>;
const INDEX = new Map(DEMOS.map((d, i) => [d.slug, i + 1]));

const matches = (d: Demo, q: string) => {
  const hay = `${d.title} ${d.blurb} ${d.tags.join(" ")} ${genreById(d.genre).name}`.toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
};

function Card({ d, i, ref }: { d: Demo; i: number; ref?: React.Ref<HTMLLIElement> }) {
  const [focus, setFocus] = useState(false);
  const g = genreById(d.genre);
  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: EASE.expo, delay: Math.min(i, 8) * 0.03 }}
    >
      <Link href={`/motion/${d.slug}`} className="group block" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}>
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-line transition-[box-shadow,--tw-ring-color] duration-500 group-hover:shadow-[0_30px_80px_-30px_rgba(212,255,58,.25)] group-hover:ring-ink/25">
          {/* Keyboard focus previews the piece the same way hover does. */}
          <Stage demo={d} mini live={focus} className="aspect-[4/3] w-full" />
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-void/70 px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] text-ink backdrop-blur-sm">
            {String(INDEX.get(d.slug)).padStart(2, "0")}
          </span>
          {d.hint && (
            <span className="pointer-events-none absolute bottom-3 left-3 hidden translate-y-2 items-center gap-2 rounded-full bg-void/75 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-acid" />
              Interactive
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <span className="relative text-lg text-ink">
            {d.title}
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-acid transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
          </span>
          <span className={`font-${g.font} shrink-0 text-sm text-mute`}>{g.name}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-mute">{d.blurb}</p>
      </Link>
    </motion.li>
  );
}

export function GalleryView() {
  const params = useSearchParams();
  const router = useRouter();
  const g = params.get("genre") as GenreId | null;
  const active = g && GENRES.some((x) => x.id === g) ? g : null;
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const list = useMemo(() => DEMOS.filter((d) => (!active || d.genre === active) && (!query || matches(d, query))), [active, query]);
  const set = (id: GenreId | null) => router.replace(id ? `/gallery?genre=${id}` : "/gallery", { scroll: false });
  const chips = useRef<HTMLDivElement>(null);

  // On phones the chips scroll sideways: keep the active one in view (e.g. when arriving from a genre link).
  useEffect(() => {
    const row = chips.current;
    const el = row?.querySelector<HTMLElement>("[aria-pressed='true']");
    if (row && el && row.scrollWidth > row.clientWidth) row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <section className="px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[16vw] font-medium leading-[0.82] tracking-[-0.05em] text-ink sm:text-[11vw]">
            <Reveal text="Gallery" by="char" stagger={0.04} />
          </h1>
          <p className="mt-5 max-w-[44ch] text-mute">
            {DEMOS.length} live pieces in {GENRES.length} genres. Hover a card to run it, open it for the full stage and its source.
          </p>
        </div>
        <div className="pb-1 text-right font-mono text-[11px] uppercase tracking-[0.2em] text-mute sm:text-xs" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={list.length} className="block font-bitcrush text-5xl tracking-normal text-acid" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              {String(list.length).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          {query ? "Matching" : active ? genreById(active).name : "All pieces"}
        </div>
      </div>

      <div className="sticky-under-nav z-20 -mx-4 mt-10 border-y border-line bg-void/90 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
          <label className="relative block shrink-0 lg:w-64">
            <span className="sr-only">Search pieces</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter by name or technique"
              className="h-10 w-full rounded-full border border-line bg-night pl-10 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-dim focus:border-acid"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-mute transition-colors hover:text-ink" aria-label="Clear search">
                ✕
              </button>
            )}
          </label>
          <div
            ref={chips}
            role="group"
            aria-label="Filter by genre"
            className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 [mask-image:linear-gradient(90deg,transparent,#000_1rem,#000_calc(100%-2.5rem),transparent)] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:[mask-image:none]"
          >
            {[{ id: null as GenreId | null, name: "All", n: DEMOS.length }, ...GENRES.map((x) => ({ id: x.id as GenreId | null, name: x.name, n: COUNTS[x.id] }))].map((x) => {
              const on = active === x.id;
              return (
                <button
                  key={x.id ?? "all"}
                  onClick={() => set(x.id)}
                  aria-pressed={on}
                  className={`flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-sm transition-colors ${
                    on ? "border-acid bg-acid text-void" : "border-line bg-night text-mute hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {x.name}
                  <span className={`font-mono text-[11px] ${on ? "text-void/60" : "text-dim"}`}>{x.n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-5 py-28 text-center">
          <div className="font-bitcrush text-6xl text-dim">00</div>
          <p className="max-w-[36ch] text-mute">
            Nothing matches “{q.trim()}”{active ? ` in ${genreById(active).name}` : ""}.
          </p>
          <button
            onClick={() => {
              setQ("");
              set(null);
            }}
            className="rounded-full border border-ink/30 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-void"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((d, i) => (
              <Card key={d.slug} d={d} i={i} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}
