import type { Metadata } from 'next'
import { BreadcrumbSchema, FaqSchema, CollectionPageSchema } from '@/components/seo/StructuredData'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import CountrySafariPage from '@/components/safaris/CountrySafariPage'
import type { Safari } from '@/types'

export const metadata: Metadata = {
  title: 'Tanzania Safari Packages 2026/2027 — Serengeti, Ngorongoro & More',
  description: 'Book the best Tanzania safari packages for 2026 and 2027. Serengeti, Ngorongoro Crater, Tarangire, Ruaha and more — tailor-made by an in-country team.',
  keywords: 'tanzania safari packages, serengeti safari, ngorongoro crater tour, tanzania safari tours 2026, best tanzania safari',
  alternates: { canonical: '/safaris/tanzania' },
  openGraph: {
    title: 'Tanzania Safari Packages | Divine Travel Nest Safaris',
    description: 'Best Tanzania safari tours 2026/2027 — Serengeti, Ngorongoro, Tarangire & more.',
    type: 'website',
    images: [{ url: 'https://images.pexels.com/photos/33650573/pexels-photo-33650573.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80', width: 1200, height: 630, alt: 'Tanzania Safari' }],
  },
}

const faqs = [
  { q: 'What is the best time to visit Tanzania for safari?', a: "The dry season from June to October is ideal for wildlife viewing across all parks. For the calving season and Ndutu, visit January to March. The Serengeti offers year-round wildlife." },
  { q: 'How much do Tanzania safari packages cost?', a: "Budget from $200–$350 per person per day, mid-range $350–$600, and luxury $800–$1,500. Tanzania's park fees are higher than Kenya's. We'll send a tailored quote." },
  { q: 'Is Tanzania safe for tourists?', a: "Yes. Tanzania is one of Africa's most stable and welcoming countries, with a long tradition of professional safari tourism." },
  { q: 'Can I see the Great Migration in Tanzania?', a: "Yes — the wildebeest spend most of the year in Tanzania's Serengeti. The calving season is January–February in the Ndutu area; the river crossings shift to Kenya's Mara from July." },
  { q: 'What is the difference between Serengeti and Ngorongoro?', a: 'The Serengeti is a vast open ecosystem ideal for the migration and big cats. Ngorongoro Crater is a self-contained caldera with the highest density of wildlife in Africa — including rhino.' },
  { q: 'Can I combine Tanzania with a Zanzibar beach holiday?', a: "Absolutely — a Zanzibar extension is one of our most popular add-ons, combining East Africa safari with one of the world's most beautiful islands." },
  { q: 'Do you offer fly-in safaris in Tanzania?', a: 'Yes — charter flights into Serengeti, Ruaha and other remote parks are available. We handle all flight bookings as part of the package.' },
]

