"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { usePosts, type PostFilters } from "@/hooks/usePosts";
import Pagination from "@/components/ui/Pagination";
import { Stagger, RevealItem } from "@/components/ui/Reveal";
import JournalFilterPanel, {
  JournalFilterTrigger,
  countActiveFilters,
  type JournalFilterValues,
} from "@/components/journal/JournalFilterPanel";
import type { PostCategory } from "@/types";

const LIMIT = 9;

const CATEGORY_LABELS: Record<PostCategory, string> = {
  migration: "Migration",
  destinations: "Destinations",
  planning: "Planning",
  wildlife: "Wildlife",
  culture: "Culture",
  conservation: "Conservation",
  photography: "Photography",
  tips: "Tips & Practical",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface FilterState extends JournalFilterValues {
  search: string;
  page: number;
}

export default function JournalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>({
    category: (searchParams.get("category") as PostCategory) ?? "",
    sort: (searchParams.get("sort") as NonNullable<PostFilters["sort"]>) ?? "newest",
    search: searchParams.get("search") ?? "",
    page: parseInt(searchParams.get("page") ?? "1", 10),
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Declared before `set`/`resetAll` so filter changes can reposition scroll
  // to the top of the results list — without this, shrinking the grid while
  // scrolled down leaves the viewport landing inside the footer/CTA section.
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const scrollToResults = useCallback(() => {
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    setFilters({ category: "", sort: "newest", search: "", page: 1 });
    setSearchInput("");
  }, [scrollToResults]);

  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => set("search", val), 380);
  };

  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.category) p.set("category", filters.category);
    if (filters.sort && filters.sort !== "newest") p.set("sort", filters.sort);
    if (filters.search) p.set("search", filters.search);
    if (filters.page > 1) p.set("page", String(filters.page));
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  const apiFilters: PostFilters = {
    category: filters.category || undefined,
    search: filters.search || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: LIMIT,
  };

  const { data, isLoading, isError } = usePosts(apiFilters);
  const posts = data?.data ?? [];
  const pagination = data?.pagination;

  const { total: totalActive } = countActiveFilters(filters, filters.search);

  const handlePageChange = useCallback(
    (p: number) => {
      set("page", p);
    },
    [set],
  );

  return (
    <section className="bg-bone-bg" style={{ paddingTop: "60px", paddingBottom: "120px" }}>
      <div className="container-site">
        {/* ── Mobile: result count + filter trigger (< lg) ─────────────── */}
        <div
          className="lg:hidden sticky z-20 flex items-center justify-end py-3 mb-3 -mx-4 px-4 sm:-mx-6 sm:px-6"
          style={{ top: "50px" }}
        >
          <JournalFilterTrigger totalActive={totalActive} onClick={() => setMobileOpen(true)} />
        </div>

        <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start">
          <JournalFilterPanel
            values={filters}
            searchInput={searchInput}
            onSearchInput={handleSearchInput}
            onCategoryChange={(v) => set("category", v)}
            onSortChange={(v) => set("sort", v)}
            onReset={resetAll}
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
            resultCount={pagination?.total}
          />

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div ref={resultsTopRef} className="flex-1 min-w-0" style={{ scrollMarginTop: "90px" }}>
            {pagination && (
              <div className="hidden lg:block mb-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
                  {pagination.total} article{pagination.total !== 1 ? "s" : ""}
                  {filters.category && ` · ${CATEGORY_LABELS[filters.category as PostCategory] ?? filters.category}`}
                </span>
              </div>
            )}

            {isError ? (
              <div className="text-center py-20">
                <p className="font-serif font-normal mb-3" style={{ fontSize: "32px", color: "var(--ink)" }}>
                  Something went wrong
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Failed to load articles. Please refresh the page.
                </p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: "56px 36px" }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col">
                    <div style={{ aspectRatio: "3/2", background: "var(--bg-deep)" }} />
                    <div className="flex flex-col gap-3 pt-4">
                      <div className="h-3 rounded w-1/3" style={{ background: "var(--bg-deep)" }} />
                      <div className="h-6 rounded w-full" style={{ background: "var(--bg-deep)" }} />
                      <div className="h-4 rounded w-3/4" style={{ background: "var(--bg-deep)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-serif text-2xl text-bone-ink/50 mb-3">
                  No articles found.
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-7 py-3 border rounded-full font-mono text-[12px] uppercase tracking-[0.12em] transition-all duration-200 hover:bg-[var(--forest)] hover:text-[var(--paper)] hover:border-[var(--forest)]"
                  style={{ borderColor: "var(--forest)", color: "var(--forest)" }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <Stagger
                  key={posts.map((p) => p._id).join(",")}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  style={{ gap: "56px 36px" }}
                >
                  {posts.map((post) => (
                    <RevealItem key={post._id} className="flex flex-col">
                      <Link
                        href={`/journal/${post.slug}`}
                        className="group flex flex-col cursor-pointer h-full bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
                      >
                        <div className="overflow-hidden bg-bone-paper flex-shrink-0" style={{ aspectRatio: "3/2" }}>
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={600}
                            height={400}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
                          />
                        </div>
                        <div className="flex flex-col flex-1 gap-4 p-5">
                          <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                            <span className="text-bone-clay">
                              {CATEGORY_LABELS[post.category as PostCategory] ?? post.category}
                            </span>
                            <span>·</span>
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          <h3
                            className="font-serif font-normal leading-[1.12] tracking-[-0.01em] text-bone-ink transition-colors duration-200 group-hover:text-bone-clay"
                            style={{ fontSize: "27px" }}
                          >
                            {post.title}
                          </h3>
                          <p className="text-[14px] leading-[1.6] text-bone-muted">{post.excerpt}</p>
                          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone-forest mt-auto pt-1">
                            Read article →
                          </span>
                        </div>
                      </Link>
                    </RevealItem>
                  ))}
                </Stagger>

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
  );
}
