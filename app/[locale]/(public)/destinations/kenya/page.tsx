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
  title: "Kenya Wildlife Parks & Reserves — Complete Safari Guide",
  description:
    "From the legendary Masai Mara to the elephant kingdom of Amboseli — your complete field guide to Kenya's national parks and reserves. Where to go, what to see, and when.",
  keywords:
    "kenya national parks, masai mara, amboseli, tsavo, kenya safari, big five kenya, kenya wildlife parks",
  alternates: { canonical: "/en/destinations/kenya" },
  openGraph: {
    title: "Kenya Wildlife Parks & Reserves | Divine Travel Nest Safaris",
    description:
      "A complete expert guide to Kenya's national parks and reserves.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Kenya Safari",
      },
    ],
  },
};

async function getKenyaPackages(): Promise<Safari[]> {
  try {
    await connectDB();
    const safaris = await SafariModel.find({
      $or: [
        { "location.country": /kenya/i },
        { "location.countries": /kenya/i },
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

export default async function KenyaDestinationPage() {
  const [packages, { featureParks, moreParks }] = await Promise.all([
    getKenyaPackages(),
    getCountryParksForListing("Kenya"),
  ]);

  const data: DestinationPageData = {
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: "Destinations", href: "/destinations/kenya" },
      { name: "Kenya", href: "/destinations/kenya" },
    ],

    hero: {
      image:
        "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
      imageAlt:
        "Wildebeest and zebras grazing across the open Masai Mara, Kenya",
      slug: "kenya",
      title: "Kenya's wildlife parks & reserves",
      description:
        "From the legendary Masai Mara to the elephant kingdom of Amboseli, the roaring plains of Tsavo and the rhino sanctuaries of the north — a complete field guide to where to go, what you'll see, and when.",
      stats: [
        { num: "12", sup: "+", lbl: "Parks & reserves" },
        { num: "Big 5", sup: "", lbl: "In a single country" },
        { num: "Year-round", sup: "", lbl: "Safari season" },
      ],
    },

    why: {
      images: [
        {
          src: "https://images.pexels.com/photos/13932855/pexels-photo-13932855.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Elephant in the Masai Mara, Kenya",
        },
        {
          src: "https://images.pexels.com/photos/724626/pexels-photo-724626.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Lions resting on the African savanna",
        },
      ],
      eyebrow: "Why Kenya parks are the best in Africa",
      heading: (
        <>
          One country,
          <br />
          every <em className="italic text-bone-clay">safari</em>
          <br />
          you could want.
        </>
      ),
      description:
        "Kenya's protected areas are famous worldwide — a single nation that holds savannah, mountains, lakes, forests and wetlands, and the wildlife to match each one.",
      reasons: [
        {
          n: "i",
          title: "The Big Five",
          desc: "— lion, leopard, elephant, rhino and buffalo, all within Kenya's borders.",
        },
        {
          n: "ii",
          title: "Year-round game viewing",
          desc: "across a remarkable range of habitats.",
        },
        {
          n: "iii",
          title: "The annual Great Migration",
          desc: "crosses into the Masai Mara each July through October.",
        },
        {
          n: "iv",
          title: "Endangered species",
          desc: "— black rhino, Grevy's zebra and reticulated giraffe survive here.",
        },
        {
          n: "v",
          title: "A park for every dream",
          desc: "— big cats, elephants, birds or sweeping landscapes.",
        },
      ],
    },

    featureParks,

    featureParksHeader: {
      eyebrow: "Major Kenya wildlife parks",
      description:
        "An expert-curated guide to Kenya's headline parks and reserves — written to help you choose the right destination for the safari you have in mind. We build custom itineraries combining three to five of these.",
    },

    moreParks,

    moreParksHeader: {
      eyebrow: "More of Kenya's parks",
      heading: (
        <>
          Lakes, highlands
          <br />
          &amp; <em className="italic text-bone-clay">hidden</em> corners.
        </>
      ),
      description:
        "Beyond the headline reserves, Kenya rewards the curious with rhino-rich lakes, treehouse highlands, and the world's only national park inside a capital city. Any of these pairs beautifully with a main park.",
    },

    howToChoose: [
      { want: "For big cats", go: "Masai Mara" },
      { want: "For elephants", go: "Amboseli" },
      { want: "For rare species", go: "Samburu" },
      { want: "For wilderness", go: "Tsavo E & W" },
      { want: "For rhinos", go: "Ol Pejeta & Nakuru" },
      { want: "For luxury", go: "Lewa & Laikipia" },
      { want: "For short trips", go: "Nairobi NP" },
      { want: "For water safaris", go: "Lake Naivasha" },
    ],
    howToChooseDescription:
      "The quickest way to a great itinerary is to start from what you most want to see. Here's where we'd point you — then we combine three to five parks around it.",

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
        "Kenya is good all year — the best months simply depend on what you want to see. Here's the short version; we'll tune your dates around the wildlife you're chasing.",
      seasons: [
        {
          badge: "Dry season · June – October",
          title: "Peak game viewing.",
          items: [
            "Best wildlife viewing overall",
            "Peak of the Great Migration in the Mara",
            "Clear skies and easy, open game viewing",
            "Thinner vegetation concentrates animals at water",
          ],
        },
        {
          badge: "Green season · November – May",
          title: "Lush, quiet & better value.",
          items: [
            "Lower prices and fewer vehicles",
            "Lush, photogenic green landscapes",
            "Excellent birdwatching as migrants arrive",
            "Calving season in February — predator action",
          ],
        },
      ],
    },

    packages,
    packagesHref: "/safaris?country=Kenya",
    packagesLinkText: "Browse all Kenya safari packages →",
    packagesHeader: {
      eyebrow: "Safaris touching these parks",
      heading: (
        <>
          Kenya safari
          <br />
          <em className="italic text-bone-clay">packages</em>.
        </>
      ),
      description:
        "A selection of our itineraries built around the parks above — from a quick Mara escape to the full Kenya loop. Every one is rewritable for your dates, party size and budget.",
    },

    faqs: [
      {
        q: "Which park is best for the Big Five?",
        a: "The Masai Mara, Ol Pejeta and Amboseli offer the most reliable Big Five sightings between them. A combination of two or three of these gives you the best odds of seeing all five.",
      },
      {
        q: "What is the most famous national park in Kenya?",
        a: "The Masai Mara — home of the Great Wildebeest Migration and Kenya's signature big-cat country.",
      },
      {
        q: "Can I combine multiple parks in one safari?",
        a: "Yes — most travellers visit three to five parks in a single itinerary. We design the route, drive times and lodge tiers around your interests.",
      },
      {
        q: "How long should a wildlife safari be?",
        a: "Seven to ten days gives you enough time to cover multiple parks comfortably without feeling rushed. Shorter three-to-four-day trips work well for a single reserve.",
      },
      {
        q: "Which park is best for elephants? For rhinos?",
        a: "Amboseli is the standout for elephants, set against Kilimanjaro. For rhinos, Ol Pejeta Conservancy and Lake Nakuru National Park are your best bets.",
      },
      {
        q: "Can I see the Great Migration in Kenya?",
        a: "Yes — the Migration arrives in the Masai Mara from July to October, when the dramatic Mara River crossings take place.",
      },
      {
        q: "Are Kenya's parks good for children? Is it safe?",
        a: "Both yes. Kenya's parks are professionally managed and travellers are always guided, and many lodges are family-friendly with private-vehicle options for families.",
      },
    ],
    faqHeader: {
      eyebrow: "FAQs · Kenya wildlife parks",
      heading: (
        <>
          Choosing <em className="italic text-bone-clay">your</em>
          <br />
          parks.
        </>
      ),
    },

    cta: {
      heading: (
        <>
          Let&apos;s build your
          <br />
          Kenya{" "}
          <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>safari</em>.
        </>
      ),
      description:
        "Tell us your budget, dates, wildlife interests and who's travelling — our safari experts will choose the best parks, lodges and routes and send a free, no-obligation proposal.",
    },
  };

  return <DestinationPageTemplate data={data} />;
}
