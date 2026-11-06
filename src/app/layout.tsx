import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: { default: "E-Motion Pro — Motion Library", template: "%s · E-Motion Pro" },
  description:
    "A cinematic library of animations, transitions and motion graphics for apps and websites, plus 25 original typefaces.",
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  openGraph: {
    title: "E-Motion Pro",
    description: "Animations, transitions & motion graphics — plus 25 original typefaces.",
    type: "website",
  },
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
          <Nav />
          <main>{children}</main>
          <Cursor />
          <div className="grain" aria-hidden />
        </Providers>
      </body>
    </html>
  );
}
