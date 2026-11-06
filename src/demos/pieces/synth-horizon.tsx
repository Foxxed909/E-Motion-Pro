"use client";

import { useCanvas } from "../shared/useCanvas";

export default function SynthHorizon() {
  const ref = useCanvas(
    () => {},
    ({ ctx, w, h, t }) => {
      const hz = h * 0.56;
      const sky = ctx.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, "#0d0221");
      sky.addColorStop(0.7, "#3b0b4f");
      sky.addColorStop(1, "#ff2a6d");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, hz);
      // stars
      for (let i = 0; i < 60; i++) {
        const x = (i * 9301 + 49297) % 233280 / 233280 * w;
        const y = ((i * 7919) % 1000) / 1000 * hz * 0.7;
        ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.3 * Math.sin(t * 2 + i)})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }
      // sun
      const r = Math.min(w, h) * 0.24;
      const cx = w / 2, cy = hz - r * 0.35;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      const sg = ctx.createLinearGradient(0, cy - r, 0, cy + r);
      sg.addColorStop(0, "#ffd23f");
      sg.addColorStop(0.6, "#ff5ca8");
      sg.addColorStop(1, "#7a5cff");
      ctx.fillStyle = sg;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = "#3b0b4f";
      for (let i = 0; i < 7; i++) {
        const yy = cy + r * 0.05 + i * r * 0.14 + ((t * 18) % (r * 0.14));
        ctx.fillRect(cx - r, yy, r * 2, (i + 1) * r * 0.012);
      }
      ctx.restore();
      ctx.shadowBlur = 0;
      // mountains
      ctx.fillStyle = "#12021f";
      ctx.beginPath();
      ctx.moveTo(0, hz);
      for (let x = 0; x <= w; x += w / 40) {
        const k = x / w;
        const m = Math.abs(Math.sin(k * 9.1) * 0.6 + Math.sin(k * 23.7) * 0.3) * (Math.abs(k - 0.5) > 0.18 ? 1 : 0.15);
        ctx.lineTo(x, hz - m * h * 0.12);
      }
      ctx.lineTo(w, hz);
      ctx.fill();
      // ground
      const gg = ctx.createLinearGradient(0, hz, 0, h);
      gg.addColorStop(0, "#1a0433");
      gg.addColorStop(1, "#05010d");
      ctx.fillStyle = gg;
      ctx.fillRect(0, hz, w, h - hz);
      ctx.strokeStyle = "#ff2a6d";
      ctx.shadowColor = "#ff2a6d";
      ctx.shadowBlur = 8;
      ctx.lineWidth = 1.4;
      const speed = (t * 0.9) % 1;
      for (let i = 0; i < 18; i++) {
        const z = (i + 1 - speed) / 18;
        const y = hz + (h - hz) * Math.pow(z, 2.6);
        ctx.globalAlpha = Math.min(1, z * 2);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (let i = -14; i <= 14; i++) {
        ctx.beginPath();
        ctx.moveTo(w / 2 + i * w * 0.012, hz);
        ctx.lineTo(w / 2 + i * w * 0.16, h);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,42,109,.5)";
      ctx.fillRect(0, hz - 1, w, 2);
    },
    [],
    1.5,
  );
  return (
    <div className="absolute inset-0">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-x-0 top-[12%] text-center font-autobahn text-[#ffd23f] drop-shadow-[0_0_12px_#ff2a6d]" style={{ fontSize: "min(9cqw,15cqh)" }}>
        OUTRUN
      </div>
    </div>
  );
}
