import type { MetadataRoute } from "next";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import SafariModel from "@/lib/db/models/Safari";
import { SAFARI_TYPES } from "@/lib/data/safariTypes";
import { ACCOMMODATION_TYPES } from "@/lib/data/accommodationTypes";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://divinetravelnestsafaris.com";

// Static pages use a fixed date so Google sees a stable lastModified signal.
// Update this when you make a meaningful content change to these pages.
const STATIC_LAST_MODIFIED = new Date("2026-06-07");

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

// Expands a single route into one sitemap entry per locale, each carrying
// an `alternates.languages` map of every locale variant (incl. x-default) —
// this is the sitemap-level equivalent of the per-page hreflang tags built
// by lib/seo/hreflang.ts's buildAlternates().
function localizedEntries(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFrequency,
  priority: number
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${APP_URL}${getPathname({ locale, href: path })}`;
  }
  languages["x-default"] = `${APP_URL}${getPathname({
    locale: routing.defaultLocale,
    href: path,
  })}`;

  return routing.locales.map((locale) => ({
    url: `${APP_URL}${getPathname({ locale, href: path })}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: Array<[string, ChangeFrequency, number]> = [
    // Core pages — high priority, shown as sitelinks
    ["/", "weekly", 1.0],
    ["/safaris", "daily", 0.95],
    ["/plan-my-safari", "monthly", 0.9],
    ["/contact", "monthly", 0.9],
    ["/about", "monthly", 0.85],
    ["/journal", "daily", 0.85],
    ["/safari-types", "monthly", 0.8],
    ["/accommodations", "weekly", 0.8],
    ["/bookings", "monthly", 0.7],
    ["/guidelines", "yearly", 0.4],
    // Country safari pages
    ["/safaris/kenya", "weekly", 0.88],
    ["/safaris/tanzania", "weekly", 0.88],
    ["/safaris/uganda", "weekly", 0.88],
    ["/safaris/rwanda", "weekly", 0.88],
    ["/safaris/cross-country-safaris", "weekly", 0.82],
    // Destination pages
    ["/destinations/kenya", "monthly", 0.75],
    ["/destinations/tanzania", "monthly", 0.75],
    ["/destinations/uganda", "monthly", 0.75],
    ["/destinations/rwanda", "monthly", 0.75],
    // Legal
    ["/terms", "yearly", 0.3],
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPages.flatMap(
    ([path, changeFrequency, priority]) =>
      localizedEntries(path, STATIC_LAST_MODIFIED, changeFrequency, priority)
  );

  const safariTypeRoutes: MetadataRoute.Sitemap = SAFARI_TYPES.flatMap((t) =>
    localizedEntries(`/safari-types/${t.slug}`, STATIC_LAST_MODIFIED, "monthly", 0.65)
  );

  const accommodationTypeRoutes: MetadataRoute.Sitemap = ACCOMMODATION_TYPES.flatMap(
    (t) =>
      localizedEntries(
        `/accommodations/${t.slug}`,
        STATIC_LAST_MODIFIED,
        "monthly",
        0.65
      )
  );

  try {
    await connectDB();

    // Fetch dynamic blog posts
    const posts = await PostModel.find({ published: true })
      .select("slug updatedAt")
      .lean();
    const journalRoutes: MetadataRoute.Sitemap = posts.flatMap((p) =>
      localizedEntries(
        `/journal/${p.slug}`,
        new Date(p.updatedAt),
        "monthly",
        0.7
      )
    );

    // Fetch dynamic safari detail pages
    const safaris = await SafariModel.find({ active: true })
      .select("slug updatedAt")
      .lean();
    const safariRoutes: MetadataRoute.Sitemap = safaris.flatMap((s) =>
      localizedEntries(
        `/safaris/${s.slug}`,
        new Date(s.updatedAt),
        "monthly",
        0.75
      )
    );

    return [
      ...staticRoutes,
      ...safariTypeRoutes,
      ...accommodationTypeRoutes,
      ...journalRoutes,
      ...safariRoutes,
    ];
  } catch {
    return [...staticRoutes, ...safariTypeRoutes, ...accommodationTypeRoutes];
  }
}
