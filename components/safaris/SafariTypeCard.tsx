import OptimizedImage from "@/components/ui/OptimizedImage";
import { Link } from "@/i18n/navigation";
import type { SafariTypeConfig } from "@/lib/data/safariTypes";

const GROUP_LABEL: Record<SafariTypeConfig["group"], string> = {
  activity: "Activity",
  traveller: "Traveller",
  theme: "Collection",
};

export default function SafariTypeCard({
  type,
  exploreLabel,
  priority,
}: {
  type: SafariTypeConfig;
  exploreLabel: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/safari-types/${type.slug}`}
      className="group flex flex-col h-full w-full bg-bone-paper border border-[rgba(23,22,18,0.22)] rounded-sm overflow-hidden transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "3/2" }}
      >
        <OptimizedImage
          src={type.heroImage}
          alt={type.heroImageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,22,18,0.35)] via-transparent to-transparent" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] tracking-[0.1em] bg-bone-bg text-bone-muted border border-[rgba(23,22,18,0.12)]">
            {GROUP_LABEL[type.group]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[20px] sm:text-[22px] font-normal leading-[1.2] text-bone-ink mb-3 tracking-[-0.01em]">
          {type.label}
        </h3>

        {/* Description */}
        <p className="text-[13px] sm:text-[14px] leading-[1.65] text-bone-muted mb-5 line-clamp-3 flex-1">
          {type.cardDescription}
        </p>

        {/* Footer — pushed to bottom */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[rgba(23,22,18,0.1)]">
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-bone-muted">
            {exploreLabel}
          </span>
          <span className="w-7 h-7 rounded-full bg-bone-forest text-bone-paper flex items-center justify-center text-[12px] flex-shrink-0 transition-colors duration-200 group-hover:bg-bone-clay">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
