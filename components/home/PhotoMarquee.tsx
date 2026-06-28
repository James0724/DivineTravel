"use client";

import { useTranslations } from "next-intl";
import OptimizedImage from "../ui/OptimizedImage";
import SimpleMarquee from "../ui/SimpleMarquee";

const PHOTO_META = [
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782554015/Gallarey/lion_couple_tjrd7r.jpg",
    label: "14 · 05 · MARA",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782554025/Gallarey/flamingoes_migrvn.jpg",
    label: "10 · 05 · NAKURU",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1780315922/web_images/safaripackages/tweds3citfvmp6xzv1qu.jpg",
    label: "08 · 05 · BWINDI",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782554022/Gallarey/zebras_ect4nq.jpg",
    label: "06 · 05 · SERENGETI",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782554014/Gallarey/IMG_2874.jpg_mnp4vn.jpg",
    label: "04 · 05 · CAMP",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782554016/Gallarey/randy-fath-sunset_dv4bhb.jpg",
    label: "02 · 05 · TARANGIRE",
  },
  {
    src: "https://res.cloudinary.com/dk2j3k15k/image/upload/v1782554019/Gallarey/sunset_t4pkak.jpg",
    label: "10 · 05 · AMBOSELI",
  },
];

export default function SafariMarquee() {
  const t = useTranslations("home.photoMarquee");
  const captions = t.raw("items") as { caption: string }[];
  const photos = PHOTO_META.map((p, i) => ({
    ...p,
    caption: captions[i].caption,
  }));

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
            <OptimizedImage
              src={photo.src}
              alt={photo.caption}
              fill
              draggable={false}
              sizes="480px"
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
