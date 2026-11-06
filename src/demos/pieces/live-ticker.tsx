"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const W = 600, H = 220, N = 60;

/** A streaming price chart: the line scrolls, the price rolls digit by digit, colour follows the trend. */
export default function LiveTicker() {
  const [pts, setPts] = useState<number[]>(() => {
    let v = 120;
    return Array.from({ length: N }, () => (v += (Math.random() - 0.48) * 4));
  });
  const prev = useRef(pts[pts.length - 1]);
  useEffect(() => {
    const id = setInterval(() => {
      setPts((p) => {
        prev.current = p[p.length - 1];
        const next = p[p.length - 1] + (Math.random() - 0.47) * 5;
        return [...p.slice(1), next];
      });
    }, 600);
    return () => clearInterval(id);
  }, []);
  const min = Math.min(...pts) - 2, max = Math.max(...pts) + 2;
  const y = (v: number) => H - ((v - min) / (max - min)) * H;
  const line = pts.map((v, i) => `${(i / (N - 1)) * W},${y(v).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const up = last >= prev.current;
  const color = up ? "#2fe08a" : "#ff4f6e";
  const change = ((last - pts[0]) / pts[0]) * 100;
  const price = last.toFixed(2).split("");
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-[6cqw]">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-mute">EMP / USD · live</div>
          <div className="flex font-orbit text-ink" style={{ fontSize: "min(7cqw,13cqh)", lineHeight: 1 }}>
            <span>$</span>
            {price.map((c, i) => (
              <span key={i} className="relative inline-block overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={c + i} className="inline-block" initial={{ y: up ? "100%" : "-100%" }} animate={{ y: "0%" }} exit={{ y: up ? "-100%" : "100%" }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
                    {c}
                  </motion.span>
                </AnimatePresence>
              </span>
            ))}
          </div>
        </div>
        <motion.div className="rounded-full px-3 py-1 font-mono text-[max(10px,1.3cqw)]" animate={{ backgroundColor: change >= 0 ? "rgba(47,224,138,.15)" : "rgba(255,79,110,.15)", color: change >= 0 ? "#2fe08a" : "#ff4f6e" }}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </motion.div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-[4cqh] max-h-[55cqh] w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lt-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".35" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${H} ${line} ${W},${H}`} fill="url(#lt-fill)" style={{ transition: "fill .4s" }} />
        <polyline points={line} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" style={{ transition: "stroke .4s" }} />
        <circle cx={W} cy={y(last)} r={5} fill={color} />
        <circle cx={W} cy={y(last)} r={5} fill="none" stroke={color}>
          <animate attributeName="r" from="5" to="18" dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
