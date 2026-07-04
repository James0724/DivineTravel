import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { SAFARI_VEHICLES_DATA, SAFARI_VEHICLE_SLUGS } from "@/lib/data/safariVehicles";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return SAFARI_VEHICLES_DATA.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const vehicle = SAFARI_VEHICLE_SLUGS.get(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.title} | Safari Vehicles | Divine Travel Nest Safaris`,
    description: vehicle.tagline,
    alternates: buildAlternates(locale, `/safari-vehicles/${slug}`),
  };
}

export default async function SafariVehiclePage({ params }: Props) {
  const { slug } = await params;
  const vehicle = SAFARI_VEHICLE_SLUGS.get(slug);
  if (!vehicle) notFound();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Safari Vehicles", href: "/safari-vehicles" },
          { name: vehicle.title, href: `/safari-vehicles/${slug}` },
        ]}
      />

      <PageHero
        image={vehicle.image}
        imageAlt={vehicle.imageAlt}
        minHeight="min-h-[48vh]"
        imageOpacity={0.38}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Safari Vehicles", href: "/safari-vehicles" },
          { label: vehicle.title },
        ]}
        eyebrow="Safari Vehicles"
        title={vehicle.title}
        description={vehicle.tagline}
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-5">
                {vehicle.description.map((para, i) => (
                  <p key={i} className="text-bone-muted text-[15px] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              <div>
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-clay mb-4 pb-3 border-b border-bone-ink/10">
                  Vehicle Features
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-bone-clay"
                        strokeWidth={2}
                      />
                      <span className="text-[13.5px] text-bone-muted leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-clay mb-4 pb-3 border-b border-bone-ink/10">
                  Best For
                </h2>
                <ul className="space-y-2">
                  {vehicle.bestFor.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-bone-clay" />
                      <span className="text-[13.5px] text-bone-muted leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Specs sidebar ── */}
            <div className="lg:col-span-1">
              <div
                className="rounded-sm bg-bone-paper px-6 py-6 sticky top-24"
                style={{ border: "1px solid rgba(31,29,24,0.12)" }}
              >
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-clay mb-4 pb-3 border-b border-bone-ink/10">
                  Specifications
                </h2>
                <dl className="space-y-3">
                  {vehicle.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-bone-muted/70 mb-0.5">
                        {spec.label}
                      </dt>
                      <dd className="text-[13.5px] text-bone-ink">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
