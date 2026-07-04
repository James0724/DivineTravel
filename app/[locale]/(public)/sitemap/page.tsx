import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import TitleHero from "@/components/ui/TitleHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import {
  SITEMAP_CATEGORIES,
  type SitemapCategory,
  type SitemapLink,
} from "@/lib/data/sitemapDirectory";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import SafariModel, { type ISafari } from "@/lib/db/models/Safari";
import type { IPost } from "@/lib/db/models/Post";

export const dynamic = "force-dynamic";

const PATH = "/sitemap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("sitemapPage.title")} | Divine Travel Nest Safaris`,
    description: t("sitemapPage.description"),
    alternates: buildAlternates(locale, PATH),
  };
}

export default async function SitemapPage() {
  const t = await getTranslations("common");

  // Fetch live data from DB; fall back to empty arrays on error.
  let safariLinks: SitemapLink[] = [];
  let articleLinks: SitemapLink[] = [];

  try {
    await connectDB();

    const [safaris, posts] = await Promise.all([
      SafariModel.find({ active: true }).select("name slug").lean<Pick<ISafari, "name" | "slug">[]>(),
      PostModel.find({ published: true }).select("title slug").lean<Pick<IPost, "title" | "slug">[]>(),
    ]);

    safariLinks = safaris.map((s) => ({
      title: s.name,
      href: `/safaris/${s.slug}`,
    }));

    articleLinks = posts.map((p) => ({
      title: p.title,
      href: `/african-travel-blog/${p.slug}`,
    }));
  } catch {
    // DB unavailable at build time — categories render with 0 items.
  }

  // Merge dynamic data into the static category list.
  const categories: SitemapCategory[] = SITEMAP_CATEGORIES.map((cat) => {
    if (cat.id === "tours") return { ...cat, links: safariLinks };
    if (cat.id === "articles") return { ...cat, links: articleLinks };
    return cat;
  });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("sitemapPage.breadcrumbHome"), href: "/" },
          { name: t("sitemapPage.breadcrumbCurrent"), href: PATH },
        ]}
      />
      <TitleHero
        eyebrow={t("sitemapPage.eyebrow")}
        title={t("sitemapPage.title")}
        description={t("sitemapPage.description")}
        backgroundImage="/patterns/sunset.svg"
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Stagger className="flex flex-col gap-12 lg:gap-14">
            {categories.map((category) => (
              <RevealItem key={category.id}>
                <div>
                  <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-clay mb-4 pb-3 border-b border-bone-ink/10">
                    {category.heading}
                    <span className="ml-2 text-bone-muted">
                      ({category.links.length})
                    </span>
                  </h2>
                  <ul
                    className="[column-gap:2.5rem]"
                    style={{ columnWidth: "220px" }}
                  >
                    {category.links.map((link) => (
                      <li
                        key={link.href}
                        className="break-inside-avoid-column mb-2.5"
                      >
                        <Link
                          href={link.href}
                          className="text-[13.5px] text-bone-muted hover:text-bone-clay hover:underline transition-colors leading-relaxed"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </>
  );
}
