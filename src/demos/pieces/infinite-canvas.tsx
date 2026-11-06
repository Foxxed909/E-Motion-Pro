"use client";

import { useEffect, useRef } from "react";
import { FONTS } from "@/lib/fonts";

const HUES = ["#ff4f2e", "#7a5cff", "#d4ff3a", "#33e1ff", "#ff5ca8", "#ff9f43", "#f3efe7"];
const COLS = 7;
const ROWS = 6;

export default function InfiniteCanvas({ mini }: { mini?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const el = box.current!;
    const st = { x: 0, y: 0, vx: -0.6, vy: -0.35, drag: false, lx: 0, ly: 0, idle: 0 };
    const down = (e: PointerEvent) => {
      st.drag = true;
      st.lx = e.clientX;
      st.ly = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!st.drag) return;
      st.vx = e.clientX - st.lx;
      st.vy = e.clientY - st.ly;
      st.x += st.vx;
      st.y += st.vy;
      st.lx = e.clientX;
      st.ly = e.clientY;
      st.idle = performance.now();
    };
    const up = () => (st.drag = false);
    if (!mini) {
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
    }
    let id = 0;
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const W = el.clientWidth / 4.2;
      const H = W * 1.25;
      const gap = W * 0.08;
      if (!st.drag) {
        if (now - st.idle > 2000) {
          st.vx += (-0.6 - st.vx) * 0.02;
          st.vy += (-0.35 - st.vy) * 0.02;
        } else {
          st.vx *= 0.95;
          st.vy *= 0.95;
        }
        st.x += st.vx;
        st.y += st.vy;
      }
      const tw = COLS * (W + gap), th = ROWS * (H + gap);
      for (let i = 0; i < COLS * ROWS; i++) {
        const c = i % COLS, r = Math.floor(i / COLS);
        let x = c * (W + gap) + st.x;
        let y = r * (H + gap) + st.y;
        const wx = Math.floor((x + W) / tw), wy = Math.floor((y + H) / th);
        x -= wx * tw;
        y -= wy * th;
        const t = tiles.current[i];
        if (!t) continue;
        const cx = (x + W / 2) / el.clientWidth - 0.5, cy = (y + H / 2) / el.clientHeight - 0.5;
        const k = 1 - Math.min(0.25, Math.hypot(cx, cy) * 0.35);
        t.style.width = `${W}px`;
        t.style.height = `${H}px`;
        t.style.transform = `translate3d(${x}px,${y}px,0) scale(${k})`;
        const idx = Math.abs((c - wx * COLS) * 31 + (r - wy * ROWS) * 17) % FONTS.length;
        const lab = labels.current[i];
        if (lab && lab.dataset.idx !== String(idx)) {
          lab.dataset.idx = String(idx);
          lab.className = `font-${FONTS[idx].slug} text-[5cqw] leading-none`;
          t.style.background = `linear-gradient(160deg, ${HUES[idx % HUES.length]}, #0a0a0a 80%)`;
          (t.lastChild as HTMLElement).textContent = FONTS[idx].name;
        }
      }
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
  }, [mini]);
  return (
    <div ref={box} className="absolute inset-0 touch-none overflow-hidden select-none" data-cursor={mini ? undefined : "drag"}>
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <div key={i} ref={(n) => { tiles.current[i] = n; }} className="absolute left-0 top-0 flex flex-col justify-between rounded-[1.2cqw] p-[1.4cqw] text-white will-change-transform">
          <span ref={(n) => { labels.current[i] = n; }}>Aa</span>
          <span className="font-mono text-[max(8px,1cqw)] uppercase tracking-[0.2em] opacity-80" />
        </div>
      ))}
    </div>
  );
}
