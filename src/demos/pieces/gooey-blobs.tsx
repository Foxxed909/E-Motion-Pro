"use client";

import { useId, useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

/** Metaballs via an SVG goo filter applied to canvas-drawn circles. */
export default function GooeyBlobs({ mini }: { mini?: boolean }) {
  const id = useId().replace(/:/g, "");
  const trail = useRef(Array.from({ length: 9 }, () => ({ x: 0, y: 0 })));
  const ref = useCanvas(
    ({ w, h }) => trail.current.forEach((p) => ((p.x = w / 2), (p.y = h / 2))),
    ({ ctx, w, h, t, pointer }) => {
      ctx.clearRect(0, 0, w, h);
      const tx = !mini && pointer.active ? pointer.x : w / 2 + Math.cos(t * 0.9) * w * 0.28;
      const ty = !mini && pointer.active ? pointer.y : h / 2 + Math.sin(t * 1.7) * h * 0.22;
      const tr = trail.current;
      tr.forEach((p, i) => {
        const lead = i === 0 ? { x: tx, y: ty } : tr[i - 1];
        const k = i === 0 ? 0.18 : 0.32;
        p.x += (lead.x - p.x) * k;
        p.y += (lead.y - p.y) * k;
      });
      const base = Math.min(w, h);
      ctx.fillStyle = "#060608";
      tr.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, base * (0.11 - i * 0.008), 0, Math.PI * 2);
        ctx.fill();
      });
      for (let i = 0; i < 5; i++) {
        const a = t * (0.4 + i * 0.13) + i * 1.3;
        const r = base * (0.22 + 0.06 * Math.sin(t + i));
        ctx.beginPath();
        ctx.arc(w / 2 + Math.cos(a) * r * 1.4, h / 2 + Math.sin(a * 1.2) * r, base * (0.06 + 0.02 * Math.sin(t * 2 + i)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, base * (0.14 + 0.015 * Math.sin(t * 1.5)), 0, Math.PI * 2);
      ctx.fill();
    },
    [mini],
  );
  return (
    <div className="absolute inset-0">
      <svg className="absolute h-0 w-0">
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 36 -16" />
        </filter>
      </svg>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ filter: `url(#${id})` }} />
      <div className="pointer-events-none absolute bottom-[6cqh] left-[5cqw] font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.3em] text-void/70">blur 14 · alpha ×36 −16</div>
    </div>
  );
}
