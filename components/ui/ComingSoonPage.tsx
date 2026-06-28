import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Compass } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import PageHero, { type HeroBreadcrumb } from "@/components/ui/PageHero";

interface ComingSoonPageProps {
  title: string;
  eyebrow?: string;
  breadcrumbs: HeroBreadcrumb[];
  image?: string;
}

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80";

export default async function ComingSoonPage({
  title,
  eyebrow,
  breadcrumbs,
  image = DEFAULT_IMAGE,
}: ComingSoonPageProps) {
  const t = await getTranslations("common");

  return (
    <>
      <PageHero
        image={image}
        imageAlt={title}
        minHeight="min-h-[40vh]"
        imageOpacity={0.32}
        breadcrumbs={breadcrumbs}
        eyebrow={eyebrow ?? t("comingSoon.eyebrow")}
        title={title}
        description={t("comingSoon.description")}
      />

      <div className="bg-bone-bg py-20 lg:py-28">
        <div className="container-site">
          <Reveal variant="fadeUp">
            <div
              className="mx-auto max-w-lg rounded-sm bg-bone-paper px-8 py-12 text-center"
              style={{ border: "1px solid rgba(31,29,24,0.14)" }}
            >
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-bone-clay/10 text-bone-clay">
                <Compass size={22} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h2 className="font-serif text-2xl font-normal text-bone-ink mb-3">
                {t("comingSoon.heading")}
              </h2>
              <p className="text-sm leading-relaxed text-bone-muted mb-7">
                {t("comingSoon.body")}
              </p>
              <Link
                href="/contact"
                className="text-bone-clay hover:underline text-sm font-medium"
              >
                {t("comingSoon.cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
