import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import TitleHero from "@/components/ui/TitleHero";
import CtaBand from "@/components/ui/CtaBand";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import {
  BreadcrumbSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import {
  SAFARI_TYPES,
  getSafariType,
  getSafariTypesByGroup,
  type SafariTypeConfig,
} from "@/lib/data/safariTypes";
import TwoQuestionsImage from "@/components/safari-types/TwoQuestionsImage";
import SafariTypeCard from "@/components/safaris/SafariTypeCard";
import { AnimatedHeading } from "@/components/ui/Heading";
import { buildAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "safariTypes" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords:
      "safari types, types of safari, photographic safari, walking safari, water based safari, night safari, birding safari, family safari, solo safari, small group safari, honeymoon safari, private safari, gorilla trekking safari, big five safari, great migration safari, luxury safari, beach and bush safari east africa",
    alternates: buildAlternates(locale, "/safari-types"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
    },
  };
}

function GroupSection({
  eyebrow,
  textBefore,
  textAfter,
  highlightedText,
  description,
  types,
  bg,
  exploreLabel,
}: {
  eyebrow: string;
  textBefore: string;
  textAfter?: string;
  highlightedText: string;
  description: string;
  types: SafariTypeConfig[];
  bg?: string;
  exploreLabel: string;
}) {
  if (types.length === 0) return null;

  return (
    <section className={bg ?? "bg-bone-bg"} style={{ padding: "96px 0" }}>
      <div className="container-site">
        <div className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                {eyebrow}
              </div>
            </Reveal>

            {/* Heading — character pull-up */}
            <AnimatedHeading
              as="h2"
              textBefore={textBefore}
              highlightedText={highlightedText}
              textAfter={textAfter}
            />
          </div>
          <Reveal variant="fadeUp">
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              {description}
            </p>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
          {types.map((t, i) => (
            <RevealItem key={t.slug}>
              <SafariTypeCard
                type={t}
                priority={i < 3}
                exploreLabel={exploreLabel}
              />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const COMBOS = [
  { activity: "walking", traveller: "family" },
  { activity: "wildlife-game-viewing", traveller: "family" },
  { activity: "adventure", traveller: "budget-group" },
  { activity: "cultural", traveller: "budget-group" },
];

export default async function SafariTypesIndexPage() {
  const t = await getTranslations("safariTypes");
  const activityTypes = getSafariTypesByGroup("activity");
  const travellerTypes = getSafariTypesByGroup("traveller");
  const themeTypes = getSafariTypesByGroup("theme");
  const combineItems = t.raw("combine.items") as string[];
  const exploreLabel = t("explore");
  const validCombos = COMBOS.map((combo, idx) => ({
    idx,
    a: getSafariType(combo.activity),
    tt: getSafariType(combo.traveller),
  })).filter(
    (c): c is { idx: number; a: SafariTypeConfig; tt: SafariTypeConfig } =>
      !!c.a && !!c.tt
  );

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/safari-types" },
        ]}
      />
      <CollectionPageSchema
        name={t("meta.collectionName")}
        description={t("meta.collectionDescription")}
        url="https://divinetravelnestsafaris.com/safari-types"
        items={SAFARI_TYPES.map((type) => ({
          name: type.label,
          url: `https://divinetravelnestsafaris.com/safari-types/${type.slug}`,
          description: type.cardDescription,
        }))}
      />

      <TitleHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.titleBefore")}
        accent={t("hero.titleEm")}
        description={t("hero.description")}
        backgroundImage="/patterns/sunset.svg"
      />
      {/* <CtaBand
        variant="large"
        buttonHref="/contact"
        heading={
          <>
            {t("cta.headingBefore")}{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>{t("cta.headingEm")}</em>
            {t("cta.headingAfter")}
          </>
        }
        description={t("cta.description")}
        buttonText={t("cta.buttonText")}
      /> */}

      {/* ── Understanding safari types ──────────────────────────────────── */}
      <section className="bg-bone-paper" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd border-b border-[rgba(31,29,24,0.14)] mb-14 pb-12 ">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-14">
            <Reveal variant="slideRight">
              <div>
                <p className="text-[16px] leading-[1.75] text-bone-muted mb-4">
                  {t("intro.paragraph1")}
                </p>
                <p className="text-[16px] leading-[1.75] text-bone-muted">
                  {t("intro.paragraph2")}
                </p>
              </div>
            </Reveal>

            <TwoQuestionsImage />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Reveal variant="fadeUp">
              <div
                className="h-full flex flex-col"
                style={{
                  padding: "32px",
                  background: "var(--bg)",
                  border: "1px solid rgba(31,29,24,0.14)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: "var(--clay)" }}
                >
                  {t("intro.box1.label")}
                </div>
                <h3 className="font-serif text-[24px] font-normal leading-tight text-bone-ink mb-3">
                  {t("intro.box1.heading")}
                </h3>
                <p className="text-[14px] leading-[1.65] text-bone-muted">
                  {t("intro.box1.body")}
                </p>
              </div>
            </Reveal>
            <Reveal variant="fadeUp" delay={0.1}>
              <div
                className="h-full flex flex-col"
                style={{
                  padding: "32px",
                  background: "var(--bg)",
                  border: "1px solid rgba(31,29,24,0.14)",
                }}
              >
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mb-3"
                  style={{ color: "var(--clay)" }}
                >
                  {t("intro.box2.label")}
                </div>
                <h3 className="font-serif text-[24px] font-normal leading-tight text-bone-ink mb-3">
                  {t("intro.box2.heading")}
                </h3>
                <p className="text-[14px] leading-[1.65] text-bone-muted">
                  {t("intro.box2.body")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <GroupSection
        eyebrow={t("activityGroup.eyebrow")}
        textBefore={t("activityGroup.textBefore")}
        highlightedText={t("activityGroup.highlightedText")}
        description={t("activityGroup.description")}
        types={activityTypes}
        exploreLabel={exploreLabel}
      />

      <GroupSection
        eyebrow={t("travellerGroup.eyebrow")}
        textAfter={t("travellerGroup.textAfter")}
        textBefore={t("travellerGroup.textBefore")}
        highlightedText={t("travellerGroup.highlightedText")}
        description={t("travellerGroup.description")}
        types={travellerTypes}
        bg="bg-bone-paper"
        exploreLabel={exploreLabel}
      />

      <GroupSection
        eyebrow={t("themeGroup.eyebrow")}
        textBefore={t("themeGroup.textBefore")}
        highlightedText={t("themeGroup.highlightedText")}
        textAfter={t("themeGroup.textAfter")}
        description={t("themeGroup.description")}
        types={themeTypes}
        exploreLabel={exploreLabel}
      />

      {/* ── How they combine ────────────────────────────────────────────── */}
      {validCombos.length > 0 && (
      <section className="bg-bone-bg" style={{ padding: "96px 0" }}>
        <div className="container-site">
          <div className="section-hd">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("combine.eyebrow")}
                </div>
              </Reveal>

              {/* Heading — character pull-up */}
              <AnimatedHeading
                as="h1"
                textBefore={t("combine.headingBefore")}
                highlightedText={t("combine.headingHighlight")}
              />
            </div>
            <Reveal variant="fadeUp">
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("combine.lead")}
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {validCombos.map(({ idx, a, tt }) => {
              return (
                <RevealItem key={`${a.slug}-${tt.slug}`}>
                  <div
                    className="flex flex-col h-full p-7"
                    style={{
                      background: "var(--paper)",
                      border: "1px solid rgba(31,29,24,0.14)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Link
                        href={`/safari-types/${a.slug}`}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 text-white transition-opacity hover:opacity-85"
                        style={{ background: "var(--clay, #9d4519)" }}
                      >
                        {a.shortLabel}
                      </Link>
                      <span className="text-bone-muted text-sm">+</span>
                      <Link
                        href={`/safari-types/${tt.slug}`}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 text-white transition-opacity hover:opacity-85"
                        style={{ background: "var(--forest, #2a3a2a)" }}
                      >
                        {tt.shortLabel}
                      </Link>
                    </div>
                    <p className="text-[14px] leading-[1.65] text-bone-muted">
                      {combineItems[idx]}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </Stagger>
        </div>
      </section>
      )}
    </>
  );
}
