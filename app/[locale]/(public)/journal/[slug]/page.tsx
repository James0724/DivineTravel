import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db/mongoose";
import PostModel from "@/lib/db/models/Post";
import {
  BreadcrumbSchema,
  ArticleSchema,
} from "@/components/seo/StructuredData";
import CommentSection from "@/components/journal/CommentSection";
import Reveal, { Stagger, RevealItem } from "@/components/ui/Reveal";
import { buildAbsoluteUrl } from "@/lib/utils";
import type { JournalPost, PostCategory } from "@/types";
import CtaBand from "@/components/ui/CtaBand";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

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

const getPost = cache(async (slug: string): Promise<JournalPost | null> => {
  try {
    await connectDB();
    const post = await PostModel.findOne({ slug, published: true })
      .populate("author", "name avatar title bio")
      .lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post)) as JournalPost;
  } catch {
    return null;
  }
});

async function getRelatedPosts(
  category: string,
  currentSlug: string,
): Promise<JournalPost[]> {
  try {
    await connectDB();
    const posts = await PostModel.find({
      published: true,
      category,
      slug: { $ne: currentSlug },
    })
      .populate("author", "name avatar title bio")
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-body")
      .lean();
    return JSON.parse(JSON.stringify(posts)) as JournalPost[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found" };

  const metaAuthor = resolveAuthor(post.author);
  const title =
    post.seo?.metaTitle ?? `${post.title} | Divine Travel Nest Safaris`;
  const description = post.seo?.metaDescription ?? post.excerpt;

  return {
    title,
    description,
    keywords: post.seo?.keywords?.join(", "),
    authors: [{ name: metaAuthor.name }],
    openGraph: {
      title,
      description,
      type: "article",
      url: `/journal/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [metaAuthor.name],
      tags: post.tags,
      images: [
        { url: post.coverImage, width: 1200, height: 630, alt: post.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.coverImage],
    },
    alternates: { canonical: `/journal/${post.slug}` },
  };
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Normalises author whether it is already a populated object or a legacy string */
function resolveAuthor(raw: import("@/types").PostAuthor | string) {
  if (!raw)
    return {
      _id: "",
      name: "Divine Travel Nest Safaris",
      avatar: undefined,
      title: undefined,
      bio: undefined,
    };
  if (typeof raw === "string")
    return {
      _id: "",
      name: raw,
      avatar: undefined,
      title: undefined,
      bio: undefined,
    };
  return raw;
}

export default async function JournalDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const author = resolveAuthor(post.author);
  const related = await getRelatedPosts(post.category, post.slug);
  const categoryLabel =
    CATEGORY_LABELS[post.category as PostCategory] ?? post.category;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Field Journal", href: "/journal" },
          { name: post.title, href: `/journal/${post.slug}` },
        ]}
      />
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={buildAbsoluteUrl(`/journal/${post.slug}`)}
        image={post.coverImage}
        author={author.name}
        publishedDate={post.publishedAt ?? new Date().toISOString()}
        modifiedDate={
          post.updatedAt ?? post.publishedAt ?? new Date().toISOString()
        }
        category={categoryLabel}
        keywords={post.tags}
        readingTime={post.readingTime}
      />

      {post.faqs && post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="article-hero">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="inner">
          <Link href="/journal" className="back">
            ← Back to the journal
          </Link>
          <div className="a-meta">
            <span className="cat">{categoryLabel}</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h1>{post.title}</h1>
          {author.name && (
            <div className="byline">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={46}
                  height={46}
                  className="av"
                />
              ) : (
                <div
                  className="av flex items-center justify-center font-serif text-lg"
                  style={{ background: "rgba(244,239,226,0.15)" }}
                >
                  {author.name[0]}
                </div>
              )}
              <div className="nm">
                <b>{author.name}</b>
                {author.title && <span>{author.title}</span>}
              </div>
            </div>
          )}
        </div>
      </section>

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

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <section className="article-body">
        <div className="article-col">
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {post.tags.length > 0 && (
            <div className="article-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="t">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-14">
              <h2
                className="font-serif font-normal tracking-[-0.02em] text-bone-ink mb-6"
                style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
              >
                Frequently asked questions
              </h2>
              <div className="space-y-2">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group border border-[rgba(31,29,24,0.14)] rounded-sm overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none font-sans text-sm font-medium text-bone-ink hover:bg-[rgba(31,29,24,0.03)] transition-colors">
                      <span>{faq.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="flex-shrink-0 text-bone-clay transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 pt-1">
                      <p className="font-sans text-[14px] leading-[1.7] text-bone-muted">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Author card */}
        <div className="author-card-article">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={76}
              height={76}
              className="av"
            />
          ) : (
            <div
              className="av flex items-center justify-center font-serif text-2xl text-bone-forest"
              style={{ background: "rgba(42,58,42,0.1)" }}
            >
              {author.name[0]}
            </div>
          )}
          <div>
            <div className="role">{author.title ?? "Safari Expert"}</div>
            <h4>{author.name}</h4>
            <p>
              {author.bio ??
                "Expert safari consultant at Divine Travel Nest Safaris, with extensive on-the-ground experience across Kenya, Tanzania, Rwanda and Uganda."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Comments ─────────────────────────────────────────────────────────── */}
      <CommentSection postSlug={post.slug} />

      {/* ── Related posts ────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          className="bg-bone-paper"
          style={{
            borderTop: "1px solid rgba(31,29,24,0.14)",
            padding: "96px 0",
          }}
        >
          <div className="container-site">
            <Reveal>
              <div className="section-hd" style={{ marginBottom: "48px" }}>
                <div>
                  <div className="eyebrow mb-4">
                    <span className="dot" />
                    More from the journal
                  </div>
                  <h2
                    className="font-serif font-normal leading-none tracking-[-0.02em] text-bone-ink mt-3"
                    style={{ fontSize: "clamp(32px, 3.5vw, 48px)" }}
                  >
                    Keep <em className="italic text-bone-clay">reading</em>.
                  </h2>
                </div>
                <Link
                  href="/journal"
                  className="text-[13px] text-bone-clay hover:underline font-sans self-end"
                >
                  View all articles →
                </Link>
              </div>
            </Reveal>
            <Stagger
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              style={{ gap: "36px" }}
            >
              {related.map((rp) => (
                <RevealItem key={rp._id} className="flex flex-col gap-4">
                  <Link
                    href={`/journal/${rp.slug}`}
                    className="group flex flex-col gap-4 cursor-pointer h-full"
                  >
                    <div
                      className="overflow-hidden"
                      style={{ aspectRatio: "3/2" }}
                    >
                      <Image
                        src={rp.coverImage}
                        alt={rp.title}
                        width={600}
                        height={400}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-bone-muted">
                      <span className="text-bone-clay">
                        {CATEGORY_LABELS[rp.category as PostCategory] ??
                          rp.category}
                      </span>
                      <span>·</span>
                      <span>{rp.readingTime} min read</span>
                    </div>
                    <h3
                      className="font-serif font-normal leading-[1.12] tracking-[-0.01em] text-bone-ink transition-colors group-hover:text-bone-clay"
                      style={{ fontSize: "27px" }}
                    >
                      {rp.title}
                    </h3>
                  </Link>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ── CTA Band ─────────────────────────────────────────────────────────── */}
      <section
        className="bg-bone-forest text-bone-paper"
        style={{ padding: "110px 0" }}
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-end">
            <Reveal>
              <h2
                className="font-serif font-light leading-[0.98] tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(44px, 5.5vw, 84px)",
                  maxWidth: "15ch",
                }}
              >
                Ready to see it
                <br />
                for{" "}
                <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
                  yourself
                </em>
                ?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p
                  className="text-sm leading-[1.7]"
                  style={{ opacity: 0.8, maxWidth: "38ch" }}
                >
                  Every dispatch here is a place we&apos;ll happily take you.
                  Tell us your dates and interests and we&apos;ll build a
                  tailor-made itinerary — free, no obligation, answered by a
                  real person.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3.5 mt-6 px-6 py-4 rounded-full text-[14px] text-bone-ink transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "#f4efe2" }}
                >
                  Plan my safari
                  <span
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] text-white flex-shrink-0"
                    style={{ background: "#9d4519" }}
                  >
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
