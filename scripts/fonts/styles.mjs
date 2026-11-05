// The 25 original E-Motion Pro typefaces.
// Each style takes the shared skeleton (array of polylines per glyph) and
// returns closed polygons. "transform" adjusts the skeleton first.

import {
  add, sub, mul, norm, perp, cross, dist, circle, rect, rotatePoly,
  strokePolyline, strokeRun, offsetPolyline, isClosed, pathLength, cumulative,
  pointAt, slice, splitCorners, segmentsOf, distToSegs, bbox, clipBand, rng, noise1,
} from "./geom.mjs";

// ---------- renderers ----------

const mono = (o) => (lines) => lines.flatMap((pl) => strokePolyline(pl, o));

function nib({ width, angle, hair = 10 }) {
  const a = (angle * Math.PI) / 180;
  const v = [Math.cos(a) * (width / 2), Math.sin(a) * (width / 2)];
  return (lines) => {
    const out = [];
    for (const pl of lines) {
      out.push(...strokePolyline(pl, { h: hair / 2, cap: "round", join: "round" }));
      if (pathLength(pl) < 2) {
        out.push(circle(pl[0], width * 0.32));
        continue;
      }
      // split into runs where the side of the nib relative to travel is constant
      let run = [pl[0]];
      let sign = 0;
      const flush = () => {
        if (run.length > 1) {
          const left = run.map((p) => add(p, v));
          const right = run.map((p) => sub(p, v)).reverse();
          out.push([...left, ...right]);
        }
      };
      for (let i = 1; i < pl.length; i++) {
        const d = sub(pl[i], pl[i - 1]);
        const c = cross(norm(d), norm(v));
        const s = Math.abs(c) < 0.02 ? sign : Math.sign(c);
        if (sign !== 0 && s !== sign) {
          flush();
          run = [pl[i - 1]];
        }
        sign = s || sign;
        run.push(pl[i]);
      }
      flush();
    }
    return out;
  };
}

function resample(pl, spacing) {
  const total = pathLength(pl);
  if (total < 2) return [pl[0]];
  const cum = cumulative(pl);
  const closed = isClosed(pl);
  const n = Math.max(1, Math.round(total / spacing));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    if (closed && i === n) break;
    pts.push(pointAt(pl, cum, (total * i) / n));
  }
  return pts;
}

function dots({ spacing, size, shape = "circle" }) {
  return (lines) => {
    const seen = [];
    const out = [];
    for (const pl of lines) {
      for (const p of resample(pl, spacing)) {
        if (seen.some((q) => dist(p, q) < spacing * 0.45)) continue;
        seen.push(p);
        out.push(shape === "circle" ? circle(p, size / 2) : rect(p[0], p[1], size, size));
      }
    }
    return out;
  };
}

function dashes({ dash, gap, h, cap = "butt" }) {
  return (lines) => {
    const out = [];
    for (const pl of lines) {
      const total = pathLength(pl);
      if (total < 2) {
        out.push(rect(pl[0][0], pl[0][1], h * 2, h * 2));
        continue;
      }
      const cum = cumulative(pl);
      const n = Math.max(1, Math.round((total + gap) / (dash + gap)));
      const unit = (total + (isClosed(pl) ? 0 : gap)) / n;
      const d = unit - gap;
      for (let i = 0; i < n; i++) {
        const s0 = i * unit;
        const s1 = Math.min(total, s0 + d);
        out.push(...strokePolyline(slice(pl, cum, s0, s1), { h, cap, join: "miter" }));
      }
    }
    return out;
  };
}

const pixelShapes = {
  square: (c, s) => [rect(c[0], c[1], s, s)],
  circle: (c, s) => [circle(c, s / 2, 16)],
  diamond: (c, s) => [rotatePoly(rect(c[0], c[1], s * 0.75, s * 0.75), c, Math.PI / 4)],
  cross: (c, s) => [
    rotatePoly(rect(c[0], c[1], s * 1.05, s * 0.26), c, Math.PI / 4),
    rotatePoly(rect(c[0], c[1], s * 1.05, s * 0.26), c, -Math.PI / 4),
  ],
};

function pixels({ cell, h, shape = "square", fill = 0.92 }) {
  return (lines) => {
    const segs = segmentsOf(lines);
    const b = bbox(lines);
    const out = [];
    const i0 = Math.floor((b.x0 - h) / cell);
    const i1 = Math.ceil((b.x1 + h) / cell);
    const j0 = Math.floor((b.y0 - h) / cell);
    const j1 = Math.ceil((b.y1 + h) / cell);
    for (let i = i0; i <= i1; i++)
      for (let j = j0; j <= j1; j++) {
        const c = [(i + 0.5) * cell, (j + 0.5) * cell];
        if (distToSegs(c, segs) <= h) out.push(...pixelShapes[shape](c, cell * fill));
      }
    return out;
  };
}

