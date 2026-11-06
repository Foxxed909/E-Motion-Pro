"use client";
import { useEffect } from "react";

/** Ping-pong auto scroll for thumbnails (and idle full views). Stops once the user scrolls. */
export function useAutoScroll(ref: React.RefObject<HTMLElement | null>, active: boolean, speed = 0.12) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    let dir = 1;
    let id = 0;
    let user = false;
    let pos = el.scrollTop;
    const stop = () => (user = true);
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    let last = performance.now();
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const dt = now - last;
      last = now;
      if (user) return;
      const max = el.scrollHeight - el.clientHeight;
      pos += dir * speed * dt * (el.clientHeight / 400);
      if (pos >= max) (pos = max), (dir = -1);
      if (pos <= 0) (pos = 0), (dir = 1);
      el.scrollTop = pos;
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, [ref, active, speed]);
}
