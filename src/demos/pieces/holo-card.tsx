"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export default function HoloCard({ mini }: { mini?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-22, 22]);
  const rotateX = useTransform(sy, [0, 1], [18, -18]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const foilPos = useTransform(sx, (v) => `${v * 200}% ${v * 120}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,.55), rgba(255,255,255,0) 45%)`;

  useEffect(() => {
    let id = 0;
    let idle = true;
    const el = ref.current!;
    const enter = () => (idle = false);
    const leave = () => {
      idle = true;
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    const t0 = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      if (!idle && !mini) return;
      const t = (now - t0) / 1000;
      px.set(0.5 + Math.sin(t * 0.9) * 0.4);
      py.set(0.5 + Math.cos(t * 1.3) * 0.35);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, [mini, px, py]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center"
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
    >
      <motion.div
        className="relative aspect-[5/7] h-[78cqh] overflow-hidden rounded-[2.4cqh] shadow-[0_50px_100px_-20px_rgba(122,92,255,.5)]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", background: "linear-gradient(160deg,#1c1530,#0b0914)" }}
      >
        <div className="absolute inset-[3%] rounded-[1.6cqh] border border-white/15" />
        <motion.div
          className="absolute inset-0 opacity-70 mix-blend-color-dodge"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #ff5ca8 0%, #ffd23f 7%, #d4ff3a 14%, #33e1ff 21%, #7a5cff 28%, #ff5ca8 35%)",
            backgroundSize: "300% 300%",
            backgroundPosition: foilPos,
          }}
        />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-radial-gradient(circle at 50% 120%, #fff 0 1px, transparent 1px 6px)" }} />
        <div className="absolute inset-x-[8%] top-[6%] flex justify-between font-mono text-[1.8cqh] uppercase tracking-[0.25em] text-white/80">
          <span>E-Motion</span>
          <span>★ 25/25</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(60px)" }}>
          <span className="font-neon text-white drop-shadow-[0_0_20px_rgba(255,92,168,.8)]" style={{ fontSize: "26cqh", lineHeight: 1 }}>
            25
          </span>
        </div>
        <div className="absolute inset-x-[8%] bottom-[7%] text-white" style={{ transform: "translateZ(40px)" }}>
          <div className="font-orbit text-[4.4cqh] leading-none">Legendary Type</div>
          <div className="mt-[1cqh] font-mono text-[1.5cqh] uppercase tracking-[0.25em] text-white/60">Holo foil · first edition</div>
        </div>
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: glare }} />
      </motion.div>
    </div>
  );
}
