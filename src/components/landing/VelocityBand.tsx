"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useRef } from "react";
import { GENRES } from "@/demos/registry";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** Infinite band whose speed and skew follow page-scroll velocity. */
function Row({ dir, children, base = 3 }: { dir: 1 | -1; children: React.ReactNode; base?: number }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const skew = useTransform(vel, [-3000, 3000], [12, -12]);
  const tx = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);
  const sign = useRef(dir);
  useAnimationFrame((_, delta) => {
    let move = sign.current * base * (delta / 1000);
    const f = factor.get();
    if (f < 0) sign.current = (-dir as 1 | -1);
    else if (f > 0) sign.current = dir;
    move += sign.current * move * Math.abs(f);
    x.set(x.get() + move * -1);
  });
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex will-change-transform" style={{ x: tx, skewX: skew }}>
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export function VelocityBand() {
  const items = GENRES.map((g) => (
    <span key={g.id} className="flex items-center">
      <span className={`font-${g.font} px-[0.35em]`}>{g.name}</span>
      <span className="text-acid">✦</span>
    </span>
  ));
  return (
    <section className="relative -rotate-2 border-y border-line bg-void py-6 text-[9vw] leading-none text-ink sm:text-[6vw]" aria-label="Genres">
      <Row dir={1}>{items}</Row>
      <div className="h-3" />
      <Row dir={-1} base={2}>
        <span className="flex text-mute">{items.slice().reverse()}</span>
      </Row>
    </section>
  );
}
