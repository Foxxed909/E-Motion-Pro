"use client";

import { useCanvas } from "../shared/useCanvas";

export default function DotLens({ mini }: { mini?: boolean }) {
  const ref = useCanvas(
    () => {},
    ({ ctx, w, h, t, pointer }) => {
      ctx.fillStyle = "#08070c";
      ctx.fillRect(0, 0, w, h);
      const gap = Math.max(14, Math.min(w, h) / 34);
      const px = mini || !pointer.active ? w / 2 + Math.cos(t * 0.7) * w * 0.3 : pointer.x;
      const py = mini || !pointer.active ? h / 2 + Math.sin(t * 1.1) * h * 0.28 : pointer.y;
      const R = Math.min(w, h) * 0.28;
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - px, dy = y - py;
          const d = Math.hypot(dx, dy);
          const f = Math.max(0, 1 - d / R);
          const lens = f * f * (3 - 2 * f);
          const wave = Math.sin(d / 18 - t * 4) * 0.5 + 0.5;
          const ox = x + (dx / (d || 1)) * lens * gap * 1.4;
          const oy = y + (dy / (d || 1)) * lens * gap * 1.4;
          const r = 1 + lens * gap * 0.38 + wave * 0.6 * (1 - lens);
          const hue = 260 + lens * 120 + Math.sin(x * 0.01 + t) * 20;
          ctx.fillStyle = lens > 0.02 ? `hsl(${hue % 360},95%,${55 + lens * 20}%)` : `rgba(243,239,231,${0.15 + wave * 0.2})`;
          ctx.beginPath();
          ctx.arc(ox, oy, r, 0, Math.PI * 2);
          ctx.fill();
        }
    },
    [mini],
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
