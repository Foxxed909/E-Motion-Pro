"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { MOCK_PAGES, MockPage } from "../shared/MockPage";

const SLATS = 6;

/** One face of a slat: the full page, shifted so only this slat's band shows. */
function Band({ page, i, back }: { page: number; i: number; back?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden [backface-visibility:hidden]" style={back ? { transform: "rotateX(180deg)" } : undefined}>
      <div className="absolute inset-x-0" style={{ height: `${SLATS * 100}%`, top: `${-i * 100}%` }}>
        <MockPage page={MOCK_PAGES[page]} />
      </div>
    </div>
  );
}

/** Venetian blinds: the page is cut into slats that flip in a cascade to show the next route on their backs. */
export default function BlindsFlip() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const next = (page + 1) % MOCK_PAGES.length;
  useEffect(() => {
    const id = setInterval(() => setFlipping(true), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden bg-black [perspective:160cqh]" onClick={() => setFlipping(true)}>
      {/* Remounting on `page` snaps every slat back to 0° with the new page on its front. */}
      <div key={page} className="absolute inset-0 flex flex-col">
        {Array.from({ length: SLATS }).map((_, i) => (
          <motion.div
            key={i}
            className="relative flex-1 [transform-style:preserve-3d]"
            initial={false}
            animate={{ rotateX: flipping ? -180 : 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: flipping ? i * 0.07 : 0 }}
            onAnimationComplete={() => {
              if (flipping && i === SLATS - 1) {
                setFlipping(false);
                setPage(next);
              }
            }}
          >
            <Band page={page} i={i} />
            <Band page={next} i={i} back />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
