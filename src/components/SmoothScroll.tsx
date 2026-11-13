"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Native scrolling (no scroll-jacking library): the OS and trackpad momentum stay 1:1
 * with the user's input. This component only handles in-page #hash targets after
 * client-side navigation, and locks scrolling when asked.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const toHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id && document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t = window.location.hash ? setTimeout(toHash, 350) : undefined;
    window.addEventListener("hashchange", toHash);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("hashchange", toHash);
    };
  }, [pathname]);
  return <>{children}</>;
}

/**
 * Lock or unlock page scrolling for one named owner (preloader, menu, palette).
 * Owners are tracked separately, so one overlay closing can never release a lock
 * that another overlay still holds.
 */
const locks = new Set<string>();
export function lockScroll(owner: string, on: boolean) {
  if (on) locks.add(owner);
  else locks.delete(owner);
  document.documentElement.style.overflow = locks.size ? "hidden" : "";
}

export function scrollToTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
