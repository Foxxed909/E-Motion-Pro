"use client";

import { useEffect, useRef } from "react";

const BADGE = "E-MOTION PRO ✦ MOTION LIBRARY ✦ THIRTY TYPEFACES ✦ ";
const WAVE = "TYPE THAT RIDES THE WAVE — TYPE THAT RIDES THE WAVE — TYPE THAT RIDES THE WAVE — ";

export default function TextPath() {
  const wave = useRef<SVGPathElement>(null);
  const wave2 = useRef<SVGPathElement>(null);
  const off = useRef<SVGTextPathElement>(null);
  const off2 = useRef<SVGTextPathElement>(null);
  const badge = useRef<SVGGElement>(null);
  useEffect(() => {
    let id = 0;
    const t0 = performance.now();
    const build = (t: number, amp: number, y: number, ph: number) => {
      let d = `M -200 ${y}`;
      for (let x = -200; x <= 1200; x += 20) d += ` L ${x} ${(y + Math.sin(x / 130 + t * 1.6 + ph) * amp * Math.sin(t * 0.5 + ph)).toFixed(1)}`;
      return d;
    };
    const tick = (now: number) => {
      id = requestAnimationFrame(tick);
      const t = (now - t0) / 1000;
      wave.current?.setAttribute("d", build(t, 60, 330, 0));
      wave2.current?.setAttribute("d", build(t, 40, 460, 2));
      off.current?.setAttribute("startOffset", `${-((t * 60) % 1100)}`);
      off2.current?.setAttribute("startOffset", `${-1100 + ((t * 45) % 1100)}`);
      badge.current?.setAttribute("transform", `rotate(${(t * 25) % 360} 800 150)`);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 1000 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="tp-circle" d="M 800 150 m -95 0 a 95 95 0 1 1 190 0 a 95 95 0 1 1 -190 0" />
        </defs>
        <path ref={wave} id="tp-wave" fill="none" stroke="rgba(212,255,58,.15)" />
        <path ref={wave2} id="tp-wave2" fill="none" stroke="rgba(255,92,168,.15)" />
        <text className="font-velocity" fontSize="62" fill="#d4ff3a">
          <textPath ref={off} href="#tp-wave">{WAVE + WAVE}</textPath>
        </text>
        <text className="font-autobahn" fontSize="44" fill="#ff5ca8">
          <textPath ref={off2} href="#tp-wave2">{WAVE + WAVE}</textPath>
        </text>
        <g ref={badge}>
          <text className="font-orbit" fontSize="21" fill="#f3efe7" letterSpacing="3">
            <textPath href="#tp-circle">{BADGE}</textPath>
          </text>
        </g>
        <text x="800" y="166" textAnchor="middle" className="font-neon" fontSize="56" fill="#f3efe7">E</text>
      </svg>
    </div>
  );
}
