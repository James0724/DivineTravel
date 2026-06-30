"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown, Filter } from "lucide-react";
import { DURATIONS } from "@/lib/data/safariFilterOptions";
import { useDestinations } from "@/hooks/useDestinations";
import { useFloatingDropdown } from "@/hooks/useFloatingDropdown";
import type {
  SafariFilters,
  SafariCategory,
  SafariDifficulty,
  SafariStyle,
  PriceTier,
} from "@/types";

export { DURATIONS };

// ─── Filter constants (shared across safaris listing + booking pages) ────────

export const COUNTRIES = [
  { label: "All countries", value: "" },
  { label: "Kenya", value: "Kenya" },
  { label: "Tanzania", value: "Tanzania" },
  { label: "Uganda", value: "Uganda" },
  { label: "Rwanda", value: "Rwanda" },
  { label: "Cross-border", value: "cross" },
];

export const CATEGORIES: { label: string; value: SafariCategory | "" }[] = [
  { label: "All types", value: "" },
  { label: "Wildlife", value: "wildlife" },
  { label: "Adventure", value: "adventure" },
  { label: "Cultural", value: "cultural" },
  { label: "Gorilla", value: "gorilla" },
  { label: "Beach", value: "beach" },
  { label: "Mountain", value: "mountain" },
];

export const ACTIVITY_TYPES: { label: string; value: SafariStyle | "" }[] = [
  { label: "All activities", value: "" },
  { label: "Walking", value: "walking" },
  { label: "Photographic", value: "photographic" },
  { label: "Water-based", value: "water-based" },
  { label: "Night", value: "night" },
  { label: "Birding", value: "birding" },
  { label: "Game-drive", value: "game-drive" },
  { label: "Fly-in", value: "fly-in" },
  { label: "Mobile/Camping", value: "mobile-camping" },
  { label: "Horseback", value: "horseback" },
  { label: "Balloon", value: "balloon" },
  { label: "Self-drive", value: "self-drive" },
  { label: "Conservation", value: "conservation" },
  { label: "Wellness", value: "wellness" },
];

export const TRAVELLER_TYPES: { label: string; value: SafariStyle | "" }[] = [
  { label: "All travellers", value: "" },
  { label: "Family", value: "family" },
  { label: "Honeymoon", value: "honeymoon" },
  { label: "Couple's", value: "couples" },
  { label: "Solo", value: "solo" },
  { label: "Small group", value: "small-group" },
  { label: "Private", value: "private" },
];

export const THEME_TYPES: { label: string; value: SafariStyle | "" }[] = [
  { label: "All collections", value: "" },
  { label: "Gorilla Trekking", value: "gorilla-trekking" },
  { label: "Big Five", value: "big-five" },
  { label: "Great Migration", value: "great-migration" },
  { label: "Luxury Safaris", value: "luxury" },
  { label: "Beach & Bush", value: "beach-and-bush" },
];

// Combined list — used for label lookups (e.g. PkgCard badges) where the
// activity/traveller/theme split doesn't matter, just the value → label mapping.
export const SAFARI_TYPES: { label: string; value: SafariStyle | "" }[] = [
  ...ACTIVITY_TYPES.filter((t) => t.value),
  ...TRAVELLER_TYPES.filter((t) => t.value),
  ...THEME_TYPES.filter((t) => t.value),
];

// The 9 safari types from the /safari-types content pages (see
// lib/data/safariTypes.ts) — a coarser, marketing-facing taxonomy than the
// 24-value `SafariStyle` enum above. Each maps onto whichever existing field
// (`category` or `safariType`) already carries the closest matching value,
// rather than introducing a new schema field. "Birdwatching" maps to the
// closest `safariType` value "birding", and "Budget & Group" maps to
// "small-group" since there's no dedicated budget/group safariType value.
type SafariTypeFilterDef =
  | { slug: string; label: string; field: "category"; value: SafariCategory }
  | { slug: string; label: string; field: "safariType"; value: SafariStyle };

