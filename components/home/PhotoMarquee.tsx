"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import SimpleMarquee from "../ui/SimpleMarquee";

const PHOTO_META = [
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/606377387_1291064929726781_5444803271117951649_n.jpg",
    label: "14 · 05 · MARA",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/11/caption-29.jpg",
    label: "10 · 05 · NAKURU",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/experience-the-beauty-1.jpg",
    label: "08 · 05 · BWINDI",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/608128647_1288085906691350_7632202921800311470_n.jpg",
    label: "06 · 05 · SERENGETI",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/mflurmaldtx9khlfz99m-scaled.jpg",
    label: "04 · 05 · CAMP",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2026/01/606447687_1288087563357851_2335028930509111799_n.jpg",
    label: "02 · 05 · TARANGIRE",
  },
];

export default function SafariMarquee() {
  const t = useTranslations("home.photoMarquee");
  const captions = t.raw("items") as { caption: string }[];
  const photos = PHOTO_META.map((p, i) => ({ ...p, caption: captions[i].caption }));

  return (
    <section className="relative overflow-hidden">
      <SimpleMarquee
        baseVelocity={3}
        repeat={2}
        slowdownOnHover
        className="gap-0"
      >
        {photos.map((photo, i) => (
          <article
            key={i}
            className="group relative h-[clamp(220px,25vw,320px)] w-[clamp(320px,40vw,480px)]  shrink-0 overflow-hidden border-r border-[var(--line-soft)]"
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              draggable={false}
              loading="lazy"
              sizes="480px"
              quality={75}
              className="object-cover transition-all duration-500 ease-out [filter:contrast(1.05)_saturate(0.9)_brightness(0.85)] group-hover:[filter:contrast(1.05)_saturate(1)_brightness(1)]"
            />

            {/* caption */}
            <div className="absolute bottom-5 left-5 z-[2] font-mono text-[10px] uppercase tracking-[0.18em] text-bone-paper/90">
              <b className="mb-[2px] block font-medium text-[#f4d4a8]">
                {photo.label}
              </b>
              <span>{photo.caption}</span>
            </div>
          </article>
        ))}
      </SimpleMarquee>
    </section>
  );
}
