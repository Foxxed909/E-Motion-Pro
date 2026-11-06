import { ImageResponse } from "next/og";
import { OG_SIZE, ogBackground, ogFonts } from "@/lib/og";
import { DEMOS, demoBySlug, genreById } from "@/demos/registry";

export const alt = "E-Motion Pro piece";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const d = demoBySlug((await params).slug)!;
  const g = genreById(d.genre);
  const n = DEMOS.indexOf(d) + 1;
  return new ImageResponse(
    (
      <div style={{ ...ogBackground, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, color: "#f3efe7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "GeistMono", fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
          <span style={{ fontFamily: "EMP orbit", fontSize: 40, letterSpacing: 0, textTransform: "none" }}>E—MOTION</span>
          <span style={{ opacity: 0.7 }}>
            {String(n).padStart(2, "0")} / {DEMOS.length}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: `EMP ${g.font}`, fontSize: 40, color: "#d4ff3a" }}>{g.name}</div>
          <div style={{ display: "flex", fontFamily: "Geist", fontSize: 128, lineHeight: 1, letterSpacing: -4, marginTop: 16 }}>{d.title}</div>
          <div style={{ display: "flex", fontFamily: "Geist", fontSize: 32, marginTop: 28, opacity: 0.8, maxWidth: 980 }}>{d.blurb}</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {d.tags.map((t) => (
            <span key={t} style={{ fontFamily: "GeistMono", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", border: "1px solid rgba(243,239,231,.3)", borderRadius: 999, padding: "8px 20px" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts([g.font]) },
  );
}
