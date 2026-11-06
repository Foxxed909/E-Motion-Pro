"use client";

import { useRef } from "react";
import { useCanvas } from "../shared/useCanvas";

const WORDS = [
  { text: "EMOTION", font: "EMP Orbit" },
  { text: "PIXELS", font: "EMP Bubblegum" },
  { text: "FLOW", font: "EMP Monolith" },
  { text: "PRO", font: "EMP Velocity" },
];

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; c: string; s: number };

export default function ParticleType({ mini }: { mini?: boolean }) {
  const st = useRef({ ps: [] as P[], word: 0, next: 0, w: 0, h: 0 });

  const sample = async (w: number, h: number, wi: number) => {
    const word = WORDS[wi % WORDS.length];
    try {
      await document.fonts.load(`100px "${word.font}"`);
    } catch {}
    const off = document.createElement("canvas");
    off.width = Math.floor(w);
    off.height = Math.floor(h);
    const c = off.getContext("2d")!;
    let size = h * 0.45;
    c.font = `${size}px "${word.font}"`;
    const tw = c.measureText(word.text).width;
    if (tw > w * 0.86) size *= (w * 0.86) / tw;
    c.font = `${size}px "${word.font}"`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#fff";
    c.fillText(word.text, w / 2, h / 2 + size * 0.05);
    const data = c.getImageData(0, 0, off.width, off.height).data;
    const gap = Math.max(3, Math.round(Math.sqrt((w * h) / (mini ? 1800 : 5200))));
    const pts: [number, number][] = [];
    for (let y = 0; y < off.height; y += gap)
      for (let x = 0; x < off.width; x += gap) if (data[(y * off.width + x) * 4 + 3] > 128) pts.push([x, y]);
    const ps = st.current.ps;
    const pal = ["#d4ff3a", "#f3efe7", "#ff5ca8", "#7a5cff", "#33e1ff"];
    while (ps.length < pts.length)
      ps.push({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, tx: 0, ty: 0, c: pal[ps.length % pal.length], s: 1 + Math.random() * 1.6 });
    ps.length = Math.max(pts.length, 1);
    pts.sort(() => Math.random() - 0.5);
    ps.forEach((p, i) => {
      const t = pts[i % pts.length];
      p.tx = t[0];
      p.ty = t[1];
      // burst on word change
      p.vx += (Math.random() - 0.5) * 14;
      p.vy += (Math.random() - 0.5) * 14;
    });
  };

  const ref = useCanvas(
    ({ w, h }) => {
      st.current.w = w;
      st.current.h = h;
      sample(w, h, st.current.word);
    },
    ({ ctx, w, h, t, pointer }) => {
      const s = st.current;
      if (t > s.next) {
        s.next = t + 4;
        if (t > 1) {
          s.word++;
          sample(w, h, s.word);
        }
      }
      ctx.fillStyle = "rgba(5,5,7,0.35)";
      ctx.fillRect(0, 0, w, h);
      let px = pointer.x, py = pointer.y, on = pointer.active;
      if (mini) {
        px = w / 2 + Math.cos(t * 1.2) * w * 0.35;
        py = h / 2 + Math.sin(t * 2.1) * h * 0.2;
        on = true;
      }
      const R = Math.min(w, h) * 0.16;
      for (const p of s.ps) {
        let ax = (p.tx - p.x) * 0.045;
        let ay = (p.ty - p.y) * 0.045;
        if (on) {
          const dx = p.x - px, dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / R) * 9;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        p.vx = (p.vx + ax) * 0.82;
        p.vy = (p.vy + ay) * 0.82;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
    },
    [mini],
  );
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
