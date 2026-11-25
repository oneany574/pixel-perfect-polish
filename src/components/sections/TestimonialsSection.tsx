import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealText } from "@/components/ui/RevealText";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSection } from "@/lib/cms/context";

export function TestimonialsSection() {
  const content = useSection("recognition");
  const awards = useSection("awards");
  const QUOTES = content.items.map((i) => ({ quote: i["quote"] ?? "", name: i["name"] ?? "", role: i["role"] ?? "" }));
  const RECOGNITION = awards.enabled ? awards.items.map((i) => ({ award: i["award"] ?? "", detail: i["detail"] ?? "" })) : [];
  return (
    <section
      id="recognition"
      className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading index="06" label={content.label} />
      <RevealText
        as="h2"
        text={content.title}
        serifWords={[1]}
        className="display-xl mt-6"
      />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="mt-16 grid gap-8 lg:grid-cols-3"
      >
        {QUOTES.map((q) => (
          <motion.figure
            key={q.name + q.quote}
            variants={fadeUp}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8"
          >
            <blockquote className="font-display text-xl leading-snug tracking-tight">
              “{q.quote}”
            </blockquote>
            <figcaption className="mt-10">
              <p className="font-medium">{q.name}</p>
              <p className="text-sm text-muted-foreground">{q.role}</p>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>

      <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {RECOGNITION.map((r) => (
          <div key={r.award + r.detail} className="bg-background p-8">
            <p className="font-display text-lg font-medium">{r.award}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}