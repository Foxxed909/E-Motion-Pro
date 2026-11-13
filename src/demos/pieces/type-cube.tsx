"use client";

import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

const FACES = [
  { c: "E", font: "orbit", bg: "#d4ff3a", fg: "#09090c", t: "translateZ(var(--h))" },
  { c: "M", font: "monolith", bg: "#f3efe7", fg: "#09090c", t: "rotateY(90deg) translateZ(var(--h))" },
  { c: "O", font: "neon", bg: "#7a5cff", fg: "#f3efe7", t: "rotateY(180deg) translateZ(var(--h))" },
  { c: "T", font: "opera", bg: "#ff4f2e", fg: "#09090c", t: "rotateY(-90deg) translateZ(var(--h))" },
  { c: "I", font: "bitcrush", bg: "#33e1ff", fg: "#09090c", t: "rotateX(90deg) translateZ(var(--h))" },
  { c: "N", font: "inkwell", bg: "#ff5ca8", fg: "#09090c", t: "rotateX(-90deg) translateZ(var(--h))" },
];

/** A solid CSS cube with a different typeface on every face. It idles on its own and follows the pointer. */
export default function TypeCube({ mini }: { mini?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const spin = useMotionValue(0);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 70, damping: 14 });
  const sy = useSpring(ty, { stiffness: 70, damping: 14 });
  useAnimationFrame((_, dt) => spin.set(spin.get() + dt * 0.028));
  const rotateY = useTransform([spin, sx], ([a, b]) => (a as number) + (b as number) * 140);
  const rotateX = useTransform([spin, sy], ([a, b]) => -26 + Math.sin(((a as number) * Math.PI) / 180) * 14 - (b as number) * 90);
  return (
    <div
      ref={box}
      className="absolute inset-0 flex items-center justify-center overflow-hidden [perspective:120cqh]"
      style={{ background: "radial-gradient(circle at 50% 40%, #1a1830, #07070b 70%)" }}
      onPointerMove={(e) => {
        if (mini) return;
        const r = box.current!.getBoundingClientRect();
        tx.set((e.clientX - r.left) / r.width - 0.5);
        ty.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        tx.set(0);
        ty.set(0);
      }}
    >
      <motion.div className="relative [transform-style:preserve-3d]" style={{ width: "min(38cqw,46cqh)", height: "min(38cqw,46cqh)", rotateX, rotateY, ["--h" as string]: "calc(min(38cqw,46cqh) / 2)" }}>
        {FACES.map((f) => (
          <div key={f.c} className={`font-${f.font} absolute inset-0 flex items-center justify-center [backface-visibility:hidden]`} style={{ background: f.bg, color: f.fg, transform: f.t, fontSize: "min(26cqw,32cqh)", lineHeight: 1 }}>
            {f.c}
            <span className="absolute bottom-[6%] left-[7%] font-mono uppercase tracking-[0.2em] opacity-60" style={{ fontSize: "max(8px, min(1.3cqw,1.8cqh))" }}>
              {f.font}
            </span>
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute bottom-[10cqh] h-[3cqh] w-[34cqw] rounded-[100%] bg-black/60 blur-xl" />
    </div>
  );
}
