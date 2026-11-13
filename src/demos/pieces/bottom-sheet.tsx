"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Phone } from "../shared/Phone";

const DETENTS = [0.72, 0.42, 0.08]; // fraction of screen height from top

export default function BottomSheet({ mini }: { mini?: boolean }) {
  const screen = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const H = () => screen.current?.clientHeight ?? 600;
  const progress = useTransform(y, (v) => 1 - Math.min(1, Math.max(0, (v / H() - DETENTS[2]) / (DETENTS[0] - DETENTS[2]))));
  const bgScale = useTransform(progress, [0.5, 1], [1, 0.92]);
  const bgRadius = useTransform(progress, [0.5, 1], [0, 28]);
  const dim = useTransform(progress, [0, 1], [0, 0.55]);

  const snap = (i: number) => animate(y, DETENTS[i] * H(), { type: "spring", stiffness: 320, damping: 32 });

  useEffect(() => {
    y.set(DETENTS[0] * H());
    if (!mini) return;
    let k = 0;
    const seq = [1, 2, 1, 0];
    const id = setInterval(() => snap(seq[k++ % seq.length]), 1300);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mini]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Phone screen="#000">
        <div ref={screen} className="absolute inset-0">
          <motion.div className="absolute inset-0 origin-top overflow-hidden" style={{ scale: bgScale, borderRadius: bgRadius, background: "#e8e4da" }}>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 200">
              {Array.from({ length: 14 }).map((_, i) => (
                <path key={i} d={`M ${-10 + i * 9} 0 C ${20 + i * 5} 60, ${i * 7} 120, ${30 + i * 6} 200`} stroke="#cfc9bb" strokeWidth={i % 4 ? 0.5 : 2.5} fill="none" />
              ))}
              <path d="M0 120 C 30 100, 60 140, 100 110" stroke="#7fd3ff" strokeWidth="6" fill="none" opacity=".7" />
            </svg>
            <motion.div className="absolute left-1/2 top-[30%] h-[3cqh] w-[3cqh] -translate-x-1/2 rounded-full border-4 border-white bg-flare shadow-lg" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
          <motion.div
            className="absolute inset-x-0 top-0 h-full touch-none rounded-t-[3cqh] bg-[#141418] text-white shadow-[0_-10px_40px_rgba(0,0,0,.4)]"
            style={{ y }}
            drag="y"
            dragConstraints={{ top: DETENTS[2] * H(), bottom: DETENTS[0] * H() }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const target = y.get() + info.velocity.y * 0.2;
              let best = 0;
              DETENTS.forEach((d, i) => {
                if (Math.abs(d * H() - target) < Math.abs(DETENTS[best] * H() - target)) best = i;
              });
              snap(best);
            }}
          >
            <div className="mx-auto mt-[1.2cqh] h-[0.6cqh] w-[5cqh] rounded-full bg-white/30" />
            <div className="px-[2.4cqh] pt-[2cqh]">
              <div className="font-orbit text-[3.4cqh]">Lighthouse Café</div>
              <div className="mt-[0.6cqh] text-[1.5cqh] text-white/50">Coffee · 4 min walk · Open now</div>
              <div className="mt-[2cqh] grid grid-cols-3 gap-[1cqh]">
                {["Directions", "Call", "Save"].map((b, i) => (
                  <div key={b} className={`rounded-[1.4cqh] py-[1.2cqh] text-center text-[1.4cqh] ${i === 0 ? "bg-acid text-black" : "bg-white/10"}`}>
                    {b}
                  </div>
                ))}
              </div>
              <div className="mt-[2cqh] grid grid-cols-2 gap-[1cqh]">
                {["#ff9f43", "#7a5cff", "#33e1ff", "#ff5ca8"].map((c) => (
                  <div key={c} className="aspect-[4/3] rounded-[1.6cqh]" style={{ background: `linear-gradient(135deg, ${c}, #141418)` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Phone>
    </div>
  );
}
