"use client";

import { motion } from "framer-motion";
import { LettersPullUp } from "@/components/ui/LettersPullUp";
import { cn } from "@/lib/utils";

interface TitleHeroProps {
  eyebrow: string;
  /** Plain leading portion of the title */
  title: string;
  /** Optional italicized accent word, rendered after `title` with a trailing period */
  accent?: string;
  description: string;
  /**
   * "light" (default) — bone-bg page-header treatment, unchanged.
   * "transparent" — no background/decoration, all text rendered white, for
   * layering over a photo (e.g. the homepage hero carousel).
   */
  variant?: "light" | "transparent";
  /** Optional decorative background image, layered above bg-bone-bg and below the fog/decorations (variant="light" only). */
  backgroundImage?: string;
}

const DUST = [
  { left: "15%", delay: 0, duration: 18 },
  { left: "25%", delay: 3, duration: 22 },
  { left: "35%", delay: 6, duration: 20 },
  { left: "45%", delay: 2, duration: 24 },
  { left: "55%", delay: 5, duration: 19 },
  { left: "65%", delay: 8, duration: 21 },
  { left: "75%", delay: 4, duration: 23 },
  { left: "85%", delay: 7, duration: 17 },
];

const INK_DROPS = [
  { left: "18%", delay: 0 },
  { left: "45%", delay: 3 },
  { left: "72%", delay: 6 },
  { left: "88%", delay: 2 },
];

const CORNER_POSITIONS = [
  "top-[30px] left-[30px]",
  "top-[30px] right-[30px]",
  "bottom-[30px] left-[30px]",
  "bottom-[30px] right-[30px]",
];

const TITLE_INITIAL_DELAY = 0.6;
const TITLE_CHAR_DELAY = 0.025;

