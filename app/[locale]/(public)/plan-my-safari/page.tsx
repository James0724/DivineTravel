import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Phone, MessageSquare } from "lucide-react";
import SafariPlanForm from "@/components/forms/SafariPlanForm";
import {
  BreadcrumbSchema,
  LocalBusinessSchema,
} from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { buildAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "planMySafari" });
  const image = "https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80";
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "plan my safari",
      "custom safari itinerary",
      "safari proposal",
      "tailor-made safari",
      "safari planner",
      "East Africa safari planning",
      "personalized safari",
      "Kenya Tanzania Uganda Rwanda safari",
    ],
    authors: [{ name: "Divine Travel Nest Safaris" }],
    creator: "Divine Travel Nest Safaris",
    alternates: buildAlternates(locale, "/plan-my-safari"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
      url: "/plan-my-safari",
      images: [{ url: image, width: 1200, height: 630, alt: "Plan your African safari" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      images: [image],
    },
  };
}

export default async function PlanSafariPage() {
  const t = await getTranslations("planMySafari");

  const contactDetails = [
    { lbl: t("contact.details.phoneLabel"), val: "+254 722-595-916", href: "tel:+254722595916" },
    {
      lbl: t("contact.details.emailLabel"),
      val: "info@divinetravelnestsafaris.com",
      href: "mailto:info@divinetravelnestsafaris.com",
    },
    { lbl: t("contact.details.officeLabel"), val: t("contact.details.officeValue") },
    {
      lbl: t("contact.details.tripadvisorLabel"),
      val: t("contact.details.tripadvisorValue"),
      href: "https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html",
      external: true,
    },
    {
      lbl: t("contact.details.googleLabel"),
      val: t("contact.details.googleValue"),
      href: "https://share.google/hr0uDk89EOkgVPDGh",
      external: true,
      last: true,
    },
  ];

  const trustItems = t.raw("trust.items") as { num: string; lbl: string }[];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/plan-my-safari" },
        ]}
      />
      <LocalBusinessSchema />

      <PageHero
        image="https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Plan your African safari"
        minHeight="min-h-[60vh]"
        imageOpacity={0.45}
        breadcrumbs={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbCurrent") },
        ]}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.titleMain")}
            <br />
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              {t("hero.titleEm")}
            </em>
            .
          </>
        }
        description={t("hero.description")}
        actions={
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="tel:+254722595916"
              className="inline-flex items-center gap-2 px-5 py-3 bg-bone-clay text-bone-paper rounded-full text-sm font-sans font-medium hover:bg-[#c0612e] transition-colors"
            >
              <Phone size={15} /> {t("hero.callNow")}
            </a>
            <a
              href="https://wa.me/254722595916"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 border border-bone-paper/35 text-bone-paper rounded-full text-sm font-sans hover:bg-bone-paper/10 transition-colors"
            >
              <MessageSquare size={15} /> {t("hero.whatsapp")}
            </a>
          </div>
        }
      />

      {/* Contact body */}
      <section className="py-24 sm:py-32 bg-bone-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: contact side */}
            <Reveal>
              <div>
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("contact.eyebrow")}
                </div>
                <h2 className="font-serif font-light text-[clamp(2.5rem,5vw,4rem)] leading-[1] tracking-[-0.02em] mt-4 mb-6">
                  {t("contact.headingMain1")}
                  <br />
                  by <em className="italic text-bone-clay">{t("contact.headingByEm")}</em>,{" "}
                  {t("contact.headingMain2")}
                </h2>
                <p className="text-bone-muted text-[17px] leading-[1.65] mb-9 max-w-[52ch]">
                  {t("contact.body")}
                </p>

                <div>
                  {contactDetails.map(({ lbl, val, href, external, last }) => (
                    <div
                      key={lbl}
                      className={`grid grid-cols-[120px_1fr] gap-4 py-4 border-t border-[rgba(23,22,18,0.14)] ${last ? "border-b" : ""}`}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-bone-muted pt-1">
                        {lbl}
                      </span>
                      {href ? (
                        <a
                          href={href}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="font-serif italic text-[22px] leading-tight border-b border-bone-clay pb-0.5 w-fit hover:text-bone-clay transition-colors"
                        >
                          {val}
                        </a>
                      ) : (
                        <span className="font-serif italic text-[22px] leading-tight">
                          {val}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={0.1}>
              <div className="bg-bone-paper border border-[rgba(23,22,18,0.10)] p-8 sm:p-10">
                <h3 className="font-serif font-normal text-[28px] mb-1.5">
                  {t("form.headingMain")} <em className="italic text-bone-clay">{t("form.headingEm")}</em>{" "}
                  {t("form.headingSuffix")}
                </h3>
                <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-bone-muted mb-8">
                  {t("form.subtext")}
                </p>
                <SafariPlanForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="py-12 bg-bone-forest text-bone-paper border-t border-bone-paper/10">
        <div className="container-site">
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {trustItems.map((s) => (
              <RevealItem key={s.lbl}>
                <div className="font-serif text-3xl sm:text-4xl text-[#f4d4a8] leading-none mb-1">
                  {s.num}
                </div>
                <div className="text-xs text-bone-paper/55 font-mono uppercase tracking-[0.1em]">
                  {s.lbl}
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