function runs({ pitch, bar, h, axis = "x" }) {
  return (lines) => {
    const segs = segmentsOf(lines);
    const b = bbox(lines);
    const out = [];
    const STEP = 3;
    if (axis === "x") {
      for (let y = Math.floor((b.y0 - h) / pitch) * pitch + pitch / 2; y <= b.y1 + h; y += pitch) {
        let start = null;
        for (let x = b.x0 - h - STEP; x <= b.x1 + h + STEP; x += STEP) {
          const inside = distToSegs([x, y], segs) <= h;
          if (inside && start === null) start = x;
          if (!inside && start !== null) {
            if (x - start > STEP * 2) out.push(rect((start + x) / 2, y, x - start, bar));
            start = null;
          }
        }
      }
    } else {
      for (let x = Math.floor((b.x0 - h) / pitch) * pitch + pitch / 2; x <= b.x1 + h; x += pitch) {
        let start = null;
        for (let y = b.y0 - h - STEP; y <= b.y1 + h + STEP; y += STEP) {
          const inside = distToSegs([x, y], segs) <= h;
          if (inside && start === null) start = y;
          if (!inside && start !== null) {
            if (y - start > STEP * 2) out.push(rect(x, (start + y) / 2, bar, y - start));
            start = null;
          }
        }
      }
    }
    return out;
  };
}

function parallel({ offsets, h }) {
  return (lines) => {
    const out = [];
    for (const pl of lines) {
      if (pathLength(pl) < 2) {
        out.push(circle(pl[0], Math.max(...offsets) + h));
        continue;
      }
      for (const d of offsets) out.push(...strokePolyline(offsetPolyline(pl, d), { h, cap: "round", join: "round" }));
    }
    return out;
  };
}

function tube({ h, line }) {
  return (lines) => {
    const out = [];
    for (const pl of lines) {
      if (pathLength(pl) < 2) {
        const c = circle(pl[0], h);
        out.push(...strokePolyline([...c, c[0]], { h: line / 2 }));
        continue;
      }
      if (isClosed(pl)) {
        for (const d of [h, -h]) out.push(...strokePolyline(offsetPolyline(pl, d), { h: line / 2 }));
        continue;
      }
      const left = offsetPolyline(pl, h);
      const right = offsetPolyline(pl, -h).reverse();
      const capArc = (c, from) => {
        const pts = [];
        const base = Math.atan2(from[1] - c[1], from[0] - c[0]);
        for (let i = 1; i < 12; i++) {
          const a = base - (Math.PI * i) / 12;
          pts.push([c[0] + h * Math.cos(a), c[1] + h * Math.sin(a)]);
        }
        return pts;
      };
      const loop = [
        ...left,
        ...capArc(pl[pl.length - 1], left[left.length - 1]),
        ...right,
        ...capArc(pl[0], right[right.length - 1]),
      ];
      loop.push(loop[0]);
      out.push(...strokePolyline(loop, { h: line / 2, join: "round" }));
    }
    return out;
  };
}

function stencil({ h, gap }) {
  return (lines) => {
    const out = [];
    for (const pl of lines) {
      if (pathLength(pl) < 2) {
        out.push(rect(pl[0][0], pl[0][1], h * 2, h * 2));
        continue;
      }
      const { runs: rs } = splitCorners(pl);
      const pieces = [];
      for (const r of rs) {
        // split long curved runs at their vertical extremes
        let turning = 0;
        for (let i = 2; i < r.pts.length; i++) {
          const d1 = norm(sub(r.pts[i - 1], r.pts[i - 2]));
          const d2 = norm(sub(r.pts[i], r.pts[i - 1]));
          turning += Math.abs(Math.asin(Math.max(-1, Math.min(1, cross(d1, d2)))));
        }
        if (turning > (150 * Math.PI) / 180) {
          const cuts = [];
          for (let i = 1; i < r.pts.length - 1; i++) {
            const a = r.pts[i - 1][1], b = r.pts[i][1], c = r.pts[i + 1][1];
            if ((b > a && b >= c) || (b < a && b <= c)) cuts.push(i);
          }
          let s = 0;
          for (const c of cuts) {
            pieces.push(r.pts.slice(s, c + 1));
            s = c;
          }
          pieces.push(r.pts.slice(s));
        } else pieces.push(r.pts);
      }
      for (const pc of pieces) {
        const total = pathLength(pc);
        if (total <= gap * 1.2) continue;
        const cum = cumulative(pc);
        out.push(...strokeRun(slice(pc, cum, gap / 2, total - gap / 2), h, "butt", "butt"));
      }
    }
    return out;
  };
}