export default function TitleHero({
  eyebrow,
  title,
  accent,
  description,
  variant = "light",
  backgroundImage,
}: TitleHeroProps) {
  const isTransparent = variant === "transparent";
  const titleText = accent ? `${title} ` : title;
  const accentDelay = TITLE_INITIAL_DELAY + titleText.length * TITLE_CHAR_DELAY;
  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        isTransparent
          ? "bg-transparent py-0"
          : "min-h-[38vh] bg-bone-bg py-8 sm:min-h-[50vh] sm:py-10",
      )}
    >
      {!isTransparent && (
        <>
          {backgroundImage && (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-no-repeat"
                style={{
                  backgroundImage: `url('${backgroundImage}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Center scrim — keeps title/eyebrow text readable over the pattern */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 70% at center, var(--bg) 0%, rgba(236,230,218,0.55) 45%, rgba(236,230,218,0) 75%)",
                }}
              />
              {/* Bottom fade — blends the pattern into the page background below */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(236,230,218,0) 60%, var(--bg) 100%)",
                }}
              />
            </>
          )}

          {/* Geometric background */}
          <div aria-hidden className="absolute inset-0">
            {[200, 320, 440].map((size, i) => (
              <motion.div
                key={size}
                className="absolute left-1/2 top-1/2 rounded-full border border-bone-ink"
                style={{ width: size, height: size, x: "-50%", y: "-50%" }}
                initial={{ scale: 1, opacity: 0.04 }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.08, 0.04] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
              />
            ))}
          </div>

          {/* Diamond ornaments */}
          {CORNER_POSITIONS.map((pos, i) => (
            <motion.div
              key={pos}
              aria-hidden
              className={`absolute h-[15px] w-[15px] border border-bone-ink/15 ${pos}`}
              initial={{ rotate: 45 }}
              animate={{ rotate: [45, 135, 45] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2.5,
              }}
            />
          ))}

          {/* Vertical dividers */}
          <motion.div
            aria-hidden
            className="absolute left-1/4 top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-bone-clay/25 to-transparent"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute right-1/4 top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-bone-clay/25 to-transparent"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />

          {/* Dust particles */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            {DUST.map((dust, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-px rounded-full bg-bone-clay/40 shadow-[0_0_5px_rgba(157,69,25,0.4)]"
                style={{ left: dust.left }}
                initial={{ bottom: "-5%", opacity: 0, x: 0 }}
                animate={{
                  bottom: ["-5%", "105%"],
                  opacity: [0, 0.5, 0.5, 0],
                  x: [0, 100],
                }}
                transition={{
                  duration: dust.duration,
                  delay: dust.delay,
                  repeat: Infinity,
                  ease: "linear",
                  times: [0, 0.1, 0.9, 1],
                }}
              />
            ))}
          </div>

          {/* Ink drops */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            {INK_DROPS.map((drop, i) => (
              <motion.div
                key={i}
                className="absolute w-[2px] bg-gradient-to-b from-transparent to-bone-clay/40"
                style={{ left: drop.left }}
                initial={{ top: "-10%", height: 0, opacity: 0 }}
                animate={{
                  top: ["-10%", "-10%", "110%"],
                  height: [0, 70, 70],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 8,
                  delay: drop.delay,
                  repeat: Infinity,
                  ease: "easeIn",
                  times: [0, 0.2, 1],
                }}
              />
            ))}
          </div>

          {/* Atmospheric fog */}
          <motion.div
            aria-hidden
            className="absolute inset-0 w-[200%] bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(236,230,218,0.92)_80%)]"
            initial={{ x: "0%" }}
            animate={{ x: ["0%", "-25%", "0%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 md:px-10">
        <motion.div
          aria-hidden
          className={cn(
            "mb-2 text-[18px] [filter:drop-shadow(0_0_15px_rgba(157,69,25,0.35))]",
            isTransparent ? "text-orange-200" : "text-bone-clay/70",
          )}
          initial={{ opacity: 0, y: -30, rotate: -180 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        >
          ❋
        </motion.div>

        <motion.p
          className={cn(
            "mb-2 font-display text-[10px] font-medium uppercase",
            isTransparent ? "text-orange-200" : "text-bone-muted",
          )}
          style={{ letterSpacing: "clamp(2px, 0.6vw, 5px)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >
          {eyebrow}
        </motion.p>

        <h1
          className={cn(
            "flex flex-wrap items-baseline justify-center font-display font-bold uppercase",
            isTransparent
              ? "text-[clamp(22px,5.5vw,38px)] tracking-[clamp(1px,1vw,5px)] xl:text-[clamp(34px,4.5vw,64px)] xl:tracking-[clamp(3px,1.2vw,10px)]"
              : "text-[clamp(26px,7vw,64px)] tracking-[clamp(1px,1.2vw,10px)]",
            isTransparent
              ? "text-white [text-shadow:0_0_40px_rgba(244,212,168,0.35),0_5px_20px_rgba(0,0,0,0.8)]"
              : "text-bone-ink [text-shadow:0_0_40px_rgba(157,69,25,0.35),0_5px_20px_rgba(23,22,18,0.25)]",
          )}
        >
          <LettersPullUp
            text={titleText}
            initialDelay={TITLE_INITIAL_DELAY}
            charDelay={TITLE_CHAR_DELAY}
          />
          {accent && (
            <>
              <LettersPullUp
                text={accent}
                initialDelay={accentDelay}
                charDelay={TITLE_CHAR_DELAY}
                charStyle={{
                  fontStyle: "italic",
                  color: isTransparent ? "var(--bg-deep)" : "var(--clay)",
                }}
              />
            </>
          )}
        </h1>

        <motion.div
          className={cn(
            "relative mx-auto my-3 h-[2px] bg-gradient-to-r from-transparent to-transparent",
            isTransparent ? "via-white/80" : "via-bone-clay/80",
          )}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 90, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 1.1 }}
        >
          <span
            className={cn(
              "absolute -left-5 -top-[7px] text-sm",
              isTransparent ? "text-white/80" : "text-bone-clay/80",
            )}
          >
            ◆
          </span>
          <span
            className={cn(
              "absolute -right-5 -top-[7px] text-sm",
              isTransparent ? "text-white/80" : "text-bone-clay/80",
            )}
          >
            ◆
          </span>
        </motion.div>

        <motion.p
          className={cn(
            "mx-auto max-w-[560px] font-serif italic leading-[1.6]",
            isTransparent ? "hidden text-white 2xl:block" : "text-bone-muted",
          )}
          style={{
            fontSize: "clamp(13px, 1.4vw, 15px)",
            letterSpacing: "0.5px",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 1.4 }}
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
