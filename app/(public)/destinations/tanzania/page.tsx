import type { Metadata } from 'next'
import DestinationPageTemplate, {
  type DestinationPageData,
} from '@/components/destinations/DestinationPageTemplate'

export const metadata: Metadata = {
  title: 'Tanzania Wildlife Parks & Reserves — Complete Safari Guide',
  description:
    "From the endless Serengeti plains to the Ngorongoro Crater, Tarangire and the pristine southern parks — your complete expert guide to Tanzania's national parks and game reserves.",
  keywords: 'tanzania national parks, serengeti, ngorongoro crater, tarangire, tanzania safari, big five tanzania',
  alternates: { canonical: '/destinations/tanzania' },
  openGraph: {
    title: 'Tanzania Wildlife Parks & Reserves | Divine Travel Nest Safaris',
    description: "A complete expert guide to Tanzania's national parks and reserves.",
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1200&q=80', width: 1200, height: 630, alt: 'Tanzania Safari' }],
  },
}

const data: DestinationPageData = {
  breadcrumbs: [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations/tanzania' },
    { name: 'Tanzania', href: '/destinations/tanzania' },
  ],

  hero: {
    image: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1800&q=80',
    imageAlt: 'The Serengeti — Tanzania',
    slug: 'tanzania',
    title: (
      <>
        Tanzania&apos;s wildlife
        <br />
        parks &amp;{' '}
        <em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>reserves</em>.
      </>
    ),
    description:
      "From the endless Serengeti plains and the ancient caldera of Ngorongoro to the elephant kingdom of Tarangire and the untamed southern wilderness — the definitive guide to Tanzania's greatest wildlife destinations.",
    stats: [
      { num: '16', lbl: 'Parks & reserves' },
      { num: 'Big 5', lbl: 'Year-round' },
      { num: '1.5M', lbl: 'Migrating wildebeest' },
    ],
  },

  why: {
    images: [
      { src: 'https://images.unsplash.com/photo-1589308154441-3db3e7b4e8c4?w=800&q=80', alt: 'Tanzania wildlife' },
      { src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', alt: 'Tanzania safari' },
    ],
    eyebrow: 'Why Tanzania is unmissable',
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
      { n: 'i', title: 'The Great Migration', desc: 'Present in Tanzania for 10 of 12 months — the calving, the crossing and everything in between.' },
      { n: 'ii', title: 'Ngorongoro Crater', desc: "The world's most reliable Big Five destination — all five in a single day." },
      { n: 'iii', title: '16 national parks and reserves', desc: 'From the far north to the remote south — a park for every type of traveller.' },
      { n: 'iv', title: 'Wild dog stronghold', desc: "Ruaha and Selous hold some of the world's last viable wild dog populations." },
      { n: 'v', title: 'Zanzibar extension', desc: "Safari and beach in one country — Zanzibar's white sands are 45 minutes by flight." },
    ],
  },

  featureParks: [
    { id: 'park-serengeti', num: '01', name: 'Serengeti', subtitle: 'National Park', tag: 'Migration · Big cats', image: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1200&q=80', desc: "Africa's most iconic savannah — the Serengeti is the world's greatest wildlife spectacle. Over 1.5 million wildebeest, 250,000 zebra and 470,000 gazelle move across its plains in a continuous, year-round cycle.", highlights: ['The Great Migration — present 10 months of the year', 'Largest lion population in Africa', 'Year-round cheetah and leopard sightings', 'Wildebeest calving in the south (January–March)', 'River crossings in the north (July–October)'], bestFor: 'The Migration & big cats', flip: false },
    { id: 'park-ngorongoro', num: '02', name: 'Ngorongoro', subtitle: 'Conservation Area', tag: 'Big Five · Crater', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80', desc: "The world's largest intact, unflooded volcanic caldera — 260 sq km of self-contained ecosystem where you can reliably see all of the Big Five in a single day. The resident black rhino population is one of Africa's best-protected.", highlights: ['All Big Five in a single day — most reliable in Africa', 'Resident black rhino population', 'Large lion prides on the crater floor', 'Thousands of seasonal flamingos on Lake Magadi', 'Dramatic crater-rim lodge views'], bestFor: 'Big Five in a day', flip: true },
    { id: 'park-tarangire', num: '03', name: 'Tarangire', subtitle: 'National Park', tag: 'Elephants · Baobabs', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80', desc: "Africa's best dry-season elephant park — thousands of elephants converge on the Tarangire River from July to October, creating scenes of extraordinary density. The baobab-studded landscape is unlike anywhere else in Tanzania.", highlights: ['Largest elephant concentration in northern Tanzania (dry season)', 'Iconic baobab landscape', 'Tree-climbing lions', 'Excellent birdlife — 550+ species', 'Fewer crowds than the Serengeti'], bestFor: 'Elephants & dry-season drama', flip: false },
    { id: 'park-ruaha', num: '04', name: 'Ruaha', subtitle: 'National Park', tag: 'Wilderness · Seclusion', image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&q=80', desc: "Tanzania's largest national park and one of Africa's last true wilderness areas. Ruaha is raw, wild and virtually uncrowded — lion prides here are among the largest in Africa, and wild dog sightings are among the best on the continent.", highlights: ["Tanzania's largest national park — vast and wild", "Among Africa's best wild dog sightings", 'Huge lion prides (groups of 20+)', 'Large herds of elephant and buffalo', 'Virtually no vehicle congestion'], bestFor: 'True wilderness & exclusivity', flip: true },
    { id: 'park-selous', num: '05', name: 'Selous / Nyerere', subtitle: 'National Park', tag: 'Boat safari · Wild dogs', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', desc: "One of Africa's largest protected areas and a UNESCO World Heritage Site. The Rufiji River system creates a unique aquatic safari environment — boat safaris and walking safaris complement the classic game drive in a way found nowhere else in Tanzania.", highlights: ['Boat safaris on the Rufiji River', 'Walking safaris through true wilderness', "Africa's largest wild dog population", 'Hippo pools, crocodiles & waterbirds', 'Remote, exclusive fly-in camps'], bestFor: 'Boat safaris & wild dogs', flip: false },
  ],

  featureParksHeader: {
    eyebrow: "Tanzania's headline parks",
    description: "Tanzania's parks span two distinct circuits — the busy, spectacular north and the remote, wild south. This guide covers both so you can decide what fits your trip.",
  },

  moreParks: [
    { id: 'park-manyara', name: 'Lake Manyara', subtitle: 'National Park', tag: 'Tree lions · Flamingos', image: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&q=80', desc: 'A compact, diverse park famous for tree-climbing lions, large elephant herds and seasonal flamingos along its alkaline lake shore.', highlights: ['Tree-climbing lions', 'Large elephant herds', 'Seasonal flamingo flocks'], bestFor: 'Half-day add-on' },
    { id: 'park-kilimanjaro', name: 'Kilimanjaro', subtitle: 'National Park', tag: 'Trekking · UNESCO', image: 'https://images.unsplash.com/photo-1488892483958-eb08df78c7d1?w=800&q=80', desc: "Africa's highest peak and a UNESCO World Heritage Site — five ecological zones from cultivation to arctic summit. Multiple routes, 5–9 day climbs.", highlights: ["Africa's highest point (5,895m)", 'Five ecological zones', 'Multiple summit routes'], bestFor: 'Trekking & achievement' },
    { id: 'park-mahale', name: 'Mahale Mountains', subtitle: 'National Park', tag: 'Chimpanzees · Remote', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80', desc: 'On the shores of Lake Tanganyika, Mahale is home to over 1,000 wild chimpanzees — the most accessible chimp tracking experience in Tanzania.', highlights: ['Best chimpanzee trekking in Tanzania', 'Lake Tanganyika beach camps', 'Fly-in access only'], bestFor: 'Chimp trekking & seclusion' },
    { id: 'park-zanzibar', name: 'Zanzibar', subtitle: 'Archipelago', tag: 'Beach · Culture', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad01813?w=800&q=80', desc: "The spice island — UNESCO Stone Town, pristine white-sand beaches and snorkelling on coral reefs make Zanzibar the perfect safari-and-beach extension.", highlights: ['Stone Town (UNESCO World Heritage)', 'Pristine beaches & snorkelling', 'Perfect safari extension'], bestFor: 'Post-safari beach stay' },
  ],

  moreParksGridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',

  moreParksHeader: {
    eyebrow: 'More of Tanzania',
    heading: (<>Beyond the<br /><em className="italic text-bone-clay">northern circuit</em>.</>),
    description: "The northern circuit gets all the attention — but Tanzania's southern parks, mountain forests and island extension offer experiences unlike anything in the north.",
  },

  howToChoose: [
    { want: 'For the Migration', go: 'Serengeti (year-round)' },
    { want: 'For Big Five', go: 'Ngorongoro Crater' },
    { want: 'For elephants', go: 'Tarangire (Jun–Oct)' },
    { want: 'For wilderness', go: 'Ruaha or Selous' },
    { want: 'For wild dogs', go: 'Selous / Ruaha' },
    { want: 'For beach extension', go: 'Zanzibar' },
    { want: 'For chimps', go: 'Mahale Mountains' },
    { want: 'For first-timers', go: 'Northern Circuit' },
  ],
  howToChooseDescription:
    "Tanzania's parks serve very different purposes. Start from what you most want — then we combine three to five parks into one seamless journey.",

  bestTime: {
    heading: (<>Follow the<br /><em className="italic" style={{ color: '#f4d4a8' }}>Migration</em>.</>),
    description: 'Tanzania is open year-round — but the experience changes dramatically by season. The right month to come depends entirely on what you want to witness.',
    seasons: [
      { badge: 'Dry season · June – October', title: 'Best game viewing.', items: ['Driest conditions — best visibility', 'Wildebeest river crossings in northern Serengeti (Jul–Oct)', 'Large elephant herds in Tarangire', 'Peak safari season — book ahead'] },
      { badge: 'Green season · November – May', title: 'The calving & quieter roads.', items: ['Wildebeest calving in the south (Jan–Mar)', 'Lush green Serengeti — dramatic skies', 'Lower prices, fewer vehicles', 'Exceptional birdwatching'] },
    ],
  },

  packages: [
    { img: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=900&q=80', tag: 'Tanzania · Mid-range', name: '6-Day Northern Circuit Safari', desc: 'The classic Tanzania loop — Tarangire, Ngorongoro Crater and the central Serengeti.', parks: ['Tarangire', 'Ngorongoro', 'Serengeti'], from: '$2,100', days: '6D · 5N' },
    { img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80', tag: 'Tanzania · Luxury', name: 'Great Migration Safari', desc: 'Witness river crossings in the northern Serengeti — the greatest show on Earth.', parks: ['Serengeti (North)', 'Ngorongoro'], from: '$4,600', days: '8D · 7N' },
    { img: 'https://images.unsplash.com/photo-1624378439575-d8705ad01813?w=900&q=80', tag: 'Tanzania · Beach & Safari', name: 'Safari & Zanzibar Combo', desc: "Classic northern Tanzania safari followed by 3 days on Zanzibar's white sands.", parks: ['Serengeti', 'Ngorongoro', 'Zanzibar'], from: '$3,400', days: '10D · 9N' },
  ],
  packagesHref: '/safaris?country=Tanzania',
  packagesLinkText: 'Browse all Tanzania safari packages →',
  packagesHeader: {
    eyebrow: 'Safaris touching these parks',
    heading: (<>Tanzania safari<br /><em className="italic text-bone-clay">packages</em>.</>),
    description: 'Hand-picked Tanzania itineraries — from a classic 6-day northern circuit to the full migration journey. Every route is customisable for your dates and budget.',
  },

  faqs: [
    { q: 'Which is better — Kenya or Tanzania for a first safari?', a: "Both are world-class. Tanzania has the Serengeti and Ngorongoro — arguably the most famous names in safari. Kenya's Masai Mara is easier to combine with other destinations and offers more price flexibility. Many first-timers choose to combine both countries." },
    { q: 'Can I see the Great Migration in Tanzania?', a: 'Yes — the Migration is in Tanzania for around 10 months of the year. The calving season (Jan–March) takes place in the southern Serengeti; the herds are in the northern Serengeti for the spectacular Mara River crossings from July to October.' },
    { q: 'How many days do I need in the Serengeti?', a: 'Three nights is the minimum for a good game-viewing experience; four to five nights allows you to explore different zones and increases your chances of witnessing key wildlife events.' },
    { q: 'Is Ngorongoro worth visiting?', a: 'Absolutely. The Ngorongoro Crater is one of the most reliable Big Five destinations in Africa — and many visitors consider a single day on the crater floor to be the highlight of their entire trip.' },
    { q: 'What is the best time to visit Tanzania?', a: 'The long dry season (June–October) is generally best for wildlife viewing. January–March is excellent for the calving season and fewer crowds. Avoid the long rains (April–May) for driving safaris.' },
    { q: 'Can I combine Tanzania with Kenya?', a: 'Yes — a classic East Africa circuit combines Amboseli or the Masai Mara (Kenya) with the Serengeti and Ngorongoro (Tanzania). Most visitors fly between the two countries on short domestic flights.' },
  ],
  faqHeader: {
    eyebrow: 'FAQs · Tanzania',
    heading: (<>Your Tanzania <em className="italic text-bone-clay">questions</em>.</>),
  },

  cta: {
    heading: (<>Let&apos;s plan your<br />Tanzania <em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>safari</em>.</>),
    description: 'Tell us your budget, dates, interests and group size — our Tanzania specialists will design the perfect circuit and send a free proposal within 24 hours.',
  },
}

export default function TanzaniaDestinationPage() {
  return <DestinationPageTemplate data={data} />
}
