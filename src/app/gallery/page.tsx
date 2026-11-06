import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryView } from "@/components/GalleryView";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Every live motion piece in E-Motion Pro, filterable by genre.",
};

export default function GalleryPage() {
  return (
    <>
      <Suspense>
        <GalleryView />
      </Suspense>
      <Footer />
    </>
  );
}
