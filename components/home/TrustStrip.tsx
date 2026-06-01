"use client";

import Image from "next/image";
import SimpleMarquee from "@/components/ui/SimpleMarquee";

const logos = [
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/KWS.png",
    alt: "KWS — Kenya Wildlife Service",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/Eco-tourism_Kenya.png",
    alt: "Eco-tourism Kenya",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/beyond.png",
    alt: "&Beyond",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/asilia.png",
    alt: "Asilia Africa",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/trustpilot.png",
    alt: "Trustpilot",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/tra-300x70.png",
    alt: "TRA",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/tripadvisor.png",
    alt: "TripAdvisor",
  },
  {
    src: "https://divinetravelnestsafaris.com/wp-content/uploads/2025/07/safari-bookings.png",
    alt: "SafariBookings",
  },
];

/* Dot separator between logos */
function Dot() {
  return (
    <span
      aria-hidden="true"
      className="w-1 h-1 rounded-full bg-bone-clay/40 flex-shrink-0 mx-2"
    />
  );
}

export default function TrustStrip() {
  return (
    <section
      className="bg-bone-paper border-b overflow-hidden"
      style={{ borderColor: "rgba(23,22,18,0.12)" }}
    >
      {/* ── Marquee ── */}
      {/* Gradient masks left + right edges */}
      <div className="relative py-2">
        <div
          className="absolute inset-y-0 left-0 z-10 w-[20%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #f4efe2 0%, rgba(244,239,226,0) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 z-10 w-[20%] pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, #f4efe2 0%, rgba(244,239,226,0) 100%)",
          }}
        />

        <SimpleMarquee
          direction="left"
          baseVelocity={3}
          slowdownOnHover
          slowDownFactor={0.04}
          repeat={6}
          className="items-center"
        >
          {/* One set of logos with dot separators */}
          <div className="flex items-center gap-0 px-6 select-none">
            {logos.map((logo, i) => (
              <div key={logo.alt} className="flex items-center">
                <div className="group flex items-center justify-center px-5">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={96}
                    height={40}
                    className="h-[34px] w-auto max-w-[96px] object-contain opacity-80 transition-all duration-300 ease-out group-hover:opacity-95 "
                  />
                </div>
                {/* Separator dot — skip after last */}
                {i < logos.length - 1 && <Dot />}
              </div>
            ))}
          </div>
        </SimpleMarquee>
      </div>
    </section>
  );
}
