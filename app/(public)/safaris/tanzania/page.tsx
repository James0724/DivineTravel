import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BreadcrumbSchema, FaqSchema, CollectionPageSchema } from '@/components/seo/StructuredData'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import PkgCard from '@/components/safaris/PkgCard'
import PageHero from '@/components/ui/PageHero'
import JumpNav from '@/components/ui/JumpNav'
import WhyGrid from '@/components/ui/WhyGrid'
import ChooseGrid from '@/components/ui/ChooseGrid'
import SectionFaq from '@/components/ui/SectionFaq'
import CtaBand from '@/components/ui/CtaBand'
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
    images: [{ url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&q=80', width: 1200, height: 630, alt: 'Tanzania Safari' }],
  },
}

const chooseCells = [
  { want: 'For the migration', go: 'Serengeti' },
  { want: 'For the crater',    go: 'Ngorongoro' },
  { want: 'For elephants',     go: 'Tarangire' },
  { want: 'For wilderness',    go: 'Ruaha' },
  { want: 'For tree-lions',    go: 'Lake Manyara' },
  { want: 'For primates',      go: 'Mahale' },
  { want: 'For beach & safari', go: 'Zanzibar' },
  { want: 'For two countries', go: 'Kenya–Tanzania' },
]

const whyUs = [
  { n: '01', title: 'Professional guides',  body: 'Certified Tanzanian guides with deep knowledge of the Serengeti ecosystem and predator behaviour.' },
  { n: '02', title: 'Tailor-made packages', body: 'Every itinerary is built to match your budget, dates, pace and the wildlife you most want to see.' },
  { n: '03', title: 'Fly-in options',       body: 'Charter flights into remote airstrips save hours of driving and get you deeper into pristine wildlife zones.' },
  { n: '04', title: 'Transparent pricing',  body: 'No hidden fees and no surprise charges — honest, affordable quotes you can plan around.' },
  { n: '05', title: '24/7 support',         body: 'From first enquiry to airport drop-off and beyond, a real person is always reachable.' },
  { n: '06', title: 'Migration expertise',  body: 'We know the herds\' patterns and position you at the right place, at the right time.' },
]

const tailorPoints = [
  { ic: 'i',   b: 'Budget & mid-range lodge safaris', s: 'great value without compromise' },
  { ic: 'ii',  b: 'Luxury tented camps',              s: 'inside the park, under canvas' },
  { ic: 'iii', b: 'Migration-timed itineraries',      s: 'matched to the calendar of hooves' },
  { ic: 'iv',  b: 'Photography safaris',              s: 'private vehicle, a guide who shoots' },
  { ic: 'v',   b: 'Kenya–Tanzania combinations',      s: 'two countries, one seamless trip' },
]

