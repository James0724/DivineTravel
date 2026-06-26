"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import { AnimatedHeading } from "../ui/Heading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CELL_NUMS = ["i.", "ii.", "iii.", "iv.", "v.", "vi."];

type Cell = { num: string; title: string; body: string };

/* ── Individual cell — tracks its own hover state ───────────────────────── */
function FeatureCell({ c }: { c: Cell }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col gap-4 px-5 sm:px-7 lg:px-9 pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-12 lg:pb-14 h-full cursor-default"
      style={{
        backgroundColor: hovered ? "#f4efe2" : "#ece6da",
        transition: "background-color 0.22s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left clay accent bar — grows upward on hover */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: "#9d4519", transformOrigin: "bottom" }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.38, ease: EASE }}
      />

      {/* Number — nudges right on hover */}
      <motion.span
        className="font-serif italic text-[18px] text-bone-clay"
        animate={{ x: hovered ? 8 : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {c.num}
      </motion.span>

      <h3
        className="font-serif font-normal text-[22px] sm:text-[26px] leading-[1.1] tracking-[-0.01em] text-bone-ink whitespace-pre-line transition-colors duration-200"
        style={{ color: hovered ? "#1a2e1a" : undefined }}
      >
        <em>{c.title}</em>
      </h3>

      <p className="text-[14px] leading-[1.65] text-bone-muted">{c.body}</p>

      {/* Bottom clay rule — draws left-to-right on hover */}
      <motion.div
        className="mt-auto h-px"
        style={{ background: "#9d4519", transformOrigin: "0 0" }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHY CHOOSE US
═══════════════════════════════════════════════════════════════════════════ */
export default function WhyChooseUs() {
  const t = useTranslations("home.whyChooseUs");
  const cellData = t.raw("cells") as { titleLine1: string; titleLine2: string; body: string }[];
  const cells = CELL_NUMS.map((num, i) => ({
    num,
    title: `${cellData[i].titleLine1}\n${cellData[i].titleLine2}`,
    body: cellData[i].body,
  }));

  return (
    <section className="py-16 sm:py-24 lg:py-[140px] bg-bone-bg">
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
            <AnimatedHeading
              as="h2"
              textBefore={t("headingBefore")}
              highlightedText={t("headingHighlight")}
            />
          </div>
          <Reveal>
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              {t("description")}
            </p>
          </Reveal>
        </header>

        {/* Grid */}
        <Stagger
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-b"
          style={{
            gap: "1px",
            background: "rgba(23,22,18,0.14)",
            borderColor: "rgba(23,22,18,0.14)",
          }}
        >
          {cells.map((c) => (
            <RevealItem key={c.num}>
              <FeatureCell c={c} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
