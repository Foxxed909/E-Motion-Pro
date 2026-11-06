"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

type Pt = { x: number; y: number; px: number; py: number };
type Rope = { pts: Pt[]; seg: number; hue: string };

const COLORS = ["#d4ff3a", "#ff5ca8", "#7a5cff", "#33e1ff", "#ff9f43", "#f3efe7"];

export default function VerletRope({ mini }: { mini?: boolean }) {
  const ropes = useRef<Rope[]>([]);
  const ref = useCanvas(
    ({ w, h }) => {
      const n = Math.max(5, Math.floor(w / 70));
      ropes.current = Array.from({ length: n }, (_, i) => {
        const x = ((i + 0.5) / n) * w;
        const len = h * (0.35 + 0.4 * Math.abs(Math.sin(i * 1.7)));
        const count = 18;
        const seg = len / count;
        return { seg, hue: COLORS[i % COLORS.length], pts: Array.from({ length: count + 1 }, (_, k) => ({ x, y: k * seg, px: x, py: k * seg })) };
      });
    },
    ({ ctx, w, h, t, pointer }) => {
      ctx.clearRect(0, 0, w, h);
      const px = mini || !pointer.active ? w / 2 + Math.sin(t * 0.9) * w * 0.42 : pointer.x;
      const py = mini || !pointer.active ? h * (0.55 + Math.sin(t * 1.7) * 0.25) : pointer.y;
      const R = Math.min(w, h) * 0.09;
      for (const r of ropes.current) {
        r.pts.forEach((p, i) => {
          if (i === 0) return;
          const vx = (p.x - p.px) * 0.985, vy = (p.y - p.py) * 0.985;
          p.px = p.x;
          p.py = p.y;
          p.x += vx;
          p.y += vy + 0.35;
          const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
          if (d < R && d > 0.01) {
            p.x = px + (dx / d) * R;
            p.y = py + (dy / d) * R;
          }
        });
        for (let it = 0; it < 12; it++)
          for (let i = 0; i < r.pts.length - 1; i++) {
            const a = r.pts[i], b = r.pts[i + 1];
            const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
            const diff = (d - r.seg) / d;
            if (i === 0) {
              b.x -= dx * diff;
              b.y -= dy * diff;
            } else {
              a.x += dx * diff * 0.5;
              a.y += dy * diff * 0.5;
              b.x -= dx * diff * 0.5;
              b.y -= dy * diff * 0.5;
            }
          }
        ctx.strokeStyle = r.hue;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(r.pts[0].x, r.pts[0].y);
        for (let i = 1; i < r.pts.length - 1; i++) {
          const mx = (r.pts[i].x + r.pts[i + 1].x) / 2, my = (r.pts[i].y + r.pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(r.pts[i].x, r.pts[i].y, mx, my);
        }
        ctx.stroke();
        const end = r.pts[r.pts.length - 1];
        ctx.fillStyle = r.hue;
        ctx.shadowColor = r.hue;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(end.x, end.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.strokeStyle = "rgba(243,239,231,.25)";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(px, py, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    [mini],
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" data-cursor-hide />;
}
