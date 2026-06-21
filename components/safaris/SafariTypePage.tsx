import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import WhyGrid from "@/components/ui/WhyGrid";
import SectionFaq from "@/components/ui/SectionFaq";
import CtaBand from "@/components/ui/CtaBand";
import PkgCard from "@/components/safaris/PkgCard";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { getSafariType, type SafariTypeConfig } from "@/lib/data/safariTypes";
import type { Safari } from "@/types";

interface Props {
  config: SafariTypeConfig;
  safaris: Safari[];
}

export default function SafariTypePage({ config, safaris }: Props) {
  return (
    <>
      <PageHero
        image={config.heroImage}
        imageAlt={config.heroImageAlt}
        minHeight="min-h-[48vh]"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Safari Types", href: "/safari-types" },
          { label: config.label },
        ]}
        eyebrow="Safari Type"
        title={
          <>
            {config.shortLabel}{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>Safari</em>.
          </>
        }
        description={config.heroDescription}
      />

      {/* ── Intro / what is it + best for ─────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14 lg:gap-20">
          <Reveal variant="fadeUp">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                What is it
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-5"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                {config.intro.heading}
              </h2>
              <p
                className="text-[16px] leading-[1.7] text-bone-muted"
                style={{ maxWidth: "56ch" }}
              >
                {config.intro.body}
              </p>
            </div>
          </Reveal>
          <Reveal variant="fadeUp" delay={0.1}>
            <div
              style={{
                padding: "32px",
                background: "var(--paper)",
                border: "1px solid rgba(31,29,24,0.14)",
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-5" style={{ color: "var(--muted)" }}>
                Best for
              </div>
              <ul>
                {config.bestFor.map((point, i) => (
                  <li
                    key={point}
                    className="py-3 pl-6 relative text-[14px] leading-[1.5]"
                    style={{
                      borderTop: i === 0 ? "none" : "1px solid rgba(31,29,24,0.1)",
                      color: "var(--ink)",
                    }}
                  >
                    <span className="absolute left-0 top-3" style={{ color: "var(--clay)" }}>
                      ›
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="container-site mt-10">
          <Reveal variant="fadeUp" delay={0.15}>
            <div
              style={{
                padding: "28px 32px",
                background: "var(--bg-deep, rgba(31,29,24,0.04))",
                border: "1px dashed rgba(31,29,24,0.22)",
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] mb-4" style={{ color: "var(--clay)" }}>
                Good to know
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {config.goodToKnow.map((tip) => (
                  <li key={tip} className="text-[13px] leading-[1.6] text-bone-muted">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <WhyGrid
        eyebrow="What to expect"
        heading={
          <>
            Inside a {config.shortLabel.toLowerCase()}{" "}
            <em className="italic text-bone-clay">experience</em>.
          </>
        }
        description="Every itinerary is tailor-made, but here's the shape of what's typically included with this style of safari."
        items={config.whatToExpect}
      />

      {/* ── Matching packages ──────────────────────────────────────────────── */}
      <section style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                {config.label} packages
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(36px, 4.8vw, 64px)" }}
              >
                Packages built this <em className="italic text-bone-clay">way</em>.
              </h2>
            </div>
            <p className="text-sm leading-[1.65] text-bone-muted" style={{ maxWidth: "56ch" }}>
              A starting point — every trip is tailored to your dates, budget and party size.
            </p>
          </div>

          {safaris.length === 0 ? (
            <p className="text-sm text-bone-muted py-8">
              No {config.label.toLowerCase()} packages published yet — tell us what you have in mind and we&apos;ll build one.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {safaris.map((safari, i) => (
                <PkgCard key={String(safari._id)} safari={safari} index={i} />
              ))}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link href={`/safaris?safariType=${config.slug}`} className="btn-forest">
              View all {config.label.toLowerCase()} packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pairs well with ──────────────────────────────────────────────── */}
      {config.pairsWith.length > 0 && (
        <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
          <div className="container-site">
            <Reveal>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Compare & combine
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-4"
                style={{ fontSize: "clamp(32px, 4.2vw, 52px)" }}
              >
                {config.shortLabel} pairs well <em className="italic text-bone-clay">with</em>.
              </h2>
              <p className="text-sm leading-[1.65] text-bone-muted mb-12" style={{ maxWidth: "56ch" }}>
                Most itineraries blend more than one activity or traveller type. Here are a few that
                combine naturally with {config.shortLabel.toLowerCase()}.
              </p>
            </Reveal>

            <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              {config.pairsWith
                .map((slug) => getSafariType(slug))
                .filter((t): t is SafariTypeConfig => !!t)
                .map((t) => (
                  <RevealItem key={t.slug}>
                    <Link
                      href={`/safari-types/${t.slug}`}
                      className="group flex flex-col h-full bg-bone-bg border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
                    >
                      <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "3/2" }}>
                        <Image
                          src={t.heroImage}
                          alt={t.heroImageAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        />
                        <div
                          className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.14em] px-2.5 py-1 text-white"
                          style={{ background: t.group === "activity" ? "var(--clay, #9d4519)" : "var(--forest, #2a3a2a)" }}
                        >
                          {t.group === "activity" ? "Activity" : "Traveller"}
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="font-serif text-[18px] font-normal leading-[1.2] text-bone-ink mb-2">
                          {t.label}
                        </h3>
                        <p className="text-[13px] leading-[1.5] text-bone-muted line-clamp-2">
                          {t.cardDescription}
                        </p>
                      </div>
                    </Link>
                  </RevealItem>
                ))}
            </Stagger>
          </div>
        </section>
      )}

      <SectionFaq
        eyebrow={`FAQs · ${config.label}`}
        heading={
          <>
            Before you <em className="italic text-bone-clay">book</em>.
          </>
        }
        contactNote={
          <>
            Call us for more information at{" "}
            <a href="tel:+254722595916" className="text-bone-clay">
              +254 722-595-916
            </a>{" "}
            — we pick up.
          </>
        }
        faqs={config.faqs}
      />

      <CtaBand
        variant="large"
        buttonHref="/contact"
        heading={
          <>
            Let&apos;s build your {config.shortLabel.toLowerCase()}{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>safari</em>.
          </>
        }
        description="Tell us your budget, dates and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour."
        buttonText="Get your free quote"
      />
    </>
  );
}
