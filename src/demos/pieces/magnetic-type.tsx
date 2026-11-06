"use client";

import { motion, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

const WORD = "REPEL";

function Letter({ c, pointer }: { c: string; pointer: React.RefObject<{ x: number; y: number; on: boolean }> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 11 });
  const y = useSpring(0, { stiffness: 180, damping: 11 });
  const r = useSpring(0, { stiffness: 160, damping: 10 });
  const s = useSpring(1, { stiffness: 200, damping: 12 });
  useEffect(() => {
    let id = 0;
    const tick = () => {
      id = requestAnimationFrame(tick);
      const el = ref.current;
      const p = pointer.current;
      if (!el || !p) return;
      const b = el.getBoundingClientRect();
      const cx = b.left + b.width / 2 - x.get();
      const cy = b.top + b.height / 2 - y.get();
      const dx = cx - p.x;
      const dy = cy - p.y;
      const d = Math.hypot(dx, dy);
      const R = b.height * 1.3;
      if (p.on && d < R) {
        const f = (1 - d / R) ** 2;
        x.set((dx / (d || 1)) * f * R * 0.8);
        y.set((dy / (d || 1)) * f * R * 0.8);
        r.set((dx / (d || 1)) * f * 40);
        s.set(1 - f * 0.25);
      } else {
        x.set(0);
        y.set(0);
        r.set(0);
        s.set(1);
      }
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [pointer, x, y, r, s]);
  return (
    <motion.span ref={ref} className="inline-block" style={{ x, y, rotate: r, scale: s }}>
      {c}
    </motion.span>
  );
}

export default function MagneticType({ mini }: { mini?: boolean }) {
  const pointer = useRef({ x: -9999, y: -9999, on: false });
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mini) return;
    // In thumbnails, an invisible "ghost" pointer sweeps through the word.
    let id = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const b = box.current?.getBoundingClientRect();
      if (!b) return;
      const t = (now - t0) / 1000;
      pointer.current = { x: b.left + b.width * (0.5 + 0.42 * Math.sin(t * 1.3)), y: b.top + b.height * (0.5 + 0.12 * Math.sin(t * 2.6)), on: true };
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [mini]);
  return (
    <div
      ref={box}
      className="absolute inset-0 flex items-center justify-center text-void"
      onPointerMove={(e) => !mini && (pointer.current = { x: e.clientX, y: e.clientY, on: true })}
      onPointerLeave={() => !mini && (pointer.current.on = false)}
    >
      <div className="font-bubblegum select-none" style={{ fontSize: "min(22cqw, 45cqh)", lineHeight: 1 }}>
        {Array.from(WORD).map((c, i) => (
          <Letter key={i} c={c} pointer={pointer} />
        ))}
      </div>
      <span className="absolute bottom-[5cqh] font-mono text-[max(10px,1.3cqw)] uppercase tracking-[0.3em]">spring k=180 / c=11</span>
    </div>
  );
}
