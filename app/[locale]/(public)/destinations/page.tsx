import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCountryOrderedSafaris } from "@/lib/data/safaris";
import PageHero from "@/components/ui/PageHero";
import CtaBand from "@/components/ui/CtaBand";
import PkgCard from "@/components/safaris/PkgCard";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import {
  BreadcrumbSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import type { Safari } from "@/types";
import { AnimatedHeading } from "@/components/ui/Heading";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "East Africa Safari Destinations — Kenya, Tanzania, Uganda & Rwanda",
  description:
    "Discover East Africa's four great safari countries. From Kenya's Masai Mara and Tanzania's Serengeti to Uganda's gorilla forests and Rwanda's Volcanoes — an expert guide to where to go and why.",
  keywords:
    "east africa safari destinations, kenya national parks, tanzania serengeti, uganda gorilla trekking, rwanda volcanoes, safari destination guide, east africa wildlife",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "East Africa Safari Destinations | Divine Travel Nest Safaris",
    description:
      "Kenya, Tanzania, Uganda & Rwanda — an expert guide to East Africa's four great safari countries.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "East Africa safari landscape",
      },
    ],
  },
};

/* ─── Country data ────────────────────────────────────────────────────────── */

const COUNTRIES = [
  {
    slug: "kenya",
    name: "Kenya",
    href: "/destinations/kenya",
    safariHref: "/safaris?country=Kenya",
    tagline: "Home of the Big Five & the Great Migration",
    description:
      "Kenya is East Africa's classic safari destination — open golden savannahs, iconic Masai culture, and the greatest wildlife spectacle on Earth. The country that invented the word safari.",
    parks: ["Masai Mara", "Amboseli", "Tsavo", "Samburu"],
    highlights: [
      "Big Five in a single country",
      "Great Migration (Jul – Oct)",
      "Year-round game viewing",
      "12+ national parks & reserves",
    ],
    image:
      "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1000&q=80",
    imageAlt: "Wildebeest herds on the open Masai Mara plains, Kenya",
    stat1: { num: "12+", lbl: "Parks & reserves" },
    stat2: { num: "Big 5", lbl: "Year-round" },
    accentColor: "#c17a3c",
  },
  {
    slug: "tanzania",
    name: "Tanzania",
    href: "/destinations/tanzania",
    safariHref: "/safaris?country=Tanzania",
    tagline: "Serengeti, Ngorongoro & Zanzibar",
    description:
      "Tanzania holds Africa's greatest national park — the Serengeti — plus the world-famous Ngorongoro Crater, an intact volcanic caldera with resident Big Five year-round and a white-sand coast to match.",
    parks: ["Serengeti", "Ngorongoro", "Tarangire", "Selous"],
    highlights: [
      "Serengeti wildebeest circuit",
      "Ngorongoro Crater lions",
      "Zanzibar beach extension",
      "Kilimanjaro as a backdrop",
    ],
    image:
      "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1000&q=80",
    imageAlt: "Wildebeest river crossing in the Serengeti, Tanzania",
    stat1: { num: "15+", lbl: "Protected areas" },
    stat2: { num: "1.5M", lbl: "Wildebeest annually" },
    accentColor: "#5c8c3c",
  },
  {
    slug: "uganda",
    name: "Uganda",
    href: "/destinations/uganda",
    safariHref: "/safaris?country=Uganda",
    tagline: "Gorilla trekking & chimp tracking in the Pearl of Africa",
    description:
      "Uganda is Africa's most biodiverse secret — dense rainforests sheltering mountain gorillas and chimpanzees, savannah with tree-climbing lions, and the thundering Murchison Falls. Few places move you this way.",
    parks: ["Bwindi", "Queen Elizabeth", "Murchison Falls", "Kibale"],
    highlights: [
      "Mountain gorilla trekking",
      "Chimpanzee tracking",
      "Tree-climbing lions",
      "Murchison Falls spectacle",
    ],
    image:
      "https://images.pexels.com/photos/4577792/pexels-photo-4577792.jpeg?auto=compress&cs=tinysrgb&w=1000&q=80",
    imageAlt: "Mountain gorilla in Bwindi Impenetrable Forest, Uganda",
    stat1: { num: "10", lbl: "National parks" },
    stat2: { num: "50%", lbl: "World's gorillas" },
    accentColor: "#3c6b3c",
  },
  {
    slug: "rwanda",
    name: "Rwanda",
    href: "/destinations/rwanda",
    safariHref: "/safaris?country=Rwanda",
    tagline: "Volcanoes, gorillas & compact luxury",
    description:
      "Small, safe, and remarkably biodiverse — Rwanda packs gorilla treks, savannah game drives, golden-monkey encounters and Nyungwe chimp forest into a country you can cross in a morning.",
    parks: ["Volcanoes", "Akagera", "Nyungwe", "Gishwati-Mukura"],
    highlights: [
      "Mountain & golden gorillas",
      "Volcanoes canopy treks",
      "Akagera big-game drives",
      "Nyungwe primate forest",
    ],
    image:
      "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1000&q=80",
    imageAlt: "Mountain gorilla family in Volcanoes National Park, Rwanda",
    stat1: { num: "3", lbl: "Major parks" },
    stat2: { num: "~1000", lbl: "Mountain gorillas left" },
    accentColor: "#6b3c6b",
  },
] as const;