function bands({ base, height, gap = 0, shift = 0, seedSalt = 0 }) {
  return (lines, ch) => {
    const polys = base(lines, ch);
    const r = rng(ch.charCodeAt(0) * 9973 + seedSalt);
    const out = [];
    for (let y = -200; y < 900; y += height) {
      const dx = shift && r() < 0.45 ? (r() * 2 - 1) * shift : 0;
      for (const p of polys) {
        const c = clipBand(p, y, y + height - gap);
        if (c.length) out.push(c.map(([x, yy]) => [x + dx, yy]));
      }
    }
    return out;
  };
}

function sketch({ passes, h, amp }) {
  return (lines, ch) => {
    const out = [];
    lines.forEach((pl, li) => {
      for (let k = 0; k < passes; k++) {
        const seed = ch.charCodeAt(0) * 131 + li * 17 + k * 7 + 1;
        const nz = noise1(seed);
        const nz2 = noise1(seed + 99);
        if (pathLength(pl) < 2) {
          out.push(circle(add(pl[0], [nz(1) * amp, nz2(1) * amp]), h * 3));
          continue;
        }
        const cum = cumulative(pl);
        let pts = pl.map((p, i) => add(p, [nz(cum[i] / 90) * amp, nz2(cum[i] / 90) * amp]));
        // overshoot the ends like a quick pencil flick
        const ext = 6 + rng(seed)() * 22;
        const d0 = norm(sub(pts[0], pts[1]));
        const d1 = norm(sub(pts[pts.length - 1], pts[pts.length - 2]));
        if (!isClosed(pl)) pts = [add(pts[0], mul(d0, ext)), ...pts, add(pts[pts.length - 1], mul(d1, ext))];
        out.push(...strokePolyline(pts, { h: h * (0.8 + k * 0.25), cap: "round", join: "round" }));
      }
    });
    return out;
  };
}

// ---------- skeleton transforms ----------

