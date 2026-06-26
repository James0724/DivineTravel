"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import SiteLink from "@/components/ui/SiteLink";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import { AnimatedHeading } from "../ui/Heading";
import Reveal from "../ui/Reveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Spring for the ✦ icon bounce
const SPRING = { type: "spring", stiffness: 420, damping: 18 } as const;

export default function TailorMade() {
  const t = useTranslations("home.tailorMade");
  const pointsData = t.raw("points") as { title: string; desc: string }[];
  const points = pointsData.map((p) => ({ ic: "✦", ...p }));

  const leftRef = useRef<HTMLDivElement>(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-80px" });

  const photoRef = useRef<HTMLDivElement>(null);
  const photoInView = useInView(photoRef, { once: true, margin: "-80px" });

  return (
    <section className="py-[140px] bg-bone-bg">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          {/* ── Left content ─────────────────────────────────────────── */}
          <div ref={leftRef}>
            <header className="mb-8">
              <div className="mb-6">
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
                />
              </div>
              <Reveal variant="fadeUp">
                <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                  {t("description")}
                </p>
              </Reveal>
            </header>

            {/* Checklist — each item stagger-slides from left */}
            <ul
              className="border-t"
              style={{ borderColor: "rgba(23,22,18,0.14)" }}
            >
              {points.map((p, i) => (
                <motion.li
                  key={p.title}
                  className="py-4 border-b grid items-center gap-3.5 group"
                  style={{
                    gridTemplateColumns: "32px 1fr",
                    borderColor: "rgba(23,22,18,0.14)",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={leftInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.55,
                    delay: 0.3 + i * 0.08,
                    ease: EASE,
                  }}
                >
                  {/* ✦ icon — bounces + rotates on hover */}
                  <motion.span
                    className="font-serif italic text-[18px] text-bone-clay select-none"
                    whileHover={{ scale: 1.4, rotate: 45 }}
                    transition={SPRING}
                  >
                    {p.ic}
                  </motion.span>
                  <div>
                    <strong className="font-medium text-sm text-bone-ink group-hover:text-bone-clay transition-colors duration-200">
                      {p.title}
                    </strong>
                    <span className="text-[13px] text-bone-muted ml-2">
                      {p.desc}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Reveal variant="fadeUp">
              <SiteLink
                href="/plan-my-safari"
                variant="solid"
                size="md"
                className="mt-7 sm:mt-8 self-start"
              >
                {t("cta")}
              </SiteLink>
            </Reveal>
          </div>

          {/* ── Photo — clip-path reveal from bottom ─────────────────── */}
          <div
            ref={photoRef}
            className="relative overflow-hidden"
            style={{ aspectRatio: "5/6" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={photoInView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            >
              <Image
                src="https://images.pexels.com/photos/33498304/pexels-photo-33498304.jpeg?auto=compress&cs=tinysrgb&w=900&q=80"
                alt="Wildebeest and zebras grazing in the Masai Mara, Kenya"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            {/* Clay bottom accent */}
            <motion.div
              className="absolute bottom-0 right-0 h-1"
              style={{
                background: "#9d4519",
                width: "48px",
                transformOrigin: "100% 0",
              }}
              initial={{ scaleX: 0 }}
              animate={photoInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
