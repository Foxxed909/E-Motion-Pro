"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";
import { noise3 } from "../shared/noise";

type A = { x: number; y: number; px: number; py: number; life: number; hue: number };

export default function FlowField({ mini }: { mini?: boolean }) {
  const agents = useRef<A[]>([]);
  const ref = useCanvas(
    ({ ctx, w, h }) => {
      ctx.fillStyle = "#07060a";
      ctx.fillRect(0, 0, w, h);
      const n = Math.floor((w * h) / (mini ? 160 : 260));
      agents.current = Array.from({ length: Math.min(n, 2600) }, () => {
        const x = Math.random() * w, y = Math.random() * h;
        return { x, y, px: x, py: y, life: Math.random() * 200, hue: 0 };
      });
    },
    ({ ctx, w, h, t, pointer }) => {
      ctx.fillStyle = "rgba(7,6,10,0.04)";
      ctx.fillRect(0, 0, w, h);
      const sc = 0.0028;
      ctx.lineWidth = 1;
      for (const a of agents.current) {
        let ang = noise3(a.x * sc, a.y * sc, t * 0.08) * Math.PI * 4;
        if (pointer.active) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) ang += (1 - d / 140) * Math.atan2(dy, dx) * 0.9;
        }
        a.px = a.x;
        a.py = a.y;
        a.x += Math.cos(ang) * 1.4;
        a.y += Math.sin(ang) * 1.4;
        a.life -= 1;
        const hue = (ang * 40 + t * 12 + 250) % 360;
        ctx.strokeStyle = `hsla(${hue},90%,${62 + Math.sin(ang) * 10}%,0.55)`;
        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
        if (a.life < 0 || a.x < 0 || a.x > w || a.y < 0 || a.y > h) {
          a.x = a.px = Math.random() * w;
          a.y = a.py = Math.random() * h;
          a.life = 100 + Math.random() * 200;
        }
      }
    },
    [mini],
    1.5,
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
