"use client";

import { useInView } from "@/hooks/useInView";
import { PIECES } from "./components";
import type { Demo } from "./registry";

/**
 * Container every piece renders into. It is a CSS size container, so pieces scale
 * with cqw / cqh units. Thumbnails only mount while near the viewport.
 */
export function Stage({ demo, mini = false, className = "", replayKey = 0 }: { demo: Demo; mini?: boolean; className?: string; replayKey?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ margin: "200px" });
  const Piece = PIECES[demo.slug];
  return (
    <div ref={ref} className={`relative overflow-hidden [container-type:size] ${className}`} style={{ background: demo.tone }}>
      {(inView || !mini) && Piece && <Piece key={replayKey} mini={mini} />}
    </div>
  );
}
