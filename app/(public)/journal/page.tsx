import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import PageHero from "@/components/ui/PageHero";
import JournalFilterSidebar from "@/components/journal/JournalFilterSidebar";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import type { JournalPost, PostCategory } from "@/types";

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
  alternates: { canonical: "/journal" },
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

async function getPosts(category?: string): Promise<JournalPost[]> {
  try {
    await connectDB();
    const query: Record<string, unknown> = { published: true };
    if (category) query.category = category;
    const posts = await PostModel.find(query)
      .sort({ publishedAt: -1 })
      .limit(50)
      .select("-body")
      .lean();
    return JSON.parse(JSON.stringify(posts)) as JournalPost[];
  } catch {
    return [];
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

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPosts(category);
  const featured = !category
    ? (posts.find((p) => p.featured) ?? posts[0])
    : null;
  const regularPosts = posts.filter((p) => p._id !== featured?._id);

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
          { num: String(posts.length), sup: "+", lbl: "Articles & guides" },
          { num: "3", sup: "", lbl: "East African countries" },
          { num: "24/7", sup: "", lbl: "Updated from the field" },
        ]}
      />

      {/* ── Featured post ────────────────────────────────────────── */}
      {featured && !category && (
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
                  {featured.author && (
                    <div className="flex items-center gap-3 mb-8">
                      {featured.authorAvatar && (
                        <Image
                          src={featured.authorAvatar}
                          alt={featured.author}
                          width={42}
                          height={42}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="text-[13px] font-medium text-bone-ink">
                          {featured.author}
                        </div>
                        {featured.authorTitle && (
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone-muted">
                            {featured.authorTitle}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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

      {/* ── Posts section: sidebar + grid ───────────────────────── */}
      <section
        className="bg-bone-bg"
        style={{ paddingTop: "60px", paddingBottom: "120px" }}
      >
        <div className="container-site">
          <div className="lg:flex lg:gap-8 2xl:gap-10 lg:items-start">
            {/* Filter sidebar — mobile drawer + desktop panel */}
            <Suspense fallback={null}>
              <JournalFilterSidebar postCount={posts.length} />
            </Suspense>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Result count (desktop) */}
              <div className="hidden lg:block mb-6">
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.1em]"
                  style={{ color: "var(--muted)" }}
                >
                  {posts.length} article{posts.length !== 1 ? "s" : ""}
                  {category &&
                    ` · ${CATEGORY_LABELS[category as PostCategory] ?? category}`}
                </span>
              </div>

              {regularPosts.length > 0 ? (
                <Stagger
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  style={{ gap: "56px 36px" }}
                >
                  {regularPosts.map((post) => (
                    <RevealItem key={post._id} className="flex flex-col">
                      <Link
                        href={`/journal/${post.slug}`}
                        className="group flex flex-col cursor-pointer h-full bg-bone-paper border border-[rgba(23,22,18,0.18)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
                      >
                        <div
                          className="overflow-hidden bg-bone-paper flex-shrink-0"
                          style={{ aspectRatio: "3/2" }}
                        >
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
                              {CATEGORY_LABELS[post.category as PostCategory] ??
                                post.category}
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
                          <p className="text-[14px] leading-[1.6] text-bone-muted">
                            {post.excerpt}
                          </p>
                          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone-forest mt-auto pt-1">
                            Read article →
                          </span>
                        </div>
                      </Link>
                    </RevealItem>
                  ))}
                </Stagger>
              ) : (
                <div className="text-center py-24">
                  <p className="font-serif text-2xl text-bone-ink/50 mb-3">
                    No articles yet in this category.
                  </p>
                  <Link
                    href="/journal"
                    className="text-sm text-bone-clay hover:underline font-sans"
                  >
                    Browse all articles →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ──────────────────────────────────────── */}
      <section
        className="bg-bone-forest text-bone-paper"
        style={{ padding: "96px 0" }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <div>
                <h2
                  className="font-serif font-light leading-none tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(36px, 4.4vw, 60px)",
                    maxWidth: "14ch",
                  }}
                >
                  Ready for your{" "}
                  <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
                    African adventure
                  </em>
                  ?
                </h2>
                <p
                  className="text-sm leading-[1.65] mt-5"
                  style={{ opacity: 0.82, maxWidth: "40ch" }}
                >
                  Our team is on the ground in East Africa every week. Tell us
                  what you want to see and we&apos;ll send a free, personalised
                  itinerary within 24 hours.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3.5 px-6 py-4 rounded-full text-[14px] text-bone-ink transition-all duration-200 hover:-translate-y-0.5 mb-4"
                  style={{ background: "#f4d4a8" }}
                >
                  Plan my safari
                  <span
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] text-white flex-shrink-0"
                    style={{ background: "#9d4519" }}
                  >
                    →
                  </span>
                </Link>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60 mt-4">
                  Free · No obligation · Fast response guaranteed
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
