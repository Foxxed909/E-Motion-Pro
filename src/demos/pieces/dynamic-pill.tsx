"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Phone } from "../shared/Phone";

type State = "idle" | "call" | "music" | "timer";
const ORDER: State[] = ["idle", "call", "music", "timer"];
const SIZE: Record<State, { w: string; h: string; r: string }> = {
  idle: { w: "34%", h: "4.2cqh", r: "3cqh" },
  call: { w: "86%", h: "6.5cqh", r: "3.25cqh" },
  music: { w: "92%", h: "22cqh", r: "4.6cqh" },
  timer: { w: "60%", h: "5.2cqh", r: "3cqh" },
};
const spring = { type: "spring", stiffness: 400, damping: 32 } as const;

function Bars({ color }: { color: string }) {
  return (
    <div className="flex h-[2.4cqh] items-center gap-[2px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} className="w-[3px] rounded-full" style={{ background: color }} animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }} />
      ))}
    </div>
  );
}

export default function DynamicPill() {
  const [i, setI] = useState(0);
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ORDER.length), 2400);
    const t = setInterval(() => setSec((s) => s + 1), 1000);
    return () => {
      clearInterval(id);
      clearInterval(t);
    };
  }, []);
  const s = ORDER[i];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Phone screen="radial-gradient(120% 80% at 30% 20%, #7a5cff 0%, #ff5ca8 35%, #1a1033 75%)">
        <div className="absolute inset-x-0 top-[1.5cqh] flex justify-center">
          <motion.div
            layout
            className="relative overflow-hidden bg-black text-white"
            animate={{ width: SIZE[s].w, height: SIZE[s].h, borderRadius: SIZE[s].r }}
            transition={spring}
            onClick={() => setI((v) => (v + 1) % ORDER.length)}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={s}
                className="absolute inset-0 flex items-center justify-between px-[1.6cqh]"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
                transition={{ duration: 0.3 }}
              >
                {s === "call" && (
                  <>
                    <div className="flex items-center gap-[1cqh]">
                      <span className="h-[4.2cqh] w-[4.2cqh] rounded-full bg-gradient-to-br from-acid to-tide" />
                      <span className="text-[1.6cqh] font-medium">Mira</span>
                    </div>
                    <div className="flex items-center gap-[1cqh] text-[1.4cqh] text-[#30d158]">
                      0:{String(sec % 60).padStart(2, "0")} <Bars color="#30d158" />
                    </div>
                  </>
                )}
                {s === "music" && (
                  <div className="flex h-full w-full flex-col justify-center gap-[1.4cqh] py-[1.6cqh]">
                    <div className="flex items-center gap-[1.4cqh]">
                      <motion.span className="h-[7cqh] w-[7cqh] rounded-[1.4cqh]" style={{ background: "conic-gradient(from 90deg,#ff4f2e,#ff5ca8,#7a5cff,#33e1ff,#ff4f2e)" }} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                      <div className="flex-1">
                        <div className="text-[1.6cqh] font-semibold">Afterglow</div>
                        <div className="text-[1.3cqh] text-white/50">Midnight Static</div>
                      </div>
                      <Bars color="#ff5ca8" />
                    </div>
                    <div className="h-[0.5cqh] w-full overflow-hidden rounded-full bg-white/20">
                      <motion.div className="h-full bg-white" initial={{ width: "20%" }} animate={{ width: "62%" }} transition={{ duration: 2.2 }} />
                    </div>
                    <div className="flex justify-center gap-[3cqh] text-[2cqh]">⏮ ⏸ ⏭</div>
                  </div>
                )}
                {s === "timer" && (
                  <>
                    <span className="text-[1.6cqh] text-[#ff9f0a]">◷</span>
                    <span className="font-mono text-[1.7cqh] text-[#ff9f0a]">04:{String(59 - (sec % 60)).padStart(2, "0")}</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="absolute inset-x-0 top-[34%] text-center text-white">
          <div className="font-orbit text-[9cqh] leading-none">9:41</div>
          <div className="mt-[1cqh] text-[1.6cqh] text-white/70">Thursday, 5 November</div>
        </div>
      </Phone>
    </div>
  );
}