export const SAFARI_TYPE_FILTERS: SafariTypeFilterDef[] = [
  { slug: "wildlife-game-viewing", label: "Wildlife & Game Viewing", field: "category", value: "wildlife" },
  { slug: "walking", label: "Walking", field: "safariType", value: "walking" },
  { slug: "cultural", label: "Cultural", field: "category", value: "cultural" },
  { slug: "adventure", label: "Adventure", field: "category", value: "adventure" },
  { slug: "photographic", label: "Photographic", field: "safariType", value: "photographic" },
  { slug: "birdwatching", label: "Birdwatching", field: "safariType", value: "birding" },
  { slug: "fly-in", label: "Fly-in", field: "safariType", value: "fly-in" },
  { slug: "family", label: "Family", field: "safariType", value: "family" },
  { slug: "budget-group", label: "Budget & Group", field: "safariType", value: "small-group" },
];

export const DIFFICULTIES: { label: string; value: SafariDifficulty | "" }[] = [
  { label: "Any", value: "" },
  { label: "Easy", value: "easy" },
  { label: "Moderate", value: "moderate" },
  { label: "Challenging", value: "challenging" },
];

export const TIERS: { label: string; value: PriceTier | "" }[] = [
  { label: "All tiers", value: "" },
  { label: "Budget", value: "budget" },
  { label: "Mid-range", value: "midRange" },
  { label: "Luxury", value: "luxury" },
];

