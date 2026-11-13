import Link from "next/link";
import { DEMOS, GENRES, genreById, type Demo } from "@/demos/registry";
import { SectionLabel } from "../SectionLabel";

function Tile({ d }: { d: Demo }) {
  return (
    <Link
      href={`/motion/${d.slug}`}
      className="group relative block aspect-[4/3] w-[46vw] shrink-0 overflow-hidden rounded-xl ring-1 ring-line sm:w-[24vw] lg:w-[17vw]"
      style={{ background: d.tone }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/posters/${d.slug}.webp`} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 flex translate-y-1 items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <span className="truncate text-sm text-white">{d.title}</span>
        <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">{genreById(d.genre).name}</span>
      </span>
    </Link>
  );
}

/** A row of tiles, duplicated once so the CSS marquee can loop seamlessly. The copy is hidden from assistive tech and the tab order. */
function Row({ items, reverse, dur }: { items: Demo[]; reverse?: boolean; dur: number }) {
  return (
    <div className="overflow-hidden">
      <div className={`marquee-track flex w-max ${reverse ? "reverse" : ""}`} style={{ "--marquee-dur": `${dur}s` } as React.CSSProperties}>
        <div className="flex gap-3 pr-3 sm:gap-4 sm:pr-4">
          {items.map((d) => (
            <Tile key={d.slug} d={d} />
          ))}
        </div>
        <div className="flex gap-3 pr-3 sm:gap-4 sm:pr-4" aria-hidden inert>
          {items.map((d) => (
            <Tile key={d.slug} d={d} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The whole library at a glance: every piece as a still, drifting in two rows. */
export function Wall() {
  // Interleave genres so neighbouring tiles never look alike.
  const mixed = [...DEMOS].sort((a, b) => {
    const ai = DEMOS.filter((x) => x.genre === a.genre).indexOf(a);
    const bi = DEMOS.filter((x) => x.genre === b.genre).indexOf(b);
    return ai - bi || GENRES.findIndex((g) => g.id === a.genre) - GENRES.findIndex((g) => g.id === b.genre);
  });
  const half = Math.ceil(mixed.length / 2);
  return (
    <section className="border-t border-line py-[12vh]" aria-labelledby="wall-title">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
        <div>
          <SectionLabel n={4}>The whole library</SectionLabel>
          <h2 id="wall-title" className="mt-5 text-[11vw] font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-[6vw] lg:text-[4.6vw]">
            {DEMOS.length} pieces. <span className="font-opera text-acid">One wall.</span>
          </h2>
        </div>
        <div className="max-w-[36ch]">
          <p className="text-mute">Every still below is a frame from a piece that runs live in your browser. Pick one and it opens on a full stage with its source.</p>
          <Link href="/gallery" className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink underline decoration-acid underline-offset-8 transition-colors hover:text-acid">
            Browse and filter all {DEMOS.length} →
          </Link>
        </div>
      </div>
      <div className="marquee-pause space-y-3 sm:space-y-4">
        <Row items={mixed.slice(0, half)} dur={110} />
        <Row items={mixed.slice(half)} dur={130} reverse />
      </div>
    </section>
  );
}
