"use client";

import { useEffect, useState } from "react";

type G = { r: [number, number]; c: [number, number]; slices: { top: number; h: number; dx: number }[]; skew: number };
const calm: G = { r: [0, 0], c: [0, 0], slices: [], skew: 0 };

export default function RgbGlitch() {
  const [g, setG] = useState<G>(calm);
  useEffect(() => {
    let frames = 0;
    const id = setInterval(() => {
      frames++;
      const burst = frames % 22 < 6 || Math.random() < 0.04;
      if (!burst) return setG(calm);
      const j = () => (Math.random() - 0.5) * 18;
      setG({
        r: [j(), j() * 0.3],
        c: [j(), j() * 0.3],
        skew: (Math.random() - 0.5) * 12,
        slices: Array.from({ length: 3 + ((Math.random() * 4) | 0) }, () => ({ top: Math.random() * 90, h: 2 + Math.random() * 12, dx: (Math.random() - 0.5) * 60 })),
      });
    }, 70);
    return () => clearInterval(id);
  }, []);
  const word = "GLITCH";
  const base = "absolute inset-0 flex items-center justify-center font-monolith";
  const style = { fontSize: "min(20cqw,40cqh)", lineHeight: 1 };
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ transform: `skewX(${g.skew}deg)` }}>
        <div className={base} style={{ ...style, color: "#ff2a4f", mixBlendMode: "screen", transform: `translate(${g.r[0]}px,${g.r[1]}px)` }}>{word}</div>
        <div className={base} style={{ ...style, color: "#00e5ff", mixBlendMode: "screen", transform: `translate(${g.c[0]}px,${g.c[1]}px)` }}>{word}</div>
        <div className={base} style={{ ...style, color: "#f3efe7", mixBlendMode: "screen", opacity: 0.85 }}>{word}</div>
        {g.slices.map((s, i) => (
          <div key={i} className={base} style={{ ...style, color: i % 2 ? "#d4ff3a" : "#f3efe7", clipPath: `inset(${s.top}% 0 ${100 - s.top - s.h}% 0)`, transform: `translateX(${s.dx}px)` }}>
            {word}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 1px, transparent 1px 3px)" }} />
      <div className="absolute bottom-[6cqh] left-[5cqw] font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-ink/50">err_0x{g.slices.length ? "DEAD" : "0000"} · rgb split</div>
    </div>
  );
}
