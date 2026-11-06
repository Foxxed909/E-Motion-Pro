import { Preloader } from "@/components/landing/Preloader";
import { Hero } from "@/components/landing/Hero";
import { VelocityBand } from "@/components/landing/VelocityBand";
import { Manifesto } from "@/components/landing/Manifesto";
import { Featured } from "@/components/landing/Featured";
import { GenreIndex } from "@/components/landing/GenreIndex";
import { TypeShowcase } from "@/components/landing/TypeShowcase";
import { Stats } from "@/components/landing/Stats";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <VelocityBand />
      <Manifesto />
      <Featured />
      <GenreIndex />
      <TypeShowcase />
      <Stats />
      <Footer />
    </>
  );
}
