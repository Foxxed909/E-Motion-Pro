"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEMOS, GENRES, genreById } from "@/demos/registry";
import { FONTS } from "@/lib/fonts";
import { Stage } from "@/demos/Stage";
import { setPaletteOpen, usePaletteOpen } from "@/lib/palette";
import { lockScroll } from "./SmoothScroll";
import { sound } from "@/lib/sound";
import { EASE } from "@/lib/motion";

type Item = { id: string; group: string; label: string; hint: string; href: string; font?: string; demo?: (typeof DEMOS)[number] };

const ITEMS: Item[] = [
  { id: "p-home", group: "Pages", label: "Home", hint: "Landing", href: "/" },
  { id: "p-gallery", group: "Pages", label: "Gallery", hint: `${DEMOS.length} pieces`, href: "/gallery" },
  { id: "p-fonts", group: "Pages", label: "Type Foundry", hint: `${FONTS.length} fonts`, href: "/fonts" },
  ...DEMOS.map((d) => ({ id: `d-${d.slug}`, group: "Pieces", label: d.title, hint: genreById(d.genre).name, href: `/motion/${d.slug}`, demo: d })),
  ...GENRES.map((g) => ({ id: `g-${g.id}`, group: "Genres", label: g.name, hint: g.line, href: `/gallery?genre=${g.id}`, font: g.font })),
  ...FONTS.map((f) => ({ id: `f-${f.slug}`, group: "Typefaces", label: f.name, hint: f.genre, href: `/fonts#${f.slug}`, font: f.slug })),
];

/** Subsequence fuzzy score: higher is better, -1 means no match. */
function score(q: string, s: string) {
  if (!q) return 0;
  q = q.toLowerCase();
  s = s.toLowerCase();
  if (s.startsWith(q)) return 1000 - s.length;
  const idx = s.indexOf(q);
  if (idx >= 0) return 500 - idx;
  let i = 0, run = 0, total = 0;
  for (const c of s) {
    if (c === q[i]) {
      i++;
      run++;
      total += run;
      if (i === q.length) return total;
    } else run = 0;
  }
  return -1;
}

export function CommandPalette() {
  const open = usePaletteOpen();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    return ITEMS.map((it) => ({ it, s: Math.max(score(q, it.label), score(q, it.hint) - 300) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => (q ? b.s - a.s : 0))
      .slice(0, q ? 40 : 60)
      .map((x) => x.it);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!open);
      } else if (e.key === "/" && !open && !(e.target as HTMLElement)?.closest("input,textarea")) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      lockScroll(true);
      sound.play("toggle");
      setTimeout(() => input.current?.focus(), 30);
    } else lockScroll(false);
  }, [open]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    list.current?.querySelector(`[data-idx="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = (it?: Item) => {
    if (!it) return;
    setPaletteOpen(false);
    router.push(it.href);
  };

  const active = results[sel];
  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[96] flex items-start justify-center px-3 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setPaletteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="absolute inset-0 bg-void/70 backdrop-blur-md" />
          <motion.div
            className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl bg-night/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/10 md:grid-cols-[1.15fr_1fr]"
            initial={{ y: -20, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE.expo }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-0 flex-col">
              <div className="flex items-center gap-3 border-b border-line px-5">
                <span className="font-mono text-acid">⌘</span>
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSel((s) => Math.min(results.length - 1, s + 1));
                      sound.play("hover");
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSel((s) => Math.max(0, s - 1));
                      sound.play("hover");
                    } else if (e.key === "Enter") go(active);
                    else if (e.key === "Escape") setPaletteOpen(false);
                  }}
                  placeholder="Search pieces, fonts, genres…"
                  className="w-full bg-transparent py-4 text-base text-ink outline-none placeholder:text-dim"
                  aria-label="Search"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={active ? `pal-${active.id}` : undefined}
                />
                <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-dim">ESC</kbd>
              </div>
              <div ref={list} id="palette-list" role="listbox" className="no-scrollbar max-h-[56vh] overflow-y-auto p-2">
                {results.length === 0 && <div className="p-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-dim">Nothing moves here</div>}
                {results.map((it, i) => {
                  const header = it.group !== lastGroup;
                  lastGroup = it.group;
                  return (
                    <div key={it.id}>
                      {header && <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-dim">{it.group}</div>}
                      <button
                        id={`pal-${it.id}`}
                        data-idx={i}
                        role="option"
                        aria-selected={i === sel}
                        onPointerMove={() => i !== sel && setSel(i)}
                        onClick={() => go(it)}
                        className="relative flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left"
                      >
                        {i === sel && <motion.span layoutId="pal-sel" className="absolute inset-0 rounded-lg bg-ink/10 ring-1 ring-acid/40" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                        <span className={`relative truncate text-[15px] ${it.font ? `font-${it.font} text-lg` : ""} ${i === sel ? "text-ink" : "text-ink/80"}`}>{it.label}</span>
                        <span className="relative shrink-0 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-dim">{it.hint}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 border-t border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span className="ml-auto">{results.length} results</span>
              </div>
            </div>
            <div className="relative hidden border-l border-line md:block">
              <AnimatePresence mode="popLayout">
                {active && (
                  <motion.div key={active.id} className="absolute inset-0 flex flex-col" initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    {active.demo ? (
                      <Stage demo={active.demo} mini live className="flex-1" />
                    ) : (
                      <div className="flex flex-1 items-center justify-center bg-void p-6 text-center">
                        <span className={`${active.font ? `font-${active.font}` : "font-orbit"} text-6xl leading-none text-ink`}>{active.font ? (active.group === "Typefaces" ? "Aa Gg" : active.label) : active.label}</span>
                      </div>
                    )}
                    <div className="border-t border-line p-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">{active.group}</div>
                      <div className="mt-1 text-sm text-mute">{active.demo?.blurb ?? active.hint}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PaletteButton({ className = "" }: { className?: string }) {
  return (
    <button onClick={() => setPaletteOpen(true)} className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-ink ${className}`} aria-label="Open search">
      <span className="hidden lg:inline">Search</span>
      <kbd className="rounded border border-ink/30 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
    </button>
  );
}
