import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  BreadcrumbSchema,
  TouristDestinationSchema,
} from "@/components/seo/StructuredData";
import { type HeroStat } from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import AccommodationCarousel from "@/components/destinations/AccommodationCarousel";
import { getSafarisForDestination } from "@/lib/data/safaris";
import { getAccommodationsByLocation } from "@/lib/data/accommodations";
import type { Destination } from "@/types";
import TitleHero from "../ui/TitleHero";
import PkgCard from "../safaris/PkgCard";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

export default async function DestinationDetailPage({
  destination,
  countrySlug,
}: {
  destination: Destination;
  countrySlug: string;
}) {
  const countryLabel = destination.location.country;

  const [safaris, accommodations, t] = await Promise.all([
    getSafarisForDestination(destination, { limit: 6 }),
    getAccommodationsByLocation(
      destination.location.country,
      destination.location.region,
      { limit: 12, park: destination.name },
    ),
    getTranslations("home.signaturePackages"),
  ]);

  const packageCardLabels = {
    signatureBadge: t("signatureBadge"),
    fromLabel: t("fromLabel"),
    onRequest: t("onRequest"),
    daysLabel: t("daysLabel"),
  };

  const stats: HeroStat[] = [
    ...(destination.size
      ? [{ num: destination.size, lbl: "Size", sup: "" }]
      : []),
    ...(destination.location.region
      ? [{ num: destination.location.region, lbl: "Region", sup: "" }]
      : []),
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Destinations", href: "/destinations" },
          { name: countryLabel, href: `/destinations/${countrySlug}` },
          {
            name: destination.name,
            href: `/destinations/${countrySlug}/${destination.slug}`,
          },
        ]}
      />
      <TouristDestinationSchema
        name={destination.name}
        description={destination.shortDescription}
        url={`${APP_URL}/destinations/${countrySlug}/${destination.slug}`}
        image={destination.coverImage}
        countryCode={countryLabel.slice(0, 2).toUpperCase()}
        highlights={destination.majorAttractions}
      />
      <TitleHero
        eyebrow={countryLabel}
        title={destination.name}
        description={destination.shortDescription}
        backgroundImage={destination.coverImage}
      />

      <section className=" py-16">
        <div className="mx-auto max-w-[1240px] px-6 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-14">
          {/* Sidebar column — left at default `stretch` alignment so this wrapper
              spans the full row height (matching the content column). That gives
              the sticky <aside> inside it room to track scroll for the whole row
              instead of un-sticking early and overlapping what follows. */}
          <div>
            {/* Dossier Spec Card (Sidebar) */}
            <aside className="lg:sticky lg:top-[108px] border border-black/20 rounded-[3px] bg-bone-paper overflow-hidden w-full">
              <div className="bg-bone-forest text-bone-bg-soft font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-[18px]">
                Fact sheet
              </div>
              <div className="grid grid-cols-2 border-b border-black/10">
                <div className="p-5 border-r border-black/10">
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                    Country
                  </div>
                  <div className="text-[14px] text-[#211f18]">
                    {destination.location.country}
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                    Region
                  </div>
                  <div className="text-[14px] text-[#211f18]">
                    {destination.location.region ??
                      destination.location.country}
                  </div>
                </div>
              </div>
              <div className="p-5 border-b border-black/10">
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                  Size
                </div>
                <div className="text-[14px] text-[#211f18]">
                  {destination.size}
                </div>
              </div>
              <div className="p-5 border-b border-black/10">
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                  Best time
                </div>
                <div className="text-[14px] text-[#211f18]">
                  {destination.bestTimeToVisit}
                </div>
              </div>
              <div className="p-5 border-b border-black/10">
                <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                  Climate
                </div>
                <div className="text-[14px] leading-[1.55] text-[#211f18]">
                  {destination.climaticConditions}
                </div>
              </div>
              {destination.wildlife && destination.wildlife.length > 0 && (
                <div className="p-5 border-b border-black/10">
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                    Wildlife Present
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {destination.wildlife.map((species) => (
                      <span
                        key={species}
                        className="font-mono text-[11px] tracking-wide bg-bone-bg border border-black/10 text-[#211f18] px-2.5 py-1 rounded-[2px]"
                      >
                        {species}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {destination.access.byAir && (
                <div className="p-5 border-b border-black/10">
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                    By air
                  </div>
                  <div className="text-[14px] leading-[1.55] text-[#211f18]">
                    {destination.access.byAir}
                  </div>
                </div>
              )}
              {destination.access.byRoad && (
                <div className="p-5 border-b border-black/10">
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-bone-clay mb-1.5">
                    By road
                  </div>
                  <div className="text-[14px] leading-[1.55] text-[#211f18]">
                    {destination.access.byRoad}
                  </div>
                </div>
              )}

              <a
                href="#"
                className="block text-center font-mono text-[11px] tracking-[0.12em] uppercase bg-bone-clay text-[#fbf7ee] p-4 no-underline hover:bg-[#964e2f] transition-colors"
              >
                Enquire now →
              </a>
            </aside>
          </div>

          {/* Right Content Column */}

          <div className="max-w-[760px]">
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                Overview
              </div>
            </Reveal>

            {/* Editorial Intro with Drop Cap */}
            <p className=" mb-[26px]">{destination.description}</p>
            {/* Blockquote */}
            {destination.blockquote && (
              <blockquote className="border-l-2 border-bone-clay pl-7 py-1.5 mb-11 font-serif italic text-[26px] leading-[1.4] text-[#211f18]">
                {destination.blockquote}
              </blockquote>
            )}
            {/* Mid Section */}
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                Activities
              </div>
            </Reveal>

            <p className="mb-4">
              Immerse yourself in a curated collection of experiences designed
              to connect you deeply with the spirit of the region. From
              adrenaline-fueled adventures to quiet moments of discovery,
              explore the diverse ways to tailor your journey.
            </p>
            {/* Pill Tags */}
            <div className="flex flex-wrap gap-2.5 my-8 md:mb-12">
              {destination.activities.map((tag, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] tracking-wide bg-bone-paper border border-black/15 text-bone-clay px-[15px] py-2 rounded-[2px]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Safari Packages — real, bookable packages matched to this destination */}
            <h2 className="font-serif font-normal text-[30px] tracking-tight mb-7 text-[#211f18]">
              Safari Packages in {destination.name}
            </h2>
            <div className="border-t border-black/15 pt-7">
              {safaris.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                    {safaris.map((safari, i) => (
                      <PkgCard
                        key={String(safari._id)}
                        safari={safari}
                        index={i}
                      />
                    ))}
                  </div>
                  {safaris.length > 4 && (
                    <Link
                      href={`/safaris?destination=${encodeURIComponent(destination.name)}`}
                      className="inline-flex items-center gap-2 mt-8 font-mono text-[11px] tracking-[0.14em] uppercase text-bone-forest hover:text-bone-clay transition-colors"
                    >
                      View more {destination.name} packages →
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-sm text-bone-muted py-4">
                  No packages are tagged for {destination.name} yet — contact us
                  for a personalised itinerary.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Accommodation carousel — its own full-width section, deliberately
            outside the sidebar grid above so it can never interact with the
            sticky <aside>'s positioning. */}
        {accommodations.length > 0 && (
          <div className="mx-auto max-w-[1240px] px-6 mt-16 sm:mt-20">
            <Reveal variant="fadeUp">
              <h2 className="font-serif font-normal text-[30px] tracking-tight mb-2 text-[#211f18]">
                Where to Stay near {destination.name}
              </h2>
              <p className="text-[14px] text-bone-muted mb-7">
                Partner lodges, camps and resorts in the area — booked directly
                through us.
              </p>
            </Reveal>
            <AccommodationCarousel accommodations={accommodations} />
          </div>
        )}
      </section>
    </>
  );
}
