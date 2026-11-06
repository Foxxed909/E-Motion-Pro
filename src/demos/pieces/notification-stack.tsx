"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const ITEMS = [
  { app: "Pulse", color: "#ff4f2e", title: "Your render finished", body: "hero_loop_v12.mp4 · 4.2s · 60fps", time: "now" },
  { app: "Orbit", color: "#7a5cff", title: "Mira commented", body: "“That easing curve is unreal.”", time: "2m" },
  { app: "Tide", color: "#33e1ff", title: "Deploy succeeded", body: "e-motion-pro → production", time: "9m" },
  { app: "Bloom", color: "#d4ff3a", title: "New follower", body: "@kinetic.studio started following you", time: "1h" },
];

export default function NotificationStack({ mini }: { mini?: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!mini) return;
    const id = setInterval(() => setOpen((o) => !o), 1800);
    return () => clearInterval(id);
  }, [mini]);
  return (
    <div className="absolute inset-0 flex items-center justify-center" onPointerEnter={() => !mini && setOpen(true)} onPointerLeave={() => !mini && setOpen(false)}>
      <div className="relative h-[60cqh] w-[min(70cqw,60cqh)]">
        {ITEMS.map((n, i) => (
          <motion.div
            key={n.title}
            className="absolute inset-x-0 top-0 flex gap-[1.8cqh] rounded-[2.6cqh] border border-white/10 bg-white/10 p-[2cqh] text-white backdrop-blur-xl"
            style={{ zIndex: ITEMS.length - i, transformOrigin: "top center" }}
            animate={open ? { y: i * 14.5 + "cqh", scale: 1, opacity: 1 } : { y: i * 1.6 + "cqh", scale: 1 - i * 0.06, opacity: i > 2 ? 0 : 1 - i * 0.25 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: open ? i * 0.04 : (ITEMS.length - i) * 0.03 }}
          >
            <span className="h-[5.5cqh] w-[5.5cqh] shrink-0 rounded-[1.4cqh]" style={{ background: `linear-gradient(135deg, ${n.color}, #000)` }} />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-[1.6cqh] text-white/50">
                <span className="uppercase tracking-wider">{n.app}</span>
                <span>{n.time}</span>
              </div>
              <div className="truncate text-[2cqh] font-semibold">{n.title}</div>
              <div className="truncate text-[1.8cqh] text-white/60">{n.body}</div>
            </div>
          </motion.div>
        ))}
        <motion.div className="absolute -bottom-[2cqh] inset-x-0 text-center font-mono text-[max(10px,1.6cqh)] uppercase tracking-[0.3em] text-white/40" animate={{ opacity: open ? 0 : 1 }}>
          4 notifications · hover
        </motion.div>
      </div>
    </div>
  );
}
