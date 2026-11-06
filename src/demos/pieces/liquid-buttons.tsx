"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/Magnetic";
import { EASE } from "@/lib/motion";

function PourButton({ label }: { label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [o, setO] = useState({ x: 50, y: 50, on: false });
  const at = (e: React.PointerEvent, on: boolean) => {
    const r = ref.current!.getBoundingClientRect();
    setO({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on });
  };
  return (
    <button
      ref={ref}
      onPointerEnter={(e) => at(e, true)}
      onPointerLeave={(e) => at(e, false)}
      className="relative overflow-hidden rounded-full border border-ink/30 px-[4cqw] py-[2.2cqw] font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.25em] text-ink"
    >
      <motion.span
        className="absolute aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid"
        style={{ left: `${o.x}%`, top: `${o.y}%` }}
        initial={false}
        animate={{ scale: o.on ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE.expo }}
      />
      <motion.span className="relative" animate={{ color: o.on ? "#060608" : "#f3efe7" }}>
        {label}
      </motion.span>
    </button>
  );
}

function RollButton({ label }: { label: string }) {
  const [h, setH] = useState(false);
  return (
    <button
      onPointerEnter={() => setH(true)}
      onPointerLeave={() => setH(false)}
      className="relative overflow-hidden rounded-full bg-ink px-[4cqw] py-[2.2cqw] font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.25em] text-void"
    >
      <span className="relative flex overflow-hidden">
        {Array.from(label).map((c, i) => (
          <span key={i} className="relative inline-block whitespace-pre">
            <motion.span className="inline-block" animate={{ y: h ? "-110%" : "0%" }} transition={{ duration: 0.5, ease: EASE.expo, delay: i * 0.025 }}>
              {c}
            </motion.span>
            <motion.span className="absolute left-0 top-full inline-block text-flare" animate={{ y: h ? "-100%" : "0%" }} transition={{ duration: 0.5, ease: EASE.expo, delay: i * 0.025 }}>
              {c}
            </motion.span>
          </span>
        ))}
      </span>
    </button>
  );
}

function OrbitButton({ label }: { label: string }) {
  return (
    <button className="group relative rounded-full p-[2px] font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.25em] text-ink">
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span
          className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_2.4s_linear_infinite]"
          style={{ background: "conic-gradient(from 0deg, transparent 0 55%, #7a5cff, #ff5ca8, #d4ff3a, transparent 95%)" }}
        />
      </span>
      <span className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70" style={{ background: "linear-gradient(90deg,#7a5cff,#ff5ca8,#d4ff3a)" }} />
      <span className="relative block rounded-full bg-void px-[4cqw] py-[2.2cqw] transition-colors duration-300 group-active:bg-smoke">{label}</span>
    </button>
  );
}

export default function LiquidButtons() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[5cqh]">
      <Magnetic strength={0.4}>
        <PourButton label="Pour in" />
      </Magnetic>
      <Magnetic strength={0.4}>
        <RollButton label="Roll over" />
      </Magnetic>
      <Magnetic strength={0.4}>
        <OrbitButton label="Orbit glow" />
      </Magnetic>
    </div>
  );
}