/* ─── Popular safaris fetch ───────────────────────────────────────────────── */

async function getPopularSafaris(): Promise<Safari[]> {
  try {
    return await getCountryOrderedSafaris(
      { active: true },
      {
        limit: 6,
        select:
          "name slug tagline location duration pricing images coverImage category difficulty featured active rating reviewCount minGroupSize maxGroupSize bestSeason",
      },
    );
  } catch {
    return [];
  }
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default async function DestinationsPage() {
  const popularSafaris = await getPopularSafaris();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Destinations", href: "/destinations" },
        ]}
      />
      <CollectionPageSchema
        name="East Africa Safari Destinations"
        description="Kenya, Tanzania, Uganda and Rwanda — an expert guide to East Africa's four great safari countries."
        url="https://divinetravelnestsafaris.com/destinations"
        items={COUNTRIES.map((c) => ({
          name: c.name,
          url: `https://divinetravelnestsafaris.com${c.href}`,
          description: c.tagline,
        }))}
      />

      {/* ── Hero ── */}
      <PageHero
        image="https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Elephants crossing the open savannah at golden hour, East Africa"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
        eyebrow="East Africa · Four countries"
        title={
          <>
            Where would you
            <br />
            like to{" "}
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>go</em>?
          </>
        }
        description="Kenya, Tanzania, Uganda and Rwanda — four countries, each with its own character. We help you choose, combine, and experience the best of all of them."
        stats={[
          { num: "4", sup: "", lbl: "Safari countries" },
          { num: "50", sup: "+", lbl: "National parks" },
          { num: "Big 5", sup: "", lbl: "Across East Africa" },
        ]}
      />

      {/* ── Country cards ── */}
      <section className="py-20 sm:py-28 bg-bone-paper">
        <div className="container-site">
          {/* Header */}
          <Reveal variant="fadeUp">
            <div className="mb-14">
              <div className="eyebrow mb-4">
                <span className="dot" />
                Explore by country
              </div>
              <AnimatedHeading
                as="h2"
                textBefore="Four countries, "
                highlightedText="every kind of "
                textAfter="safari"
              />
            </div>
          </Reveal>

          {/* 2×2 card grid */}
          <Stagger
            stagger={0.1}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {COUNTRIES.map((country) => (
              <RevealItem key={country.slug} variant="scaleUp">
                <div className="group flex flex-col h-full bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(23,22,18,0.13)] transition-shadow duration-300">
                  {/* Image */}
                  <Link
                    href={country.href}
                    className="block relative overflow-hidden flex-shrink-0"
                    style={{ aspectRatio: "16 / 9" }}
                    aria-label={`Explore ${country.name}`}
                  >
                    <Image
                      src={country.image}
                      alt={country.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,22,18,0.55)] via-[rgba(23,22,18,0.1)] to-transparent" />
                    {/* Country name on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
                      <p className="font-mono text-[10px] tracking-[0.18em] text-bone-paper/70 uppercase mb-1">
                        East Africa
                      </p>
                      <h3
                        className="font-serif font-light leading-none text-bone-paper"
                        style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
                      >
                        {country.name}
                      </h3>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6 lg:p-7">
                    {/* Tagline */}
                    <p
                      className="font-serif text-[16px] leading-snug text-bone-ink mb-3"
                      style={{ fontStyle: "italic" }}
                    >
                      {country.tagline}
                    </p>

                    {/* Description */}
                    <p className="font-sans text-[13.5px] leading-[1.7] text-bone-muted mb-5">
                      {country.description}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-1.5 mb-6">
                      {country.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2.5 font-mono text-[11px] tracking-[0.05em] text-bone-ink/80"
                        >
                          <span
                            className="mt-[3px] w-[5px] h-[5px] rounded-full flex-shrink-0"
                            style={{ background: country.accentColor }}
                            aria-hidden="true"
                          />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Park tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {country.parks.map((park) => (
                        <span
                          key={park}
                          className="px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.08em] bg-bone-bg border border-[rgba(23,22,18,0.12)] text-bone-muted"
                        >
                          {park}
                        </span>
                      ))}
                    </div>

                    {/* Stats + CTA row */}
                    <div className="mt-auto pt-5 border-t border-[rgba(23,22,18,0.1)] flex items-end justify-between gap-4">
                      {/* Two mini-stats */}
                      <div className="flex gap-6">
                        <div>
                          <p
                            className="font-serif leading-none text-bone-ink"
                            style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
                          >
                            {country.stat1.num}
                          </p>
                          <p className="font-mono text-[9px] tracking-[0.14em] text-bone-muted mt-1 uppercase">
                            {country.stat1.lbl}
                          </p>
                        </div>
                        <div>
                          <p
                            className="font-serif leading-none text-bone-ink"
                            style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
                          >
                            {country.stat2.num}
                          </p>
                          <p className="font-mono text-[9px] tracking-[0.14em] text-bone-muted mt-1 uppercase">
                            {country.stat2.lbl}
                          </p>
                        </div>
                      </div>

                      {/* CTA link */}
                      <Link
                        href={country.href}
                        className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-bone-ink hover:text-bone-clay transition-colors group/link"
                      >
                        <span>Explore {country.name}</span>
                        <span className="w-7 h-7 rounded-full bg-bone-forest text-bone-paper flex items-center justify-center text-[12px] flex-shrink-0 transition-colors duration-200 group-hover/link:bg-bone-clay">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Compare strip ── */}
      <section className="py-14 sm:py-16 bg-bone-bg border-y border-[rgba(23,22,18,0.08)]">
        <div className="container-site">
          <Reveal variant="fadeUp">
            <div className="text-center mb-10">
              <div className="eyebrow mb-3">
                <span className="dot" />
                Quick country selector
              </div>
              <h2
                className="font-serif font-light text-bone-ink leading-tight tracking-[-0.02em]"
                style={{ fontSize: "clamp(26px, 3.5vw, 44px)" }}
              >
                Find the right country for{" "}
                <em className="italic text-bone-clay">your</em> safari.
              </h2>
            </div>
          </Reveal>

          <Stagger
            stagger={0.07}
            delay={0.1}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(23,22,18,0.1)] border border-[rgba(23,22,18,0.1)] overflow-hidden rounded-sm"
          >
            {[
              {
                country: "Kenya",
                best: ["Big cats", "The Migration", "Families"],
                href: "/destinations/kenya",
              },
              {
                country: "Tanzania",
                best: ["Great wildebeest circuit", "Honeymoons", "Beach combo"],
                href: "/destinations/tanzania",
              },
              {
                country: "Uganda",
                best: ["Gorilla trekking", "Primates", "Adventure seekers"],
                href: "/destinations/uganda",
              },
              {
                country: "Rwanda",
                best: ["Short trips", "Gorilla & gorilla", "Luxury focus"],
                href: "/destinations/rwanda",
              },
            ].map((item) => (
              <RevealItem key={item.country} variant="fadeUp">
                <Link
                  href={item.href}
                  className="group flex flex-col h-full bg-bone-paper p-7 hover:bg-bone-forest transition-colors duration-300"
                >
                  <p className="font-mono text-[9px] tracking-[0.2em] text-bone-muted group-hover:text-bone-paper/50 mb-2 uppercase transition-colors">
                    Best for
                  </p>
                  <h3 className="font-serif text-[22px] text-bone-ink group-hover:text-bone-paper leading-none mb-4 transition-colors">
                    {item.country}
                  </h3>
                  <ul className="space-y-1.5 mt-auto">
                    {item.best.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-bone-muted group-hover:text-bone-paper/65 transition-colors"
                      >
                        <span
                          className="w-1 h-1 rounded-full bg-bone-clay flex-shrink-0"
                          aria-hidden="true"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-bone-clay group-hover:text-[#f4d4a8] transition-colors uppercase">
                    Explore
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Popular safaris ── */}
      <section className="py-20 sm:py-28 bg-bone-paper">
        <div className="container-site">
          {/* Header */}
          <Reveal variant="fadeUp">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <div>
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  Popular across all countries
                </div>
                <AnimatedHeading
                  textBefore="Top-rated "
                  textAfter="safari"
                  highlightedText=" packages."
                  as="h2"
                />
              </div>
              <Link
                href="/safaris"
                className="flex-shrink-0 flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-bone-ink hover:text-bone-clay transition-colors self-start sm:self-end pb-1"
              >
                Browse all packages
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          {popularSafaris.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {popularSafaris.map((safari, i) => (
                <PkgCard key={safari._id} safari={safari} index={i} />
              ))}
            </div>
          ) : (
            /* Fallback placeholder grid when no DB results */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "3 Days Masai Mara Safari",
                  country: "Kenya",
                  days: "3D · 2N",
                  from: "On request",
                  img: "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
                },
                {
                  name: "7 Days Tanzania Highlights",
                  country: "Tanzania",
                  days: "7D · 6N",
                  from: "On request",
                  img: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
                },
                {
                  name: "5 Days Uganda Gorilla Trek",
                  country: "Uganda",
                  days: "5D · 4N",
                  from: "On request",
                  img: "https://images.pexels.com/photos/4577792/pexels-photo-4577792.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
                },
              ].map((pkg, i) => (
                <Reveal key={pkg.name} variant="fadeUp" delay={i * 0.08}>
                  <Link
                    href="/safaris"
                    className="group flex flex-col bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden hover:shadow-card-hover transition-shadow"
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "3/2" }}
                    >
                      <Image
                        src={pkg.img}
                        alt={pkg.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <span className="font-mono text-[10px] tracking-[0.1em] text-bone-muted mb-2">
                        {pkg.country}
                      </span>
                      <h3 className="font-serif text-[19px] text-bone-ink mb-4">
                        {pkg.name}
                      </h3>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[rgba(23,22,18,0.1)]">
                        <span className="font-serif text-[22px] font-light text-bone-ink">
                          {pkg.from}
                        </span>
                        <span className="font-mono text-[10px] text-bone-muted">
                          {pkg.days}
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {/* View all link */}
          <Reveal variant="fadeUp" delay={0.2}>
            <div className="mt-12 text-center">
              <Link
                href="/safaris"
                className="inline-flex items-center gap-2.5 font-mono text-[12px] tracking-[0.12em] uppercase text-bone-ink border-b border-bone-ink/30 pb-0.5 hover:text-bone-clay hover:border-bone-clay transition-colors"
              >
                Browse all safari packages
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
