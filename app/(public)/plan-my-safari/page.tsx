import type { Metadata } from "next";
import { Phone, MessageSquare } from "lucide-react";
import SafariPlanForm from "@/components/forms/SafariPlanForm";
import {
  BreadcrumbSchema,
  LocalBusinessSchema,
} from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Plan My Safari — Free Custom Itinerary | Divine Travel Nest Safaris",
  description:
    "Tell us your dates and interests. We draft a tailor-made itinerary with transparent pricing — fast response guaranteed. Or pick up the phone: +254 722-595-916.",
  alternates: { canonical: "/plan-my-safari" },
  openGraph: {
    title: "Plan My Safari — Divine Travel Nest Safaris",
    description:
      "Free personalised safari proposals within 24 hours. No obligations.",
    type: "website",
  },
};

const contactDetails = [
  { lbl: "Phone", val: "+254 722-595-916", href: "tel:+254722595916" },
  {
    lbl: "Email",
    val: "info@divinetravelnestsafaris.com",
    href: "mailto:info@divinetravelnestsafaris.com",
  },
  { lbl: "Office", val: "Nairobi, Kenya" },
  {
    lbl: "TripAdvisor",
    val: "Read our reviews ↗",
    href: "https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html",
    external: true,
  },
  {
    lbl: "Google",
    val: "Google Reviews ↗",
    href: "https://share.google/hr0uDk89EOkgVPDGh",
    external: true,
    last: true,
  },
];

export default function PlanSafariPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Plan My Safari", href: "/plan-my-safari" },
        ]}
      />
      <LocalBusinessSchema />

      <PageHero
        image="https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Plan your African safari"
        minHeight="min-h-[60vh]"
        imageOpacity={0.45}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Plan My Safari" },
        ]}
        eyebrow="Start here"
        title={
          <>
            Let&apos;s plan your
            <br />
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              perfect safari
            </em>
            .
          </>
        }
        description="Share your travel dates and what you dream of seeing in the wild. We’ll craft a bespoke safari itinerary with honest, transparent pricing from the start. Ready to bring your African adventure to life? Let's connect, or skip the forms and call us directly at +254 722 595 916."
        actions={
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="tel:+254722595916"
              className="inline-flex items-center gap-2 px-5 py-3 bg-bone-clay text-bone-paper rounded-full text-sm font-sans font-medium hover:bg-[#c0612e] transition-colors"
            >
              <Phone size={15} /> Call us now
            </a>
            <a
              href="https://wa.me/254722595916"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 border border-bone-paper/35 text-bone-paper rounded-full text-sm font-sans hover:bg-bone-paper/10 transition-colors"
            >
              <MessageSquare size={15} /> WhatsApp
            </a>
          </div>
        }
      />

      {/* Contact body */}
      <section className="py-24 sm:py-32 bg-bone-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: contact side */}
            <Reveal>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Reach us directly
              </div>
              <h2 className="font-serif font-light text-[clamp(2.5rem,5vw,4rem)] leading-[1] tracking-[-0.02em] mt-4 mb-6">
                Reservation
                <br />
                by <em className="italic text-bone-clay">phone</em>, email
                <br />
                or message.
              </h2>
              <p className="text-bone-muted text-[17px] leading-[1.65] mb-9 max-w-[52ch]">
                We believe a great safari is a seamless blend of untamed
                wilderness and meticulous design. From tracking the Great
                Migration across the savannah to securing the perfect hidden
                bush camp, we handle the logistics so you can focus on the
                moment. Every itinerary is entirely bespoke, crafted by experts
                who know the rhythm of the wild and the nuances of the terrain,
                ensuring an unforgettable journey into the heart of Africa.
              </p>

              <div>
                {contactDetails.map(({ lbl, val, href, external, last }) => (
                  <div
                    key={lbl}
                    className={`grid grid-cols-[120px_1fr] gap-4 py-4 border-t border-[rgba(23,22,18,0.14)] ${last ? "border-b" : ""}`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-bone-muted pt-1">
                      {lbl}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="font-serif italic text-[22px] leading-tight border-b border-bone-clay pb-0.5 w-fit hover:text-bone-clay transition-colors"
                      >
                        {val}
                      </a>
                    ) : (
                      <span className="font-serif italic text-[22px] leading-tight">
                        {val}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </Reveal>

            {/* Right: form */}
            <Reveal delay={0.1}>
            <div className="bg-bone-paper border border-[rgba(23,22,18,0.10)] p-8 sm:p-10">
              <h3 className="font-serif font-normal text-[28px] mb-1.5">
                Request a <em className="italic text-bone-clay">free</em> custom
                quote
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-bone-muted mb-8">
                Fast response guaranteed
              </p>
              <SafariPlanForm />
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="py-12 bg-bone-forest text-bone-paper border-t border-bone-paper/10">
        <div className="container-site">
          <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { num: "500+", lbl: "Safaris delivered" },
              { num: "4.9★", lbl: "Average guest rating" },
              { num: "24h", lbl: "Proposal turnaround" },
              { num: "100%", lbl: "Custom itineraries" },
            ].map((s) => (
              <RevealItem key={s.lbl}>
                <div className="font-serif text-3xl sm:text-4xl text-[#f4d4a8] leading-none mb-1">
                  {s.num}
                </div>
                <div className="text-xs text-bone-paper/55 font-mono uppercase tracking-[0.1em]">
                  {s.lbl}
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
