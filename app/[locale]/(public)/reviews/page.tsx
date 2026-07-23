import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "@/components/ui/PageHero";
import ReviewsPageContent from "@/components/reviews/ReviewsPageContent";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import connectDB from "@/lib/db/mongoose";
import TestimonialModel from "@/lib/db/models/Testimonial";
import { getContactSettings } from "@/lib/getSiteSettings";
import type { Testimonial } from "@/types";

const PATH = "/reviews";
const HERO_IMAGE =
  "https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviews" });
  return {
    title: `${t("meta.title")} | Divine Travel Nest Safaris`,
    description: t("meta.description"),
    alternates: buildAlternates(locale, PATH),
  };
}

async function getReviewsData() {
  try {
    await connectDB();
    const [testimonials, total] = await Promise.all([
      TestimonialModel.find({}).sort({ createdAt: -1 }).limit(24).lean(),
      TestimonialModel.countDocuments({}),
    ]);
    return {
      testimonials: JSON.parse(JSON.stringify(testimonials)) as Testimonial[],
      total,
    };
  } catch {
    return { testimonials: [] as Testimonial[], total: 0 };
  }
}

export default async function ReviewsPage() {
  const t = await getTranslations("reviews");
  const [{ testimonials, total }, settings] = await Promise.all([
    getReviewsData(),
    getContactSettings(),
  ]);

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Home", href: "/" }, { name: t("meta.title"), href: PATH }]}
      />
      <PageHero
        image={HERO_IMAGE}
        imageAlt={t("meta.title")}
        minHeight="min-h-[40vh]"
        imageOpacity={0.32}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: t("meta.title") }]}
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
      />
      <ReviewsPageContent
        testimonials={testimonials}
        googleRating={settings.googleRating}
        googleReviews={settings.googleReviews}
        total={total}
      />
    </>
  );
}
