"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GLSL_NOISE, ShaderCanvas } from "../ShaderCanvas";
import { FontCycle } from "../Type";
import { Magnetic } from "../Magnetic";
import { EASE } from "@/lib/motion";
import { useIntroDone } from "@/lib/intro";
import Link from "next/link";

const SILK = GLSL_NOISE + `
uniform float u_scroll;
void main(){
  vec2 p = (gl_FragCoord.xy - .5*u_res)/u_res.y;
  vec2 m = (u_mouse - .5)*vec2(u_res.x/u_res.y, 1.);
  float t = u_time*.16;
  vec2 d = p - m;
  p += d * .22 * exp(-dot(d,d)*7.) * u_hover;
  p.y += u_scroll*.35;
  vec2 q = p*1.15;
  for(int i=0;i<6;i++){
    float fi = float(i);
    q += vec2(sin(q.y*1.6 + t*1.3 + fi*1.1), cos(q.x*1.4 - t + fi*.7))*.3;
  }
  float band = sin(q.x*2.1 + q.y*1.3 + t*2.)*.5 + .5;
  float fine = sin((q.x + q.y)*8. + t*3.)*.5 + .5;
  vec3 col = palette(band*.55 + length(q)*.06 + t*.08, vec3(.55,.45,.55), vec3(.45,.4,.45), vec3(1.,1.,1.), vec3(.75,.5,.25));
  col *= pow(band, 3.2)*1.5 + .03;
  col += vec3(1.,.95,.9)*pow(fine*band, 22.)*.35;
  col *= smoothstep(1.55, .05, length(p*vec2(.62, 1.)));
  col *= 1. - u_scroll*.7;
  col += (hash(gl_FragCoord.xy + fract(u_time)) - .5)*.035;
  gl_FragColor = vec4(max(col, 0.), 1.);
}`;

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t}</span>;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const uniforms = useRef<{ u_scroll: number }>({ u_scroll: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(12px)"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [hot, setHot] = useState(false);
  const ready = useIntroDone();
  const D = -1.1; // delays below were authored relative to a 1.1s offset

  useEffect(() => scrollYProgress.on("change", (v) => (uniforms.current.u_scroll = v)), [scrollYProgress]);

  const word = "E—MOTION";
  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden">
      <ShaderCanvas frag={SILK} uniforms={uniforms as React.RefObject<Record<string, number>>} dpr={1.25} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060608_100%)]" />

      <motion.div className="relative z-10 flex h-full flex-col justify-end px-4 pb-6 sm:px-8 sm:pb-8" style={{ y, scale, filter: blur, opacity: fade }}>
        <motion.div
          className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/70 sm:text-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 1.6 + D, duration: 1, ease: EASE.expo }}
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid" /> Motion library — Vol. 01
          </span>
          <span className="hidden sm:inline">Apps · Websites · Motion graphics</span>
        </motion.div>

        <h1
          className="-ml-[0.04em] select-none text-[17.5vw] leading-[0.82] tracking-[-0.01em] text-ink"
          onPointerEnter={() => setHot(true)}
          onPointerLeave={() => setHot(false)}
          aria-label="E-Motion"
          data-cursor="shuffle"
        >
          <span className="flex overflow-hidden pb-[0.06em]">
            {Array.from(word).map((c, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "110%", rotate: 8 }}
                animate={ready ? { y: "0%", rotate: 0 } : undefined}
                transition={{ delay: 1.15 + D + i * 0.06, duration: 1.4, ease: EASE.expo }}
              >
                <FontCycle text={c} active={hot} settle="orbit" interval={80 + i * 7} chance={0.5} />
              </motion.span>
            ))}
          </span>
        </h1>

        <div className="mt-6 grid items-end gap-6 sm:mt-8 md:grid-cols-[1fr_auto_auto]">
          <motion.p
            className="max-w-[46ch] text-balance text-base leading-snug text-ink/80 sm:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.7 + D, duration: 1.2, ease: EASE.expo }}
          >
            A cinematic library of animations, transitions and motion graphics for apps and websites. Every piece runs live, and
            every letter on this site is set in one of <span className="text-acid">25 typefaces</span> we drew for it.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={ready ? { opacity: 1, scale: 1 } : undefined} transition={{ delay: 1.9 + D, duration: 1, ease: EASE.back }}>
            <Magnetic>
              <Link href="/gallery" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-acid px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-void">
                Enter the gallery
                <span className="inline-block transition-transform duration-500 group-hover:translate-x-1 group-hover:-rotate-45">→</span>
              </Link>
            </Magnetic>
          </motion.div>
          <motion.div
            className="hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/60 md:flex"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 2.1 + D }}
          >
            <Clock />
            <span className="flex items-center gap-2">
              Scroll
              <span className="relative h-8 w-px overflow-hidden bg-ink/20">
                <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ink" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
              </span>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
