"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { PieceSource } from "@/lib/source";
import { EASE } from "@/lib/motion";
import { sound } from "@/lib/sound";

export function SourceView({ src }: { src: PieceSource }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(src.code);
      setCopied(true);
      sound.play("success");
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <section className="mt-12" id="source">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs">Source</div>
          <div className="mt-1 font-mono text-sm text-ink">
            {src.file} <span className="text-dim">· {src.lines} lines · React + TypeScript</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="relative overflow-hidden rounded-full border border-ink/25 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-ink transition-colors hover:border-acid sm:text-xs">
            <motion.span className="block" animate={{ y: copied ? "-150%" : "0%" }} transition={{ ease: EASE.expo, duration: 0.5 }}>
              Copy code
            </motion.span>
            <motion.span className="absolute inset-0 flex items-center justify-center text-acid" initial={{ y: "150%" }} animate={{ y: copied ? "0%" : "150%" }} transition={{ ease: EASE.expo, duration: 0.5 }}>
              Copied ✓
            </motion.span>
          </button>
          <button onClick={() => setOpen((o) => !o)} className="rounded-full bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-void sm:text-xs" aria-expanded={open}>
            {open ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      <motion.div
        className="relative mt-4 overflow-hidden rounded-2xl ring-1 ring-line"
        initial={false}
        animate={{ height: open ? "auto" : 360 }}
        transition={{ duration: 0.8, ease: EASE.expo }}
      >
        <div
          className="source-code overflow-x-auto bg-[#101010] p-5 font-mono text-[11.5px] leading-relaxed sm:p-6 sm:text-[12.5px]"
          data-lenis-prevent
          dangerouslySetInnerHTML={{ __html: src.html }}
        />
        {!open && (
          <button onClick={() => setOpen(true)} className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center bg-gradient-to-t from-[#101010] via-[#101010]/80 to-transparent pb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-mute hover:text-ink">
            Show all {src.lines} lines ↓
          </button>
        )}
      </motion.div>
    </section>
  );
}
