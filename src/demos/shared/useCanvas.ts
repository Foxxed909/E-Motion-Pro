"use client";
import { useEffect, useRef } from "react";

export type Frame = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
  dt: number;
  dpr: number;
  pointer: { x: number; y: number; active: boolean; down: boolean };
};

/**
 * Canvas 2D loop with DPR scaling, resize handling, off-screen pausing and pointer tracking.
 * `setup` runs on mount and every resize; `frame` runs every animation frame while visible.
 */
export function useCanvas(
  setup: (f: Omit<Frame, "t" | "dt">) => void,
  frame: (f: Frame) => void,
  deps: unknown[] = [],
  maxDpr = 2,
) {
  const ref = useRef<HTMLCanvasElement>(null);
  const setupRef = useRef(setup);
  const frameRef = useRef(frame);
  setupRef.current = setup;
  frameRef.current = frame;
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const pointer = { x: -9999, y: -9999, active: false, down: false };
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setupRef.current({ ctx, w, h, dpr, pointer });
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };
    const down = () => (pointer.down = true);
    const up = () => (pointer.down = false);
    window.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    let id = 0;
    let last = performance.now();
    const t0 = last;
    const loop = (now: number) => {
      id = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || w === 0) return;
      frameRef.current({ ctx, w, h, dpr, pointer, t: (now - t0) / 1000, dt });
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
