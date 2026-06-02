import Image from 'next/image'
import Link from 'next/link'
import connectDB from '@/lib/db/mongoose'
import PostModel from '@/lib/db/models/Post'
import Reveal, { Stagger, RevealItem } from '@/components/ui/Reveal'
import SiteLink from '@/components/ui/SiteLink'
import type { BlogPost } from '@/types'

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=900&q=80'

async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    await connectDB()
    const posts = await PostModel.find({ published: true })
      .sort({ featured: -1, publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt category publishedAt coverImage featured')
      .lean()
    return JSON.parse(JSON.stringify(posts)) as BlogPost[]
  } catch {
    return []
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export default async function JournalSection() {
  const posts = await getFeaturedPosts()

  if (posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <section className="py-[140px] bg-bone-bg">
      <div className="container-site">
        {/* Header */}
        <Reveal>
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
              <SiteLink href="/blog" variant="ghost-mono" arrow className="mt-5">
                View all articles
              </SiteLink>
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <Stagger className="grid gap-9 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {[featured, ...rest].filter(Boolean).map((post, idx) => {
            const isFeat = idx === 0
            return (
              <RevealItem key={post._id as string}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-col gap-[18px] cursor-pointer group"
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: isFeat ? '16/11' : '4/3' }}
                  >
                    <Image
                      src={post.coverImage || FALLBACK_IMAGE}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex gap-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3
                    className={`font-serif leading-[1.1] tracking-[-0.01em] text-bone-ink group-hover:text-bone-clay transition-colors ${isFeat ? 'text-[40px]' : 'text-[28px]'}`}
                  >
                    {post.title}
                  </h3>
                  {isFeat && post.excerpt && (
                    <p className="text-[14px] leading-[1.6] text-bone-muted">{post.excerpt}</p>
                  )}
                </Link>
              </RevealItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
