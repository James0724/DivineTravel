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
  title: "Uganda Gorilla Trekking Tours 2026/2027 — Bwindi, Queen Elizabeth & Murchison Falls",
  description:
    "Book Uganda gorilla trekking tours 2026/2027 in Bwindi Impenetrable Forest and Mgahinga. $800 permits secured, licensed guides, and wildlife safari extensions to Queen Elizabeth, Murchison Falls and Kidepo Valley — transfers from Entebbe or Kigali. Best value vs Rwanda's $1,500.",
  keywords:
    "uganda gorilla trekking 2026, bwindi gorilla tour, gorilla permit uganda, mgahinga gorilla trek, uganda wildlife safari, queen elizabeth national park, murchison falls safari, chimp trekking uganda, kidepo valley safari, uganda safari packages 2027, lake bunyonyi, entebbe safari, gorilla trekking africa",
  alternates: { canonical: "/safaris/uganda" },
  openGraph: {
    title: "Uganda Gorilla Trekking 2026/2027 — Bwindi, Queen Elizabeth & Murchison Falls",
    description:
      "Uganda gorilla trekking tours — $800 permits, Bwindi Impenetrable Forest, Queen Elizabeth NP and Murchison Falls. Best value gorilla trekking in Africa.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Mountain gorilla in Bwindi Impenetrable Forest Uganda",
      },
    ],
  },
};

const trekSteps = [
  {
    n: "Step 01",
    time: "7:00 AM",
    title: "Briefing",
    body: "Rangers explain the trekking rules and assign you to a gorilla family at the park headquarters.",
  },
  {
    n: "Step 02",
    time: "8:00 AM",
    title: "Start trek",
    body: "You set off into the rainforest with guides and trackers who are already locating the family.",
  },
  {
    n: "Step 03",
    time: "1–5 hrs",
    title: "The search",
    body: "Trekking time depends on where the gorillas have moved — terrain includes hills, dense growth and streams.",
  },
  {
    n: "Step 04",
    time: "One hour",
    title: "With the gorillas",
    body: "Observe them feeding, nesting, playing and grooming — exactly sixty protected minutes, no chasing.",
  },
  {
    n: "Step 05",
    time: "Certificate",
    title: "Awarded at the end",
    body: "You return with a trekking certificate — and one of the most emotional wildlife experiences of your life.",
  },
];

const permitPrices = [
  { who: "Foreign non-residents", note: "The standard permit", amount: "$800" },
  {
    who: "Foreign residents",
    note: "Holders of a valid permit",
    amount: "$700",
  },
  { who: "East African citizens", note: "EAC nationals", amount: "UGX 300k" },
];

const permitIncludes = [
  "Gorilla tracking",
  "Ranger guides",
  "Park entry",
  "Conservation fees",
  "Security",
];

const trekFacts = [
  { k: "Difficulty", v: "Moderate" },
  { k: "Terrain", v: "Hills, forest & rivers" },
  { k: "Distance", v: "2–7 km" },
  { k: "Trekking time", v: "2–6 hours" },
  { k: "Viewing distance", v: "7 metres" },
  { k: "Time with gorillas", v: "One full hour" },
];

const whatToCarry = [
  "Hiking boots",
  "Long trousers",
  "Long-sleeved shirt",
  "Rain jacket",
  "Gardening gloves",
  "Gaiters (optional)",
  "Reusable water bottle",
  "Energy snacks",
  "Hat & sunscreen",
  "Camera — no flash",
];

const tiers = [
  {
    level: "Budget",
    price: "$250–$350",
    unit: "per person · per day",
    lodges: [
      "Rushaga Haven Lodge",
      "Buhoma Community Cottages",
      "Simple, warm and well-placed for the trailhead",
    ],
  },
  {
    level: "Mid-range",
    price: "$350–$600",
    unit: "per person · per day",
    lodges: [
      "Bakiga Lodge",
      "Gorilla Mist Camp",
      "Comfortable rooms, good food, forest views",
    ],
  },
  {
    level: "Luxury",
    price: "$700–$1,500",
    unit: "per person · per day",
    lodges: [
      "Clouds Mountain Gorilla Lodge",
      "Buhoma Lodge · Volcanoes Safaris",
      "Exclusive lodges, private decks, fireside dinners",
    ],
  },
];

