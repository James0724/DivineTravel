import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Cormorant_Garamond, Nunito } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import { OrganizationSchema, WebSiteSchema } from '@/components/seo/StructuredData'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://divinetravelnestsafaris.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safari Tour Packages 2026/2027',
    template: '%s | Divine Travel Nest Safaris',
  },
  description:
    'Divine Travel Nest Safaris offers Kenya safari tours, Tanzania safaris and combined Kenya/Tanzania safari packages, plus Uganda gorilla trekking — start your African journey today.',
  keywords: [
    'Kenya safari',
    'Tanzania safari',
    'Uganda gorilla trekking',
    'Masai Mara safari',
    'Serengeti safari',
    'East Africa safari',
    'safari tour packages',
    'divine travel nest safaris',
    'Nairobi safari company',
    '2026 safari packages',
  ],
  authors: [{ name: 'Divine Travel Nest Safaris', url: APP_URL }],
  creator:   'Divine Travel Nest Safaris',
  publisher: 'Divine Travel Nest Safaris Ltd',
  openGraph: {
    type:     'website',
    locale:   'en_US',
    url:      APP_URL,
    siteName: 'Divine Travel Nest Safaris',
    title:    'Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safaris',
    description:
      'Expert-guided, tailor-made East Africa safaris. Kenya, Tanzania & Uganda — Budget to Luxury.',
    images: [
      {
        url:    `${APP_URL}/images/og-default.jpg`,
        width:  1200,
        height: 630,
        alt:    'Divine Travel Nest Safaris — East Africa Safari Experts',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safaris',
    description: 'Expert-guided safaris in Kenya, Tanzania & Uganda. Budget to luxury.',
    images:      [`${APP_URL}/images/og-default.jpg`],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:  true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  alternates: { canonical: APP_URL },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  category: 'travel',
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor:    '#2a3a2a',
  width:         'device-width',
  initialScale:  1,
  maximumScale:  5,
  colorScheme:   'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${cormorant.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {/* Pexels CDN used for hero/section images — early connection cuts LCP */}
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background:  '#faf6ec',
                color:       '#1f1d18',
                border:      '1px solid rgba(31,29,24,0.12)',
                fontFamily:  'var(--font-geist), system-ui, sans-serif',
                fontSize:    '14px',
                borderRadius:'0.375rem',
              },
              success: { iconTheme: { primary: '#2a3a2a', secondary: '#faf6ec' } },
              error:   { iconTheme: { primary: '#b91c1c', secondary: '#faf6ec' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
