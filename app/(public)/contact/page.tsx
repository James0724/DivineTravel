import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import {
  BreadcrumbSchema,
  LocalBusinessSchema,
} from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Contact Us — Plan Your Safari | Divine Travel Nest Safaris",
  description:
    "Get in touch with our safari experts in Nairobi. Free personalised safari proposals within 24 hours — call, WhatsApp or email us to start planning your East Africa adventure.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Divine Travel Nest Safaris",
    description:
      "Free personalised safari proposals within 24 hours. No obligations.",
    type: "website",
  },
};

const contactInfo = [
  {
    icon: Phone,
    label: "Phone & WhatsApp",
    value: "+254 722-595-916",
    href: "tel:+254722595916",
    sub: "Mon–Sat, 8am–6pm EAT",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@divinetravelnestsafaris.com",
    href: "mailto:info@divinetravelnestsafaris.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Nairobi, Kenya",
    href: undefined,
    sub: "East Africa HQ",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon–Sat, 8am–6pm EAT",
    href: undefined,
    sub: "UTC +3",
  },
];

const quickFaqs = [
  {
    q: "How far in advance should I book?",
    a: "3–6 months is ideal for peak season (Jul–Oct, Jan–Mar).",
  },
  {
    q: "Is a visa required?",
    a: "Most nationalities need a visa for Kenya/Tanzania — we guide you through the process.",
  },
  {
    q: "What's the deposit?",
    a: "A 30% deposit confirms your booking; the balance is due 60 days before departure.",
  },
  {
    q: "Do you handle gorilla permits for Uganda?",
    a: "Yes — we source permits for all our Uganda clients. Permits must be booked months in advance.",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Tell us your dream",
    desc: "Share your dates, budget, interests and who's travelling. No obligation.",
  },
  {
    num: "02",
    title: "We craft your itinerary",
    desc: "A dedicated consultant builds your personalised safari plan within 24 hours.",
  },
  {
    num: "03",
    title: "Refine & confirm",
    desc: "We adjust until it's perfect. Then a 30% deposit secures everything.",
  },
  {
    num: "04",
    title: "Arrive & be guided",
    desc: "Our local team meets you on arrival and takes care of every detail.",
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <LocalBusinessSchema />

      <PageHero
        image="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1800&q=80"
        imageAlt="Plan your African safari"
        minHeight="min-h-[60vh]"
        imageOpacity={0.45}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Get in touch"
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
        description="Free personalised proposal within 24 hours. No obligations. Our experts are on the ground in East Africa — we know these parks from the inside."
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

      {/* How we work */}
      <section className="py-16 sm:py-20 bg-bone-paper border-b border-[rgba(23,22,18,0.08)]">
        <div className="container-site">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {processSteps.map((step) => (
              <div key={step.num} className="text-center sm:text-left">
                <div className="font-mono text-3xl text-bone-clay/30 font-light mb-3">
                  {step.num}
                </div>
                <h3 className="font-serif text-lg text-bone-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-bone-muted leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 sm:py-24 bg-bone-bg">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: Contact info + FAQ */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  Contact details
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-bone-ink mt-3 mb-3">
                  We&apos;d love to
                  <br />
                  hear from you.
                </h2>
                <p className="text-bone-ink/65 leading-relaxed text-sm">
                  Whether you have a specific safari in mind or are just
                  starting to dream, our team is here to help craft the perfect
                  East African adventure.
                </p>
              </div>

              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href, sub }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 bg-bone-paper border border-[rgba(23,22,18,0.09)] rounded-sm p-4"
                  >
                    <div className="w-10 h-10 rounded bg-bone-forest/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-bone-forest" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-bone-ink/45 mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm text-bone-ink font-sans font-medium hover:text-bone-clay transition-colors"
                          target={
                            href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-bone-ink font-sans font-medium">
                          {value}
                        </p>
                      )}
                      {sub && (
                        <p className="text-xs text-bone-muted font-sans mt-0.5">
                          {sub}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-[0.1em] text-bone-muted hover:text-bone-clay transition-colors border border-[rgba(23,22,18,0.15)] px-3 py-2 rounded"
                >
                  TripAdvisor Reviews ↗
                </a>
                <a
                  href="https://share.google/hr0uDk89EOkgVPDGh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-[0.1em] text-bone-muted hover:text-bone-clay transition-colors border border-[rgba(23,22,18,0.15)] px-3 py-2 rounded"
                >
                  Google Reviews ↗
                </a>
              </div>

              <div className="bg-bone-paper border border-[rgba(23,22,18,0.10)] rounded-sm p-5">
                <h3 className="font-serif text-base font-semibold text-bone-ink mb-4">
                  Quick answers
                </h3>
                <ul className="divide-y divide-[rgba(23,22,18,0.08)]">
                  {quickFaqs.map(({ q, a }) => (
                    <li key={q} className="py-3">
                      <p className="text-xs font-sans font-semibold text-bone-ink mb-1">
                        {q}
                      </p>
                      <p className="text-xs text-bone-ink/55 font-sans leading-relaxed">
                        {a}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <div className="bg-bone-paper border border-[rgba(23,22,18,0.10)] rounded-sm p-6 sm:p-8">
                <div className="eyebrow mb-4">
                  <span className="dot" />
                  Send us a message
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-bone-ink mb-2">
                  Tell us about
                  <br />
                  your <em className="italic text-bone-clay">dream safari</em>.
                </h2>
                <p className="text-bone-ink/55 text-sm leading-relaxed mb-7">
                  Share your dates, budget, wildlife interests and who&apos;s
                  coming — we&apos;ll build a personalised itinerary and send it
                  within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="py-12 bg-bone-forest text-bone-paper border-t border-bone-paper/10">
        <div className="container-site">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { num: "500+", lbl: "Safaris delivered" },
              { num: "4.9★", lbl: "Average guest rating" },
              { num: "24h", lbl: "Proposal turnaround" },
              { num: "100%", lbl: "Custom itineraries" },
            ].map((s) => (
              <div key={s.lbl}>
                <div className="font-serif text-3xl sm:text-4xl text-[#f4d4a8] leading-none mb-1">
                  {s.num}
                </div>
                <div className="text-xs text-bone-paper/55 font-mono uppercase tracking-[0.1em]">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
