import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComingSoonPage from "@/components/ui/ComingSoonPage";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { DESTINATION_PARK_TITLES } from "@/lib/data/sitemapDirectory";

interface Props {
  params: Promise<{ locale: string; park: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, park } = await params;
  const title = DESTINATION_PARK_TITLES.uganda.get(park);
  if (!title) return {};
  return {
    title: `${title} | Divine Travel Nest Safaris`,
    alternates: buildAlternates(locale, `/destinations/uganda/${park}`),
  };
}

export default async function UgandaParkPage({ params }: Props) {
  const { park } = await params;
  const title = DESTINATION_PARK_TITLES.uganda.get(park);
  if (!title) notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Destinations", href: "/destinations" },
          { name: "Uganda", href: "/destinations/uganda" },
          { name: title, href: `/destinations/uganda/${park}` },
        ]}
      />
      <ComingSoonPage
        title={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: "Uganda", href: "/destinations/uganda" },
          { label: title },
        ]}
      />
    </>
  );
}
