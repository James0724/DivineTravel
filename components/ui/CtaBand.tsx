import Reveal from "@/components/ui/Reveal";
import SiteLink from "@/components/ui/SiteLink";

interface CtaBandProps {
  heading: React.ReactNode;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  /**
   * 'default' — compact, clay button (used on destination pages)
   * 'large'   — full-width, asymmetric grid, paper button with clay arrow (used on safari pages)
   */
  variant?: "default" | "large";
}

export default function CtaBand({
  heading,
  description,
  buttonText = "Request a free quote →",
  buttonHref = "/contact",
  variant = "default",
}: CtaBandProps) {
  if (variant === "large") {
    return (
      <section className="bg-bone-forest text-bone-paper py-8 sm:py-10">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16  items-center">
            <Reveal variant="fadeUp">
              <h2
                className="font-serif font-light leading-[0.98] tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(44px, 5.5vw, 84px)",
                  maxWidth: "15ch",
                }}
              >
                {heading}
              </h2>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
              <div>
                <p
                  className="text-[15px] leading-[1.7]"
                  style={{ opacity: 0.8, maxWidth: "38ch" }}
                >
                  {description}
                </p>
                <SiteLink href={buttonHref} variant="paper" size="lg" className="mt-6">
                  {buttonText}
                </SiteLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 bg-bone-forest text-bone-paper">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal variant="fadeUp">
            <h2
              className="font-serif font-light leading-[1.0] tracking-[-0.02em]"
              style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
            >
              {heading}
            </h2>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <div>
              <p className="text-bone-paper/65 text-base font-sans leading-relaxed mb-7">
                {description}
              </p>
              <SiteLink href={buttonHref} variant="paper" size="md" arrow={false}>
                {buttonText}
              </SiteLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
