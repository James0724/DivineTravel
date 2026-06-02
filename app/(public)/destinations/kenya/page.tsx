import type { Metadata } from "next";
import connectDB from "@/lib/db/mongoose";
import SafariModel from "@/lib/db/models/Safari";
import DestinationPageTemplate, {
  type DestinationPageData,
  type SafariPkg,
} from "@/components/destinations/DestinationPageTemplate";
import type { Safari } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kenya Wildlife Parks & Reserves — Complete Safari Guide",
  description:
    "From the legendary Masai Mara to the elephant kingdom of Amboseli — your complete field guide to Kenya's national parks and reserves. Where to go, what to see, and when.",
  keywords:
    "kenya national parks, masai mara, amboseli, tsavo, kenya safari, big five kenya, kenya wildlife parks",
  alternates: { canonical: "/destinations/kenya" },
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

function mapToSafariPkg(safari: Safari): SafariPkg {
  const price =
    safari.pricing?.budget?.pricePerPerson ??
    safari.pricing?.midRange?.pricePerPerson ??
    safari.pricing?.luxury?.pricePerPerson;
  const tier = safari.pricing?.luxury
    ? "Luxury"
    : safari.pricing?.midRange
      ? "Mid-range"
      : "Budget";
  return {
    img:
      safari.coverImage ||
      "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
    tag: `Kenya · ${tier}`,
    name: safari.name,
    desc: safari.tagline ?? "",
    parks: [safari.location?.park, safari.location?.region].filter(
      Boolean,
    ) as string[],
    from: price ? `$${price.toLocaleString()}` : "On request",
    days: safari.duration
      ? `${safari.duration}D · ${safari.duration - 1}N`
      : "",
  };
}

async function getKenyaPackages(): Promise<SafariPkg[]> {
  try {
    await connectDB();
    const safaris = await SafariModel.find({
      "location.country": /kenya/i,
      active: true,
    })
      .sort({ featured: -1, rating: -1 })
      .limit(3)
      .select(
        "name slug tagline location duration pricing coverImage category featured active rating",
      )
      .lean();
    return (JSON.parse(JSON.stringify(safaris)) as Safari[]).map(
      mapToSafariPkg,
    );
  } catch {
    return [];
  }
}

