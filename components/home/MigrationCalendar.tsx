"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Reveal from "../ui/Reveal";
import { AnimatedHeading } from "../ui/Heading";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

interface UgandaData {
  pos: [number, number];
  park: string;
}

interface MonthData {
  title: string[];
  body: string;
  region: string;
  best: string;
  crowd: string;
  rain: string;
  cap: string;
  pos: [number, number];
  country: "tz" | "ke" | "ug";
  uganda: UgandaData;
}

const MONTH_META: Omit<MonthData, "title" | "body" | "region" | "best" | "crowd" | "rain">[] = [
  { cap: "JAN · NDUTU", pos: [205, 348], country: "tz", uganda: { pos: [78, 198], park: "Bwindi" } },
  { cap: "FEB · NDUTU", pos: [200, 340], country: "tz", uganda: { pos: [78, 198], park: "Bwindi" } },
  { cap: "MAR · MORU", pos: [198, 308], country: "tz", uganda: { pos: [82, 170], park: "Kibale" } },
  { cap: "APR · SERONERA", pos: [192, 292], country: "tz", uganda: { pos: [82, 170], park: "Kibale" } },
  { cap: "MAY · WESTERN CORRIDOR", pos: [165, 280], country: "tz", uganda: { pos: [76, 184], park: "Queen Elizabeth" } },
  { cap: "JUN · GRUMETI", pos: [155, 268], country: "tz", uganda: { pos: [76, 184], park: "Queen Elizabeth" } },
  { cap: "JUL · LAMAI", pos: [205, 218], country: "ke", uganda: { pos: [92, 138], park: "Murchison Falls" } },
  { cap: "AUG · MARA RIVER", pos: [210, 188], country: "ke", uganda: { pos: [92, 138], park: "Murchison Falls" } },
  { cap: "SEP · MARA TRIANGLE", pos: [212, 180], country: "ke", uganda: { pos: [78, 198], park: "Bwindi" } },
  { cap: "OCT · MASAI MARA", pos: [200, 195], country: "ke", uganda: { pos: [78, 198], park: "Bwindi" } },
  { cap: "NOV · LOLIONDO", pos: [200, 248], country: "tz", uganda: { pos: [82, 170], park: "Kibale" } },
  { cap: "DEC · SERONERA", pos: [200, 300], country: "tz", uganda: { pos: [78, 198], park: "Bwindi" } },
];

type MonthTranslation = {
  title: [string, string];
  body: string;
  region: string;
  best: string;
  crowd: string;
  rain: string;
  ugandaNote: string;
};

const AUTO_DELAY = 5000;

