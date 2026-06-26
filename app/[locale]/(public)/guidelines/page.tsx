import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Reveal from "@/components/ui/Reveal";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";
import { buildAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guidelines" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: buildAlternates(locale, "/guidelines"),
  };
}

const sectionIds = [
  "who",
  "wildlife",
  "communities",
  "groupEtiquette",
  "lodgeConduct",
  "photography",
  "comments",
  "safety",
  "reporting",
  "updates",
] as const;

export default async function GuidelinesPage() {
  const t = await getTranslations("guidelines");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/guidelines" },
        ]}
      />

      <PageHero
        image="https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Travellers on a guided safari in East Africa"
        minHeight="min-h-[44vh]"
        imageOpacity={0.28}
        breadcrumbs={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbCurrent"), href: "/guidelines" },
        ]}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.titleMain")}{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              {t("hero.titleEm")}
            </em>
          </>
        }
        description={t("hero.description")}
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 lg:gap-20 items-start">
            {/* ── Left: Table of contents ─────────────────────────────── */}
            <Reveal variant="fadeUp">
              <div
                className="lg:sticky lg:top-8 bg-bone-paper rounded-sm"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{ borderColor: "rgba(31,29,24,0.1)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-muted">
                    {t("toc.contents")}
                  </span>
                </div>
                <nav className="px-6 py-4">
                  <ul className="space-y-0.5">
                    {sectionIds.map((id, i) => (
                      <li key={id}>
                        <a
                          href={`#${id}`}
                          className="flex items-center gap-2.5 py-1.5 text-[13px] text-bone-muted hover:text-bone-ink transition-colors group"
                        >
                          <span className="font-mono text-[10px] text-bone-clay opacity-80 flex-shrink-0 w-5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {t(`sections.${id}.label`)}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div
                  className="px-6 py-4 border-t"
                  style={{ borderColor: "rgba(31,29,24,0.1)" }}
                >
                  <p className="text-[12px] text-bone-muted leading-[1.6]">
                    {t("toc.lastUpdated")}{" "}
                    <span className="text-bone-ink font-medium">{t("toc.lastUpdatedDate")}</span>
                  </p>
                  <p className="text-[12px] text-bone-muted mt-1 leading-[1.6]">
                    {t("toc.questions")}{" "}
                    <Link href="/contact" className="text-bone-clay hover:underline">
                      {t("toc.contactUs")}
                    </Link>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── Right: Guidelines content ─────────────────────────────── */}
            <div className="min-w-0">
              <Reveal variant="fadeUp">
                <div
                  className="mb-14 pb-14 border-b"
                  style={{ borderColor: "rgba(31,29,24,0.14)" }}
                >
                  <div
                    className="bg-bone-paper rounded-sm px-7 py-6"
                    style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                  >
                    <p className="font-serif italic text-[19px] leading-[1.55] text-bone-ink">
                      {t("intro")}
                    </p>
                  </div>
                </div>
              </Reveal>

              <GuideSection id="who" number="01" heading={t("sections.who.heading")}>
                <p>{t("sections.who.body")}</p>
              </GuideSection>

              <GuideSection id="wildlife" number="02" heading={t("sections.wildlife.heading")}>
                <p>{t("sections.wildlife.intro")}</p>
                <GuideList items={t.raw("sections.wildlife.items") as string[]} />
              </GuideSection>

              <GuideSection id="communities" number="03" heading={t("sections.communities.heading")}>
                <p>{t("sections.communities.intro")}</p>
                <GuideList items={t.raw("sections.communities.items") as string[]} />
              </GuideSection>

              <GuideSection id="group-etiquette" number="04" heading={t("sections.groupEtiquette.heading")}>
                <p>{t("sections.groupEtiquette.intro")}</p>
                <GuideList items={t.raw("sections.groupEtiquette.items") as string[]} />
              </GuideSection>

              <GuideSection id="lodge-conduct" number="05" heading={t("sections.lodgeConduct.heading")}>
                <p>{t("sections.lodgeConduct.body")}</p>
              </GuideSection>

              <GuideSection id="photography" number="06" heading={t("sections.photography.heading")}>
                <p>{t("sections.photography.body")}</p>
              </GuideSection>

              <GuideSection id="comments" number="07" heading={t("sections.comments.heading")}>
                <p>
                  {t.rich("sections.comments.intro", {
                    link: (chunks) => (
                      <Link href="/journal" className="text-bone-clay hover:underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <GuideList items={t.raw("sections.comments.items") as string[]} />
                <p>{t("sections.comments.outro")}</p>
              </GuideSection>

              <GuideSection id="safety" number="08" heading={t("sections.safety.heading")}>
                <p>{t("sections.safety.body")}</p>
              </GuideSection>

              <GuideSection id="reporting" number="09" heading={t("sections.reporting.heading")}>
                <p>
                  {t.rich("sections.reporting.body", {
                    link: (chunks) => (
                      <Link href="/contact" className="text-bone-clay hover:underline">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </GuideSection>

              <GuideSection id="updates" number="10" heading={t("sections.updates.heading")} isLast>
                <p>{t("sections.updates.body")}</p>
              </GuideSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function GuideSection({
  id,
  number,
  heading,
  children,
  isLast = false,
}: {
  id: string;
  number: string;
  heading: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <Reveal variant="fadeUp">
      <section
        id={id}
        className={`mb-14 pb-14 scroll-mt-8 ${!isLast ? "border-b" : ""}`}
        style={!isLast ? { borderColor: "rgba(31,29,24,0.14)" } : undefined}
      >
        <div className="flex items-baseline gap-4 mb-5">
          <span className="font-mono text-[11px] text-bone-clay tracking-[0.1em] flex-shrink-0">
            {number}
          </span>
          <h2
            className="font-serif font-normal text-bone-ink leading-[1.1] tracking-[-0.015em]"
            style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}
          >
            {heading}
          </h2>
        </div>
        <div className="pl-9 space-y-4 text-sm leading-[1.75] text-bone-muted">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

function GuideList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="flex-shrink-0 mt-[0.6em] w-1 h-1 rounded-full bg-bone-clay"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
