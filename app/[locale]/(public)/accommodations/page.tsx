import type { Metadata } from "next";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import SiteLink from "@/components/ui/SiteLink";
import { AnimatedHeading } from "@/components/ui/Heading";
import SectionFaq from "@/components/ui/SectionFaq";
import {
  BreadcrumbSchema,
  CollectionPageSchema,
  FaqSchema,
} from "@/components/seo/StructuredData";
import {
  ACCOMMODATION_TYPES,
  type AccommodationTypeContent,
  type AccommodationTypeConfig,
} from "@/lib/data/accommodationTypes";
import { buildAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "accommodations" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords:
      "safari accommodation booking, book safari lodges, hotel booking east africa, safari lodges east africa, tented camps masai mara, beach resorts diani, zanzibar beach resorts, luxury safari lodges kenya, tanzania lodges booking, gorilla trekking lodges, best safari hotel rates, safari hotel partners",
    alternates: buildAlternates(locale, "/accommodations"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
    },
  };
}

function TypeCard({
  type,
  content,
  priority,
  exploreLabel,
}: {
  type: AccommodationTypeConfig;
  content: AccommodationTypeContent;
  priority?: boolean;
  exploreLabel: string;
}) {
  return (
    <RevealItem>
      <Link
        href={`/accommodations/${type.slug}`}
        className="group flex flex-col h-full bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
      >
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ aspectRatio: "3/2" }}
        >
          <OptimizedImage
            src={type.heroImage}
            alt={content.heroImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            priority={priority}
          />
        </div>
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-serif text-[20px] font-normal leading-[1.2] text-bone-ink mb-3 tracking-[-0.01em]">
            {content.label}
          </h3>
          <p className="text-[13px] leading-[1.6] text-bone-muted mb-5 line-clamp-3">
            {content.cardDescription}
          </p>
          <SiteLink
            variant="ghost-mono"
            size="md"
            arrow
            className="flex-shrink-0"
          >
            {exploreLabel}
          </SiteLink>
        </div>
      </Link>
    </RevealItem>
  );
}

export default async function AccommodationsIndexPage() {
  const t = await getTranslations("accommodations");

  const faqs = t.raw("faqs.items") as { q: string; a: string }[];
  const includes = t.raw("intro.includes") as string[];
  const typeContent = t.raw("types") as Record<string, AccommodationTypeContent>;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/accommodations" },
        ]}
      />
      <CollectionPageSchema
        name={t("meta.collectionName")}
        description={t("meta.collectionDescription")}
        url="https://divinetravelnestsafaris.com/accommodations"
        items={ACCOMMODATION_TYPES.map((type) => ({
          name: typeContent[type.slug].label,
          url: `https://divinetravelnestsafaris.com/accommodations/${type.slug}`,
          description: typeContent[type.slug].cardDescription,
        }))}
      />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <PageHero
        image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1800&q=80"
        imageAlt="Luxury safari lodge suite overlooking the savannah"
        minHeight="min-h-[48vh]"
        breadcrumbs={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbCurrent") },
        ]}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.titleMain")}{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              {t("hero.titleEm")}
            </em>
            .
          </>
        }
        description={t("hero.description")}
      />
      <CtaBand
        variant="large"
        buttonHref="/contact"
        heading={
          <>
            {t("cta.headingBefore")}{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
              {t("cta.headingEm")}
            </em>
            {t("cta.headingAfter")}
          </>
        }
        description={t("cta.description")}
        buttonText={t("cta.buttonText")}
      />

      {/* ── Understanding accommodation & the partnership model ─────────── */}
      <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd border-b border-[rgba(31,29,24,0.14)] mb-14 pb-12">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("intro.eyebrow")}
                </div>
              </Reveal>
              <AnimatedHeading
                as="h1"
                textBefore={t("intro.headingBefore")}
                highlightedText={t("intro.headingHighlight")}
                textAfter={t("intro.headingAfter")}
              />
            </div>
            <Reveal>
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("intro.lead")}
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal variant="slideRight">
              <div>
                <p className="text-[16px] leading-[1.75] text-bone-muted mb-4">
                  {t.rich("intro.paragraph1", {
                    strong: (chunks) => (
                      <strong className="text-bone-ink">{chunks}</strong>
                    ),
                  })}
                </p>
                <p className="text-[16px] leading-[1.75] text-bone-muted">
                  {t("intro.paragraph2")}
                </p>
              </div>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
              <div
                style={{
                  padding: "32px",
                  background: "var(--bg)",
                  border: "1px solid rgba(31,29,24,0.14)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-5"
                  style={{ color: "var(--muted)" }}
                >
                  {t("intro.includesLabel")}
                </div>
                <ul>
                  {includes.map((point, i) => (
                    <li
                      key={point}
                      className="py-3 pl-6 relative text-[14px] leading-[1.5]"
                      style={{
                        borderTop:
                          i === 0 ? "none" : "1px solid rgba(31,29,24,0.1)",
                        color: "var(--ink)",
                      }}
                    >
                      <span
                        className="absolute left-0 top-3"
                        style={{ color: "var(--clay)" }}
                      >
                        ›
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Browse by type ───────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("browse.eyebrow")}
                </div>
              </Reveal>
              <AnimatedHeading
                as="h2"
                textBefore={t("browse.headingBefore")}
                highlightedText={t("browse.headingHighlight")}
                textAfter={t("browse.headingAfter")}
              />
            </div>
            <Reveal variant="fadeUp">
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("browse.lead")}
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
            {ACCOMMODATION_TYPES.map((type, i) => (
              <TypeCard
                key={type.slug}
                type={type}
                content={typeContent[type.slug]}
                priority={i < 3}
                exploreLabel={t("browse.explore")}
              />
            ))}
          </Stagger>
        </div>
      </section>

      <SectionFaq
        eyebrow={t("faqs.eyebrow")}
        textBefore={t("faqs.headingBefore")}
        highlightedText={t("faqs.headingHighlight")}
        textAfter={t("faqs.headingAfter")}
        contactNote={
          <>
            {t("faqs.contactNotePrefix")}{" "}
            <a href="tel:+254722595916" className="text-bone-clay">
              +254 722-595-916
            </a>{" "}
            {t("faqs.contactNoteSuffix")}
          </>
        }
        faqs={faqs}
      />
    </>
  );
}
