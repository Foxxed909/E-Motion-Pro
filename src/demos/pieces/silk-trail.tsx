"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

const STRANDS = 9;
const LEN = 70;
type P = { x: number; y: number };

/** Nine strands chase the pointer on springs of different stiffness and weave into a ribbon of silk. */
export default function SilkTrail({ mini }: { mini?: boolean }) {
  const strands = useRef<{ head: P; v: P; pts: P[] }[]>([]);
  const ref = useCanvas(
    ({ w, h }) => {
      strands.current = Array.from({ length: STRANDS }, () => ({ head: { x: w / 2, y: h / 2 }, v: { x: 0, y: 0 }, pts: Array.from({ length: LEN }, () => ({ x: w / 2, y: h / 2 })) }));
    },
    ({ ctx, w, h, t, pointer }) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(8,7,12,0.1)";
      ctx.fillRect(0, 0, w, h);
      // Idle (and thumbnail) path: a slow Lissajous curve, so the piece never sits still.
      const idle = mini || !pointer.active;
      const tx = idle ? w / 2 + Math.sin(t * 0.9) * w * 0.34 : pointer.x;
      const ty = idle ? h / 2 + Math.sin(t * 1.7 + 0.6) * h * 0.3 : pointer.y;
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      strands.current.forEach((s, i) => {
        const k = 0.02 + i * 0.006;
        const damp = 0.86 - i * 0.012;
        // Each strand aims at its own point on a small circle around the target, so they braid instead of stacking.
        const r = Math.min(w, h) * 0.045;
        const ox = Math.cos(t * 1.3 + i * 0.7) * r;
        const oy = Math.sin(t * 1.3 + i * 0.7) * r;
        s.v.x = (s.v.x + (tx + ox - s.head.x) * k) * damp;
        s.v.y = (s.v.y + (ty + oy - s.head.y) * k) * damp;
        s.head.x += s.v.x;
        s.head.y += s.v.y;
        s.pts.unshift({ x: s.head.x, y: s.head.y });
        s.pts.length = LEN;
        const hue = 250 + i * 14 + Math.sin(t * 0.4) * 30;
        for (let j = 1; j < LEN - 1; j++) {
          const a = s.pts[j - 1], b = s.pts[j], c = s.pts[j + 1];
          const f = 1 - j / LEN;
          ctx.strokeStyle = `hsla(${hue + j * 1.2}, 95%, ${50 + f * 16}%, ${f * 0.42})`;
          ctx.lineWidth = Math.max(0.6, f * Math.min(w, h) * 0.011);
          ctx.beginPath();
          ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
          ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
          ctx.stroke();
        }
      });
      ctx.globalCompositeOperation = "source-over";
    },
    [mini],
  );
  return (
    <div className="absolute inset-0">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute bottom-[6cqh] left-[5cqw] font-mono uppercase tracking-[0.3em] text-ink/50" style={{ fontSize: "max(9px,1.2cqw)" }}>
        9 strands · 9 springs
      </div>
    </div>
  );
}
