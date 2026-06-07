import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BreadcrumbSchema,
  FaqSchema,
  CollectionPageSchema,
} from "@/components/seo/StructuredData";
import connectDB from "@/lib/db/mongoose";
import SafariModel from "@/lib/db/models/Safari";
import PkgCard from "@/components/safaris/PkgCard";
import PageHero from "@/components/ui/PageHero";
import JumpNav from "@/components/ui/JumpNav";
import SectionFaq from "@/components/ui/SectionFaq";
import CtaBand from "@/components/ui/CtaBand";
import type { Safari } from "@/types";

export const metadata: Metadata = {
  title: "Rwanda Safari Packages 2026/2027 — Gorillas, Nyungwe & Akagera",
  description:
    "Book Rwanda gorilla trekking tours in Volcanoes National Park, chimp tracking in Nyungwe Forest and Big Five safaris in Akagera. Expert-guided, luxury-focused Rwanda safari packages.",
  keywords:
    "rwanda gorilla trekking, volcanoes national park, nyungwe forest, akagera national park, rwanda safari 2026",
  alternates: { canonical: "/safaris/rwanda" },
  openGraph: {
    title: "Rwanda Safari Packages | Divine Travel Nest Safaris",
    description:
      "Rwanda gorilla trekking, Nyungwe chimps & Akagera Big Five — 2026/2027.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Mountain gorilla in Volcanoes National Park, Rwanda",
      },
    ],
  },
};

const trekSteps = [
  {
    n: "Step 01",
    time: "6:30 AM",
    title: "Briefing at HQ",
    body: "Rangers at Kinigi headquarters assign you to a gorilla family and brief your group on etiquette and safety rules.",
  },
  {
    n: "Step 02",
    time: "7:00 AM",
    title: "Start trek",
    body: "You hike into the Virunga volcanoes with expert guides and trackers who have already located the family's morning position.",
  },
  {
    n: "Step 03",
    time: "1–4 hrs",
    title: "Through the forest",
    body: "Trails wind through bamboo, hagenia forest and stinging nettles — the scenery is extraordinary even before you find the gorillas.",
  },
  {
    n: "Step 04",
    time: "One hour",
    title: "With the gorillas",
    body: "One strictly protected hour with the family — silverbacks, mothers, playful juveniles — just seven metres away.",
  },
  {
    n: "Step 05",
    time: "Certificate",
    title: "Awarded at end",
    body: "You return with a trekking certificate and an encounter that almost everyone describes as the most moving wildlife experience of their lives.",
  },
];

const permitPrices = [
  { who: "Foreign non-residents", note: "Standard permit", amount: "$1,500" },
  { who: "Foreign residents", note: "Valid Rwanda residency", amount: "$1,000" },
  { who: "East African citizens", note: "EAC nationals", amount: "RWF 200k" },
];

const permitIncludes = [
  "Gorilla tracking",
  "Ranger guides",
  "Park entry",
  "Conservation fees",
  "Security escort",
];

const trekFacts = [
  { k: "Difficulty", v: "Moderate–Strenuous" },
  { k: "Terrain", v: "Volcanic slopes & bamboo" },
  { k: "Altitude", v: "2,400–3,000 m" },
  { k: "Trekking time", v: "1–5 hours" },
  { k: "Viewing distance", v: "7 metres" },
  { k: "Time with gorillas", v: "One full hour" },
];

const whatToCarry = [
  "Hiking boots",
  "Long trousers",
  "Long-sleeved shirt",
  "Rain jacket",
  "Gardening gloves",
  "Gaiters",
  "Water bottle",
  "Energy snacks",
  "Hat & sunscreen",
  "Camera — no flash",
];

const tiers = [
  {
    level: "Mid-range",
    price: "$400–$650",
    unit: "per person · per day",
    lodges: [
      "Mountain Gorilla View Lodge",
      "Gorilla's Nest Lodge",
      "Comfortable rooms with Virunga views",
    ],
  },
  {
    level: "Luxury",
    price: "$750–$1,800",
    unit: "per person · per day",
    lodges: [
      "Bisate Lodge · Singita",
      "One&Only Gorilla's Nest",
      "Private decks, forest immersion, fine dining",
    ],
  },
  {
    level: "Ultra-luxury",
    price: "$1,800+",
    unit: "per person · per day",
    lodges: [
      "Singita Kwitonda Lodge",
      "Magashi Camp (Akagera)",
      "Rwanda's most exclusive, intimate properties",
    ],
  },
];

