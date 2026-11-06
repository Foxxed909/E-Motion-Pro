"use client";

import { useEffect, useState } from "react";
import { Scramble } from "@/components/Type";

const PHRASES = ["SIGNAL FOUND", "MOTION IS DATA", "DECRYPT BEAUTY", "HELLO, HUMAN"];

export default function Decoder() {
  const [i, setI] = useState(0);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % PHRASES.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    setPct(0);
    const id = setInterval(() => setPct((p) => Math.min(100, p + 7 + Math.random() * 9)), 70);
    return () => clearInterval(id);
  }, [i]);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4cqh] text-acid">
      <div className="font-lumen text-center" style={{ fontSize: "min(10cqw, 22cqh)", lineHeight: 1 }}>
        <Scramble text={PHRASES[i]} speed={0.9} />
      </div>
      <div className="w-[60cqw] font-mono text-[max(10px,1.3cqw)] uppercase tracking-[0.2em] text-acid/70">
        <div className="flex justify-between">
          <span>decrypting / key {(i * 7919 + 4099).toString(16)}</span>
          <span>{Math.floor(pct)}%</span>
        </div>
        <div className="mt-2 h-px w-full bg-acid/20">
          <div className="h-full bg-acid transition-[width] duration-100" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
