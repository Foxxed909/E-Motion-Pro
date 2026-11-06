import { ImageResponse } from "next/og";
import { OG_SIZE, ogBackground, ogFonts } from "@/lib/og";
import { FONT_COUNT, GENRE_COUNT, PIECE_COUNT } from "@/lib/counts";

export const alt = "E-Motion Pro — motion library and original typefaces";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ ...ogBackground, width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, color: "#f3efe7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "GeistMono", fontSize: 20, letterSpacing: 6, textTransform: "uppercase", opacity: 0.8 }}>
          <span>Motion library — Vol. 01</span>
          <span style={{ color: "#d4ff3a" }}>e-motion pro</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "EMP orbit", fontSize: 168, lineHeight: 0.9, display: "flex", whiteSpace: "nowrap" }}>E—MOTION</div>
          <div style={{ fontFamily: "Geist", fontSize: 34, marginTop: 28, opacity: 0.85, display: "flex" }}>
            Animations, transitions & motion graphics for apps and websites.
          </div>
        </div>
        <div style={{ display: "flex", gap: 48, fontFamily: "GeistMono", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
          <span style={{ color: "#d4ff3a" }}>{PIECE_COUNT} live pieces</span>
          <span>{GENRE_COUNT} genres</span>
          <span>{FONT_COUNT} original fonts</span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
