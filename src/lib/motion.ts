export const EASE = {
  expo: [0.16, 1, 0.3, 1] as const,
  quart: [0.76, 0, 0.24, 1] as const,
  circ: [0.85, 0, 0.15, 1] as const,
  back: [0.34, 1.56, 0.64, 1] as const,
};

export const SPRING = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 1 } as const,
  snappy: { type: "spring", stiffness: 420, damping: 32 } as const,
  bouncy: { type: "spring", stiffness: 300, damping: 12 } as const,
  heavy: { type: "spring", stiffness: 90, damping: 18, mass: 2 } as const,
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mapRange = (v: number, a: number, b: number, c: number, d: number) =>
  c + ((v - a) / (b - a)) * (d - c);
