"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.→";
const COLS = 14;
const BOARDS = [
  ["E-MOTION  PRO", "NOW BOARDING", "GATE 30 →"],
  ["DEPARTURE", "KINETIC TYPE", "ON TIME"],
  ["DESTINATION", "PIXEL CITY", "12:45 → 51"],
  ["FLIGHT EMP-51", "SHADERS", "DELAYED 0:00"],
];
const pad = (s: string) => s.padEnd(COLS, " ").slice(0, COLS);

function Flap({ target, delay }: { target: string; delay: number }) {
  const [cur, setCur] = useState(" ");
  const [prev, setPrev] = useState(" ");
  const [tick, setTick] = useState(0);
  const curRef = useRef(" ");
  useEffect(() => {
    let id: number | undefined;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        const c = curRef.current;
        if (c === target) return window.clearInterval(id);
        const next = CHARS[(CHARS.indexOf(c) + 1) % CHARS.length];
        setPrev(c);
        curRef.current = next;
        setCur(next);
        setTick((t) => t + 1);
      }, 45);
    }, delay);
    return () => {
      window.clearTimeout(start);
      if (id) window.clearInterval(id);
    };
  }, [target, delay]);
  const half = "absolute inset-x-0 overflow-hidden bg-[#161616] text-[#f3e9c6]";
  const glyph = "absolute inset-x-0 flex h-[200%] items-center justify-center font-monolith";
  return (
    <div className="relative aspect-[3/4] w-full rounded-[0.5cqw] [perspective:300px]" style={{ fontSize: "min(5.2cqw,9cqh)" }}>
      <div className={`${half} top-0 h-1/2 rounded-t-[0.5cqw]`}><span className={`${glyph} top-0`}>{cur}</span></div>
      <div className={`${half} bottom-0 h-1/2 rounded-b-[0.5cqw]`}><span className={`${glyph} bottom-0`}>{cur}</span></div>
      <motion.div
        key={tick}
        className={`${half} top-0 h-1/2 origin-bottom rounded-t-[0.5cqw]`}
        initial={{ rotateX: 0 }}
        animate={{ rotateX: -90 }}
        transition={{ duration: 0.09, ease: "easeIn" }}
      >
        <span className={`${glyph} top-0`}>{prev}</span>
      </motion.div>
      <div className="absolute inset-x-0 top-1/2 h-px bg-black" />
    </div>
  );
}

export default function SplitFlap() {
  const [b, setB] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setB((v) => (v + 1) % BOARDS.length), 4200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1.2cqh] bg-[#0b0b0b] px-[4cqw]">
      <div className="mb-[2cqh] flex w-full justify-between font-mono text-[max(9px,1.2cqw)] uppercase tracking-[0.3em] text-[#f3e9c6]/50">
        <span>Departures</span>
        <span>Terminal E</span>
      </div>
      {BOARDS[b].map((line, r) => (
        <div key={r} className="grid w-full gap-[0.5cqw]" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {Array.from(pad(line)).map((ch, c) => (
            <Flap key={c} target={ch} delay={c * 40 + r * 120} />
          ))}
        </div>
      ))}
    </div>
  );
}
