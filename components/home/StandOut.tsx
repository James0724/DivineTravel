"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import Reveal from "../ui/Reveal";
import { AnimatedHeading } from "../ui/Heading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEATURE_ICS = ["i", "ii", "iii", "iv"];

export default function StandOut() {
  const t = useTranslations("home.standOut");
  const featureData = t.raw("features") as { title: string; body: string }[];
  const features = FEATURE_ICS.map((ic, i) => ({ ic, ...featureData[i] }));

  const photoRef = useRef<HTMLDivElement>(null);
  const photoInView = useInView(photoRef, { once: true, margin: "-80px" });

  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-80px" });

  return (
    <section
      className="py-[140px] bg-bone-paper border-y"
      style={{ borderColor: "rgba(23,22,18,0.14)" }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Photo — clip-path wipe reveal (curtain lifts upward) ──── */}
          <div
            ref={photoRef}
            className="relative overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={photoInView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
              transition={{ duration: 1.15, delay: 0.1, ease: EASE }}
            >
              <Image
                src="https://res.cloudinary.com/dk2j3k15k/image/upload/v1780809294/Gallarey/our_team_me0ns8.jpg"
                alt="Safari vehicle on a game drive through the African bush"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            {/* Clay accent corner */}
            <motion.div
              className="absolute bottom-0 left-0 w-12 h-1"
              style={{ background: "#9d4519", transformOrigin: "0 0" }}
              initial={{ scaleX: 0 }}
              animate={photoInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
            />
          </div>

          {/* ── Content ──────────────────────────────────────────────── */}
          <div ref={contentRef}>
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

            {/* Feature list — each row slides in from left, staggered */}
            <div className="flex flex-col">
              {features.map((f, i) => (
                <motion.div
                  key={f.ic}
                  className="py-6 border-t grid gap-[18px] items-start group"
                  style={{
                    gridTemplateColumns: "36px 1fr",
                    borderColor: "rgba(23,22,18,0.14)",
                    borderBottom:
                      i === features.length - 1
                        ? "1px solid rgba(23,22,18,0.14)"
                        : undefined,
                  }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={contentInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.35 + i * 0.1,
                    ease: EASE,
                  }}
                >
                  {/* Numbered circle — spins on hover */}
                  <motion.div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif italic text-[16px] flex-shrink-0"
                    style={{ background: "#9d4519" }}
                    whileHover={{ scale: 1.12, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {f.ic}
                  </motion.div>
                  <div>
                    <h4 className="font-serif font-medium text-[22px] text-bone-ink mb-1">
                      {f.title}
                    </h4>
                    <p className="text-[14px] leading-[1.55] text-bone-muted">
                      {f.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