export default async function KenyaDestinationPage() {
  const packages = await getKenyaPackages();

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
      title: (
        <>
          Kenya&apos;s wildlife
          <br />
          parks &amp;{" "}
          <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>reserves</em>.
        </>
      ),
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

    featureParks: [
      {
        id: "park-mara",
        num: "01",
        name: "Masai Mara",
        subtitle: "National Reserve",
        tag: "Big cats · Great Migration",
        image:
          "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        desc: "Kenya's most famous safari park, and arguably the best destination in all of Africa for big cats and dramatic predator–prey action. The Mara is the northern reach of the Serengeti ecosystem — open, golden, and thick with life.",
        highlights: [
          "The Great Migration river crossings, July to October",
          "Large resident lion prides",
          "Excellent leopard & cheetah sightings",
          "Massive wildebeest and zebra herds",
          "Sunrise hot-air balloon safaris",
        ],
        bestFor: "Big cats & the Migration",
        flip: false,
      },
      {
        id: "park-amboseli",
        num: "02",
        name: "Amboseli",
        subtitle: "National Park",
        tag: "Elephants · Kilimanjaro",
        image:
          "https://images.pexels.com/photos/13932855/pexels-photo-13932855.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "Known as the Land of Giants — huge elephant herds moving across the dust beneath the snow-capped silhouette of Mount Kilimanjaro. Amboseli is ideal for photographers and families seeking relaxed, immersive encounters.",
        highlights: [
          "Huge herds of big-tusker elephants",
          "Close-up elephant photography",
          "Spectacular views of Mount Kilimanjaro",
          "Excellent birdlife around the wetlands",
          "Accessible, easy year-round game viewing",
        ],
        bestFor: "Elephants, photography & families",
        flip: true,
      },
      {
        id: "park-tsavo",
        num: "03",
        name: "Tsavo East & West",
        subtitle: "",
        tag: "Wilderness · Big herds",
        image:
          "https://res.cloudinary.com/dk2j3k15k/image/upload/v1780428473/web_images/safaripackages/david-clode-YV_WwNH09cI-unsplash_ezkdqz.jpg",
        desc: "Kenya's vast, untamed wilderness — two adjoining parks that together form one of the largest protected areas on Earth. Combine both for the complete Tsavo experience: raw landscapes and a fraction of the crowds.",
        highlights: [
          "Wild, rugged landscapes with the famous red elephants",
          "Big herds along the Galana River",
          "Lion & cheetah · fewer crowds than the Mara",
          "Volcanic lava flows and crystal-clear Mzima Springs",
          "Ngulia Rhino Sanctuary (Tsavo West)",
        ],
        bestFor: "A raw, untamed safari",
        flip: false,
      },
      {
        id: "park-samburu",
        num: "04",
        name: "Samburu",
        subtitle: "National Reserve",
        tag: "Rare species · Culture",
        image:
          "https://images.pexels.com/photos/3384447/pexels-photo-3384447.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        desc: "A strikingly beautiful, semi-arid reserve in the north — home to the Samburu Special Five, a set of dry-country species you won't find in the southern parks, and deep cultural ties to the Samburu people.",
        highlights: [
          "Grevy's zebra — the largest, rarest zebra",
          "Reticulated giraffe",
          "Somali ostrich",
          "Beisa oryx",
          'Gerenuk — the long-necked "giraffe gazelle"',
        ],
        bestFor: "Rare northern wildlife",
        flip: true,
      },
      {
        id: "park-olpejeta",
        num: "05",
        name: "Ol Pejeta",
        subtitle: "Conservancy",
        tag: "Rhinos · Conservation",
        image:
          "https://images.pexels.com/photos/10399169/pexels-photo-10399169.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        desc: "A global conservation success story on the Laikipia plateau, and home to the largest population of black rhinos in East Africa — as well as the last two northern white rhinos on Earth.",
        highlights: [
          "Largest black rhino population in East Africa",
          "The last two northern white rhinos on Earth",
          "Among Kenya's highest predator densities",
          "Conservancy-level, hands-on experiences",
        ],
        bestFor: "Rhinos & luxury conservation",
        flip: false,
      },
    ],

    featureParksHeader: {
      eyebrow: "Major Kenya wildlife parks",
      description:
        "An expert-curated guide to Kenya's headline parks and reserves — written to help you choose the right destination for the safari you have in mind. We build custom itineraries combining three to five of these.",
    },

    moreParks: [
      {
        id: "park-nakuru",
        name: "Lake Nakuru",
        subtitle: "National Park",
        tag: "Rhinos · Flamingos",
        image:
          "https://images.pexels.com/photos/32416153/pexels-photo-32416153.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "A compact Rift Valley park famous for rhino and seasonal flamingos — a perfect one-to-two-day addition to a Mara or Naivasha safari.",
        highlights: [
          "Black & white rhino",
          "Flamingos (seasonal)",
          "Good leopard sightings & waterfalls",
        ],
        bestFor: "1–2 day add-on",
      },
      {
        id: "park-naivasha",
        name: "Lake Naivasha & Hell's Gate",
        subtitle: "",
        tag: "Water · Adventure",
        image:
          "https://images.pexels.com/photos/31848298/pexels-photo-31848298.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "Boat safaris, walking and cycling among wildlife, and the dramatic gorges of Hell's Gate — a relaxed, active break from the game-drive circuit.",
        highlights: [
          "Boat & walking safaris",
          "Cycling safaris in Hell's Gate",
          "Hippos, flamingos & canyons",
        ],
        bestFor: "Water-based & active",
      },
      {
        id: "park-lewa",
        name: "Lewa Wildlife",
        subtitle: "Conservancy",
        tag: "Luxury · UNESCO",
        image:
          "https://images.pexels.com/photos/1617411/pexels-photo-1617411.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "A UNESCO World Heritage Site and a byword for exclusive, community-led conservation — premium lodges and rare wildlife in equal measure.",
        highlights: [
          "Endangered Grevy's zebra",
          "Rare black & white rhino",
          "Premium, exclusive lodges",
        ],
        bestFor: "Honeymoon & luxury",
      },
      {
        id: "park-meru",
        name: "Meru",
        subtitle: "National Park",
        tag: "Wilderness · Remote",
        image:
          "https://images.pexels.com/photos/16444284/pexels-photo-16444284.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "The wild, untouched park where the story of Elsa the Lioness unfolded — excellent big-game sightings with a fraction of the vehicles.",
        highlights: [
          "Lion, cheetah & elephant",
          "Few other vehicles",
          "Authentic, remote wilderness",
        ],
        bestFor: "Off-the-beaten-track",
      },
      {
        id: "park-aberdare",
        name: "Aberdare",
        subtitle: "National Park",
        tag: "Highlands · Forest",
        image:
          "https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "High-altitude forests and moorlands with treehouse-style lodges and rare night wildlife viewing — a cool, green contrast to the savannah.",
        highlights: [
          "Treehouse-style lodges",
          "Elephants & bushbuck",
          "Waterfalls & night viewing",
        ],
        bestFor: "Peaceful highland escape",
      },
      {
        id: "park-nairobi",
        name: "Nairobi",
        subtitle: "National Park",
        tag: "City edge · Day trip",
        image:
          "https://images.pexels.com/photos/25950513/pexels-photo-25950513.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
        desc: "The world's only national park inside a capital city — lions, rhinos and giraffes against the skyline, perfect for a layover or your first morning.",
        highlights: [
          "Lions, rhino & giraffe",
          "Cheetah & buffalo",
          "Minutes from the city centre",
        ],
        bestFor: "Short trips & layovers",
      },
    ],

    moreParksGridCols: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",

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

    packages:
      packages.length > 0
        ? packages
        : [
            {
              img: "https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
              tag: "Kenya · Mid-range",
              name: "3 Days Masai Mara Safari",
              desc: "Two full game drives in the Big Five reserve — sunrise to sundowner, optional balloon.",
              parks: ["Masai Mara"],
              from: "On request",
              days: "3D · 2N",
            },
            {
              img: "https://images.pexels.com/photos/86413/pexels-photo-86413.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
              tag: "Kenya · Mid-range",
              name: "7-Day Kenya Highlights Safari",
              desc: "Kenya's greatest hits in a week — open plains, flamingo lakes and elephant country.",
              parks: ["Masai Mara", "Lake Nakuru", "Amboseli"],
              from: "On request",
              days: "7D · 6N",
            },
            {
              img: "https://images.pexels.com/photos/724626/pexels-photo-724626.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
              tag: "Kenya · Luxury",
              name: "Honeymoon Safaris in the Mara",
              desc: "Slow private mornings and bush dinners — the ultimate wedding-dream trip.",
              parks: ["Masai Mara", "Lewa"],
              from: "On request",
              days: "6D · 5N",
            },
          ],
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
