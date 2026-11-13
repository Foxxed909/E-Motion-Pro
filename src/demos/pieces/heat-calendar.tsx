"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";
import { noise3 } from "../shared/noise";

const WEEKS = 26;
const DAYS = 7;
const RAMP = ["#16161d", "#2b3a12", "#5c7f1a", "#9fc82a", "#d4ff3a"];

/** A contribution-style heatmap whose activity drifts through time like weather. */
export default function HeatCalendar({ mini }: { mini?: boolean }) {
  const label = useRef<HTMLDivElement>(null);
  const ref = useCanvas(
    () => {},
    ({ ctx, w, h, t, pointer }) => {
      ctx.clearRect(0, 0, w, h);
      const pad = w * 0.07;
      const gap = Math.max(2, w * 0.004);
      const s = Math.min((w - pad * 2 - gap * (WEEKS - 1)) / WEEKS, (h * 0.56 - gap * (DAYS - 1)) / DAYS);
      const gw = s * WEEKS + gap * (WEEKS - 1);
      const gh = s * DAYS + gap * (DAYS - 1);
      const x0 = (w - gw) / 2;
      const y0 = (h - gh) / 2 + h * 0.06;
      const px = mini ? x0 + gw * (0.5 + 0.4 * Math.sin(t * 0.7)) : pointer.x;
      const py = mini ? y0 + gh * (0.5 + 0.4 * Math.cos(t * 1.1)) : pointer.y;
      let total = 0;
      let hot: { v: number; i: number; j: number } | null = null;
      for (let i = 0; i < WEEKS; i++) {
        for (let j = 0; j < DAYS; j++) {
          // Weekends are quieter; a slow noise field moves "busy weeks" across the year.
          const weekend = j === 0 || j === 6 ? 0.55 : 1;
          const n = noise3(i * 0.22 - t * 0.35, j * 0.5, t * 0.12);
          const v = Math.max(0, Math.min(1, (n - 0.34) * 2.7)) * weekend;
          const count = Math.round(v * 14);
          total += count;
          const x = x0 + i * (s + gap);
          const y = y0 + j * (s + gap);
          const over = px >= x - gap / 2 && px < x + s + gap / 2 && py >= y - gap / 2 && py < y + s + gap / 2;
          if (over) hot = { v: count, i, j };
          const pulse = over ? 1.28 : 1;
          const d = (s * pulse - s) / 2;
          ctx.fillStyle = RAMP[Math.min(RAMP.length - 1, Math.ceil(v * (RAMP.length - 1)))];
          ctx.beginPath();
          ctx.roundRect(x - d, y - d, s * pulse, s * pulse, s * 0.24);
          ctx.fill();
          if (over) {
            ctx.strokeStyle = "#f3efe7";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
      if (label.current) {
        const h2 = hot as { v: number; i: number; j: number } | null;
        label.current.textContent = h2 ? `${h2.v} events · week ${h2.i + 1}, ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][h2.j]}` : `${total.toLocaleString("en-US")} events in ${WEEKS} weeks`;
      }
    },
    [mini],
  );
  return (
    <div className="absolute inset-0">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-[7cqw] top-[9cqh] flex items-end justify-between">
        <div className="font-monolith text-ink" style={{ fontSize: "min(6cqw,10cqh)", lineHeight: 1 }}>
          ACTIVITY
        </div>
        <div ref={label} className="font-mono uppercase tracking-[0.18em] text-acid" style={{ fontSize: "max(9px,1.3cqw)" }} />
      </div>
      <div className="pointer-events-none absolute bottom-[8cqh] right-[7cqw] flex items-center gap-[0.6cqw] font-mono uppercase tracking-[0.18em] text-mute" style={{ fontSize: "max(8px,1.1cqw)" }}>
        Less
        {RAMP.map((c) => (
          <span key={c} className="inline-block rounded-[0.3cqw]" style={{ background: c, width: "1.6cqw", height: "1.6cqw" }} />
        ))}
        More
      </div>
    </div>
  );
}
