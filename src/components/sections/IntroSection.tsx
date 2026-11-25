import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSection } from "@/lib/cms/context";

export function IntroSection() {
  const content = useSection("studio");
  const words = content.title.split(/\s+/).filter(Boolean);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.25"] });
  return (
    <section id="studio" className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 sm:py-36">
      <SectionHeading index="02" label={content.label} />
      <div ref={ref} className="mt-10"><p className="display-xl flex flex-wrap text-balance">
        {words.map((word, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{word}</Word>)}
      </p></div>
    </section>
  );
}
function Word({ children, progress, range }: { children: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <span className="mr-[0.25em] inline-block"><motion.span style={{ opacity }} className="inline-block">{children}</motion.span></span>;
}
