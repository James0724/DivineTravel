import type { Metadata } from 'next'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import DestinationPageTemplate, {
  type DestinationPageData,
  type SafariPkg,
} from '@/components/destinations/DestinationPageTemplate'
import type { Safari } from '@/types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Uganda Wildlife Parks & Reserves — Complete Safari Guide',
  description:
    "Home to half the world's mountain gorillas, wild chimpanzees and tree-climbing lions — your complete guide to Uganda's national parks, primate habitats and safari experiences.",
  keywords: 'uganda gorilla trekking, bwindi impenetrable forest, queen elizabeth national park, kibale, uganda safari',
  alternates: { canonical: '/en/destinations/uganda' },
  openGraph: {
    title: 'Uganda Wildlife Parks & Reserves | Divine Travel Nest Safaris',
    description: "A complete expert guide to Uganda's national parks and primate habitats.",
    type: 'website',
    images: [{ url: 'https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', width: 1200, height: 630, alt: 'Uganda Gorilla Safari' }],
  },
}

function mapToSafariPkg(safari: Safari): SafariPkg {
  const price =
    safari.pricing?.budget?.pricePerPerson ??
    safari.pricing?.midRange?.pricePerPerson ??
    safari.pricing?.luxury?.pricePerPerson
  const tier = safari.pricing?.luxury ? 'Luxury' : safari.pricing?.midRange ? 'Mid-range' : 'Budget'
  return {
    slug: safari.slug,
    img: safari.coverImage || 'https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
    tag: `Uganda · ${tier}`,
    name: safari.name,
    desc: safari.tagline ?? '',
    parks: [safari.location?.park, safari.location?.region].filter(Boolean) as string[],
    from: price ?? null,
    days: safari.duration ? `${safari.duration}D · ${safari.duration - 1}N` : '',
  }
}

async function getUgandaPackages(): Promise<SafariPkg[]> {
  try {
    await connectDB()
    const safaris = await SafariModel.find({
      $or: [{ 'location.country': /uganda/i }, { 'location.countries': /uganda/i }],
      active: true,
    })
      .sort({ featured: -1, duration: 1, rating: -1 })
      .limit(3)
      .select('name slug tagline location duration pricing coverImage category featured active rating')
      .lean()
    return (JSON.parse(JSON.stringify(safaris)) as Safari[]).map(mapToSafariPkg)
  } catch {
    return []
  }
}

