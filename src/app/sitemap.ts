import type { MetadataRoute } from "next";
import { DEMOS } from "@/demos/registry";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/fonts`, changeFrequency: "monthly", priority: 0.8 },
    ...DEMOS.map((d) => ({ url: `${base}/motion/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
