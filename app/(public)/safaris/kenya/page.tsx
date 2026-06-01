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
  title: 'Kenya Safari Packages 2026/2027 — Best Kenya Safari Tours',
  description:
    'Book the best Kenya safari packages for 2026 and 2027. Masai Mara, Amboseli, Samburu, Tsavo and more — tailor-made by an in-country team. Budget, mid-range and luxury.',
  keywords: 'kenya safari packages, masai mara safari, kenya safari tours 2026, best kenya safari, affordable kenya safari',
  alternates: { canonical: '/safaris/kenya' },
  openGraph: {
    title: 'Kenya Safari Packages | Divine Travel Nest Safaris',
    description: 'Best Kenya safari tours 2026/2027 — Masai Mara, Amboseli, Tsavo & more.',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', width: 1200, height: 630, alt: 'Kenya Safari' }],
  },
}

const chooseCells = [
  { want: 'For big cats',        go: 'Masai Mara' },
  { want: 'For elephants',       go: 'Amboseli' },
  { want: 'For rare species',    go: 'Samburu' },
  { want: 'For wilderness',      go: 'Tsavo E & W' },
  { want: 'For rhinos & flamingos', go: 'Lake Nakuru' },
  { want: 'For conservation',    go: 'Ol Pejeta' },
  { want: 'For short trips',     go: 'Nairobi NP' },
  { want: 'For two countries',   go: 'Kenya–Tanzania' },
]

const whyUs = [
  { n: '01', title: 'Professional guides',    body: 'Certified, knowledgeable and experienced in wildlife tracking — the single biggest factor in a great safari.' },
  { n: '02', title: 'Tailor-made packages',   body: 'Every itinerary is built to match your budget, dates, pace and the wildlife you most want to see.' },
  { n: '03', title: 'Comfortable 4×4s',       body: 'Pop-up roofs, guaranteed window seats, charging ports, cooler boxes and binoculars in every vehicle.' },
  { n: '04', title: 'Transparent pricing',    body: 'No hidden fees and no surprise charges — honest, affordable quotes you can plan around.' },
  { n: '05', title: '24/7 support',           body: 'From first enquiry to airport drop-off and beyond, a real person is always reachable.' },
  { n: '06', title: 'Trusted local expertise', body: 'Authentic experiences rooted in regional insight and years of on-the-ground knowledge.' },
]

const tailorPoints = [
  { ic: 'i',   b: 'Budget & mid-range lodge safaris', s: 'great value without compromise' },
  { ic: 'ii',  b: 'Luxury safari holidays',           s: 'exclusive lodges & private guides' },
  { ic: 'iii', b: 'Family & honeymoon safaris',       s: 'tailored pace, the right camps' },
  { ic: 'iv',  b: 'Photography safaris',              s: 'private vehicle, a guide who shoots' },
  { ic: 'v',   b: 'Kenya–Tanzania combinations',      s: 'two countries, one seamless trip' },
]

