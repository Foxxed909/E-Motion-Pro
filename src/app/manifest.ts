import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "E-Motion Pro",
    short_name: "E-Motion",
    description: "A cinematic motion library with original typefaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090c",
    theme_color: "#09090c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
