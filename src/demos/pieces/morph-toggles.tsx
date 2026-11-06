"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const spring = { type: "spring", stiffness: 500, damping: 30 } as const;

function DayNight({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative h-[9cqw] w-[18cqw] overflow-hidden rounded-full"
      animate={{ backgroundColor: on ? "#1b1640" : "#7fd3ff" }}
      transition={{ duration: 0.5 }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute h-[0.5cqw] w-[0.5cqw] rounded-full bg-white"
          style={{ left: `${15 + i * 9}%`, top: `${25 + ((i * 37) % 50)}%` }}
          animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0 }}
          transition={{ delay: on ? 0.1 + i * 0.05 : 0 }}
        />
      ))}
      <motion.span
        className="absolute top-[10%] h-[80%] w-auto aspect-square overflow-hidden rounded-full"
        animate={{ left: on ? "calc(90% - 7.2cqw)" : "10%", backgroundColor: on ? "#f3efe7" : "#ffd23f", rotate: on ? 0 : -90 }}
        transition={spring}
      >
        <motion.span className="absolute h-full w-full rounded-full" animate={{ x: on ? "35%" : "120%", y: on ? "-15%" : "-60%", backgroundColor: "#1b1640" }} transition={spring} />
      </motion.span>
    </motion.button>
  );
}

function Heart({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} aria-label="Like" className="relative flex h-[9cqw] w-[9cqw] items-center justify-center">
      <AnimatePresence>
        {on &&
          Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute h-[1cqw] w-[1cqw] rounded-full"
                style={{ background: i % 2 ? "#ff5ca8" : "#d4ff3a" }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: Math.cos(a) * 60, y: Math.sin(a) * 60, scale: 0, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            );
          })}
      </AnimatePresence>
      <motion.span className="absolute h-full w-full rounded-full border-2 border-glow" initial={false} animate={on ? { scale: [0.2, 1.3], opacity: [1, 0] } : { opacity: 0 }} transition={{ duration: 0.5 }} />
      <motion.svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" animate={{ scale: on ? [1, 0.6, 1.25, 1] : 1 }} transition={{ duration: 0.5 }}>
        <motion.path
          d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.8 4.5c2.2 0 3.6 1.2 5.2 3 1.6-1.8 3-3 5.2-3 3.8 0 5.9 4 4.4 7.3C19.5 16.4 12 21 12 21z"
          strokeWidth={1.6}
          animate={{ fill: on ? "#ff5ca8" : "rgba(0,0,0,0)", stroke: on ? "#ff5ca8" : "#f3efe7" }}
        />
      </motion.svg>
    </button>
  );
}

function Check({ on, toggle }: { on: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle} aria-label="Check" className="flex items-center gap-[1.5cqw] text-ink">
      <motion.span className="relative flex h-[7cqw] w-[7cqw] items-center justify-center rounded-[1.6cqw] border-2" animate={{ backgroundColor: on ? "#d4ff3a" : "rgba(0,0,0,0)", borderColor: on ? "#d4ff3a" : "rgba(243,239,231,.4)", scale: on ? [1, 0.85, 1] : 1 }}>
        <svg viewBox="0 0 24 24" className="h-[70%] w-[70%]">
          <motion.path d="M4 12.5l5 5L20 6.5" fill="none" stroke="#060608" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.35, delay: on ? 0.1 : 0 }} />
        </svg>
      </motion.span>
      <span className="relative font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.2em]">
        Ship it
        <motion.span className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-acid" animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.35, delay: on ? 0.25 : 0 }} />
      </span>
    </button>
  );
}

export default function MorphToggles({ mini }: { mini?: boolean }) {
  const [s, setS] = useState([false, false, false]);
  const flip = (i: number) => setS((v) => v.map((x, j) => (j === i ? !x : x)));
  useEffect(() => {
    if (!mini) return;
    let i = 0;
    const id = setInterval(() => flip(i++ % 3), 900);
    return () => clearInterval(id);
  }, [mini]);
  return (
    <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-[8cqw]">
      <DayNight on={s[0]} toggle={() => flip(0)} />
      <Heart on={s[1]} toggle={() => flip(1)} />
      <Check on={s[2]} toggle={() => flip(2)} />
    </div>
  );
}
