import type { Metadata } from "next";
import ComingSoonPage from "@/components/ui/ComingSoonPage";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";

const TITLE = "Family Safaris with Kids";
const PATH = "/safari-with-kids";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${TITLE} | Divine Travel Nest Safaris`,
    alternates: buildAlternates(locale, PATH),
  };
}

export default function SafariWithKidsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: TITLE, href: PATH }]} />
      <ComingSoonPage title={TITLE} breadcrumbs={[{ label: "Home", href: "/" }, { label: TITLE }]} />
    </>
  );
}
