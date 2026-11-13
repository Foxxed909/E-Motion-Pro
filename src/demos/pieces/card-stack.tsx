"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const PEOPLE = [
  { name: "Nova", age: 27, g: "linear-gradient(160deg,#ff9f43,#ff4f2e 50%,#5c1240)", font: "orbit" },
  { name: "Atlas", age: 31, g: "linear-gradient(160deg,#33e1ff,#2f5bff 55%,#11113a)", font: "monolith" },
  { name: "Juno", age: 24, g: "linear-gradient(160deg,#d4ff3a,#21b573 55%,#0b2d2a)", font: "bubblegum" },
  { name: "Echo", age: 29, g: "linear-gradient(160deg,#ff5ca8,#7a5cff 55%,#140c33)", font: "scriptorium" },
];

function Card({ p, depth, onGone, auto }: { p: (typeof PEOPLE)[number]; depth: number; onGone: () => void; auto: boolean }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-24, 24]);
  const like = useTransform(x, [20, 120], [0, 1]);
  const nope = useTransform(x, [-120, -20], [1, 0]);
  const top = depth === 0;
  const fling = (dir: number) =>
    animate(x, dir * 700, { duration: 0.45, ease: [0.4, 0, 1, 1] }).then(() => {
      x.set(0);
      onGone();
    });
  useEffect(() => {
    if (!auto || !top) return;
    const t = setTimeout(() => fling(Math.random() > 0.5 ? 1 : -1), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, top]);
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[3cqh] shadow-2xl"
      style={{ x, rotate, background: p.g, zIndex: 10 - depth }}
      animate={{ scale: 1 - depth * 0.05, y: depth * -22 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      drag={top ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 600) fling(Math.sign(info.offset.x || info.velocity.x));
      }}
    >
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-[3cqh] text-white">
        <div className={`font-${p.font} text-[6cqh] leading-none`}>{p.name}</div>
        <div className="mt-1 font-mono text-[1.6cqh] uppercase tracking-[0.25em] opacity-80">{p.age} · 2 km away</div>
      </div>
      <motion.span style={{ opacity: like }} className="absolute left-[8%] top-[8%] -rotate-12 rounded-lg border-4 border-acid px-3 py-1 font-monolith text-[4cqh] text-acid">LIKE</motion.span>
      <motion.span style={{ opacity: nope }} className="absolute right-[8%] top-[8%] rotate-12 rounded-lg border-4 border-flare px-3 py-1 font-monolith text-[4cqh] text-flare">NOPE</motion.span>
    </motion.div>
  );
}

export default function CardStack({ mini }: { mini?: boolean }) {
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [touched, setTouched] = useState(false);
  return (
    <div className="absolute inset-0 flex items-center justify-center" onPointerDown={() => setTouched(true)}>
      <div className="relative aspect-[3/4] h-[72cqh]">
        {order
          .slice()
          .reverse()
          .map((idx) => (
            <Card key={idx} p={PEOPLE[idx]} depth={order.indexOf(idx)} auto={!!mini || !touched} onGone={() => setOrder((o) => [...o.slice(1), o[0]])} />
          ))}
      </div>
    </div>
  );
}
