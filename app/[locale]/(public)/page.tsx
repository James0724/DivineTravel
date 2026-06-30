import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FaqSchema } from "@/components/seo/StructuredData";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import IntroSection from "@/components/home/IntroSection";
import DestinationsSection from "@/components/home/DestinationsSection";
import SignaturePackages from "@/components/home/SignaturePackages";
import SafariTypesSection from "@/components/home/SafariTypesSection";
import BestSellers from "@/components/home/BestSellers";
import MigrationCalendar from "@/components/home/MigrationCalendar";
import PhotoMarquee from "@/components/home/PhotoMarquee";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StandOut from "@/components/home/StandOut";
import TailorMade from "@/components/home/TailorMade";
import Testimonials from "@/components/home/Testimonials";
import JournalSection from "@/components/home/JournalSection";
import FAQSection from "@/components/home/FAQSection";
import connectDB from "@/lib/db/mongoose";
import TestimonialModel from "@/lib/db/models/Testimonial";
import { getCountryOrderedSafaris } from "@/lib/data/safaris";
import type { Testimonial } from "@/types";
import { buildAlternates } from "@/lib/seo/hreflang";

export const revalidate = 300; // ISR — revalidate every 5 minutes

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    keywords: [
      "Kenya safari packages 2026",
      "Tanzania safari tours",
      "Uganda gorilla trekking",
      "Rwanda gorilla safari",
      "Masai Mara game drive",
      "Serengeti safari",
      "Bwindi gorilla trekking",
      "East Africa safari",
      "tailor-made safari",
      "Big Five safari Africa",
      "luxury safari Kenya",
      "budget safari packages",
      "safari tour packages 2026 2027",
      "divine travel nest safaris",
      "Nairobi safari company",
      "Africa wildlife tour",
    ],
    alternates: buildAlternates(locale, "/"),
  };
}

async function getHomeData() {
  try {
    await connectDB();
    const select =
      "name slug tagline location duration pricing images coverImage category difficulty featured rating reviewCount minGroupSize maxGroupSize";
    const [safaris, testimonials] = await Promise.all([
      getCountryOrderedSafaris({ active: true, featured: true }, { limit: 6, select }),
      TestimonialModel.find({ featured: true })
        .sort({ rating: -1 })
        .limit(8)
        .lean(),
    ]);
    return {
      safaris,
      testimonials: JSON.parse(JSON.stringify(testimonials)) as Testimonial[],
    };
  } catch {
    return { safaris: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const { safaris, testimonials } = await getHomeData();
  const faqSchemaItems = t.raw("faqSchema") as { question: string; answer: string }[];

  return (
    <>
      <FaqSchema items={faqSchemaItems} />
      {/* 01 · Hero */}
      <Hero />

      {/* 02 · Trust / Accreditation strip */}
      <TrustStrip />

      {/* 03 · Welcome intro */}
      <IntroSection />

      {/* 04 · Destinations tabs */}
      <DestinationsSection />

      {/* 05 · Signature safari experiences — all featured safaris (DB-driven) */}
      <SignaturePackages initialData={safaris} />

      {/* 06 · Safari types */}
      <SafariTypesSection />

      {/* 07 · Best-selling tours */}
      <BestSellers />

      {/* 08 · Migration calendar */}
      <MigrationCalendar />

      {/* 09 · Photo marquee strip */}
      <PhotoMarquee />

      {/* 10 · Why choose us */}
      <WhyChooseUs />

      {/* 11 · Stand-out features */}
      <StandOut />

      {/* 12 · Tailor-made safaris */}
      <TailorMade />

      {/* 13 · Team
      <TeamSection /> */}

      {/* 14 · Guest testimonials (DB-driven) */}
      <Testimonials initialData={testimonials} />

      {/* 15 · Journal previews */}
      <JournalSection />

      {/* 16 · FAQ */}
      <FAQSection />
    </>
  );
}
