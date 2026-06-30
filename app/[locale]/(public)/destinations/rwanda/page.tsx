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
  title: "Rwanda Wildlife Parks & Reserves — Complete Safari Guide",
  description:
    "Your complete guide to Rwanda safari destinations — gorilla trekking in Volcanoes National Park, chimpanzees in Nyungwe Forest and the Big Five in Akagera National Park.",
  keywords:
    "rwanda gorilla trekking, volcanoes national park, nyungwe forest, akagera national park, rwanda safari guide",
  alternates: { canonical: "/en/destinations/rwanda" },
  openGraph: {
    title: "Rwanda Wildlife Parks & Reserves | Divine Travel Nest Safaris",
    description:
      "A complete expert guide to Rwanda's national parks — gorillas, chimps and the Big Five.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Mountain gorilla in Volcanoes National Park Rwanda",
      },
    ],
  },
};

async function getRwandaPackages(): Promise<Safari[]> {
  try {
    await connectDB();
    const safaris = await SafariModel.find({
      $or: [
        { "location.country": /rwanda/i },
        { "location.countries": /rwanda/i },
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

export default async function RwandaDestinationPage() {
  const [packages, { featureParks, moreParks }] = await Promise.all([
    getRwandaPackages(),
    getCountryParksForListing("Rwanda"),
  ]);

  const data: DestinationPageData = {
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: "Destinations", href: "/destinations/rwanda" },
      { name: "Rwanda", href: "/destinations/rwanda" },
    ],

    hero: {
      image:
        "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
      imageAlt: "Mountain gorilla in the Virunga Volcanoes, Rwanda",
      slug: "rwanda",
      title: " Rwanda's parks & volcanoes",
      description:
        "Mountain gorillas in the Virunga mist, chimpanzees in ancient rainforest, and Africa's only Big Five park run entirely by a conservation NGO — Rwanda is East Africa's most intimate safari destination.",
      stats: [
        { num: "12", sup: "", lbl: "Habituated gorilla families" },
        { num: "3", sup: "", lbl: "Iconic national parks" },
        { num: "700+", sup: "", lbl: "Mountain gorillas in Rwanda" },
      ],
    },

    why: {
      images: [
        {
          src: "https://images.pexels.com/photos/34303083/pexels-photo-34303083.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Mountain gorilla in Volcanoes National Park, Rwanda",
        },
        {
          src: "https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Chimpanzee in Nyungwe Forest, Rwanda",
        },
      ],
      eyebrow: "Why Rwanda is unmissable",
      heading: (
        <>
          The land of a
          <br />
          thousand <em className="italic text-bone-clay">hills</em>.
        </>
      ),
      description:
        "Rwanda is Africa's most immersive gorilla destination — and far more besides. Three distinct ecosystems packed into a compact, safe, beautifully organised country deliver an intensity of wildlife experience rarely matched anywhere on the continent.",
      reasons: [
        {
          n: "i",
          title: "12 habituated gorilla families",
          desc: "— the Virunga Massif is shared with Uganda and DRC but Rwanda offers the most curated, luxury-focused trekking experience.",
        },
        {
          n: "ii",
          title: "Nyungwe canopy walkway",
          desc: "— 70 metres above the forest floor, the only accessible forest canopy platform in East Africa, in one of the continent's oldest rainforests.",
        },
        {
          n: "iii",
          title: "Akagera Big Five",
          desc: "— lions reintroduced in 2015, black rhinos in 2017 — a remarkable conservation recovery that now offers the full Big Five experience.",
        },
        {
          n: "iv",
          title: "Compact, easy logistics",
          desc: "— all three parks are within 2–5 hours of Kigali International Airport; a 7-day itinerary comfortably covers gorillas, chimps and savannah.",
        },
        {
          n: "v",
          title: "Rwanda-Uganda gorilla circuit",
          desc: "— combine Rwanda's Volcanoes with Uganda's Bwindi on a cross-border itinerary — two of the world's best gorilla experiences in one trip.",
        },
      ],
    },

    featureParks,

    featureParksHeader: {
      eyebrow: "Rwanda's three safari parks",
      description:
        "Each of Rwanda's three parks delivers a completely different wildlife experience — volcanic highlands, ancient rainforest and open savannah — all within a short drive of Kigali.",
    },

    moreParks,

    moreParksHeader: {
      eyebrow: "More of Rwanda",
      heading: (
        <>
          Lakes, forest
          <br />
          &amp; <em className="italic text-bone-clay">culture</em>.
        </>
      ),
      description:
        "Beyond the three headline parks, Rwanda offers lake beaches, a restored forest park with chimpanzees, and one of Africa's most thoughtfully curated capital cities.",
    },

    howToChoose: [
      { want: "For gorilla trekking", go: "Volcanoes National Park" },
      { want: "For golden monkeys", go: "Volcanoes National Park" },
      { want: "For chimpanzees", go: "Nyungwe Forest" },
      { want: "For the canopy walk", go: "Nyungwe Forest" },
      { want: "For Big Five safari", go: "Akagera National Park" },
      { want: "For boat safari", go: "Akagera (Lake Ihema)" },
      { want: "For relaxation", go: "Lake Kivu" },
      { want: "For first-timers", go: "Volcanoes + Akagera circuit" },
    ],
    howToChooseDescription:
      "Rwanda's three parks each deliver a unique experience. Start from your priority wildlife encounter — then we design a 5–10 day circuit that covers as much or as little as you like.",

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
        "Gorilla trekking is possible every month — but drier seasons make for more comfortable trekking on the volcanic slopes. Here's how Rwanda's seasons affect your trip.",
      seasons: [
        {
          badge: "Dry season · Jun–Sep & Dec–Feb",
          title: "Best conditions for trekking.",
          items: [
            "Drier, firmer trails on the volcanic slopes",
            "Peak season — permits sell out fastest June–September",
            "Best game viewing in Akagera",
            "Clear skies for volcano summit views",
          ],
        },
        {
          badge: "Green season · Mar–May & Oct–Nov",
          title: "Lush forests, fewer crowds.",
          items: [
            "Lower permit demand — easier last-minute booking",
            "Lush, photogenic forests in Nyungwe and Volcanoes",
            "Fewer visitors — more intimate gorilla encounters",
            "Excellent birding as migratory species arrive",
          ],
        },
      ],
    },

    packages,
    packagesHref: "/safaris?country=Rwanda",
    packagesLinkText: "Browse all Rwanda safari packages →",
    packagesHeader: {
      eyebrow: "Rwanda safari packages",
      heading: (
        <>
          Rwanda safari
          <br />
          <em className="italic text-bone-clay">packages</em>.
        </>
      ),
      description:
        "From a dedicated gorilla permit trip to the full Rwanda circuit — every itinerary is fully customisable for your dates, group and budget.",
    },

    faqs: [
      {
        q: "How much does gorilla trekking cost in Rwanda?",
        a: "A gorilla trekking permit in Rwanda costs $1,500 per person per trek (2026 rates). This is higher than Uganda ($800) but Rwanda offers exceptional infrastructure — well-marked trails, world-class lodges right at the park edge and a well-managed, premium experience.",
      },
      {
        q: "How many gorilla families can I visit in Rwanda?",
        a: "There are currently 12 habituated gorilla families in Volcanoes National Park. Each family receives a maximum of 8 visitors per day — which means quiet, intimate encounters. We recommend families based on your fitness level and the lodge's proximity to the trailhead.",
      },
      {
        q: "Can I combine gorilla trekking in Rwanda with Uganda?",
        a: "Yes — a Rwanda-Uganda gorilla circuit is one of our most popular itineraries. Kigali is only 90 minutes from Kampala by road, and Volcanoes NP is close to the Uganda border near Cyanika. Many travellers trek in Volcanoes NP one day and Bwindi the next.",
      },
      {
        q: "What is included in a Rwanda gorilla permit?",
        a: "The permit covers one gorilla trek, ranger escort, park entry and conservation fees. Transport, accommodation, meals and porter fees are arranged separately — we bundle everything into your package.",
      },
      {
        q: "Is Rwanda safe for tourists?",
        a: "Rwanda is consistently ranked among Africa's safest destinations. Kigali is exceptionally clean and well-organised, roads are good, and the national parks are professionally managed. We have run Rwanda itineraries for many years without incident.",
      },
      {
        q: "What is the best Rwanda safari itinerary?",
        a: "For a 7-day trip: fly into Kigali, 2 nights at Volcanoes NP (gorilla trek + golden monkey trek), transfer to Nyungwe Forest for 2 nights (chimp trek + canopy walk), then 2 nights in Akagera (game drives + boat safari). This covers all three parks at a comfortable pace.",
      },
    ],
    faqHeader: {
      eyebrow: "FAQs · Rwanda",
      heading: (
        <>
          Your Rwanda <em className="italic text-bone-clay">questions</em>.
        </>
      ),
    },

    cta: {
      heading: (
        <>
          Plan your
          <br />
          Rwanda{" "}
          <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>adventure</em>.
        </>
      ),
      description:
        "Gorilla permits, chimp tracking, Akagera game drives — our Rwanda specialists handle every detail. Tell us when you want to go and we'll secure your permits and design the itinerary at no charge.",
    },
  };

  return <DestinationPageTemplate data={data} />;
}
