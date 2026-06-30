import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PageHero from "@/components/ui/PageHero";
import {
  BreadcrumbSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import SafarisContent from "./_content";
import CtaBand from "@/components/ui/CtaBand";
import { getQueryClient } from "@/lib/queryClient";
import { getSafarisList } from "@/lib/data/safaris";
import { safariKeys } from "@/lib/data/queryKeys";
import { DURATIONS } from "@/lib/data/safariFilterOptions";
import type {
  SafariFilters,
  SafariCategory,
  SafariDifficulty,
  SafariStyle,
  PriceTier,
} from "@/types";
import TitleHero from "@/components/ui/TitleHero";

export const metadata: Metadata = {
  title:
    "East Africa Safari Packages 2026/2027 — Kenya, Tanzania, Uganda & Rwanda Tours",
  description:
    "Browse our complete East Africa safari package catalogue for 2026/2027. Kenya Masai Mara tours, Tanzania Serengeti migration circuits, Uganda gorilla trekking and Rwanda packages — filter by country, duration and budget. Every itinerary tailor-made by a Nairobi-based team.",
  keywords:
    "east africa safari packages 2026, kenya safari packages, tanzania safari tours, uganda gorilla trekking, rwanda safari, masai mara tours 2026, serengeti safari packages, big five safari east africa, tailor-made safari holiday, budget safari packages africa, luxury safari 2027, safari tour packages, gorilla trekking packages, best africa safari 2026",
  alternates: { canonical: "/en/safaris" },
  openGraph: {
    title:
      "East Africa Safari Packages 2026/2027 — Kenya, Tanzania, Uganda & Rwanda",
    description:
      "Browse Kenya Masai Mara tours, Tanzania Serengeti circuits, Uganda gorilla trekking and Rwanda safari packages — budget to luxury, tailor-made.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Safari vehicles on the East Africa plains at golden hour",
      },
    ],
  },
};

function GridSkeleton() {
  return (
    <section style={{ padding: "80px 0 140px", background: "var(--bg)" }}>
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="mb-5"
                style={{ aspectRatio: "4/3.4", background: "var(--bg-deep)" }}
              />
              <div
                className="h-3 rounded mb-2 w-1/3"
                style={{ background: "var(--bg-deep)" }}
              />
              <div
                className="h-8 rounded mb-3"
                style={{ background: "var(--bg-deep)" }}
              />
              <div
                className="h-4 rounded w-3/4"
                style={{ background: "var(--bg-deep)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SafarisPage({ searchParams }: Props) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const dur = DURATIONS.find((d) => d.value === get("duration"));

  // Mirrors the apiFilters built client-side in ./_content.tsx — the query
  // key must match exactly so the hydrated cache entry below is picked up
  // on mount instead of triggering a redundant client fetch.
  const apiFilters: SafariFilters = {
    country: get("country") || undefined,
    destination: get("destination") || undefined,
    category: (get("category") as SafariCategory) || undefined,
    safariType: (get("safariType") as SafariStyle) || undefined,
    difficulty: (get("difficulty") as SafariDifficulty) || undefined,
    tier: (get("tier") as PriceTier) || undefined,
    minDays: dur?.min,
    maxDays: dur?.max,
    search: get("search") || undefined,
    sort: (get("sort") as SafariFilters["sort"]) || "rating",
    page: parseInt(get("page") ?? "1", 10),
    limit: 12,
  };

  const queryClient = getQueryClient();
  const safarisResult = await queryClient.fetchQuery({
    queryKey: safariKeys.list(apiFilters),
    queryFn: () => getSafarisList(apiFilters),
  });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Tours & Safaris", href: "/safaris" },
        ]}
      />
      <CollectionPageSchema
        name="East Africa Safari Packages 2026/2027"
        description="Kenya Masai Mara tours, Tanzania Serengeti circuits, Uganda gorilla trekking and Rwanda safari packages — budget to luxury, tailor-made."
        url="https://divinetravelnestsafaris.com/safaris"
        items={safarisResult.data.map((s) => ({
          name: s.name,
          url: `https://divinetravelnestsafaris.com/safaris/${s.slug}`,
          description: s.tagline,
        }))}
      />

      <TitleHero
        eyebrow="Tours and safaris"
        title=" Kenya, Tanzania, Uganda & Rwanda safari 2026/2027."
        description="Kenya Masai Mara tours, Tanzania Serengeti migration circuits, Uganda gorilla trekking and Rwanda Volcanoes safaris — 50+ curated packages, every itinerary rewritable for your dates, party size and budget."
        backgroundImage="https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
      />

      <CtaBand
        variant="large"
        buttonHref="/plan-my-safari"
        heading={
          <>
            Build your East Africa{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>safari</em>.
          </>
        }
        description="Tell us your budget, dates, wildlife interests and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour."
        buttonText="Get your free quote"
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<GridSkeleton />}>
          <SafarisContent />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
