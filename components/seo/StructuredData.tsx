import type { Safari } from '@/types'
import { buildAbsoluteUrl } from '@/lib/utils'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://divinetravelnestsafaris.com'

// ─── Organization ─────────────────────────────────────────────────────────────

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${APP_URL}/#organization`,
    name: 'Divine Travel Nest Safaris',
    alternateName: 'Divine Travel Nests Safaris Ltd',
    url: APP_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${APP_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description:
      'Expert-guided, tailor-made East Africa safaris — Kenya, Tanzania & Uganda. Budget to luxury safari packages, gorilla trekking and wildlife tours.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Spur Mall',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2921,
      longitude: 36.8219,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+254-722-595-916',
        email: 'info@divinetravelnestsafaris.com',
        contactType: 'customer service',
        availableLanguage: 'English',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '08:00',
          closes: '18:00',
        },
      },
    ],
    areaServed: [
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Tanzania' },
      { '@type': 'Country', name: 'Uganda' },
    ],
    knowsAbout: [
      'Safari tours',
      'Wildlife tourism',
      'Gorilla trekking',
      'Great Migration',
      'Masai Mara',
      'Serengeti',
      'Bwindi Impenetrable Forest',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'East Africa Safari Packages',
      url: `${APP_URL}/safaris`,
    },
    priceRange: '$$–$$$$',
    sameAs: [
      'https://www.tripadvisor.com/Attraction_Review-g294207-d26155748-Reviews-Divine_Travel_Nest_Safaris-Nairobi.html',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── WebSite (enables Google Sitelinks Search Box) ────────────────────────────

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${APP_URL}/#website`,
    name: 'Divine Travel Nest Safaris',
    url: APP_URL,
    description:
      'Expert-guided, tailor-made East Africa safaris — Kenya, Tanzania & Uganda. Budget to luxury.',
    publisher: { '@id': `${APP_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/safaris?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── LocalBusiness (for contact page) ────────────────────────────────────────

export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': `${APP_URL}/#localbusiness`,
    name: 'Divine Travel Nest Safaris',
    image: `${APP_URL}/logo.png`,
    url: APP_URL,
    telephone: '+254-722-595-916',
    email: 'info@divinetravelnestsafaris.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Spur Mall',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2921,
      longitude: 36.8219,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    currenciesAccepted: 'USD, EUR, GBP, KES',
    paymentAccepted: 'Bank Transfer, Credit Card, M-Pesa',
    priceRange: '$$–$$$$',
    areaServed: ['Kenya', 'Tanzania', 'Uganda'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── TouristDestination ────────────────────────────────────────────────────────

interface TouristDestinationProps {
  name: string
  description: string
  url: string
  image: string
  countryCode: string
  highlights?: string[]
}

export function TouristDestinationSchema({
  name,
  description,
  url,
  image,
  countryCode,
  highlights = [],
}: TouristDestinationProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    url,
    image,
    touristType: ['Wildlife safari', 'Nature tourism', 'Adventure travel'],
    includesAttraction: highlights.map((h) => ({
      '@type': 'TouristAttraction',
      name: h,
    })),
    address: {
      '@type': 'PostalAddress',
      addressCountry: countryCode,
    },
    hasMap: `https://maps.google.com/?q=${encodeURIComponent(name)}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── CollectionPage (safari listing pages) ────────────────────────────────────

interface CollectionPageProps {
  name: string
  description: string
  url: string
  items: { name: string; url: string; description?: string }[]
}

export function CollectionPageSchema({ name, description, url, items }: CollectionPageProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    publisher: { '@id': `${APP_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
        description: item.description,
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Tour / Safari (TouristTrip) ──────────────────────────────────────────────

export function SafariSchema({ safari }: { safari: Safari }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': buildAbsoluteUrl(`/safaris/${safari.slug}#trip`),
    name: safari.name,
    description: safari.description,
    url: buildAbsoluteUrl(`/safaris/${safari.slug}`),
    image: safari.images?.map((img) => img.url) ?? [],
    touristType: safari.category,
    itinerary: safari.location.park
      ? {
          '@type': 'ItemList',
          name: `${safari.name} Itinerary`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: safari.location.park,
            },
          ],
        }
      : undefined,
    provider: { '@id': `${APP_URL}/#organization` },
    location: {
      '@type': 'TouristDestination',
      name: safari.location.park ?? safari.location.country,
      address: {
        '@type': 'PostalAddress',
        addressCountry: safari.location.country,
      },
      ...(safari.location.coordinates && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: safari.location.coordinates.lat,
          longitude: safari.location.coordinates.lng,
        },
      }),
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Budget Package',
        price: safari.pricing.budget.pricePerPerson,
        priceCurrency: safari.pricing.budget.currency,
        description: safari.pricing.budget.description,
        availability: 'https://schema.org/InStock',
        url: buildAbsoluteUrl(`/contact`),
      },
      {
        '@type': 'Offer',
        name: 'Mid-Range Package',
        price: safari.pricing.midRange.pricePerPerson,
        priceCurrency: safari.pricing.midRange.currency,
        description: safari.pricing.midRange.description,
        availability: 'https://schema.org/InStock',
        url: buildAbsoluteUrl(`/contact`),
      },
      {
        '@type': 'Offer',
        name: 'Luxury Package',
        price: safari.pricing.luxury.pricePerPerson,
        priceCurrency: safari.pricing.luxury.currency,
        description: safari.pricing.luxury.description,
        availability: 'https://schema.org/InStock',
        url: buildAbsoluteUrl(`/contact`),
      },
    ],
    ...(safari.rating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: safari.rating.toFixed(1),
        reviewCount: safari.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.href),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string
  answer: string
}

export function FaqSchema({ items }: { items: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
