import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import connectDB from '@/lib/db/mongoose'
import SafariModel from '@/lib/db/models/Safari'
import type { Safari } from '@/types'
import CtaBand from '@/components/ui/CtaBand'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

// ─── Data fetching ────────────────────────────────────────────────────────────

const getSafari = cache(async (slug: string): Promise<Safari | null> => {
  try {
    await connectDB()
    const safari = await SafariModel.findOne({ slug, active: true }).lean()
    if (!safari) return null
    return JSON.parse(JSON.stringify(safari)) as Safari
  } catch {
    return null
  }
})

const getRelatedSafaris = cache(async (slug: string, country: string): Promise<Safari[]> => {
  try {
    await connectDB()
    const safaris = await SafariModel.find({
      active: true,
      slug: { $ne: slug },
      'location.country': { $regex: country, $options: 'i' },
    })
      .sort({ rating: -1 })
      .limit(3)
      .select('name slug tagline location duration pricing coverImage images category featured rating')
      .lean()
    return JSON.parse(JSON.stringify(safaris)) as Safari[]
  } catch {
    return []
  }
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const safari = await getSafari(slug)
  if (!safari) return { title: 'Safari Not Found' }

  const title = safari.seo?.metaTitle ?? `${safari.name} | Divine Travel Nest Safaris`
  const description = safari.seo?.metaDescription ?? safari.tagline

  return {
    title,
    description,
    keywords: safari.seo?.keywords?.join(', '),
    alternates: { canonical: `/safaris/${safari.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: safari.coverImage,
          width: 1200,
          height: 630,
          alt: safari.name,
        },
      ],
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Dot() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '6px',
        height: '6px',
        background: 'var(--clay)',
        borderRadius: '50%',
        marginRight: '10px',
        verticalAlign: '2px',
        flexShrink: 0,
      }}
    />
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: '11px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: 'var(--muted)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Dot />
      {children}
    </div>
  )
}

function SideBox({
  children,
  dark,
}: {
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <div
      style={{
        background: dark ? 'var(--forest)' : 'var(--paper)',
        color: dark ? 'var(--paper)' : undefined,
        border: dark ? 'none' : '1px solid var(--line)',
        padding: '28px',
        marginBottom: '16px',
      }}
    >
      {children}
    </div>
  )
}

function SideBoxTitle({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h4
      style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: dark ? 'rgba(250,246,236,0.5)' : 'var(--muted)',
        marginBottom: '16px',
      }}
    >
      {children}
    </h4>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SafariDetailPage({ params }: Props) {
  const { slug } = await params
  const safari = await getSafari(slug)
  if (!safari) notFound()

  const nights      = Math.max(safari.duration - 1, 0)
  const parks       = safari.location.parks?.length ? safari.location.parks : (safari.location.park ? [safari.location.park] : [])
  const countries   = safari.location.countries?.length ? safari.location.countries : [safari.location.country]
  const heroImage   = safari.coverImage || safari.images?.[0]?.url || 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1700&q=68'
  const related     = await getRelatedSafaris(safari.slug, safari.location.country)

  const tripFacts: { label: string; value: string }[] = [
    { label: 'Duration',   value: `${safari.duration} Days · ${nights} Nights` },
    { label: 'Country',    value: countries.join(', ') },
    { label: 'Park / Reserve', value: parks.join(', ') || safari.location.region },
    { label: 'Group size', value: `${safari.minGroupSize} – ${safari.maxGroupSize}` },
    ...(safari.bestSeason?.length ? [{ label: 'Best season', value: safari.bestSeason.join(', ') }] : []),
    { label: 'Vehicle',    value: '4×4 Pop-up Roof' },
    { label: 'Difficulty', value: safari.difficulty.charAt(0).toUpperCase() + safari.difficulty.slice(1) },
  ]

  return (
    <>
      {/* ── SEO schemas ──────────────────────────────────────────────────────── */}
      <BreadcrumbSchema
        items={[
          { name: 'Home',           href: '/' },
          { name: 'Tours & Safaris', href: '/safaris' },
          { name: safari.name,       href: `/safaris/${safari.slug}` },
        ]}
      />

      {/* ── Responsive helper styles ──────────────────────────────────────────
          We keep the exact .detail-hero / .detail-grid / .day class names from
          the HTML so the media-query block below can target them. */}
      <style>{`
        .detail-hero { position:relative; height:70vh; min-height:580px; overflow:hidden; color:white; }
        .detail-hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,0) 30%,rgba(0,0,0,.55)); }
        .detail-hero-meta { position:absolute; bottom:56px; left:0; right:0; max-width:1480px; margin:0 auto; padding:0 48px; display:grid; grid-template-columns:1fr auto; gap:48px; align-items:end; }
        .detail-body { padding:96px 0; background:var(--bg); }
        .detail-wrap { max-width:1480px; margin:0 auto; padding:0 48px; }
        .detail-grid { display:grid; grid-template-columns:1fr 380px; gap:80px; align-items:start; }
        .detail-side { position:sticky; top:100px; }
        .day { padding:36px 0; border-top:1px solid var(--line); display:grid; grid-template-columns:120px 1fr; gap:36px; }
        .day:last-of-type { border-bottom:1px solid var(--line); }
        .lodge-wrap { max-width:1480px; margin:0 auto; padding:0 48px; }
        .lodge-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
        .related-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:36px; margin-top:48px; }
        .pkg-card-img { aspect-ratio:4/3.4; overflow:hidden; background:var(--bg-deep); margin-bottom:20px; position:relative; }
        @media (max-width:1180px) {
          .detail-grid { grid-template-columns:1fr; gap:48px; }
          .detail-side { position:static; }
          .lodge-grid, .related-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width:900px) {
          .detail-hero-meta { grid-template-columns:1fr; gap:16px; left:24px; right:24px; bottom:32px; padding:0; }
          .detail-wrap, .lodge-wrap { padding:0 24px; }
          .day { grid-template-columns:56px 1fr; gap:18px; }
          .detail-body { padding:76px 0; }
        }
        @media (max-width:600px) {
          .detail-hero { height:62vh; min-height:440px; }
          .day { grid-template-columns:1fr; gap:8px; }
          .lodge-grid, .related-grid { grid-template-columns:1fr; }
          .detail-wrap, .lodge-wrap { padding:0 18px; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="detail-hero">
        <Image
          src={heroImage}
          alt={safari.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="detail-hero-overlay" />

        <div className="detail-hero-meta">
          {/* Left — title block */}
          <div>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                opacity: 0.85,
                marginBottom: '12px',
              }}
            >
              Tours &amp; Safaris · {countries.join(' · ')} · {parks[0] || safari.location.region}
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(40px, 5.5vw, 88px)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                maxWidth: '18ch',
              }}
            >
              {safari.name}
            </h1>
            <p
              style={{
                marginTop: '18px',
                maxWidth: '56ch',
                fontSize: '15px',
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              {safari.tagline}
            </p>
          </div>

          {/* Right — price box */}
          <div
            style={{
              background: 'rgba(244,237,224,0.95)',
              color: 'var(--ink)',
              padding: '24px 28px',
              minWidth: '240px',
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              FROM · per person
            </div>

            {(['budget', 'midRange', 'luxury'] as const).map((tier, i, arr) => {
              const t = safari.pricing?.[tier]
              if (!t?.pricePerPerson) return null
              const label = tier === 'midRange' ? 'Mid-range' : tier.charAt(0).toUpperCase() + tier.slice(1)
              const isLast = i === arr.length - 1
              return (
                <div
                  key={tier}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: isLast ? 'none' : '1px solid var(--line)',
                    fontSize: '13px',
                  }}
                >
                  <span>{label}</span>
                  <b
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic',
                      color: 'var(--clay)',
                    }}
                  >
                    ${t.pricePerPerson.toLocaleString()}{tier === 'luxury' ? '+' : ''}
                  </b>
                </div>
              )
            })}

            <Link
              href="/contact"
              style={{
                display: 'block',
                marginTop: '14px',
                padding: '12px',
                textAlign: 'center',
                background: 'var(--forest)',
                color: 'var(--paper)',
                fontSize: '13px',
                borderRadius: '4px',
                transition: 'background 0.2s',
              }}
            >
              Plan my {safari.duration} day{safari.duration !== 1 ? 's' : ''} safari →
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          DETAIL BODY — itinerary (left) + sidebar (right)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="detail-body">
        <div className="detail-wrap">
          <div className="detail-grid">

            {/* ── LEFT — Itinerary ──────────────────────────────────────── */}
            <div>
              {/* Section header */}
              <div style={{ marginBottom: '56px' }}>
                <Eyebrow>The Itinerary</Eyebrow>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontSize: 'clamp(36px, 4.4vw, 60px)',
                    lineHeight: 1.02,
                    letterSpacing: '-0.02em',
                    marginTop: '14px',
                  }}
                >
                  {safari.duration} day{safari.duration !== 1 ? 's' : ''}.{' '}
                  <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>
                    {nights} night{nights !== 1 ? 's' : ''}
                  </em>.
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: 'var(--muted)',
                    maxWidth: '60ch',
                    marginTop: '18px',
                  }}
                >
                  {safari.description}
                </p>
              </div>

              {/* Day-by-day */}
              {safari.itinerary?.length > 0 ? (
                safari.itinerary.map((day) => (
                  <div key={day.day} className="day">
                    {/* Day number */}
                    <div>
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontStyle: 'italic',
                          fontSize: '40px',
                          lineHeight: 1,
                          color: 'var(--clay)',
                        }}
                      >
                        {String(day.day).padStart(2, '0')}
                      </div>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: "'Geist Mono', monospace",
                          fontStyle: 'normal',
                          fontSize: '10px',
                          color: 'var(--muted)',
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          marginTop: '8px',
                        }}
                      >
                        Day
                      </span>
                    </div>

                    {/* Day content */}
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 400,
                          fontSize: '28px',
                          letterSpacing: '-0.01em',
                          marginBottom: '12px',
                        }}
                      >
                        {day.title}
                      </h3>

                      {/* Meals / meta */}
                      {day.meals?.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            gap: '18px',
                            flexWrap: 'wrap',
                            marginBottom: '14px',
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: '10px',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                          }}
                        >
                          <span>
                            <strong style={{ color: 'var(--forest)', fontWeight: 500 }}>Meals</strong>{' '}
                            {day.meals.join(' · ')}
                          </span>
                        </div>
                      )}

                      <p
                        style={{
                          fontSize: '15px',
                          lineHeight: 1.65,
                          color: 'var(--muted)',
                          marginBottom: '14px',
                        }}
                      >
                        {day.description}
                      </p>

                      {/* Activity highlights */}
                      {day.activities?.length > 0 && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px' }}>
                          {day.activities.map((act, i) => (
                            <li
                              key={i}
                              style={{
                                padding: '4px 0 4px 18px',
                                position: 'relative',
                                fontSize: '14px',
                                color: 'var(--ink)',
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  left: '4px',
                                  color: 'var(--clay)',
                                  fontWeight: 700,
                                }}
                              >
                                ·
                              </span>
                              {act}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Lodge badge */}
                      {day.accommodation && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: '11px',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: 'var(--forest)',
                            padding: '8px 12px',
                            background: 'var(--paper)',
                            border: '1px solid var(--line)',
                            borderRadius: '4px',
                            marginTop: '4px',
                          }}
                        >
                          ⌂ {day.accommodation}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '15px', color: 'var(--muted)', paddingTop: '20px' }}>
                  Detailed itinerary available on request — contact us to get your personalised day-by-day plan.
                </p>
              )}
            </div>

            {/* ── RIGHT — Sidebar ───────────────────────────────────────── */}
            <aside className="detail-side">
              {/* Trip facts */}
              <SideBox>
                <SideBoxTitle>Trip facts</SideBoxTitle>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tripFacts.map(({ label, value }, i) => (
                    <li
                      key={label}
                      style={{
                        padding: '10px 0',
                        borderBottom: i < tripFacts.length - 1 ? '1px solid var(--line)' : 'none',
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '14px',
                        alignItems: 'baseline',
                      }}
                    >
                      <span style={{ color: 'var(--ink)' }}>{label}</span>
                      <b
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontStyle: 'italic',
                          fontWeight: 400,
                          color: 'var(--forest)',
                          textAlign: 'right',
                        }}
                      >
                        {value}
                      </b>
                    </li>
                  ))}
                </ul>
              </SideBox>

              {/* What's included */}
              {safari.included?.length > 0 && (
                <SideBox>
                  <SideBoxTitle>What&apos;s included</SideBoxTitle>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {safari.included.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          padding: '10px 0',
                          borderBottom: i < safari.included.length - 1 ? '1px solid var(--line)' : 'none',
                          fontSize: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '14px',
                          alignItems: 'baseline',
                        }}
                      >
                        <span style={{ color: 'var(--ink)' }}>{item}</span>
                        <span style={{ color: 'var(--clay)', fontSize: '14px' }}>✓</span>
                      </li>
                    ))}
                  </ul>
                </SideBox>
              )}

              {/* What's excluded */}
              {safari.excluded?.length > 0 && (
                <SideBox>
                  <SideBoxTitle>What&apos;s excluded</SideBoxTitle>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {safari.excluded.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          padding: '10px 0',
                          borderBottom: i < safari.excluded.length - 1 ? '1px solid var(--line)' : 'none',
                          fontSize: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '14px',
                          alignItems: 'baseline',
                        }}
                      >
                        <span style={{ color: 'var(--ink)' }}>{item}</span>
                        <span style={{ color: 'var(--muted)', fontSize: '14px' }}>—</span>
                      </li>
                    ))}
                  </ul>
                </SideBox>
              )}

              {/* Booking CTA */}
              <SideBox dark>
                <SideBoxTitle dark>Begin this trip</SideBoxTitle>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: '20px',
                    lineHeight: 1.25,
                    marginBottom: '18px',
                  }}
                >
                  Call us at +254 722-595-916 or request a custom quote.
                </p>
                <Link
                  href="/contact"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#f4d4a8',
                    color: 'var(--forest)',
                    padding: '12px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    fontWeight: 500,
                  }}
                >
                  Request this itinerary
                </Link>
              </SideBox>
            </aside>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          LODGES — three pricing tiers
      ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: '96px 0',
          background: 'var(--paper)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div className="lodge-wrap">
          <Eyebrow>Where you will stay</Eyebrow>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 'clamp(36px, 4.4vw, 60px)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              marginTop: '14px',
              marginBottom: '14px',
            }}
          >
            Handpicked lodges,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>three</em> tiers.
          </h2>
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.65,
              color: 'var(--muted)',
              marginBottom: '48px',
              maxWidth: '56ch',
            }}
          >
            Whether you prefer a budget tented camp, a mid-range lodge, or a luxury safari camp inside the
            reserve — we work with vetted partners across the full range.
          </p>

          <div className="lodge-grid">
            {(
              [
                { tier: 'budget',   label: 'Budget',    em: 'options' },
                { tier: 'midRange', label: 'Mid-range', em: 'options' },
                { tier: 'luxury',   label: 'Luxury',    em: 'options' },
              ] as const
            ).map(({ tier, label, em }) => {
              const t = safari.pricing?.[tier]
              if (!t) return null
              return (
                <div
                  key={tier}
                  style={{
                    padding: '28px',
                    background: 'var(--bg)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '26px',
                      marginBottom: '6px',
                    }}
                  >
                    {label}{' '}
                    <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{em}</em>
                  </h3>
                  <div
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      marginBottom: '18px',
                    }}
                  >
                    From ${t.pricePerPerson.toLocaleString()} / person
                  </div>

                  {t.accommodationType && (
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: 'var(--ink)',
                        marginBottom: t.includes?.length ? '12px' : 0,
                        fontWeight: 500,
                      }}
                    >
                      {t.accommodationType}
                    </p>
                  )}

                  {t.includes?.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {t.includes.map((item, i) => (
                        <li
                          key={i}
                          style={{
                            padding: '12px 0',
                            borderTop: '1px solid var(--line)',
                            fontSize: '14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                          }}
                        >
                          <span style={{ color: 'var(--ink)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {t.description && !t.includes?.length && (
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--muted)', marginTop: '4px' }}>
                      {t.description}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HIGHLIGHTS — if available
      ════════════════════════════════════════════════════════════════════ */}
      {safari.highlights?.length > 0 && (
        <section
          style={{
            padding: '96px 0',
            background: 'var(--bg)',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div className="lodge-wrap">
            <Eyebrow>Safari highlights</Eyebrow>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: 'clamp(36px, 4.4vw, 60px)',
                lineHeight: 1.02,
                letterSpacing: '-0.02em',
                marginTop: '14px',
                marginBottom: '40px',
              }}
            >
              What to <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>expect</em>.
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1px',
                background: 'var(--line)',
                border: '1px solid var(--line)',
              }}
            >
              {safari.highlights.map((hl, i) => (
                <div
                  key={i}
                  style={{
                    padding: '30px 28px',
                    background: 'var(--bg)',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: 'italic',
                      fontSize: '18px',
                      color: 'var(--clay)',
                      flexShrink: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>{hl}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          RELATED SAFARIS
      ════════════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section
          style={{
            padding: '96px 0',
            background: 'var(--paper)',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div className="lodge-wrap">
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                marginBottom: '48px',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <Eyebrow>You may also like</Eyebrow>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontSize: 'clamp(32px, 3.8vw, 52px)',
                    lineHeight: 1.02,
                    letterSpacing: '-0.02em',
                    marginTop: '14px',
                  }}
                >
                  More{' '}
                  <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>
                    {countries[0]}
                  </em>{' '}
                  safaris.
                </h2>
              </div>
              <Link
                href="/safaris"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 22px',
                  background: 'var(--forest)',
                  color: 'var(--paper)',
                  borderRadius: '999px',
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                All safari packages →
              </Link>
            </div>

            <div className="related-grid">
              {related.map((r) => {
                const lowestPrice = r.pricing?.budget?.pricePerPerson ?? 0
                const rNights = Math.max(r.duration - 1, 0)
                const isGold = r.featured
                const tagLabel = r.featured
                  ? 'Featured'
                  : r.category?.[0]
                    ? r.category[0].charAt(0).toUpperCase() + r.category[0].slice(1)
                    : 'Wildlife'

                return (
                  <Link key={r._id} href={`/safaris/${r.slug}`} className="flex flex-col">
                    {/* Image */}
                    <div className="pkg-card-img">
                      <Image
                        src={r.coverImage || r.images?.[0]?.url || '/images/placeholder.jpg'}
                        alt={r.name}
                        fill
                        className="object-cover transition-transform duration-1000 hover:scale-[1.05]"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Meta */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          border: '1px solid',
                          borderColor: isGold ? 'var(--clay)' : 'var(--line)',
                          borderRadius: '999px',
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.14em',
                          color: isGold ? 'var(--clay)' : 'var(--muted)',
                        }}
                      >
                        {isGold ? '★ ' : ''}{tagLabel}
                      </span>
                      {r.rating > 0 && (
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: '10px',
                            color: 'var(--muted)',
                          }}
                        >
                          ★ {r.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                        fontSize: '28px',
                        lineHeight: 1.05,
                        letterSpacing: '-0.01em',
                        marginBottom: '10px',
                        color: 'var(--ink)',
                      }}
                    >
                      {r.name}
                    </h3>

                    {/* Tagline */}
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.55,
                        color: 'var(--muted)',
                        marginBottom: '16px',
                      }}
                    >
                      {r.tagline}
                    </p>

                    {/* Footer */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '16px',
                        borderTop: '1px solid var(--line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '22px',
                          color: 'var(--ink)',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: '10px',
                            color: 'var(--muted)',
                            letterSpacing: '0.12em',
                            marginRight: '6px',
                          }}
                        >
                          FROM
                        </span>
                        <b style={{ fontStyle: 'italic' }}>${lowestPrice.toLocaleString()}</b>
                      </div>
                      <span
                        style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: '11px',
                          color: 'var(--muted)',
                          letterSpacing: '0.14em',
                        }}
                      >
                        {r.duration}D · {rNights}N
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          CTA BAND
      ════════════════════════════════════════════════════════════════════ */}
      <CtaBand
        variant="large"
        heading={
          <>
            Ready for your{' '}
            <em style={{ fontStyle: 'italic', color: '#f4d4a8' }}>East Africa</em> adventure?
          </>
        }
        description="Tell us your dates, budget and dream wildlife moments. Our in-country team will design a tailor-made itinerary and send a free, no-obligation proposal — usually within the hour."
        buttonText="Get your free quote"
      />
    </>
  )
}
