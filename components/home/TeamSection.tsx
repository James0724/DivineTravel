"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { LettersPullUp } from "@/components/ui/LettersPullUp";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const team = [
  {
    name: "James Kahoro",
    role: "Founder & Lead Guide",
    bio: "15+ years guiding across East Africa. Specialist in Kenya and Tanzania wildlife circuits. Certified by KWS and Eco-Tourism Kenya.",
  },
  {
    name: "Grace Wanjiru",
    role: "Safari Consultant",
    bio: "Expert in tailor-made itinerary design. Grace has personally visited over 40 parks and reserves across Kenya, Tanzania and Uganda.",
  },
  {
    name: "David Ochieng",
    role: "Operations & Logistics",
    bio: "Ensures every transfer, lodge booking and activity runs seamlessly. David is the backbone of our on-the-ground operations.",
  },
  {
    name: "Amina Hassan",
    role: "Tanzania Specialist",
    bio: "Born in Arusha, Amina knows the Serengeti and Ngorongoro like her own back yard. She leads our Tanzanian safari design.",
  },
];

/* ── Team card with hover reveal effects ─────────────────────────────── */
function TeamCard({ member }: { member: (typeof team)[0] }) {
  const [hovered, setHovered] = useState(false);
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar block */}
      <div
        className="overflow-hidden mb-4 relative"
        style={{ aspectRatio: "3/4", background: "#2a3a2a" }}
      >
        {/* Background gradient shifts on hover */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "#2a3a2a" }}
          animate={{
            background: hovered
              ? "linear-gradient(135deg, #3a5a3a 0%, #1a2e1a 100%)"
              : "linear-gradient(135deg, #2a3a2a 0%, #1a2e1a 100%)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Initials — float upward on hover */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center font-serif italic text-bone-paper select-none"
          style={{
            fontSize: "clamp(48px, 6vw, 72px)",
            opacity: 0.45,
          }}
          animate={{
            y: hovered ? -6 : 0,
            opacity: hovered ? 0.65 : 0.45,
          }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {initials}
        </motion.span>

        {/* Bottom clay accent line — grows on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px]"
          style={{ background: "#9d4519", transformOrigin: "0 0" }}
          animate={{ scaleX: hovered ? 1 : 0, width: "100%" }}
          transition={{ duration: 0.35, ease: EASE }}
        />
      </div>

      {/* Name */}
      <div className="relative">
        <h3 className="font-serif italic text-[24px] leading-[1.1] text-bone-ink mb-0.5 transition-colors duration-200 group-hover:text-bone-clay">
          {member.name}
        </h3>
        {/* Underline that draws in on hover */}
        <motion.div
          className="h-px mt-0.5 mb-2"
          style={{ background: "#9d4519", transformOrigin: "0 0" }}
          animate={{ scaleX: hovered ? 1 : 0, width: "100%" }}
          transition={{ duration: 0.3, delay: 0.05, ease: EASE }}
        />
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-3">
        {member.role}
      </p>

      {/* Bio — fades in slightly more visible on hover */}
      <motion.p
        className="text-[13px] leading-[1.55] text-bone-muted"
        animate={{ opacity: hovered ? 1 : 0.8 }}
        transition={{ duration: 0.25 }}
      >
        {member.bio}
      </motion.p>
    </div>
  );
}

export default function TeamSection() {
  return (
    <section
      className="py-[140px] bg-bone-paper border-y"
      style={{ borderColor: "rgba(23,22,18,0.14)" }}
    >
      <div className="container-site">
        {/* Header */}
        <Reveal>
          <div className="section-hd">
            <div>
              <div className="eyebrow mb-4">
                <span className="dot" />
                The People Behind the Safari
              </div>
              <h2
                className="font-serif font-normal text-bone-ink leading-none tracking-[-0.02em] mt-4"
                style={{ fontSize: "clamp(40px, 5.4vw, 76px)" }}
              >
                <span className="flex flex-wrap items-baseline">
                  <LettersPullUp
                    text="Meet your "
                    initialDelay={0.3}
                    charDelay={0.05}
                  />
                  <LettersPullUp
                    text="guides"
                    initialDelay={0.8}
                    charDelay={0.05}
                    charStyle={{ fontStyle: "italic", color: "#9d4519" }}
                  />
                  <LettersPullUp text="." initialDelay={1.1} charDelay={0.05} />
                </span>
              </h2>
            </div>
            <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
              Every member of our team has spent years in the field. We
              don&apos;t just book safaris — we live them. You&apos;re in expert
              hands from first enquiry to final farewell.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <Stagger
          className="grid grid-cols-2 lg:grid-cols-4 gap-7"
          stagger={0.1}
        >
          {team.map((member) => (
            <RevealItem key={member.name} variant="scaleUp">
              <TeamCard member={member} />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
