import type { MetadataRoute } from "next";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import SafariModel from "@/lib/db/models/Safari";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    // Core pages
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${APP_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_URL}/plan-my-safari`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // Safari pages
    {
      url: `${APP_URL}/safaris`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${APP_URL}/safaris/kenya`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/tanzania`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/uganda`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${APP_URL}/safaris/cross-country-safaris`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.82,
    },
    // Destination pages
    {
      url: `${APP_URL}/destinations/kenya`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${APP_URL}/destinations/tanzania`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${APP_URL}/destinations/uganda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    // Blog
    {
      url: `${APP_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Legal/Other pages
    {
      url: `${APP_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    await connectDB();

    // Fetch dynamic blog posts
    const posts = await PostModel.find({ published: true })
      .select("slug updatedAt")
      .lean();
    const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${APP_URL}/blog/${p.slug}`,
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

    return [...staticRoutes, ...blogRoutes, ...safariRoutes];
  } catch {
    return staticRoutes;
  }
}
