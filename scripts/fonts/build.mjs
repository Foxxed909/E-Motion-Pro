// Build the E-Motion Pro fonts → public/fonts/*.woff2 (+ .otf) and a manifest.
// Usage: node scripts/fonts/build.mjs [slug ...]
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import wawoff2 from "wawoff2";
import { glyphs, UPPER } from "./skeleton.mjs";
import { styles, transformLines } from "./styles.mjs";
import { orient, area, bbox } from "./geom.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const outDir = path.join(root, "public/fonts");
fs.mkdirSync(outDir, { recursive: true });

const only = process.argv.slice(2);
const UPM = 1000;

function buildGlyph(style, ch) {
  const lines = transformLines(glyphs[ch], { sx: style.sx ?? 1, slant: style.slant ?? 0 });
  const polys = style
    .render(lines, ch)
    .map((p) => {
      const q = p.map(([x, y]) => [Math.round(x), Math.round(y)]);
      q.hole = p.hole;
      return q;
    })
    .filter((p) => p.length >= 3 && Math.abs(area(p)) > 2)
    .map((p) => (p.hole ? orient(p).reverse() : orient(p)));
  const b = bbox(polys);
  const sb = style.sb ?? 50;
  const dx = sb - b.x0;
  const p = new opentype.Path();
  for (const poly of polys) {
    poly.forEach(([x, y], i) => (i ? p.lineTo(x + dx, y) : p.moveTo(x + dx, y)));
    p.close();
  }
  return { path: p, advance: Math.round(b.x1 - b.x0 + sb * 2), contours: polys.length };
}

/** Rebuild an sfnt binary without one table, recomputing offsets and checksums. */
function withoutTable(buf, drop) {
  const numTables = buf.readUInt16BE(4);
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    const tag = buf.toString("latin1", o, o + 4);
    if (tag === drop) continue;
    const offset = buf.readUInt32BE(o + 8);
    const length = buf.readUInt32BE(o + 12);
    tables.push({ tag, data: Buffer.from(buf.subarray(offset, offset + length)) });
  }
  tables.sort((a, b) => (a.tag < b.tag ? -1 : 1));
  const n = tables.length;
  const pad4 = (x) => (x + 3) & ~3;
  const checksum = (b) => {
    const p = Buffer.concat([b, Buffer.alloc(pad4(b.length) - b.length)]);
    let sum = 0;
    for (let i = 0; i < p.length; i += 4) sum = (sum + p.readUInt32BE(i)) >>> 0;
    return sum;
  };
  const head = tables.find((t) => t.tag === "head");
  if (head) head.data.writeUInt32BE(0, 8); // checkSumAdjustment computed below
  let offset = 12 + n * 16;
  const dir = Buffer.alloc(12 + n * 16);
  buf.copy(dir, 0, 0, 4); // sfnt version
  const es = Math.floor(Math.log2(n));
  dir.writeUInt16BE(n, 4);
  dir.writeUInt16BE(2 ** es * 16, 6);
  dir.writeUInt16BE(es, 8);
  dir.writeUInt16BE(n * 16 - 2 ** es * 16, 10);
  const bodies = [];
  tables.forEach((t, i) => {
    const o = 12 + i * 16;
    dir.write(t.tag, o, 4, "latin1");
    dir.writeUInt32BE(checksum(t.data), o + 4);
    dir.writeUInt32BE(offset, o + 8);
    dir.writeUInt32BE(t.data.length, o + 12);
    bodies.push(t.data, Buffer.alloc(pad4(t.data.length) - t.data.length));
    offset += pad4(t.data.length);
  });
  const out = Buffer.concat([dir, ...bodies]);
  if (head) {
    const headOffset = dir.readUInt32BE(12 + tables.indexOf(head) * 16 + 8);
    out.writeUInt32BE((0xb1b0afba - checksum(out)) >>> 0, headOffset + 8);
  }
  return out;
}

async function buildFont(style) {
  const list = [
    new opentype.Glyph({ name: ".notdef", unicode: 0, advanceWidth: 500, path: new opentype.Path() }),
    new opentype.Glyph({ name: "space", unicode: 32, advanceWidth: Math.round(280 * (style.sx ?? 1)), path: new opentype.Path() }),
  ];
  let contours = 0;
  for (const ch of Object.keys(glyphs)) {
    const g = buildGlyph(style, ch);
    contours += g.contours;
    const code = ch.charCodeAt(0);
    const unicodes = [code];
    if (UPPER.includes(ch)) unicodes.push(ch.toLowerCase().charCodeAt(0));
    list.push(
      new opentype.Glyph({
        name: "uni" + code.toString(16).toUpperCase().padStart(4, "0"),
        unicode: code,
        unicodes,
        advanceWidth: g.advance,
        path: g.path,
      }),
    );
  }
  const family = `EMP ${style.name}`;
  const font = new opentype.Font({
    familyName: family,
    styleName: "Regular",
    unitsPerEm: UPM,
    ascender: 860,
    descender: -240,
    designer: "E-Motion Pro",
    manufacturer: "E-Motion Pro",
    license: "SIL Open Font License 1.1",
    version: "1.000",
    description: style.blurb,
    glyphs: list,
  });
  // opentype.js emits an 'ltag' table that some parsers (e.g. Satori, used for social
  // images) cannot read. It is optional, so re-pack the font without it.
  const otf = withoutTable(Buffer.from(font.toArrayBuffer()), "ltag");
  const woff2 = Buffer.from(await wawoff2.compress(otf));
  fs.writeFileSync(path.join(outDir, `${style.slug}.otf`), otf);
  fs.writeFileSync(path.join(outDir, `${style.slug}.woff2`), woff2);
  return { contours, otf: otf.length, woff2: woff2.length };
}

const manifest = [];
for (const style of styles) {
  if (only.length && !only.includes(style.slug)) {
    manifest.push(style);
    continue;
  }
  const t = Date.now();
  const info = await buildFont(style);
  manifest.push(style);
  console.log(
    `${style.name.padEnd(14)} ${String(info.contours).padStart(6)} contours  ` +
      `${(info.woff2 / 1024).toFixed(1).padStart(6)} KB woff2  ${Date.now() - t}ms`,
  );
}

const meta = manifest.map((s, i) => ({
  index: i + 1,
  slug: s.slug,
  name: s.name,
  family: `EMP ${s.name}`,
  genre: s.genre,
  blurb: s.blurb,
}));
fs.writeFileSync(path.join(root, "src/data/fonts.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(`\nWrote ${meta.length} fonts to public/fonts and src/data/fonts.json`);

const css =
  "/* Generated by scripts/fonts/build.mjs — do not edit. */\n" +
  meta
    .map(
      (f) =>
        `@font-face {\n  font-family: "${f.family}";\n  src: url("/fonts/${f.slug}.woff2") format("woff2");\n  font-display: swap;\n}\n.font-${f.slug} {\n  font-family: "${f.family}", var(--font-geist-sans), sans-serif;\n}`,
    )
    .join("\n") +
  "\n";
fs.writeFileSync(path.join(root, "src/app/fonts.css"), css);
