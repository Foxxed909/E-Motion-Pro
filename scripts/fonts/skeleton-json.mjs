// Export the centre-line skeleton (font units, y-up) for client-side drawing effects.
import fs from "node:fs";
import path from "node:path";
import { glyphs } from "./skeleton.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const out = {};
for (const [ch, lines] of Object.entries(glyphs)) out[ch] = lines.map((pl) => pl.map(([x, y]) => [Math.round(x), Math.round(y)]));
fs.writeFileSync(path.join(root, "src/data/skeleton.json"), JSON.stringify(out));
console.log(`skeleton.json: ${Object.keys(out).length} glyphs`);
