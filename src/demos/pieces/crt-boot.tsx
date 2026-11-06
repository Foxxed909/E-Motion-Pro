"use client";

import { useEffect, useState } from "react";

const SCRIPT = [
  "E-MOTION BIOS v2.6 (c) 2026",
  "CPU: KINETIC-9 @ 120 FPS ........ OK",
  "MEM: 30 TYPEFACES LOADED ......... OK",
  "GPU: SHADERS COMPILED ........... OK",
  "MOUNTING /dev/imagination ....... OK",
  "",
  "> run showcase --mode=flex",
];

export default function CrtBoot() {
  const [n, setN] = useState(0);
  const total = SCRIPT.join("\n").length;
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v > total + 50 ? 0 : v + 1 + ((Math.random() * 2) | 0))), 28);
    return () => clearInterval(id);
  }, [total]);
  const shown = SCRIPT.join("\n").slice(0, n);
  const done = n > total;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020a04] [animation:crtflicker_.15s_infinite]">
      <style>{`@keyframes crtflicker{0%{opacity:.97}50%{opacity:1}100%{opacity:.98}}`}</style>
      <div className="absolute inset-0 p-[5cqw] font-mono text-[max(10px,1.8cqw)] leading-relaxed text-[#5dff8b]" style={{ textShadow: "0 0 6px #2bff6a, 0 0 18px rgba(43,255,106,.4)" }}>
        <pre className="whitespace-pre-wrap">
          {shown}
          <span className="animate-pulse">█</span>
        </pre>
        {done && (
          <div className="mt-[3cqh] font-lumen leading-none" style={{ fontSize: "min(11cqw,18cqh)" }}>
            E-MOTION
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 2px, transparent 2px 4px)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.85) 100%)" }} />
      <div className="pointer-events-none absolute inset-x-0 h-[12%] bg-gradient-to-b from-transparent via-[rgba(93,255,139,.06)] to-transparent [animation:roll_6s_linear_infinite]" />
      <style>{`@keyframes roll{from{top:-12%}to{top:100%}}`}</style>
    </div>
  );
}
