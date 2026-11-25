import { RevealText } from "@/components/ui/RevealText";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSection, useContent } from "@/lib/cms/context";
import { safeHref } from "@/lib/cms/content";



export function Footer() {
  const site = useContent().settings;
  const social = useSection("socials");
  const SOCIALS = social.enabled ? social.items : [];
  const email = site["email"] ?? "";
  return (
    <footer id="contact" className="border-t border-border bg-background">
      <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading index="07" label="Contact" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <RevealText
              as="h2"
              text={site["contactTitle"] ?? ""}
              serifWords={[4, 5]}
              className="display-xl max-w-3xl"
            />
            <div className="mt-10">
              <AnimatedButton href={`mailto:${email}`}>
                {email}
              </AnimatedButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 self-end text-sm">
            <div>
              <p className="eyebrow text-muted-foreground">Studio</p>
              <p className="mt-3 leading-relaxed text-foreground/80">
                <span className="whitespace-pre-line">{site["address"]}</span>
              </p>
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Social</p>
              <ul className="mt-3 space-y-2">
                {SOCIALS.map((s, i) => (
                  <li key={(s["label"] ?? "") + i}>
                    <a
                      href={safeHref(s["href"] ?? "#")}
                      className="link-underline text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {s["label"]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site["name"]}. All rights reserved.</p>
          <p>{site["footer"]}</p>
        </div>
      </div>
    </footer>
  );
}