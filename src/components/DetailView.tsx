"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stage } from "@/demos/Stage";
import { DEMOS, demosInGenre, genreById, type Demo } from "@/demos/registry";
import { Reveal } from "./Type";
import { Magnetic } from "./Magnetic";
import { EASE } from "@/lib/motion";
import { useRouter } from "next/navigation";
import type { PieceSource } from "@/lib/source";
import { SourceView } from "./SourceView";
import { usePaletteOpen } from "@/lib/palette";

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el?.closest?.("input,textarea,select,[contenteditable='true']");
};

const Poster = ({ slug, className = "" }: { slug: string; className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/posters/${slug}.webp`} alt="" loading="lazy" decoding="async" className={`object-cover ${className}`} draggable={false} />
);

export function DetailView({ demo, source }: { demo: Demo; source: PieceSource | null }) {
  const router = useRouter();
  const paletteOpen = usePaletteOpen();
  const [replay, setReplay] = useState(0);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const i = DEMOS.findIndex((d) => d.slug === demo.slug);
  const prev = DEMOS[(i - 1 + DEMOS.length) % DEMOS.length];
  const next = DEMOS[(i + 1) % DEMOS.length];
  const genre = genreById(demo.genre);
  const siblings = demosInGenre(demo.genre);
  const related = siblings.filter((d) => d.slug !== demo.slug).slice(0, 3);

  // Element fullscreen does not exist everywhere (iPhone Safari): only offer it where it works.
  useEffect(() => {
    setCanFullscreen(!!document.fullscreenEnabled);
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenEnabled) return;
    const p = document.fullscreenElement ? document.exitFullscreen() : stageRef.current?.requestFullscreen();
    p?.catch(() => {});
  }, []);

  useEffect(() => {
    if (paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      // Leave browser shortcuts (⌘R, Ctrl+F, Alt+←) and typing alone.
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented || isTyping(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === "r") setReplay((r) => r + 1);
      else if (k === "f") toggleFullscreen();
      else if (e.key === "ArrowRight") router.push(`/motion/${next.slug}`);
      else if (e.key === "ArrowLeft") router.push(`/motion/${prev.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, next.slug, prev.slug, paletteOpen, toggleFullscreen]);

  const ghost = "w-full whitespace-nowrap rounded-full border border-ink/25 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-void sm:text-xs";

  return (
    <article className="px-4 pb-16 pt-24 sm:px-8 sm:pt-28">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-dim sm:text-xs">
        <Link href="/gallery" className="transition-colors hover:text-ink">
          Gallery
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/gallery?genre=${demo.genre}`} className="text-mute transition-colors hover:text-acid">
          {genre.name}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink" aria-current="page">
          {String(i + 1).padStart(2, "0")}
        </span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-[13vw] font-medium leading-[0.85] tracking-[-0.05em] text-ink sm:text-[8vw] lg:text-[6.5vw]">
          <Reveal text={demo.title} by="char" stagger={0.03} />
        </h1>
        <div className={`grid w-full gap-2 sm:flex sm:w-auto ${canFullscreen ? "grid-cols-2" : "grid-cols-1"}`}>
          <Magnetic className="block">
            <button onClick={() => setReplay((r) => r + 1)} className={ghost}>
              ↻ Replay <kbd className="ml-1 hidden font-mono text-dim sm:inline">R</kbd>
            </button>
          </Magnetic>
          {canFullscreen && (
            <Magnetic className="block">
              <button onClick={toggleFullscreen} className="w-full whitespace-nowrap rounded-full bg-acid px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-void sm:text-xs">
                ⤢ {isFullscreen ? "Exit" : "Fullscreen"} <kbd className="ml-1 hidden font-mono opacity-60 sm:inline">F</kbd>
              </button>
            </Magnetic>
          )}
        </div>
      </div>

      <motion.div
        ref={stageRef}
        className="overflow-hidden rounded-3xl bg-void ring-1 ring-line"
        initial={{ clipPath: "inset(12% 8% 12% 8% round 48px)", opacity: 0 }}
        animate={{ clipPath: `inset(0% 0% 0% 0% round ${isFullscreen ? 0 : 24}px)`, opacity: 1 }}
        transition={{ duration: 1.3, ease: EASE.expo, delay: 0.35 }}
      >
        <Stage demo={demo} replayKey={replay} className={isFullscreen ? "h-screen w-screen" : "h-[64svh] min-h-[380px] w-full sm:h-[72svh] sm:min-h-[420px]"} />
      </motion.div>
      {demo.hint && (
        <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-acid sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid" aria-hidden />
          Try it: {demo.hint}
        </p>
      )}

      <div className="mt-8 grid gap-8 border-b border-line pb-12 md:grid-cols-[1.6fr_1fr]">
        <p className="max-w-[46ch] text-xl leading-snug text-ink sm:text-2xl">{demo.blurb}</p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-start font-mono text-[11px] uppercase tracking-[0.2em] sm:text-xs">
          <div>
            <dt className="text-dim">Genre</dt>
            <dd className="mt-1.5">
              <Link href={`/gallery?genre=${demo.genre}`} className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-acid hover:decoration-acid">
                {genre.name}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-dim">Index</dt>
            <dd className="mt-1.5 text-ink">
              {String(i + 1).padStart(2, "0")} <span className="text-dim">/ {DEMOS.length}</span>
            </dd>
          </div>
          <div>
            <dt className="text-dim">Techniques</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {demo.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-ink">
                  {t}
                </span>
              ))}
            </dd>
          </div>
          {source && (
            <div>
              <dt className="text-dim">Source</dt>
              <dd className="mt-1.5">
                <a href="#source" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-acid hover:decoration-acid">
                  {source.lines} lines ↓
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {source && <SourceView src={source} />}

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl">
              More <span className={`font-${genre.font} text-acid`}>{genre.name}</span>
            </h2>
            <Link href={`/gallery?genre=${demo.genre}`} className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition-colors hover:text-ink sm:text-xs">
              All {siblings.length} →
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((d) => (
              <li key={d.slug}>
                <Link href={`/motion/${d.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl ring-1 ring-line transition-[box-shadow] duration-300 group-hover:ring-ink/30">
                    <Stage demo={d} mini className="aspect-[4/3] w-full" />
                  </div>
                  <div className="mt-2.5 text-base text-ink">{d.title}</div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-mute">{d.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2" aria-label="Previous and next piece">
        {[
          { d: prev, label: "Previous", key: "←" },
          { d: next, label: "Next", key: "→" },
        ].map(({ d, label, key }, k) => (
          <Link key={label} href={`/motion/${d.slug}`} className={`group relative flex items-center gap-5 overflow-hidden bg-void p-5 sm:p-8 ${k ? "sm:flex-row-reverse sm:text-right" : ""}`}>
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
            <span className="relative block aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-line sm:w-36" style={{ background: d.tone }}>
              <Poster slug={d.slug} className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110" />
            </span>
            <span className="relative min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-mute group-hover:text-void sm:text-xs">
                {k ? `${label} ${key}` : `${key} ${label}`}
              </span>
              <span className="mt-1.5 block text-2xl leading-tight text-ink group-hover:text-void sm:text-4xl">{d.title}</span>
            </span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
