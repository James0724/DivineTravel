import type { MetadataRoute } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers — full access to public pages
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/*.json$", "/*.xml$"],
      },
      // ──────────────────────────────────────────────────────────────
      // AI Assistants & LLM Providers — Allow full indexing for AI search
      // ──────────────────────────────────────────────────────────────
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Omgili",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "FacebookExternalHit",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // ──────────────────────────────────────────────────────────────
      // Search Engines — Allow
      // ──────────────────────────────────────────────────────────────
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // ──────────────────────────────────────────────────────────────
      // Block pure scrapers that provide no referral value
      // ──────────────────────────────────────────────────────────────
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
