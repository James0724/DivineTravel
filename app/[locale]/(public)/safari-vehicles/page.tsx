import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { SAFARI_VEHICLES_DATA } from "@/lib/data/safariVehicles";

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
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SAFARI_VEHICLES_DATA.map((v) => (
              <RevealItem key={v.slug}>
                <Link
                  href={`/safari-vehicles/${v.slug}`}
                  className="group block rounded-sm bg-bone-paper overflow-hidden transition-shadow hover:shadow-md"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.image}
                      alt={v.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-6 py-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-bone-clay mb-1">
                      Safari Vehicles
                    </p>
                    <h3 className="text-[15px] font-semibold text-bone-ink mb-1 group-hover:text-bone-clay transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-[13px] text-bone-muted leading-relaxed">
                      {v.tagline}
                    </p>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </>
  );
}
