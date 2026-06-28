"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import SimpleMarquee from "@/components/ui/SimpleMarquee";

const logos = [
  {
    src: "/logos/kenya-wildlife-service.png",
    alt: "KWS — Kenya Wildlife Service",
  },
  {
    src: "/logos/eco-tourism-kenya.png",
    alt: "Eco-tourism Kenya",
  },

  {
    src: "/logos/trustpilot.png",
    alt: "Trustpilot",
  },
  {
    src: "/logos/tra.png",
    alt: "TRA",
  },
  {
    src: "/logos/tripadvisor.png",
    alt: "TripAdvisor",
  },
  {
    src: "/logos/SB.png",
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
                <div className="group flex items-center justify-center px-6">
                  <OptimizedImage
                    src={logo.src}
                    alt={logo.alt}
                    width={300}
                    height={64}
                    shimmer={false}
                    className="h-[34px] w-auto object-contain opacity-80 transition-all duration-300 ease-out group-hover:opacity-95 "
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
