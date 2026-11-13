import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const fontFile = (slug: string) => fs.readFile(path.join(process.cwd(), "public", "fonts", `${slug}.otf`));
const geist = (file: string) => fs.readFile(path.join(process.cwd(), "node_modules", "geist", "dist", "fonts", file));

export const OG_SIZE = { width: 1200, height: 630 };

/** Fonts for next/og (Satori needs OTF/TTF). */
export async function ogFonts(extra: string[] = []) {
  const slugs = Array.from(new Set(["orbit", ...extra]));
  const fonts = await Promise.all(slugs.map(async (s) => ({ name: `EMP ${s}`, data: await fontFile(s), weight: 400 as const })));
  return [
    ...fonts,
    { name: "Geist", data: await geist("geist-sans/Geist-Regular.ttf"), weight: 400 as const },
    { name: "GeistMono", data: await geist("geist-mono/GeistMono-Regular.ttf"), weight: 400 as const },
  ];
}

export const ogBackground = {
  backgroundColor: "#09090c",
  backgroundImage:
    "radial-gradient(60% 80% at 85% 10%, rgba(255,79,46,.5), transparent 60%), radial-gradient(50% 70% at 70% 90%, rgba(255,92,168,.45), transparent 60%), radial-gradient(60% 60% at 10% 100%, rgba(122,92,255,.5), transparent 60%)",
};
