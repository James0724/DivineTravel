import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import SafariModel from "@/lib/db/models/Safari";
import type { Safari } from "@/types";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import BookingButton from "@/components/ui/BookingButton";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

const getSafari = cache(async (slug: string): Promise<Safari | null> => {
  try {
    await connectDB();
    const safari = await SafariModel.findOne({ slug, active: true }).lean();
    if (!safari) return null;
    return JSON.parse(JSON.stringify(safari)) as Safari;
  } catch {
    return null;
  }
});

const getRelatedSafaris = cache(
  async (slug: string, country: string): Promise<Safari[]> => {
    try {
      await connectDB();
      const safaris = await SafariModel.find({
        active: true,
        slug: { $ne: slug },
        "location.country": { $regex: country, $options: "i" },
      })
        .sort({ rating: -1 })
        .limit(3)
        .select(
          "name slug tagline location duration pricing coverImage images category featured rating",
        )
        .lean();
      return JSON.parse(JSON.stringify(safaris)) as Safari[];
    } catch {
      return [];
    }
  },
);

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const safari = await getSafari(slug);
  if (!safari) return { title: "Safari Not Found" };

  const title =
    safari.seo?.metaTitle ?? `${safari.name} | Divine Travel Nest Safaris`;
  const description = safari.seo?.metaDescription ?? safari.tagline;

  return {
    title,
    description,
    keywords: safari.seo?.keywords?.join(", "),
    alternates: { canonical: `/safaris/${safari.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        { url: safari.coverImage, width: 1200, height: 630, alt: safari.name },
      ],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Dot() {
  return (
    <span className="inline-block w-1.5 h-1.5 bg-[var(--clay)] rounded-full mr-2.5 translate-y-[2px] shrink-0" />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
      <Dot />
      {children}
    </div>
  );
}

function SideBox({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`p-7 mb-4 ${
        dark
          ? "bg-[var(--forest)] text-[var(--paper)]"
          : "bg-[var(--paper)] border border-[var(--line)]"
      }`}
    >
      {children}
    </div>
  );
}

function SideBoxTitle({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <h4
      className={`font-mono text-[10px] tracking-[0.16em] uppercase mb-4 ${
        dark ? "text-[rgba(250,246,236,0.5)]" : "text-[var(--muted)]"
      }`}
    >
      {children}
    </h4>
  );
}

// Extracted so it renders both inside the hero overlay (desktop) and below the hero (mobile)
function PriceTiersBox({ safari }: { safari: Safari }) {
  return (
    <>
      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--muted)] mb-1.5">
        FROM · per person
      </div>
      {(["budget", "midRange", "luxury"] as const).map((tier, i, arr) => {
        const t = safari.pricing?.[tier];
        if (!t?.pricePerPerson) return null;
        const label =
          tier === "midRange"
            ? "Mid-range"
            : tier.charAt(0).toUpperCase() + tier.slice(1);
        return (
          <div
            key={tier}
            className={`flex justify-between py-2 text-[13px] ${
              i < arr.length - 1 ? "border-b border-[var(--line)]" : ""
            }`}
          >
            <span>{label}</span>
            <b className="font-serif italic text-[var(--clay)]">
              ${t.pricePerPerson.toLocaleString()}
              {tier === "luxury" ? "+" : ""}
            </b>
          </div>
        );
      })}
      <BookingButton
        safari={safari}
        label={`Book this ${safari.duration} day${safari.duration !== 1 ? "s" : ""} safari →`}
        className="block mt-3.5 py-3 w-full text-center bg-[var(--forest)] text-[var(--paper)] text-[13px] rounded transition-opacity hover:opacity-90"
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params;
  const safari = await getSafari(slug);
  if (!safari) notFound();

  const nights = Math.max(safari.duration - 1, 0);
  const parks = safari.location.parks?.length
    ? safari.location.parks
    : safari.location.park
      ? [safari.location.park]
      : [];
  const countries = safari.location.countries?.length
    ? safari.location.countries
    : [safari.location.country];
  const heroImage =
    safari.coverImage ||
    safari.images?.[0]?.url ||
    "https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1700&q=68";
  const related = await getRelatedSafaris(safari.slug, safari.location.country);

  const tripFacts: { label: string; value: string }[] = [
    { label: "Duration", value: `${safari.duration} Days · ${nights} Nights` },
    { label: "Country", value: countries.join(", ") },
    {
      label: "Park / Reserve",
      value: parks.join(", ") || safari.location.region,
    },
    {
      label: "Group size",
      value: `${safari.minGroupSize} – ${safari.maxGroupSize}`,
    },
    ...(safari.bestSeason?.length
      ? [{ label: "Best season", value: safari.bestSeason.join(", ") }]
      : []),
    { label: "Vehicle", value: "4×4 Pop-up Roof" },
    {
      label: "Difficulty",
      value:
        safari.difficulty.charAt(0).toUpperCase() + safari.difficulty.slice(1),
    },
  ];

  console.log({ safari, related });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Tours & Safaris", href: "/safaris" },
          { name: safari.name, href: `/safaris/${safari.slug}` },
        ]}
      />

      {/* ════════════════════════════════════════════════════════════════════
          HERO — image fills section; price box moves below on mobile
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[58vh] sm:h-[65vh] md:h-[70vh] min-h-[380px] sm:min-h-[500px] md:min-h-[580px] overflow-hidden text-white">
        <Image
          src={heroImage}
          alt={safari.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />

        <div className="absolute bottom-7 md:bottom-14 left-0 right-0 max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-12 items-end">
            {/* Title */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-85 mb-3">
                Tours &amp; Safaris · {countries.join(" · ")} ·{" "}
                {parks[0] || safari.location.region}
              </div>
              <h1 className="font-serif font-light text-[clamp(30px,5.5vw,88px)] leading-[0.98] tracking-[-0.02em] max-w-[18ch]">
                {safari.name}
              </h1>
              <p className="hidden sm:block mt-4 max-w-[56ch] text-sm leading-relaxed opacity-90">
                {safari.tagline}
              </p>
            </div>

            {/* Price box — desktop overlay only (md+) */}
            <div className="hidden md:block bg-[rgba(244,237,224,0.95)] text-[var(--ink)] p-6 min-w-[200px]">
              <PriceTiersBox safari={safari} />
            </div>
          </div>
        </div>
      </section>

      {/* Price strip — mobile only, sits cleanly below the hero image */}
      <div className="md:hidden bg-[var(--paper)] border-b border-[var(--line)] px-5 py-6">
        <PriceTiersBox safari={safari} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DETAIL BODY — itinerary (left) + sidebar (right)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--bg)]">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20 items-start">
            {/* ── LEFT — Itinerary ──────────────────────────────────────── */}
            <div>
              <Reveal>
                <div className="mb-12 sm:mb-14">
                  <Eyebrow>The Itinerary</Eyebrow>
                  <h2 className="font-serif font-normal text-[clamp(30px,4.4vw,60px)] leading-[1.02] tracking-[-0.02em] mt-3.5">
                    {safari.duration} day{safari.duration !== 1 ? "s" : ""}.{" "}
                    <em className="italic text-[var(--clay)]">
                      {nights} night{nights !== 1 ? "s" : ""}
                    </em>
                    .
                  </h2>
                  <p className="text-sm leading-[1.65] text-[var(--muted)] max-w-[60ch] mt-4">
                    {safari.description}
                  </p>
                </div>
              </Reveal>

              {/* Day-by-day */}
              {safari.itinerary?.length > 0 ? (
                safari.itinerary.map((day) => (
                  <Reveal key={day.day}>
                    <div className="py-9 border-t border-[var(--line)] [&:last-child]:border-b grid grid-cols-1 xs:grid-cols-[56px_1fr] md:grid-cols-[120px_1fr] gap-2 xs:gap-[18px] md:gap-9">
                      {/* Day number */}
                      <div>
                        <div className="font-serif italic text-[40px] leading-none text-[var(--clay)]">
                          {String(day.day).padStart(2, "0")}
                        </div>
                        <span className="block font-mono text-[10px] text-[var(--muted)] tracking-[0.16em] uppercase mt-2">
                          Day
                        </span>
                      </div>

                      {/* Day content */}
                      <div>
                        <h3 className="font-serif font-normal text-[26px] sm:text-[28px] tracking-[-0.01em] mb-3">
                          {day.title}
                        </h3>

                        {day.meals?.length > 0 && (
                          <div className="flex flex-wrap gap-[18px] mb-3.5 font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--muted)]">
                            <span>
                              <strong className="text-[var(--forest)] font-medium">
                                Meals
                              </strong>{" "}
                              {day.meals.join(" · ")}
                            </span>
                          </div>
                        )}

                        <p className="text-sm leading-[1.65] text-[var(--muted)] mb-3.5">
                          {day.description}
                        </p>

                        {day.activities?.length > 0 && (
                          <ul className="list-none p-0 mb-3.5">
                            {day.activities.map((act, i) => (
                              <li
                                key={i}
                                className="relative pl-[18px] py-1 text-[14px] text-[var(--ink)]"
                              >
                                <span className="absolute left-1 text-[var(--clay)] font-bold">
                                  ·
                                </span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        )}

                        {day.accommodation && (
                          <span className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--forest)] py-2 px-3 bg-[var(--paper)] border border-[var(--line)] rounded mt-1">
                            ⌂ {day.accommodation}
                          </span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)] pt-5">
                  Detailed itinerary available on request — contact us to get
                  your personalised day-by-day plan.
                </p>
              )}
            </div>

            {/* ── RIGHT — Sidebar ───────────────────────────────────────── */}
            <aside className="lg:sticky lg:top-24">
              {/* Trip facts */}
              <Reveal>
                <SideBox>
                  <SideBoxTitle>Trip facts</SideBoxTitle>
                  <ul className="list-none p-0 m-0">
                    {tripFacts.map(({ label, value }, i) => (
                      <li
                        key={label}
                        className={`flex justify-between items-baseline gap-3.5 py-2.5 text-[14px] ${
                          i < tripFacts.length - 1
                            ? "border-b border-[var(--line)]"
                            : ""
                        }`}
                      >
                        <span className="text-[var(--ink)]">{label}</span>
                        <b className="font-serif italic font-normal text-[var(--forest)] text-right">
                          {value}
                        </b>
                      </li>
                    ))}
                  </ul>
                </SideBox>
              </Reveal>

              {/* What's included */}
              {safari.included?.length > 0 && (
                <Reveal delay={0.05}>
                  <SideBox>
                    <SideBoxTitle>What&apos;s included</SideBoxTitle>
                    <ul className="list-none p-0 m-0">
                      {safari.included.map((item, i) => (
                        <li
                          key={i}
                          className={`flex justify-between items-baseline gap-3.5 py-2.5 text-[14px] ${
                            i < safari.included.length - 1
                              ? "border-b border-[var(--line)]"
                              : ""
                          }`}
                        >
                          <span className="text-[var(--ink)]">{item}</span>
                          <span className="text-[var(--clay)] text-[14px]">
                            ✓
                          </span>
                        </li>
                      ))}
                    </ul>
                  </SideBox>
                </Reveal>
              )}

              {/* What's excluded */}
              {safari.excluded?.length > 0 && (
                <Reveal delay={0.1}>
                  <SideBox>
                    <SideBoxTitle>What&apos;s excluded</SideBoxTitle>
                    <ul className="list-none p-0 m-0">
                      {safari.excluded.map((item, i) => (
                        <li
                          key={i}
                          className={`flex justify-between items-baseline gap-3.5 py-2.5 text-[14px] ${
                            i < safari.excluded.length - 1
                              ? "border-b border-[var(--line)]"
                              : ""
                          }`}
                        >
                          <span className="text-[var(--ink)]">{item}</span>
                          <span className="text-[var(--muted)] text-[14px]">
                            —
                          </span>
                        </li>
                      ))}
                    </ul>
                  </SideBox>
                </Reveal>
              )}

              {/* Booking CTA */}
              <Reveal delay={0.15}>
                <SideBox dark>
                  <SideBoxTitle dark>Begin this trip</SideBoxTitle>
                  <p className="font-serif italic text-[20px] leading-[1.25] mb-[18px]">
                    Reserve your spot now — no payment required today.
                  </p>
                  <BookingButton
                    safari={safari}
                    label="Book this safari →"
                    className="block w-full text-center bg-[#f4d4a8] text-[var(--forest)] py-3 px-4 text-[13px] rounded font-medium transition-opacity hover:opacity-90"
                  />
                </SideBox>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LODGES — three pricing tiers
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--paper)] border-t border-[var(--line)]">
        <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12">
          <Reveal>
            <Eyebrow>Where you will stay</Eyebrow>
            <h2 className="font-serif font-normal text-[clamp(36px,4.4vw,60px)] leading-[1.02] tracking-[-0.02em] mt-[14px] mb-[14px]">
              Handpicked lodges,{" "}
              <em className="italic text-[var(--clay)]">three</em> tiers.
            </h2>
            <p className="text-sm leading-[1.65] text-[var(--muted)] mb-12 max-w-[56ch]">
              Whether you prefer a budget tented camp, a mid-range lodge, or a
              luxury safari camp inside the reserve — we work with vetted
              partners across the full range.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {(
              [
                { tier: "budget", label: "Budget", em: "options" },
                { tier: "midRange", label: "Mid-range", em: "options" },
                { tier: "luxury", label: "Luxury", em: "options" },
              ] as const
            ).map(({ tier, label, em }) => {
              const t = safari.pricing?.[tier];
              if (!t) return null;
              return (
                <RevealItem
                  key={tier}
                  className="p-7 bg-[var(--bg)] border border-[var(--line)]"
                >
                  <h3 className="font-serif text-[26px] mb-1.5">
                    {label} <em className="italic text-[var(--clay)]">{em}</em>
                  </h3>
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--muted)] mb-[18px]">
                    From ${t.pricePerPerson.toLocaleString()} / person
                  </div>

                  {t.hotels && t.hotels.length > 0 ? (
                    <ul className="list-none p-0 m-0">
                      {t.hotels.map((hotel, i) => (
                        <li
                          key={i}
                          className={`flex justify-between items-baseline text-[14px] ${
                            i === 0
                              ? "pb-3"
                              : "py-3 border-t border-[var(--line)]"
                          }`}
                        >
                          <span className="text-[var(--ink)]">
                            {hotel.name}
                          </span>
                          <span className="text-[var(--clay)] text-[12px] shrink-0 ml-3 tracking-[0.04em]">
                            {"★".repeat(hotel.rating)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13px] leading-relaxed text-[var(--muted)] mt-1">
                      {t.description}
                    </p>
                  )}
                </RevealItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HIGHLIGHTS — if available
      ════════════════════════════════════════════════════════════════════ */}
      {safari.highlights?.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-[var(--bg)] border-t border-[var(--line)]">
          <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12">
            <Reveal>
              <Eyebrow>Safari highlights</Eyebrow>
              <h2 className="font-serif font-normal text-[clamp(30px,4.4vw,60px)] leading-[1.02] tracking-[-0.02em] mt-3.5 mb-10">
                What to <em className="italic text-[var(--clay)]">expect</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-px bg-[var(--line)] border border-[var(--line)]">
                {safari.highlights.map((hl, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-7 bg-[var(--bg)]"
                  >
                    <span className="font-serif italic text-[18px] text-[var(--clay)] shrink-0 leading-[1.3]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-relaxed text-[var(--ink)] m-0">
                      {hl}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          RELATED SAFARIS
      ════════════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-[var(--paper)] border-t border-[var(--line)]">
          <div className="max-w-[1480px] mx-auto px-5 sm:px-8 md:px-12">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
                <div>
                  <Eyebrow>You may also like</Eyebrow>
                  <h2 className="font-serif font-normal text-[clamp(26px,3.8vw,52px)] leading-[1.02] tracking-[-0.02em] mt-3.5">
                    More{" "}
                    <em className="italic text-[var(--clay)]">
                      {countries[0]}
                    </em>{" "}
                    safaris.
                  </h2>
                </div>
                <Link
                  href="/safaris"
                  className="inline-flex items-center gap-3 px-[22px] py-3 bg-[var(--forest)] text-[var(--paper)] rounded-full text-[13px] tracking-[0.02em] whitespace-nowrap transition-opacity hover:opacity-90"
                >
                  All safari packages →
                </Link>
              </div>
            </Reveal>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-9">
              {related.map((r) => {
                const lowestPrice = r.pricing?.budget?.pricePerPerson ?? 0;
                const rNights = Math.max(r.duration - 1, 0);
                const isGold = r.featured;
                const tagLabel = r.featured
                  ? "Featured"
                  : r.category?.[0]
                    ? r.category[0].charAt(0).toUpperCase() +
                      r.category[0].slice(1)
                    : "Wildlife";

                return (
                  <RevealItem key={r._id} className="flex flex-col">
                    <Link
                      href={`/safaris/${r.slug}`}
                      className="flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3.4] overflow-hidden bg-[var(--bg-deep)] mb-5 relative">
                        <Image
                          src={
                            r.coverImage ||
                            r.images?.[0]?.url ||
                            "/images/placeholder.jpg"
                          }
                          alt={r.name}
                          fill
                          className="object-cover transition-transform duration-1000 hover:scale-[1.05]"
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        />
                      </div>

                      {/* Meta */}
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`inline-block px-2.5 py-1 border rounded-full font-mono text-[10px] uppercase tracking-[0.14em] ${
                            isGold
                              ? "border-[var(--clay)] text-[var(--clay)]"
                              : "border-[var(--line)] text-[var(--muted)]"
                          }`}
                        >
                          {isGold ? "★ " : ""}
                          {tagLabel}
                        </span>
                        {r.rating > 0 && (
                          <span className="font-mono text-[10px] text-[var(--muted)]">
                            ★ {r.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-normal text-[26px] sm:text-[28px] leading-[1.05] tracking-[-0.01em] mb-2.5 text-[var(--ink)]">
                        {r.name}
                      </h3>

                      {/* Tagline */}
                      <p className="text-[14px] leading-[1.55] text-[var(--muted)] mb-4">
                        {r.tagline}
                      </p>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-[var(--line)] flex justify-between items-baseline">
                        <div className="font-serif text-[22px] text-[var(--ink)]">
                          <span className="font-mono text-[10px] text-[var(--muted)] tracking-[0.12em] mr-1.5">
                            FROM
                          </span>
                          <b className="italic">
                            ${lowestPrice.toLocaleString()}
                          </b>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--muted)] tracking-[0.14em]">
                          {r.duration}D · {rNights}N
                        </span>
                      </div>
                    </Link>
                  </RevealItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
