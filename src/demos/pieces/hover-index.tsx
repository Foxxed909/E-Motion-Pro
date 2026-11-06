"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

const ROWS = [
  { name: "Halcyon", kind: "Brand film", year: "2026", g: "linear-gradient(135deg,#ff9f43,#ff4f2e)", font: "opera" },
  { name: "Polaris", kind: "Product launch", year: "2026", g: "linear-gradient(135deg,#33e1ff,#7a5cff)", font: "orbit" },
  { name: "Undertow", kind: "Music video", year: "2025", g: "linear-gradient(135deg,#0e3b6e,#33e1ff)", font: "ribbon" },
  { name: "Kinetika", kind: "Type system", year: "2025", g: "linear-gradient(135deg,#d4ff3a,#2fbf71)", font: "velocity" },
  { name: "Afterhours", kind: "Installation", year: "2024", g: "linear-gradient(135deg,#ff5ca8,#3b0b4f)", font: "neon" },
];

export default function HoverIndex({ mini }: { mini?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });
  const rot = useSpring(0, { stiffness: 120, damping: 10 });
  const lastX = useRef(0);

  useEffect(() => {
    if (!mini) return;
    let i = 0;
    const id = setInterval(() => {
      const b = box.current!.getBoundingClientRect();
      const k = i++ % ROWS.length;
      setActive(k);
      x.set(b.width * (0.55 + 0.15 * Math.sin(i)));
      y.set((b.height / ROWS.length) * (k + 0.5));
    }, 900);
    return () => clearInterval(id);
  }, [mini, x, y]);

  return (
    <div
      ref={box}
      className="absolute inset-0 flex flex-col justify-center px-[5cqw]"
      onPointerMove={(e) => {
        if (mini) return;
        const b = box.current!.getBoundingClientRect();
        x.set(e.clientX - b.left);
        y.set(e.clientY - b.top);
        rot.set(Math.max(-15, Math.min(15, (e.clientX - lastX.current) * 0.8)));
        lastX.current = e.clientX;
      }}
      onPointerLeave={() => !mini && setActive(null)}
    >
      {ROWS.map((r, i) => (
        <div
          key={r.name}
          onPointerEnter={() => !mini && setActive(i)}
          className="group relative flex items-baseline justify-between border-b border-line py-[2cqh]"
        >
          <motion.span className={`font-${r.font} text-ink`} style={{ fontSize: "min(6.5cqw,9cqh)", lineHeight: 1 }} animate={{ x: active === i ? 24 : 0, opacity: active === null || active === i ? 1 : 0.25 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}>
            {r.name}
          </motion.span>
          <span className="font-mono text-[max(9px,1.1cqw)] uppercase tracking-[0.25em] text-mute">
            {r.kind} · {r.year}
          </span>
        </div>
      ))}
      <motion.div className="pointer-events-none absolute left-0 top-0 z-10 h-[34cqh] w-[26cqh] -translate-x-1/2 -translate-y-1/2" style={{ x: sx, y: sy, rotate: rot }}>
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="absolute inset-0 flex items-end overflow-hidden rounded-[1.4cqh] p-[2cqh] shadow-2xl"
              style={{ background: ROWS[active].g }}
              initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.1 }}
              animate={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.3 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={`font-${ROWS[active].font} text-[6cqh] leading-none text-white`}>{ROWS[active].name.slice(0, 2)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
