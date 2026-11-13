"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FONTS, type EmpFont } from "@/lib/fonts";
import { FontCycle, Reveal } from "./Type";
import { EASE } from "@/lib/motion";
import { FONT_COUNT } from "@/lib/counts";
import { sound } from "@/lib/sound";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:;!?'\"-/()+=&#*@%<>_".split("");

const pill = "rounded-full border border-line px-3 py-2.5 text-mute transition-colors hover:border-ink hover:text-ink sm:py-1.5";

/** Copies a ready-to-paste @font-face rule for one typeface. */
function CopyCss({ f }: { f: EmpFont }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = async () => {
    const css = `@font-face {\n  font-family: "${f.family}";\n  src: url("/fonts/${f.slug}.woff2") format("woff2");\n  font-display: swap;\n}`;
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      sound.play("success");
    } catch {}
  };
  return (
    <button onClick={copy} className={`${pill} ${copied ? "border-acid text-acid" : ""}`} aria-label={`Copy @font-face CSS for ${f.name}`}>
      {copied ? "Copied ✓" : "CSS"}
    </button>
  );
}

function Specimen({ f, text, size, open, toggle }: { f: EmpFont; text: string; size: number; open: boolean; toggle: () => void }) {
  return (
    <motion.li
      id={f.slug}
      className="scroll-mt-44 border-t border-line py-8 first:border-t-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease: EASE.expo }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] sm:text-xs">
        <span className="flex items-baseline gap-4">
          <span className="text-acid">{String(f.index).padStart(2, "0")}</span>
          <span className="text-ink">{f.name}</span>
          <span className="text-dim">{f.genre}</span>
        </span>
        <span className="flex items-center gap-2">
          <button onClick={toggle} className={pill} aria-expanded={open}>
            {open ? "Hide glyphs" : "Glyphs"}
          </button>
          <CopyCss f={f} />
          <a href={`/fonts/${f.slug}.woff2`} download className={pill} aria-label={`Download ${f.name} as WOFF2`}>
            .woff2
          </a>
          <a href={`/fonts/${f.slug}.otf`} download className="rounded-full bg-acid px-3 py-2.5 text-void transition-colors hover:bg-ink sm:py-1.5" aria-label={`Download ${f.name} as OTF`}>
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
  // Deep links (/fonts#neon, e.g. from the command palette) must not land on a face the filter is hiding.
  useEffect(() => {
    const onHash = () => setGenre(null);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const list = genre ? FONTS.filter((f) => f.genre === genre) : FONTS;
  return (
    <section className="px-4 pb-24 pt-28 sm:px-8 sm:pt-36">
      <div className="grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-mute sm:text-xs">
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

      <div className="sticky-under-nav z-20 -mx-4 mt-10 border-y border-line bg-void/90 px-4 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 60))}
            placeholder={`Type to preview all ${FONT_COUNT}…`}
            aria-label="Preview text"
            className="h-10 min-w-0 flex-1 rounded-full border border-line bg-night px-5 font-mono text-sm text-ink outline-none transition-colors placeholder:text-dim focus:border-acid"
          />
          <label className="flex shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
            <span className="hidden sm:inline">Size</span>
            <input type="range" min={3} max={14} step={0.5} value={size} onChange={(e) => setSize(+e.target.value)} className="w-20 accent-acid sm:w-28" aria-label="Preview size" />
          </label>
        </div>
        <div role="group" aria-label="Filter by style" className="no-scrollbar -mx-4 mt-3 flex gap-1 overflow-x-auto px-4 [mask-image:linear-gradient(90deg,transparent,#000_1rem,#000_calc(100%-2.5rem),transparent)] sm:-mx-8 sm:px-8">
          {[null, ...genres].map((g) => (
            <button
              key={g ?? "all"}
              onClick={() => setGenre(g)}
              aria-pressed={genre === g}
              className={`relative shrink-0 rounded-full px-3 py-2.5 sm:py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] ${genre === g ? "text-void" : "text-mute hover:text-ink"}`}
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
