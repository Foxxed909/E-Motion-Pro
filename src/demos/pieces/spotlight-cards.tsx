"use client";

import { useEffect, useRef } from "react";

const CARDS = [
  { t: "Realtime", d: "Sub-frame latency on every gesture.", i: "◎" },
  { t: "Springs", d: "Physics-based easing, no magic numbers.", i: "∿" },
  { t: "Shaders", d: "GPU-painted surfaces at 120fps.", i: "◆" },
  { t: "Type", d: "Thirty faces, drawn by code.", i: "Aa" },
  { t: "Gestures", d: "Drag, fling, pinch and release.", i: "✋" },
  { t: "Scroll", d: "Stories scrubbed by your thumb.", i: "↧" },
];

export default function SpotlightCards({ mini }: { mini?: boolean }) {
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = grid.current!;
    const set = (x: number, y: number) => {
      el.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--x", `${x - r.left}px`);
        c.style.setProperty("--y", `${y - r.top}px`);
      });
    };
    const move = (e: PointerEvent) => set(e.clientX, e.clientY);
    let id = 0;
    {
      // Idle "ghost" light drifts when the user is not steering it.
      const t0 = performance.now();
      let last = 0;
      const onMove = () => (last = performance.now());
      el.addEventListener("pointermove", onMove);
      const tick = (now: number) => {
        id = requestAnimationFrame(tick);
        if (!mini && now - last < 2500) return;
        const b = el.getBoundingClientRect();
        const t = (now - t0) / 1000;
        set(b.left + b.width * (0.5 + 0.45 * Math.cos(t * 0.8)), b.top + b.height * (0.5 + 0.4 * Math.sin(t * 1.3)));
      };
      id = requestAnimationFrame(tick);
    }
    if (!mini) el.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(id);
      el.removeEventListener("pointermove", move);
    };
  }, [mini]);
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[4cqw]">
      <div ref={grid} className="grid h-full w-full grid-cols-3 grid-rows-2 gap-[1.5cqw]">
        {CARDS.map((c) => (
          <div
            key={c.t}
            data-card
            className="group relative overflow-hidden rounded-[1.6cqw] p-px"
            style={{ background: "radial-gradient(28cqw circle at var(--x) var(--y), rgba(212,255,58,.9), rgba(122,92,255,.35) 40%, rgba(255,255,255,.06) 70%)" }}
          >
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.55cqw] bg-[#0e0e13] p-[2.2cqw]">
              <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(22cqw circle at var(--x) var(--y), rgba(212,255,58,.12), transparent 60%)" }} />
              <span className="relative text-[max(16px,3cqw)] text-ink">{c.i}</span>
              <div className="relative">
                <div className="font-orbit text-[max(14px,2.4cqw)] text-ink">{c.t}</div>
                <div className="mt-1 text-[max(10px,1.3cqw)] leading-snug text-mute">{c.d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
