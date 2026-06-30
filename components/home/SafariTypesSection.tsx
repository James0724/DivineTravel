"use client";

import { useTranslations } from "next-intl";
import { getSafariType } from "@/lib/data/safariTypes";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import Reveal from "@/components/ui/Reveal";
import SiteLink from "@/components/ui/SiteLink";
import SafariTypeCard from "@/components/safaris/SafariTypeCard";
import { AnimatedHeading } from "../ui/Heading";

// A curated spread across the activity and traveller groups for variety on
// the homepage — the full list lives at /safari-types.
const HOMEPAGE_SAFARI_TYPE_SLUGS = [
  "wildlife-game-viewing",
  "walking",
  "photographic",
  "cultural",
  "adventure",
  "family",
];

export default function SafariTypesSection() {
  const t = useTranslations("home.safariTypes");
  const exploreLabel = t("exploreLabel");

  const types = HOMEPAGE_SAFARI_TYPE_SLUGS
    .map((slug) => getSafariType(slug))
    .filter((type): type is NonNullable<typeof type> => Boolean(type));

  return (
    <section className="py-20 sm:py-[120px] bg-bone-bg border-b" style={{ borderColor: "rgba(23,22,18,0.12)" }}>
      <div className="container-site">
        {/* Header */}
        <header className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />
                {t("eyebrow")}
              </div>
            </Reveal>

            {/* Heading — character pull-up */}
            <AnimatedHeading
              as="h2"
              textBefore={t("headingBefore")}
              highlightedText={t("headingHighlight")}
              textAfter={t("headingAfter")}
            />
          </div>
          <Reveal variant="fadeUp">
            <div className="flex flex-col justify-between gap-4">
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("description")}
              </p>
              <SiteLink
                href="/safari-types"
                variant="ghost-mono"
                arrow
                className="self-start"
              >
                {t("viewAllTypes")}
              </SiteLink>
            </div>
          </Reveal>
        </header>

        {/* Grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {types.map((type, i) => (
            <RevealItem key={type.slug}>
              <SafariTypeCard type={type} exploreLabel={exploreLabel} priority={i < 3} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