export const SORT_OPTIONS: {
  label: string;
  value: NonNullable<SafariFilters["sort"]>;
}[] = [
  { label: "Featured", value: "rating" },
  { label: "Newest", value: "newest" },
  { label: "Price: low → high", value: "price_asc" },
  { label: "Price: high → low", value: "price_desc" },
  { label: "Shortest first", value: "duration_asc" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SafariFilterValues {
  country: string;
  destination: string;
  category: SafariCategory | "";
  safariType: SafariStyle | "";
  duration: string;
  difficulty: SafariDifficulty | "";
  tier: PriceTier | "";
  sort: NonNullable<SafariFilters["sort"]>;
}

interface SafariFilterPanelProps {
  values: SafariFilterValues;
  searchInput: string;
  onSearchInput: (val: string) => void;
  onCountryChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onCategoryChange: (value: SafariCategory | "") => void;
  onSafariTypeChange: (value: SafariStyle | "") => void;
  onDurationChange: (value: string) => void;
  onDifficultyChange: (value: SafariDifficulty | "") => void;
  onTierChange: (value: PriceTier | "") => void;
  onSortChange: (value: NonNullable<SafariFilters["sort"]>) => void;
  onReset: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  resultCount?: number;
  stickyTop?: string;
  width?: string;
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

// ─── Destination dropdown — custom (not a native <select>) so we can force
// the panel to always open downward via useFloatingDropdown, the same
// trigger+portal pattern LanguageSwitcher/CurrencySwitcher use. ────────────

function DestinationDropdown({
  value,
  onChange,
  destinationsByCountry,
}: {
  value: string;
  onChange: (value: string) => void;
  destinationsByCountry: [string, { slug: string; name: string }[]][];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const coords = useFloatingDropdown(open, triggerRef, "down", 280);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return destinationsByCountry;
    return destinationsByCountry
      .map(
        ([country, list]) =>
          [country, list.filter((d) => d.name.toLowerCase().includes(q))] as [
            string,
            typeof list,
          ],
      )
      .filter(([, list]) => list.length > 0);
  }, [query, destinationsByCountry]);

  const selectedLabel =
    destinationsByCountry
      .flatMap(([, list]) => list)
      .find((d) => d.name === value)?.name ?? "All destinations";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-8 pl-3 pr-8 font-mono text-[11px] tracking-[0.06em] border rounded-sm flex items-center justify-between text-left transition-colors relative"
        style={{
          background: "var(--bg)",
          borderColor: "var(--line)",
          color: value ? "var(--ink)" : "var(--muted)",
        }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={11}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--muted)" }}
        />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && coords && (
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  position: "fixed",
                  left: coords.left,
                  width: coords.width,
                  top: coords.top,
                  bottom: coords.bottom,
                  background: "var(--paper)",
                  borderColor: "var(--line)",
                }}
                className="z-[300] border rounded-sm shadow-lg overflow-hidden"
              >
                <div
                  className="p-2 border-b"
                  style={{ borderColor: "var(--line-soft)" }}
                >
                  <div className="relative">
                    <Search
                      size={11}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "var(--muted)" }}
                    />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search destinations…"
                      className="w-full h-7 pl-7 pr-2 font-sans text-[11px] border rounded-sm focus:outline-none focus:border-[var(--forest)] transition-colors"
                      style={{
                        background: "var(--paper)",
                        borderColor: "var(--line)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-sm text-[11px] font-mono tracking-[0.04em] transition-colors"
                    style={{
                      background: value === "" ? "var(--forest)" : "transparent",
                      color: value === "" ? "var(--paper)" : "var(--ink)",
                    }}
                  >
                    All destinations
                  </button>

                  {filtered.length === 0 ? (
                    <p
                      className="px-2.5 py-4 text-center text-[11px] font-sans"
                      style={{ color: "var(--muted)" }}
                    >
                      No matches
                    </p>
                  ) : (
                    filtered.map(([country, destinations]) => (
                      <div key={country} className="mt-1.5 first:mt-0">
                        <div
                          className="px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]"
                          style={{ color: "var(--muted)" }}
                        >
                          {country}
                        </div>
                        {destinations.map((d) => (
                          <button
                            key={d.slug}
                            type="button"
                            onClick={() => {
                              onChange(d.name);
                              setOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-sm text-[11px] font-mono tracking-[0.04em] transition-colors"
                            style={{
                              background:
                                value === d.name ? "var(--forest)" : "transparent",
                              color: value === d.name ? "var(--paper)" : "var(--ink)",
                            }}
                          >
                            {d.name}
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

// ─── Mobile filters trigger button ───────────────────────────────────────────

export function SafariFilterTrigger({
  totalActive,
  onClick,
}: {
  totalActive: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
  );
}

// ─── Helper to count active filters ──────────────────────────────────────────

export function countActiveFilters(
  values: SafariFilterValues,
  search: string,
) {
  const advanced = [values.difficulty, values.tier].filter(Boolean).length;
  const total = [
    values.country,
    values.destination,
    values.category,
    values.safariType,
    values.duration,
    values.difficulty,
    values.tier,
    search,
  ].filter(Boolean).length;
  return { advanced, total };
}

// ─── Main panel (desktop sidebar + mobile drawer) ────────────────────────────

export default function SafariFilterPanel({
  values,
  searchInput,
  onSearchInput,
  onCountryChange,
  onDestinationChange,
  onCategoryChange,
  onSafariTypeChange,
  onDurationChange,
  onDifficultyChange,
  onTierChange,
  onSortChange,
  onReset,
  mobileOpen,
  onMobileClose,
  resultCount,
  stickyTop = "90px",
  width = "364px",
}: SafariFilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(
    !!(values.difficulty || values.tier),
  );

  const { data: destinationsData } = useDestinations();
  const destinationsByCountry = useMemo(() => {
    const groups = new Map<string, { slug: string; name: string }[]>();
    for (const d of destinationsData?.data ?? []) {
      const list = groups.get(d.location.country);
      const entry = { slug: d.slug, name: d.name };
      if (list) list.push(entry);
      else groups.set(d.location.country, [entry]);
    }
    for (const list of groups.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [destinationsData]);

  const { advanced: advancedActive, total: totalActive } = countActiveFilters(
    values,
    searchInput,
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) onMobileClose();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onMobileClose]);

  const searchBlock = (
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
          onChange={(e) => onSearchInput(e.target.value)}
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
            onClick={() => onSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-[var(--clay)]"
            style={{ color: "var(--muted)" }}
            aria-label="Clear search"
          >
            <X size={11} />
          </button>
        )}
      </div>
    </FilterGroup>
  );

  const countryBlock = (
    <FilterGroup label="Country">
      <div className="flex flex-wrap gap-1.5">
        {COUNTRIES.map((c) => (
          <Pill
            key={c.value}
            active={values.country === c.value}
            onClick={() => onCountryChange(c.value)}
          >
            {c.label}
          </Pill>
        ))}
      </div>
    </FilterGroup>
  );

  const destinationBlock = (
    <FilterGroup label="Destination">
      <DestinationDropdown
        value={values.destination}
        onChange={onDestinationChange}
        destinationsByCountry={destinationsByCountry}
      />
    </FilterGroup>
  );

  const typeBlock = (
    <FilterGroup label="Category">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <Pill
            key={c.value}
            active={values.category === c.value}
            onClick={() => onCategoryChange(c.value)}
          >
            {c.label}
          </Pill>
        ))}
      </div>
    </FilterGroup>
  );

  const safariTypeBlock = (
    <FilterGroup label="Safari Type">
      <div className="flex flex-wrap gap-1.5">
        <Pill
          active={
            !SAFARI_TYPE_FILTERS.some((t) =>
              t.field === "category"
                ? values.category === t.value
                : values.safariType === t.value,
            )
          }
          onClick={() => {
            for (const t of SAFARI_TYPE_FILTERS) {
              if (t.field === "category" && values.category === t.value) {
                onCategoryChange("");
              }
              if (t.field === "safariType" && values.safariType === t.value) {
                onSafariTypeChange("");
              }
            }
          }}
        >
          Any safari type
        </Pill>
        {SAFARI_TYPE_FILTERS.map((t) => (
          <Pill
            key={t.slug}
            active={
              t.field === "category"
                ? values.category === t.value
                : values.safariType === t.value
            }
            onClick={() =>
              t.field === "category"
                ? onCategoryChange(t.value)
                : onSafariTypeChange(t.value)
            }
          >
            {t.label}
          </Pill>
        ))}
      </div>
    </FilterGroup>
  );

  const lengthBlock = (
    <FilterGroup label="Length">
      <div className="flex flex-wrap gap-1.5">
        {DURATIONS.map((d) => (
          <Pill
            key={d.value}
            active={values.duration === d.value}
            onClick={() => onDurationChange(d.value)}
          >
            {d.label}
          </Pill>
        ))}
      </div>
    </FilterGroup>
  );

  const sortBlock = (
    <FilterGroup label="Sort by">
      <div className="relative">
        <select
          value={values.sort}
          onChange={(e) =>
            onSortChange(
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
  );

  const moreFiltersToggle = (
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
  );

  const advancedBlock = (
    <>
      <FilterGroup label="Difficulty">
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((d) => (
            <Pill
              key={d.value}
              active={values.difficulty === d.value}
              onClick={() => onDifficultyChange(d.value)}
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
              active={values.tier === t.value}
              onClick={() => onTierChange(t.value)}
            >
              {t.label}
            </Pill>
          ))}
        </div>
      </FilterGroup>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:block flex-shrink-0 sticky"
        style={{ top: stickyTop, width }}
      >
        <div
          className="flex flex-col border rounded-sm"
          style={{
            background: "var(--paper)",
            borderColor: "var(--line)",
            overflowY: "auto",
            maxHeight: `calc(100vh - ${stickyTop} - 24px)`,
          }}
        >
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
                onClick={onReset}
                className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
                style={{ color: "var(--clay)" }}
              >
                <X size={9} /> Clear
              </button>
            )}
          </div>

          {searchBlock}
          {countryBlock}
          {destinationBlock}
          {typeBlock}
          {safariTypeBlock}
          {lengthBlock}
          {sortBlock}
          {moreFiltersToggle}
          {showAdvanced && advancedBlock}
        </div>
      </aside>

      {/* ── Mobile: slide-in filter drawer ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.45)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onMobileClose}
            />

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
                      onClick={onReset}
                      className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-opacity hover:opacity-70"
                      style={{ color: "var(--clay)" }}
                    >
                      <X size={9} /> Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onMobileClose}
                    className="transition-colors hover:text-[var(--clay)]"
                    style={{ color: "var(--muted)" }}
                    aria-label="Close filters"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {searchBlock}
              {countryBlock}
              {destinationBlock}
              {typeBlock}
              {safariTypeBlock}
              {lengthBlock}
              {sortBlock}
              {moreFiltersToggle}

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    {advancedBlock}
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className="px-5 py-5 mt-auto flex-shrink-0"
                style={{ borderTop: "1px solid var(--line-soft)" }}
              >
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="w-full h-10 rounded-full font-mono text-[12px] uppercase tracking-[0.12em] transition-all duration-200 hover:opacity-90"
                  style={{ background: "var(--forest)", color: "var(--paper)" }}
                >
                  View {resultCount ?? "…"} safari
                  {resultCount !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