const faqs = [
  {
    q: "Is gorilla trekking safe in Uganda?",
    a: "Yes. Trekking is extremely safe thanks to armed rangers, strict conservation rules and professional guides. The Uganda Wildlife Authority ensures full security across every trekking region.",
  },
  {
    q: "Is gorilla trekking difficult?",
    a: "It's moderately challenging. Trails can be steep, muddy and thickly vegetated, and treks last two to six hours depending on the gorillas' movements. Porters are available and highly recommended.",
  },
  {
    q: "What is the best time for gorilla trekking?",
    a: "June to September and December to February are best — drier weather makes for easier trekking and better photography, though gorillas are tracked year-round.",
  },
  {
    q: "How close can I get to the gorillas?",
    a: "You view the gorillas from seven metres, though they may approach you of their own accord — in which case you stay calm and follow your ranger's instructions.",
  },
  {
    q: "What is included in a gorilla permit?",
    a: "A permit covers one gorilla trek, park entry, ranger guides, conservation fees and security. Transport, meals and accommodation are arranged separately — we bundle them into your package.",
  },
  {
    q: "How early should I book a permit?",
    a: "Three to six months in advance, especially for the June–September peak. Daily allocations are limited and permits sell out fast.",
  },
  {
    q: "Bwindi or Mgahinga — which is better?",
    a: "Bwindi has more gorilla families and far better permit availability; Mgahinga offers beautiful scenery and fewer crowds. Both deliver excellent sightings — we'll advise based on your dates.",
  },
  {
    q: "How long do I spend with the gorillas?",
    a: "One full, strictly protected hour with a habituated family once you've located them — both far too short and, somehow, completely sufficient.",
  },
];

const whyUgandaPoints = [
  {
    ic: "i",
    b: "Over half the world's mountain gorillas",
    s: "live in Uganda's forests",
  },
  {
    ic: "ii",
    b: "Four Bwindi trekking sectors",
    s: "Buhoma, Rushaga, Ruhija and Nkuringo — plus Mgahinga",
  },
  {
    ic: "iii",
    b: "A 98% sighting success rate",
    s: "across varied, gorilla-rich environments",
  },
  {
    ic: "iv",
    b: "Permits cost $800",
    s: "against roughly $1,500 in neighbouring Rwanda",
  },
  {
    ic: "v",
    b: "Flexible itineraries",
    s: "from Entebbe or Kigali — ideal for short 2–3 day treks",
  },
];

