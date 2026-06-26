import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },

      {
        protocol: "https",
        hostname: "divinetravelnestsafaris.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.divinetravelnestsafaris.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 604800, // cache optimised images for 7 days
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "date-fns",
    ],
    staleTimes: {
      dynamic: 60,
      static: 180,
    },
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    // Routes inherited from the pre-Next.js WordPress site that Google still
    // has indexed. They 404 on the current site, which damages crawl trust
    // and is why subpages stop showing up as sitelinks. Mapped to their
    // closest equivalent on the new (locale-prefixed) site. Source list is
    // best-effort from what's still surfacing in Google's index — extend this
    // as more legacy URLs turn up in Search Console's Pages report.
    const legacyWordpressRedirects: Array<[string, string]> = [
      ["/our-team", "/en/about"],
      ["/kenya-safari-packages", "/en/safaris/kenya"],
      ["/kenya-tanzania-safaris", "/en/safaris/cross-country-safaris"],
      ["/masai-mara-and-serengeti-safaris", "/en/safaris/cross-country-safaris"],
      ["/kenya-safari-lodges-camps", "/en/accommodations"],
      ["/kenya-wildlife-parks", "/en/destinations/kenya"],
      ["/honeymoon-safaris", "/en/safari-types/honeymoon"],
      ["/family-friendly-safaris", "/en/safari-types/family"],
      [
        "/what-to-expect-on-a-3-days-masai-mara-safari",
        "/en/journal/what-to-expect-on-a-3-days-masai-mara-safari",
      ],
      ["/is-7-days-too-long-for-a-safari", "/en/journal/is-7-days-too-long-for-safari"],
      ["/great-wildebeest-migration-safari", "/en/journal/great-wildebeest-migration-safari"],
      ["/big-five-safari-in-kenya", "/en/journal/big-five-safari-in-kenya"],
      [
        "/how-many-days-is-enough-for-a-kenya-safari",
        "/en/journal/how-many-days-is-enough-for-a-kenya-safari",
      ],
      [
        "/best-time-to-visit-east-africa-for-safari",
        "/en/journal/best-time-to-visit-east-africa-for-safari",
      ],
      [
        "/family-friendly-safari-packages-in-kenya",
        "/en/journal/family-friendly-safari-packages-in-kenya",
      ],
      ["/masai-mara-vs-serengeti-vs-amboseli", "/en/journal/masai-mara-vs-serengeti"],
    ];

    return [
      ...legacyWordpressRedirects.flatMap(([source, destination]) => [
        { source, destination, permanent: true },
        { source: `${source}/`, destination, permanent: true },
      ]),
      // WordPress tag archives have no equivalent — send to the journal index
      { source: "/tag/:tag*", destination: "/en/journal", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Auth & mutation endpoints — never cache
      {
        source: "/api/auth/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/upload",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/contact",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/bookings",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/media/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
