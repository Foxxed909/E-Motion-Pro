import { ImageResponse } from "next/og";
import { OG_SIZE, ogBackground, ogFonts } from "@/lib/og";
import { FONTS } from "@/lib/fonts";

export const alt = "E-Motion Pro type foundry";
export const size = OG_SIZE;
export const contentType = "image/png";

const PICK = ["monolith", "neon", "scriptorium", "bitcrush", "pearl", "datamosh", "inkwell", "bubblegum", "halo", "echo"];

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ ...ogBackground, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, color: "#f3efe7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "GeistMono", fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
          <span>The type foundry</span>
          <span style={{ color: "#d4ff3a" }}>Free · OFL 1.1</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 30, fontSize: 84, lineHeight: 1, maxWidth: 1080 }}>
          {PICK.map((s) => (
            <span key={s} style={{ fontFamily: `EMP ${s}`, display: "flex" }}>
              Aa
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <span style={{ fontFamily: "EMP orbit", fontSize: 120, lineHeight: 1, whiteSpace: "nowrap" }}>{FONTS.length} FACES</span>
          <span style={{ fontFamily: "Geist", fontSize: 30, opacity: 0.8, whiteSpace: "nowrap" }}>drawn by code, free to download</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts(PICK) },
  );
}
