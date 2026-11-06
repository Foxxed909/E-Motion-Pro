"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Stage } from "@/demos/Stage";
import { DEMOS, genreById, type Demo } from "@/demos/registry";
import { Reveal } from "./Type";
import { Magnetic } from "./Magnetic";
import { EASE } from "@/lib/motion";
import { useRouter } from "next/navigation";
import type { PieceSource } from "@/lib/source";
import { SourceView } from "./SourceView";

export function DetailView({ demo, source }: { demo: Demo; source: PieceSource | null }) {
  const router = useRouter();
  const [replay, setReplay] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const i = DEMOS.findIndex((d) => d.slug === demo.slug);
  const prev = DEMOS[(i - 1 + DEMOS.length) % DEMOS.length];
  const next = DEMOS[(i + 1) % DEMOS.length];
  const genre = genreById(demo.genre);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key.toLowerCase() === "r") setReplay((r) => r + 1);
      if (e.key.toLowerCase() === "f") stageRef.current?.requestFullscreen?.();
      if (e.key === "ArrowRight") router.push(`/motion/${next.slug}`);
      if (e.key === "ArrowLeft") router.push(`/motion/${prev.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, next.slug, prev.slug]);

  return (
    <article className="px-4 pb-16 pt-24 sm:px-8 sm:pt-28">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Link href={`/gallery?genre=${demo.genre}`} className={`font-${genre.font} text-lg text-mute transition-colors hover:text-acid`}>
            ← {genre.name}
          </Link>
          <h1 className="mt-2 text-[13vw] font-medium leading-[0.85] tracking-[-0.05em] text-ink sm:text-[8vw] lg:text-[6.5vw]">
            <Reveal text={demo.title} by="char" stagger={0.03} />
          </h1>
        </div>
        <div className="flex gap-2">
          <Magnetic>
            <button onClick={() => setReplay((r) => r + 1)} className="rounded-full border border-ink/25 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-ink transition-colors hover:bg-ink hover:text-void sm:text-xs">
              ↻ Replay <span className="text-dim">(R)</span>
            </button>
          </Magnetic>
          <Magnetic>
            <button onClick={() => stageRef.current?.requestFullscreen?.()} className="rounded-full bg-acid px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-void sm:text-xs">
              ⤢ Fullscreen <span className="opacity-50">(F)</span>
            </button>
          </Magnetic>
        </div>
      </div>

      <motion.div
        ref={stageRef}
        className="overflow-hidden rounded-3xl ring-1 ring-line"
        initial={{ clipPath: "inset(12% 8% 12% 8% round 48px)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 }}
        transition={{ duration: 1.3, ease: EASE.expo, delay: 0.35 }}
        data-cursor-hide
      >
        <Stage demo={demo} replayKey={replay} className="h-[72svh] min-h-[420px] w-full" />
      </motion.div>

      <div className="mt-8 grid gap-8 border-b border-line pb-12 md:grid-cols-[2fr_1fr_1fr]">
        <p className="max-w-[52ch] text-xl leading-snug text-ink sm:text-2xl">{demo.blurb}</p>
        <dl className="space-y-4 font-mono text-[10px] uppercase tracking-[0.25em] sm:text-xs">
          <div>
            <dt className="text-dim">Genre</dt>
            <dd className="mt-1 text-ink">{genre.name}</dd>
          </div>
          <div>
            <dt className="text-dim">Index</dt>
            <dd className="mt-1 text-ink">
              {String(i + 1).padStart(2, "0")} / {DEMOS.length}
            </dd>
          </div>
        </dl>
        <dl className="space-y-4 font-mono text-[10px] uppercase tracking-[0.25em] sm:text-xs">
          <div>
            <dt className="text-dim">Techniques</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {demo.tags.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-ink">
                  {t}
                </span>
              ))}
            </dd>
          </div>
          {demo.hint && (
            <div>
              <dt className="text-dim">Try</dt>
              <dd className="mt-1 text-acid">{demo.hint}</dd>
            </div>
          )}
        </dl>
      </div>

      {source && <SourceView src={source} />}

      <nav className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2" aria-label="More pieces">
        {[
          { d: prev, label: "← Previous (←)" },
          { d: next, label: "Next (→) →" },
        ].map(({ d, label }, k) => (
          <Link key={d.slug} href={`/motion/${d.slug}`} className={`group relative overflow-hidden bg-void p-6 sm:p-10 ${k ? "sm:text-right" : ""}`} data-cursor="go">
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-y-100" />
            <span className="relative block font-mono text-[10px] uppercase tracking-[0.3em] text-mute group-hover:text-void sm:text-xs">{label}</span>
            <span className="relative mt-2 block text-3xl text-ink group-hover:text-void sm:text-5xl">{d.title}</span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
