import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { AnimatedHeading } from "./Heading";

export interface WhyItem {
  n: string;
  title: React.ReactNode;
  body: string;
}

interface WhyGridProps {
  id?: string;
  eyebrow: string;
  /** Plain heading content — animated with a character pull-up effect */
  textBefore?: string;
  highlightedText?: string;
  textAfter?: string;
  /** Rich heading content — rendered as-is, skips the pull-up animation */
  heading?: React.ReactNode;
  description: string;
  items: WhyItem[];
  /** Tailwind bg for section — defaults to bone-paper */
  bg?: string;
}

export default function WhyGrid({
  id,
  eyebrow,
  textBefore,
  highlightedText,
  textAfter,
  heading,
  description,
  items,
  bg = "bg-bone-paper",
}: WhyGridProps) {
  return (
    <section
      id={id}
      className={bg}
      style={{
        padding: "120px 0",
        borderTop: "1px solid rgba(31,29,24,0.14)",
        borderBottom: "1px solid rgba(31,29,24,0.14)",
      }}
    >
      <div className="container-site">
        <header className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                {eyebrow}
              </div>
            </Reveal>
            {textBefore !== undefined ? (
              <AnimatedHeading
                as="h2"
                textBefore={textBefore}
                highlightedText={highlightedText}
                textAfter={textAfter}
              />
            ) : (
              <h2 className="font-serif font-normal leading-[1.02] tracking-[-0.02em] text-bone-ink">
                {heading}
              </h2>
            )}
          </div>
          <Reveal>
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              {description}
            </p>
          </Reveal>
        </header>

        <Stagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(31,29,24,0.14)]"
          style={{ border: "1px solid rgba(31,29,24,0.14)" }}
        >
          {items.map((w) => (
            <RevealItem
              key={w.n}
              className="bg-bone-bg flex flex-col gap-4"
              style={{ padding: "36px 32px" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-clay">
                {w.n}
              </div>
              <h4
                className="font-serif font-medium leading-[1.05] text-bone-ink"
                style={{ fontSize: "26px" }}
              >
                {w.title}
              </h4>
              <p className="text-[14px] leading-[1.6] text-bone-muted">
                {w.body}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
