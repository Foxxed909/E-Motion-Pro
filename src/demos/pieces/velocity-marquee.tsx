"use client";

import { useEffect, useRef } from "react";

const ROWS = [
  { text: "KINETIC ✦ EMOTION ✦ VELOCITY ✦ ", font: "velocity", dir: 1, color: "#f3efe7" },
  { text: "MOTION IS THE MESSAGE — ", font: "monolith", dir: -1, color: "#d4ff3a" },
  { text: "FASTER FASTER FASTER ", font: "autobahn", dir: 1, color: "#ff5ca8" },
];

export default function VelocityMarquee({ mini }: { mini?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    let vel = 0;
    let lastX = 0;
    let lastT = performance.now();
    const pos = ROWS.map(() => 0);
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const v = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      vel += Math.max(-3, Math.min(3, v)) * 2.5;
    };
    const el = root.current!;
    if (!mini) el.addEventListener("pointermove", onMove);
    let id = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (mini) vel = Math.sin(now / 900) * 4;
      vel *= 0.94;
      tracks.current.forEach((t, i) => {
        if (!t) return;
        const half = t.scrollWidth / 2;
        pos[i] -= ROWS[i].dir * (60 + Math.abs(vel) * 220) * dt * (vel < 0 ? -1 : 1) * (i === 1 ? 1.2 : 1);
        if (pos[i] <= -half) pos[i] += half;
        if (pos[i] > 0) pos[i] -= half;
        t.style.transform = `translate3d(${pos[i]}px,0,0) skewX(${-vel * 4 * ROWS[i].dir}deg)`;
      });
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      el.removeEventListener("pointermove", onMove);
    };
  }, [mini]);
  return (
    <div ref={root} className="absolute inset-0 flex flex-col justify-center gap-[2cqh] overflow-hidden">
      {ROWS.map((r, i) => (
        <div key={i} className={`flex rotate-[-4deg] whitespace-nowrap font-${r.font}`} style={{ fontSize: "min(11cqw, 20cqh)", lineHeight: 1.05, color: r.color }}>
          <div ref={(n) => { tracks.current[i] = n; }} className="flex will-change-transform">
            {Array.from({ length: 6 }).map((_, k) => (
              <span key={k} className="pr-[0.3em]">{r.text}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
