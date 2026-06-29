import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Nunito,
  Cinzel,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getLocale } from "next-intl/server";
import { Providers } from "./providers";
import {
  OrganizationSchema,
  WebSiteSchema,
  SiteNavigationSchema,
} from "@/components/seo/StructuredData";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
  display: "swap",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default:
      "Divine Travel Nest Safaris — Kenya, Tanzania & Uganda Safari Tour Packages 2026/2027",
    template: "%s | Divine Travel Nest Safaris",
  },
  description:
    "Expert-guided Kenya, Tanzania, Uganda and Rwanda safari packages 2026/2027. Masai Mara game drives, Serengeti Great Migration tours, Bwindi gorilla trekking — tailor-made and budget to luxury. Book with Divine Travel Nest Safaris.",
  keywords: [
    "Kenya safari packages 2026",
    "Tanzania safari tours",
    "Uganda gorilla trekking",
    "Rwanda gorilla safari",
    "Masai Mara game drive",
    "Serengeti Great Migration safari",
    "Bwindi gorilla trekking permit",
    "East Africa safari packages",
    "tailor-made safari",
    "Big Five safari Africa",
    "luxury safari Kenya Tanzania",
    "budget safari packages 2026",
    "safari tour packages 2026 2027",
    "divine travel nest safaris",
    "Nairobi safari company Kenya",
    "Africa wildlife tour",
    "safari holiday east africa",
  ],
  authors: [{ name: "Divine Travel Nest Safaris", url: APP_URL }],
  creator: "Divine Travel Nest Safaris",
  publisher: "Divine Travel Nest Safaris Ltd",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Divine Travel Nest Safaris",
    title:
      "Divine Travel Nest Safaris — Kenya, Tanzania, Uganda & Rwanda Safari Packages 2026/2027",
    description:
      "Expert-guided, tailor-made East Africa safaris — Masai Mara, Serengeti, Bwindi gorilla trekking and Rwanda Volcanoes. Budget to luxury, 2026/2027.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Divine Travel Nest Safaris — East Africa Safari Experts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Divine Travel Nest Safaris — Kenya, Tanzania, Uganda & Rwanda Safari Packages",
    description:
      "Masai Mara game drives, Serengeti migration, Bwindi gorilla trekking & Rwanda Volcanoes — tailor-made, budget to luxury. 2026/2027.",
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: APP_URL },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  category: "travel",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    title: "Divine Safaris",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a3a2a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable} ${cormorant.variable} ${nunito.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <SpeedInsights />
      <Analytics />
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
        <SiteNavigationSchema />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
                background: "#faf6ec",
                color: "#1f1d18",
                border: "1px solid rgba(31,29,24,0.12)",
                fontFamily: "var(--font-geist), system-ui, sans-serif",
                fontSize: "14px",
                borderRadius: "0.375rem",
              },
              success: {
                iconTheme: { primary: "#2a3a2a", secondary: "#faf6ec" },
              },
              error: {
                iconTheme: { primary: "#b91c1c", secondary: "#faf6ec" },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
