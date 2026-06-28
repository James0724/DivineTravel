import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import PageHero from "@/components/ui/PageHero";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { buildAlternates } from "@/lib/seo/hreflang";
import { PLANNING_TOOLS } from "@/lib/data/sitemapDirectory";

const TITLE = "Safari Planning Tools";
const PATH = "/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${TITLE} | Divine Travel Nest Safaris`,
    alternates: buildAlternates(locale, PATH),
  };
}

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: TITLE, href: PATH }]} />

      <PageHero
        image="https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Planning a safari trip"
        minHeight="min-h-[40vh]"
        imageOpacity={0.32}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: TITLE }]}
        eyebrow="Plan ahead"
        title={TITLE}
        description="Tools to help you budget, pack and prepare for your East Africa safari."
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANNING_TOOLS.map((tool) => (
              <RevealItem key={tool.href}>
                <Link
                  href={tool.href}
                  className="block rounded-sm bg-bone-paper px-6 py-5 text-sm text-bone-ink hover:text-bone-clay hover:underline transition-colors"
                  style={{ border: "1px solid rgba(31,29,24,0.14)" }}
                >
                  {tool.title}
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </>
  );
}