const faqs = [
  { q: 'What is the best time to visit Tanzania for safari?', a: 'The dry season from June to October is ideal for wildlife viewing across all parks. For the calving season and Ndutu, visit January to March. The Serengeti offers year-round wildlife.' },
  { q: 'How much do Tanzania safari packages cost?', a: 'Budget from $200–$350 per person per day, mid-range $350–$600, and luxury $800–$1,500. Tanzania\'s park fees are higher than Kenya\'s. We\'ll send a tailored quote.' },
  { q: 'Is Tanzania safe for tourists?', a: 'Yes. Tanzania is one of Africa\'s most stable and welcoming countries, with a long tradition of professional safari tourism.' },
  { q: 'Can I see the Great Migration in Tanzania?', a: 'Yes — the wildebeest spend most of the year in Tanzania\'s Serengeti. The calving season is January–February in the Ndutu area; the river crossings shift to Kenya\'s Mara from July.' },
  { q: 'What is the difference between Serengeti and Ngorongoro?', a: 'The Serengeti is a vast open ecosystem ideal for the migration and big cats. Ngorongoro Crater is a self-contained caldera with the highest density of wildlife in Africa — including rhino.' },
  { q: 'Can I combine Tanzania with a Zanzibar beach holiday?', a: 'Absolutely — a Zanzibar extension is one of our most popular add-ons, combining East Africa safari with one of the world\'s most beautiful islands.' },
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

      <PageHero
        image="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1800&q=80"
        imageAlt="Wildebeest crossing the Mara River in Tanzania's Serengeti"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tours & Safaris', href: '/safaris' },
          { label: 'Tanzania Safaris' },
        ]}
        title={<>Tanzania safari<br /><em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>packages</em>.</>}
        description="The Serengeti, Ngorongoro Crater, Tarangire's elephant kingdom, the wild south — and the option to finish on Zanzibar. Every itinerary rewritable for your dates and budget."
        stats={[
          { num: '15+',  lbl: 'Parks & reserves' },
          { num: '1.5M', lbl: 'Wildebeest in the migration' },
          { num: 'Year-round', lbl: 'Wildlife viewing' },
        ]}
      />

      {/* Packages grid — sidebar layout */}
      <section
        id="tz-packages"
        className="bg-bone-paper"
        style={{ padding: '96px 0', borderBottom: '1px solid rgba(31,29,24,0.14)' }}
      >
        <div className="container-site">
          <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-start">

            {/* Jump nav — mobile collapsible + desktop sticky sidebar */}
            <div
              className="mb-10 lg:mb-0 lg:flex-shrink-0 lg:w-[156px] lg:sticky"
              style={{ top: '90px' }}
            >
              <JumpNav
                vertical
                label="On this page"
                links={[
                  { label: 'Packages',     href: '#tz-packages' },
                  { label: 'Destinations', href: '#tz-destinations' },
                  { label: 'Why us',       href: '#tz-why' },
                  { label: 'Best time',    href: '#tz-besttime' },
                  { label: 'Tailor-made',  href: '#tz-tailor' },
                  { label: 'FAQs',         href: '#tz-faq' },
                ]}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="section-hd">
                <div>
                  <div className="eyebrow mb-4"><span className="dot" />Tanzania safari packages · 2026/2027</div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                    style={{ fontSize: 'clamp(36px, 4.8vw, 68px)' }}
                  >
                    Best-selling Tanzania <em className="italic text-bone-clay">itineraries</em>.
                  </h2>
                </div>
                <p className="text-[15px] leading-[1.65] text-bone-muted" style={{ maxWidth: '56ch' }}>
                  From short Ngorongoro crater visits to deep Serengeti migration circuits. Every package
                  is rewritable — we&apos;ll tune the parks, lodges and timing to fit your group and goals.
                </p>
              </div>

              {safaris.length === 0 ? (
                <p className="text-[15px] text-bone-muted py-8">No Tanzania safari packages found — check back soon.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                  {safaris.map((safari, i) => (
                    <PkgCard key={String(safari._id)} safari={safari} index={i} />
                  ))}
                </div>
              )}

              <div className="mt-14 text-center">
                <Link href="/contact" className="btn-forest">
                  Get your free Tanzania safari quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChooseGrid
        id="tz-destinations"
        eyebrow="Best Tanzania safari destinations we cover"
        heading={<>Start from what<br />you want to <em className="italic text-bone-clay">see</em>.</>}
        description="Tell us the wildlife or experience you're chasing and we'll combine the right parks into a seamless itinerary."
        cells={chooseCells}
        actions={
          <div className="mt-12">
            <Link href="/destinations/tanzania" className="btn-forest">
              Explore all Tanzania wildlife parks →
            </Link>
          </div>
        }
      />

      <WhyGrid
        id="tz-why"
        eyebrow="Why choose our packages"
        heading={<>The <em className="italic text-bone-clay">divine</em><br />touch.</>}
        description="Every safari includes our signature attention to detail — and the practical things that actually make a trip run smoothly."
        items={whyUs}
      />

      {/* Best time */}
      <section id="tz-besttime" className="bg-bone-forest text-bone-paper" style={{ padding: '120px 0' }}>
        <div className="container-site">
          <div className="section-hd">
            <div>
              <div className="eyebrow mb-4" style={{ color: 'rgba(244,239,226,0.6)' }}>
                <span className="dot" />Best time to visit
              </div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] mt-4"
                style={{ fontSize: 'clamp(40px, 5.4vw, 76px)', color: 'var(--paper, #faf6ec)' }}
              >
                When to <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>go</em>.
              </h2>
            </div>
            <p className="text-[15px] leading-[1.65]" style={{ color: 'rgba(244,239,226,0.62)', maxWidth: '56ch' }}>
              Tanzania rewards visitors all year. The best time depends entirely on the wildlife
              experience you&apos;re chasing — and we&apos;ll help you find the right window.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {[
              {
                badge: 'Dry season · June – October',
                title: 'Peak game viewing.',
                points: ['Best visibility and wildlife concentration', 'Serengeti river crossings peak July–August', 'Ideal for Ngorongoro Crater visits', 'Ruaha and southern parks at their best'],
              },
              {
                badge: 'Calving season · January – March',
                title: 'Ndutu & the newborns.',
                points: ['Massive wildebeest calving in Ndutu area', 'Predator action is at its peak in the Serengeti', 'Lush, photogenic green landscapes', 'Lower prices and smaller crowds'],
              },
            ].map((s) => (
              <div key={s.badge} style={{ padding: '40px', border: '1px solid rgba(244,239,226,0.22)' }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-4" style={{ color: '#f4d4a8' }}>
                  {s.badge}
                </div>
                <h3 className="font-serif font-normal leading-none mb-5" style={{ fontSize: '40px' }}>{s.title}</h3>
                <ul>
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="py-3 pl-6 relative"
                      style={{ borderTop: '1px solid rgba(244,239,226,0.14)', color: 'rgba(244,239,226,0.82)', fontSize: '15px', lineHeight: '1.5' }}
                    >
                      <span className="absolute left-0.5 top-3.5" style={{ color: '#f4d4a8' }}>›</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailor-made */}
      <section id="tz-tailor" className="bg-bone-bg" style={{ padding: '140px 0' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center">
            <div>
              <div className="eyebrow mb-4"><span className="dot" />Tailor-made Tanzania safaris</div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-4"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              >
                Every traveller is <em className="italic text-bone-clay">different</em>.
              </h2>
              <p className="text-[16px] leading-[1.65] text-bone-muted mb-8" style={{ maxWidth: '48ch' }}>
                Your safari should be too. Tell us your travel dates and we&apos;ll build your
                perfect Tanzania trip — at whatever level of comfort suits you.
              </p>
              <ul>
                {tailorPoints.map((t) => (
                  <li
                    key={t.ic}
                    className="py-4 grid items-center gap-3.5"
                    style={{ borderTop: '1px solid rgba(31,29,24,0.14)', gridTemplateColumns: '32px 1fr' }}
                  >
                    <div className="font-serif italic text-[18px] text-bone-clay">{t.ic}</div>
                    <div>
                      <strong className="font-medium text-[15px] text-bone-ink">{t.b}</strong>
                      {' '}<span className="text-[13px] text-bone-muted">· {t.s}</span>
                    </div>
                  </li>
                ))}
                <li style={{ borderTop: '1px solid rgba(31,29,24,0.14)', borderBottom: '1px solid rgba(31,29,24,0.14)' }} />
              </ul>
              <Link href="/contact" className="btn-forest inline-flex items-center gap-3 mt-8">
                Chat with a safari expert — planning is free →
              </Link>
            </div>
            <div className="overflow-hidden" style={{ aspectRatio: '5/6' }}>
              <Image
                src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=900&q=80"
                alt="Serengeti plains Tanzania"
                width={900}
                height={1080}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionFaq
        id="tz-faq"
        eyebrow="FAQs · Tanzania safari packages"
        heading={<>Before you <em className="italic text-bone-clay">book</em>.</>}
        contactNote={
          <>Call us at <a href="tel:+254722595916" className="text-bone-clay">+254 722-595-916</a> — we pick up.</>
        }
        faqs={faqs.map((f) => ({ q: f.q, a: f.a }))}
      />

      <CtaBand
        variant="large"
        heading={<>Let&apos;s build your Tanzania <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>safari</em>.</>}
        description="Tell us your budget, dates, wildlife interests and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour."
        buttonText="Get your free quote"
      />
    </>
  )
}
