import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "@/hooks/useLenis";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollControls } from "@/components/ui/ScrollControls";
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio Nova — Brand, Web & Motion Design Studio" },
      {
        name: "description",
        content:
          "Studio Nova is an independent creative studio crafting award-winning brands, websites and digital products with an obsession for motion and detail.",
      },
      { property: "og:title", content: "Studio Nova — Creative Design Studio" },
      {
        property: "og:description",
        content:
          "Award-winning brand, web and motion design. Editorial design meets engineering precision.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <div className="relative bg-background">
      <ScrollControls />
      <Navbar />
      <main>
        <HeroSection />
        <IntroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <ProcessSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
