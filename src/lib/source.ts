import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";

export type PieceSource = { file: string; code: string; html: string; lines: number };

/** Reads and highlights a piece's source at build time (pages are statically generated). */
export async function getPieceSource(slug: string): Promise<PieceSource | null> {
  const file = `src/demos/pieces/${slug}.tsx`;
  try {
    const code = await fs.readFile(path.join(process.cwd(), "src", "demos", "pieces", `${slug}.tsx`), "utf8");
    const html = await codeToHtml(code, { lang: "tsx", theme: "vesper" });
    return { file, code, html, lines: code.split("\n").length };
  } catch {
    return null;
  }
}