const faqs = [
  { q: 'What is the best time to visit Kenya for safari?', a: 'June to October — the dry season — offers the best game viewing overall. For the Great Wildebeest Migration in the Masai Mara, aim for July to October.' },
  { q: 'How much do Kenya safari packages cost?', a: 'As a rough guide per person per day: budget from $150–$250, mid-range $250–$450, and luxury $600–$1,200. We\'ll send a tailored quote based on your dates and preferences.' },
  { q: 'Is Kenya safe for safari tours?', a: 'Yes. Kenya\'s national parks are professionally managed, and we add extra peace of mind through experienced guides and secure transportation throughout.' },
  { q: 'Can I customise my Kenya safari package?', a: 'Absolutely — every package can be tailored to your budget, dates, safari style and accommodation level. Nothing here is fixed.' },
  { q: 'What animals will I see on safari in Kenya?', a: 'Expect lions, elephants, buffalo, leopards, rhinos, cheetahs, giraffes, zebras, wildebeest, hippos, crocodiles, hyenas and a great deal more.' },
  { q: 'Are your safari vehicles comfortable?', a: 'Yes — our Land Cruisers have a pop-up roof, charging ports, a cooler box, binoculars and a guaranteed window seat for every guest.' },
  { q: 'Can you combine a Kenya safari with Tanzania?', a: 'Yes — our Kenya–Tanzania combined safaris are among our most popular trips, pairing the Mara with the Serengeti, Ngorongoro and Tarangire.' },
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

      <PageHero
        image="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1800&q=80"
        imageAlt="Sunrise over the Kenyan savannah — Masai Mara"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tours & Safaris', href: '/safaris' },
          { label: 'Kenya' },
        ]}
        title={<>Kenya safari<br /><em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>packages</em>.</>}
        description="From short Masai Mara introductions to the eight-day Sopa circuit and cross-border combos — every itinerary tailored to your dates, party size and budget."
        stats={[
          { num: '12+',        lbl: 'Parks & reserves' },
          { num: 'Big 5',      lbl: 'In a single country' },
          { num: 'Year-round', lbl: 'Safari season' },
        ]}
      />

      {/* Packages grid — sidebar layout */}
      <section
        id="kp-short"
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
                  { label: 'Packages',     href: '#kp-short' },
                  { label: 'Destinations', href: '#kp-destinations' },
                  { label: 'Why us',       href: '#kp-why' },
                  { label: 'Best time',    href: '#kp-besttime' },
                  { label: 'Tailor-made',  href: '#kp-tailor' },
                  { label: 'FAQs',         href: '#kp-faq' },
                ]}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="section-hd">
                <div>
                  <div className="eyebrow mb-4">
                    <span className="dot" />
                    Top Kenya safari packages · 2026/2027
                  </div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                    style={{ fontSize: 'clamp(36px, 4.8vw, 68px)' }}
                  >
                    Best-selling Kenya <em className="italic text-bone-clay">itineraries</em>.
                  </h2>
                </div>
                <p className="text-[15px] leading-[1.65] text-bone-muted" style={{ maxWidth: '56ch' }}>
                  Designed for optimal wildlife sightings, comfort and value. Browse by trip length — then
                  tell us your dates and we&apos;ll right-size any of these around your party and budget.
                </p>
              </div>

              {safaris.length === 0 ? (
                <p className="text-[15px] text-bone-muted py-8">
                  No Kenya safari packages found — check back soon.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                  {safaris.map((safari, i) => (
                    <PkgCard key={String(safari._id)} safari={safari} index={i} />
                  ))}
                </div>
              )}

              <div className="mt-14 text-center">
                <Link href="/contact" className="btn-forest">
                  Get your free Kenya safari quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChooseGrid
        id="kp-destinations"
        eyebrow="Best Kenya safari destinations we cover"
        heading={<>Start from what you<br />want to <em className="italic text-bone-clay">see</em>.</>}
        description="Tell us the animal or atmosphere you're chasing and we'll build the route around it — combining three to five parks into one seamless itinerary."
        cells={chooseCells}
        actions={
          <div className="mt-12">
            <Link href="/destinations/kenya" className="btn-forest">
              Explore all Kenya wildlife parks →
            </Link>
          </div>
        }
      />

      <WhyGrid
        id="kp-why"
        eyebrow="Why choose our packages"
        heading={<>The <em className="italic text-bone-clay">divine</em><br />touch.</>}
        description="Every safari includes our signature attention to detail — and the practical things that actually make a trip run smoothly, before, during and after you travel."
        items={whyUs}
      />

      {/* Best time */}
      <section id="kp-besttime" className="bg-bone-forest text-bone-paper" style={{ padding: '120px 0' }}>
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
              Kenya is rewarding all year — the best months simply depend on what you want to see.
              We&apos;ll tune your dates around the wildlife you&apos;re chasing.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {[
              {
                badge: 'Dry season · June – October',
                title: 'Peak game viewing.',
                em: 'game viewing',
                points: ['Best wildlife viewing overall', 'The Great Migration in the Mara, July–October', 'Clear skies and easy, open game drives', 'Thinner vegetation concentrates animals at water'],
              },
              {
                badge: 'Green season · November – May',
                title: 'Lush, quiet & better value.',
                em: 'better value',
                points: ['Lower prices and fewer vehicles', 'Lush, photogenic green landscapes', 'Excellent birdwatching as migrants arrive', 'Calving season in February — predator action'],
              },
            ].map((s) => (
              <div key={s.badge} style={{ padding: '40px', border: '1px solid rgba(244,239,226,0.22)' }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] mb-4" style={{ color: '#f4d4a8' }}>
                  {s.badge}
                </div>
                <h3 className="font-serif font-normal leading-none mb-5" style={{ fontSize: '40px' }}>
                  {s.title.replace(s.em, '').trim()}{' '}
                  <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>{s.em}</em>
                  {s.title.endsWith('.') ? '.' : ''}
                </h3>
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
      <section id="kp-tailor" className="bg-bone-bg" style={{ padding: '140px 0' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-20 items-center">
            <div>
              <div className="eyebrow mb-4"><span className="dot" />Tailor-made Kenya safaris</div>
              <h2
                className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4 mb-4"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              >
                Every traveller is <em className="italic text-bone-clay">different</em>.
              </h2>
              <p className="text-[16px] leading-[1.65] text-bone-muted mb-8" style={{ maxWidth: '48ch' }}>
                Your safari should be too. Tell us your travel dates and we&apos;ll build your perfect trip —
                at whatever level of comfort and pace suits you.
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
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80"
                alt="Kenya safari vehicle on the plains"
                width={900}
                height={1080}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionFaq
        id="kp-faq"
        eyebrow="FAQs · Kenya safari packages"
        heading={<>Before you <em className="italic text-bone-clay">book</em>.</>}
        contactNote={
          <>Call us for more information at{' '}
            <a href="tel:+254722595916" className="text-bone-clay">+254 722-595-916</a>
            {' '}— we pick up.</>
        }
        faqs={faqs.map((f) => ({ q: f.q, a: f.a }))}
      />

      <CtaBand
        variant="large"
        heading={<>Let&apos;s build your Kenya <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>safari</em>.</>}
        description="Tell us your budget, dates, wildlife interests and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour."
        buttonText="Get your free quote"
      />
    </>
  )
}
