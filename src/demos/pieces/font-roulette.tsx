"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FONTS } from "@/lib/fonts";
import type { DemoProps } from "../types";

const WORD = "MOTION";
const rand = () => (Math.random() * FONTS.length) | 0;

export default function FontRoulette({ mini }: DemoProps) {
  const [fonts, setFonts] = useState<number[]>(() => Array.from(WORD, (_, i) => i * 3));
  const [settled, setSettled] = useState<boolean[]>(() => Array.from(WORD, () => true));
  const [target, setTarget] = useState(0);
  const timers = useRef<number[]>([]);
  const settledRef = useRef(settled);
  settledRef.current = settled;

  const roll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    const next = rand();
    setTarget(next);
    setSettled(Array.from(WORD, () => false));
    Array.from(WORD).forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setSettled((s) => s.map((v, j) => (j === i ? true : v)));
          setFonts((f) => f.map((v, j) => (j === i ? next : v)));
        }, 700 + i * 160),
      );
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const s = settledRef.current;
      if (s.every(Boolean)) return;
      setFonts((f) => f.map((v, i) => (s[i] ? v : rand())));
    }, 55);
    roll();
    const loop = setInterval(roll, 3200);
    return () => {
      clearInterval(id);
      clearInterval(loop);
      timers.current.forEach(clearTimeout);
    };
  }, [roll]);

  const f = FONTS[target];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" onPointerEnter={mini ? undefined : roll}>
      <div className="flex items-baseline text-ink" style={{ fontSize: "min(19cqw, 40cqh)", lineHeight: 1 }}>
        {Array.from(WORD).map((c, i) => (
          <motion.span
            key={i}
            className={`font-${FONTS[fonts[i]].slug} inline-block`}
            animate={settled[i] ? { y: 0, scale: 1, color: "#f3efe7" } : { y: [0, -6, 4, 0], scale: 0.96, color: "#d4ff3a" }}
            transition={settled[i] ? { type: "spring", stiffness: 500, damping: 14 } : { duration: 0.2, repeat: Infinity }}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <div className="mt-[4cqh] flex items-center gap-3 font-mono text-[max(10px,1.6cqw)] uppercase tracking-[0.25em] text-mute">
        <span className="text-acid">{String(f.index).padStart(2, "0")}</span>
        <span className="text-ink">{f.name}</span>
        <span>/ {f.genre}</span>
      </div>
      <div className="mt-[3cqh] flex gap-1">
        {FONTS.map((x, i) => (
          <motion.span key={x.slug} className="h-1 w-1 rounded-full bg-ink/20" animate={{ backgroundColor: i === target ? "#d4ff3a" : "rgba(243,239,231,0.2)", scale: i === target ? 1.8 : 1 }} />
        ))}
      </div>
    </div>
  );
}
