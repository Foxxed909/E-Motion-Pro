"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FontCycle, Scramble } from "./Type";
import { Magnetic } from "./Magnetic";
import { EASE } from "@/lib/motion";
import { DEMOS } from "@/demos/registry";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/fonts", label: "Typefaces" },
  { href: "/#genres", label: "Genres" },
];

export function Nav() {
  const path = usePathname();
  const [hoverLogo, setHoverLogo] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <nav className="flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
          <Link
            href="/"
            className="text-xl tracking-wide text-ink sm:text-2xl"
            onPointerEnter={() => setHoverLogo(true)}
            onPointerLeave={() => setHoverLogo(false)}
            aria-label="E-Motion Pro home"
          >
            <FontCycle text="E—MOTION" active={hoverLogo} settle="orbit" interval={90} chance={0.4} />
            <sup className="ml-1 font-mono text-[10px] tracking-widest text-ink/60">PRO</sup>
          </Link>
          <ul className="hidden items-center gap-2 md:flex" onPointerLeave={() => setHovered(null)}>
            {LINKS.map((l) => {
              const active = l.href === path;
              return (
                <li key={l.href} className="relative">
                  <Magnetic strength={0.25}>
                    <Link
                      href={l.href}
                      onPointerEnter={() => setHovered(l.href)}
                      className="relative block px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink"
                    >
                      {hovered === l.href && (
                        <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink/15" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                      )}
                      <span className="relative">
                        <Scramble text={l.label} trigger={hovered === l.href} />
                      </span>
                      {active && <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink" />}
                    </Link>
                  </Magnetic>
                </li>
              );
            })}
          </ul>
          <div className="hidden font-mono text-xs uppercase tracking-[0.2em] text-ink/70 md:block">
            {DEMOS.length} pieces / 25 fonts
          </div>
          <button
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <motion.span className="block h-px w-6 bg-ink" animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} />
            <motion.span className="block h-px w-6 bg-ink" animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} />
          </button>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-acid p-6 pb-16 text-void md:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.8, ease: EASE.quart }}
          >
            {[{ href: "/", label: "Home" }, ...LINKS].map((l, i) => (
              <motion.div key={l.href} className="overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: EASE.expo }}>
                  <Link href={l.href} className="block py-1 font-monolith text-6xl uppercase leading-none">
                    {l.label}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
