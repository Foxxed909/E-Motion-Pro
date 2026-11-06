import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteUrl } from "@/lib/site";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { CommandPalette } from "@/components/CommandPalette";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FONT_COUNT, PIECE_COUNT, GENRE_COUNT } from "@/lib/counts";

export const metadata: Metadata = {
  title: { default: "E-Motion Pro — Motion Library", template: "%s · E-Motion Pro" },
  description:
    `A cinematic library of animations, transitions and motion graphics for apps and websites, plus ${FONT_COUNT} original typefaces.`,
  metadataBase: new URL(siteUrl()),
  openGraph: {
    title: "E-Motion Pro",
    description: `Animations, transitions & motion graphics — plus ${FONT_COUNT} original typefaces.`,
    type: "website",
    siteName: "E-Motion Pro",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#060608",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preload" href="/fonts/orbit.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        <Providers>
          <ScrollProgress />
          <Nav />
          <main>{children}</main>
          <CommandPalette />
          <Cursor />
          <div className="grain" aria-hidden />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
