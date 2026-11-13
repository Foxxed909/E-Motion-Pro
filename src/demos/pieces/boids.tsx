"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

type Boid = { x: number; y: number; vx: number; vy: number };

/** Classic flocking: separation, alignment and cohesion, plus a predator at the pointer. */
export default function Boids({ mini }: { mini?: boolean }) {
  const flock = useRef<Boid[]>([]);
  const ref = useCanvas(
    ({ w, h }) => {
      const n = Math.min(mini ? 90 : 220, Math.floor((w * h) / 3200));
      flock.current = Array.from({ length: n }, () => {
        const a = Math.random() * Math.PI * 2;
        return { x: Math.random() * w, y: Math.random() * h, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2 };
      });
    },
    ({ ctx, w, h, t, pointer }) => {
      ctx.fillStyle = "rgba(5,6,12,0.28)";
      ctx.fillRect(0, 0, w, h);
      const bs = flock.current;
      const R = Math.min(w, h) * 0.11;
      const px = mini ? w / 2 + Math.cos(t * 0.6) * w * 0.32 : pointer.x;
      const py = mini ? h / 2 + Math.sin(t * 0.9) * h * 0.3 : pointer.y;
      const hunted = mini || pointer.active;
      for (const b of bs) {
        let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0;
        for (const o of bs) {
          if (o === b) continue;
          const dx = o.x - b.x, dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > R * R) continue;
          n++;
          cx += o.x;
          cy += o.y;
          ax += o.vx;
          ay += o.vy;
          if (d2 < (R * 0.35) ** 2 && d2 > 0.01) {
            sx -= dx / d2;
            sy -= dy / d2;
          }
        }
        if (n) {
          b.vx += (cx / n - b.x) * 0.0009 + (ax / n - b.vx) * 0.045 + sx * 1.4;
          b.vy += (cy / n - b.y) * 0.0009 + (ay / n - b.vy) * 0.045 + sy * 1.4;
        }
        if (hunted) {
          const dx = b.x - px, dy = b.y - py;
          const d = Math.hypot(dx, dy);
          if (d < R * 1.6 && d > 1) {
            const f = (1 - d / (R * 1.6)) * 0.9;
            b.vx += (dx / d) * f;
            b.vy += (dy / d) * f;
          }
        }
        // Steer back from the edges instead of wrapping, so the flock stays in frame.
        const m = 40;
        if (b.x < m) b.vx += 0.12;
        if (b.x > w - m) b.vx -= 0.12;
        if (b.y < m) b.vy += 0.12;
        if (b.y > h - m) b.vy -= 0.12;
        const sp = Math.hypot(b.vx, b.vy) || 1;
        const lim = Math.min(3.4, Math.max(1.6, sp));
        b.vx = (b.vx / sp) * lim;
        b.vy = (b.vy / sp) * lim;
        b.x += b.vx;
        b.y += b.vy;
      }
      for (const b of bs) {
        const a = Math.atan2(b.vy, b.vx);
        const sp = Math.hypot(b.vx, b.vy);
        const s = mini ? 4.5 : 6;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(a);
        ctx.fillStyle = sp > 2.9 ? "#d4ff3a" : `hsl(${205 + sp * 22} 90% 72%)`;
        ctx.beginPath();
        ctx.moveTo(s, 0);
        ctx.lineTo(-s * 0.7, s * 0.45);
        ctx.lineTo(-s * 0.35, 0);
        ctx.lineTo(-s * 0.7, -s * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      if (hunted) {
        ctx.strokeStyle = "rgba(255,79,46,.8)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 9 + Math.sin(t * 6) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    [mini],
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
