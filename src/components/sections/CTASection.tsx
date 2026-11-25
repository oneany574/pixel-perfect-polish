import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useSection } from "@/lib/cms/context";

export function CTASection() {
  const content = useSection("cta");
  const MARQUEE = content.items.map((i) => i["text"] ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["2%", "-22%"]);

  return (
    <section ref={ref} className="overflow-hidden bg-primary py-24 text-primary-foreground sm:py-32">
      <motion.div
        style={{ x: x1 }}
        className="flex w-max items-center gap-8 whitespace-nowrap"
        aria-hidden
      >
        {[...MARQUEE, ...MARQUEE].map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-5xl font-medium tracking-tight sm:text-7xl">
              {word}
            </span>
            <span className="text-clay">✦</span>
          </span>
        ))}
      </motion.div>

      <div className="mx-auto mt-20 max-w-[110rem] px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <h2 className="font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            {content.title}
            <br />
            <span className="font-serif italic text-clay">{content.fields["accent"]}</span>
          </h2>
          <AnimatedButton href="#contact" variant="outline" className="border-primary-foreground/30 text-primary-foreground">
            {content.fields["button"]}
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}