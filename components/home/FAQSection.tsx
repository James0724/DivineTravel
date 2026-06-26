"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ease = [0.4, 0, 0.2, 1] as const;

type FaqItem = { q: string; a: string };
type TableRow = { item: string; included: boolean };

export default function FAQSection() {
  const t = useTranslations("home.faqSection");
  const items = t.raw("items") as FaqItem[];
  const tableIntro = t("tableIntro");
  const tableRows = t.raw("tableRows") as TableRow[];

  const faqs = items.map((faq, i) =>
    i === 2
      ? {
          q: faq.q,
          a: (
            <div>
              <p className="mb-3">{tableIntro}</p>
              <table className="w-full border-collapse text-[14px]">
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.item}
                      style={{ borderBottom: "1px solid rgba(23,22,18,0.1)" }}
                    >
                      <td className="py-2.5 px-3.5">{row.item}</td>
                      <td
                        className="py-2.5 px-3.5 text-right font-serif italic"
                        style={{
                          color: row.included ? "#9d4519" : "#7a7264",
                        }}
                      >
                        {row.included ? "✓" : "✗"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        }
      : faq
  );

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="py-16 sm:py-24 lg:py-[140px] bg-bone-paper border-y"
      style={{ borderColor: "rgba(23,22,18,0.14)" }}
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-24 items-start">
          {/* Left */}
          <div>
            <div className="eyebrow mb-4">
              <span className="dot" />
              {t("eyebrow")}
            </div>
            <h2
              className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
              style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
            >
              {t("headingMain")}
              <em className="italic text-bone-clay">{t("headingEm")}</em>.
            </h2>
            <p className="text-[14px] text-bone-muted mt-[18px] max-w-[40ch] lg:max-w-[32ch] leading-[1.6]">
              {t("description")}
            </p>
          </div>

          {/* Accordion */}
          <ul
            className="border-t"
            style={{ borderColor: "rgba(23,22,18,0.14)" }}
          >
            {faqs.map((faq, i) => (
              <li
                key={i}
                className="border-b"
                style={{ borderColor: "rgba(23,22,18,0.14)" }}
              >
                <button
                  className="w-full text-left py-5 sm:py-6 flex justify-between items-center font-serif text-[17px] sm:text-[20px] lg:text-[24px] tracking-[-0.01em] text-bone-ink gap-4"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    className="font-mono text-[18px] text-bone-clay flex-shrink-0"
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden text-[14px] sm:text-sm leading-[1.65] text-bone-muted"
                    >
                      <div className="pb-6">
                        {typeof faq.a === "string" ? <p>{faq.a}</p> : faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
