import Reveal, { Stagger, RevealItem } from '@/components/ui/Reveal'

const team = [
  {
    name: 'James Kahoro',
    role: 'Founder & Lead Guide',
    bio: '15+ years guiding across East Africa. Specialist in Kenya and Tanzania wildlife circuits. Certified by KWS and Eco-Tourism Kenya.',
  },
  {
    name: 'Grace Wanjiru',
    role: 'Safari Consultant',
    bio: 'Expert in tailor-made itinerary design. Grace has personally visited over 40 parks and reserves across Kenya, Tanzania and Uganda.',
  },
  {
    name: 'David Ochieng',
    role: 'Operations & Logistics',
    bio: 'Ensures every transfer, lodge booking and activity runs seamlessly. David is the backbone of our on-the-ground operations.',
  },
  {
    name: 'Amina Hassan',
    role: 'Tanzania Specialist',
    bio: 'Born in Arusha, Amina knows the Serengeti and Ngorongoro like her own back yard. She leads our Tanzanian safari design.',
  },
]

export default function TeamSection() {
  return (
    <section
      className="py-[140px] bg-bone-paper border-y"
      style={{ borderColor: 'rgba(23,22,18,0.14)' }}
    >
      <div className="container-site">
        {/* Header */}
        <Reveal>
          <div className="section-hd">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                The People Behind the Safari
              </div>
              <h2
                className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
                style={{ fontSize: 'clamp(40px, 5.4vw, 76px)' }}
              >
                Meet your{' '}
                <em className="italic text-bone-clay">guides</em>.
              </h2>
            </div>
            <p className="text-[15px] leading-[1.65] text-bone-muted max-w-[56ch]">
              Every member of our team has spent years in the field. We don't just book
              safaris — we live them. You're in expert hands from first enquiry to final
              farewell.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-7" stagger={0.1}>
          {team.map((member) => (
            <RevealItem key={member.name} variant="scaleUp">
              <div className="group">
                <div
                  className="overflow-hidden mb-4 flex items-center justify-center"
                  style={{ aspectRatio: '3/4', background: '#2a3a2a' }}
                >
                  <span
                    className="font-serif italic text-bone-paper select-none"
                    style={{ fontSize: 'clamp(48px, 6vw, 72px)', opacity: 0.45 }}
                  >
                    {member.name.split(' ').map((w) => w[0]).join('')}
                  </span>
                </div>
                <h3 className="font-serif italic text-[24px] leading-[1.1] text-bone-ink mb-0.5">
                  {member.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-3">
                  {member.role}
                </p>
                <p className="text-[13px] leading-[1.55] text-bone-muted">{member.bio}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
