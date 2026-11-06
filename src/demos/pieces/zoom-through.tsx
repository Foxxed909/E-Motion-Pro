"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useAutoScroll } from "../shared/useAutoScroll";

export default function ZoomThrough({ mini }: { mini?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ container: ref });
  useAutoScroll(ref, true, mini ? 0.2 : 0.09);
  const scale = useTransform(p, [0, 0.75], [1, 70], { clamp: true });
  const transform = useTransform(scale, (s) => `translate(50 28) scale(${s}) translate(-50 -28)`);
  const inner = useTransform(p, [0.4, 0.9], [0.7, 1]);
  const innerO = useTransform(p, [0.45, 0.8], [0, 1]);
  const hint = useTransform(p, [0, 0.1], [1, 0]);
  return (
    <div ref={ref} className="no-scrollbar absolute inset-0 overflow-y-auto" data-lenis-prevent>
      <div className="h-[400%]">
        <div className="sticky top-0 h-[25%] overflow-hidden">
          <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 30% 20%, #ff5ca8, #7a5cff 45%, #120d33 80%)" }}>
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center text-ink" style={{ scale: inner, opacity: innerO }}>
              <div className="font-mono text-[max(10px,1.3cqw)] uppercase tracking-[0.4em]">you are now inside</div>
              <div className="font-scriptorium" style={{ fontSize: "min(12cqw,22cqh)", lineHeight: 1 }}>the letter</div>
            </motion.div>
          </div>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 56" preserveAspectRatio="xMidYMid slice">
            <defs>
              <mask id="zt-mask">
                <rect width="100" height="56" fill="white" />
                <motion.g style={{ transform }} className="font-monolith" fontSize="24" textAnchor="middle" fill="black">
                  <text x="39.5" y="36.5">D</text>
                  <text x="50" y="36.5">I</text>
                  <text x="60.5" y="36.5">V</text>
                  <text x="74" y="36.5">E</text>
                </motion.g>
              </mask>
            </defs>
            <rect width="100" height="56" fill="#0b0b0b" mask="url(#zt-mask)" />
          </svg>
          <motion.div className="absolute inset-x-0 bottom-[6cqh] text-center font-mono text-[max(10px,1.2cqw)] uppercase tracking-[0.35em] text-mute" style={{ opacity: hint }}>
            scroll to dive ↓
          </motion.div>
        </div>
      </div>
    </div>
  );
}
