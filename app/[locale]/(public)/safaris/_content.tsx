"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSafaris } from "@/hooks/useSafaris";
import PkgCard from "@/components/safaris/PkgCard";
import Pagination from "@/components/ui/Pagination";
import SafariFilterPanel, {
  SafariFilterTrigger,
  DURATIONS,
  countActiveFilters,
  type SafariFilterValues,
} from "@/components/safaris/SafariFilterPanel";

import type { SafariFilters, SafariCategory, SafariDifficulty, SafariStyle } from "@/types";

const LIMIT = 12;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilterState extends SafariFilterValues {
  search: string;
  page: number;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SafarisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>({
    country: searchParams.get("country") ?? "",
    category: (searchParams.get("category") as SafariCategory) ?? "",
    safariType: (searchParams.get("safariType") as SafariStyle) ?? "",
    duration: searchParams.get("duration") ?? "",
    difficulty: (searchParams.get("difficulty") as SafariDifficulty) ?? "",
    tier: (searchParams.get("tier") as FilterState["tier"]) ?? "",
    sort:
      (searchParams.get("sort") as NonNullable<SafariFilters["sort"]>) ??
      "rating",
    search: searchParams.get("search") ?? "",
    page: parseInt(searchParams.get("page") ?? "1", 10),
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  // Declared before `set`/`resetAll` so filter changes can reposition scroll
  // to the top of the results list — without this, shrinking the grid while
  // scrolled down leaves the viewport landing inside the CTA/footer section.
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const scrollToResults = useCallback(() => {
    resultsTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

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

  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.country) p.set("country", filters.country);
    if (filters.category) p.set("category", filters.category);
    if (filters.safariType) p.set("safariType", filters.safariType);
    if (filters.duration) p.set("duration", filters.duration);
    if (filters.difficulty) p.set("difficulty", filters.difficulty);
    if (filters.tier) p.set("tier", filters.tier);
    if (filters.sort && filters.sort !== "rating") p.set("sort", filters.sort);
    if (filters.search) p.set("search", filters.search);
    if (filters.page > 1) p.set("page", String(filters.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  const dur = DURATIONS.find((d) => d.value === filters.duration);

  const apiFilters: SafariFilters = {
    country: filters.country || undefined,
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
            <SafariFilterTrigger
              totalActive={totalActive}
              onClick={() => setMobileOpen(true)}
            />
          </div>

          {/* ── Desktop layout: sidebar + grid ─────────────────────────── */}
          <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start">
            <SafariFilterPanel
              values={filters}
              searchInput={searchInput}
              onSearchInput={handleSearchInput}
              onCountryChange={(v) => set("country", v)}
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

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div
              ref={resultsTopRef}
              className="flex-1 min-w-0"
              style={{ scrollMarginTop: "90px" }}
            >
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
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex flex-col bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded-sm overflow-hidden"
                    >
                      {/* Image placeholder */}
                      <div
                        style={{
                          aspectRatio: "3 / 2",
                          background: "var(--bg-deep)",
                        }}
                      />
                      {/* Body placeholder */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6">
                        <div
                          className="h-4 rounded-full w-1/3 mb-3"
                          style={{ background: "var(--bg-deep)" }}
                        />
                        <div
                          className="h-6 rounded w-full mb-2"
                          style={{ background: "var(--bg-deep)" }}
                        />
                        <div
                          className="h-6 rounded w-3/4 mb-4"
                          style={{ background: "var(--bg-deep)" }}
                        />
                        <div
                          className="h-3 rounded w-2/3 mb-1.5"
                          style={{ background: "var(--bg-deep)" }}
                        />
                        <div
                          className="h-3 rounded w-1/2 mb-5"
                          style={{ background: "var(--bg-deep)" }}
                        />
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          <div
                            className="h-5 rounded w-28"
                            style={{ background: "var(--bg-deep)" }}
                          />
                          <div
                            className="h-5 rounded w-20"
                            style={{ background: "var(--bg-deep)" }}
                          />
                        </div>
                        <div className="mt-auto pt-4 border-t border-[rgba(23,22,18,0.1)] flex items-end justify-between">
                          <div>
                            <div
                              className="h-2 rounded w-8 mb-1"
                              style={{ background: "var(--bg-deep)" }}
                            />
                            <div
                              className="h-7 rounded w-20"
                              style={{ background: "var(--bg-deep)" }}
                            />
                          </div>
                          <div
                            className="h-7 w-7 rounded-full"
                            style={{ background: "var(--bg-deep)" }}
                          />
                        </div>
                      </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
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
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
