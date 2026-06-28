import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { SAFARI_VEHICLES } from "@/lib/data/sitemapDirectory";

const TITLE = "Safari Vehicles";
const PATH = "/safari-vehicles";

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

export default function SafariVehiclesPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: TITLE, href: PATH }]} />

      <PageHero
        image="https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Safari vehicle on a game drive"
        minHeight="min-h-[40vh]"
        imageOpacity={0.32}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: TITLE }]}
        eyebrow="Getting around"
        title={TITLE}
        description="The fleet of 4x4s and overland vehicles our safari partners use across East Africa."
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAFARI_VEHICLES.map((v) => (
              <RevealItem key={v.href}>
                <Link
                  href={v.href}
                  className="block rounded-sm bg-bone-paper px-6 py-5 text-sm text-bone-ink hover:text-bone-clay hover:underline transition-colors"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  {v.title}
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </>
  );
}