const faqs = [
  {
    q: "How much does a Rwanda gorilla permit cost?",
    a: "A gorilla trekking permit in Rwanda costs $1,500 per person per trek (2026 rates). While this is higher than Uganda's $800 permit, Rwanda offers a highly curated, luxury experience with fewer trekkers, well-maintained trails and excellent lodge infrastructure around Volcanoes National Park.",
  },
  {
    q: "Rwanda or Uganda — which is better for gorilla trekking?",
    a: "Both are excellent. Rwanda offers a smoother, more luxury-oriented experience with premium lodges, shorter treks and easier access from Kigali. Uganda offers more gorilla families, lower permit prices and a wider wildlife circuit. Many travellers combine both on a cross-border itinerary.",
  },
  {
    q: "How far in advance should I book Rwanda gorilla permits?",
    a: "Six to twelve months ahead for peak season (June–September, December–January). Rwanda's daily visitor quotas are strictly enforced — each of the 12 habituated families receives only 8 visitors per day. We secure permits for all our clients.",
  },
  {
    q: "What else can I do in Rwanda besides gorilla trekking?",
    a: "Rwanda combines beautifully with chimp tracking and the forest canopy walk in Nyungwe Forest National Park, and a Big Five safari in Akagera National Park on the Tanzania border. A 7–10 day Rwanda itinerary can include all three.",
  },
  {
    q: "Is Rwanda safe for safari travel?",
    a: "Rwanda is widely regarded as one of Africa's safest and best-governed destinations. Kigali is clean and well-organised, roads are good and tourist infrastructure is first-class. We have been running Rwanda safaris for years without incident.",
  },
  {
    q: "What is Nyungwe Forest and why should I visit?",
    a: "Nyungwe is one of Africa's oldest and most biodiverse montane rainforests — home to 13 primate species including habituated chimpanzees, Angolan colobus monkeys and L'Hoest's monkeys. The 70-metre-high canopy walkway is a highlight not found anywhere else in the region.",
  },
  {
    q: "What is the best time to visit Rwanda?",
    a: "The dry seasons — June to September and December to February — offer the best trekking conditions. Trails are firmer, visibility is good and there is less chance of rain on the volcanic slopes. Gorilla trekking runs year-round however.",
  },
  {
    q: "Can I combine Rwanda with Uganda or Tanzania?",
    a: "Absolutely. Kigali is served by direct flights to Entebbe (Uganda) and Kilimanjaro (Tanzania), and the border crossing into Uganda near Cyanika or Gatuna is straightforward. A Rwanda–Uganda gorilla circuit is one of our most popular multi-country itineraries.",
  },
];

const whyRwandaPoints = [
  {
    ic: "i",
    b: "12 habituated gorilla families",
    s: "in the Virunga Massif — part of a cross-border ecosystem with Uganda and DRC",
  },
  {
    ic: "ii",
    b: "Compact country, easy logistics",
    s: "— all three main parks are within 2–5 hours of Kigali International Airport",
  },
  {
    ic: "iii",
    b: "World-class luxury lodges",
    s: "— Rwanda has the finest gorilla trekking accommodation on the continent",
  },
  {
    ic: "iv",
    b: "Nyungwe canopy walkway",
    s: "— 70 metres above the forest floor, unique in East Africa",
  },
  {
    ic: "v",
    b: "Akagera's Big Five",
    s: "— rhinos reintroduced in 2017, making it the only Big Five park in Rwanda",
  },
];

