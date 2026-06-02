import type { Metadata } from 'next'
import { BreadcrumbSchema, FaqSchema, CollectionPageSchema } from '@/components/seo/StructuredData'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import CountrySafariPage from '@/components/safaris/CountrySafariPage'
import type { Safari } from '@/types'

export const metadata: Metadata = {
  title: 'Kenya Safari Packages 2026/2027 — Best Kenya Safari Tours',
  description:
    'Book the best Kenya safari packages for 2026 and 2027. Masai Mara, Amboseli, Samburu, Tsavo and more — tailor-made by an in-country team. Budget, mid-range and luxury.',
  keywords: 'kenya safari packages, masai mara safari, kenya safari tours 2026, best kenya safari, affordable kenya safari',
  alternates: { canonical: '/safaris/kenya' },
  openGraph: {
    title: 'Kenya Safari Packages | Divine Travel Nest Safaris',
    description: 'Best Kenya safari tours 2026/2027 — Masai Mara, Amboseli, Tsavo & more.',
    type: 'website',
    images: [{ url: 'https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', width: 1200, height: 630, alt: 'Kenya Safari' }],
  },
}

const faqs = [
  { q: 'What is the best time to visit Kenya for safari?', a: 'June to October — the dry season — offers the best game viewing overall. For the Great Wildebeest Migration in the Masai Mara, aim for July to October.' },
  { q: 'How much do Kenya safari packages cost?', a: "As a rough guide per person per day: budget from $150–$250, mid-range $250–$450, and luxury $600–$1,200. We'll send a tailored quote based on your dates and preferences." },
  { q: 'Is Kenya safe for safari tours?', a: "Yes. Kenya's national parks are professionally managed, and we add extra peace of mind through experienced guides and secure transportation throughout." },
  { q: 'Can I customise my Kenya safari package?', a: 'Absolutely — every package can be tailored to your budget, dates, safari style and accommodation level. Nothing here is fixed.' },
  { q: 'What animals will I see on safari in Kenya?', a: 'Expect lions, elephants, buffalo, leopards, rhinos, cheetahs, giraffes, zebras, wildebeest, hippos, crocodiles, hyenas and a great deal more.' },
  { q: 'Are your safari vehicles comfortable?', a: 'Yes — our Land Cruisers have a pop-up roof, charging ports, a cooler box, binoculars and a guaranteed window seat for every guest.' },
  { q: 'Can you combine a Kenya safari with Tanzania?', a: "Yes — our Kenya–Tanzania combined safaris are among our most popular trips, pairing the Mara with the Serengeti, Ngorongoro and Tarangire." },
]