function densify(pl, step = 18) {
  const out = [pl[0]];
  for (let i = 1; i < pl.length; i++) {
    const a = pl[i - 1], b = pl[i];
    const n = Math.max(1, Math.ceil(dist(a, b) / step));
    for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
}

export function transformLines(lines, { sx = 1, slant = 0 }) {
  return lines.map((pl) => densify(pl.map(([x, y]) => [x * sx + y * slant, y])));
}

// ---------- the family ----------

export const styles = [
  {
    slug: "orbit", name: "Orbit", genre: "Geometric",
    blurb: "A perfectly round monoline. Calm, orbital, endlessly legible.",
    render: mono({ h: 40, cap: "round", join: "round" }),
  },
  {
    slug: "filament", name: "Filament", genre: "Hairline",
    blurb: "A wide, whisper-thin hairline built for luxury and silence.",
    sx: 1.22, sb: 46,
    render: mono({ h: 9, cap: "butt", join: "miter" }),
  },
  {
    slug: "monolith", name: "Monolith", genre: "Brutalist",
    blurb: "Slab-heavy and square-cut. Type that weighs a tonne.",
    sx: 0.82, sb: 40,
    render: mono({ h: 84, cap: "square", join: "miter" }),
  },
  {
    slug: "velocity", name: "Velocity", genre: "Speed Italic",
    blurb: "Extended, raked forward, built for motion blur.",
    sx: 1.32, slant: 0.3,
    render: mono({ h: 30, cap: "butt", join: "miter" }),
  },
  {
    slug: "spindle", name: "Spindle", genre: "Condensed",
    blurb: "Ultra-condensed verticals for towering headlines.",
    sx: 0.5, sb: 44,
    render: mono({ h: 30, cap: "square", join: "miter" }),
  },
  {
    slug: "bubblegum", name: "Bubblegum", genre: "Soft Display",
    blurb: "Inflated, squishy, impossibly friendly.",
    sx: 1.12, sb: 30,
    render: mono({ h: 92, cap: "round", join: "round" }),
  },
  {
    slug: "scriptorium", name: "Scriptorium", genre: "Calligraphic",
    blurb: "A 35° broad nib — the ghost of a medieval scribe.",
    slant: 0.12, sb: 50,
    render: nib({ width: 130, angle: 35, hair: 14 }),
  },
  {
    slug: "opera", name: "Opera", genre: "High Contrast",
    blurb: "Vertical stress and razor hairlines. Fashion-week energy.",
    sb: 50,
    render: nib({ width: 124, angle: 0, hair: 18 }),
  },
  {
    slug: "saloon", name: "Saloon", genre: "Reverse Contrast",
    blurb: "Fat horizontals, skinny verticals. A wild-west poster gone modern.",
    sx: 1.1, sb: 44,
    render: nib({ width: 120, angle: 90, hair: 18 }),
  },
  {
    slug: "constellation", name: "Constellation", genre: "Dotted",
    blurb: "Letters mapped as star charts — tiny points of light.",
    render: dots({ spacing: 52, size: 30 }),
  },
  {
    slug: "pearl", name: "Pearl", genre: "Beaded",
    blurb: "Strung beads, evenly spaced, glossy and tactile.",
    sb: 40,
    render: dots({ spacing: 70, size: 66 }),
  },
  {
    slug: "telegraph", name: "Telegraph", genre: "Dashed",
    blurb: "Dash-dash-dot. Signal fragments forming words.",
    render: dashes({ dash: 72, gap: 34, h: 26 }),
  },
  {
    slug: "bitcrush", name: "Bitcrush", genre: "Bitmap",
    blurb: "Every curve crushed onto a hard pixel grid.",
    sb: 30,
    render: pixels({ cell: 50, h: 48, shape: "square", fill: 1.002 }),
  },
  {
    slug: "lumen", name: "Lumen", genre: "LED Matrix",
    blurb: "A dot-matrix display, lit one diode at a time.",
    sb: 30,
    render: pixels({ cell: 44, h: 40, shape: "circle", fill: 0.8 }),
  },
  {
    slug: "stitch", name: "Stitch", genre: "Cross-Stitch",
    blurb: "Hand-embroidered crosses on a digital canvas.",
    sb: 30,
    render: pixels({ cell: 46, h: 40, shape: "cross", fill: 0.95 }),
  },
  {
    slug: "scanline", name: "Scanline", genre: "Raster",
    blurb: "Horizontal scan beams — a CRT caught mid-refresh.",
    sb: 34,
    render: runs({ pitch: 38, bar: 22, h: 52, axis: "x" }),
  },
  {
    slug: "barcode", name: "Barcode", genre: "Raster",
    blurb: "Vertical bars. Scan it and it scans you back.",
    sb: 34,
    render: runs({ pitch: 30, bar: 16, h: 50, axis: "y" }),
  },
  {
    slug: "autobahn", name: "Autobahn", genre: "Multiline",
    blurb: "Triple racing stripes running in perfect parallel.",
    sx: 1.08, sb: 44,
    render: parallel({ offsets: [-34, 0, 34], h: 8 }),
  },
  {
    slug: "neon", name: "Neon", genre: "Outline",
    blurb: "Bent glass tubes, overlapping where the gas glows.",
    sb: 40,
    render: tube({ h: 54, line: 14 }),
  },
  {
    slug: "bulkhead", name: "Bulkhead", genre: "Stencil",
    blurb: "Spray-painted on steel. Military-grade cuts.",
    sx: 0.95, sb: 40,
    render: stencil({ h: 66, gap: 46 }),
  },
  {
    slug: "datamosh", name: "Datamosh", genre: "Glitch",
    blurb: "Corrupted slices, displaced scanlines, beautiful errors.",
    sb: 50,
    render: bands({ base: mono({ h: 52, cap: "square", join: "miter" }), height: 46, shift: 46, seedSalt: 7 }),
  },
  {
    slug: "venetian", name: "Venetian", genre: "Slatted",
    blurb: "Light through blinds. Heavy forms sliced into slats.",
    sb: 38,
    render: bands({ base: mono({ h: 74, cap: "square", join: "miter" }), height: 48, gap: 16 }),
  },
  {
    slug: "graphite", name: "Graphite", genre: "Hand-drawn",
    blurb: "Restless pencil passes. Sketchy, alive, imperfect.",
    sb: 44,
    render: sketch({ passes: 3, h: 6, amp: 15 }),
  },
  {
    slug: "ribbon", name: "Ribbon", genre: "Twisted",
    blurb: "A satin band that twists as it travels.",
    sb: 42,
    render: mono({
      cap: "round", join: "round",
      hAt: (s) => 44 * (0.18 + 0.82 * Math.abs(Math.cos((Math.PI * s) / 300))),
    }),
  },
  {
    slug: "inkwell", name: "Inkwell", genre: "Brush",
    blurb: "Tapered brush strokes with real pressure and release.",
    slant: 0.16, sb: 44,
    render: mono({
      cap: "round", join: "round",
      hAt: (s, u) => 52 * (0.1 + 0.9 * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 0.55)),
    }),
  },
];
