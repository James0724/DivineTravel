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
  title: "Tanzania Wildlife Parks & Reserves — Complete Safari Guide",
  description:
    "From the endless Serengeti plains to the Ngorongoro Crater, Tarangire and the pristine southern parks — your complete expert guide to Tanzania's national parks and game reserves.",
  keywords:
    "tanzania national parks, serengeti, ngorongoro crater, tarangire, tanzania safari, big five tanzania",
  alternates: { canonical: "/en/destinations/tanzania" },
  openGraph: {
    title: "Tanzania Wildlife Parks & Reserves | Divine Travel Nest Safaris",
    description:
      "A complete expert guide to Tanzania's national parks and reserves.",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/33650573/pexels-photo-33650573.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Tanzania Safari",
      },
    ],
  },
};

async function getTanzaniaPackages(): Promise<Safari[]> {
  try {
    await connectDB();
    const safaris = await SafariModel.find({
      $or: [
        { "location.country": /tanzania/i },
        { "location.countries": /tanzania/i },
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

export default async function TanzaniaDestinationPage() {
  const [packages, { featureParks, moreParks }] = await Promise.all([
    getTanzaniaPackages(),
    getCountryParksForListing("Tanzania"),
  ]);

  const data: DestinationPageData = {
    breadcrumbs: [
      { name: "Home", href: "/" },
      { name: "Destinations", href: "/destinations/tanzania" },
      { name: "Tanzania", href: "/destinations/tanzania" },
    ],

    hero: {
      image:
        "https://images.pexels.com/photos/33650573/pexels-photo-33650573.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80",
      imageAlt: "Wildebeest grazing across the vast Serengeti plains, Tanzania",
      slug: "tanzania",
      title: " Tanzania's wildlife parks & reserves ",
      description:
        "From the endless Serengeti plains and the ancient caldera of Ngorongoro to the elephant kingdom of Tarangire and the untamed southern wilderness — the definitive guide to Tanzania's greatest wildlife destinations.",
      stats: [
        { num: "16", sup: "", lbl: "Parks & reserves" },
        { num: "Big 5", sup: "", lbl: "Year-round viewing" },
        { num: "1.5", sup: "M", lbl: "Migrating wildebeest" },
      ],
    },

    why: {
      images: [
        {
          src: "https://images.pexels.com/photos/10399169/pexels-photo-10399169.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Male lion resting on the Serengeti savanna, Tanzania",
        },
        {
          src: "https://images.pexels.com/photos/25950513/pexels-photo-25950513.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
          alt: "Safari vehicle in the Ngorongoro Crater, Tanzania",
        },
      ],
      eyebrow: "Why Tanzania is unmissable",
      heading: (
        <>
          The Serengeti.
          <br />
          The Crater.
          <br />
          <em className="italic text-bone-clay">The Migration</em>.
        </>
      ),
      description:
        "Tanzania holds some of the most famous names in all of wildlife — and delivers on every one. The country's northern circuit alone is enough for a lifetime of safaris.",
      reasons: [
        {
          n: "i",
          title: "The Great Migration",
          desc: "Present in Tanzania for 10 of 12 months — the calving, the crossing and everything in between.",
        },
        {
          n: "ii",
          title: "Ngorongoro Crater",
          desc: "The world's most reliable Big Five destination — all five in a single day.",
        },
        {
          n: "iii",
          title: "16 national parks and reserves",
          desc: "From the far north to the remote south — a park for every type of traveller.",
        },
        {
          n: "iv",
          title: "Wild dog stronghold",
          desc: "Ruaha and Selous hold some of the world's last viable wild dog populations.",
        },
        {
          n: "v",
          title: "Zanzibar extension",
          desc: "Safari and beach in one country — Zanzibar's white sands are 45 minutes by flight.",
        },
      ],
    },

    featureParks,

    featureParksHeader: {
      eyebrow: "Tanzania's headline parks",
      description:
        "Tanzania's parks span two distinct circuits — the busy, spectacular north and the remote, wild south. This guide covers both so you can decide what fits your trip.",
    },

    moreParks,

    moreParksHeader: {
      eyebrow: "More of Tanzania",
      heading: (
        <>
          Beyond the
          <br />
          <em className="italic text-bone-clay">northern circuit</em>.
        </>
      ),
      description:
        "The northern circuit gets all the attention — but Tanzania's southern parks, mountain forests and island extension offer experiences unlike anything in the north.",
    },

    howToChoose: [
      { want: "For the Migration", go: "Serengeti (year-round)" },
      { want: "For Big Five", go: "Ngorongoro Crater" },
      { want: "For elephants", go: "Tarangire (Jun–Oct)" },
      { want: "For wilderness", go: "Ruaha or Selous" },
      { want: "For wild dogs", go: "Selous / Ruaha" },
      { want: "For beach extension", go: "Zanzibar" },
      { want: "For chimps", go: "Mahale Mountains" },
      { want: "For first-timers", go: "Northern Circuit" },
    ],
    howToChooseDescription:
      "Tanzania's parks serve very different purposes. Start from what you most want — then we combine three to five parks into one seamless journey.",

    bestTime: {
      heading: (
        <>
          Follow the
          <br />
          <em className="italic" style={{ color: "#f4d4a8" }}>
            Migration
          </em>
          .
        </>
      ),
      description:
        "Tanzania is open year-round — but the experience changes dramatically by season. The right month to come depends entirely on what you want to witness.",
      seasons: [
        {
          badge: "Dry season · June – October",
          title: "Best game viewing.",
          items: [
            "Driest conditions — best visibility",
            "Wildebeest river crossings in northern Serengeti (Jul–Oct)",
            "Large elephant herds in Tarangire",
            "Peak safari season — book ahead",
          ],
        },
        {
          badge: "Green season · November – May",
          title: "The calving & quieter roads.",
          items: [
            "Wildebeest calving in the south (Jan–Mar)",
            "Lush green Serengeti — dramatic skies",
            "Lower prices, fewer vehicles",
            "Exceptional birdwatching",
          ],
        },
      ],
    },

    packages,
    packagesHref: "/safaris?country=Tanzania",
    packagesLinkText: "Browse all Tanzania safari packages →",
    packagesHeader: {
      eyebrow: "Safaris touching these parks",
      heading: (
        <>
          Tanzania safari
          <br />
          <em className="italic text-bone-clay">packages</em>.
        </>
      ),
      description:
        "Hand-picked Tanzania itineraries — from a classic 6-day northern circuit to the full migration journey. Every route is customisable for your dates and budget.",
    },

    faqs: [
      {
        q: "Which is better — Kenya or Tanzania for a first safari?",
        a: "Both are world-class. Tanzania has the Serengeti and Ngorongoro — arguably the most famous names in safari. Kenya's Masai Mara is easier to combine with other destinations and offers more price flexibility. Many first-timers choose to combine both countries.",
      },
      {
        q: "Can I see the Great Migration in Tanzania?",
        a: "Yes — the Migration is in Tanzania for around 10 months of the year. The calving season (Jan–March) takes place in the southern Serengeti; the herds are in the northern Serengeti for the spectacular Mara River crossings from July to October.",
      },
      {
        q: "How many days do I need in the Serengeti?",
        a: "Three nights is the minimum for a good game-viewing experience; four to five nights allows you to explore different zones and increases your chances of witnessing key wildlife events.",
      },
      {
        q: "Is Ngorongoro worth visiting?",
        a: "Absolutely. The Ngorongoro Crater is one of the most reliable Big Five destinations in Africa — and many visitors consider a single day on the crater floor to be the highlight of their entire trip.",
      },
      {
        q: "What is the best time to visit Tanzania?",
        a: "The long dry season (June–October) is generally best for wildlife viewing across all parks. January–March is excellent for the calving season and fewer crowds. Avoid the long rains (April–May) for driving safaris.",
      },
      {
        q: "Can I combine Tanzania with Kenya?",
        a: "Yes — a classic East Africa circuit combines Amboseli or the Masai Mara (Kenya) with the Serengeti and Ngorongoro (Tanzania). Most visitors fly between the two countries on short domestic flights.",
      },
    ],
    faqHeader: {
      eyebrow: "FAQs · Tanzania",
      heading: (
        <>
          Your Tanzania <em className="italic text-bone-clay">questions</em>.
        </>
      ),
    },

    cta: {
      heading: (
        <>
          Let&apos;s plan your
          <br />
          Tanzania{" "}
          <em style={{ color: "#f4d4a8", fontStyle: "italic" }}>safari</em>.
        </>
      ),
      description:
        "Tell us your budget, dates, interests and group size — our Tanzania specialists will design the perfect circuit and send a free proposal within 24 hours.",
    },
  };

  return <DestinationPageTemplate data={data} />;
}
