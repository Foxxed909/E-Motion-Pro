"use client";

import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";

const APPS = [
  { c: "E", font: "orbit", bg: "#d4ff3a", fg: "#09090c", name: "Orbit" },
  { c: "M", font: "monolith", bg: "#ff4f2e", fg: "#09090c", name: "Monolith" },
  { c: "O", font: "neon", bg: "#17132b", fg: "#33e1ff", name: "Neon" },
  { c: "T", font: "opera", bg: "#f3efe7", fg: "#09090c", name: "Opera" },
  { c: "I", font: "bitcrush", bg: "#7a5cff", fg: "#f3efe7", name: "Bitcrush" },
  { c: "O", font: "inkwell", bg: "#ff5ca8", fg: "#09090c", name: "Inkwell" },
  { c: "N", font: "velocity", bg: "#33e1ff", fg: "#09090c", name: "Velocity" },
];

function Icon({ app, mx, unit, onPick, picked }: { app: (typeof APPS)[number]; mx: MotionValue<number>; unit: number; onPick: () => void; picked: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  // Distance from the pointer to this icon's centre drives its size.
  const dist = useTransform(mx, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : 9999;
  });
  const size = useSpring(useTransform(dist, [-unit * 3.2, 0, unit * 3.2], [unit, unit * 1.9, unit], { clamp: true }), { stiffness: 320, damping: 22, mass: 0.5 });
  const fontSize = useTransform(size, (s) => s * 0.62);
  return (
    <motion.button
      ref={ref}
      onClick={onPick}
      aria-label={app.name}
      className={`font-${app.font} relative flex shrink-0 items-center justify-center rounded-[22%] leading-none shadow-[0_10px_30px_-10px_rgba(0,0,0,.7)]`}
      style={{ width: size, height: size, fontSize, background: app.bg, color: app.fg }}
      animate={picked ? { y: [0, -unit * 0.55, 0, -unit * 0.22, 0] } : { y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {app.c}
      {picked && <span className="absolute -bottom-[18%] h-[7%] w-[7%] rounded-full bg-ink" />}
    </motion.button>
  );
}

/** A dock whose icons swell under the pointer, each on its own spring. */
export default function MagnifyDock({ mini }: { mini?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-9999);
  const [unit, setUnit] = useState(44);
  const [picked, setPicked] = useState<number | null>(2);
  useAnimationFrame((t) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    const u = Math.max(24, Math.min(r.width * 0.075, r.height * 0.16));
    if (Math.abs(u - unit) > 0.5) setUnit(u);
    // Thumbnails have no pointer: sweep a phantom one back and forth.
    if (mini) mx.set(r.left + r.width * (0.5 + 0.34 * Math.sin(t / 900)));
  });
  return (
    <div
      ref={box}
      className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden pb-[9cqh]"
      style={{ background: "linear-gradient(160deg,#1c1a3a 0%,#0c0b16 55%,#201024 100%)" }}
      onPointerMove={(e) => !mini && mx.set(e.clientX)}
      onPointerLeave={() => !mini && mx.set(-9999)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-[16cqh] text-center">
        <div className="font-orbit text-ink" style={{ fontSize: "min(7cqw,12cqh)", lineHeight: 1 }}>
          {picked === null ? "DOCK" : APPS[picked].name.toUpperCase()}
        </div>
        <div className="mt-[2cqh] font-mono uppercase tracking-[0.3em] text-mute" style={{ fontSize: "max(9px,1.2cqw)" }}>
          distance → size, on a spring
        </div>
      </div>
      <div className="flex items-end rounded-[1.6em] border border-white/10 bg-white/10 backdrop-blur-xl" style={{ gap: unit * 0.22, padding: unit * 0.22, height: unit * 1.44, fontSize: unit * 0.5 }}>
        {APPS.map((a, i) => (
          <Icon key={a.name} app={a} mx={mx} unit={unit} picked={picked === i} onPick={() => setPicked(i)} />
        ))}
      </div>
    </div>
  );
}
