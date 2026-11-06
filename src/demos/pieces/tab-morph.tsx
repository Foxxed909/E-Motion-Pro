"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const TABS = [
  { id: "home", label: "Home", d: "M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" },
  { id: "search", label: "Search", d: "M11 4a7 7 0 100 14 7 7 0 000-14zm9 16l-4.2-4.2" },
  { id: "heart", label: "Saved", d: "M12 20s-7-4.3-9-8.6C1.7 8.3 3.6 5 7 5c2 0 3.4 1.1 5 2.8C13.6 6.1 15 5 17 5c3.4 0 5.3 3.3 4 6.4-2 4.3-9 8.6-9 8.6z" },
  { id: "user", label: "Profile", d: "M12 12a4 4 0 100-8 4 4 0 000 8zm-8 9a8 8 0 0116 0" },
];

export default function TabMorph({ mini }: { mini?: boolean }) {
  const [active, setActive] = useState("home");
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setActive((a) => TABS[(TABS.findIndex((t) => t.id === a) + 1) % TABS.length].id), mini ? 1100 : 1700);
    return () => clearInterval(id);
  }, [auto, mini]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6cqh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="font-bubblegum text-void"
          style={{ fontSize: "min(14cqw,26cqh)", lineHeight: 1 }}
          initial={{ y: 40, opacity: 0, rotate: -6 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -40, opacity: 0, rotate: 6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {TABS.find((t) => t.id === active)!.label}
        </motion.div>
      </AnimatePresence>
      <nav className="flex gap-[1cqw] rounded-full bg-void p-[1cqw] shadow-[0_20px_50px_-10px_rgba(0,0,0,.5)]">
        {TABS.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => {
                setAuto(false);
                setActive(t.id);
              }}
              className="relative flex items-center gap-[1cqw] rounded-full px-[2.4cqw] py-[1.8cqw] text-ink"
            >
              {on && <motion.span layoutId="tab-blob" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 28 }} />}
              <motion.svg viewBox="0 0 24 24" className="relative h-[max(16px,3cqw)] w-[max(16px,3cqw)]" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" animate={{ stroke: on ? "#060608" : "#f3efe7", scale: on ? [1, 1.3, 1] : 1, rotate: on ? [0, -12, 0] : 0 }} transition={{ duration: 0.4 }}>
                <path d={t.d} />
              </motion.svg>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.span className="relative overflow-hidden whitespace-nowrap font-mono text-[max(10px,1.4cqw)] uppercase tracking-[0.15em] text-void" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}>
                    {t.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
