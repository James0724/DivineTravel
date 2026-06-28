import type { Metadata } from "next";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  FaqSchema,
  OrganizationSchema,
  BreadcrumbSchema,
} from "@/components/seo/StructuredData";
import WhyGrid from "@/components/ui/WhyGrid";
import SectionFaq from "@/components/ui/SectionFaq";
import PageHero from "@/components/ui/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { MessageSquare, Phone } from "lucide-react";
import { AnimatedHeading } from "@/components/ui/Heading";
import StandoutFeatureList from "@/components/about/StandoutFeatureList";
import { buildAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const image =
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80";
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "about Divine Travel Nest Safaris",
      "Kenya-based safari company",
      "woman-led safari house",
      "East Africa safari experts",
      "safari company values",
      "conservation safari",
      "wildlife tourism Kenya",
      "custom safari itineraries",
    ],
    authors: [{ name: "Divine Travel Nest Safaris" }],
    creator: "Divine Travel Nest Safaris",
    alternates: buildAlternates(locale, "/about"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.ogDescription"),
      type: "website",
      url: "/about",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Golden-hour savannah, East Africa",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.ogTitle"),
      description: t("meta.twitterDescription"),
      images: [image],
    },
  };
}

const TEAM_PHOTOS = [
  "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-18-at-12.05.59-780x520.jpeg",
  "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-18-at-12.04.19-550x825.jpeg",
  "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-18-at-12.05.06-550x825.jpeg",
];

const CERT_LOGOS = [
  "/logos/kenya-wildlife-service.png",
  "/logos/tra.png",
  "/logos/tripadvisor.png",
  "/logos/SB-center.png",
  "/logos/kato.png",
];

const WHY_KEYS = ["i", "ii", "iii", "iv", "v", "vi"];
const STANDOUT_KEYS = ["i", "ii", "iii", "iv"];

