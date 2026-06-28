import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { SITEMAP_CATEGORIES } from "@/lib/data/sitemapDirectory";

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

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t("sitemapPage.breadcrumbHome"), href: "/" },
          { name: t("sitemapPage.breadcrumbCurrent"), href: PATH },
        ]}
      />

      <PageHero
        image="https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt={t("sitemapPage.title")}
        minHeight="min-h-[36vh]"
        imageOpacity={0.3}
        breadcrumbs={[
          { label: t("sitemapPage.breadcrumbHome"), href: "/" },
          { label: t("sitemapPage.breadcrumbCurrent") },
        ]}
        eyebrow={t("sitemapPage.eyebrow")}
        title={t("sitemapPage.title")}
        description={t("sitemapPage.description")}
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {SITEMAP_CATEGORIES.map((category) => (
              <RevealItem key={category.id}>
                <div>
                  <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-bone-clay mb-4 pb-3 border-b border-bone-ink/10">
                    {category.heading}
                    <span className="ml-2 text-bone-muted">
                      ({category.links.length})
                    </span>
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {category.links.map((link) => (
                      <li key={link.href}>
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