export default async function KenyaSafarisPage() {
  let safaris: Safari[] = []
  try {
    await connectDB()
    const rawSafaris = await SafariModel.find({ 'location.country': /kenya/i, active: true })
      .sort({ duration: 1 })
      .select('name slug tagline location duration pricing images coverImage category difficulty featured active rating reviewCount')
      .lean()
    safaris = JSON.parse(JSON.stringify(rawSafaris))
  } catch {
    // safaris remains []
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Safaris', href: '/safaris' },
          { name: 'Kenya Safaris', href: '/safaris/kenya' },
        ]}
      />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <CollectionPageSchema
        name="Kenya Safari Packages 2026/2027"
        description="Browse our Kenya safari packages — Masai Mara, Amboseli, Tsavo, Samburu and more. Budget to luxury, tailor-made to your dates."
        url="https://divinetravelnestsafaris.com/safaris/kenya"
        items={safaris.map((s) => ({
          name: s.name,
          url: `https://divinetravelnestsafaris.com/safaris/${s.slug}`,
          description: s.tagline,
        }))}
      />

      <CountrySafariPage
        safaris={safaris}
        packagesId="kp-short"
        idPrefix="kp"
        countryName="Kenya"
        hero={{
          image: 'https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80',
          imageAlt: 'Sunrise over the Kenyan savannah — Masai Mara',
          breadcrumbs: [
            { label: 'Home', href: '/' },
            { label: 'Tours & Safaris', href: '/safaris' },
            { label: 'Kenya' },
          ],
          title: <>Kenya safari<br /><em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>packages</em>.</>,
          description: 'From short Masai Mara introductions to the eight-day Sopa circuit and cross-border combos — every itinerary tailored to your dates, party size and budget.',
          stats: [
            { num: '12',         sup: '+', lbl: 'Parks & reserves'   },
            { num: 'Big 5',      sup: '',  lbl: 'In a single country' },
            { num: 'Year-round', sup: '',  lbl: 'Safari season'       },
          ],
        }}
        packages={{
          eyebrow: 'Top Kenya safari packages · 2026/2027',
          heading: <>Best-selling Kenya <em className="italic text-bone-clay">itineraries</em>.</>,
          description: "Designed for optimal wildlife sightings, comfort and value. Browse by trip length — then tell us your dates and we'll right-size any of these around your party and budget.",
          ctaText: 'Get your free Kenya safari quote →',
        }}
        jumpLinks={[
          { label: 'Packages',     href: '#kp-short' },
          { label: 'Destinations', href: '#kp-destinations' },
          { label: 'Why us',       href: '#kp-why' },
          { label: 'Best time',    href: '#kp-besttime' },
          { label: 'Tailor-made',  href: '#kp-tailor' },
          { label: 'FAQs',         href: '#kp-faq' },
        ]}
        choose={{
          eyebrow: 'Best Kenya safari destinations we cover',
          heading: <>Start from what you<br />want to <em className="italic text-bone-clay">see</em>.</>,
          description: "Tell us the animal or atmosphere you're chasing and we'll build the route around it — combining three to five parks into one seamless itinerary.",
          cells: [
            { want: 'For big cats',           go: 'Masai Mara' },
            { want: 'For elephants',          go: 'Amboseli' },
            { want: 'For rare species',       go: 'Samburu' },
            { want: 'For wilderness',         go: 'Tsavo E & W' },
            { want: 'For rhinos & flamingos', go: 'Lake Nakuru' },
            { want: 'For conservation',       go: 'Ol Pejeta' },
            { want: 'For short trips',        go: 'Nairobi NP' },
            { want: 'For two countries',      go: 'Kenya–Tanzania' },
          ],
          ctaText: 'Explore all Kenya wildlife parks →',
          ctaHref: '/destinations/kenya',
        }}
        why={{
          items: [
            { n: '01', title: 'Professional guides',     body: 'Certified, knowledgeable and experienced in wildlife tracking — the single biggest factor in a great safari.' },
            { n: '02', title: 'Tailor-made packages',    body: 'Every itinerary is built to match your budget, dates, pace and the wildlife you most want to see.' },
            { n: '03', title: 'Comfortable 4×4s',        body: 'Pop-up roofs, guaranteed window seats, charging ports, cooler boxes and binoculars in every vehicle.' },
            { n: '04', title: 'Transparent pricing',     body: 'No hidden fees and no surprise charges — honest, affordable quotes you can plan around.' },
            { n: '05', title: '24/7 support',            body: 'From first enquiry to airport drop-off and beyond, a real person is always reachable.' },
            { n: '06', title: 'Trusted local expertise', body: 'Authentic experiences rooted in regional insight and years of on-the-ground knowledge.' },
          ],
        }}
        bestTime={{
          intro: "Kenya is rewarding all year — the best months simply depend on what you want to see. We'll tune your dates around the wildlife you're chasing.",
          seasons: [
            {
              badge: 'Dry season · June – October',
              title: <>Peak <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>game viewing</em>.</>,
              points: [
                'Best wildlife viewing overall',
                'The Great Migration in the Mara, July–October',
                'Clear skies and easy, open game drives',
                'Thinner vegetation concentrates animals at water',
              ],
            },
            {
              badge: 'Green season · November – May',
              title: <>Lush, quiet & <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>better value</em>.</>,
              points: [
                'Lower prices and fewer vehicles',
                'Lush, photogenic green landscapes',
                'Excellent birdwatching as migrants arrive',
                'Calving season in February — predator action',
              ],
            },
          ],
        }}
        tailor={{
          eyebrow: 'Tailor-made Kenya safaris',
          description: "Your safari should be too. Tell us your travel dates and we'll build your perfect trip — at whatever level of comfort and pace suits you.",
          points: [
            { ic: 'i',   b: 'Budget & mid-range lodge safaris', s: 'great value without compromise' },
            { ic: 'ii',  b: 'Luxury safari holidays',           s: 'exclusive lodges & private guides' },
            { ic: 'iii', b: 'Family & honeymoon safaris',       s: 'tailored pace, the right camps' },
            { ic: 'iv',  b: 'Photography safaris',              s: 'private vehicle, a guide who shoots' },
            { ic: 'v',   b: 'Kenya–Tanzania combinations',      s: 'two countries, one seamless trip' },
          ],
          image: 'https://images.pexels.com/photos/13932855/pexels-photo-13932855.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
          imageAlt: 'Kenya safari vehicle on the plains',
        }}
        faq={{
          eyebrow: 'FAQs · Kenya safari packages',
          items: faqs,
          contactNote: (
            <>Call us for more information at{' '}
              <a href="tel:+254722595916" className="text-bone-clay">+254 722-595-916</a>
              {' '}— we pick up.</>
          ),
        }}
        cta={{
          heading: <>Let&apos;s build your Kenya <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>safari</em>.</>,
          description: "Tell us your budget, dates, wildlife interests and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour.",
          buttonText: 'Get your free quote',
        }}
        lodges={{
          eyebrow: 'Where you will stay',
          heading: <>Handpicked lodges, <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>three</em> tiers.</>,
          description: 'Whether you prefer a budget tented camp, a mid-range lodge, or a luxury safari camp inside the reserve — we work with vetted partners across the full range.',
          tiers: [
            {
              label: 'Budget options',
              fromPrice: 'From $380 / person',
              lodges: [
                { name: 'Miti Mingi Eco Camp', stars: 3 },
                { name: 'Rhino Tourist Camp', stars: 3 },
                { name: 'Lenchada Tourist Camp', stars: 3 },
              ],
            },
            {
              label: 'Mid-range options',
              fromPrice: 'From $650 / person',
              lodges: [
                { name: 'Enkorok Mara Camp', stars: 4 },
                { name: 'Mara Chui Lodge', stars: 4 },
                { name: 'AA Lodge Mara', stars: 4 },
                { name: 'Jambo Mara Lodge', stars: 4 },
              ],
            },
            {
              label: 'Luxury options',
              fromPrice: 'From $1,200 / person',
              lodges: [
                { name: 'Sarova Mara Game Camp', stars: 5 },
                { name: 'Mara Serena Safari Lodge', stars: 5 },
                { name: 'Mara Engai Lodge', stars: 5 },
                { name: 'Neptune Mara Rianta Camp', stars: 5 },
              ],
            },
          ],
        }}
      />
    </>
  )
}