export default async function RwandaSafarisPage() {
  let safaris: Safari[] = [];
  try {
    await connectDB();
    const rawSafaris = await SafariModel.find({
      "location.country": /rwanda/i,
      active: true,
    })
      .sort({ duration: 1 })
      .select(
        "name slug tagline location duration pricing images coverImage category difficulty featured active rating reviewCount",
      )
      .lean();
    safaris = JSON.parse(JSON.stringify(rawSafaris));
  } catch {
    // safaris remains []
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Safaris", href: "/safaris" },
          { name: "Rwanda Safaris", href: "/safaris/rwanda" },
        ]}
      />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <CollectionPageSchema
        name="Rwanda Safari Packages 2026/2027"
        description="Browse our Rwanda safari packages — gorilla trekking in Volcanoes NP, chimp tracking in Nyungwe Forest and Big Five safaris in Akagera. Budget to luxury, tailor-made."
        url="https://divinetravelnestsafaris.com/safaris/rwanda"
        items={safaris.map((s) => ({
          name: s.name,
          url: `https://divinetravelnestsafaris.com/safaris/${s.slug}`,
          description: s.tagline,
        }))}
      />

      <PageHero
        image="https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Mountain gorilla family in Volcanoes National Park, Rwanda"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tours & Safaris", href: "/safaris" },
          { label: "Rwanda Safaris" },
        ]}
        title={
          <>
            Rwanda gorilla
            <br />
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>trekking</em>.
          </>
        }
        description="Trek through the Virunga volcanoes to spend one unforgettable hour with wild mountain gorillas — Rwanda's most intimate and powerful wildlife experience."
        stats={[
          { num: "12", sup: "", lbl: "Habituated gorilla families" },
          { num: "3", sup: "", lbl: "Iconic national parks" },
          { num: "$1,500", sup: "", lbl: "Gorilla permit · premium access" },
        ]}
      />

      <CtaBand
        variant="large"
        heading={
          <>
            Trek the gorillas of{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>Volcanoes</em>.
          </>
        }
        description="Tell us your dates and we'll secure your permit, match you to the right family and lodge, and handle every transfer from Kigali. Free, no-obligation, answered by a real person."
        buttonText="Plan my Rwanda safari"
      />

      {/* Why Rwanda */}
      <section
        className="bg-bone-paper"
        style={{
          padding: "120px 0",
          borderTop: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 items-center">
            <div className="grid grid-cols-2 gap-4" style={{ aspectRatio: "1/1.1" }}>
              <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=600&q=80"
                  alt="Silverback gorilla in Volcanoes National Park, Rwanda"
                  width={400}
                  height={530}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden mt-10" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="https://images.pexels.com/photos/39857/leopard-leopard-spots-animal-wild-39857.jpeg?auto=compress&cs=tinysrgb&w=600&q=80"
                  alt="Wildlife in Akagera National Park, Rwanda"
                  width={400}
                  height={530}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Why Rwanda is unmissable
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-6"
                style={{ fontSize: "clamp(40px, 5.4vw, 68px)" }}
              >
                The land of a thousand{" "}
                <em className="italic text-bone-clay">hills</em>.
              </h2>
              <p
                className="text-[16px] leading-[1.65] text-bone-muted mb-8"
                style={{ maxWidth: "52ch" }}
              >
                Rwanda punches far above its size. In three distinct ecosystems
                — misty volcanoes, ancient rainforest and open savannah — you
                can tick off mountain gorillas, chimpanzees and the Big Five
                within a single week.
              </p>
              <ul>
                {whyRwandaPoints.map((t) => (
                  <li
                    key={t.ic}
                    className="py-4 grid items-start gap-3.5"
                    style={{
                      borderTop: "1px solid rgba(31,29,24,0.14)",
                      gridTemplateColumns: "32px 1fr",
                    }}
                  >
                    <div className="font-serif italic text-[18px] text-bone-clay pt-0.5">
                      {t.ic}
                    </div>
                    <div>
                      <strong className="font-medium text-sm text-bone-ink">
                        {t.b}
                      </strong>{" "}
                      <span className="text-[13px] text-bone-muted">
                        · {t.s}
                      </span>
                    </div>
                  </li>
                ))}
                <li
                  style={{
                    borderTop: "1px solid rgba(31,29,24,0.14)",
                    borderBottom: "1px solid rgba(31,29,24,0.14)",
                  }}
                />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Parks */}
      <section
        className="bg-bone-bg"
        style={{
          padding: "96px 0",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
            <JumpNav
              vertical
              label="On this page"
              links={[
                { label: "Volcanoes", href: "#rw-volcanoes" },
                { label: "Nyungwe", href: "#rw-nyungwe" },
                { label: "Akagera", href: "#rw-akagera" },
                { label: "The trek", href: "#rw-trek" },
                { label: "Permits", href: "#rw-permit" },
                { label: "What to pack", href: "#rw-fitness" },
                { label: "Where to stay", href: "#rw-stays" },
                { label: "Tours", href: "#rw-tours" },
                { label: "FAQs", href: "#rw-faq" },
              ]}
            />

            <div className="flex-1 min-w-0">
              <div className="section-hd" style={{ marginBottom: "72px" }}>
                <div>
                  <div className="eyebrow mb-4">
                    <span className="dot" />
                    Rwanda&apos;s national parks
                  </div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                    style={{ fontSize: "clamp(36px, 4.8vw, 68px)" }}
                  >
                    Three parks,{" "}
                    <em className="italic text-bone-clay">three worlds</em>.
                  </h2>
                </div>
                <p
                  className="text-sm leading-[1.65] text-bone-muted"
                  style={{ maxWidth: "56ch" }}
                >
                  Rwanda&apos;s three main safari parks are strikingly different
                  from each other — volcanic highlands, ancient rainforest and
                  open savannah all within a few hours of Kigali.
                </p>
              </div>

              {/* Volcanoes */}
              <article
                id="rw-volcanoes"
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "5/4", minHeight: "340px" }}
                >
                  <Image
                    src="https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                    alt="Mountain gorilla in Volcanoes National Park, Rwanda"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                    style={{ background: "var(--clay, #9d4519)" }}
                  >
                    01 · <strong>Volcanoes</strong>
                  </div>
                </div>
                <div className="p-5 sm:p-8 lg:p-11">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                    12 habituated families · Virunga Massif
                  </div>
                  <h3
                    className="font-serif font-normal leading-[1.05] tracking-[-0.01em] text-bone-ink mb-5"
                    style={{ fontSize: "clamp(24px, 3.5vw, 36px)" }}
                  >
                    Volcanoes{" "}
                    <em className="italic text-bone-clay">National Park</em>
                  </h3>
                  <p className="text-sm leading-[1.65] text-bone-muted mb-8">
                    The jewel of Rwanda — five dormant volcanoes rising above
                    2,400 metres, home to twelve habituated mountain gorilla
                    families. This is where Dian Fossey conducted her famous
                    research, and where some of the most moving wildlife
                    encounters on Earth take place daily. Golden monkey trekking
                    is an excellent add-on.
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    {[
                      {
                        heading: "Gorilla highlights",
                        items: [
                          "12 habituated families — daily treks available",
                          "Part of the Virunga ecosystem (Uganda, DRC)",
                        ],
                      },
                      {
                        heading: "Also in the park",
                        items: [
                          "Golden monkey trekking",
                          "Dian Fossey tomb hike · Karisimbi volcano",
                        ],
                      },
                    ].map((col) => (
                      <div key={col.heading}>
                        <h5 className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-3">
                          {col.heading}
                        </h5>
                        <ul className="text-[14px] text-bone-muted space-y-1.5">
                          {col.items.map((item) => (
                            <li
                              key={item}
                              style={{
                                paddingLeft: "14px",
                                borderLeft: "2px solid rgba(31,29,24,0.2)",
                              }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                    <span className="text-bone-muted">Best for</span>
                    <span className="text-bone-forest font-medium">
                      Gorilla & golden monkey trekking
                    </span>
                  </div>
                </div>
              </article>

              {/* Nyungwe */}
              <article
                id="rw-nyungwe"
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div className="order-2 lg:order-1 p-5 sm:p-8 lg:p-11">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                    13 primate species · Canopy walkway
                  </div>
                  <h3
                    className="font-serif font-normal leading-[1.05] tracking-[-0.01em] text-bone-ink mb-5"
                    style={{ fontSize: "clamp(24px, 3.5vw, 36px)" }}
                  >
                    Nyungwe Forest{" "}
                    <em className="italic text-bone-clay">National Park</em>
                  </h3>
                  <p className="text-sm leading-[1.65] text-bone-muted mb-8">
                    One of Africa&apos;s oldest and most biodiverse montane
                    rainforests, spread across Rwanda&apos;s south-west corner.
                    Nyungwe is home to habituated chimpanzees, thirteen primate
                    species and over 300 bird species. Its 70-metre-high canopy
                    walkway — a suspension bridge above the forest — is one of
                    the most unique experiences in East Africa.
                  </p>
                  <ul
                    className="text-[14px] text-bone-muted mb-8"
                    style={{ borderTop: "1px solid rgba(31,29,24,0.14)" }}
                  >
                    {[
                      "Habituated chimpanzee trekking",
                      "70-metre forest canopy walkway",
                      "Angolan colobus & L'Hoest's monkey",
                      "Over 300 bird species · 29 Albertine Rift endemics",
                    ].map((h) => (
                      <li
                        key={h}
                        className="py-3 relative pl-5"
                        style={{ borderBottom: "1px solid rgba(31,29,24,0.14)" }}
                      >
                        <span className="absolute left-0 top-3.5 text-bone-clay">
                          ›
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                    <span className="text-bone-muted">Best for</span>
                    <span className="text-bone-forest font-medium">
                      Chimps, canopy walk & birding
                    </span>
                  </div>
                </div>
                <div
                  className="relative overflow-hidden order-1 lg:order-2"
                  style={{ aspectRatio: "5/4", minHeight: "340px" }}
                >
                  <Image
                    src="https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                    alt="Chimpanzee in Nyungwe Forest National Park, Rwanda"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                    style={{ background: "var(--clay, #9d4519)" }}
                  >
                    02 · <strong>Nyungwe</strong>
                  </div>
                </div>
              </article>

              {/* Akagera */}
              <article
                id="rw-akagera"
                className="grid grid-cols-1 lg:grid-cols-2 gap-0"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "5/4", minHeight: "340px" }}
                >
                  <Image
                    src="https://images.pexels.com/photos/3384447/pexels-photo-3384447.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                    alt="Elephant at Akagera National Park, Rwanda"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                    style={{ background: "var(--clay, #9d4519)" }}
                  >
                    03 · <strong>Akagera</strong>
                  </div>
                </div>
                <div className="p-5 sm:p-8 lg:p-11">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                    Big Five · Rwanda&apos;s only savannah park
                  </div>
                  <h3
                    className="font-serif font-normal leading-[1.05] tracking-[-0.01em] text-bone-ink mb-5"
                    style={{ fontSize: "clamp(24px, 3.5vw, 36px)" }}
                  >
                    Akagera{" "}
                    <em className="italic text-bone-clay">National Park</em>
                  </h3>
                  <p className="text-sm leading-[1.65] text-bone-muted mb-8">
                    Rwanda&apos;s only savannah park, bordering Tanzania along
                    the Akagera River. A remarkable conservation success story
                    — lions were reintroduced in 2015 and black rhinos in 2017,
                    completing the Big Five. Game drives, boat safaris on Lake
                    Ihema and night game drives make Akagera a natural complement
                    to the primate parks.
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    {[
                      {
                        heading: "The Big Five",
                        items: [
                          "Lion, elephant, buffalo — resident year-round",
                          "Black rhino (reintroduced 2017)",
                        ],
                      },
                      {
                        heading: "Safari activities",
                        items: [
                          "Game drives — morning & afternoon",
                          "Boat safari on Lake Ihema · night drives",
                        ],
                      },
                    ].map((col) => (
                      <div key={col.heading}>
                        <h5 className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-3">
                          {col.heading}
                        </h5>
                        <ul className="text-[14px] text-bone-muted space-y-1.5">
                          {col.items.map((item) => (
                            <li
                              key={item}
                              style={{
                                paddingLeft: "14px",
                                borderLeft: "2px solid rgba(31,29,24,0.2)",
                              }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                    <span className="text-bone-muted">Best for</span>
                    <span className="text-bone-forest font-medium">
                      Big Five & boat safari
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Trek timeline */}
      <section id="rw-trek" className="bg-bone-bg" style={{ padding: "120px 0" }}>
        <div className="container-site">
          <div className="section-hd" style={{ marginBottom: "64px" }}>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                What happens on a trek
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                A morning in the{" "}
                <em className="italic text-bone-clay">Virungas</em>.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              Every Rwanda gorilla trek begins before sunrise at Kinigi — the
              village at the foot of the volcanoes — and ends with one of the
              most moving encounters in all of wildlife travel.
            </p>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[rgba(31,29,24,0.14)]"
            style={{ border: "1px solid rgba(31,29,24,0.14)" }}
          >
            {trekSteps.map((s) => (
              <div
                key={s.n}
                className="bg-bone-paper flex flex-col"
                style={{ padding: "34px 26px" }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-clay mb-4">
                  {s.n}
                </div>
                <div className="font-serif leading-none mb-3" style={{ fontSize: "30px" }}>
                  <em className="italic text-bone-clay">
                    {s.time.split(" ")[0]}
                  </em>
                  {s.time.includes(" ")
                    ? " " + s.time.split(" ").slice(1).join(" ")
                    : ""}
                </div>
                <h4 className="font-medium text-[14px] text-bone-ink mb-2">
                  {s.title}
                </h4>
                <p className="text-[13px] leading-[1.55] text-bone-muted">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Permit section */}
      <section
        id="rw-permit"
        className="bg-bone-paper"
        style={{
          padding: "120px 0",
          borderTop: "1px solid rgba(31,29,24,0.14)",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-20 items-center">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Gorilla trekking permits
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-6"
                style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
              >
                The <em className="italic text-bone-clay">permit</em>,<br />
                explained.
              </h2>
              <p
                className="text-[16px] leading-[1.65] text-bone-muted mb-8"
                style={{ maxWidth: "46ch" }}
              >
                Rwanda permits are strictly limited — each of the twelve
                habituated families receives a maximum of eight visitors per
                day. Book six to twelve months ahead in peak season. We source
                permits for every Rwanda client.
              </p>
              <ul style={{ borderTop: "1px solid rgba(31,29,24,0.14)" }}>
                {permitPrices.map((p) => (
                  <li
                    key={p.who}
                    className="flex justify-between items-baseline py-5"
                    style={{ borderBottom: "1px solid rgba(31,29,24,0.14)" }}
                  >
                    <div>
                      <div className="text-sm text-bone-ink">{p.who}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mt-1">
                        {p.note}
                      </div>
                    </div>
                    <div
                      className="font-serif italic text-bone-clay shrink-0 ml-4"
                      style={{ fontSize: "clamp(24px, 3.5vw, 36px)", lineHeight: "1" }}
                    >
                      {p.amount}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-6">
                {permitIncludes.map((inc) => (
                  <span
                    key={inc}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted px-3.5 py-1.5"
                    style={{ border: "1px solid rgba(31,29,24,0.14)", borderRadius: "999px" }}
                  >
                    ✓ {inc}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/contact" className="btn-forest">
                  Have us secure your permit →
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <Image
                src="https://images.pexels.com/photos/36478037/pexels-photo-36478037.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Silverback gorilla in the Virunga mountains, Rwanda"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                style={{ background: "var(--clay, #9d4519)" }}
              >
                Book 6–12 months ahead
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness & packing */}
      <section
        id="rw-fitness"
        className="bg-bone-bg"
        style={{ padding: "120px 0" }}
      >
        <div className="container-site">
          <div className="section-hd" style={{ marginBottom: "64px" }}>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Fitness, difficulty &amp; packing
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                What to <em className="italic text-bone-clay">expect</em>
                <br />
                &amp; pack.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              Rwanda&apos;s volcanic terrain makes trekking moderately
              strenuous — altitude and steep slopes are the main challenge. Good
              boots and reasonable fitness are essential; porters are available
              and strongly recommended.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="bg-bone-paper"
              style={{ border: "1px solid rgba(31,29,24,0.14)", borderTop: "none" }}
            >
              {trekFacts.map((f) => (
                <div
                  key={f.k}
                  className="flex justify-between items-center px-7 py-4"
                  style={{ borderTop: "1px solid rgba(31,29,24,0.14)" }}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-muted">
                    {f.k}
                  </span>
                  <span className="font-medium text-sm text-bone-ink">{f.v}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "36px 40px",
                background: "var(--paper, #faf6ec)",
                border: "1px solid rgba(31,29,24,0.14)",
              }}
            >
              <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-5">
                What to carry
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {whatToCarry.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-ink px-3 py-1.5"
                    style={{ border: "1px solid rgba(31,29,24,0.2)", borderRadius: "999px" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                Best time to trek
              </h4>
              <div className="flex flex-wrap gap-2">
                {["June – September · dry", "December – February · dry"].map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-forest px-3 py-1.5"
                    style={{ border: "1px solid rgba(42,58,42,0.3)", borderRadius: "999px" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation tiers */}
      <section
        id="rw-stays"
        className="bg-bone-paper"
        style={{
          padding: "120px 0",
          borderTop: "1px solid rgba(31,29,24,0.14)",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="section-hd" style={{ marginBottom: "64px" }}>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Where to stay
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                Lodges for every{" "}
                <em className="italic text-bone-clay">style</em>.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              Rwanda has some of the finest lodge accommodation in Africa — from
              welcoming mid-range properties at the forest edge to world-class
              ultra-luxury retreats in the Virunga foothills.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {tiers.map((tier) => (
              <div
                key={tier.level}
                className="flex flex-col"
                style={{
                  padding: "36px 32px",
                  border: "1px solid rgba(31,29,24,0.14)",
                  background: "var(--bg, #f4ede0)",
                }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone-muted mb-4">
                  {tier.level}
                </div>
                <div className="font-serif mb-6" style={{ fontSize: "32px", lineHeight: "1" }}>
                  <em className="italic text-bone-clay">{tier.price}</em>
                  <div className="font-mono text-[10px] text-bone-muted mt-1.5 tracking-[0.12em] uppercase">
                    {tier.unit}
                  </div>
                </div>
                <ul
                  className="text-[14px] text-bone-muted space-y-2"
                  style={{ borderTop: "1px solid rgba(31,29,24,0.14)", paddingTop: "20px" }}
                >
                  {tier.lodges.map((l) => (
                    <li key={l} className="flex gap-2 items-start">
                      <span className="text-bone-clay mt-0.5 flex-shrink-0">›</span>
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours / packages */}
      <section
        id="rw-tours"
        className="bg-bone-bg"
        style={{
          padding: "120px 0",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="section-hd" style={{ marginBottom: "64px" }}>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Rwanda safari packages
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                Rwanda <em className="italic text-bone-clay">itineraries</em>.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              Gorilla trekking, chimp tracking, Akagera Big Five, Lake Kivu
              beach — every itinerary fully customised around your dates and
              group size.
            </p>
          </div>
          {safaris.length === 0 ? (
            <p className="text-sm text-bone-muted py-8">
              Rwanda safari packages coming soon — contact us to build a
              bespoke itinerary.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {safaris.map((safari, i) => (
                <PkgCard key={String(safari._id)} safari={safari} index={i} />
              ))}
            </div>
          )}
          <div className="mt-14 text-center">
            <Link href="/contact" className="btn-forest">
              Request a custom Rwanda safari quote →
            </Link>
          </div>
        </div>
      </section>

      <SectionFaq
        id="rw-faq"
        eyebrow="FAQs · Rwanda safaris"
        heading={
          <>
            Before you <em className="italic text-bone-clay">go</em>.
          </>
        }
        contactNote={
          <>
            Call us for more information at{" "}
            <a href="tel:+254722595916" className="text-bone-clay">
              +254 722-595-916
            </a>{" "}
            — fast replies, day or night.
          </>
        }
        faqs={faqs.map((f) => ({ q: f.q, a: f.a }))}
      />
    </>
  );
}