export default function MigrationCalendar() {
  const t = useTranslations("home.migrationCalendar");
  const monthsData = t.raw("months") as MonthTranslation[];
  const DATA: (MonthData & { ugandaNote: string })[] = MONTH_META.map((meta, i) => ({
    ...meta,
    title: monthsData[i].title,
    body: monthsData[i].body,
    region: monthsData[i].region,
    best: monthsData[i].best,
    crowd: monthsData[i].crowd,
    rain: monthsData[i].rain,
    ugandaNote: monthsData[i].ugandaNote,
  }));

  const [m, setM] = useState<number>(7); // August default
  const [auto, setAuto] = useState<boolean>(false);
  const d = DATA[m];
  const stripRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigate = useCallback((dir: 1 | -1) => {
    setAuto(false);
    setM((prev) => (prev + dir + 12) % 12);
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setM((prev) => (prev + 1) % 12), AUTO_DELAY);
    return () => clearInterval(id);
  }, [auto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === " ") {
        e.preventDefault();
        setAuto((a) => !a);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    const chip = chipRefs.current[m];
    const strip = stripRef.current;
    if (!chip || !strip) return;
    strip.scrollTo({
      left: chip.offsetLeft - strip.offsetWidth / 2 + chip.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [m]);

  return (
    <section className="relative w-full overflow-hidden bg-bone-bg py-[clamp(56px,9vw,140px)] text-bone-ink antialiased">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bone-clay to-transparent opacity-40" />

      <div className="mx-auto max-w-[1320px] px-[clamp(20px,5vw,64px)]">
        {/* Header */}
        <header className="section-hd">
          <div>
            <Reveal variant="fadeUp">
              <div className="eyebrow mb-4">
                <span className="dot" />{t("eyebrow")}
              </div>
            </Reveal>
            <AnimatedHeading
              as="h2"
              textBefore={t("headingBefore")}
              highlightedText={t("headingHighlight")}
              textAfter={t("headingAfter")}
            />
          </div>
          <Reveal variant="fadeUp">
            <div>
              <p className="text-sm leading-[1.65] text-bone-muted max-w-[56ch]">
                {t("lead")}
              </p>
            </div>
          </Reveal>
        </header>

        {/* Two-column: content left, map + calendar docked right */}
        <div className="grid grid-cols-1 items-start gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1fr_1.05fr]">
          {/* ── Left: text content ── */}
          <div className="w-full">
            <div className="mb-[18px] flex items-center justify-between border-b border-border pb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-ink/60">
                {MONTHS[m]} · {d.region}
              </span>
              <span className="font-mono text-[10px] tabular-nums tracking-[0.14em] text-bone-ink/30">
                {m + 1} / 12
              </span>
            </div>

            {/* Fixed-height container + absolutely-positioned children = zero layout shift */}
            <div className="relative min-h-[300px] mb-9">
              <AnimatePresence initial={false}>
                <motion.div
                  key={m}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <AnimatedHeading
                    as="h2"
                    className="mb-4"
                    textBefore={`${d.title[0]} `}
                    highlightedText={d.title[1]}
                    textAfter={d.title[2] || ""}
                  />

                  <div className="min-h-[110px] sm:min-h-[85px] md:min-h-[70px]">
                    <p className="max-w-[56ch] leading-[1.62] text-bone-ink/60 text-balance">
                      {d.body}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <dl className="mb-10 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-7 max-xs:grid-cols-1 min-h-[110px] sm:min-h-[85px] md:min-h-[70px]">
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-ink/40">
                  {t("regionLabel")}
                </dt>
                {/* Adding key={m} forces the Reveal component to replay on month shifts */}
                <Reveal key={m} variant="slideLeft">
                  <dd className="font-serif text-[clamp(18px,1.5vw,22px)] leading-none text-bone-clay">
                    {d.region}
                  </dd>
                </Reveal>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-ink/40">
                  {t("bestForLabel")}
                </dt>
                <Reveal key={m} variant="slideRight">
                  <dd className="font-serif text-[clamp(18px,1.5vw,22px)] leading-none text-bone-clay">
                    {d.best}
                  </dd>
                </Reveal>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-ink/40">
                  {t("crowdLabel")}
                </dt>
                <Reveal key={m} variant="slideLeft">
                  <dd className="font-serif text-[clamp(18px,1.5vw,22px)] leading-none text-bone-clay">
                    {d.crowd}
                  </dd>
                </Reveal>
              </div>
              <div className="flex flex-col gap-1.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-ink/40">
                  {t("seasonLabel")}
                </dt>
                <Reveal key={m} variant="slideRight">
                  <dd className="font-serif text-[clamp(18px,1.5vw,22px)] leading-none text-bone-clay">
                    {d.rain}
                  </dd>
                </Reveal>
              </div>
            </dl>

            <Reveal key={m} variant="fadeDown">
              <div className="flex flex-wrap items-baseline gap-x-4.5 gap-y-2.5 bg-bone-paper border-l-2 border-bone-forest p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-forest mr-2 font-medium">
                  {t("meanwhileUganda")}
                </span>
                <span className="font-serif text-[19px] text-bone-ink">
                  {d.uganda.park}
                </span>
                <span className="w-full text-sm text-bone-ink/60 mt-1 sm:mt-0 sm:flex-1 sm:basis-full">
                  {d.ugandaNote}
                </span>
              </div>
            </Reveal>
          </div>

          {/* ── Right: map + calendar nav docked flush below ── */}
          <div className="flex flex-col max-h-[80dvh]">
            <MigrationMap d={d} mapAria={t("mapAria")} />

            {/* Calendar navigation bar — zero gap from the map border */}
            <nav
              aria-label={t("calendarNavAria")}
              className="border border-t-0 border-border bg-bone-paper"
            >
              {/* Auto-play progress bar */}
              <div className="h-[2px] w-full overflow-hidden bg-bone-clay/10">
                {auto && (
                  <motion.div
                    key={m}
                    className="h-full bg-bone-clay"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTO_DELAY / 1000, ease: "linear" }}
                  />
                )}
              </div>

              <div className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label={`${t("prevPrefix")}${MONTHS[(m + 11) % 12]}`}
                  className="flex min-w-[44px] items-center justify-center border-r border-border px-4 py-4 text-bone-ink/50 transition-colors duration-200 hover:bg-bone-clay/5 hover:text-bone-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone-clay"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[13px] leading-none"
                  >
                    ←
                  </span>
                </button>

                {/* Month chips */}
                <div
                  ref={stripRef}
                  role="tablist"
                  aria-label={t("monthsAria")}
                  className="chip-scroll flex flex-1 overflow-x-auto"
                >
                  {MONTHS.map((label, i) => (
                    <button
                      key={label}
                      ref={(el) => {
                        chipRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={i === m}
                      aria-label={`${label} — ${DATA[i].region}`}
                      onClick={() => {
                        setAuto(false);
                        setM(i);
                      }}
                      className={`relative flex min-w-[44px] flex-shrink-0 flex-col items-center justify-center gap-[5px] px-3 py-4 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bone-clay ${
                        i === m
                          ? "text-bone-clay"
                          : "text-bone-ink/40 hover:text-bone-ink"
                      }`}
                    >
                      {label}
                      <span
                        className={`block h-[3px] w-[3px] rounded-full transition-all duration-300 ${
                          i === m ? "bg-bone-clay opacity-100" : "opacity-0"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(1)}
                  aria-label={`${t("nextPrefix")}${MONTHS[(m + 1) % 12]}`}
                  className="flex min-w-[44px] items-center justify-center border-l border-border px-4 py-4 text-bone-ink/50 transition-colors duration-200 hover:bg-bone-clay/5 hover:text-bone-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone-clay"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[13px] leading-none"
                  >
                    →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuto((a) => !a)}
                  aria-label={
                    auto ? t("pauseAria") : t("playAria")
                  }
                  aria-pressed={auto}
                  className={`flex min-w-[44px] items-center justify-center border-l border-border px-4 py-4 font-mono text-[9px] tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bone-clay ${
                    auto
                      ? "bg-bone-clay text-bone-paper"
                      : "text-bone-ink/40 hover:text-bone-ink"
                  }`}
                >
                  <span aria-hidden="true">{auto ? "◼" : "▶"}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

function MigrationMap({ d, mapAria }: { d: MonthData; mapAria: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[640px] border border-border bg-bone-paper aspect-[5/4] overflow-hidden lg:aspect-[4/5] lg:max-w-none before:absolute before:inset-0 before:bg-[linear-gradient(to_right,rgba(23,22,18,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,22,18,0.04)_1px,transparent_1px)] before:bg-[size:32px_32px] before:pointer-events-none after:absolute after:inset-0 after:border after:border-bone-clay after:translate-x-3.5 after:translate-y-3.5 after:pointer-events-none after:z-30">
      <svg
        viewBox="0 0 400 460"
        preserveAspectRatio="xMidYMid meet"
        className="relative z-10 block h-full w-full"
        role="img"
        aria-label={mapAria}
      >
        {/* Uganda */}
        <path
          className={`stroke-bone-ink/30 stroke-[0.7] transition-all duration-[600ms] ease-in-out ${
            d.country === "ug"
              ? "fill-bone-clay/15 stroke-bone-clay"
              : "fill-bone-bg"
          }`}
          d="M40 130 L130 110 L155 145 L150 195 L95 220 L40 200 Z"
        />
        {/* Kenya */}
        <path
          className={`stroke-bone-ink/30 stroke-[0.7] transition-all duration-[600ms] ease-in-out ${
            d.country === "ke"
              ? "fill-bone-clay/15 stroke-bone-clay"
              : "fill-bone-bg"
          }`}
          d="M155 80 L280 90 L350 130 L340 220 L240 240 L155 200 L150 145 Z"
        />
        {/* Tanzania */}
        <path
          className={`stroke-bone-ink/30 stroke-[0.7] transition-all duration-[600ms] ease-in-out ${
            d.country === "tz"
              ? "fill-bone-clay/15 stroke-bone-clay"
              : "fill-bone-bg"
          }`}
          d="M95 220 L240 240 L340 220 L325 360 L260 410 L165 405 L100 360 Z"
        />

        {/* Migration loop route */}
        <path
          className="fill-none stroke-bone-clay stroke-1 [stroke-dasharray:3_4] opacity-50"
          d="M 205 348 C 175 340, 158 305, 162 282 C 168 260, 188 230, 205 195 C 215 178, 215 192, 210 215 C 200 245, 195 285, 200 320 C 202 335, 205 348, 205 348 Z"
        />

        {/* Link line between Uganda highlight and herd position */}
        <motion.line
          className="stroke-bone-ink stroke-[0.6] [stroke-dasharray:2_4] opacity-20"
          initial={false}
          animate={{
            x1: d.uganda.pos[0],
            y1: d.uganda.pos[1],
            x2: d.pos[0],
            y2: d.pos[1],
          }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        />

        {/* Park markers */}
        <g className="fill-bone-ink opacity-60">
          <circle cx="210" cy="180" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="216"
            y="183"
          >
            MASAI MARA
          </text>
        </g>
        <g className="fill-bone-ink opacity-60">
          <circle cx="200" cy="300" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="206"
            y="303"
          >
            SERENGETI
          </text>
        </g>
        <g className="fill-bone-ink opacity-60">
          <circle cx="160" cy="278" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="138"
            y="271"
          >
            GRUMETI
          </text>
        </g>
        <g className="fill-bone-ink opacity-60">
          <circle cx="205" cy="348" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="211"
            y="351"
          >
            NDUTU
          </text>
        </g>

        {/* Uganda park markers */}
        <g className="fill-bone-ink opacity-60">
          <circle cx="78" cy="198" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="50"
            y="212"
          >
            BWINDI
          </text>
        </g>
        <g className="fill-bone-ink opacity-60">
          <circle cx="82" cy="170" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="56"
            y="163"
          >
            KIBALE
          </text>
        </g>
        <g className="fill-bone-ink opacity-60">
          <circle cx="92" cy="138" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="62"
            y="131"
          >
            MURCHISON
          </text>
        </g>
        <g className="fill-bone-ink opacity-60">
          <circle cx="76" cy="184" r="2" />
          <text
            className="font-mono text-[6.5px] tracking-[0.14em] uppercase fill-bone-ink opacity-60"
            x="46"
            y="190"
          >
            Q.ELIZABETH
          </text>
        </g>

        {/* Country labels */}
        <text
          className="font-serif text-[18px] fill-bone-ink opacity-50 pointer-events-none select-none"
          x="55"
          y="100"
        >
          Uganda
        </text>
        <text
          className="font-serif text-[18px] fill-bone-ink opacity-50 pointer-events-none select-none"
          x="232"
          y="80"
        >
          Kenya
        </text>
        <text
          className="font-serif text-[18px] fill-bone-ink opacity-50 pointer-events-none select-none"
          x="175"
          y="395"
        >
          Tanzania
        </text>

        {/* Wildebeest position */}
        <motion.g
          className="transform-box-fill-box transform-origin-center"
          initial={false}
          animate={{ x: d.pos[0], y: d.pos[1] }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          <circle
            className="fill-none stroke-bone-clay stroke-[1.2] origin-center [animation:pulse_2.4s_ease-out_infinite]"
            cx="0"
            cy="0"
            r="6"
          />
          <circle
            className="fill-none stroke-bone-clay stroke-[0.8] origin-center opacity-60 [animation:pulse_2.4s_ease-out_infinite_1.2s]"
            cx="0"
            cy="0"
            r="6"
          />
          <circle
            className="fill-bone-clay [filter:drop-shadow(0_0_6px_rgba(157,69,25,0.55))]"
            cx="0"
            cy="0"
            r="5"
          />
        </motion.g>

        {/* Uganda highlight position */}
        <motion.g
          className="transform-box-fill-box transform-origin-center"
          initial={false}
          animate={{ x: d.uganda.pos[0], y: d.uganda.pos[1] }}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          <circle
            className="fill-none stroke-bone-forest stroke-[1] origin-center [animation:pulse-sm_2.6s_ease-out_infinite]"
            cx="0"
            cy="0"
            r="4"
          />
          <circle
            className="fill-bone-forest [filter:drop-shadow(0_0_5px_rgba(26,46,26,0.6))]"
            cx="0"
            cy="0"
            r="3.5"
          />
        </motion.g>
      </svg>

      {/* Map caption */}
      <div className="absolute bottom-4 left-4 z-20 bg-bone-ink px-3.5 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-bone-paper">
        {d.cap}
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-bone-paper/90 p-2.5 px-3 border border-border backdrop-blur-sm">
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] uppercase text-bone-ink/70">
          <span className="h-2 w-2 rounded-full bg-bone-clay" /> Wildebeest
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] uppercase text-bone-ink/70">
          <span className="h-2 w-2 rounded-full bg-bone-forest" /> Uganda
          highlight
        </div>
      </div>
    </div>
  );
}
