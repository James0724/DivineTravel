import type { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import SafariModel from "@/lib/db/models/Safari";
import DestinationPageTemplate, {
  type DestinationPageData,
} from "@/components/destinations/DestinationPageTemplate";
import { getCountryParksForListing } from "@/lib/data/destinations";
import type { Safari } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Uganda Wildlife Parks & Reserves — Complete Safari Guide",
  description:
    "Home to half the world's mountain gorillas, wild chimpanzees and tree-climbing lions — your complete guide to Uganda's national parks, primate habitats and safari experiences.",
  keywords:
    "uganda gorilla trekking, bwindi impenetrable forest, queen elizabeth national park, kibale, uganda safari",
  alternates: { canonical: "/en/destinations/uganda" },
  openGraph: {
    title: "Uganda Wildlife Parks & Reserves | Divine Travel Nest Safaris",
    description:
      "A complete expert guide to Uganda's national parks and primate habitats.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Uganda Gorilla Safari",
      },
    ],
  },
};

async function getUgandaPackages(): Promise<Safari[]> {
  try {
    await connectDB();
    const safaris = await SafariModel.find({
      $or: [
        { "location.country": /uganda/i },
        { "location.countries": /uganda/i },
      ],
      active: true,
    })
      .sort({ featured: -1, duration: 1, rating: -1 })
      .limit(3)
      .select(
        "name slug tagline location duration pricing coverImage category featured active rating",
      )
      .lean();
    return JSON.parse(JSON.stringify(safaris)) as Safari[];
  } catch {
    return [];
  }
}

