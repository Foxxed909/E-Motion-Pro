import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const orbit = await fs.readFile(path.join(process.cwd(), "public", "fonts", "orbit.otf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090c", color: "#d4ff3a", fontFamily: "Orbit", fontSize: 120 }}>
        E
      </div>
    ),
    { ...size, fonts: [{ name: "Orbit", data: orbit, weight: 400 }] },
  );
}
