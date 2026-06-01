import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema, FaqSchema } from '@/components/seo/StructuredData'
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
  title: 'Cross-Country Safari Packages 2026/2027 — Kenya, Tanzania & Uganda Circuits',
  description:
    'Multi-country safari packages combining Kenya, Tanzania and Uganda into one seamless East African circuit. Great Migration, gorilla trekking, Serengeti and Masai Mara — all in one trip.',
  keywords: 'cross-country safari, kenya tanzania safari, east africa safari, multi-country safari, kenya tanzania uganda safari',
  alternates: { canonical: '/safaris/cross-country' },
  openGraph: {
    title: 'Cross-Country Safari Packages | Divine Travel Nest Safaris',
    description: 'Multi-country East Africa safari circuits — Kenya, Tanzania & Uganda combined.',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80', width: 1200, height: 630, alt: 'East Africa Cross-Country Safari' }],
  },
}

const whyCircuit = [
  { n: '01', title: 'Two ecosystems, one trip',   body: 'Combine the open Kenyan savannah with Tanzania\'s Serengeti — the full wildebeest migration story from calving to river crossings.' },
  { n: '02', title: 'No flights wasted',           body: 'We design routes that minimise doubling back — fly into Nairobi, out of Entebbe, or reverse, depending on where your circuit ends.' },
  { n: '03', title: 'Seamless border logistics',   body: 'We handle border crossings, paperwork, permits (including gorilla), park fees and transfers so you just experience the wildlife.' },
  { n: '04', title: 'One operator, one plan',      body: 'Booking a multi-country circuit through one operator means no gaps, no miscommunication and one point of contact for everything.' },
  { n: '05', title: 'Best of three countries',     body: 'Big Five in Kenya, the Migration in Tanzania, and the world\'s most powerful primate encounter in Uganda — all in a single itinerary.' },
  { n: '06', title: 'Budget, mid-range & luxury',  body: 'Every circuit is available across all three accommodation tiers — we match the camps and lodges to your budget and comfort level.' },
]

const tailorPoints = [
  { ic: 'i',   b: 'Kenya + Tanzania',          s: 'Mara, Serengeti, Ngorongoro, Amboseli' },
  { ic: 'ii',  b: 'Kenya + Uganda',            s: 'Masai Mara + Bwindi gorilla trekking' },
  { ic: 'iii', b: 'Tanzania + Uganda',         s: 'Serengeti + Bwindi or Queen Elizabeth' },
  { ic: 'iv',  b: 'Full East Africa circuit',  s: 'All three countries, 10–16 days' },
  { ic: 'v',   b: 'Migration + gorillas',      s: 'River crossings + Bwindi — the pinnacle' },
]

const chooseCells = [
  { want: 'For the Migration', go: 'Kenya + Tanzania' },
  { want: 'For gorillas',      go: 'Uganda + Kenya'   },
  { want: 'For Big Five',      go: 'Kenya + Tanzania' },
  { want: 'For primates',      go: 'Uganda + Tanzania' },
  { want: 'For photography',   go: 'Full 3-country'   },
  { want: 'For honeymoon',     go: 'Kenya + Zanzibar' },
  { want: 'For adventure',     go: 'Full 3-country'   },
  { want: 'For value',         go: 'Kenya + Uganda'   },
]

const faqs = [
  { q: 'Which countries do cross-country safaris cover?', a: 'Our multi-country circuits combine Kenya, Tanzania and Uganda in various combinations — two-country circuits starting from around 7 days, and full three-country trips of 12–16 days.' },
  { q: 'How do border crossings work?', a: 'We handle all border crossing logistics — both land crossings and connecting flights between countries. You simply travel; we take care of the paperwork, permits and transfers.' },
  { q: 'How long does a cross-country safari need to be?', a: 'A Kenya–Tanzania combination is meaningful from 7 days. A Kenya–Uganda circuit works from 6 days. A full three-country East Africa trip is best at 12–16 days.' },
  { q: 'Can I combine gorilla trekking with a Kenya safari?', a: 'Yes — this is one of our most popular combinations. Typically 3–4 days in Kenya (Masai Mara, Amboseli) and 3–4 days in Uganda (Bwindi gorilla trek, Queen Elizabeth NP).' },
  { q: 'What is the Great Migration circuit?', a: 'The classic circuit follows the wildebeest: calving season in Tanzania\'s Ndutu (Jan–Mar), then north through the Serengeti to the Masai Mara river crossings (Jul–Oct). We design the exact parks around your travel dates.' },
  { q: 'How much does a cross-country safari cost?', a: 'A two-country circuit typically starts from $2,500 per person in budget lodges, $3,500–5,000 in mid-range, and $7,000+ in luxury. Three-country trips are priced by day and lodge tier.' },
  { q: 'Is it possible to combine a beach holiday with a cross-country safari?', a: 'Absolutely. Zanzibar is a natural ending to a Kenya–Tanzania circuit, adding 3–4 days of Indian Ocean beach time after the wildlife. We arrange the short flight from the mainland.' },
]

