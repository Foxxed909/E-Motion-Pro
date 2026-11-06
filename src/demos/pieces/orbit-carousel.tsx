"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { FONTS } from "@/lib/fonts";

const N = 10;
const PICK = FONTS.filter((_, i) => i % 2 === 0).slice(0, N);
const HUES = ["#ff4f2e", "#7a5cff", "#d4ff3a", "#33e1ff", "#ff5ca8"];

export default function OrbitCarousel({ mini }: { mini?: boolean }) {
  const rot = useMotionValue(0);
  const transform = useTransform(rot, (r) => `translateZ(-48cqh) rotateX(-8deg) rotateY(${r}deg)`);
  const dragging = useRef(false);
  const last = useRef({ x: 0, t: 0, v: 0 });

  useEffect(() => {
    let id = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const dt = (now - prev) / 1000;
      prev = now;
      if (!dragging.current) rot.set(rot.get() - dt * (mini ? 24 : 10));
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [mini, rot]);

  return (
    <div
      className="absolute inset-0 flex touch-none items-center justify-center overflow-hidden"
      style={{ perspective: "120cqh" }}
      onPointerDown={(e) => {
        dragging.current = true;
        last.current = { x: e.clientX, t: performance.now(), v: 0 };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const now = performance.now();
        const dx = e.clientX - last.current.x;
        rot.set(rot.get() + dx * 0.25);
        last.current = { x: e.clientX, t: now, v: (dx * 0.25) / Math.max(1, now - last.current.t) };
      }}
      onPointerUp={() => {
        dragging.current = false;
        animate(rot, rot.get() + last.current.v * 400, { type: "spring", stiffness: 40, damping: 20 });
      }}
      data-cursor="drag"
    >
      <motion.div className="relative h-[46cqh] w-[22cqh]" style={{ transformStyle: "preserve-3d", transform }}>
        {PICK.map((f, i) => (
          <div
            key={f.slug}
            className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[2cqh] border border-white/10 p-[2cqh] [backface-visibility:hidden]"
            style={{
              transform: `rotateY(${(i * 360) / N}deg) translateZ(48cqh)`,
              background: `linear-gradient(170deg, ${HUES[i % HUES.length]}, #0a0a0a 75%)`,
            }}
          >
            <span className="font-mono text-[1.5cqh] uppercase tracking-[0.25em] text-white/70">{String(f.index).padStart(2, "0")}</span>
            <span className={`font-${f.slug} text-[11cqh] leading-none text-white`}>Aa</span>
            <span className="font-mono text-[1.6cqh] uppercase tracking-[0.2em] text-white">{f.name}</span>
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute bottom-[5cqh] font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-mute">drag to spin</div>
    </div>
  );
}
