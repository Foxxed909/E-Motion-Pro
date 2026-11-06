"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FONTS } from "@/lib/fonts";
import { Reveal } from "../Type";
import { EASE } from "@/lib/motion";
import { SectionLabel } from "../SectionLabel";
import { FONT_COUNT, PIECE_COUNT, GENRE_COUNT } from "@/lib/counts";

export function TypeShowcase() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const [text, setText] = useState("Make it move");
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((v) => (v + 1) % FONTS.length), 1500);
    return () => clearInterval(id);
  }, [auto]);
  const f = FONTS[i];
  return (
    <section className="relative overflow-hidden border-t border-line px-4 py-[14vh] sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="mb-6">
            <SectionLabel n={5}>Type tester</SectionLabel>
          </div>
          <Reveal as="h2" text={`${FONT_COUNT} fonts. All new. Drawn by code.`} className="block text-[11vw] font-medium leading-[0.9] tracking-[-0.04em] text-ink sm:text-[6.5vw] lg:text-[4.8vw]" />
          <p className="mt-6 max-w-[48ch] text-mute">
            One hand-built letter skeleton, rendered {FONT_COUNT} ways by our own font engine: broad-nib pens, LED matrices, stencil cuts,
            neon tubes, glitch slices, pencil passes. Every face is a real OpenType font, free to download.
          </p>
          <Link href="/fonts" className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-ink hover:text-void">
            Open the type foundry →
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="relative flex min-h-[38vh] items-center overflow-hidden rounded-2xl bg-night p-6 ring-1 ring-line sm:p-10">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={f.slug}
                className={`font-${f.slug} w-full break-words text-[13vw] leading-[0.95] text-ink lg:text-[6.4vw]`}
                initial={{ y: "40%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-40%", opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease: EASE.expo }}
              >
                {text || "Type here"}
              </motion.div>
            </AnimatePresence>
            <div className="absolute left-6 top-5 flex gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute sm:left-10">
              <span className="text-acid">{String(f.index).padStart(2, "0")}</span>
              <span className="text-ink">{f.name}</span>
              <span>{f.genre}</span>
            </div>
          </div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 40))}
            aria-label="Type tester"
            className="mt-3 w-full rounded-full border border-line bg-transparent px-5 py-3 font-mono text-sm text-ink outline-none transition-colors focus:border-acid"
            placeholder="Type something…"
          />
          <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
            {FONTS.map((x, k) => (
              <button
                key={x.slug}
                onClick={() => {
                  setAuto(false);
                  setI(k);
                }}
                title={x.name}
                className={`font-${x.slug} flex aspect-square items-center justify-center rounded-lg text-xl transition-colors ${k === i ? "bg-acid text-void" : "bg-night text-ink hover:bg-smoke"}`}
              >
                Aa
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
