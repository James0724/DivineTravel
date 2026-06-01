import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

const points = [
  { ic: '✦', title: 'Budget to Luxury', desc: 'Camping, mid-range lodges or ultra-luxury tented camps — we cover every tier.' },
  { ic: '✦', title: 'Solo, Couple & Group', desc: 'Individual travellers, honeymoon couples, families and group expeditions.' },
  { ic: '✦', title: 'Any Duration', desc: 'From a 3-day weekend escape to a 21-day grand East Africa expedition.' },
  { ic: '✦', title: 'Flexible Routing', desc: 'Fly-in safaris, self-drive, guided overland — or any combination.' },
  { ic: '✦', title: 'Special Interest', desc: 'Birding, photography, cultural immersion, gorilla trekking or migration-focused tours.' },
  { ic: '✦', title: 'Free Proposal in 24h', desc: 'Tell us your dream. We respond with a full itinerary within 24 hours, at no cost.' },
]

export default function TailorMade() {
  return (
    <section className="py-[140px] bg-bone-bg">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          {/* Left */}
          <Reveal variant="slideLeft">
            <div className="eyebrow mb-4">
              <span className="dot" />
              Custom Safari Design
            </div>
            <h2
              className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4 mb-4"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            >
              Your safari,{' '}
              <em className="italic text-bone-clay">your way</em>.
            </h2>
            <p className="text-[16px] leading-[1.65] text-bone-muted max-w-[48ch] mb-8">
              No two safaris are alike at Divine Travel Nest. We start with your wishes,
              build around your budget, and refine until every detail is exactly right.
            </p>

            {/* Checklist */}
            <ul
              className="border-t"
              style={{ borderColor: 'rgba(23,22,18,0.14)' }}
            >
              {points.map((p) => (
                <li
                  key={p.title}
                  className="py-4 border-b grid items-center gap-3.5"
                  style={{
                    gridTemplateColumns: '32px 1fr',
                    borderColor: 'rgba(23,22,18,0.14)',
                  }}
                >
                  <span className="font-serif italic text-[18px] text-bone-clay">{p.ic}</span>
                  <div>
                    <strong className="font-medium text-[15px] text-bone-ink">{p.title}</strong>
                    <span className="text-[13px] text-bone-muted ml-2">{p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 px-6 py-4 bg-bone-forest text-bone-paper rounded-full text-[14px] tracking-[0.01em] transition-all duration-200 hover:bg-bone-clay hover:-translate-y-0.5"
            >
              Start planning my safari →
            </Link>
          </Reveal>

          {/* Photo */}
          <Reveal variant="slideRight" delay={0.12}>
            <div className="relative overflow-hidden" style={{ aspectRatio: '5/6' }}>
              <Image
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80"
                alt="Tailor-made safari planning"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
