"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FontCycle } from "./Type";
import { Magnetic } from "./Magnetic";
import { scrollToTop } from "./SmoothScroll";
import { GENRES } from "@/demos/registry";
import { setPaletteOpen } from "@/lib/palette";
import { FONT_COUNT, PIECE_COUNT } from "@/lib/counts";

function HoverLetter({ c }: { c: string }) {
  const [on, setOn] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <span
      onPointerEnter={() => {
        clearTimeout(timer.current);
        setOn(true);
      }}
      onPointerLeave={() => {
        timer.current = setTimeout(() => setOn(false), 600);
      }}
      className="inline-block transition-colors duration-300 hover:text-acid"
    >
      <FontCycle text={c} active={on} settle="monolith" interval={70} chance={0.6} />
    </span>
  );
}

const heading = "font-mono text-[11px] uppercase tracking-[0.2em] text-dim sm:text-xs";
const link = "text-mute transition-colors hover:text-ink";
const KEYS: [string, string][] = [
  ["⌘K  /", "Search everything"],
  ["R", "Replay a piece"],
  ["F", "Fullscreen"],
  ["←  →", "Previous / next piece"],
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line px-4 pb-6 pt-[12vh] sm:px-8">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-[1.4fr_1fr_1.6fr_1.2fr]">
        <div>
          <p className="max-w-[18ch] text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-4xl">Have something that should move?</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/gallery" className="inline-block rounded-full bg-acid px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-void">
                Browse all pieces
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/fonts" className="inline-block rounded-full border border-ink/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-void">
                Get the fonts
              </Link>
            </Magnetic>
          </div>
        </div>

        <nav aria-label="Footer">
          <div className={heading}>Explore</div>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/" className={link}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/gallery" className={link}>
                Gallery <span className="font-mono text-xs text-dim">{PIECE_COUNT}</span>
              </Link>
            </li>
            <li>
              <Link href="/fonts" className={link}>
                Type foundry <span className="font-mono text-xs text-dim">{FONT_COUNT}</span>
              </Link>
            </li>
            <li>
              <button onClick={() => setPaletteOpen(true)} className={link}>
                Search
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="Genres">
          <div className={heading}>Genres</div>
          <ul className="mt-4 columns-2 gap-x-6 [&>li]:mb-2.5">
            {GENRES.map((g) => (
              <li key={g.id}>
                <Link href={`/gallery?genre=${g.id}`} className={link}>
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <div className={heading}>Keyboard</div>
          <dl className="mt-4 space-y-2.5">
            {KEYS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-mute">{v}</dt>
                <dd className="whitespace-pre font-mono text-xs text-ink">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-[10vh] select-none whitespace-nowrap text-[15.2vw] uppercase leading-[0.8] text-ink" aria-hidden>
        {Array.from("LET'S MOVE").map((c, i) => (
          <HoverLetter key={i} c={c} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
        <span>© {new Date().getFullYear()} E-Motion Pro</span>
        <span>Fonts under the SIL Open Font License 1.1</span>
        <button onClick={scrollToTop} className="py-1 text-mute transition-colors hover:text-ink">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
