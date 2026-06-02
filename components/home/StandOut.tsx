import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'

const features = [
  {
    ic: 'i',
    title: 'Genuine In-Country Team',
    body: 'We are based in Nairobi — not a booking engine. When you call, you speak directly with your safari consultant who knows every park personally.',
  },
  {
    ic: 'ii',
    title: 'Real-Time Availability',
    body: 'We hold direct lodge allocations, giving you access to the best camps even in peak season. No third-party mark-ups, no surprises.',
  },
  {
    ic: 'iii',
    title: 'Wildlife-First Routing',
    body: 'Our itineraries follow the animals, not the calendar. We track the migration in real time and can adjust your route mid-safari.',
  },
  {
    ic: 'iv',
    title: 'Transparent, All-Inclusive Pricing',
    body: 'No hidden extras. Park fees, activities, meals, transfers — all included in your quote so you can plan with confidence.',
  },
]

export default function StandOut() {
  return (
    <section
      className="py-[140px] bg-bone-paper border-y"
      style={{ borderColor: 'rgba(23,22,18,0.14)' }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <Reveal variant="fadeUp">
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
              <Image
                src="https://images.pexels.com/photos/16444284/pexels-photo-16444284.jpeg?auto=compress&cs=tinysrgb&w=900&q=80"
                alt="Safari vehicle on a game drive through the African bush"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Content */}
          <Reveal variant="fadeUp" delay={0.12}>
            <div className="eyebrow mb-4">
              <span className="dot" />
              What sets us apart
            </div>
            <h2
              className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4 mb-4"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            >
              Safari done{' '}
              <em className="italic text-bone-clay">properly</em>.
            </h2>
            <p className="text-[15px] leading-[1.65] text-bone-muted max-w-[48ch] mb-8">
              In a market full of online booking engines, we remain a hands-on, in-country
              team dedicated to crafting safaris that exceed every expectation.
            </p>

            {/* Feature list */}
            <div className="flex flex-col">
              {features.map((f, i) => (
                <div
                  key={f.ic}
                  className="py-6 border-t grid gap-[18px] items-start"
                  style={{
                    borderColor: 'rgba(23,22,18,0.14)',
                    gridTemplateColumns: '36px 1fr',
                    borderBottom: i === features.length - 1 ? '1px solid rgba(23,22,18,0.14)' : undefined,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif italic text-[16px] flex-shrink-0"
                    style={{ background: '#9d4519' }}
                  >
                    {f.ic}
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-[22px] text-bone-ink mb-1">
                      {f.title}
                    </h4>
                    <p className="text-[14px] leading-[1.55] text-bone-muted">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
