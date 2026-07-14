"use client";

import { Link } from "@/i18n/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { BlurReveal } from "@/components/ui/TextReveal";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import { AnimatedHeading } from "../ui/Heading";
import Reveal from "../ui/Reveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONTACT_META = [
  { href: "tel:+254722595916", value: "+254 722-595-916", isEmail: false },
  {
    href: "mailto:info@divinetravelnestsafaris.com",
    value: "info@divinetravelnestsafaris.com",
    isEmail: true,
  },
];

export default function IntroSection() {
  const t = useTranslations("home.intro");
  const contactLabels = t.raw("contacts") as { label: string }[];
  const contacts = CONTACT_META.map((c, i) => ({
    ...c,
    label: contactLabels[i].label,
  }));
  const leftRef = useRef<HTMLDivElement>(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-80px" });

  return (
    <section className="pt-6 sm:pt-16 lg:pt-[120px] bg-bone-bg">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5 sm:gap-10 lg:gap-24 items-start">
          {/* ── Left column ───────────────────────────────────────────── */}
          <div ref={leftRef}>
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

            {/* Contact blocks — staggered slide-up (desktop only; kept off the mobile fold) */}
            <div className=" lg:grid sm:grid-cols-1 2xl:grid-cols-2 gap-4 mt-8">
              {contacts.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={leftInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.12,
                    ease: EASE,
                  }}
                >
                  <Link
                    href={c.href}
                    className="flex flex-col gap-1.5 p-4 border bg-bone-paper hover:border-bone-clay hover:bg-white transition-all duration-200"
                    style={{ borderColor: "rgba(23,22,18,0.14)" }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                      {c.label}
                    </span>
                    <span
                      className={`font-serif italic text-bone-forest ${
                        c.isEmail
                          ? "text-[14px] sm:text-[17px] break-all"
                          : "text-[17px] sm:text-[19px]"
                      }`}
                    >
                      {c.value}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right column (desktop only; kept off the mobile fold entirely) ── */}
          <BlurReveal delay={0.15} className="hidden lg:block">
            <p
              className="text-[19px] leading-[1.6] text-bone-ink mb-5"
              style={{ position: "relative" }}
            >
              {/* Drop cap W — springs in with a bounce */}
              <motion.span
                className="font-serif float-left text-bone-clay leading-[0.85] pr-2.5 pt-1.5"
                style={{ fontSize: "clamp(42px, 8vw, 62px)" }}
                initial={{ opacity: 0, scale: 0.55, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 0.3,
                  ease: [0.34, 1.56, 0.64, 1], // spring overshoot
                }}
              >
                W
              </motion.span>
              {t("paragraph1Rest")}
            </p>

            {/* Mission line — compact, slides from left with left-border accent */}
            <motion.p
              className="pl-4 border-l-2 font-serif italic text-sm leading-[1.4] text-bone-forest"
              style={{ borderLeftColor: "#9d4519" }}
              initial={{ opacity: 0, x: -22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.45, ease: EASE }}
            >
              {t("missionText")}
            </motion.p>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
