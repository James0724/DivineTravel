"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Filter } from "lucide-react";
import type { PostCategory } from "@/types";
import type { PostFilters } from "@/hooks/usePosts";

// ─── Filter constants ────────────────────────────────────────────────────────

export const CATEGORIES: { label: string; value: PostCategory | "" }[] = [
  { label: "All categories", value: "" },
  { label: "Migration", value: "migration" },
  { label: "Destinations", value: "destinations" },
  { label: "Planning", value: "planning" },
  { label: "Wildlife", value: "wildlife" },
  { label: "Culture", value: "culture" },
  { label: "Conservation", value: "conservation" },
  { label: "Photography", value: "photography" },
  { label: "Tips & Practical", value: "tips" },
];

export const SORT_OPTIONS: { label: string; value: NonNullable<PostFilters["sort"]> }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Featured", value: "featured" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JournalFilterValues {
  category: PostCategory | "";
  sort: NonNullable<PostFilters["sort"]>;
}

interface JournalFilterPanelProps {
  values: JournalFilterValues;
  searchInput: string;
  onSearchInput: (val: string) => void;
  onCategoryChange: (value: PostCategory | "") => void;
  onSortChange: (value: NonNullable<PostFilters["sort"]>) => void;
  onReset: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  resultCount?: number;
  stickyTop?: string;
  width?: string;
}

// ─── Pill button — identical to the safaris filter panel's Pill ─────────────

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

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--line-soft)" }}>
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

// ─── Mobile filters trigger button ───────────────────────────────────────────

export function JournalFilterTrigger({
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

export function countActiveFilters(values: JournalFilterValues, search: string) {
  const total = [values.category, search].filter(Boolean).length;
  return { total };
}

// ─── Main panel (desktop sidebar + mobile drawer) ────────────────────────────

export default function JournalFilterPanel({
  values,
  searchInput,
  onSearchInput,
  onCategoryChange,
  onSortChange,
  onReset,
  mobileOpen,
  onMobileClose,
  resultCount,
  stickyTop = "90px",
  width = "364px",
}: JournalFilterPanelProps) {
  const { total: totalActive } = countActiveFilters(values, searchInput);

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
          placeholder="Title, keywords…"
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
          className="w-full h-8 pl-8 pr-3 font-sans text-[12px] border rounded-full focus:outline-none focus:border-[var(--forest)] transition-colors"
          style={{ background: "var(--bg)", borderColor: "var(--line)", color: "var(--ink)" }}
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

  const categoryBlock = (
    <FilterGroup label="Category">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <Pill key={c.value} active={values.category === c.value} onClick={() => onCategoryChange(c.value)}>
            {c.label}
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
          onChange={(e) => onSortChange(e.target.value as NonNullable<PostFilters["sort"]>)}
          className="w-full h-8 pl-3 pr-8 font-mono text-[11px] tracking-[0.06em] border rounded-sm appearance-none cursor-pointer focus:outline-none transition-colors"
          style={{ background: "var(--bg)", borderColor: "var(--line)", color: "var(--muted)" }}
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

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:block flex-shrink-0 sticky" style={{ top: stickyTop, width }}>
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
                  style={{ background: "var(--clay)", color: "var(--paper)" }}
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
          {categoryBlock}
          {sortBlock}
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
                      style={{ background: "var(--clay)", color: "var(--paper)" }}
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
              {categoryBlock}
              {sortBlock}

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
                  View {resultCount ?? "…"} article{resultCount !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
