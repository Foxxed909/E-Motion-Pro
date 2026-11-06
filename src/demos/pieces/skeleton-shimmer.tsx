"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const POSTS = [
  { name: "Mira Kade", handle: "@mira.motion", text: "Shipped a spring-based page transition today. 4kb, zero layout shift, pure joy.", g: "linear-gradient(135deg,#ff9f43,#ff4f2e)" },
  { name: "Atlas Studio", handle: "@atlas", text: "Thirty typefaces, one skeleton. The font engine is the real flex.", g: "linear-gradient(135deg,#33e1ff,#7a5cff)" },
];

function Shimmer({ className }: { className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-white/[.06] ${className}`}>
      <motion.div className="absolute inset-y-0 w-1/2" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)" }} animate={{ x: ["-100%", "250%"] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}

/** Content placeholders that shimmer, then resolve into real cards with a stagger. */
export default function SkeletonShimmer() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLoaded((l) => !l), loaded ? 3200 : 1900);
    return () => clearInterval(id);
  }, [loaded]);
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[2.5cqh] px-[10cqw]">
      {POSTS.map((p, i) => (
        <div key={i} className="relative h-[34cqh] overflow-hidden rounded-[2cqh] bg-[#14141a] p-[3cqh] ring-1 ring-white/5">
          <AnimatePresence mode="wait" initial={false}>
            {!loaded ? (
              <motion.div key="s" className="flex h-full gap-[2.5cqh]" exit={{ opacity: 0, transition: { duration: 0.2 } }}>
                <Shimmer className="h-[8cqh] w-[8cqh] shrink-0 !rounded-full" />
                <div className="flex flex-1 flex-col gap-[1.6cqh] pt-[1cqh]">
                  <Shimmer className="h-[2cqh] w-[35%]" />
                  <Shimmer className="h-[1.6cqh] w-[22%]" />
                  <Shimmer className="mt-[1cqh] h-[1.8cqh] w-[92%]" />
                  <Shimmer className="h-[1.8cqh] w-[70%]" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="c" className="flex h-full gap-[2.5cqh]" initial="h" animate="v" variants={{ v: { transition: { staggerChildren: 0.07, delayChildren: i * 0.12 } } }}>
                <motion.span className="h-[8cqh] w-[8cqh] shrink-0 rounded-full" style={{ background: p.g }} variants={{ h: { scale: 0.6, opacity: 0 }, v: { scale: 1, opacity: 1 } }} />
                <div className="flex flex-1 flex-col pt-[0.6cqh] text-ink">
                  {[
                    <span key="n" className="text-[max(12px,2.6cqh)] font-semibold">{p.name}</span>,
                    <span key="h" className="text-[max(10px,2cqh)] text-mute">{p.handle} · now</span>,
                    <span key="t" className="mt-[1.2cqh] text-[max(11px,2.3cqh)] leading-snug text-ink/85">{p.text}</span>,
                  ].map((el, k) => (
                    <motion.span key={k} className="block" variants={{ h: { y: 12, opacity: 0, filter: "blur(4px)" }, v: { y: 0, opacity: 1, filter: "blur(0px)" } }}>
                      {el}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
