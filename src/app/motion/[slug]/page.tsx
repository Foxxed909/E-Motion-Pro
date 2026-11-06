import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMOS, demoBySlug } from "@/demos/registry";
import { DetailView } from "@/components/DetailView";
import { Footer } from "@/components/Footer";
import { getPieceSource } from "@/lib/source";

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = demoBySlug((await params).slug);
  return d ? { title: d.title, description: d.blurb } : {};
}

export default async function MotionPage({ params }: { params: Promise<{ slug: string }> }) {
  const demo = demoBySlug((await params).slug);
  if (!demo) notFound();
  const source = await getPieceSource(demo.slug);
  return (
    <>
      <DetailView demo={demo} source={source} />
      <Footer />
    </>
  );
}
