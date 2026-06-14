"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "When is the best time to visit Kenya for the Great Migration?",
    a: "The most famous part of the Great Migration — the Mara River crossings — occurs from July to October when the herds are in the Masai Mara. However, the migration is a year-round event. January–February offers calving season in the southern Serengeti, while June–July features the dramatic Grumeti River crossings in Tanzania.",
  },
  {
    q: "How far in advance should I book a gorilla trekking permit?",
    a: "Gorilla trekking permits in Uganda (Bwindi Impenetrable Forest) and Rwanda (Volcanoes NP) sell out months in advance, especially during peak season (July–September and December–January). We recommend booking at least 6 months ahead, and up to 12 months for peak season travel. We handle all permit applications on your behalf.",
  },
  {
    q: "What is included in a typical safari package?",
    a: (
      <div>
        <p className="mb-3">
          A standard Divine Travel Nest Safaris package includes:
        </p>
        <table className="w-full border-collapse text-[14px]">
          <tbody>
            {[
              ["Park fees & conservation levies", "✓"],
              ["All game drives & activities listed", "✓"],
              ["Accommodation (lodge or tented camp)", "✓"],
              ["Full board (breakfast, lunch, dinner)", "✓"],
              ["Airport & inter-park transfers", "✓"],
              ["English-speaking guide", "✓"],
              ["International flights", "✗"],
              ["Travel insurance", "✗"],
              ["Personal gratuities", "✗"],
            ].map(([item, inc]) => (
              <tr
                key={item as string}
                style={{ borderBottom: "1px solid rgba(23,22,18,0.1)" }}
              >
                <td className="py-2.5 px-3.5">{item}</td>
                <td
                  className="py-2.5 px-3.5 text-right font-serif italic"
                  style={{
                    color: (inc as string) === "✓" ? "#9d4519" : "#7a7264",
                  }}
                >
                  {inc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    q: "Can you customise a safari for families with young children?",
    a: "Absolutely — family safaris are one of our specialties. We select family-friendly lodges with dedicated children's programs, experienced child-friendly guides, and age-appropriate activities. We also plan activity schedules around younger children's energy levels. Minimum age restrictions apply for certain activities (gorilla trekking requires guests to be 15+).",
  },
  {
    q: "What is the difference between a budget, mid-range and luxury safari?",
    a: "The main difference lies in accommodation and vehicle quality. Budget safaris use shared minibus vehicles and tented camps or basic lodges. Mid-range safaris offer private vehicles and comfortable lodge rooms with en-suite facilities. Luxury safaris feature exclusive-use vehicles, private guides, and world-class tented camps or lodges with exceptional service. All tiers include the same wildlife access and expert guiding.",
  },
  {
    q: "Do I need a visa and vaccinations for Kenya and Tanzania?",
    a: "Most nationalities require a visa for Kenya and Tanzania, both available online via e-visa portals. For health requirements, Yellow Fever vaccination is mandatory if arriving from a yellow fever-endemic country. We strongly recommend consulting your travel health clinic at least 6–8 weeks before departure for current vaccination advice including malaria prophylaxis.",
  },
];

const ease = [0.4, 0, 0.2, 1] as const;

export default function FAQSection() {
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
              Kenya, Tanzania, Uganda &amp; Rwanda Safari FAQ
            </div>
            <h2
              className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
              style={{ fontSize: "clamp(32px, 5vw, 72px)" }}
            >
              East Africa safari <em className="italic text-bone-clay">FAQ</em>.
            </h2>
            <p className="text-[14px] text-bone-muted mt-[18px] max-w-[40ch] lg:max-w-[32ch] leading-[1.6]">
              Common questions about Kenya, Tanzania, Uganda, Rwanda and gorilla trekking
              safaris. Can't find your answer? Call or email us any time.
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
