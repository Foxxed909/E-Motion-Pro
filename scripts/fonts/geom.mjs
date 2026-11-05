// Geometry kernel for the E-Motion Pro font engine.
// All output shapes are closed polygons ([[x,y],...]) that get normalised to a
// single winding direction, so overlapping contours union under non-zero fill.

export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const mul = (a, s) => [a[0] * s, a[1] * s];
export const len = (a) => Math.hypot(a[0], a[1]);
export const norm = (a) => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l];
};
export const perp = (d) => [-d[1], d[0]]; // left normal (y-up)
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const dist = (a, b) => len(sub(a, b));

export function area(poly) {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    s += a[0] * b[1] - b[0] * a[1];
  }
  return s / 2;
}

/** Force counter-clockwise winding. */
export function orient(poly) {
  return area(poly) < 0 ? poly.slice().reverse() : poly;
}

export function circle(c, r, n) {
  const k = n ?? Math.max(12, Math.min(48, Math.ceil((2 * Math.PI * r) / 14)));
  const out = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * Math.PI * 2;
    out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]);
  }
  return out;
}

export function rect(cx, cy, w, h) {
  return [
    [cx - w / 2, cy - h / 2],
    [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2],
    [cx - w / 2, cy + h / 2],
  ];
}

export function rotatePoly(poly, c, ang) {
  const cs = Math.cos(ang);
  const sn = Math.sin(ang);
  return poly.map(([x, y]) => {
    const dx = x - c[0];
    const dy = y - c[1];
    return [c[0] + dx * cs - dy * sn, c[1] + dx * sn + dy * cs];
  });
}

export function pathLength(pts) {
  let s = 0;
  for (let i = 1; i < pts.length; i++) s += dist(pts[i], pts[i - 1]);
  return s;
}

export function cumulative(pts) {
  const out = [0];
  for (let i = 1; i < pts.length; i++) out.push(out[i - 1] + dist(pts[i], pts[i - 1]));
  return out;
}

export const isClosed = (pts) => pts.length > 3 && dist(pts[0], pts[pts.length - 1]) < 1;

/** Point at arc-length s along a polyline. */
export function pointAt(pts, cum, s) {
  if (s <= 0) return pts[0];
  for (let i = 1; i < pts.length; i++) {
    if (cum[i] >= s) {
      const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return add(pts[i - 1], mul(sub(pts[i], pts[i - 1]), t));
    }
  }
  return pts[pts.length - 1];
}

/** Extract the sub-polyline between arc lengths s0 and s1. */
export function slice(pts, cum, s0, s1) {
  const out = [pointAt(pts, cum, s0)];
  for (let i = 0; i < pts.length; i++) if (cum[i] > s0 && cum[i] < s1) out.push(pts[i]);
  out.push(pointAt(pts, cum, s1));
  return out;
}

/** Remove near-duplicate consecutive points. */
export function clean(pts) {
  const out = [];
  for (const p of pts) {
    if (!out.length || dist(out[out.length - 1], p) > 0.25) out.push(p);
  }
  return out;
}

const CORNER = (28 * Math.PI) / 180;

/**
 * Split a polyline at sharp corners.
 * Returns { runs: [{pts, i0, i1}], corners: [{p, d1, d2, i}] }
 */
export function splitCorners(pts) {
  const runs = [];
  const corners = [];
  let start = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d1 = norm(sub(pts[i], pts[i - 1]));
    const d2 = norm(sub(pts[i + 1], pts[i]));
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(d1, d2))));
    if (ang > CORNER) {
      runs.push({ pts: pts.slice(start, i + 1), i0: start, i1: i });
      corners.push({ p: pts[i], d1, d2, i });
      start = i;
    }
  }
  runs.push({ pts: pts.slice(start), i0: start, i1: pts.length - 1 });
  if (isClosed(pts)) {
    const d1 = norm(sub(pts[pts.length - 1], pts[pts.length - 2]));
    const d2 = norm(sub(pts[1], pts[0]));
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(d1, d2))));
    if (ang > CORNER) corners.push({ p: pts[0], d1, d2, i: 0, seam: true });
  }
  return { runs, corners };
}

/** Vertex normals for an open smooth run (miter-scaled, clamped). */
function vertexNormals(pts, closed = false) {
  const n = pts.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    let prev = i > 0 ? pts[i - 1] : closed ? pts[n - 2] : null;
    let next = i < n - 1 ? pts[i + 1] : closed ? pts[1] : null;
    let nrm;
    if (prev && next) {
      const n1 = perp(norm(sub(pts[i], prev)));
      const n2 = perp(norm(sub(next, pts[i])));
      const m = add(n1, n2);
      const ml = len(m);
      if (ml < 1e-6) nrm = n1;
      else {
        const c = ml / 2; // cos(half turn)
        nrm = mul(norm(m), 1 / Math.max(c, 0.34));
      }
    } else if (next) nrm = perp(norm(sub(next, pts[i])));
    else nrm = perp(norm(sub(pts[i], prev)));
    out.push(nrm);
  }
  return out;
}

/** Parallel offset of a polyline (miter joins). */
export function offsetPolyline(pts, d) {
  const closed = isClosed(pts);
  const ns = vertexNormals(pts, closed);
  return pts.map((p, i) => add(p, mul(ns[i], d)));
}

