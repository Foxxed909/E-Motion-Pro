"use client";

import Link from "next/link";
import { useState } from "react";
import { FontCycle } from "./Type";
import { Magnetic } from "./Magnetic";
import { scrollToTop } from "./SmoothScroll";

function HoverLetter({ c }: { c: string }) {
  const [on, setOn] = useState(false);
  return (
    <span onPointerEnter={() => setOn(true)} onPointerLeave={() => setTimeout(() => setOn(false), 600)} className="inline-block transition-colors duration-300 hover:text-acid">
      <FontCycle text={c} active={on} settle="monolith" interval={70} chance={0.6} />
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line px-4 pb-6 pt-[14vh] sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs">Have something that should move?</div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/gallery" className="inline-block rounded-full bg-acid px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-void">
                Browse all pieces
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/fonts" className="inline-block rounded-full border border-ink/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-ink">
                Get the fonts
              </Link>
            </Magnetic>
          </div>
        </div>
        <button onClick={scrollToTop} className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute hover:text-ink sm:text-xs">
          Back to top ↑
        </button>
      </div>
      <div className="mt-[8vh] select-none whitespace-nowrap text-[15.2vw] uppercase leading-[0.8] text-ink" aria-label="Let's move">
        {Array.from("LET'S MOVE").map((c, i) => (
          <HoverLetter key={i} c={c} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
        <span>© {new Date().getFullYear()} E-Motion Pro</span>
        <span>Fonts under SIL Open Font License 1.1</span>
        <span>Built with Next.js · Motion · WebGL</span>
      </div>
    </footer>
  );
}
