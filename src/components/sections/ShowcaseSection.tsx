import { AnimatedCard, type WorkItem } from "@/components/ui/AnimatedCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealText } from "@/components/ui/RevealText";
import { useSection } from "@/lib/cms/context";

export function ShowcaseSection() {
  const content = useSection("work");
  const WORK: WorkItem[] = content.items.map((i) => ({ title: i["title"] ?? "", category: i["category"] ?? "", year: i["year"] ?? "", image: i["image"] ?? "" }));
  return (
    <section id="work" className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 sm:py-32">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeading index="04" label={content.label} />
          <RevealText
            as="h2"
            text={content.title}
            serifWords={[1]}
            className="display-xl mt-6"
          />
        </div>
        <p className="max-w-sm text-muted-foreground">
          {content.description}
        </p>
      </div>

      <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2">
        {WORK.map((item, i) => (
          <AnimatedCard
            key={item.title + i}
            item={item}
            index={i}
            className={i % 2 === 1 ? "sm:mt-24" : ""}
          />
        ))}
      </div>
    </section>
  );
}