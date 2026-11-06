"use client";

import { animate, motion } from "motion/react";
import { useEffect, useState } from "react";

const RINGS = [
  { label: "Move", color: ["#ff2a6d", "#ff9f43"], unit: "kcal", max: 600 },
  { label: "Flow", color: ["#a6ff3a", "#d4ff3a"], unit: "min", max: 60 },
  { label: "Focus", color: ["#33e1ff", "#7a5cff"], unit: "hr", max: 12 },
];

function Count({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(v, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(x) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return <>{Math.round(v)}</>;
}

export default function ActivityRings() {
  const [vals, setVals] = useState([0.82, 0.64, 0.45]);
  useEffect(() => {
    const id = setInterval(() => setVals(RINGS.map(() => 0.25 + Math.random() * 0.9)), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[6cqw]">
      <svg viewBox="0 0 200 200" className="h-[70cqh] w-[70cqh] -rotate-90">
        <defs>
          {RINGS.map((r, i) => (
            <linearGradient key={i} id={`rg${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={r.color[0]} />
              <stop offset="1" stopColor={r.color[1]} />
            </linearGradient>
          ))}
          <filter id="ringglow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {RINGS.map((r, i) => {
          const R = 84 - i * 24;
          return (
            <g key={i}>
              <circle cx="100" cy="100" r={R} fill="none" stroke={r.color[0]} strokeOpacity={0.15} strokeWidth="18" />
              <motion.circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={`url(#rg${i})`}
                strokeWidth="18"
                strokeLinecap="round"
                filter="url(#ringglow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(vals[i], 0.999) }}
                transition={{ type: "spring", stiffness: 40, damping: 12, delay: i * 0.12 }}
              />
            </g>
          );
        })}
      </svg>
      <div className="hidden flex-col gap-[3cqh] @[480px]:flex">
        {RINGS.map((r, i) => (
          <div key={r.label}>
            <div className="font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em]" style={{ color: r.color[0] }}>
              {r.label}
            </div>
            <div className="font-orbit text-ink" style={{ fontSize: "min(4.5cqw,8cqh)", lineHeight: 1.1 }}>
              <Count to={vals[i] * r.max} />
              <span className="ml-1 text-[0.4em] text-mute">/{r.max} {r.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
