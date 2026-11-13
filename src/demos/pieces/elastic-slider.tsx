"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

function Digit({ d }: { d: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span className="absolute left-0 top-0 flex flex-col" animate={{ y: `${-d}em` }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export default function ElasticSlider({ mini }: { mini?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(42);
  const over = useMotionValue(0); // signed overshoot in px
  const scaleX = useTransform(over, (o) => 1 + Math.abs(o) / 600);
  const scaleY = useTransform(over, (o) => 1 - Math.min(0.5, Math.abs(o) / 300));
  const originX = useTransform(over, (o) => (o < 0 ? 1 : 0));
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    const raw = (clientX - r.left) / r.width;
    const v = Math.max(0, Math.min(1, raw));
    setValue(Math.round(v * 100));
    const ov = raw < 0 ? raw * r.width : raw > 1 ? (raw - 1) * r.width : 0;
    over.set(Math.sign(ov) * Math.sqrt(Math.abs(ov)) * 8);
  };

  useEffect(() => {
    if (!mini) return;
    let t = 0;
    const id = setInterval(() => {
      t += 0.06;
      const v = 0.5 + Math.sin(t) * 0.62;
      setValue(Math.round(Math.max(0, Math.min(1, v)) * 100));
      const ov = v < 0 ? v * 300 : v > 1 ? (v - 1) * 300 : 0;
      over.set(Math.sign(ov) * Math.sqrt(Math.abs(ov)) * 8);
    }, 40);
    return () => clearInterval(id);
  }, [mini, over]);

  const digits = String(value).padStart(3, "0").split("").map(Number);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[7cqh] text-ink">
      <div className="flex items-baseline font-bitcrush" style={{ fontSize: "min(14cqw,26cqh)" }}>
        {digits.map((d, i) => (
          <Digit key={i} d={d} />
        ))}
        <span className="ml-2 font-mono text-[0.2em] text-mute">%</span>
      </div>
      <motion.div
        ref={track}
        className="relative h-[3cqw] w-[60cqw] touch-none rounded-full bg-smoke"
        style={{ scaleX, scaleY, originX }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && update(e.clientX)}
        onPointerUp={() => {
          dragging.current = false;
          animate(over, 0, { type: "spring", stiffness: 400, damping: 12 });
        }}
      >
        <div className="absolute inset-y-0 left-0 rounded-full bg-acid" style={{ width: `${value}%` }} />
        <div className="absolute top-1/2 h-[5cqw] w-[5cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-void bg-ink shadow-lg" style={{ left: `${value}%` }} />
      </motion.div>
      <div className="font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-mute">Pull past the ends</div>
    </div>
  );
}
