"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, MapPin, Clock } from "lucide-react";
import { useSafaris, useSafari } from "@/hooks/useSafaris";
import { useCreateBooking } from "@/hooks/useBooking";
import { useCurrency } from "@/lib/currency/useCurrency";
import { getLowestPrice, formatDuration } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import SafariFilterPanel, {
  SafariFilterTrigger,
  DURATIONS,
  countActiveFilters,
  type SafariFilterValues,
} from "@/components/safaris/SafariFilterPanel";
import type {
  Safari,
  SafariFilters,
  SafariCategory,
  SafariDifficulty,
  SafariStyle,
  PriceTier,
} from "@/types";
import SiteLink from "../ui/SiteLink";

const LIMIT = 12;

const TIERS = [
  { key: "budget" as const, label: "Budget" },
  { key: "midRange" as const, label: "Mid-range" },
  { key: "luxury" as const, label: "Luxury" },
];

interface FilterState extends SafariFilterValues {
  search: string;
  page: number;
}

// ─── Safari pick card ─────────────────────────────────────────────────────────

function SafariPickCard({
  safari,
  onSelect,
}: {
  safari: Safari;
  onSelect: (s: Safari) => void;
}) {
  const lowestPrice = getLowestPrice(safari.pricing, safari.tripLength);
  const country = safari.location?.countries?.[0] ?? safari.location?.country;
  const { displayPrice } = useCurrency();

  return (
    <div className="group flex flex-col w-full h-full bg-[var(--paper)] border border-[var(--line)] rounded-sm overflow-hidden transition-all duration-200 hover:border-[var(--forest)] hover:shadow-lg">
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "3 / 2" }}
      >
        <OptimizedImage
          src={
            safari.coverImage ||
            safari.images?.[0]?.url ||
            "/images/placeholder.jpg"
          }
          alt={safari.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {country && (
          <div className="flex items-center gap-1 mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
            <MapPin size={10} />
            {country}
          </div>
        )}
        <h3 className="font-serif text-[18px] sm:text-[20px] font-normal leading-[1.25] text-[var(--ink)] mb-3">
          {safari.name}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-4 border-t border-[var(--line-soft)] mb-4">
          <div>
            <span className="block font-mono text-[9px] tracking-[0.14em] text-[var(--muted)] mb-0.5">
              FROM
            </span>
            <strong className="font-serif text-[22px] font-light text-[var(--ink)] leading-none">
              {displayPrice(lowestPrice)}
            </strong>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] tracking-[0.1em] text-[var(--muted)]">
            <Clock size={11} />
            {formatDuration(safari.duration, safari.tripLength, safari.durationLabel)}
          </div>
        </div>

        <SiteLink
          onClick={() => onSelect(safari)}
          variant="solid"
          size="md"
          className=" w-full"
        >
          Select this Safari
        </SiteLink>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const preselectSlug = searchParams.get("safari") ?? "";

  const [selectedSafari, setSelectedSafari] = useState<Safari | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    country: "",
    destination: "",
    category: "" as SafariCategory | "",
    safariType: "" as SafariStyle | "",
    duration: "",
    difficulty: "" as SafariDifficulty | "",
    tier: "" as PriceTier | "",
    sort: "rating",
    search: "",
    page: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  // Declared before `set`/`resetAll` so filter changes can reposition scroll
  // to the top of the results list — without this, shrinking the grid while
  // scrolled down leaves the viewport landing inside the footer/CTA section.
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const scrollToResults = useCallback(() => {
    resultsTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const { data: preselectData, isLoading: preselectLoading } =
    useSafari(preselectSlug);

  useEffect(() => {
    if (preselectSlug && preselectData?.data) {
      setSelectedSafari(preselectData.data);
    }
  }, [preselectSlug, preselectData]);

  const set = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      scrollToResults();
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    [scrollToResults],
  );

  const resetAll = useCallback(() => {
    scrollToResults();
    setFilters({
      country: "",
      destination: "",
      category: "",
      safariType: "",
      duration: "",
      difficulty: "",
      tier: "",
      sort: "rating",
      search: "",
      page: 1,
    });
    setSearchInput("");
  }, [scrollToResults]);

  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => set("search", val), 380);
  };

  const dur = DURATIONS.find((d) => d.value === filters.duration);

  const apiFilters: SafariFilters = {
    country: filters.country || undefined,
    destination: filters.destination || undefined,
    category: filters.category || undefined,
    safariType: filters.safariType || undefined,
    difficulty: filters.difficulty || undefined,
    tier: filters.tier || undefined,
    minDays: dur?.min,
    maxDays: dur?.max,
    search: filters.search || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: LIMIT,
  };

  const { data, isLoading, isError } = useSafaris(apiFilters);
  const safaris = data?.data ?? [];
  const pagination = data?.pagination;

  const { total: totalActive } = countActiveFilters(filters, filters.search);

  const handlePageChange = useCallback(
    (p: number) => {
      set("page", p);
    },
    [set],
  );

  const handleSelect = useCallback((safari: Safari) => {
    setSelectedSafari(safari);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedSafari(null);
    if (preselectSlug) {
      router.replace(pathname, { scroll: false });
    }
  }, [preselectSlug, pathname, router]);

  const showLoadingPreselect = !!preselectSlug && preselectLoading;

  return (
    <>
      {/* ── Header band ─────────────────────────────────────────────────── */}
      <section style={{ background: "var(--forest)", padding: "40px 0 28px" }}>
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-paper/55 mb-3">
            Book Your Trip
          </p>
          <h1 className="font-serif text-bone-paper text-[32px] sm:text-[42px] leading-tight mb-4">
            Request your safari booking
          </h1>
          <p className="text-bone-paper/75 text-[14px] sm:text-[15px] leading-relaxed max-w-lg mx-auto">
            Choose a safari below and share your travel details. Our team
            confirms availability and pricing within 24 hours —{" "}
            <strong style={{ color: "#f4d4a8" }}>
              no payment required now.
            </strong>
          </p>
        </div>
      </section>

      {/* ── Step indicator ──────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ background: "var(--bg)", borderColor: "var(--line-soft)" }}
      >
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-4 flex items-center justify-center gap-3">
          <span
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]"
            style={{
              color: !selectedSafari ? "var(--forest)" : "var(--muted)",
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
              style={{
                background: !selectedSafari ? "var(--forest)" : "transparent",
                color: !selectedSafari ? "var(--paper)" : "var(--muted)",
                border: !selectedSafari ? "none" : "1px solid var(--line)",
              }}
            >
              1
            </span>
            Choose safari
          </span>
          <span style={{ color: "var(--line)" }}>—</span>
          <span
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]"
            style={{
              color: selectedSafari ? "var(--forest)" : "var(--muted)",
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
              style={{
                background: selectedSafari ? "var(--forest)" : "transparent",
                color: selectedSafari ? "var(--paper)" : "var(--muted)",
                border: selectedSafari ? "none" : "1px solid var(--line)",
              }}
            >
              2
            </span>
            Your details
          </span>
        </div>
      </div>

      <div ref={formRef} style={{ background: "var(--bg)" }}>
        <AnimatePresence mode="wait">
          {showLoadingPreselect ? (
            <motion.div
              key="preselect-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <p className="font-mono text-[12px] text-[var(--muted)]">
                Loading your safari…
              </p>
            </motion.div>
          ) : !selectedSafari ? (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 max-w-[1920px] mx-auto"
              style={{ paddingTop: "48px", paddingBottom: "60px" }}
            >
              {/* ── Mobile: filter trigger ───────────────────────────────── */}
              <div className="lg:hidden flex items-center justify-end mb-4">
                <SafariFilterTrigger
                  totalActive={totalActive}
                  onClick={() => setMobileOpen(true)}
                />
              </div>

              {/* ── Sidebar + grid ───────────────────────────────────────── */}
              <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start">
                <SafariFilterPanel
                  values={filters}
                  searchInput={searchInput}
                  onSearchInput={handleSearchInput}
                  onCountryChange={(v) => set("country", v)}
                  onDestinationChange={(v) => set("destination", v)}
                  onCategoryChange={(v) => set("category", v)}
                  onSafariTypeChange={(v) => set("safariType", v)}
                  onDurationChange={(v) => set("duration", v)}
                  onDifficultyChange={(v) => set("difficulty", v)}
                  onTierChange={(v) => set("tier", v)}
                  onSortChange={(v) => set("sort", v)}
                  onReset={resetAll}
                  mobileOpen={mobileOpen}
                  onMobileClose={() => setMobileOpen(false)}
                  resultCount={pagination?.total}
                />

                <div
                  ref={resultsTopRef}
                  className="flex-1 min-w-0"
                  style={{ scrollMarginTop: "90px" }}
                >
                  {pagination && (
                    <div className="hidden lg:block mb-6">
                      <span
                        className="font-mono text-[11px] uppercase tracking-[0.1em]"
                        style={{ color: "var(--muted)" }}
                      >
                        {pagination.total} safari
                        {pagination.total !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {isError ? (
                    <p className="text-center py-16 text-sm text-[var(--muted)]">
                      Failed to load safaris. Please refresh the page.
                    </p>
                  ) : isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse border border-[var(--line)] rounded-sm overflow-hidden"
                        >
                          <div
                            style={{
                              aspectRatio: "3 / 2",
                              background: "var(--bg-deep)",
                            }}
                          />
                          <div className="p-5 sm:p-6">
                            <div
                              className="h-4 rounded w-2/3 mb-3"
                              style={{ background: "var(--bg-deep)" }}
                            />
                            <div
                              className="h-9 rounded w-full"
                              style={{ background: "var(--bg-deep)" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : safaris.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="font-serif text-[26px] text-[var(--ink)] mb-3">
                        No safaris found
                      </p>
                      <p className="text-sm mb-8 text-[var(--muted)]">
                        Try adjusting your filters to see more results.
                      </p>
                      <button
                        type="button"
                        onClick={resetAll}
                        className="px-7 py-3 border rounded-full font-mono text-[12px] uppercase tracking-[0.12em] transition-all duration-200 hover:bg-[var(--forest)] hover:text-[var(--paper)] hover:border-[var(--forest)]"
                        style={{
                          borderColor: "var(--forest)",
                          color: "var(--forest)",
                        }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {safaris.map((safari) => (
                          <SafariPickCard
                            key={safari._id}
                            safari={safari}
                            onSelect={handleSelect}
                          />
                        ))}
                      </div>

                      {pagination && pagination.totalPages > 1 && (
                        <Pagination
                          page={pagination.page}
                          totalPages={pagination.totalPages}
                          total={pagination.total}
                          limit={LIMIT}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-12"
            >
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--muted)] mb-5 transition-colors hover:text-[var(--forest)]"
              >
                <ChevronLeft size={13} />
                Choose a different safari
              </button>

              <BookingDetailsForm safari={selectedSafari} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── Booking details form (step 2) ───────────────────────────────────────────

function BookingDetailsForm({ safari }: { safari: Safari }) {
  const isShort = safari.tripLength === "short";

  // ── Pricing helpers ────────────────────────────────────────────────────────

  type PriceRow = { per2: number; per3: number; per4: number; per5: number; per6: number; seasonLabel: string; dateRange: string };

  // Pick per-N column for a group size (clamp to available per2–per6 range)
  function perNRate(row: PriceRow | null | undefined, count: number): number {
    if (!row) return 0;
    const key = `per${Math.max(2, Math.min(6, count))}` as "per2" | "per3" | "per4" | "per5" | "per6";
    const v = row[key];
    return typeof v === "number" && v > 0 ? v : 0;
  }

  // Lowest seasonal per6 for a tier — used to display "from" in tier buttons
  function tierLowestPer6(tier: Safari["pricing"]["budget"]): number {
    if (!tier) return 0;
    if (tier.rows?.length) {
      const vals = tier.rows.map((r) => r.per6).filter((p): p is number => typeof p === "number" && p > 0);
      return vals.length ? Math.min(...vals) : 0;
    }
    return tier.pricePerPerson ?? 0;
  }

  // Match a date to a season row by parsing its dateRange string ("Jun 11, 2026 – Oct 30, 2026")
  function findSeasonRow(rows: PriceRow[] | undefined, date: Date | null): { row: PriceRow; label: string; matched: boolean } | null {
    if (!rows?.length) return null;
    if (date) {
      for (const row of rows) {
        if (!row.dateRange) continue;
        const sep = /[–—]/;
        const parts = row.dateRange.split(sep).map((p) => p.trim());
        if (parts.length === 2) {
          const start = new Date(parts[0]);
          const end = new Date(parts[1]);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && date >= start && date <= end) {
            return { row, label: row.seasonLabel, matched: true };
          }
        }
      }
    }
    // No match — default to first row
    return { row: rows[0], label: rows[0].seasonLabel, matched: false };
  }

  // ── State ──────────────────────────────────────────────────────────────────

  const availableTiers = TIERS.filter((t) => tierLowestPer6(safari.pricing?.[t.key]) > 0);
  const defaultTier =
    availableTiers.find((t) => t.key === "midRange")?.key ??
    availableTiers[0]?.key ??
    "budget";

  const [tier, setTier] = useState<PriceTier>(defaultTier);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [preferredDate, setPreferredDate] = useState("");
  const [alternateDate, setAlternateDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{ bookingRef: string } | null>(null);

  const createBooking = useCreateBooking();
  const { displayPrice } = useCurrency();

  // ── Dynamic pricing calculation ────────────────────────────────────────────

  const groupSize = adults + children;
  const preferredDateObj = preferredDate ? new Date(preferredDate) : null;

  let adultRate = 0;
  let seasonLabel: string | null = null;
  let seasonMatched = false;

  if (isShort) {
    // Flat table: one row, per-N based on total group
    adultRate = perNRate(safari.pricing?.budget?.rows?.[0] as PriceRow | undefined, groupSize);
  } else {
    // Seasonal table for selected tier; preferred date determines the season
    const tierRows = (safari.pricing?.[tier]?.rows ?? []) as PriceRow[];
    const found = findSeasonRow(tierRows, preferredDateObj);
    if (found) {
      adultRate = perNRate(found.row, groupSize);
      seasonLabel = found.label;
      seasonMatched = found.matched;
    }
  }

  const childRate = adultRate > 0 ? Math.round(adultRate / 2) : 0;
  const adultTotal = adults * adultRate;
  const childTotal = children * childRate;
  const totalPrice = adultTotal + childTotal;

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  function validate() {
    const e: Record<string, string> = {};
    if (firstName.trim().length < 2) e.firstName = "Required";
    if (lastName.trim().length < 2) e.lastName = "Required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Valid email required";
    if (phone.trim().length < 7) e.phone = "Required";
    if (nationality.trim().length < 2) e.nationality = "Required";
    if (!preferredDate) e.preferredDate = "Required";
    return e;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const result = await createBooking.mutateAsync({
        safariId: safari._id,
        tier,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        nationality: nationality.trim(),
        groupSize,
        adultCount: adults,
        childCount: children,
        preferredDate,
        ...(alternateDate && { alternateDate }),
        ...(specialRequests.trim() && {
          specialRequests: specialRequests.trim(),
        }),
      });
      setSuccess({ bookingRef: result.data!.bookingRef });
    } catch (err) {
      setErrors({
        form:
          (err as Error).message || "Something went wrong. Please try again.",
      });
    }
  };

  function clearError(field: string) {
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  }

  const inputClass = (field: string) =>
    `w-full h-11 px-3 border text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors ${
      errors[field] ? "border-red-400" : "border-[var(--line)]"
    }`;

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="bg-[var(--paper)] p-8 text-center shadow-lg border border-[var(--line)]">
        <div className="w-16 h-16 rounded-full bg-[var(--forest)] flex items-center justify-center mx-auto mb-5">
          <Check size={30} className="text-[var(--paper)]" strokeWidth={2.5} />
        </div>
        <h2 className="font-serif font-normal text-[28px] leading-tight mb-3">
          Booking Request Sent
        </h2>
        <p className="text-[var(--muted)] text-[14px] leading-relaxed mb-5">
          Thank you, <strong>{firstName}</strong>! A member of our team will
          contact you shortly to discuss deposit payment and finalise your
          pricing and confirmation.
        </p>
        <div className="font-mono text-[11px] bg-[var(--bg)] border border-[var(--line)] px-4 py-3 mb-6 text-[var(--ink)]">
          Your booking reference:{" "}
          <strong className="text-[var(--forest)]">{success.bookingRef}</strong>
        </div>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => (window.location.href = "/")}
        >
          Return to homepage
        </Button>
      </div>
    );
  }

  // ── Booking form ───────────────────────────────────────────────────────────
  return (
    <div className="bg-[var(--paper)] shadow-lg border border-[var(--line)]">
      {/* Header */}
      <div className="bg-[var(--forest)] text-[var(--paper)] px-6 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-55 mb-1">
          You&apos;re booking
        </p>
        <h2 className="font-serif font-normal text-[22px] leading-tight">
          {safari.name}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Tier selection — multi-day only; short safaris have flat group-size pricing */}
        {!isShort && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-1">
              Safari Tier
            </p>
            <p className="text-[11px] text-[var(--muted)] mb-3">
              Choose your comfort level — each tier uses different lodges and services.
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {TIERS.map(({ key, label }) => {
                const fromPrice = tierLowestPer6(safari.pricing?.[key]);
                if (!fromPrice) return null;
                const active = tier === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTier(key)}
                    className={`p-3 border text-left transition-colors ${
                      active
                        ? "border-[var(--forest)] bg-[var(--forest)]/5"
                        : "border-[var(--line)] hover:border-[var(--forest)]/40"
                    }`}
                  >
                    <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)] mb-1">
                      {label}
                    </div>
                    <div className="font-serif italic text-[18px] leading-none text-[var(--clay)]">
                      from {displayPrice(fromPrice)}
                    </div>
                    <div className="font-mono text-[9px] text-[var(--muted)] mt-0.5">
                      / person · 6 pax
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
              Preferred Travel Date *
            </label>
            <input
              type="date"
              value={preferredDate}
              min={tomorrow}
              onChange={(e) => {
                setPreferredDate(e.target.value);
                clearError("preferredDate");
              }}
              className={inputClass("preferredDate")}
            />
            {errors.preferredDate && (
              <p className="text-red-500 text-[11px] mt-1">
                {errors.preferredDate}
              </p>
            )}
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] mb-2">
              Alternate Date (optional)
            </label>
            <input
              type="date"
              value={alternateDate}
              min={tomorrow}
              onChange={(e) => setAlternateDate(e.target.value)}
              className="w-full h-11 px-3 border border-[var(--line)] text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors"
            />
          </div>
        </div>

        {/* Group size */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-3">
            Group Size
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Adults *",
                value: adults,
                min: 1,
                max: 50,
                set: setAdults,
              },
              {
                label: "Children (under 12)",
                value: children,
                min: 0,
                max: 20,
                set: setChildren,
              },
            ].map(({ label, value, min, max, set }) => (
              <div key={label}>
                <label className="block text-[12px] text-[var(--muted)] mb-1.5">
                  {label}
                </label>
                <div className="flex items-center h-11 border border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => set((v) => Math.max(min, v - 1))}
                    className="w-11 h-full flex items-center justify-center text-[var(--forest)] hover:bg-[var(--bg)] transition-colors text-[20px] leading-none"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-medium text-[var(--ink)]">
                    {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => set((v) => Math.min(max, v + 1))}
                    className="w-11 h-full flex items-center justify-center text-[var(--forest)] hover:bg-[var(--bg)] transition-colors text-[20px] leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="bg-[var(--forest)] text-[var(--paper)] px-5 py-4 space-y-2">
          {/* Season badge — multi-day only */}
          {!isShort && (
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--paper)]/15 text-[11px] opacity-70">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-60">Season:</span>
              {seasonLabel ? (
                <>
                  <span>{seasonLabel}</span>
                  {preferredDate && !seasonMatched && (
                    <span className="opacity-50 text-[10px]">(nearest match)</span>
                  )}
                  {!preferredDate && (
                    <span className="opacity-50 text-[10px]">— pick a date above to auto-detect</span>
                  )}
                </>
              ) : (
                <span className="opacity-50">Select a travel date to match your season</span>
              )}
            </div>
          )}

          {/* Line items */}
          <div className="space-y-1">
            {adultRate > 0 ? (
              <div className="flex justify-between text-[13px]">
                <span className="opacity-80">
                  {adults} adult{adults !== 1 ? "s" : ""} × {displayPrice(adultRate)}
                  {groupSize > 1 && (
                    <span className="opacity-50 text-[10px] ml-1">({groupSize} pax rate)</span>
                  )}
                </span>
                <span className="font-medium">{displayPrice(adultTotal)}</span>
              </div>
            ) : (
              <div className="text-[12px] opacity-50 italic">
                {!preferredDate && !isShort
                  ? "Add a travel date to calculate pricing"
                  : "Pricing not available — contact us"}
              </div>
            )}
            {children > 0 && childRate > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="opacity-80">
                  {children} child{children !== 1 ? "ren" : ""} × {displayPrice(childRate)}
                  <span className="opacity-50 text-[10px] ml-1">(½ adult rate)</span>
                </span>
                <span className="font-medium">{displayPrice(childTotal)}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-[var(--paper)]/20 pt-2 flex items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-50 mb-1">
                Estimated total
              </div>
              <div className="font-serif italic text-[36px] leading-none">
                {totalPrice > 0 ? displayPrice(totalPrice) : "—"}
              </div>
              {totalPrice > 0 && groupSize > 0 && (
                <div className="font-mono text-[10px] opacity-50 mt-1">
                  ≈ {displayPrice(Math.round(totalPrice / groupSize))} avg / person
                </div>
              )}
            </div>
            <div className="text-right text-[11px] opacity-55 leading-relaxed">
              {isShort ? (
                <span>Fixed rate · no seasonal change</span>
              ) : (
                <span>{tier === "midRange" ? "Mid-range" : tier === "luxury" ? "Luxury" : "Budget"} tier</span>
              )}
              <br />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
                Final price confirmed by team
              </span>
            </div>
          </div>
        </div>

        {/* Personal details */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] mb-4">
            Your Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearError("firstName");
                }}
                autoComplete="given-name"
                className={inputClass("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearError("lastName");
                }}
                autoComplete="family-name"
                className={inputClass("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                autoComplete="email"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError("phone");
                }}
                autoComplete="tel"
                placeholder="+1 234 567 8900"
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
                Nationality *
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => {
                  setNationality(e.target.value);
                  clearError("nationality");
                }}
                placeholder="e.g. American, British, Kenyan…"
                className={inputClass("nationality")}
              />
              {errors.nationality && (
                <p className="text-red-500 text-[11px] mt-1">
                  {errors.nationality}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Special requests */}
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted)] mb-2">
            Special Requests (optional)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Dietary requirements, accessibility needs, special occasions, preferred lodges…"
            className="w-full px-3 py-2.5 border border-[var(--line)] text-[14px] bg-[var(--paper)] focus:outline-none focus:border-[var(--forest)] transition-colors resize-none"
          />
        </div>

        {errors.form && (
          <p className="text-red-600 text-[13px] bg-red-50 border border-red-200 px-4 py-3">
            {errors.form}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="xl"
          fullWidth
          loading={createBooking.isPending}
        >
          {createBooking.isPending
            ? "Submitting your request…"
            : totalPrice > 0
              ? `Submit Booking Request — ${displayPrice(totalPrice)}`
              : "Submit Booking Request"}
        </Button>

        <p className="text-[11px] text-[var(--muted)] text-center leading-relaxed">
          No payment is required now. Our team will contact you to finalise
          pricing and arrange your deposit.
        </p>
      </form>
    </div>
  );
}
