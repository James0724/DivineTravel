import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";
import JournalContent from "@/components/journal/JournalContent";
import Reveal from "@/components/ui/Reveal";
import type { JournalPost, PostAuthor, PostCategory } from "@/types";
import CtaBand from "@/components/ui/CtaBand";
import { getQueryClient } from "@/lib/queryClient";
import { getPostsList, type PostListFilters } from "@/lib/data/posts";
import { postKeys } from "@/lib/data/queryKeys";

function resolveAuthor(raw: PostAuthor | string | undefined) {
  if (!raw) return { _id: "", name: "", avatar: undefined, title: undefined };
  if (typeof raw === "string")
    return { _id: "", name: raw, avatar: undefined, title: undefined };
  return raw;
}

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Field Journal — Safari Stories, Guides & Tips from East Africa",
  description:
    "Expert safari planning guides, wildlife field reports, destination deep-dives and insider tips from the team at Divine Travel Nest Safaris. Fuel your African adventure.",
  keywords: [
    "safari guides",
    "safari tips",
    "safari planning",
    "wildlife photography",
    "East Africa travel",
    "safari blog",
    "migration guide",
    "safari stories",
    "destination guides Kenya Tanzania Uganda",
    "safari how-to",
  ],
  authors: [{ name: "Divine Travel Nest Safaris" }],
  creator: "Divine Travel Nest Safaris",
  alternates: { canonical: "/en/journal" },
  openGraph: {
    title: "Field Journal | Divine Travel Nest Safaris",
    description: "Expert guides and stories from East Africa.",
    type: "website",
    url: "/journal",
    images: [
      {
        url: "https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Field Journal — Divine Travel Nest Safaris",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Journal | Divine Travel Nest Safaris",
    description: "Expert guides and stories from East Africa.",
    images: [
      "https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80",
    ],
  },
};

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

async function getFeaturedPost(): Promise<JournalPost | null> {
  try {
    await connectDB();
    const post = await PostModel.findOne({ published: true, featured: true })
      .sort({ publishedAt: -1 })
      .populate("author", "name avatar title bio")
      .select("-body")
      .lean();
    const fallback =
      post ??
      (await PostModel.findOne({ published: true })
        .sort({ publishedAt: -1 })
        .populate("author", "name avatar title bio")
        .select("-body")
        .lean());
    return fallback
      ? (JSON.parse(JSON.stringify(fallback)) as JournalPost)
      : null;
  } catch {
    return null;
  }
}

async function getArticleCount(): Promise<number> {
  try {
    await connectDB();
    return await PostModel.countDocuments({ published: true });
  } catch {
    return 0;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const JOURNAL_LIMIT = 9;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function JournalPage({ searchParams }: Props) {
  const sp = await searchParams;
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  // Mirrors the apiFilters built client-side in JournalContent.tsx — the
  // query key must match exactly so the hydrated cache entry below is
  // picked up on mount instead of triggering a redundant client fetch.
  const apiFilters: PostListFilters = {
    category: (get("category") as PostCategory) || undefined,
    search: get("search") || undefined,
    sort: (get("sort") as PostListFilters["sort"]) || "newest",
    page: parseInt(get("page") ?? "1", 10),
    limit: JOURNAL_LIMIT,
  };

  const [featured, articleCount] = await Promise.all([
    getFeaturedPost(),
    getArticleCount(),
  ]);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: postKeys.list(apiFilters),
    queryFn: () => getPostsList(apiFilters),
  });

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Field Journal", href: "/journal" },
        ]}
      />

      <PageHero
        image="https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=1800&q=80"
        imageAlt="Field Journal — stories from East Africa"
        minHeight="min-h-[60vh]"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Field Journal" }]}
        eyebrow="Field Journal"
        title={
          <>
            Stories from{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>the field</em>
            .
          </>
        }
        description="Guides, destination deep-dives, wildlife reports and insider tips from our in-country team across Kenya, Tanzania and Uganda."
        statsDivider
        stats={[
          { num: String(articleCount), sup: "+", lbl: "Articles & guides" },
          { num: "3", sup: "", lbl: "East African countries" },
          { num: "24/7", sup: "", lbl: "Updated from the field" },
        ]}
      />

      <CtaBand
        variant="large"
        buttonHref="/plan-my-safari"
        heading={
          <>
            Build your East Africa{" "}
            <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>safari</em>.
          </>
        }
        description="Tell us your budget, dates, wildlife interests and who's travelling. Our experts choose the best parks, lodges and routes and send a free, no-obligation proposal — usually within half an hour."
        buttonText="Get your free quote"
      />

      {/* ── Featured post ────────────────────────────────────────── */}
      {featured && (
        <section className="bg-bone-bg pb-24 pt-2">
          <div className="container-site">
            <Reveal>
              <Link
                href={`/journal/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-16 items-stretch"
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden bg-bone-paper"
                  style={{ aspectRatio: "5/4" }}
                >
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute top-[22px] left-[22px] font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-2 text-white"
                    style={{ background: "var(--clay, #9d4519)" }}
                  >
                    {CATEGORY_LABELS[featured.category as PostCategory] ??
                      featured.category}
                  </div>
                </div>
                {/* Body */}
                <div className="flex flex-col justify-center py-4">
                  <div className="flex gap-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted mb-6">
                    <span className="text-bone-clay">
                      {CATEGORY_LABELS[featured.category as PostCategory] ??
                        featured.category}
                    </span>
                    <span>·</span>
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span>·</span>
                    <span>{featured.readingTime} min read</span>
                  </div>
                  <h2
                    className="font-serif font-normal leading-[1.02] tracking-[-0.02em] text-bone-ink mb-6"
                    style={{ fontSize: "clamp(32px, 3.8vw, 52px)" }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    className="text-[17px] leading-[1.65] text-bone-muted mb-8"
                    style={{ maxWidth: "46ch" }}
                  >
                    {featured.excerpt}
                  </p>
                  {featured.author &&
                    (() => {
                      const a = resolveAuthor(featured.author);
                      return a.name ? (
                        <div className="flex items-center gap-3 mb-8">
                          {a.avatar && (
                            <Image
                              src={a.avatar}
                              alt={a.name}
                              width={42}
                              height={42}
                              className="rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="text-[13px] font-medium text-bone-ink">
                              {a.name}
                            </div>
                            {a.title && (
                              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted">
                                {a.title}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  <span
                    className="self-start inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-[13px] tracking-[0.02em] text-bone-paper transition-all duration-200 group-hover:-translate-y-0.5"
                    style={{ background: "#2a3a2a" }}
                  >
                    Read article →
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Posts section: filter panel + grid + pagination ────────── */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={null}>
          <JournalContent />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
