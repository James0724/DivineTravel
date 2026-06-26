import { getTranslations } from "next-intl/server";
import PageHero from "@/components/ui/PageHero";
import WhyGrid from "@/components/ui/WhyGrid";
import SectionFaq from "@/components/ui/SectionFaq";
import CtaBand from "@/components/ui/CtaBand";
import AccommodationCard from "@/components/accommodations/AccommodationCard";
import Reveal from "@/components/ui/Reveal";
import { AnimatedHeading } from "@/components/ui/Heading";
import type { LocalizedAccommodationType } from "@/lib/data/accommodationTypes";
import type { Accommodation } from "@/types";

interface Props {
  config: LocalizedAccommodationType;
  properties: Accommodation[];
}

export default async function AccommodationTypePage({
  config,
  properties,
}: Props) {
  const t = await getTranslations("accommodations");

  return (
    <>
      <PageHero
        image={config.heroImage}
        imageAlt={config.heroImageAlt}
        minHeight="min-h-[48vh]"
        breadcrumbs={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbCurrent"), href: "/accommodations" },
          { label: config.label },
        ]}
        eyebrow={t("typePage.hero.eyebrow")}
        title={
          <>
            {config.shortLabel}{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              {t("typePage.hero.titleSuffix")}
            </em>
            .
          </>
        }
        description={config.heroDescription}
      />
      <CtaBand
        variant="large"
        buttonHref="/contact"
        heading={
          <>
            {t("typePage.cta.headingBefore")}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
              {t("typePage.cta.headingHighlight")}
            </em>
            {t("typePage.cta.headingAfter")}
          </>
        }
        description={t("typePage.cta.description")}
        buttonText={t("typePage.cta.buttonText")}
      />

      {/* ── Intro ───────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd border-b border-[rgba(31,29,24,0.14)] mb-14 pb-12">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("typePage.intro.eyebrow")}
                </div>
              </Reveal>
              <AnimatedHeading
                as="h2"
                textBefore={config.intro.headingBefore}
                highlightedText={config.intro.headingHighlight}
                textAfter={config.intro.headingAfter}
              />
            </div>
            <Reveal>
              <p
                className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]"
                style={{ maxWidth: "62ch" }}
              >
                {config.intro.body}
              </p>
            </Reveal>
          </div>

          <div className="mt-10">
            <Reveal variant="fadeUp" delay={0.1}>
              <div
                style={{
                  padding: "28px 32px",
                  background: "var(--bg-deep, rgba(31,29,24,0.04))",
                  border: "1px dashed rgba(31,29,24,0.22)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-4"
                  style={{ color: "var(--clay)" }}
                >
                  {t("typePage.intro.goodToKnowLabel")}
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {config.goodToKnow.map((tip) => (
                    <li
                      key={tip}
                      className="text-[13px] leading-[1.6] text-bone-muted"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WhyGrid
        eyebrow={t("typePage.whatToExpect.eyebrow")}
        textBefore={`${t("typePage.whatToExpect.headingBefore")} ${config.shortLabel.toLowerCase()} `}
        highlightedText={t("typePage.whatToExpect.headingHighlight")}
        textAfter={t("typePage.whatToExpect.headingAfter")}
        description={t("typePage.whatToExpect.description")}
        items={config.whatToExpect}
      />

      {/* ── Partner properties ─────────────────────────────────────────── */}
      <section style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {config.label} {t("typePage.properties.eyebrowSuffix")}
                </div>
              </Reveal>
              <AnimatedHeading
                as="h2"
                textBefore={t("typePage.properties.headingBefore")}
                highlightedText={t("typePage.properties.headingHighlight")}
                textAfter={t("typePage.properties.headingAfter")}
              />
            </div>
            <Reveal>
              <p
                className="text-sm leading-[1.65] text-bone-muted"
                style={{ maxWidth: "56ch" }}
              >
                {t("typePage.properties.lead")}
              </p>
            </Reveal>
          </div>

          {properties.length === 0 ? (
            <p className="text-sm text-bone-muted py-8">
              {t("typePage.properties.noneBefore")}
              {config.label.toLowerCase()}
              {t("typePage.properties.noneAfter")}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {properties.map((property, i) => (
                <AccommodationCard
                  key={String(property._id)}
                  property={property}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionFaq
        eyebrow={`${t("typePage.faqs.eyebrowPrefix")} ${config.label}`}
        textBefore={t("typePage.faqs.headingBefore")}
        highlightedText={t("typePage.faqs.headingHighlight")}
        textAfter={t("typePage.faqs.headingAfter")}
        contactNote={
          <>
            {t("typePage.faqs.contactPrefix")}{" "}
            <a href="tel:+254722595916" className="text-bone-clay">
              +254 722-595-916
            </a>{" "}
            {t("typePage.faqs.contactSuffix")}
          </>
        }
        faqs={config.faqs}
      />
    </>
  );
}
