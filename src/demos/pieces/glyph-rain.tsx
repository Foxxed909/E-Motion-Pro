"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

const GLYPHS = "EMOTION0123456789<>/=+*#";
type Col = { y: number; v: number; g: number[] };

/** Falling columns of glyphs set in the site's own pixel face. The pointer parts the rain. */
export default function GlyphRain({ mini }: { mini?: boolean }) {
  const cols = useRef<Col[]>([]);
  const cell = useRef(18);
  const ref = useCanvas(
    ({ w, h }) => {
      cell.current = Math.max(12, Math.round(Math.min(w, h) / (mini ? 16 : 26)));
      const rows = Math.ceil(h / cell.current) + 2;
      cols.current = Array.from({ length: Math.ceil(w / cell.current) }, () => ({
        y: Math.random() * rows * 2 - rows,
        v: 5 + Math.random() * 12,
        g: Array.from({ length: rows }, () => (Math.random() * GLYPHS.length) | 0),
      }));
    },
    ({ ctx, w, h, t, dt, pointer }) => {
      const c = cell.current;
      ctx.fillStyle = "#020a04";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${c}px "EMP Bitcrush", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const rows = Math.ceil(h / c) + 1;
      const px = mini ? w / 2 + Math.sin(t * 0.8) * w * 0.3 : pointer.x;
      const part = mini || pointer.active;
      cols.current.forEach((col, i) => {
        const x = i * c + c / 2;
        // Columns near the pointer slow down and dim, opening a gap in the rain.
        const near = part ? Math.max(0, 1 - Math.abs(x - px) / (c * 5)) : 0;
        col.y += col.v * dt * (1 - near * 0.85);
        if (col.y - 22 > rows) {
          col.y = -Math.random() * 8;
          col.v = 5 + Math.random() * 12;
        }
        if (Math.random() < 0.06) col.g[(Math.random() * col.g.length) | 0] = (Math.random() * GLYPHS.length) | 0;
        const head = Math.floor(col.y);
        for (let k = 0; k < 22; k++) {
          const r = head - k;
          if (r < 0 || r > rows) continue;
          const a = (1 - k / 22) * (1 - near * 0.8);
          ctx.fillStyle = k === 0 ? `rgba(240,255,200,${a})` : `rgba(212,255,58,${a * 0.85})`;
          ctx.fillText(GLYPHS[col.g[r % col.g.length]], x, r * c);
        }
      });
      // Scanlines.
      ctx.fillStyle = "rgba(0,0,0,.22)";
      for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
    },
    [mini],
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
