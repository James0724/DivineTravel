import { Fragment } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export interface HeroStat {
  num: string;
  lbl: string;
  sup: string;
}
export interface HeroBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  image: string;
  imageAlt: string;
  breadcrumbs: HeroBreadcrumb[];
  title: React.ReactNode;
  description: string;
  stats?: HeroStat[];
  /** Eyebrow label shown above the h1 */
  eyebrow?: string;
  /** Extra content (buttons etc.) rendered below the description */
  actions?: React.ReactNode;
  /** Override the min-height; defaults to 'min-h-[52vh]' */
  minHeight?: string;
  /** Image opacity override (0–1); defaults to 1 */
  imageOpacity?: number;
  /** Add a top border + padding above the stats row */
  statsDivider?: boolean;
}

export default function PageHero({
  image,
  imageAlt,
  breadcrumbs,
  title,
  description,
  stats,
  eyebrow,
  actions,
  minHeight = "min-h-[52vh]",
  imageOpacity,
  statsDivider,
}: PageHeroProps) {
  return (
    <section
      className={`relative ${minHeight} flex items-end bg-bone-forest overflow-hidden`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={
          imageOpacity !== undefined ? { opacity: imageOpacity } : undefined
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bone-ink/85 via-bone-ink/40 to-bone-ink/20" />
      <div className="relative container-site pb-16 pt-32 sm:pb-20 sm:pt-48">
        <nav
          className="flex items-center gap-2 text-xs text-bone-paper/85 font-sans mb-5"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }}
        >
          {breadcrumbs.map((bc, i) => (
            <Fragment key={bc.label}>
              {i > 0 && <ChevronRight size={12} className="opacity-70" />}
              {bc.href ? (
                <Link
                  href={bc.href}
                  className="hover:text-bone-paper transition-colors"
                >
                  {bc.label}
                </Link>
              ) : (
                <span className="text-bone-paper">{bc.label}</span>
              )}
            </Fragment>
          ))}
        </nav>

        {eyebrow && (
          <div
            className="eyebrow mb-5"
            style={{
              color: "rgba(244,239,226,0.92)",
              textShadow: "0 1px 4px rgba(0,0,0,0.55)",
            }}
          >
            <span className="dot" />
            {eyebrow}
          </div>
        )}

        <h1
          className="font-serif font-light leading-[0.95] tracking-[-0.03em] text-bone-paper text-balance mb-5"
          style={{ fontSize: "clamp(42px, 6.5vw, 96px)" }}
        >
          {title}
        </h1>
        <p className="hidden md text-bone-paper/70 text-sm max-w-2xl leading-relaxed mb-8">
          {description}
        </p>

        {actions}

        {stats && (
          <>
            <div className="hidden md:flex items-end justify-end gap-6 lg:gap-9 flex-wrap">
              {stats.map((s) => (
                <div key={s.lbl}>
                  <div
                    className="font-serif leading-none text-bone-paper"
                    style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}
                  >
                    {s.num}
                    {s.sup && (
                      <em style={{ fontStyle: "italic", color: "#f4d4a8" }}>
                        {s.sup}
                      </em>
                    )}
                  </div>
                  <div
                    className="font-mono text-[10px]   text-bone-paper uppercase tracking-[0.16em] mt-1.5"
                    style={{ opacity: 0.72 }}
                  >
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
