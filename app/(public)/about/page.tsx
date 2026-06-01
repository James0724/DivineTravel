import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FaqSchema,
  OrganizationSchema,
  BreadcrumbSchema,
} from "@/components/seo/StructuredData";
import WhyGrid from "@/components/ui/WhyGrid";
import SectionFaq from "@/components/ui/SectionFaq";
import CtaBand from "@/components/ui/CtaBand";
import PageHero from "@/components/ui/PageHero";
import { MessageSquare, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Divine Travel Nest Safaris — Kenya-Based Safari Company",
  description:
    "A Kenya-based, woman-led safari house planning unforgettable journeys across Kenya, Tanzania and Uganda — one traveller at a time. Learn our story, values, and meet the team.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Divine Travel Nest Safaris",
    description:
      "A Kenya-based, woman-led safari house planning unforgettable journeys across Kenya, Tanzania and Uganda — one traveller at a time.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Golden-hour savannah, East Africa",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Divine Travel Nest Safaris",
    description:
      "A Kenya-based, woman-led safari house planning unforgettable journeys across East Africa.",
    images: [
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

const whyItems = [
  {
    n: "i",
    title: (
      <>
        Tailored <em className="italic text-bone-clay">experiences</em>
      </>
    ),
    body: "Every traveller is different, so every journey is built from scratch around your pace, your interests and your budget. No two of our itineraries are the same.",
  },
  {
    n: "ii",
    title: (
      <>
        Comfort &amp; <em className="italic text-bone-clay">safety</em>
      </>
    ),
    body: "Hand-picked lodges and tented camps, a well-maintained 4×4 fleet, and trained staff watching over every mile — luxury, authenticity and real peace of mind.",
  },
  {
    n: "iii",
    title: (
      <>
        Conservation &amp; <em className="italic text-bone-clay">community</em>
      </>
    ),
    body: "We partner with local conservation initiatives and community projects, so your adventure helps protect Africa's wildlife and empowers the people who live alongside it.",
  },
  {
    n: "iv",
    title: (
      <>
        Transparent &amp; <em className="italic text-bone-clay">affordable</em>
      </>
    ),
    body: "No hidden fees — just clear, honest pricing and genuine value. Unforgettable wildlife experiences, without the inflated mark-ups.",
  },
  {
    n: "v",
    title: (
      <>
        Trusted local <em className="italic text-bone-clay">expertise</em>
      </>
    ),
    body: "Deep regional knowledge and connections, and driver-guides licensed by the Kenya Professional Safari Guides Association. Authentic experiences, rooted in the ground itself.",
  },
  {
    n: "vi",
    title: (
      <>
        The divine <em className="italic text-bone-clay">touch</em>
      </>
    ),
    body: "The small, thoughtful details in every trip — the personal attention and meticulous planning that turn a holiday into a soulful African adventure.",
  },
];

const standoutItems = [
  {
    ic: "i",
    title: (
      <>
        One <em className="italic text-bone-clay">planner</em>, beginning to end
      </>
    ),
    body: "Your safari curator designs the itinerary by hand and stays with it — no call centre, no handing you between departments.",
  },
  {
    ic: "ii",
    title: (
      <>
        KPSGA-<em className="italic text-bone-clay">licensed</em> guides &amp;
        drivers
      </>
    ),
    body: "Every guide and driver is certified by the Kenya Professional Safari Guides Association — expert tracking, real wildlife knowledge, and a genuine passion for Africa.",
  },
  {
    ic: "iii",
    title: (
      <>
        100+ routes, all <em className="italic text-bone-clay">flexible</em>
      </>
    ),
    body: "Over a hundred East Africa packages to begin from — and every one rewritable to fit your dates, your style and your budget.",
  },
  {
    ic: "iv",
    title: (
      <>
        24/7 <em className="italic text-bone-clay">support</em>, before &amp;
        after
      </>
    ),
    body: "A real person at the other end of the line throughout your journey and beyond, on +254 724-163-662 — so the logistics simply disappear.",
  },
];

const team = [
  {
    name: "John Mwangi",
    role: "Founder",
    bio: "Started Divine Travel Nest from a simple dream — to share the soul of the wild with the world. Still the standard every safari is measured against.",
    photo:
      "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-18-at-12.05.59-780x520.jpeg",
  },
  {
    name: "Janet Wanjiru",
    role: "Chief Executive",
    bio: "Leads the house day to day. The reason Divine Travel Nest is a woman-led company built on integrity, warmth and an obsession with the details.",
    photo:
      "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-18-at-12.04.19-550x825.jpeg",
  },
  {
    name: "James Kahoro",
    role: "Safari Curator · Your Planner",
    bio: "Your safari planner. Designs each itinerary by hand around your dates, your budget and the wildlife you have come all this way to see.",
    photo:
      "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-18-at-12.05.06-550x825.jpeg",
  },
];

const faqs = [
  {
    q: "What is the best time to visit for wildlife?",
    a: "The dry seasons (Jan–Mar and Jul–Oct) offer the best wildlife visibility. July–October coincides with the Great Migration in the Masai Mara and Serengeti.",
  },
  {
    q: "Are your safaris suitable for children?",
    a: "Absolutely. We tailor itineraries for families. Most parks allow children of all ages in vehicles; some walking safaris have a minimum age of 12.",
  },
  {
    q: "What is included in the price?",
    a: "All tiers include park fees, professional guiding, meals per the itinerary, and airport transfers. Flights and visas are additional.",
  },
  {
    q: "How do you support conservation?",
    a: "We partner with community conservancies, donate a percentage of every booking to anti-poaching programs, and use low-impact camping practices.",
  },
  {
    q: "Can I customise my itinerary?",
    a: "Yes — every safari we create is bespoke. Tell us your interests, budget, and travel dates and we build around you.",
  },
  {
    q: "What currencies do you accept?",
    a: "We accept USD, EUR, GBP, and local currencies. Payments are made via bank transfer, card, or M-Pesa (Kenya).",
  },
];

const certs = [
  "Kenya Professional Safari Guides Assoc.",
  "Eco-Tourism Kenya",
  "Licensed Tour Operator",
  "TripAdvisor Reviewed",
  "Google Reviews",
  "SafariBookings Listed",
];

export default function AboutPage() {
  return (
    <>
      {/* ── Structured data ────────────────────────────────────────────── */}
      <OrganizationSchema />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "About Us", href: "/about" },
        ]}
      />

      <PageHero
        image="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80"
        imageAlt="About us section Image"
        minHeight="min-h-[60vh]"
        imageOpacity={0.45}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
        ]}
        eyebrow="About us"
        title={
          <>
            We are
            <br />
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>
              Divine Travel Nest
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

      {/* ── 1. LEAD ─────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg py-24 sm:py-28 lg:py-32">
        <div className="container-site">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-bone-clay mb-8">
            African. Safari. Experts.{" "}
            <span className="text-bone-muted">
              — let us handle the planning, you make the memories.
            </span>
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-20 items-end">
            <h1
              className="font-serif font-light leading-[0.92] tracking-[-0.028em] text-bone-ink"
              style={{ fontSize: "clamp(52px, 7.6vw, 120px)" }}
            >
              We are
              <br />
              Divine <em className="italic text-bone-clay">Travel&nbsp;Nest</em>
              .
            </h1>
            <div>
              <p className="text-[18px] leading-[1.62] text-bone-ink">
                A Kenya-based,{" "}
                <strong className="font-medium">woman-led</strong> safari house,
                planning unforgettable journeys across Kenya, Tanzania and
                Uganda — one traveller at a time.
              </p>
              <p className="text-[15px] leading-[1.62] text-bone-muted mt-4">
                Founded from a simple dream: to connect people to the soul of
                the wild. The team who answer your first message are the same
                people who design your route and stay with you to the last game
                drive.
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-bone-forest text-bone-paper rounded-full text-[14px] tracking-[0.01em] transition-all duration-200 hover:bg-bone-clay hover:-translate-y-0.5"
                >
                  Plan my safari →
                </Link>
                <div className="font-mono text-[13px] text-bone-ink tracking-[0.03em]">
                  <span className="block text-[9px] tracking-[0.16em] uppercase text-bone-muted mb-0.5">
                    Talk to us
                  </span>
                  +254 722-595-916
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PORTRAIT ─────────────────────────────────────────────────── */}
      <section className="bg-bone-bg pb-3">
        <div className="container-site">
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "16 / 6.6", background: "#e4dbd0" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1700&q=70"
              alt="Golden-hour savannah, East Africa — Divine Travel Nest Safaris"
              fill
              sizes="100vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-wrap justify-between gap-2 pt-4 font-mono text-[10px] tracking-[0.14em] uppercase text-bone-muted">
            <span>Spur Mall · Nairobi, Kenya</span>
            <span>Woman-led · Kenya · Tanzania · Uganda</span>
          </div>
        </div>
      </section>

      {/* ── 3. STORY ─────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "118px 0" }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-10 lg:gap-24 items-start">
            {/* Left — eyebrow + heading */}
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Our story
              </div>
              <h2
                className="font-serif font-normal leading-[1.0] tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(36px, 4.2vw, 58px)" }}
              >
                Born from a dream
                <br />
                of the <em className="italic text-bone-clay">wild</em>.
              </h2>
            </div>

            {/* Right — body */}
            <div>
              <p className="font-serif italic text-[20px] leading-[1.55] text-bone-ink mb-5">
                Divine Travel Nest Safaris was born from a simple dream — to
                create unforgettable journeys that connect people to the soul of
                the wild.
              </p>
              <p className="text-[16px] leading-[1.72] text-bone-muted mb-5">
                We are a{" "}
                <strong className="text-bone-ink font-medium">
                  Kenya-based, woman-led safari company
                </strong>
                , built on a deep commitment to excellence, integrity and
                genuinely personal service. We specialise in{" "}
                <strong className="text-bone-ink font-medium">
                  Kenya safaris
                </strong>
                ,{" "}
                <strong className="text-bone-ink font-medium">
                  Tanzania safaris
                </strong>
                , combined{" "}
                <strong className="text-bone-ink font-medium">
                  Kenya–Tanzania circuits
                </strong>{" "}
                and{" "}
                <strong className="text-bone-ink font-medium">
                  Uganda gorilla trekking
                </strong>{" "}
                — the routes we know intimately rather than a catalogue of
                everywhere.
              </p>
              <p className="text-[16px] leading-[1.72] text-bone-muted mb-9">
                Every itinerary is guided by your desires: chasing sunsets
                across the savannah, tracking elephants over golden plains, or
                unwinding at a lodge beneath the stars. Our planners and locally
                born guides know every corner of East Africa — and with us, you
                are never just a traveller. You are family.
              </p>

              {/* Mission box */}
              <div
                className="bg-bone-paper"
                style={{
                  padding: "28px 30px",
                  border: "1px solid rgba(31,29,24,0.14)",
                }}
              >
                <span className="block font-mono text-[10px] tracking-[0.16em] uppercase text-bone-clay mb-3">
                  Our mission
                </span>
                <p className="font-serif italic text-[24px] leading-[1.32] text-bone-ink">
                  To craft experience-rich, safe and genuinely good-value
                  African safaris that bring you closer to the wildlife, the
                  people and the magic of East Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. STATS ─────────────────────────────────────────────────────── */}
      <section
        className="bg-bone-paper"
        style={{
          borderTop: "1px solid rgba(31,29,24,0.14)",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: "rgba(31,29,24,0.14)" }}
          >
            {/* 100+ */}
            <div
              className="bg-bone-paper flex flex-col gap-3"
              style={{ padding: "56px 36px" }}
            >
              <div
                className="font-serif font-light leading-[0.88] tracking-[-0.02em] text-bone-ink"
                style={{ fontSize: "clamp(52px, 5vw, 80px)" }}
              >
                <em className="italic text-bone-clay">100</em>+
              </div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-bone-muted leading-[1.55]">
                Safari packages
                <br />
                across East Africa
              </div>
            </div>
            {/* 3 */}
            <div
              className="bg-bone-paper flex flex-col gap-3"
              style={{ padding: "56px 36px" }}
            >
              <div
                className="font-serif font-light leading-[0.88] tracking-[-0.02em] text-bone-ink"
                style={{ fontSize: "clamp(52px, 5vw, 80px)" }}
              >
                3
              </div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-bone-muted leading-[1.55]">
                Countries — Kenya
                <br />
                Tanzania · Uganda
              </div>
            </div>
            {/* 24/7 */}
            <div
              className="bg-bone-paper flex flex-col gap-3"
              style={{ padding: "56px 36px" }}
            >
              <div
                className="font-serif font-light leading-[0.88] tracking-[-0.02em] text-bone-ink"
                style={{ fontSize: "clamp(52px, 5vw, 80px)" }}
              >
                <em className="italic text-bone-clay">24</em>/7
              </div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-bone-muted leading-[1.55]">
                Support — before,
                <br />
                during &amp; after
              </div>
            </div>
            {/* 100% */}
            <div
              className="bg-bone-paper flex flex-col gap-3"
              style={{ padding: "56px 36px" }}
            >
              <div
                className="font-serif font-light leading-[0.88] tracking-[-0.02em] text-bone-ink"
                style={{ fontSize: "clamp(52px, 5vw, 80px)" }}
              >
                100%
              </div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-bone-muted leading-[1.55]">
                Tailor-made
                <br />
                itineraries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VALUES ────────────────────────────────────────────────────── */}
      <WhyGrid
        eyebrow="What we stand for"
        heading={
          <>
            The things we
            <br />
            <em className="italic text-bone-clay">won&apos;t</em> compromise on.
          </>
        }
        description="A safari is a great deal of trust to hand a stranger. These are the principles that earn it — and the reason our guests come back, and send their friends, by name."
        items={whyItems}
        bg="bg-bone-bg"
      />

      {/* ── 6. STANDOUT ──────────────────────────────────────────────────── */}
      <section
        className="bg-bone-paper"
        style={{
          padding: "140px 0",
          borderTop: "1px solid rgba(31,29,24,0.14)",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4 / 5" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=70"
                alt="Open-roof safari Land Cruiser — Divine Travel Nest Safaris"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Why travellers choose us
              </div>
              <h2
                className="font-serif font-normal leading-[1.0] tracking-[-0.02em] text-bone-ink mt-4 mb-4"
                style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
              >
                One <em className="italic text-bone-clay">house</em>,
                <br />
                start to finish.
              </h2>
              <p
                className="text-[15px] leading-[1.65] text-bone-muted mb-8"
                style={{ maxWidth: "48ch" }}
              >
                The practical promises behind the brochure — the things that
                make a Divine Travel Nest safari run smoothly from the first
                email to the drive back to the airport.
              </p>

              {/* Feature list */}
              <div className="flex flex-col">
                {standoutItems.map((f, i) => (
                  <div
                    key={f.ic}
                    className="py-6 border-t grid gap-[18px] items-start"
                    style={{
                      borderColor: "rgba(31,29,24,0.14)",
                      gridTemplateColumns: "36px 1fr",
                      borderBottom:
                        i === standoutItems.length - 1
                          ? "1px solid rgba(31,29,24,0.14)"
                          : undefined,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif italic text-[16px] flex-shrink-0"
                      style={{ background: "#9d4519" }}
                    >
                      {f.ic}
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-[22px] text-bone-ink mb-1 leading-[1.1]">
                        {f.title}
                      </h4>
                      <p className="text-[14px] leading-[1.55] text-bone-muted">
                        {f.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. TEAM ──────────────────────────────────────────────────────── */}
      <section className="bg-bone-bg" style={{ padding: "120px 0" }}>
        <div className="container-site">
          <div className="section-hd" style={{ marginBottom: "72px" }}>
            <div>
              <div className="eyebrow">
                <span className="dot" />
                Meet the team
              </div>
              <h2
                className="font-serif font-normal leading-[1.0] tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 72px)" }}
              >
                The people who
                <br />
                <em className="italic text-bone-clay">answer</em> your call.
              </h2>
            </div>
            <p
              className="text-[15px] leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              The advantage of a small, family-run house is that you actually
              meet the people running your trip — the team on the other end of
              your emails, your radio and your wake-up call.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
            {team.map((member) => (
              <div key={member.name} className="group">
                <div
                  className="relative overflow-hidden mb-5"
                  style={{ aspectRatio: "4 / 5", background: "#e4dbd0" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photo}
                    alt={`${member.name}, ${member.role} — Divine Travel Nest Safaris`}
                    className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-[1.03]"
                    style={{ filter: "sepia(0.12) contrast(1.03)" }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className="font-serif italic text-[30px] leading-[1.05] text-bone-ink mb-1">
                  {member.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-clay mb-3">
                  {member.role}
                </p>
                <p
                  className="text-[14px] leading-[1.6] text-bone-muted"
                  style={{ maxWidth: "38ch" }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CREDENTIALS ───────────────────────────────────────────────── */}
      <section
        className="bg-bone-paper"
        style={{
          padding: "96px 0 110px",
          borderTop: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="text-center mb-12">
            <div className="eyebrow justify-center mb-4">
              <span className="dot" />
              Licensed &amp; reviewed
            </div>
            <h2
              className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-bone-ink mt-4"
              style={{ fontSize: "clamp(30px, 3.4vw, 46px)" }}
            >
              Certified, registered, and vouched for
              <br className="hidden sm:block" />
              by the people who <em className="italic text-bone-clay">count</em>
              .
            </h2>
          </div>

          <div
            className="flex flex-wrap justify-center gap-3"
            style={{ maxWidth: "940px", margin: "0 auto" }}
          >
            {certs.map((cert) => (
              <span
                key={cert}
                className="font-mono text-[12px] tracking-[0.07em] uppercase text-bone-forest-soft px-5 py-3 rounded-full bg-bone-bg"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────────────────── */}
      <SectionFaq
        id="faq"
        eyebrow="Common questions"
        heading={
          <>
            Your questions,
            <br />
            <em className="italic text-bone-clay">answered</em>.
          </>
        }
        contactNote={
          <>
            Still not sure? Call us on{" "}
            <a
              href="tel:+254722595916"
              className="text-bone-clay hover:underline"
            >
              +254 722-595-916
            </a>{" "}
            or{" "}
            <a href="/contact" className="text-bone-clay hover:underline">
              send a message
            </a>
            .
          </>
        }
        faqs={faqs}
      />

      {/* ── 10. CTA BAND ─────────────────────────────────────────────────── */}
      <CtaBand
        variant="large"
        heading={
          <>
            Ready to start your
            <br />
            African adventure?
          </>
        }
        description="Tell us your dates, your dream wildlife and your budget — we will design an itinerary around you and send a transparent quote within 24 hours."
        buttonText="Plan my safari →"
        buttonHref="/contact"
      />
    </>
  );
}
