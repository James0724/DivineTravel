"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useSafaris } from "@/hooks/useSafaris";
import PkgCard from "@/components/safaris/PkgCard";
import Pagination from "@/components/ui/Pagination";

import type {
  SafariFilters,
  SafariCategory,
  SafariDifficulty,
  PriceTier,
} from "@/types";

// ─── Filter constants ─────────────────────────────────────────────────────────

const COUNTRIES = [
  { label: "All countries", value: "" },
  { label: "Kenya", value: "Kenya" },
  { label: "Tanzania", value: "Tanzania" },
  { label: "Uganda", value: "Uganda" },
  { label: "Rwanda", value: "Rwanda" },
  { label: "Cross-border", value: "cross" },
];

const CATEGORIES: { label: string; value: SafariCategory | "" }[] = [
  { label: "All types", value: "" },
  { label: "Wildlife", value: "wildlife" },
  { label: "Adventure", value: "adventure" },
  { label: "Cultural", value: "cultural" },
  { label: "Gorilla", value: "gorilla" },
  { label: "Beach", value: "beach" },
  { label: "Mountain", value: "mountain" },
];

const DURATIONS = [
  {
    label: "Any length",
    value: "",
    min: undefined as number | undefined,
    max: undefined as number | undefined,
  },
  { label: "1–3 days", value: "1-3", min: 1, max: 3 },
  { label: "4–7 days", value: "4-7", min: 4, max: 7 },
  { label: "8–14 days", value: "8-14", min: 8, max: 14 },
  { label: "15+ days", value: "15+", min: 15, max: undefined },
];

const DIFFICULTIES: { label: string; value: SafariDifficulty | "" }[] = [
  { label: "Any", value: "" },
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Challenging", value: "challenging" },
];

const TIERS: { label: string; value: PriceTier | "" }[] = [
  { label: "All tiers", value: "" },
  { label: "Budget", value: "budget" },
  { label: "Mid-range", value: "midRange" },
  { label: "Luxury", value: "luxury" },
];

const SORT_OPTIONS: {
  label: string;
  value: NonNullable<SafariFilters["sort"]>;
}[] = [
  { label: "Featured", value: "rating" },
  { label: "Newest", value: "newest" },
  { label: "Price: low → high", value: "price_asc" },
  { label: "Price: high → low", value: "price_desc" },
  { label: "Shortest first", value: "duration_asc" },
];

const LIMIT = 12;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState {
  country: string;
  category: SafariCategory | "";
  duration: string;
  difficulty: SafariDifficulty | "";
  tier: PriceTier | "";
  sort: NonNullable<SafariFilters["sort"]>;
  search: string;
  page: number;
}

// ─── Pill button ──────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1 border rounded-full text-[11px] font-mono tracking-[0.08em] whitespace-nowrap transition-all duration-200 hover:border-[var(--ink)]"
      style={{
        borderColor: active ? "var(--forest)" : "var(--line)",
        background: active ? "var(--forest)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink)",
      }}
    >
      {children}
    </button>
  );
}

