import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountryOrderedSafaris } from "@/lib/data/safaris";
import { SAFARI_TYPES, getSafariType } from "@/lib/data/safariTypes";
import SafariTypePage from "@/components/safaris/SafariTypePage";
import {
  BreadcrumbSchema,
  FaqSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import type { Safari } from "@/types";

export const revalidate = 300;

export function generateStaticParams() {
  return SAFARI_TYPES.map((t) => ({ type: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const config = getSafariType(type);
  if (!config) return {};

  return {
    title: `${config.label} Packages — East Africa | Divine Travel Nest Safaris`,
    description: config.heroDescription,
    alternates: { canonical: `/safari-types/${config.slug}` },
    openGraph: {
      title: `${config.label} Packages | Divine Travel Nest Safaris`,
      description: config.heroDescription,
      type: "website",
      images: [{ url: config.heroImage, width: 1200, height: 630, alt: config.heroImageAlt }],
    },
  };
}

export default async function SafariTypeDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const config = getSafariType(type);
  if (!config) notFound();

  let safaris: Safari[] = [];
  try {
    safaris = await getCountryOrderedSafaris(
      { safariType: config.slug, active: true },
      {
        limit: 9,
        select:
          "name slug tagline location duration pricing images coverImage category safariType difficulty featured active rating reviewCount",
      },
    );
  } catch {
    // safaris remains []
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Safari Types", href: "/safari-types" },
          { name: config.label, href: `/safari-types/${config.slug}` },
        ]}
      />
      <FaqSchema items={config.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      {safaris.length > 0 && (
        <CollectionPageSchema
          name={`${config.label} Packages`}
          description={config.heroDescription}
          url={`https://divinetravelnestsafaris.com/safari-types/${config.slug}`}
          items={safaris.map((s) => ({
            name: s.name,
            url: `https://divinetravelnestsafaris.com/safaris/${s.slug}`,
            description: s.tagline,
          }))}
        />
      )}

      <SafariTypePage config={config} safaris={safaris} />
    </>
  );
}
