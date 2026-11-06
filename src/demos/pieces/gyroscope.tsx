"use client";

import { motion } from "motion/react";

const RINGS = [
  { size: 46, color: "#d4ff3a", axis: "rotateX", dur: 3.2, tilt: 0 },
  { size: 38, color: "#ff5ca8", axis: "rotateY", dur: 2.6, tilt: 60 },
  { size: 30, color: "#33e1ff", axis: "rotateX", dur: 2.1, tilt: -60 },
  { size: 22, color: "#7a5cff", axis: "rotateY", dur: 1.7, tilt: 30 },
] as const;

/** A 3D gyroscope loader: nested rings spinning on alternating axes around a glowing core. */
export default function Gyroscope() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6cqh]" style={{ perspective: "140cqh" }}>
      <motion.div className="relative" style={{ width: "46cqh", height: "46cqh", transformStyle: "preserve-3d" }} animate={{ rotateZ: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
        {RINGS.map((r, i) => (
          <div key={i} className="absolute left-1/2 top-1/2" style={{ width: `${r.size}cqh`, height: `${r.size}cqh`, marginLeft: `${-r.size / 2}cqh`, marginTop: `${-r.size / 2}cqh`, transform: `rotateZ(${r.tilt}deg)`, transformStyle: "preserve-3d" }}>
            <motion.div
              className="h-full w-full rounded-full"
              style={{ border: `0.7cqh solid ${r.color}`, boxShadow: `0 0 3cqh ${r.color}55, inset 0 0 3cqh ${r.color}33`, borderTopColor: "transparent" }}
              animate={{ [r.axis]: 360 }}
              transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ))}
        <motion.div className="absolute left-1/2 top-1/2 h-[6cqh] w-[6cqh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ boxShadow: "0 0 6cqh #f3efe7, 0 0 12cqh #7a5cff" }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
      <div className="flex gap-[0.8cqw] font-mono text-[max(10px,1.3cqw)] uppercase tracking-[0.4em] text-mute">
        {Array.from("CALIBRATING").map((c, i) => (
          <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.08 }}>
            {c}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