// ─── Sidebar filter group ─────────────────────────────────────────────────────

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="px-5 py-4"
      style={{ borderBottom: "1px solid var(--line-soft)" }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.2em] mb-2.5"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SafarisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>({
    country: searchParams.get("country") ?? "",
    category: (searchParams.get("category") as SafariCategory) ?? "",
    duration: searchParams.get("duration") ?? "",
    difficulty: (searchParams.get("difficulty") as SafariDifficulty) ?? "",
    tier: (searchParams.get("tier") as PriceTier) ?? "",
    sort:
      (searchParams.get("sort") as NonNullable<SafariFilters["sort"]>) ??
      "rating",
    search: searchParams.get("search") ?? "",
    page: parseInt(searchParams.get("page") ?? "1", 10),
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const [showAdvanced, setShowAdvanced] = useState(
    !!(filters.difficulty || filters.tier),
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const set = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    [],
  );

  const resetAll = useCallback(() => {
    setFilters({
      country: "",
      category: "",
      duration: "",
      difficulty: "",
      tier: "",
      sort: "rating",
      search: "",
      page: 1,
    });
    setSearchInput("");
  }, []);

  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => set("search", val), 380);
  };

  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.country) p.set("country", filters.country);
    if (filters.category) p.set("category", filters.category);
    if (filters.duration) p.set("duration", filters.duration);
    if (filters.difficulty) p.set("difficulty", filters.difficulty);
    if (filters.tier) p.set("tier", filters.tier);
    if (filters.sort && filters.sort !== "rating") p.set("sort", filters.sort);
    if (filters.search) p.set("search", filters.search);
    if (filters.page > 1) p.set("page", String(filters.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const dur = DURATIONS.find((d) => d.value === filters.duration);

  const apiFilters: SafariFilters = {
    country:
      filters.country && filters.country !== "cross"
        ? filters.country
        : undefined,
    category: filters.category || undefined,
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

  const advancedActive = [filters.difficulty, filters.tier].filter(
    Boolean,
  ).length;
  const totalActive = [
    filters.country,
    filters.category,
    filters.duration,
    filters.difficulty,
    filters.tier,
    filters.search,
  ].filter(Boolean).length;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          MAIN SECTION — vertical filter sidebar + packages grid
      ════════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "var(--bg)",
          paddingTop: "60px",
          paddingBottom: "60px",
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 max-w-[1920px] mx-auto">
          {/* ── Mobile: result count + filter trigger (< lg) ─────────────── */}
          <div
            className="lg:hidden sticky z-20 flex items-center justify-end py-3 mb-3 -mx-4 px-4 sm:-mx-6 sm:px-6"
            style={{ top: "50px" }}
          >
            {/* <span
              className="font-mono text-[11px] uppercase tracking-[0.1em] px-3 py-1.5 bg-bone-bg border-2 rounded-full"
              style={{ color: "var(--muted)" }}
            >
              {pagination
                ? `${pagination.total} safari${pagination.total !== 1 ? "s" : ""}`
                : " "}
            </span> */}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-bone-bg border-2 rounded-full font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 hover:border-[var(--forest)] hover:text-[var(--forest)]"
              style={{
                borderColor: totalActive > 0 ? "var(--forest)" : "var(--line)",
                color: totalActive > 0 ? "var(--forest)" : "var(--muted)",
              }}
            >
              <Filter size={11} />
              Filters
              {totalActive > 0 && (
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                  style={{ background: "var(--clay)", color: "var(--paper)" }}
                >
                  {totalActive}
                </span>
              )}
            </button>
          </div>

          {/* ── Desktop layout: sidebar + grid ─────────────────────────── */}
          <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start">
            {/* ── Vertical filter sidebar (lg+) ──────────────────────────── */}
            <aside
              className="hidden lg:block flex-shrink-0 sticky"
              style={{ top: "90px", width: "364px" }}
            >
              <div
                className="flex flex-col border rounded-sm"
                style={{
                  background: "var(--paper)",
                  borderColor: "var(--line)",
                  overflowY: "auto",
                }}
              >
                {/* Panel header */}
                <div
                  className="flex items-center justify-between px-5 py-3.5"
                  style={{ borderBottom: "1px solid var(--line-soft)" }}
                >
                  <span
                    className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: "var(--muted)" }}
                  >
                    Filters
                    {totalActive > 0 && (
                      <span
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                        style={{
                          background: "var(--clay)",
                          color: "var(--paper)",
                        }}
                      >
                        {totalActive}
                      </span>
                    )}
                  </span>
                  {totalActive > 0 && (
                    <button
                      type="button"
                      onClick={resetAll}
                      className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
                      style={{ color: "var(--clay)" }}
                    >
                      <X size={9} /> Clear
                    </button>
                  )}
                </div>

                {/* Search */}
                <FilterGroup label="Search">
                  <div className="relative">
                    <Search
                      size={12}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--muted)" }}
                    />
                    <input
                      type="search"
                      placeholder="Parks, countries…"
                      value={searchInput}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 font-sans text-[12px] border rounded-full focus:outline-none focus:border-[var(--forest)] transition-colors"
                      style={{
                        background: "var(--bg)",
                        borderColor: "var(--line)",
                        color: "var(--ink)",
                      }}
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          set("search", "");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-[var(--clay)]"
                        style={{ color: "var(--muted)" }}
                        aria-label="Clear search"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </FilterGroup>

                {/* Country */}
                <FilterGroup label="Country">
                  <div className="flex flex-wrap gap-1.5">
                    {COUNTRIES.map((c) => (
                      <Pill
                        key={c.value}
                        active={filters.country === c.value}
                        onClick={() => set("country", c.value)}
                      >
                        {c.label}
                      </Pill>
                    ))}
                  </div>
                </FilterGroup>

                {/* Type */}
                <FilterGroup label="Type">
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <Pill
                        key={c.value}
                        active={filters.category === c.value}
                        onClick={() => set("category", c.value)}
                      >
                        {c.label}
                      </Pill>
                    ))}
                  </div>
                </FilterGroup>

                {/* Length */}
                <FilterGroup label="Length">
                  <div className="flex flex-wrap gap-1.5">
                    {DURATIONS.map((d) => (
                      <Pill
                        key={d.value}
                        active={filters.duration === d.value}
                        onClick={() => set("duration", d.value)}
                      >
                        {d.label}
                      </Pill>
                    ))}
                  </div>
                </FilterGroup>

                {/* Sort */}
                <FilterGroup label="Sort by">
                  <div className="relative">
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        set(
                          "sort",
                          e.target.value as NonNullable<SafariFilters["sort"]>,
                        )
                      }
                      className="w-full h-8 pl-3 pr-8 font-mono text-[11px] tracking-[0.06em] border rounded-sm appearance-none cursor-pointer focus:outline-none transition-colors"
                      style={{
                        background: "var(--bg)",
                        borderColor: "var(--line)",
                        color: "var(--muted)",
                      }}
                    >
                      {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={11}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--muted)" }}
                    />
                  </div>
                </FilterGroup>

                {/* More filters toggle */}
                <div className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced((v) => !v)}
                    className="flex items-center justify-between w-full font-mono text-[9px] uppercase tracking-[0.18em] transition-colors"
                    style={{
                      color: showAdvanced ? "var(--forest)" : "var(--muted)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal size={11} />
                      More filters
                      {advancedActive > 0 && (
                        <span
                          className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                          style={{
                            background: "var(--clay)",
                            color: "var(--paper)",
                          }}
                        >
                          {advancedActive}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* Advanced: Difficulty + Tier */}
                {showAdvanced && (
                  <>
                    <FilterGroup label="Difficulty">
                      <div className="flex flex-wrap gap-1.5">
                        {DIFFICULTIES.map((d) => (
                          <Pill
                            key={d.value}
                            active={filters.difficulty === d.value}
                            onClick={() => set("difficulty", d.value)}
                          >
                            {d.label}
                          </Pill>
                        ))}
                      </div>
                    </FilterGroup>
                    <FilterGroup label="Budget tier">
                      <div className="flex flex-wrap gap-1.5">
                        {TIERS.map((t) => (
                          <Pill
                            key={t.value}
                            active={filters.tier === t.value}
                            onClick={() => set("tier", t.value)}
                          >
                            {t.label}
                          </Pill>
                        ))}
                      </div>
                    </FilterGroup>
                  </>
                )}
              </div>
            </aside>

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Result count (desktop) */}
              {pagination && (
                <div className="hidden lg:block mb-6">
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.1em]"
                    style={{ color: "var(--muted)" }}
                  >
                    {pagination.total} safari{pagination.total !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Safaris grid */}
              {isError ? (
                <div className="text-center py-20">
                  <p
                    className="font-serif font-normal mb-3"
                    style={{ fontSize: "32px", color: "var(--ink)" }}
                  >
                    Something went wrong
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Failed to load safaris. Please refresh the page.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div
                        className="mb-5"
                        style={{
                          aspectRatio: "4/3.4",
                          background: "var(--bg-deep)",
                        }}
                      />
                      <div
                        className="h-3 rounded mb-2 w-1/3"
                        style={{ background: "var(--bg-deep)" }}
                      />
                      <div
                        className="h-8 rounded mb-3"
                        style={{ background: "var(--bg-deep)" }}
                      />
                      <div
                        className="h-4 rounded w-3/4"
                        style={{ background: "var(--bg-deep)" }}
                      />
                    </div>
                  ))}
                </div>
              ) : safaris.length === 0 ? (
                <div className="text-center py-24">
                  <p
                    className="font-serif font-normal mb-4"
                    style={{ fontSize: "36px", color: "var(--ink)" }}
                  >
                    No safaris found
                  </p>
                  <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {safaris.map((safari, i) => (
                      <PkgCard key={safari._id} safari={safari} index={i} />
                    ))}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <Pagination
                      page={pagination.page}
                      totalPages={pagination.totalPages}
                      total={pagination.total}
                      limit={LIMIT}
                      onPageChange={(p) => set("page", p)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CTA BAND
      ════════════════════════════════════════════════════════════════════ */}

      {/* ── Mobile: slide-in filter drawer (< lg) ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.45)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col border-r"
              style={{
                width: "min(360px, 90vw)",
                background: "var(--paper)",
                borderColor: "var(--line)",
                overflowY: "auto",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--line-soft)" }}
              >
                <span
                  className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "var(--muted)" }}
                >
                  Filters
                  {totalActive > 0 && (
                    <span
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                      style={{
                        background: "var(--clay)",
                        color: "var(--paper)",
                      }}
                    >
                      {totalActive}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  {totalActive > 0 && (
                    <button
                      type="button"
                      onClick={resetAll}
                      className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
                      style={{ color: "var(--clay)" }}
                    >
                      <X size={9} /> Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="transition-colors hover:text-[var(--clay)]"
                    style={{ color: "var(--muted)" }}
                    aria-label="Close filters"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Search */}
              <FilterGroup label="Search">
                <div className="relative">
                  <Search
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--muted)" }}
                  />
                  <input
                    type="search"
                    placeholder="Parks, countries…"
                    value={searchInput}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 font-sans text-[12px] border rounded-full focus:outline-none focus:border-[var(--forest)] transition-colors"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--line)",
                      color: "var(--ink)",
                    }}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        set("search", "");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-[var(--clay)]"
                      style={{ color: "var(--muted)" }}
                      aria-label="Clear search"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </FilterGroup>

              {/* Country */}
              <FilterGroup label="Country">
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRIES.map((c) => (
                    <Pill
                      key={c.value}
                      active={filters.country === c.value}
                      onClick={() => set("country", c.value)}
                    >
                      {c.label}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>

              {/* Type */}
              <FilterGroup label="Type">
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <Pill
                      key={c.value}
                      active={filters.category === c.value}
                      onClick={() => set("category", c.value)}
                    >
                      {c.label}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>

              {/* Length */}
              <FilterGroup label="Length">
                <div className="flex flex-wrap gap-1.5">
                  {DURATIONS.map((d) => (
                    <Pill
                      key={d.value}
                      active={filters.duration === d.value}
                      onClick={() => set("duration", d.value)}
                    >
                      {d.label}
                    </Pill>
                  ))}
                </div>
              </FilterGroup>

              {/* Sort */}
              <FilterGroup label="Sort by">
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      set(
                        "sort",
                        e.target.value as NonNullable<SafariFilters["sort"]>,
                      )
                    }
                    className="w-full h-8 pl-3 pr-8 font-mono text-[11px] tracking-[0.06em] border rounded-sm appearance-none cursor-pointer focus:outline-none transition-colors"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--line)",
                      color: "var(--muted)",
                    }}
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={11}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--muted)" }}
                  />
                </div>
              </FilterGroup>

              {/* More filters toggle */}
              <div className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="flex items-center justify-between w-full font-mono text-[9px] uppercase tracking-[0.18em] transition-colors"
                  style={{
                    color: showAdvanced ? "var(--forest)" : "var(--muted)",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal size={11} />
                    More filters
                    {advancedActive > 0 && (
                      <span
                        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px]"
                        style={{
                          background: "var(--clay)",
                          color: "var(--paper)",
                        }}
                      >
                        {advancedActive}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* Advanced: Difficulty + Tier */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <FilterGroup label="Difficulty">
                      <div className="flex flex-wrap gap-1.5">
                        {DIFFICULTIES.map((d) => (
                          <Pill
                            key={d.value}
                            active={filters.difficulty === d.value}
                            onClick={() => set("difficulty", d.value)}
                          >
                            {d.label}
                          </Pill>
                        ))}
                      </div>
                    </FilterGroup>
                    <FilterGroup label="Budget tier">
                      <div className="flex flex-wrap gap-1.5">
                        {TIERS.map((t) => (
                          <Pill
                            key={t.value}
                            active={filters.tier === t.value}
                            onClick={() => set("tier", t.value)}
                          >
                            {t.label}
                          </Pill>
                        ))}
                      </div>
                    </FilterGroup>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* View results */}
              <div
                className="px-5 py-5 mt-auto flex-shrink-0"
                style={{ borderTop: "1px solid var(--line-soft)" }}
              >
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full h-10 rounded-full font-mono text-[12px] uppercase tracking-[0.12em] transition-all duration-200 hover:opacity-90"
                  style={{ background: "var(--forest)", color: "var(--paper)" }}
                >
                  View {pagination?.total ?? "…"} safari
                  {pagination?.total !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
