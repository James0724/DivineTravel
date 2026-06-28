import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComingSoonPage from "@/components/ui/ComingSoonPage";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { WILDLIFE_COMING_SOON_SLUGS } from "@/lib/data/sitemapDirectory";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const title = WILDLIFE_COMING_SOON_SLUGS.get(slug);
  if (!title) return {};
  return {
    title: `${title} | Divine Travel Nest Safaris`,
    alternates: buildAlternates(locale, `/wildlife/${slug}`),
  };
}

export default async function WildlifeSpeciesPage({ params }: Props) {
  const { slug } = await params;
  const title = WILDLIFE_COMING_SOON_SLUGS.get(slug);
  if (!title) notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Wildlife Guide", href: "/wildlife" },
          { name: title, href: `/wildlife/${slug}` },
        ]}
      />
      <ComingSoonPage
        title={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Wildlife Guide", href: "/wildlife" },
          { label: title },
        ]}
      />
    </>
  );
}
