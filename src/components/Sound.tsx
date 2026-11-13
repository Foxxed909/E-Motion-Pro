"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { sound } from "@/lib/sound";

const useSoundOn = () => useSyncExternalStore(sound.subscribe, () => sound.enabled, () => false);

/** Global listeners: hover ticks, click plucks and a whoosh on every route change. */
export function SoundFX() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    sound.init();
    let lastEl: Element | null = null;
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element)?.closest?.("a,button,[role=button],[data-hover]");
      if (el && el !== lastEl) sound.play("hover");
      lastEl = el;
    };
    const down = (e: PointerEvent) => {
      sound.unlock();
      if ((e.target as Element)?.closest?.("a,button,[role=button]")) sound.play("click");
    };
    const key = () => sound.unlock();
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    sound.play("whoosh");
  }, [path]);
  return null;
}

/** Equaliser-style toggle for the nav. */
export function SoundToggle({ className = "", label = false, dark = false }: { className?: string; label?: boolean; dark?: boolean }) {
  const on = useSoundOn();
  return (
    <button
      onClick={() => sound.toggle()}
      className={`flex min-h-11 min-w-11 items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] ${dark ? "text-void" : "text-ink"} ${className}`}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
    >
      <span className="flex h-3.5 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className={`w-[2px] rounded-full ${dark ? "bg-void" : "bg-ink"}`}
            animate={on ? { height: ["30%", "100%", "50%", "85%", "30%"] } : { height: "20%" }}
            transition={on ? { duration: 0.9 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }}
          />
        ))}
      </span>
      <span className={label ? "inline" : "hidden lg:inline"}>Sound {on ? "on" : "off"}</span>
    </button>
  );
}
