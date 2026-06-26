import type { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import BookPageContent from "@/components/booking/BookPageContent";

export const metadata: Metadata = {
  title: "Book Your Safari",
  description:
    "Choose your East Africa safari and request a booking online. Our team confirms availability, pricing and your itinerary within 24 hours — no payment required now.",
  alternates: { canonical: "/en/bookings" },
  openGraph: {
    title: "Book Your Safari — Divine Travel Nest Safaris",
    description:
      "Pick a Kenya, Tanzania, Uganda or Rwanda safari package and request a booking online in minutes.",
    type: "website",
  },
};

function BookPageSkeleton() {
  return (
    <section style={{ background: "var(--bg)", padding: "80px 0 140px" }}>
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 text-center">
        <div
          className="h-3 rounded mb-4 w-40 mx-auto animate-pulse"
          style={{ background: "var(--bg-deep)" }}
        />
        <div
          className="h-10 rounded mb-3 animate-pulse"
          style={{ background: "var(--bg-deep)" }}
        />
        <div
          className="h-4 rounded w-2/3 mx-auto animate-pulse"
          style={{ background: "var(--bg-deep)" }}
        />
      </div>
    </section>
  );
}

export default function BookPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Book Your Safari", href: "/bookings" },
        ]}
      />
      <Suspense fallback={<BookPageSkeleton />}>
        <BookPageContent />
      </Suspense>
    </>
  );
}
