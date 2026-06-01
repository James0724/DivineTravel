import Link from 'next/link'
import Reveal from '@/components/ui/Reveal'

export default function IntroSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-[120px] bg-bone-bg">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-24 items-start">
          {/* Left */}
          <Reveal variant="slideLeft">
            <div className="eyebrow mb-[18px]">
              <span className="dot" />
              Divine Travel Nest Safaris
            </div>
            <h2
              className="font-serif font-normal leading-[1.02] tracking-[-0.02em] text-bone-ink"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
            >
              Your trusted gateway to{' '}
              <em className="italic text-bone-clay">unforgettable</em>
              <br /> East Africa safaris.
            </h2>

            {/* Contact strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <Link
                href="tel:+254722595916"
                className="flex flex-col gap-1.5 p-4 border bg-bone-paper hover:border-bone-clay hover:bg-white transition-all duration-200"
                style={{ borderColor: 'rgba(23,22,18,0.14)' }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                  Reservation by phone
                </span>
                <span className="font-serif italic text-[17px] sm:text-[19px] text-bone-forest">
                  +254 722-595-916
                </span>
              </Link>
              <Link
                href="mailto:info@divinetravelnestsafaris.com"
                className="flex flex-col gap-1.5 p-4 border bg-bone-paper hover:border-bone-clay hover:bg-white transition-all duration-200"
                style={{ borderColor: 'rgba(23,22,18,0.14)' }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                  Reservation by email
                </span>
                <span className="font-serif italic text-[14px] sm:text-[17px] text-bone-forest break-all">
                  info@divinetravelnestsafaris.com
                </span>
              </Link>
            </div>
          </Reveal>

          {/* Right */}
          <Reveal variant="slideRight" delay={0.1}>
            <p
              className="text-[16px] sm:text-[19px] leading-[1.6] text-bone-ink mb-6"
              style={{ position: 'relative' }}
            >
              <span
                className="font-serif float-left text-bone-clay leading-[0.85] pr-2.5 pt-1.5"
                style={{ fontSize: 'clamp(44px, 8vw, 64px)' }}
              >
                W
              </span>
              elcome to Divine Travel Nest Safaris, the home of immersive, authentic,
              and expertly crafted East Africa safari experiences. We specialize in Kenya
              safaris, Tanzania safaris, cross-border Kenya–Tanzania safari circuits, and
              unforgettable Uganda gorilla trekking tours.
            </p>
            <p className="text-[14px] sm:text-[15px] leading-[1.7] text-bone-muted mb-4">
              Whether you dream of witnessing the Great Wildebeest Migration in the Masai
              Mara, tracking mountain gorillas deep in Bwindi Forest, or exploring the
              vast Serengeti plains, we are your dedicated travel partner — turning
              safari dreams into life-lasting memories.
            </p>
            <p className="text-[14px] sm:text-[15px] leading-[1.7] text-bone-muted mb-8">
              At Divine Travel Nest Safaris, every journey is designed with passion,
              precision, and personalized attention.
            </p>

            {/* Mission quote */}
            <blockquote
              className="p-5 sm:p-7 bg-bone-paper border-l-[3px] font-serif italic text-[18px] sm:text-[22px] leading-[1.35] text-bone-forest"
              style={{ borderLeftColor: '#9d4519' }}
            >
              <span className="block font-mono not-italic text-[10px] uppercase tracking-[0.16em] text-bone-muted mb-3">
                Our mission
              </span>
              To create experience-rich, safe, and value-driven African safaris that bring
              you closer to wildlife, culture, and the magic of East Africa.
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
