"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const R = "#e63b2e", B = "#1d4ed8", Y = "#f6c20f", K = "#111", C = "#f3efe7";

const TILES: { id: number; span?: string; el: React.ReactNode; bg: string }[] = [
  { id: 0, bg: R, span: "col-span-2", el: <span className="font-monolith text-[9cqh] leading-none text-[#f3efe7]">FORM</span> },
  { id: 1, bg: K, el: <span className="h-[70%] w-[70%] rounded-full bg-[#f6c20f]" /> },
  { id: 2, bg: Y, el: <span className="h-[70%] w-[35%] rounded-l-full bg-[#111] self-center" /> },
  { id: 3, bg: B, el: <span className="h-0 w-0 border-x-[5cqh] border-b-[9cqh] border-x-transparent border-b-[#f3efe7]" /> },
  { id: 4, bg: C, span: "row-span-2", el: <span className="font-opera text-[14cqh] leading-none text-[#111] [writing-mode:vertical-rl]">BAU</span> },
  { id: 5, bg: K, el: <span className="h-full w-full" style={{ backgroundImage: "repeating-linear-gradient(90deg,#f3efe7 0 4px,transparent 4px 12px)" }} /> },
  { id: 6, bg: R, el: <span className="h-[70%] w-[70%] rotate-45 bg-[#111]" /> },
  { id: 7, bg: Y, span: "col-span-2", el: <span className="font-mono text-[2cqh] uppercase tracking-[0.4em] text-[#111]">Function → Motion</span> },
  { id: 8, bg: B, el: <span className="h-[70%] w-[70%] rounded-full border-[1.5cqh] border-[#f6c20f]" /> },
  { id: 9, bg: C, el: <span className="font-orbit text-[10cqh] leading-none text-[#e63b2e]">30</span> },
];

const shuffle = <T,>(a: T[]) => {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export default function SwissShuffle() {
  const [order, setOrder] = useState(TILES);
  useEffect(() => {
    const id = setInterval(() => setOrder((o) => shuffle(o)), 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 p-[3cqh]">
      <div className="grid h-full grid-flow-dense grid-cols-4 grid-rows-3 gap-[1.2cqh]">
        {order.map((t) => (
          <motion.div layout key={t.id} className={`flex items-center justify-center overflow-hidden ${t.span ?? ""}`} style={{ background: t.bg }} transition={{ type: "spring", stiffness: 200, damping: 24 }}>
            <motion.div layout="position" className="flex h-full w-full items-center justify-center">
              {t.el}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
