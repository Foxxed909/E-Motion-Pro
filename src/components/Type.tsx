"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FONTS } from "@/lib/fonts";
import { EASE } from "@/lib/motion";

const ALL_SLUGS = FONTS.map((f) => f.slug);

/** Each character independently hops between all the E-Motion Pro typefaces. */
export function FontCycle({
  text,
  className,
  interval = 140,
  chance = 0.18,
  fonts = ALL_SLUGS,
  active = true,
  settle,
}: {
  text: string;
  className?: string;
  interval?: number;
  chance?: number;
  fonts?: string[];
  active?: boolean;
  /** When set, every char settles into this font when inactive. */
  settle?: string;
}) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [map, setMap] = useState<string[]>(() => chars.map(() => settle ?? fonts[0]));
  useEffect(() => {
    setMap(chars.map((_, i) => settle ?? fonts[i % fonts.length]));
  }, [chars, fonts, settle]);
  useEffect(() => {
    if (!active) {
      if (settle) setMap(chars.map(() => settle));
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setMap((m) => m.map((f) => (Math.random() < chance ? fonts[(Math.random() * fonts.length) | 0] : f)));
    }, interval);
    return () => clearInterval(id);
  }, [active, chance, chars, fonts, interval, settle]);
  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} aria-hidden className={`font-${map[i]}`} style={{ whiteSpace: "pre" }}>
          {c}
        </span>
      ))}
    </span>
  );
}

/** Masked line/word reveal when scrolled into view. */
export function Reveal({
  text,
  className,
  delay = 0,
  by = "word",
  stagger = 0.045,
  once = true,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  by?: "word" | "char";
  stagger?: number;
  once?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const words = text.split(" ");
  let idx = 0;
  return (
    <Tag className={className} aria-label={text}>
      <span ref={ref} aria-hidden>
        {words.map((w, wi) => (
          <span key={wi} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            {(by === "char" ? Array.from(w) : [w]).map((part, pi) => {
              const i = idx++;
              return (
                <motion.span
                  key={pi}
                  className="inline-block will-change-transform"
                  initial={{ y: "110%", rotate: 6 }}
                  animate={inView ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 6 }}
                  transition={{ duration: 1.1, ease: EASE.expo, delay: delay + i * stagger }}
                >
                  {part}
                </motion.span>
              );
            })}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </span>
    </Tag>
  );
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Text that decodes from noise. Re-runs whenever `text` changes or `trigger` flips. */
export function Scramble({
  text,
  className,
  speed = 1,
  trigger = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  trigger?: boolean;
}) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    let raf = 0;
    const from = out;
    const len = Math.max(from.length, text.length);
    const queue = Array.from({ length: len }, (_, i) => {
      const start = Math.floor(Math.random() * 18);
      return { from: from[i] ?? "", to: text[i] ?? "", start, end: start + Math.floor(Math.random() * 22) + 6 };
    });
    const tick = () => {
      let done = 0;
      let s = "";
      for (const q of queue) {
        if (frame >= q.end / speed) {
          done++;
          s += q.to;
        } else if (frame >= q.start / speed) {
          s += q.to === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        } else s += q.from;
      }
      setOut(s);
      frame++;
      if (done < queue.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger, speed]);
  return <span className={className}>{out}</span>;
}
