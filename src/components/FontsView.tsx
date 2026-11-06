"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FONTS, type EmpFont } from "@/lib/fonts";
import { FontCycle, Reveal } from "./Type";
import { EASE } from "@/lib/motion";
import { FONT_COUNT, PIECE_COUNT, GENRE_COUNT } from "@/lib/counts";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!?'\"-/()+=&#*@%<>_".split("");

function Specimen({ f, text, size, open, toggle }: { f: EmpFont; text: string; size: number; open: boolean; toggle: () => void }) {
  return (
    <motion.li
      id={f.slug}
      className="scroll-mt-48 border-t border-line py-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE.expo }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] sm:text-xs">
        <span className="flex items-baseline gap-4">
          <span className="text-acid">{String(f.index).padStart(2, "0")}</span>
          <span className="text-ink">{f.name}</span>
          <span className="text-dim">{f.genre}</span>
        </span>
        <span className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-full border border-line px-3 py-2.5 text-mute sm:py-1.5 transition-colors hover:border-ink hover:text-ink" aria-expanded={open}>
            {open ? "Hide glyphs" : "Glyphs"}
          </button>
          <a href={`/fonts/${f.slug}.woff2`} download className="rounded-full border border-line px-3 py-2.5 text-mute sm:py-1.5 transition-colors hover:border-ink hover:text-ink">
            .woff2
          </a>
          <a href={`/fonts/${f.slug}.otf`} download className="rounded-full bg-ink px-3 py-2.5 text-void sm:py-1.5 transition-colors hover:bg-acid">
            .otf ↓
          </a>
        </span>
      </div>
      <div className={`font-${f.slug} mt-5 break-words text-ink`} style={{ fontSize: `clamp(32px, ${size}vw, 260px)`, lineHeight: 1 }}>
        {text || f.name}
      </div>
      <p className="mt-4 max-w-[60ch] text-sm text-mute">{f.blurb}</p>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="overflow-hidden" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.6, ease: EASE.expo }}>
            <div className="mt-6 grid grid-cols-6 gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-10 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
              {GLYPHS.map((g, i) => (
                <motion.div
                  key={g + i}
                  className={`font-${f.slug} group relative flex aspect-square items-center justify-center bg-void text-3xl text-ink transition-colors hover:bg-acid hover:text-void sm:text-4xl`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.008, duration: 0.4, ease: EASE.expo }}
                >
                  {g}
                  <span className="absolute bottom-1 right-1.5 font-mono text-[8px] text-dim group-hover:text-void">{g.charCodeAt(0).toString(16).toUpperCase()}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function FontsView() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(7);
  const [open, setOpen] = useState<string | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const genres = Array.from(new Set(FONTS.map((f) => f.genre)));
  const list = genre ? FONTS.filter((f) => f.genre === genre) : FONTS;
  return (
    <section className="px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs">
            <span className="h-px w-10 bg-mute" /> The type foundry
          </div>
          <h1 className="text-[15vw] leading-[0.82] tracking-[-0.03em] text-ink sm:text-[10vw]">
            <FontCycle text={`${FONT_COUNT} Faces`} interval={160} chance={0.25} />
          </h1>
        </div>
        <div className="space-y-4 text-mute">
          <Reveal as="p" className="block text-lg text-ink" text="Every typeface here was generated for E-Motion Pro by our own font engine." />
          <p className="text-sm">
            One centre-line skeleton, 63 glyphs, {FONT_COUNT} rendering styles: monolines, broad-nib sweeps, pixel grids, dot screens,
            stencil cuts, tubes, slices and pencil passes. Display caps; lowercase maps to caps. Free under the SIL Open Font License.
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-void/85 px-4 pb-3 pt-20 backdrop-blur-xl sm:-mx-8 sm:px-8 sm:pt-24">
        <div className="flex flex-wrap items-center gap-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 60))}
            placeholder={`Type to preview all ${FONT_COUNT}…`}
            aria-label="Preview text"
            className="min-w-0 basis-full rounded-full border border-line bg-transparent px-5 py-2.5 sm:flex-1 sm:basis-auto font-mono text-sm text-ink outline-none focus:border-acid"
          />
          <label className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            Size
            <input type="range" min={3} max={14} step={0.5} value={size} onChange={(e) => setSize(+e.target.value)} className="w-28 accent-[#d4ff3a]" />
          </label>
        </div>
        <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">
          {[null, ...genres].map((g) => (
            <button
              key={g ?? "all"}
              onClick={() => setGenre(g)}
              className={`relative shrink-0 rounded-full px-3 py-2.5 sm:py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${genre === g ? "text-void" : "text-mute hover:text-ink"}`}
            >
              {genre === g && <motion.span layoutId="font-chip" className="absolute inset-0 rounded-full bg-acid" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{g ?? "All"}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4">
        {list.map((f) => (
          <Specimen key={f.slug} f={f} text={text} size={size} open={open === f.slug} toggle={() => setOpen((o) => (o === f.slug ? null : f.slug))} />
        ))}
      </ul>
    </section>
  );
}
