import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import SafarisContent from "./_content";
import CtaBand from "@/components/ui/CtaBand";

export const metadata: Metadata = {
  title: "All Safari Packages 2026/2027 — Kenya, Tanzania & Uganda",
  description:
    "Browse our complete catalogue of Kenya, Tanzania and Uganda safari packages. Filter by country, duration, budget and style — every itinerary tailored to your dates and group.",
  keywords:
    "safari packages, kenya safari, tanzania safari, uganda safari, east africa safari tours 2026, budget safari, luxury safari, gorilla trekking",
  alternates: { canonical: "/safaris" },
  openGraph: {
    title: "All Safari Packages | Divine Travel Nest Safaris",
    description:
      "Browse Kenya, Tanzania & Uganda safari packages — budget to luxury.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "East Africa Safari — Divine Travel Nest Safaris",
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

export default function SafarisPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Tours & Safaris", href: "/safaris" },
        ]}
      />

      <PageHero
        image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=80"
        imageAlt="Safari vehicles crossing the open plains of East Africa at golden hour"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tours & Safaris" },
        ]}
        title={
          <>
            Kenya, Tanzania &amp; Uganda
            <br />
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              safari
            </em>{" "}
            packages.
          </>
        }
        description="Our complete catalogue — short Mara introductions, the eight-day Sopa circuit, cross-border combos and Uganda gorilla trekking. Every itinerary rewritable for your dates, party size and budget."
        stats={[
          { num: "3", lbl: "Countries covered" },
          { num: "Big 5", lbl: "In a single circuit" },
          { num: "Year-round", lbl: "Safari season" },
        ]}
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

      <Suspense fallback={<GridSkeleton />}>
        <SafarisContent />
      </Suspense>
    </>
  );
}
