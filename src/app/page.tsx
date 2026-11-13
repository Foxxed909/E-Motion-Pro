import { Preloader } from "@/components/landing/Preloader";
import { Hero } from "@/components/landing/Hero";
import { VelocityBand } from "@/components/landing/VelocityBand";
import { Manifesto } from "@/components/landing/Manifesto";
import { Featured } from "@/components/landing/Featured";
import { GenreIndex } from "@/components/landing/GenreIndex";
import { TypeShowcase } from "@/components/landing/TypeShowcase";
import { Wall } from "@/components/landing/Wall";
import { Workflow } from "@/components/landing/Workflow";
import { Engine } from "@/components/landing/Engine";
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
      <Wall />
      <Engine />
      <TypeShowcase />
      <Workflow />
      <Stats />
      <Footer />
    </>
  );
}
