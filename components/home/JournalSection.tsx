import Image from 'next/image'
import Link from 'next/link'

const articles = [
  {
    feat: true,
    category: 'Migration',
    date: 'June 2026',
    title: 'The Mara River Crossing: Everything You Need to Know',
    excerpt:
      'The most dramatic wildlife event on Earth plays out daily during July–October. Here is our complete guide to timing your visit, choosing your camp, and witnessing a crossing.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=900&q=80',
    href: '/blog/mara-river-crossing-guide',
  },
  {
    feat: false,
    category: 'Destinations',
    date: 'May 2026',
    title: 'Bwindi Forest: A Gorilla Trekking Guide',
    excerpt:
      "Uganda's impenetrable forest holds half the world's mountain gorillas. We walk you through permits, preparation and what to expect on the trail.",
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=720&q=80',
    href: '/blog/bwindi-gorilla-trekking-guide',
  },
  {
    feat: false,
    category: 'Planning',
    date: 'Apr 2026',
    title: 'Kenya vs Tanzania: Which Safari Destination Is Right for You?',
    excerpt:
      'Both countries offer world-class wildlife — but the experience is different. We break down the key differences to help you choose.',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=720&q=80',
    href: '/blog/kenya-vs-tanzania-safari-comparison',
  },
]

export default function JournalSection() {
  return (
    <section className="py-[140px] bg-bone-bg">
      <div className="container-site">
        {/* Header */}
        <div className="section-hd">
          <div>
            <div className="eyebrow mb-4">
              <span className="dot" />
              Safari Journal
            </div>
            <h2
              className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
              style={{ fontSize: 'clamp(40px, 5.4vw, 76px)' }}
            >
              Stories from{' '}
              <em className="italic text-bone-clay">the field</em>.
            </h2>
          </div>
          <div>
            <p className="text-[15px] leading-[1.65] text-bone-muted max-w-[56ch]">
              Guides, tips and behind-the-scenes stories from our in-country team and the
              wildlife they follow across East Africa.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 mt-5 text-xs font-mono uppercase tracking-[0.12em] text-bone-clay hover:underline"
            >
              View all articles →
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-9 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {articles.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="flex flex-col gap-[18px] cursor-pointer group"
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: a.feat ? '16/11' : '4/3' }}
              >
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex gap-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                <span>{a.category}</span>
                <span>·</span>
                <span>{a.date}</span>
              </div>
              <h3
                className={`font-serif leading-[1.1] tracking-[-0.01em] text-bone-ink group-hover:text-bone-clay transition-colors ${a.feat ? 'text-[40px]' : 'text-[28px]'}`}
              >
                {a.title}
              </h3>
              {a.feat && (
                <p className="text-[14px] leading-[1.6] text-bone-muted">{a.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
