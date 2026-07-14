import type { Metadata } from "next";
import { Suspense } from "react";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import BookPageContent from "@/components/booking/BookPageContent";
import { buildAlternates } from "@/lib/seo/hreflang";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Book Your Safari",
    description:
      "Choose your East Africa safari and request a booking online. Our team confirms availability, pricing and your itinerary within 24 hours — no payment required now.",
    alternates: buildAlternates(locale, "/bookings"),
    openGraph: {
      title: "Book Your Safari — Divine Travel Nest Safaris",
      description:
        "Pick a Kenya, Tanzania, Uganda or Rwanda safari package and request a booking online in minutes.",
      type: "website",
    },
  };
}

function BookPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header band */}
      <section style={{ background: "var(--forest)", padding: "40px 0 28px" }}>
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 text-center">
          <div
            className="h-2.5 rounded mb-4 w-32 mx-auto"
            style={{ background: "rgba(244,239,226,0.2)" }}
          />
          <div
            className="h-9 sm:h-11 rounded mb-4"
            style={{ background: "rgba(244,239,226,0.24)" }}
          />
          <div
            className="h-3.5 rounded w-3/4 mx-auto"
            style={{ background: "rgba(244,239,226,0.16)" }}
          />
        </div>
      </section>

      {/* Step indicator */}
      <div
        className="border-b"
        style={{ background: "var(--bg)", borderColor: "var(--line-soft)" }}
      >
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-4 flex items-center justify-center gap-3">
          <div className="h-5 w-28 rounded" style={{ background: "var(--bg-deep)" }} />
          <span style={{ color: "var(--line)" }}>—</span>
          <div className="h-5 w-28 rounded" style={{ background: "var(--bg-deep)" }} />
        </div>
      </div>

      {/* Sidebar + grid picker */}
      <div
        className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 max-w-[1920px] mx-auto"
        style={{ background: "var(--bg)", paddingTop: "48px", paddingBottom: "60px" }}
      >
        <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start">
          <div
            className="hidden lg:block flex-shrink-0 rounded-sm border"
            style={{ width: "364px", borderColor: "var(--line)" }}
          >
            <div className="p-5 space-y-6">
              <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
              <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
              <div className="h-8 rounded" style={{ background: "var(--bg-deep)" }} />
            </div>
          </div>
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-sm overflow-hidden" style={{ borderColor: "var(--line)" }}>
                <div style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                <div className="p-5 sm:p-6">
                  <div className="h-4 w-2/3 rounded mb-3" style={{ background: "var(--bg-deep)" }} />
                  <div className="h-9 rounded" style={{ background: "var(--bg-deep)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
