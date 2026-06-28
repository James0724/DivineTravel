import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { WILDLIFE_SPECIES } from "@/lib/data/sitemapDirectory";

const TITLE = "Wildlife Guide";
const PATH = "/wildlife";

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

export default function WildlifePage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: TITLE, href: PATH }]} />

      <PageHero
        image="https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Wildlife of East Africa"
        minHeight="min-h-[40vh]"
        imageOpacity={0.32}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: TITLE }]}
        eyebrow="Know before you go"
        title={TITLE}
        description="A field guide to the animals you'll encounter on safari across Kenya, Tanzania, Uganda and Rwanda."
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {WILDLIFE_SPECIES.map((species) => (
              <RevealItem key={species.href}>
                <Link
                  href={species.href}
                  className="block rounded-sm bg-bone-paper px-5 py-4 text-sm text-bone-ink hover:text-bone-clay hover:underline transition-colors"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  {species.title}
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </>
  );
}
