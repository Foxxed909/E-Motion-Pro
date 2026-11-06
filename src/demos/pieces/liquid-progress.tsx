"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const wave = (amp: number) => {
  let d = "M0 50 ";
  for (let x = 0; x <= 400; x += 10) d += `L${x} ${50 + Math.sin((x / 100) * Math.PI * 2) * amp} `;
  return d + "L400 400 L0 400 Z";
};

export default function LiquidProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setP((v) => (v >= 100 ? 0 : Math.min(100, v + Math.random() * 3.5))), 80);
    return () => clearInterval(id);
  }, []);
  const level = 200 - (p / 100) * 210;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4cqh]">
      <div className="relative h-[58cqh] w-[58cqh]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          <defs>
            <clipPath id="vessel">
              <circle cx="100" cy="100" r="88" />
            </clipPath>
            <linearGradient id="liq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#33e1ff" />
              <stop offset="1" stopColor="#7a5cff" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(51,225,255,.25)" strokeWidth="2" />
          <g clipPath="url(#vessel)">
            <rect width="200" height="200" fill="#0b1020" />
            <motion.g animate={{ y: level }} transition={{ type: "spring", stiffness: 40, damping: 12 }}>
              <motion.path d={wave(7)} fill="#7a5cff" opacity={0.5} animate={{ x: [-200, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }} />
              <motion.path d={wave(5)} fill="url(#liq)" animate={{ x: [0, -200] }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} />
            </motion.g>
            {[20, 60, 120, 150].map((x, i) => (
              <motion.circle key={i} cx={x} r={2 + (i % 2)} fill="rgba(255,255,255,.5)" animate={{ cy: [210, level + 60], opacity: [0, 0.8, 0] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }} />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-orbit text-white mix-blend-difference" style={{ fontSize: "12cqh" }}>
          {Math.floor(p)}
          <span className="text-[0.4em]">%</span>
        </div>
      </div>
      <div className="font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-tide/70">{p < 100 ? "hydrating assets" : "complete"}</div>
    </div>
  );
}
