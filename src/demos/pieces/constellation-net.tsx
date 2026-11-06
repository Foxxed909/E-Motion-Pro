"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

type N = { x: number; y: number; vx: number; vy: number; r: number };

export default function ConstellationNet({ mini }: { mini?: boolean }) {
  const nodes = useRef<N[]>([]);
  const ref = useCanvas(
    ({ w, h }) => {
      const n = Math.min(140, Math.floor((w * h) / 7000));
      nodes.current = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
      }));
    },
    ({ ctx, w, h, t, pointer }) => {
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      g.addColorStop(0, "#0d1030");
      g.addColorStop(1, "#03040a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const ns = nodes.current;
      const px = mini ? w / 2 + Math.cos(t * 0.7) * w * 0.3 : pointer.x;
      const py = mini ? h / 2 + Math.sin(t * 1.1) * h * 0.25 : pointer.y;
      const pOn = mini || pointer.active;
      const L = Math.min(w, h) * 0.2;
      for (const n of ns) {
        if (pOn) {
          const dx = px - n.x, dy = py - n.y;
          const d = Math.hypot(dx, dy);
          if (d < L * 1.5 && d > 1) {
            n.vx += (dx / d) * 0.012;
            n.vy += (dy / d) * 0.012;
          }
        }
        n.vx *= 0.995;
        n.vy *= 0.995;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i], b = ns[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) {
            ctx.strokeStyle = `rgba(160,170,255,${(1 - d / L) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (pOn) {
          const a = ns[i];
          const d = Math.hypot(a.x - px, a.y - py);
          if (d < L * 1.4) {
            ctx.strokeStyle = `rgba(212,255,58,${(1 - d / (L * 1.4)) * 0.8})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(px, py);
            ctx.stroke();
          }
        }
      }
      for (const n of ns) {
        const tw = 0.6 + 0.4 * Math.sin(t * 3 + n.x);
        ctx.fillStyle = `rgba(243,239,231,${tw})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (pOn) {
        ctx.fillStyle = "#d4ff3a";
        ctx.shadowColor = "#d4ff3a";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
    [mini],
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