export default async function UgandaSafarisPage() {
  let safaris: Safari[] = [];
  try {
    await connectDB();
    const rawSafaris = await SafariModel.find({
      "location.country": /uganda/i,
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
          { name: "Uganda Gorilla Trekking", href: "/safaris/uganda" },
        ]}
      />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <CollectionPageSchema
        name="Uganda Gorilla Trekking & Safari Packages 2026/2027"
        description="Browse our Uganda safari packages — Bwindi gorilla trekking, Queen Elizabeth, Murchison Falls and more. Budget to luxury, tailor-made to your dates."
        url="https://divinetravelnestsafaris.com/safaris/uganda"
        items={safaris.map((s) => ({
          name: s.name,
          url: `https://divinetravelnestsafaris.com/safaris/${s.slug}`,
          description: s.tagline,
        }))}
      />

      <PageHero
        image="https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Mountain gorilla in Bwindi Impenetrable Forest, Uganda"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Tours & Safaris", href: "/safaris" },
          { label: "Uganda Safaris" },
        ]}
        title={
          <>
            Uganda gorilla trekking
            <br />
            <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>tours 2026/2027</em>.
          </>
        }
        description="A face-to-face hour with wild mountain gorillas in Bwindi Impenetrable Forest or Mgahinga — Africa's most powerful wildlife encounter, plus Queen Elizabeth and Murchison Falls safari extensions."
        stats={[
          { num: "50", sup: "%+", lbl: "World's gorilla population" },
          { num: "98", sup: "%", lbl: "Gorilla sighting success" },
          { num: "$800", sup: "", lbl: "Permit · vs $1,500 Rwanda" },
        ]}
      />
      <CtaBand
        variant="large"
        heading={
          <>
            Meet the gorillas of{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>Bwindi</em>.
          </>
        }
        description="Tell us your dates and we'll secure your permit, choose your sector and lodge, and handle every transfer from Entebbe or Kigali. Free, no-obligation, and answered by a real person — usually within half an hour."
        buttonText="Plan my gorilla trek"
      />

      {/* Why Uganda */}
      <section
        className="bg-bone-paper"
        style={{
          padding: "120px 0",
          borderTop: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-24 items-center">
            <div
              className="grid grid-cols-2 gap-4"
              style={{ aspectRatio: "1/1.1" }}
            >
              <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <Image
                  src="https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=600&q=80"
                  alt="Mountain gorilla in Bwindi forest, Uganda"
                  width={400}
                  height={530}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="overflow-hidden mt-10"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src="https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=600&q=80"
                  alt="Chimpanzee in the wild forest, Uganda"
                  width={400}
                  height={530}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Why Uganda is the best place to trek
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-6"
                style={{ fontSize: "clamp(40px, 5.4vw, 68px)" }}
              >
                More gorillas, more access,{" "}
                <em className="italic text-bone-clay">better</em> value.
              </h2>
              <p
                className="text-[16px] leading-[1.65] text-bone-muted mb-8"
                style={{ maxWidth: "52ch" }}
              >
                Uganda holds more habituated gorilla families than Rwanda or the
                DR Congo, spread across several trekking regions — which means
                better permit availability and an experience that feels wild
                rather than crowded.
              </p>
              <ul>
                {whyUgandaPoints.map((t) => (
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

      {/* Gorilla trekking regions — sidebar layout */}
      <section
        className="bg-bone-bg"
        style={{
          padding: "96px 0",
          borderBottom: "1px solid rgba(31,29,24,0.14)",
        }}
      >
        <div className="container-site">
          <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">
            {/* Jump nav — mobile trigger + desktop sticky sidebar */}
            <JumpNav
              vertical
              label="On this page"
              links={[
                { label: "Bwindi", href: "#ug-bwindi" },
                { label: "Mgahinga", href: "#ug-mgahinga" },
                { label: "The trek", href: "#ug-trek" },
                { label: "Permits", href: "#ug-permit" },
                { label: "Fitness", href: "#ug-fitness" },
                { label: "Where to stay", href: "#ug-stays" },
                { label: "Tours", href: "#ug-tours" },
                { label: "FAQs", href: "#ug-faq" },
              ]}
            />

            {/* Main trekking content */}
            <div className="flex-1 min-w-0">
              <div className="section-hd" style={{ marginBottom: "72px" }}>
                <div>
                  <div className="eyebrow mb-4">
                    <span className="dot" />
                    Gorilla trekking regions
                  </div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                    style={{ fontSize: "clamp(36px, 4.8vw, 68px)" }}
                  >
                    Where you&apos;ll{" "}
                    <em className="italic text-bone-clay">trek</em>.
                  </h2>
                </div>
                <p
                  className="text-sm leading-[1.65] text-bone-muted"
                  style={{ maxWidth: "56ch" }}
                >
                  Two national parks in Uganda&apos;s far south-west protect the
                  mountain gorillas — one vast and famous, one small and scenic.
                  We secure permits in whichever suits your trip.
                </p>
              </div>

              {/* Bwindi */}
              <article
                id="ug-bwindi"
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-16"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "5/4", minHeight: "340px" }}
                >
                  <Image
                    src="https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                    alt="Mountain gorilla in Bwindi Impenetrable National Park"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                    style={{ background: "var(--clay, #9d4519)" }}
                  >
                    01 · <strong>Bwindi</strong>
                  </div>
                </div>
                <div className="p-5 sm:p-8 lg:p-11">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                    19+ habituated families · 4 sectors
                  </div>
                  <h3
                    className="font-serif font-normal leading-[1.05] tracking-[-0.01em] text-bone-ink mb-5"
                    style={{ fontSize: "clamp(24px, 3.5vw, 36px)" }}
                  >
                    Bwindi Impenetrable{" "}
                    <em className="italic text-bone-clay">National Park</em>
                  </h3>
                  <p className="text-sm leading-[1.65] text-bone-muted mb-8">
                    The heart of Uganda gorilla trekking — a dense, ancient
                    rainforest holding more than nineteen habituated families
                    across four trekking sectors. The name is not marketing: the
                    terrain is steep and tangled, and the reward is an hour you
                    will never forget.
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    {[
                      {
                        heading: "Northern sectors",
                        items: [
                          "Buhoma — the original, most established sector",
                          "Ruhija — high-altitude, fewer crowds",
                        ],
                      },
                      {
                        heading: "Southern sectors",
                        items: [
                          "Rushaga — the most gorilla families",
                          "Nkuringo — dramatic, demanding descents",
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
                      Choice & permit availability
                    </span>
                  </div>
                </div>
              </article>

              {/* Mgahinga */}
              <article
                id="ug-mgahinga"
                className="grid grid-cols-1 lg:grid-cols-2 gap-0"
                style={{ border: "1px solid rgba(31,29,24,0.14)" }}
              >
                <div className="order-2 lg:order-1 p-5 sm:p-8 lg:p-11">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                    The Nyakagezi family · Golden monkeys
                  </div>
                  <h3
                    className="font-serif font-normal leading-[1.05] tracking-[-0.01em] text-bone-ink mb-5"
                    style={{ fontSize: "clamp(24px, 3.5vw, 36px)" }}
                  >
                    Mgahinga Gorilla{" "}
                    <em className="italic text-bone-clay">National Park</em>
                  </h3>
                  <p className="text-sm leading-[1.65] text-bone-muted mb-8">
                    Smaller and strikingly scenic, set against the Virunga
                    volcanoes. Mgahinga is home to the single habituated
                    Nyakagezi family and far fewer visitors — and it pairs
                    gorilla trekking with golden monkey tracking and volcano
                    hikes.
                  </p>
                  <ul
                    className="text-[14px] text-bone-muted mb-8"
                    style={{ borderTop: "1px solid rgba(31,29,24,0.14)" }}
                  >
                    {[
                      "The habituated Nyakagezi gorilla family",
                      "Golden monkey trekking",
                      "Dramatic Virunga volcano backdrop",
                      "Quiet trails and few other groups",
                    ].map((h) => (
                      <li
                        key={h}
                        className="py-3 relative pl-5"
                        style={{
                          borderBottom: "1px solid rgba(31,29,24,0.14)",
                        }}
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
                      Scenery & solitude
                    </span>
                  </div>
                </div>
                <div
                  className="relative overflow-hidden order-1 lg:order-2"
                  style={{ aspectRatio: "5/4", minHeight: "340px" }}
                >
                  <Image
                    src="https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                    alt="Silverback gorilla in the Virunga mountains, Mgahinga"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                    style={{ background: "var(--clay, #9d4519)" }}
                  >
                    02 · <strong>Mgahinga</strong>
                  </div>
                </div>
              </article>
            </div>
            {/* end flex-1 min-w-0 */}
          </div>
          {/* end lg:flex */}
        </div>
      </section>

      {/* Trek timeline */}
      <section
        id="ug-trek"
        className="bg-bone-bg"
        style={{ padding: "120px 0" }}
      >
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
                <em className="italic text-bone-clay">forest</em>.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              Every trek follows the same rhythm — an early briefing, a walk of
              anywhere from one to five hours, and a single, strictly protected
              hour with the family once you find them.
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
                <div
                  className="font-serif leading-none mb-3"
                  style={{ fontSize: "30px" }}
                >
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
        id="ug-permit"
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
                A permit is required for every trek and the daily allocation is
                strictly limited — so book three to six months ahead, especially
                for the June–September peak. We secure them for you.
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
                      style={{
                        fontSize: "clamp(24px, 3.5vw, 36px)",
                        lineHeight: "1",
                      }}
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
                    style={{
                      border: "1px solid rgba(31,29,24,0.14)",
                      borderRadius: "999px",
                    }}
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
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src="https://images.pexels.com/photos/36478037/pexels-photo-36478037.jpeg?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Silverback gorilla in the forest"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                style={{ background: "var(--clay, #9d4519)" }}
              >
                Booked 3–6 months ahead
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness & tips */}
      <section
        id="ug-fitness"
        className="bg-bone-bg"
        style={{ padding: "120px 0" }}
      >
        <div className="container-site">
          <div className="section-hd" style={{ marginBottom: "64px" }}>
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                Fitness, difficulty &amp; tips
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
              Trekking is moderately challenging — reasonable fitness helps, and
              porters are available and worth every shilling. Here&apos;s the
              honest measure of it, and what to carry.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
              className="bg-bone-paper"
              style={{
                border: "1px solid rgba(31,29,24,0.14)",
                borderTop: "none",
              }}
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
                  <span className="font-medium text-sm text-bone-ink">
                    {f.v}
                  </span>
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
                    style={{
                      border: "1px solid rgba(31,29,24,0.2)",
                      borderRadius: "999px",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-4">
                Best time to trek
              </h4>
              <div className="flex flex-wrap gap-2">
                {["June – September · dry", "December – February · dry"].map(
                  (t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-forest px-3 py-1.5"
                      style={{
                        border: "1px solid rgba(42,58,42,0.3)",
                        borderRadius: "999px",
                      }}
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation tiers */}
      <section
        id="ug-stays"
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
                <em className="italic text-bone-clay">budget</em>.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              From community cottages at the forest edge to some of the most
              celebrated lodges in East Africa — we match your trek to your
              preferred level of comfort.
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
                <div
                  className="font-serif mb-6"
                  style={{ fontSize: "32px", lineHeight: "1" }}
                >
                  <em className="italic text-bone-clay">{tier.price}</em>
                  <div className="font-mono text-[10px] text-bone-muted mt-1.5 tracking-[0.12em] uppercase">
                    {tier.unit}
                  </div>
                </div>
                <ul
                  className="text-[14px] text-bone-muted space-y-2"
                  style={{
                    borderTop: "1px solid rgba(31,29,24,0.14)",
                    paddingTop: "20px",
                  }}
                >
                  {tier.lodges.map((l) => (
                    <li key={l} className="flex gap-2 items-start">
                      <span className="text-bone-clay mt-0.5 flex-shrink-0">
                        ›
                      </span>
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
        id="ug-tours"
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
                Best Uganda gorilla trekking tours
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                Gorilla <em className="italic text-bone-clay">itineraries</em>.
              </h2>
            </div>
            <p
              className="text-sm leading-[1.65] text-bone-muted"
              style={{ maxWidth: "56ch" }}
            >
              Tailor-made trips built around your permit — combine gorillas with
              chimps, golden monkeys, a Big-game park or the scenic calm of Lake
              Bunyonyi.
            </p>
          </div>
          {safaris.length === 0 ? (
            <p className="text-sm text-bone-muted py-8">
              No Uganda safari packages found — check back soon.
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
              Request a custom gorilla trekking quote →
            </Link>
          </div>
        </div>
      </section>

      <SectionFaq
        id="ug-faq"
        eyebrow="FAQs · Uganda gorilla trekking"
        heading={
          <>
            Before you <em className="italic text-bone-clay">trek</em>.
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
