import type { NextConfig } from "next";

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

export default nextConfig;