export default async function UgandaDestinationPage() {
  const packages = await getUgandaPackages()

  const data: DestinationPageData = {
    breadcrumbs: [
      { name: 'Home', href: '/' },
      { name: 'Destinations', href: '/destinations/uganda' },
      { name: 'Uganda', href: '/destinations/uganda' },
    ],

    hero: {
      image: 'https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80',
      imageAlt: 'Mountain gorilla resting in the Ugandan forest',
      slug: 'uganda',
      title: (
        <>
          Uganda&apos;s wild
          <br />
          parks &amp;{' '}
          <em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>primates</em>.
        </>
      ),
      description:
        "Half the world's mountain gorillas, wild chimpanzees, tree-climbing lions and the mighty Murchison Falls — the Pearl of Africa lives up to every name it has ever been given.",
      stats: [
        { num: '460',   sup: '+', lbl: 'Mountain gorillas' },
        { num: '10',    sup: '',  lbl: 'National parks'    },
        { num: '1,000', sup: '+', lbl: 'Bird species'      },
      ],
    },

    why: {
      images: [
        { src: 'https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', alt: 'Mountain gorilla in Bwindi Impenetrable Forest, Uganda' },
        { src: 'https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', alt: 'Chimpanzee in the wild, Uganda' },
      ],
      eyebrow: 'Why Uganda is unmissable',
      heading: (
        <>
          The Pearl
          <br />
          of <em className="italic text-bone-clay">Africa</em>.
        </>
      ),
      description:
        'Winston Churchill called Uganda the Pearl of Africa — and a safari here will show you exactly why. No other country on Earth combines mountain gorillas, chimpanzees, tree-climbing lions and the Victoria Nile in a single circuit.',
      reasons: [
        { n: 'i', title: 'Mountain gorillas', desc: "— half the world's remaining population lives in Bwindi Impenetrable Forest." },
        { n: 'ii', title: 'Best chimpanzee trekking in Africa', desc: '— Kibale Forest has over 1,500 chimps and the highest habituation success rates.' },
        { n: 'iii', title: 'Tree-climbing lions', desc: '— the Ishasha sector of Queen Elizabeth NP is one of only two places on Earth to see this behaviour.' },
        { n: 'iv', title: 'Over 1,000 bird species', desc: '— Uganda is a birding paradise, including the shoebill stork.' },
        { n: 'v', title: 'Compact circuit', desc: '— the main parks are within 6–8 hours of Kampala; a 7-day trip covers the gorillas, chimps and savannah.' },
      ],
    },

    featureParks: [
      { id: 'park-bwindi', num: '01', name: 'Bwindi Impenetrable', subtitle: 'National Park', tag: 'Mountain gorillas · UNESCO', image: 'https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', desc: "The world's most important habitat for mountain gorillas and a UNESCO World Heritage Site. Bwindi holds almost half of all remaining mountain gorillas — trekking to spend one hour with a habituated family is widely considered the most profound wildlife encounter on Earth.", highlights: ['Home to ~460 mountain gorillas — half the global population', 'Four trekking sectors: Buhoma, Ruhija, Rushaga, Nkuringo', 'Gorilla habituation experience (4+ hours with a group)', 'Over 350 bird species including 23 Albertine Rift endemics', 'UNESCO World Heritage Site'], bestFor: 'Gorilla trekking', flip: false },
      { id: 'park-queen-elizabeth', num: '02', name: 'Queen Elizabeth', subtitle: 'National Park', tag: 'Tree lions · Boat safari', image: 'https://images.pexels.com/photos/3384447/pexels-photo-3384447.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', desc: "Uganda's most visited park, straddling the Equator between the Rwenzori Mountains and the shores of Lake Edward. Famous for the tree-climbing lions of Ishasha and the Kazinga Channel boat safari — one of Africa's great waterway experiences.", highlights: ['Tree-climbing lions in the Ishasha sector', 'Kazinga Channel boat safari (hippos, elephants, buffalo)', 'Chimpanzees in the Kyambura Gorge', 'Over 600 bird species — second only to Murchison for Uganda birding', 'Savannah, forest, wetlands and crater lakes'], bestFor: 'Tree lions & boat safari', flip: true },
      { id: 'park-kibale', num: '03', name: 'Kibale Forest', subtitle: 'National Park', tag: 'Chimpanzees · Forest', image: 'https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', desc: "Africa's best destination for chimpanzee trekking — Kibale has the highest density of primates of any African forest, with habituated chimpanzee communities that are easily encountered on morning treks. Over 1,500 chimps call this forest home.", highlights: ["Africa's best chimpanzee trekking — year-round", "13 primate species including red colobus and L'Hoest's monkey", 'Bigodi Wetland Sanctuary — excellent birding', 'Night forest walks for nocturnal species', 'Ideal combination with Queen Elizabeth NP'], bestFor: 'Chimpanzee tracking', flip: false },
      { id: 'park-murchison', num: '04', name: 'Murchison Falls', subtitle: 'National Park', tag: 'Nile · Savannah · Shoebill', image: 'https://images.pexels.com/photos/29897218/pexels-photo-29897218.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', desc: "Uganda's largest national park, where the Nile forces itself through a 7-metre gorge with tremendous power — creating the most impressive waterfall in Africa. Murchison combines classic savannah game drives with boat safaris on the Nile and exceptional shoebill stork sightings.", highlights: ["Murchison Falls — the world's most powerful waterfall per unit volume", 'Boat safari on the Victoria Nile to the base of the falls', "Shoebill stork — Africa's most sought-after bird", 'Large populations of hippo, Nile crocodile and elephant', 'Rothschild giraffe and lion on the savannah'], bestFor: 'Nile boat safari & birding', flip: true },
    ],

    featureParksHeader: {
      eyebrow: "Uganda's headline parks",
      description: "Uganda's headline parks each offer a completely different safari experience — from dense jungle gorilla tracking to open savannah, river boat safaris and misty mountain forests.",
    },

    moreParks: [
      { id: 'park-kidepo', name: 'Kidepo Valley', subtitle: 'National Park', tag: 'Wilderness · Remote', image: 'https://images.pexels.com/photos/10800257/pexels-photo-10800257.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', desc: "Uganda's most remote park — and arguably its most spectacular. Kidepo's semi-arid landscape borders South Sudan and Ethiopia, with wildlife found nowhere else in Uganda.", highlights: ['Cheetah — found only here in Uganda', 'Striped hyena & bat-eared fox', 'Remote fly-in access — virtually no crowds'], bestFor: 'Total exclusivity' },
      { id: 'park-lake-mburo', name: 'Lake Mburo', subtitle: 'National Park', tag: 'Zebra · Antelope', image: 'https://images.pexels.com/photos/7017421/pexels-photo-7017421.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', desc: "Uganda's only park with zebra — a compact, accessible reserve that makes a perfect stopover between Kampala and Bwindi. Walking and cycling safaris are permitted.", highlights: ["Uganda's only zebra population", 'Impala, topi & eland', 'Boat safaris on Lake Mburo'], bestFor: 'Stopover & walking safari' },
      { id: 'park-rwenzori', name: 'Rwenzori Mountains', subtitle: 'National Park', tag: 'Trekking · UNESCO', image: 'https://images.pexels.com/photos/31939652/pexels-photo-31939652.jpeg?auto=compress&cs=tinysrgb&w=800&q=80', desc: 'The legendary Mountains of the Moon — glaciated peaks, unique Afro-alpine vegetation and multi-day trekking through some of the most dramatic mountain scenery in Africa.', highlights: ['Glaciated peaks above 5,100m', 'Unique Afro-alpine vegetation zones', 'UNESCO World Heritage Site'], bestFor: 'Mountain trekking' },
    ],

    moreParksGridCols: 'grid-cols-1 sm:grid-cols-3',

    moreParksHeader: {
      eyebrow: 'More of Uganda',
      heading: (<>Remote valleys &amp;<br /><em className="italic text-bone-clay">hidden gems</em>.</>),
      description: "Uganda's lesser-visited parks offer extraordinary exclusivity and unique wildlife — perfect add-ons for travellers who want to go beyond the main circuit.",
    },

    howToChoose: [
      { want: 'For gorilla trekking', go: 'Bwindi Impenetrable' },
      { want: 'For chimpanzees', go: 'Kibale Forest' },
      { want: 'For tree lions', go: 'Queen Elizabeth (Ishasha)' },
      { want: 'For boat safari', go: 'Murchison Falls / QE' },
      { want: 'For shoebill stork', go: 'Murchison Falls' },
      { want: 'For exclusivity', go: 'Kidepo Valley' },
      { want: 'For first-timers', go: 'Bwindi + QE + Kibale' },
      { want: 'For walking safari', go: 'Lake Mburo' },
    ],
    howToChooseDescription:
      "Uganda's parks each deliver a unique experience. Start from your priority wildlife encounter — then we design the perfect circuit around it.",

    bestTime: {
      heading: (<>A year-round<br /><em className="italic" style={{ color: '#f4d4a8' }}>destination</em>.</>),
      description: "Gorilla trekking is possible every month of the year — but some months are more comfortable than others. Here's how the seasons affect your Uganda trip.",
      seasons: [
        { badge: 'Dry season · Jun–Aug & Dec–Jan', title: 'Drier trails, easier trekking.', items: ['Trails are drier and less slippery for gorilla trekking', 'Best for game viewing in savannah parks', 'Peak season — permits sell out fastest in June–August', 'Clear skies for mountain views (Rwenzori)'] },
        { badge: 'Green season · Mar–May & Sep–Nov', title: 'Lush forest & lower prices.', items: ['Lower permit availability (easier to book last-minute)', 'Lush, green forests ideal for photography', 'Fewer tourists — more solitary gorilla experiences', 'Excellent birdwatching as migrant birds arrive'] },
      ],
    },

    packages: packages.length > 0 ? packages : [
      { img: 'https://images.pexels.com/photos/35889782/pexels-photo-35889782.jpeg?auto=compress&cs=tinysrgb&w=900&q=80', tag: 'Uganda · Gorilla', name: '4-Day Gorilla Trekking Safari', desc: 'Fly to Bwindi, trek to the gorillas, enjoy lodge accommodation in the forest.', parks: ['Bwindi Impenetrable'], from: null, days: '4D · 3N' },
      { img: 'https://images.pexels.com/photos/12635318/pexels-photo-12635318.jpeg?auto=compress&cs=tinysrgb&w=900&q=80', tag: 'Uganda · Circuit', name: '8-Day Uganda Primate Circuit', desc: 'Gorillas in Bwindi, chimps in Kibale, tree lions in Queen Elizabeth.', parks: ['Bwindi', 'Kibale', 'Queen Elizabeth'], from: null, days: '8D · 7N' },
      { img: 'https://images.pexels.com/photos/29897218/pexels-photo-29897218.jpeg?auto=compress&cs=tinysrgb&w=900&q=80', tag: 'Uganda · Full circuit', name: '12-Day Complete Uganda Safari', desc: 'The ultimate Uganda experience — gorillas, chimps, savannah and Murchison Falls.', parks: ['Bwindi', 'Queen Elizabeth', 'Kibale', 'Murchison'], from: null, days: '12D · 11N' },
    ],
    packagesHref: '/safaris?country=Uganda',
    packagesLinkText: 'Browse all Uganda safari packages →',
    packagesHeader: {
      eyebrow: 'Uganda safari packages',
      heading: (<>Uganda safari<br /><em className="italic text-bone-clay">packages</em>.</>),
      description: 'From a dedicated gorilla permit trip to the full Uganda primate circuit — every itinerary is fully customisable for your dates, group and budget.',
    },

    faqs: [
      { q: 'How much does a gorilla trekking permit cost in Uganda?', a: 'A gorilla trekking permit in Uganda costs $800 per person per trek (as of 2026). This includes one hour with a habituated gorilla family. The gorilla habituation experience costs $1,500 per person for 4+ hours.' },
      { q: 'How far in advance should I book gorilla permits?', a: 'For peak months (June–August, December–January), book 6–12 months ahead. Bwindi permits are genuinely limited — each family receives a maximum of 8 visitors per day. We handle permit sourcing for all clients.' },
      { q: 'Can I combine gorilla trekking with other Uganda parks?', a: 'Yes — a classic Uganda circuit combines Bwindi (gorillas) with Queen Elizabeth NP (tree lions, boat safari) and Kibale Forest (chimpanzees). A 7–10 day itinerary comfortably covers all three.' },
      { q: 'What is the best time to visit Uganda?', a: 'Uganda is a year-round destination — gorilla trekking is possible every month. The drier months (June–August, December–January) are generally preferred as trails are less muddy. The green season (March–May, October–November) is cheaper and the forests are lush.' },
      { q: 'Is Uganda safe for safari travel?', a: 'Uganda is generally safe for safari travellers. The national parks are well-managed and professionally staffed. We always brief clients on current conditions and arrange experienced local guides for all activities.' },
      { q: 'What should I pack for gorilla trekking?', a: 'Waterproof hiking boots with ankle support, long trousers, long-sleeved shirt, garden gloves, rain jacket, 1.5L water, snacks, and a camera with a fast lens. Walking sticks are provided at the trailhead — always accept one.' },
    ],
    faqHeader: {
      eyebrow: 'FAQs · Uganda',
      heading: (<>Your Uganda <em className="italic text-bone-clay">questions</em>.</>),
    },

    cta: {
      heading: (<>Plan your<br />Uganda <em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>adventure</em>.</>),
      description: "Gorilla permits, chimp tracking, park circuits — our Uganda specialists handle every detail. Tell us when you want to go and we'll secure your permits and design the itinerary at no charge.",
    },
  }

  return <DestinationPageTemplate data={data} />
}
