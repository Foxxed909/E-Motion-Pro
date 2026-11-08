"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SoundToggle } from "./Sound";
import { PaletteButton } from "./CommandPalette";
import { setPaletteOpen } from "@/lib/palette";
import { lockScroll } from "./SmoothScroll";

const LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/fonts", label: "Typefaces" },
  { href: "/#genres", label: "Genres" },
];

/**
 * Calm, solid navigation: transparent over the hero, a frosted bar once you scroll,
 * tucked away while scrolling down and back as soon as you scroll up.
 */
export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => lockScroll(open), [open]);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => (href.startsWith("/#") ? false : path === href || path.startsWith(href + "/"));

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled || open ? "border-b border-line bg-void/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <nav className="mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-8" aria-label="Main">
          <Link href="/" className="whitespace-nowrap font-orbit text-lg tracking-wide text-ink sm:text-xl" aria-label="E-Motion Pro home">
            E—MOTION<sup className="ml-1 font-mono text-[10px] tracking-widest text-mute">PRO</sup>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 text-sm transition-colors ${active ? "text-ink" : "text-mute hover:text-ink"}`}
                  >
                    {l.label}
                    {active && <motion.span layoutId="nav-active" className="absolute -bottom-0.5 left-0 right-0 h-px bg-acid" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <PaletteButton className="h-9 rounded-full border border-line px-3 text-mute transition-colors hover:border-ink/30 hover:text-ink" />
            <SoundToggle className="h-9 rounded-full px-2 text-mute hover:text-ink" />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setPaletteOpen(true)} className="flex h-11 w-11 items-center justify-center text-ink" aria-label="Search">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <motion.span className="block h-px w-5 bg-ink" animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} />
              <motion.span className="block h-px w-5 bg-ink" animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-void px-4 pb-10 pt-20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ href: "/", label: "Home" }, ...LINKS].map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, duration: 0.25 }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between border-b border-line py-4 text-2xl ${path === l.href ? "text-ink" : "text-ink/80"}`}
                  >
                    {l.label}
                    <span className="text-base text-dim">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-mute">Interface sounds</span>
              <SoundToggle label />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
