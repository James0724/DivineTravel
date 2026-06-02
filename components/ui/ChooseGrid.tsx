import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";

export interface ChooseCell {
  want: string;
  go: string;
}

interface ChooseGridProps {
  id?: string;
  eyebrow: string;
  heading: React.ReactNode;
  description: string;
  cells: ChooseCell[];
  /** Optional content below the grid (e.g. a CTA link) */
  actions?: React.ReactNode;
  /** Tailwind bg for section — defaults to bone-bg */
  bg?: string;
  /** Render the `go` value with first word in italic clay, rest normal */
  splitGo?: boolean;
}

export default function ChooseGrid({
  id,
  eyebrow,
  heading,
  description,
  cells,
  actions,
  bg = "bg-bone-bg",
  splitGo = true,
}: ChooseGridProps) {
  return (
    <section id={id} className={bg} style={{ padding: "120px 0" }}>
      <Reveal>
        <div className="section-hd">
          <div>
            <div className="eyebrow mb-4">
              <span className="dot" />
              {eyebrow}
            </div>
            <h2
              className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
              style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
            >
              {heading}
            </h2>
          </div>
          <p
            className="text-[15px] leading-[1.65] text-bone-muted"
            style={{ maxWidth: "56ch" }}
          >
            {description}
          </p>
        </div>
      </Reveal>

      <Stagger
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(31,29,24,0.14)]"
        style={{ border: "1px solid rgba(31,29,24,0.14)" }}
      >
        {cells.map((c) => {
          const parts = c.go.split(" ");
          return (
            <RevealItem
              key={c.want}
              className="bg-bone-bg hover:bg-bone-paper transition-colors"
              style={{ padding: "30px 26px" }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-3">
                {c.want}
              </div>
              <div
                className="font-serif leading-[1.1] tracking-[-0.01em] text-bone-ink"
                style={{ fontSize: "26px" }}
              >
                {splitGo && parts.length > 1 ? (
                  <>
                    <em className="italic text-bone-clay">{parts[0]}</em>{" "}
                    {parts.slice(1).join(" ")}
                  </>
                ) : (
                  <em className="italic text-bone-clay">{c.go}</em>
                )}
              </div>
            </RevealItem>
          );
        })}
      </Stagger>
      {actions}
    </section>
  );
}
