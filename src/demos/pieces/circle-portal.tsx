"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { MOCK_PAGES, MockPage } from "../shared/MockPage";

export default function CirclePortal({ mini }: { mini?: boolean }) {
  const [base, setBase] = useState(0);
  const [portal, setPortal] = useState<{ x: number; y: number; id: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const lastClick = useRef(0);

  const open = (x: number, y: number) => {
    if (portal) return;
    setPortal({ x, y, id: Date.now() });
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastClick.current < 5000) return;
      open(20 + Math.random() * 60, 20 + Math.random() * 60);
    }, mini ? 2200 : 3200);
    return () => clearInterval(id);
  });

  return (
    <div
      ref={box}
      className="absolute inset-0 overflow-hidden"
      onClick={(e) => {
        const r = box.current!.getBoundingClientRect();
        lastClick.current = Date.now();
        open(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <MockPage page={MOCK_PAGES[base]} />
      {portal && (
        <motion.div
          key={portal.id}
          className="absolute inset-0"
          initial={{ clipPath: `circle(0% at ${portal.x}% ${portal.y}%)` }}
          animate={{ clipPath: `circle(150% at ${portal.x}% ${portal.y}%)` }}
          transition={{ duration: 1.1, ease: EASE.quart }}
          onAnimationComplete={() => {
            setBase((b) => (b + 1) % MOCK_PAGES.length);
            setPortal(null);
          }}
        >
          <MockPage page={MOCK_PAGES[(base + 1) % MOCK_PAGES.length]} />
        </motion.div>
      )}
    </div>
  );
}
