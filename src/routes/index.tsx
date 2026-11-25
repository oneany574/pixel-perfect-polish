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
import { ContentContext } from "@/lib/cms/context";
import { getPublishedContent } from "@/lib/cms/cms.functions";
import { section } from "@/lib/cms/content";

export const Route = createFileRoute("/")({
  loader: () => getPublishedContent(),
  head: ({ loaderData }) => {
    const title = loaderData?.settings.title ?? "Studio Nova — Creative Design Studio";
    const description = loaderData?.settings.description ?? "Independent brand, web and motion design studio.";
    const image = loaderData ? section(loaderData, "hero").fields.image : undefined;
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ] };
  },
  component: Index,
});

function Index() {
  useLenis();
  const content = Route.useLoaderData();
  const on = (key: string) => section(content, key).enabled;
  return (
    <ContentContext.Provider value={content}>
    <div className="relative bg-background">
      <ScrollControls />
      <Navbar />
      <main>
        {on("hero") && <HeroSection />}
        {on("studio") && <IntroSection />}
        {on("capabilities") && <FeaturesSection />}
        {on("work") && <ShowcaseSection />}
        {on("process") && <ProcessSection />}
        {on("recognition") && <TestimonialsSection />}
        {on("cta") && <CTASection />}
      </main>
      <Footer />
    </div>
    </ContentContext.Provider>
  );
}
