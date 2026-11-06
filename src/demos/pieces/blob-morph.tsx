"use client";

import { useEffect, useRef } from "react";
import { noise3 } from "../shared/noise";

function blobPath(cx: number, cy: number, r: number, t: number, seed: number, n = 9) {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 0.72 + 0.5 * noise3(Math.cos(a) + seed, Math.sin(a) + seed, t);
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
  }
  // closed Catmull-Rom → cubic Bézier
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

const BLOBS = [
  { fill: "url(#bm1)", r: 150, dx: -40, dy: -20, seed: 1, speed: 0.35 },
  { fill: "url(#bm2)", r: 120, dx: 60, dy: 30, seed: 7, speed: 0.45 },
  { fill: "url(#bm3)", r: 80, dx: 10, dy: 60, seed: 13, speed: 0.6 },
];

export default function BlobMorph() {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  useEffect(() => {
    let id = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const t = (now - t0) / 1000;
      BLOBS.forEach((b, i) => paths.current[i]?.setAttribute("d", blobPath(250 + b.dx + Math.sin(t * 0.5 + i) * 20, 250 + b.dy + Math.cos(t * 0.4 + i) * 20, b.r, t * b.speed, b.seed)));
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 500 500" className="h-[90cqh] w-[90cqh]">
        <defs>
          <linearGradient id="bm1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7a5cff" /><stop offset="1" stopColor="#ff5ca8" /></linearGradient>
          <linearGradient id="bm2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9f43" /><stop offset="1" stopColor="#ff4f2e" /></linearGradient>
          <radialGradient id="bm3"><stop offset="0" stopColor="#d4ff3a" /><stop offset="1" stopColor="#33e1ff" /></radialGradient>
        </defs>
        {BLOBS.map((b, i) => (
          <path key={i} ref={(n) => { paths.current[i] = n; }} fill={b.fill} style={{ mixBlendMode: "screen" }} opacity={0.9} />
        ))}
      </svg>
    </div>
  );
}