export default async function AboutPage() {
  const t = await getTranslations("about");

  type ItemFields = {
    titleBefore: string;
    titleEm: string;
    titleAfter: string;
    body: string;
  };
  const whyItemsData = t.raw("why.items") as ItemFields[];
  const standoutItemsData = t.raw("standout.items") as ItemFields[];
  const teamMembers = t.raw("team.members") as {
    name: string;
    role: string;
    bio: string;
  }[];
  const certs = t.raw("credentials.certs") as { label: string }[];
  const faqs = t.raw("faq.items") as { q: string; a: string }[];
  const stats = t.raw("stats") as {
    numEm: string;
    numSuffix: string;
    lblLine1: string;
    lblLine2: string;
  }[];

  const whyItems = WHY_KEYS.map((n, i) => ({
    n,
    title: (
      <>
        {whyItemsData[i].titleBefore}
        <em className="italic text-bone-clay">{whyItemsData[i].titleEm}</em>
        {whyItemsData[i].titleAfter}
      </>
    ),
    body: whyItemsData[i].body,
  }));

  const standoutItems = STANDOUT_KEYS.map((ic, i) => ({
    ic,
    title: (
      <>
        {standoutItemsData[i].titleBefore}
        <em className="italic text-bone-clay">
          {standoutItemsData[i].titleEm}
        </em>
        {standoutItemsData[i].titleAfter}
      </>
    ),
    body: standoutItemsData[i].body,
  }));

  return (
    <>
      {/* ── Structured data ────────────────────────────────────────────── */}
      <OrganizationSchema />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/about" },
        ]}
      />

      <PageHero
        image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80"
        imageAlt="About us section Image"
        minHeight="min-h-[60vh]"
        imageOpacity={0.45}
        breadcrumbs={[
          { label: t("breadcrumbHome"), href: "/" },
          { label: t("breadcrumbCurrent"), href: "/about" },
        ]}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.titleLine1")}
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

      {/* ── 1. LEAD ─────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg py-24 sm:py-28 lg:py-32">
        <div className="container-site">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-bone-clay mb-8">
            {t("lead.kickerMain")}{" "}
            <span className="text-bone-muted">{t("lead.kickerMuted")}</span>
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-20 items-end">
            <Reveal variant="slideLeft">
              <h2
                className="font-serif font-light leading-[0.92] tracking-[-0.028em] text-bone-ink"
                style={{ fontSize: "clamp(52px, 7.6vw, 120px)" }}
              >
                {t("lead.headingLine1")}
                <br />
                {t("lead.headingLine2Before")}
                <em className="italic text-bone-clay">
                  {t("lead.headingLine2Em")}
                </em>
                .
              </h2>
            </Reveal>
            <Reveal variant="slideRight">
              <div>
                <p className="text-[18px] leading-[1.62] text-bone-ink">
                  {t("lead.body1Before")}
                  <strong className="font-medium">
                    {t("lead.body1Strong")}
                  </strong>
                  {t("lead.body1After")}
                </p>
                <p className="text-sm leading-[1.62] text-bone-muted mt-4">
                  {t("lead.body2")}
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-bone-forest text-bone-paper rounded-full text-[14px] tracking-[0.01em] transition-all duration-200 hover:bg-bone-clay hover:-translate-y-0.5"
                  >
                    {t("lead.ctaPlan")}
                  </Link>
                  <div className="font-mono text-[13px] text-bone-ink tracking-[0.03em]">
                    <span className="block text-[9px] tracking-[0.16em] uppercase text-bone-muted mb-0.5">
                      {t("lead.talkToUs")}
                    </span>
                    +254 722-595-916
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 2. PORTRAIT ─────────────────────────────────────────────────── */}
      <section className="bg-bone-bg pb-3">
        <div className="container-site">
          <div
            className="relative overflow-hidden aspect-[4/3] md:aspect-[16/6.6]"
            style={{ background: "#e4dbd0" }}
          >
            <OptimizedImage
              src="https://res.cloudinary.com/dk2j3k15k/image/upload/v1780301052/Gallarey/WhatsApp-Image-2026-03-30-at-13.52.07_oeexgx.jpg"
              alt="Janet Wanjiru — Divine Travel Nest Safaris"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 pt-4 font-mono text-[10px] tracking-[0.14em] uppercase text-bone-muted">
            <span>{t("portrait.location")}</span>
            <span className="hidden md:block">{t("portrait.countries")}</span>
          </div>
        </div>
      </section>

      {/* ── 3. STORY ─────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "118px 0" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-10 lg:gap-24 items-start">
            {/* Left — eyebrow + heading */}
            <Reveal variant="slideLeft">
              <div>
                <div className="eyebrow">
                  <span className="dot" />
                  {t("story.eyebrow")}
                </div>
                <h2
                  className="font-serif font-normal leading-[1.0] tracking-[-0.02em] text-bone-ink mt-4"
                  style={{ fontSize: "clamp(36px, 4.2vw, 58px)" }}
                >
                  {t("story.headingBefore")}
                  <br />
                  {t("story.headingMid")}
                  <em className="italic text-bone-clay">
                    {t("story.headingEm")}
                  </em>
                  {t("story.headingAfter")}
                </h2>
              </div>
            </Reveal>

            {/* Right — body */}
            <Reveal variant="slideRight">
              <div>
                <p className="font-serif italic text-[20px] leading-[1.55] text-bone-ink mb-5">
                  {t("story.lead")}
                </p>
                <p className="text-[16px] leading-[1.72] text-bone-muted mb-5">
                  {t.rich("story.paragraph1", {
                    strong: (chunks) => (
                      <strong className="text-bone-ink font-medium">
                        {chunks}
                      </strong>
                    ),
                  })}
                </p>
                <p className="text-[16px] leading-[1.72] text-bone-muted mb-9">
                  {t("story.paragraph2")}
                </p>

                {/* Mission box */}
                <div
                  className="bg-bone-paper"
                  style={{
                    padding: "28px 30px",
                    border: "1px solid rgba(31,29,24,0.14)",
                  }}
                >
                  <span className="block font-mono text-[10px] tracking-[0.16em] uppercase text-bone-clay mb-3">
                    {t("story.missionLabel")}
                  </span>
                  <p className="font-serif italic text-[24px] leading-[1.32] text-bone-ink">
                    {t("story.missionText")}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. STATS ─────────────────────────────────────────────────────── */}
      <section
        className="bg-bone-paper"
        style={{
          borderTop: "1px solid rgba(31,29,24,0.14)",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <Stagger
            className="grid grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "rgba(31,29,24,0.14)" }}
          >
            {stats.map((s) => (
              <RevealItem key={s.lblLine1}>
                <div
                  className="bg-bone-paper flex flex-col gap-3"
                  style={{
                    padding: "clamp(28px, 4vw, 56px) clamp(16px, 3vw, 36px)",
                  }}
                >
                  <div
                    className="font-serif font-light leading-[0.88] tracking-[-0.02em] text-bone-ink"
                    style={{ fontSize: "clamp(36px, 8vw, 80px)" }}
                  >
                    {s.numEm ? (
                      <>
                        <em className="italic text-bone-clay">{s.numEm}</em>
                        {s.numSuffix}
                      </>
                    ) : (
                      s.numSuffix
                    )}
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-bone-muted leading-[1.55]">
                    {s.lblLine1}
                    <br />
                    {s.lblLine2}
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 5. VALUES ────────────────────────────────────────────────────── */}
      <WhyGrid
        eyebrow={t("why.eyebrow")}
        textBefore={t("why.headingBefore")}
        highlightedText={t("why.headingHighlight")}
        textAfter={t("why.headingAfter")}
        description={t("why.description")}
        items={whyItems}
        bg="bg-bone-bg"
      />

      {/* ── 6. STANDOUT ──────────────────────────────────────────────────── */}
      <section
        className="bg-bone-paper"
        style={{
          padding: "140px 0",
          borderTop: "1px solid rgba(31,29,24,0.14)",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo */}
            <Reveal variant="slideLeft">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4 / 5" }}
              >
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=70"
                  alt="Open-roof safari Land Cruiser — Divine Travel Nest Safaris"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Content */}

            <div>
              <header className="mb-8">
                <div className="mb-6">
                  <Reveal variant="fadeUp">
                    <div className="eyebrow">
                      <span className="dot" />
                      {t("standout.eyebrow")}
                    </div>
                  </Reveal>

                  <AnimatedHeading
                    as="h2"
                    textBefore={t("standout.headingBefore")}
                    highlightedText={t("standout.headingHighlight")}
                    textAfter={t("standout.headingAfter")}
                  />
                  <Reveal variant="fadeUp">
                    <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch] mb-8">
                      {t("standout.description")}
                    </p>
                  </Reveal>
                </div>
              </header>

              {/* Feature list */}
              <StandoutFeatureList items={standoutItems} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TEAM ──────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "120px 0" }}>
        <div className="container-site">
          <header className="section-hd">
            <div>
              <Reveal variant="fadeUp">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  {t("team.eyebrow")}
                </div>
              </Reveal>
              <AnimatedHeading
                as="h2"
                textBefore={t("team.headingBefore")}
                highlightedText={t("team.headingHighlight")}
                textAfter={t("team.headingAfter")}
              />
            </div>
            <Reveal>
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("team.description")}
              </p>
            </Reveal>
          </header>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
            {teamMembers.map((member, i) => (
              <RevealItem key={member.name}>
                <div className="group">
                  <div
                    className="relative overflow-hidden mb-5"
                    style={{ aspectRatio: "4 / 5", background: "#e4dbd0" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={TEAM_PHOTOS[i]}
                      alt={`${member.name}, ${member.role} — Divine Travel Nest Safaris`}
                      className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-[1.03]"
                      style={{ filter: "sepia(0.12) contrast(1.03)" }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="font-serif italic text-[30px] leading-[1.05] text-bone-ink mb-1">
                    {member.name}
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-clay mb-3">
                    {member.role}
                  </p>
                  <p
                    className="text-[14px] leading-[1.6] text-bone-muted"
                    style={{ maxWidth: "38ch" }}
                  >
                    {member.bio}
                  </p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 8. CREDENTIALS ───────────────────────────────────────────────── */}
      <section
        className="bg-bone-paper"
        style={{
          padding: "96px 0 110px",
          borderTop: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <Reveal variant="fadeUp">
            <div className="text-center mb-12">
              <div className="eyebrow justify-center mb-4">
                <span className="dot" />
                {t("credentials.eyebrow")}
              </div>
              <h2
                className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(30px, 3.4vw, 46px)" }}
              >
                {t("credentials.headingBefore")}
                <br className="hidden sm:block" />
                {t("credentials.headingMid")}
                <em className="italic text-bone-clay">
                  {t("credentials.headingEm")}
                </em>
                {t("credentials.headingAfter")}
              </h2>
            </div>
          </Reveal>

          <Stagger
            className="flex flex-wrap justify-center gap-5"
            style={{ maxWidth: "980px", margin: "0 auto" }}
          >
            {certs.map((cert, i) => (
              <RevealItem key={cert.label}>
                <div
                  className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-bone-bg transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(31,29,24,0.14)",
                    minWidth: "160px",
                  }}
                >
                  <OptimizedImage
                    src={CERT_LOGOS[i]}
                    alt={cert.label}
                    width={120}
                    height={48}
                    shimmer={false}
                    className="h-10 w-auto max-w-[120px] object-contain"
                  />
                  <span className="font-mono text-[11px] tracking-[0.07em] uppercase text-bone-forest-soft text-center">
                    {cert.label}
                  </span>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────────────────── */}
      <SectionFaq
        id="faq"
        eyebrow={t("faq.eyebrow")}
        textBefore={t("faq.headingBefore")}
        highlightedText={t("faq.headingHighlight")}
        contactNote={
          <>
            {t("faq.contactNoteBefore")}{" "}
            <a
              href="tel:+254722595916"
              className="text-bone-clay hover:underline"
            >
              +254 722-595-916
            </a>{" "}
            {t("faq.contactNoteMid")}{" "}
            <a href="/contact" className="text-bone-clay hover:underline">
              {t("faq.contactNoteLink")}
            </a>
            .
          </>
        }
        faqs={faqs}
      />
    </>
  );
}
