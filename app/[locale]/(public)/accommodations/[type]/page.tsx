import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAccommodationsByType } from "@/lib/data/accommodations";
import {
  ACCOMMODATION_TYPES,
  getAccommodationType,
  type AccommodationTypeContent,
  type LocalizedAccommodationType,
} from "@/lib/data/accommodationTypes";
import AccommodationTypePage from "@/components/accommodations/AccommodationTypePage";
import {
  BreadcrumbSchema,
  FaqSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import type { Accommodation } from "@/types";
import { routing } from "@/i18n/routing";
import ComingSoonPage from "@/components/ui/ComingSoonPage";
import { ACCOMMODATION_COMING_SOON_SLUGS } from "@/lib/data/sitemapDirectory";

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ACCOMMODATION_TYPES.map((t) => ({ locale, type: t.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const entry = getAccommodationType(type);
  if (!entry) {
    const comingSoonTitle = ACCOMMODATION_COMING_SOON_SLUGS.get(type);
    if (comingSoonTitle) {
      return { title: `${comingSoonTitle} | Divine Travel Nest Safaris` };
    }
    return {};
  }

  const t = await getTranslations({ locale, namespace: "accommodations" });
  const content = t.raw(`types.${type}`) as AccommodationTypeContent;

  return {
    title: t("typePage.meta.titleTemplate", { label: content.label }),
    description: content.heroDescription,
    alternates: { canonical: `/en/accommodations/${entry.slug}` },
    openGraph: {
      title: t("typePage.meta.ogTitleTemplate", { label: content.label }),
      description: content.heroDescription,
      type: "website",
      images: [
        { url: entry.heroImage, width: 1200, height: 630, alt: content.heroImageAlt },
      ],
    },
  };
}

export default async function AccommodationTypeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  const entry = getAccommodationType(type);
  if (!entry) {
    const comingSoonTitle = ACCOMMODATION_COMING_SOON_SLUGS.get(type);
    if (comingSoonTitle) {
      return (
        <ComingSoonPage
          title={comingSoonTitle}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Accommodations", href: "/accommodations" },
            { label: comingSoonTitle },
          ]}
        />
      );
    }
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "accommodations" });
  const content = t.raw(`types.${type}`) as AccommodationTypeContent;
  const config: LocalizedAccommodationType = { ...entry, ...content };

  let properties: Accommodation[] = [];
  try {
    properties = await getAccommodationsByType(config.dbType, { limit: 24 });
  } catch {
    // properties remains []
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("breadcrumbHome"), href: "/" },
          { name: t("breadcrumbCurrent"), href: "/accommodations" },
          { name: config.label, href: `/accommodations/${config.slug}` },
        ]}
      />
      <FaqSchema items={config.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      {properties.length > 0 && (
        <CollectionPageSchema
          name={`${config.label} — Partner Properties`}
          description={config.heroDescription}
          url={`https://divinetravelnestsafaris.com/accommodations/${config.slug}`}
          items={properties.map((p) => ({
            name: p.name,
            url: p.websiteUrl,
            description: p.description,
          }))}
        />
      )}

      <AccommodationTypePage config={config} properties={properties} />
    </>
  );
}
