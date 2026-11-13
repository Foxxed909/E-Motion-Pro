"use client";

/**
 * E-Motion Pro sound engine — every sound is synthesised with Web Audio, no files.
 * Off by default; the preference is remembered per visitor.
 */
type SoundName = "hover" | "click" | "whoosh" | "success" | "toggle";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { stop: () => void } | null = null;
  private noise: AudioBuffer | null = null;
  private last: Record<string, number> = {};
  private subs = new Set<() => void>();
  enabled = false;

  init() {
    try {
      this.enabled = localStorage.getItem("emp-sound") === "1";
    } catch {}
    // Tell subscribers, or the toggle keeps saying "off" after a reload with sound on.
    if (this.enabled) this.emit();
  }
  subscribe = (f: () => void) => {
    this.subs.add(f);
    return () => this.subs.delete(f);
  };
  private emit() {
    this.subs.forEach((f) => f());
  }

  private ensure() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    const comp = this.ctx.createDynamicsCompressor();
    this.master.connect(comp).connect(this.ctx.destination);
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return this.ctx;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem("emp-sound", on ? "1" : "0");
    } catch {}
    if (on) {
      const ctx = this.ensure();
      ctx?.resume();
      this.startAmbient();
      this.play("toggle");
    } else this.stopAmbient();
    this.emit();
  }
  toggle() {
    this.setEnabled(!this.enabled);
  }

  /** Call from a user gesture to resume audio after a reload with sound enabled. */
  unlock() {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (ctx?.state === "suspended") ctx.resume();
    if (!this.ambient) this.startAmbient();
  }

  private env(g: GainNode, t: number, peak: number, a: number, d: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  private tone(type: OscillatorType, f0: number, f1: number, dur: number, peak: number, at = 0) {
    const ctx = this.ctx!;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    this.env(g, t, peak, 0.004, dur);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private hiss(dur: number, peak: number, from: number, to: number, q = 1.2) {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = q;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(this.master!);
    s.start(t);
    s.stop(t + dur + 0.05);
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || ctx.state !== "running") return;
    const now = performance.now();
    const gap = name === "hover" ? 45 : 30;
    if (now - (this.last[name] ?? 0) < gap) return;
    this.last[name] = now;
    switch (name) {
      case "hover":
        this.tone("sine", 2100 + Math.random() * 300, 1500, 0.05, 0.035);
        break;
      case "click":
        this.tone("triangle", 520, 180, 0.12, 0.12);
        this.hiss(0.04, 0.05, 5000, 2000, 0.7);
        break;
      case "whoosh":
        this.hiss(0.75, 0.12, 300, 3800, 0.9);
        this.tone("sine", 90, 45, 0.6, 0.08);
        break;
      case "success":
        [0, 0.07, 0.14].forEach((d, i) => this.tone("sine", [660, 880, 1320][i], [660, 880, 1320][i] * 0.995, 0.25, 0.07, d));
        break;
      case "toggle":
        this.tone("square", 880, 440, 0.06, 0.03);
        this.tone("sine", 1320, 1320, 0.15, 0.05, 0.05);
        break;
    }
  }

  private startAmbient() {
    const ctx = this.ctx;
    if (!ctx || this.ambient) return;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 3);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 420;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(lp.frequency);
    const oscs = [55, 82.4, 110.3, 164.8].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? "sawtooth" : "triangle";
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 6;
      o.connect(lp);
      o.start();
      return o;
    });
    lp.connect(out).connect(this.master!);
    lfo.start();
    this.ambient = {
      stop: () => {
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(out.gain.value, t);
        out.gain.linearRampToValueAtTime(0, t + 0.6);
        setTimeout(() => {
          oscs.forEach((o) => o.stop());
          lfo.stop();
        }, 700);
      },
    };
  }
  private stopAmbient() {
    this.ambient?.stop();
    this.ambient = null;
  }
}

export const sound = new SoundEngine();
