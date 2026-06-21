import type { MetadataRoute } from "next";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import SafariModel from "@/lib/db/models/Safari";
import { SAFARI_TYPES } from "@/lib/data/safariTypes";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

// Static pages use a fixed date so Google sees a stable lastModified signal.
// Update this when you make a meaningful content change to these pages.
const STATIC_LAST_MODIFIED = new Date("2026-06-07");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    // Core pages — high priority, shown as sitelinks
    {
      url: APP_URL,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${APP_URL}/safaris`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${APP_URL}/plan-my-safari`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${APP_URL}/contact`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${APP_URL}/about`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${APP_URL}/journal`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${APP_URL}/safari-types`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_URL}/bookings`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${APP_URL}/guidelines`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // Country safari pages
    {
      url: `${APP_URL}/safaris/kenya`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/tanzania`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/uganda`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/rwanda`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/cross-country-safaris`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    // Destination pages
    {
      url: `${APP_URL}/destinations/kenya`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${APP_URL}/destinations/tanzania`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${APP_URL}/destinations/uganda`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${APP_URL}/destinations/rwanda`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // Legal
    {
      url: `${APP_URL}/terms`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const safariTypeRoutes: MetadataRoute.Sitemap = SAFARI_TYPES.map((t) => ({
    url: `${APP_URL}/safari-types/${t.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  try {
    await connectDB();

    // Fetch dynamic blog posts
    const posts = await PostModel.find({ published: true })
      .select("slug updatedAt")
      .lean();
    const journalRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${APP_URL}/journal/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // Fetch dynamic safari detail pages
    const safaris = await SafariModel.find({ active: true })
      .select("slug updatedAt")
      .lean();
    const safariRoutes: MetadataRoute.Sitemap = safaris.map((s) => ({
      url: `${APP_URL}/safaris/${s.slug}`,
      lastModified: new Date(s.updatedAt),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

    return [
      ...staticRoutes,
      ...safariTypeRoutes,
      ...journalRoutes,
      ...safariRoutes,
    ];
  } catch {
    return [...staticRoutes, ...safariTypeRoutes];
  }
}
