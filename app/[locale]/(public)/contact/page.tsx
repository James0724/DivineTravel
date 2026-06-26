import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
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
  const t = await getTranslations({ locale, namespace: "contact" });
  const image = "https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80";
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "contact Divine Travel Nest",
      "safari contact Nairobi",
      "plan safari contact",
      "safari proposal",
      "customize safari itinerary",
      "East Africa safari booking",
      "safari planning help",
      "Nairobi safari company contact",
    ],
    authors: [{ name: "Divine Travel Nest Safaris" }],
    creator: "Divine Travel Nest Safaris",
    alternates: buildAlternates(locale, "/contact"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
      url: "/contact",
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

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const contactInfo = [
    {
      icon: Phone,
      label: t("info.items.phone.label"),
      value: "+254 722-595-916",
      href: "tel:+254722595916",
      sub: t("info.items.phone.sub"),
    },
    {
      icon: Mail,
      label: t("info.items.email.label"),
      value: "info@divinetravelnestsafaris.com",
      href: "mailto:info@divinetravelnestsafaris.com",
      sub: t("info.items.email.sub"),
    },
    {
      icon: MapPin,
      label: t("info.items.office.label"),
      value: t("info.items.office.value"),
      href: undefined,
      sub: t("info.items.office.sub"),
    },
    {
      icon: Clock,
      label: t("info.items.hours.label"),
      value: t("info.items.hours.value"),
      href: undefined,
      sub: t("info.items.hours.sub"),
    },
  ];

  const quickFaqs = t.raw("quickFaqs") as { q: string; a: string }[];
  const processSteps = t.raw("process.steps") as { num: string; title: string; desc: string }[];
  const trustItems = t.raw("trust.items") as { num: string; lbl: string }[];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/contact" },
        ]}
      />
      <LocalBusinessSchema />

      <PageHero
        image="https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Plan your African safari"
        minHeight="min-h-[60vh]"
        imageOpacity={0.45}
        breadcrumbs={[{ label: t("breadcrumbHome"), href: "/" }, { label: t("breadcrumbCurrent") }]}
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

      {/* How we work */}
      <section className="py-16 sm:py-20 bg-bone-paper border-b border-[rgba(23,22,18,0.08)]">
        <div className="container-site">
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {processSteps.map((step) => (
              <RevealItem key={step.num}>
                <div className="text-center sm:text-left">
                  <div className="font-mono text-3xl text-bone-clay/30 font-light mb-3">
                    {step.num}
                  </div>
                  <h3 className="font-serif text-lg text-bone-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-bone-muted leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 sm:py-24 bg-bone-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: Contact info + FAQ */}
            <Reveal variant="slideLeft" className="lg:col-span-2 space-y-8">
              <div>
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("info.eyebrow")}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-bone-ink mt-3 mb-3">
                  {t("info.headingLine1")}
                  <br />
                  {t("info.headingLine2")}
                </h2>
                <p className="text-bone-ink/65 leading-relaxed text-sm">
                  {t("info.body")}
                </p>
              </div>

              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href, sub }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 bg-bone-paper border border-[rgba(23,22,18,0.09)] rounded-sm p-4"
                  >
                    <div className="w-10 h-10 rounded bg-bone-forest/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-bone-forest" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-bone-ink/45 mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-bone-ink font-sans font-medium hover:text-bone-clay transition-colors"
                          target={
                            href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-bone-ink font-sans font-medium">
                          {value}
                        </p>
                      )}
                      {sub && (
                        <p className="text-xs text-bone-muted font-sans mt-0.5">
                          {sub}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-[0.1em] text-bone-muted hover:text-bone-clay transition-colors border border-[rgba(23,22,18,0.15)] px-3 py-2 rounded"
                >
                  {t("info.tripadvisorLink")}
                </a>
                <a
                  href="https://share.google/hr0uDk89EOkgVPDGh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-[0.1em] text-bone-muted hover:text-bone-clay transition-colors border border-[rgba(23,22,18,0.15)] px-3 py-2 rounded"
                >
                  {t("info.googleLink")}
                </a>
              </div>

              <div className="bg-bone-paper border border-[rgba(23,22,18,0.10)] rounded-sm p-5">
                <h3 className="font-serif text-base font-semibold text-bone-ink mb-4">
                  {t("info.faqHeading")}
                </h3>
                <ul className="divide-y divide-[rgba(23,22,18,0.08)]">
                  {quickFaqs.map(({ q, a }) => (
                    <li key={q} className="py-3">
                      <p className="text-xs font-sans font-semibold text-bone-ink mb-1">
                        {q}
                      </p>
                      <p className="text-xs text-bone-ink/55 font-sans leading-relaxed">
                        {a}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Right: Form */}
            <Reveal variant="slideRight" className="lg:col-span-3">
              <div className="bg-bone-paper border border-[rgba(23,22,18,0.10)] rounded-sm p-6 sm:p-8">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("form.eyebrow")}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-bone-ink mb-2">
                  {t("form.headingLine1")}
                  <br />
                  {t("form.headingLine2Main")} <em className="italic text-bone-clay">{t("form.headingLine2Em")}</em>.
                </h2>
                <p className="text-bone-ink/55 text-sm leading-relaxed mb-7">
                  {t("form.body")}
                </p>
                <ContactForm />
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
                <div>
                  <div className="font-serif text-3xl sm:text-4xl text-[#f4d4a8] leading-none mb-1">
                    {s.num}
                  </div>
                  <div className="text-xs text-bone-paper/55 font-mono uppercase tracking-[0.1em]">
                    {s.lbl}
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