function capPoints(p, dir, h, kind, atEnd) {
  // returns points that go from the left side to the right side around the end (atEnd)
  // or from the right side to the left side around the start (!atEnd)
  const n = perp(dir);
  const out = [];
  if (kind === "round") {
    const base = Math.atan2(atEnd ? n[1] : -n[1], atEnd ? n[0] : -n[0]);
    const k = Math.max(6, Math.ceil((Math.PI * h) / 14));
    for (let i = 1; i < k; i++) {
      const a = base - (Math.PI * i) / k;
      out.push([p[0] + h * Math.cos(a), p[1] + h * Math.sin(a)]);
    }
  } else if (kind === "square") {
    const f = atEnd ? dir : mul(dir, -1);
    const side = atEnd ? n : mul(n, -1);
    out.push(add(add(p, mul(f, h)), mul(side, h)));
    out.push(add(add(p, mul(f, h)), mul(side, -h)));
  }
  return out;
}

/**
 * Outline of a smooth run with per-vertex half-width.
 * hs: number | (index, arcLength) => number
 */
export function strokeRun(pts, hs, capStart = "round", capEnd = "round") {
  pts = clean(pts);
  if (pts.length < 2) return [];
  const cum = cumulative(pts);
  const H = (i) => (typeof hs === "number" ? hs : hs(i, cum[i]));
  const ns = vertexNormals(pts);
  const left = pts.map((p, i) => add(p, mul(ns[i], H(i))));
  const right = pts.map((p, i) => add(p, mul(ns[i], -H(i))));
  const last = pts.length - 1;
  const dEnd = norm(sub(pts[last], pts[last - 1]));
  const dStart = norm(sub(pts[1], pts[0]));
  const poly = [
    ...left,
    ...capPoints(pts[last], dEnd, H(last), capEnd, true),
    ...right.reverse(),
    ...capPoints(pts[0], dStart, H(0), capStart, false),
  ];
  return [poly];
}

function joinShape(c, h, kind) {
  if (kind === "round") return [circle(c.p, h)];
  const turn = cross(c.d1, c.d2);
  const s = turn > 0 ? -1 : 1;
  const n1 = perp(c.d1);
  const n2 = perp(c.d2);
  const a = add(c.p, mul(n1, s * h));
  const b = add(c.p, mul(n2, s * h));
  const m = add(n1, n2);
  const ml2 = dot(m, m);
  if (kind === "miter" && ml2 > 1e-6) {
    const tip = add(c.p, mul(m, (s * h * 2) / ml2));
    if (dist(tip, c.p) < h * 2.4) return [[c.p, a, tip, b]];
  }
  return [[c.p, a, b]];
}

/**
 * Monoline stroke of a whole polyline (handles corners + closed loops).
 * opts: { h | hAt(s,u), cap, join }
 */
export function strokePolyline(pts, opts) {
  const { cap = "round", join = "round" } = opts;
  const total = pathLength(pts);
  const hAt = opts.hAt ?? (() => opts.h);
  if (total < 2) {
    const h = hAt(0, 0);
    return cap === "round" ? [circle(pts[0], h)] : [rect(pts[0][0], pts[0][1], h * 2, h * 2)];
  }
  const closed = isClosed(pts);
  const cumAll = cumulative(pts);
  const { runs, corners } = splitCorners(pts);
  const out = [];
  runs.forEach((run, ri) => {
    const first = ri === 0;
    const lastRun = ri === runs.length - 1;
    const cs = first && !closed ? cap : "butt";
    const ce = lastRun && !closed ? cap : "butt";
    const hs = (i) => {
      const s = cumAll[run.i0 + i];
      return hAt(s, s / total);
    };
    out.push(...strokeRun(run.pts, hs, cs, ce));
  });
  for (const c of corners) {
    const s = cumAll[c.i];
    out.push(...joinShape(c, hAt(s, s / total), join));
  }
  return out;
}

/** Minimum distance from point to a set of segments. */
export function distToSegs(p, segs) {
  let best = Infinity;
  for (const [a, b] of segs) {
    const ab = sub(b, a);
    const l2 = dot(ab, ab);
    let t = l2 ? dot(sub(p, a), ab) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    const q = add(a, mul(ab, t));
    const d = dist(p, q);
    if (d < best) best = d;
  }
  return best;
}

export function segmentsOf(polylines) {
  const segs = [];
  for (const pl of polylines) {
    if (pl.length === 1) segs.push([pl[0], pl[0]]);
    for (let i = 1; i < pl.length; i++) segs.push([pl[i - 1], pl[i]]);
  }
  return segs;
}

export function bbox(polys) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const poly of polys)
    for (const [x, y] of poly) {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  return { x0, y0, x1, y1 };
}

/** Sutherland–Hodgman clip of a polygon to the horizontal band y0 <= y <= y1. */
export function clipBand(poly, y0, y1, axis = 1) {
  const clipEdge = (input, keep, intersect) => {
    const out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      const ci = keep(cur);
      const pi = keep(prev);
      if (ci) {
        if (!pi) out.push(intersect(prev, cur));
        out.push(cur);
      } else if (pi) out.push(intersect(prev, cur));
    }
    return out;
  };
  const at = (v) => (a, b) => {
    const t = (v - a[axis]) / (b[axis] - a[axis]);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  let p = clipEdge(poly, (q) => q[axis] >= y0, at(y0));
  if (p.length < 3) return [];
  p = clipEdge(p, (q) => q[axis] <= y1, at(y1));
  return p.length < 3 ? [] : p;
}

/** Deterministic PRNG. */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/** Smooth 1D value noise. */
export function noise1(seed) {
  const r = rng(seed);
  const table = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = table[((i % 256) + 256) % 256];
    const b = table[(((i + 1) % 256) + 256) % 256];
    const t = f * f * (3 - 2 * f);
    return a + (b - a) * t;
  };
}
