"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const CARDS = [
  { id: "a", title: "Solar", sub: "Light study", g: "linear-gradient(135deg,#ff9f43,#ff4f2e 55%,#7a1f6a)", font: "orbit" },
  { id: "b", title: "Tidal", sub: "Water forms", g: "linear-gradient(135deg,#33e1ff,#2f5bff 60%,#120d4a)", font: "ribbon" },
  { id: "c", title: "Flora", sub: "Growth system", g: "linear-gradient(135deg,#d4ff3a,#2fbf71 60%,#0c3b2e)", font: "inkwell" },
  { id: "d", title: "Night", sub: "Dark matter", g: "linear-gradient(135deg,#ff5ca8,#7a5cff 55%,#0d0b2a)", font: "neon" },
];

const spring = { type: "spring", stiffness: 260, damping: 30 } as const;

export default function SharedZoom({ mini }: { mini?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    if (!mini) return;
    let i = 0;
    const id = setInterval(() => {
      setOpen((o) => (o ? null : CARDS[i++ % CARDS.length].id));
    }, 1600);
    return () => clearInterval(id);
  }, [mini]);
  const card = CARDS.find((c) => c.id === open);
  return (
    <div className="absolute inset-0 p-[4cqw] text-void">
      <div className="mb-[3cqh] flex justify-between font-mono text-[max(9px,1.2cqw)] uppercase tracking-[0.3em]">
        <span>Collection</span>
        <span>04 items</span>
      </div>
      <div className="grid h-[78%] grid-cols-4 gap-[2cqw]">
        {CARDS.map((c) => (
          <motion.button
            key={c.id}
            layoutId={`card-${c.id}`}
            onClick={() => setOpen(c.id)}
            className="relative overflow-hidden text-left"
            style={{ background: c.g, borderRadius: 18 }}
            transition={spring}
            whileHover={{ y: -6 }}
            data-cursor="open"
          >
            <motion.span layoutId={`title-${c.id}`} className={`font-${c.font} absolute bottom-[6%] left-[8%] text-ink`} style={{ fontSize: "min(4cqw,8cqh)" }} transition={spring}>
              {c.title}
            </motion.span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {card && (
          <motion.div
            layoutId={`card-${card.id}`}
            className="absolute inset-[3cqw] z-10 overflow-hidden"
            style={{ background: card.g, borderRadius: 24 }}
            transition={spring}
            onClick={() => setOpen(null)}
            data-cursor="close"
          >
            <motion.span layoutId={`title-${card.id}`} className={`font-${card.font} absolute left-[6%] top-[10%] text-ink`} style={{ fontSize: "min(13cqw,26cqh)", lineHeight: 1 }} transition={spring}>
              {card.title}
            </motion.span>
            <motion.div
              className="absolute bottom-[8%] left-[6%] right-[6%] flex items-end justify-between text-ink"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
            >
              <p className="max-w-[40ch] text-[max(11px,1.5cqw)] leading-snug opacity-90">
                {card.sub}. A shared element keeps its identity as it travels, so the eye never loses track of what it touched.
              </p>
              <span className="font-mono text-[max(9px,1.1cqw)] uppercase tracking-[0.3em]">Close ✕</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
