import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";

const TITLE = "Countries";
const PATH = "/countries";

const COUNTRIES = [
  { name: "Kenya", destination: "/destinations/kenya", safaris: "/safaris/kenya" },
  { name: "Tanzania", destination: "/destinations/tanzania", safaris: "/safaris/tanzania" },
  { name: "Uganda", destination: "/destinations/uganda", safaris: "/safaris/uganda" },
  { name: "Rwanda", destination: "/destinations/rwanda", safaris: "/safaris/rwanda" },
];

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

export default function CountriesPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: TITLE, href: PATH }]} />

      <PageHero
        image="https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Map of East Africa safari countries"
        minHeight="min-h-[40vh]"
        imageOpacity={0.32}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: TITLE }]}
        eyebrow="Where we travel"
        title={TITLE}
        description="Four countries, one continent's finest wildlife — explore each destination and its safari packages."
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COUNTRIES.map((c) => (
              <RevealItem key={c.name}>
                <div
                  className="rounded-sm bg-bone-paper p-7"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <h3 className="font-serif text-2xl font-normal text-bone-ink mb-4">
                    {c.name}
                  </h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link href={c.destination} className="text-bone-clay hover:underline">
                      Explore {c.name} →
                    </Link>
                    <Link href={c.safaris} className="text-bone-muted hover:text-bone-clay hover:underline">
                      {c.name} safari packages →
                    </Link>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </>
  );
}
