// Capture a still poster of every motion piece → public/posters/<slug>.png.
// Convert to ~800px WebP afterwards (the site loads /posters/<slug>.webp).
// Needs Playwright available (`npx playwright` or a global install) and the site running:
//   npm run build && npm start   (in another terminal)
//   node scripts/posters.mjs [baseUrl] [slug ...]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const base = process.argv[2] ?? "http://localhost:3000";
const only = process.argv.slice(3);
const slugs = [...fs.readFileSync(path.join(root, "src/demos/registry.ts"), "utf8").matchAll(/slug: "([a-z0-9-]+)", title/g)].map((m) => m[1]);
const out = path.join(root, "public/posters");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
// Stage on the piece page is (viewport - 64px) × 72svh → about 4:3 at this size.
const page = await browser.newPage({ viewport: { width: 1000, height: 896 } });
for (const slug of slugs.filter((s) => !only.length || only.includes(s))) {
  await page.goto(`${base}/motion/${slug}`, { waitUntil: "networkidle" });
  await page.mouse.move(2, 2);
  await page.waitForTimeout(Number(process.env.POSTER_WAIT ?? 2400));
  const stage = await page.$(".\\[container-type\\:size\\]");
  await stage.screenshot({ path: path.join(out, `${slug}.png`) });
  console.log("poster", slug);
}
await browser.close();
