"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const PANELS = [
  { t: "Solstice", k: "Light", g: "linear-gradient(160deg,#ffd23f,#ff4f2e 55%,#3b0b2f)", f: "orbit" },
  { t: "Tidepool", k: "Water", g: "linear-gradient(160deg,#33e1ff,#2f5bff 60%,#0b1033)", f: "ribbon" },
  { t: "Canopy", k: "Forest", g: "linear-gradient(160deg,#d4ff3a,#21b573 55%,#08281f)", f: "inkwell" },
  { t: "Nebula", k: "Space", g: "linear-gradient(160deg,#ff5ca8,#7a5cff 55%,#0d0b2a)", f: "neon" },
  { t: "Ember", k: "Fire", g: "linear-gradient(160deg,#ff9f43,#b3261e 60%,#1a0705)", f: "monolith" },
];

/** Horizontal accordion: the active panel expands with a spring, the others compress into spines. */
export default function AccordionGallery({ mini }: { mini?: boolean }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (touched && !mini) return;
    const id = setInterval(() => setActive((a) => (a + 1) % PANELS.length), 1800);
    return () => clearInterval(id);
  }, [touched, mini]);
  return (
    <div className="absolute inset-0 flex gap-[1cqw] p-[3cqw]">
      {PANELS.map((p, i) => {
        const on = i === active;
        return (
          <motion.div
            key={p.t}
            className="relative overflow-hidden rounded-[2cqh]"
            style={{ background: p.g }}
            animate={{ flexGrow: on ? 6 : 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 22 }}
            onPointerEnter={() => {
              setTouched(true);
              setActive(i);
            }}
          >
            <motion.span className={`font-${p.f} absolute bottom-[4cqh] left-1/2 origin-left whitespace-nowrap text-white`} style={{ fontSize: "min(5cqw,9cqh)" }} animate={{ rotate: on ? 0 : -90, x: on ? "-18cqw" : "-0.4em", opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 22 }}>
              {p.t}
            </motion.span>
            <motion.div className="absolute left-[3cqh] top-[3cqh] font-mono text-[max(9px,1.2cqw)] uppercase tracking-[0.3em] text-white/80" animate={{ opacity: on ? 1 : 0 }}>
              0{i + 1} — {p.k}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
