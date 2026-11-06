"use client";

import { useEffect, useId, useRef } from "react";

/** Type melting through an animated SVG turbulence + displacement filter. Hover to stir harder. */
export default function LiquidText({ mini }: { mini?: boolean }) {
  const id = useId().replace(/:/g, "");
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const hot = useRef(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    let level = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const t = (now - t0) / 1000;
      level += ((mini ? 0.5 + 0.5 * Math.sin(t) : hot.current) - level) * 0.05;
      turb.current?.setAttribute("baseFrequency", `${(0.012 + Math.sin(t * 0.4) * 0.004).toFixed(4)} ${(0.03 + Math.cos(t * 0.3) * 0.01).toFixed(4)}`);
      turb.current?.setAttribute("seed", String(Math.floor(t * 2) % 100));
      disp.current?.setAttribute("scale", (10 + level * 26 + Math.sin(t * 2) * 4).toFixed(1));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mini]);
  return (
    <div className="absolute inset-0 flex items-center justify-center" onPointerEnter={() => (hot.current = 1)} onPointerLeave={() => (hot.current = 0)}>
      <svg className="absolute h-0 w-0">
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="2" result="n" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="text-center" style={{ filter: `url(#${id})` }}>
        <div className="font-bubblegum text-iris" style={{ fontSize: "min(17cqw,34cqh)", lineHeight: 0.95 }}>
          MELT
        </div>
        <div className="font-scriptorium text-ink" style={{ fontSize: "min(7cqw,13cqh)", lineHeight: 1 }}>
          into motion
        </div>
      </div>
    </div>
  );
}
