"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import skeleton from "@/data/skeleton.json";

type Line = [number, number][];
const SKELETON = skeleton as unknown as Record<string, Line[]>;

// Orbit (the hero face) is the skeleton stroked at half-width 40 with 50-unit side bearings,
// so a glyph's origin sits (40 + 50 - minX) font units right of the letter box's left edge.
const ORBIT_OFFSET = 90;

/**
 * Intro overlay for the hero wordmark: draws each letter's real font skeleton in acid,
 * aligned to the rendered glyph, then fades out as the solid letter appears.
 */
export function HeroSkeleton({ host, letters, play, stagger, draw }: { host: React.RefObject<HTMLElement | null>; letters: React.RefObject<(HTMLElement | null)[]>; play: boolean; stagger: number; draw: number }) {
  const [paths, setPaths] = useState<{ d: string; w: number; h: number; stroke: number } | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setGone(true);
    let cancelled = false;
    (async () => {
      try {
        await document.fonts.ready;
      } catch {}
      if (cancelled || !host.current) return;
      const hr = host.current.getBoundingClientRect();
      const d: string[] = [];
      let fsize = 0;
      for (const box of letters.current ?? []) {
        const el = box?.querySelector<HTMLElement>("[aria-hidden]") ?? box;
        if (!el) {
          d.push("");
          continue;
        }
        const r = el.getBoundingClientRect();
        const fs = parseFloat(getComputedStyle(el).fontSize);
        fsize = fs;
        // Measure the real baseline with a zero-size inline-block probe.
        const probe = document.createElement("span");
        probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
        el.appendChild(probe);
        const base = probe.getBoundingClientRect().top - hr.top;
        probe.remove();
        const left = r.left - hr.left;
        const ch = el.textContent ?? "";
        const glyph = SKELETON[ch];
        if (!glyph) {
          // Characters without a skeleton (the em dash) get a single centre stroke.
          const y = base - 0.3 * fs;
          d.push(`M${(left + r.width * 0.06).toFixed(1)} ${y.toFixed(1)}L${(left + r.width * 0.94).toFixed(1)} ${y.toFixed(1)}`);
          continue;
        }
        const minX = Math.min(...glyph.flat().map((p) => p[0]));
        const X = (x: number) => (left + ((x + ORBIT_OFFSET - minX) / 1000) * fs).toFixed(1);
        const Y = (y: number) => (base - (y / 1000) * fs).toFixed(1);
        d.push(glyph.map((pl) => pl.map((p, k) => `${k ? "L" : "M"}${X(p[0])} ${Y(p[1])}`).join("")).join(""));
      }
      if (!cancelled) setPaths({ d: d.join("|"), w: hr.width, h: hr.height, stroke: Math.max(1.5, fsize * 0.012) });
    })();
    const t = setTimeout(() => setGone(true), (0.2 + (letters.current?.length ?? 8) * stagger + draw + 1.2) * 1000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [play, host, letters, stagger, draw]);

  if (!paths || gone) return null;
  return (
    <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width={paths.w} height={paths.h} aria-hidden>
      {paths.d.split("|").map((d, i) =>
        d ? (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#d4ff3a"
            strokeWidth={paths.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
            transition={{ duration: draw + 0.9, times: [0, draw / (draw + 0.9), 1], delay: 0.1 + i * stagger, ease: [0.65, 0, 0.35, 1] }}
          />
        ) : null,
      )}
    </svg>
  );
}
