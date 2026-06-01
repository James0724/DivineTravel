const team = [
  {
    name: 'James Kahoro',
    role: 'Founder & Lead Guide',
    bio: '15+ years guiding across East Africa. Specialist in Kenya and Tanzania wildlife circuits. Certified by KWS and Eco-Tourism Kenya.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name: 'Grace Wanjiru',
    role: 'Safari Consultant',
    bio: 'Expert in tailor-made itinerary design. Grace has personally visited over 40 parks and reserves across Kenya, Tanzania and Uganda.',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=400&q=80',
  },
  {
    name: 'David Ochieng',
    role: 'Operations & Logistics',
    bio: 'Ensures every transfer, lodge booking and activity runs seamlessly. David is the backbone of our on-the-ground operations.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name: 'Amina Hassan',
    role: 'Tanzania Specialist',
    bio: 'Born in Arusha, Amina knows the Serengeti and Ngorongoro like her own back yard. She leads our Tanzanian safari design.',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
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

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
          {team.map((member) => (
            <div key={member.name} className="group">
              <div
                className="overflow-hidden mb-4"
                style={{ aspectRatio: '3/4', background: '#e4dac3' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.04]"
                  style={{ filter: 'sepia(0.15) contrast(1.05)' }}
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif italic text-[24px] leading-[1.1] text-bone-ink mb-0.5">
                {member.name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-3">
                {member.role}
              </p>
              <p className="text-[13px] leading-[1.55] text-bone-muted">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
