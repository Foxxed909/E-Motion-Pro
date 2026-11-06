"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FontCycle } from "../Type";
import { useLenis } from "../SmoothScroll";
import { EASE } from "@/lib/motion";
import { setIntroDone } from "@/lib/intro";

/** Counts to 100 while glyphs cycle through the 25 fonts, then splits open. Runs once per session. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("emp-loaded") === "1";
    } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      setIntroDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.random() * 5 + 1.5);
      setN(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setShow(false);
          setTimeout(setIntroDone, 350);
          document.documentElement.style.overflow = "";
          try {
            sessionStorage.setItem("emp-loaded", "1");
          } catch {}
        }, 450);
      }
    }, 90);
    return () => {
      clearInterval(id);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (show) lenis?.stop();
    else lenis?.start();
  }, [show, lenis]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[95]" exit={{ pointerEvents: "none" }} transition={{ duration: 1.2 }}>
          <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-void" exit={{ y: "-100%" }} transition={{ duration: 1.1, ease: EASE.quart }} />
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-void" exit={{ y: "100%" }} transition={{ duration: 1.1, ease: EASE.quart }} />
          <motion.div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-8" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-mute sm:text-xs">
              <span>E-Motion Pro</span>
              <span>Loading motion</span>
            </div>
            <div className="flex justify-center text-[18vw] leading-none text-ink sm:text-[12vw]">
              <FontCycle text="E—MOTION" interval={70} chance={0.5} />
            </div>
            <div>
              <div className="flex items-end justify-between">
                <span className="font-bitcrush text-[22vw] leading-[0.8] text-acid sm:text-[14vw]">{String(n).padStart(3, "0")}</span>
                <span className="max-w-[18ch] text-right font-mono text-[10px] uppercase tracking-[0.25em] text-mute sm:text-xs">
                  43 pieces · 13 genres · 25 original typefaces
                </span>
              </div>
              <div className="mt-4 h-px w-full bg-line">
                <motion.div className="h-full bg-acid" animate={{ width: `${n}%` }} transition={{ ease: "linear", duration: 0.1 }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