export default async function UgandaDestinationPage() {
  const [packages, { featureParks, moreParks }] = await Promise.all([
    getUgandaPackages(),
    getCountryParksForListing("Uganda"),
  ]);

  const data: DestinationPageData = {
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: "Destinations", href: "/destinations/uganda" },
      { name: "Uganda", href: "/destinations/uganda" },
    ],

    hero: {
      image:
        "https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
      imageAlt: "Mountain gorilla resting in the Ugandan forest",
      slug: "uganda",
      title: " Uganda's wild parks & primates",
      description:
        "Half the world's mountain gorillas, wild chimpanzees, tree-climbing lions and the mighty Murchison Falls — the Pearl of Africa lives up to every name it has ever been given.",
      stats: [
        { num: "460", sup: "+", lbl: "Mountain gorillas" },
        { num: "10", sup: "", lbl: "National parks" },
        { num: "1,000", sup: "+", lbl: "Bird species" },
      ],
    },

    why: {
      images: [
        {
          src: "https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Mountain gorilla in Bwindi Impenetrable Forest, Uganda",
        },
        {
          src: "https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Chimpanzee in the wild, Uganda",
        },
      ],
      eyebrow: "Why Uganda is unmissable",
      heading: (
        <>
          The Pearl
          <br />
          of <em className="italic text-bone-clay">Africa</em>.
        </>
      ),
      description:
        "Winston Churchill called Uganda the Pearl of Africa — and a safari here will show you exactly why. No other country on Earth combines mountain gorillas, chimpanzees, tree-climbing lions and the Victoria Nile in a single circuit.",
      reasons: [
        {
          n: "i",
          title: "Mountain gorillas",
          desc: "— half the world's remaining population lives in Bwindi Impenetrable Forest.",
        },
        {
          n: "ii",
          title: "Best chimpanzee trekking in Africa",
          desc: "— Kibale Forest has over 1,500 chimps and the highest habituation success rates.",
        },
        {
          n: "iii",
          title: "Tree-climbing lions",
          desc: "— the Ishasha sector of Queen Elizabeth NP is one of only two places on Earth to see this behaviour.",
        },
        {
          n: "iv",
          title: "Over 1,000 bird species",
          desc: "— Uganda is a birding paradise, including the shoebill stork.",
        },
        {
          n: "v",
          title: "Compact circuit",
          desc: "— the main parks are within 6–8 hours of Kampala; a 7-day trip covers the gorillas, chimps and savannah.",
        },
      ],
    },

    featureParks,

    featureParksHeader: {
      eyebrow: "Uganda's headline parks",
      description:
        "Uganda's headline parks each offer a completely different safari experience — from dense jungle gorilla tracking to open savannah, river boat safaris and misty mountain forests.",
    },

    moreParks,

    moreParksHeader: {
      eyebrow: "More of Uganda",
      heading: (
        <>
          Remote valleys &amp;
          <br />
          <em className="italic text-bone-clay">hidden gems</em>.
        </>
      ),
      description:
        "Uganda's lesser-visited parks offer extraordinary exclusivity and unique wildlife — perfect add-ons for travellers who want to go beyond the main circuit.",
    },

    howToChoose: [
      { want: "For gorilla trekking", go: "Bwindi Impenetrable" },
      { want: "For chimpanzees", go: "Kibale Forest" },
      { want: "For tree lions", go: "Queen Elizabeth (Ishasha)" },
      { want: "For boat safari", go: "Murchison Falls / QE" },
      { want: "For shoebill stork", go: "Murchison Falls" },
      { want: "For exclusivity", go: "Kidepo Valley" },
      { want: "For first-timers", go: "Bwindi + QE + Kibale" },
      { want: "For walking safari", go: "Lake Mburo" },
    ],
    howToChooseDescription:
      "Uganda's parks each deliver a unique experience. Start from your priority wildlife encounter — then we design the perfect circuit around it.",

    bestTime: {
      heading: (
        <>
          A year-round
          <br />
          <em className="italic" style={{ color: "#f4d4a8" }}>
            destination
          </em>
          .
        </>
      ),
      description:
        "Gorilla trekking is possible every month of the year — but some months are more comfortable than others. Here's how the seasons affect your Uganda trip.",
      seasons: [
        {
          badge: "Dry season · Jun–Aug & Dec–Jan",
          title: "Drier trails, easier trekking.",
          items: [
            "Trails are drier and less slippery for gorilla trekking",
            "Best for game viewing in savannah parks",
            "Peak season — permits sell out fastest in June–August",
            "Clear skies for mountain views (Rwenzori)",
          ],
        },
        {
          badge: "Green season · Mar–May & Sep–Nov",
          title: "Lush forest & lower prices.",
          items: [
            "Lower permit availability (easier to book last-minute)",
            "Lush, green forests ideal for photography",
            "Fewer tourists — more solitary gorilla experiences",
            "Excellent birdwatching as migrant birds arrive",
          ],
        },
      ],
    },

    packages,
    packagesHref: "/safaris?country=Uganda",
    packagesLinkText: "Browse all Uganda safari packages →",
    packagesHeader: {
      eyebrow: "Uganda safari packages",
      heading: (
        <>
          Uganda safari
          <br />
          <em className="italic text-bone-clay">packages</em>.
        </>
      ),
      description:
        "From a dedicated gorilla permit trip to the full Uganda primate circuit — every itinerary is fully customisable for your dates, group and budget.",
    },

    faqs: [
      {
        q: "How much does a gorilla trekking permit cost in Uganda?",
        a: "A gorilla trekking permit in Uganda costs $800 per person per trek (as of 2026). This includes one hour with a habituated gorilla family. The gorilla habituation experience costs $1,500 per person for 4+ hours.",
      },
      {
        q: "How far in advance should I book gorilla permits?",
        a: "For peak months (June–August, December–January), book 6–12 months ahead. Bwindi permits are genuinely limited — each family receives a maximum of 8 visitors per day. We handle permit sourcing for all clients.",
      },
      {
        q: "Can I combine gorilla trekking with other Uganda parks?",
        a: "Yes — a classic Uganda circuit combines Bwindi (gorillas) with Queen Elizabeth NP (tree lions, boat safari) and Kibale Forest (chimpanzees). A 7–10 day itinerary comfortably covers all three.",
      },
      {
        q: "What is the best time to visit Uganda?",
        a: "Uganda is a year-round destination — gorilla trekking is possible every month. The drier months (June–August, December–January) are generally preferred as trails are less muddy. The green season (March–May, October–November) is cheaper and the forests are lush.",
      },
      {
        q: "Is Uganda safe for safari travel?",
        a: "Uganda is generally safe for safari travellers. The national parks are well-managed and professionally staffed. We always brief clients on current conditions and arrange experienced local guides for all activities.",
      },
      {
        q: "What should I pack for gorilla trekking?",
        a: "Waterproof hiking boots with ankle support, long trousers, long-sleeved shirt, garden gloves, rain jacket, 1.5L water, snacks, and a camera with a fast lens. Walking sticks are provided at the trailhead — always accept one.",
      },
    ],
    faqHeader: {
      eyebrow: "FAQs · Uganda",
      heading: (
        <>
          Your Uganda <em className="italic text-bone-clay">questions</em>.
        </>
      ),
    },

    cta: {
      heading: (
        <>
          Plan your
          <br />
          Uganda{" "}
          <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>adventure</em>.
        </>
      ),
      description:
        "Gorilla permits, chimp tracking, park circuits — our Uganda specialists handle every detail. Tell us when you want to go and we'll secure your permits and design the itinerary at no charge.",
    },
  };

  return <DestinationPageTemplate data={data} />;
}