export default async function CrossCountrySafarisPage() {
  let safaris: Safari[] = []
  try {
    await connectDB()
    // Safaris with 2+ entries in the countries array are multi-country itineraries
    const rawSafaris = await SafariModel.find({
      active: true,
      'location.countries': { $exists: true },
      $expr: { $gt: [{ $size: { $ifNull: ['$location.countries', []] } }, 1] },
    })
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
          { name: 'Cross-Country Safaris', href: '/safaris/cross-country' },
        ]}
      />
      <FaqSchema items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />

      <PageHero
        image="https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1800&q=80"
        imageAlt="Wildebeest crossing the Serengeti — the East Africa Great Migration"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tours & Safaris', href: '/safaris' },
          { label: 'Cross-Country Safaris' },
        ]}
        title={<>East Africa<br /><em style={{ color: '#f4d4a8', fontStyle: 'italic' }}>circuit</em> safaris.</>}
        description="Kenya, Tanzania and Uganda in one seamless itinerary — the Migration, the Crater, the gorillas and the Big Five. Designed to cross borders without friction."
        stats={[
          { num: '3',    lbl: 'Countries in one trip'   },
          { num: 'Big 5', lbl: 'Plus mountain gorillas'  },
          { num: '7–16', lbl: 'Days · most circuits'    },
        ]}
      />

      {/* Packages grid — sidebar layout */}
      <section
        id="cc-packages"
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
                  { label: 'Packages',    href: '#cc-packages' },
                  { label: 'Circuits',    href: '#cc-circuits'  },
                  { label: 'Why combine', href: '#cc-why'       },
                  { label: 'FAQs',        href: '#cc-faq'       },
                ]}
              />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="section-hd">
                <div>
                  <div className="eyebrow mb-4">
                    <span className="dot" />
                    Cross-country safari packages · 2026/2027
                  </div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-4"
                    style={{ fontSize: 'clamp(36px, 4.8vw, 68px)' }}
                  >
                    Multi-country{' '}
                    <em className="italic text-bone-clay">itineraries</em>.
                  </h2>
                </div>
                <p className="text-[15px] leading-[1.65] text-bone-muted" style={{ maxWidth: '56ch' }}>
                  Each circuit is designed to combine the best of two or three countries without
                  unnecessary transfers — tell us your dates and we tune every detail.
                </p>
              </div>

              {safaris.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-serif text-[32px] text-bone-ink mb-4">Bespoke circuits available</p>
                  <p className="text-[15px] text-bone-muted mb-8 mx-auto" style={{ maxWidth: '52ch' }}>
                    Our cross-country itineraries are tailor-made to your dates and preferences.
                    Tell us where you want to go and we&apos;ll build the perfect multi-country circuit.
                  </p>
                  <Link href="/contact" className="btn-forest">
                    Plan my cross-country circuit →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
                    {safaris.map((safari, i) => (
                      <PkgCard key={String(safari._id)} safari={safari} index={i} />
                    ))}
                  </div>
                  <div className="mt-14 text-center">
                    <Link href="/contact" className="btn-forest">
                      Get your free cross-country quote →
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <ChooseGrid
        id="cc-circuits"
        eyebrow="Popular circuit combinations"
        heading={<>Start from what you<br />want to <em className="italic text-bone-clay">see</em>.</>}
        description="Tell us the wildlife or experience you're chasing and we'll recommend the right country combination for your trip."
        cells={chooseCells}
        actions={
          <div className="mt-8">
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
              <li style={{ borderTop: '1px solid rgba(31,29,24,0.14)' }} />
            </ul>
            <Link href="/contact" className="btn-forest inline-flex items-center gap-3 mt-8">
              Build my circuit →
            </Link>
          </div>
        }
      />

      <WhyGrid
        id="cc-why"
        eyebrow="Why combine countries"
        heading={<>The <em className="italic text-bone-clay">full</em><br />picture.</>}
        description="Each East African country has something no other can offer. A circuit gives you all of it in one seamless trip."
        items={whyCircuit}
      />

      <SectionFaq
        id="cc-faq"
        eyebrow="FAQs · Cross-country safaris"
        heading={<>Before you <em className="italic text-bone-clay">plan</em>.</>}
        contactNote={
          <>Call us at <a href="tel:+254722595916" className="text-bone-clay">+254 722-595-916</a> — we pick up.</>
        }
        faqs={faqs.map((f) => ({ q: f.q, a: f.a }))}
      />

      <CtaBand
        variant="large"
        heading={<>Let&apos;s build your East Africa <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>circuit</em>.</>}
        description="Tell us your budget, dates, how many countries and what wildlife you most want to see. Our experts design the route, secure all permits and send a free proposal — usually within half an hour."
        buttonText="Get your free circuit quote"
      />
    </>
  )
}