export default async function TanzaniaSafarisPage() {
  let safaris: Safari[] = []
  try {
    await connectDB()
    const rawSafaris = await SafariModel.find({ 'location.country': /tanzania/i, active: true })
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
          { name: 'Tanzania Safaris', href: '/safaris/tanzania' },
        ]}
      />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <CollectionPageSchema
        name="Tanzania Safari Packages 2026/2027"
        description="Browse our Tanzania safari packages — Serengeti, Ngorongoro Crater, Tarangire and more. Budget to luxury, tailor-made to your dates."
        url="https://divinetravelnestsafaris.com/safaris/tanzania"
        items={safaris.map((s) => ({
          name: s.name,
          url: `https://divinetravelnestsafaris.com/safaris/${s.slug}`,
          description: s.tagline,
        }))}
      />

      <CountrySafariPage
        safaris={safaris}
        packagesId="tz-packages"
        idPrefix="tz"
        countryName="Tanzania"
        hero={{
          image: 'https://images.pexels.com/photos/33650573/pexels-photo-33650573.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80',
          imageAlt: "Wildebeest crossing the Mara River in Tanzania's Serengeti",
          breadcrumbs: [
            { label: 'Home', href: '/' },
            { label: 'Tours & Safaris', href: '/safaris' },
            { label: 'Tanzania Safaris' },
          ],
          title: <>Tanzania safari<br /><em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>packages</em>.</>,
          description: "The Serengeti, Ngorongoro Crater, Tarangire's elephant kingdom, the wild south — and the option to finish on Zanzibar. Every itinerary rewritable for your dates and budget.",
          stats: [
            { num: '15',         sup: '+', lbl: 'Parks & reserves'        },
            { num: '1.5',        sup: 'M', lbl: 'Wildebeest in migration' },
            { num: 'Year-round', sup: '',  lbl: 'Wildlife viewing'         },
          ],
        }}
        packages={{
          eyebrow: 'Tanzania safari packages · 2026/2027',
          heading: <>Best-selling Tanzania <em className="italic text-bone-clay">itineraries</em>.</>,
          description: "From short Ngorongoro crater visits to deep Serengeti migration circuits. Every package is rewritable — we'll tune the parks, lodges and timing to fit your group and goals.",
          ctaText: 'Get your free Tanzania safari quote →',
        }}
        jumpLinks={[
          { label: 'Packages',     href: '#tz-packages' },
          { label: 'Destinations', href: '#tz-destinations' },
          { label: 'Why us',       href: '#tz-why' },
          { label: 'Best time',    href: '#tz-besttime' },
          { label: 'Tailor-made',  href: '#tz-tailor' },
          { label: 'FAQs',         href: '#tz-faq' },
        ]}
        choose={{
          eyebrow: 'Best Tanzania safari destinations we cover',
          heading: <>Start from what<br />you want to <em className="italic text-bone-clay">see</em>.</>,
          description: "Tell us the wildlife or experience you're chasing and we'll combine the right parks into a seamless itinerary.",
          cells: [
            { want: 'For the migration',  go: 'Serengeti' },
            { want: 'For the crater',     go: 'Ngorongoro' },
            { want: 'For elephants',      go: 'Tarangire' },
            { want: 'For wilderness',     go: 'Ruaha' },
            { want: 'For tree-lions',     go: 'Lake Manyara' },
            { want: 'For primates',       go: 'Mahale' },
            { want: 'For beach & safari', go: 'Zanzibar' },
            { want: 'For two countries',  go: 'Kenya–Tanzania' },
          ],
          ctaText: 'Explore all Tanzania wildlife parks →',
          ctaHref: '/destinations/tanzania',
        }}
        why={{
          items: [
            { n: '01', title: 'Professional guides',  body: "Certified Tanzanian guides with deep knowledge of the Serengeti ecosystem and predator behaviour." },
            { n: '02', title: 'Tailor-made packages', body: 'Every itinerary is built to match your budget, dates, pace and the wildlife you most want to see.' },
            { n: '03', title: 'Fly-in options',       body: 'Charter flights into remote airstrips save hours of driving and get you deeper into pristine wildlife zones.' },
            { n: '04', title: 'Transparent pricing',  body: 'No hidden fees and no surprise charges — honest, affordable quotes you can plan around.' },
            { n: '05', title: '24/7 support',         body: 'From first enquiry to airport drop-off and beyond, a real person is always reachable.' },
            { n: '06', title: 'Migration expertise',  body: "We know the herds' patterns and position you at the right place, at the right time." },
          ],
        }}
        bestTime={{
          intro: "Tanzania rewards visitors all year. The best time depends entirely on the wildlife experience you're chasing — and we'll help you find the right window.",
          seasons: [
            {
              badge: 'Dry season · June – October',
              title: <>Peak <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>game viewing</em>.</>,
              points: [
                'Best visibility and wildlife concentration',
                'Serengeti river crossings peak July–August',
                'Ideal for Ngorongoro Crater visits',
                'Ruaha and southern parks at their best',
              ],
            },
            {
              badge: 'Calving season · January – March',
              title: <>Ndutu & <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>the newborns</em>.</>,
              points: [
                'Massive wildebeest calving in Ndutu area',
                'Predator action is at its peak in the Serengeti',
                'Lush, photogenic green landscapes',
                'Lower prices and smaller crowds',
              ],
            },
          ],
        }}
        tailor={{
          eyebrow: 'Tailor-made Tanzania safaris',
          description: "Your safari should be too. Tell us your travel dates and we'll build your perfect Tanzania trip — at whatever level of comfort suits you.",
          points: [
            { ic: 'i',   b: 'Budget & mid-range lodge safaris', s: 'great value without compromise' },
            { ic: 'ii',  b: 'Luxury tented camps',              s: 'inside the park, under canvas' },
            { ic: 'iii', b: 'Migration-timed itineraries',      s: 'matched to the calendar of hooves' },
            { ic: 'iv',  b: 'Photography safaris',              s: 'private vehicle, a guide who shoots' },
            { ic: 'v',   b: 'Kenya–Tanzania combinations',      s: 'two countries, one seamless trip' },
          ],
          image: 'https://images.pexels.com/photos/25950513/pexels-photo-25950513.jpeg?auto=compress&cs=tinysrgb&w=900&q=80',
          imageAlt: 'Serengeti plains Tanzania',
        }}
        faq={{
          eyebrow: 'FAQs · Tanzania safari packages',
          items: faqs,
          contactNote: (
            <>Call us at <a href="tel:+254722595916" className="text-bone-clay">+254 722-595-916</a> — we pick up.</>
          ),
        }}
        cta={{
          heading: <>Let&apos;s build your Tanzania <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>safari</em>.</>,
          description: "Tell us your budget, dates, wildlife interests and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour.",
          buttonText: 'Get your free quote',
        }}
      />
    </>
  )
}
