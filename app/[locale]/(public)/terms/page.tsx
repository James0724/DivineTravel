import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "terms" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: buildAlternates(locale, "/terms"),
  };
}

const SECTION_IDS = [
  "acceptance",
  "definitions",
  "booking",
  "payment",
  "cancellation-client",
  "cancellation-company",
  "insurance",
  "itinerary",
  "health",
  "wildlife",
  "liability",
  "force-majeure",
  "complaints",
  "privacy",
  "photography",
  "governing-law",
] as const;

export default async function TermsPage() {
  const t = await getTranslations("terms");

  const sections = SECTION_IDS.map((id) => ({
    id,
    label: t(`sections.${id}.label`),
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/terms" },
        ]}
      />

      <PageHero
        image="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1800&q=75"
        imageAlt="Savannah at golden hour, East Africa"
        minHeight="min-h-[44vh]"
        imageOpacity={0.28}
        breadcrumbs={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbCurrent"), href: "/terms" },
        ]}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.titleBefore")}{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>{t("hero.titleEm")}</em>
          </>
        }
        description={t("hero.description")}
      />

      {/* ── Main content area ──────────────────────────────────────────── */}
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
                    {t("toc.contentsLabel")}
                  </span>
                </div>
                <nav className="px-6 py-4">
                  <ul className="space-y-0.5">
                    {sections.map((s, i) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className="flex items-center gap-2.5 py-1.5 text-[13px] text-bone-muted hover:text-bone-ink transition-colors group"
                        >
                          <span className="font-mono text-[10px] text-bone-clay opacity-80 flex-shrink-0 w-5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            {s.label}
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
                    {t("toc.lastUpdatedLabel")}{" "}
                    <span className="text-bone-ink font-medium">{t("toc.lastUpdatedValue")}</span>
                  </p>
                  <p className="text-[12px] text-bone-muted mt-1 leading-[1.6]">
                    {t("toc.questionsLabel")}{" "}
                    <Link
                      href="/contact"
                      className="text-bone-clay hover:underline"
                    >
                      {t("toc.contactUsLink")}
                    </Link>
                  </p>
                </div>
              </div>
            </Reveal>

            {/* ── Right: Terms content ─────────────────────────────────── */}
            <div className="min-w-0">
              {/* Preamble */}
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
                      {t("preamble.lead")}
                    </p>
                    <p className="text-[14px] text-bone-muted mt-3 leading-[1.7]">
                      {t("preamble.note")}
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* 01 — Acceptance of Terms */}
              <TermsSection id="acceptance" number="01" heading={t("sections.acceptance.heading")}>
                <p>{t("sections.acceptance.p1")}</p>
                <p>{t("sections.acceptance.p2")}</p>
              </TermsSection>

              {/* 02 — Definitions */}
              <TermsSection id="definitions" number="02" heading={t("sections.definitions.heading")}>
                <p>{t("sections.definitions.intro")}</p>
                <TermsList
                  items={t.raw("sections.definitions.items") as { term: string; desc: string }[]}
                />
              </TermsSection>

              {/* 03 — Booking & Reservations */}
              <TermsSection id="booking" number="03" heading={t("sections.booking.heading")}>
                <p>{t("sections.booking.p1")}</p>
                <p>{t("sections.booking.p2")}</p>
                <p>{t("sections.booking.p3")}</p>
                <p>{t("sections.booking.p4")}</p>
              </TermsSection>

              {/* 04 — Payment Terms */}
              <TermsSection id="payment" number="04" heading={t("sections.payment.heading")}>
                <p>
                  {t.rich("sections.payment.p1", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>{t("sections.payment.p2")}</p>
                <p>{t("sections.payment.p3Label")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.payment.bullets") as string[]).map((desc) => ({ desc }))}
                />
                <p>{t("sections.payment.p4")}</p>
                <p>{t("sections.payment.p5")}</p>
              </TermsSection>

              {/* 05 — Cancellation by Client */}
              <TermsSection
                id="cancellation-client"
                number="05"
                heading={t("sections.cancellation-client.heading")}
              >
                <p>{t("sections.cancellation-client.intro")}</p>

                <div
                  className="my-6 rounded-sm overflow-hidden"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <table className="w-full text-[14px]">
                    <thead>
                      <tr className="bg-bone-paper">
                        <th
                          className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted border-b"
                          style={{ borderColor: "rgba(31,29,24,0.1)" }}
                        >
                          {t("sections.cancellation-client.table.colDays")}
                        </th>
                        <th
                          className="text-left px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted border-b"
                          style={{ borderColor: "rgba(31,29,24,0.1)" }}
                        >
                          {t("sections.cancellation-client.table.colCharge")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        t.raw("sections.cancellation-client.table.rows") as {
                          period: string;
                          charge: string;
                        }[]
                      ).map((row, i, arr) => (
                        <tr key={row.period} className="bg-bone-bg">
                          <td
                            className="px-5 py-3.5 text-bone-ink"
                            style={{
                              borderBottom:
                                i < arr.length - 1
                                  ? "1px solid rgba(31,29,24,0.08)"
                                  : undefined,
                            }}
                          >
                            {row.period}
                          </td>
                          <td
                            className="px-5 py-3.5 font-medium text-bone-clay"
                            style={{
                              borderBottom:
                                i < arr.length - 1
                                  ? "1px solid rgba(31,29,24,0.08)"
                                  : undefined,
                            }}
                          >
                            {row.charge}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p>{t("sections.cancellation-client.p1")}</p>
                <p>{t("sections.cancellation-client.p2")}</p>
              </TermsSection>

              {/* 06 — Cancellation by Company */}
              <TermsSection
                id="cancellation-company"
                number="06"
                heading={t("sections.cancellation-company.heading")}
              >
                <p>{t("sections.cancellation-company.p1")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.cancellation-company.bullets") as string[]).map(
                    (desc) => ({ desc }),
                  )}
                />
                <p>
                  {t.rich("sections.cancellation-company.p2", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>{t("sections.cancellation-company.p3")}</p>
              </TermsSection>

              {/* 07 — Travel Insurance */}
              <TermsSection id="insurance" number="07" heading={t("sections.insurance.heading")}>
                <p>
                  {t.rich("sections.insurance.p1", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>{t("sections.insurance.p2Label")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.insurance.bullets") as string[]).map((desc) => ({ desc }))}
                />
                <p>{t("sections.insurance.p3")}</p>
              </TermsSection>

              {/* 08 — Itinerary Changes */}
              <TermsSection id="itinerary" number="08" heading={t("sections.itinerary.heading")}>
                <p>{t("sections.itinerary.p1")}</p>
                <p>{t("sections.itinerary.p2")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.itinerary.bullets") as string[]).map((desc) => ({ desc }))}
                />
                <p>{t("sections.itinerary.p3")}</p>
                <p>{t("sections.itinerary.p4")}</p>
              </TermsSection>

              {/* 09 — Health & Fitness */}
              <TermsSection id="health" number="09" heading={t("sections.health.heading")}>
                <p>{t("sections.health.p1")}</p>
                <p>{t("sections.health.p2Label")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.health.bullets") as string[]).map((desc) => ({ desc }))}
                />
                <p>{t("sections.health.p3")}</p>
                <p>{t("sections.health.p4")}</p>
                <p>{t("sections.health.p5")}</p>
              </TermsSection>

              {/* 10 — Wildlife & Safety */}
              <TermsSection id="wildlife" number="10" heading={t("sections.wildlife.heading")}>
                <p>{t("sections.wildlife.p1")}</p>
                <p>{t("sections.wildlife.p2Label")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.wildlife.bullets") as string[]).map((desc) => ({ desc }))}
                />
                <p>{t("sections.wildlife.p3")}</p>
                <p>{t("sections.wildlife.p4")}</p>
              </TermsSection>

              {/* 11 — Liability */}
              <TermsSection id="liability" number="11" heading={t("sections.liability.heading")}>
                <p>{t("sections.liability.p1")}</p>
                <p>{t("sections.liability.p2")}</p>
                <p>{t("sections.liability.p3Label")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.liability.bullets") as string[]).map((desc) => ({ desc }))}
                />
                <p>{t("sections.liability.p4")}</p>
              </TermsSection>

              {/* 12 — Force Majeure */}
              <TermsSection
                id="force-majeure"
                number="12"
                heading={t("sections.force-majeure.heading")}
              >
                <p>{t("sections.force-majeure.p1")}</p>
                <TermsList
                  variant="bullet"
                  items={(t.raw("sections.force-majeure.bullets") as string[]).map((desc) => ({
                    desc,
                  }))}
                />
                <p>{t("sections.force-majeure.p2")}</p>
              </TermsSection>

              {/* 13 — Complaints */}
              <TermsSection id="complaints" number="13" heading={t("sections.complaints.heading")}>
                <p>{t("sections.complaints.p1")}</p>
                <p>
                  {t("sections.complaints.p2Before")}{" "}
                  <a
                    href="mailto:info@divinetravelnestsafaris.com"
                    className="text-bone-clay hover:underline"
                  >
                    info@divinetravelnestsafaris.com
                  </a>{" "}
                  {t.rich("sections.complaints.p2After", {
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p>{t("sections.complaints.p3")}</p>
              </TermsSection>

              {/* 14 — Privacy & Data */}
              <TermsSection id="privacy" number="14" heading={t("sections.privacy.heading")}>
                <p>{t("sections.privacy.p1")}</p>
                <p>{t("sections.privacy.p2")}</p>
                <p>{t("sections.privacy.p3")}</p>
                <p>{t("sections.privacy.p4")}</p>
              </TermsSection>

              {/* 15 — Photography & Media */}
              <TermsSection
                id="photography"
                number="15"
                heading={t("sections.photography.heading")}
              >
                <p>{t("sections.photography.p1")}</p>
                <p>{t("sections.photography.p2")}</p>
                <p>{t("sections.photography.p3")}</p>
              </TermsSection>

              {/* 16 — Governing Law */}
              <TermsSection
                id="governing-law"
                number="16"
                heading={t("sections.governing-law.heading")}
                isLast
              >
                <p>{t("sections.governing-law.p1")}</p>
                <p>{t("sections.governing-law.p2")}</p>
                <p>
                  {t("sections.governing-law.p3Before")}{" "}
                  <Link href="/terms" className="text-bone-clay hover:underline">
                    divinetravelnestsafaris.com/terms
                  </Link>
                  {t("sections.governing-law.p3After")}
                </p>

                {/* Contact box */}
                <div
                  className="mt-10 bg-bone-paper rounded-sm p-7"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-bone-clay mb-3">
                    {t("sections.governing-law.contactBox.label")}
                  </span>
                  <p className="text-sm text-bone-ink leading-[1.65] mb-4">
                    {t("sections.governing-law.contactBox.body")}
                  </p>
                  <div className="flex flex-wrap gap-4 text-[14px]">
                    <a
                      href="mailto:info@divinetravelnestsafaris.com"
                      className="text-bone-clay hover:underline"
                    >
                      info@divinetravelnestsafaris.com
                    </a>
                    <span className="text-bone-muted hidden sm:inline">·</span>
                    <a
                      href="tel:+254722595916"
                      className="text-bone-clay hover:underline"
                    >
                      +254 722-595-916
                    </a>
                    <span className="text-bone-muted hidden sm:inline">·</span>
                    <Link
                      href="/contact"
                      className="text-bone-clay hover:underline"
                    >
                      {t("sections.governing-law.contactBox.sendMessage")}
                    </Link>
                  </div>
                </div>
              </TermsSection>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Local sub-components ─────────────────────────────────────────────── */

function TermsSection({
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

function TermsList({
  items,
  variant = "definition",
}: {
  items: { term?: string; desc: string }[];
  variant?: "definition" | "bullet";
}) {
  if (variant === "bullet") {
    return (
      <ul className="space-y-2 my-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="flex-shrink-0 mt-[0.6em] w-1 h-1 rounded-full bg-bone-clay"
              aria-hidden="true"
            />
            <span>{item.desc}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <dl className="space-y-3 my-1">
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-4"
        >
          <dt className="font-medium text-bone-ink">{item.term}</dt>
          <dd>{item.desc}</dd>
        </div>
      ))}
    </dl>
  );
}
