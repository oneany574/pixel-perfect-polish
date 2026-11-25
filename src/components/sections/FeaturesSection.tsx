import { motion } from "framer-motion";
import { Compass, Layers, Sparkles, Wand2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSection } from "@/lib/cms/context";
const ICONS = { Compass, Layers, Sparkles, Wand2 };

export function FeaturesSection() {
  const content = useSection("capabilities");
  const SERVICES = content.items.map((i) => ({ icon: ICONS[i["icon"] as keyof typeof ICONS] ?? Sparkles, title: i["title"] ?? "", desc: i["desc"] ?? "" }));
  return (
    <section className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading index="03" label={content.label} />
          <h2 className="display-xl mt-6 max-w-[12ch]">{content.title}</h2>
        </div>
        <p className="max-w-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
      >
        {SERVICES.map((s) => (
          <motion.div
            key={s.title + s.desc}
            variants={fadeUp}
            className="group relative bg-background p-8 transition-colors duration-500 hover:bg-card lg:p-10"
          >
            <s.icon className="h-7 w-7 text-clay transition-transform duration-500 group-hover:-translate-y-1" />
            <h3 className="mt-16 font-display text-xl font-medium tracking-tight">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}