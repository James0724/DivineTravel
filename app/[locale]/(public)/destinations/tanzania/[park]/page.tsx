import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComingSoonPage from "@/components/ui/ComingSoonPage";
import DestinationDetailPage from "@/components/destinations/DestinationDetailPage";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { DESTINATION_PARK_TITLES } from "@/lib/data/sitemapDirectory";
import { getDestinationBySlug } from "@/lib/data/destinations";

interface Props {
  params: Promise<{ locale: string; park: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, park } = await params;
  const destination = await getDestinationBySlug("tanzania", park);
  const title = destination?.seo?.metaTitle || destination?.name || DESTINATION_PARK_TITLES.tanzania.get(park);
  if (!title) return {};
  return {
    title: `${title} | Divine Travel Nest Safaris`,
    description: destination?.seo?.metaDescription || destination?.shortDescription,
    alternates: buildAlternates(locale, `/destinations/tanzania/${park}`),
  };
}

export default async function TanzaniaParkPage({ params }: Props) {
  const { park } = await params;
  const destination = await getDestinationBySlug("tanzania", park);

  if (destination) {
    return <DestinationDetailPage destination={destination} countrySlug="tanzania" />;
  }

  const title = DESTINATION_PARK_TITLES.tanzania.get(park);
  if (!title) notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Destinations", href: "/destinations" },
          { name: "Tanzania", href: "/destinations/tanzania" },
          { name: title, href: `/destinations/tanzania/${park}` },
        ]}
      />
      <ComingSoonPage
        title={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Destinations", href: "/destinations" },
          { label: "Tanzania", href: "/destinations/tanzania" },
          { label: title },
        ]}
      />
    </>
  );
}
